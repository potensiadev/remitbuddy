# 블로그 CTR 개선 계획서

**작성일**: 2026-05-17
**우선순위**: P0 (긴급)
**목표**: 블로그 CTR 0% → 5% 이상 달성

---

## 1. 현황 분석

### 문제 요약
| 페이지 | 노출 | 클릭 | CTR | 순위 |
|--------|------|------|-----|------|
| 베트남 송금 가이드 | 24 | 0 | 0% | 6.9 |
| 환율 가이드 (EN) | 6 | 0 | 0% | 4.5 |
| 환율 가이드 (KO) | 6 | 0 | 0% | 7.5 |
| **메인 페이지** | 45 | 12 | 26.7% | 10.3 |

**핵심 발견**: 메인 페이지는 26.7% CTR로 양호하나, 블로그는 0%. 순위는 괜찮음(4.5~7.5) → **메타데이터 문제**

### 원인 분석

1. **메타 타이틀이 검색 의도와 불일치**
   - 현재: "Real-time Remittance to Vietnam 2026: Instant Transfers in Minutes"
   - 문제: "Real-time Remittance"는 검색량 낮은 키워드
   - 유저 검색 의도: "send money to Vietnam", "how to send money Korea Vietnam"

2. **메타 설명이 클릭 유도 부족**
   - 현재: 기술적 설명 중심
   - 필요: 혜택, 비용 절감, 행동 유도 (CTA)

3. **경쟁 페이지 대비 차별화 부족**
   - 검색 결과에서 눈에 띄지 않음

---

## 2. 개선안

### 베트남 송금 가이드 메타데이터 A/B 테스트

#### 현재 (Control)
```
Title: Real-time Remittance to Vietnam 2026: Instant Transfers in Minutes
Description: Korea's new real-time remittance system launches Q3 2026. Send money to Vietnam in under 10 minutes. Compare costs, speed & banks. Complete guide for Korean workers.
```

#### 변경안 A (혜택 강조)
```
Title: Send Money to Vietnam from Korea: Save 50% on Fees (2026 Guide)
Description: Compare 8 remittance services to Vietnam. Find the cheapest way to send money home. Real rates, real fees, updated weekly. Free comparison tool inside.
```

#### 변경안 B (속도 + 비용 강조)
```
Title: Korea to Vietnam Money Transfer: Fastest & Cheapest Methods 2026
Description: Send money to Vietnam in 10 minutes. Compare GmoneyTrans, Coinshot, E9Pay fees side-by-side. Workers in Korea save $15-20 per transfer with our guide.
```

#### 변경안 C (문제 해결형)
```
Title: How to Send Money to Vietnam from Korea: Complete Guide 2026
Description: Tired of high fees and slow transfers? Compare 8 Vietnam remittance options. See exact fees, exchange rates, and transfer times. Updated May 2026.
```

### 환율 가이드 메타데이터 개선안

#### 현재
```
Title: How to Find Best Exchange Rate in Korea
Description: (기존 설명)
```

#### 변경안
```
Title: Best Exchange Rates in Korea 2026: Where to Get More Won for Your Money
Description: Compare bank rates, money changers, and apps. Foreign workers save 2-5% with these tips. Real-time rate comparison + hidden fee alerts.
```

---

## 3. 실행 계획

### Phase 1: 즉시 실행 (이번 주)

| 태스크 | 담당 | 완료 기준 |
|--------|------|----------|
| 베트남 가이드 메타 변경안 A 적용 | Content | Notion 업데이트 |
| 환율 가이드 메타 변경 | Content | Notion 업데이트 |
| GSC에서 URL 재색인 요청 | SEO | Inspect URL 완료 |

### Phase 2: 1주 후 측정

| 지표 | 현재 | 목표 |
|------|------|------|
| 베트남 가이드 CTR | 0% | 3%+ |
| 환율 가이드 CTR | 0% | 3%+ |
| 전체 블로그 클릭 | 0 | 5+ |

### Phase 3: 2주 후 A/B 테스트 평가

- CTR 3% 미달 시 → 변경안 B 또는 C로 교체
- CTR 3% 이상 시 → 다른 블로그에 동일 패턴 적용

---

## 4. 메타데이터 최적화 공식

### Title 공식 (60자 이내)
```
[Primary Action] + [Destination] + [Benefit/Year]: [Secondary Value]

예시:
- Send Money to [Country] from Korea: [Benefit] (2026)
- [Country] Remittance Guide: [Unique Value] 2026
- How to Send Money to [Country]: [Benefit]
```

### Description 공식 (155자 이내)
```
[문제 인식] + [해결책] + [구체적 혜택] + [CTA]

예시:
- Compare [N] services. Find the cheapest/fastest option. Save $X per transfer. Free comparison inside.
- Tired of [pain point]? [Solution]. [Specific benefit]. Updated [Month] 2026.
```

### CTR 높이는 파워 워드
- **숫자**: "8 services", "Save $20", "10 minutes"
- **최신성**: "2026", "Updated May", "New"
- **비교**: "Compare", "vs", "Best"
- **혜택**: "Save", "Free", "Cheapest", "Fastest"
- **행동**: "How to", "Guide", "Compare Now"

---

## 5. 모니터링 계획

### 주간 체크리스트
- [ ] GSC에서 블로그 페이지 CTR 확인
- [ ] 노출 대비 클릭 변화 추적
- [ ] 순위 변동 모니터링

### 성공 기준
| 기간 | CTR 목표 | 클릭 목표 |
|------|----------|----------|
| 1주 후 | 2%+ | 1+ |
| 2주 후 | 3%+ | 3+ |
| 4주 후 | 5%+ | 10+ |

### 실패 시 대응
- CTR 개선 없음 → 타이틀 전면 교체
- 노출 감소 → 키워드 재검토
- 순위 하락 → 콘텐츠 품질 점검

---

## 6. 향후 적용

이 개선안이 효과 있을 경우, 아래 콘텐츠에 동일 패턴 적용:

1. GCash Philippines 가이드
2. Cambodia 송금 가이드
3. Nepal 송금 가이드
4. 신규 말레이시아 가이드 (P1)

---

## 참고: 검색 의도별 메타 전략

| 검색 의도 | 타이틀 패턴 | 설명 패턴 |
|----------|------------|----------|
| How-to | "How to [Action]: [Benefit]" | 단계별 가이드 강조 |
| Comparison | "[A] vs [B]: Which is [Better/Cheaper]" | 비교 포인트 나열 |
| Best/Top | "Best [N] [Services] for [Audience]" | 선정 기준 + 혜택 |
| Cost | "[Service] Fees: How Much Does It Cost" | 구체적 비용 수치 |
