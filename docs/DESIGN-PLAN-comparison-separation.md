# RemitBuddy Design System Overhaul
## Comparison Page Separation Project

**Design Lead:** Senior Product Designer (Apple Design Philosophy)
**Date:** 2026-01-15
**Version:** 1.0
**Status:** Design Specification

---

## Design Vision

### Philosophy: "Invisible Complexity, Visible Clarity"

RemitBuddy를 금융 앱 중 가장 신뢰할 수 있고, 사용하기 쉬우며, 시각적으로 아름다운 송금 비교 서비스로 재탄생시킵니다. Apple의 디자인 철학처럼, 복잡한 금융 데이터를 단순하고 우아하게 표현하여 사용자가 최적의 결정을 내릴 수 있도록 합니다.

### Core Design Principles

1. **Clarity Over Decoration** - 모든 시각 요소는 목적을 가져야 합니다
2. **Deference to Content** - 숫자와 데이터가 주인공입니다
3. **Depth Through Motion** - 미세한 애니메이션으로 계층감을 표현합니다
4. **Human-Centered Finance** - 차가운 금융을 따뜻하게 만듭니다

---

## Part 1: Design Token System (Foundation)

### 1.1 Color Architecture

```css
/* Primary Palette - "Trust Blue" */
--rb-blue-50: #EFF6FF;
--rb-blue-100: #DBEAFE;
--rb-blue-500: #3B82F6;
--rb-blue-600: #2563EB;    /* Primary Action */
--rb-blue-700: #1D4ED8;

/* Accent Palette - "Success Green" */
--rb-green-50: #ECFDF5;
--rb-green-100: #D1FAE5;
--rb-green-500: #10B981;   /* Best Rate Indicator */
--rb-green-600: #059669;

/* Neutral Palette - Refined Grays */
--rb-gray-50: #FAFAFA;
--rb-gray-100: #F5F5F5;
--rb-gray-200: #E5E5E5;
--rb-gray-300: #D4D4D4;
--rb-gray-400: #A3A3A3;
--rb-gray-500: #737373;    /* Secondary Text */
--rb-gray-600: #525252;
--rb-gray-700: #404040;
--rb-gray-800: #262626;
--rb-gray-900: #171717;    /* Primary Text */

/* Semantic Colors */
--rb-error: #EF4444;
--rb-warning: #F59E0B;
--rb-info: #3B82F6;
--rb-success: #10B981;
```

### 1.2 Typography Scale

```css
/* Font Families */
--font-display: 'Satoshi', -apple-system, sans-serif;
--font-body: 'Inter', -apple-system, sans-serif;
--font-money: 'JetBrains Mono', 'SF Mono', monospace;

/* Multilingual Support */
--font-korean: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
--font-japanese: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
--font-vietnamese: 'Be Vietnam Pro', sans-serif;

/* Type Scale (1.25 ratio) */
--text-xs: 0.75rem;      /* 12px - Captions */
--text-sm: 0.875rem;     /* 14px - Helper text */
--text-base: 1rem;       /* 16px - Body */
--text-lg: 1.125rem;     /* 18px - Emphasis */
--text-xl: 1.25rem;      /* 20px - Subheading */
--text-2xl: 1.5rem;      /* 24px - Card title */
--text-3xl: 1.875rem;    /* 30px - Section title */
--text-4xl: 2.25rem;     /* 36px - Page title */
--text-5xl: 3rem;        /* 48px - Hero */
--text-6xl: 3.75rem;     /* 60px - Display */

/* Money Typography */
--money-sm: 1.25rem;     /* Small amounts */
--money-md: 1.5rem;      /* Medium amounts */
--money-lg: 2rem;        /* Large amounts */
--money-xl: 2.5rem;      /* Hero amounts */
--money-2xl: 3rem;       /* Feature amounts */
```

### 1.3 Spacing System

```css
/* 8px Base Unit */
--space-1: 0.25rem;      /* 4px */
--space-2: 0.5rem;       /* 8px */
--space-3: 0.75rem;      /* 12px */
--space-4: 1rem;         /* 16px */
--space-5: 1.25rem;      /* 20px */
--space-6: 1.5rem;       /* 24px */
--space-8: 2rem;         /* 32px */
--space-10: 2.5rem;      /* 40px */
--space-12: 3rem;        /* 48px */
--space-16: 4rem;        /* 64px */
--space-20: 5rem;        /* 80px */
--space-24: 6rem;        /* 96px */
```

### 1.4 Shadow System

