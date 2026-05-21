# 운명의 송금일 (Fortune Remit Day) MVP 백로그

**프로젝트명**: Fortune Remit Day
**목표**: 재미 요소 기반 바이럴 트래픽 확보
**예상 개발 기간**: 1주일
**예상 임팩트**: 런칭 1개월 내 5,000명+ 유입

---

## 📋 MVP 스코프

### 핵심 기능
- 생년월일 입력 → 띠/별자리 기반 "행운의 송금일" 결과 표시
- 결과 카카오톡/페이스북/트위터 공유
- RemitBuddy 메인으로 자연스러운 CTA 연결

### MVP에서 제외
- 회원가입/로그인
- 알림 기능
- 다국어 지원 (영어만)
- 복잡한 애니메이션

---

## 🎯 User Stories

### US-01: 생년월일 입력
**As a** 외국인 근로자
**I want to** 내 생년월일을 입력하면
**So that** 나의 띠와 행운의 송금일을 알 수 있다

**Acceptance Criteria**:
- [ ] 년/월/일 드롭다운 또는 데이트피커
- [ ] 1950-2010년 범위 지원
- [ ] 모바일 최적화 UI

---

### US-02: 운세 결과 표시
**As a** 사용자
**I want to** 내 띠/별자리와 이번 달 행운의 송금일을 보면
**So that** 언제 송금하면 좋을지 재미있게 알 수 있다

**Acceptance Criteria**:
- [ ] 12지신 띠 표시 (이모지 + 이름)
- [ ] 12별자리 표시
- [ ] 이번 달 행운의 날 3개 (⭐ 등급 표시)
- [ ] 피해야 할 날 1개
- [ ] 행운의 통화 추천

---

### US-03: 결과 공유
**As a** 사용자
**I want to** 내 결과를 SNS에 공유하면
**So that** 친구들도 재미있게 해볼 수 있다

**Acceptance Criteria**:
- [ ] 카카오톡 공유 버튼
- [ ] 페이스북 공유 버튼
- [ ] 트위터/X 공유 버튼
- [ ] 링크 복사 버튼
- [ ] OG 이미지 자동 생성 (결과 요약)

---

### US-04: RemitBuddy CTA 연결
**As a** RemitBuddy
**I want to** 사용자가 결과를 본 후 송금 비교로 이동하게
**So that** 트래픽을 전환으로 연결할 수 있다

**Acceptance Criteria**:
- [ ] "행운의 날에 송금하기" CTA 버튼
- [ ] 추천 통화 기반 RemitBuddy 링크 (예: ?to=VND)
- [ ] CTA 클릭 GA4 이벤트 트래킹

---

## 📝 Tasks

### Phase 1: 기획 & 데이터 (Day 1-2)

| ID | Task | 담당 | 예상 시간 | 상태 |
|----|------|------|----------|------|
| T-01 | 12지신 띠별 운세 텍스트 작성 | Content | 2h | ⬜ |
| T-02 | 12별자리별 운세 텍스트 작성 | Content | 2h | ⬜ |
| T-03 | 월별 행운의 날 로직 설계 | Dev | 1h | ⬜ |
| T-04 | 행운의 통화 매핑 (띠 → 통화) | Content | 1h | ⬜ |
| T-05 | UI/UX 와이어프레임 | Design | 2h | ⬜ |

### Phase 2: 프론트엔드 개발 (Day 3-4)

| ID | Task | 담당 | 예상 시간 | 상태 |
|----|------|------|----------|------|
| T-06 | 입력 폼 컴포넌트 | Dev | 2h | ⬜ |
| T-07 | 결과 표시 컴포넌트 | Dev | 3h | ⬜ |
| T-08 | 띠/별자리 계산 로직 | Dev | 2h | ⬜ |
| T-09 | 행운의 날 계산 로직 | Dev | 2h | ⬜ |
| T-10 | 모바일 반응형 CSS | Dev | 2h | ⬜ |
| T-11 | 애니메이션 효과 (결과 reveal) | Dev | 1h | ⬜ |

