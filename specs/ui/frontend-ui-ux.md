# Frontend UI & UX Specification — Phase II Todo Application

**Version:** v1.0
**Date:** December 30, 2025
**Status:** Active — Governs all Phase II frontend development
**Parent:** `constitution.md` (Phase II Constitution)

---

## 1. Introduction

### 1.1 Purpose

This specification defines the user interface and experience requirements for the Phase II Todo web application. It establishes a design system foundation, page-by-page specifications, and strict quality gates to ensure the frontend achieves production-grade polish suitable for hackathon competition and real-world deployment.

### 1.2 Scope

This document covers:

- Design system foundation (colors, typography, spacing, elevation)
- Page-level UI specifications (Landing, Auth, Dashboard, Task Management)
- Component patterns and behaviors
- Responsiveness and accessibility requirements
- Anti-patterns and forbidden practices

### 1.3 Design Philosophy

The UI must embody three core principles:

| Principle | Implementation |
|-----------|----------------|
| **Modern SaaS Polish** | Linear, Vercel, Notion-level visual quality |
| **Consistency** | Unified design language across all touchpoints |
| **Intentional Design** | Every pixel serves a purpose |

---

## 2. Design System Foundation

### 2.1 Color Palette

#### 2.1.1 Neutral Scale (Grays)

The neutral palette provides the visual foundation for the entire application. All grays derive from a unified scale to ensure consistency.

| Token | Value | Usage |
|-------|-------|-------|
| `gray-50` | `#F9FAFB` | Page backgrounds, subtle surfaces |
| `gray-100` | `#F3F4F6` | Secondary backgrounds, hover states |
| `gray-200` | `#E5E7EB` | Borders, dividers, subtle separation |
| `gray-300` | `#D1D5DB` | Disabled states, muted borders |
| `gray-400` | `#9CA3AF` | Placeholder text, icons |
| `gray-500` | `#6B7280` | Secondary text, metadata |
| `gray-600` | `#4B5563` | Body text on light backgrounds |
| `gray-700` | `#374151` | Headings, emphasis text |
| `gray-800` | `#1F2937` | Primary headings on light backgrounds |
| `gray-900` | `#111827` | Inverted text, high contrast headings |

#### 2.1.2 Semantic Colors

Semantic colors communicate state and action across the application. Usage must be consistent and purposeful.

| Token | Value | Usage |
|-------|-------|-------|
| `primary-50` | `#EEF2FF` | Primary background tint |
| `primary-100` | `#E0E7FF` | Primary hover background |
| `primary-500` | `#6366F1` | Primary actions, links |
| `primary-600` | `#4F46E5` | Primary actions (active) |
| `primary-700` | `#4338CA` | Primary actions (pressed) |
| `success-50` | `#ECFDF5` | Success background tint |
| `success-500` | `#10B981` | Success indicators, completions |
| `success-600` | `#059669` | Success actions (active) |
| `warning-50` | `#FFFBEB` | Warning background tint |
| `warning-500` | `#F59E0B` | Warning indicators |
| `warning-600` | `#D97706` | Warning actions (active) |
| `danger-50` | `#FEF2F2` | Danger background tint |
| `danger-500` | `#EF4444` | Destructive actions, errors |
| `danger-600` | `#DC2626` | Danger actions (active) |

#### 2.1.3 Color Application Rules

```
┌─────────────────────────────────────────────────────────────┐
│ COLOR USAGE HIERARCHY                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. PRIMARY actions (buttons, links)                        │
│     → primary-500 (rest), primary-600 (hover), primary-700  │
│                                                             │
│  2. DESTRUCTIVE actions (delete, remove)                    │
│     → danger-500 (rest), danger-600 (hover)                 │
│                                                             │
│  3. SUCCESS states (completed tasks)                        │
│     → success-500 checkmarks, success-50 backgrounds        │
│                                                             │
│  4. INFORMATION (metadata, timestamps)                      │
│     → gray-500 for body, gray-400 for placeholders          │
│                                                             │
│  5. WARNING states (approaching due dates)                  │
│     → warning-500 accents, warning-50 backgrounds           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Typography

#### 2.2.1 Font Family

The application uses system font stacks for optimal performance and native feel:

```css
/* Primary: Modern system UI fonts */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, sans-serif;

/* Monospace: For code, timestamps, IDs */
--font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo,
             Monaco, 'Courier New', monospace;
