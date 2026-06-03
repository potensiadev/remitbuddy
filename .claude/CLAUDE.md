# RemitBuddy Claude Code Configuration

## Official URLs

| Purpose | URL |
|---------|-----|
| English Website | https://www.remitbuddy.com |
| Korean Website | https://www.remitbuddy.com/ko |
| Blog (Notion Published) | https://www.remitbuddy.com/blog |

### URL Details

- **English Version**: `www.remitbuddy.com` - Default English landing page for international users
- **Korean Version**: `www.remitbuddy.com/ko` - Korean localized version for Korean-speaking users
- **Blog**: `www.remitbuddy.com/blog` - Blog content published from Notion database

All agents and orchestrators should use these official URLs when referencing RemitBuddy's web presence.

## Target Audience

- Foreign workers living in Korea who send money to their home countries
- International students in Korea who need to remit money home

## Service

RemitBuddy is an international remittance comparison service that helps users find the best rates and lowest fees for sending money abroad from Korea.

## Blog Content Reference

All blog-related agents MUST reference existing content before creating new posts:

### Content Location
- **Blog content folder**: `docs/blog-content/`
- **Content schedule**: `docs/blog-content/CONTENT_SCHEDULE.md`
- **Format**: Markdown files with YAML frontmatter

### IMPORTANT: Check Content Schedule First
Before writing any blog content:
1. Read `docs/blog-content/CONTENT_SCHEDULE.md`
2. Check if topic is in "Backlog" status
3. Avoid duplicating "Published" content
4. Update schedule status after completing content

### Before Writing New Content
1. **Check for duplicates**: Read existing `.md` files in `docs/blog-content/`
2. **Reference existing style**: Match the format, tone, and structure
3. **Add internal links**: Link to related existing content
4. **Avoid overlap**: If similar content exists, improve it or find a new angle

### Content Files Structure
```
docs/blog-content/
├── send-money-korea-to-nepal-guide.md
├── indonesia-remittance-tax-exemption-guide.md
├── real-time-remittance-guide-vietnam-2026.md
├── remittance-tax-incentive-guide-foreign-workers-2026.md
├── send-money-gcash-korea-philippines.md
├── send-money-korea-to-cambodia-guide.md
└── [future-content].md
```

### ⚠️ CRITICAL: Language Rules
- **ALL blog content MUST be written in English ONLY**
- **NO Korean text allowed** in any part of the content (title, body, FAQ, tables, etc.)
- Korean keywords are for internal SEO research only - never include them in actual content
- Target audience: Non-native English speakers (use simple, clear English)

### Required Frontmatter
```yaml
---
title: "Title Here"
slug: url-slug-here
meta_title: "SEO Title (60 chars)"
meta_description: "Description (155 chars)"
excerpt: "Short summary (200-250 chars)"
language: en
category: Remittance Guides
tags: [Tag1, Tag2]
primary_keyword: main keyword
secondary_keywords: [keyword1, keyword2]
status: draft
created_date: YYYY-MM-DD
---
```

---

## 🖼️ 노션 업로드 시 이미지 처리 가이드라인 (2026-06-03 학습)

### 🚨 문제 현상
블로그 목록 페이지에서 이미지가 로드되지 않고 alt text만 표시됨:
```
"Cheapest Way to Send Money to Sri Lanka from Korea (2026 Guide)"
(이미지 영역이 비어있고 제목 텍스트만 노출)
```

### 원인 분석
| 케이스 | Image 속성 값 | 결과 |
|--------|--------------|------|
| ❌ 잘못됨 | 외부 URL (`https://www.remitbuddy.com/og-image.png`) | 이미지 로드 실패, alt text만 표시 |
| ✅ 정상 | 노션 내부 파일 (`file://attachment:...`) | 이미지 정상 표시 |
| ✅ 정상 | Image 속성 비워둠 (null/없음) | 기본 그라데이션 배경 표시 |

### 📋 필수 준수 사항

#### 방법 1: Image 속성 비우기 (권장 - 간단하고 안전)
```
노션 업로드 시 Image 속성을 설정하지 않음
→ 프론트엔드에서 기본 그라데이션 배경 표시
→ alt text 노출 문제 없음
```

**노션 페이지 생성 시:**
```json
{
  "Name": "제목",
  "Slug": "slug-here",
  "Meta Title": "...",
  "Meta Description": "...",
  "Excerpt": "...",
  "Tags": ["Tag1", "Tag2"],
  "Ready to Publish": "__NO__"
  // Image 속성 생략 (추가하지 않음)
}
```

