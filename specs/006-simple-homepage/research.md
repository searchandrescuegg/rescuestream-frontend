# Research: Simple Homepage

**Feature**: 006-simple-homepage
**Date**: 2026-01-23

## Research Tasks

### 1. Existing Page Layout Patterns

**Decision**: Use a route group `(home)` with its own layout, following the pattern established by `(legal)` pages.

**Rationale**: The existing codebase uses route groups to separate concerns:
- `(auth)` - authentication pages with minimal layout
- `(dashboard)` - authenticated dashboard with sidebar
- `(legal)` - public legal pages with header/footer layout

The homepage should follow the `(legal)` pattern since it's also a public-facing page with header and footer.

**Alternatives considered**:
- Placing homepage directly in `app/page.tsx` (current redirect): Rejected because it requires a custom layout anyway
- Using `(legal)` layout: Rejected because homepage needs different content structure (hero section vs. prose content)

### 2. Component Reuse Strategy

**Decision**: Reuse existing shadcn/ui components (Card, Button) and create one new component (FeatureCard).

**Rationale**: The codebase already has:
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` - for structured content boxes
- `Button` with variants (default, outline, ghost, link) - for CTAs
- Pattern from `app/(dashboard)/help/page.tsx` shows inline `StepCard` component for feature-like content

**Alternatives considered**:
- Creating multiple homepage-specific components (HeroSection, FeaturesSection, etc.): Rejected as over-engineering for a simple static page
- Fully inline implementation: Rejected because FeatureCard pattern will be reused 4 times

### 3. Header/Footer Pattern

**Decision**: Create a dedicated homepage layout that mirrors the `(legal)` layout structure but with homepage-specific navigation.

**Rationale**: The `(legal)/layout.tsx` provides an excellent template:
- Logo in header with dark/light mode variants
- Back navigation link to dashboard/login
- Footer with legal page links
- Centered content with responsive container

The homepage will adapt this pattern with:
- Hero-focused header (larger logo, prominent CTA)
- Same footer structure for consistency

**Alternatives considered**:
- Sharing layout with legal pages: Rejected because homepage needs different header treatment (hero vs. simple header)

### 4. Responsive Design Approach

**Decision**: Use Tailwind's responsive utilities with mobile-first approach.

**Rationale**: Existing pages use consistent responsive patterns:
- `container mx-auto px-4` for centered responsive containers
- `md:` and `lg:` prefixes for breakpoint-specific styles
- Grid layouts with `md:grid-cols-2` for feature cards

**Alternatives considered**: None - Tailwind responsive utilities are the established pattern.

### 5. Dark Mode Implementation

**Decision**: Use existing `next-themes` setup with conditional class-based styling.

**Rationale**: The codebase uses:
- `dark:` prefix for dark mode styles
- Conditional Image components for light/dark logos (`dark:hidden` and `hidden dark:block`)
- CSS variables via Tailwind for theme colors (`bg-background`, `text-foreground`, etc.)

**Alternatives considered**: None - existing pattern is well-established.

### 6. Icon Library

**Decision**: Use `@tabler/icons-react` for feature icons, consistent with existing usage.

**Rationale**: The help page uses Tabler icons:
- `IconBroadcast`, `IconKey`, `IconPlayerPlay`, `IconUsers`, `IconVideo`

Appropriate icons for homepage features:
- Live Streams: `IconVideo` or `IconBroadcast`
- Broadcasters: `IconUsers`
- Stream Keys: `IconKey`
- Multi-Protocol: `IconDevices` or `IconBrandWebflow`

**Alternatives considered**:
- Radix Icons (`@radix-ui/react-icons`): Available but less comprehensive than Tabler
- Lucide React: Available but Tabler is the established pattern

## Resolved Clarifications

| Item | Resolution | Source |
|------|------------|--------|
| Layout pattern | Route group with dedicated layout | Existing `(legal)` pattern |
| Component library | shadcn/ui + Tabler icons | Existing codebase |
| Styling approach | Tailwind CSS with dark mode | Constitution + existing code |
| Responsive breakpoints | Mobile-first, md/lg breakpoints | Existing patterns |

## No Outstanding Clarifications

All technical decisions have been resolved based on existing codebase patterns and constitution guidelines.
