# Hanpass Smart Proxy Fallback Guide

## 문제 상황

Hanpass API가 Railway 서버의 클라우드 데이터센터 IP를 차단할 수 있습니다.

## 해결 방법

**스마트 자동 fallback 시스템**을 구현했습니다:

### 🧠 자동 IP 차단 감지 및 Proxy 전환

1. **기본 모드**: Direct connection (무료)
2. **3회 연속 실패 시**: 자동으로 Proxy 모드로 전환
3. **Proxy 모드**: 1시간 동안 유지
4. **1시간 후**: 자동으로 direct connection 재시도

### 💰 비용 절감

- IP 차단 없을 때: Proxy 사용 안함 (비용 $0)
- IP 차단 감지 시: 자동으로 Proxy 전환
- 일시적 문제 시: 자동 복구로 proxy 비용 최소화

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

### 3. Hanpass 연결 통계 확인

```bash
# Hanpass 연결 상태 및 통계 확인
curl "https://remitbuddy-production.up.railway.app/debug/hanpass-stats"
```

응답 예시 (정상):
```json
{
  "hanpass_connection": {
    "total_requests": 100,
    "successful_requests": 100,
    "success_rate": "100.0%",
    "consecutive_failures": 0,
    "force_proxy_mode": false,
    "force_proxy_remaining_minutes": 0
  },
  "proxy_available": true,
  "proxy_count": 1,
  "recommendation": "✅ EXCELLENT - All requests successful, no proxy needed",
  "timestamp": "2025-10-26T14:30:00.000000"
}
```

응답 예시 (IP 차단 감지):
```json
{
  "hanpass_connection": {
    "total_requests": 10,
    "successful_requests": 7,
    "success_rate": "70.0%",
    "consecutive_failures": 3,
    "force_proxy_mode": true,
    "force_proxy_remaining_minutes": 58
  },
  "proxy_available": true,
  "proxy_count": 1,
  "recommendation": "⚠️ IP BLOCKING DETECTED - Using proxy mode for next 58 minutes",
  "timestamp": "2025-10-26T14:30:00.000000"
}
```

### 4. 디버그 엔드포인트로 직접 테스트

```bash
# Hanpass API 직접 테스트
curl "https://remitbuddy-production.up.railway.app/debug/test-hanpass"
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

---

## 작동 원리

### 스마트 Fallback 플로우

```
┌─────────────────────────────────────────────────────────────┐
│                   Hanpass 요청 시작                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ 강제 Proxy 모드?     │
          └──────┬───────┬───────┘
                 │ YES   │ NO
                 │       │
                 │       ▼
                 │  ┌─────────────────────┐
                 │  │ Direct Connection   │
                 │  │ 시도 (무료)         │
                 │  └──────┬──────┬───────┘
                 │         │      │
                 │    SUCCESS  FAILURE
                 │         │      │
                 │         ▼      ▼
                 │    ┌────────┐ ┌──────────────┐
                 │    │ 성공!  │ │ 실패 카운트  │
                 │    │ 반환   │ │ +1           │
                 │    └────────┘ └──────┬───────┘
                 │                      │
                 │                      ▼
                 │              ┌───────────────┐
                 │              │ 3회 연속      │
                 │              │ 실패?         │
                 │              └───┬───────┬───┘
                 │                  │ YES   │ NO
                 │                  │       │
                 │                  ▼       ▼
                 │          ┌──────────┐  ┌─────────────┐
                 │          │ 강제     │  │ Proxy로     │
                 │          │ Proxy    │  │ 재시도      │
                 │          │ 모드 ON  │  └──────┬──────┘
                 │          │ (1시간)  │         │
                 │          └──────────┘    SUCCESS/FAIL
                 │                               │
                 ▼                               ▼
        ┌────────────────┐              ┌────────────┐
        │ Proxy로        │              │ 결과 반환  │
        │ 바로 시도      │              └────────────┘
        └────────┬───────┘
                 │
            SUCCESS/FAIL
                 │
                 ▼
        ┌────────────────┐
        │ 결과 반환      │
        └────────────────┘
