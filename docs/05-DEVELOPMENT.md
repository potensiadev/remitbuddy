# RemitBuddy - Development Setup & Guidelines

**Document Version:** 1.0
**Last Updated:** 2025-11-24

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Running Locally](#running-locally)
4. [Development Workflow](#development-workflow)
5. [Code Style](#code-style)
6. [Testing](#testing)
7. [Debugging](#debugging)
8. [Common Tasks](#common-tasks)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | 18.x or higher | Frontend runtime |
| **npm** | 9.x or higher | Package manager |
| **Python** | 3.11 | Backend runtime |
| **pip** | Latest | Python package manager |
| **Git** | Latest | Version control |

### Recommended Tools

- **VS Code** (or your preferred IDE)
- **Postman** (API testing)
- **Docker Desktop** (optional, for containerized development)

### Installation

#### macOS (via Homebrew)
```bash
# Install Node.js
brew install node@18

# Install Python
brew install python@3.11

# Verify installations
node --version  # Should be 18.x
python3 --version  # Should be 3.11.x
```

#### Windows (via Chocolatey or Manual)
```powershell
# Install Node.js
choco install nodejs-lts

# Install Python
choco install python --version=3.11

# Verify installations
node --version
python --version
```

#### Linux (Ubuntu/Debian)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
sudo apt-get install python3.11 python3-pip

# Verify installations
node --version
python3 --version
```

---

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/remitbuddy.git
cd remitbuddy
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# This will install:
# - Next.js 14
# - React 18
# - Tailwind CSS
# - next-i18next
# - All other dependencies
```

### 4. Environment Variables

#### Backend `.env` (Optional)

Create `backend/.env`:

```bash
# Proxy configuration (optional)
HANPASS_PROXY_URL=http://user:pass@proxy.example.com:8080

# Or multiple proxies
HANPASS_PROXY_1=1.2.3.4:8080:username:password
HANPASS_PROXY_2=5.6.7.8:8080:username:password

# Development port (optional, defaults to 8000)
PORT=8000
```

#### Frontend `.env.local`

Create `frontend/.env.local`:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Disable telemetry
NEXT_TELEMETRY_DISABLED=1

# Google Analytics (optional in dev)
NEXT_PUBLIC_GA_ID=G-Z0SHT6SKJ3
```

---

## Running Locally

### Start Backend (Terminal 1)

```bash
cd backend

# Activate virtual environment if not already active
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate  # Windows

# Run development server with auto-reload
uvicorn main:app --reload --port 8000

# Server will start at:
# http://localhost:8000

# API docs available at:
# http://localhost:8000/docs
```

**Expected Output**:
```
INFO:     Will watch for changes in these directories: ['/app/backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Start Frontend (Terminal 2)

```bash
cd frontend

# Run development server
npm run dev

# Server will start at:
# http://localhost:3000
```

**Expected Output**:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully in 3.2s
```

### Verify Setup

1. **Backend Health Check**:
   ```bash
   curl http://localhost:8000/health
   # Expected: {"status":"ok"}
   ```

2. **Frontend**: Open http://localhost:3000 in browser

3. **API Integration**: Test quote comparison through frontend UI

---

## Development Workflow

### Branch Strategy

```
main
  └─> Production-ready code
  └─> All commits should pass tests

feature/*
  └─> New features
  └─> Branch from main

bugfix/*
  └─> Bug fixes
  └─> Branch from main

hotfix/*
  └─> Critical production fixes
  └─> Branch from main, merge ASAP
```

### Creating a Feature

```bash
# 1. Create feature branch
git checkout -b feature/new-provider-support

# 2. Make changes
# ... edit files ...

# 3. Test locally
cd backend && uvicorn main:app --reload
cd frontend && npm run dev

# 4. Commit changes
git add .
git commit -m "feat: Add support for new provider"

# 5. Push to remote
git push origin feature/new-provider-support

# 6. Create Pull Request (via GitHub)
```

### Commit Message Format

Follow **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(backend): Add Coinshot provider support

Implements scraping logic for Coinshot API.
Includes error handling and rate calculation.

Closes #123

---

fix(frontend): Fix country selector dropdown on mobile

The dropdown was cut off on small screens.
Added proper responsive styles.

---

docs(api): Update API documentation for new endpoint
```

---

## Code Style

### Backend (Python)

**Style Guide**: PEP 8

**Formatting**:
```bash
# Install formatter (optional)
pip install black

# Format code
black backend/main.py

# Recommended line length: 120 characters
```

**Example**:
```python
async def get_provider_quote(
    session: aiohttp.ClientSession,
    send_amount: int,
    receive_currency: str,
    receive_country: str
) -> Optional[Dict]:
    """
    Fetch quote from provider API.

    Args:
        session: HTTP session
        send_amount: Amount to send in KRW
        receive_currency: Destination currency (e.g., "VND")
        receive_country: Destination country (e.g., "vietnam")

    Returns:
        Quote dictionary or None on failure
    """
    try:
        # Implementation
        pass
    except Exception as e:
        logger.error(f"Provider Error: {type(e).__name__} - {e}")
        return None
```

### Frontend (JavaScript/TypeScript)

**Style Guide**: Airbnb JavaScript Style Guide (relaxed)

**Formatting**:
```bash
# Install ESLint (already in package.json)
npm install

# Lint code
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

**Example (React Component)**:
```jsx
import { useState } from 'react';

export function ProviderCard({ provider, isBest }) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    // Navigate to provider
    window.open(provider.link, '_blank');
  };

  return (
    <div className={`card ${isBest ? 'card-best' : ''}`}>
      <h3>{provider.name}</h3>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Visit Provider'}
      </button>
    </div>
  );
}
```

**TypeScript Example**:
```typescript
interface QuoteResult {
  provider: string;
  exchange_rate: number;
  fee: number;
  recipient_gets: number;
  link: string;
}

async function fetchQuotes(
  amount: number,
  country: string,
  currency: string
): Promise<QuoteResult[]> {
  const response = await fetch(
    `/api/getRemittanceQuote?send_amount=${amount}&receive_country=${country}&receive_currency=${currency}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch quotes');
  }

  const data = await response.json();
  return data.results;
}
```

---

## Testing

### Backend Testing (Future)

**Framework**: pytest

**Setup**:
```bash
pip install pytest pytest-asyncio

# Run tests
pytest

# Run with coverage
pytest --cov=backend
```

**Example Test**:
```python
# backend/test_providers.py
import pytest
from main import get_hanpass_quote

@pytest.mark.asyncio
async def test_hanpass_quote():
    async with aiohttp.ClientSession() as session:
        result = await get_hanpass_quote(
            session,
            send_amount=100000,
            receive_currency="VND",
            receive_country="vietnam"
        )

        assert result is not None
        assert result['provider'] == 'Hanpass'
        assert result['exchange_rate'] > 0
        assert result['recipient_gets'] > 0
```

### Frontend Testing (Future)

**Frameworks**: Jest + React Testing Library

**Setup**:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

**Example Test**:
```javascript
// __tests__/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## Debugging

### Backend Debugging

**Print Debugging**:
```python
# Quick debugging
print(f"Debug: send_amount={send_amount}, country={receive_country}")

# Better: Use logging
import logging
logger = logging.getLogger(__name__)
logger.info(f"Processing quote request: {send_amount} to {receive_country}")
```

**VS Code Debugger**:

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "main:app",
        "--reload"
      ],
      "jinja": true,
      "justMyCode": true,
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

**Postman Testing**:
1. Create collection "RemitBuddy API"
2. Add request:
   - Method: GET
   - URL: `http://localhost:8000/api/getRemittanceQuote`
   - Params: `send_amount`, `receive_country`, `receive_currency`
3. Save and test

### Frontend Debugging

**Browser DevTools**:
- **Console**: `console.log()`, `console.table()`, `console.group()`
- **Network**: Inspect API calls
- **React DevTools**: Inspect component state

**VS Code Debugger**:

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/frontend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 9229,
      "console": "integratedTerminal"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend"
    }
  ]
}
```

---

## Common Tasks

### Adding a New Provider

1. **Add provider scraper function** in `backend/main.py`:

```python
async def get_newprovider_quote(
    session: aiohttp.ClientSession,
    send_amount: int,
    receive_currency: str,
    receive_country: str
) -> Optional[Dict]:
    try:
        url = "https://newprovider.com/api/quote"
        params = {
            "amount": send_amount,
            "currency": receive_currency,
            # ...
        }

        async with session.get(url, params=params) as response:
            if response.status != 200:
                return None

            data = await response.json()

            return {
                "provider": "NewProvider",
                "exchange_rate": float(data['rate']),
                "fee": float(data['fee']),
                "recipient_gets": float(data['recipient_amount']),
                "link": "https://newprovider.com/"
            }

    except Exception as e:
        logger.error(f"NewProvider Error: {type(e).__name__} - {e}")
        return None
```

2. **Add to aggregator** in `/api/getRemittanceQuote`:

```python
tasks = [
    get_hanpass_quote(...),
    get_cross_quote(...),
    # ... existing providers
    get_newprovider_quote(session, send_amount, receive_currency, receive_country),  # NEW
]
```

3. **Add provider logo** to `frontend/public/logos/newprovider.png`

4. **Update provider mapping** in `frontend/pages/index.js`:

```javascript
const PROVIDER_LOGO_MAP = {
  'Hanpass': '/logos/hanpass.png',
  // ... existing providers
  'NewProvider': '/logos/newprovider.png',  // NEW
};
```

5. **Test**:
```bash
# Backend
curl "http://localhost:8000/api/getRemittanceQuote?send_amount=100000&receive_country=vietnam&receive_currency=VND"

# Frontend
# Open http://localhost:3000 and test comparison
```

---

### Adding a New Language

1. **Add locale to config** in `frontend/next-i18next.config.js`:

```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko', 'vi', /* ... */ 'zh'],  // Add 'zh'
  },
}
```

2. **Create translation file** `frontend/public/locales/zh/common.json`:

```json
{
  "hero": {
    "title": "找到最优汇率",
    "subtitle": "比较10家服务商",
    "amount_label": "发送金额",
    "country_label": "目的地国家",
    "compare_button": "立即比较"
  },
  "results": {
    "best_rate": "最优汇率",
    "exchange_rate": "汇率",
    "fee": "手续费",
    "recipient_gets": "收款金额",
    "visit_provider": "访问服务商"
  }
}
```

3. **Test**:
```bash
# Start dev server
npm run dev

# Visit http://localhost:3000/zh
```

---

### Updating Dependencies

**Backend**:
```bash
cd backend

# Update all packages
pip install --upgrade -r requirements.txt

# Update single package
pip install --upgrade fastapi

# Update requirements.txt
pip freeze > requirements.txt
```

**Frontend**:
```bash
cd frontend

# Check for outdated packages
npm outdated

# Update all packages (within semver range)
npm update

# Update single package
npm install next@latest

# Update to latest (ignoring semver)
npm install next@latest react@latest react-dom@latest
```

---

### Database Migration (Future)

When adding PostgreSQL for analytics:

```bash
# Install Alembic (migration tool)
pip install alembic psycopg2-binary

# Initialize Alembic
alembic init migrations

# Create migration
alembic revision --autogenerate -m "Add analytics table"

# Apply migration
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

---

## Performance Profiling

### Backend Profiling

```python
import time
import asyncio

# Simple timing
start = time.time()
result = await get_hanpass_quote(...)
elapsed = time.time() - start
print(f"Hanpass took {elapsed:.2f}s")

# Profile all providers
start_times = {}
end_times = {}

async def profile_provider(name, func, *args):
    start_times[name] = time.time()
    result = await func(*args)
    end_times[name] = time.time()
    return result

tasks = [
    profile_provider('Hanpass', get_hanpass_quote, ...),
    profile_provider('Cross', get_cross_quote, ...),
    # ...
]

results = await asyncio.gather(*tasks)

# Print results
for name in start_times:
    elapsed = end_times[name] - start_times[name]
    print(f"{name}: {elapsed:.2f}s")
```

### Frontend Profiling

**React DevTools Profiler**:
1. Install React DevTools browser extension
2. Open DevTools → Profiler tab
3. Click "Record"
4. Interact with app
5. Click "Stop"
6. Analyze render times

**Lighthouse**:
```bash
# In Chrome DevTools
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Click "Generate report"
# 4. Review performance score
```

---

## Troubleshooting

### Common Issues

**Issue**: `ModuleNotFoundError: No module named 'fastapi'`
```bash
# Solution: Install backend dependencies
cd backend
pip install -r requirements.txt
```

**Issue**: `Error: Cannot find module 'next'`
```bash
# Solution: Install frontend dependencies
cd frontend
npm install
```

**Issue**: CORS errors in browser console
```bash
# Solution: Check NEXT_PUBLIC_API_URL in frontend/.env.local
# Should be: http://localhost:8000

# Also check backend CORS config in main.py
```

**Issue**: Provider scraper returns None
```bash
# Solution: Check provider API
# 1. Verify provider website is up
# 2. Check API endpoint hasn't changed
# 3. Review backend logs for error messages
```

**Issue**: Slow API response (> 5s)
```bash
# Solution: Check individual provider response times
# Visit: http://localhost:8000/debug/hanpass-stats
# Identify slow provider and investigate
```

---

## Useful Commands

### Backend

```bash
# Run server
uvicorn main:app --reload

# Run on different port
uvicorn main:app --reload --port 8080

# Check Python version
python --version

# List installed packages
pip list

# Generate requirements.txt
pip freeze > requirements.txt
```

### Frontend

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Check for outdated packages
npm outdated
```

### Git

```bash
# Check status
git status

# Create branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "feat: Add new feature"

# Push to remote
git push origin feature/new-feature

# Pull latest changes
git pull origin main

# View commit history
git log --oneline --graph
```

---

## Additional Resources

### Documentation
- **FastAPI**: https://fastapi.tiangolo.com/
- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React**: https://react.dev/

### Community
- **FastAPI Discord**: https://discord.gg/fastapi
- **Next.js Discussions**: https://github.com/vercel/next.js/discussions
- **Tailwind Discord**: https://tailwindcss.com/discord

### Learning
- **Python Async**: https://realpython.com/async-io-python/
- **React Hooks**: https://react.dev/reference/react
- **TypeScript**: https://www.typescriptlang.org/docs/

---

**End of Documentation**

For questions or clarifications, please contact the development team.
