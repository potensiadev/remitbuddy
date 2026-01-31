"""Custom exceptions for RemitBuddy API."""

from typing import Any, Dict, Optional


class RemitBuddyException(Exception):
    """Base exception for all RemitBuddy errors."""

    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ):
        self.message = message
        self.code = code
        self.details = details or {}
        super().__init__(self.message)


class ProviderError(RemitBuddyException):
    """Exception raised when a provider API call fails."""

    def __init__(
        self,
        provider_name: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(
            message=f"[{provider_name}] {message}",
            code="PROVIDER_ERROR",
            details={"provider": provider_name, **(details or {})},
        )
        self.provider_name = provider_name


class RateLimitExceeded(RemitBuddyException):
    """Exception raised when rate limit is exceeded."""

    def __init__(self, client_ip: str, limit: int, window: int):
        super().__init__(
            message="Too many requests.",
            code="RATE_LIMIT_EXCEEDED",
            details={
                "client_ip": client_ip,
                "limit": limit,
                "window_seconds": window,
            },
        )
        self.client_ip = client_ip
        self.limit = limit
        self.window = window


class CacheError(RemitBuddyException):
    """Exception raised when cache operations fail."""

    def __init__(self, operation: str, message: str):
        super().__init__(
            message=f"Cache {operation} failed: {message}",
            code="CACHE_ERROR",
            details={"operation": operation},
        )
        self.operation = operation


class NoProvidersAvailable(RemitBuddyException):
    """Exception raised when no providers are available for a route."""

    def __init__(self, country: str, currency: str):
        super().__init__(
            message="No providers available for this route.",
            code="NO_PROVIDERS",
            details={"country": country, "currency": currency},
        )
        self.country = country
        self.currency = currency


class RequestTimeout(RemitBuddyException):
    """Exception raised when a request times out."""

    def __init__(self, timeout_seconds: float):
        super().__init__(
            message="Request timed out.",
            code="REQUEST_TIMEOUT",
            details={"timeout_seconds": timeout_seconds},
        )
        self.timeout_seconds = timeout_seconds
