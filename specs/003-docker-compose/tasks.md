# Tasks: Docker Compose Development Environment

**Input**: Design documents from `/specs/003-docker-compose/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: No automated tests specified - this is infrastructure configuration. Manual verification via `docker compose up` + `bun dev`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Files at repository root (infrastructure configuration):
- `docker-compose.yml` - Docker service definitions
- `.env.example` - Environment variable documentation
- `.gitignore` - Git exclusion rules
- `docker/mediamtx/mediamtx.yml` - MediaMTX configuration

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing configuration and prepare for updates

- [X] T001 Verify Docker and Docker Compose V2 are installed (`docker compose version`)
- [X] T002 [P] Verify GHCR images are accessible (`docker pull ghcr.io/searchandrescuegg/rescuestream-api:v1.0.1`)
- [X] T003 [P] Verify GHCR MediaMTX image is accessible (`docker pull ghcr.io/searchandrescuegg/rescuestream-api-mediamtx:latest`)
- [X] T004 [P] Backup existing docker-compose.yml before modifications

**Checkpoint**: Prerequisites verified - can proceed with configuration updates

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core configuration changes that MUST be complete before ANY user story can be validated

**⚠️ CRITICAL**: No user story validation can occur until this phase is complete

- [X] T005 Verify `.gitignore` excludes `.env` but allows `.env.example` in `.gitignore`
- [X] T006 Update postgres service to use environment variable interpolation for credentials in `docker-compose.yml`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Developer Starts Local Environment (Priority: P1) 🎯 MVP

**Goal**: Enable developers to start backend services with `docker compose up` and connect frontend natively

**Independent Test**: Run `docker compose up -d`, verify all services healthy, run `bun dev`, verify frontend loads and can reach API at `http://localhost:8080`

### Implementation for User Story 1

- [X] T007 [US1] Update `api` service to use `image: ghcr.io/searchandrescuegg/rescuestream-api:v1.0.1` instead of `build: .` in `docker-compose.yml`
- [X] T008 [US1] Update `mediamtx` service to use `image: ghcr.io/searchandrescuegg/rescuestream-api-mediamtx:latest` instead of `build: ./docker/mediamtx` in `docker-compose.yml`
- [X] T009 [US1] Add health check for `api` service (HTTP check on `/health` endpoint) in `docker-compose.yml`
- [X] T010 [US1] Verify `depends_on` configuration ensures postgres is healthy before api starts in `docker-compose.yml`
- [X] T011 [US1] Verify all required ports are exposed (8080, 8081, 8554, 1935, 8888, 8889, 8189/udp, 9997, 5432) in `docker-compose.yml`
- [X] T012 [US1] Test full stack startup: `docker compose up -d && bun dev`
- [X] T013 [US1] Verify frontend can communicate with backend API at `http://localhost:8080`

**Checkpoint**: User Story 1 complete - developers can start the full stack locally

---

## Phase 4: User Story 2 - Developer Configures Backend Secrets (Priority: P1)

**Goal**: Provide comprehensive `.env.example` with documented environment variables for all services

**Independent Test**: Developer can copy `.env.example` to `.env`, fill in secrets, and backend starts with those values

### Implementation for User Story 2

- [X] T014 [P] [US2] Add backend API environment variables section with descriptions to `.env.example`
- [X] T015 [P] [US2] Add database environment variables section (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB) to `.env.example`
- [X] T016 [P] [US2] Add MediaMTX environment variables section (MTX_WEBRTCICEHOSTNAT1TO1IPS) to `.env.example`
- [X] T017 [US2] Update `docker-compose.yml` to use `${VAR:-default}` interpolation for configurable values
- [X] T018 [US2] Group variables by service with clear section headers and comments in `.env.example`
- [X] T019 [US2] Add instructions for generating secrets (e.g., `openssl rand -base64 32`) to `.env.example`
- [X] T020 [US2] Test: Copy `.env.example` to `.env`, start services, verify all environment variables are applied

**Checkpoint**: User Story 2 complete - environment configuration is fully documented

---

## Phase 5: User Story 3 - Developer Stops and Cleans Up Environment (Priority: P2)

**Goal**: Ensure graceful shutdown and optional data cleanup

**Independent Test**: Run `docker compose down` and verify all containers stop; run `docker compose down -v` and verify volumes are removed

### Implementation for User Story 3

- [X] T021 [US3] Verify `docker compose down` stops all containers gracefully
- [X] T022 [US3] Verify `docker compose down -v` removes named volumes (postgres_data)
- [X] T023 [US3] Verify services can restart cleanly after `docker compose down` (data persists)
- [X] T024 [US3] Verify fresh start works after `docker compose down -v` (clean slate)

**Checkpoint**: User Story 3 complete - lifecycle management works correctly

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final validation

- [X] T025 [P] Verify quickstart.md matches actual setup flow in `specs/003-docker-compose/quickstart.md`
- [X] T026 [P] Add troubleshooting section for common issues (port conflicts, GHCR auth) to `specs/003-docker-compose/quickstart.md`
- [X] T027 Run full end-to-end validation: fresh clone → setup → start → test → stop
- [X] T028 Verify `bun build` succeeds (constitution compliance check)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 priority and can proceed in parallel
  - US3 (P2) can proceed after US1 basics work
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P2)**: Can start after US1 is minimally working (services can start)

### Within Each User Story

- Configuration changes before testing
- Core functionality before edge cases
- Verify each change works before proceeding

### Parallel Opportunities

- **Phase 1**: T002 and T003 (image pulls) can run in parallel
- **Phase 4 (US2)**: T014, T015, T016 (env var sections) can run in parallel
- **Phase 6**: T025 and T026 (documentation) can run in parallel
- **Cross-story**: US1 and US2 can be worked on in parallel after Phase 2

---

## Parallel Example: User Story 2

```bash
# Launch all .env.example section updates together:
Task: "Add backend API environment variables section to .env.example"
Task: "Add database environment variables section to .env.example"
Task: "Add MediaMTX environment variables section to .env.example"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify prerequisites)
2. Complete Phase 2: Foundational (gitignore, base config)
3. Complete Phase 3: User Story 1 (GHCR images, health checks, ports)
4. **STOP and VALIDATE**: `docker compose up -d && bun dev` works
5. Can merge/deploy with minimal viable functionality

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test: services start → MVP ready!
3. Add User Story 2 → Test: env config documented → Better DX
4. Add User Story 3 → Test: lifecycle commands work → Complete feature
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Developer A: User Story 1 (docker-compose.yml updates)
2. Developer B: User Story 2 (.env.example documentation)
3. Both can work in parallel after Phase 2 completion

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- This is infrastructure config - verification is manual (`docker compose up`, `bun dev`)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Key files: `docker-compose.yml`, `.env.example`, `.gitignore`
