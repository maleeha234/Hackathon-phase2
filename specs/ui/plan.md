# Frontend Implementation Plan — Phase II Todo Application

**Version:** v1.0
**Date:** January 9, 2026
**Status:** Draft — Requires Approval
**Parent:** `constitution.md` (Phase II Constitution v2.0), `specs/ui/frontend-ui-ux.md` (UI/UX Specification v1.0)
**Scope:** Frontend Only (Next.js 16+ App Router, TypeScript 5.x, Tailwind CSS 3.x)

---

## Executive Summary

This plan provides a detailed step-by-step roadmap for implementing the Phase II frontend of "The Evolution of Todo" application. The frontend will be a visually stunning, production-grade UI matching Linear/Notion quality standards, built with Next.js 16+ App Router, TypeScript, and Tailwind CSS.

### Quick Reference

| Phase | Focus | Duration | Dependencies |
|-------|-------|----------|--------------|
| 1 | Design System Foundation | ~2 hours | None |
| 2 | Application Shell & Navigation | ~2 hours | Phase 1 |
| 3 | Landing Page | ~2 hours | Phase 1, Phase 2 |
| 4 | Authentication Pages | ~2 hours | Phase 1, Phase 2 |
| 5 | Task Management UI | ~4 hours | Phase 1, Phase 2, Phase 4 |
| 6 | Accessibility & Responsiveness | ~2 hours | Phase 5 |
| 7 | Quality Review & Polish | ~2 hours | All phases |

**Total Estimated Time:** ~16 hours of development time

---

## Phase 1: Design System Foundation

### 1.1 Overview

**Objective:** Establish the visual foundation by configuring Tailwind CSS with all design tokens and creating reusable base UI primitives.

**Key Deliverables:**
- `tailwind.config.ts` with complete design tokens
- `frontend/src/app/globals.css` with base styles and utilities
- Base component library in `frontend/src/components/ui/`

### 1.2 Detailed Steps

#### Step 1.2.1: Configure Tailwind Design Tokens

**Reference:** `frontend-ui-ux.md` Sections 2.1, 2.2, 2.3, 2.4, 2.5

**File:** `frontend/tailwind.config.ts`

**Actions:**
1. Extend colors with neutral scale (gray-50 through gray-900)
2. Extend colors with semantic colors (primary, success, warning, danger)
3. Configure spacing scale (4px base unit: space-1 through space-16)
4. Configure border radius tokens
5. Configure shadow scale
6. Configure typography scale
7. Configure z-index layers

**Implementation:**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
        },
        danger: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
      },
      borderRadius: {
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        '': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Fira Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.5' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '500' }],
      },
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
      },
    },
  },
  plugins: [],
}

export default config
```

#### Step 1.2.2: Create Global CSS

**Reference:** `frontend-ui-ux.md` Section 2.3 (Spacing System), Section 5.1 (Micro-interactions)

**File:** `frontend/src/app/globals.css`

**Actions:**
1. Add base styles with CSS custom properties
2. Define animation utilities
3. Create transition utilities
4. Add focus ring utility class
5. Create skeleton animation

**Implementation:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo,
      Monaco, 'Courier New', monospace;
  }

  body {
    @apply font-sans text-gray-700 bg-white antialiased;
  }

  h1 {
    @apply text-h1 font-bold text-gray-900;
  }

  h2 {
    @apply text-h2 font-bold text-gray-900;
  }

  h3 {
    @apply text-h3 font-semibold text-gray-900;
  }

  h4 {
    @apply text-h4 font-semibold text-gray-900;
  }
}

@layer components {
  /* Focus Ring - WCAG AA compliant */
  .focus-ring {
    @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }

  /* Skeleton Loading Animation */
  .skeleton {
    @apply bg-gray-200 animate-pulse rounded;
  }

  /* Smooth transitions for interactive elements */
  .transition-smooth {
    @apply transition-all duration-150 ease-out;
  }
}

@layer utilities {
  /* Text truncation */
  .truncate-2-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Remove scrollbar but keep functionality */
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
}
```

#### Step 1.2.3: Create cn Utility Function

**File:** `frontend/src/lib/utils.ts`

**Actions:**
1. Implement `cn()` utility using clsx and tailwind-merge

**Implementation:**

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### Step 1.2.4: Create Button Component

**Reference:** `frontend-ui-ux.md` Section 3.1 (Button Component)

