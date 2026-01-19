# Feature Specification: Livestream Dashboard

**Feature Branch**: `001-livestream-dashboard`
**Created**: 2026-01-18
**Status**: Draft
**Input**: User description: "Build a web application that can display livestreamed video from MediaMTX in a tiled grid, with the ability to generate broadcasters (users/devices) and stream keys (the stream address). The grid will not add aggressive borders or cards to the video, prioritizing the viewing of the content. This will live in a dashboard page, and ideally fit the screen perfectly. There will be a menu bar on the left side of the page. You should be able to click on an individual tiled video in the grid and have it become full screen, with an easy way to return to the grid quickly. Focus on using data grids/tables where practical for collecting information such as broadcasters or stream keys, and leverage native data entry/dialog where possible (shadcn/ui has mechanisms for this). Also ensure that there are stream offline indicators when a stream goes down, and indicators when a stream is live, with the content/metadata of the given stream including broadcaster and time elapsed since start (consider date-fns to humanize those durations)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Live Streams in Grid (Priority: P1)

As an operator, I need to monitor multiple live video streams simultaneously in a tiled grid layout so I can maintain situational awareness across all active broadcasts.

**Why this priority**: This is the core functionality of the dashboard. Without the ability to view multiple streams, the application has no value. The grid must maximize video visibility with minimal UI chrome.

**Independent Test**: Can be fully tested by loading the dashboard with multiple active streams and verifying all streams display in an adaptive grid that fills the screen.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded and 4 streams are live, **When** the page renders, **Then** all 4 streams display in a 2x2 grid filling the available viewport (minus the left menu)
2. **Given** the dashboard is loaded and 1 stream is live, **When** the page renders, **Then** the single stream displays prominently, utilizing available space
3. **Given** the dashboard is loaded and 9 streams are live, **When** the page renders, **Then** streams display in a 3x3 grid with minimal gaps and no aggressive borders/cards
4. **Given** any stream tile is visible, **When** I view the tile, **Then** I see the broadcaster name and a humanized duration since stream started (e.g., "2 hours ago", "15 minutes ago")

---

### User Story 2 - Stream Status Indicators (Priority: P1)

As an operator, I need clear visual indicators showing which streams are live versus offline so I can immediately identify connectivity issues or ended broadcasts.

**Why this priority**: Real-time status awareness is critical for monitoring operations. Operators must instantly distinguish active streams from failed/offline ones.

**Independent Test**: Can be tested by simulating stream state changes and verifying visual indicators update correctly.

**Acceptance Scenarios**:

1. **Given** a stream is actively broadcasting, **When** displayed in the grid, **Then** a "LIVE" indicator is clearly visible on the tile
2. **Given** a stream goes offline, **When** the status changes, **Then** an "OFFLINE" indicator replaces the live indicator within 5 seconds
3. **Given** a stream is offline, **When** displayed in the grid, **Then** the tile shows an offline state (placeholder or last frame) with clear offline messaging
4. **Given** a stream comes back online, **When** the status changes, **Then** the live indicator appears and video resumes within 5 seconds

---

### User Story 3 - Fullscreen Single Stream (Priority: P2)

As an operator, I need to click on any stream tile to view it in fullscreen mode, and quickly return to the grid view, so I can focus on a specific broadcast when needed.

**Why this priority**: While grid view is primary, the ability to focus on a single stream is essential for detailed monitoring. Quick return to grid ensures workflow efficiency.

**Independent Test**: Can be tested by clicking a tile, verifying fullscreen display, and using escape/close to return to grid.

**Acceptance Scenarios**:

1. **Given** the grid is displayed with multiple streams, **When** I click on a stream tile, **Then** that stream expands to fullscreen (or near-fullscreen with minimal UI)
2. **Given** a stream is in fullscreen mode, **When** I press Escape or click a close/back button, **Then** I return to the grid view immediately
3. **Given** a stream is in fullscreen mode, **When** I view the stream, **Then** I see enhanced metadata (broadcaster name, stream duration, stream key identifier)

---

### User Story 4 - Manage Broadcasters (Priority: P2)

As an administrator, I need to create, view, edit, and delete broadcasters (users/devices) through a data table interface so I can control who is authorized to stream.

**Why this priority**: Broadcaster management is essential for operational control but can function independently of the live viewing experience.

**Independent Test**: Can be tested by navigating to broadcaster management, performing CRUD operations, and verifying data persistence.

