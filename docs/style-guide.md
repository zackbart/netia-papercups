# Netia UI Style Guide

Modern design system inspired by Notion, Linear, and Intercom. This guide documents the visual language, components, and design patterns used throughout the Netia application.

## Design Philosophy

Our design system is built on the principles of:
- **Clean & Minimal**: Remove unnecessary visual clutter
- **Generous Whitespace**: Use ample spacing for breathing room
- **Subtle Interactions**: Smooth hover states and transitions
- **Consistent Typography**: Clear hierarchy with Inter/Sora fonts
- **Modern Shadows**: Subtle, layered shadows for depth
- **Refined Borders**: Thin, subtle borders for separation

## Color Palette

### Primary Colors

```css
--netia-primary: #1677ff        /* Primary blue */
--netia-primary-dark: #0b63d1   /* Darker blue for hover states */
--netia-primary-hover: #0958d9  /* Hover state blue */
--netia-primary-light: #eaf3ff  /* Light blue for backgrounds */
```

### Text Colors

```css
--netia-text-primary: #000000   /* Pure black for headings */
--netia-text-secondary: #1a1a1a /* Dark gray for body text */
--netia-text-muted: #6b6b6b     /* Muted gray for secondary text */
```

### Background Colors

```css
--netia-bg-white: #ffffff       /* Pure white */
--netia-bg-surface: #fafafa    /* Light gray surface */
--netia-bg-hover: #f5f5f5      /* Hover state background */
```

### Border Colors

```css
--netia-border: #e5e5e5        /* Standard border */
--netia-border-light: #f0f0f0  /* Light border */
--netia-border-dark: #d9d9d9   /* Dark border for hover */
```

### Sidebar Colors

```css
--netia-sidebar-bg: #000000                                    /* Pure black */
--netia-sidebar-text: #ffffff                                  /* White text */
--netia-sidebar-hover: rgba(255, 255, 255, 0.08)              /* Hover state */
--netia-sidebar-active: rgba(255, 255, 255, 0.12)             /* Active state */
```

## Typography

### Font Families

- **Body Text**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
- **Headings**: `'Sora', 'Inter', system-ui, sans-serif`
- **Code**: `source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace`

### Font Sizes

```css
--netia-font-size-xs: 12px      /* Small labels, captions */
--netia-font-size-sm: 14px      /* Base body text */
--netia-font-size-base: 16px    /* Large body text */
--netia-font-size-lg: 18px      /* Small headings */
--netia-font-size-xl: 20px      /* Medium headings */
--netia-font-size-2xl: 24px     /* Large headings */
--netia-font-size-3xl: 32px     /* Extra large headings */
```

### Font Weights

- **Regular**: 400 (body text)
- **Medium**: 500 (emphasized text, buttons)
- **Semibold**: 600 (headings, important text)
- **Bold**: 700 (emphasis, strong headings)

### Line Heights

```css
--netia-line-height-tight: 1.4   /* Headings */
--netia-line-height-normal: 1.5  /* Body text */
--netia-line-height-relaxed: 1.6 /* Relaxed reading */
```

### Typography Examples

**Headings (Sora)**
- Large headings: 24px, weight 600, line-height 1.4, letter-spacing -0.01em
- Medium headings: 18px, weight 600, line-height 1.4
- Small headings: 16px, weight 600, line-height 1.4

**Body Text (Inter)**
- Base: 14px, weight 400, line-height 1.5
- Secondary: 13px, weight 400, color muted
- Small: 12px, weight 400, color muted

## Spacing System

Based on a 4px grid system for consistent spacing throughout the application.

```css
--netia-space-xs: 4px   /* Extra small spacing */
--netia-space-sm: 8px   /* Small spacing */
--netia-space-md: 12px  /* Medium spacing */
--netia-space-lg: 16px  /* Large spacing */
--netia-space-xl: 20px  /* Extra large spacing */
--netia-space-2xl: 24px /* 2x large spacing */
--netia-space-3xl: 32px /* 3x large spacing */
```

### Spacing Guidelines

- **Padding**: Use 12px, 16px, 20px, 24px, or 32px for component padding
- **Margins**: Use consistent spacing between elements (12px, 16px, 20px)
- **Gaps**: Use 8px or 12px for gaps between related elements

## Border Radius

```css
--netia-radius-sm: 6px   /* Small elements (badges, tags) */
--netia-radius-md: 8px   /* Medium elements (buttons, inputs) */
--netia-radius-lg: 12px  /* Large elements (cards, message bubbles) */
```

## Shadows

Subtle, layered shadows for depth and elevation:

```css
--netia-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--netia-shadow-md: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
--netia-shadow-lg: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
--netia-shadow-xl: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
```

### Shadow Usage

- **Small**: Subtle depth for inputs, buttons
- **Medium**: Cards, dropdowns
- **Large**: Modals, popovers
- **Extra Large**: Heavy elevation elements

## Transitions

Smooth, consistent animations:

```css
--netia-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--netia-transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--netia-transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Transition Guidelines

- **Fast (150ms)**: Micro-interactions, hover states
- **Base (200ms)**: Standard transitions (default)
- **Slow (300ms)**: Complex animations, state changes

## Components

### Buttons

**Primary Button**
- Background: `#1677ff`
- Hover: `#0958d9` with subtle lift (`translateY(-1px)`)
- Shadow: `--netia-shadow-md` on hover
- Border radius: `8px`
- Transition: `200ms cubic-bezier(0.4, 0, 0.2, 1)`

**Text Button**
- Transparent background
- Hover: `--netia-bg-hover`
- Border radius: `8px`
- Transition: `200ms cubic-bezier(0.4, 0, 0.2, 1)`

