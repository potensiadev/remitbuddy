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
    "*"  # 임시로 모든 origin 허용
]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # 임시로 모든 origin 허용
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
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
# Reduced TTL to 60 seconds for fresher data with more cache slots
cache = TTLCache(maxsize=2048, ttl=60)
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

# GME Remit Country Mappings
GMEREMIT_COUNTRY_NAMES = {
    "vietnam": "Vietnam", "philippines": "Philippines", "indonesia": "Indonesia",
    "thailand": "Thailand", "nepal": "Nepal", "myanmar": "Myanmar",
    "uzbekistan": "Uzbekistan", "srilanka": "Sri Lanka", "bangladesh": "Bangladesh",
    "cambodia": "Cambodia", "mongolia": "Mongolia"
}

# GME Remit Delivery Methods by Country
GMEREMIT_DELIVERY_METHODS = {
    "vietnam": "2",  # Bank Deposit
    "philippines": "2",  # Bank Deposit
    "indonesia": "2",  # Bank Deposit
    "thailand": "2",  # Bank Deposit
    "nepal": "2",  # Bank Deposit
    "myanmar": "2",  # Bank Deposit
    "uzbekistan": "1",  # Cash Payment (trying different method)
    "srilanka": "2",  # Bank Deposit
    "bangladesh": "2",  # Bank Deposit
    "cambodia": "2",  # Bank Deposit
    "mongolia": "2"  # Bank Deposit
}

# JP Remit Currency Mappings
JPREMIT_CURRENCIES = {
    "vietnam": "VND", "philippines": "PHP", "indonesia": "IDR", "thailand": "THB",
    "nepal": "NPR", "myanmar": "MMK", "uzbekistan": "UZS",
    "srilanka": "LKR", "bangladesh": "BDT", "cambodia": "KHR", "mongolia": "MNT"
}

# The Moin Country/Currency Mappings
THEMOIN_COUNTRY_CODES = {
    "japan": "JP",
    "thailand": "TH"
}

THEMOIN_CURRENCIES = {
    "japan": "JPY",
    "thailand": "THB"
}

# Wirebarley Country Mappings
WIREBARLEY_COUNTRIES = {
    "australia": "AU", "newzealand": "NZ", "philippines": "PH", "vietnam": "VN", 
    "nepal": "NP", "indonesia": "ID", "china": "CN", "singapore": "SG", 
    "malaysia": "MY", "thailand": "TH", "uk": "GB", "france": "FR", 
    "germany": "DE", "usa": "US", "japan": "JP", "india": "IN", 
    "cambodia": "KH", "bangladesh": "BD", "hongkong": "HK", "canada": "CA",
    "uzbekistan": "UZ"
}

# SBI Cosmoney Country/Currency Mappings
SBICOSMONEY_COUNTRIES = {
    "vietnam": "VIETNAM", "philippines": "PHILIPPINES", "indonesia": "INDONESIA",
    "thailand": "THAILAND", "nepal": "NEPAL", "myanmar": "MYANMAR",
    "uzbekistan": "UZBEKISTAN", "srilanka": "SRILANKA", "bangladesh": "BANGLADESH",
    "cambodia": "CAMBODIA", "mongolia": "MONGOLIA"
}

SBICOSMONEY_CURRENCIES = {
    "vietnam": "VND", "philippines": "PHP", "indonesia": "IDR", "thailand": "THB",
    "nepal": "NPR", "myanmar": "MMK", "uzbekistan": "UZS",
    "srilanka": "LKR", "bangladesh": "BDT", "cambodia": "KHR", "mongolia": "MNT"
}

# E9Pay uses existing E9PAY_RECV_CODES mapping


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
        
        json_data = {
            'inputAmount': str(send_amount), 
            'inputCurrencyCode': 'KRW', 
            'toCurrencyCode': receive_currency, 
            'toCountryCode': country_code, 
            'lang': 'en'
        }
        
        headers = {'Content-Type': 'application/json'}
        
        async with session.post(url, json=json_data, headers=headers) as response:
            if response.status != 200:
                return None
                
            data = await response.json()
            exchange_rate = data.get('exchangeRate')
            
            if not exchange_rate:
                return None
                
            fee = float(data.get('transferFee', 0))
            exchange_rate = float(exchange_rate)
            recipient_gets = (send_amount - fee) * exchange_rate
            
            return {
                "provider": "Hanpass", 
                "exchange_rate": exchange_rate, 
                "fee": fee, 
                "recipient_gets": recipient_gets, 
                "link": "https://www.hanpass.com/"
            }
    except (asyncio.TimeoutError, aiohttp.ClientError):
        return None
    except Exception as e:
        print(f"Hanpass Error: {type(e).__name__} - {e}")
        return None