**File:** `frontend/src/components/ui/Button.tsx`

**Actions:**
1. Implement all variants: primary, secondary, outline, ghost, danger
2. Implement all sizes: sm (32px), md (40px), lg (48px)
3. Add loading state with spinner
4. Add icon support (leftIcon, rightIcon)
5. Ensure focus states meet WCAG AA requirements
6. Add disabled state with proper cursor

**Implementation Requirements:**

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

// Variant styles:
const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  danger: 'bg-danger-500 text-white hover:bg-danger-600',
}

// Size styles:
const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}
```

#### Step 1.2.5: Create Input Component

**Reference:** `frontend-ui-ux.md` Section 3.2 (Input Component)

**File:** `frontend/src/components/ui/Input.tsx`

**Actions:**
1. Implement all states: default, hover, focus, error, disabled
2. Add optional label, helper text, and error message
3. Add left/right element slots
4. Set minimum height of 44px (touch target)
5. Ensure proper aria attributes for accessibility

**Implementation Requirements:**

```typescript
interface InputProps {
  label?: string
  helperText?: string
  error?: string
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  placeholder?: string
  disabled?: boolean
  required?: boolean
  type?: 'text' | 'email' | 'password' | 'search'
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  id?: string
  className?: string
}
```

#### Step 1.2.6: Create Card Component

**Reference:** `frontend-ui-ux.md` Section 3.3 (Card Component)

**File:** `frontend/src/components/ui/Card.tsx`

**Actions:**
1. Implement variants: default, outlined, elevated
2. Add header, body, and footer slots
3. Set appropriate padding (space-6 default)
4. Configure border radius and shadows

**Implementation Requirements:**

```typescript
interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