```

#### 2.2.2 Type Scale

Typography follows a harmonious scale with consistent line heights. All text uses relative units (`rem`) for accessibility.

| Element | Size | Weight | Line Height | Letter Spacing | Usage |
|---------|------|--------|-------------|----------------|-------|
| `h1` | 2.25rem (36px) | 700 | 1.1 | -0.02em | Page titles |
| `h2` | 1.875rem (30px) | 700 | 1.2 | -0.01em | Major sections |
| `h3` | 1.5rem (24px) | 600 | 1.3 | 0 | Section headings |
| `h4` | 1.25rem (20px) | 600 | 1.4 | 0 | Subsection headings |
| `body-lg` | 1.125rem (18px) | 400 | 1.6 | 0 | Body text (high readability) |
| `body` | 1rem (16px) | 400 | 1.5 | 0 | Primary body content |
| `body-sm` | 0.875rem (14px) | 400 | 1.5 | 0 | Secondary content |
| `caption` | 0.75rem (12px) | 500 | 1.4 | 0.04em | Metadata, labels |

#### 2.2.3 Typography Rules

1. **Maximum line length:** 65-75 characters for optimal readability
2. **Paragraph spacing:** 1em after each paragraph
3. **Heading hierarchy:** Never skip levels (h1 → h2 → h3)
4. **Text truncation:** Use CSS `text-overflow: ellipsis` for overflow
5. **Responsive scaling:** Use `clamp()` for fluid typography where appropriate

### 2.3 Spacing System

#### 2.3.1 Spacing Scale

A consistent 4px base unit multiplied by scale factors provides all spacing values.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 0.25rem (4px) | Icon padding, tight spacing |
| `space-2` | 0.5rem (8px) | Inline element spacing |
| `space-3` | 0.75rem (12px) | Small component padding |
| `space-4` | 1rem (16px) | Standard padding |
| `space-5` | 1.25rem (20px) | Component gap |
| `space-6` | 1.5rem (24px) | Section spacing |
| `space-8` | 2rem (32px) | Large section spacing |
| `space-10` | 2.5rem (40px) | Major section spacing |
| `space-12` | 3rem (48px) | Page section separation |
| `space-16` | 4rem (64px) | Page-level spacing |

#### 2.3.2 Horizontal Padding

```
┌─────────────────────────────────────────────────────────────┐
│ HORIZONTAL PADDING BY BREAKPOINT                            │
├─────────────────┬───────────────────────────────────────────┤
│ BREAKPOINT      │ PADDING                                   │
├─────────────────┼───────────────────────────────────────────┤
│ Mobile (<640px) │ space-4 (1rem) on both sides              │
│ Tablet (640-    │ space-6 (1.5rem) on both sides            │
│ 1024px)         │                                           │
│ Desktop (>1024px)│ space-8 (2rem) on both sides             │
│ Wide (>1280px)  │ max-width: 1280px, centered              │
└─────────────────┴───────────────────────────────────────────┘
```

#### 2.3.3 Vertical Rhythm

- Base unit: 1rem (16px) for consistent vertical rhythm
- Component internal padding: `space-4` minimum
- Section separation: `space-8` minimum
- Page sections: `space-12` to `space-16`

### 2.4 Elevation & Depth

#### 2.4.1 Shadow Scale

Shadows create depth hierarchy. Use subtle shadows; avoid harsh borders.

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | 0 1px 2px 0 rgb(0 0 0 / 0.05) | Subtle elevation, hover states |
| `shadow` | 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) | Default card elevation |
| `shadow-md` | 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) | Active cards, dropdowns |
| `shadow-lg` | 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) | Modals, popovers |
| `shadow-xl` | 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) | Dialog overlays |

#### 2.4.2 Layer Order (Z-Index)

| Layer | Value | Usage |
|-------|-------|-------|
| `z-0` | 0 | Default |
| `z-10` | 10 | Hover states |
| `z-20` | 20 | Dropdowns |
| `z-30` | 30 | Sticky headers |
| `z-40` | 40 | Modals, dialogs |
| `z-50` | 50 | Toast notifications |
| `z-auto` | auto | Reset to auto |

### 2.5 Border Radius

```
┌─────────────────────────────────────────────────────────────┐
│ BORDER RADIUS APPLICATION                                   │
├─────────────────────┬───────────────────────────────────────┤
│ COMPONENT           │ BORDER RADIUS                         │
├─────────────────────┼───────────────────────────────────────┤
│ Buttons (default)   │ radius-md (0.375rem)                  │
│ Buttons (pill)      │ radius-full (9999px)                  │
│ Input fields        │ radius-md (0.375rem)                  │
│ Cards               │ radius-lg (0.5rem)                    │
│ Modals              │ radius-xl (0.75rem)                   │
│ Badges, chips       │ radius-full (small), radius-md (large)│
│ Avatars             │ radius-full (circle)                  │
└─────────────────────┴───────────────────────────────────────┘
```

---

## 3. Component Specifications

### 3.1 Button Component

#### 3.1.1 Variants

| Variant | Background | Text Color | Border | Hover |
|---------|------------|------------|--------|-------|
| `primary` | `primary-500` | white | none | `primary-600` |
| `secondary` | `gray-100` | `gray-700` | none | `gray-200` |
| `outline` | transparent | `gray-700` | 1px solid `gray-300` | `gray-50` |
| `ghost` | transparent | `gray-600` | none | `gray-100` |
| `danger` | `danger-500` | white | none | `danger-600` |

#### 3.1.2 Sizes

| Size | Height | Padding (x, y) | Font Size |
|------|--------|----------------|-----------|
| `sm` | 32px | space-3, space-2 | 0.875rem |
| `md` | 40px | space-4, space-3 | 0.875rem |
| `lg` | 48px | space-5, space-4 | 1rem |

#### 3.1.3 States

- **Default:** Standard appearance
- **Hover:** Subtle background shift, slight lift (shadow-sm)
- **Focus:** `ring-2` with `primary-500` and `ring-offset-2`
- **Active:** Pressed state with darker background
- **Disabled:** `opacity-50`, `cursor-not-allowed`

#### 3.1.4 Button Spec Implementation

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  asChild?: boolean
}
```

