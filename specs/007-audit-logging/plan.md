# Implementation Plan: Audit Logging Dashboard

**Branch**: `007-audit-logging` | **Date**: 2026-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-audit-logging/spec.md`

## Summary

Implement an audit logging dashboard that allows administrators to view, filter, search, and paginate through system events. The feature integrates with existing RescueStream API audit endpoints (`GET /audit-logs`) and follows established codebase patterns for data tables, SWR data fetching, and navigation. Events include stream_started, user_login, user_logout, and stream key CRUD operations.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16.1.3, React 19.2.3, SWR, @tanstack/react-table, shadcn/ui, Tailwind CSS 4
**Storage**: N/A (API provides data, no frontend storage)
**Testing**: Jest + React Testing Library (if tests exist in codebase)
**Target Platform**: Web (modern browsers)
**Project Type**: Web application (frontend only - API already exists)
**Performance Goals**: Page load <2s, filter/search response <1s (per spec SC-001 through SC-004)
**Constraints**: Manual refresh only, admin-only access, 10 events per page default
**Scale/Scope**: Single new page with data table, ~5 new components, ~3 new files in lib/api

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | Self-contained components in `components/audit-logs/` |
| II. App Router Patterns | PASS | Page in `app/(dashboard)/audit-logs/`, Server Components where possible |
| III. API Integration Discipline | PASS | Centralized in `lib/api/audit-logs.ts`, typed responses |
| IV. Reusability & Composition | PASS | Follows existing data-table pattern, extracts hook |
| V. Type Safety | PASS | Explicit types in `types/api.ts`, strict mode |

**Technology Standards Compliance**:
- Framework: Next.js 16 with App Router
- Styling: Tailwind CSS
- Data Fetching: SWR for client-side
- Package Manager: bun

## Project Structure

### Documentation (this feature)

```text
specs/007-audit-logging/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-routes.md    # Frontend API route contracts
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── (dashboard)/
│   └── audit-logs/
│       └── page.tsx           # Audit logs page (Server Component wrapper)

components/
└── audit-logs/
    ├── audit-log-table.tsx    # Main table component (Client)
    ├── audit-log-columns.tsx  # Column definitions
    ├── audit-log-filters.tsx  # Filter controls (Client)
    └── audit-log-detail.tsx   # Event detail sheet (Client)

lib/
└── api/
    └── audit-logs.ts          # API client functions

hooks/
└── use-audit-logs.ts          # SWR hook for audit log data

types/
└── api.ts                     # Add AuditLogEntry, AuditLogsResponse types

app/
└── api/
    └── audit-logs/
        └── route.ts           # Next.js API route handler
```

**Structure Decision**: Frontend-only implementation following existing Next.js App Router patterns. Components in dedicated `components/audit-logs/` directory matching `components/broadcasters/` pattern. API integration via `lib/api/` centralized client.

## Complexity Tracking

> No constitution violations. Design follows established patterns.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