### Inputs

**Text Input**
- Border: `1px solid --netia-border`
- Border radius: `8px`
- Focus: `--netia-primary` border with `0 0 0 3px rgba(22, 119, 255, 0.1)` shadow
- Hover: `--netia-border-dark`
- Transition: `200ms cubic-bezier(0.4, 0, 0.2, 1)`

### Cards

**Card Container**
- Background: `--netia-bg-white`
- Border: `1px solid --netia-border`
- Border radius: `8px`
- Shadow: `--netia-shadow-md` (optional)
- Transition: `200ms cubic-bezier(0.4, 0, 0.2, 1)`

### Message Bubbles

**Agent Message (Right)**
- Background: `--netia-primary`
- Border radius: `12px`
- Shadow: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- Text color: White
- Max width: 80%

**Customer Message (Left)**
- Background: `--netia-bg-surface`
- Border radius: `12px`
- Shadow: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- Text color: `--netia-text-secondary`
- Max width: 80%

**Private Note**
- Background: `--netia-note` (#fff1b8)
- Border radius: `12px`
- Text color: `--netia-text-secondary`

### Conversation Items

**List Item**
- Padding: `12px`
- Border bottom: `1px solid --netia-border-light`
- Border left: `3px solid transparent` (or `--netia-primary` when selected)
- Hover: `--netia-bg-hover`
- Selected: `--netia-primary-light` background with `--netia-primary` left border
- Transition: `200ms cubic-bezier(0.4, 0, 0.2, 1)`

### Sidebar Navigation

**Sidebar Container**
- Background: `--netia-sidebar-bg` (#000000)
- Text color: `--netia-sidebar-text` (#ffffff)
- Width: Collapsed (64px)

**Menu Items**
- Border radius: `8px`
- Margin: `4px 12px`
- Hover: `--netia-sidebar-hover` background
- Active: `--netia-sidebar-active` background
- Transition: `200ms cubic-bezier(0.4, 0, 0.2, 1)`

### Headers

**Conversation Header**
- Background: `--netia-bg-white`
- Border bottom: `1px solid --netia-border-light`
- Shadow: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- Padding: `12px 16px`
- Typography: 18px Sora, weight 600

## Usage Examples

### Creating a Modern Card

```tsx
<Card shadow="medium" sx={{p: 3}}>
  <Title level={4}>Card Title</Title>
  <Text>Card content with modern styling</Text>
</Card>
```

### Styling a Button

```tsx
<Button 
  type="primary" 
  style={{
    borderRadius: '8px',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
  }}
>
  Click me
</Button>
```

### Creating a Message Bubble

```tsx
<Box
  sx={{
    background: colors.primary,
    borderRadius: '12px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    px: 3,
    py: 2,
    maxWidth: '80%',
  }}
>
  <Text style={{color: colors.white}}>Message content</Text>
</Box>
```

## Design Tokens

All design tokens are available as CSS variables in `App.css`:

```css
:root {
  /* Colors */
  --netia-primary: #1677ff;
  --netia-text-primary: #000000;
  --netia-bg-white: #ffffff;
  /* ... and more */
}
```

They're also exported as JavaScript objects in `common.tsx`:

```typescript
import {colors, shadows} from './common';

// Use in components
<Box sx={{bg: colors.bgWhite, border: `1px solid ${colors.border}`}}>
```

## Accessibility

- **Contrast**: All text meets WCAG AA standards (minimum 4.5:1 for normal text)
- **Focus States**: Clear, visible focus indicators on all interactive elements
- **Typography**: Readable font sizes (minimum 12px for body text)
- **Spacing**: Adequate touch targets (minimum 44x44px for interactive elements)

## Best Practices

1. **Consistency**: Always use design system tokens (colors, spacing, typography)
2. **Whitespace**: Use generous spacing for breathing room
3. **Shadows**: Use subtle shadows for depth, not heavy shadows
4. **Transitions**: Apply smooth transitions to interactive elements
5. **Typography**: Maintain clear hierarchy with consistent font sizes and weights
6. **Borders**: Use thin, subtle borders (not heavy outlines)
7. **Hover States**: Provide clear visual feedback on hover

## Component Patterns

### Layout Pattern

```tsx
<Layout>
  <Sider className="Dashboard-Sider" style={{background: colors.sidebarBg}}>
    {/* Sidebar content */}
  </Sider>
  <Layout style={{background: colors.bgWhite, marginLeft: 64}}>
    {/* Main content */}
  </Layout>
</Layout>
```

### List Item Pattern

```tsx
<Box
  sx={{
    p: 3,
    borderBottom: `1px solid ${colors.borderLight}`,
    borderLeft: selected ? `3px solid ${colors.primary}` : '3px solid transparent',
    background: selected ? colors.primaryLight : colors.bgWhite,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: colors.bgHover,
    },
  }}
>
  {/* List item content */}
</Box>
```

### Input Pattern

```tsx
<Input
  style={{
    borderColor: colors.border,
    borderRadius: '8px',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  }}
  onFocus={(e) => {
    e.target.style.borderColor = colors.primary;
    e.target.style.boxShadow = '0 0 0 3px rgba(22, 119, 255, 0.1)';
  }}
/>
```

## Future Considerations

- **Dark Mode**: Design tokens prepared for future dark mode implementation
- **Responsive Breakpoints**: Consider adding responsive spacing tokens
- **Animation Library**: May benefit from a unified animation system
- **Component Library**: Consider extracting reusable components into a shared library

---

**Last Updated**: Design system implementation on `redesign` branch
**Inspiration**: Notion, Linear, Intercom

