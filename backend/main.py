from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import asyncio
import aiohttp
import time
import random
import json
import re
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
GMONEY_COUNTRY_NAMES = { "vietnam": "Viet Nam", "philippines": "Philippines", "indonesia": "Indonesia", "cambodia": "Cambodia", "nepal": "Nepal", "myanmar": "Myanmar", "thailand": "Thailand", "uzbekistan": "Uzbekistan", "srilanka": "Sri Lanka", "bangladesh": "Bangladesh", "mongolia": "Mongolia" }
GMONEY_PAYMENT_TYPES = { "uzbekistan": "Humocard", "default": "Bank Account" }
E9PAY_RECV_CODES = {
    "vietnam": "VN03", "philippines": "PH15", "indonesia": "ID01", "thailand": "TH03",
    "nepal": "NP", "myanmar": "MM01", "uzbekistan": "UZ15",
    "srilanka": "LK03", "bangladesh": "BD01"
}

# Coinshot Currency Mapping
COINSHOT_CURRENCIES = {
    "vietnam": "VND", "philippines": "PHP", "indonesia": "IDR", "thailand": "THB",
    "nepal": "NPR", "myanmar": "MMK", "uzbekistan": "UZS",
    "srilanka": "LKR", "bangladesh": "BDT", "cambodia": "KHR", "mongolia": "MNT"
}

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
            exchange_rate = float(data['exchangeRate'])
            recipient_gets = (send_amount - fee) * exchange_rate
            return {"provider": "Hanpass", "exchange_rate": exchange_rate, "fee": fee, "recipient_gets": recipient_gets, "link": "https://www.hanpass.com/"}
    except Exception as e:
        print(f"Hanpass Error: {type(e).__name__} - {e}")
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
            
            service_rate_raw = quote_data.get('service_rate', 0)
            service_rate = float(service_rate_raw)

            if not service_rate or service_rate == 0: return None

            currencies_as_100_unit = ["VND", "IDR"]
            
            if receive_currency in currencies_as_100_unit:
                exchange_rate = 1 / (service_rate / 100)
            else:
                exchange_rate = 1 / service_rate

            fee = 5000.0
            calculated_recipient_gets = (send_amount - fee) * exchange_rate
            
            return {"provider": "Cross", "exchange_rate": exchange_rate, "fee": fee, "recipient_gets": calculated_recipient_gets, "link": "https://crossenf.com/"}
    except Exception as e:
        print(f"Cross Error: {type(e).__name__} - {e}")
        return None
        
async def get_gmoneytrans_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    """Fetches remittance quote from GmoneyTrans using the correct API endpoint and parser."""
    try:
        url = "https://mapi.gmoneytrans.net/exratenew1/ajx_calcRate.asp"
        payout_country = GMONEY_COUNTRY_NAMES.get(receive_country)
        
        # 우즈베키스탄은 'Humocard', 나머지는 'Bank Account'를 기본값으로 사용
        payment_type = GMONEY_PAYMENT_TYPES.get(receive_country, "Bank Account")

        if not payout_country: return None

        # POST 요청이지만, 데이터를 URL 파라미터(params)로 전달합니다.
        params = {
            'total_collected': str(send_amount),
            'payout_country': payout_country,
            'payment_type': payment_type,
            'currencyType': receive_currency,
            'receive_amount': ''
        }
        async with session.post(url, params=params) as response:
            response.raise_for_status()
            text_data = await response.text()
            
            fee_match = re.search(r"serviceCharge--td_clm--([\d.,]+)", text_data)
            rate_match = re.search(r"exchangeRate--td_clm--([\d.,]+)", text_data)
            
            if not fee_match or not rate_match:
                print(f"GmoneyTrans Error: Could not parse data from response: {text_data[:100]}...")
                return None

            fee = float(fee_match.group(1).replace(',', ''))
            foreign_per_krw = float(rate_match.group(1).replace(',', ''))

            if foreign_per_krw == 0: return None
            
            exchange_rate = foreign_per_krw
            recipient_gets = (send_amount - fee) * exchange_rate

            return {
                "provider": "GmoneyTrans",
                "exchange_rate": exchange_rate,
                "fee": fee,
                "recipient_gets": recipient_gets,
                "link": "https://www.gmoneytrans.com/"
            }
    except Exception as e:
        print(f"GmoneyTrans Error: {type(e).__name__} - {e}")
        return None
    
async def get_coinshot_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    """Fetches remittance quote from Coinshot using their API endpoint."""
    try:
        url = "https://coinshot.org/calculate/receiving/i"
        
        # Check if the country is supported by Coinshot
        coinshot_currency = COINSHOT_CURRENCIES.get(receive_country)
        if not coinshot_currency or coinshot_currency != receive_currency:
            return None
        
        # Prepare form data
        data = {
            'receivingCurrency': receive_currency,
            'sendingCurrency': 'KRW',
            'sendingAmount': str(send_amount)
        }
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': 'https://coinshot.org',
            'Referer': 'https://coinshot.org/view/calculate?language=kr'
        }
        
        async with session.post(url, data=data, headers=headers) as response:
            if response.status != 200:
                return None
            
            data = await response.json()
            
            # Extract data from response
            recipient_gets = float(data.get('toAmount', 0))
            fee = float(data.get('fromFee', 0))
            
            if not recipient_gets or recipient_gets <= 0:
                return None
            
            # Calculate exchange rate: receiving_amount / sending_amount
            exchange_rate = recipient_gets / send_amount
            
            return {
                "provider": "Coinshot",
                "exchange_rate": exchange_rate,
                "fee": fee,
                "recipient_gets": recipient_gets,
                "link": "https://coinshot.org/"
            }
            
    except Exception as e:
        print(f"Coinshot Error: {type(e).__name__} - {e}")
        return None

# --- Main API Logic ---
async def fetch_all_quotes(send_amount: int, receive_currency: str, receive_country: str) -> List[Dict]:
    timeout = aiohttp.ClientTimeout(total=7)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        tasks = [
            get_hanpass_quote(session, send_amount, receive_currency, receive_country),
            get_cross_quote(session, send_amount, receive_currency, receive_country),
            get_gmoneytrans_quote(session, send_amount, receive_currency, receive_country),
            get_coinshot_quote(session, send_amount, receive_currency, receive_country)
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