**Acceptance Scenarios**:

1. **Given** I am on the broadcaster management page, **When** the page loads, **Then** I see a data table listing all broadcasters with their key information
2. **Given** the broadcaster table is displayed, **When** I click "Add Broadcaster", **Then** a dialog opens for entering broadcaster details
3. **Given** the add broadcaster dialog is open, **When** I fill in required fields and submit, **Then** the new broadcaster appears in the table
4. **Given** the broadcaster table is displayed, **When** I click edit on a broadcaster row, **Then** a dialog opens pre-filled with that broadcaster's information
5. **Given** the broadcaster table is displayed, **When** I click delete on a broadcaster row and confirm, **Then** that broadcaster is removed from the table

---

### User Story 5 - Manage Stream Keys (Priority: P2)

As an administrator, I need to generate, view, and revoke stream keys through a data table interface so I can control stream access and provide broadcasters with their streaming credentials.

**Why this priority**: Stream key management enables broadcasters to connect. Essential for operations but independent of live viewing.

**Independent Test**: Can be tested by navigating to stream key management, generating keys, and verifying they appear in the table.

**Acceptance Scenarios**:

1. **Given** I am on the stream key management page, **When** the page loads, **Then** I see a data table listing all stream keys with associated broadcaster and status
2. **Given** the stream key table is displayed, **When** I click "Generate Key", **Then** a dialog opens to select a broadcaster and create a new stream key
3. **Given** a new stream key is generated, **When** the dialog closes, **Then** the new key appears in the table with a way to copy the full stream URL
4. **Given** the stream key table is displayed, **When** I click revoke on a key row and confirm, **Then** that key is marked as revoked and can no longer be used for streaming

---

### User Story 6 - Dashboard Navigation (Priority: P3)

As a user, I need a persistent left-side menu to navigate between the stream grid, broadcaster management, and stream key management so I can access all features without losing context.

**Why this priority**: Navigation is important but the individual features provide value independently. Menu structure enables the overall application flow.

**Independent Test**: Can be tested by clicking menu items and verifying correct page navigation.

**Acceptance Scenarios**:

1. **Given** I am on any page, **When** I view the left side of the screen, **Then** I see a persistent navigation menu
2. **Given** the menu is visible, **When** I click "Dashboard" or "Streams", **Then** I navigate to the live stream grid
3. **Given** the menu is visible, **When** I click "Broadcasters", **Then** I navigate to the broadcaster management table
4. **Given** the menu is visible, **When** I click "Stream Keys", **Then** I navigate to the stream key management table
5. **Given** I am on any page, **When** I view the menu, **Then** the current page is visually highlighted

---

### Edge Cases

- What happens when no streams are currently live? Display empty state with helpful message
- What happens when a stream buffer/connection is slow? Show loading indicator on affected tile
- What happens when the viewport is resized? Grid adapts responsively, recalculating tile sizes
- What happens when there are more than 9 streams? Grid paginates, showing 9 per page with pagination controls
- What happens when a broadcaster is deleted who has active stream keys? Stream keys should be revoked or orphaned keys handled gracefully
- What happens when copying a stream key fails? Show error feedback and allow retry
- What happens when the external API is unreachable? Display error state with retry option

## Requirements *(mandatory)*

### Functional Requirements

**Video Grid Display**
- **FR-001**: System MUST display multiple live video streams in a tiled grid layout
- **FR-002**: System MUST adapt grid layout based on number of active streams (1 stream = full area, 4 = 2x2, up to 9 = 3x3 max per page)
- **FR-003**: System MUST minimize visual borders and decorations around video tiles to maximize content visibility
- **FR-004**: System MUST fill the available viewport (excluding navigation menu) with the video grid

**Stream Metadata & Status**
- **FR-005**: System MUST display broadcaster name on each stream tile
- **FR-006**: System MUST display humanized time elapsed since stream started on each tile (e.g., "Started 2 hours ago")
- **FR-007**: System MUST display a "LIVE" indicator on actively streaming tiles
- **FR-008**: System MUST display an "OFFLINE" indicator when a stream is not active
- **FR-009**: System MUST update stream status within 5 seconds of actual state change

**Fullscreen Mode**
- **FR-010**: Users MUST be able to click a stream tile to enter fullscreen view of that stream
- **FR-011**: Users MUST be able to exit fullscreen view by pressing Escape or clicking a close control
- **FR-012**: Fullscreen view MUST display enhanced stream metadata