```css
/* Elevation Levels */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.10);
--shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.12);
--shadow-2xl: 0 24px 48px rgba(0, 0, 0, 0.16);

/* Colored Shadows */
--shadow-primary: 0 8px 24px rgba(37, 99, 235, 0.25);
--shadow-success: 0 8px 24px rgba(16, 185, 129, 0.25);
--shadow-gold: 0 8px 24px rgba(245, 158, 11, 0.25);

/* Inset Shadows (for inputs) */
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.04);
```

### 1.5 Border Radius

```css
--radius-sm: 0.375rem;   /* 6px - Small elements */
--radius-md: 0.5rem;     /* 8px - Buttons */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;       /* 16px - Large cards */
--radius-2xl: 1.5rem;    /* 24px - Hero cards */
--radius-full: 9999px;   /* Pills/Badges */
```

### 1.6 Animation Tokens

```css
/* Duration */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
--duration-slower: 600ms;

/* Easing */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Standard Animations */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

## Part 2: Component Library

### 2.1 Button Component

```jsx
/* Variants */
- primary: Blue gradient with shadow
- secondary: White with border
- ghost: Transparent
- accent: Green for success actions
- danger: Red for destructive actions

/* Sizes */
- xs: 28px height
- sm: 32px height
- md: 40px height (default)
- lg: 48px height
- xl: 56px height

/* States */
- default → hover → active → disabled
- loading state with spinner
```

**Button Specifications:**
```
┌─────────────────────────────────────┐
│  ○ Icon     Button Text    Icon ○   │  ← height: 48px (lg)
│                                     │  ← padding: 0 24px
│  font-weight: 600                   │  ← border-radius: 12px
│  letter-spacing: -0.01em            │
└─────────────────────────────────────┘
```

### 2.2 Card Component

```jsx
/* Variants */
- default: White with subtle border
- elevated: White with shadow
- best: Green accent border + glow
- featured: Gold accent
- glass: Frosted glass effect

/* Sub-components */
- CardHeader
- CardTitle
- CardDescription
- CardContent
- CardFooter
- CardBadge
```

**Provider Card Layout:**
```
┌──────────────────────────────────────────────┐
│ ┌──────┬──────────────────┬─────────────┐    │
│ │ Logo │  Provider Name   │  BEST RATE  │    │ ← Header
│ └──────┴──────────────────┴─────────────┘    │
│                                              │
│  Recipient Gets                              │ ← Label
│  ₫ 23,456,789                               │ ← Amount (hero)
│                                              │
│  ┌───────────────────────────────────────┐   │
│  │████████████████████████░░░░░░░░░░░░░░│   │ ← Progress bar
│  └───────────────────────────────────────┘   │
│                                              │
│  Rate: 24.56    Fee: ₩3,000    ~1 min       │ ← Details
│                                              │
│  ┌───────────────────────────────────────┐   │
│  │          Send with Provider →         │   │ ← CTA
│  └───────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

### 2.3 Input Component

```jsx
/* Variants */
- default: Standard text input
- amount: Currency input with prefix/suffix
- search: With search icon
- select: Dropdown trigger

/* States */
- empty → focused → filled → error → disabled
```

**Amount Input Specification:**
```
┌───────────────────────────────────────────┐
│  Send Amount                              │ ← Label (required *)
├───────────────────────────────────────────┤
│  ₩  │  1,000,000                   │ KRW │ ← Input (xl size)
├───────────────────────────────────────────┤
│  ≈ $750 USD                               │ ← Helper text
└───────────────────────────────────────────┘
```

### 2.4 Select/Dropdown Component

```jsx
/* Country Selector Specification */
┌───────────────────────────────────────────┐
│  Send To                                  │
├───────────────────────────────────────────┤
│  🇻🇳  Vietnam                         ▼  │
└───────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────┐
│  Popular Destinations                     │
├───────────────────────────────────────────┤
│  🇻🇳  Vietnam                         ✓  │ ← Selected
│  🇵🇭  Philippines                        │
│  🇳🇵  Nepal                              │
│  🇰🇭  Cambodia                           │
│  🇹🇭  Thailand                           │
├───────────────────────────────────────────┤
│  All Countries                            │
├───────────────────────────────────────────┤
│  🇧🇩  Bangladesh                         │
│  🇨🇦  Canada                             │
│  🇨🇳  China                              │
│  ...                                      │
└───────────────────────────────────────────┘
```

### 2.5 Badge Component