### 3.2 Input Component

#### 3.2.1 States

| State | Border Color | Background | Icon Color |
|-------|--------------|------------|------------|
| Default | `gray-300` | white | `gray-400` |
| Hover | `gray-400` | white | `gray-500` |
| Focus | `primary-500` | white | `primary-500` |
| Error | `danger-500` | `danger-50` | `danger-500` |
| Disabled | `gray-200` | `gray-50` | `gray-400` |

#### 3.2.2 Input Spec

```tsx
interface InputProps {
  label?: string
  helperText?: string
  error?: string
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  placeholder?: string
  disabled?: boolean
  required?: boolean
}
```

#### 3.2.3 Height & Padding

- Input height: 44px (minimum touch target)
- Padding: space-4 horizontal
- Border: 1px solid
- Transition: all 150ms ease

### 3.3 Card Component

#### 3.3.1 Card Variants

| Variant | Background | Border | Shadow |
|---------|------------|--------|--------|
| Default | white | none | shadow |
| Outlined | white | 1px solid `gray-200` | none |
| Elevated | white | none | shadow-lg |

#### 3.3.2 Card Padding

- Default padding: space-6 (24px)
- Card header padding: space-4 (16px)
- Card footer padding: space-4 (16px)

### 3.4 Task Card Component

The task card is the primary interactive element of the application.

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [checkbox]  Task Title - Completed indicator           │   │
│  │            Task description (2 lines max, then ellipsis) │   │
│  │  ┌─────────────┐ ┌─────────────┐                        │   │
│  │  │ badge: due  │ │ badge: tag  │                        │   │
│  │  └─────────────┘ └─────────────┘                        │   │
│  │  ← time ago →                                      [edit] │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

