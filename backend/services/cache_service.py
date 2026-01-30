"""Multi-layer cache service for RemitBuddy API.

Implements Cache-Aside pattern with two layers:
- L1: In-memory TTLCache (fast, short TTL)
- L2: Redis (distributed, longer TTL)
"""

import json
from typing import Any, Callable, Optional, Awaitable

import structlog
from cachetools import TTLCache

from core.config import settings

logger = structlog.get_logger(__name__)

# Redis client (optional)
_redis_client = None

try:
    import redis.asyncio as redis

    if settings.redis_url:
        _redis_client = redis.from_url(
            settings.redis_url, encoding="utf-8", decode_responses=True
        )
        logger.info("redis_cache_connected", url=settings.redis_url.split("@")[-1])
except Exception as e:
    logger.warning("redis_cache_unavailable", error=str(e))


class MultiLayerCache:
    """
    Multi-layer cache with L1 (memory) and L2 (Redis).

    L1: In-memory TTLCache
        - Ultra-fast access
        - Short TTL (default 5 seconds)
        - Local to each instance

    L2: Redis
        - Distributed across instances
        - Longer TTL (default 60 seconds)
        - Fallback when L1 misses
    """

    def __init__(
        self,
        l1_maxsize: int = 2048,
        l1_ttl: int = 5,
        l2_ttl: int = 60,
        redis_client=None,
    ):
        """
        Initialize multi-layer cache.

        Args:
            l1_maxsize: Maximum items in L1 cache
            l1_ttl: TTL for L1 cache in seconds
            l2_ttl: TTL for L2 (Redis) cache in seconds
            redis_client: Optional Redis client instance
        """
        self._l1_cache: TTLCache = TTLCache(maxsize=l1_maxsize, ttl=l1_ttl)
        self._l2_ttl = l2_ttl
        self._redis = redis_client or _redis_client

    async def get(self, key: str) -> Optional[Any]:
        """
        Get value from cache (L1 -> L2 fallback).

        Args:
            key: Cache key

        Returns:
            Cached value or None if not found
        """
        # L1: Check memory cache first (fastest)
        if key in self._l1_cache:
            logger.debug("cache_l1_hit", key=key)
            return self._l1_cache[key]

        # L2: Check Redis if available
        if self._redis:
            try:
                value = await self._redis.get(f"cache:{key}")
                if value:
                    logger.debug("cache_l2_hit", key=key)
                    # Deserialize and promote to L1
                    parsed = json.loads(value)
                    self._l1_cache[key] = parsed
                    return parsed
            except Exception as e:
                logger.warning("cache_l2_get_error", key=key, error=str(e))

        logger.debug("cache_miss", key=key)
        return None

    async def set(self, key: str, value: Any, l2_ttl: Optional[int] = None) -> None:
        """
        Set value in both cache layers.

        Args:
            key: Cache key
            value: Value to cache
            l2_ttl: Optional custom TTL for L2 (overrides default)
        """
        # L1: Always set in memory
        self._l1_cache[key] = value
        logger.debug("cache_l1_set", key=key)

        # L2: Set in Redis if available
        if self._redis:
            try:
                ttl = l2_ttl or self._l2_ttl
                serialized = json.dumps(value)
                await self._redis.setex(f"cache:{key}", ttl, serialized)
                logger.debug("cache_l2_set", key=key, ttl=ttl)
            except Exception as e:
                logger.warning("cache_l2_set_error", key=key, error=str(e))

    async def get_or_fetch(
        self,
        key: str,
        fetch_fn: Callable[[], Awaitable[Any]],
        l2_ttl: Optional[int] = None,
    ) -> Optional[Any]:
        """
        Get from cache or fetch and cache the result.

        Implements Cache-Aside pattern:
        1. Check L1 (memory)
        2. Check L2 (Redis)
        3. Fetch from source
        4. Cache in both layers

        Args:
            key: Cache key
            fetch_fn: Async function to fetch data if not cached
            l2_ttl: Optional custom TTL for L2

        Returns:
            Cached or freshly fetched value
        """
        # Try cache first
        cached = await self.get(key)
        if cached is not None:
            return cached

        # Fetch from source
        logger.debug("cache_fetch_source", key=key)
        value = await fetch_fn()

        # Cache if we got a value
        if value is not None:
            await self.set(key, value, l2_ttl)

        return value

    async def delete(self, key: str) -> bool:
        """
        Delete from both cache layers.

        Args:
            key: Cache key

        Returns:
            True if deleted from at least one layer
        """
        deleted = False

        # L1: Delete from memory
        if key in self._l1_cache:
            del self._l1_cache[key]
            deleted = True
            logger.debug("cache_l1_delete", key=key)

        # L2: Delete from Redis
        if self._redis:
            try:
                result = await self._redis.delete(f"cache:{key}")
                if result:
                    deleted = True
                    logger.debug("cache_l2_delete", key=key)
            except Exception as e:
                logger.warning("cache_l2_delete_error", key=key, error=str(e))

        return deleted

    async def clear(self) -> None:
        """Clear L1 cache. L2 clearing requires pattern matching."""
        self._l1_cache.clear()
        logger.info("cache_l1_cleared")

        # Note: Clearing L2 would require SCAN + DELETE which is expensive
        # Only clear L1 by default

    def contains(self, key: str) -> bool:
        """Check if key exists in L1 cache (sync)."""
        return key in self._l1_cache

    @property
    def l1_size(self) -> int:
        """Get current L1 cache size."""
        return len(self._l1_cache)

    @property
    def l1_maxsize(self) -> int:
        """Get maximum L1 cache size."""
        return self._l1_cache.maxsize

    @property
    def has_l2(self) -> bool:
        """Check if L2 (Redis) is available."""
        return self._redis is not None


