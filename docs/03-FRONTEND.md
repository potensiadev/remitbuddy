# RemitBuddy - Frontend Documentation

**Document Version:** 1.0
**Last Updated:** 2025-11-24

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Design System](#design-system)
4. [Component Library](#component-library)
5. [Internationalization](#internationalization)
6. [Routing](#routing)
7. [State Management](#state-management)
8. [Performance Optimization](#performance-optimization)

---

## Technology Stack

### Core Framework
- **Next.js**: 14.0.0 (React framework with SSR/SSG)
- **React**: 18.0.0 (UI library)
- **TypeScript**: 5.9.3 (Type safety)

### Styling
- **Tailwind CSS**: 3.0.0 (Utility-first CSS)
- **PostCSS**: 8.0.0 (CSS processing)
- **Autoprefixer**: 10.0.0 (Vendor prefixing)

### Internationalization
- **next-i18next**: 15.0.0 (i18n for Next.js)
- **11 Languages**: en, ko, vi, tl, km, my, th, uz, id, si, ne

### Analytics & Monetization
- **Google Analytics 4**: G-Z0SHT6SKJ3
- **Google AdSense**: ca-pub-8945839011287197

---

## Project Structure

```
frontend/
├── pages/                      # Next.js pages (routes)
│   ├── _app.js                # App wrapper (i18n, analytics)
│   ├── _document.js           # HTML document structure
│   ├── index.js               # 🏠 Main landing page
│   ├── redesign.js            # Alternative design variant
│   ├── blog/
│   │   ├── index.js          # Blog listing page
│   │   └── [slug].js         # Dynamic blog post pages
│   └── api/
│       └── log-event.js      # Server-side event logging
│
├── components/                 # React components
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.jsx        # 7 button variants
│   │   ├── Card.jsx          # Card component
│   │   ├── Input.jsx         # Input field
│   │   ├── Select.jsx        # Select dropdown
│   │   └── index.js          # Barrel exports
│   │
│   ├── icons/
│   │   └── index.jsx         # SVG icon library
│   │
│   ├── Footer.jsx            # Site footer
│   ├── HeroSection.tsx       # Hero section (TypeScript)
│   └── index.js              # Component exports
│
├── styles/
│   └── globals.css           # Global styles + Tailwind imports
│
├── public/
│   ├── locales/              # i18n translation files
│   │   ├── en/common.json
│   │   ├── ko/common.json
│   │   └── [9 more...]
│   │
│   ├── images/
│   │   └── flags/            # Country flag images
│   │
│   └── logos/                # Provider logos
│       ├── hanpass.png
│       ├── wirebarley.png
│       └── [8 more...]
│
├── lib/                       # Utility libraries
├── utils/                     # Helper functions
│
├── next.config.js            # Next.js configuration
├── next-i18next.config.js    # i18n configuration
├── tailwind.config.js        # Tailwind CSS theme
├── postcss.config.js         # PostCSS config
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
└── netlify.toml              # Netlify deployment
```

---

## Design System

### Design Philosophy: Toss-Inspired

RemitBuddy uses a **Toss-inspired design system** - Korea's most trusted fintech brand.

**Key Principles**:
1. **Trust & Professionalism**: Clean, minimal interface
2. **Mobile-First**: Optimized for mobile users (primary audience)
3. **Clarity**: Clear information hierarchy
4. **Subtle Animations**: Smooth, professional transitions
5. **Accessible**: WCAG 2.1 AA compliance

---

### Color Palette

#### Brand Colors (Toss Blue)
```css
brand: {
  DEFAULT: '#3182F6',      /* Toss signature blue */
  50: '#EBF4FF',
  100: '#D1E9FF',
  200: '#B3DDFF',
  300: '#84C5FF',
  400: '#549DFF',
  500: '#3182F6',          /* Primary */
  600: '#1B6BE6',
  700: '#1557CF',
  800: '#1848A8',
  900: '#1A3D7C',
}
```

#### Accent Colors (Success Green)
```css
accent: {
  DEFAULT: '#00C853',
  500: '#00C853',          /* Success, best rate */
  600: '#00B048',
  700: '#00983D',
}
```

#### Neutral Grays
```css
gray: {
  50: '#F9FAFB',          /* Backgrounds */
  100: '#F3F4F6',         /* Light backgrounds */
  150: '#EBEDF0',         /* Borders (custom) */
  200: '#E5E7EB',         /* Borders */
  400: '#9CA3AF',         /* Secondary text */
  600: '#4B5563',         /* Body text */
  800: '#1F2937',         /* Headings */
  900: '#111827',         /* Dark text */
}
```

---

### Typography

**Font Family**: System fonts (performance)
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Scale**:
```css
text-xs:   0.75rem (12px)  - Small labels
text-sm:   0.875rem (14px) - Secondary text
text-base: 1rem (16px)     - Body text
text-lg:   1.125rem (18px) - Large text
text-xl:   1.25rem (20px)  - Small headings
text-2xl:  1.5rem (24px)   - Headings
text-3xl:  1.875rem (30px) - Large headings
text-4xl:  2.25rem (36px)  - Hero headings
```

---

### Spacing Scale

**4px base unit** (Tailwind default):
```css
spacing: {
  1: '0.25rem',   /* 4px */
  2: '0.5rem',    /* 8px */
  3: '0.75rem',   /* 12px */
  4: '1rem',      /* 16px */
  6: '1.5rem',    /* 24px */
  8: '2rem',      /* 32px */
  12: '3rem',     /* 48px */
  16: '4rem',     /* 64px */
}
```

---

### Border Radius

**Toss-style rounded corners**:
```css
borderRadius: {
  sm: '8px',
  DEFAULT: '12px',
  md: '12px',
  lg: '16px',
  xl: '16px',
  2xl: '20px',
  3xl: '24px',
  full: '9999px',  /* Pills */
}
```

---

### Shadows

**Toss-style ambient shadows** (no directional bias):
```css
boxShadow: {
  'toss-sm': '0 0 6px rgba(0, 0, 0, 0.05)',
  'toss': '0 0 12px rgba(0, 0, 0, 0.06)',
  'toss-lg': '0 0 20px rgba(0, 0, 0, 0.08)',

  'card': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
  'card-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
  'card-best': '0 8px 24px 0 rgba(0, 200, 83, 0.16)',  /* Green glow */
}
```

---

### Animations

**Toss-style smooth animations**:
```css
animation: {
  'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  'float': 'float 3s ease-in-out infinite',
  'shimmer': 'shimmer 2s linear infinite',  /* Loading */
}
```

**Easing Functions**:
```css
transitionTimingFunction: {
  'toss': 'cubic-bezier(0.16, 1, 0.3, 1)',      /* Main easing */
  'toss-in': 'cubic-bezier(0.32, 0, 0.67, 0)',  /* Enter */
  'toss-out': 'cubic-bezier(0.33, 1, 0.68, 1)', /* Exit */
}
```

---

### Responsive Breakpoints

**Mobile-first approach**:
```css
screens: {
  'xs': '475px',     /* Large phones */
  'sm': '640px',     /* Tablets */
  'md': '768px',     /* Small laptops */
  'lg': '1024px',    /* Laptops - Layout mode switch */
  'xl': '1280px',    /* Desktops */
  '2xl': '1536px',   /* Large desktops */
}
```

---

## Component Library

### UI Components (`components/ui/`)

#### Button Component (`Button.jsx`)

**7 Variants**:
1. **Primary**: Blue background, white text
2. **Secondary**: White background, gray border
3. **Success**: Green background (best rate)
4. **Outline**: Transparent, colored border
5. **Ghost**: Transparent, no border
6. **Link**: Underlined text
7. **Disabled**: Grayed out

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Usage**:
```jsx
<Button variant="primary" size="lg" onClick={handleSearch}>
  비교하기
</Button>
```

---

#### Card Component (`Card.jsx`)

**Features**:
- Hover effect (lift + shadow)
- Best rate variant (green glow)
- Responsive padding

**Props**:
```typescript
interface CardProps {
  best?: boolean;      // Best rate highlight
  clickable?: boolean; // Hover effect
  children: React.ReactNode;
}
```

---

#### Input Component (`Input.jsx`)

**Features**:
- Number formatting (commas)
- Currency prefix (₩)
- Validation states
- Error messages

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'number' | 'email';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  prefix?: string;  // e.g., "₩"
}
```

---

#### Select Component (`Select.jsx`)

**Features**:
- Country flags
- Search/filter
- Keyboard navigation
- Mobile-optimized

**Props**:
```typescript
interface SelectProps {
  options: Array<{
    value: string;
    label: string;
    flag?: string;  // Flag image URL
  }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

---

### Icon Components (`components/icons/index.jsx`)

**Available Icons**:
- `ChevronDownIcon`: Dropdown indicator
- `CheckCircleIcon`: Success state
- `ClockIcon`: Fast transfer
- `ShieldIcon`: Security
- `GlobeIcon`: Multi-country
- `SparklesIcon`: Best rate badge
- `CurrencyIcon`: Money-related
- `TrendingUpIcon`: Rate improvement

**Usage**:
```jsx
import { CheckCircleIcon } from '../components/icons';

<CheckCircleIcon className="w-6 h-6 text-green-500" />
```

---

### Main Components

#### HeroSection (`HeroSection.tsx`)

**TypeScript Component** - Main comparison form.

**Features**:
- Amount input with validation
- Country selector with flags
- Live API call to backend
- Loading states
- Result display

**State**:
```typescript
const [sendAmount, setSendAmount] = useState<number>(100000);
const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
const [results, setResults] = useState<QuoteResult[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
```

**Flow**:
```
1. User enters amount
2. User selects country
3. User clicks "Compare"
4. Validate input
5. Show loading state
6. Call API
7. Display results (sorted by best rate)
```

---

#### ProviderCard (`pages/index.js`)

**Quote result card component**.

**Features**:
- Provider logo
- Exchange rate display
- Fee information
- Recipient amount (highlighted)
- "Best Rate" badge (for #1)
- Click to visit provider

**Props**:
```typescript
interface ProviderCardProps {
  provider: QuoteResult;
  isBest: boolean;
  index: number;
}
```

**Layout**:
```
┌─────────────────────────────────────┐
│ [Logo]  Provider Name         #1 🏆 │ ← Header
│─────────────────────────────────────│
│ Exchange Rate: 0.0234 VND/KRW       │ ← Rates
│ Fee: ₩3,000                         │
│─────────────────────────────────────│
│ Recipient Gets:                     │ ← Result
│ 2,270,500 VND                       │ ← (large, bold)
│─────────────────────────────────────│
│ [Visit Provider →]                  │ ← CTA
└─────────────────────────────────────┘
```

---

#### Footer (`Footer.jsx`)

**Features**:
- Company info
- Quick links
- Social media links (if any)
- Language selector
- Copyright notice

**Sections**:
1. **About**: Company description
2. **Links**: Terms, Privacy, Contact
3. **Languages**: Language switcher
4. **Copyright**: © 2025 RemitBuddy

---

## Internationalization (i18n)

### Supported Languages (11)

| Code | Language | Native Name | Target Audience |
|------|----------|-------------|-----------------|
| en | English | English | Default/International |
| ko | Korean | 한국어 | Korean users (primary) |
| vi | Vietnamese | Tiếng Việt | Vietnamese workers in Korea |
| tl | Tagalog | Tagalog | Filipino workers |
| km | Khmer | ភាសាខ្មែរ | Cambodian workers |
| my | Burmese | မြန်မာဘာသာ | Myanmar workers |
| th | Thai | ไทย | Thai workers |
| uz | Uzbek | Oʻzbekcha | Uzbek workers |
| id | Indonesian | Bahasa Indonesia | Indonesian workers |
| si | Sinhala | සිංහල | Sri Lankan workers |
| ne | Nepali | नेपाली | Nepali workers |

---

### Translation Files

**Location**: `public/locales/{locale}/common.json`

**Structure**:
```json
{
  "hero": {
    "title": "Find the Best Remittance Rates",
    "subtitle": "Compare 10 providers in seconds",
    "amount_label": "Send Amount",
    "country_label": "Destination Country",
    "compare_button": "Compare Now"
  },
  "results": {
    "best_rate": "Best Rate",
    "exchange_rate": "Exchange Rate",
    "fee": "Transfer Fee",
    "recipient_gets": "Recipient Gets",
    "visit_provider": "Visit Provider"
  },
  "errors": {
    "no_results": "No results found. Please try again.",
    "network_error": "Network error. Please check your connection.",
    "invalid_amount": "Please enter a valid amount."
  }
}
```

---

### Configuration (`next-i18next.config.js`)

```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko', 'vi', 'tl', 'km', 'my', 'th', 'uz', 'id', 'si', 'ne'],
    localeDetection: false,  // Manual language selection
  },
}
```

---

### Usage in Components

**With Hook**:
```jsx
import { useTranslation } from 'next-i18next';

function Component() {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}
```

**With Server-Side Props**:
```jsx
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
```

---

## Routing

### Next.js Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `pages/index.js` | Home page (main app) |
| `/en` | `pages/index.js` | English version |
| `/ko` | `pages/index.js` | Korean version |
| `/redesign` | `pages/redesign.js` | Alternative design |
| `/blog` | `pages/blog/index.js` | Blog listing |
| `/blog/[slug]` | `pages/blog/[slug].js` | Dynamic blog posts |

---

### Redirects (`next.config.js`)

```javascript
async redirects() {
  return [
    // Naked domain → www
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'remitbuddy.com' }],
      destination: 'https://www.remitbuddy.com/:path*',
      permanent: true,
    },
    // Legacy URL
    {
      source: '/compare',
      destination: '/en',
      permanent: true,
      locale: false,
    },
  ]
}
```

---

## State Management

**Strategy**: **Local Component State** (no global store)

**Why no Redux/MobX?**
- Simple app with minimal shared state
- React hooks sufficient
- Better performance (no global re-renders)

**State Location**:
```
pages/index.js (Main Page)
  ├─> sendAmount (user input)
  ├─> selectedCountry (user selection)
  ├─> results (API response)
  ├─> loading (boolean)
  └─> error (string | null)
```

**Future Consideration**: If adding user accounts, favorites, etc. → consider Zustand or Context API

---

## Performance Optimization

### 1. Image Optimization

**Next.js Image Component**:
```jsx
import Image from 'next/image';

<Image
  src="/logos/hanpass.png"
  width={120}
  height={40}
  alt="Hanpass"
  loading="lazy"  // Lazy load
  formats={['image/avif', 'image/webp']}  // Modern formats
/>
```

**Benefits**:
- Automatic format conversion (AVIF, WebP)
- Responsive images
- Lazy loading
- Blur placeholder

---

### 2. Code Splitting

**Automatic** in Next.js:
- Each page = separate bundle
- Only load what's needed

**Manual Dynamic Imports**:
```jsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Loading...</p>,
  ssr: false,  // Client-side only
});
```

---

### 3. Font Optimization

**System Fonts** (no web fonts):
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

**Benefits**:
- Zero network requests
- Instant rendering
- Better performance on mobile

---

### 4. CSS Optimization

**Tailwind CSS Purge**:
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  // Unused classes automatically removed in production
}
```

**Result**: ~10 KB CSS (vs. 3 MB full Tailwind)

---

### 5. Bundle Size

**Current Bundle**:
- **First Load JS**: ~85 KB (gzipped)
- **Page JS**: ~15-20 KB per route
- **Shared JS**: ~70 KB (React, Next.js)

**Optimization Techniques**:
- Tree shaking (Webpack)
- Minification (Terser)
- Compression (Gzip, Brotli)

---

### 6. Caching Strategy

**Static Assets** (1 year):
```
/_next/static/*        → Cache-Control: public, max-age=31536000, immutable
/images/*              → Cache-Control: public, max-age=31536000, immutable
/logos/*               → Cache-Control: public, max-age=31536000, immutable
```

**HTML Pages** (no cache):
```
/*                     → Cache-Control: public, max-age=0, must-revalidate
```

**Why no HTML cache?**
- Data changes frequently
- Always serve latest version
- CDN edge caching handles performance

---

### 7. Analytics Performance

**Google Analytics 4** (async):
```jsx
<Script
  strategy="afterInteractive"  // Load after page interactive
  src="https://www.googletagmanager.com/gtag/js?id=G-Z0SHT6SKJ3"
/>
```

**Benefits**:
- Non-blocking
- Doesn't delay page load

---

## Accessibility

### WCAG 2.1 AA Compliance

**Features**:
1. **Keyboard Navigation**: All interactive elements
2. **Focus Indicators**: Visible focus rings
3. **ARIA Labels**: Screen reader support
4. **Color Contrast**: 4.5:1 minimum
5. **Touch Targets**: 56px minimum (mobile)

**Example**:
```jsx
<button
  className="focus:ring-2 focus:ring-brand focus:ring-offset-2"
  aria-label="Compare remittance rates"
>
  Compare
</button>
```

---

**Next Document**: [04-DEPLOYMENT.md](./04-DEPLOYMENT.md) - Deployment and DevOps
