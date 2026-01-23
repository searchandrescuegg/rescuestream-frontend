# Feature Specification: Docker Compose Development Environment

**Feature Branch**: `003-docker-compose`
**Created**: 2026-01-22
**Status**: Draft
**Input**: User description: "We need to set up a docker compose in order to test the frontend. a .env file can be created with an example so that the go backend is able to be provided secrets"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Starts Local Environment (Priority: P1)

A developer wants to quickly spin up the backend services locally to test frontend changes against a real backend. They clone the repository, copy the example environment file, configure their secrets, start the backend containers, then run the frontend natively for optimal development experience.

**Why this priority**: This is the core value proposition - enabling developers to test the full stack locally without manual service orchestration. Without this, developers cannot efficiently test frontend-backend integration.

**Independent Test**: Can be fully tested by running `docker compose up` for backend services and `bun dev` for frontend, verifying all services are accessible and communicating.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repository, **When** the developer copies `.env.example` to `.env` and runs `docker compose up`, **Then** the backend API and MediaMTX services start successfully
2. **Given** the backend services are running, **When** the developer runs the frontend natively, **Then** they get instant hot-reload on code changes
3. **Given** all services are running, **When** the developer accesses the frontend, **Then** the frontend can communicate with the containerized backend API

---

### User Story 2 - Developer Configures Backend Secrets (Priority: P1)

A developer needs to provide secrets (API keys, OAuth credentials, database passwords) to the Go backend service. They reference the example environment file to understand what variables are required, then populate their local `.env` file with actual values.

**Why this priority**: The backend cannot function without proper secrets configuration. This is essential for authentication, API access, and database connectivity.

**Independent Test**: Can be tested by verifying the backend service starts with all required environment variables and fails gracefully with clear error messages when required variables are missing.

**Acceptance Scenarios**:

1. **Given** the `.env.example` file exists, **When** a developer reads it, **Then** they can identify all required environment variables with descriptions
2. **Given** a developer has created a `.env` file with valid secrets, **When** the backend container starts, **Then** it successfully initializes using those secrets
3. **Given** a required secret is missing from `.env`, **When** the backend attempts to start, **Then** it fails with a clear error message indicating which variable is missing

---

### User Story 3 - Developer Stops and Cleans Up Environment (Priority: P2)

A developer finishes their testing session and wants to stop all services and optionally clean up container data to free system resources.

**Why this priority**: Important for developer experience but not blocking the core testing workflow.

**Independent Test**: Can be tested by running stop/cleanup commands and verifying all containers are removed and resources freed.

**Acceptance Scenarios**:

1. **Given** services are running, **When** the developer runs `docker compose down`, **Then** all containers stop gracefully
2. **Given** containers have been running, **When** the developer wants a fresh start, **Then** they can remove volumes/data with standard docker compose commands

---

### Edge Cases

- What happens when the backend service fails to connect to external dependencies (database, external APIs)? The container should log clear errors and not cause cascading failures.
- How does the system handle port conflicts if the developer has other services running on the default ports? Standard port configuration via environment variables should be supported.
- What happens if Docker/Docker Compose is not installed or is an incompatible version? Documentation should specify minimum version requirements.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a `docker-compose.yml` file that defines the backend API and MediaMTX services (frontend runs natively outside Docker)
- **FR-002**: System MUST provide an `.env.example` file documenting all environment variables required by the backend
- **FR-003**: The `.env.example` file MUST include placeholder values and descriptions for each variable
- **FR-004**: The backend API service MUST be accessible on a configurable local port
- **FR-005**: The backend service MUST receive environment variables from the `.env` file for secrets configuration
- **FR-006**: Services MUST have health checks to indicate readiness
- **FR-007**: The docker-compose configuration MUST expose necessary ports for frontend (running natively) to connect to backend services
- **FR-008**: The `.env` file MUST be excluded from version control via `.gitignore`

### Key Entities

- **Frontend Service**: The Next.js application runs natively (outside Docker) with `bun dev`, connects to containerized backend services
- **Backend API Service**: The Go backend application container (`ghcr.io/searchandrescuegg/rescuestream-api:v1.0.1`), requires secrets via environment variables
- **MediaMTX Service**: The media streaming server container (`ghcr.io/searchandrescuegg/rescuestream-api-mediamtx:latest`), handles video stream ingestion/distribution
- **Environment Configuration**: Collection of environment variables that configure all services, split between public (can be in `.env.example` with real values) and secret (placeholder-only in `.env.example`)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new developer can start the full stack from a fresh clone in under 5 minutes (excluding Docker image download time)
- **SC-002**: All required environment variables are documented with descriptions in `.env.example`
- **SC-003**: Running `docker compose up` successfully starts backend API and MediaMTX services without manual intervention
- **SC-004**: The frontend can make successful requests to the backend API when both services are running
- **SC-005**: Developers can stop and restart services without data corruption or configuration loss

## Clarifications

### Session 2026-01-22

- Q: Where does the backend source/image come from? → A: Backend is a separate repo - reference by image name from registry
- Q: What are the container image references? → A: ghcr.io/searchandrescuegg/rescuestream-api:v1.0.1 (backend), ghcr.io/searchandrescuegg/rescuestream-api-mediamtx:latest (MediaMTX)
- Q: How should frontend code changes be reflected during development? → A: Run frontend outside Docker (native), only backend/MediaMTX in containers

## Assumptions

- Docker and Docker Compose are installed on the developer's machine (minimum versions to be documented)
- The Go backend image is pulled from a container registry (separate repository)
- The frontend Next.js application runs natively with `bun dev` (not containerized)
- Developers have access to obtain the necessary secrets (OAuth credentials, API keys) from appropriate sources
- The backend exposes its API on a standard HTTP port
