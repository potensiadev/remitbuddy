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
| **종합 분석 (최신)** | `docs/analytics/gsc-ga4-insights-2026-05-28.md` | 2026-05-28 |
| 이전 분석 | `docs/analytics/gsc-ga4-insights-2026-05-20.md` | 2026-05-20 |

### GSC 핵심 인사이트 (2026-05-28 기준)

**14일 성과 요약 (5/12-5/26)**:
- 총 클릭: **16회** (+129% vs 5/20) | 총 노출: **623회** (+254%) | 블로그 첫 클릭 발생!

**페이지별 성과 (상위)**:
| 페이지 | 클릭 | 노출 | CTR | 순위 | 변화 |
|--------|------|------|-----|------|------|
| `/` (EN 메인) | 14 | 39 | 35.9% | 9.0 | 클릭 +7 |
| **E9 Visa 가이드** | 0 | **129** | 0% | 8.6 | 노출 1위! |
| **MoMo 가이드** | **1** | 121 | 0.83% | 9.4 | 첫 클릭! |
| 베트남 Real-time | 0 | 104 | 0% | 6.4 | 노출 증가 |
| **7 Ways 가이드** | **1** | 8 | **12.5%** | 23.6 | 첫 클릭! |

**핵심 발견**:
1. **블로그 첫 클릭 2건 발생!** - MoMo 가이드 + 7 Ways 가이드
2. **E9 Visa 콘텐츠 노출 폭발** (129회) - 메타 최적화 필요
3. **인도/말레이시아 고CTR 유지** - 30%, 33%
4. **메타 최적화 효과 확인** - 2주 후 첫 클릭 발생

### GA4 핵심 인사이트 (2026-05-28 기준)

**트래픽 (14일)**:
- 세션: 75 (+50%) | 유저: 30 (+43%) | 페이지뷰: 230
- 이탈률: 41.3% | 평균 체류: **4분 4초** (+67%)

**국가별 트래픽 (14일)**:
| 국가 | 세션 | 유저 | 페이지뷰 | 유저당 PV |
|------|------|------|----------|-----------|
| 한국 | 48 | 15 | 170 | **11.3** |
| **인도** | 8 | 4 | 17 | 4.3 |
| 베트남 | 6 | 1 | 14 | **14.0** |
| 미국 | 5 | 5 | 8 | 1.6 |

**페이지별 참여도**:
- /ko (한국어): 체류 **6분 41초**, 이탈률 27.8% (고참여)
- / (영어): 체류 3분 14초, 이탈률 45.6%

### 데이터 기반 콘텐츠 우선순위 (2026-05-28 업데이트)

| 우선순위 | 콘텐츠 | 근거 |
|---------|--------|------|
| **P0** | E9 Visa 가이드 메타 최적화 | 129노출/0클릭 (노출 1위) |
| **P0** | 인도 송금 가이드 | CTR 30%, 8세션 |
| **P0** | 말레이시아 송금 가이드 | CTR 33%, 2클릭 |
| P1 | 베트남 Real-time 제목 변경 | 104노출/0클릭 |
| P1 | 미국 CTR 분석 | 220노출/0.45% |
| P2 | 네팔/GCash 가이드 업데이트 | 순위 개선 필요 |

### 분석 주기
- **GSC + GA4 종합**: 매주 (14일 데이터)
- **다음 분석**: 2026-06-04

### 📊 메타데이터 최적화 실험 결과 (2026-05-17 시작)

**실험 상태**: ✅ 효과 확인됨 (2주차)

**결과 요약**:
| 페이지 | 5/17 CTR | 5/28 CTR | 결과 |
|--------|----------|----------|------|
| MoMo 가이드 | 0% | **0.83%** | 첫 클릭! |
| 7 Ways 가이드 | N/A | **12.5%** | 첫 클릭! |
| 베트남 Real-time | 0% | 0% | 추가 조치 필요 |

**CTR 최적화 공식 (검증됨)**:
```
Title: [Benefit/Pain Point] + [Action] + [Destination] + [Year]
예시: "Cheapest Way to Send Money to India from Korea 2026"
Power Words: Cheapest, Fastest, Best, Free, Save, Compare
```

## 🎯 Quick Win 액션 아이템 (2026-05-28 기준)

**데이터 기반 우선순위 태스크** - 모든 에이전트는 이 액션 아이템을 참조해야 함

### P0: E9 Visa 가이드 메타 최적화 (긴급)
- **문제**: 129회 노출 (1위), 0 클릭 (CTR 0%)
- **현재 제목**: "E9 Visa Salary and Severance Pay Guide Korea"
- **개선 제목**: "E9 Visa Korea: Complete Salary & Severance Pay Guide 2026"
- **액션**: 설명에 구체적 금액 추가 ("Average salary: ₩2.5M-3M")
- **목표**: CTR 2%+ (주 2-3클릭)

### P0: 인도 송금 가이드 제작
- **근거**: GSC CTR 30% (3클릭/10노출), GA4 8세션
- **제목**: "Cheapest Way to Send Money to India from Korea 2026"
- **키워드**: "send money korea to india", "india remittance from korea"

### P0: 말레이시아 송금 가이드 제작
- **근거**: GSC CTR 33% (2클릭/6노출)
- **제목**: "Cheapest Way to Send Money to Malaysia from Korea 2026"

### P1: 베트남 Real-time 가이드 제목 변경
- **문제**: 104노출/0클릭 (CTR 0%)
- **현재**: "Real-Time Remittance Guide Vietnam 2026"
- **개선**: "Cheapest Way to Send Money to Vietnam from Korea 2026"

### P1: 미국 노출 CTR 분석
- **문제**: 220노출/1클릭 (CTR 0.45%)
- **분석 필요**: 어떤 페이지가 미국에서 노출되는지 확인

### 국가별 기회 분석 (2026-05-28 업데이트)

| 국가 | GSC CTR | GSC 노출 | GA4 세션 | 콘텐츠 | 우선순위 |
|------|---------|----------|----------|--------|----------|
| 🇮🇳 인도 | **30%** | 10 | 8 | 없음 | **P0** |
| 🇲🇾 말레이시아 | **33%** | 6 | 1 | 없음 | **P0** |
| 🇻🇳 베트남 | 0% | 225 | 6 | 3개 | P1 (최적화) |
| 🇺🇸 미국 | 0.45% | **220** | 5 | - | P1 (분석) |
| 🇳🇵 네팔 | 0% | 41 | - | 1개 | P2 |

### 학습된 패턴 (업데이트)

1. **메타 최적화 2주 후 효과 발생**: MoMo 가이드 첫 클릭
2. **고CTR 콘텐츠 패턴**: "7 Ways to Save" 형식 = 12.5% CTR
3. **한국어 페이지 고참여**: 체류시간 6분 41초 (영어의 2배)
4. **E9 Visa 콘텐츠 수요 발견**: 노출 1위 but CTR 0%
5. **인도/말레이시아 기회 시장**: 지속적 고CTR (30%+)

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