```jsx
/* Variants */
- default: Gray
- primary: Blue
- success: Green (Best Rate)
- warning: Orange
- gold: Featured

/* Example */
┌──────────────┐
│ ★ BEST RATE  │  ← Green gradient, white text
└──────────────┘
```

### 2.6 Skeleton Component (NEW)

```jsx
/* For loading states */
┌──────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                              │
│ ░░░░░░░░░░░░  ← Shimmer animation            │
│ ░░░░░░░░░░░░░░░░░░░░░░░                      │
│                                              │
│ ░░░░░   ░░░░░   ░░░░░░░                      │
└──────────────────────────────────────────────┘
```

### 2.7 Share Button Component (NEW)

```jsx
/* Share Options */
┌───────────────────────────────────────┐
│  📤  Share Results                    │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│  📋  Copy Link                        │
│  💬  Share to KakaoTalk               │
│  📱  More Options...                  │
└───────────────────────────────────────┘
```

---

## Part 3: Page Layouts

### 3.1 Landing Page (`/`)

**Purpose:** 사용자가 송금 비교를 시작하는 진입점

```
┌─────────────────────────────────────────────────────────┐
│  Navigation                                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                    HERO SECTION                          │
│                                                          │
│    해외 송금, 가장 좋은 방법을                           │
│         찾아드립니다                                     │
│                                                          │
│    ┌─────────────────────────────────────────────┐      │
│    │                                             │      │
│    │  ┌─────────────────────────────────────┐   │      │
│    │  │  🇻🇳  Vietnam                    ▼ │   │      │
│    │  └─────────────────────────────────────┘   │      │
│    │                                             │      │
│    │  ┌─────────────────────────────────────┐   │      │
│    │  │  ₩   1,000,000               KRW   │   │      │
│    │  └─────────────────────────────────────┘   │      │
│    │                                             │      │
│    │  ┌─────────────────────────────────────┐   │      │
│    │  │       🔍 Compare Rates Now          │   │      │
│    │  └─────────────────────────────────────┘   │      │
│    │                                             │      │
│    └─────────────────────────────────────────────┘      │
│                                                          │
│    Trusted by 50,000+ users  •  Updated every minute     │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                  FEATURES SECTION                        │
│                                                          │
│   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐        │
│   │   ⚡   │  │   🔒   │  │   🌏   │  │   💰   │        │
│   │ Real   │  │ Secure │  │  18+   │  │  Save  │        │
│   │ Time   │  │        │  │ Count- │  │ Money  │        │
│   │        │  │        │  │ ries   │  │        │        │
│   └────────┘  └────────┘  └────────┘  └────────┘        │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                 HOW IT WORKS                             │
│                                                          │
│    ① Select     ────→     ② Compare    ────→    ③ Send  │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                    TESTIMONIALS                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                      FOOTER                              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Landing Page 핵심 변경사항:**
1. 결과 표시 코드 제거 (Compare 페이지로 이동)
2. Form submit 시 `/compare/[country]?amount=[amount]`로 redirect
3. 순수한 마케팅/컨버전 페이지로 변환

### 3.2 Comparison Results Page (`/compare/[country]`)

**Purpose:** SEO 최적화된 송금 비교 결과 페이지

```
┌─────────────────────────────────────────────────────────┐
│  Navigation                                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│              RESULTS HEADER                              │
│                                                          │
│   🇻🇳 Vietnam 송금 비교                    [Share] [←]  │
│   ₩1,000,000 → VND                                      │
│                                                          │
│   Last updated: Just now  •  8 providers compared       │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   [Cards] [Table] [Chart]          Sort: Best Rate ▼    │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │  ★ BEST RATE                                    │   │
│   │                                                 │   │
│   │  [Logo]  Hanpass                               │   │
│   │                                                 │   │
│   │  Recipient Gets                                 │   │
│   │  ₫ 23,456,789                                  │   │
│   │                                                 │   │
│   │  ████████████████████████████████████████      │   │
│   │                                                 │   │
│   │  Rate: 24.56  •  Fee: ₩3,000  •  ~1 min       │   │
│   │                                                 │   │
│   │  [     Send with Hanpass →     ]              │   │
│   │                                                 │   │
│   └─────────────────────────────────────────────────┘   │
│                                                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │  [Logo]  GME Remit                              │   │
│   │  ...                                            │   │
│   └─────────────────────────────────────────────────┘   │
│                                                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │  [Logo]  Wirebarley                             │   │
│   │  ...                                            │   │
│   └─────────────────────────────────────────────────┘   │
│                                                          │
│   ... more providers ...                                 │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│              SAVINGS SUMMARY                             │
│                                                          │
│   💡 Best choice saves you ₩32,000 compared to worst    │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│              COMPARE AGAIN CTA                           │
│                                                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │  Try a different amount or country              │   │
│   │  [     Compare Again →     ]                   │   │
│   └─────────────────────────────────────────────────┘   │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                      FOOTER                              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Compare Page 핵심 기능:**
1. SSR로 SEO 메타데이터 생성
2. URL 공유 가능
3. Share 버튼 (KakaoTalk, 클립보드, 네이티브)
4. 스켈레톤 로딩 상태
5. 다양한 뷰 모드 (Cards, Table, Chart)

