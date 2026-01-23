# RescueStream Frontend

A real-time livestream monitoring dashboard for search and rescue operations. Built with Next.js 15+, featuring WebRTC/HLS video playback, broadcaster management, and stream key administration.

## Features

- **Live Stream Grid** - Monitor multiple active broadcasts in real-time with auto-refresh
- **WebRTC & HLS Playback** - Ultra-low latency WebRTC (WHEP) with automatic HLS fallback
- **Fullscreen Viewer** - Click any stream to view fullscreen with metadata overlay
- **Broadcaster Management** - Create, edit, and delete broadcaster profiles
- **Stream Key Administration** - Generate and manage RTMP stream keys
- **Google OAuth Authentication** - Secure login via Auth.js
- **Dark/Light Mode** - System-aware theme switching
- **API Health Monitoring** - Real-time backend connectivity status

## Tech Stack

- **Framework**: Next.js 15+ (App Router, Server Actions)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Tabler Icons
- **Authentication**: Auth.js (NextAuth v5) with Google OAuth
- **Video**: hls.js, native WebRTC (WHEP)
- **Data Fetching**: SWR
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.1+
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose V2
- Google OAuth credentials

### Quick Start with Docker Compose

The easiest way to run the full stack locally is with Docker Compose, which starts all backend services (PostgreSQL, API, MediaMTX streaming server).

1. **Configure backend services:**

   ```bash
   cp docker/.env.example docker/.env
   # Edit docker/.env if needed (defaults work for local development)
   ```

2. **Start backend services:**

   ```bash
   docker compose up -d
   ```

   This starts:
   - **PostgreSQL 15** on port 5432 - Database with persistent volume
   - **RescueStream API** on port 8080 - Backend API with HMAC authentication
   - **MediaMTX** on ports 1935 (RTMP), 8888 (HLS), 8889 (WebRTC) - Streaming server

3. **Configure the frontend:**

   ```bash
   cp .env.example .env
   # Edit .env with your Google OAuth credentials
   ```

4. **Install dependencies and start the frontend:**

   ```bash
   bun install
   bun dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** to view the dashboard.

### Environment Variables

#### Frontend (.env)

```bash
# Auth.js - Required
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Auth Allowlist - At least one required
AUTH_ALLOWED_DOMAINS="rescue.stream"
AUTH_ALLOWED_EMAILS=""

# RescueStream API - Defaults work with Docker Compose
RESCUESTREAM_API_URL="http://localhost:8080"
RESCUESTREAM_API_KEY="your-api-key"
RESCUESTREAM_API_SECRET="dev-secret-change-in-production"
```

#### Backend Services (docker/.env)

```bash
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=rescuestream

# API Authentication
API_SECRET=dev-secret-change-in-production

# MediaMTX WebRTC - Set to your IP for LAN/external access
MTX_WEBRTCICEHOSTNAT1TO1IPS=localhost
```

### Testing with Demo Stream

Send a test stream to verify the setup:

```bash
make demo-stream
```

This streams a test pattern to the MediaMTX RTMP endpoint. Press Ctrl+C to stop.

### Build

```bash
# Production build
bun run build

# Start production server
bun start
```

## Project Structure

```
app/
├── (auth)/              # Login page
├── (dashboard)/         # Protected dashboard pages
│   ├── streams/         # Live stream grid
│   ├── broadcasters/    # Broadcaster management
│   ├── stream-keys/     # Stream key management
│   └── help/            # Help documentation
├── api/auth/            # Auth.js route handlers
└── layout.tsx           # Root layout

components/
├── ui/                  # shadcn/ui components
├── video/               # Stream players (HLS, WebRTC, fullscreen)
├── broadcasters/        # Broadcaster table, dialogs
└── stream-keys/         # Stream key table, dialogs

lib/
├── api/                 # RescueStream API client (HMAC auth)
├── auth.ts              # Auth.js configuration
└── utils.ts             # Utilities

hooks/                   # Custom React hooks (useStreams, etc.)
types/                   # TypeScript type definitions
actions/                 # Server Actions
```

## Docker

### Development (Full Stack)

Use Docker Compose to run all backend services locally:

```bash
# Start all services (PostgreSQL, API, MediaMTX)
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Stop and remove volumes (reset database)
docker compose down -v
```

**Services and Ports:**

| Service    | Port(s)                    | Description                    |
|------------|----------------------------|--------------------------------|
| PostgreSQL | 5432                       | Database                       |
| API        | 8080 (API), 8081 (metrics) | Backend REST API               |
| MediaMTX   | 1935, 8554, 8888, 8889     | RTMP, RTSP, HLS, WebRTC        |

### Production (Frontend Only)

Build and run the frontend container:

```bash
# Build image
docker build -t rescuestream-frontend .

# Run container
docker run -p 3000:3000 \
  -e AUTH_SECRET="your-secret" \
  -e AUTH_GOOGLE_ID="your-id" \
  -e AUTH_GOOGLE_SECRET="your-secret" \
  -e AUTH_ALLOWED_DOMAINS="yourdomain.com" \
  -e RESCUESTREAM_API_URL="https://api.example.com" \
  -e RESCUESTREAM_API_KEY="your-key" \
  -e RESCUESTREAM_API_SECRET="your-secret" \
  rescuestream-frontend
```

## License

Private - Search and Rescue GG
