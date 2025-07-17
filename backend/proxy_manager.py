import asyncio
import aiohttp
import time
import random
from typing import List, Dict, Optional
from dataclasses import dataclass
from collections import defaultdict
import logging

@dataclass
class ProxyConfig:
    ip: str
    port: int
    username: Optional[str] = None
    password: Optional[str] = None
    protocol: str = "http"
    max_concurrent: int = 5
    rate_limit_per_minute: int = 30
    
    @property
    def url(self) -> str:
        if self.username and self.password:
            return f"{self.protocol}://{self.username}:{self.password}@{self.ip}:{self.port}"
        return f"{self.protocol}://{self.ip}:{self.port}"

class ProxyManager:
    def __init__(self):
        self.proxies: List[ProxyConfig] = []
        self.proxy_stats: Dict[str, Dict] = defaultdict(lambda: {
            'requests': 0,
            'failures': 0,
            'last_used': 0,
            'blocked_until': 0,
            'concurrent_requests': 0
        })
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Android 10; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0'
        ]
        
    def add_proxy(self, proxy: ProxyConfig):
        """Add a proxy to the pool"""
        self.proxies.append(proxy)
        logging.info(f"Added proxy: {proxy.ip}:{proxy.port}")
    
    def add_proxy_list(self, proxy_list: List[Dict]):
        """Add multiple proxies from a list of dictionaries"""
        for proxy_data in proxy_list:
            proxy = ProxyConfig(**proxy_data)
            self.add_proxy(proxy)
    
    def get_random_user_agent(self) -> str:
        """Get a random user agent"""
        return random.choice(self.user_agents)
    
    def is_proxy_available(self, proxy: ProxyConfig) -> bool:
        """Check if proxy is available for use"""
        current_time = time.time()
        stats = self.proxy_stats[proxy.ip]
        
        # Check if proxy is temporarily blocked
        if stats['blocked_until'] > current_time:
            return False
        
        # Check concurrent request limit
        if stats['concurrent_requests'] >= proxy.max_concurrent:
            return False
        
        # Check rate limit (requests per minute)
        if stats['last_used'] > current_time - 60:
            requests_last_minute = stats['requests']
            if requests_last_minute >= proxy.rate_limit_per_minute:
                return False
        
        return True
    
    def get_best_proxy(self) -> Optional[ProxyConfig]:
        """Get the best available proxy based on load balancing"""
        available_proxies = [p for p in self.proxies if self.is_proxy_available(p)]
        
        if not available_proxies:
            return None
        
        # Sort by least used and lowest failure rate
        def proxy_score(proxy):
            stats = self.proxy_stats[proxy.ip]
            failure_rate = stats['failures'] / max(stats['requests'], 1)
            return (stats['concurrent_requests'], failure_rate, stats['requests'])
        
        return min(available_proxies, key=proxy_score)
    
    def mark_proxy_used(self, proxy: ProxyConfig):
        """Mark proxy as used"""
        stats = self.proxy_stats[proxy.ip]
        stats['requests'] += 1
        stats['last_used'] = time.time()
        stats['concurrent_requests'] += 1
    
    def mark_proxy_completed(self, proxy: ProxyConfig, success: bool = True):
        """Mark proxy request as completed"""
        stats = self.proxy_stats[proxy.ip]
        stats['concurrent_requests'] = max(0, stats['concurrent_requests'] - 1)
        
        if not success:
            stats['failures'] += 1
            # Temporarily block proxy if too many failures
            failure_rate = stats['failures'] / max(stats['requests'], 1)
            if failure_rate > 0.5 and stats['requests'] > 10:
                stats['blocked_until'] = time.time() + 300  # Block for 5 minutes
                logging.warning(f"Proxy {proxy.ip} temporarily blocked due to high failure rate")
    
    def get_proxy_stats(self) -> Dict:
        """Get statistics for all proxies"""
        return dict(self.proxy_stats)
    
    async def test_proxy(self, proxy: ProxyConfig, test_url: str = "https://httpbin.org/ip") -> bool:
        """Test if a proxy is working"""
        try:
            timeout = aiohttp.ClientTimeout(total=10)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(
                    test_url,
                    proxy=proxy.url,
                    headers={'User-Agent': self.get_random_user_agent()}
                ) as response:
                    return response.status == 200
        except Exception as e:
            logging.error(f"Proxy test failed for {proxy.ip}: {e}")
            return False
    
    async def health_check_all_proxies(self):
        """Health check all proxies"""
        tasks = []
        for proxy in self.proxies:
            task = self.test_proxy(proxy)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for i, (proxy, result) in enumerate(zip(self.proxies, results)):
            if isinstance(result, Exception) or not result:
                self.mark_proxy_completed(proxy, success=False)
                logging.warning(f"Health check failed for proxy {proxy.ip}")
            else:
                logging.info(f"Health check passed for proxy {proxy.ip}")

class ProxySession:
    """Context manager for proxy-based HTTP sessions"""
    
    def __init__(self, proxy_manager: ProxyManager, provider_name: str):
        self.proxy_manager = proxy_manager
        self.provider_name = provider_name
        self.proxy = None
        self.session = None
    
    async def __aenter__(self):
        self.proxy = self.proxy_manager.get_best_proxy()
        
        if not self.proxy:
            # Fallback to no proxy if none available
            logging.warning(f"No proxy available for {self.provider_name}, using direct connection")
            self.session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=3),
                headers={'User-Agent': self.proxy_manager.get_random_user_agent()}
            )
        else:
            self.proxy_manager.mark_proxy_used(self.proxy)
            logging.info(f"Using proxy {self.proxy.ip} for {self.provider_name}")
            
            # Create session with proxy
            self.session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=3),
                headers={'User-Agent': self.proxy_manager.get_random_user_agent()}
            )
        
        return self.session, self.proxy
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
        
        if self.proxy:
            success = exc_type is None
            self.proxy_manager.mark_proxy_completed(self.proxy, success)


# Global proxy manager instance
proxy_manager = ProxyManager()

# Example proxy configuration - Add your actual proxy list here
PROXY_LIST = [
    # Example proxy configurations
    # {"ip": "proxy1.example.com", "port": 8080, "username": "user1", "password": "pass1"},
    # {"ip": "proxy2.example.com", "port": 8080, "username": "user2", "password": "pass2"},
    # {"ip": "proxy3.example.com", "port": 8080, "username": "user3", "password": "pass3"},
]

def initialize_proxy_manager():
    """Initialize the proxy manager with proxy list"""
    if PROXY_LIST:
        proxy_manager.add_proxy_list(PROXY_LIST)
        logging.info(f"Initialized proxy manager with {len(PROXY_LIST)} proxies")
    else:
        logging.warning("No proxies configured, running without proxy rotation")

# Initialize on import
initialize_proxy_manager()