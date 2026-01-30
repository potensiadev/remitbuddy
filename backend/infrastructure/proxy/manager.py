"""Proxy manager for handling proxy rotation and load balancing."""

import asyncio
import random
import time
from collections import defaultdict
from dataclasses import dataclass
from typing import Dict, List, Optional

import aiohttp
import structlog

logger = structlog.get_logger(__name__)


@dataclass
class ProxyConfig:
    """Configuration for a single proxy."""

    ip: str
    port: int
    username: Optional[str] = None
    password: Optional[str] = None
    protocol: str = "http"
    max_concurrent: int = 5
    rate_limit_per_minute: int = 30
    is_active: bool = True

    @property
    def url(self) -> str:
        """Get the proxy URL."""
        if self.username and self.password:
            return f"{self.protocol}://{self.username}:{self.password}@{self.ip}:{self.port}"
        return f"{self.protocol}://{self.ip}:{self.port}"


class ProxyManager:
    """Manages proxy pool with load balancing and health checking."""

    def __init__(self):
        self.proxies: List[ProxyConfig] = []
        self.proxy_stats: Dict[str, Dict] = defaultdict(
            lambda: {
                "requests": 0,
                "failures": 0,
                "last_used": 0,
                "blocked_until": 0,
                "concurrent_requests": 0,
            }
        )
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1",
            "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1",
            "Mozilla/5.0 (Android 10; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
        ]

    def add_proxy(self, proxy: ProxyConfig) -> None:
        """Add a proxy to the pool."""
        self.proxies.append(proxy)
        logger.info("proxy_added", ip=proxy.ip, port=proxy.port)

    def add_proxy_list(self, proxy_list: List[Dict]) -> None:
        """Add multiple proxies from a list of dictionaries."""
        for proxy_data in proxy_list:
            proxy = ProxyConfig(**proxy_data)
            self.add_proxy(proxy)

    def get_random_user_agent(self) -> str:
        """Get a random user agent."""
        return random.choice(self.user_agents)

    def is_proxy_available(self, proxy: ProxyConfig) -> bool:
        """Check if proxy is available for use."""
        current_time = time.time()
        stats = self.proxy_stats[proxy.ip]

        if stats["blocked_until"] > current_time:
            return False

        if stats["concurrent_requests"] >= proxy.max_concurrent:
            return False

        if stats["last_used"] > current_time - 60:
            requests_last_minute = stats["requests"]
            if requests_last_minute >= proxy.rate_limit_per_minute:
                return False

        return True

    def get_best_proxy(self) -> Optional[ProxyConfig]:
        """Get the best available proxy based on load balancing."""
        available_proxies = [p for p in self.proxies if self.is_proxy_available(p)]

        if not available_proxies:
            return None

        def proxy_score(proxy: ProxyConfig) -> tuple:
            stats = self.proxy_stats[proxy.ip]
            failure_rate = stats["failures"] / max(stats["requests"], 1)
            return (stats["concurrent_requests"], failure_rate, stats["requests"])

        return min(available_proxies, key=proxy_score)

    def mark_proxy_used(self, proxy: ProxyConfig) -> None:
        """Mark proxy as used."""
        stats = self.proxy_stats[proxy.ip]
        stats["requests"] += 1
        stats["last_used"] = time.time()
        stats["concurrent_requests"] += 1

    def mark_proxy_completed(self, proxy: ProxyConfig, success: bool = True) -> None:
        """Mark proxy request as completed."""
        stats = self.proxy_stats[proxy.ip]
        stats["concurrent_requests"] = max(0, stats["concurrent_requests"] - 1)

        if not success:
            stats["failures"] += 1
            failure_rate = stats["failures"] / max(stats["requests"], 1)
            if failure_rate > 0.5 and stats["requests"] > 10:
                stats["blocked_until"] = time.time() + 300
                logger.warning(
                    "proxy_blocked",
                    ip=proxy.ip,
                    failure_rate=failure_rate,
                    block_duration=300,
                )

    def get_proxy_stats(self) -> Dict:
        """Get statistics for all proxies."""
        return dict(self.proxy_stats)

    async def test_proxy(
        self, proxy: ProxyConfig, test_url: str = "https://httpbin.org/ip"
    ) -> bool:
        """Test if a proxy is working."""
        try:
            timeout = aiohttp.ClientTimeout(total=10)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(
                    test_url,
                    proxy=proxy.url,
                    headers={"User-Agent": self.get_random_user_agent()},
                ) as response:
                    return response.status == 200
        except Exception as e:
            logger.error("proxy_test_failed", ip=proxy.ip, error=str(e))
            return False

    async def health_check_all_proxies(self) -> None:
        """Health check all proxies."""
        tasks = [self.test_proxy(proxy) for proxy in self.proxies]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for proxy, result in zip(self.proxies, results):
            if isinstance(result, Exception) or not result:
                self.mark_proxy_completed(proxy, success=False)
                logger.warning("health_check_failed", ip=proxy.ip)
            else:
                logger.info("health_check_passed", ip=proxy.ip)


class ProxySession:
    """Context manager for proxy-based HTTP sessions."""

    def __init__(self, proxy_manager: ProxyManager, provider_name: str):
        self.proxy_manager = proxy_manager
        self.provider_name = provider_name
        self.proxy: Optional[ProxyConfig] = None
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self) -> tuple:
        self.proxy = self.proxy_manager.get_best_proxy()

        if not self.proxy:
            logger.warning(
                "no_proxy_available",
                provider=self.provider_name,
                fallback="direct_connection",
            )
            self.session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=3),
                headers={"User-Agent": self.proxy_manager.get_random_user_agent()},
            )
        else:
            self.proxy_manager.mark_proxy_used(self.proxy)
            logger.info(
                "using_proxy", ip=self.proxy.ip, provider=self.provider_name
            )
            self.session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=3),
                headers={"User-Agent": self.proxy_manager.get_random_user_agent()},
            )

        return self.session, self.proxy

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        if self.session:
            await self.session.close()

        if self.proxy:
            success = exc_type is None
            self.proxy_manager.mark_proxy_completed(self.proxy, success)


# Global proxy manager instance
proxy_manager = ProxyManager()


def initialize_proxy_manager() -> None:
    """Initialize the proxy manager by loading proxies from config file."""
    import json

    try:
        with open("proxy_config.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        if isinstance(data, list):
            proxy_list = data
        elif isinstance(data, dict):
            proxy_list = data.get("proxies", [])
        else:
            proxy_list = []

        if proxy_list:
            actual_proxies = [
                p
                for p in proxy_list
                if p.get("ip")
                and not p["ip"].startswith("your_proxy_ip")
                and "example.com" not in p.get("ip", "")
            ]

            if actual_proxies:
                proxy_manager.add_proxy_list(actual_proxies)
                logger.info(
                    "proxy_manager_initialized", proxy_count=len(actual_proxies)
                )
            else:
                logger.warning("proxy_config_placeholder_only")
        else:
            logger.warning("proxy_config_empty")
    except FileNotFoundError:
        logger.warning("proxy_config_not_found")
    except json.JSONDecodeError as e:
        logger.error("proxy_config_invalid", error=str(e))
    except Exception as e:
        logger.error("proxy_manager_init_error", error=str(e))


# Initialize on import
initialize_proxy_manager()