Task Card Specifications:
- Padding: space-4 (16px)
- Border: 1px solid gray-200
- Hover: shadow-md, border-primary-200
- Cursor: pointer on entire card
- Checkbox: 20x20px, custom styled
- Completion: strikethrough title, gray-500 text
```

### 3.5 Modal/Dialog Component

#### 3.5.1 Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Header                                                  │   │
│  │  ┌─────┐  Title                    [× close]            │   │
│  │  └─────┘                                                │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Content                                                │   │
│  │                                                         │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Footer                                                 │   │
│  │  [secondary] [primary]                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ← backdrop with blur →                                     │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.5.2 Modal Spec

| Property | Value |
|----------|-------|
| Width (small) | 400px |
| Width (medium) | 560px |
| Width (large) | 720px |
| Max height | 90vh |
| Border radius | radius-xl |
| Backdrop | rgba(0, 0, 0, 0.5) with blur-sm |
| Animation | fade-in (150ms), scale-in (200ms) |
| Focus trap | Required |

---

## 4. Page Specifications

### 4.1 Landing Page (`/`)

#### 4.1.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Logo          [Sign In]                     [Get       │   │
│  │                                         Started]         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │      Beautiful,                                          │   │
│  │      Effortless.                                         │   │
│  │                                                         │   │
│  │      The todo app you've been waiting for.              │   │
│  │      Minimal. Powerful. Yours.                          │   │
│  │                                                         │   │
│  │      ┌──────────────────────────┐                       │   │
│  │      │  Enter your email →     │                       │   │
│  │      └──────────────────────────┘                       │   │
│  │                                                         │   │
│  │      ┌───────────────────────────────────────────────┐ │   │
│  │      │                                               │ │   │
│  │      │     [Dashboard Preview Screenshot]           │ │   │
│  │      │                                               │ │   │
│  │      └───────────────────────────────────────────────┘ │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Features: Simple • Fast • Secure • Yours              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.1.2 Hero Section Spec

| Element | Specification |
|---------|---------------|
| Page padding | space-8 (desktop), space-6 (tablet), space-4 (mobile) |
| Max container width | 1280px, centered |
| Hero text alignment | Center |
| Title typography | h1, gray-900, space-6 bottom margin |
| Subtitle typography | body-lg, gray-600, space-8 bottom margin |
| CTA button | size-lg, primary variant |
| Email input | max-width 400px, centered |
| Preview image | radius-xl, shadow-xl, border |

#### 4.1.3 Visual Treatment

- **Hero background:** `gray-50` with subtle gradient or white
- **Primary focus:** Typography and whitespace
- **No clutter:** Navigation minimal, distractions removed
- **Micro-interactions:** Smooth hover states, subtle animations

### 4.2 Authentication Pages

#### 4.2.1 Sign In / Sign Up Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │                                                 │   │   │
│  │  │  [Logo]                                         │   │   │
│  │  │                                                 │   │   │
│  │  │  Welcome back                                   │   │   │
│  │  │  Enter your credentials to access your tasks    │   │   │
│  │  │                                                 │   │   │
│  │  │  ┌─────────────────────────────────────────┐   │   │   │
│  │  │  │ Email                                   │   │   │   │
│  │  │  └─────────────────────────────────────────┘   │   │   │
│  │  │  ┌─────────────────────────────────────────┐   │   │   │
│  │  │  │ Password                                │   │   │   │
│  │  │  └─────────────────────────────────────────┘   │   │   │
│  │  │                                                 │   │   │
│  │  │  [Forgot password?]                          │   │   │
│  │  │                                                 │   │   │
│  │  │  ┌─────────────────────────────────────────┐   │   │   │
│  │  │  │ [Sign In]                               │   │   │   │
│  │  │  └─────────────────────────────────────────┘   │   │   │
│  │  │                                                 │   │   │
│  │  │  Don't have an account? [Sign up]            │   │   │
│  │  │                                                 │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.2.2 Auth Page Spec

| Property | Value |
|----------|-------|
| Container max width | 440px |
| Container padding | space-8 |
| Card background | white |
| Card shadow | shadow-lg |
| Card border radius | radius-xl |
| Logo placement | Top center |
| Title | h3 centered |
| Subtitle | body-sm, gray-500, centered |
| Form spacing | space-4 between fields |
| Button width | Full width |
| Footer link | body-sm, gray-500, centered, link color primary-600 |

### 4.3 Dashboard Layout

#### 4.3.1 Main Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌────────┬─────────────────────────────────────────────────┐   │
│  │        │  Header                                         │   │
│  │        │  ┌───────────────────────────────────────────┐ │   │
│  │  Side  │  │  [Sidebar]  [Search]  [Profile]          │ │   │
│  │  Nav   │  └───────────────────────────────────────────┘ │   │
│  │        ├─────────────────────────────────────────────────┤   │
│  │  Logo  │                                               │   │
│  │        │  ┌─────────────────────────────────────────┐ │   │
│  │  [Dash]│  │  Page Title     [+ New Task]           │ │   │
│  │  [List]│  └─────────────────────────────────────────┘ │   │
│  │  [Settings]│                                           │   │
│  │        │  ┌─────────────────────────────────────────┐ │   │
│  │        │  │  Filters: [All] [Active] [Completed]   │ │   │
│  │        │  └─────────────────────────────────────────┘ │   │
│  │        │                                               │   │
│  │        │  ┌─────────────────────────────────────────┐ │   │
│  │        │  │                                         │ │   │
│  │        │  │         Task List                       │ │   │
│  │        │  │                                         │ │   │
│  │        │  │  ┌───────────────────────────────────┐  │ │   │
│  │        │  │  │  Task Card 1                      │  │ │   │
│  │        │  │  └───────────────────────────────────┘  │ │   │
│  │        │  │  ┌───────────────────────────────────┐  │ │   │
│  │        │  │  │  Task Card 2                      │  │ │   │
│  │        │  │  └───────────────────────────────────┘  │ │   │
│  │        │  │                                         │ │   │
│  │        │  └─────────────────────────────────────────┘ │   │
│  │        │                                               │   │
│  └────────┴─────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.3.2 Sidebar Spec

| Property | Value |
|----------|-------|
| Width (expanded) | 280px |
| Width (collapsed) | 72px |
| Background | white / gray-50 |
| Border right | 1px solid gray-200 |
| Padding | space-4 |
| Nav item padding | space-3, space-4 |
| Nav item radius | radius-md |
| Active state | background: primary-50, text: primary-700 |
| Hover state | background: gray-100 |

#### 4.3.3 Header Spec

| Property | Value |
|----------|-------|
| Height | 64px |
| Border bottom | 1px solid gray-200 |
| Padding | space-4 (horizontal) |
| Layout | Flex row, space-between |
| Search input width | 320px |
| Profile avatar size | 36px |

### 4.4 Task List Page

#### 4.4.1 Empty State

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │          ════════════════════════════                   │   │
│  │                                                         │   │
│  │              No tasks yet                               │   │
│  │                                                         │   │
│  │    Create your first task to start being                │   │
│  │    productive and organized.                            │   │
│  │                                                         │   │
│  │    ┌─────────────────────────────┐                      │   │
│  │    │  [+ Create your first task]│                      │   │
│  │    └─────────────────────────────┘                      │   │
│  │                                                         │   │
│  │          ════════════════════════════                   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.4.2 Empty State Spec

| Element | Specification |
|---------|---------------|
| Container | Centered, max-width 480px |
| Icon size | 64x64px, gray-300 |
| Title | h3 centered, gray-900 |
| Description | body, gray-500, centered, space-6 top margin |
| Button | centered, primary variant |

### 4.5 Task Creation/Edit Modal

#### 4.5.1 Form Fields

```
┌───────────────────────────────────────────────────────────────┐
│  Create Task                                      [×]         │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Title *                                                     │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  e.g., "Review Q4 budget proposal"                    │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
│  Description                                                 │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  Add more details...  [3 lines, auto-expand]          │   │
│  │                                                       │   │
│  │                                                       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
│  Due Date                                                    │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  [📅 Select date]                                     │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                        [Cancel]  [Create]     │
└───────────────────────────────────────────────────────────────┘
```

#### 4.5.2 Task Form Spec

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Title | Text input | Yes | 1-100 characters |
| Description | Textarea | No | Max 1000 characters |
| Due date | Date picker | No | Future dates only |
| Tags | Multi-select | No | Max 5 tags |

---

## 5. Interaction Design

### 5.1 Micro-interactions

#### 5.1.1 Button Interactions

| State | Transition | Duration |
|-------|------------|----------|
| Hover | Background color shift, subtle lift | 150ms ease |
| Press | Scale down 2% | 100ms ease |
| Focus | Ring appears | 150ms ease |
| Loading | Spinner replaces content | 200ms ease |

#### 5.1.2 Task Toggle (Optimistic UI)

```
User clicks checkbox → Instant visual change → API request
                                              ↓
                              Success → Confirm state
                              Error → Revert with toast
