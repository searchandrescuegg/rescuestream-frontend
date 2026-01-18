<!--
SYNC IMPACT REPORT
==================
Version change: N/A (initial) → 1.0.0
Added sections:
  - Core Principles (5 principles)
  - Technology Stack
  - Development Workflow
  - Governance

Principles defined:
  I. API-First Design
  II. Container-Ready Architecture
  III. Clean & Concise Code
  IV. Component-Based Frontend
  V. Simplicity Over Complexity

Templates requiring updates:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - No updates needed (technology-agnostic)
  ✅ tasks-template.md - No updates needed (structure-agnostic)

Follow-up TODOs: None
-->

# RescueStream Frontend Constitution

## Core Principles

### I. API-First Design

All data operations MUST flow through the backend API. The frontend:

- MUST NOT implement business logic that belongs on the server
- MUST treat the backend API as the single source of truth for all data
- MUST handle API errors gracefully with appropriate user feedback
- MUST use typed API client interfaces for all backend communication
- MUST NOT store sensitive data locally; authentication tokens are the only exception

**Rationale**: Clean separation between frontend and backend ensures maintainability,
enables independent deployment, and prevents data inconsistency.

### II. Container-Ready Architecture

The application MUST be deployable as a container at all times:

- MUST include a production-ready Dockerfile in the repository root
- MUST use environment variables for all configuration (API URLs, feature flags)
- MUST NOT rely on host-specific paths or system dependencies
- MUST produce a static build artifact that can be served by any web server
- MUST support multi-stage Docker builds to minimize image size

**Rationale**: Container-first design ensures consistent deployments across
environments and simplifies infrastructure requirements.

### III. Clean & Concise Code

Code MUST be readable and maintainable without excessive documentation:

- Functions MUST do one thing and do it well (single responsibility)
- Components MUST be under 200 lines; larger components MUST be decomposed
- MUST use descriptive naming that eliminates need for comments
- MUST NOT include dead code, commented-out code, or unused imports
- MUST follow consistent formatting enforced by automated tooling

**Rationale**: Clean code reduces cognitive load, speeds up onboarding, and
minimizes bugs from misunderstood logic.

### IV. Component-Based Frontend

UI MUST be built from reusable, isolated components:

- Components MUST have clear props interfaces with TypeScript types
- State MUST be lifted to the appropriate level; avoid prop drilling beyond 2 levels
- Side effects MUST be contained in hooks or service layers, not in render logic
- Components MUST be independently testable without requiring full app context
- MUST maintain a flat component hierarchy where possible

**Rationale**: Component isolation enables parallel development, simplifies testing,
and makes the UI predictable.

### V. Simplicity Over Complexity

Choose the simplest solution that meets requirements:

- MUST NOT add abstractions until the same pattern appears 3+ times
- MUST NOT pre-optimize; measure first, optimize second
- MUST NOT add dependencies without clear justification
- MUST prefer standard platform APIs over third-party libraries when equivalent
- MUST question any solution requiring more than 3 new files for simple features

**Rationale**: Simplicity reduces maintenance burden, speeds up development, and
makes the codebase accessible to new contributors.

## Technology Stack

The frontend application adheres to these technology constraints:

- **Framework**: React with TypeScript (strict mode enabled)
- **Build Tool**: Vite or equivalent modern bundler with hot module replacement
- **Styling**: CSS Modules, Tailwind CSS, or CSS-in-JS (team decision, but ONE approach)
- **State Management**: React Context for global state; local state for component-specific
- **API Client**: Typed fetch wrapper or established library (e.g., TanStack Query)
- **Testing**: Vitest or Jest for unit tests; Playwright or Cypress for E2E
- **Container Runtime**: Docker with multi-stage builds targeting nginx or static server

## Development Workflow

Development follows these practices:

- **Linting**: ESLint with strict TypeScript rules; no warnings allowed in CI
- **Formatting**: Prettier with project-specific config; enforced via pre-commit hooks
- **Type Safety**: `strict: true` in tsconfig; no `any` types without explicit justification
- **Branching**: Feature branches from main; PRs require passing CI checks
- **Commits**: Conventional commit format (feat/fix/docs/chore)
- **Reviews**: All changes require review; self-merge allowed for documentation-only

## Governance

This constitution supersedes informal practices and ad-hoc decisions:

- **Compliance**: All PRs MUST demonstrate adherence to Core Principles
- **Amendments**: Propose changes via PR to this file; require team consensus
- **Versioning**: Constitution follows semantic versioning (MAJOR.MINOR.PATCH)
  - MAJOR: Principle removal or incompatible redefinition
  - MINOR: New principle or section added
  - PATCH: Clarifications and wording improvements
- **Exceptions**: Temporary violations require inline `// CONSTITUTION-EXCEPTION: <reason>`
  comments and tracking issue

**Version**: 1.0.0 | **Ratified**: 2026-01-17 | **Last Amended**: 2026-01-17
