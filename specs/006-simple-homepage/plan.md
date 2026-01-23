# Implementation Plan: Simple Homepage

**Branch**: `006-simple-homepage` | **Date**: 2026-01-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-simple-homepage/spec.md`

## Summary

Create a public-facing homepage for RescueStream that showcases the platform's key features and value proposition. The page will use the existing design system (Tailwind CSS, shadcn/ui) and follow the established patterns from legal pages layout. It will include a hero section, features grid, call-to-action, and footer with legal links.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled)
**Primary Dependencies**: Next.js 16.1.3, React 19.2.3, Tailwind CSS 4, shadcn/ui, @tabler/icons-react, next-themes
**Storage**: N/A (static content, no database)
**Testing**: Manual testing, ESLint for code quality
**Target Platform**: Web (all modern browsers, responsive 320px-2560px)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Page load < 3 seconds, all content above fold on desktop
**Constraints**: Must match existing visual design language, WCAG 2.1 AA accessibility
**Scale/Scope**: Single static page with 4 feature cards

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | ✅ PASS | Homepage will use self-contained components (Hero, FeatureCard, Footer) |
| II. App Router Patterns | ✅ PASS | Server Component at `app/(home)/page.tsx`, layout for shared UI |
| III. API Integration Discipline | ✅ N/A | No API calls required (static content) |
| IV. Reusability & Composition | ✅ PASS | Will reuse existing Card, Button components; create reusable FeatureCard |
| V. Type Safety | ✅ PASS | All props will be explicitly typed |

**Gate Status**: PASSED - No violations detected.

## Project Structure

### Documentation (this feature)

```text
specs/006-simple-homepage/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal - static content)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── (home)/              # New route group for homepage
│   ├── layout.tsx       # Homepage layout (header, footer)
│   └── page.tsx         # Homepage content (hero, features, CTA)
├── (auth)/              # Existing auth pages
├── (dashboard)/         # Existing dashboard pages
├── (legal)/             # Existing legal pages
└── layout.tsx           # Root layout (unchanged)

components/
├── ui/                  # Existing shadcn/ui components (reused)
├── home/                # New homepage-specific components
│   └── feature-card.tsx # Feature highlight card component
└── ...                  # Other existing components

public/
├── logo.png             # Existing (reused)
└── logo-dark.png        # Existing (reused)
```

**Structure Decision**: Using App Router route group `(home)` to keep homepage layout separate from dashboard/auth layouts while maintaining clean URL structure. The homepage will be a Server Component since it renders static content.

## Complexity Tracking

> No constitution violations to justify.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | - | - |
