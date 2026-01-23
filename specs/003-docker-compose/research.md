# Research: Docker Compose Development Environment

**Feature**: 003-docker-compose
**Date**: 2026-01-22

## Research Tasks

### 1. Current Docker Compose State Analysis

**Question**: What is the current state of docker-compose.yml and what needs to change?

**Findings**:
The repository already has a `docker-compose.yml` with:
- PostgreSQL 15 service (working)
- API service using `build: .` (needs to change to GHCR image)
- MediaMTX service using `build: ./docker/mediamtx` (needs to change to GHCR image)

**Decision**: Update existing `docker-compose.yml` to use pre-built GHCR images instead of local builds.

**Rationale**:
- Spec clarification requires using `ghcr.io/searchandrescuegg/rescuestream-api:v1.0.1` and `ghcr.io/searchandrescuegg/rescuestream-api-mediamtx:latest`
- Pre-built images reduce setup time and ensure consistent environments
- Frontend developers don't need backend build dependencies

**Alternatives Considered**:
- Keep local build approach: Rejected - adds complexity, requires backend source
- Create separate docker-compose.dev.yml: Rejected - unnecessary complexity for single use case

### 2. Environment Variables Configuration

**Question**: What environment variables does the backend API require?

**Findings**:
From existing docker-compose.yml, the API service requires:
- `DATABASE_URL`: PostgreSQL connection string
- `API_PORT`: API server port (8080)
- `API_SECRET`: HMAC authentication secret
- `MEDIAMTX_API_URL`: MediaMTX API endpoint
- `MEDIAMTX_PUBLIC_URL`: MediaMTX public URL for clients
- `LOG_LEVEL`: Logging verbosity
- `METRICS_ENABLED`, `METRICS_PORT`: Prometheus metrics
- `LOCAL`: Flag for local development mode
- `TRACING_*`: OpenTelemetry tracing configuration

From existing .env.example (frontend):
- `AUTH_SECRET`: Auth.js session secret
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`: OAuth credentials
- `AUTH_ALLOWED_DOMAINS`, `AUTH_ALLOWED_EMAILS`: Allowlist config
- `RESCUESTREAM_API_URL`: Backend API URL
- `RESCUESTREAM_API_KEY`, `RESCUESTREAM_API_SECRET`: API authentication

**Decision**: Create a comprehensive `.env.example` that includes both frontend and backend environment variables with clear documentation.

**Rationale**: Single source of truth for all configuration needed to run the full stack locally.

**Alternatives Considered**:
- Separate `.env.backend.example` and `.env.frontend.example`: Rejected - adds complexity
- Hardcode non-sensitive values in docker-compose.yml: Partially adopted for database defaults

### 3. Service Dependencies and Health Checks

**Question**: What service dependencies and health checks are needed?

**Findings**:
Current dependencies:
- API depends on: postgres (healthy), mediamtx (started)
- PostgreSQL has health check via `pg_isready`
- MediaMTX has no health check

**Decision**:
- Keep PostgreSQL health check
- API waits for postgres healthy before starting
- MediaMTX starts independently (no external dependencies)
- Add health check for API service

**Rationale**: Ensures services start in correct order and are actually ready to accept connections.

**Alternatives Considered**:
- No health checks: Rejected - race conditions on startup
- Health checks for all services: Adopted where feasible

### 4. Port Mappings

**Question**: What ports need to be exposed for frontend connectivity?

**Findings**:
Required ports for frontend:
- `8080`: API HTTP endpoint (primary)
- `8081`: Metrics endpoint (optional, for debugging)
- `8889`: WebRTC HTTP (for video streaming)
- `8888`: HLS endpoint (for video streaming)

MediaMTX ports:
- `8554`: RTSP
- `1935`: RTMP ingestion
- `8888`: HLS
- `8889`: WebRTC HTTP
- `8189/udp`: WebRTC ICE/UDP
- `9997`: MediaMTX API

PostgreSQL:
- `5432`: Database (optional expose for debugging)

**Decision**: Expose all ports with environment variable overrides for conflict resolution.

**Rationale**: Enables frontend to connect to all backend services, allows port customization if defaults conflict.

### 5. Volume Persistence

**Question**: What data needs to persist across container restarts?

**Findings**:
- PostgreSQL data: Named volume `postgres_data`
- MediaMTX config: Bind mount from `./docker/mediamtx/mediamtx.yml`

**Decision**: Keep existing volume configuration.

**Rationale**: Database persistence prevents data loss during development; MediaMTX config allows local customization.

### 6. GHCR Authentication

**Question**: Do the GHCR images require authentication to pull?

**Findings**:
- Images are under `ghcr.io/searchandrescuegg/` organization
- If images are private, developers need `docker login ghcr.io` with PAT

**Decision**: Document authentication requirement in quickstart.md if images are private. Assume public for MVP.

**Rationale**: Most open-source projects use public images; private images add onboarding friction.

**Alternatives Considered**:
- Require all developers to have GHCR access: May be needed if images are private
- Mirror to Docker Hub: Adds maintenance burden

## Summary of Changes Required

1. **docker-compose.yml**:
   - Change `api` service from `build: .` to `image: ghcr.io/searchandrescuegg/rescuestream-api:v1.0.1`
   - Change `mediamtx` service from `build: ./docker/mediamtx` to `image: ghcr.io/searchandrescuegg/rescuestream-api-mediamtx:latest`
   - Add health check for API service
   - Add environment variable interpolation for configurable ports

2. **.env.example**:
   - Add backend service configuration variables
   - Add clear documentation/comments for each variable
   - Group by service (frontend, backend API, database, MediaMTX)

3. **.gitignore**:
   - Verify `.env*` pattern excludes `.env` but allows `.env.example` (already correct)

4. **quickstart.md** (new):
   - Step-by-step setup instructions
   - GHCR authentication if needed
   - Common troubleshooting tips
