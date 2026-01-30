"""FastAPI dependencies for RemitBuddy API."""

from fastapi import Request

from core.exceptions import RateLimitExceeded
from services.rate_limit_service import rate_limit_service


async def check_rate_limit(request: Request) -> None:
    """
    Dependency to check rate limit for incoming requests.

    Args:
        request: FastAPI request object

    Raises:
        RateLimitExceeded: If rate limit is exceeded
    """
    client_ip = request.client.host
    await rate_limit_service.check_rate_limit(client_ip)


def get_client_ip(request: Request) -> str:
    """
    Get client IP from request.

    Args:
        request: FastAPI request object

    Returns:
        Client IP address
    """
    # Check for forwarded headers (when behind proxy/load balancer)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()

    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip

    return request.client.host