interface CardHeaderProps {
  title?: string
  description?: string
  action?: React.ReactNode
  children?: React.ReactNode
}

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}
```

### 1.3 Dependencies

- None (Foundational phase)

### 1.4 Success Criteria

- [ ] `tailwind.config.ts` contains all design tokens from spec
- [ ] `globals.css` includes base styles and animation utilities
- [ ] Button component implements all 5 variants, 3 sizes, and loading state
- [ ] Input component implements all states with proper aria attributes
- [ ] Card component implements all 3 variants with header/body/footer
- [ ] All components are strictly typed with TypeScript
- [ ] Components follow the 4px spacing unit consistently

### 1.5 Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Tailwind config conflicts with Next.js defaults | Medium | Low | Test with fresh Next.js project before integration |
| Color contrast issues | High | Medium | Use a11y tools to verify WCAG AA compliance |
| Component API design issues | Medium | Medium | Review against spec before finalizing, seek feedback |

---

## Phase 2: Application Shell & Navigation

### 2.1 Overview

**Objective:** Build the stable application shell with responsive navigation structure distinguishing authenticated vs. unauthenticated states.

**Key Deliverables:**
- `frontend/src/app/(auth)/layout.tsx` for unauthenticated routes
- `frontend/src/app/(dashboard)/layout.tsx` for authenticated routes
- `frontend/src/components/layout/Sidebar.tsx`
- `frontend/src/components/layout/Header.tsx`

### 2.2 Detailed Steps

#### Step 2.2.1: Create Auth Layout Wrapper

**Reference:** `frontend-ui-ux.md` Section 4.2 (Authentication Pages)

**File:** `frontend/src/app/(auth)/layout.tsx`

**Actions:**
1. Create layout for sign-in and sign-up pages
2. Center the auth card with appropriate max-width (440px)
3. Apply minimal background styling
4. Prevent scroll on body when modal is open

**Implementation:**

```typescript
// Layout structure: centered card on gray-50 background
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
        {children}
      </div>
    </div>
  )
}
```

#### Step 2.2.2: Create Dashboard Layout

**Reference:** `frontend-ui-ux.md` Section 4.3 (Dashboard Layout)

**File:** `frontend/src/app/(dashboard)/layout.tsx`

**Actions:**
1. Create layout with sidebar and header
2. Implement responsive behavior (sidebar collapse on tablet)
3. Apply proper padding based on viewport
4. Handle mobile navigation toggle state

**Implementation:**

```typescript
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
```

#### Step 2.2.3: Create Sidebar Component

**Reference:** `frontend-ui-ux.md` Section 4.3.2 (Sidebar Spec)

**File:** `frontend/src/components/layout/Sidebar.tsx`

**Actions:**
1. Implement expanded (280px) and collapsed (72px) states
2. Add navigation items: Dashboard, Tasks, Settings
3. Apply proper hover and active states
4. Add responsive behavior (hidden on mobile, collapsible on tablet)
5. Ensure aria-labels for accessibility

**Implementation Requirements:**

```typescript
interface SidebarProps {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

// Widths:
// - Expanded: w-[280px]
// - Collapsed: w-[72px]
// - Mobile: hidden
// - Tablet: w-[72px] collapsed
// - Desktop: w-[280px] expanded

// States:
// - Active: bg-primary-50 text-primary-700
// - Hover: bg-gray-100
// - Focus: ring-2 ring-primary-500
```

#### Step 2.2.4: Create Header Component

**Reference:** `frontend-ui-ux.md` Section 4.3.3 (Header Spec)

**File:** `frontend/src/components/layout/Header.tsx`

**Actions:**
1. Implement search input (max-width 320px)
2. Add profile avatar (36px)
3. Apply 64px fixed height
4. Add bottom border (1px solid gray-200)
5. Handle mobile hamburger menu

**Implementation Requirements:**

```typescript
interface HeaderProps {
  title?: string
  showSearch?: boolean
  actions?: React.ReactNode
}

// Height: h-16 (64px)
// Border: border-b border-gray-200
// Search: max-w-[320px]
// Avatar: w-9 h-9 (36px)
```

#### Step 2.2.5: Create Root Layout

**File:** `frontend/src/app/layout.tsx`

**Actions:**
1. Configure metadata for the application
2. Add font optimization
3. Set up proper html/lang attributes
4. Add global providers (if needed)

### 2.3 Dependencies

- Phase 1 (Button component, Card component, global styles)

### 2.4 Success Criteria

- [ ] Auth layout centers content with max-width 440px
- [ ] Dashboard layout shows sidebar + header + content
- [ ] Sidebar expands/collapses on desktop/tablet breakpoints
- [ ] Sidebar hidden on mobile with hamburger menu
- [ ] Header includes search (320px) and profile avatar (36px)
- [ ] Navigation items have proper hover, active, and focus states
- [ ] All interactive elements are keyboard accessible
- [ ] Aria labels are present on navigation elements

### 2.5 Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Mobile navigation complexity | Medium | Medium | Start with simple slide-over, expand if needed |
| State sync between sidebar and layout | Low | Low | Use URL-based active state, lift state up if needed |

---

## Phase 3: Landing Page

### 3.1 Overview

**Objective:** Build a polished landing page with hero section, email capture CTA, and feature highlights matching Linear/Notion visual quality.

**Key Deliverables:**
- `frontend/src/app/page.tsx` (Landing page)
- `frontend/src/components/landing/` components as needed

### 3.2 Detailed Steps

#### Step 3.2.1: Build Hero Section

**Reference:** `frontend-ui-ux.md` Section 4.1 (Landing Page), Section 4.1.2 (Hero Section Spec)

**File:** `frontend/src/app/page.tsx`

**Actions:**
1. Create centered typography layout
2. Implement h1 with "Beautiful, Effortless" messaging
3. Add subtitle with app description
4. Implement email capture CTA form
5. Add dashboard preview image/screenshot
6. Apply proper padding: space-8 (desktop), space-6 (tablet), space-4 (mobile)

**Implementation Requirements:**

```typescript
// Hero section structure:
<section className="bg-gray-50 py-16 md:py-24 lg:py-32">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 className="text-h1 text-gray-900 mb-6">
      Beautiful,
      <br />
      Effortless.
    </h1>
    <p className="text-body-lg text-gray-600 max-w-2xl mx-auto mb-8">
      The todo app you've been waiting for. Minimal. Powerful. Yours.
    </p>
    <form className="max-w-md mx-auto flex gap-3">
      <Input placeholder="Enter your email" type="email" />
      <Button size="lg">Get Started</Button>
    </form>
  </div>
</section>

// Padding by breakpoint:
// Mobile (<640px): px-4
// Tablet (640-1024px): px-6
// Desktop (>1024px): px-8
// Wide (>1280px): max-w-7xl, centered
```

#### Step 3.2.2: Build Feature Highlights Section

**Reference:** `frontend-ui-ux.md` Section 4.1 (Landing Page)

**File:** `frontend/src/app/page.tsx`

**Actions:**
1. Create feature cards with icons
2. Implement 4 key features: Simple, Fast, Secure, Yours
3. Apply consistent spacing and alignment
4. Ensure responsive grid layout

**Implementation Requirements:**

```typescript
// Feature grid: 2 cols mobile, 4 cols desktop
<section className="py-16 md:py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {features.map(feature => (
        <div key={feature.title} className="text-center">
          <Icon className="w-8 h-8 mx-auto mb-3 text-primary-500" />
          <h3 className="text-h4 text-gray-900">{feature.title}</h3>
          <p className="text-body-sm text-gray-500">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

#### Step 3.2.3: Add Navigation Header to Landing

**File:** `frontend/src/components/landing/Header.tsx`

**Actions:**
1. Create minimal header for landing page
2. Add logo and navigation links
3. Implement sign-in and get-started buttons
4. Apply proper z-index and positioning

### 3.3 Dependencies

- Phase 1 (Button, Input components)
- Phase 2 (Layout patterns, but independent implementation)

### 3.4 Success Criteria

- [ ] Hero section has centered h1 with proper typography
- [ ] Email input and CTA button are properly aligned
- [ ] Feature highlights section shows 4 features in grid
- [ ] Padding follows spec: space-8 desktop, space-6 tablet, space-4 mobile
- [ ] Maximum content width is 1280px, centered
- [ ] Visual hierarchy is clear and intentional
- [ ] Micro-interactions (hover states) are smooth
- [ ] Page is fully responsive across all breakpoints

### 3.5 Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Hero typography not matching spec | Low | Low | Use text-h1 class from Tailwind config |
| Email form accessibility | Medium | Low | Ensure proper labels, keyboard nav, error states |

---

## Phase 4: Authentication Pages

### 4.1 Overview

**Objective:** Build professional sign-in and sign-up pages with form validation, loading states, and error handling.

**Key Deliverables:**
- `frontend/src/app/(auth)/sign-in/page.tsx`
- `frontend/src/app/(auth)/sign-up/page.tsx`
- Form components with validation

### 4.2 Detailed Steps

#### Step 4.2.1: Build Sign-In Page

**Reference:** `frontend-ui-ux.md` Section 4.2 (Authentication Pages), Section 4.2.2 (Auth Page Spec)

**File:** `frontend/src/app/(auth)/sign-in/page.tsx`

**Actions:**
1. Create centered card layout (max-width 440px, radius-xl)
2. Add logo at top center
3. Implement title "Welcome back" and subtitle
4. Create email and password input fields
5. Add "Forgot password?" link
6. Implement sign-in button (full-width)
7. Add "Don't have an account? Sign up" link
8. Add loading state during form submission
9. Add error state display

**Implementation Requirements:**

```typescript
// Layout:
<div className="w-full max-w-[440px] p-8 bg-white shadow-lg rounded-xl">
  <Logo className="w-8 h-8 mx-auto mb-6" />
  <h1 className="text-h3 text-center mb-2">Welcome back</h1>
  <p className="text-body-sm text-gray-500 text-center mb-6">
    Enter your credentials to access your tasks
  </p>

  <form className="space-y-4">
    <Input
      label="Email"
      type="email"
      placeholder="you@example.com"
      required
    />
    <Input
      label="Password"
      type="password"
      placeholder="Enter your password"
      required
    />
    <div className="text-right">
      <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
        Forgot password?
      </Link>
    </div>
    <Button type="submit" fullWidth isLoading={isLoading}>
      Sign In
    </Button>
  </form>

  <p className="text-body-sm text-gray-500 text-center mt-6">
    Don't have an account?{' '}
    <Link href="/sign-up" className="text-primary-600 hover:text-primary-700 font-medium">
      Sign up
    </Link>
  </p>
</div>

// Card specs:
// Padding: space-8 (32px)
// Shadow: shadow-lg
// Border radius: radius-xl (0.75rem)
// Spacing between fields: space-4 (16px)
// Button: full-width
```

#### Step 4.2.2: Build Sign-Up Page

**File:** `frontend/src/app/(auth)/sign-up/page.tsx`

**Actions:**
1. Create centered card layout (same as sign-in)
2. Add logo at top center
3. Implement title "Create an account" and subtitle
4. Create name, email, and password input fields
5. Add password strength indicator
6. Implement sign-up button (full-width)
7. Add "Already have an account? Sign in" link
8. Add loading and error states
9. Add terms of service link

**Implementation Requirements:**

```typescript
// Additional fields for sign-up:
<Input
  label="Name"
  type="text"
  placeholder="John Doe"
  required
/>
<Input
  label="Password"
  type="password"
  placeholder="Create a password"
  helperText="Must be at least 8 characters"
  required
/>

// Footer:
<p className="text-body-sm text-gray-500 text-center mt-6">
  Already have an account?{' '}
  <Link href="/sign-in" className="text-primary-600 hover:text-primary-700 font-medium">
    Sign in
  </Link>
</p>
```

#### Step 4.2.3: Add Form Validation

**Actions:**
1. Implement client-side validation
2. Show inline error messages (danger-500)
3. Disable submit button during validation
4. Add aria-invalid attributes for screen readers

### 4.3 Dependencies

- Phase 1 (Button, Input, Card components)
- Phase 2 (Auth layout)

### 4.4 Success Criteria

- [ ] Sign-in page has centered card with logo, title, subtitle
- [ ] Sign-up page has centered card with logo, title, subtitle, name field
- [ ] Card max-width is 440px with shadow-lg and radius-xl
- [ ] Form fields have proper labels, placeholders, and validation
- [ ] Error messages display in danger-500 color
- [ ] Loading state shows spinner during submission
- [ ] Focus states follow WCAG AA requirements
- [ ] Keyboard navigation works throughout form
- [ ] Links navigate to correct pages

### 4.5 Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Form validation UX issues | Medium | Low | Use established patterns from popular auth pages |
| Error message clarity | Medium | Medium | Review error messages with actual use cases |

---

## Phase 5: Task Management UI

### 5.1 Overview

**Objective:** Build the complete task management interface including TaskCard, TaskList, TaskForm modal, and optimistic UI updates.

**Key Deliverables:**
- `frontend/src/components/tasks/TaskCard.tsx`
- `frontend/src/components/tasks/TaskList.tsx`
- `frontend/src/components/tasks/TaskForm.tsx`
- `frontend/src/components/ui/Modal.tsx`
- Toast notification system

### 5.2 Detailed Steps

#### Step 5.2.1: Create Modal Component

**Reference:** `frontend-ui-ux.md` Section 3.5 (Modal/Dialog Component)

**File:** `frontend/src/components/ui/Modal.tsx`

**Actions:**
1. Implement small (400px), medium (560px), large (720px) widths
2. Add backdrop with blur (blur-sm)
3. Implement fade-in and scale-in animations
4. Add focus trap for accessibility
5. Implement Escape key to close
6. Add proper ARIA attributes
7. Implement proper focus return on close

**Implementation Requirements:**

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  footer?: React.ReactNode
}

