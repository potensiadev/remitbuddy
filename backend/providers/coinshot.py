"""Coinshot provider implementation."""

from typing import Dict, Optional

import aiohttp
import structlog

from models.country import COINSHOT_CURRENCIES
from providers.base import BaseProvider

logger = structlog.get_logger(__name__)


class CoinshotProvider(BaseProvider):
    """Coinshot remittance provider."""

    name = "Coinshot"
    link = "https://coinshot.org/"

    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """Fetch quote from Coinshot."""
        try:
            self._log_debug(
                "starting",
                country=receive_country,
                currency=receive_currency,
                amount=send_amount,
            )

            url = "https://coinshot.org/calculate/receiving/i"

            coinshot_currency = COINSHOT_CURRENCIES.get(receive_country)
            self._log_debug(
                "mapped_currency",
                coinshot_currency=coinshot_currency,
                expected_currency=receive_currency,
            )

            if not coinshot_currency or coinshot_currency != receive_currency:
                self._log_debug(
                    "currency_mismatch",
                    coinshot_currency=coinshot_currency,
                    receive_currency=receive_currency,
                )
                return None

            data = {
                "receivingCurrency": receive_currency,
                "sendingCurrency": "KRW",
                "sendingAmount": str(send_amount),
            }

            headers = {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
                "X-Requested-With": "XMLHttpRequest",
                "Origin": "https://coinshot.org",
                "Referer": "https://coinshot.org/view/calculate?language=kr",
            }

            async with session.post(url, data=data, headers=headers) as response:
                self._log_debug("api_response_status", status=response.status)
                if response.status != 200:
                    self._log_debug("non_200_status")
                    return None

                response_data = await response.json()
                self._log_debug("api_response_data", data=response_data)

                recipient_gets = float(response_data.get("toAmount", 0))
                fee = float(response_data.get("fromFee", 0))
                self._log_debug(
                    "parsed_values", recipient_gets=recipient_gets, fee=fee
                )

                if not recipient_gets or recipient_gets <= 0:
                    self._log_debug("invalid_recipient_gets")
                    return None

                exchange_rate = recipient_gets / send_amount
                self._log_debug("calculated_exchange_rate", exchange_rate=exchange_rate)

                return self._build_result(exchange_rate, fee, recipient_gets)

        except Exception as e:
            self._log_error(e)
            return None
