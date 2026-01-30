"""Cache service for RemitBuddy API."""

from typing import Any, Optional

import structlog
from cachetools import TTLCache

from core.config import settings

logger = structlog.get_logger(__name__)


class CacheService:
    """Service for managing in-memory TTL cache."""

    def __init__(self, maxsize: int = 2048, ttl: int = 60):
        self._cache: TTLCache = TTLCache(maxsize=maxsize, ttl=ttl)

    def get(self, key: str) -> Optional[Any]:
        """Get a value from cache."""
        value = self._cache.get(key)
        if value is not None:
            logger.debug("cache_hit", key=key)
        return value

    def set(self, key: str, value: Any) -> None:
        """Set a value in cache."""
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

    def build_quote_key(
        self, country: str, currency: str, amount: int
    ) -> str:
        """Build a cache key for quote requests."""
        return f"{country.lower()}:{currency.upper()}:{amount}"


# Global cache service instance
cache_service = CacheService(
    maxsize=settings.cache_maxsize,
    ttl=settings.cache_ttl,
)