### Phase 3: 공유 기능 (Day 5-6)

| ID | Task | 담당 | 예상 시간 | 상태 |
|----|------|------|----------|------|
| T-12 | 카카오톡 공유 SDK 연동 | Dev | 2h | ⬜ |
| T-13 | 페이스북 공유 메타태그 | Dev | 1h | ⬜ |
| T-14 | 트위터 공유 기능 | Dev | 1h | ⬜ |
| T-15 | OG 이미지 동적 생성 | Dev | 3h | ⬜ |
| T-16 | 링크 복사 기능 | Dev | 0.5h | ⬜ |

### Phase 4: 트래킹 & CTA (Day 6)

| ID | Task | 담당 | 예상 시간 | 상태 |
|----|------|------|----------|------|
| T-17 | GA4 이벤트 설정 | Dev | 1h | ⬜ |
| T-18 | CTA 버튼 → RemitBuddy 연결 | Dev | 0.5h | ⬜ |
| T-19 | UTM 파라미터 설정 | Dev | 0.5h | ⬜ |

### Phase 5: QA & 런칭 (Day 7)

| ID | Task | 담당 | 예상 시간 | 상태 |
|----|------|------|----------|------|
| T-20 | 크로스 브라우저 테스트 | QA | 1h | ⬜ |
| T-21 | 모바일 디바이스 테스트 | QA | 1h | ⬜ |
| T-22 | 공유 기능 테스트 | QA | 1h | ⬜ |
| T-23 | 프로덕션 배포 | Dev | 1h | ⬜ |
| T-24 | 외국인 커뮤니티 시딩 | Marketing | 2h | ⬜ |

---

## 🎨 UI 스펙

### 페이지 URL
```
https://www.remitbuddy.com/fortune
```

### 화면 구성

```
┌─────────────────────────────────────┐
│  🔮 Fortune Remit Day               │
│  Find Your Lucky Day to Send Money  │
├─────────────────────────────────────┤
│                                     │
│  Enter your birthday:               │
│  ┌──────┐ ┌────┐ ┌────┐            │
│  │ 1992 │ │ 03 │ │ 15 │            │
│  └──────┘ └────┘ └────┘            │
│                                     │
│     [ 🌟 Reveal My Fortune ]        │
│                                     │
└─────────────────────────────────────┘

         ↓ (결과 화면)

┌─────────────────────────────────────┐
│  🐉 You are Water Dragon!           │
│  ♓ Pisces                           │
├─────────────────────────────────────┤
│                                     │
│  🗓️ Your Lucky Days in May 2026:    │
│                                     │
│  ⭐⭐⭐⭐⭐ May 23 (Fri) - BEST!     │
│  ⭐⭐⭐⭐   May 27 (Tue) - Good      │
│  ⭐⭐⭐     May 30 (Fri) - OK        │
│                                     │
│  ⚠️ Avoid: May 25 (Sun)             │
│                                     │
│  💰 Lucky Currency: VND 🇻🇳          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [ 💸 Send Money on Lucky Day ]     │
│                                     │
│  Share your fortune:                │
│  [카톡] [FB] [X] [🔗]               │
│                                     │
└─────────────────────────────────────┘
```

### 색상 팔레트
- Primary: #6B4EE6 (보라색 - 신비로운 느낌)
- Secondary: #FFD700 (골드 - 행운)
- Background: #1A1A2E (다크 - 점술 분위기)
- Text: #FFFFFF

---

## 📊 GA4 이벤트 트래킹

| 이벤트명 | 트리거 | 파라미터 |
|---------|--------|----------|
| `fortune_page_view` | 페이지 진입 | - |
| `fortune_submit` | 생년월일 제출 | `zodiac`, `zodiac_sign` |
| `fortune_result_view` | 결과 표시 | `zodiac`, `lucky_currency` |
| `fortune_share` | 공유 클릭 | `platform` (kakao/fb/x/copy) |
| `fortune_cta_click` | CTA 클릭 | `lucky_currency` |

