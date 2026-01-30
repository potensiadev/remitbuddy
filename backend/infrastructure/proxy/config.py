"""Proxy configuration management module."""

import json
import os
import re
from typing import Dict, List, Optional

import structlog

from infrastructure.proxy.manager import ProxyConfig

logger = structlog.get_logger(__name__)


class ProxyConfigManager:
    """Manages proxy configuration from environment variables or config files."""

    def __init__(self):
        self.config_file = "proxy_config.json"
        self.proxies: List[Dict] = []
        self.load_config()

    def load_config(self) -> None:
        """Load proxy configuration from environment variables or file."""
        # 1. Try environment variables first (higher priority)
        env_proxies = load_proxies_from_env()
        if env_proxies:
            logger.info("proxies_loaded_from_env", count=len(env_proxies))
            self.proxies = env_proxies
            return

        # 2. Load from file
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    proxies_from_file = data.get("proxies", [])
                    real_proxies = [
                        p
                        for p in proxies_from_file
                        if "example.com" not in p.get("ip", "")
                    ]
                    if real_proxies:
                        logger.info("proxies_loaded_from_file", count=len(real_proxies))
                        self.proxies = real_proxies
                    else:
                        logger.warning("no_valid_proxies_in_config")
                        self.proxies = []
            else:
                logger.info("no_proxy_config_file")
                self.proxies = []
        except Exception as e:
            logger.error("proxy_config_load_error", error=str(e))
            self.proxies = []

    def create_default_config(self) -> None:
        """Create default proxy configuration file."""
        default_config = {
            "proxies": [
                {
                    "ip": "proxy1.example.com",
                    "port": 8080,
                    "username": "user1",
                    "password": "pass1",
                    "protocol": "http",
                    "max_concurrent": 3,
                    "rate_limit_per_minute": 20,
                },
                {
                    "ip": "proxy2.example.com",
                    "port": 8080,
                    "username": "user2",
                    "password": "pass2",
                    "protocol": "http",
                    "max_concurrent": 3,
                    "rate_limit_per_minute": 20,
                },
            ]
        }

        with open(self.config_file, "w") as f:
            json.dump(default_config, f, indent=2)

        self.proxies = default_config["proxies"]

    def get_proxy_configs(self) -> List[ProxyConfig]:
        """Return list of ProxyConfig objects."""
        return [ProxyConfig(**proxy_data) for proxy_data in self.proxies]

    def add_proxy(self, proxy_data: Dict) -> None:
        """Add a new proxy."""
        self.proxies.append(proxy_data)
        self.save_config()

    def remove_proxy(self, ip: str) -> None:
        """Remove a proxy by IP."""
        self.proxies = [p for p in self.proxies if p["ip"] != ip]
        self.save_config()

    def save_config(self) -> None:
        """Save configuration to file."""
        config = {"proxies": self.proxies}
        with open(self.config_file, "w") as f:
            json.dump(config, f, indent=2)


def load_proxies_from_env() -> List[Dict]:
    """
    Load proxy configuration from environment variables.

    Environment variable formats:
    - HANPASS_PROXY_1=ip:port:username:password
    - HANPASS_PROXY_2=ip:port:username:password
    or
    - HANPASS_PROXY_URL=http://username:password@ip:port (single proxy)
    """
    proxies: List[Dict] = []

    # Method 1: HANPASS_PROXY_URL (single proxy, simple format)
    proxy_url = os.getenv("HANPASS_PROXY_URL")
    if proxy_url:
        try:
            match = re.match(
                r"(https?://)?(?:([^:]+):([^@]+)@)?([^:]+):(\d+)", proxy_url
            )
            if match:
                protocol = match.group(1).rstrip("://") if match.group(1) else "http"
                username = match.group(2)
                password = match.group(3)
                ip = match.group(4)
                port = int(match.group(5))

                proxy_config = {
                    "ip": ip,
                    "port": port,
                    "username": username,
                    "password": password,
                    "protocol": protocol,
                    "max_concurrent": 5,
                    "rate_limit_per_minute": 30,
                }
                proxies.append(proxy_config)
                logger.info("proxy_loaded_from_url", ip=ip, port=port)
        except Exception as e:
            logger.error("proxy_url_parse_error", error=str(e))

    # Method 2: HANPASS_PROXY_1, HANPASS_PROXY_2, ... (multiple proxies)
    i = 1
    while True:
        proxy_env = os.getenv(f"HANPASS_PROXY_{i}")
        if not proxy_env:
            break

        try:
            parts = proxy_env.split(":")
            if len(parts) >= 2:
                proxy_config = {
                    "ip": parts[0],
                    "port": int(parts[1]),
                    "username": parts[2] if len(parts) > 2 else None,
                    "password": parts[3] if len(parts) > 3 else None,
                    "protocol": "http",
                    "max_concurrent": 5,
                    "rate_limit_per_minute": 30,
                }
                proxies.append(proxy_config)
                logger.info(
                    "proxy_loaded_from_env",
                    env_var=f"HANPASS_PROXY_{i}",
                    ip=parts[0],
                    port=parts[1],
                )
        except Exception as e:
            logger.error(
                "proxy_env_parse_error", env_var=f"HANPASS_PROXY_{i}", error=str(e)
            )

        i += 1

    return proxies


# Global proxy config manager instance
proxy_config_manager = ProxyConfigManager()
