<!--
Sync Impact Report
==================
Version change: (template) → 1.0.0
Bump rationale: Initial ratification - first concrete governance framework for the project

Modified principles:
- [PRINCIPLE_1_NAME] → I. Component-First Architecture
- [PRINCIPLE_2_NAME] → II. App Router Patterns
- [PRINCIPLE_3_NAME] → III. API Integration Discipline
- [PRINCIPLE_4_NAME] → IV. Reusability & Composition
- [PRINCIPLE_5_NAME] → V. Type Safety

Added sections:
- Technology Standards (concrete stack definition)
- Development Workflow (PR and review process)
- Full governance rules with amendment procedures

Removed sections:
- [SECTION_2_NAME] placeholder
- [SECTION_3_NAME] placeholder
- All template comments and example references

Templates requiring updates:
- ✅ plan-template.md - Compatible (Constitution Check section will use new principles)
- ✅ spec-template.md - Compatible (no constitution-specific references)
- ✅ tasks-template.md - Compatible (structure aligns with component-first approach)
- ✅ checklist-template.md - Compatible (generic structure)
- ✅ agent-file-template.md - Compatible (will extract from future plans)

Follow-up TODOs: None
-->

# RescueStream Frontend Constitution

## Core Principles

### I. Component-First Architecture

All UI functionality MUST be implemented as self-contained, reusable React components.

- Components MUST have a single, clear responsibility
- Components MUST be independently testable without requiring full application context
- Shared components MUST reside in `components/` with logical subdirectories (e.g., `components/ui/`, `components/video/`, `components/dashboard/`)
- Feature-specific components MAY reside alongside their route in `app/` only if not reused elsewhere
- Props MUST be explicitly typed; implicit `any` is forbidden

**Rationale**: A livestreaming dashboard displays multiple video feeds and controls. Component isolation ensures each video player, control panel, or status indicator can be developed, tested, and maintained independently.

### II. App Router Patterns

All routing and data fetching MUST conform to Next.js 15+ App Router conventions.

- Server Components are the default; Client Components MUST be explicitly marked with `'use client'`
- Data fetching SHOULD occur in Server Components or via React Server Actions where possible
- Client-side data fetching MUST use React hooks (`useEffect`, `useSWR`, or React Query) with proper loading and error states
- Route segments MUST use the `app/` directory structure (e.g., `app/dashboard/page.tsx`)
- Layouts (`layout.tsx`) MUST be used for shared UI across route segments
- Loading states (`loading.tsx`) and error boundaries (`error.tsx`) SHOULD be defined per route segment

**Rationale**: Next.js 15 App Router provides optimized streaming, caching, and rendering. Following these patterns ensures performance and maintainability for real-time video dashboard experiences.

### III. API Integration Discipline

All communication with the external Go API MUST follow a structured, type-safe approach.

- API calls MUST be centralized in `lib/api/` or `services/` directory
- All request/response types MUST be defined in `types/` and kept in sync with Go API contracts
- API functions MUST handle errors gracefully and return typed results (not throw by default in client code)
- Sensitive configuration (API URLs, keys) MUST use environment variables (`NEXT_PUBLIC_*` for client, server-only otherwise)
- API responses MUST be validated or coerced to expected types before use

**Rationale**: A frontend depending on a third-party Go API requires strict contracts. Centralized, typed API layers prevent runtime errors and simplify debugging when API behavior changes.

### IV. Reusability & Composition

Code MUST be structured for maximum reuse and minimal duplication.

- Shared logic MUST be extracted into custom hooks in `hooks/`
- Utility functions MUST reside in `lib/` or `utils/`
- UI primitives (buttons, inputs, modals) MUST be generic and accept composition via props or children
- Avoid creating single-use abstractions; duplication is acceptable for 1-2 occurrences
- When extracting shared code, ensure it has a clear, documented interface

**Rationale**: A dashboard with multiple video streams will have repeated patterns (player controls, status badges, refresh logic). Thoughtful extraction reduces bugs and accelerates feature development.

### V. Type Safety

TypeScript MUST be used throughout with strict configuration.

- `strict: true` MUST be enabled in `tsconfig.json`
- Explicit `any` MUST be avoided; use `unknown` with type guards when type is genuinely unknown
- All component props, hook parameters, and API responses MUST have explicit types
- Type definitions SHOULD be co-located with usage or centralized in `types/` for shared entities

**Rationale**: Type safety catches errors at compile time, provides IDE support, and documents code intent—critical for a complex dashboard handling real-time video data.

## Technology Standards

**Framework**: Next.js 15+ with App Router
**Language**: TypeScript (strict mode)
**Styling**: Tailwind CSS (preferred) or CSS Modules
**State Management**: React built-in state, Context API, or lightweight libraries (Zustand acceptable)
**Data Fetching**: Server Components, React Server Actions, or SWR/React Query for client-side
**External API**: Go-based backend (treated as third-party service)
**Package Manager**: bun (primary), npm/yarn acceptable
**Testing**: Jest + React Testing Library (unit/integration), Playwright (E2E if needed)

## Development Workflow

- All feature work MUST occur on a named branch (e.g., `###-feature-name`)
- Pull requests MUST include a clear description of changes
- Code reviews SHOULD verify compliance with constitution principles
- Linting (`eslint`) and formatting (`prettier` if configured) MUST pass before merge
- Build MUST succeed (`next build`) before merge to main branch

## Governance

This constitution supersedes conflicting practices. All development decisions MUST align with these principles.

**Amendment Process**:
1. Propose changes via pull request to this file
2. Changes MUST include rationale and impact assessment
3. Breaking changes (principle removal/redefinition) require explicit team acknowledgment
4. Version MUST be incremented per semantic versioning rules

**Versioning Policy**:
- MAJOR: Backward-incompatible governance changes (principle removal, fundamental redefinition)
- MINOR: New principles added, existing guidance materially expanded
- PATCH: Clarifications, typo fixes, non-semantic refinements

**Compliance Review**:
- PR reviews SHOULD include a constitution compliance check
- Violations MUST be documented and justified in the Complexity Tracking section of plan.md

**Version**: 1.0.0 | **Ratified**: 2026-01-18 | **Last Amended**: 2026-01-18
