# Quickstart: Local Development Environment

**Feature**: 003-docker-compose
**Date**: 2026-01-22

## Prerequisites

- **Docker Desktop** 4.x+ (includes Docker Compose V2)
  - macOS: [Download](https://docs.docker.com/desktop/install/mac-install/)
  - Windows: [Download](https://docs.docker.com/desktop/install/windows-install/) (WSL2 backend required)
  - Linux: [Download](https://docs.docker.com/desktop/install/linux-install/)
- **Bun** 1.x+ ([Install](https://bun.sh/docs/installation))
- **Git** for cloning the repository

## Quick Start (5 minutes)

### 1. Clone and Install

```bash
git clone https://github.com/searchandrescuegg/rescuestream-frontend.git
cd rescuestream-frontend
bun install
```

### 2. Configure Environment

```bash
# Copy frontend environment file
cp .env.example .env

# Edit .env with your actual values
# Required: AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_ALLOWED_DOMAINS

# (Optional) Copy backend environment file for customization
cp docker/.env.example docker/.env
# Edit docker/.env to change database credentials, ports, etc.
```

### 3. Start Backend Services

```bash
# Start PostgreSQL, API, and MediaMTX containers
docker compose up -d

# Verify services are running
docker compose ps
```

### 4. Start Frontend

```bash
# Run Next.js development server
bun dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **MediaMTX WebRTC**: http://localhost:8889

## Environment Variables Reference

### Required for Frontend

| Variable | Description | How to Get |
|----------|-------------|------------|
| `AUTH_SECRET` | Session encryption key | Run: `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Google OAuth client ID | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret | Same as above |
| `AUTH_ALLOWED_DOMAINS` | Allowed email domains | e.g., `searchandrescue.gg` |

### Backend Configuration (docker/.env)

These are pre-configured with defaults for local development. To customize, copy `docker/.env.example` to `docker/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | `postgres` | Database username |
| `POSTGRES_PASSWORD` | `postgres` | Database password |
| `POSTGRES_DB` | `rescuestream` | Database name |
| `API_SECRET` | `dev-secret-change-in-production` | HMAC auth secret |
| `MTX_WEBRTCICEHOSTNAT1TO1IPS` | `localhost` | WebRTC ICE public IP |

## Common Commands

### Service Management

```bash
# Start all services (detached)
docker compose up -d

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f api

# Stop all services
docker compose down

# Stop and remove volumes (fresh start)
docker compose down -v

# Restart a specific service
docker compose restart api
```

### Development Workflow

```bash
# Terminal 1: Backend services
docker compose up

# Terminal 2: Frontend with hot-reload
bun dev

# Check service health
docker compose ps
curl http://localhost:8080/health
```

## Troubleshooting

### Port Conflicts

If you see "port already in use" errors:

```bash
# Find what's using the port
lsof -i :8080

# Option 1: Stop the conflicting service
# Option 2: Change port in docker-compose.yml
```

### Database Connection Issues

```bash
# Check PostgreSQL is healthy
docker compose ps postgres

# Connect to database manually
docker compose exec postgres psql -U postgres -d rescuestream
```

### Container Won't Start

```bash
# Check container logs
docker compose logs api

# Rebuild if image changed
docker compose pull
docker compose up -d
```

### GHCR Authentication (if images are private)

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Then retry
docker compose pull
```

### Reset Everything

```bash
# Nuclear option: remove all containers, volumes, and images
docker compose down -v --rmi all
docker compose up -d
```

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────►│   Backend API   │────►│   PostgreSQL    │
│   (bun dev)     │     │   (container)   │     │   (container)   │
│   :3000         │     │   :8080         │     │   :5432         │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │    MediaMTX     │
                        │   (container)   │
                        │   :8889 WebRTC  │
                        └─────────────────┘
```

- **Frontend** runs natively for fast hot-reload
- **Backend services** run in Docker for consistent environment
- All services communicate via exposed ports on localhost
