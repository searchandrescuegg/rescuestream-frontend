# Implementation Plan: Auth Allowlist Configuration

**Branch**: `002-auth-allowlist` | **Date**: 2026-01-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-auth-allowlist/spec.md`

## Summary

Add domain and email allowlist authorization to the existing Auth.js/NextAuth Google OAuth implementation. Users will only gain access to the dashboard if their email domain matches the domain allowlist OR their specific email is in the email allowlist. Authorization checks occur both at sign-in (via `signIn` callback) and on each request (via `authorized` callback). Denied users see a clear error page with instructions.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled)
**Primary Dependencies**: Next.js 16.1.3, next-auth 5.0.0-beta.30, Auth.js, React 19.2.3
**Storage**: N/A (allowlists stored in environment variables)
**Testing**: Manual testing (no test framework currently configured)
**Target Platform**: Web (Next.js App Router, Server Components + Client Components)
**Project Type**: Web application (frontend only, external Go API)
**Performance Goals**: Authorization check must complete within 2 seconds (per SC-001, SC-002)
**Constraints**: Fail-closed security (deny if allowlists empty), case-insensitive matching
**Scale/Scope**: Single-tenant, one global allowlist set

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check (Phase 0)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | Access denied page will be a self-contained component |
| II. App Router Patterns | PASS | Uses Auth.js callbacks (server-side), new page uses App Router |
| III. API Integration Discipline | N/A | No external API changes required |
| IV. Reusability & Composition | PASS | Allowlist logic extracted to `lib/auth/allowlist.ts` utility |
| V. Type Safety | PASS | All types explicitly defined, no `any` usage |

**Pre-Design Gate Status**: PASSED

### Post-Design Re-evaluation (Phase 1)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | Access denied page is Server Component, self-contained |
| II. App Router Patterns | PASS | New page at `app/(auth)/access-denied/page.tsx` follows convention |
| III. API Integration Discipline | N/A | No external API changes |
| IV. Reusability & Composition | PASS | `lib/auth/allowlist.ts` provides reusable `checkAllowlist()` function |
| V. Type Safety | PASS | Types defined in `types/auth.ts`: `AllowlistConfig`, `AuthorizationResult` |

**Post-Design Gate Status**: PASSED - Design adheres to all constitution principles

## Project Structure

### Documentation (this feature)

```text
specs/002-auth-allowlist/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
lib/
├── auth.ts              # Existing Auth.js config (MODIFY)
└── auth/
    └── allowlist.ts     # NEW: Allowlist validation utilities

app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx     # Existing login page (no changes)
│   └── access-denied/
│       └── page.tsx     # NEW: Access denied page
└── api/auth/
    └── [...nextauth]/
        └── route.ts     # Existing route handler (no changes)

types/
└── auth.ts              # NEW: Auth-related type definitions
```

**Structure Decision**: Single web application with existing Next.js App Router structure. New files added to existing `lib/` and `app/` directories following established patterns.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | - | - |
