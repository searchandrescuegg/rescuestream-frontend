# Implementation Plan: Livestream Dashboard

**Branch**: `001-livestream-dashboard` | **Date**: 2026-01-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-livestream-dashboard/spec.md`

## Summary

Build a Next.js 15+ livestream monitoring dashboard that displays multiple video streams in an adaptive tiled grid (1-9 streams per page), with broadcaster and stream key management via data tables. The application integrates with the RescueStream Go API using HMAC-SHA256 authentication, supports HLS/WebRTC video playback, and includes full dark mode support with system preference detection.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15+ (App Router)
**Primary Dependencies**:
- Next.js 15+ (App Router, Server Actions)
- Auth.js (Google OAuth authentication)
- Tailwind CSS (styling)
- shadcn/ui (component library, installed via `bunx --bun shadcn@latest add <component>`)
- @radix-ui/react-icons (iconography)
- hls.js (HLS video playback)
- date-fns (humanized date/time formatting)
- next-themes (dark mode with system preference)

**Storage**: N/A (data persisted in external RescueStream API)
**Testing**: Jest + React Testing Library (unit/integration), Playwright (E2E if needed)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (Next.js frontend only)
**Performance Goals**:
- Page load < 3 seconds
- Stream status updates within 5 seconds
- Navigation < 500ms
- Data table operations < 300ms (95th percentile)

**Constraints**:
- Video tiles: minimal chrome (borders < 2px, no shadows)
- Max 9 streams per grid page with pagination
- HMAC-SHA256 API authentication (server-side only)
- WebRTC preferred, HLS fallback for video playback

**Scale/Scope**: Single operator dashboard, ~10-50 concurrent streams typical

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Implementation Approach |
|-----------|--------|------------------------|
| I. Component-First Architecture | ✅ PASS | Video player, stream tile, grid, data tables, dialogs as isolated components in `components/` |
| II. App Router Patterns | ✅ PASS | Server Components default, Client Components for video players and interactive UI, Server Actions for API mutations |
| III. API Integration Discipline | ✅ PASS | Centralized API client in `lib/api/`, typed responses in `types/`, HMAC signing server-side only |
| IV. Reusability & Composition | ✅ PASS | Shared hooks (`useStreams`, `useBroadcasters`), UI primitives from shadcn/ui, custom hooks in `hooks/` |
| V. Type Safety | ✅ PASS | Strict TypeScript, explicit types for all API responses, component props, and hooks |

**All gates pass. Proceeding to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/001-livestream-dashboard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API integration contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx           # Login page
│   └── layout.tsx             # Auth layout (no sidebar)
├── (dashboard)/
│   ├── layout.tsx             # Dashboard layout with sidebar
│   ├── page.tsx               # Redirect to /streams or landing
│   ├── streams/
│   │   └── page.tsx           # Live stream grid (P1)
│   ├── broadcasters/
│   │   └── page.tsx           # Broadcaster management table (P2)
│   └── stream-keys/
│       └── page.tsx           # Stream key management table (P2)
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts       # Auth.js route handler
├── layout.tsx                 # Root layout (theme provider, fonts)
├── globals.css                # Tailwind imports, CSS variables
└── error.tsx                  # Global error boundary

components/
├── ui/                        # shadcn/ui components (button, dialog, table, etc.)
├── video/
│   ├── stream-player.tsx      # HLS/WebRTC player with protocol switching
│   ├── stream-tile.tsx        # Single stream tile with metadata overlay
│   ├── stream-grid.tsx        # Adaptive grid container (1-9 tiles)
│   ├── stream-status.tsx      # LIVE/OFFLINE badge
│   └── fullscreen-player.tsx  # Fullscreen stream view with enhanced metadata
├── layout/
│   ├── sidebar.tsx            # Left navigation menu
│   ├── header.tsx             # Top header with theme toggle
│   └── theme-toggle.tsx       # Dark/light mode switcher
├── broadcasters/
│   ├── broadcaster-table.tsx  # Data table for broadcasters
│   ├── broadcaster-dialog.tsx # Create/edit broadcaster dialog
│   └── broadcaster-columns.tsx # Table column definitions
└── stream-keys/
    ├── stream-key-table.tsx   # Data table for stream keys
    ├── stream-key-dialog.tsx  # Generate stream key dialog
    └── stream-key-columns.tsx # Table column definitions

lib/
├── api/
│   ├── client.ts              # RescueStream API client with HMAC signing
│   ├── broadcasters.ts        # Broadcaster API functions
│   ├── stream-keys.ts         # Stream key API functions
│   └── streams.ts             # Streams API functions
├── auth.ts                    # Auth.js configuration
└── utils.ts                   # Utility functions (cn, etc.)

hooks/
├── use-streams.ts             # Stream data fetching with polling
├── use-broadcasters.ts        # Broadcaster data fetching
├── use-stream-keys.ts         # Stream key data fetching
└── use-media-query.ts         # Responsive breakpoint detection

types/
├── api.ts                     # API response types (Broadcaster, StreamKey, Stream)
└── index.ts                   # Re-exports

actions/
├── broadcasters.ts            # Server actions for broadcaster CRUD
└── stream-keys.ts             # Server actions for stream key management
```

**Structure Decision**: Next.js 15+ App Router structure with route groups for auth and dashboard separation. Components organized by feature domain (video, layout, broadcasters, stream-keys) with shared UI primitives from shadcn/ui.

## Complexity Tracking

> No constitution violations. All patterns align with established principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
