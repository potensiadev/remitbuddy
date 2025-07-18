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
import logging
from typing import Optional, Dict, List
from cachetools import TTLCache

app = FastAPI()

# --- Logging Configuration ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# --- CORS 설정 ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration ---
RATE_LIMIT = 15
RATE_LIMIT_WINDOW = 60
request_timestamps = {}
cache = TTLCache(maxsize=2048, ttl=60)

# --- Country Code Mappings ---
COUNTRY_CODES = { "vietnam": "VN", "philippines": "PH", "indonesia": "ID", "cambodia": "KH", "nepal": "NP", "myanmar": "MM", "thailand": "TH", "uzbekistan": "UZ", "srilanka": "LK", "bangladesh": "BD", "mongolia": "MN" }

# --- Helper Functions ---
def check_rate_limit(client_ip: str):
    current_time = time.time()
    timestamps = request_timestamps.get(client_ip, [])
    valid_timestamps = [ts for ts in timestamps if current_time - ts < RATE_LIMIT_WINDOW]
    if len(valid_timestamps) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too many requests.")
    valid_timestamps.append(current_time)
    request_timestamps[client_ip] = valid_timestamps

# --- Simple Cross Quote Function ---
async def get_cross_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        url = 'https://crossenf.com/api/v4/remit/quote/'
        platform_mapping = { 
            "vietnam": 144, "philippines": 20, "indonesia": 68, "thailand": 60, 
            "nepal": 85, "cambodia": 150, "myanmar": 235, "uzbekistan": 233, 
            "bangladesh": 76, "mongolia": 250, "srilanka": 75 
        }
        platform_id = platform_mapping.get(receive_country.lower())
        if not platform_id: return None
        
        params = {
            "apply_user_limit": 0, 
            "deposit_type": "Manual", 
            "platform_id": platform_id, 
            "quote_type": "send", 
            "sending_amount": send_amount
        }
        
        async with session.get(url, params=params) as response:
            if response.status != 200: return None
            
            data = await response.json()
            quote_data = data.get('data', {})
            
            service_rate_raw = quote_data.get('service_rate', 0)
            service_rate = float(service_rate_raw)

            if not service_rate or service_rate == 0: return None

            fee = quote_data.get('fee', 0)
            if fee == 0:
                fee = 5000.0  # Default fee if not provided
            
            # Fix Cross calculation logic
            logger.info(f"Cross Debug - service_rate: {service_rate}, currency: {receive_currency}")
            
            # Calculate recipient gets using service_rate
            calculated_recipient_gets = (send_amount - fee) * service_rate
            
            # Check if the result is unreasonably large (indicating wrong calculation)
            if calculated_recipient_gets > 1000000:  # Too large for PHP
                # service_rate might be inverted, so correct it
                service_rate_corrected = 1 / service_rate
                calculated_recipient_gets = (send_amount - fee) * service_rate_corrected
                exchange_rate = service_rate  # Use original as display exchange rate
            else:
                exchange_rate = service_rate
            
            logger.info(f"Cross Debug - final recipient_gets: {calculated_recipient_gets}")
            
            if calculated_recipient_gets <= 0:
                return None
            
            return {
                "provider": "Cross", 
                "exchange_rate": exchange_rate, 
                "fee": fee, 
                "recipient_gets": calculated_recipient_gets, 
                "link": "https://crossenf.com/"
            }
    except Exception as e:
        logger.error(f"Cross Error: {type(e).__name__} - {e}")
        return None

# --- Main API Logic ---
async def fetch_all_quotes(send_amount: int, receive_currency: str, receive_country: str) -> List[Dict]:
    timeout = aiohttp.ClientTimeout(total=3)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        tasks = [
            asyncio.wait_for(
                get_cross_quote(session, send_amount, receive_currency, receive_country),
                timeout=2.0
            )
        ]
        
        results = []
        start_time = time.time()
        
        try:
            completed_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for result in completed_results:
                if result and isinstance(result, dict):
                    results.append(result)
                elif isinstance(result, Exception):
                    logger.warning(f"Task failed: {type(result).__name__}: {result}")
                    
        except Exception as e:
            logger.error(f"Error in fetch_all_quotes: {e}")
        
        execution_time = time.time() - start_time
        logger.info(f"🚀 Total execution time: {execution_time:.2f}s, Results: {len(results)}")
        
        return results

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
        cached_data = cache[cache_key]
        logger.info(f"📋 Cache hit for {cache_key}")
        return cached_data

    start_time = time.time()
    logger.info(f"🔄 Processing request: {country_lower} -> {currency_upper}, Amount: {send_amount}")
    
    try:
        quotes = await asyncio.wait_for(
            fetch_all_quotes(send_amount, currency_upper, country_lower), 
            timeout=3.0
        )
        
        if not quotes:
            raise HTTPException(status_code=404, detail="No providers available for this route.")

        sorted_quotes = sorted(quotes, key=lambda x: x.get('recipient_gets', 0), reverse=True)
        
        response_data = {
            "results": sorted_quotes,
            "best_rate_provider": sorted_quotes[0] if sorted_quotes else None,
        }
        
        cache[cache_key] = response_data
        
        total_time = time.time() - start_time
        logger.info(f"✅ Request completed in {total_time:.2f}s, Found {len(quotes)} quotes")
        
        return response_data
        
    except asyncio.TimeoutError:
        logger.info(f"⏰ Request timed out after 3s")
        raise HTTPException(status_code=408, detail="Request timed out.")
    except Exception as e:
        logger.error(f"❌ Unhandled API error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)