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
    link = "https://crossenf.com/remittance"

    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """Fetch quote from Cross."""
        import time
        import uuid
        
        try:
            # Correct API endpoint (v2/outbound/quote)
            url = "https://crossenf.com/v2/outbound/quote/"
            platform_id = CROSS_PLATFORM_MAPPING.get(receive_country.lower())
            if not platform_id:
                return None

            # Generate device ID for this request
            device_id = f"W{int(time.time() * 1000)}{uuid.uuid4().hex[:8]}"
            timestamp = f"{int(time.time() * 1000)}VGkD"

            params = {
                "platform_id": platform_id,
                "quote_type": "send",
                "sending_amount": send_amount,
                "receiving_amount": 0,
                "use_max_point": "true",
                "deposit_type": "Manual",
                "apply_user_limit": 0,
                "is_home": 0,
            }

            # Required Cross-specific headers
            headers = {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
                "Accept": "*/*",
                "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                "Content-Type": "application/json;charset=UTF-8",
                "Referer": "https://crossenf.com/remittance",
                "cross-device-id": device_id,
                "cross-lang": "ko",
                "cross-os": "web",
                "cross-ts": timestamp,
                "cross-user-agent": "CrossApp",
            }

            async with session.get(url, params=params, headers=headers) as response:
                if response.status != 200:
                    self._log_debug("cross_api_error", status=response.status)
                    return None

                try:
                    data = await response.json(content_type=None)
                except Exception:
                    self._log_debug("json_parse_failed")
                    return None

                if not data or data.get("result") != "success":
                    self._log_debug("cross_api_failed", result=data.get("result") if data else None)
                    return None

                quote_data = data.get("data", {})
                
                receiving_amount = quote_data.get("receiving_amount", 0)
                if not receiving_amount or receiving_amount <= 0:
                    return None

                fee = quote_data.get("fee", 0)
                
                # User requested specific formula: send_amount / receiving_amount
                # This gives the rate in "KRW per 1 Unit of Foreign Currency"
                # e.g., 1,000,000 / 17,959,500 = 0.055... (1 VND = ~0.06 KRW)
                if receiving_amount > 0:
                    exchange_rate = send_amount / receiving_amount
                else:
                    exchange_rate = 0

                self._log_debug(
                    "quote_received",
                    receiving_amount=receiving_amount,
                    exchange_rate=exchange_rate,
                    service_rate=service_rate
                )

                return self._build_result(exchange_rate, fee, receiving_amount)

        except Exception as e:
            self._log_error(e)
            return None