```

### 주요 특징

1. **비용 최적화**
   - 정상 작동 시: Direct connection (무료)
   - IP 차단 시만: Proxy 사용 (유료)

2. **자동 복구**
   - 1시간 후 자동으로 direct connection 재시도
   - IP 차단 해제되면 자동으로 무료 모드로 복귀

3. **즉각적인 Fallback**
   - Direct connection 실패 → 즉시 proxy로 재시도
   - 사용자는 지연 없이 결과 확인

4. **스마트 감지**
   - 3회 연속 실패 = IP 차단으로 판단
   - 1시간 동안 proxy 강제 사용으로 안정성 확보

---

## 모니터링

### Railway 로그 확인

```bash
railway logs --tail 100
```

**정상 작동 시 로그:**
```
Making Hanpass request with direct connection
Hanpass request successful (proxy=False)
Hanpass success (proxy=False). Success rate: 100/100
```

**IP 차단 감지 시 로그:**
```
Making Hanpass request with direct connection
Hanpass connection error (proxy=False): TimeoutError
Hanpass direct connection failed (consecutive: 1)
Direct connection failed, retrying with proxy...
Making Hanpass request with proxy xxx.xxx.xxx.xxx
Hanpass request successful (proxy=True)
✅ Proxy fallback successful
Hanpass success (proxy=True). Success rate: 95/100
```

**Proxy 강제 모드 전환 시 로그:**
```
Hanpass direct connection failed (consecutive: 3)
⚠️ IP BLOCKING DETECTED: Switching to proxy mode for 1 hour
Using proxy for Hanpass (forced mode, 59 min remaining)
```

---

## 권장 설정

### Proxy 없이 운영 (현재 상태)

- ✅ 현재 Railway에서 Hanpass 정상 작동 중
- ✅ Proxy 비용 $0
- ⚠️ IP 차단 위험 존재

**권장**: 일단 proxy 없이 운영하고 모니터링

### Proxy 준비 (안전)

IP 차단 대비하여 proxy를 미리 설정해두되, 필요시에만 사용:

1. Residential proxy 서비스 가입 (IPRoyal 추천, $1.75/GB)
2. Railway에 환경 변수 추가:
   ```
   HANPASS_PROXY_URL=http://user:pass@proxy.com:8080
   ```
3. 평소에는 direct connection 사용 (비용 $0)
4. IP 차단 감지 시 자동으로 proxy 사용

**예상 비용**: $0.26/month (월 1000 요청 기준)

---

## FAQ

### Q: Proxy를 설정하면 항상 proxy를 사용하나요?
**A:** 아니요! 평소에는 direct connection을 사용하고, IP 차단 감지 시에만 자동으로 proxy로 전환됩니다.

### Q: IP 차단이 해제되면 어떻게 되나요?
**A:** 1시간 후 자동으로 direct connection을 다시 시도합니다. 성공하면 proxy 사용을 중단하고 무료 모드로 복귀합니다.

### Q: Proxy 비용이 얼마나 나올까요?
**A:** IP 차단이 없으면 $0입니다. IP 차단 시에만 사용되며, 월 1000 요청 기준 약 $0.26입니다.

### Q: Railway 로그에서 뭘 확인해야 하나요?
**A:** "IP BLOCKING DETECTED" 메시지를 확인하세요. 이 메시지가 보이면 proxy 모드로 전환된 것입니다.

### Q: Proxy 없이도 잘 작동하는데 설정이 필요한가요?
**A:** 현재는 필요 없습니다. 나중에 IP 차단이 발생하면 그때 설정하면 됩니다.

---

## 결론

**현재 상태**: ✅ Proxy 없이 Hanpass 정상 작동 중

**권장 사항**:
1. 현재는 proxy 설정 불필요
2. `/debug/hanpass-stats` 엔드포인트로 주기적 모니터링
3. IP 차단 감지 시 proxy 설정

**만약 IP 차단 발생 시**:
1. IPRoyal이나 Smartproxy 가입 (5분)
2. Railway에 `HANPASS_PROXY_URL` 환경 변수 추가 (1분)
3. 자동으로 복구됨! 🎉
