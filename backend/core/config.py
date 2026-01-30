"""Application configuration using Pydantic Settings."""

from functools import lru_cache
from typing import List, Optional

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

    # CORS
    cors_allowed_origins: List[str] = [
        "https://www.remitbuddy.com",
        "https://remitbuddy.com",
    ]
    cors_dev_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://remitbuddy.com",
        "https://www.remitbuddy.com",
    ]
    cors_dev_origin_regex: str = r"https?://(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}):\d+"

    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.env.lower() == "production"

    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.env.lower() == "development"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
