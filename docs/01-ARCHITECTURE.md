# RemitBuddy - Detailed Architecture

**Document Version:** 1.0
**Last Updated:** 2025-11-24

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Design Patterns](#design-patterns)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [Caching Strategy](#caching-strategy)
6. [Proxy Management](#proxy-management)
7. [Error Handling](#error-handling)
8. [Security Architecture](#security-architecture)
9. [Performance Optimization](#performance-optimization)

---

## System Architecture

### Overview

RemitBuddy follows a **stateless, microservices-inspired architecture** with clear separation between frontend and backend:

```
┌───────────────────────────────────────────────────────────────────┐
│                           CLIENT TIER                              │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Browser (Chrome, Safari, Firefox, Mobile Browsers)         │  │
│  │  • JavaScript Execution                                     │  │
│  │  • Service Worker (future)                                  │  │
│  │  • Local Storage (minimal)                                  │  │
│  └─────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬────────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌───────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER                           │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  NETLIFY CDN + EDGE NETWORK                                 │  │
│  │  ┌───────────────────────────────────────────────────────┐  │  │
│  │  │  Next.js 14 Application                               │  │  │
│  │  │  • React 18 Components                                │  │  │
│  │  │  • Server-Side Rendering (SSR)                        │  │  │
│  │  │  • Static Site Generation (SSG)                       │  │  │
│  │  │  • API Routes (minimal - for logging)                 │  │  │
│  │  │  • i18n Middleware (11 languages)                     │  │  │
│  │  └───────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬────────────────────────────────────────┘
                           │ HTTPS REST API
                           ▼
┌───────────────────────────────────────────────────────────────────┐
│                        APPLICATION TIER                            │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  RAILWAY CONTAINER (Docker)                                 │  │
│  │  ┌───────────────────────────────────────────────────────┐  │  │
│  │  │  FastAPI Application (Python 3.11)                    │  │  │
│  │  │  ┌─────────────────────────────────────────────────┐  │  │  │
│  │  │  │  API Layer                                      │  │  │  │
│  │  │  │  • Rate Limiting Middleware                     │  │  │  │
│  │  │  │  • CORS Middleware                              │  │  │  │
│  │  │  │  • Exception Handling                           │  │  │  │
│  │  │  └─────────────────────────────────────────────────┘  │  │  │
│  │  │  ┌─────────────────────────────────────────────────┐  │  │  │
│  │  │  │  Business Logic Layer                           │  │  │  │
│  │  │  │  • Quote Aggregator                             │  │  │  │
│  │  │  │  • Provider Orchestrator                        │  │  │  │
│  │  │  │  • Cache Manager (TTLCache)                     │  │  │  │
│  │  │  └─────────────────────────────────────────────────┘  │  │  │
│  │  │  ┌─────────────────────────────────────────────────┐  │  │  │
│  │  │  │  Provider Scraper Layer (10 modules)            │  │  │  │
│  │  │  │  • Hanpass Scraper                              │  │  │  │
│  │  │  │  • Cross Scraper                                │  │  │  │
│  │  │  │  • GmoneyTrans Scraper                          │  │  │  │
│  │  │  │  • [7 more scrapers...]                         │  │  │  │
│  │  │  └─────────────────────────────────────────────────┘  │  │  │
│  │  │  ┌─────────────────────────────────────────────────┐  │  │  │
│  │  │  │  Infrastructure Layer                           │  │  │  │
│  │  │  │  • Proxy Manager (rotating pool)                │  │  │  │
│  │  │  │  • Hanpass Connection Tracker                   │  │  │  │
│  │  │  │  • Health Check System                          │  │  │  │
│  │  │  └─────────────────────────────────────────────────┘  │  │  │
│  │  └───────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬────────────────────────────────────────┘
                           │ HTTPS (Async)
                           ▼
┌───────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Hanpass  │  │  Cross   │  │ Gmoney   │  │   GME    │  ...     │
│  │   API    │  │   API    │  │   API    │  │   API    │          │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │
└───────────────────────────────────────────────────────────────────┘
```

---

## Design Patterns

### 1. **Adapter Pattern** (Provider Scrapers)

Each provider scraper acts as an adapter that translates different provider APIs into a unified internal format:

```python
# Abstract interface (implicit in Python)
async def get_provider_quote(
    session: aiohttp.ClientSession,
    send_amount: int,
    receive_currency: str,
    receive_country: str
) -> Optional[Dict]:
    """
    Returns:
    {
        "provider": str,
        "exchange_rate": float,
        "fee": float,
        "recipient_gets": float,
        "link": str
    }
    """
    pass

# Concrete implementations
async def get_hanpass_quote(...) -> Optional[Dict]
async def get_cross_quote(...) -> Optional[Dict]
async def get_wirebarley_quote(...) -> Optional[Dict]
# ... 7 more
```

**Benefits:**
- Uniform interface for all providers
- Easy to add/remove providers
- Isolated failure handling per provider

### 2. **Facade Pattern** (API Endpoint)

The main API endpoint `/api/getRemittanceQuote` acts as a facade that:
- Orchestrates multiple provider calls
- Handles caching
- Aggregates results
- Provides a simple interface to the frontend

```python
@app.get("/api/getRemittanceQuote")
async def get_remittance_quote(
    receive_country: str,
    receive_currency: str,
    send_amount: int
):
    # Simple interface hides complex orchestration
    cache_key = f"{receive_country}:{receive_currency}:{send_amount}"

    if cache_key in cache:
        return cache[cache_key]

    # Parallel scraping (hidden complexity)
    results = await aggregate_all_providers(...)

    # Store in cache
    cache[cache_key] = results

    return results
```

### 3. **Singleton Pattern** (Cache & Proxy Manager)

Global instances ensure single source of truth:

```python
# Global cache instance
cache = TTLCache(maxsize=2048, ttl=60)

# Global proxy manager
proxy_manager = ProxyManager()

# Global Hanpass tracker
hanpass_tracker = HanpassConnectionTracker()
```

### 4. **Strategy Pattern** (Proxy Selection)

ProxyManager uses different strategies for proxy selection based on metrics:

```python
def get_best_proxy(self) -> Optional[ProxyConfig]:
    """Strategy: Select proxy with lowest score"""
    available_proxies = [p for p in self.proxies if self.is_proxy_available(p)]

    if not available_proxies:
        return None

    # Strategy: Score by concurrent requests, failure rate, total usage
    def proxy_score(proxy):
        stats = self.proxy_stats[proxy.ip]
        failure_rate = stats['failures'] / max(stats['requests'], 1)
        return (stats['concurrent_requests'], failure_rate, stats['requests'])

    return min(available_proxies, key=proxy_score)
```

### 5. **Circuit Breaker Pattern** (Hanpass IP Blocking)

HanpassConnectionTracker implements a circuit breaker to prevent continuous failures:

```python
class HanpassConnectionTracker:
    def __init__(self):
        self.consecutive_failures = 0
        self.force_proxy_until = 0  # Circuit breaker state

    def should_use_proxy(self) -> bool:
        """Circuit breaker: open (use proxy) or closed (try direct)"""
        if time.time() < self.force_proxy_until:
            return True  # Circuit OPEN - use fallback
        return False     # Circuit CLOSED - try normal

    def record_failure(self, used_proxy: bool):
        if not used_proxy:
            self.consecutive_failures += 1

            # Open circuit after 3 failures
            if self.consecutive_failures >= 3:
                self.force_proxy_until = time.time() + 3600  # 1 hour
```

**States:**
- **Closed**: Normal operation (direct connection)
- **Open**: Fallback mode (proxy connection) - lasts 1 hour
- **Half-Open**: After 1 hour, retry direct connection

### 6. **Observer Pattern** (Proxy Stats)

ProxyManager tracks proxy usage and automatically blocks unhealthy proxies:

```python
def mark_proxy_completed(self, proxy: ProxyConfig, success: bool = True):
    """Observer: React to proxy request completion"""
    stats = self.proxy_stats[proxy.ip]
    stats['concurrent_requests'] = max(0, stats['concurrent_requests'] - 1)

    if not success:
        stats['failures'] += 1

        # Automatic action on high failure rate
        failure_rate = stats['failures'] / max(stats['requests'], 1)
        if failure_rate > 0.5 and stats['requests'] > 10:
            stats['blocked_until'] = time.time() + 300  # Block for 5 minutes
            logging.warning(f"Proxy {proxy.ip} temporarily blocked")
```

### 7. **Decorator Pattern** (Middleware)

FastAPI uses middleware decorators for cross-cutting concerns:

```python
# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Custom rate limiting (implicit decorator via check_rate_limit())
@app.get("/api/getRemittanceQuote")
async def get_remittance_quote(request: Request, ...):
    client_ip = request.client.host
    check_rate_limit(client_ip)  # Decorative behavior
    # ... actual logic
```

---

## Component Architecture

### Backend Components

```
backend/
├── main.py                      # FastAPI application + all scrapers
│   ├── FastAPI App
│   │   ├── CORS Middleware
│   │   ├── Exception Handlers
│   │   └── API Endpoints
│   │       ├── GET /
│   │       ├── GET /api/getRemittanceQuote  ⭐ MAIN
│   │       ├── GET /health (multiple variants)
│   │       ├── GET /admin/proxy/stats
│   │       └── POST /admin/proxy/health-check
│   │
│   ├── Configuration
│   │   ├── Country Code Mappings (6 systems)
│   │   ├── Currency Mappings
│   │   └── Provider-specific configs
│   │
│   ├── Helper Functions
│   │   ├── check_rate_limit()
│   │   └── get_random_proxy()
│   │
│   ├── HanpassConnectionTracker Class
│   │   ├── should_use_proxy()
│   │   ├── record_success()
│   │   ├── record_failure()
│   │   └── get_stats()
│   │
│   └── 10 Provider Scraper Functions
│       ├── get_hanpass_quote()      # Most complex (IP blocking)
│       ├── get_cross_quote()
│       ├── get_gmoneytrans_quote()  # Regex parsing
│       ├── get_gmeremit_quote()     # AJAX endpoint
│       ├── get_jpremit_quote()
│       ├── get_themoin_quote()
│       ├── get_wirebarley_quote()   # Tier-based rates
│       ├── get_sbicosmoney_quote()
│       ├── get_e9pay_quote()        # Complex nested JSON
│       └── get_coinshot_quote()
│
├── proxy_manager.py             # Proxy rotation system
│   ├── ProxyConfig (dataclass)
│   ├── ProxyManager (class)
│   │   ├── add_proxy()
│   │   ├── get_best_proxy()     # Load balancing algorithm
│   │   ├── mark_proxy_used()
│   │   ├── mark_proxy_completed()
│   │   ├── is_proxy_available() # Rate limiting check
│   │   ├── test_proxy()
│   │   └── health_check_all_proxies()
│   │
│   ├── ProxySession (context manager)
│   │   ├── __aenter__()         # Acquire proxy
│   │   └── __aexit__()          # Release proxy
│   │
│   └── initialize_proxy_manager()
│
├── proxy_config.py              # Proxy configuration loader
│   └── proxy_config_manager (singleton)
│
├── requirements.txt             # Python dependencies
└── Dockerfile                   # Container definition
```

### Frontend Components

```
frontend/
├── pages/
│   ├── _app.js                  # App wrapper (i18n, analytics)
│   ├── _document.js             # HTML document structure
│   ├── index.js                 # 🏠 Main landing page
│   ├── redesign.js              # Alternative design
│   ├── blog/
│   │   ├── index.js            # Blog listing
│   │   └── [slug].js           # Dynamic blog posts
│   └── api/
│       └── log-event.js        # Event logging API route
│
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.jsx          # 7 variants (primary, secondary, etc.)
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   └── index.js            # Barrel exports
│   │
│   ├── icons/
│   │   └── index.jsx           # SVG icon components
│   │
│   ├── Footer.jsx              # Site footer with links
│   ├── HeroSection.tsx         # Hero with input form (TypeScript)
│   └── index.js                # Component exports
│
├── styles/
│   └── globals.css             # Global styles + Tailwind imports
│
├── public/
│   ├── locales/                # i18n translation files
│   │   ├── en/common.json
│   │   ├── ko/common.json
│   │   └── [9 more languages...]
│   │
│   ├── images/
│   │   └── flags/              # Country flags
│   │
│   └── logos/                  # Provider logos
│
├── lib/                        # Utility libraries
├── utils/                      # Helper functions
│
├── next.config.js              # Next.js configuration
├── next-i18next.config.js      # i18n configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Node dependencies
└── netlify.toml                # Netlify deployment config
```

---

## Data Flow

### Request Flow (Detailed)

```
1. USER ACTION
   └─> User enters amount, selects country/currency, clicks "Compare"

2. FRONTEND (Next.js)
   ├─> Validate input (amount > 0, country selected)
   ├─> Show loading state
   └─> Make API call:
       GET https://remitbuddy-production.up.railway.app/api/getRemittanceQuote
           ?send_amount=100000
           &receive_country=vietnam
           &receive_currency=VND

3. BACKEND (FastAPI) - Main Endpoint Handler
   ├─> Extract client IP from request
   ├─> Check rate limit (15 req/60s per IP)
   │   └─> If exceeded: Return 429 Too Many Requests
   │
   ├─> Generate cache key: "vietnam:VND:100000"
   ├─> Check cache (TTLCache, 60s TTL)
   │   └─> If HIT: Return cached result immediately (~50ms)
   │
   └─> If MISS: Continue to scraping phase

4. BACKEND - Provider Scraping (Parallel)
   ├─> Create async HTTP session (aiohttp)
   │
   ├─> Launch 10 parallel tasks (asyncio.gather):
   │   ├─> Task 1: get_hanpass_quote()
   │   │   ├─> Check HanpassConnectionTracker.should_use_proxy()
   │   │   ├─> If forced proxy mode:
   │   │   │   └─> ProxyManager.get_best_proxy()
   │   │   │       └─> Make request via proxy
   │   │   └─> Else:
   │   │       ├─> Try direct connection
   │   │       └─> On failure: Retry with proxy
   │   │
   │   ├─> Task 2: get_cross_quote()
   │   │   └─> Direct API call (no proxy needed)
   │   │
   │   ├─> Task 3: get_gmoneytrans_quote()
   │   │   └─> POST request with regex parsing
   │   │
   │   └─> [7 more tasks...]
   │
   ├─> Wait for all tasks (timeout: 3s total, 2s per provider)
   │   └─> Some may fail, return None - that's OK
   │
   └─> Process results

5. BACKEND - Result Aggregation
   ├─> Filter: Remove None results (failed providers)
   │
   ├─> Validate: Ensure each result has required fields
   │
   ├─> Sort: By recipient_gets (descending - highest first)
   │
   ├─> Prepare response:
   │   {
   │     "results": [all sorted results],
   │     "best_rate_provider": results[0] or None
   │   }
   │
   └─> Store in cache (60s TTL)

6. BACKEND - Response
   └─> Return JSON to frontend

7. FRONTEND - Display Results
   ├─> Hide loading state
   ├─> Render ProviderCard for each result
   │   ├─> Best result: Green badge + highlighted
   │   └─> Others: Standard card
   │
   └─> User clicks provider card
       └─> Open provider website in new tab
```

### Error Flow

```
1. Provider API Error (e.g., Hanpass returns 500)
   └─> Provider scraper catches exception
       └─> Returns None (instead of crashing)
           └─> Aggregator filters out None
               └─> Other providers still shown
                   └─> Graceful degradation ✓

2. All Providers Fail
   └─> results = []
       └─> Return 404 with error message
           └─> Frontend shows "No results found"

3. Timeout (>3s total)
   └─> asyncio.gather with timeout
       └─> Cancel pending tasks
           └─> Return partial results
               └─> Frontend shows available results

4. Rate Limit Exceeded
   └─> Return 429 Too Many Requests
       └─> Frontend shows "Please try again in a minute"

5. Invalid Input
   └─> FastAPI validation error
       └─> Return 422 Unprocessable Entity
           └─> Frontend shows validation message
```

---

## Caching Strategy

### Cache Implementation

**Technology**: `cachetools.TTLCache` (in-memory)

**Configuration**:
```python
cache = TTLCache(maxsize=2048, ttl=60)
```

### Cache Key Design

```python
cache_key = f"{receive_country}:{receive_currency}:{send_amount}"

# Examples:
# "vietnam:VND:100000"
# "philippines:PHP:50000"
# "nepal:NPR:200000"
```

**Why this design?**
- **Country + Currency**: Different countries have different providers
- **Amount**: Rates vary by amount (especially Wirebarley's tier system)
- **KRW Implicit**: All sends are from Korea (KRW)

### Cache Behavior

| Scenario | Cache Hit Rate | Response Time | Provider Load |
|----------|---------------|---------------|---------------|
| **Peak hours** (9am-6pm KST) | ~80% | ~50ms | Low |
| **Off-peak** | ~40% | ~2-3s | Medium |
| **Popular amounts** (100k, 200k) | ~90% | ~50ms | Very Low |
| **Random amounts** | ~30% | ~2-3s | High |

### Cache Eviction

**Strategy**: LRU (Least Recently Used) + TTL

1. **TTL Eviction**: After 60 seconds, entry expires automatically
2. **Size Eviction**: If cache exceeds 2048 entries, oldest is removed
3. **Manual**: No manual invalidation (time-based only)

### Cache Hit Rate Optimization

**High Hit Rate Scenarios**:
- User refreshes page within 60s
- Multiple users request same country/currency/amount
- Common amounts (100,000 KRW, 200,000 KRW, etc.)

**Low Hit Rate Scenarios**:
- Rare country/currency combinations
- Custom amounts (e.g., 137,842 KRW)
- Off-peak hours

**Future Improvements**:
1. **Amount Bucketing**: Round amounts to nearest 10,000 KRW
   - `103,500 → 100,000` for caching purposes
2. **Redis**: Distributed cache for multiple backend instances
3. **Stale-While-Revalidate**: Serve stale data while fetching fresh

---

## Proxy Management

### Proxy Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      ProxyManager                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Proxy Pool                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │
│  │  │ Proxy 1  │  │ Proxy 2  │  │ Proxy 3  │   ...      │  │
│  │  │ Score: 2 │  │ Score: 5 │  │ Score: 1 │ (BLOCKED)  │  │
│  │  └──────────┘  └──────────┘  └──────────┘            │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Proxy Stats (per proxy)                               │  │
│  │  • requests: int                                       │  │
│  │  • failures: int                                       │  │
│  │  • last_used: timestamp                                │  │
│  │  • blocked_until: timestamp                            │  │
│  │  • concurrent_requests: int                            │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Proxy Selection Algorithm                             │  │
│  │  1. Filter: is_proxy_available()                       │  │
│  │  2. Score: (concurrent, failure_rate, total_requests)  │  │
│  │  3. Select: min(score)                                 │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Proxy Selection Algorithm

```python
def get_best_proxy(self) -> Optional[ProxyConfig]:
    # Step 1: Filter available proxies
    available_proxies = [p for p in self.proxies if self.is_proxy_available(p)]

    if not available_proxies:
        return None

    # Step 2: Calculate score for each proxy
    def proxy_score(proxy):
        stats = self.proxy_stats[proxy.ip]

        # Lower is better
        failure_rate = stats['failures'] / max(stats['requests'], 1)
        concurrent = stats['concurrent_requests']
        total_usage = stats['requests']

        # Score tuple (compared left to right)
        return (concurrent, failure_rate, total_usage)

    # Step 3: Select proxy with lowest score
    return min(available_proxies, key=proxy_score)
```

**Selection Priority**:
1. **Fewest concurrent requests** (spread load)
2. **Lowest failure rate** (reliability)
3. **Least total usage** (balanced usage)

### Proxy Availability Checks

```python
def is_proxy_available(self, proxy: ProxyConfig) -> bool:
    current_time = time.time()
    stats = self.proxy_stats[proxy.ip]

    # Check 1: Not temporarily blocked
    if stats['blocked_until'] > current_time:
        return False

    # Check 2: Under concurrent request limit
    if stats['concurrent_requests'] >= proxy.max_concurrent:
        return False

    # Check 3: Under rate limit (requests per minute)
    if stats['last_used'] > current_time - 60:
        if stats['requests'] >= proxy.rate_limit_per_minute:
            return False

    return True
```

### Proxy Configuration

**Environment Variables** (Railway):
```bash
# Option 1: Single proxy URL
HANPASS_PROXY_URL=http://user:pass@proxy.example.com:8080

# Option 2: Multiple proxies (colon-separated)
HANPASS_PROXY_1=1.2.3.4:8080:username:password
HANPASS_PROXY_2=5.6.7.8:8080:username:password
HANPASS_PROXY_3=9.10.11.12:8080:username:password
```

**JSON File** (`proxy_config.json` - gitignored):
```json
[
  {
    "ip": "1.2.3.4",
    "port": 8080,
    "username": "user1",
    "password": "pass1",
    "protocol": "http",
    "max_concurrent": 5,
    "rate_limit_per_minute": 30
  },
  {
    "ip": "5.6.7.8",
    "port": 8080,
    "username": "user2",
    "password": "pass2",
    "protocol": "https",
    "max_concurrent": 10,
    "rate_limit_per_minute": 60
  }
]
```

### User-Agent Rotation

8 different user agents to avoid detection:

```python
self.user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ...',  # Chrome Windows
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit ...',   # Chrome macOS
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ...',            # Chrome Linux
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) ...',        # Safari iPhone
    'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) ...',                 # Safari iPad
    'Mozilla/5.0 (Android 10; Mobile; rv:89.0) Gecko/89.0 ...',          # Firefox Android
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) ...',            # Firefox Windows
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) ...',        # Firefox macOS
]
```

### Hanpass IP Blocking Detection

**Problem**: Hanpass API blocks IPs after too many requests

**Solution**: HanpassConnectionTracker with automatic proxy fallback

```python
class HanpassConnectionTracker:
    def __init__(self):
        self.consecutive_failures = 0      # Track failure streak
        self.force_proxy_until = 0         # Timestamp for forced proxy mode
        self.total_requests = 0
        self.successful_requests = 0

    def should_use_proxy(self) -> bool:
        """Decide: direct or proxy?"""
        if time.time() < self.force_proxy_until:
            return True  # In forced proxy mode
        return False     # Try direct connection

    def record_failure(self, used_proxy: bool):
        """React to failure"""
        if not used_proxy:  # Direct connection failed
            self.consecutive_failures += 1

            if self.consecutive_failures >= 3:
                # IP BLOCKED - switch to proxy for 1 hour
                self.force_proxy_until = time.time() + 3600

    def record_success(self, used_proxy: bool):
        """React to success"""
        self.consecutive_failures = 0  # Reset counter
```

**States**:
1. **Normal**: Direct connection (cost-effective)
2. **Fallback**: Single direct failure → retry with proxy
3. **Blocked**: 3 consecutive failures → proxy for 1 hour
4. **Recovery**: After 1 hour → retry direct connection

---

## Error Handling

### Error Handling Layers

```
Layer 1: Provider Scraper Level
  ├─> Try/except around API calls
  ├─> Return None on failure
  └─> Log error details

Layer 2: Aggregation Level
  ├─> Filter out None results
  ├─> Check if any results exist
  └─> Return 404 if all failed

Layer 3: FastAPI Level
  ├─> Exception handlers
  ├─> HTTP status codes
  └─> JSON error responses

Layer 4: Frontend Level
  ├─> Display user-friendly messages
  ├─> Retry options
  └─> Partial results handling
```

### Error Scenarios

| Error | Status Code | Handling | User Experience |
|-------|------------|----------|-----------------|
| **Provider API down** | 200 (partial) | Filter out failed provider | Show available results |
| **All providers fail** | 404 | Return empty results | "No results available" |
| **Timeout (>3s)** | 408 | Return partial results | Show what was received |
| **Rate limit** | 429 | Reject request | "Try again in 60s" |
| **Invalid input** | 422 | Validation error | "Invalid amount" |
| **Server error** | 500 | Log + generic response | "Something went wrong" |

### Provider-Specific Error Handling

**Example: Hanpass**
```python
async def get_hanpass_quote(...):
    try:
        # Make request
        async with session.post(url, json=json_data, headers=headers) as response:
            if response.status != 200:
                logger.warning(f"Hanpass HTTP {response.status}")
                return None

            data = await response.json()

            # Check API result code
            if data.get('resultCode') != '0':
                logger.warning(f"Hanpass API error: {data.get('resultMessage')}")
                return None

            # Validate required fields
            if not data.get('exchangeRate') or not data.get('toAmount'):
                logger.warning("Hanpass missing required fields")
                return None

            # Success path
            return {
                "provider": "Hanpass",
                "exchange_rate": float(data['exchangeRate']),
                "fee": float(data.get('transferFee', 0)),
                "recipient_gets": float(data['toAmount']),
                "link": "https://www.hanpass.com/"
            }

    except (asyncio.TimeoutError, aiohttp.ClientError) as e:
        logger.error(f"Hanpass connection error: {type(e).__name__}")
        return None

    except Exception as e:
        logger.error(f"Hanpass unexpected error: {type(e).__name__} - {e}")
        return None
```

---

## Security Architecture

### 1. Content Security Policy (CSP)

**Development CSP** (relaxed for hot-reload):
```javascript
"default-src 'self' 'unsafe-eval' 'unsafe-inline'"
"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com"
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"
...
```

**Production CSP** (strict):
```javascript
"default-src 'self'"
"script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com"
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"
"connect-src 'self' https://remitbuddynew.up.railway.app https://www.google-analytics.com"
"object-src 'none'"
"base-uri 'self'"
"form-action 'self'"
"frame-ancestors 'none'"
"upgrade-insecure-requests"
```

### 2. HTTP Security Headers

```javascript
{
  'X-Frame-Options': 'DENY',                           // Prevent clickjacking
  'X-Content-Type-Options': 'nosniff',                 // Prevent MIME sniffing
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': '...'                     // See above
}
```

### 3. CORS Configuration

```python
origins = [
    "https://www.remitbuddy.com",
    "https://remitbuddy.com",
    "https://remitbuddy.netlify.app",
    "http://localhost:3000",  # Dev only
    "http://localhost:3001",  # Dev only
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Whitelist only
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

### 4. Rate Limiting

```python
RATE_LIMIT = 15                  # Max requests
RATE_LIMIT_WINDOW = 60           # Time window (seconds)
request_timestamps = {}           # IP → [timestamps]

def check_rate_limit(client_ip: str):
    current_time = time.time()
    timestamps = request_timestamps.get(client_ip, [])

    # Keep only timestamps within window
    valid_timestamps = [ts for ts in timestamps
                        if current_time - ts < RATE_LIMIT_WINDOW]

    if len(valid_timestamps) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too many requests.")

    valid_timestamps.append(current_time)
    request_timestamps[client_ip] = valid_timestamps
```

**Limitations**:
- In-memory storage (resets on restart)
- Single instance only
- **Future**: Redis-based distributed rate limiting

### 5. Input Validation

**FastAPI automatic validation**:
```python
@app.get("/api/getRemittanceQuote")
async def get_remittance_quote(
    receive_country: str,        # Required string
    receive_currency: str,       # Required string
    send_amount: int             # Required integer
):
    # FastAPI validates types automatically
    # Returns 422 if types don't match
```

**Manual validation**:
```python
# Frontend validation
if (send_amount <= 0) {
    setError("Amount must be positive");
    return;
}

if (!selectedCountry) {
    setError("Please select a country");
    return;
}
```

---

## Performance Optimization

### 1. Parallel Provider Scraping

**Sequential** (bad): 10 providers × 2s = 20s total ❌

**Parallel** (good): max(provider times) ≈ 2-3s ✅

```python
# Launch all scrapers in parallel
tasks = [
    get_hanpass_quote(session, send_amount, receive_currency, receive_country),
    get_cross_quote(session, send_amount, receive_currency, receive_country),
    get_gmoneytrans_quote(session, send_amount, receive_currency, receive_country),
    # ... 7 more
]

# Wait for all with timeout
results = await asyncio.gather(*tasks, return_exceptions=True)
```

### 2. Timeout Configuration

```python
# Per-provider timeout: 2 seconds
timeout = aiohttp.ClientTimeout(total=2)

# Overall endpoint timeout: 3 seconds
# (enforced at gathering level)
```

### 3. Connection Pooling

```python
# Reuse HTTP session for all providers
async with aiohttp.ClientSession(timeout=timeout) as session:
    # All provider calls use same session
    # TCP connections reused
```

### 4. Frontend Optimizations

**Image Optimization**:
```javascript
// next.config.js
images: {
    formats: ['image/avif', 'image/webp'],  // Modern formats
    deviceSizes: [640, 750, 828, 1080, ...],
    imageSizes: [16, 32, 48, 64, ...],
}
```

**Code Splitting**:
```javascript
// Automatic in Next.js
// Each page = separate bundle
// Components dynamically imported only when needed
```

**Cache Headers**:
```javascript
// Static assets: 1 year cache
'/_next/static/(.*)': 'public, max-age=31536000, immutable'

// HTML pages: No cache (always fresh)
'/(.*)': 'public, max-age=0, must-revalidate'
```

### 5. Memory Management

**Cache Size Limit**:
```python
cache = TTLCache(maxsize=2048, ttl=60)  # Max 2048 entries
```

**Why 2048?**
- Typical entry: ~500 bytes
- Total: ~1 MB memory
- Safe for Railway free tier (512 MB RAM)

### 6. CDN (Netlify)

- **Edge caching**: Static assets served from nearest location
- **Compression**: Gzip/Brotli automatic
- **HTTP/2**: Multiplexing for faster loading

---

## Monitoring & Observability

### Health Check Endpoints

```python
@app.get("/health")
async def health_check():
    """Basic health check"""
    return {"status": "ok"}

@app.get("/health/detailed")
async def detailed_health_check():
    """Detailed system metrics"""
    return {
        "status": "ok",
        "memory": psutil.virtual_memory()._asdict(),
        "cpu": psutil.cpu_percent(),
        "cache_size": len(cache),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health/ready")
async def readiness_probe():
    """Kubernetes-style readiness probe"""
    return {"status": "ready"}

@app.get("/health/live")
async def liveness_probe():
    """Kubernetes-style liveness probe"""
    return {"status": "alive"}
```

### Debug Endpoints

```python
@app.get("/debug/hanpass-stats")
async def debug_hanpass_stats():
    """Hanpass connection statistics"""
    return hanpass_tracker.get_stats()

@app.get("/admin/proxy/stats")
async def get_proxy_stats():
    """Proxy usage statistics"""
    return proxy_manager.get_proxy_stats()
```

### Logging Strategy

```python
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Log levels:
# INFO: Normal operations, request flows
# WARNING: Recoverable errors, proxy failures
# ERROR: Unexpected errors, provider failures
```

**Key log events**:
- Provider scraping success/failure
- Proxy usage and failures
- IP blocking detection
- Cache hits/misses
- Rate limit violations

---

## Scalability Considerations

### Current Limitations

1. **Single Instance**: One Railway container
2. **In-Memory Cache**: Not shared across instances
3. **In-Memory Rate Limiting**: Not distributed
4. **No Queue System**: Synchronous request handling

### Scaling Path

```
Phase 1: Current (Single Instance)
  └─> Works well for < 100 concurrent users

Phase 2: Horizontal Scaling (2-3 instances)
  ├─> Add Redis for distributed caching
  ├─> Add Redis for distributed rate limiting
  └─> Load balancer (Railway provides automatically)

Phase 3: Microservices (> 1000 concurrent users)
  ├─> Separate scraping service (background workers)
  ├─> Queue system (RabbitMQ/Redis Queue)
  ├─> API gateway (Kong/Tyk)
  └─> Separate cache layer (Redis Cluster)

Phase 4: Global Scale (> 10k concurrent users)
  ├─> Multi-region deployment
  ├─> Regional caches
  ├─> CDN for API responses
  └─> Database for analytics (PostgreSQL)
```

---

**Next Document**: [02-BACKEND-API.md](./02-BACKEND-API.md) - Detailed API reference and provider implementations
