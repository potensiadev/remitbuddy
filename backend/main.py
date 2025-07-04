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
GMONEY_COUNTRY_CODES = { "vietnam": "VNM", "philippines": "PHL", "indonesia": "IDN", "nepal": "NPL", "thailand": "THA", "cambodia": "KHM", "myanmar": "MMR", "uzbekistan": "UZB", "srilanka": "LKA", "bangladesh": "BGD", "mongolia": "MNG" }


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
        print(f"Hanpass Error: {type(e).__name__} - {e}")
        return None

async def get_e9pay_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    # This scraper is currently disabled due to API changes or authentication requirements.
    return None

async def get_gme_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    # This scraper is currently disabled due to API changes or authentication requirements.
    return None

async def get_cross_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        url = 'https://crossenf.com/api/v4/remit/quote/'
        platform_mapping = { "vietnam": 144, "philippines": 20, "indonesia": 68, "thailand": 60, "nepal": 85, "cambodia": 150, "myanmar": 235, "uzbekistan": 233, "bangladesh": 76, "mongolia": 250 }
        platform_id = platform_mapping.get(receive_country.lower())
        if not platform_id: return None
        
        params = {"apply_user_limit": 0, "deposit_type": "Manual", "platform_id": platform_id, "quote_type": "send", "sending_amount": send_amount}
        
        async with session.get(url, params=params) as response:
            if response.status != 200: return None
            
            data = await response.json()
            quote_data = data.get('data', {})
            
            recipient_gets_raw = quote_data.get('receiving_amount', '0')
            recipient_gets = float(str(recipient_gets_raw).replace(',', ''))

            service_rate_raw = quote_data.get('service_rate', 0)
            service_rate = float(service_rate_raw)

            if not recipient_gets or recipient_gets == 0 or not service_rate or service_rate == 0:
                return None

            # 100 단위 기준을 사용하는 통화 목록
            currencies_as_100_unit = ["VND", "IDR"]
            
            # 1 / (KRW per Foreign) = (Foreign per KRW)
            # 100 단위 통화인 경우, service_rate를 100으로 나누어 보정
            if receive_currency in currencies_as_100_unit:
                exchange_rate = 1 / (service_rate / 100)
            else:
                exchange_rate = 1 / service_rate

            fee = 5000.0
            
            # 수수료를 반영하여 최종 수취 금액을 다시 계산 (일관성 유지)
            # Cross는 수수료가 0인 경우가 많아, 이 계산이 API 결과와 거의 동일함
            calculated_recipient_gets = (send_amount - fee) * exchange_rate
            
            return {"provider": "Cross", "exchange_rate": exchange_rate, "fee": fee, "recipient_gets": calculated_recipient_gets, "link": "https://crossenf.com/"}
    except Exception as e:
        print(f"Cross Error: {type(e).__name__} - {e}")
        return None

async def get_wirebarley_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        url = "https://api.wirebarley.com/v2/calculator/quotes"
        country_code = WIREBARLEY_COUNTRY_CODES.get(receive_country)
        if not country_code: return None
        params = {"sendingAmount": send_amount, "sendingCurrency": "KRW", "receivingCurrency": receive_currency, "receivingCountry": country_code, "method": "BANK_TRANSFER"}
        async with session.get(url, params=params) as response:
            response.raise_for_status()
            data = await response.json()
            quote = data.get('data', {}).get('quote', {})
            exchange_rate = float(quote.get('fxrate', 0))
            fee = float(quote.get('fees', {}).get('total', 0))
            recipient_gets = float(quote.get('receivingAmount', 0))
            return {"provider": "WireBarley", "exchange_rate": exchange_rate, "fee": fee, "recipient_gets": recipient_gets, "link": "https://www.wirebarley.com/"}
    except Exception as e:
        print(f"WireBarley Error: {type(e).__name__} - {e}")
        return None

async def get_sentbe_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        url = "https://oxygen.sentbe.com/api/v2/quotes"
        country_code = SENTBE_COUNTRY_CODES.get(receive_country)
        if not country_code: return None
        params = {'calculation_method': 'send', 'amount': send_amount, 'target_country': country_code}
        async with session.get(url, params=params) as response:
            response.raise_for_status()
            data = await response.json()
            exchange_rate = float(data.get('rate', 0))
            fee = float(data.get('fee_total', 0))
            recipient_gets = float(data.get('target_amount', 0))
            if not recipient_gets > 0: return None
            return {"provider": "Sentbe", "exchange_rate": exchange_rate, "fee": fee, "recipient_gets": recipient_gets, "link": "https://www.sentbe.com/"}
    except Exception as e:
        print(f"Sentbe Error: {type(e).__name__} - {e}")
        return None
        
async def get_moin_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    # This scraper is currently disabled due to API changes or authentication requirements.
    return None

async def get_jpremit_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    # This scraper is currently disabled due to API changes or authentication requirements.
    return None

async def get_sbicosmoney_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    # This scraper is currently disabled due to API changes or authentication requirements.
    return None

async def get_gmoneytrans_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        url = "https://www.gmoneytrans.com/api/v2/fx/getQuote"
        country_code = GMONEY_COUNTRY_CODES.get(receive_country)
        if not country_code: return None
        json_data = {"sendAmount": send_amount, "sendCurrency": "KRW", "receiveCurrency": receive_currency, "receiveCountry": country_code}
        async with session.post(url, json=json_data, headers={'Content-Type': 'application/json;charset=UTF-8'}) as response:
            response.raise_for_status()
            data = await response.json()
            quote = data.get('data', {})
            exchange_rate = float(quote.get('exchangeRate', 0))
            fee = float(quote.get('fee', 0))
            recipient_gets = float(quote.get('receivingAmount', 0))
            return {"provider": "GmoneyTrans", "exchange_rate": exchange_rate, "fee": fee, "recipient_gets": recipient_gets, "link": "https://www.gmoneytrans.com/"}
    except Exception as e:
        print(f"GmoneyTrans Error: {type(e).__name__} - {e}")
        return None

# --- Main API Logic ---
async def fetch_all_quotes(send_amount: int, receive_currency: str, receive_country: str) -> List[Dict]:
    timeout = aiohttp.ClientTimeout(total=7)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        tasks = [
            get_hanpass_quote(session, send_amount, receive_currency, receive_country),
            get_wirebarley_quote(session, send_amount, receive_currency, receive_country),
            get_cross_quote(session, send_amount, receive_currency, receive_country),
            get_sentbe_quote(session, send_amount, receive_currency, receive_country),
            get_gmoneytrans_quote(session, send_amount, receive_currency, receive_country),
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
            raise HTTPException(status_code=404, detail="No providers available for this route.")

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