#### 방법 2: 노션에 직접 이미지 업로드 (수동)
```
1. 노션 페이지 열기
2. Image 속성 클릭
3. 이미지 파일 직접 업로드 (드래그 앤 드롭 또는 파일 선택)
4. 노션 서버에 저장됨 (file://attachment:... 형식)
```

### ❌ 절대 하지 말 것
```
- 외부 URL을 Image 속성에 입력 금지
  예: "https://www.remitbuddy.com/og-image.png"
  예: "https://example.com/image.jpg"

- 이유:
  1. CORS 정책으로 이미지 로드 차단될 수 있음
  2. 외부 서버 다운 시 이미지 표시 안 됨
  3. 브라우저에서 alt text만 렌더링되어 UX 저하
```

### 프론트엔드 동작 (참고)
```javascript
// frontend/pages/blog/index.js - Line 78-90
{post.cover ? (
  <img src={post.cover} alt={post.title} ... />
) : (
  // cover가 없으면 기본 그라데이션 배경 표시
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
    <svg ... /> // 기본 아이콘
  </div>
)}
```

### 체크리스트 (노션 업로드 전)
```
[ ] Image 속성에 외부 URL을 입력하지 않았는가?
[ ] Image 속성을 비워두거나, 노션에 직접 업로드했는가?
[ ] 발행 전 /blog 페이지에서 이미지 표시 확인했는가?
```

### 실수 사례 (2026-06-03)
**상황**: weak won 시리즈 9개 콘텐츠 노션 업로드
**문제**: Image 속성에 `https://www.remitbuddy.com/og-image.png` 입력
**결과**: 블로그 목록에서 이미지 로드 실패, alt text만 표시
**해결**: Image 속성 비우기 또는 노션에 직접 이미지 업로드

---

## Marketing Strategy (2026.05 - 2026.10)

### 6개월 집중 전략: SEO + 블로그 Only

**결정일**: 2026-05-09
**기간**: 2026년 5월 ~ 2026년 10월 (6개월)

#### 전략 요약
- **1순위만 집중**: SEO + 블로그 콘텐츠 마케팅
- **제외**: 페이스북 커뮤니티, 인플루언서, 유료 광고
- **이유**: 리소스 집중, 장기적 복리 효과, 자동화된 트래픽 확보

#### 실행 계획

| 월 | 목표 | 콘텐츠 | 상태 |
|---|------|--------|------|
| 5월 | 기반 구축 | 국가별 가이드 2개 | ✅ 완료 (GCash Philippines, Cambodia) |
| 6월 | 키워드 확장 | 비용 절약 가이드 2개 | 예정 |
| 7월 | 트래픽 증가 | 환율/세금 가이드 2개 | 예정 |
| 8월 | 롱테일 공략 | 업체별 비교 가이드 2개 | 예정 |
| 9월 | 시즌 콘텐츠 | 추석 송금 가이드 등 | 예정 |
| 10월 | 성과 분석 | 리뷰 및 전략 조정 | 예정 |

#### 핵심 KPI (6개월 후 목표)
- 월 오가닉 트래픽: 5,000 방문
- 블로그 포스트: 15개 이상
- 검색 키워드 상위 노출: 10개 이상
- 제휴 전환: 월 50건

#### 콘텐츠 우선순위 키워드
1. "한국에서 베트남 송금"
2. "필리핀 송금 비교"
3. "해외 송금 수수료 비교"
4. "외국인 근로자 송금"
5. "가장 싼 송금 방법"

#### 6개월 후 재검토 사항
- 트래픽 목표 달성 여부
- 유료 광고 추가 필요성
- 인플루언서 협력 검토
- 수익화 모델 본격 실행

## Analytics & Data Insights

### 데이터 참조 위치
모든 에이전트는 콘텐츠 기획 및 그로스 전략 수립 시 아래 분석 데이터를 참조해야 합니다:

| 분석 유형 | 파일 경로 | 최종 업데이트 |
|----------|----------|--------------|
| **종합 분석 (최신)** | `docs/analytics/gsc-ga4-insights-2026-06-03.md` | 2026-06-03 |
| 이전 분석 | `docs/analytics/gsc-ga4-insights-2026-06-01.md` | 2026-06-01 |

### GSC 핵심 인사이트 (2026-06-03 기준)

