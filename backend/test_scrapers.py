import asyncio
import aiohttp
from typing import Coroutine

# main.py에서 테스트할 스크레이퍼 함수들을 가져옵니다.
from main import (
    get_hanpass_quote,
    get_cross_quote,
    get_gmoneytrans_quote,
    get_coinshot_quote,
    get_gmeremit_quote,
    get_jpremit_quote,
    get_themoin_quote,
    get_wirebarley_quote,
    get_e9pay_quote
    )

# --- 테스트 설정 ---
# 여기서 값을 바꾸어 여러 국가와 금액을 테스트할 수 있습니다.
TEST_SEND_AMOUNT = 1000000  # 테스트할 송금액 (원)
TEST_RECEIVE_COUNTRY = "indonesisa" # 테스트할 국가 (소문자)
TEST_RECEIVE_CURRENCY = "IDR"    # 테스트할 통화

async def run_scraper_test(scraper_func: Coroutine, name: str):
    """개별 스크레이퍼 함수를 실행하고 결과를 출력하는 함수"""
    print(f"--- Testing {name}... ---")
    timeout = aiohttp.ClientTimeout(total=10) # 테스트를 위한 넉넉한 타임아웃
    async with aiohttp.ClientSession(timeout=timeout) as session:
        try:
            result = await scraper_func(
                session,
                TEST_SEND_AMOUNT,
                TEST_RECEIVE_CURRENCY,
                TEST_RECEIVE_COUNTRY
            )
            if result:
                print(f"✅ SUCCESS: {name} - {result}")
            else:
                print(f"❌ FAILED: {name} - No data returned.")
        except Exception as e:
            print(f"💥 ERROR: {name} - An exception occurred: {e}")
    print("-" * (len(name) + 20), "\n")


async def main():
    """모든 스크레이퍼 테스트를 순차적으로 실행"""
    # 테스트할 모든 스크레이퍼 목록
    scrapers_to_test = [
     (get_hanpass_quote, "Hanpass"),
     (get_cross_quote, "Cross"),
     (get_gmoneytrans_quote, "GmoneyTrans"),
     (get_coinshot_quote, "Coinshot"),
     (get_gmeremit_quote, "Gmeremit"),
     (get_jpremit_quote, "Jpremit"),
     (get_themoin_quote, "Themoin"),
     (get_wirebarley_quote, "WireBarley"),
     (get_e9pay_quote, "E9Pay")
    ]

    for scraper, name in scrapers_to_test:
        await run_scraper_test(scraper, name)


if __name__ == "__main__":
    print("Starting scraper tests...")
    asyncio.run(main())
    print("All tests completed.")
