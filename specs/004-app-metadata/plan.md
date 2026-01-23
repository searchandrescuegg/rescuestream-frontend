# Implementation Plan: App Metadata Generation

**Branch**: `004-app-metadata` | **Date**: 2026-01-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-app-metadata/spec.md`

## Summary

Add comprehensive app metadata for social sharing (OpenGraph, Twitter Cards), browser icons (favicons), iOS home screen (Apple Touch icons), and PWA installation (web manifest). Uses existing prepared images in the public folder, renaming files with spaces to use hyphens. Implementation follows Next.js 15+ file-based metadata conventions.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16.1.3, React 19.2.3
**Storage**: N/A (static files in public folder)
**Testing**: Manual validation via Facebook Sharing Debugger, Twitter Card Validator, Lighthouse PWA audit
**Target Platform**: Web (all modern browsers, iOS Safari, Android Chrome)
**Project Type**: Web application (Next.js frontend)
**Performance Goals**: Metadata must be crawlable by social media bots; images must load within standard timeout thresholds
**Constraints**: Must use existing prepared images without modification; file renames only
**Scale/Scope**: Single root-level metadata configuration affecting all pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | ✅ Pass | No components needed; metadata is config-level |
| II. App Router Patterns | ✅ Pass | Uses Next.js file-based metadata conventions (`app/icon.png`, `app/manifest.ts`) |
| III. API Integration Discipline | ✅ Pass | No API calls; static metadata files |
| IV. Reusability & Composition | ✅ Pass | Metadata defined once at root, inherited by all routes |
| V. Type Safety | ✅ Pass | `manifest.ts` will use typed `MetadataRoute.Manifest` export |

**Gate Result**: PASS - All principles satisfied. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/004-app-metadata/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A for this feature - no API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── layout.tsx           # Extended with comprehensive metadata export
├── icon.png             # Favicon (renamed from Favicon 128.png)
├── icon.svg             # SVG favicon (if available, optional)
├── apple-icon.png       # Apple Touch icon (renamed from apple-touch-gradient.png)
├── opengraph-image.png  # OpenGraph image (renamed from OpenGraph Meta Image.png)
├── manifest.ts          # Web App Manifest (new file)
└── robots.ts            # Optional: robots.txt configuration

public/
├── favicon.ico          # Legacy favicon (already exists)
├── icon-192.png         # PWA icon 192x192 (already exists)
├── icon-512.png         # PWA icon 512x512 (already exists)
└── [other images]       # Remaining images after renames/moves
```

**Structure Decision**: Next.js file-based metadata approach. Metadata images placed in `app/` directory for automatic route handling. PWA manifest icons remain in `public/` and are referenced by path in `manifest.ts`. This follows Next.js 15+ conventions and provides automatic content-type headers.

## Complexity Tracking

> No violations. Implementation follows standard Next.js metadata patterns with no additional complexity.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
