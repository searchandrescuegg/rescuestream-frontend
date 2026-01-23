# Implementation Plan: Legal Pages for OAuth Consent

**Branch**: `005-legal-pages` | **Date**: 2026-01-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-legal-pages/spec.md`

## Summary

Add publicly accessible Privacy Policy (`/privacy`) and Terms of Service (`/terms`) pages to satisfy Google OAuth Consent Screen verification requirements. Pages will be static content, styled consistently with the application, and accessible without authentication. Footer links will be added to provide discoverability from both authenticated and unauthenticated contexts.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16.1.3, React 19.2.3, Tailwind CSS, next-themes
**Storage**: N/A (static content, no database)
**Testing**: Manual verification, Lighthouse accessibility checks
**Target Platform**: Web (all modern browsers, responsive)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Page load <2 seconds (static pages will easily meet this)
**Constraints**: Pages must be publicly accessible without authentication
**Scale/Scope**: 2 static pages + 1 footer component + layout updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | Footer component will be self-contained and reusable |
| II. App Router Patterns | PASS | Using route groups `(legal)` for public pages, Server Components by default |
| III. API Integration Discipline | N/A | No API calls needed (static content) |
| IV. Reusability & Composition | PASS | Footer links component can be reused across layouts |
| V. Type Safety | PASS | All components will have explicit TypeScript props |

**Gate Result**: PASS - No violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/005-legal-pages/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal for static pages)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── (legal)/                    # New route group for public legal pages
│   ├── layout.tsx              # Simple layout with nav back to app + footer
│   ├── privacy/
│   │   └── page.tsx            # Privacy Policy page (Server Component)
│   └── terms/
│       └── page.tsx            # Terms of Service page (Server Component)
├── (auth)/
│   └── login/
│       └── page.tsx            # Update to link to legal pages
└── (dashboard)/
    └── layout.tsx              # Update to include footer with legal links

components/
└── legal-footer.tsx            # New reusable footer component with legal links
```

**Structure Decision**: Using a `(legal)` route group to keep legal pages separate from authenticated dashboard routes. This follows the existing pattern of `(auth)` for authentication-related pages and `(dashboard)` for protected content. The legal pages require their own simple layout without sidebar/dashboard chrome.

## Complexity Tracking

> No violations - table not required.

No constitution violations to document. The implementation is straightforward static pages following established patterns.
