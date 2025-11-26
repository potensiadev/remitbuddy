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

## 💻 다른 기기에서 접속하기 (노트북 등)

같은 Wi-Fi/네트워크에 있는 다른 기기(노트북 등)에서 개발 서버에 접속할 수 있습니다.

### 방법 1: 네트워크를 통한 접속 (추천)

**1. 서버 실행 중인 PC의 IP 주소 확인**

Windows (PowerShell 또는 CMD):
```bash
ipconfig
```

macOS/Linux:
```bash
ifconfig  # 또는
ip addr show
```

`IPv4 주소` 찾기 (예: `192.168.0.10`)

**2. Windows 방화벽 설정 (Windows만 해당)**

PowerShell을 관리자 권한으로 실행 후:
```powershell
# Frontend 포트 허용
netsh advfirewall firewall add rule name="Next.js Dev" dir=in action=allow protocol=TCP localport=3000

# Backend 포트 허용
netsh advfirewall firewall add rule name="FastAPI Dev" dir=in action=allow protocol=TCP localport=8000
```

**3. 노트북/다른 기기에서 접속**

노트북 브라우저에서 (PC IP가 192.168.0.10인 경우):
- Frontend: `http://192.168.0.10:3000`
- Backend API Docs: `http://192.168.0.10:8000/docs`

**참고**: Backend의 CORS 설정이 개발 모드에서는 로컬 네트워크를 자동으로 허용합니다.

### 방법 2: 독립적인 개발 환경 구축

노트북에서도 독립적으로 개발하고 싶다면:

```bash
# 저장소 클론
git clone https://github.com/potensiadev/remitbuddy.git
cd remitbuddy

# 브랜치 체크아웃
git checkout claude/setup-dev-environment-01EZ2PEuY1yXXw8LPGUehxjb

# 의존성 설치 및 실행
npm run install:all
cd frontend && copy .env.example .env.local && cd ..
npm run dev
```

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