// Sizes:
// sm: max-w-[400px]
// md: max-w-[560px]
// lg: max-w-[720px]

// Max height: max-h-[90vh]

// Animation:
// Backdrop: fade-in 150ms
// Modal: scale-in 200ms

// Close: Escape key, click backdrop, close button

// Focus trap: Required for accessibility
```

#### Step 5.2.2: Create TaskCard Component

**Reference:** `frontend-ui-ux.md` Section 3.4 (Task Card Component)

**File:** `frontend/src/components/tasks/TaskCard.tsx`

**Actions:**
1. Implement checkbox (20x20px, custom styled)
2. Add task title with strikethrough on completion
3. Add task description (max 2 lines, ellipsis)
4. Implement badges for due date and tags
5. Add "time ago" timestamp
6. Implement hover effects (shadow-md, border-primary-200)
7. Add edit and delete buttons
8. Implement optimistic UI for checkbox toggle
9. Add proper ARIA labels

**Implementation Requirements:**

```typescript
interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string
    completed: boolean
    dueDate?: string
    tags?: string[]
    createdAt: string
  }
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

// Card specs:
// Padding: space-4 (16px)
// Border: 1px solid gray-200
// Hover: shadow-md, border-primary-200
// Cursor: pointer on entire card
// Checkbox: w-5 h-5 (20px)

