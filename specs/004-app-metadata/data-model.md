# Data Model: App Metadata Generation

**Feature**: 004-app-metadata
**Date**: 2026-01-22

## Overview

This feature involves static configuration and files rather than database entities. This document defines the metadata configuration structure and file artifacts.

---

## Configuration Entities

### 1. Root Metadata Configuration

**Location**: `app/layout.tsx` → `metadata` export

```typescript
interface AppMetadata {
  metadataBase: URL;                    // Base URL for absolute path resolution
  title: string;                        // "RescueStream Dashboard"
  description: string;                  // App description for SEO/sharing
  openGraph: OpenGraphMetadata;         // Social sharing config
  twitter: TwitterMetadata;             // Twitter Card config
}

interface OpenGraphMetadata {
  title: string;                        // Same as root title
  description: string;                  // Same as root description
  type: "website";                      // Static type for dashboard
}

interface TwitterMetadata {
  card: "summary_large_image";          // Large preview card
  title: string;                        // Same as root title
  description: string;                  // Same as root description
}
```

### 2. Web App Manifest

**Location**: `app/manifest.ts` → default export

```typescript
interface WebAppManifest {
  name: string;                         // "RescueStream Dashboard"
  short_name: string;                   // "RescueStream"
  description: string;                  // App description
  start_url: string;                    // "/"
  display: "standalone";                // App-like display mode
  background_color: string;             // Background color (hex)
  theme_color: string;                  // Theme color for browser chrome
  icons: ManifestIcon[];                // PWA icon references
}

interface ManifestIcon {
  src: string;                          // Path from public/ (e.g., "/icon-192.png")
  sizes: string;                        // Dimensions (e.g., "192x192")
  type: "image/png";                    // MIME type
  purpose?: "any" | "maskable";         // Icon purpose (optional)
}
```

---

## File Artifacts

### Metadata Images (app/ directory)

| File | Dimensions | Format | Purpose | Auto-Generated Tags |
|------|-----------|--------|---------|---------------------|
| `icon.png` | 128x128 | PNG | Browser favicon | `<link rel="icon">` |
| `apple-icon.png` | 180x180 | PNG | iOS home screen | `<link rel="apple-touch-icon">` |
| `opengraph-image.png` | 1200x630 | PNG | Social sharing | `<meta property="og:image">`, `<meta name="twitter:image">` |

### Static Assets (public/ directory)

| File | Dimensions | Format | Purpose | Reference Method |
|------|-----------|--------|---------|------------------|
| `favicon.ico` | Multi-res | ICO | Legacy fallback | Auto-served at `/favicon.ico` |
| `icon-192.png` | 192x192 | PNG | PWA icon (small) | Referenced in manifest.ts |
| `icon-512.png` | 512x512 | PNG | PWA icon (large) | Referenced in manifest.ts |

---

## File Mapping (Source → Destination)

| Source (public/) | Destination | Operation |
|-----------------|-------------|-----------|
| `OpenGraph Meta Image.png` | `app/opengraph-image.png` | Move + rename |
| `Favicon 128.png` | `app/icon.png` | Move + rename |
| `apple-touch-gradient.png` | `app/apple-icon.png` | Move + rename |
| `favicon.ico` | `public/favicon.ico` | Keep (no change) |
| `icon-192.png` | `public/icon-192.png` | Keep (no change) |
| `icon-512.png` | `public/icon-512.png` | Keep (no change) |

### Files to Remove (cleanup)

| File | Reason |
|------|--------|
| `Favicon.png` | Superseded by 128px version |
| `Favicon 32.png` | Browsers scale from 128px |
| `apple-touch.png` | User chose gradient version |
| `Main.png` | Not used in metadata |
| `icon-512_1.png` | Duplicate/unused |

---

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_BASE_URL` | Production | `http://localhost:3000` | Base URL for metadataBase |

---

## Relationships

```
app/layout.tsx (metadata export)
    ├── references → app/icon.png (auto-detected)
    ├── references → app/apple-icon.png (auto-detected)
    ├── references → app/opengraph-image.png (auto-detected)
    └── links to → app/manifest.ts

app/manifest.ts
    ├── references → public/icon-192.png
    └── references → public/icon-512.png

public/favicon.ico
    └── auto-served at /favicon.ico (no explicit reference needed)
```
