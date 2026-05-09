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
