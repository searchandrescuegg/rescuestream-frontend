# Tasks: Legal Pages for OAuth Consent

**Input**: Design documents from `/specs/005-legal-pages/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated tests requested - manual verification per quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a Next.js App Router project:
- Pages: `app/` directory with route groups
- Components: `components/` directory
- No backend changes needed (static content only)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared components and layout structure needed by all user stories

- [x] T001 [P] Create LegalFooter component with Privacy and Terms links in components/legal-footer.tsx
- [x] T002 [P] Create legal pages route group layout with logo, navigation, and footer in app/(legal)/layout.tsx

**Checkpoint**: Shared infrastructure ready - user story implementation can begin

---

## Phase 2: User Story 1 - View Privacy Policy (Priority: P1) 🎯 MVP

**Goal**: Provide a publicly accessible Privacy Policy page that satisfies Google OAuth Consent Screen requirements

**Independent Test**: Navigate to `/privacy` in incognito browser - page should load without authentication and display all required privacy sections

### Implementation for User Story 1

- [x] T003 [US1] Create Privacy Policy page with metadata and all required sections in app/(legal)/privacy/page.tsx

**Required sections (per FR-005)**:
- Information We Collect (Google OAuth data: email, name, profile picture)
- How We Use Your Information
- Data Storage and Security
- Data Sharing
- Your Rights
- Contact Information (contact@searchandrescue.gg)
- Effective date

**Checkpoint**: Privacy Policy page is fully functional and accessible at `/privacy`

---

## Phase 3: User Story 2 - View Terms of Service (Priority: P1)

**Goal**: Provide a publicly accessible Terms of Service page that satisfies Google OAuth Consent Screen requirements

**Independent Test**: Navigate to `/terms` in incognito browser - page should load without authentication and display all required terms sections

### Implementation for User Story 2

- [x] T004 [US2] Create Terms of Service page with metadata and all required sections in app/(legal)/terms/page.tsx

**Required sections (per FR-006)**:
- Service Description
- User Accounts and Responsibilities
- Acceptable Use
- Intellectual Property
- Limitation of Liability
- Changes to Terms
- Governing Law
- Contact Information (contact@searchandrescue.gg)
- Effective date

**Checkpoint**: Terms of Service page is fully functional and accessible at `/terms`

---

## Phase 4: User Story 3 - Access Legal Pages from Footer (Priority: P2)

**Goal**: Make legal pages discoverable from the login page via clickable links

**Independent Test**: Navigate to login page - verify "terms of service" and "privacy policy" text are clickable links that navigate to the correct pages

### Implementation for User Story 3

- [x] T005 [US3] Update login page to link existing legal text to actual pages in app/(auth)/login/page.tsx

**Changes needed**:
- Convert "terms of service and privacy policy" text to actual `<Link>` components
- Link to `/terms` and `/privacy` respectively

**Checkpoint**: Login page has working links to both legal pages

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verify all acceptance criteria and cross-story functionality

- [x] T006 Run manual verification per quickstart.md testing section (build passed, routes verified)
- [ ] T007 Verify dark mode works on both legal pages (manual)
- [ ] T008 Verify responsive design at 320px, 768px, and 1024px+ viewports (manual)
- [ ] T009 Verify navigation between legal pages works (cross-links in footer) (manual)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup (T001, T002)
- **User Story 2 (Phase 3)**: Depends on Setup (T001, T002) - can run parallel to US1
- **User Story 3 (Phase 4)**: Can start after Setup - independent of US1/US2
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Requires T001, T002 - No dependencies on other stories
- **User Story 2 (P1)**: Requires T001, T002 - No dependencies on other stories
- **User Story 3 (P2)**: No dependencies on US1/US2 - only modifies login page

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T003 and T004 can run in parallel after Setup (different pages)
- T005 can run in parallel with T003/T004 (different file)
- All Polish tasks (T006-T009) should run sequentially after implementation

---

## Parallel Example: Setup Phase

```bash
# Launch both setup tasks together:
Task: "Create LegalFooter component in components/legal-footer.tsx"
Task: "Create legal pages layout in app/(legal)/layout.tsx"
```

## Parallel Example: Content Pages

```bash
# After setup completes, launch both pages together:
Task: "Create Privacy Policy page in app/(legal)/privacy/page.tsx"
Task: "Create Terms of Service page in app/(legal)/terms/page.tsx"
Task: "Update login page links in app/(auth)/login/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 2: User Story 1 - Privacy Policy (T003)
3. **STOP and VALIDATE**: Test Privacy Policy page independently
4. This alone satisfies half of Google OAuth requirements

### Full Implementation (Recommended)

1. Complete Setup (T001, T002) in parallel
2. Complete US1 + US2 (T003, T004) in parallel - both required for Google OAuth
3. Complete US3 (T005) - improves UX and compliance
4. Run Polish phase (T006-T009) for final verification

### Task Summary

| Phase | Tasks | Parallel? |
|-------|-------|-----------|
| Setup | T001, T002 | Yes |
| US1 - Privacy | T003 | - |
| US2 - Terms | T004 | Yes (with T003) |
| US3 - Footer Links | T005 | Yes (with T003, T004) |
| Polish | T006-T009 | Sequential |

**Total Tasks**: 9
**Estimated parallelization**: Up to 3 tasks simultaneously during implementation

---

## Notes

- All pages are Server Components (no 'use client' needed)
- Contact email: contact@searchandrescue.gg
- Organization name: searchandrescue.gg
- Application name: RescueStream
- No database or API changes required
- Effective date should be set to deployment date