```

| Interaction | Duration | Feedback |
|-------------|----------|----------|
| Check click | Instant (<50ms) | Check appears, strikethrough applies |
| API success | 200-500ms | Subtle scale pulse |
| API error | 300ms delay | Revert with shake, toast error |

#### 5.1.3 Page Transitions

- **Page load:** Content fades in (200ms)
- **Navigation:** Exit then enter (150ms each)
- **Modal appear:** Scale from 95%, fade in (200ms)
- **Toast appear:** Slide from right, fade in (300ms)

### 5.2 Loading States

#### 5.2.1 Skeleton Loading

```
┌─────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐   │
│  │  ████████  ████████████████  ████████████████  │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ████████████████  ██████████████████████████   │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ████████  ████████████████████████████████     │   │
│  └─────────────────────────────────────────────────┘   │
```

#### 5.2.2 Skeleton Spec

| Element | Color | Animation |
|---------|-------|-----------|
| Background | `gray-200` | Pulse 1.5s infinite |
| Width | 100% (or 60-80% for variable) | — |
| Height | Matches real content | — |
| Radius | Matches real content | — |

### 5.3 Empty States

All list views must have designed empty states with:

1. Icon/illustration (64x64px, muted)
2. Title (h4, centered)
3. Description (body-sm, gray-500, centered)
4. Action button (primary variant, if applicable)

### 5.4 Error States

| Error Type | Display | User Action |
|------------|---------|-------------|
| Network error | Toast notification with retry button | Retry or dismiss |
| Validation error | Inline text below field (danger-500) | Correct and resubmit |
| 404 | Friendly "Not found" page with CTA | Navigate home |
| 500 | Friendly error page with reload option | Reload or contact support |

---

## 6. Responsiveness

### 6.1 Breakpoints

```
┌─────────────────────────────────────────────────────────────────┐
│  BREAKPOINT REFERENCE                                           │
├──────────────────────┬──────────────────────────────────────────┤
│  Breakpoint         │ Window Width                             │
├──────────────────────┼──────────────────────────────────────────┤
│  xs                 │ < 640px (Mobile)                         │
│  sm                 │ 640px - 767px                            │
│  md                 │ 768px - 1023px (Tablet)                  │
│  lg                 │ 1024px - 1279px (Desktop)                │
│  xl                 │ 1280px - 1535px (Large Desktop)          │
│  2xl                │ >= 1536px (Extra Large)                  │
└──────────────────────┴──────────────────────────────────────────┘
```

### 6.2 Responsive Layout Rules

| Viewport | Sidebar | Content Padding | Header |
|----------|---------|-----------------|--------|
| Mobile | Hidden, hamburger menu | space-4 | Hamburger, title, profile |
| Tablet | Collapsed (72px) | space-6 | Full header |
| Desktop | Expanded (280px) | space-8 | Full header |

### 6.3 Mobile Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [☰]  Page Title                             [Profile] │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │            [Slide-out Menu]                             │   │
│  │                                                         │   │
│  │  [Dash]  [List]  [Settings]  [Sign Out]                │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Accessibility

### 7.1 Keyboard Navigation

| Element | Key | Behavior |
|---------|-----|----------|
| Button | Enter / Space | Activate |
| Checkbox | Space | Toggle |
| Link | Enter | Navigate |
| Modal | Escape | Close (if no focus trap) |
| Modal | Tab | Cycle through focusable elements |
| Modal | Shift+Tab | Reverse cycle |

### 7.2 Focus Management

- **Focus indicator:** `ring-2`, `ring-offset-2`, `ring-primary-500`
- **Focus visible:** Only on keyboard navigation
- **Focus trap:** Required in modals
- **Return focus:** Return to trigger element after modal close

### 7.3 ARIA Labels

| Element | ARIA Attribute |
|---------|----------------|
| Checkbox | `aria-label="Toggle task completion"` |
| Delete button | `aria-label="Delete task: {task title}"` |
| Edit button | `aria-label="Edit task: {task title}"` |
| Sidebar nav | `aria-label="Main navigation"` |
| Search input | `aria-label="Search tasks"` |
| User menu | `aria-label="User menu"` |

### 7.4 Color Contrast

| Element | Contrast Ratio | Requirement |
|---------|----------------|-------------|
| Primary button text | 4.5:1 minimum | WCAG AA |
| Body text on white | 4.5:1 minimum | WCAG AA |
| Heading text | 3:1 minimum | WCAG AA |
| Disabled text | 3:1 minimum | WCAG AA |
| Icon-only buttons | 3:1 minimum | WCAG AA |

### 7.5 Screen Reader Support

- **Live regions:** `aria-live="polite"` for toast notifications
- **Announcements:** `aria-atomic="true"` for status updates
- **Described by:** `aria-describedby` for field instructions
- **Required fields:** `aria-required="true"` on required inputs
- **Invalid fields:** `aria-invalid="true"` on validation error

---

## 8. Anti-Patterns (Strictly Forbidden)

### 8.1 Visual Anti-Patterns

| Forbidden | Instead Use |
|-----------|-------------|
| Hardcoded pixel values for layout | Spacing tokens (space-*) |
| Inline styles | Tailwind classes or CSS modules |
| Default browser focus rings | Custom, consistent ring |
| Multiple font families | Single font family with weights |
| Random margins | Consistent spacing scale |
| Cluttered screens | Generous whitespace |
| Inconsistent border radius | Defined radius tokens |

### 8.2 Color Anti-Patterns

| Forbidden | Instead Use |
|-----------|-------------|
| Overuse of primary color | Accent usage only |
| Rainbow color coding | Single accent + neutrals |
| Bright saturated colors | Muted, professional palette |
| Meaningless color variations | Semantic color usage |

### 8.3 UX Anti-Patterns

| Forbidden | Instead Use |
|-----------|-------------|
| Unlabeled icons | Icons with `aria-label` or tooltips |
| Missing empty states | Designed empty state with CTA |
| Abrupt loading to content | Skeleton loading states |
| No error feedback | Toast notifications, inline errors |
| Unclear actions | Verbose button labels |
| Auto-logout without warning | Session timeout with warning |

### 8.4 Implementation Anti-Patterns

| Forbidden | Instead Use |
|-----------|-------------|
| Repeated component code | Extract to reusable component |
| Prop drilling | Use composition or context |
| Any-typed values | Strict TypeScript types |
| Untyped API responses | Generated types from schema |
| Console.log debugging | Structured logging |

---

## 9. Implementation Checklist

### 9.1 Before Implementation

- [ ] Review design tokens and spacing scale
- [ ] Set up Tailwind configuration with design tokens
- [ ] Create base component library
- [ ] Verify accessibility tools are configured

### 9.2 Component Development

- [ ] Button component (all variants)
- [ ] Input component (with labels, validation)
- [ ] Card component
- [ ] Modal component (with focus trap)
- [ ] Task card component
- [ ] Navigation components (sidebar, header)
- [ ] Toast notifications
- [ ] Skeleton loaders

### 9.3 Page Implementation

- [ ] Landing page
- [ ] Authentication pages (sign in, sign up)
- [ ] Dashboard layout
- [ ] Task list page
- [ ] Task creation modal
- [ ] Task detail/edit view

### 9.4 Quality Gates

- [ ] Lighthouse accessibility score: 95+
- [ ] Lighthouse performance score: 90+
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast meets WCAG AA
- [ ] Responsive layout verified on all breakpoints
- [ ] No console errors or warnings

---

## 10. File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── tasks/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/              # Base components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ...
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskList.tsx
│   │   │   └── TaskForm.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── Navigation.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   └── classnames.ts
│   └── types/
│       └── index.ts
├── tailwind.config.ts
└── ...
```