---

## 🗓️ 타임라인

| 일자 | 마일스톤 | 산출물 |
|------|---------|--------|
| Day 1 | 기획 완료 | 운세 텍스트, 와이어프레임 |
| Day 2 | 데이터 준비 | 띠/별자리/날짜 매핑 JSON |
| Day 3 | 입력 UI 완료 | 생년월일 폼 |
| Day 4 | 결과 UI 완료 | 결과 화면 + 애니메이션 |
| Day 5 | 공유 기능 완료 | 카카오/FB/X 공유 |
| Day 6 | 트래킹 완료 | GA4 이벤트 + CTA |
| Day 7 | 런칭 | 프로덕션 배포 + 시딩 |

---

## 📈 성공 지표 (KPI)

### 1주차 목표
- [ ] 페이지 방문: 500명+
- [ ] 결과 생성: 300명+ (전환율 60%)
- [ ] 공유: 50회+ (공유율 15%)
- [ ] CTA 클릭: 30회+ (클릭율 10%)

### 1개월 목표
- [ ] 총 방문: 5,000명+
- [ ] 공유 통한 유입: 2,000명+ (바이럴 계수 0.4)
- [ ] RemitBuddy 메인 유입: 500명+

---

## 🔄 향후 확장 (Post-MVP)

### Phase 2 (2주차)
- [ ] 다국어 지원 (베트남어, 타갈로그어)
- [ ] 행운의 날 알림 기능 (이메일/푸시)
- [ ] 월간 운세 업데이트 자동화

### Phase 3 (3주차)
- [ ] 친구 운세 비교 기능
- [ ] 띠별 송금 통계 ("용띠가 가장 많이 송금!")
- [ ] 인스타그램 스토리 공유

### Phase 4 (4주차)
- [ ] 운세 정확도 피드백 ("맞았나요?")
- [ ] 개인화 추천 (과거 송금 패턴 기반)
- [ ] 시즌 이벤트 (설날, 추석 특별 운세)

---

## 📝 운세 콘텐츠 예시

### 띠별 행운 메시지 (예: 용띠)

```json
{
  "zodiac": "dragon",
  "emoji": "🐉",
  "name_en": "Dragon",
  "name_ko": "용",
  "element": "water",
  "lucky_message": "Dragons soar high this month! Your financial luck peaks mid-month. Trust your instincts when choosing the best rates.",
  "lucky_currency": ["VND", "PHP"],
  "lucky_numbers": [3, 8, 15],
  "lucky_color": "gold"
}
```

### 행운의 날 계산 로직 (예시)

```javascript
// 간단한 로직 예시 (실제로는 더 정교하게)
function getLuckyDays(birthDate, month, year) {
  const zodiac = getZodiac(birthDate);
  const luckyNumbers = zodiacData[zodiac].lucky_numbers;

  // 해당 월의 날짜 중 lucky_numbers와 매칭되는 날
  const days = [];
  for (let day = 1; day <= 31; day++) {
    const date = new Date(year, month - 1, day);
    if (date.getMonth() !== month - 1) continue;

    // 날짜 숫자 합이 lucky_number와 연관되면 선택
    const daySum = day.toString().split('').reduce((a,b) => a + parseInt(b), 0);
    if (luckyNumbers.includes(daySum % 10)) {
      days.push({ date, score: calculateScore(date, zodiac) });
    }
  }

  return days.sort((a,b) => b.score - a.score).slice(0, 3);
}
```

---

## ⚠️ 리스크 & 대응

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| 카카오 SDK 연동 지연 | 중 | 중 | 링크 복사로 대체 |
| OG 이미지 생성 복잡 | 중 | 낮 | 정적 이미지 사용 |
| 바이럴 안됨 | 중 | 높 | 인플루언서 시딩 강화 |
| 서버 부하 | 낮 | 중 | 정적 페이지로 구현 |

---

*Created: 2026-05-22*
*Last Updated: 2026-05-22*
*Owner: RemitBuddy Growth Team*
