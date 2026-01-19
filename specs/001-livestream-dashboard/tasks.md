# Tasks: Livestream Dashboard

**Input**: Design documents from `/specs/001-livestream-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `app/`, `components/`, `lib/`, `hooks/`, `types/`, `actions/`
- Paths shown below use repository root as base

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Project initialization, dependency installation, and base configuration

- [x] T001 Install core dependencies: `bun add next-auth@beta @auth/core next-themes hls.js date-fns @radix-ui/react-icons swr`
- [x] T002 [P] Install shadcn/ui components: `bunx --bun shadcn@latest add button dialog table input label dropdown-menu badge card toast skeleton pagination tooltip alert-dialog separator avatar`
- [x] T003 [P] Create environment variables template in `.env.example` with RESCUESTREAM_API_URL, RESCUESTREAM_API_KEY, RESCUESTREAM_API_SECRET, AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
- [x] T004 [P] Define API types (Broadcaster, StreamKey, Stream, APIError) in `types/api.ts`
- [x] T005 [P] Define UI state types (StreamGridState, TableState) in `types/ui.ts`
- [x] T006 Create type re-exports in `types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Implement RescueStream API client with HMAC-SHA256 signing in `lib/api/client.ts`
- [x] T008 [P] Implement streams API functions (listStreams, getStream) in `lib/api/streams.ts`
- [x] T009 [P] Implement broadcasters API functions (list, get, create, update, delete) in `lib/api/broadcasters.ts`
- [x] T010 [P] Implement stream-keys API functions (list, get, create, revoke) in `lib/api/stream-keys.ts`
- [x] T011 Configure Auth.js with Google OAuth provider in `lib/auth.ts`
- [x] T012 [P] Create Auth.js route handler in `app/api/auth/[...nextauth]/route.ts`
- [x] T013 [P] Create utility functions (cn for classnames) in `lib/utils.ts`
- [x] T014 Configure next-themes ThemeProvider in `app/layout.tsx` with system preference detection
- [x] T015 [P] Add dark mode CSS variables and Tailwind configuration in `app/globals.css`
- [x] T016 Create global error boundary in `app/error.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 + 2 - View Live Streams with Status (Priority: P1)

**Goal**: Display multiple live video streams in an adaptive tiled grid with LIVE/OFFLINE status indicators

**Independent Test**: Load dashboard with active streams, verify grid displays correctly with status badges and broadcaster metadata

### Implementation for US1 + US2

- [x] T017 [P] [US1] Create HLS video player component with hls.js in `components/video/hls-player.tsx`
- [x] T018 [P] [US1] Create WebRTC WHEP player component in `components/video/webrtc-player.tsx`
- [x] T019 [US1] Create unified stream player with protocol switching (WebRTC first, HLS fallback) in `components/video/stream-player.tsx`
- [x] T020 [P] [US2] Create stream status badge component (LIVE/OFFLINE) with Radix icons in `components/video/stream-status.tsx`
- [x] T021 [US1] Create stream tile component with metadata overlay (broadcaster name, duration via date-fns) in `components/video/stream-tile.tsx`
- [x] T022 [US1] Create adaptive stream grid component (1=full, 4=2x2, 9=3x3) with pagination in `components/video/stream-grid.tsx`
- [x] T023 [P] [US1] Create useStreams hook with SWR polling (5s interval) in `hooks/use-streams.ts`
- [x] T024 [P] [US1] Create API route for streams (proxies to RescueStream API) in `app/api/streams/route.ts`
- [x] T025 [US1] Create streams page with grid layout in `app/(dashboard)/streams/page.tsx`
- [x] T026 [US1] Add empty state for no active streams in stream grid component
- [x] T027 [US2] Add loading skeleton state to stream tiles in `components/video/stream-tile.tsx`

**Checkpoint**: Stream grid functional with live/offline status - core MVP complete

---

## Phase 4: User Story 3 - Fullscreen Single Stream (Priority: P2)

**Goal**: Click stream tile to enter fullscreen view with enhanced metadata, Escape to return

**Independent Test**: Click any stream tile, verify fullscreen mode with metadata, press Escape to return to grid

### Implementation for US3

- [x] T028 [US3] Create fullscreen player component with enhanced metadata display in `components/video/fullscreen-player.tsx`
- [x] T029 [US3] Add fullscreen state management and click handler to stream-grid.tsx
- [x] T030 [US3] Implement Escape key handler and close button for fullscreen exit
- [x] T031 [US3] Add stream duration display with date-fns formatDistanceToNow in fullscreen view

**Checkpoint**: Fullscreen mode functional - users can focus on individual streams

---

## Phase 5: User Story 4 - Manage Broadcasters (Priority: P2)

**Goal**: CRUD operations for broadcasters via data table with dialogs

**Independent Test**: Navigate to /broadcasters, create/edit/delete broadcasters, verify persistence

### Implementation for US4

- [x] T032 [P] [US4] Create broadcaster server actions (create, update, delete) in `actions/broadcasters.ts`
- [x] T033 [P] [US4] Create useBroadcasters hook with SWR in `hooks/use-broadcasters.ts`
- [x] T034 [P] [US4] Create API route for broadcasters in `app/api/broadcasters/route.ts`
- [x] T035 [US4] Define broadcaster table column definitions with Radix icons in `components/broadcasters/broadcaster-columns.tsx`
- [x] T036 [US4] Create broadcaster data table component with sorting/filtering in `components/broadcasters/broadcaster-table.tsx`
- [x] T037 [US4] Create broadcaster create/edit dialog form in `components/broadcasters/broadcaster-dialog.tsx`
- [x] T038 [US4] Create broadcasters page in `app/(dashboard)/broadcasters/page.tsx`
- [x] T039 [US4] Add delete confirmation dialog with alert-dialog component
- [x] T040 [US4] Add toast notifications for CRUD success/error feedback

**Checkpoint**: Broadcaster management complete - admins can manage who can stream

---

## Phase 6: User Story 5 - Manage Stream Keys (Priority: P2)

**Goal**: Generate, view, copy, and revoke stream keys via data table

**Independent Test**: Navigate to /stream-keys, generate new key, copy to clipboard, revoke key

### Implementation for US5

- [x] T041 [P] [US5] Create stream-key server actions (create, revoke) in `actions/stream-keys.ts`
- [x] T042 [P] [US5] Create useStreamKeys hook with SWR in `hooks/use-stream-keys.ts`
- [x] T043 [P] [US5] Create API route for stream-keys in `app/api/stream-keys/route.ts`
- [x] T044 [US5] Define stream-key table column definitions (status badge, broadcaster name) in `components/stream-keys/stream-key-columns.tsx`
- [x] T045 [US5] Create stream-key data table component in `components/stream-keys/stream-key-table.tsx`
- [x] T046 [US5] Create generate stream key dialog (broadcaster select, expiry) in `components/stream-keys/stream-key-dialog.tsx`
- [x] T047 [US5] Implement copy-to-clipboard for stream key with toast feedback
- [x] T048 [US5] Create stream-keys page in `app/(dashboard)/stream-keys/page.tsx`
- [x] T049 [US5] Add revoke confirmation dialog and visual distinction for revoked keys
- [x] T050 [US5] Display key_value only on creation with prominent copy button

**Checkpoint**: Stream key management complete - admins can provision streaming access

---

## Phase 7: User Story 6 - Dashboard Navigation (Priority: P3)

**Goal**: Persistent left sidebar with navigation to all sections, active page highlighting

**Independent Test**: Click each menu item, verify navigation works, current page is highlighted

### Implementation for US6

- [x] T051 [US6] Create sidebar component with Radix icons in `components/layout/sidebar.tsx` (using existing app-sidebar.tsx)
- [x] T052 [US6] Create header component with theme toggle in `components/layout/header.tsx` (using existing site-header.tsx)
- [x] T053 [US6] Create theme toggle component (sun/moon icons) in `components/layout/theme-toggle.tsx` (components/theme-toggle.tsx)
- [x] T054 [US6] Create dashboard layout with sidebar in `app/(dashboard)/layout.tsx`
- [x] T055 [US6] Implement active page highlighting using usePathname hook
- [x] T056 [US6] Create dashboard landing page (redirect to /streams) in `app/(dashboard)/page.tsx`
- [ ] T057 [P] [US6] Create login page in `app/(auth)/login/page.tsx`
- [ ] T058 [P] [US6] Create auth layout (no sidebar) in `app/(auth)/layout.tsx`
- [ ] T059 [US6] Add auth middleware to protect dashboard routes in `middleware.ts`

**Checkpoint**: Navigation complete - users can access all features with consistent layout

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T060 [P] Add responsive design adjustments for mobile/tablet viewports (shadcn/ui sidebar handles this)
- [ ] T061 [P] Implement API health check indicator in sidebar
- [x] T062 [P] Add keyboard shortcuts documentation (Escape for fullscreen exit) (documented in fullscreen-player.tsx)
- [x] T063 Optimize bundle size by auditing unused shadcn/ui components (build passes, no unused imports)
- [ ] T064 [P] Add loading.tsx files for route segments in `app/(dashboard)/*/loading.tsx`
- [ ] T065 Run quickstart.md verification checklist (requires running backend)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Phase 2 completion
  - US1+US2 (Phase 3): Can start after Phase 2
  - US3 (Phase 4): Depends on Phase 3 (needs stream grid)
  - US4 (Phase 5): Can start after Phase 2 (independent of streaming)
  - US5 (Phase 6): Can start after Phase 2 (independent of streaming)
  - US6 (Phase 7): Can start after Phase 2 (layout needed by others, but can be stubbed)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 2 (Foundation)
       │
       ├──────────────┬───────────────┬───────────────┐
       ▼              ▼               ▼               ▼
   US1+US2 (P1)    US4 (P2)       US5 (P2)        US6 (P3)
   Stream Grid     Broadcasters   Stream Keys     Navigation
       │
       ▼
    US3 (P2)
   Fullscreen
```

### Parallel Opportunities

**Phase 1** (all can run in parallel after T001):
```
T002, T003, T004, T005 → then T006
```

**Phase 2** (after T007 completes):
```
T008, T009, T010 (API functions)
T011, T012 (Auth setup)
T013, T015 (Utilities)
```

**Phase 3** (after foundation):
```
T017, T018 (Players)
T020, T023, T024 (Status, hooks, API)
```

**Phases 5-6** can run in parallel if team capacity allows:
```
US4 (Broadcasters): T032, T033, T034 in parallel
US5 (Stream Keys): T041, T042, T043 in parallel
```

---

## Implementation Strategy

### MVP First (User Story 1+2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: Stream Grid with Status
4. **STOP and VALIDATE**: Test stream playback end-to-end
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1+US2 → Test independently → Deploy (MVP!)
3. Add US3 (Fullscreen) → Test → Deploy
4. Add US4 (Broadcasters) → Test → Deploy
5. Add US5 (Stream Keys) → Test → Deploy
6. Add US6 (Navigation) → Test → Deploy
7. Polish → Final release

### Suggested Execution Order for Solo Developer

```
Phase 1 → Phase 2 → Phase 7 (Navigation/Layout first for consistent UI) →
Phase 3 (Stream Grid) → Phase 4 (Fullscreen) →
Phase 5 (Broadcasters) → Phase 6 (Stream Keys) → Phase 8 (Polish)
```

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All tasks use absolute file paths from repository root
- shadcn/ui components installed via `bunx --bun shadcn@latest add <component>`
- Radix icons used throughout: import from `@radix-ui/react-icons`
- Date formatting via date-fns `formatDistanceToNow` for humanized durations