---

## Appendix A: Quick Reference — Design Tokens

### Colors (Tailwind Extension)

```typescript
// tailwind.config.ts
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
}
```

### Spacing (4px base unit)

| Token | rem | px |
|-------|-----|----|
| space-1 | 0.25rem | 4px |
| space-2 | 0.5rem | 8px |
| space-3 | 0.75rem | 12px |
| space-4 | 1rem | 16px |
| space-5 | 1.25rem | 20px |
| space-6 | 1.5rem | 24px |
| space-8 | 2rem | 32px |
| space-10 | 2.5rem | 40px |
| space-12 | 3rem | 48px |
| space-16 | 4rem | 64px |

### Border Radius

| Token | rem | px |
|-------|-----|----|
| radius-sm | 0.125rem | 2px |
| radius-md | 0.375rem | 6px |
| radius-lg | 0.5rem | 8px |
| radius-xl | 0.75rem | 12px |
| radius-2xl | 1rem | 16px |
| radius-full | 9999px | — |

### Shadows

```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
```

---

**Specification Version:** v1.0
**Effective Date:** December 30, 2025
**Author:** Claude Code (Agentic Generation)
**Parent Document:** `constitution.md`

*This specification serves as the UI contract for Phase II frontend development. All implementation must strictly adhere to these specifications.*