// Completed state:
// Title: line-through, text-gray-500
// Opacity: reduced

// Due date badges:
// Overdue: danger-500 bg-danger-50
// Today: warning-500 bg-warning-50
// Future: gray-500 bg-gray-100
```

#### Step 5.2.3: Create TaskList Component

**File:** `frontend/src/components/tasks/TaskList.tsx`

**Actions:**
1. Implement filter tabs: All, Active, Completed
2. Add search input for task filtering
3. Implement list rendering with TaskCard
4. Add skeleton loading state
5. Implement empty state with CTA
6. Add optimistic UI updates
7. Implement swipe gestures for mobile (optional)

**Implementation Requirements:**

```typescript
interface TaskListProps {
  tasks: Task[]
  filter: 'all' | 'active' | 'completed'
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void
  onSearch: (query: string) => void
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

// Filter tabs structure:
// <Tab>All</Tab>
// <Tab>Active</Tab>
// <Tab>Completed</Tab>

// Spacing between cards: space-3 (12px)

// Empty state:
// Centered, max-width 480px
// Icon: 64x64px, gray-300
// Title: h4 centered
// Description: body, gray-500, centered
// Button: primary variant
```

#### Step 5.2.4: Create TaskForm Component

**Reference:** `frontend-ui-ux.md` Section 4.5 (Task Creation/Edit Modal)

**File:** `frontend/src/components/tasks/TaskForm.tsx`

**Actions:**
1. Create form within Modal component
2. Implement title field (required, 1-100 chars)
3. Implement description textarea (max 1000 chars)
4. Implement date picker for due date
5. Add form validation with inline errors
6. Implement submit and cancel actions
7. Handle both create and edit modes

**Implementation Requirements:**

```typescript
interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => void
  task?: Task | null // If null, create mode; if present, edit mode
  isLoading?: boolean
}

