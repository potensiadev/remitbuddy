"""GME Remit provider implementation."""

from typing import Dict, Optional

import aiohttp
import structlog

from models.country import GMEREMIT_COUNTRY_NAMES, GMEREMIT_DELIVERY_METHODS
from providers.base import BaseProvider

logger = structlog.get_logger(__name__)


class GmeremitProvider(BaseProvider):
    """GME Remit provider."""

    name = "GME Remit"
    link = "https://www.gmeremit.com/"

    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """Fetch quote from GME Remit."""
        try:
            url = "https://online.gmeremit.com/ExchangeRate.aspx"

            country_name = GMEREMIT_COUNTRY_NAMES.get(receive_country)
            delivery_method = GMEREMIT_DELIVERY_METHODS.get(receive_country, "2")

            if not country_name:
                return None

            headers = {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
                "X-Requested-With": "XMLHttpRequest",
                "Origin": "https://online.gmeremit.com",
                "Referer": "https://online.gmeremit.com/ExchangeRate.aspx?width=auto",
            }

            data = {
                "method": "GetExRate",
                "pCurr": receive_currency,
                "pCountryName": country_name,
                "collCurr": "KRW",
                "deliveryMethod": delivery_method,
                "cAmt": str(send_amount),
                "pAmt": "-",
                "cardOnline": "false",
                "calBy": "C",
            }

            async with session.post(url, data=data, headers=headers) as response:
                if response.status != 200:
                    return None

                result = await response.json()

                if result.get("errorCode") != "0":
                    return None

                sc_charge = result.get("scCharge")
                ex_rate = result.get("exRate")
                p_amt = result.get("pAmt")

                if (
                    not sc_charge
                    or sc_charge == "null"
                    or not ex_rate
                    or ex_rate == "null"
                    or not p_amt
                    or p_amt == "null"
                ):
                    return None

                try:
                    fee = float(sc_charge.replace(",", ""))
                    exchange_rate = float(ex_rate)
                    recipient_gets = float(p_amt.replace(",", ""))
                except (ValueError, TypeError):
                    return None

                if exchange_rate <= 0 or recipient_gets <= 0:
                    return None

                return self._build_result(exchange_rate, fee, recipient_gets)

        except Exception as e:
            self._log_error(e)
            return None
