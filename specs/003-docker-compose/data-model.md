# Data Model: Docker Compose Development Environment

**Feature**: 003-docker-compose
**Date**: 2026-01-22

## Overview

This feature is infrastructure configuration, not application code. The "data model" consists of configuration entities (services, environment variables, volumes) rather than database entities.

## Configuration Entities

### Service: postgres

| Attribute | Type | Description |
|-----------|------|-------------|
| image | string | `postgres:15` |
| ports | list | `5432:5432` (host:container) |
| environment.POSTGRES_USER | string | Database username |
| environment.POSTGRES_PASSWORD | string | Database password |
| environment.POSTGRES_DB | string | Database name |
| volumes | list | Named volume for data persistence |
| healthcheck | object | `pg_isready` command |

### Service: api

| Attribute | Type | Description |
|-----------|------|-------------|
| image | string | `ghcr.io/searchandrescuegg/rescuestream-api:v1.0.1` |
| ports | list | `8080:8080` (API), `8081:8081` (metrics) |
| environment | object | See Environment Variables section |
| depends_on | list | postgres (healthy), mediamtx (started) |
| healthcheck | object | HTTP check on `/health` endpoint |

### Service: mediamtx

| Attribute | Type | Description |
|-----------|------|-------------|
| image | string | `ghcr.io/searchandrescuegg/rescuestream-api-mediamtx:latest` |
| ports | list | RTSP (8554), RTMP (1935), HLS (8888), WebRTC (8889, 8189/udp), API (9997) |
| environment | object | WebRTC ICE configuration |
| volumes | list | Bind mount for mediamtx.yml config |

## Environment Variables Schema

### Frontend Variables (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| AUTH_SECRET | Yes | - | Auth.js session encryption secret |
| AUTH_GOOGLE_ID | Yes | - | Google OAuth client ID |
| AUTH_GOOGLE_SECRET | Yes | - | Google OAuth client secret |
| AUTH_ALLOWED_DOMAINS | Yes | - | Comma-separated allowed email domains |
| AUTH_ALLOWED_EMAILS | No | "" | Comma-separated allowed email addresses |
| RESCUESTREAM_API_URL | Yes | - | Backend API base URL |
| RESCUESTREAM_API_KEY | Yes | - | API authentication key |
| RESCUESTREAM_API_SECRET | Yes | - | API authentication secret |

### Backend API Variables (docker-compose.yml)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| API_PORT | No | 8080 | API server port |
| API_SECRET | Yes | - | HMAC authentication secret |
| MEDIAMTX_API_URL | Yes | - | MediaMTX API endpoint |
| MEDIAMTX_PUBLIC_URL | Yes | - | MediaMTX public URL for clients |
| LOG_LEVEL | No | info | Logging verbosity |
| METRICS_ENABLED | No | true | Enable Prometheus metrics |
| METRICS_PORT | No | 8081 | Metrics endpoint port |
| LOCAL | No | true | Local development mode flag |

### MediaMTX Variables (docker-compose.yml)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| MTX_WEBRTCICEHOSTNAT1TO1IPS | No | - | WebRTC ICE public IP for NAT traversal |

## Volume Definitions

| Volume Name | Type | Mount Path | Description |
|-------------|------|------------|-------------|
| postgres_data | named | /var/lib/postgresql/data | PostgreSQL database files |
| mediamtx.yml | bind | /mediamtx.yml | MediaMTX server configuration |

## Network Topology (Local Development)

```
┌─────────────────────────────────────────────────────────────────┐
│ Host Machine                                                     │
│                                                                  │
│  ┌──────────────────┐                                           │
│  │ Frontend (native)│                                           │
│  │ bun dev :3000    │                                           │
│  └────────┬─────────┘                                           │
│           │                                                      │
│           │ HTTP requests                                        │
│           ▼                                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Docker Network                                              │ │
│  │                                                             │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │ │
│  │  │  postgres   │◄───│    api      │───►│  mediamtx   │    │ │
│  │  │  :5432      │    │  :8080/:8081│    │  :8889 etc  │    │ │
│  │  └─────────────┘    └─────────────┘    └─────────────┘    │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Exposed Ports: 5432, 8080, 8081, 8554, 1935, 8888, 8889,      │
│                 8189/udp, 9997                                  │
└─────────────────────────────────────────────────────────────────┘
```

## State Transitions

Not applicable - this is stateless infrastructure configuration. Service states are managed by Docker Compose (created, running, stopped, removed).