async def get_cross_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        url = 'https://crossenf.com/api/v4/remit/quote/'
        platform_mapping = { "vietnam": 144, "philippines": 20, "indonesia": 68, "thailand": 60, "nepal": 85, "cambodia": 150, "myanmar": 235, "uzbekistan": 233, "bangladesh": 76, "mongolia": 250, "srilanka": 75 }
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

            fee = quote_data.get('fee', 0)
            if fee == 0:
                fee = 5000.0  # Default fee if not provided
            
            # Calculate recipient gets using service_rate (foreign currency per KRW)
            calculated_recipient_gets = (send_amount - fee) * service_rate
            
            # Calculate exchange rate as sending_amount / receiving_amount
            if calculated_recipient_gets > 0:
                exchange_rate = send_amount / calculated_recipient_gets
                # For VND and IDR, multiply by 100 to match display format
                if receive_currency == "VND" or receive_currency == "IDR":
                    exchange_rate = exchange_rate * 100
            else:
                exchange_rate = 0
            
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

async def get_gmeremit_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        url = "https://online.gmeremit.com/ExchangeRate.aspx"
        
        country_name = GMEREMIT_COUNTRY_NAMES.get(receive_country)
        delivery_method = GMEREMIT_DELIVERY_METHODS.get(receive_country, "2")
        
        if not country_name:
            return None
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': 'https://online.gmeremit.com',
            'Referer': 'https://online.gmeremit.com/ExchangeRate.aspx?width=auto'
        }
        
        data = {
            'method': 'GetExRate',
            'pCurr': receive_currency,
            'pCountryName': country_name,
            'collCurr': 'KRW',
            'deliveryMethod': delivery_method,
            'cAmt': str(send_amount),
            'pAmt': '-',
            'cardOnline': 'false',
            'calBy': 'C'
        }
        
        async with session.post(url, data=data, headers=headers) as response:
            if response.status != 200:
                return None
            
            result = await response.json()
            
            if result.get('errorCode') != '0':
                return None
            
            sc_charge = result.get('scCharge')
            ex_rate = result.get('exRate')
            p_amt = result.get('pAmt')
            
            if (not sc_charge or sc_charge == 'null' or 
                not ex_rate or ex_rate == 'null' or 
                not p_amt or p_amt == 'null'):
                return None
            
            try:
                fee = float(sc_charge.replace(',', ''))
                exchange_rate = float(ex_rate)
                recipient_gets = float(p_amt.replace(',', ''))
            except (ValueError, TypeError):
                return None
            
            if exchange_rate <= 0 or recipient_gets <= 0:
                return None
            
            return {
                "provider": "GME Remit",
                "exchange_rate": exchange_rate,
                "fee": fee,
                "recipient_gets": recipient_gets,
                "link": "https://www.gmeremit.com/"
            }
            
    except Exception as e:
        print(f"GME Remit Error: {type(e).__name__} - {e}")
        return None

