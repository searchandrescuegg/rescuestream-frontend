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
- RescueStream API backend running
- Google OAuth credentials

### Environment Variables

Create a `.env.local` file:

```bash
# Auth.js
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# RescueStream API
RESCUESTREAM_API_URL="https://api.example.com"
RESCUESTREAM_API_KEY="your-api-key"
RESCUESTREAM_API_SECRET="your-api-secret"
```

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

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

Build and run with Docker:

```bash
# Build image
docker build -t rescuestream-frontend .

# Run container
docker run -p 3000:3000 \
  -e AUTH_SECRET="your-secret" \
  -e AUTH_GOOGLE_ID="your-id" \
  -e AUTH_GOOGLE_SECRET="your-secret" \
  -e RESCUESTREAM_API_URL="https://api.example.com" \
  -e RESCUESTREAM_API_KEY="your-key" \
  -e RESCUESTREAM_API_SECRET="your-secret" \
  rescuestream-frontend
```

## License

Private - Search and Rescue GG
