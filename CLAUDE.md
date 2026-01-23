# RescueStream Frontend Development Guidelines

Auto-generated from feature plans. Last updated: 2026-01-18

## Active Technologies
- TypeScript 5.x (strict mode enabled) + Next.js 16.1.3, next-auth 5.0.0-beta.30, Auth.js, React 19.2.3 (002-auth-allowlist)
- N/A (allowlists stored in environment variables) (002-auth-allowlist)
- Docker Compose V2 (YAML 3.x), TypeScript 5.x (frontend) + Docker, Docker Compose, ghcr.io container registry (003-docker-compose)
- PostgreSQL 15 (containerized), local volumes for persistence (003-docker-compose)
- TypeScript 5.x (strict mode) + Next.js 16.1.3, React 19.2.3 (004-app-metadata)
- N/A (static files in public folder) (004-app-metadata)
- TypeScript 5.x (strict mode) + Next.js 16.1.3, React 19.2.3, Tailwind CSS, next-themes (005-legal-pages)
- N/A (static content, no database) (005-legal-pages)
- TypeScript 5.x (strict mode enabled) + Next.js 16.1.3, React 19.2.3, Tailwind CSS 4, shadcn/ui, @tabler/icons-react, next-themes (006-simple-homepage)

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (install via `bunx --bun shadcn@latest add <component>`)
- **Icons**: @radix-ui/react-icons (Radix Icons)
- **Authentication**: Auth.js with Google OAuth
- **Video Playback**: hls.js (HLS), native WebRTC (WHEP)
- **Date Formatting**: date-fns
- **Dark Mode**: next-themes
- **Data Fetching**: SWR for client-side, Server Actions for mutations
- **Package Manager**: bun (primary)

## Project Structure

```text
app/
├── (auth)/              # Auth pages (login)
├── (dashboard)/         # Dashboard pages (streams, broadcasters, stream-keys)
├── api/auth/            # Auth.js route handlers
├── layout.tsx           # Root layout
└── globals.css          # Global styles

components/
├── ui/                  # shadcn/ui components
├── video/               # Stream player, grid, tiles
├── layout/              # Sidebar, header, theme toggle
├── broadcasters/        # Broadcaster table, dialogs
└── stream-keys/         # Stream key table, dialogs

lib/
├── api/                 # RescueStream API client (HMAC auth)
├── auth.ts              # Auth.js configuration
└── utils.ts             # Utilities (cn, etc.)

hooks/                   # Custom React hooks
types/                   # TypeScript type definitions
actions/                 # Server Actions
```

## Commands

```bash
bun dev          # Start development server
bun build        # Production build
bun lint         # Run ESLint
bun test         # Run tests
```

## Key Patterns

### Server vs Client Components
- Server Components are default (no directive needed)
- Client Components require `'use client'` directive
- Video players and interactive UI must be Client Components

### API Integration
- All API calls go through `lib/api/client.ts`
- HMAC signing is server-side only (never expose secrets)
- Use Server Actions for mutations, SWR for polling

### Component Installation
```bash
bunx --bun shadcn@latest add button dialog table input
```

## Constitution Principles

1. **Component-First**: Self-contained, reusable components
2. **App Router Patterns**: Follow Next.js 15+ conventions
3. **API Integration Discipline**: Centralized, type-safe API layer
4. **Reusability & Composition**: Extract shared hooks and utilities
5. **Type Safety**: Strict TypeScript, explicit types everywhere

## Recent Features

- 001-livestream-dashboard: Live stream grid, broadcaster/stream key management

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

## Recent Changes
- 006-simple-homepage: Added TypeScript 5.x (strict mode enabled) + Next.js 16.1.3, React 19.2.3, Tailwind CSS 4, shadcn/ui, @tabler/icons-react, next-themes
- 005-legal-pages: Added TypeScript 5.x (strict mode) + Next.js 16.1.3, React 19.2.3, Tailwind CSS, next-themes
- 004-app-metadata: Added TypeScript 5.x (strict mode) + Next.js 16.1.3, React 19.2.3
