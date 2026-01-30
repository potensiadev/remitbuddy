"""The Moin provider implementation."""

from typing import Dict, Optional

import aiohttp
import structlog

from models.country import THEMOIN_COUNTRY_CODES, THEMOIN_CURRENCIES
from providers.base import BaseProvider

logger = structlog.get_logger(__name__)


class ThemoinProvider(BaseProvider):
    """The Moin remittance provider."""

    name = "The Moin"
    link = "https://www.themoin.com/"

    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """Fetch quote from The Moin."""
        try:
            url = "https://web-api.ma.prd.themoin.com/v0/quote/ma"

            themoin_country = THEMOIN_COUNTRY_CODES.get(receive_country)
            themoin_currency = THEMOIN_CURRENCIES.get(receive_country)

            if (
                not themoin_country
                or not themoin_currency
                or themoin_currency != receive_currency
            ):
                return None

            headers = {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
                "Origin": "https://www.themoin.com",
                "Referer": "https://www.themoin.com/",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
            }

            data = {
                "targetCountry": themoin_country,
                "targetCurrency": receive_currency,
                "fixedSide": "SEND",
                "transferAmount": send_amount,
                "couponTicketId": "",
            }

            async with session.post(url, json=data, headers=headers) as response:
                if response.status != 200:
                    return None

                result = await response.json()

                if result.get("ret") != "success":
                    return None

                quote_v2 = result.get("quoteV2", {})

                fee_amount = quote_v2.get("feeAmount", {})
                destination_amount = quote_v2.get("destinationAmount", {})

                if not fee_amount or not destination_amount:
                    return None

                fee = fee_amount.get("amount", 0)
                recipient_gets = destination_amount.get("amount", 0)

                if fee is None or recipient_gets is None or recipient_gets <= 0:
                    return None

                exchange_rate = recipient_gets / (send_amount - fee)

                return self._build_result(exchange_rate, fee, recipient_gets)

        except Exception as e:
            self._log_error(e)
            return None