**14일 성과 요약 (5/18-6/1)**:
- 총 노출: **~950회** (+25%) | 총 클릭: **18회** (+6%) | 노출 급상승, CTR 병목

**페이지별 성과 (상위)**:
| 페이지 | 클릭 | 노출 | CTR | 순위 | 액션 |
|--------|------|------|-----|------|------|
| `/` (EN 메인) | 15 | 32 | **46.9%** | 9.6 | - |
| **E9 Visa 가이드** | 1 | **235** | 0.43% | 8.0 | ✅ 메타 최적화 완료 |
| **MoMo 가이드** | 1 | **198** | 0.51% | 9.2 | ✅ 메타 최적화 완료 |
| GCash 가이드 | 0 | 76 | 0% | 18.4 | 메타 최적화 필요 |
| Hanpass 비교 | 0 | 72 | 0% | 8.5 | 메타 최적화 필요 |
| **7 Ways 가이드** | 1 | 20 | **5%** | 12.2 | CTR 패턴 검증 |

**핵심 발견 (6/3 업데이트)**:
1. **노출 폭증, 클릭 정체** - CTR 최적화가 핵심 병목
2. **캐나다 시장 재확인** - 28일 기준 9클릭, CTR 29% (2위 시장)
3. **인도/스리랑카 콘텐츠 제작 완료** - Draft 상태
3. **스리랑카 수요 발견** - 코리도어 검색 3위 (콘텐츠 없음)
4. **/ko 참여도 압도적** - 이탈률 7.1%, 체류 6분 39초

### GA4 핵심 인사이트 (2026-06-01 기준)

**트래픽 (14일)**:
- 세션: 81 (+8%) | 유저: 27 (-10%, 재방문↑) | 페이지뷰: 275 (+20%)
- 이탈률: **30.9%** (-25%!) | 평균 체류: **4분 59초** (+23%)

**국가별 트래픽 (14일)**:
| 국가 | 세션 | 유저 | 페이지뷰 | 유저당 PV |
|------|------|------|----------|-----------|
| 한국 | 63 | 18 | 220 | **12.2** |
| **캐나다** | 6 | 2 | 14 | 7.0 |
| **인도** | 6 | 3 | 15 | 5.0 |
| 베트남 | 3 | 1 | 12 | **12.0** |

**페이지별 참여도**:
- /ko (한국어): 체류 **6분 39초**, 이탈률 **7.1%** (압도적!)
- / (영어): 체류 4분 6초, 이탈률 43.4%

### 데이터 기반 콘텐츠 우선순위 (2026-06-01 업데이트)

| 우선순위 | 콘텐츠 | 근거 |
|---------|--------|------|
| **P0** | E9 Visa 가이드 메타 최적화 | 159노출/0클릭 |
| **P0** | 인도 송금 가이드 | CTR 20%, 6세션 |
| **P0** | 캐나다 시장 분석 | CTR 31%, 5클릭 (신규!) |
| **P1** | 스리랑카 송금 가이드 | 코리도어 3위 (11검색) |
| P1 | MoMo 가이드 추가 최적화 | 177노출/0.56% |
| P1 | 베트남 Real-time 제목 변경 | 82노출/0클릭 |
| P2 | 네팔/GCash 가이드 업데이트 | 순위 개선 필요 |

### 분석 주기
- **GSC + GA4 종합**: 매주 (14일 데이터)
- **다음 분석**: 2026-06-10

### 📊 메타데이터 최적화 실험 결과 (2026-05-17 시작)

**실험 상태**: ✅ 효과 확인됨 + 추가 최적화 실행 (6/3)

**결과 요약**:
| 페이지 | 5/17 CTR | 6/3 CTR | 6/3 액션 |
|--------|----------|---------|----------|
| E9 Visa 가이드 | 0% | 0.43% | ✅ 메타 재최적화 |
| MoMo 가이드 | 0% | 0.51% | ✅ 메타 재최적화 |
| 7 Ways 가이드 | N/A | **5%** | 패턴 검증됨 |
| 베트남 Real-time | 0% | 0% | ✅ 메타 재최적화 |

**CTR 최적화 공식 (검증됨)**:
```
Title: [Benefit/Pain Point] + [Action] + [Destination] + [Year]
예시: "Cheapest Way to Send Money to India from Korea 2026"
Power Words: Cheapest, Fastest, Best, Free, Save, Compare

Description Hook: [Pain Point 질문/문장]. [구체적 숫자/비교]. [CTA].
예시: "Stop overpaying banks ₩25,000. Send for just ₩3,000-5,000. Compare rates."
```