**Broadcaster Management**
- **FR-013**: System MUST display broadcasters in a data table with sortable/filterable columns
- **FR-014**: Users MUST be able to create new broadcasters via a dialog form
- **FR-015**: Users MUST be able to edit existing broadcaster details via a dialog form
- **FR-016**: Users MUST be able to delete broadcasters with confirmation

**Stream Key Management**
- **FR-017**: System MUST display stream keys in a data table with associated broadcaster information
- **FR-018**: Users MUST be able to generate new stream keys via a dialog form
- **FR-019**: System MUST provide a way to copy the full stream URL/key to clipboard
- **FR-020**: Users MUST be able to revoke stream keys with confirmation
- **FR-021**: Revoked stream keys MUST be visually distinguished from active keys

**Navigation**
- **FR-022**: System MUST provide a persistent left-side navigation menu
- **FR-023**: Navigation menu MUST include links to: Stream Grid, Broadcasters, Stream Keys
- **FR-024**: Navigation menu MUST indicate the currently active page

**Data Integration**
- **FR-025**: System MUST fetch broadcaster and stream data from external API
- **FR-026**: System MUST handle API errors gracefully with user-friendly error states
- **FR-027**: System MUST provide visual feedback during data loading operations

**Theme & Appearance**
- **FR-028**: System MUST support both light and dark color themes
- **FR-029**: System MUST respect the user's system preference for light/dark mode by default
- **FR-030**: System MUST provide a visible toggle button to manually switch between light and dark modes
- **FR-031**: User's manual theme preference MUST persist across sessions

### Key Entities

- **Broadcaster**: Represents a user or device authorized to stream. Attributes include: unique identifier, display name, description/notes, creation date, status (active/inactive)

- **Stream Key**: Represents streaming credentials assigned to a broadcaster (one-to-many: each broadcaster can have multiple stream keys for different devices/locations). Attributes include: unique identifier, associated broadcaster, key value (for stream URL), creation date, status (active/revoked), last used timestamp

- **Stream**: Represents an active or historical broadcast session. Attributes include: unique identifier, associated stream key, associated broadcaster, start time, end time (if ended), current status (live/offline)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view the live stream grid within 3 seconds of page load
- **SC-002**: Stream status changes (live/offline) are reflected in the UI within 5 seconds
- **SC-003**: Users can enter and exit fullscreen mode in under 1 second
- **SC-004**: Users can create a new broadcaster in under 30 seconds
- **SC-005**: Users can generate and copy a stream key in under 20 seconds
- **SC-006**: Grid layout adapts correctly for 1-9 streams per page (full area for 1, 2x2 for 4, 3x3 for 9) with pagination for overflow
- **SC-007**: Video tiles display with minimal UI chrome (borders under 2px, no card shadows)
- **SC-008**: Navigation between all sections completes in under 500ms
- **SC-009**: 95% of data table operations (sort, filter, paginate) complete in under 300ms
- **SC-010**: Time elapsed displays are accurate and update at appropriate intervals (every minute for recent, less frequently for older)
- **SC-011**: Theme toggle switches between light and dark modes instantly (no page reload required)

## Clarifications

### Session 2026-01-18

- Q: What video streaming protocol should the browser use to consume MediaMTX streams? → A: HLS + WebRTC dual support (HLS for broad compatibility, WebRTC for low-latency when available)
- Q: What is the relationship between Broadcasters and Stream Keys? → A: One-to-many (a broadcaster can have multiple stream keys for different devices/locations)
- Q: What is the maximum number of streams visible in the grid? → A: 9 max (3x3), with pagination for overflow; grid adapts to fewer streams (2x2 for 4, full area for 1)
- Q: How should dark mode be handled? → A: Full dark mode support out of the box; visible toggle button in UI; respects system preference by default

## Assumptions

- MediaMTX is the video streaming server and provides accessible stream endpoints
- An external Go API exists and provides endpoints for broadcaster and stream key CRUD operations
- Stream status can be determined via the external API or MediaMTX status endpoints
- Users access the dashboard via modern web browsers with video playback support
- The application does not require user authentication for this initial version (authentication can be added later)
- Video streams are delivered via HLS (primary, broad compatibility) and WebRTC (secondary, low-latency when available); player should attempt WebRTC first, fallback to HLS
