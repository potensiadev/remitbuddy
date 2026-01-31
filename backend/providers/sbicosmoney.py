"""SBI Cosmoney provider implementation."""

from typing import Dict, Optional

import aiohttp
import structlog

from models.country import SBICOSMONEY_COUNTRIES, SBICOSMONEY_CURRENCIES
from providers.base import BaseProvider

logger = structlog.get_logger(__name__)


class SbicosmoneyProvider(BaseProvider):
    """SBI Cosmoney remittance provider."""

    name = "SBI Cosmoney"
    link = "https://www.sbicosmoney.com/"

    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """Fetch quote from SBI Cosmoney."""
        try:
            country_id = SBICOSMONEY_COUNTRIES.get(receive_country)
            sbi_currency = SBICOSMONEY_CURRENCIES.get(receive_country)

            if not country_id or not sbi_currency or sbi_currency != receive_currency:
                return None

            url = "https://www.sbicosmoney.com/calc/amount"

            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
                "X-Requested-With": "XMLHttpRequest",
                "Origin": "https://www.sbicosmoney.com",
                "Referer": "https://www.sbicosmoney.com/",
                "device": "Safari",
                "deviceid": "hardware1",
                "hardware2": "6",
                "os": "MOBILE-WEB",
                "sbicosmoney_locale": "ko",
            }

            data = {
                "countryId": country_id,
                "currency": receive_currency,
                "osInfo": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            }

            async with session.post(url, json=data, headers=headers) as response:
                content_type = response.headers.get("content-type", "")
                if "application/json" not in content_type:
                    return None

                if response.status != 200:
                    return None

                result = await response.json()

                exchange_rate = result.get("exchangeRate")

                if not exchange_rate or exchange_rate <= 0:
                    return None

                fee = 0.0
                recipient_gets = send_amount * exchange_rate

                return self._build_result(exchange_rate, fee, recipient_gets)

        except Exception as e:
            self._log_error(e)
            return None
