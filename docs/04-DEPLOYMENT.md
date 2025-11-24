# RemitBuddy - Deployment & DevOps

**Document Version:** 1.0
**Last Updated:** 2025-11-24

---

## Deployment Overview

RemitBuddy uses a **dual-platform deployment strategy**:

```
Frontend (Next.js)  →  Netlify CDN
Backend (FastAPI)   →  Railway (Docker)
```

---

## Frontend Deployment (Netlify)

### Configuration

**File**: `frontend/netlify.toml`

```toml
[build]
  base = "frontend/"
  command = "npm install --include=dev && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NEXT_TELEMETRY_DISABLED = "1"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables

Set in Netlify dashboard:

```bash
NEXT_PUBLIC_API_URL=https://remitbuddy-production.up.railway.app
NEXT_TELEMETRY_DISABLED=1
```

### Deployment Process

1. **Automatic Deploy on Git Push**
   ```bash
   git push origin main
   ```

2. **Netlify Build Process**:
   - Clone repository
   - Install dependencies (`npm install`)
   - Build Next.js app (`npm run build`)
   - Deploy to CDN
   - Purge old caches

3. **Deploy URL**:
   - Production: https://www.remitbuddy.com
   - Branch deploys: `{branch}--remitbuddy.netlify.app`

### Build Time
- **Average**: 2-3 minutes
- **Cache**: Dependencies cached between builds

### Rollback
```bash
# Via Netlify CLI
netlify rollback

# Or via Netlify dashboard
Deploys → Previous deploy → Publish
```

---

## Backend Deployment (Railway)

### Configuration

**File**: `railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "healthcheckPath": "/",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Dockerfile**:

```dockerfile
FROM python:3.11

WORKDIR /app

# Copy requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ .

# Railway provides PORT via environment variable
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Environment Variables

Set in Railway dashboard:

```bash
# Optional: Proxy configuration
HANPASS_PROXY_URL=http://user:pass@proxy.example.com:8080

# Or multiple proxies
HANPASS_PROXY_1=1.2.3.4:8080:username:password
HANPASS_PROXY_2=5.6.7.8:8080:username:password

# Auto-provided by Railway
PORT=8000  # Dynamic port
```

### Deployment Process

1. **Automatic Deploy on Git Push**
   ```bash
   git push origin main
   ```

2. **Railway Build Process**:
   - Pull repository
   - Build Docker image
   - Run health check (`GET /`)
   - Deploy to production
   - Update DNS

3. **Deploy URL**:
   - Production: https://remitbuddy-production.up.railway.app

### Build Time
- **Average**: 3-5 minutes
- **Cache**: Docker layers cached

### Health Checks

Railway pings `GET /` every 60 seconds:
- **Success (200)**: Container is healthy
- **Failure (non-200)**: Restart container (up to 10 retries)

### Restart Policy

```
ON_FAILURE
└─> Max retries: 10
    └─> Backoff: Exponential (2s, 4s, 8s, ...)
```

### Rollback

```bash
# Via Railway dashboard
Deployments → Previous deployment → Redeploy
```

---

## DNS Configuration

### Domain Setup

**Registrar**: (Your domain registrar)

**DNS Records**:

```
Type    Name    Value                                   TTL
──────────────────────────────────────────────────────────
A       @       75.2.60.5 (Netlify)                     3600
CNAME   www     remitbuddy.netlify.app                  3600
```

### SSL/TLS

**Netlify**:
- Automatic Let's Encrypt SSL
- Auto-renewal every 90 days
- Forced HTTPS redirect

**Railway**:
- Automatic SSL on Railway domain
- Custom domain: Add in Railway dashboard → auto-SSL

---

## Monitoring & Observability

### Netlify Monitoring

**Built-in Metrics**:
- Deploy status
- Build time
- Bandwidth usage
- Function invocations

**Logs**:
```bash
# Deploy logs
Netlify Dashboard → Deploys → [deployment] → Deploy log