async def get_jpremit_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        url = "https://www.jpremit.co.kr/default.aspx/calcfee"
        
        # Check if currency is supported by JP Remit
        jpremit_currency = JPREMIT_CURRENCIES.get(receive_country)
        if not jpremit_currency or jpremit_currency != receive_currency:
            return None
        
        headers = {
            'Content-Type': 'application/json;',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': 'https://www.jpremit.co.kr',
            'Referer': 'https://www.jpremit.co.kr/'
        }
        
        data = {
            'sendmoney': f"{send_amount:,}",
            'receiveMoney': 0,
            'type': 'Bank Transfer',
            'country': receive_currency,
            'id': 'country'
        }
        
        async with session.post(url, json=data, headers=headers) as response:
            if response.status != 200:
                return None
            
            result = await response.json()
            d_data = result.get('d', {})
            
            service_fee = d_data.get('ServiceFee')
            customer_rate = d_data.get('customer_rate')
            
            if not service_fee or not customer_rate:
                return None
            
            try:
                fee = float(service_fee)
                exchange_rate = float(customer_rate)
            except (ValueError, TypeError):
                return None
            
            if exchange_rate <= 0:
                return None
            
            recipient_gets = (send_amount - fee) * exchange_rate
            
            return {
                "provider": "JP Remit",
                "exchange_rate": exchange_rate,
                "fee": fee,
                "recipient_gets": recipient_gets,
                "link": "https://www.jpremit.co.kr/"
            }
            
    except Exception as e:
        print(f"JP Remit Error: {type(e).__name__} - {e}")
        return None