---

## Part 4: Mobile Design

### 4.1 Mobile Landing Page

```
┌─────────────────────┐
│  ≡  RemitBuddy  🌐  │
├─────────────────────┤
│                     │
│  해외 송금,         │
│  가장 좋은 방법을    │
│  찾아드립니다       │
│                     │
│  ┌───────────────┐  │
│  │ 🇻🇳 Vietnam ▼ │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │₩ 1,000,000   │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │ 🔍 Compare   │  │
│  └───────────────┘  │
│                     │
│  ✓ 8 Providers     │
│  ✓ Real-time rates │
│                     │
├─────────────────────┤
│                     │
│  ⚡ 실시간   🔒 안전 │
│                     │
│  🌏 18개국  💰 절약 │
│                     │
├─────────────────────┤
│                     │
│  How it works       │
│  ① → ② → ③         │
│                     │
└─────────────────────┘
```

### 4.2 Mobile Results Page

```
┌─────────────────────┐
│  ← 🇻🇳 Vietnam  📤  │
├─────────────────────┤
│                     │
│  ₩1,000,000 → VND   │
│  Updated just now   │
│                     │
├─────────────────────┤
│  [Cards][Table]     │
├─────────────────────┤
│                     │
│  ┌─────────────────┐│
│  │★ BEST RATE     ││
│  │                 ││
│  │ [Logo] Hanpass  ││
│  │                 ││
│  │ ₫ 23,456,789   ││
│  │                 ││
│  │ ████████████   ││
│  │                 ││
│  │ Rate: 24.56    ││
│  │ Fee: ₩3,000    ││
│  │                 ││
│  │ [ Send Now → ] ││
│  │                 ││
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │ [Logo] GME      ││
│  │ ₫ 23,400,000   ││
│  │ [ Send → ]     ││
│  └─────────────────┘│
│                     │
│  ... swipe for more │
│                     │
├─────────────────────┤
│                     │
│ 💡 Save ₩32,000    │
│                     │
├─────────────────────┤
│ [  Compare Again  ] │
└─────────────────────┘
```

### 4.3 Mobile Share Sheet

```
┌─────────────────────┐
│                     │
│  Share Results      │
│                     │
│  ┌───┐ ┌───┐ ┌───┐ │
│  │📋 │ │💬 │ │📱 │ │
│  │Copy│ │Kak│ │More│ │
│  └───┘ └───┘ └───┘ │
│                     │
│  [ Cancel ]         │
│                     │
└─────────────────────┘
```

---

## Part 5: Implementation Roadmap

### Phase 1: Foundation (Week 1)

#### 1.1 Design System Setup
- [ ] Update `tailwind.config.js` with new design tokens
- [ ] Create `styles/design-tokens.css`
- [ ] Update `styles/globals.css` imports

#### 1.2 Core Component Updates
- [ ] Update `Button.jsx` with new variants
- [ ] Update `Card.jsx` with new variants
- [ ] Update `Input.jsx` with new styles
- [ ] Create `Skeleton.jsx` component
- [ ] Create `Badge.jsx` component

#### 1.3 File Structure Setup
```
frontend/
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Skeleton.jsx      ← NEW
│   │   ├── Badge.jsx         ← NEW
│   │   ├── Typography.jsx
│   │   └── index.js
│   └── comparison/
│       ├── ProviderCard.jsx  ← UPDATE
│       ├── ResultsTable.jsx  ← UPDATE
│       ├── RateChart.jsx     ← UPDATE
│       ├── ViewToggle.jsx    ← UPDATE
│       ├── ShareButton.jsx   ← UPDATE
│       ├── ResultsHeader.jsx ← NEW
│       ├── ResultsSkeleton.jsx ← NEW
│       └── index.js
├── pages/
│   ├── index.js              ← SIMPLIFY
│   └── compare/
│       └── [country].js      ← NEW
└── lib/
    ├── constants.js          ← EXTRACT
    └── seo.js               ← NEW
```

