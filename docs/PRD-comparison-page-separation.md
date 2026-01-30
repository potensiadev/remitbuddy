# PRD: 결과조회 화면 분리 (Comparison Results Page Separation)

**Version:** 1.0
**Date:** 2026-01-15
**Author:** Senior Product Manager
**Status:** Implementation Ready

---

## 1. Executive Summary

### 1.1 Problem Statement
현재 RemitBuddy의 송금 비교 결과는 `index.js` 내에서 클라이언트 사이드 렌더링으로 처리되어 다음 문제점이 존재합니다:

- **SEO 불가**: 검색엔진이 결과 콘텐츠를 인덱싱할 수 없음
- **공유 불가**: 결과를 URL로 공유할 수 없음 (카카오톡, 라인 등)
- **분석 한계**: 결과 페이지별 이탈률, 체류시간 측정 어려움
- **마케팅 한계**: 광고 랜딩 페이지로 활용 불가

### 1.2 Solution
결과조회 화면을 독립 페이지 `/compare/[country]`로 분리하여 위 문제를 해결합니다.

### 1.3 Success Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| SEO Indexed Pages | 1 (home) | 19 (home + 18 countries) | Launch |
| Shareable Result URLs | 0% | 100% | Launch |
| Organic Traffic (from comparison keywords) | ~0 | +500% | 3 months post-launch |
| Link Shares via Social | N/A | Trackable | Launch |

---

## 2. Product Requirements

### 2.1 Core Feature: Dedicated Comparison Page

#### URL Structure
```
/compare/[country]?amount=[amount]

Examples:
- /compare/vietnam?amount=1000000
- /compare/philippines?amount=500000
- /compare/nepal?amount=2000000
```

#### Page Flow
```
[Landing Page: /]
    ↓ User submits form
[Results Page: /compare/vietnam?amount=1000000]
    ↓ User can share URL
[Anyone with URL can see same results]
```

### 2.2 SEO Requirements

#### 2.2.1 Dynamic Meta Tags (Per Country)
```html
<!-- Vietnam Example -->
<title>베트남 송금 비교 | 1,000,000원 → VND | RemitBuddy</title>
<meta name="description" content="베트남으로 1,000,000원 송금 시 최저 수수료 비교.
  8개 송금사 실시간 환율 비교로 최대 32,000원 절약하세요." />
```

#### 2.2.2 Open Graph Tags (Social Sharing)
```html
<meta property="og:title" content="베트남 송금 비교 결과 | RemitBuddy" />
<meta property="og:description" content="₩1,000,000 → VND 송금 시 최저 수수료 비교 결과입니다." />
<meta property="og:image" content="https://remitbuddy.com/og/compare-vietnam.png" />
<meta property="og:url" content="https://remitbuddy.com/compare/vietnam?amount=1000000" />
```

#### 2.2.3 Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  "name": "Vietnam Remittance Comparison",
  "description": "Compare 8 remittance providers for Korea to Vietnam",
  "provider": {
    "@type": "Organization",
    "name": "RemitBuddy"
  }
}
```

### 2.3 Sharing Requirements

#### 2.3.1 Share Button Component
- 클립보드 복사 버튼
- 카카오톡 공유 (한국 시장 필수)
- 링크 공유 (모바일 네이티브 share API)

#### 2.3.2 Shareable URL Format
```
https://remitbuddy.com/compare/vietnam?amount=1000000

Parameters:
- country: 국가 슬러그 (vietnam, philippines, etc.)
- amount: 송금 금액 (KRW)
```

### 2.4 Analytics Requirements

#### 2.4.1 Page-Level Tracking
```javascript
// Page view with parameters
gtag('event', 'page_view', {
  page_title: 'Compare Results - Vietnam',
  page_location: '/compare/vietnam?amount=1000000',
  country: 'Vietnam',
  amount: 1000000
});
```

#### 2.4.2 Conversion Funnel
```
Landing Page → Form Submit → Results Page → Provider Click
     ↓              ↓              ↓              ↓
   page_view   form_submit   results_view   provider_click
```

#### 2.4.3 Share Tracking
```javascript
gtag('event', 'share', {
  method: 'kakao | clipboard | native',
  content_type: 'comparison_result',
  item_id: 'vietnam_1000000'
});
```

---

## 3. Technical Requirements

### 3.1 File Structure (After Separation)
```
frontend/
├── pages/
│   ├── index.js              (Landing page only - ~1,200 lines)
│   └── compare/
│       └── [country].js      (Results page - ~400 lines)
├── components/
│   └── comparison/
│       ├── index.js          (Barrel export)
│       ├── ComparisonResults.jsx
│       ├── ProviderCard.jsx
│       ├── ResultsTable.jsx
│       ├── RateChart.jsx
│       ├── ViewToggle.jsx
│       ├── SaveCorridorButton.jsx
│       └── ShareButton.jsx   (NEW)
├── lib/
│   ├── constants.js          (COUNTRIES, PROVIDER_LOGO_MAP)
│   └── seo.js                (SEO metadata generators)
```

### 3.2 Data Flow
```
[/compare/[country].js]
    ↓