async def get_themoin_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        url = "https://web-api.ma.prd.themoin.com/v0/quote/ma"
        
        # Check if country/currency is supported by The Moin
        themoin_country = THEMOIN_COUNTRY_CODES.get(receive_country)
        themoin_currency = THEMOIN_CURRENCIES.get(receive_country)
        
        if (not themoin_country or not themoin_currency or 
            themoin_currency != receive_currency):
            return None
        
        headers = {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'Origin': 'https://www.themoin.com',
            'Referer': 'https://www.themoin.com/',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
        
        data = {
            'targetCountry': themoin_country,
            'targetCurrency': receive_currency,
            'fixedSide': 'SEND',
            'transferAmount': send_amount,
            'couponTicketId': ''
        }
        
        async with session.post(url, json=data, headers=headers) as response:
            if response.status != 200:
                return None
            
            result = await response.json()
            
            if result.get('ret') != 'success':
                return None
            
            quote_v2 = result.get('quoteV2', {})
            
            fee_amount = quote_v2.get('feeAmount', {})
            destination_amount = quote_v2.get('destinationAmount', {})
            
            if not fee_amount or not destination_amount:
                return None
            
            fee = fee_amount.get('amount', 0)
            recipient_gets = destination_amount.get('amount', 0)
            
            if fee is None or recipient_gets is None or recipient_gets <= 0:
                return None
            
            # Calculate exchange rate: recipient_gets / (send_amount - fee)
            exchange_rate = recipient_gets / (send_amount - fee)
            
            return {
                "provider": "The Moin",
                "exchange_rate": exchange_rate,
                "fee": fee,
                "recipient_gets": recipient_gets,
                "link": "https://www.themoin.com/"
            }
            
    except Exception as e:
        print(f"The Moin Error: {type(e).__name__} - {e}")
        return None

async def get_wirebarley_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        # Get country code for Wirebarley
        country_code = WIREBARLEY_COUNTRIES.get(receive_country)
        if not country_code:
            return None
            
        url = f"https://www.wirebarley.com/my/remittance/api/v1/exrate/KR/KRW"
        
        headers = {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'Referer': 'https://www.wirebarley.com/',
            'device-type': 'WEB',
            'device-model': 'Safari',
            'device-version': '604.1',
            'lang': 'ko'
        }
        
        async with session.get(url, headers=headers) as response:
            if response.status != 200:
                return None
                
            result = await response.json()
            
            if result.get('status') != 0:
                return None
                
            data = result.get('data', {})
            ex_rates = data.get('exRates', [])
            
            # Find matching country and currency
            matching_rate = None
            for rate in ex_rates:
                if (rate.get('country') == country_code and 
                    rate.get('currency') == receive_currency):
                    matching_rate = rate
                    break
            
            if not matching_rate:
                return None
                
            wb_rate_data = matching_rate.get('wbRateData', {})
            transfer_fees = matching_rate.get('transferFees', [])
            
            # Get appropriate exchange rate based on send amount
            exchange_rate = wb_rate_data.get('wbRate', 0)
            
            # Apply amount-based rate tiers
            threshold1 = wb_rate_data.get('threshold1')
            if threshold1 and send_amount >= threshold1:
                exchange_rate = wb_rate_data.get('wbRate1', exchange_rate)
            
            threshold2 = wb_rate_data.get('threshold2')  
            if threshold2 and send_amount >= threshold2:
                exchange_rate = wb_rate_data.get('wbRate2', exchange_rate)
                
            threshold3 = wb_rate_data.get('threshold3')
            if threshold3 and send_amount >= threshold3:
                exchange_rate = wb_rate_data.get('wbRate3', exchange_rate)
                
            threshold4 = wb_rate_data.get('threshold4')
            if threshold4 and send_amount >= threshold4:
                exchange_rate = wb_rate_data.get('wbRate4', exchange_rate)
                
            threshold5 = wb_rate_data.get('threshold5')
            if threshold5 and send_amount >= threshold5:
                exchange_rate = wb_rate_data.get('wbRate5', exchange_rate)
                
            threshold6 = wb_rate_data.get('threshold6')
            if threshold6 and send_amount >= threshold6:
                exchange_rate = wb_rate_data.get('wbRate6', exchange_rate)
                
            threshold7 = wb_rate_data.get('threshold7')
            if threshold7 and send_amount >= threshold7:
                exchange_rate = wb_rate_data.get('wbRate7', exchange_rate)
                
            threshold8 = wb_rate_data.get('threshold8')
            if threshold8 and send_amount >= threshold8:
                exchange_rate = wb_rate_data.get('wbRate8', exchange_rate)
                
            # wbRate9 is usually the highest tier rate
            if wb_rate_data.get('wbRate9'):
                exchange_rate = wb_rate_data.get('wbRate9', exchange_rate)
            
            if not exchange_rate or exchange_rate <= 0:
                return None
                
            # Get fee for send amount
            fee = 0
            for fee_info in transfer_fees:
                if (fee_info.get('min', 0) <= send_amount <= fee_info.get('max', float('inf'))):
                    threshold1 = fee_info.get('threshold1')
                    if threshold1 and send_amount >= threshold1:
                        fee = fee_info.get('fee2', 0) or 0
                    else:
                        fee = fee_info.get('fee1', 0) or 0
                    break
            
            recipient_gets = (send_amount - fee) * exchange_rate
            
            return {
                "provider": "Wirebarley",
                "exchange_rate": exchange_rate,
                "fee": fee,
                "recipient_gets": recipient_gets,
                "link": "https://www.wirebarley.com/"
            }
            
    except Exception as e:
        print(f"Wirebarley Error: {type(e).__name__} - {e}")
        return None

async def get_sbicosmoney_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        # Get country and currency for SBI Cosmoney
        country_id = SBICOSMONEY_COUNTRIES.get(receive_country)
        sbi_currency = SBICOSMONEY_CURRENCIES.get(receive_country)
        
        if (not country_id or not sbi_currency or 
            sbi_currency != receive_currency):
            return None
        
        url = "https://www.sbicosmoney.com/calc/amount"
        
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': 'https://www.sbicosmoney.com',
            'Referer': 'https://www.sbicosmoney.com/',
            'device': 'Safari',
            'deviceid': 'hardware1',
            'hardware2': '6',
            'os': 'MOBILE-WEB',
            'sbicosmoney_locale': 'ko'
        }
        
        data = {
            'countryId': country_id,
            'currency': receive_currency,
            'osInfo': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
        }
        
        async with session.post(url, json=data, headers=headers) as response:
            # Check content type to see if we got JSON
            content_type = response.headers.get('content-type', '')
            if 'application/json' not in content_type:
                return None
                
            if response.status != 200:
                return None
                
            result = await response.json()
            
            exchange_rate = result.get('exchangeRate')
            
            if not exchange_rate or exchange_rate <= 0:
                return None
            
            # No fee for now - just exchange rate calculation
            fee = 0.0
            recipient_gets = send_amount * exchange_rate
            
            return {
                "provider": "SBI Cosmoney",
                "exchange_rate": exchange_rate,
                "fee": fee,
                "recipient_gets": recipient_gets,
                "link": "https://www.sbicosmoney.com/"
            }
            
    except Exception as e:
        print(f"SBI Cosmoney Error: {type(e).__name__} - {e}")
        return None

