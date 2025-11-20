# RemitBuddy UI Component Library

A comprehensive, Toss-inspired UI component library for RemitBuddy, featuring polished components with smooth animations and Toss-quality design.

## 🎨 Design Philosophy

This component library follows **Toss design principles**:
- Clean, minimalist design with bold typography
- Smooth animations and micro-interactions
- Mobile-first responsive design
- Consistent color palette and spacing
- Subtle shadows and depth
- High accessibility standards

## 📦 Component Structure

```
components/
├── ui/                 # Core UI components
│   ├── Button.jsx     # Button with multiple variants
│   ├── Card.jsx       # Card with sub-components
│   ├── Input.jsx      # Form input component
│   ├── Select.jsx     # Dropdown select
│   └── index.js       # UI components export
├── icons/             # Icon library
│   └── index.jsx      # SVG icon components
├── Footer.jsx         # Footer component
└── index.js           # Main export file
```

## 🧩 Available Components

### Button Component

A versatile button component with multiple variants and sizes.

```jsx
import { Button } from '@/components/ui';

// Primary Button (default)
<Button variant="primary" size="lg">
  Click Me
</Button>

// Variants
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// Full Width
<Button fullWidth>Full Width Button</Button>

// With Icon
<Button icon={<SearchIcon />} iconPosition="left">
  Search
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `fullWidth`: boolean
- `disabled`: boolean
- `loading`: boolean
- `icon`: React node
- `iconPosition`: 'left' | 'right'

---

### Card Component

A flexible card component with sub-components for structured content.

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

<Card variant="elevated" hoverable>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    Main content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>

// Variants
<Card variant="default">Default</Card>
<Card variant="elevated">Elevated</Card>
<Card variant="outlined">Outlined</Card>
<Card variant="success">Success</Card>
<Card variant="brand">Brand</Card>

// Interactive
<Card hoverable>Hover Effect</Card>
<Card clickable onClick={handleClick}>Clickable Card</Card>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'success' | 'brand'
- `hoverable`: boolean
- `clickable`: boolean
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'

---

### Input Component

A polished input component with label, helper text, and error states.

```jsx
import { Input } from '@/components/ui';

<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  helperText="We'll never share your email"
  required
/>

// With Error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>

// With Icon
<Input
  label="Search"
  icon={<SearchIcon />}
  iconPosition="left"
  placeholder="Search..."
/>

// With Suffix
<Input
  label="Amount"
  type="number"
  suffix="KRW"
/>
```

**Props:**
- `label`: string
- `type`: string
- `value`: string | number
- `onChange`: function
- `placeholder`: string
- `error`: string
- `helperText`: string
- `disabled`: boolean
- `required`: boolean
- `icon`: React node
- `iconPosition`: 'left' | 'right'
- `suffix`: React node

---

### Select Component

A dropdown select component with consistent styling.

```jsx
import { Select } from '@/components/ui';

const countries = [
  { value: 'kr', label: 'South Korea' },
  { value: 'us', label: 'United States' },
  { value: 'jp', label: 'Japan' },
];

<Select
  label="Country"
  options={countries}
  value={selectedCountry}
  onChange={(e) => setSelectedCountry(e.target.value)}
  placeholder="Select a country"
  required
/>
```

**Props:**
- `label`: string
- `value`: string
- `onChange`: function
- `options`: array of { value, label }
- `placeholder`: string
- `error`: string
- `helperText`: string
- `disabled`: boolean
- `required`: boolean

---

### Icon Components

A library of gradient-based SVG icons matching Toss design language.

```jsx
import {
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  GlobeIcon,
  SparklesIcon,
  CurrencyIcon,
  TrendingUpIcon,
  ChevronDownIcon,
  SearchIcon,
  ArrowRightIcon,
  BellIcon,
  UploadIcon,
  HeartIcon,
  StarIcon,
  LoadingIcon,
  XIcon,
  MenuIcon,
} from '@/components/icons';

// Usage
<CheckCircleIcon size={24} />
<ShieldIcon size={32} className="text-brand-500" />
<StarIcon filled />
```

**Props:**
- `size`: number (default: 24)
- `className`: string
- `filled`: boolean (for HeartIcon and StarIcon)

---

### Footer Component

A comprehensive footer with social links and navigation.

```jsx
import Footer from '@/components/Footer';

<Footer />
```

## 🎨 Design Tokens

### Colors

The component library uses a Toss-inspired color system:

**Brand (Blue)**
- `brand-50` to `brand-900`
- Primary: `#3182F6`

**Accent (Green)**
- `accent-50` to `accent-900`
- Primary: `#00C853`

**Grays**
- `gray-50` to `gray-900`
- Custom: `gray-150` for borders

### Shadows

**Toss-style Shadows** (ambient, no directional bias):
- `shadow-toss-sm`
- `shadow-toss`
- `shadow-toss-lg`
- `shadow-toss-xl`

**Card Shadows**:
- `shadow-card`
- `shadow-card-hover`
- `shadow-card-best`

**Button Shadows**:
- `shadow-button`
- `shadow-button-hover`

### Border Radius

Consistent rounded corners:
- `rounded-sm`: 8px
- `rounded` / `rounded-md`: 12px
- `rounded-lg` / `rounded-xl`: 16px
- `rounded-2xl`: 20px
- `rounded-3xl`: 24px
- `rounded-4xl`: 28px

### Animations

**Smooth Timing Functions**:
- `transition-toss`: Toss-style easing
- `transition-toss-in`: Entrance animation
- `transition-toss-out`: Exit animation

**Keyframe Animations**:
- `animate-fade-in`
- `animate-fade-in-up`
- `animate-slide-up`
- `animate-scale-in`
- `animate-pulse-gentle`
- `animate-float`
- `animate-press` (button press effect)

## 🚀 Usage Guidelines

### Importing Components

```jsx
// Import UI components
import { Button, Card, Input, Select } from '@/components/ui';

// Import icons
import { CheckCircleIcon, ShieldIcon } from '@/components/icons';

// Import Footer
import Footer from '@/components/Footer';
```

### Styling Best Practices

1. **Use Tailwind utilities** for spacing and layout
2. **Leverage design tokens** for colors and shadows
3. **Apply transitions** to interactive elements
4. **Maintain consistency** with the design system
5. **Test responsiveness** on mobile and desktop

### Responsive Design

All components are **mobile-first** and responsive:
- Base styles target mobile devices
- Use `sm:`, `md:`, `lg:`, `xl:` breakpoints for larger screens
- Test on multiple device sizes

## 🎯 Accessibility

All components follow accessibility best practices:
- Semantic HTML elements
- ARIA attributes where needed
- Keyboard navigation support
- Focus visible states
- Screen reader compatibility

## 📱 Mobile Optimization

- Touch-friendly sizes (minimum 44×44px)
- Smooth scrolling
- Optimized animations (respects `prefers-reduced-motion`)
- Fast tap responses

## 🔄 Future Enhancements

Planned additions:
- Modal/Dialog component
- Toast/Notification system
- Tabs component
- Accordion component
- Badge component
- Checkbox & Radio components
- Switch/Toggle component

## 📚 Examples

See `pages/index.js` for real-world implementation examples.

## 💡 Tips

1. **Combine components** for complex UIs
2. **Customize with className** when needed
3. **Use variants** before custom styles
4. **Follow Toss design patterns** for consistency
5. **Test animations** on slower devices

---

**Built with Toss design principles in mind** ✨
