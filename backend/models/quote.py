"""Quote models for RemitBuddy API."""

import re
from typing import List, Optional, Set

from pydantic import BaseModel, Field, field_validator

# Supported countries (union of all provider mappings)
SUPPORTED_COUNTRIES: Set[str] = {
    "vietnam",
    "philippines",
    "indonesia",
    "cambodia",
    "nepal",
    "myanmar",
    "thailand",
    "uzbekistan",
    "srilanka",
    "bangladesh",
    "mongolia",
    "united states",
    "unitedstates",
    "canada",
    "singapore",
    "china",
    "malaysia",
    "japan",
    "hong kong",
    "hongkong",
    "united kingdom",
    "unitedkingdom",
}

# Supported currency codes
SUPPORTED_CURRENCIES: Set[str] = {
    "VND", "PHP", "IDR", "KHR", "NPR", "MMK", "THB", "UZS", "LKR", "BDT",
    "MNT", "USD", "CAD", "SGD", "CNY", "MYR", "JPY", "HKD", "GBP",
}


class Quote(BaseModel):
    """A single quote from a remittance provider."""

    provider: str = Field(..., description="Name of the remittance provider")
    exchange_rate: float = Field(..., description="Exchange rate offered")
    fee: float = Field(..., description="Transfer fee in KRW")
    recipient_gets: float = Field(..., description="Amount recipient will receive")
    link: str = Field(..., description="URL to provider's website")

    class Config:
        json_schema_extra = {
            "example": {
                "provider": "Hanpass",
                "exchange_rate": 17.89,
                "fee": 0,
                "recipient_gets": 17890000,
                "link": "https://www.hanpass.com/",
            }
        }


class QuoteResponse(BaseModel):
    """Response containing all quotes for a remittance request."""

    results: List[Quote] = Field(
        default_factory=list, description="List of quotes from all providers"
    )
    best_rate_provider: Optional[Quote] = Field(
        None, description="The provider offering the best rate"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "results": [
                    {
                        "provider": "Hanpass",
                        "exchange_rate": 17.89,
                        "fee": 0,
                        "recipient_gets": 17890000,
                        "link": "https://www.hanpass.com/",
                    },
                    {
                        "provider": "Wirebarley",
                        "exchange_rate": 17.85,
                        "fee": 5000,
                        "recipient_gets": 17760750,
                        "link": "https://www.wirebarley.com/",
                    },
                ],
                "best_rate_provider": {
                    "provider": "Hanpass",
                    "exchange_rate": 17.89,
                    "fee": 0,
                    "recipient_gets": 17890000,
                    "link": "https://www.hanpass.com/",
                },
            }
        }


class QuoteRequest(BaseModel):
    """Request parameters for fetching remittance quotes with strict validation."""

    receive_country: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Destination country name (e.g., vietnam, philippines)",
    )
    receive_currency: str = Field(
        ...,
        min_length=3,
        max_length=3,
        description="ISO 4217 currency code (e.g., VND, PHP)",
    )
    send_amount: int = Field(
        ...,
        ge=10000,
        le=50000000,
        description="Amount to send in KRW (10,000 - 50,000,000)",
    )

    @field_validator("receive_country")
    @classmethod
    def validate_country(cls, v: str) -> str:
        """Validate and normalize country name."""
        normalized = v.lower().strip()
        if normalized not in SUPPORTED_COUNTRIES:
            raise ValueError(
                f"Unsupported country: '{v}'. "
                f"Supported countries: {', '.join(sorted(SUPPORTED_COUNTRIES))}"
            )
        return normalized

    @field_validator("receive_currency")
    @classmethod
    def validate_currency(cls, v: str) -> str:
        """Validate currency code format and support."""
        # Must be exactly 3 uppercase letters
        if not re.match(r"^[A-Z]{3}$", v.upper()):
            raise ValueError(
                f"Invalid currency format: '{v}'. Must be 3 uppercase letters (e.g., VND, PHP)"
            )
        normalized = v.upper()
        if normalized not in SUPPORTED_CURRENCIES:
            raise ValueError(
                f"Unsupported currency: '{v}'. "
                f"Supported currencies: {', '.join(sorted(SUPPORTED_CURRENCIES))}"
            )
        return normalized

    class Config:
        json_schema_extra = {
            "example": {
                "receive_country": "vietnam",
                "receive_currency": "VND",
                "send_amount": 1000000,
            }
        }
