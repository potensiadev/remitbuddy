"""Airwallex provider implementation."""

import re
from typing import Dict, Optional

import aiohttp
import structlog

from providers.base import BaseProvider

logger = structlog.get_logger(__name__)


# Airwallex supported currencies (KRW to foreign currency)
# Based on the website's calculator dropdown
AIRWALLEX_CURRENCIES: Dict[str, str] = {
    "vietnam": "VND",
    "philippines": "PHP",
    "nepal": "NPR",
    "thailand": "THB",
    "singapore": "SGD",
    "united states": "USD",
    "unitedstates": "USD",
    "japan": "JPY",
    "hong kong": "HKD",
    "hongkong": "HKD",
    "china": "CNY",
    "united kingdom": "GBP",
    "unitedkingdom": "GBP",
    "indonesia": "IDR",
    "malaysia": "MYR",
    "bangladesh": "BDT",
}


class AirwallexProvider(BaseProvider):
    """Airwallex remittance provider."""

    name = "Airwallex"
    link = "https://www.airwallex.com/kr/business-account/transfers"

    # Airwallex API requires session token, may need longer timeout
    failure_threshold = 3
    recovery_timeout = 120

    def __init__(self):
        super().__init__()
        self._session_token = None

    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """Fetch quote from Airwallex."""

        # Check if currency is supported
        currency = AIRWALLEX_CURRENCIES.get(receive_country.lower())
        if not currency:
            self._log_debug(
                "unsupported_country",
                country=receive_country,
            )
            return None

        # Verify currency matches
        if currency != receive_currency:
            self._log_debug(
                "currency_mismatch",
                expected=currency,
                received=receive_currency,
            )
            return None

        try:
            # Try to get quote using web scraping approach
            result = await self._fetch_quote_from_web(
                session, send_amount, receive_currency
            )

            if result:
                return result

            return None

        except Exception as e:
            self._log_error(e)
            return None

    async def _fetch_quote_from_web(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
    ) -> Optional[Dict]:
        """
        Fetch quote by scraping the Airwallex calculator page.

        The Airwallex API requires authentication, so we fetch the
        calculator page and extract the rate from the embedded data.
        """
        try:
            # Airwallex calculator URL
            url = "https://www.airwallex.com/kr/business-account/transfers"

            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            }

            async with session.get(url, headers=headers, timeout=10) as response:
                if response.status != 200:
                    logger.warning(
                        "airwallex_page_fetch_failed",
                        status=response.status,
                    )
                    return None

                html = await response.text()

                # Try to find initial rate data in the page
                # Airwallex embeds some rate data in the page script
                rate = self._extract_rate_from_html(html, receive_currency)

                if rate:
                    # Calculate recipient gets based on rate
                    # Airwallex typically has 0 fee for transfers
                    fee = 0.0
                    recipient_gets = send_amount * rate

                    return self._build_result(
                        exchange_rate=rate,
                        fee=fee,
                        recipient_gets=recipient_gets,
                    )

                logger.warning(
                    "airwallex_rate_not_found",
                    currency=receive_currency,
                )
                return None

        except aiohttp.ClientError as e:
            logger.error(
                "airwallex_connection_error",
                error_type=type(e).__name__,
                error=str(e),
            )
            return None
        except Exception as e:
            logger.error(
                "airwallex_unexpected_error",
                error_type=type(e).__name__,
                error=str(e),
            )
            return None

    def _extract_rate_from_html(
        self, html: str, target_currency: str
    ) -> Optional[float]:
        """
        Extract exchange rate from HTML page.

        Airwallex embeds rate data in JavaScript variables or JSON.
        This is a fallback method when API is not accessible.
        """
        try:
            # Pattern to find rate data like: "awxRate": 9.735566
            # or "clientRate": 1471.1894
            patterns = [
                rf'"awxRate":\s*([\d.]+).*?"ccyPair":\s*"{target_currency}KRW"',
                rf'"ccyPair":\s*"{target_currency}KRW".*?"awxRate":\s*([\d.]+)',
                rf'1\s*{target_currency}\s*=\s*([\d.]+)\s*KRW',
            ]

            for pattern in patterns:
                match = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
                if match:
                    rate = float(match.group(1))
                    # Convert to correct format (rate should be KRW per 1 foreign currency)
                    if rate > 0:
                        return rate

            return None

        except Exception as e:
            logger.error(
                "airwallex_rate_extraction_error",
                error=str(e),
            )
            return None
