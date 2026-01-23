# Tasks: Simple Homepage

**Input**: Design documents from `/specs/006-simple-homepage/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not requested - manual testing only per plan.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project Type**: Next.js App Router (web application)
- **Components**: `components/` at repository root
- **Pages**: `app/` with route groups `(home)`, `(auth)`, `(dashboard)`, `(legal)`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and reusable component

- [x] T001 Create home components directory at components/home/
- [x] T002 [P] Create FeatureCard component with typed props in components/home/feature-card.tsx
- [x] T003 [P] Create (home) route group directory at app/(home)/

---

## Phase 2: Foundational (Homepage Layout)

**Purpose**: Create the shared layout that all user stories depend on

**⚠️ CRITICAL**: User story tasks require this layout to be complete

- [x] T004 Create homepage layout with header (logo, dark/light mode) and basic structure in app/(home)/layout.tsx

**Checkpoint**: Layout ready - user story implementation can now begin

---

## Phase 3: User Story 1 - First-Time Visitor Learns About RescueStream (Priority: P1) 🎯 MVP

**Goal**: Display hero section with headline, tagline, and features grid so visitors understand RescueStream's purpose

**Independent Test**: Visit root URL as unauthenticated user, verify headline is visible, scroll to see all 4 feature cards with icons, test on mobile (320px) and desktop viewports

### Implementation for User Story 1

- [x] T005 [US1] Create homepage page component with hero section (headline, tagline) in app/(home)/page.tsx
- [x] T006 [US1] Add features grid section with 4 FeatureCard components (Live Stream Monitoring, Broadcaster Management, Stream Key Authentication, Multi-Protocol Support) in app/(home)/page.tsx
- [x] T007 [US1] Add responsive styling for mobile/tablet/desktop viewports (grid cols, spacing, text sizes) in app/(home)/page.tsx

**Checkpoint**: User Story 1 complete - visitors can view homepage with hero and features

---

## Phase 4: User Story 2 - Visitor Navigates to Sign In (Priority: P2)

**Goal**: Add prominent call-to-action button that directs visitors to sign in or dashboard

**Independent Test**: Click CTA button, verify navigation to /streams (which redirects to login if unauthenticated or shows dashboard if authenticated)

### Implementation for User Story 2

- [x] T008 [US2] Add call-to-action Button component in hero section linking to /streams in app/(home)/page.tsx
- [x] T009 [US2] Add secondary CTA link in header navigation in app/(home)/layout.tsx

**Checkpoint**: User Story 2 complete - visitors can navigate to login/dashboard

---

## Phase 5: User Story 3 - Visitor Accesses Legal Information (Priority: P3)

**Goal**: Add footer with links to Privacy Policy and Terms of Service

**Independent Test**: Scroll to footer, click Privacy Policy link (verify navigation to /privacy), click Terms of Service link (verify navigation to /terms)

### Implementation for User Story 3

- [x] T010 [US3] Add footer section with legal links (Privacy Policy, Terms of Service) in app/(home)/layout.tsx

**Checkpoint**: All user stories complete - full homepage functionality available

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements and validation

- [x] T011 Remove or update redirect in app/page.tsx to allow homepage to display at root URL
- [x] T012 [P] Verify dark mode toggle works correctly (inherited from root layout)
- [x] T013 [P] Verify responsive layout at 320px, 768px, 1024px, 1440px viewport widths
- [x] T014 [P] Verify accessibility: semantic HTML, alt text on images, keyboard navigation
- [x] T015 Run ESLint to verify code quality (bun lint)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on T001 (directory created)
- **User Stories (Phase 3-5)**: All depend on T004 (layout complete)
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on T002 (FeatureCard) and T004 (layout) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on T004 (layout) and T005 (page exists) - Adds to existing page
- **User Story 3 (P3)**: Depends on T004 (layout) - Adds footer to layout

### Within Each User Story

- Components before pages that use them
- Layout before page content
- Core content before enhancements

### Parallel Opportunities

- T002 and T003 can run in parallel (different directories)
- T012, T013, T014 can run in parallel (independent verification tasks)
- After T004 completes, US1 can begin immediately

---

## Parallel Example: Setup Phase

```bash
# Launch these tasks in parallel:
Task: "Create FeatureCard component in components/home/feature-card.tsx"
Task: "Create (home) route group directory at app/(home)/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004)
3. Complete Phase 3: User Story 1 (T005-T007)
4. **STOP and VALIDATE**: Visit homepage, verify hero and features display correctly
5. Deploy/demo if ready - users can learn about RescueStream

### Incremental Delivery

1. Complete Setup + Foundational → Layout ready
2. Add User Story 1 → Hero + Features visible (MVP!)
3. Add User Story 2 → CTA button works
4. Add User Story 3 → Footer with legal links
5. Polish → Accessibility, responsive verification

### Single Developer Strategy

1. T001 → T002 → T003 (Setup)
2. T004 (Layout)
3. T005 → T006 → T007 (US1)
4. T008 → T009 (US2)
5. T010 (US3)
6. T011 → T012-T015 (Polish)

---

## Notes

- This feature is entirely static (no API calls, no database)
- All components are Server Components (no 'use client' needed)
- Reuses existing shadcn/ui components (Card, Button)
- Dark mode inherited from root layout via next-themes
- Total estimated tasks: 15
- MVP can be delivered after just 7 tasks (T001-T007)
