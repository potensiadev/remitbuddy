# RemitBuddy - Technical Overview

**Document Version:** 1.0
**Last Updated:** 2025-11-24
**Prepared For:** CPO & CTO Onboarding

---

## Executive Summary

RemitBuddy is a **real-time remittance rate comparison platform** that helps Korean users find the best exchange rates when sending money to 10 Asian countries. The platform aggregates rates from 10 major remittance providers and presents them in a clean, mobile-first interface.

### Key Metrics
- **10 Countries Supported**: Vietnam, Nepal, Philippines, Thailand, Myanmar, Indonesia, Cambodia, Uzbekistan, Sri Lanka, Bangladesh
- **10 Remittance Providers**: Hanpass, Cross, GmoneyTrans, GME Remit, JP Remit, The Moin, Wirebarley, SBI Cosmoney, E9Pay, Coinshot
- **11 Languages**: en, ko, vi, tl, km, my, th, uz, id, si, ne
- **60-second Cache**: Fresh data with optimal performance
- **2-second Timeout**: Per provider, 3-second total request timeout
- **Stateless Architecture**: No database, all data fetched real-time

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                         USER (Mobile/Desktop)                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    NETLIFY CDN (Frontend)                    │
│  • Next.js 14 (React 18)                                    │
│  • Tailwind CSS (Toss-inspired design)                      │
│  • 11-language i18n                                          │
│  • Google Analytics + AdSense                                │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS API Call
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                RAILWAY (Backend API - FastAPI)               │
│  • Python 3.11 FastAPI                                       │
│  • Async scraping (aiohttp)                                  │
│  • 60s TTL cache (2048 slots)                                │
│  • Smart proxy rotation                                      │
│  • IP blocking detection                                     │
└────────────┬────────────────────────────────────────────────┘
             │ Parallel Scraping (2s timeout each)
             ▼
┌─────────────────────────────────────────────────────────────┐
│           10 REMITTANCE PROVIDER APIS (External)             │
│  Hanpass • Cross • GmoneyTrans • GME Remit • JP Remit       │
│  The Moin • Wirebarley • SBI Cosmoney • E9Pay • Coinshot    │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|----------|
| **Frontend** | Next.js | 14.0.0 | React framework with SSR/SSG |
| | React | 18.0.0 | UI library |
| | Tailwind CSS | 3.0.0 | Utility-first CSS framework |
| | next-i18next | 15.0.0 | Internationalization |
| **Backend** | FastAPI | Latest | Python async web framework |
| | Python | 3.11 | Programming language |
| | aiohttp | Latest | Async HTTP client |
| | uvicorn | Latest | ASGI server |
| **Caching** | cachetools | Latest | In-memory TTL cache |
| **Deployment** | Netlify | - | Frontend hosting + CDN |
| | Railway | - | Backend hosting + Docker |
| **Monitoring** | Google Analytics | 4 | User analytics |
| | psutil | Latest | System health metrics |

---

## Core Business Logic

### 1. Rate Comparison Flow
1. User enters: amount, destination country, currency
2. Frontend calls: `GET /api/getRemittanceQuote`
3. Backend scrapes 10 providers in parallel (2s timeout each)
4. Results aggregated, sorted by recipient amount (highest first)
5. Cache stored for 60 seconds
6. Frontend displays best rate + full comparison list

### 2. Smart Proxy Management
- **IP Blocking Detection**: Tracks Hanpass consecutive failures
- **Automatic Fallback**: Direct → Proxy after 3 failures
- **Load Balancing**: Score-based proxy selection
- **Health Checks**: Automatic proxy testing
- **User-Agent Rotation**: 8 different user agents

### 3. Provider Scraping Strategy

Each provider uses different API patterns:

| Provider | Method | Complexity | Special Features |
|----------|--------|-----------|------------------|
| **Hanpass** | JSON API | High | IP blocking detection, proxy fallback |
| **Cross** | JSON API | Medium | Manual deposit platform |
| **GmoneyTrans** | ASP Endpoint | High | Regex parsing required |
| **GME Remit** | AJAX Endpoint | Medium | Delivery method variations |
| **JP Remit** | JSON API | Low | Bank transfer focused |
| **The Moin** | JSON API | Low | Japan/Thailand specialist |
| **Wirebarley** | JSON API | Very High | 8-tier rate system |
| **SBI Cosmoney** | JSON API | Low | Simple JSON response |
| **E9Pay** | JSON API | High | Complex nested JSON + fixed fees |
| **Coinshot** | JSON API | Medium | Crypto-backed remittance |

