# Research: Livestream Dashboard

**Date**: 2026-01-18
**Feature**: 001-livestream-dashboard

## Technical Decisions

### 1. Authentication Strategy

**Decision**: Auth.js with Google OAuth provider

**Rationale**:
- User specified Google OAuth as the starting authentication method
- Auth.js (formerly NextAuth.js) is the standard authentication library for Next.js
- Supports Next.js 15+ App Router with route handlers
- Session management works seamlessly with Server Components and Server Actions
- Easy to extend with additional providers later

**Alternatives Considered**:
- Clerk: More features but external service dependency
- Custom JWT: More control but significantly more implementation effort
- No auth: Ruled out by user requirements (Auth.js specified)

**Implementation Notes**:
- Use `@auth/nextjs-adapter` for Next.js 15+ compatibility
- Configure Google OAuth credentials via environment variables
- Protect dashboard routes via middleware
- Session available in both Server and Client Components

---

### 2. Video Playback: HLS vs WebRTC

**Decision**: Dual protocol support - WebRTC primary, HLS fallback

**Rationale**:
- Clarified in spec: "WebRTC preferred, HLS fallback"
- WebRTC provides lowest latency (~500ms) for real-time monitoring
- HLS provides broad browser compatibility when WebRTC fails
- MediaMTX supports both protocols natively with ready URLs

**Alternatives Considered**:
- HLS only: Simpler but higher latency (5-30 seconds typical)
- WebRTC only: Lowest latency but requires signaling, may fail in some network conditions
- RTMP: Not browser-native, would require Flash or transcoding

**Implementation Notes**:
- Use `hls.js` library for HLS playback (handles non-Safari browsers)
- Native WebRTC API for WHEP (WebRTC-HTTP Egress Protocol)
- Player component attempts WebRTC first, falls back to HLS on error
- API returns both `urls.hls` and `urls.webrtc` for each stream

---

### 3. API Client Architecture

**Decision**: Server-side HMAC-authenticated client with Server Actions

**Rationale**:
- HMAC-SHA256 signing requires secret key (must never be exposed to client)
- Server Actions provide clean interface for mutations from Client Components
- API client singleton pattern prevents credential exposure
- Aligns with Next.js 15+ patterns and constitution principle III

**Alternatives Considered**:
- Client-side API calls: Would expose HMAC secret - security risk
- API routes only: Works but Server Actions are more ergonomic for forms
- tRPC: Overkill for REST API integration

**Implementation Notes**:
- API client in `lib/api/client.ts` handles HMAC signature generation
- Environment variables: `RESCUESTREAM_API_URL`, `RESCUESTREAM_API_KEY`, `RESCUESTREAM_API_SECRET`
- Server Actions in `actions/` directory for CRUD operations
- SWR or polling for client-side data freshness (streams list)

---

### 4. Dark Mode Implementation

**Decision**: `next-themes` with system preference detection and manual toggle

**Rationale**:
- Clarified in spec: respect system preference, provide visible toggle, persist preference
- `next-themes` is the standard solution for Next.js App Router
- Works with Tailwind CSS dark mode classes
- shadcn/ui components are dark-mode ready

**Alternatives Considered**:
- Custom CSS variables with `prefers-color-scheme`: Manual persistence handling
- Tailwind `darkMode: 'class'` alone: No system preference detection
- React Context only: Doesn't handle SSR/hydration properly

**Implementation Notes**:
- ThemeProvider wraps app in root layout
- Theme preference stored in localStorage via next-themes
- Toggle component using Radix icons (sun/moon)
- CSS variables for theme colors in `globals.css`

---

### 5. Data Table Implementation

**Decision**: shadcn/ui DataTable with TanStack Table

**Rationale**:
- User specified shadcn/ui for UI components
- shadcn/ui DataTable is built on TanStack Table (formerly React Table)
- Supports sorting, filtering, pagination out of the box
- Consistent with other shadcn/ui components

**Alternatives Considered**:
- AG Grid: Powerful but heavy, overkill for simple CRUD tables
- Custom table: More work, less features
- Radix Table: Lower-level, would need more implementation

**Implementation Notes**:
- Install via `bunx --bun shadcn@latest add table`
- Column definitions in separate files for maintainability
- Row actions (edit, delete) via dropdown menus
- Dialog forms for create/edit operations

---

### 6. Adaptive Grid Layout