# Function logs (if using Netlify Functions)
Netlify Dashboard → Functions → [function] → Logs
```

### Railway Monitoring

**Built-in Metrics**:
- CPU usage
- Memory usage
- Network I/O
- Restart count

**Logs**:
```bash
# Via Railway dashboard
Project → Deployments → [deployment] → View Logs

# Live logs (streaming)
railway logs --follow
```

**Custom Health Endpoints**:
```bash
# Basic health
curl https://remitbuddy-production.up.railway.app/health

# Detailed metrics
curl https://remitbuddy-production.up.railway.app/health/detailed
```

### Google Analytics

**Tracking ID**: G-Z0SHT6SKJ3

**Metrics**:
- Page views
- User sessions
- Bounce rate
- Conversion funnel

---

## CI/CD Pipeline

### Current Pipeline (Git-based)

```
┌──────────────┐
│  Git Push    │
└──────┬───────┘
       │
       ├─────────────────────┬─────────────────────┐
       ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐    ┌──────────────┐
│   Netlify    │      │   Railway    │    │  GitHub      │
│   Webhook    │      │   Webhook    │    │  Actions     │
└──────┬───────┘      └──────┬───────┘    └──────┬───────┘
       │                     │                     │
       ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐    ┌──────────────┐
│  Build       │      │  Build       │    │  Run Tests   │
│  Frontend    │      │  Backend     │    │  (future)    │
└──────┬───────┘      └──────┬───────┘    └──────────────┘
       │                     │
       ▼                     ▼
┌──────────────┐      ┌──────────────┐
│  Deploy to   │      │  Deploy to   │
│  CDN         │      │  Container   │
└──────────────┘      └──────────────┘
```

### Branch Strategy

```
main (production)
  ├─> Auto-deploy to Netlify + Railway
  └─> www.remitbuddy.com