interface TaskFormData {
  title: string
  description?: string
  dueDate?: string
}

// Validation rules:
// Title: 1-100 characters, required
// Description: max 1000 characters, optional
// Due date: optional, can be empty

// Date picker options:
// Show calendar on focus
// Format: YYYY-MM-DD
// Clear button available
```

#### Step 5.2.5: Implement Toast Notification System

**File:** `frontend/src/components/ui/Toast.tsx`

**Actions:**
1. Create Toast component with types: success, error, warning, info
2. Implement slide-in animation (300ms)
3. Add close button
4. Implement auto-dismiss for success/info
5. Add proper z-index (z-50)
6. Add aria-live for screen readers

**Implementation Requirements:**

```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  onClose: () => void
  duration?: number
}

// Toast positions:
// Fixed, top-right or bottom-right

// Animation:
// Slide from right, fade in (300ms)

// Auto-dismiss:
// Success/info: 5000ms
// Warning: 7000ms
// Error: persist until dismissed
```

#### Step 5.2.6: Create Task Types

**File:** `frontend/src/types/index.ts`

**Actions:**
1. Define Task interface
2. Define TaskFormData interface
3. Define API response types
4. Export for use across components

```typescript
export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description?: string
  dueDate?: string
}

export interface TaskFilters {
  completed?: boolean
  search?: string
  sort?: 'due_date' | 'created_at' | 'title'
}
```

### 5.3 Dependencies

- Phase 1 (Button, Input, Card components)
- Phase 2 (Layout components for context)
- Phase 4 (Auth forms for validation patterns)

### 5.4 Success Criteria

- [ ] Modal opens with proper focus trap and closes on Escape
- [ ] TaskCard displays all task information correctly
- [ ] Checkbox toggles instantly with optimistic UI
- [ ] TaskForm validates all fields properly
- [ ] Empty state displays when no tasks exist
- [ ] Skeleton loading shows while fetching tasks
- [ ] Toast notifications appear for actions
- [ ] All interactive elements have proper ARIA labels
- [ ] Keyboard navigation works for all interactions
- [ ] Edit mode pre-fills form with existing task data

### 5.5 Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Optimistic UI race conditions | High | Medium | Implement proper rollback with toast error |
| Modal accessibility issues | High | Medium | Implement focus trap rigorously, test with keyboard |
| Date picker complexity | Medium | Low | Use native date input for simplicity |

---

## Phase 6: Accessibility & Responsiveness Pass

### 6.1 Overview

**Objective:** Ensure full keyboard navigation, ARIA compliance, and consistent experience across mobile, tablet, and desktop.

### 6.2 Detailed Steps

#### Step 6.2.1: Keyboard Navigation Audit

**Reference:** `frontend-ui-ux.md` Section 7.1 (Keyboard Navigation)

**Actions:**
1. Verify all buttons are focusable via Tab
2. Verify checkbox toggles with Space
3. Verify links navigate with Enter
4. Verify modal trap works with Tab/Shift+Tab
5. Verify Escape closes modals
6. Add skip-to-content link for main content

**Implementation:**

```typescript
// Skip link in root layout
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-md"
>
  Skip to main content
