"""Quote routes for RemitBuddy API."""

from fastapi import APIRouter, Depends, HTTPException, Query, Request

import structlog

from api.dependencies import check_rate_limit
from core.exceptions import NoProvidersAvailable, RequestTimeout
from models.quote import QuoteResponse
from services.quote_service import quote_service

logger = structlog.get_logger(__name__)

router = APIRouter()


@router.get(
    "/getRemittanceQuote",
    response_model=QuoteResponse,
    summary="Get remittance quotes",
    description="Fetch real-time remittance quotes from all available providers",
)
async def get_remittance_quote(
    request: Request,
    receive_country: str = Query(..., description="Destination country name"),
    receive_currency: str = Query(..., description="Currency code (e.g., VND, PHP)"),
    send_amount: int = Query(..., gt=0, description="Amount to send in KRW"),
    _: None = Depends(check_rate_limit),
) -> QuoteResponse:
    """
    Get remittance quotes from all providers.

    Returns quotes sorted by recipient_gets (highest first).
    The best_rate_provider field contains the provider with the best rate.
    """
    try:
        response = await quote_service.get_quotes(
            send_amount=send_amount,
            receive_currency=receive_currency,
            receive_country=receive_country,
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