feature/* (development)
  ├─> Auto-deploy to Netlify preview
  └─> {branch}--remitbuddy.netlify.app
```

---

## Backup & Disaster Recovery

### Current State

**No Database**: No data to back up

**Stateless Architecture**:
- Frontend: Static files on CDN (versioned)
- Backend: Containerized (versioned)
- Code: Git (version control)

### Recovery Plan

**Scenario 1: Frontend Down**
1. Check Netlify status page
2. Verify DNS records
3. Rollback to previous deploy (if needed)
4. **RTO**: 5 minutes

**Scenario 2: Backend Down**
1. Check Railway status page
2. View Railway logs
3. Restart container (if needed)
4. Rollback deployment (if needed)
5. **RTO**: 10 minutes

**Scenario 3: Provider API Changes**
1. Identify broken provider(s)
2. Fix scraper logic
3. Deploy hotfix
4. **RTO**: 30-60 minutes

**Scenario 4: Complete Failure**
1. Redeploy frontend to Vercel (alternative)
2. Redeploy backend to Heroku/Fly.io (alternative)
3. Update DNS records
4. **RTO**: 2-4 hours

---

## Scaling Strategy

### Current Capacity

**Frontend (Netlify)**:
- Unlimited users (CDN)
- Unlimited bandwidth

**Backend (Railway)**:
- Single container
- ~500 MB RAM
- Handles ~100 concurrent requests

### Horizontal Scaling

**When to scale**: CPU > 80% or Memory > 400 MB for 5+ minutes

**Railway Scaling**:
1. Add more containers (horizontal)
   ```bash
   # Via Railway dashboard
   Settings → Scale → Add replica
   ```

2. Increase container size (vertical)
   ```bash
   # Via Railway dashboard
   Settings → Resources → Upgrade
   ```

**Required Changes for Multi-Instance**:
- Redis for distributed cache
- Redis for distributed rate limiting
- Load balancer (Railway provides automatically)

### Cost Estimation

| Users | Containers | RAM | Cost/Month |
|-------|-----------|-----|------------|
| < 100 | 1 | 512 MB | $5 |
| 100-500 | 2 | 1 GB each | $20 |
| 500-2000 | 4 | 1 GB each | $40 |
| 2000+ | 8+ | 2 GB each | $100+ |

---

## Security Hardening

### SSL/TLS Configuration

**Netlify**:
- TLS 1.2+ only
- Strong ciphers only
- HSTS enabled (max-age=31536000)

**Railway**:
- TLS 1.2+ only
- Automatic certificate rotation

### Security Headers

**CSP (Content Security Policy)**:
```
default-src 'self'
script-src 'self' https://www.googletagmanager.com
connect-src 'self' https://remitbuddy-production.up.railway.app
frame-ancestors 'none'
upgrade-insecure-requests
```

**Other Headers**:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
```

### DDoS Protection

**Netlify**: Built-in DDoS protection (included)

**Railway**: Application-level rate limiting (15 req/60s per IP)

**Future**: CloudFlare in front of Railway API

---

## Cost Optimization

### Current Costs

| Service | Plan | Cost/Month |
|---------|------|------------|
| Netlify | Free | $0 |
| Railway | Hobby | $5 |
| Domain | - | $12/year |
| **Total** | | **$6/month** |

### Cost Optimization Tips

1. **Netlify Free Tier Limits**:
   - 100 GB bandwidth/month
   - 300 build minutes/month
   - **Current usage**: ~10 GB, ~50 minutes

2. **Railway Hobby Plan Limits**:
   - $5 credit/month
   - Pay only for usage above $5
   - **Current usage**: ~$3-5/month

3. **Future Optimization**:
   - Cache more aggressively (reduce API calls)
   - Compress responses (reduce bandwidth)
   - Optimize images (reduce CDN bandwidth)

---

## Troubleshooting Guide

### Frontend Issues

**Issue**: "Page not found" errors
```bash
# Check DNS
dig www.remitbuddy.com

# Check Netlify deploy status
netlify status

# Redeploy
netlify deploy --prod
```

**Issue**: Build failures
```bash
# Check build logs in Netlify dashboard
# Common causes:
# - Missing environment variables
# - Dependency version conflicts
# - Out of memory during build
```

### Backend Issues

**Issue**: API not responding
```bash
# Check health endpoint
curl https://remitbuddy-production.up.railway.app/health

# Check Railway logs
railway logs --follow

# Restart container
railway restart
```

**Issue**: Provider scraping failures
```bash
# Check debug endpoint
curl https://remitbuddy-production.up.railway.app/debug/hanpass-stats

# Check proxy stats
curl https://remitbuddy-production.up.railway.app/admin/proxy/stats
```

**Issue**: Memory leaks
```bash
# Check detailed health
curl https://remitbuddy-production.up.railway.app/health/detailed

# Solution: Restart container
railway restart
```

---

## Emergency Procedures

### Critical Outage Response

1. **Assess Impact** (2 min)
   - Is frontend down?
   - Is backend down?
   - Is a provider API down?

2. **Notify Stakeholders** (5 min)
   - Post status update
   - Notify users (if applicable)

3. **Immediate Mitigation** (10 min)
   - Rollback to last working deploy
   - Disable broken provider (if applicable)
   - Scale up resources (if performance issue)

4. **Root Cause Analysis** (1-2 hours)
   - Review logs
   - Identify failure point
   - Document findings

5. **Permanent Fix** (varies)
   - Deploy fix
   - Verify solution
   - Update documentation

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (once implemented)
- [ ] Code reviewed
- [ ] Environment variables set
- [ ] No secrets in code
- [ ] Changelog updated

### Deployment

- [ ] Deploy to staging (future)
- [ ] Smoke test staging
- [ ] Deploy to production
- [ ] Monitor error rates for 15 minutes
- [ ] Check health endpoints

### Post-Deployment

- [ ] Verify all features working
- [ ] Check analytics for anomalies
- [ ] Monitor logs for errors
- [ ] Document any issues
- [ ] Update team

---

**Next Document**: [05-DEVELOPMENT.md](./05-DEVELOPMENT.md) - Development setup and guidelines