---

## Key Features

### 🌍 Multi-Country Support
- 10 Asian countries with highest remittance demand from Korea
- Country-specific currency mapping
- Provider availability varies by country

### 🌐 Multi-Language Support
- 11 languages covering major migrant worker populations
- Locale-specific routing (`/en`, `/ko`, `/vi`, etc.)
- JSON-based translation files

### 📱 Mobile-First Design
- Toss-inspired UI (Korean fintech standard)
- Responsive breakpoints (xs: 475px → 2xl: 1536px)
- Touch-optimized (56px+ tap targets)
- Smooth animations with cubic-bezier curves

### ⚡ Performance Optimizations
- **60-second caching**: Balance freshness vs. load
- **Parallel API calls**: All providers scraped simultaneously
- **Proxy rotation**: Reliability without IP bans
- **Image optimization**: AVIF/WebP with next/image
- **Code splitting**: Automatic in Next.js

### 🔒 Security Features
- **Content Security Policy (CSP)**: Strict CSP headers
- **HSTS**: HTTP Strict Transport Security
- **CORS**: Whitelist of allowed origins
- **Rate Limiting**: 15 requests per 60 seconds per IP
- **X-Frame-Options**: Prevent clickjacking

---

## Data Flow Example

### User Query: "Send 100,000 KRW to Vietnam (VND)"

1. **User Input**
   - Amount: 100,000 KRW
   - Country: Vietnam
   - Currency: VND

2. **Frontend Request**
   ```http
   GET /api/getRemittanceQuote?send_amount=100000&receive_country=vietnam&receive_currency=VND
   ```

3. **Backend Processing** (parallel, 3s total timeout)
   ```python
   # Check cache first
   cache_key = "vietnam:VND:100000"
   if cache.has(cache_key):
       return cached_result

   # Scrape all providers in parallel
   tasks = [
       get_hanpass_quote(...),
       get_cross_quote(...),
       get_gmoneytrans_quote(...),
       # ... 7 more providers
   ]
   results = await asyncio.gather(*tasks, return_exceptions=True)

   # Filter successful results
   valid_results = [r for r in results if r and not isinstance(r, Exception)]

   # Sort by recipient_gets (highest first)
   valid_results.sort(key=lambda x: x['recipient_gets'], reverse=True)

   # Cache for 60 seconds
   cache[cache_key] = valid_results

   return {
       "results": valid_results,
       "best_rate_provider": valid_results[0] if valid_results else None
   }
   ```

4. **Response Example**
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

5. **Frontend Display**
   - Best rate highlighted with green badge
   - All results shown in cards
   - Click to visit provider website

---

## Deployment Architecture

### Frontend (Netlify)
- **Build Command**: `cd frontend && npm install --include=dev && npm run build`
- **Publish Directory**: `frontend/.next`
- **Auto-Deploy**: Git push to main branch
- **CDN**: Global edge network
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: Backend API URL

### Backend (Railway)
- **Builder**: Dockerfile
- **Port**: Dynamic ($PORT from Railway)
- **Auto-Deploy**: Git push to main branch
- **Health Check**: `GET /` endpoint
- **Restart Policy**: ON_FAILURE (10 retries)
- **Environment Variables**:
  - `HANPASS_PROXY_URL` or `HANPASS_PROXY_1/2/3`: Proxy configurations

---

## Key Design Decisions

### Why No Database?
- **Real-time Data**: Rates change frequently, stale data is useless
- **Simplicity**: No database = no migrations, backups, scaling issues
- **Cost**: Free tier friendly
- **Performance**: Cache provides sufficient performance with fresh data

### Why 60-Second Cache?
- **Balance**: Fresh enough for accurate rates, long enough to reduce load
- **Provider Limits**: Avoid hitting rate limits on provider APIs
- **User Experience**: Fast response times

### Why Proxy Rotation?
- **IP Blocking**: Hanpass specifically blocks high-frequency IPs
- **Reliability**: Fallback when direct connection fails
- **Detection**: Smart tracking of consecutive failures

### Why Toss-Inspired Design?
- **Trust**: Toss is Korea's most trusted fintech brand
- **Familiarity**: Korean users recognize and trust the design patterns
- **Mobile-First**: Optimized for mobile users (primary audience)
- **Professional**: Clean, minimal, confidence-inspiring

---

## Performance Characteristics

### Response Times
- **Cache Hit**: ~50ms (in-memory lookup)
- **Cache Miss**: ~2-3s (parallel provider scraping)
- **Provider Timeout**: 2s per provider, 3s total
- **Rate Limit**: 15 requests/60s per IP

