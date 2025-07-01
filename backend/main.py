from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from datetime import datetime
import asyncio
import aiohttp
import time
import random
from typing import Optional, Dict, List
from cachetools import TTLCache

app = FastAPI()

# --- Configuration ---

# Rate limiting: 10 requests per minute per IP
RATE_LIMIT = 10
RATE_LIMIT_WINDOW = 60
request_timestamps = {}

# In-memory cache: Caches results for 5 minutes (300 seconds)
cache = TTLCache(maxsize=1024, ttl=300)

# Proxy list (Replace with your actual proxy list in a .env file for production)
PROXIES = [
    # "http://proxy1.example.com:8080",
    # "http://proxy2.example.com:8080",
]

# Mapping for country names to provider-specific codes
# Cross는 국가 코드를 사용하지 않으므로, 다른 스크레이퍼를 위해 유지합니다.
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

# --- Helper Functions ---

def get_random_proxy():
    """Returns a random proxy from the list if available."""
    return random.choice(PROXIES) if PROXIES else None

def check_rate_limit(client_ip: str):
    """Checks and enforces rate limiting for a given IP address."""
    current_time = time.time()
    timestamps = request_timestamps.get(client_ip, [])
    # Filter out timestamps older than the window
    valid_timestamps = [ts for ts in timestamps if current_time - ts < RATE_LIMIT_WINDOW]

    if len(valid_timestamps) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too many requests. Please slow down.")

    valid_timestamps.append(current_time)
    request_timestamps[client_ip] = valid_timestamps

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    """Custom exception handler to format HTTP exceptions as JSON."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

# --- Scraper Functions ---

async def get_hanpass_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    """Fetches remittance quote from Hanpass."""
    url = 'https://www.hanpass.com/getCost'
    country_code = COUNTRY_CODES.get(receive_country)
    if not country_code:
        return None

    headers = {'Content-Type': 'application/json'}
    json_data = {
        'inputAmount': str(send_amount), 'inputCurrencyCode': 'KRW',
        'toCurrencyCode': receive_currency, 'toCountryCode': country_code, 'lang': 'en'
    }
    
    try:
        async with session.post(url, headers=headers, json=json_data, proxy=get_random_proxy()) as response:
            if response.status != 200:
                print(f"Hanpass API error: HTTP {response.status}")
                return None
            data = await response.json()
            exchange_rate = float(data.get('exchangeRate') or 0)
            fee = float(data.get('transferFee') or 0)
            recipient_gets = round((send_amount - fee) * exchange_rate, 2)

            return {
                "provider": "Hanpass", "exchange_rate": exchange_rate, "fee": fee,
                "recipient_gets": recipient_gets, "transfer_method": "Bank Transfer",
                "link": "https://www.hanpass.com/"
            }
    except Exception as e:
        print(f"Hanpass error: {str(e)}")
        return None

async def get_e9pay_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    """Fetches remittance quote from E9Pay."""
    url = 'https://www.e9pay.co.kr/cmm/calcExchangeRate.do'
    country_code = COUNTRY_CODES.get(receive_country)
    if not country_code:
        return None
        
    headers = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}
    data = {
        "calcKind": "SE", "sendCountryCd": "KR", "recvCountryCd": country_code,
        "recvCurrencyCd": receive_currency, "sendAmt": str(send_amount)
    }

    try:
        async with session.post(url, headers=headers, data=data, proxy=get_random_proxy()) as response:
            if response.status != 200:
                print(f"E9Pay API error: HTTP {response.status}")
                return None
            resp_json = await response.json()
            if resp_json.get("resultCd") != "0000":
                return None
            
            exchange_rate = float(resp_json.get('exchRate') or 0)
            fee = float(resp_json.get('chargeAmt') or 0)
            recipient_gets = round((send_amount - fee) * exchange_rate, 2)

            return {
                "provider": "E9Pay", "exchange_rate": exchange_rate, "fee": fee,
                "recipient_gets": recipient_gets, "transfer_method": "Bank Deposit",
                "link": "https://www.e9pay.co.kr/"
            }
    except Exception as e:
        print(f"E9Pay error: {str(e)}")
        return None

async def get_gme_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    """Fetches remittance quote from GME."""
    url = 'https://online.gmeremit.com/ExchangeRate.aspx/GetExRate'
    headers = {'Content-Type': 'application/json; charset=UTF-8'}
    json_data = {
        'pCurr': receive_currency, 'pCountryName': receive_country.capitalize(),
        'collCurr': 'KRW', 'deliveryMethod': '2', 'cAmt': str(send_amount),
        'pAmt': '0', 'cardOnline': 'false', 'calBy': 'C'
    }

    try:
        async with session.post(url, headers=headers, json=json_data, proxy=get_random_proxy()) as response:
            response.raise_for_status()
            result = (await response.json()).get('d', {})
            exchange_rate = float(result.get('exRate', '0').replace(',', ''))
            fee = float(result.get('scCharge', '0').replace(',', ''))
            recipient_gets = round((send_amount - fee) * exchange_rate, 2)

            return {
                "provider": "GME", "exchange_rate": exchange_rate, "fee": fee,
                "recipient_gets": recipient_gets, "transfer_method": "Bank Deposit",
                "link": "https://online.gmeremit.com/"
            }
    except Exception as e:
        print(f"GME error: {str(e)}")
        return None

async def get_cross_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    """
    Fetches remittance quote from Cross using their v4 API.
    This function is updated based on the new API endpoint.
    """
    url = 'https://crossenf.com/api/v4/remit/quote/'
    
    # Cross API v4 uses platform_id instead of country code for some destinations.
    # We will use a mapping for this. This might need updates for other countries.
    platform_mapping = {
        "vietnam": 60,
        "philippines": 2,
        # Add other country mappings here as you discover them
    }
    platform_id = platform_mapping.get(receive_country.lower())
    if not platform_id:
        print(f"Cross Error: Unsupported country or missing platform_id for {receive_country}")
        return None

    params = {
        "apply_user_limit": 0,
        "deposit_type": "Manual",
        "platform_id": platform_id,
        "quote_type": "send",
        "sending_amount": send_amount
    }

    try:
        async with session.get(url, params=params, proxy=get_random_proxy()) as response:
            if response.status != 200:
                print(f"Cross API error: HTTP {response.status}")
                return None
            data = await response.json()
            
            # Extract data from the new response structure
            exchange_rate = float(data.get('exchange_rate') or 0)
            fee = float(data.get('fees', '0').replace(',', ''))
            recipient_gets = float(data.get('receiving_amount', '0').replace(',', ''))

            return {
                "provider": "Cross",
                "exchange_rate": exchange_rate,
                "fee": fee,
                "recipient_gets": recipient_gets,
                "transfer_method": "Bank Transfer",
                "link": "https://crossenf.com/"
            }
    except Exception as e:
        print(f"Cross error: {str(e)}")
        return None

# --- Main API Logic ---

async def fetch_all_quotes(send_amount: int, receive_currency: str, receive_country: str) -> List[Dict]:
    """Gathers quotes from all available providers concurrently."""
    timeout = aiohttp.ClientTimeout(total=5) # 5-second timeout for each request
    async with aiohttp.ClientSession(timeout=timeout) as session:
        tasks = [
            get_hanpass_quote(session, send_amount, receive_currency, receive_country),
            get_gme_quote(session, send_amount, receive_currency, receive_country),
            get_e9pay_quote(session, send_amount, receive_currency, receive_country),
            get_cross_quote(session, send_amount, receive_currency, receive_country), # Updated scraper
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        # Filter out None results or exceptions
        return [r for r in results if isinstance(r, dict)]

# --- API Endpoints ---

@app.get("/")
def read_root():
    """Root endpoint for health checks."""
    return {"status": "ok", "message": "Welcome to Sendhome Backend API"}

@app.get("/api/getRemittanceQuote")
async def get_remittance_quote(
    request: Request,
    receive_country: str = Query(..., min_length=2),
    receive_currency: str = Query(..., min_length=3, max_length=3),
    send_amount: int = Query(..., gt=0),
    send_currency: str = Query(default="KRW", min_length=3, max_length=3)
):
    """
    Provides real-time remittance quotes by scraping multiple providers.
    Implements rate limiting and caching.
    """
    client_ip = request.client.host
    check_rate_limit(client_ip)

    # Normalize inputs for caching and processing
    country_lower = receive_country.lower()
    currency_upper = receive_currency.upper()

    # Check cache first
    cache_key = f"{country_lower}:{currency_upper}:{send_amount}"
    if cache_key in cache:
        print(f"Serving from cache: {cache_key}")
        return cache[cache_key]

    try:
        # Fetch quotes with a total timeout for the entire operation
        quotes = await asyncio.wait_for(
            fetch_all_quotes(send_amount, currency_upper, country_lower),
            timeout=10
        )

        if not quotes:
            raise HTTPException(
                status_code=404,
                detail="No remittance providers available for the selected country."
            )

        # Sort by recipient_gets to find the best provider
        sorted_quotes = sorted(quotes, key=lambda x: x['recipient_gets'], reverse=True)
        best_provider = sorted_quotes[0] if sorted_quotes else None

        response_data = {
            "country": receive_country.capitalize(),
            "currency": currency_upper,
            "amount": send_amount,
            "best_rate_provider": best_provider,
            "results": sorted_quotes,
            "request_timestamp": datetime.now().isoformat()
        }
        
        # Store result in cache
        cache[cache_key] = response_data
        return response_data

    except asyncio.TimeoutError:
        raise HTTPException(status_code=408, detail="Request timed out. Please try again later.")
    except Exception as e:
        print(f"Unhandled API error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve remittance data.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
