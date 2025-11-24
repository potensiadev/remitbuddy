# RemitBuddy - Backend API Documentation

**Document Version:** 1.0
**Last Updated:** 2025-11-24
**Base URL**: https://remitbuddy-production.up.railway.app

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [API Endpoints](#api-endpoints)
5. [Provider Implementations](#provider-implementations)
6. [Error Codes](#error-codes)
7. [Response Formats](#response-formats)

---

## API Overview

### Technology Stack
- **Framework**: FastAPI (Python 3.11)
- **HTTP Client**: aiohttp (async)
- **Server**: Uvicorn with standard mode
- **Caching**: cachetools.TTLCache (60s TTL)

### Base URL
```
Production: https://remitbuddy-production.up.railway.app
Development: http://localhost:8000
```

### API Documentation
FastAPI provides automatic interactive documentation:
- **Swagger UI**: https://remitbuddy-production.up.railway.app/docs
- **ReDoc**: https://remitbuddy-production.up.railway.app/redoc

---

## Authentication

**None required** - The API is completely public.

**Rate Limiting**: 15 requests per 60 seconds per IP address.

---

## Rate Limiting

### Configuration
```python
RATE_LIMIT = 15                    # Max requests per window
RATE_LIMIT_WINDOW = 60             # Time window in seconds
```

### Rate Limit Headers
Currently not implemented. Future enhancement:
```
X-RateLimit-Limit: 15
X-RateLimit-Remaining: 12
X-RateLimit-Reset: 1640000000
```

### Rate Limit Exceeded
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "Too many requests."
}
```

---

## API Endpoints

### 1. Health Check

#### `GET /`
Basic health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "RemitBuddy API is running"
}
```

---

### 2. Get Remittance Quote (Main Endpoint)

#### `GET /api/getRemittanceQuote`

Fetch real-time remittance quotes from all providers.

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `send_amount` | integer | Yes | Amount to send in KRW | 100000 |
| `receive_country` | string | Yes | Destination country (lowercase) | vietnam |
| `receive_currency` | string | Yes | Destination currency (uppercase) | VND |

**Supported Countries:**
- vietnam (VND)
- philippines (PHP)
- nepal (NPR)
- thailand (THB)
- myanmar (MMK)
- indonesia (IDR)
- cambodia (KHR)
- uzbekistan (UZS)
- srilanka (LKR)
- bangladesh (BDT)

**Example Request:**
```bash
curl "https://remitbuddy-production.up.railway.app/api/getRemittanceQuote?send_amount=100000&receive_country=vietnam&receive_currency=VND"
```

**Success Response (200 OK):**
```json
{
  "results": [
    {
      "provider": "Hanpass",
      "exchange_rate": 0.0234,
      "fee": 3000,
      "recipient_gets": 2270500,
      "link": "https://www.hanpass.com/"
    },
    {
      "provider": "Wirebarley",
      "exchange_rate": 0.0232,
      "fee": 2500,
      "recipient_gets": 2262400,
      "link": "https://www.wirebarley.com/"
    }
  ],
  "best_rate_provider": {
    "provider": "Hanpass",
    "exchange_rate": 0.0234,
    "fee": 3000,
    "recipient_gets": 2270500,
    "link": "https://www.hanpass.com/"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "No providers available for the requested country and currency."
}
```

**Error Response (408 Request Timeout):**
```json
{
  "error": "Request timeout. Please try again."
}
```

**Cache Behavior:**
- **TTL**: 60 seconds
- **Cache Key**: `{country}:{currency}:{amount}`
- **Cache Hit**: Returns cached data immediately (~50ms)
- **Cache Miss**: Scrapes all providers (~2-3s)

---

### 3. Detailed Health Check

#### `GET /health/detailed`

Get detailed system metrics and health information.

**Response:**
```json
{
  "status": "ok",
  "memory": {
    "total": 536870912,
    "available": 402653184,
    "percent": 25.0,
    "used": 134217728
  },
  "cpu": 15.3,
  "cache_size": 147,
  "timestamp": "2025-11-24T10:30:45.123456"
}
```

---

### 4. Readiness Probe

#### `GET /health/ready`

Kubernetes-style readiness probe.

**Response:**
```json
{
  "status": "ready"
}
```

---

### 5. Liveness Probe

#### `GET /health/live`

Kubernetes-style liveness probe.

**Response:**
```json
{
  "status": "alive"
}
```

---

### 6. Hanpass Connection Stats (Debug)

#### `GET /debug/hanpass-stats`

Get Hanpass connection statistics and IP blocking status.

**Response:**
```json
{
  "total_requests": 245,
  "successful_requests": 238,
  "success_rate": "97.1%",
  "consecutive_failures": 0,
  "force_proxy_mode": false,
  "force_proxy_remaining_minutes": 0
}
```

---

### 7. Hanpass Test (Debug)

#### `GET /debug/test-hanpass`

Test Hanpass API connection manually.

**Query Parameters:**
- `send_amount` (integer): Amount to send
- `country` (string): Destination country
- `currency` (string): Destination currency

**Response:**
```json
{
  "success": true,
  "data": { /* quote data */ },
  "used_proxy": false
}
```

---

### 8. Proxy Statistics (Admin)

#### `GET /admin/proxy/stats`

Get proxy usage statistics.

**Response:**
```json
{
  "1.2.3.4": {
    "requests": 145,
    "failures": 3,
    "last_used": 1700000000.123,
    "blocked_until": 0,
    "concurrent_requests": 2
  },
  "5.6.7.8": {
    "requests": 89,
    "failures": 1,
    "last_used": 1700000005.456,
    "blocked_until": 0,
    "concurrent_requests": 0
  }
}
```

---

### 9. Proxy Health Check (Admin)

#### `POST /admin/proxy/health-check`

Manually trigger health check for all proxies.

**Response:**
```json
{
  "status": "completed",
  "results": {
    "1.2.3.4": true,
    "5.6.7.8": false
  }
}
```

---

### 10. Test Single Proxy (Admin)

#### `GET /admin/proxy/test/{proxy_ip}`

Test a specific proxy's connectivity.

**Path Parameters:**
- `proxy_ip`: IP address of the proxy

**Response:**
```json
{
  "proxy_ip": "1.2.3.4",
  "success": true,
  "response_time_ms": 234
}
```

---

## Provider Implementations

### Provider Overview

| Provider | Endpoint Type | Complexity | Special Features |
|----------|--------------|------------|------------------|
| Hanpass | JSON API | ⭐⭐⭐⭐ | IP blocking detection, proxy fallback |
| Cross | JSON API | ⭐⭐ | Manual deposit platform |
| GmoneyTrans | ASP Endpoint | ⭐⭐⭐⭐ | Regex parsing required |
| GME Remit | AJAX Endpoint | ⭐⭐⭐ | Multiple delivery methods |
| JP Remit | JSON API | ⭐⭐ | Bank transfer focused |
| The Moin | JSON API | ⭐⭐ | Japan/Thailand specialist |
| Wirebarley | JSON API | ⭐⭐⭐⭐⭐ | 8-tier rate system |
| SBI Cosmoney | JSON API | ⭐ | Simple JSON |
| E9Pay | JSON API | ⭐⭐⭐⭐ | Complex nested JSON |
| Coinshot | JSON API | ⭐⭐ | Crypto-backed |

---

### 1. Hanpass Implementation

**File**: `backend/main.py:233-384`

**API Endpoint**: `https://app.hanpass.com/app/v1/remittance/get-cost`

**Features**:
- Smart IP blocking detection
- Automatic proxy fallback
- Circuit breaker pattern
- 3-failure threshold triggers 1-hour proxy mode

**Request Format**:
```python
json_data = {
    'inputAmount': str(send_amount),
    'inputCurrencyCode': 'KRW',
    'fromCurrencyCode': 'KRW',
    'toCurrencyCode': receive_currency,
    'toCountryCode': country_code,  # 2-letter code (VN, PH, etc.)
    'memberSeq': '1',
    'lang': 'ko'
}
```

**Response Parsing**:
```python
{
    "resultCode": "0",           # "0" = success
    "exchangeRate": "0.0234",    # Float as string
    "toAmount": "2270500",       # Float as string
    "transferFee": "3000"        # Float as string
}
```

**Country Code Mapping**:
```python
COUNTRY_CODES = {
    "vietnam": "VN",
    "philippines": "PH",
    "indonesia": "ID",
    # ... etc
}
```

---

### 2. Cross Implementation

**File**: `backend/main.py:385-419`

**API Endpoint**: `https://crossenf.com/api/v4/remit/quote/`

**Features**:
- Manual deposit platform
- Platform ID-based routing

**Platform ID Mapping**:
```python
platform_mapping = {
    "vietnam": 144,
    "philippines": 20,
    "indonesia": 68,
    # ... etc
}
```

**Request Format**:
```python
params = {
    "apply_user_limit": 0,
    "deposit_type": "Manual",
    "platform_id": platform_id,
    "quote_type": "send",
    "sending_amount": send_amount
}
```

**Response Parsing**:
```python
{
    "data": {
        "receiving_amount": 2270500,
        "fee": 3000,
        "pay_amount": 100000
    }
}
```

---

### 3. GmoneyTrans Implementation

**File**: `backend/main.py:421-468`

**API Endpoint**: `https://mapi.gmoneytrans.net/exratenew1/ajx_calcRate.asp`

**Features**:
- ASP legacy endpoint
- Regex parsing required
- Special handling for Uzbekistan (Humocard)

**Request Format**:
```python
params = {
    'total_collected': str(send_amount),
    'payout_country': payout_country,  # "Viet Nam", "Philippines"
    'payment_type': payment_type,      # "Bank Account" or "Humocard"
    'currencyType': receive_currency,
    'receive_amount': ''
}
```

**Response Parsing** (Regex):
```python
fee_match = re.search(r"serviceCharge--td_clm--([\d.,]+)", text_data)
rate_match = re.search(r"exchangeRate--td_clm--([\d.,]+)", text_data)

fee = float(fee_match.group(1).replace(',', ''))
exchange_rate = float(rate_match.group(1).replace(',', ''))
```

---

### 4. GME Remit Implementation

**File**: `backend/main.py:470-540`

**API Endpoint**: `https://online.gmeremit.com/ExchangeRate.aspx`

**Features**:
- AJAX endpoint
- Multiple delivery methods
- Mobile user agent required

**Delivery Method Mapping**:
```python
GMEREMIT_DELIVERY_METHODS = {
    "vietnam": "2",        # Bank Deposit
    "philippines": "2",
    "uzbekistan": "1",     # Cash Payment
    # ... etc
}
```

**Request Format**:
```python
data = {
    'method': 'GetExRate',
    'pCurr': receive_currency,
    'pCountryName': country_name,  # "Vietnam", "Philippines"
    'collCurr': 'KRW',
    'deliveryMethod': delivery_method,
    'cAmt': str(send_amount),
    'pAmt': '-',
    'cardOnline': 'false',
    'calBy': 'C'
}
```

---

### 5. Wirebarley Implementation

**File**: `backend/main.py` (specific line number varies)

**API Endpoint**: `https://www.wirebarley.com/api/v1/exchange-rate`

**Features**:
- 8-tier rate system
- Amount-based rate calculation
- Complex tier logic

**Tier System**:
```python
# 8 Exchange Rate Tiers
tier_thresholds = [0, 500000, 1000000, 3000000, 5000000, 10000000, 30000000, 50000000]

# Fee Tier (threshold1)
if send_amount <= threshold1:
    fee = fee_low
else:
    fee = fee_high

# Exchange rate based on tier
exchange_rate = rate_for_tier[tier_index]
```

---

### 6. E9Pay Implementation

**File**: `backend/main.py` (specific line number varies)

**API Endpoint**: `https://www.e9pay.co.kr/api/exchange`

**Features**:
- Complex nested JSON
- Fixed fees by country/method
- Multiple payment methods

**Fee Mapping**:
```python
E9PAY_FIXED_FEES = {
    "vietnam": {"Bank Account": 3000, "Cash Pickup": 5000},
    "philippines": {"Bank Account": 3000, "Cash Pickup": 5000},
    # ... etc
}
```

**Response Format**:
```python
{
    "data": {
        "rates": {
            "VN03": {  # Receive code
                "methods": {
                    "bank": {
                        "rate": 0.0234,
                        "fee": 3000
                    }
                }
            }
        }
    }
}
```

---

## Error Codes

### HTTP Status Codes

| Code | Meaning | Cause | Solution |
|------|---------|-------|----------|
| 200 | Success | Request completed | - |
| 404 | Not Found | No providers available | Try different country/currency |
| 408 | Request Timeout | Providers took > 3s | Retry request |
| 422 | Unprocessable Entity | Invalid input | Check parameters |
| 429 | Too Many Requests | Rate limit exceeded | Wait 60 seconds |
| 500 | Internal Server Error | Unexpected server error | Contact support |

### Error Response Format

```json
{
  "error": "Human-readable error message"
}
```

---

## Response Formats

### Quote Result Object

```typescript
interface QuoteResult {
  provider: string;           // Provider name (e.g., "Hanpass")
  exchange_rate: number;      // Exchange rate (e.g., 0.0234)
  fee: number;                // Transfer fee in KRW (e.g., 3000)
  recipient_gets: number;     // Final amount recipient receives (e.g., 2270500)
  link: string;               // Provider website URL
}
```

### API Response Object

```typescript
interface ApiResponse {
  results: QuoteResult[];           // All available quotes
  best_rate_provider: QuoteResult | null;  // Best quote (highest recipient_gets)
}
```

---

## Country/Currency Mappings

### Supported Combinations

| Country | Code | Currency | Providers |
|---------|------|----------|-----------|
| Vietnam | vietnam | VND | All 10 |
| Philippines | philippines | PHP | All 10 |
| Nepal | nepal | NPR | 9 (no Coinshot) |
| Thailand | thailand | THB | All 10 |
| Myanmar | myanmar | MMK | 8 |
| Indonesia | indonesia | IDR | All 10 |
| Cambodia | cambodia | KHR | 7 |
| Uzbekistan | uzbekistan | UZS | 6 |
| Sri Lanka | srilanka | LKR | 7 |
| Bangladesh | bangladesh | BDT | 7 |

---

## Performance Characteristics

### Response Times

| Scenario | Response Time | Notes |
|----------|---------------|-------|
| Cache Hit | 50-100ms | Immediate return from memory |
| Cache Miss (Success) | 2-3s | All providers respond within 2s |
| Cache Miss (Partial) | 3s | Some providers timeout |
| Cache Miss (All Fail) | 3s | All providers timeout/error |

### Timeout Configuration

```python
# Per-provider timeout
provider_timeout = 2s

# Total request timeout
total_timeout = 3s

# Cache TTL
cache_ttl = 60s
```

---

## Development Examples

### Python Example

```python
import requests

url = "https://remitbuddy-production.up.railway.app/api/getRemittanceQuote"
params = {
    "send_amount": 100000,
    "receive_country": "vietnam",
    "receive_currency": "VND"
}

response = requests.get(url, params=params)
data = response.json()

best_provider = data["best_rate_provider"]
print(f"Best rate: {best_provider['provider']}")
print(f"Recipient gets: {best_provider['recipient_gets']} VND")
```

### JavaScript Example

```javascript
const url = new URL('https://remitbuddy-production.up.railway.app/api/getRemittanceQuote');
url.searchParams.append('send_amount', 100000);
url.searchParams.append('receive_country', 'vietnam');
url.searchParams.append('receive_currency', 'VND');

fetch(url)
  .then(res => res.json())
  .then(data => {
    const best = data.best_rate_provider;
    console.log(`Best rate: ${best.provider}`);
    console.log(`Recipient gets: ${best.recipient_gets} VND`);
  });
```

### cURL Example

```bash
curl -X GET "https://remitbuddy-production.up.railway.app/api/getRemittanceQuote?send_amount=100000&receive_country=vietnam&receive_currency=VND"
```

---

**Next Document**: [03-FRONTEND.md](./03-FRONTEND.md) - Frontend architecture and components
