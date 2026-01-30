"""Quote models for RemitBuddy API."""

from typing import List, Optional

from pydantic import BaseModel, Field


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
    """Request parameters for fetching remittance quotes."""

    receive_country: str = Field(..., description="Destination country name")
    receive_currency: str = Field(..., description="Currency code (e.g., VND, PHP)")
    send_amount: int = Field(..., gt=0, description="Amount to send in KRW")

    class Config:
        json_schema_extra = {
            "example": {
                "receive_country": "vietnam",
                "receive_currency": "VND",
                "send_amount": 1000000,
            }
        }
