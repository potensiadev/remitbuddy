"""Debug routes for RemitBuddy API."""

import asyncio
import traceback
from datetime import datetime

import aiohttp
from fastapi import APIRouter

import structlog

from providers.hanpass import hanpass_tracker
from infrastructure.proxy.manager import proxy_manager

logger = structlog.get_logger(__name__)

router = APIRouter()


@router.get(
    "/hanpass-stats",
    summary="Get Hanpass connection statistics",
    description="Returns Hanpass connection stats and current proxy mode status",
)
async def debug_hanpass_stats():
    """Get Hanpass connection statistics and current mode."""
    stats = hanpass_tracker.get_stats()

    return {
        "hanpass_connection": stats,
        "proxy_available": len(proxy_manager.proxies) > 0,
        "proxy_count": len(proxy_manager.proxies),
        "recommendation": _get_hanpass_recommendation(stats),
        "timestamp": datetime.utcnow().isoformat(),
    }


def _get_hanpass_recommendation(stats: dict) -> str:
    """Get recommendation based on Hanpass stats."""
    if stats["force_proxy_mode"]:
        return f"[WARN] IP BLOCKING DETECTED - Using proxy mode for next {stats['force_proxy_remaining_minutes']} minutes"
    elif stats["consecutive_failures"] >= 2:
        return "[WARN] WARNING - 2+ failures detected, close to triggering proxy mode"
    elif stats["consecutive_failures"] >= 1:
        return "[WARN] CAUTION - 1 failure detected, monitoring for IP blocking"
    elif stats["success_rate"] == "100.0%":
        return "[OK] EXCELLENT - All requests successful, no proxy needed"
    else:
        return "[OK] GOOD - Direct connection working normally"


@router.get(
    "/test-hanpass",
    summary="Test Hanpass API directly",
    description="Debug endpoint to test Hanpass API connectivity",
)
async def debug_test_hanpass():
    """Test Hanpass API directly."""
    server_ip = "unknown"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                "https://api.ipify.org?format=json",
                timeout=aiohttp.ClientTimeout(total=5),
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    server_ip = data.get("ip", "unknown")
    except Exception:
        pass

    start_time = asyncio.get_event_loop().time()
    timeout = aiohttp.ClientTimeout(total=10.0)

    detailed_error = None
    response_status = None
    response_headers = None
    response_body = None

    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            url = "https://app.hanpass.com/app/v1/remittance/get-cost"

            json_data = {
                "inputAmount": "1000000",
                "inputCurrencyCode": "KRW",
                "fromCurrencyCode": "KRW",
                "toCurrencyCode": "VND",
                "toCountryCode": "VN",
                "memberSeq": "1",
                "lang": "ko",
            }

            headers = {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Origin": "https://www.hanpass.com",
                "Referer": "https://www.hanpass.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
            }

            try:
                async with session.post(
                    url, json=json_data, headers=headers
                ) as response:
                    response_status = response.status
                    response_headers = dict(response.headers)

                    elapsed = asyncio.get_event_loop().time() - start_time

                    if response.status == 200:
                        data = await response.json()

                        return {
                            "success": True,
                            "server_ip": server_ip,
                            "elapsed_time": f"{elapsed:.2f}s",
                            "http_status": response_status,
                            "result_code": data.get("resultCode"),
                            "result_message": data.get("resultMessage"),
                            "exchange_rate": data.get("exchangeRate"),
                            "to_amount": data.get("toAmount"),
                            "conclusion": "Hanpass API is accessible from this server",
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                    else:
                        response_body = await response.text()
                        detailed_error = f"HTTP {response_status}: {response_body[:500]}"

            except asyncio.TimeoutError:
                elapsed = asyncio.get_event_loop().time() - start_time
                detailed_error = f"Request timed out after {elapsed:.2f}s"

            except aiohttp.ClientError as e:
                elapsed = asyncio.get_event_loop().time() - start_time
                detailed_error = f"ClientError: {type(e).__name__} - {str(e)}"

    except Exception as e:
        elapsed = asyncio.get_event_loop().time() - start_time
        detailed_error = f"Unexpected error: {type(e).__name__} - {str(e)}\n{traceback.format_exc()}"

    elapsed = asyncio.get_event_loop().time() - start_time

    conclusion = "Unknown error"
    if response_status == 403:
        conclusion = "IP BLOCKING DETECTED - Hanpass is blocking this server's IP"
    elif response_status and response_status != 200:
        conclusion = f"HTTP Error {response_status} - May not be IP blocking"
    elif "timeout" in str(detailed_error).lower():
        conclusion = "Request timeout - Possible IP blocking or network issue"
    elif "ClientError" in str(detailed_error):
        conclusion = "Connection error - Possible IP blocking or network issue"

    return {
        "success": False,
        "server_ip": server_ip,
        "elapsed_time": f"{elapsed:.2f}s",
        "http_status": response_status,
        "response_headers": response_headers,
        "error": detailed_error,
        "response_body_preview": response_body[:500] if response_body else None,
        "conclusion": conclusion,
        "timestamp": datetime.utcnow().isoformat(),
    }
