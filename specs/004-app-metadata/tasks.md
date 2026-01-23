# Tasks: App Metadata Generation

**Input**: Design documents from `/specs/004-app-metadata/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested - validation via manual testing and external tools (Facebook Debugger, Twitter Validator, Lighthouse)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Project Type**: Next.js App Router (web application)
- **App Directory**: `app/` (metadata files and configuration)
- **Public Assets**: `public/` (static images)

---

## Phase 1: Setup (File Preparation)

**Purpose**: Rename and move image files to correct locations per Next.js conventions

- [x] T001 Move and rename OpenGraph image: `mv "public/OpenGraph Meta Image.png" app/opengraph-image.png`
- [x] T002 [P] Move and rename favicon: `mv "public/Favicon 128.png" app/icon.png`
- [x] T003 [P] Move and rename Apple Touch icon: `mv "public/apple-touch-gradient.png" app/apple-icon.png`

---

## Phase 2: Foundational (Shared Metadata Configuration)

**Purpose**: Core metadata configuration that ALL user stories depend on

**⚠️ CRITICAL**: User story implementation depends on this metadata base being configured

- [x] T004 Update metadata export in app/layout.tsx with metadataBase URL configuration
- [x] T005 Add openGraph configuration object to metadata export in app/layout.tsx
- [x] T006 Add twitter configuration object to metadata export in app/layout.tsx

**Checkpoint**: Foundation ready - metadata base configured, user story validation can begin

---

## Phase 3: User Story 1 - Social Media Sharing Preview (Priority: P1) 🎯 MVP

**Goal**: Rich preview cards appear when sharing dashboard URLs on social media platforms

**Independent Test**: Share URL on Facebook Sharing Debugger (https://developers.facebook.com/tools/debug/) or paste into Discord/Slack

### Implementation for User Story 1

- [x] T007 [US1] Verify app/opengraph-image.png is accessible at /opengraph-image.png
- [x] T008 [US1] Verify og:title, og:description, og:image meta tags render in HTML head
- [x] T009 [US1] Verify twitter:card, twitter:title, twitter:description, twitter:image meta tags render in HTML head
- [ ] T010 [US1] Test with Facebook Sharing Debugger - confirm preview card displays correctly
- [ ] T011 [US1] Test with Twitter Card Validator - confirm summary_large_image card displays

**Checkpoint**: Social media sharing works - rich previews appear on Facebook, Twitter, Discord, Slack

---

## Phase 4: User Story 2 - Browser Tab and Bookmark Recognition (Priority: P1)

**Goal**: Favicon appears in browser tabs and bookmarks across all major browsers

**Independent Test**: Open site in Chrome, Firefox, Safari, Edge - verify favicon visible in tab

### Implementation for User Story 2

- [x] T012 [US2] Verify app/icon.png is accessible at /icon and auto-generates link rel="icon" tag
- [x] T013 [US2] Verify public/favicon.ico is accessible at /favicon.ico for legacy browsers
- [ ] T014 [US2] Test favicon display in Chrome browser tab
- [ ] T015 [P] [US2] Test favicon display in Firefox browser tab
- [ ] T016 [P] [US2] Test favicon display in Safari browser tab
- [ ] T017 [P] [US2] Test favicon display in Edge browser tab
- [ ] T018 [US2] Test bookmark creation - verify icon appears in bookmarks bar

**Checkpoint**: Favicon works across all major browsers - tab icon and bookmarks display correctly

---

## Phase 5: User Story 3 - Mobile Home Screen Installation (Priority: P2)

**Goal**: Proper icons appear when users add app to iOS/Android home screens

**Independent Test**: On iOS Safari, tap Share → "Add to Home Screen" - verify icon displays

### Implementation for User Story 3

- [x] T019 [US3] Verify app/apple-icon.png is accessible and auto-generates link rel="apple-touch-icon" tag
- [ ] T020 [US3] Test iOS Safari "Add to Home Screen" - verify Apple Touch icon appears
- [ ] T021 [US3] Test Android Chrome "Add to Home Screen" - verify manifest icon appears

**Checkpoint**: Home screen installation works - icons display correctly on iOS and Android

---

## Phase 6: User Story 4 - PWA Installation Experience (Priority: P2)

**Goal**: PWA installation shows correct app name, description, icons, and theme colors

**Independent Test**: In Chrome DevTools, run Lighthouse PWA audit - verify manifest score is 100%

### Implementation for User Story 4

- [x] T022 [US4] Create web app manifest file in app/manifest.ts with typed MetadataRoute.Manifest export
- [x] T023 [US4] Configure manifest name: "RescueStream Dashboard" and short_name: "RescueStream"
- [x] T024 [US4] Configure manifest description matching app description
- [x] T025 [US4] Configure manifest display: "standalone", start_url: "/"
- [x] T026 [US4] Configure manifest background_color and theme_color (hex values)
- [x] T027 [US4] Configure manifest icons array referencing /icon-192.png and /icon-512.png
- [x] T028 [US4] Verify manifest.json is accessible at /manifest.webmanifest
- [ ] T029 [US4] Run Lighthouse PWA audit - verify manifest and icon requirements pass
- [ ] T030 [US4] Test PWA installation prompt in Chrome - verify app name and icon display

**Checkpoint**: PWA installation works - Lighthouse PWA audit passes, installation shows correct branding

---

## Phase 7: Polish & Cleanup

**Purpose**: Remove unused files and final validation

- [x] T031 [P] Remove unused file: `rm "public/Favicon.png"`
- [x] T032 [P] Remove unused file: `rm "public/Favicon 32.png"`
- [x] T033 [P] Remove unused file: `rm "public/apple-touch.png"`
- [x] T034 [P] Remove unused file: `rm "public/Main.png"`
- [x] T035 [P] Remove unused file: `rm "public/icon-512_1.png"`
- [x] T036 Run `bun build` to verify no build errors
- [x] T037 Run `bun lint` to verify no linting errors
- [ ] T038 Verify all metadata with comprehensive Lighthouse audit (SEO + PWA categories)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 - can be implemented in parallel
  - US3 and US4 are both P2 - can be implemented in parallel after P1 stories
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - Requires opengraph-image.png in place (T001)
- **User Story 2 (P1)**: Can start after Foundational - Requires icon.png in place (T002)
- **User Story 3 (P2)**: Can start after Foundational - Requires apple-icon.png in place (T003)
- **User Story 4 (P2)**: Can start after Foundational - Requires manifest.ts creation (T022)

### Within Each User Story

- Configuration before verification
- Verification before external tool validation
- All validations complete before checkpoint

### Parallel Opportunities

- T002, T003 can run in parallel with T001 (different files)
- T015, T016, T017 can run in parallel (browser testing)
- T031-T035 can all run in parallel (independent file deletions)
- US1 and US2 can be worked in parallel (both P1, different files)
- US3 and US4 can be worked in parallel (both P2, different files)

---

## Parallel Example: Setup Phase

```bash
# Launch all file moves in parallel:
Task: "Move and rename OpenGraph image: mv 'public/OpenGraph Meta Image.png' app/opengraph-image.png"
Task: "Move and rename favicon: mv 'public/Favicon 128.png' app/icon.png"
Task: "Move and rename Apple Touch icon: mv 'public/apple-touch-gradient.png' app/apple-icon.png"
```

## Parallel Example: Browser Testing (User Story 2)

```bash
# Launch browser tests in parallel:
Task: "Test favicon display in Firefox browser tab"
Task: "Test favicon display in Safari browser tab"
Task: "Test favicon display in Edge browser tab"
```

## Parallel Example: File Cleanup (Polish Phase)

```bash
# Launch all file deletions in parallel:
Task: "Remove unused file: rm 'public/Favicon.png'"
Task: "Remove unused file: rm 'public/Favicon 32.png'"
Task: "Remove unused file: rm 'public/apple-touch.png'"
Task: "Remove unused file: rm 'public/Main.png'"
Task: "Remove unused file: rm 'public/icon-512_1.png'"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (move/rename files)
2. Complete Phase 2: Foundational (metadata configuration)
3. Complete Phase 3: User Story 1 (Social Media Sharing)
4. Complete Phase 4: User Story 2 (Browser Favicons)
5. **STOP and VALIDATE**: Test social sharing + favicon independently
6. Deploy/demo if ready - core metadata is functional

### Incremental Delivery

1. Complete Setup + Foundational → Metadata base ready
2. Add US1 (Social Sharing) → Validate with Facebook Debugger → Deploy
3. Add US2 (Favicons) → Validate across browsers → Deploy
4. Add US3 (Mobile Home Screen) → Test on iOS/Android → Deploy
5. Add US4 (PWA) → Run Lighthouse audit → Deploy
6. Complete Polish → Full validation → Final deploy

### Suggested MVP Scope

**MVP = Phase 1 + Phase 2 + Phase 3 + Phase 4** (Tasks T001-T018)

This delivers:
- ✅ Social media sharing with rich previews
- ✅ Favicons in browser tabs and bookmarks
- Core value delivered; PWA features can follow

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Validation uses external tools: Facebook Debugger, Twitter Validator, Lighthouse
- All file paths are relative to repository root
- Commit after each phase completion
- Stop at any checkpoint to validate story independently
