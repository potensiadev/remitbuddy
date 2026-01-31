"""Wirebarley provider implementation."""

from typing import Dict, Optional

import aiohttp
import structlog

from models.country import WIREBARLEY_COUNTRIES
from providers.base import BaseProvider

logger = structlog.get_logger(__name__)


class WirebarleyProvider(BaseProvider):
    """Wirebarley remittance provider."""

    name = "Wirebarley"
    link = "https://www.wirebarley.com/"

    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """Fetch quote from Wirebarley."""
        try:
            country_code = WIREBARLEY_COUNTRIES.get(receive_country)
            self._log_debug(
                "starting",
                receive_country=receive_country,
                country_code=country_code,
            )
            if not country_code:
                self._log_debug("no_country_code", receive_country=receive_country)
                return None

            url = "https://www.wirebarley.com/my/remittance/api/v1/exrate/KR/KRW"

            headers = {
                "Accept": "*/*",
                "Content-Type": "application/json",
                "Referer": "https://www.wirebarley.com/",
                "device-type": "WEB",
                "device-model": "Safari",
                "device-version": "604.1",
                "lang": "ko",
            }

            async with session.get(url, headers=headers) as response:
                if response.status != 200:
                    return None

                result = await response.json()

            if result.get("status") != 0:
                return None

            data = result.get("data", {})
            ex_rates = data.get("exRates", [])

            matching_rate = None
            self._log_debug(
                "looking_for_rate",
                country_code=country_code,
                currency=receive_currency,
                available_rates=len(ex_rates),
            )

            for rate in ex_rates:
                if (
                    rate.get("country") == country_code
                    and rate.get("currency") == receive_currency
                ):
                    matching_rate = rate
                    self._log_debug("found_matching_rate")
                    break

            if not matching_rate:
                self._log_debug("no_matching_rate")
                return None

            wb_rate_data = matching_rate.get("wbRateData", {})
            transfer_fees = matching_rate.get("transferFees", [])

            exchange_rate = wb_rate_data.get("wbRate", 0)

            # Apply amount-based rate tiers
            for i in range(1, 10):
                threshold = wb_rate_data.get(f"threshold{i}")
                if threshold and send_amount >= threshold:
                    new_rate = wb_rate_data.get(f"wbRate{i}")
                    if new_rate:
                        exchange_rate = new_rate

            if not exchange_rate or exchange_rate <= 0:
                return None

            # Get fee for send amount
            fee = 0
            for fee_info in transfer_fees:
                if fee_info.get("min", 0) <= send_amount <= fee_info.get(
                    "max", float("inf")
                ):
                    threshold1 = fee_info.get("threshold1")
                    if threshold1 and send_amount >= threshold1:
                        fee = fee_info.get("fee2", 0) or 0
                    else:
                        fee = fee_info.get("fee1", 0) or 0
                    break

            recipient_gets = (send_amount - fee) * exchange_rate

            return self._build_result(exchange_rate, fee, recipient_gets)

        except Exception as e:
            self._log_error(e)
            return None
