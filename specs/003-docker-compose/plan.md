# Implementation Plan: Docker Compose Development Environment

**Branch**: `003-docker-compose` | **Date**: 2026-01-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-docker-compose/spec.md`

## Summary

Set up a Docker Compose configuration for local development that runs the backend API (`ghcr.io/searchandrescuegg/rescuestream-api:v1.0.1`) and MediaMTX (`ghcr.io/searchandrescuegg/rescuestream-api-mediamtx:latest`) services in containers, while the frontend runs natively with `bun dev`. Includes a documented `.env.example` for backend secrets configuration.

## Technical Context

**Language/Version**: Docker Compose V2 (YAML 3.x), TypeScript 5.x (frontend)
**Primary Dependencies**: Docker, Docker Compose, ghcr.io container registry
**Storage**: PostgreSQL 15 (containerized), local volumes for persistence
**Testing**: Manual verification via `docker compose up` + `bun dev`
**Target Platform**: Developer workstation (macOS, Linux, Windows with WSL2)
**Project Type**: Web application (frontend runs natively, backend services containerized)
**Performance Goals**: Services start within 30 seconds, frontend connects to API immediately
**Constraints**: Must use pre-built images from GHCR, no local backend builds
**Scale/Scope**: Single developer local environment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | N/A | Infrastructure config, not UI components |
| II. App Router Patterns | N/A | Infrastructure config, not routing |
| III. API Integration Discipline | PASS | Frontend will connect to containerized backend API via environment variables |
| IV. Reusability & Composition | PASS | Docker Compose config is reusable across developer machines |
| V. Type Safety | N/A | Infrastructure config (YAML), not TypeScript |

**Technology Standards Check**:
- Package Manager: bun (confirmed in spec)
- External API: Go-based backend (runs in container)

**Development Workflow Check**:
- Feature branch: `003-docker-compose` (compliant)
- Build must succeed before merge (will verify)

**Result**: PASS - No violations. This feature is primarily infrastructure configuration that enables the development workflow defined in the constitution.

## Project Structure

### Documentation (this feature)

```text
specs/003-docker-compose/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal - configuration entities)
├── quickstart.md        # Phase 1 output (developer setup guide)
├── contracts/           # Phase 1 output (N/A - no API contracts for infra)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
# Existing structure (no changes to app code)
app/                     # Next.js App Router pages
components/              # React components
lib/                     # Utilities and API client
hooks/                   # Custom React hooks
types/                   # TypeScript definitions

# Docker configuration (updates required)
docker-compose.yml       # UPDATE: Switch to GHCR images
.env.example             # UPDATE: Add backend service variables
.gitignore               # VERIFY: .env excluded (already present)
docker/                  # Existing MediaMTX config
└── mediamtx/
    └── mediamtx.yml     # MediaMTX configuration
```

**Structure Decision**: This is an infrastructure feature modifying existing configuration files at the repository root. No new source directories needed.

## Complexity Tracking

> No Constitution Check violations to justify.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | - | - |
