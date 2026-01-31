"""Cross provider implementation."""

from typing import Dict, Optional

import aiohttp
import structlog

from providers.base import BaseProvider

logger = structlog.get_logger(__name__)

# Cross platform ID mapping
CROSS_PLATFORM_MAPPING = {
    "vietnam": 144,
    "philippines": 20,
    "indonesia": 68,
    "thailand": 60,
    "nepal": 85,
    "cambodia": 150,
    "myanmar": 235,
    "uzbekistan": 233,
    "bangladesh": 76,
    "mongolia": 250,
    "srilanka": 75,
    "united kingdom": 182,
    "unitedkingdom": 182,
    "singapore": 36,
    "hong kong": 113,
    "hongkong": 113,
    "malaysia": 16,
    "china": 122,
}


class CrossProvider(BaseProvider):
    """Cross remittance provider."""

    name = "Cross"
    link = "https://crossenf.com/"

    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """Fetch quote from Cross."""
        try:
            url = "https://crossenf.com/api/v4/remit/quote/"
            platform_id = CROSS_PLATFORM_MAPPING.get(receive_country.lower())
            if not platform_id:
                return None

            params = {
                "apply_user_limit": 0,
                "deposit_type": "Manual",
                "platform_id": platform_id,
                "quote_type": "send",
                "sending_amount": send_amount,
            }

            async with session.get(url, params=params) as response:
                if response.status != 200:
                    return None

                data = await response.json()
                quote_data = data.get("data", {})

                receiving_amount = quote_data.get("receiving_amount", 0)
                if not receiving_amount or receiving_amount <= 0:
                    return None

                fee = quote_data.get("fee", 0)
                pay_amount = quote_data.get("pay_amount", send_amount)

                if pay_amount > 0:
                    exchange_rate = receiving_amount / pay_amount
                else:
                    exchange_rate = 0

                self._log_debug(
                    "quote_received",
                    receiving_amount=receiving_amount,
                    pay_amount=pay_amount,
                    exchange_rate=exchange_rate,
                )

                return self._build_result(exchange_rate, fee, receiving_amount)

        except Exception as e:
            self._log_error(e)
            return None
