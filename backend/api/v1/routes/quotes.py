"""Quote routes for RemitBuddy API."""

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import ValidationError

import structlog

from api.dependencies import check_rate_limit
from core.exceptions import NoProvidersAvailable, RequestTimeout
from models.quote import QuoteResponse, QuoteRequest, SUPPORTED_COUNTRIES, SUPPORTED_CURRENCIES
from services.quote_service import quote_service

logger = structlog.get_logger(__name__)

router = APIRouter()


@router.get(
    "/getRemittanceQuote",
    response_model=QuoteResponse,
    summary="Get remittance quotes",
    description="Fetch real-time remittance quotes from all available providers",
    responses={
        400: {"description": "Invalid request parameters"},
        404: {"description": "No providers available for this route"},
        408: {"description": "Request timed out"},
        429: {"description": "Rate limit exceeded"},
    },
)
async def get_remittance_quote(
    request: Request,
    receive_country: str = Query(
        ...,
        min_length=2,
        max_length=50,
        description=f"Destination country name. Supported: {', '.join(sorted(SUPPORTED_COUNTRIES))}",
    ),
    receive_currency: str = Query(
        ...,
        min_length=3,
        max_length=3,
        pattern=r"^[A-Za-z]{3}$",
        description=f"ISO 4217 currency code. Supported: {', '.join(sorted(SUPPORTED_CURRENCIES))}",
    ),
    send_amount: int = Query(
        ...,
        ge=10000,
        le=50000000,
        description="Amount to send in KRW (10,000 - 50,000,000)",
    ),
    _: None = Depends(check_rate_limit),
) -> QuoteResponse:
    """
    Get remittance quotes from all providers.

    Returns quotes sorted by recipient_gets (highest first).
    The best_rate_provider field contains the provider with the best rate.
    """
    # Validate using QuoteRequest model for better error messages
    try:
        validated = QuoteRequest(
            receive_country=receive_country,
            receive_currency=receive_currency,
            send_amount=send_amount,
        )
    except ValidationError as e:
        errors = e.errors()
        error_messages = [
            f"{err['loc'][0]}: {err['msg']}" for err in errors
        ]
        raise HTTPException(
            status_code=400,
            detail={"errors": error_messages},
        )

    try:
        response = await quote_service.get_quotes(
            send_amount=validated.send_amount,
            receive_currency=validated.receive_currency,
            receive_country=validated.receive_country,
        )
        return response

    except NoProvidersAvailable:
        raise HTTPException(
            status_code=404,
            detail="No providers available for this route.",
        )

    except RequestTimeout:
        raise HTTPException(
            status_code=408,
            detail="Request timed out.",
        )

    except Exception as e:
        logger.error("quote_request_error", error=str(e))
        raise HTTPException(
            status_code=500,
            detail="Internal Server Error.",
        )