async def get_e9pay_quote(session: aiohttp.ClientSession, send_amount: int, receive_currency: str, receive_country: str) -> Optional[Dict]:
    try:
        url = "https://www.e9pay.co.kr/cmm/calcExchangeRate.do"
        
        # Get country code for E9Pay
        recv_code = E9PAY_RECV_CODES.get(receive_country)
        if not recv_code:
            return None
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': 'https://www.e9pay.co.kr',
            'Referer': 'https://www.e9pay.co.kr/'
        }
        
        data = {
            'DEFRAY_AMOUNT': str(send_amount),
            'SEND_NATN_COD': 'KR',
            'CRNCY_COD': 'KRW',
            'RCVER_EXPECT_NATN_COD': recv_code,
            'RCVER_EXPECT_CRNCY_COD': receive_currency,
            'SIMULATION_YN': 'Y',
            'OVSE_FEE_PROMOTION_YN': 'N',
            'LANG_COD': ''
        }
        
        async with session.post(url, data=data, headers=headers) as response:
            if response.status != 200:
                return None
            
            result = await response.json()
            
            if result.get('responseCode') != 'S':
                return None
            
            # Parse the nested JSON data
            data_str = result.get('data', '{}')
            try:
                parsed_data = json.loads(data_str)
            except json.JSONDecodeError:
                return None
            
            if parsed_data.get('RESULT_COD') != 'S':
                return None
            
            # Get recipient amount
            recipient_amount_str = parsed_data.get('RCVER_EXPECT_RECPT_AMOUNT', '0')
            
            try:
                recipient_gets = float(recipient_amount_str)
                
                # E9Pay uses fixed fees based on remittance method from their frontend
                # These are predefined fees, not calculated by API
                fee_mapping = {
                    "PH15": 3000,  # Gcash
                    "PH13": 5000,  # BDO 계좌송금
                    "PH03": 5000,  # 캐시픽업 PHP
                    "PH11": 5000,  # 계좌송금 PHP
                    "PH09": 5000,  # PAYMAYA
                    "PH07": 5000,  # COINS.PH
                    "VN15": 5000,  # 베트남 계좌송금
                    "VN14": 5000,  # 베트남 모바일월렛
                    "VN06": 7000,  # 베트남 캐시픽업
                    "VN07": 10000, # 베트남 홈딜리버리
                    "VN05": 7000,  # 베트남 캐시픽업 USD
                    "VN08": 10000, # 베트남 홈딜리버리 USD
                    "LK03": 5000,  # 스리랑카 계좌송금
                    "LK09": 5000,  # 스리랑카 FINANCE AND LEASING
                    "LK08": 5000,  # 스리랑카 계좌송금 USD
                    "ID01": 5000,  # 인도네시아 계좌송금
                    "TH03": 5000,  # 태국 카시콘 계좌송금
                    "TH02": 5000,  # 태국 계좌송금
                    "MM01": 8000,  # 미얀마 계좌송금 CB
                    "MM05": 8000,  # 미얀마 계좌송금 KBZ
                    "MM04": 5000,  # 미얀마 KBZ 월렛송금
                    "NP": 5000,    # 네팔 계좌송금
                    "NP01": 5000,  # 네팔 캐시픽업
                    "NP04": 5000,  # 네팔 E-WALLET
                    "BD01": 5000,  # 방글라데시 캐시픽업
                    "BD02": 3000   # 방글라데시 BKASH
                }
                
                fee = fee_mapping.get(recv_code, 5000)  # Default to 5000 if not found
                    
            except (ValueError, TypeError):
                return None
            
            if recipient_gets <= 0:
                return None
            
            # Calculate exchange rate: recipient_gets / (send_amount - fee)
            effective_send_amount = send_amount - fee
            if effective_send_amount <= 0:
                return None
                
            exchange_rate = recipient_gets / effective_send_amount
            
            return {
                "provider": "E9Pay",
                "exchange_rate": exchange_rate,
                "fee": fee,
                "recipient_gets": recipient_gets,
                "link": "https://www.e9pay.co.kr/"
            }
            
    except Exception as e:
        print(f"E9Pay Error: {type(e).__name__} - {e}")
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