### Phase 2: Page Separation (Week 2)

#### 2.1 Extract Shared Constants
- [ ] Create `lib/constants.js` with COUNTRIES, PROVIDER_LOGO_MAP
- [ ] Update imports in index.js
- [ ] Create `lib/seo.js` for SEO helpers

#### 2.2 Create Compare Page
- [ ] Create `pages/compare/[country].js`
- [ ] Implement `getServerSideProps`
- [ ] Add SEO metadata generation
- [ ] Add OG tags for social sharing

#### 2.3 Update Landing Page
- [ ] Remove comparison result rendering
- [ ] Update form submit to router.push
- [ ] Simplify to pure landing page

### Phase 3: Feature Enhancement (Week 3)

#### 3.1 Share Functionality
- [ ] Update `ShareButton.jsx` with full implementation
- [ ] Integrate Kakao SDK
- [ ] Add clipboard copy
- [ ] Add Web Share API support

#### 3.2 Loading States
- [ ] Create `ResultsSkeleton.jsx`
- [ ] Add shimmer animations
- [ ] Implement progressive loading

#### 3.3 View Modes
- [ ] Update `ViewToggle.jsx`
- [ ] Ensure all views work on compare page

### Phase 4: Polish & QA (Week 4)

#### 4.1 Animation & Transitions
- [ ] Add page transition animations
- [ ] Add card reveal animations
- [ ] Add micro-interactions

#### 4.2 Accessibility
- [ ] Add ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader testing

#### 4.3 Performance
- [ ] Optimize images (Next.js Image)
- [ ] Add loading priorities
- [ ] Test Core Web Vitals

---

## Part 6: File-by-File Implementation Guide

### 6.1 `lib/constants.js`

```javascript
// Extract from index.js
export const COUNTRIES = [
  { code: 'VN', currency: 'VND', name: 'Vietnam', slug: 'vietnam', flag: '/images/flags/vn.png', popular: true },
  // ... all countries with slug added
];

export const PROVIDER_LOGO_MAP = {
  // ... existing mapping
};

export const POPULAR_COUNTRIES = COUNTRIES.filter(c => c.popular);
export const OTHER_COUNTRIES = COUNTRIES.filter(c => !c.popular);
```

### 6.2 `lib/seo.js`

```javascript
export function generateComparisonSEO(country, amount, locale = 'ko') {
  const formattedAmount = new Intl.NumberFormat(locale).format(amount);

  return {
    title: `${country.name} 송금 비교 | ${formattedAmount}원 → ${country.currency} | RemitBuddy`,
    description: `${country.name}으로 ${formattedAmount}원 송금 시 최저 수수료 비교. 실시간 환율 비교로 최대 절약하세요.`,
    openGraph: {
      title: `${country.name} 송금 비교 결과 | RemitBuddy`,
      description: `₩${formattedAmount} → ${country.currency} 송금 시 최저 수수료 비교 결과입니다.`,
      image: `/og/compare-${country.slug}.png`,
      url: `https://remitbuddy.com/compare/${country.slug}?amount=${amount}`,
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": `${country.name} Remittance Comparison`,
      "description": `Compare remittance providers for Korea to ${country.name}`,
      "provider": {
        "@type": "Organization",
        "name": "RemitBuddy"
      }
    }
  };
}
```

### 6.3 `pages/compare/[country].js`

```javascript
// Page structure outline
import { useRouter } from 'next/router';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { COUNTRIES } from '../../lib/constants';
import { generateComparisonSEO } from '../../lib/seo';
import {
  ResultsHeader,
  ResultsSkeleton,
  ProviderCard,
  ViewToggle,
  ShareButton
} from '../../components/comparison';