</a>
```

#### Step 6.2.2: ARIA Labels Verification

**Reference:** `frontend-ui-ux.md` Section 7.3 (ARIA Labels)

**Actions:**
1. Verify checkbox has `aria-label="Toggle task completion"`
2. Verify delete button has `aria-label="Delete task: {task title}"`
3. Verify edit button has `aria-label="Edit task: {task title}"`
4. Verify sidebar has `aria-label="Main navigation"`
5. Verify search input has `aria-label="Search tasks"`
6. Verify user menu has `aria-label="User menu"`

#### Step 6.2.3: Color Contrast Verification

**Reference:** `frontend-ui-ux.md` Section 7.4 (Color Contrast)

**Actions:**
1. Test primary button text (4.5:1 minimum)
2. Test body text on white (4.5:1 minimum)
3. Test heading text (3:1 minimum)
4. Test disabled text (3:1 minimum)
5. Test icon-only buttons (3:1 minimum)

#### Step 6.2.4: Responsive Layout Testing

**Reference:** `frontend-ui-ux.md` Section 6 (Responsiveness)

**Actions:**
1. Test mobile layout (<640px)
2. Test tablet layout (640-1024px)
3. Test desktop layout (>1024px)
4. Verify sidebar behavior per breakpoint
5. Verify padding adjustments per breakpoint
6. Test touch targets (minimum 44px)

**Responsive Rules Summary:**

| Viewport | Sidebar | Content Padding | Header |
|----------|---------|-----------------|--------|
| Mobile (<640px) | Hidden, hamburger menu | px-4 | Hamburger, title, profile |
| Tablet (640-1024px) | Collapsed (72px) | px-6 | Full header |
| Desktop (>1024px) | Expanded (280px) | px-8 | Full header |

#### Step 6.2.5: Screen Reader Testing

**Reference:** `frontend-ui-ux.md` Section 7.5 (Screen Reader Support)

**Actions:**
1. Verify toast notifications use `aria-live="polite"`
2. Verify status updates use `aria-atomic="true"`
3. Verify form fields use `aria-describedby` for instructions
4. Verify required fields use `aria-required="true"`
5. Verify invalid fields use `aria-invalid="true"`

### 6.3 Dependencies

- Phase 5 (All task management components completed)

### 6.4 Success Criteria

- [ ] All interactive elements are keyboard accessible
- [ ] Tab navigation order is logical
- [ ] Focus indicator is visible (ring-2, ring-primary-500)
- [ ] All ARIA labels are present and accurate
- [ ] Color contrast meets WCAG AA standards
- [ ] Mobile layout functions correctly
- [ ] Touch targets are minimum 44px
- [ ] Skip link is present and functional
- [ ] Screen readers announce changes properly
- [ ] Modals trap focus correctly
- [ ] Focus returns to trigger after modal close

### 6.5 Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Focus trap implementation bugs | High | Low | Use established library or test thoroughly |
| Color contrast issues in edge cases | Medium | Medium | Use a11y tools to audit all color combinations |

---

## Phase 7: UI Quality Review & Final Polish

### 7.1 Overview

**Objective:** Final visual polish, Lighthouse validation, and hackathon-ready polish.

### 7.2 Detailed Steps

#### Step 7.2.1: Lighthouse Audit

**Actions:**
1. Run Lighthouse accessibility audit (target: 95+)
2. Run Lighthouse performance audit (target: 90+)
3. Run Lighthouse best practices audit (target: 100)
4. Run Lighthouse SEO audit (target: 100)
5. Fix any issues found

#### Step 7.2.2: UI Spec Checklist Review

**Reference:** `frontend-ui-ux.md` Section 9 (Implementation Checklist)

**Actions:**
1. Verify all components are implemented
2. Verify all pages are implemented
3. Verify all interactions are working
4. Verify all states are handled
5. Verify anti-patterns are avoided

#### Step 7.2.3: Visual Polish

**Actions:**
1. Review spacing consistency across all components
2. Review typography hierarchy
3. Review color application
4. Review border radius consistency
5. Review shadow application
6. Add micro-interactions where missing
7. Review animation timing and easing

#### Step 7.2.4: Console Error Check

**Actions:**
1. Test all pages in browser
2. Check console for errors
3. Check console for warnings
4. Fix any issues found

#### Step 7.2.5: Cross-Browser Testing

**Actions:**
1. Test in Chrome
2. Test in Firefox
3. Test in Safari (if available)
4. Test in Edge

### 7.3 Dependencies

- All previous phases completed

### 7.4 Success Criteria

- [ ] Lighthouse accessibility score: 95+
- [ ] Lighthouse performance score: 90+
- [ ] Lighthouse best practices score: 100
- [ ] Lighthouse SEO score: 100
- [ ] No console errors
- [ ] No console warnings
- [ ] All UI spec checklist items pass
- [ ] All anti-patterns avoided
- [ ] Visual polish matches Linear/Notion quality
- [ ] Micro-interactions are smooth and consistent

### 7.5 Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Lighthouse performance issues | Medium | Low | Optimize images, use proper loading states |
| Cross-browser CSS issues | Medium | Low | Test early, fix progressively |

---

## Dependencies Summary

```
Phase 1 (Design System)
    |
    v
