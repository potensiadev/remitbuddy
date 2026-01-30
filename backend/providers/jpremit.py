"""JP Remit provider implementation."""

from typing import Dict, Optional

import aiohttp
import structlog

from models.country import JPREMIT_CURRENCIES
from providers.base import BaseProvider

logger = structlog.get_logger(__name__)


class JpremitProvider(BaseProvider):
    """JP Remit provider."""

    name = "JP Remit"
    link = "https://www.jpremit.co.kr/"

    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """Fetch quote from JP Remit."""
        try:
            url = "https://www.jpremit.co.kr/default.aspx/calcfee"

            jpremit_currency = JPREMIT_CURRENCIES.get(receive_country)
            if not jpremit_currency or jpremit_currency != receive_currency:
                return None

            headers = {
                "Content-Type": "application/json;",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
                "X-Requested-With": "XMLHttpRequest",
                "Origin": "https://www.jpremit.co.kr",
                "Referer": "https://www.jpremit.co.kr/",
            }

            data = {
                "sendmoney": f"{send_amount:,}",
                "receiveMoney": 0,
                "type": "Bank Transfer",
                "country": receive_currency,
                "id": "country",
            }

            async with session.post(url, json=data, headers=headers) as response:
                if response.status != 200:
                    return None

                result = await response.json()
                d_data = result.get("d", {})

                service_fee = d_data.get("ServiceFee")
                customer_rate = d_data.get("customer_rate")

                if not service_fee or not customer_rate:
                    return None

                try:
                    fee = float(service_fee)
                    exchange_rate = float(customer_rate)
                except (ValueError, TypeError):
                    return None

                if exchange_rate <= 0:
                    return None

                recipient_gets = (send_amount - fee) * exchange_rate

                return self._build_result(exchange_rate, fee, recipient_gets)

        except Exception as e:
            self._log_error(e)
            return None
