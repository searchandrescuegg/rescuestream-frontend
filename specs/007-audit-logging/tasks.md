# Tasks: Audit Logging Dashboard

**Input**: Design documents from `/specs/007-audit-logging/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not included (not explicitly requested in feature specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md, this is a Next.js App Router frontend project:
- Pages: `app/(dashboard)/audit-logs/`
- Components: `components/audit-logs/`
- API: `lib/api/`, `app/api/`
- Hooks: `hooks/`
- Types: `types/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and type definitions

- [x] T001 [P] Add AuditLogEntry, AuditLogPagination, AuditLogsResponse, and AuditLogFilters types to types/api.ts
- [x] T002 [P] Create components/audit-logs/ directory structure
- [x] T003 [P] Add event type mapping constants (display names, icons) in lib/api/audit-logs.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement listAuditLogs() function in lib/api/audit-logs.ts using getRescueStreamClient()
- [x] T005 Create Next.js API route handler GET /api/audit-logs in app/api/audit-logs/route.ts with pagination and filter query param support
- [x] T006 Create useAuditLogs() SWR hook in hooks/use-audit-logs.ts with pagination state, filter state, and manual refresh

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Audit Log Events (Priority: P1) MVP

**Goal**: Administrators can view a comprehensive list of all audit events in a paginated data table

**Independent Test**: Load /audit-logs page as admin, verify events display in table with timestamp, event type, user, and details columns. Verify newest events appear first.

### Implementation for User Story 1

- [x] T007 [P] [US1] Create column definitions with timestamp, event type, user, summary columns in components/audit-logs/audit-log-columns.tsx
- [x] T008 [P] [US1] Create AuditLogTable client component using @tanstack/react-table in components/audit-logs/audit-log-table.tsx
- [x] T009 [US1] Create audit logs page in app/(dashboard)/audit-logs/page.tsx that renders AuditLogTable with useAuditLogs hook
- [x] T010 [US1] Add "Audit Log" navigation item to sidebar in components/app-sidebar.tsx (admin-only visibility)
- [x] T011 [US1] Implement loading skeleton state in AuditLogTable for initial data fetch
- [x] T012 [US1] Implement empty state message when no audit events exist

**Checkpoint**: User Story 1 complete - admin can view audit logs with basic table display

---

## Phase 4: User Story 2 - Filter and Search Audit Events (Priority: P2)

**Goal**: Administrators can filter events by event type and search by user name or details

**Independent Test**: Apply event type filter (e.g., "stream_started"), verify only matching events shown. Enter search term, verify matching results. Clear filters, verify all events return.

### Implementation for User Story 2

- [x] T013 [P] [US2] Create AuditLogFilters client component with event type dropdown and search input in components/audit-logs/audit-log-filters.tsx
- [x] T014 [US2] Integrate AuditLogFilters with AuditLogTable, passing filter state to useAuditLogs hook
- [x] T015 [US2] Update app/api/audit-logs/route.ts to map eventType filter to API action and resource_type params
- [x] T016 [US2] Add clear filters button to AuditLogFilters component
- [x] T017 [US2] Implement "No events match your filters" empty state when filters return zero results

**Checkpoint**: User Story 2 complete - admin can filter and search audit logs

---

## Phase 5: User Story 3 - Paginate Through Audit History (Priority: P2)

**Goal**: Administrators can navigate through pages of audit events with 10 items per page default

**Independent Test**: With >10 events, verify pagination controls appear. Click next/previous, verify correct page loads within 1 second.

### Implementation for User Story 3

- [x] T018 [US3] Add pagination controls (previous, next, page numbers) to AuditLogTable in components/audit-logs/audit-log-table.tsx
- [x] T019 [US3] Implement page size selector (10, 20, 30, 50) in AuditLogTable
- [x] T020 [US3] Connect pagination state to useAuditLogs hook, updating offset/limit params on page change
- [x] T021 [US3] Display current page and total page count based on pagination.total from API response

**Checkpoint**: User Story 3 complete - admin can paginate through audit history

---

## Phase 6: User Story 4 - View Event Details (Priority: P3)

**Goal**: Administrators can view detailed information about a specific audit event

**Independent Test**: Click on an event row, verify expanded details show all metadata including stream ID for stream events and masked key info for key events.

### Implementation for User Story 4

- [x] T022 [P] [US4] Create AuditLogDetail component (Sheet or expandable row) in components/audit-logs/audit-log-detail.tsx
- [x] T023 [US4] Add row click handler to AuditLogTable that opens AuditLogDetail with selected event
- [x] T024 [US4] Display stream ID prominently for stream_started events in detail view
- [x] T025 [US4] Display key metadata (key name, masked key value ••••xxxx, broadcaster name) for key events in detail view
- [x] T026 [US4] Handle long metadata values with truncation and "show more" toggle

**Checkpoint**: User Story 4 complete - admin can view full event details

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, UX improvements, and final touches

- [x] T027 Implement API error handling with user-friendly error messages and retry button in AuditLogTable
- [x] T028 Add manual refresh button to audit logs page header in app/(dashboard)/audit-logs/page.tsx
- [x] T029 Prevent duplicate API requests during rapid pagination with request deduplication in useAuditLogs
- [x] T030 Add loading state indicators during filter changes and page navigation
- [ ] T031 Verify admin-only access by testing with non-admin user (expect 403 or redirect)
- [ ] T032 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001 types must exist for T004-T006)
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P2 → P3)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 table component existing for filter integration
- **User Story 3 (P2)**: Depends on US1 table component existing for pagination integration
- **User Story 4 (P3)**: Depends on US1 table component existing for row click handling

### Within Each User Story

- Components before page integration
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (all parallel)**:
- T001, T002, T003 can all run in parallel

**Phase 3 - US1**:
- T007 and T008 can run in parallel (columns and table are separate files)

**Phase 4 - US2**:
- T013 can start while other US2 tasks are pending (separate file)

**Phase 6 - US4**:
- T022 can start immediately (separate file from table)

---

## Parallel Example: Phase 1 Setup

```bash
# Launch all setup tasks together:
Task: "Add TypeScript types to types/api.ts"
Task: "Create components/audit-logs/ directory"
Task: "Add event type mapping constants in lib/api/audit-logs.ts"
```

## Parallel Example: User Story 1

```bash
# Launch column and table tasks together:
Task: "Create column definitions in components/audit-logs/audit-log-columns.tsx"
Task: "Create AuditLogTable component in components/audit-logs/audit-log-table.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T006)
3. Complete Phase 3: User Story 1 (T007-T012)
4. **STOP and VALIDATE**: Navigate to /audit-logs as admin, verify events display
5. Deploy/demo if ready - basic audit log viewing works!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy (MVP: view audit logs)
3. Add User Story 2 → Test independently → Deploy (can now filter/search)
4. Add User Story 3 → Test independently → Deploy (can now paginate)
5. Add User Story 4 → Test independently → Deploy (can now view details)
6. Add Polish → Final validation → Deploy (production ready)

### Task Execution for Single Developer

Recommended order for sequential execution:

1. T001 → T002 → T003 (Setup)
2. T004 → T005 → T006 (Foundational)
3. T007 → T008 → T009 → T010 → T011 → T012 (US1 - MVP)
4. T013 → T014 → T015 → T016 → T017 (US2)
5. T018 → T019 → T020 → T021 (US3)
6. T022 → T023 → T024 → T025 → T026 (US4)
7. T027 → T028 → T029 → T030 → T031 → T032 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently testable after completion
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No tests included as not explicitly requested in specification
- Admin access check happens both frontend (navigation hiding) and backend (403 response)