**Decision**: CSS Grid with dynamic column calculation

**Rationale**:
- Spec requires: 1 stream = full, 4 = 2x2, 9 = 3x3 max
- CSS Grid provides native responsive behavior
- Simple algorithm: `columns = Math.ceil(Math.sqrt(count))`
- Tailwind's grid utilities work well

**Alternatives Considered**:
- Flexbox: Harder to maintain aspect ratios and equal sizing
- CSS Container Queries: Good but grid is simpler for this use case
- Third-party grid library: Unnecessary complexity

**Implementation Notes**:
- Grid container fills viewport minus sidebar
- `grid-template-columns: repeat(N, 1fr)` where N is calculated
- Video tiles maintain 16:9 aspect ratio via `aspect-video`
- Pagination when stream count exceeds 9

---

### 7. Date/Time Formatting

**Decision**: `date-fns` with `formatDistanceToNow`

**Rationale**:
- User specified date-fns for humanized durations
- Lightweight, tree-shakeable library
- `formatDistanceToNow` produces "5 minutes ago" style output
- Better than `Intl.RelativeTimeFormat` for custom formatting

**Alternatives Considered**:
- dayjs: Similar but date-fns more common in React ecosystem
- moment: Deprecated and heavy
- Native Intl: Less readable output, more manual formatting

**Implementation Notes**:
- Import only needed functions: `formatDistanceToNow`, `format`
- Update stream duration display every minute (for recent) or less frequently (for older)
- Handle timezone consistently (UTC from API, local for display)

---

### 8. Icon Library

**Decision**: @radix-ui/react-icons (Radix Icons)

**Rationale**:
- User explicitly specified "Radix icons everywhere"
- Integrates seamlessly with shadcn/ui (which uses Radix primitives)
- Consistent icon style across the application
- Tree-shakeable, only imports used icons

**Alternatives Considered**:
- Lucide: Also good, often used with shadcn/ui
- Heroicons: Different style
- Custom SVGs: More work, inconsistent

**Implementation Notes**:
- Import icons directly: `import { PlayIcon, StopIcon } from '@radix-ui/react-icons'`
- Use for navigation, actions, status indicators
- Size via `className` (e.g., `h-4 w-4`)

---

## Dependency Summary

| Package | Purpose | Install Command |
|---------|---------|-----------------|
| next | Framework | (already installed) |
| next-auth | Authentication | `bun add next-auth@beta` |
| @auth/core | Auth.js core | `bun add @auth/core` |
| next-themes | Dark mode | `bun add next-themes` |
| hls.js | HLS playback | `bun add hls.js` |
| date-fns | Date formatting | `bun add date-fns` |
| @radix-ui/react-icons | Icons | `bun add @radix-ui/react-icons` |
| @tanstack/react-table | Data tables | (via shadcn/ui table) |
| swr | Client-side data fetching | `bun add swr` |

**shadcn/ui Components** (install as needed):
```bash
bunx --bun shadcn@latest add button
bunx --bun shadcn@latest add dialog
bunx --bun shadcn@latest add table
bunx --bun shadcn@latest add input
bunx --bun shadcn@latest add label
bunx --bun shadcn@latest add dropdown-menu
bunx --bun shadcn@latest add badge
bunx --bun shadcn@latest add card
bunx --bun shadcn@latest add toast
bunx --bun shadcn@latest add skeleton
bunx --bun shadcn@latest add pagination
bunx --bun shadcn@latest add tooltip
bunx --bun shadcn@latest add alert-dialog
bunx --bun shadcn@latest add separator
bunx --bun shadcn@latest add avatar
```

---

## Environment Variables

```env
# RescueStream API
RESCUESTREAM_API_URL=http://localhost:8080
RESCUESTREAM_API_KEY=admin
RESCUESTREAM_API_SECRET=your-secret-here

# Auth.js
AUTH_SECRET=generate-a-random-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Open Questions Resolved

| Question | Resolution |
|----------|------------|
| Video protocol? | WebRTC primary, HLS fallback |
| Auth method? | Auth.js with Google OAuth |
| API authentication? | HMAC-SHA256 (server-side only) |
| Dark mode? | next-themes with system preference |
| Data tables? | shadcn/ui DataTable |
| Icons? | @radix-ui/react-icons |
| Date formatting? | date-fns |

**All technical decisions resolved. Ready for Phase 1.**