Phase 2 (Application Shell) ---------> Phase 3 (Landing Page)
    |                                      |
    v                                      v
Phase 4 (Auth Pages) <---------------------------'
    |
    v
Phase 5 (Task Management UI)
    |
    v
Phase 6 (Accessibility & Responsiveness)
    |
    v
Phase 7 (Quality Review & Polish)
```

---

## File Structure Reference

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx          # Auth layout (centered)
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx        # Sign-in page
│   │   │   └── sign-up/
│   │   │       └── page.tsx        # Sign-up page
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Dashboard layout (sidebar + header)
│   │   │   ├── page.tsx            # Dashboard home
│   │   │   └── tasks/
│   │   │       └── page.tsx        # Task list page
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Landing page
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx          # Button component
│   │   │   ├── Card.tsx            # Card component
│   │   │   ├── Input.tsx           # Input component
│   │   │   ├── Modal.tsx           # Modal component
│   │   │   ├── Toast.tsx           # Toast notification
│   │   │   └── Skeleton.tsx        # Skeleton loader
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Sidebar navigation
│   │   │   └── Header.tsx          # Header with search
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx        # Individual task card
│   │   │   ├── TaskList.tsx        # Task list with filters
│   │   │   └── TaskForm.tsx        # Task create/edit form
│   │   └── landing/
│   │       └── Header.tsx          # Landing page header
│   ├── lib/
│   │   ├── utils.ts                # cn() utility
│   │   └── api.ts                  # API client (for Phase 3)
│   └── types/
│       └── index.ts                # TypeScript types
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## Component API Quick Reference

### Button

```typescript
<Button
  variant="primary" | "secondary" | "outline" | "ghost" | "danger"
  size="sm" | "md" | "lg"
  isLoading={boolean}
  leftIcon={ReactNode}
  rightIcon={ReactNode}
  fullWidth={boolean}
  disabled={boolean}
>
  {children}
</Button>
```

### Input

```typescript
<Input
  label={string}
  helperText={string}
  error={string}
  leftElement={ReactNode}
  rightElement={ReactNode}
  placeholder={string}
  disabled={boolean}
  required={boolean}
  type="text" | "email" | "password" | "search"
/>
```

### Modal

```typescript
<Modal
  isOpen={boolean}
  onClose={function}
  title={string}
  description={string}
  size="sm" | "md" | "lg"
  footer={ReactNode}
>
  {children}
</Modal>
```

### TaskCard

```typescript
<TaskCard
  task={{
    id: string
    title: string
    description?: string
    completed: boolean
    dueDate?: string
    tags?: string[]
    createdAt: string
  }}
  onToggle={function}
  onEdit={function}
  onDelete={function}
  isLoading={boolean}
/>
```

---

## Next Steps

After this plan is approved:

1. **Review and Refine:** Team reviews plan for completeness
2. **Task Breakdown:** Use `sp.tasks` skill to generate granular tasks
3. **Execution:** Claude Code agents execute tasks phase by phase
4. **Validation:** Each phase ends with success criteria validation
5. **Iteration:** Refine based on feedback and testing

---

**Plan Version:** v1.0
**Created:** January 9, 2026
**Author:** Claude Code (Architecture Planning)
**Status:** Awaiting Approval

*This plan serves as the authoritative roadmap for Phase II frontend implementation. All implementation must follow this plan and reference the parent specifications.*
