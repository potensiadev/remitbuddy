from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from datetime import datetime
import asyncio
import aiohttp
import time
import random
from typing import Optional, Dict, List

app = FastAPI()

# Rate limiting configuration
RATE_LIMIT = 10  # requests per minute per IP
RATE_LIMIT_WINDOW = 60  # seconds
request_timestamps = {}

# Proxy list (예시, 실제 리스트로 교체)
PROXIES = [
    "http://proxy1.example.com:8080",
    "http://proxy2.example.com:8080",
    "http://proxy3.example.com:8080",
]

def get_random_proxy():
    return random.choice(PROXIES)

def check_rate_limit(client_ip):
    current_time = time.time()
    timestamps = request_timestamps.get(client_ip, [])
    timestamps = [ts for ts in timestamps if current_time - ts < RATE_LIMIT_WINDOW]

    if len(timestamps) >= RATE_LIMIT:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please slow down."
        )

    timestamps.append(current_time)
    request_timestamps[client_ip] = timestamps

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

COUNTRY_CODES = {
    "vietnam": "VN",
    "philippines": "PH",
    "indonesia": "ID",
    "cambodia": "KH",
    "nepal": "NP",
    "myanmar": "MM",
    "thailand": "TH",
    "uzbekistan": "UZ",
    "srilanka": "LK",
    "bangladesh": "BD"
}

async def get_hanpass_quote(send_amount: int, send_currency: str, receive_currency: str, receive_country: str) -> Optional[Dict]:
    url = 'https://www.hanpass.com/getCost'

    country_code = COUNTRY_CODES.get(receive_country.lower())
    if not country_code:
        return None

    headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Origin': 'https://www.hanpass.com',
        'Referer': 'https://www.hanpass.com/en/',
        'User-Agent': 'Mozilla/5.0'
    }

    json_data = {
        'inputAmount': str(send_amount),
        'inputCurrencyCode': send_currency,
        'toCurrencyCode': receive_currency,
        'toCountryCode': country_code,
        'lang': 'en'
    }

    timeout = aiohttp.ClientTimeout(total=5)
    proxy = get_random_proxy() if PROXIES else None

    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(
                url,
                headers=headers,
                json=json_data,
                proxy=proxy,
            ) as response:
                if response.status != 200:
                    print(f"Hanpass API error: HTTP {response.status}")
                    return None

                data = await response.json()
                exchange_rate = float(data.get('exchangeRate') or 0)
                fee = float(data.get('transferFee') or 0)
                recipient_gets = round((send_amount - fee) * exchange_rate, 2)

                return {
                    "provider": "Hanpass",
                    "exchange_rate": exchange_rate,
                    "fee": fee,
                    "recipient_gets": recipient_gets,
                    "transfer_method": "Bank Transfer",
                    "link": "https://www.hanpass.com/"
                }

    except Exception as e:
        print(f"Hanpass error: {str(e)}")
        return None

async def get_e9pay_quote(send_amount: int, send_currency: str, receive_currency: str, receive_country: str) -> Optional[Dict]:
    url = 'https://www.e9pay.co.kr/cmm/calcExchangeRate.do'

    headers = {
        "Accept": "*/*",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://www.e9pay.co.kr",
        "Referer": "https://www.e9pay.co.kr/",
        "User-Agent": "Mozilla/5.0",
        "X-Requested-With": "XMLHttpRequest"
    }

    recv_country_code = COUNTRY_CODES.get(receive_country.lower())
    if not recv_country_code:
        print(f"E9Pay Error: Unsupported country {receive_country}")
        return None

    data = {
        "calcKind": "SE",
        "sendCountryCd": "KR",
        "recvCountryCd": recv_country_code,
        "recvCurrencyCd": receive_currency,
        "sendAmt": str(send_amount)
    }

    timeout = aiohttp.ClientTimeout(total=5)
    proxy = get_random_proxy() if PROXIES else None

    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(
                url,
                headers=headers,
                data=data,
                proxy=proxy,
            ) as response:
                if response.status != 200:
                    print(f"E9Pay API error: HTTP {response.status}")
                    return None

                resp_json = await response.json()

                if resp_json.get("resultCd") != "0000":
                    print(f"E9Pay API response error: {resp_json.get('resultMsg')}")
                    return None

                exchange_rate = float(resp_json.get('exchRate') or 0)
                fee = float(resp_json.get('chargeAmt') or 0)
                recipient_gets = round((send_amount - fee) * exchange_rate, 2)

                return {
                    "provider": "E9Pay",
                    "exchange_rate": exchange_rate,
                    "fee": fee,
                    "recipient_gets": recipient_gets,
                    "transfer_method": "Bank Deposit",
                    "link": "https://www.e9pay.co.kr/"
                }

    except Exception as e:
        print(f"E9Pay error: {str(e)}")
        return None

