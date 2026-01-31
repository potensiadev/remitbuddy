"""GmoneyTrans provider implementation."""

import re
from typing import Dict, Optional

import aiohttp
import structlog

from models.country import GMONEY_COUNTRY_NAMES, GMONEY_PAYMENT_TYPES
from providers.base import BaseProvider

logger = structlog.get_logger(__name__)


class GmoneytransProvider(BaseProvider):
    """GmoneyTrans remittance provider."""

    name = "GmoneyTrans"
    link = "https://www.gmoneytrans.com/"

    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """Fetch quote from GmoneyTrans."""
        try:
            self._log_debug(
                "starting",
                country=receive_country,
                currency=receive_currency,
                amount=send_amount,
            )

            url = "https://mapi.gmoneytrans.net/exratenew1/ajx_calcRate.asp"
            payout_country = GMONEY_COUNTRY_NAMES.get(receive_country)
            payment_type = GMONEY_PAYMENT_TYPES.get(receive_country, "Bank Account")

            if not payout_country:
                self._log_debug("no_country_mapping", country=receive_country)
                return None

            self._log_debug(
                "mapped_country",
                payout_country=payout_country,
                payment_type=payment_type,
            )

            params = {
                "total_collected": str(send_amount),
                "payout_country": payout_country,
                "payment_type": payment_type,
                "currencyType": receive_currency,
                "receive_amount": "",
            }

            async with session.post(url, params=params) as response:
                response.raise_for_status()
                text_data = await response.text()
                self._log_debug("api_response", response_preview=text_data[:300])

                fee_match = re.search(r"serviceCharge--td_clm--([\d.,]+)", text_data)
                rate_match = re.search(r"exchangeRate--td_clm--([\d.,]+)", text_data)
                receive_match = re.search(r"receiveAmount--td_clm--([\d.,]+)", text_data)

                if not fee_match or not rate_match or not receive_match:
                    self._log_debug(
                        "parse_failed",
                        fee_found=bool(fee_match),
                        rate_found=bool(rate_match),
                        receive_found=bool(receive_match),
                    )
                    logger.error(
                        "gmoneytrans_parse_error",
                        response_preview=text_data[:200],
                    )
                    return None

                fee = float(fee_match.group(1).replace(",", ""))
                foreign_per_krw = float(rate_match.group(1).replace(",", ""))
                recipient_gets = float(receive_match.group(1).replace(",", ""))

                self._log_debug(
                    "parsed_values",
                    fee=fee,
                    rate=foreign_per_krw,
                    recipient_gets=recipient_gets,
                )

                if foreign_per_krw == 0:
                    return None

                exchange_rate = foreign_per_krw

                return self._build_result(exchange_rate, fee, recipient_gets)

        except Exception as e:
            self._log_error(e)
            return None
