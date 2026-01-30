"""E9Pay provider implementation."""

import json
from typing import Dict, Optional

import aiohttp
import structlog

from models.country import E9PAY_RECV_CODES
from providers.base import BaseProvider

logger = structlog.get_logger(__name__)

# E9Pay fixed fees based on remittance method
E9PAY_FEE_MAPPING = {
    "PH15": 3000,  # Gcash
    "PH13": 5000,  # BDO 계좌송금
    "PH03": 5000,  # 캐시픽업 PHP
    "PH11": 5000,  # 계좌송금 PHP
    "PH09": 5000,  # PAYMAYA
    "PH07": 5000,  # COINS.PH
    "VN15": 5000,  # 베트남 계좌송금
    "VN14": 5000,  # 베트남 모바일월렛
    "VN06": 7000,  # 베트남 캐시픽업
    "VN07": 10000,  # 베트남 홈딜리버리
    "VN05": 7000,  # 베트남 캐시픽업 USD
    "VN08": 10000,  # 베트남 홈딜리버리 USD
    "VN03": 5000,  # 베트남 계좌송금
    "LK03": 5000,  # 스리랑카 계좌송금
    "LK09": 5000,  # 스리랑카 FINANCE AND LEASING
    "LK08": 5000,  # 스리랑카 계좌송금 USD
    "ID01": 5000,  # 인도네시아 계좌송금
    "TH03": 5000,  # 태국 카시콘 계좌송금
    "TH02": 5000,  # 태국 계좌송금
    "MM01": 8000,  # 미얀마 계좌송금 CB
    "MM05": 8000,  # 미얀마 계좌송금 KBZ
    "MM04": 5000,  # 미얀마 KBZ 월렛송금
    "NP": 5000,  # 네팔 계좌송금
    "NP01": 5000,  # 네팔 캐시픽업
    "NP04": 5000,  # 네팔 E-WALLET
    "BD01": 5000,  # 방글라데시 캐시픽업
    "BD02": 3000,  # 방글라데시 BKASH
    "US01": 5000,  # United States 계좌송금
    "CA01": 5000,  # Canada 계좌송금
    "CN09": 5000,  # China 계좌송금
    "MY01": 5000,  # Malaysia 계좌송금
    "JP02": 5000,  # Japan 계좌송금
    "HK01": 5000,  # Hong Kong 계좌송금
    "GB01": 5000,  # United Kingdom 계좌송금
    "MN03": 5000,  # Mongolia 계좌송금
    "UZ15": 5000,  # Uzbekistan
}


class E9payProvider(BaseProvider):
    """E9Pay remittance provider."""

    name = "E9Pay"
    link = "https://www.e9pay.co.kr/"

    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """Fetch quote from E9Pay."""
        try:
            url = "https://www.e9pay.co.kr/cmm/calcExchangeRate.do"

            recv_code = E9PAY_RECV_CODES.get(receive_country)
            if not recv_code:
                return None

            headers = {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "*/*",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
                "X-Requested-With": "XMLHttpRequest",
                "Origin": "https://www.e9pay.co.kr",
                "Referer": "https://www.e9pay.co.kr/",
            }

            data = {
                "DEFRAY_AMOUNT": str(send_amount),
                "SEND_NATN_COD": "KR",
                "CRNCY_COD": "KRW",
                "RCVER_EXPECT_NATN_COD": recv_code,
                "RCVER_EXPECT_CRNCY_COD": receive_currency,
                "SIMULATION_YN": "Y",
                "OVSE_FEE_PROMOTION_YN": "N",
                "LANG_COD": "",
            }

            async with session.post(url, data=data, headers=headers) as response:
                if response.status != 200:
                    return None

                result = await response.json()

                if result.get("responseCode") != "S":
                    return None

                data_str = result.get("data", "{}")
                try:
                    parsed_data = json.loads(data_str)
                except json.JSONDecodeError:
                    return None

                if parsed_data.get("RESULT_COD") != "S":
                    return None

                recipient_amount_str = parsed_data.get("RCVER_EXPECT_RECPT_AMOUNT", "0")

                try:
                    recipient_gets = float(recipient_amount_str)
                    fee = E9PAY_FEE_MAPPING.get(recv_code, 5000)
                except (ValueError, TypeError):
                    return None

                if recipient_gets <= 0:
                    return None

                effective_send_amount = send_amount - fee
                if effective_send_amount <= 0:
                    return None

                exchange_rate = recipient_gets / effective_send_amount

                return self._build_result(exchange_rate, fee, recipient_gets)

        except Exception as e:
            self._log_error(e)
            return None