## 🎯 Quick Win 액션 아이템 (2026-06-03 기준)

**데이터 기반 우선순위 태스크** - 모든 에이전트는 이 액션 아이템을 참조해야 함

### ✅ 완료 (2026-06-03 실행)

#### E9 Visa 가이드 메타 최적화 ✅
- **이전**: "E-9 Visa Salary Korea 2026: ₩2.4-3M/Month + Overtime Calculator"
- **변경**: "E9 Visa Korea Salary 2026: ₩2.4-3M/Month + Free Calculator"
- **설명**: "Are you underpaid? E9 visa workers earn ₩2.4-3M/month in Korea..."
- **목표**: CTR 0.43% → 3%+

#### MoMo 가이드 메타 최적화 ✅
- **이전**: "Cheapest Way to Send Money to MoMo Vietnam from Korea 2026"
- **변경**: "Send Money to MoMo Vietnam from Korea: Cheapest Way 2026"
- **설명**: "Stop overpaying banks ₩25,000 per transfer..."
- **목표**: CTR 0.51% → 2%+

#### 인도 송금 가이드 제작 ✅
- **Notion**: Draft 생성 완료
- **URL**: https://app.notion.com/p/3731bac13f5281a889fec45396dbb78a
- **슬러그**: send-money-korea-to-india-guide

#### 스리랑카 송금 가이드 제작 ✅
- **Notion**: Draft 생성 완료
- **URL**: https://app.notion.com/p/3731bac13f5281c4b4f5eae1eeb7ce39
- **슬러그**: send-money-korea-to-sri-lanka-guide

#### 캐나다 시장 분석 ✅
- **결과**: 28일 기준 CTR 29%, 9클릭 (한국 다음 2위)
- **코리도어**: KRW→CAD 3검색, 2유저
- **권고**: 규모 작아 2주 추가 모니터링 후 결정

#### 베트남 Real-time 제목 변경 ✅ (로컬 파일)
- **이전**: "Real-time Remittance to Vietnam 2026: Instant Transfers in Minutes"
- **변경**: "Fastest Way to Send Money to Vietnam from Korea 2026 (10 Minutes)"
- **참고**: Notion에서 페이지 미발견, 로컬 파일만 업데이트

### P0: 이번 주 (6/4-6/7)

#### 인도/스리랑카 가이드 발행
- **액션**: Draft 검토 후 Ready to Publish 변경
- **목표**: 인덱싱 및 첫 노출

#### GCash 가이드 메타 최적화
- **문제**: 76노출/0클릭 (CTR 0%)
- **현재 순위**: 18.4 (2페이지)
- **액션**: 메타 최적화 + 내부링크 추가

#### Hanpass 비교 메타 최적화
- **문제**: 72노출/0클릭 (CTR 0%)
- **현재 순위**: 8.5 (첫 페이지)
- **액션**: 메타 최적화

### P1: 다음 주 (6/8-6/14)

#### E9/MoMo CTR 효과 측정
- **확인**: GSC에서 CTR 변화 확인
- **목표**: E9 3%+, MoMo 2%+

#### 캐나다 트래픽 재분석
- **확인**: 추이 지속 여부
- **결정**: 콘텐츠 제작 필요성

### 국가별 기회 분석 (2026-06-03 업데이트)

| 국가 | GSC CTR | GSC 노출 | 코리도어 | 콘텐츠 | 상태 |
|------|---------|----------|----------|--------|------|
| 🇨🇦 캐나다 | **29%** | 31 | 3 | 없음 | 모니터링 |
| 🇮🇳 인도 | **21%** | 19 | - | ✅ 1개 (Draft) | 발행 대기 |
| 🇱🇰 스리랑카 | - | - | 14 | ✅ 1개 (Draft) | 발행 대기 |
| 🇻🇳 베트남 | 0% | ~300 | 69 | 3개 | 메타 최적화 완료 |
| 🇵🇭 필리핀 | 0% | 76 | 11 | 1개 | 메타 최적화 필요 |
| 🇳🇵 네팔 | 0% | 49 | 23 | 1개 | 순위 개선 필요 |

### 학습된 패턴 (6/3 업데이트)

