# Railway 배포 가이드

## 배포 설정
- `railway.json`: Railway 배포 설정
- `nixpacks.toml`: Nixpacks 빌드 설정  
- `Procfile`: 프로세스 실행 명령

## 자동 배포 확인

### 1. 배포 로그 확인
```
https://railway.app/project/your-project/deployments
```

### 2. 도메인 확인
```
https://your-project.railway.app
```

### 3. 헬스체크 확인
```
curl https://your-project.railway.app/
```

### 4. 언어별 URL 확인
```
https://your-project.railway.app/ko
https://your-project.railway.app/vi
https://your-project.railway.app/mn
```

## 배포 상태 모니터링
- 자동 재시작: ON_FAILURE (최대 10회)
- 헬스체크 타임아웃: 300초
- 환경변수: NODE_ENV=production

## 문제 해결
1. 로그에서 오류 확인
2. 헬스체크 경로 `/` 응답 확인
3. 포트 `$PORT` 환경변수 사용 확인