async def get_gme_quote(send_amount: int, send_currency: str, receive_currency: str, receive_country: str) -> Optional[Dict]:
    url = 'https://online.gmeremit.com/ExchangeRate.aspx'

    cookies = {}
    headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://online.gmeremit.com',
        'Referer': 'https://online.gmeremit.com/ExchangeRate.aspx?width=auto',
        'User-Agent': 'Mozilla/5.0'
    }

    data = {
        'method': 'GetExRate',
        'pCurr': receive_currency,
        'pCountryName': receive_country,
        'collCurr': send_currency,
        'deliveryMethod': '2',
        'cAmt': str(send_amount),
        'pAmt': '0',
        'cardOnline': 'false',
        'calBy': 'C'
    }

    timeout = aiohttp.ClientTimeout(total=5)
    proxy = get_random_proxy() if PROXIES else None

    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(
                url,
                cookies=cookies,
                headers=headers,
                data=data,
                proxy=proxy,
            ) as response:
                response.raise_for_status()

                if response.headers['Content-Type'].startswith('application/json'):
                    result = await response.json()
                    exchange_rate = float(result['exRate'].replace(',', '')) if 'exRate' in result else 0
                    fee = float(result['scCharge'].replace(',', '')) if 'scCharge' in result else 0
                    recipient_gets = round((send_amount - fee) * exchange_rate, 2)

                    return {
                        "provider": "GME",
                        "exchange_rate": exchange_rate,
                        "fee": fee,
                        "recipient_gets": recipient_gets,
                        "transfer_method": "Bank Deposit",
                        "link": "https://online.gmeremit.com/"
                    }
    except Exception as e:
        print(f"Error scraping GME: {e}")
        return None

async def fetch_quotes(send_amount: int, send_currency: str, receive_currency: str, receive_country: str) -> List[Dict]:
    tasks = [
        get_hanpass_quote(send_amount, send_currency, receive_currency, receive_country),
        get_gme_quote(send_amount, send_currency, receive_currency, receive_country),
        get_e9pay_quote(send_amount, send_currency, receive_currency, receive_country)
    ]

    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [r for r in results if isinstance(r, dict)]

@app.get("/api/getRemittanceQuote")
async def get_remittance_quote(
    request: Request,
    receive_country: str = Query(..., min_length=2),
    receive_currency: str = Query(..., min_length=3, max_length=3),
    send_amount: int = Query(..., gt=0),
    send_currency: str = Query(default="KRW", min_length=3, max_length=3)
):
    client_ip = request.client.host
    check_rate_limit(client_ip)

    if receive_country.lower() not in COUNTRY_CODES:
        raise HTTPException(
            status_code=400,
            detail="Invalid country or currency code."
        )

    try:
        quotes = await asyncio.wait_for(
            fetch_quotes(send_amount, send_currency, receive_currency.upper(), receive_country.lower()),
            timeout=10
        )

        if not quotes:
            raise HTTPException(
                status_code=404,
                detail="No remittance providers available for the selected country."
            )

        best_provider = max(quotes, key=lambda x: x['recipient_gets'])

        return {
            "country": receive_country.capitalize(),
            "currency": receive_currency.upper(),
            "amount": send_amount,
            "best_rate_provider": best_provider,
            "results": quotes,
            "request_timestamp": datetime.now().isoformat(),
            "response_timestamp": datetime.now().isoformat()
        }

    except asyncio.TimeoutError:
        raise HTTPException(408, "Request timed out. Please try again later.")
    except Exception as e:
        print(f"API error: {e}")
        raise HTTPException(500, "Failed to retrieve remittance data. Please try again later.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
