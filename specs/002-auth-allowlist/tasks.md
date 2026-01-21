# Tasks: Auth Allowlist Configuration

**Input**: Design documents from `/specs/002-auth-allowlist/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Not included (no test framework currently configured per plan.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- Types: `types/`
- Auth utilities: `lib/auth/`
- Auth config: `lib/auth.ts`
- Pages: `app/(auth)/`

---

## Phase 1: Setup

**Purpose**: Create new files and directory structure

- [x] T001 Create auth types directory structure by creating `types/` folder if not exists
- [x] T002 Create auth utilities directory by creating `lib/auth/` folder

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types and utilities that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create auth type definitions (AllowlistConfig, AuthorizationResult, AllowReason, DenyReason) in `types/auth.ts`
- [x] T004 [P] Implement `loadAllowlistConfig()` function to parse environment variables in `lib/auth/allowlist.ts`
- [x] T005 Implement `checkAllowlist(email: string, config: AllowlistConfig): AuthorizationResult` function in `lib/auth/allowlist.ts`
- [x] T006 Implement `logAccessDenied(email: string, reason: DenyReason)` helper function in `lib/auth/allowlist.ts`

**Checkpoint**: Foundation ready - allowlist utilities complete and testable

---

## Phase 3: User Story 1 - Domain-Based Access Control (Priority: P1)

**Goal**: Users from allowed domains (e.g., @searchandrescue.gg) can access the dashboard; users from other domains are denied

**Independent Test**: Sign in with user@searchandrescue.gg (allowed domain) → access granted. Sign in with user@gmail.com (not allowed) → access denied.

### Implementation for User Story 1

- [x] T007 [US1] Add `signIn` callback to Auth.js config that calls `checkAllowlist()` and returns `/access-denied` for unauthorized domains in `lib/auth.ts`
- [x] T008 [US1] Update `authorized` callback to re-validate domain allowlist on each protected route navigation in `lib/auth.ts`
- [x] T009 [US1] Add `AUTH_ALLOWED_DOMAINS` to `.env.example` with documentation comment

**Checkpoint**: Domain-based access control working. Can test with allowed/disallowed domains.

---

## Phase 4: User Story 2 - Individual Email Access Control (Priority: P2)

**Goal**: Specific emails (e.g., contractor@external.com) can access the dashboard regardless of their domain

**Independent Test**: Sign in with contractor@external.com (in email allowlist, domain not allowed) → access granted. Sign in with random@external.com (not in email allowlist, domain not allowed) → access denied.

### Implementation for User Story 2

- [x] T010 [US2] Update `signIn` callback to check email allowlist before domain allowlist in `lib/auth.ts`
- [x] T011 [US2] Update `authorized` callback to include email allowlist check in `lib/auth.ts`
- [x] T012 [US2] Add `AUTH_ALLOWED_EMAILS` to `.env.example` with documentation comment

**Checkpoint**: Email-based access control working. Can test with allowed emails from non-allowed domains.

---

## Phase 5: User Story 3 - Access Denial Feedback (Priority: P3)

**Goal**: Denied users see a clear, helpful error page explaining they don't have access and how to request it

**Independent Test**: Sign in with unauthorized email → see access denied page with clear messaging and instructions.

### Implementation for User Story 3

- [x] T013 [P] [US3] Create access denied page component at `app/(auth)/access-denied/page.tsx` with messaging explaining unauthorized access
- [x] T014 [US3] Add "contact administrator" or "request access" instructions to the access denied page in `app/(auth)/access-denied/page.tsx`
- [x] T015 [US3] Ensure access denied page matches existing login page styling (use same Card component pattern) in `app/(auth)/access-denied/page.tsx`

**Checkpoint**: Complete access denial UX. Users understand why they were denied and what to do next.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [x] T016 Verify fail-closed behavior: test with both `AUTH_ALLOWED_DOMAINS` and `AUTH_ALLOWED_EMAILS` unset → all access denied
- [x] T017 Verify case-insensitive matching: test with "User@SearchAndRescue.GG" → should match "searchandrescue.gg"
- [x] T018 Verify subdomain handling: test with "user@sub.searchandrescue.gg" when only "searchandrescue.gg" is allowed → should be denied
- [x] T019 Update `.env.example` with complete auth allowlist configuration documentation
- [x] T020 Run quickstart.md validation scenarios to confirm all test cases pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 can start immediately after Phase 2
  - US2 can start immediately after Phase 2 (parallel with US1 if desired)
  - US3 depends on US1 or US2 (needs redirect target to exist)
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but modifications are additive
- **User Story 3 (P3)**: Can start after Phase 2, but makes most sense after US1/US2 establish redirect behavior

### Within Each User Story

- Core implementation before integration
- Auth.ts modifications should be sequential within a story (same file)

### Parallel Opportunities

**Phase 2 (Foundational)**:
```
T003 [P] types/auth.ts
T004 [P] lib/auth/allowlist.ts (loadAllowlistConfig)
```
Can run in parallel - different files.

**Phase 3-4 (US1 + US2)**:
If working with multiple developers, US1 and US2 can be done in parallel since they modify the same file (`lib/auth.ts`) but in additive ways.

**Phase 5 (US3)**:
```
T013 [P] app/(auth)/access-denied/page.tsx
```
Can be started in parallel with US1/US2 since it's a new file.

---

## Parallel Example: Foundational Phase

```bash
# Launch foundational tasks in parallel (different files):
Task: "Create auth type definitions in types/auth.ts"
Task: "Implement loadAllowlistConfig() in lib/auth/allowlist.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T006)
3. Complete Phase 3: User Story 1 (T007-T009)
4. **STOP and VALIDATE**: Test domain-based access control independently
5. Deploy if MVP is sufficient

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test domain allowlist → Deploy (MVP!)
3. Add User Story 2 → Test email allowlist → Deploy
4. Add User Story 3 → Test access denied page → Deploy
5. Each story adds value without breaking previous stories

### Single Developer Strategy

1. T001-T002 (Setup)
2. T003-T006 (Foundational - some parallel)
3. T007-T009 (US1 - Domain control)
4. T010-T012 (US2 - Email control)
5. T013-T015 (US3 - Denied page)
6. T016-T020 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No test tasks included (no test framework per plan.md)
- Manual testing via quickstart.md scenarios
- Environment variables are server-side only (no NEXT_PUBLIC_ prefix)
- Commit after each task or logical group
