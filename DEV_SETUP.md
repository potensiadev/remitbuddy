# 🚀 RemitBuddy 개발환경 빠른 시작 가이드

## ⚡ 빠른 시작 (한 줄 명령어)

### 1️⃣ 처음 시작할 때 (모든 의존성 설치)

```bash
npm run install:all
```

이 명령어는 다음을 자동으로 실행합니다:
- 루트 패키지 설치
- Frontend 패키지 설치 (Next.js)
- Landing 패키지 설치 (Vite)
- Backend 패키지 설치 (Python)

### 2️⃣ 개발 서버 실행 (한 번에!)

```bash
npm run dev
```

이 명령어 하나로 Frontend + Backend가 동시에 실행됩니다! 🎉

**실행되는 서버:**
- 🔧 Backend (FastAPI): http://localhost:8000
- 🎨 Frontend (Next.js): http://localhost:3000

**Landing 페이지도 함께 실행하려면:**
```bash
npm run dev:all
```
- 🏠 Landing (Vite): http://localhost:5173

---

## 📋 개별 실행 명령어

필요시 각각 따로 실행할 수도 있습니다:

```bash
# Backend만 실행
npm run dev:backend

# Frontend만 실행
npm run dev:frontend

# Landing만 실행
npm run dev:landing
```

---

## 🔧 사전 요구사항

설치되어 있어야 하는 도구들:
- **Node.js** (v18 이상)
- **Python** (v3.11)
- **pip** (Python 패키지 매니저)
- **npm**

---

## 📦 수동 설치 방법

자동 설치가 안 되는 경우 수동으로 설치:

### Backend
```bash
cd backend
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend
npm install
```

### Landing
```bash
cd remitbuddy-landing
npm install
```

---

## 🌐 접속 주소

개발 서버 실행 후:

| 서비스 | URL | 설명 |
|--------|-----|------|
| Frontend | http://localhost:3000 | Next.js 메인 앱 |
| Backend API | http://localhost:8000 | FastAPI 서버 |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Landing | http://localhost:5173 | Vite 랜딩 페이지 |

---

## 🔍 트러블슈팅

### 포트가 이미 사용 중이라는 에러
다른 프로그램이 포트를 사용 중입니다:
```bash
# 포트 사용 확인 (macOS/Linux)
lsof -i :8000
lsof -i :3000

# 포트 사용 확인 (Windows)
netstat -ano | findstr :8000
netstat -ano | findstr :3000
```

### Python uvicorn 명령어를 찾을 수 없음
Python 가상환경을 사용하는 경우:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 또는
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

### 모듈을 찾을 수 없다는 에러
의존성을 다시 설치:
```bash
npm run install:all
```

---

## 💡 유용한 팁

### 터미널 하나로 모든 서버 실행
```bash
npm run dev  # 이것만 실행하면 끝!
```

### 로그 보기
`concurrently`가 각 서버의 로그를 색상으로 구분해서 보여줍니다:
- Backend 로그는 파란색
- Frontend 로그는 초록색

### 서버 중지
`Ctrl + C` 한 번으로 모든 서버가 동시에 중지됩니다.

---

## 🎯 다음 단계

1. Backend API 확인: http://localhost:8000/docs
2. Frontend 메인 화면 확인: http://localhost:3000
3. 코드 수정 시 자동 리로드 확인

개발 환경 설정 완료! 🎉
