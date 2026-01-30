"""Rate limiting service for RemitBuddy API."""

import time
from typing import Dict, List, Optional

import structlog

from core.config import settings
from core.exceptions import RateLimitExceeded

logger = structlog.get_logger(__name__)

# Redis client (optional)
redis_client = None

try:
    import redis.asyncio as redis

    if settings.redis_url:
        redis_client = redis.from_url(
            settings.redis_url, encoding="utf-8", decode_responses=True
        )
        logger.info(
            "redis_connected", url=settings.redis_url.split("@")[-1]
        )
except Exception as e:
    logger.error("redis_connection_failed", error=str(e))


class RateLimitService:
    """Service for managing rate limiting."""

    def __init__(
        self,
        limit: int = 15,
        window: int = 60,
    ):
        self.limit = limit
        self.window = window
        self._timestamps: Dict[str, List[float]] = {}

    async def check_rate_limit(self, client_ip: str) -> None:
        """
        Check if client has exceeded rate limit.

        Args:
            client_ip: Client IP address

        Raises:
            RateLimitExceeded: If rate limit is exceeded
        """
        # Try Redis first
        if redis_client:
            try:
                await self._check_redis_rate_limit(client_ip)
                return
            except redis.RedisError as e:
                logger.error(
                    "redis_rate_limit_error",
                    client_ip=client_ip,
                    error=str(e),
                    fallback="memory",
                )

        # Fall back to in-memory
        await self._check_memory_rate_limit(client_ip)

    async def _check_redis_rate_limit(self, client_ip: str) -> None:
        """Check rate limit using Redis."""
        key = f"rate_limit:{client_ip}"
        current_count = await redis_client.incr(key)

        if current_count == 1:
            await redis_client.expire(key, self.window)

        if current_count > self.limit:
            logger.warning(
                "rate_limit_exceeded",
                client_ip=client_ip,
                backend="redis",
            )
            raise RateLimitExceeded(client_ip, self.limit, self.window)

    async def _check_memory_rate_limit(self, client_ip: str) -> None:
        """Check rate limit using in-memory storage."""
        current_time = time.time()
        timestamps = self._timestamps.get(client_ip, [])

        # Filter valid timestamps within window
        valid_timestamps = [
            ts for ts in timestamps if current_time - ts < self.window
        ]

        if len(valid_timestamps) >= self.limit:
            logger.warning(
                "rate_limit_exceeded",
                client_ip=client_ip,
                backend="memory",
            )
            raise RateLimitExceeded(client_ip, self.limit, self.window)

        valid_timestamps.append(current_time)
        self._timestamps[client_ip] = valid_timestamps

    def get_remaining(self, client_ip: str) -> int:
        """Get remaining requests for a client."""
        current_time = time.time()
        timestamps = self._timestamps.get(client_ip, [])
        valid_count = sum(
            1 for ts in timestamps if current_time - ts < self.window
        )
        return max(0, self.limit - valid_count)


# Global rate limit service instance
rate_limit_service = RateLimitService(
    limit=settings.rate_limit,
    window=settings.rate_limit_window,
)
