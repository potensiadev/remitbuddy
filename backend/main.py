from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import asyncio
import aiohttp
import time
import random
import json
from typing import Optional, Dict, List
from cachetools import TTLCache

app = FastAPI()

# --- CORS 설정 ---
# 프론트엔드 주소에서의 API 요청을 허용합니다.
origins = [
    "http://localhost:3000",
    "https://sendhome.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Configuration ---
RATE_LIMIT = 15
RATE_LIMIT_WINDOW = 60
request_timestamps = {}
cache = TTLCache(maxsize=1024, ttl=300)
PROXIES = [] 

# --- Country Code Mappings ---
COUNTRY_CODES = { "vietnam": "VN", "philippines": "PH", "indonesia": "ID", "cambodia": "KH", "nepal": "NP", "myanmar": "MM", "thailand": "TH", "uzbekistan": "UZ", "srilanka": "LK", "bangladesh": "BD", "mongolia": "MN" }
WIREBARLEY_COUNTRY_CODES = { "vietnam": "VNM", "philippines": "PHL", "indonesia": "IDN", "nepal": "NPL", "thailand": "THA", "cambodia": "KHM", "myanmar": "MMR", "uzbekistan": "UZB", "srilanka": "LKA", "bangladesh": "BGD", "mongolia": "MNG" }
SENTBE_COUNTRY_CODES = { "vietnam": 209, "philippines": 154, "indonesia": 92, "nepal": 139, "thailand": 194, "cambodia": 35, "myanmar": 134, "uzbekistan": 205, "srilanka": 189, "bangladesh": 17, "mongolia": 132 }
MOIN_COUNTRY_CODES = { "vietnam": "VNM", "philippines": "PHL", "indonesia": "IDN", "nepal": "NPL", "thailand": "THA", "cambodia": "KHM", "myanmar": "MMR", "uzbekistan": "UZB", "srilanka": "LKA", "bangladesh": "BGD", "mongolia": "MNG" }
JPREMIT_COUNTRY_CODES = { "vietnam": "4", "philippines": "1", "indonesia": "10", "nepal": "2", "thailand": "5", "cambodia": "12", "myanmar": "13", "uzbekistan": "7", "srilanka": "3", "bangladesh": "11", "mongolia": "8" }
SBICOSMONEY_COUNTRY_CODES = { "vietnam": "VNM", "philippines": "PHL", "indonesia": "IDN", "nepal": "NPL", "thailand": "THA", "cambodia": "KHM", "myanmar": "MMR", "uzbekistan": "UZB", "srilanka": "LKA", "bangladesh": "BGD", "mongolia": "MNG" }


# --- Helper Functions ---
def get_random_proxy():
    return random.choice(PROXIES) if PROXIES else None

def check_rate_limit(client_ip: str):
    current_time = time.time()
    timestamps = request_timestamps.get(client_ip, [])
    valid_timestamps = [ts for ts in timestamps if current_time - ts < RATE_LIMIT_WINDOW]
    if len(valid_timestamps) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too many requests.")
    valid_timestamps.append(current_time)
    request_timestamps[client_ip] = valid_timestamps

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})

# --- Scraper Functions ---
async def get_hanpass_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        url = 'https://www.hanpass.com/getCost'
        country_code = COUNTRY_CODES.get(receive_country)
        if not country_code: return None
        json_data = {'inputAmount': str(send_amount), 'inputCurrencyCode': 'KRW', 'toCurrencyCode': receive_currency, 'toCountryCode': country_code, 'lang': 'en'}
        async with session.post(url, json=json_data, headers={'Content-Type': 'application/json'}) as response:
            data = await response.json()
            if response.status != 200 or not data.get('exchangeRate'): return None
            fee = float(data.get('transferFee', 0))
            recipient_gets = (send_amount - fee) * float(data['exchangeRate'])
            return {"provider": "Hanpass", "exchange_rate": float(data['exchangeRate']), "fee": fee, "recipient_gets": recipient_gets, "link": "https://www.hanpass.com/"}
    except Exception as e:
        print(f"Hanpass Error: {e}")
        return None

async def get_gmoneytrans_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        url = "https://mapi.gmoneytrans.net/exratenew1/ajx_calcRate.asp"
        # GmoneyTrans API는 받는 금액 기준이므로, send_amount를 받는 금액으로 가정하고 요청
        params = {'receive_amount': send_amount, 'payout_country': receive_country.capitalize(), 'payment_type': 'Bank Account', 'currencyType': receive_currency}
        async with session.post(url, data=params) as response:
            text_data = await response.text()
            parts = text_data.split('|')
            if len(parts) < 4: return None
            
            # API는 원화/외화 환율을 반환하므로, 우리가 필요한 외화/원화로 변환
            krw_per_foreign = float(parts[0])
            exchange_rate = 1 / krw_per_foreign if krw_per_foreign else 0
            fee = float(parts[1])
            
            # API가 계산해준 보내야 할 총 원화 금액으로 수취 금액을 역산
            total_krw_needed = float(parts[2])
            recipient_gets = (total_krw_needed - fee) * exchange_rate
            
            return {"provider": "GmoneyTrans", "exchange_rate": exchange_rate, "fee": fee, "recipient_gets": recipient_gets, "link": "https://www.gmoneytrans.com/"}
    except Exception as e:
        print(f"GmoneyTrans Error: {e}")
        return None

# ... (다른 스크레이퍼 함수들은 생략, 이전 코드와 동일하게 유지) ...

# --- Main API Logic ---
async def fetch_all_quotes(send_amount: int, receive_currency: str, receive_country: str) -> List[Dict]:
    timeout = aiohttp.ClientTimeout(total=7)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        tasks = [
            get_hanpass_quote(session, send_amount, receive_currency, receive_country),
            get_gmoneytrans_quote(session, send_amount, receive_currency, receive_country),
            # 여기에 다른 모든 get_..._quote 함수들을 추가
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return [r for r in results if r and isinstance(r, dict)]

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"status": "ok"}

@app.get("/api/getRemittanceQuote")
async def get_remittance_quote(request: Request, receive_country: str = Query(...), receive_currency: str = Query(...), send_amount: int = Query(...)):
    client_ip = request.client.host
    check_rate_limit(client_ip)
    
    country_lower = receive_country.lower()
    currency_upper = receive_currency.upper()
    cache_key = f"{country_lower}:{currency_upper}:{send_amount}"
    
    if cache_key in cache:
        return cache[cache_key]

    try:
        quotes = await asyncio.wait_for(fetch_all_quotes(send_amount, currency_upper, country_lower), timeout=15)
        if not quotes:
            raise HTTPException(status_code=404, detail="No providers available.")

        sorted_quotes = sorted(quotes, key=lambda x: x.get('recipient_gets', 0), reverse=True)
        response_data = {
            "results": sorted_quotes,
            "best_rate_provider": sorted_quotes[0] if sorted_quotes else None,
        }
        cache[cache_key] = response_data
        return response_data
    except asyncio.TimeoutError:
        raise HTTPException(status_code=408, detail="Request timed out.")
    except Exception as e:
        print(f"Unhandled API error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
