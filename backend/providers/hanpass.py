"""Hanpass provider implementation."""

import asyncio
import time
from typing import Dict, Optional

import aiohttp
import structlog

from models.country import COUNTRY_CODES
from providers.base import BaseProvider
from infrastructure.proxy.manager import proxy_manager

logger = structlog.get_logger(__name__)


class HanpassConnectionTracker:
    """
    Tracks Hanpass connection failures to detect IP blocking.
    Automatically switches to proxy when IP blocking is detected.
    """

    def __init__(self):
        self.consecutive_failures = 0
        self.last_failure_time = 0
        self.force_proxy_until = 0
        self.total_requests = 0
        self.successful_requests = 0

    def should_use_proxy(self) -> bool:
        """Determines if we should use proxy based on recent failures."""
        current_time = time.time()

        if current_time < self.force_proxy_until:
            logger.info(
                "hanpass_forced_proxy_mode",
                remaining_minutes=int((self.force_proxy_until - current_time) / 60),
            )
            return True

        return False

    def record_success(self, used_proxy: bool) -> None:
        """Record a successful Hanpass request."""
        self.total_requests += 1
        self.successful_requests += 1
        self.consecutive_failures = 0

        logger.info(
            "hanpass_success",
            used_proxy=used_proxy,
            success_rate=f"{self.successful_requests}/{self.total_requests}",
        )

    def record_failure(self, used_proxy: bool) -> None:
        """Record a failed Hanpass request."""
        self.total_requests += 1
        self.last_failure_time = time.time()

        if not used_proxy:
            self.consecutive_failures += 1
            logger.warning(
                "hanpass_direct_failure",
                consecutive_failures=self.consecutive_failures,
            )

            if self.consecutive_failures >= 3:
                self.force_proxy_until = time.time() + 3600
                logger.warning(
                    "hanpass_ip_blocking_detected",
                    action="switching_to_proxy_mode",
                    duration_hours=1,
                )
        else:
            logger.error("hanpass_proxy_failure")

    def get_stats(self) -> dict:
        """Get current statistics."""
        return {
            "total_requests": self.total_requests,
            "successful_requests": self.successful_requests,
            "success_rate": f"{(self.successful_requests / max(self.total_requests, 1)) * 100:.1f}%",
            "consecutive_failures": self.consecutive_failures,
            "force_proxy_mode": time.time() < self.force_proxy_until,
            "force_proxy_remaining_minutes": max(
                0, int((self.force_proxy_until - time.time()) / 60)
            ),
        }


# Global tracker instance
hanpass_tracker = HanpassConnectionTracker()


class HanpassProvider(BaseProvider):
    """Hanpass remittance provider."""

    name = "Hanpass"
    link = "https://www.hanpass.com/"

    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """Fetch quote from Hanpass with smart IP blocking detection."""
        country_code = COUNTRY_CODES.get(receive_country)
        if not country_code:
            return None

        url = "https://app.hanpass.com/app/v1/remittance/get-cost"
        json_data = {
            "inputAmount": str(send_amount),
            "inputCurrencyCode": "KRW",
            "fromCurrencyCode": "KRW",
            "toCurrencyCode": receive_currency,
            "toCountryCode": country_code,
            "memberSeq": "1",
            "lang": "ko",
        }
        headers = {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Origin": "https://www.hanpass.com",
            "Referer": "https://www.hanpass.com/",
            "User-Agent": proxy_manager.get_random_user_agent(),
        }

        try:
            should_force_proxy = hanpass_tracker.should_use_proxy()

            if should_force_proxy:
                result = await self._make_request(
                    session, url, json_data, headers, use_proxy=True
                )
                if result:
                    hanpass_tracker.record_success(used_proxy=True)
                    return result
                else:
                    hanpass_tracker.record_failure(used_proxy=True)
                    return None
            else:
                result = await self._make_request(
                    session, url, json_data, headers, use_proxy=False
                )
                if result:
                    hanpass_tracker.record_success(used_proxy=False)
                    return result

                logger.warning("hanpass_direct_failed_retrying_with_proxy")
                hanpass_tracker.record_failure(used_proxy=False)

                if not proxy_manager.get_best_proxy():
                    logger.error("hanpass_no_proxy_available")
                    return None

                result = await self._make_request(
                    session, url, json_data, headers, use_proxy=True
                )
                if result:
                    hanpass_tracker.record_success(used_proxy=True)
                    logger.info("hanpass_proxy_fallback_success")
                    return result
                else:
                    hanpass_tracker.record_failure(used_proxy=True)
                    logger.error("hanpass_both_methods_failed")
                    return None

        except Exception as e:
            self._log_error(e)
            return None

    async def _make_request(
        self,
        session: aiohttp.ClientSession,
        url: str,
        json_data: dict,
        headers: dict,
        use_proxy: bool,
    ) -> Optional[Dict]:
        """Make a Hanpass API request, optionally using proxy."""
        try:
            proxy_url = None
            proxy_obj = None

            if use_proxy:
                proxy_obj = proxy_manager.get_best_proxy()
                if not proxy_obj:
                    logger.warning("hanpass_proxy_requested_but_none_available")
                    return None

                proxy_url = proxy_obj.url
                proxy_manager.mark_proxy_used(proxy_obj)
                logger.info("hanpass_request_with_proxy", proxy_ip=proxy_obj.ip)
            else:
                logger.info("hanpass_request_direct")

            async with session.post(
                url, json=json_data, headers=headers, proxy=proxy_url
            ) as response:
                if response.status != 200:
                    if proxy_obj:
                        proxy_manager.mark_proxy_completed(proxy_obj, success=False)
                    logger.warning(
                        "hanpass_request_failed",
                        status=response.status,
                        used_proxy=use_proxy,
                    )
                    return None

                data = await response.json()

                if data.get("resultCode") != "0":
                    if proxy_obj:
                        proxy_manager.mark_proxy_completed(proxy_obj, success=False)
                    logger.warning(
                        "hanpass_api_error",
                        result_message=data.get("resultMessage"),
                        used_proxy=use_proxy,
                    )
                    return None

                exchange_rate = data.get("exchangeRate")
                to_amount = data.get("toAmount")

                if not exchange_rate or not to_amount:
                    if proxy_obj:
                        proxy_manager.mark_proxy_completed(proxy_obj, success=False)
                    return None

                fee = float(data.get("transferFee", 0))
                exchange_rate = float(exchange_rate)
                recipient_gets = float(to_amount)

                if proxy_obj:
                    proxy_manager.mark_proxy_completed(proxy_obj, success=True)

                logger.info("hanpass_request_success", used_proxy=use_proxy)

                return self._build_result(exchange_rate, fee, recipient_gets)

        except (asyncio.TimeoutError, aiohttp.ClientError) as e:
            if proxy_obj:
                proxy_manager.mark_proxy_completed(proxy_obj, success=False)
            logger.error(
                "hanpass_connection_error",
                used_proxy=use_proxy,
                error_type=type(e).__name__,
                error=str(e),
            )
            return None
        except Exception as e:
            if proxy_obj:
                proxy_manager.mark_proxy_completed(proxy_obj, success=False)
            logger.error(
                "hanpass_unexpected_error",
                used_proxy=use_proxy,
                error_type=type(e).__name__,
                error=str(e),
            )
            return None