getServerSideProps({ params, query })
    ↓
Validate country & amount
    ↓
Generate SEO metadata
    ↓
Return props with initial state
    ↓
Client-side: Fetch live rates from API
```

### 3.3 Server-Side Props
```javascript
export async function getServerSideProps({ params, query, locale }) {
  const { country } = params;
  const amount = query.amount || '1000000';

  // Validate country
  const countryData = COUNTRIES.find(c =>
    c.name.toLowerCase() === country.toLowerCase()
  );

  if (!countryData) {
    return { notFound: true };
  }

  // Generate SEO metadata
  const seoData = generateComparisonSEO(countryData, amount, locale);

  return {
    props: {
      countryData,
      amount,
      seoData,
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}
```

### 3.4 URL Redirect from Landing
```javascript
// In index.js handleSubmit
const handleSubmit = (e) => {
  e.preventDefault();

  // Instead of showing results inline, redirect to compare page
  router.push({
    pathname: `/compare/${selectedCountry.name.toLowerCase()}`,
    query: { amount }
  });
};
```

---

## 4. UX Requirements

### 4.1 Navigation Flow

#### From Landing Page
1. User enters country + amount
2. Clicks "Compare" button
3. Router pushes to `/compare/[country]?amount=[amount]`
4. Results page loads with skeleton UI
5. API fetches fresh rates
6. Results display

#### Direct Access (from shared link)
1. User clicks shared link
2. Results page loads with pre-filled parameters
3. SEO metadata already rendered (SSR)
4. API fetches fresh rates
5. Results display

### 4.2 Loading States
```
[Skeleton UI]
├── Header with country name (from URL)
├── Amount display (from URL)
├── Provider cards skeleton (shimmer animation)
└── Footer
```

### 4.3 Error States
- Invalid country → 404 page with suggestion
- Invalid amount → Default to 1,000,000 KRW
- API error → Retry button + cached results if available

### 4.4 Mobile Considerations
- Share button prominently placed
- Native share sheet on mobile
- Compact result cards for mobile viewport

---

## 5. Business Impact

### 5.1 SEO Growth Opportunity

| Keyword | Monthly Search Volume | Competition |
|---------|----------------------|-------------|
| 베트남 송금 비교 | 2,400 | Low |
| 필리핀 송금 수수료 | 1,900 | Low |
| 네팔 송금 환율 | 880 | Low |
| 캄보디아 송금 추천 | 720 | Low |

**Total Addressable Keywords**: 50+ country-specific long-tail keywords

### 5.2 Viral Growth Potential
- Shareable results = organic word-of-mouth
- Each share = free advertising
- Social proof via shared savings amounts

### 5.3 Retention Impact
- Bookmarkable results
- Return visitors via saved URLs
- Rate alerts with direct links to comparison

---

## 6. Implementation Priority

### Phase 1: Core Separation (This PR)
- [x] Component extraction
- [x] New compare page
- [x] Basic SEO (title, description)
- [x] URL-based state

### Phase 2: Enhanced Sharing
- [ ] Share button component
- [ ] Kakao SDK integration
- [ ] OG image generation

### Phase 3: Advanced SEO
- [ ] JSON-LD structured data
- [ ] Sitemap update
- [ ] Search Console submission

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing bookmarks break | Low | No existing result URLs exist |
| Slightly slower UX (page transition) | Medium | Link prefetch + skeleton UI |
| SEO takes time to index | Low | Expected behavior, not blocking |
| Analytics data split | Low | Proper event tracking maintains continuity |

---

## 8. Acceptance Criteria

### Must Have
- [ ] `/compare/[country]` route working for all 18 countries
- [ ] SEO metadata dynamically generated per country
- [ ] URL shareable and produces same results
- [ ] "Compare Again" navigates back to landing with prefilled form
- [ ] Mobile responsive

### Should Have
- [ ] Share button with clipboard copy
- [ ] Loading skeleton during API fetch
- [ ] 404 for invalid countries

### Nice to Have
- [ ] Kakao share integration
- [ ] OG image per country
- [ ] JSON-LD structured data

---

## Appendix: Country Slugs

| Country | Slug | Currency |
|---------|------|----------|
| Vietnam | vietnam | VND |
| Philippines | philippines | PHP |
| Nepal | nepal | NPR |
| Cambodia | cambodia | KHR |
| Thailand | thailand | THB |
| Myanmar | myanmar | MMK |
| Uzbekistan | uzbekistan | UZS |
| Indonesia | indonesia | IDR |
| Sri Lanka | srilanka | LKR |
| Bangladesh | bangladesh | BDT |
| United States | united-states | USD |
| Canada | canada | CAD |
| Singapore | singapore | SGD |
| China | china | CNY |
| Malaysia | malaysia | MYR |
| Japan | japan | JPY |
| Hong Kong | hong-kong | HKD |
| United Kingdom | united-kingdom | GBP |
| Mongolia | mongolia | MNT |