1. **노출 폭증, 클릭 정체** - CTR 최적화가 핵심 병목
2. **캐나다 시장 재확인**: CTR 29%, 9클릭 (2위)
3. **/ko 참여도 압도적**: 이탈률 22% (영어 48%의 절반)
4. **MoMo 노출 폭증**: 121→177회 (+46%)
5. **7 Ways 패턴 검증**: CTR 5.88% 유지

---

## 📝 콘텐츠 작성 학습 (CTR 최적화)

### 타이틀 작성 원칙 (2026-05-20 학습)

**핵심**: 검색자의 Pain Point를 타이틀 첫 단어에 배치

#### Bad vs Good 예시

| ❌ Bad (작성자 관점) | ✅ Good (검색자 관점) |
|---------------------|----------------------|
| Send Money to Vietnam from Korea: Cheapest Way | **Cheapest** Way to Send Money to Vietnam from Korea |
| Send Money to Philippines: Fastest Method | **Fastest** Way to Send Money to Philippines |
| How to Find Best Exchange Rate in Korea | **Best** Exchange Rate in Korea: How to Find |

#### 왜 이렇게 해야 하는가?

1. **SERP 스캔 시간**: 검색자는 0.5초 안에 클릭 결정
2. **첫 단어 = 클릭 트리거**: Cheapest, Fastest, Best, Free가 먼저 보여야 함
3. **검색어 매칭**: "cheapest way to send money" 검색 시 동일 순서 = 굵게 표시

#### 작성 전 자문 체크리스트

- [ ] "이 검색어를 치는 사람이 가장 먼저 보고 싶은 단어가 뭐지?"
- [ ] 그 단어가 타이틀 첫 번째에 있는가?
- [ ] 기존 패턴 일관성보다 검색 의도를 우선했는가?

#### Power Words 우선순위 (첫 단어 후보)

| 검색 의도 | 첫 단어 | 예시 |
|----------|---------|------|
| 비용 절감 | **Cheapest**, Lowest, Save | Cheapest Way to Send Money... |
| 속도 | **Fastest**, Quick, Instant | Fastest Way to Transfer... |
| 품질 | **Best**, Top, Ultimate | Best Remittance Apps... |
| 무료 | **Free**, No Fee | Free Money Transfer... |
| 비교 | **Compare**, vs | Compare Hanpass vs E9Pay... |

#### 실수 원인 분석 (재발 방지)

**원인**: 기존 콘텐츠 패턴("Send Money to [국가]...")을 무의식적으로 따름
**결과**: 검색자 관점이 아닌 작성자 관점으로 타이틀 작성
**교훈**: 일관성 < CTR 최적화. 항상 검색자 입장에서 먼저 생각할 것

---

## 🚨 콘텐츠 제작 전 필수 체크 (2026-05-20 학습)

### 반드시 기존 콘텐츠 확인 후 제작

**모든 에이전트 필수 준수 사항**:

콘텐츠 제작/주제 제안 요청 시 **반드시 아래 순서로 기존 콘텐츠 확인**:

1. **노션 데이터베이스 확인**: `mcp__notion__notion-fetch` → DB ID: `3081bac13f5281c589f4e9ccd21156dc`
2. **로컬 파일 확인**: `docs/blog-content/` 폴더의 모든 .md 파일
3. **CONTENT_SCHEDULE.md 확인**: `docs/blog-content/CONTENT_SCHEDULE.md`

### 체크리스트

```
[ ] 노션 DB에서 유사 제목/슬러그 검색했는가?
[ ] docs/blog-content/ 폴더에서 관련 파일 확인했는가?
[ ] CONTENT_SCHEDULE.md에서 발행 상태 확인했는가?
[ ] 중복 콘텐츠가 없음을 확인했는가?
```

### 실수 사례 (2026-05-20)

**상황**: 베트남 콘텐츠 10개 주제 제안 시 "긴급 송금" 주제 포함
**문제**: `emergency-money-transfer-1-hour.md` 이미 발행됨 (2026-05-15)
**원인**: 기존 콘텐츠 확인 없이 주제 제안
**결과**: 중복 주제 제안으로 시간 낭비

### 올바른 프로세스

```
1. 콘텐츠 제작 요청 받음
    ↓
2. 노션 DB 조회 (기존 발행 콘텐츠 확인)
    ↓
3. docs/blog-content/ 파일 목록 확인
    ↓
4. CONTENT_SCHEDULE.md 상태 확인
    ↓
5. 중복 없음 확인 후 → 주제 제안 또는 콘텐츠 작성
```

**이 프로세스를 건너뛰면 안 됨. 예외 없음.**