# --- Performance Optimized API Logic ---
async def fetch_all_quotes(send_amount: int, receive_currency: str, receive_country: str) -> List[Dict]:
    """
    Performance optimized quote fetching with:
    - Individual timeouts per request (2s max)
    - Connection pooling and reuse
    - TCP connection limits
    - DNS caching
    """
    
    # Optimized timeout and connector settings
    timeout = aiohttp.ClientTimeout(
        total=2.5,        # Total timeout for entire request
        connect=0.5,      # Connection timeout
        sock_read=0.3     # Socket read timeout
    )
    
    # Connection pooling with limits
    connector = aiohttp.TCPConnector(
        limit=100,          # Total connection pool size
        limit_per_host=10,  # Max connections per host
        ttl_dns_cache=300,  # DNS cache TTL in seconds
        use_dns_cache=True,
        keepalive_timeout=30,
        enable_cleanup_closed=True,
        force_close=True    # Force close connections to avoid hanging
    )
    
    async with aiohttp.ClientSession(
        timeout=timeout,
        connector=connector,
        headers={
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        }
    ) as session:
        
        # Create tasks with individual timeouts
        tasks = [
            asyncio.wait_for(
                get_hanpass_quote(session, send_amount, receive_currency, receive_country),
                timeout=2.0
            ),
            asyncio.wait_for(
                get_cross_quote(session, send_amount, receive_currency, receive_country),
                timeout=2.0
            ),
            asyncio.wait_for(
                get_gmoneytrans_quote(session, send_amount, receive_currency, receive_country),
                timeout=2.0
            ),
            asyncio.wait_for(
                get_coinshot_quote(session, send_amount, receive_currency, receive_country),
                timeout=2.0
            ),
            asyncio.wait_for(
                get_gmeremit_quote(session, send_amount, receive_currency, receive_country),
                timeout=2.0
            ),
            asyncio.wait_for(
                get_jpremit_quote(session, send_amount, receive_currency, receive_country),
                timeout=2.0
            ),
            asyncio.wait_for(
                get_themoin_quote(session, send_amount, receive_currency, receive_country),
                timeout=2.0
            ),
            asyncio.wait_for(
                get_wirebarley_quote(session, send_amount, receive_currency, receive_country),
                timeout=2.0
            ),
            asyncio.wait_for(
                get_e9pay_quote(session, send_amount, receive_currency, receive_country),
                timeout=2.0
            )
        ]
        
        # Execute with as_completed for fastest response
        results = []
        start_time = time.time()
        
        try:
            # Use asyncio.gather with return_exceptions=True for parallel execution
            completed_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Filter successful results
            for result in completed_results:
                if result and isinstance(result, dict):
                    results.append(result)
                elif isinstance(result, Exception):
                    print(f"Task failed: {type(result).__name__}: {result}")
                    
        except Exception as e:
            print(f"Error in fetch_all_quotes: {e}")
        
        execution_time = time.time() - start_time
        print(f"🚀 Total execution time: {execution_time:.2f}s, Results: {len(results)}")
        
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
    
    # Check cache first
    if cache_key in cache:
        cached_data = cache[cache_key]
        print(f"📋 Cache hit for {cache_key}")
        return cached_data

    start_time = time.time()
    print(f"🔄 Processing request: {country_lower} -> {currency_upper}, Amount: {send_amount}")
    
    try:
        # Reduced timeout to 3 seconds total
        quotes = await asyncio.wait_for(
            fetch_all_quotes(send_amount, currency_upper, country_lower), 
            timeout=3.0
        )
        
        if not quotes:
            raise HTTPException(status_code=404, detail="No providers available for this route.")

        # Sort by recipient_gets (highest first)
        sorted_quotes = sorted(quotes, key=lambda x: x.get('recipient_gets', 0), reverse=True)
        
        response_data = {
            "results": sorted_quotes,
            "best_rate_provider": sorted_quotes[0] if sorted_quotes else None,
        }
        
        # Cache the response
        cache[cache_key] = response_data
        
        total_time = time.time() - start_time
        print(f"✅ Request completed in {total_time:.2f}s, Found {len(quotes)} quotes")
        
        return response_data
        
    except asyncio.TimeoutError:
        print(f"⏰ Request timed out after 3s")
        raise HTTPException(status_code=408, detail="Request timed out.")
    except Exception as e:
        print(f"❌ Unhandled API error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
