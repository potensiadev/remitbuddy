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
| GA4 분석 | `docs/analytics/ga4-insights-2026-05-10.md` | 2026-05-10 |
| GSC 분석 | `docs/analytics/gsc-insights-2026-05-15.md` | 2026-05-15 |

### GSC 핵심 인사이트 (2026-05-15 기준)

**7일 성과 요약 (5/6-5/12)**:
- 총 클릭: 12회 | 총 노출: 45회 | CTR: 26.7% | 평균 순위: 5.4

**페이지별 성과**:
| 페이지 | 클릭 | 노출 | CTR |
|--------|------|------|-----|
| `/` (EN 메인) | 11 | 39 | 28.2% |
| `/ko` (KO 메인) | 1 | 5 | 20.0% |
| 블로그 콘텐츠 | 0 | 13 | 0% |

**핵심 발견**:
1. 영문 메인페이지가 전체 클릭의 91.7% 차지
2. **블로그 CTR 0% 문제** - 메타데이터 최적화 필요
3. 평균 순위 5.4 (첫 페이지 상위권)
4. 주중 > 주말 트래픽 패턴

### GA4 핵심 인사이트 (2026-05-10 기준)

**국가별 송금 수요 (이벤트 기준)**:
1. 베트남 (VND): 28건 - **1위**
2. 네팔 (NPR): 16건 - 2위
3. 싱가포르 (SGD): 6건 - 신규 발견
4. 필리핀 (PHP): 4건
5. 중국 (CNY): 4건

**Provider 클릭 순위**:
1. GmoneyTrans: 44.4%
2. Coinshot: 33.3%
3. Hanpass/E9Pay: 22.2%

### 데이터 기반 콘텐츠 우선순위

| 우선순위 | 콘텐츠 | 근거 |
|---------|--------|------|
| P0 | 블로그 메타데이터 최적화 | GSC CTR 0% 개선 |
| P1 | GCash vs Maya vs Bank 비교 | 필리핀 수요 + 예정 콘텐츠 |
| P1 | Best Days to Send Money | 범용 키워드 |
| P2 | 베트남 고액 송금 가이드 | GA4 1위 |
| P2 | 싱가포르 송금 가이드 | 신규 시장 |

### 분석 주기
- **GSC**: 매주 목요일 (7일 데이터)
- **GA4**: 격주 (14일 데이터)
- **종합 리포트**: 월 1회

### 📊 메타데이터 최적화 실험 추적 (2026-05-17 시작)

**실험 상태**: ✅ 진행중
**추적 파일**: `docs/analytics/meta-optimization-tracking.md`

**최적화 완료 (12개 블로그 포스트)**:
- 모든 포스트에 CTR 최적화 공식 적용
- 노션 메타데이터 업데이트 완료

**측정 일정**:
| 날짜 | 액션 |
|------|------|
| 5/17 | 최적화 적용, 베이스라인 기록 |
| 5/24 | 1주차 성과 측정 (목표: CTR 2%+) |
| 5/31 | 2주차 성과 측정 (목표: CTR 3%+) |
| 6/14 | 최종 평가 (목표: CTR 5%+) |

**CTR 최적화 공식 (학습됨)**:
```
Title: [Action] + [Destination] + [Benefit]: [Year]
Description: [Compare/Solution] + [Specific Benefit] + [CTA]
Power Words: 숫자, Save, Compare, Cheapest, Fastest, Free, 2026
```

## 🚨 내일 할 일 (2026-05-18)

### GSC 재색인 요청 (남은 2개)
오늘 10개 완료, 내일 2개 추가 요청 필요:

| # | URL | 상태 |
|---|-----|------|
| 11 | `https://www.remitbuddy.com/blog/foreign-worker-tax-refund-korea-guide` | ⏳ 내일 |
| 12 | `https://www.remitbuddy.com/blog/e9-visa-salary-severance-pay-korea` | ⏳ 내일 |

**방법**: GSC → URL 검사 → 색인 생성 요청

---

## 🎯 Quick Win 액션 아이템 (2026-05-17 기준)

**데이터 기반 우선순위 태스크** - 모든 에이전트는 이 액션 아이템을 참조해야 함

### P0: 블로그 CTR 개선 (긴급) - ✅ 최적화 완료
- **문제**: 베트남 송금 가이드 24회 노출, 클릭 0 (CTR 0%)
- **원인**: 메타 타이틀/설명이 검색 의도와 불일치
- **해결**: ✅ 12개 블로그 메타데이터 최적화 완료 (2026-05-17)
- **상세 계획**: `docs/action-items/blog-ctr-improvement-plan.md` 참조
- **추적 파일**: `docs/analytics/meta-optimization-tracking.md`
- **목표**: CTR 5% 이상 달성
- **다음 액션**: 5/24 1주차 성과 측정

### P1: 말레이시아 콘텐츠 제작
- **근거**: GSC CTR 75% (최고), 높은 관심도
- **액션**: 말레이시아 송금 가이드 콘텐츠 작성
- **키워드**: "send money Korea to Malaysia", "Malaysia remittance from Korea"

### P1: 베트남 유저 인게이지먼트 강화
- **근거**: GA4 1명이 36 페이지뷰 (매우 높은 관심)
- **액션**: 베트남 고액 송금, 은행별 비교 콘텐츠 추가
- **기회**: 충성 유저 확보 가능성 높음

### P2: 일반 키워드 순위 개선
- **현황**: "money transfer services" 72위, "remit services" 69위
- **액션**: 해당 키워드 타겟 콘텐츠 강화
- **목표**: 상위 20위 진입

### 국가별 기회 분석

| 국가 | GSC CTR | GA4 세션 | 기회 |
|------|---------|----------|------|
| 🇲🇾 말레이시아 | 75% | 2 | **최우선** - 높은 관심, 콘텐츠 부재 |
| 🇮🇳 인도 | 66.7% | 4 | 높은 관심, 콘텐츠 검토 |
| 🇨🇦 캐나다 | 33.3% | 3 | 해외 교민 타겟 가능 |
| 🇻🇳 베트남 | - | 13 | 트래픽 1위, CTR 개선 필요 |
| 🇺🇸 미국 | 8.6% | 6 | 노출 높음, CTR 개선 필요 |