### Caching Strategy
- **TTL**: 60 seconds
- **Size**: 2048 slots (LRU eviction)
- **Key Format**: `{country}:{currency}:{amount}`
- **Hit Rate**: ~80% during peak hours (estimated)

### Scalability
- **Frontend**: Infinite (Netlify CDN)
- **Backend**: Vertical scaling on Railway
- **Bottleneck**: External provider API rate limits
- **Horizontal Scaling**: Stateless design allows easy horizontal scaling

---

## Business Model

### Current State
- **Free Service**: No user fees
- **Revenue**: Google AdSense ads
- **Cost**: Netlify free tier + Railway ($5-20/month)

### Future Monetization Options
1. **Affiliate Links**: Commission from providers
2. **Premium Features**: Priority support, higher limits
3. **B2B API**: Sell API access to other platforms
4. **White-Label**: License platform to other markets

---

## Risk Assessment

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| **Provider API Changes** | High | Monitoring, alerting, quick fixes |
| **IP Blocking** | Medium | Proxy rotation, IP rotation |
| **Rate Limiting** | Medium | Caching, distributed rate limiting |
| **Provider Downtime** | Low | Graceful degradation, partial results |
| **DDoS Attacks** | Medium | Netlify/Railway DDoS protection |

### Business Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| **Provider Legal Action** | Low | Public data, fair use |
| **Market Competition** | Medium | Brand differentiation, mobile UX |
| **Regulatory Changes** | Medium | Monitor Korean financial regulations |
| **Revenue Sustainability** | High | Diversify revenue streams |

---

## Next Steps for CPO

### Product Priorities
1. **User Analytics**: Track which countries/providers are most popular
2. **User Feedback**: Implement feedback/rating system
3. **Push Notifications**: Alert users when rates drop
4. **Historical Data**: Show rate trends over time
5. **Comparison Tools**: Side-by-side provider comparisons
6. **Affiliate Integration**: Convert links to affiliate links

### Growth Strategy
1. **SEO Optimization**: Rank for "remittance comparison" keywords
2. **Content Marketing**: Blog about remittance tips
3. **Social Media**: Target migrant worker communities
4. **Partnerships**: Collaborate with remittance providers
5. **Mobile App**: Native iOS/Android apps

---

## Next Steps for CTO

### Technical Priorities
1. **Monitoring**: Implement Sentry/LogRocket for error tracking
2. **Alerting**: Alert on provider scraping failures
3. **Testing**: Unit tests for provider scrapers
4. **CI/CD**: Automated testing on PR
5. **Database**: Add PostgreSQL for analytics (not rate data)
6. **API Versioning**: Prepare for API v2

### Infrastructure Improvements
1. **Redis**: Replace in-memory cache with Redis for distributed caching
2. **Queue System**: Celery/RabbitMQ for background scraping
3. **Load Balancing**: Multiple backend instances
4. **CDN**: CloudFlare in front of Railway API
5. **Database**: PostgreSQL for user analytics, bookmarks
6. **Docker Compose**: Local development environment

---

## Documentation Structure

This documentation is organized as follows:

1. **00-OVERVIEW.md** (this file) - High-level architecture overview
2. **01-ARCHITECTURE.md** - Detailed architecture and design patterns
3. **02-BACKEND-API.md** - Backend API reference and provider implementations
4. **03-FRONTEND.md** - Frontend architecture, components, and styling
5. **04-DATABASE.md** - Data models and caching strategy
6. **05-DEPLOYMENT.md** - Deployment processes and DevOps
7. **06-DEVELOPMENT.md** - Development setup and guidelines

---

## Quick Reference

### Key URLs
- **Production Frontend**: https://www.remitbuddy.com
- **Production Backend**: https://remitbuddy-production.up.railway.app
- **API Docs**: https://remitbuddy-production.up.railway.app/docs
- **GitHub**: (private repository)

### Key Contacts
- **Backend**: FastAPI + Python 3.11
- **Frontend**: Next.js 14 + React 18
- **Deployment**: Netlify (frontend) + Railway (backend)
- **Monitoring**: Google Analytics

### Emergency Contacts
- **Railway Support**: https://railway.app/help
- **Netlify Support**: https://www.netlify.com/support/
- **Provider Issues**: Check individual provider websites

---

**Document prepared by:** Claude AI
**For:** RemitBuddy CPO & CTO Onboarding
**Date:** 2025-11-24