export async function getServerSideProps({ params, query, locale }) {
  const { country } = params;
  const amount = parseInt(query.amount) || 1000000;

  const countryData = COUNTRIES.find(
    c => c.slug === country.toLowerCase()
  );

  if (!countryData) {
    return { notFound: true };
  }

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

export default function ComparePage({ countryData, amount, seoData }) {
  // Client-side rate fetching and rendering
  // ...
}
```

### 6.4 `components/comparison/ResultsHeader.jsx`

```javascript
export default function ResultsHeader({
  country,
  amount,
  lastUpdated,
  providerCount,
  onShare,
  onBack
}) {
  return (
    <div className="...">
      <button onClick={onBack}>← Back</button>
      <div>
        <img src={country.flag} alt={country.name} />
        <h1>{country.name} 송금 비교</h1>
      </div>
      <p>₩{amount.toLocaleString()} → {country.currency}</p>
      <p>Last updated: {lastUpdated} • {providerCount} providers</p>
      <ShareButton onClick={onShare} />
    </div>
  );
}
```

### 6.5 `components/comparison/ResultsSkeleton.jsx`

```javascript
export default function ResultsSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 animate-pulse"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div className="h-6 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}
```

### 6.6 `components/comparison/ShareButton.jsx` (Enhanced)

```javascript
import { useState } from 'react';

export default function ShareButton({ url, title, description }) {
  const [showMenu, setShowMenu] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    // Show toast
  };

  const shareKakao = () => {
    // Kakao SDK integration
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl: '...',
        link: { webUrl: url }
      }
    });
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ url, title, text: description });
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setShowMenu(!showMenu)}>
        📤 Share
      </button>
      {showMenu && (
        <div className="absolute ...">
          <button onClick={copyToClipboard}>📋 Copy Link</button>
          <button onClick={shareKakao}>💬 KakaoTalk</button>
          <button onClick={shareNative}>📱 More...</button>
        </div>
      )}
    </div>
  );
}
```

---

## Part 7: Visual Specifications

### 7.1 Color Usage Guidelines

| Element | Light Mode | Dark Mode (Future) |
|---------|------------|-------------------|
| Background | `gray-50` | `gray-900` |
| Card Background | `white` | `gray-800` |
| Primary Text | `gray-900` | `gray-50` |
| Secondary Text | `gray-500` | `gray-400` |
| Primary Action | `blue-600` | `blue-400` |
| Success/Best | `green-500` | `green-400` |
| Border Default | `gray-200` | `gray-700` |
| Border Focus | `blue-500` | `blue-400` |

### 7.2 Typography Usage

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Page Title | Display | 36px | Bold | gray-900 |
| Section Title | Display | 24px | Bold | gray-900 |
| Card Title | Display | 20px | Semibold | gray-900 |
| Body Text | Body | 16px | Regular | gray-700 |
| Label | Body | 14px | Semibold | gray-900 |
| Caption | Body | 12px | Medium | gray-500 |
| Money Amount | Money | 32px | Black | gray-900 |
| Currency Code | Money | 16px | Bold | gray-500 |

### 7.3 Spacing Guidelines

| Context | Spacing |
|---------|---------|
| Page Padding (Mobile) | 16px |
| Page Padding (Desktop) | 24px-48px |
| Section Gap | 64px |
| Card Padding | 24px |
| Card Gap | 16px |
| Inline Element Gap | 8px |
| Button Padding | 12px 24px |

### 7.4 Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

---

## Part 8: Quality Checklist

### Design Quality

- [ ] Typography hierarchy is clear and consistent
- [ ] Color contrast meets WCAG AA standards
- [ ] Touch targets are at least 44x44px
- [ ] Loading states are implemented
- [ ] Error states are designed
- [ ] Empty states are considered
- [ ] Animations are smooth (60fps)
- [ ] Responsive at all breakpoints

### Functional Quality

- [ ] URL routing works correctly
- [ ] SEO meta tags render on server
- [ ] Share functionality works on all platforms
- [ ] Analytics events fire correctly
- [ ] Form validation provides feedback
- [ ] Back navigation preserves state

### Performance Quality

- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Images are optimized
- [ ] JavaScript is code-split

---

## Appendix: Design Assets Needed

### Icons
- [ ] Share icon
- [ ] Copy icon
- [ ] KakaoTalk logo
- [ ] Back arrow
- [ ] Sort icons
- [ ] View toggle icons

### Images
- [ ] OG images for each country (19 total)
- [ ] Provider logos (high-res)
- [ ] Country flags (SVG preferred)
- [ ] Hero background/illustration

### Fonts
- [ ] Satoshi (Display)
- [ ] Inter (Body)
- [ ] JetBrains Mono (Money)
- [ ] Pretendard (Korean)
- [ ] Noto Sans JP (Japanese)
- [ ] Be Vietnam Pro (Vietnamese)

---

**Document End**

*This design specification provides a comprehensive guide for implementing the Comparison Page Separation project with Apple-level design quality. Each phase builds upon the previous, ensuring a cohesive and polished final product.*