class CacheService:
    """
    Backward-compatible cache service wrapping MultiLayerCache.

    Provides sync-like interface for simple use cases while
    supporting async operations for the multi-layer cache.
    """

    def __init__(self, maxsize: int = 2048, ttl: int = 60):
        """Initialize cache service with backward compatibility."""
        self._cache: TTLCache = TTLCache(maxsize=maxsize, ttl=ttl)
        self._multi_layer = MultiLayerCache(
            l1_maxsize=maxsize,
            l1_ttl=5,  # Short L1 TTL
            l2_ttl=ttl,  # Longer L2 TTL
        )

    def get(self, key: str) -> Optional[Any]:
        """Get a value from L1 cache (sync)."""
        value = self._cache.get(key)
        if value is not None:
            logger.debug("cache_hit", key=key)
        return value

    def set(self, key: str, value: Any) -> None:
        """Set a value in L1 cache (sync)."""
        self._cache[key] = value
        logger.debug("cache_set", key=key)

    def delete(self, key: str) -> bool:
        """Delete a value from cache."""
        if key in self._cache:
            del self._cache[key]
            logger.debug("cache_delete", key=key)
            return True
        return False

    def clear(self) -> None:
        """Clear all values from cache."""
        self._cache.clear()
        logger.info("cache_cleared")

    def contains(self, key: str) -> bool:
        """Check if key exists in cache."""
        return key in self._cache

    @property
    def size(self) -> int:
        """Get current cache size."""
        return len(self._cache)

    @property
    def maxsize(self) -> int:
        """Get maximum cache size."""
        return self._cache.maxsize

    def build_quote_key(self, country: str, currency: str, amount: int) -> str:
        """Build a cache key for quote requests."""
        return f"{country.lower()}:{currency.upper()}:{amount}"

    # Async multi-layer methods
    async def async_get(self, key: str) -> Optional[Any]:
        """Get value using multi-layer cache (async)."""
        return await self._multi_layer.get(key)

    async def async_set(self, key: str, value: Any) -> None:
        """Set value in multi-layer cache (async)."""
        await self._multi_layer.set(key, value)

    async def async_get_or_fetch(
        self,
        key: str,
        fetch_fn: Callable[[], Awaitable[Any]],
    ) -> Optional[Any]:
        """Get or fetch using multi-layer cache (async)."""
        return await self._multi_layer.get_or_fetch(key, fetch_fn)

    @property
    def multi_layer(self) -> MultiLayerCache:
        """Access the underlying multi-layer cache."""
        return self._multi_layer


# Global cache service instance
cache_service = CacheService(
    maxsize=settings.cache_maxsize,
    ttl=settings.cache_ttl,
)
