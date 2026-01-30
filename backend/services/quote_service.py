"""Quote service for fetching remittance quotes from all providers."""

import asyncio
import time
from typing import Dict, List, Optional

import aiohttp
import structlog

from core.config import settings
from core.exceptions import NoProvidersAvailable, RequestTimeout
from models.quote import Quote, QuoteResponse
from providers.registry import get_all_providers
from services.cache_service import cache_service
from infrastructure.proxy.manager import proxy_manager

logger = structlog.get_logger(__name__)


class QuoteService:
    """Service for fetching and managing remittance quotes."""

    def __init__(self, provider_timeout: float = 2.0, fetch_timeout: float = 3.0):
        self.provider_timeout = provider_timeout
        self.fetch_timeout = fetch_timeout

    async def get_quotes(
        self,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
        use_cache: bool = True,
    ) -> QuoteResponse:
        """
        Get quotes from all providers for a remittance request.

        Args:
            send_amount: Amount to send in KRW
            receive_currency: Currency code to receive
            receive_country: Country name to receive in
            use_cache: Whether to use cache

        Returns:
            QuoteResponse with results sorted by recipient_gets

        Raises:
            NoProvidersAvailable: If no providers returned quotes
            RequestTimeout: If the request times out
        """
        country_lower = receive_country.lower()
        currency_upper = receive_currency.upper()
        cache_key = cache_service.build_quote_key(
            country_lower, currency_upper, send_amount
        )

        # Check cache
        if use_cache:
            cached = cache_service.get(cache_key)
            if cached:
                logger.info("cache_hit", cache_key=cache_key)
                return QuoteResponse(**cached)

        start_time = time.time()
        logger.info(
            "fetching_quotes",
            country=country_lower,
            currency=currency_upper,
            amount=send_amount,
        )

        try:
            quotes = await asyncio.wait_for(
                self._fetch_all_quotes(send_amount, currency_upper, country_lower),
                timeout=self.fetch_timeout,
            )

            if not quotes:
                raise NoProvidersAvailable(country_lower, currency_upper)

            # Sort by recipient_gets (highest first)
            sorted_quotes = sorted(
                quotes, key=lambda x: x.get("recipient_gets", 0), reverse=True
            )

            response_data = {
                "results": sorted_quotes,
                "best_rate_provider": sorted_quotes[0] if sorted_quotes else None,
            }

            # Cache the response
            if use_cache:
                cache_service.set(cache_key, response_data)

            execution_time = time.time() - start_time
            logger.info(
                "quotes_fetched",
                count=len(quotes),
                execution_time=f"{execution_time:.2f}s",
            )

            return QuoteResponse(**response_data)

        except asyncio.TimeoutError:
            logger.warning("request_timeout", timeout=self.fetch_timeout)
            raise RequestTimeout(self.fetch_timeout)

    async def _fetch_all_quotes(
        self, send_amount: int, receive_currency: str, receive_country: str
    ) -> List[Dict]:
        """Fetch quotes from all providers in parallel."""

        async def create_session_wrapper(provider, *args):
            """Create session and fetch quote for a provider."""
            timeout = aiohttp.ClientTimeout(total=self.provider_timeout)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                return await provider.get_quote(session, *args)

        providers = get_all_providers()
        tasks = [
            asyncio.wait_for(
                create_session_wrapper(
                    provider, send_amount, receive_currency, receive_country
                ),
                timeout=self.provider_timeout,
            )
            for provider in providers
        ]

        results: List[Dict] = []
        start_time = time.time()

        try:
            completed_results = await asyncio.gather(*tasks, return_exceptions=True)

            for result in completed_results:
                if result and isinstance(result, dict):
                    results.append(result)
                elif isinstance(result, Exception):
                    logger.warning(
                        "provider_task_failed",
                        error_type=type(result).__name__,
                        error=str(result),
                    )

        except Exception as e:
            logger.error("fetch_all_quotes_error", error=str(e))

        execution_time = time.time() - start_time
        logger.info(
            "fetch_complete",
            execution_time=f"{execution_time:.2f}s",
            results=len(results),
        )

        # Log proxy statistics
        proxy_stats = proxy_manager.get_proxy_stats()
        if proxy_stats:
            logger.info("proxy_usage_stats", stats=proxy_stats)

        return results


# Global quote service instance
quote_service = QuoteService(
    provider_timeout=settings.provider_timeout,
    fetch_timeout=settings.fetch_timeout,
)
