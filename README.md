# RemitBuddy

Real-time remittance rate comparison service for Korea.

## Features

- Compare real-time exchange rates from 9+ licensed remittance providers
- Support for 10 countries: Vietnam, Nepal, Philippines, Thailand, Myanmar, Indonesia, Cambodia, Uzbekistan, Sri Lanka, Bangladesh
- Multi-language support (11 languages)
- Free to use

## Tech Stack

- **Frontend**: Next.js, React, i18next
- **Backend**: FastAPI, Python 3.11
- **Deployment**: Railway (Backend), Netlify (Frontend)

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deployment

- Backend: Railway (Dockerfile)
- Frontend: Netlify (Next.js)

## License

All Rights Reserved © 2025 RemitBuddy
