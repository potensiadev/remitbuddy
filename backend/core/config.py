"""Application configuration using Pydantic Settings."""

from functools import lru_cache
from typing import List, Optional, Set

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Environment
    env: str = "development"

    @field_validator("env")
    @classmethod
    def validate_env(cls, v: str) -> str:
        """Validate environment value."""
        allowed = {"development", "staging", "production"}
        normalized = v.lower().strip()
        if normalized not in allowed:
            raise ValueError(f"ENV must be one of {allowed}, got '{v}'")
        return normalized

    # API Settings
    api_title: str = "RemitBuddy API"
    api_description: str = "Real-time remittance rate comparison service"
    api_version: str = "1.0.0"

    # Rate Limiting
    rate_limit: int = 15
    rate_limit_window: int = 60

    # Cache Settings
    cache_maxsize: int = 2048
    cache_ttl: int = 60

    # Redis
    redis_url: Optional[str] = None

    # Provider Settings
    provider_timeout: float = 2.0
    fetch_timeout: float = 3.0

    # Sentry
    sentry_dsn: Optional[str] = None
    sentry_traces_sample_rate: float = 0.1
    sentry_profiles_sample_rate: float = 0.1

    # Admin Security
    admin_allowed_ips: List[str] = ["127.0.0.1", "::1", "testclient"]  # IP whitelist for admin endpoints
    admin_secret_token: Optional[str] = None  # Secret token for admin access (X-Admin-Token header)
    admin_endpoints_enabled: bool = False  # Master switch for admin endpoints

    # Production Requirements
    require_redis_in_production: bool = False
    require_sentry_in_production: bool = False  # Optional but recommended

    # CORS - Production origins (strict)
    cors_allowed_origins: List[str] = [
        "https://www.remitbuddy.com",
        "https://remitbuddy.com",
        "https://www.koreayo.com",
        "https://koreayo.com",
    ]
    # CORS - Development origins (localhost only, no private IP ranges)
    cors_dev_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://www.remitbuddy.com",
        "https://remitbuddy.com",
        "https://www.koreayo.com",
        "https://koreayo.com",
    ]
    # CORS - Staging origins
    cors_staging_origins: List[str] = [
        "https://www.remitbuddy.com",
        "https://remitbuddy.com",
        "https://staging.remitbuddy.com",
    ]
    # Private IP regex REMOVED for security - was allowing 192.168.x.x, 10.x.x.x, 172.16-31.x.x
    # If needed for specific use cases, add specific IPs to cors_dev_origins instead

    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.env == "production"

    @property
    def is_staging(self) -> bool:
        """Check if running in staging environment."""
        return self.env == "staging"

    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.env == "development"

    def validate_production_requirements(self) -> List[str]:
        """
        Validate production environment requirements.

        Returns:
            List of missing/invalid configuration items.
        """
        errors = []

        if self.is_production:
            # Redis is required in production for distributed rate limiting
            if self.require_redis_in_production and not self.redis_url:
                errors.append("REDIS_URL is required in production")

            # Sentry is recommended in production
            if self.require_sentry_in_production and not self.sentry_dsn:
                errors.append("SENTRY_DSN is required in production")

            # Admin token should be set if admin endpoints are enabled
            if self.admin_endpoints_enabled and not self.admin_secret_token:
                errors.append("ADMIN_SECRET_TOKEN should be set when admin endpoints are enabled in production")

        return errors

    def is_admin_ip_allowed(self, client_ip: str) -> bool:
        """Check if client IP is allowed to access admin endpoints."""
        return client_ip in self.admin_allowed_ips

    def is_admin_token_valid(self, token: Optional[str]) -> bool:
        """Check if admin token is valid."""
        if not self.admin_secret_token:
            return True  # No token configured, allow access
        return token == self.admin_secret_token


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
