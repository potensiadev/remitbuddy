# Hanpass Residential Proxy Setup Guide

## 문제 상황

Hanpass API가 Railway 서버의 클라우드 데이터센터 IP를 차단하고 있어서, Railway에서 Hanpass API 호출이 실패합니다.

## 해결 방법

Residential Proxy를 사용하여 Hanpass 요청만 우회 처리합니다.

---

## Railway 환경 변수 설정

Railway 프로젝트에 다음 환경 변수를 추가하세요:

### 방법 1: 단일 프록시 (간단)

```
HANPASS_PROXY_URL=http://username:password@proxy-server.com:8080
```

### 방법 2: 다중 프록시 (로드 밸런싱)

```
HANPASS_PROXY_1=proxy1.example.com:8080:username1:password1
HANPASS_PROXY_2=proxy2.example.com:8080:username2:password2
HANPASS_PROXY_3=proxy3.example.com:8080:username3:password3
```

---

## Railway에서 환경 변수 추가 방법

1. Railway Dashboard 접속: https://railway.app/dashboard
2. remitbuddy 프로젝트 선택
3. **Variables** 탭 클릭
4. **+ New Variable** 버튼 클릭
5. 변수 추가:
   - Variable Name: `HANPASS_PROXY_URL`
   - Variable Value: `http://user:pass@your-proxy.com:8080`
6. **Add** 버튼 클릭
7. 자동으로 재배포됩니다

---

## Residential Proxy 서비스 추천

다음 서비스들이 Residential Proxy를 제공합니다:

### 1. **Bright Data (구 Luminati)**: https://brightdata.com/
- 가장 큰 residential proxy 네트워크
- 한국 IP 포함
- 가격: Pay-as-you-go 또는 월간 구독

### 2. **Smartproxy**: https://smartproxy.com/
- 좋은 가격 대비 성능
- 한국 포함 195개국
- 가격: $75/month부터 (10GB)

### 3. **Oxylabs**: https://oxylabs.io/
- 엔터프라이즈급 서비스
- 한국 IP 포함
- 가격: 커스텀 플랜

### 4. **IPRoyal**: https://iproyal.com/
- 저렴한 가격
- 한국 residential IP 제공
- 가격: $1.75/GB

### 5. **NetNut**: https://netnut.io/
- 빠른 속도
- 한국 IP 포함
- 가격: 커스텀 플랜

---

## Proxy URL 형식

대부분의 residential proxy 서비스는 다음 형식의 URL을 제공합니다:

```
http://username:password@proxy-server.com:port
```

또는

```
http://username-session-xxx:password@proxy-server.com:port
```

---

## 테스트 방법

### 1. 로컬 테스트

```bash
# 환경 변수 설정 (Windows)
set HANPASS_PROXY_URL=http://user:pass@your-proxy.com:8080

# 환경 변수 설정 (Linux/Mac)
export HANPASS_PROXY_URL=http://user:pass@your-proxy.com:8080

# 백엔드 실행
cd backend
python main.py
```

### 2. Railway 배포 후 테스트

```bash
# Hanpass가 결과에 포함되는지 확인
curl "https://remitbuddy-production.up.railway.app/api/getRemittanceQuote?receive_country=Vietnam&receive_currency=VND&send_amount=1000000"
```

결과에 `"provider": "Hanpass"`가 포함되어야 합니다.

### 3. 디버그 엔드포인트로 확인

```bash
# Hanpass proxy 연결 상태 확인
curl "https://remitbuddy-production.up.railway.app/debug/test-hanpass"
```

응답 예시 (성공):
```json
{
  "success": true,
  "server_ip": "1.2.3.4",
  "elapsed_time": "0.45s",
  "http_status": 200,
  "conclusion": "Hanpass API is accessible from this server"
}
```

---

## 비용 예측

- 요청당 데이터 사용량: 약 5KB
- 하루 1000 요청 기준: 5MB/day = 150MB/month
- **예상 비용 (IPRoyal 기준)**: $0.26/month
- **예상 비용 (Smartproxy 기준)**: $75/month (10GB 플랜)

---

## 주의사항

1. **보안**: Proxy 인증 정보는 절대 코드에 하드코딩하지 마세요. 반드시 환경 변수 사용.
2. **비용**: Residential proxy는 데이터 사용량에 따라 과금되므로 모니터링 필요.
3. **속도**: Proxy를 통한 요청은 직접 연결보다 느릴 수 있습니다 (보통 200-500ms 추가).
4. **신뢰성**: Proxy 서비스 다운타임에 대비하여 여러 프록시 설정 권장.

---

## 문제 해결

### Hanpass가 여전히 나오지 않는 경우

1. **Railway 로그 확인**:
   ```bash
   railway logs
   ```

2. **다음 메시지 확인**:
   - `✅ Loaded X proxies from environment variables` - Proxy 로드 성공
   - `Using proxy xxx.xxx.xxx.xxx for Hanpass request` - Proxy 사용 중
   - `Hanpass request successful with proxy` - 성공

3. **Proxy 연결 테스트**:
   ```bash
   curl -x http://user:pass@your-proxy.com:8080 https://app.hanpass.com/
   ```

4. **Proxy 서비스 대시보드에서 트래픽 확인**

---

## 무료 대안 (비추천)

무료 proxy는 다음 이유로 권장하지 않습니다:
- 불안정한 연결
- 느린 속도
- 보안 위험
- Hanpass가 차단할 가능성 높음

**추천**: Smartproxy나 IPRoyal의 소량 플랜 사용 ($5-10/month)

---

## 빠른 시작

1. Residential proxy 서비스 가입 (예: IPRoyal, Smartproxy)
2. Proxy URL 복사
3. Railway Dashboard → Variables → Add:
   ```
   HANPASS_PROXY_URL=http://user:pass@proxy.com:8080
   ```
4. 자동 재배포 대기 (약 2-3분)
5. 테스트:
   ```bash
   curl "https://remitbuddy-production.up.railway.app/api/getRemittanceQuote?receive_country=Vietnam&receive_currency=VND&send_amount=1000000" | grep "Hanpass"
   ```

성공하면 Hanpass가 결과에 나타납니다! 🎉
