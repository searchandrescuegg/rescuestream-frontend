# Research: App Metadata Generation

**Feature**: 004-app-metadata
**Date**: 2026-01-22

## Overview

Research findings for implementing comprehensive app metadata in Next.js 15+, covering OpenGraph, Twitter Cards, favicons, Apple Touch icons, and PWA manifest.

---

## 1. Next.js File-Based Metadata Approach

### Decision
Use Next.js file-based metadata conventions where images placed in the `app/` directory are automatically served with correct content-type headers and included in metadata.

### Rationale
- Next.js 15+ automatically detects and serves metadata files from `app/` directory
- Provides automatic `<link>` and `<meta>` tag generation
- Handles content-type headers correctly (important for social media crawlers)
- Reduces boilerplate in `layout.tsx` metadata export
- Files like `icon.png`, `apple-icon.png`, `opengraph-image.png` are recognized by convention

### Alternatives Considered
1. **Manual metadata in layout.tsx only**: Rejected - requires more code and manual path management
2. **All images in public/ with manual links**: Rejected - doesn't leverage Next.js automatic metadata injection
3. **Dynamic image generation with ImageResponse**: Rejected - overkill for static branding images

---

## 2. Favicon Implementation Strategy

### Decision
Use multi-format favicon approach: `app/icon.png` for modern browsers + `public/favicon.ico` for legacy fallback.

### Rationale
- Modern browsers prefer PNG favicons (better quality, transparency support)
- `favicon.ico` at root provides fallback for older browsers and crawlers
- Next.js serves `app/icon.png` with automatic `<link rel="icon">` tags
- Existing `favicon.ico` in public folder requires no changes

### File Mapping
| Source File | Destination | Purpose |
|-------------|-------------|---------|
| `Favicon 128.png` | `app/icon.png` | Primary favicon (128x128) |
| `favicon.ico` | `public/favicon.ico` | Legacy fallback (keep as-is) |
| `Favicon 32.png` | Not needed | Browsers scale down from 128px |
| `Favicon.png` | Not needed | Superseded by 128px version |

---

## 3. OpenGraph & Twitter Card Strategy

### Decision
Place OpenGraph image in `app/opengraph-image.png`; Next.js auto-generates both OpenGraph and Twitter Card meta tags.

### Rationale
- Next.js detects `opengraph-image.png` and generates:
  - `<meta property="og:image" content="...">`
  - `<meta name="twitter:image" content="...">` (when twitter-image not present)
- Single image serves both platforms
- Automatic absolute URL generation in production

### Twitter Card Type
- Use `summary_large_image` for maximum visual impact
- Configure in `layout.tsx` metadata export: `twitter: { card: 'summary_large_image' }`

### File Mapping
| Source File | Destination | Purpose |
|-------------|-------------|---------|
| `OpenGraph Meta Image.png` | `app/opengraph-image.png` | Social sharing preview |

---

## 4. Apple Touch Icon Strategy

### Decision
Use `app/apple-icon.png` for iOS home screen icon (renamed from gradient version per clarification).

### Rationale
- Next.js auto-generates `<link rel="apple-touch-icon">` for files named `apple-icon.png`
- Single 180x180 (or larger) icon is sufficient; iOS scales down as needed
- User preference for gradient version recorded in clarifications

### File Mapping
| Source File | Destination | Purpose |
|-------------|-------------|---------|
| `apple-touch-gradient.png` | `app/apple-icon.png` | iOS home screen icon |
| `apple-touch.png` | Not needed | User chose gradient version |

---

## 5. PWA Manifest Strategy

### Decision
Create `app/manifest.ts` that exports typed manifest configuration referencing icons in `public/`.

### Rationale
- TypeScript file (`manifest.ts`) provides type safety via `MetadataRoute.Manifest`
- Icons in `public/` are referenced by absolute path (`/icon-192.png`, `/icon-512.png`)
- Manifest automatically linked via `<link rel="manifest">`
- Supports standalone display mode for app-like experience

### Manifest Configuration
```typescript
// Key fields
{
  name: "RescueStream Dashboard",
  short_name: "RescueStream",
  description: "Live stream monitoring dashboard for search and rescue operations",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#000000", // Will need to verify against actual branding
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
  ]
}
```

### File Mapping
| Source File | Destination | Purpose |
|-------------|-------------|---------|
| `icon-192.png` | `public/icon-192.png` | PWA icon (keep as-is) |
| `icon-512.png` | `public/icon-512.png` | PWA icon (keep as-is) |

---

## 6. Metadata Export Enhancement

### Decision
Extend existing `layout.tsx` metadata export with comprehensive configuration.

### Rationale
- Existing `layout.tsx` already has basic `title` and `description`
- Adding `metadataBase`, `openGraph`, `twitter`, and `icons` fields completes the setup
- File-based icons (`app/icon.png`, etc.) are auto-detected; only need to specify extras

### Required Additions
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "RescueStream Dashboard",
  description: "Live stream monitoring dashboard for search and rescue operations",
  openGraph: {
    title: "RescueStream Dashboard",
    description: "Live stream monitoring dashboard for search and rescue operations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RescueStream Dashboard",
    description: "Live stream monitoring dashboard for search and rescue operations",
  },
};
```

---

## 7. File Cleanup Summary

### Files to Rename/Move
| Current Name | New Name/Location | Action |
|--------------|-------------------|--------|
| `public/OpenGraph Meta Image.png` | `app/opengraph-image.png` | Move + rename |
| `public/Favicon 128.png` | `app/icon.png` | Move + rename |
| `public/apple-touch-gradient.png` | `app/apple-icon.png` | Move + rename |

### Files to Keep As-Is
| File | Location | Reason |
|------|----------|--------|
| `favicon.ico` | `public/` | Legacy fallback |
| `icon-192.png` | `public/` | PWA manifest icon |
| `icon-512.png` | `public/` | PWA manifest icon |

### Files to Delete (Optional Cleanup)
| File | Reason |
|------|--------|
| `public/Favicon.png` | Superseded by 128px version |
| `public/Favicon 32.png` | Browsers scale from 128px |
| `public/apple-touch.png` | User chose gradient version |
| `public/Main.png` | Not used in metadata |
| `public/icon-512_1.png` | Duplicate/unused |

---

## Validation Checklist

After implementation, validate using:

1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **Lighthouse PWA Audit**: Chrome DevTools → Lighthouse → PWA category
5. **Manual browser tab test**: Verify favicon in Chrome, Firefox, Safari, Edge
6. **iOS Safari Add to Home Screen**: Verify apple-touch-icon appears
7. **Chrome PWA Install**: Verify manifest icons and app name
