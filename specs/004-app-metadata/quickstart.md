# Quickstart: App Metadata Generation

**Feature**: 004-app-metadata
**Date**: 2026-01-22

## Prerequisites

- Node.js 18+ / Bun runtime
- Existing RescueStream frontend repository checked out
- Images already present in `public/` folder

## Implementation Steps

### Step 1: Rename and Move Image Files

```bash
# Move and rename images to app/ directory
mv "public/OpenGraph Meta Image.png" app/opengraph-image.png
mv "public/Favicon 128.png" app/icon.png
mv "public/apple-touch-gradient.png" app/apple-icon.png
```

### Step 2: Create Web App Manifest

Create `app/manifest.ts`:

```typescript
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RescueStream Dashboard',
    short_name: 'RescueStream',
    description: 'Live stream monitoring dashboard for search and rescue operations',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
```

### Step 3: Update Layout Metadata

Update `app/layout.tsx` metadata export:

```typescript
import type { Metadata } from "next";

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

### Step 4: Clean Up Unused Files (Optional)

```bash
# Remove superseded/unused files
rm "public/Favicon.png"
rm "public/Favicon 32.png"
rm "public/apple-touch.png"
rm "public/Main.png"
rm "public/icon-512_1.png"
```

### Step 5: Set Environment Variable (Production)

Add to production environment:

```env
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
```

## Verification

### Local Development

```bash
bun dev
```

1. Open http://localhost:3000
2. Check browser tab for favicon
3. Inspect HTML head for meta tags

### Production Validation

1. **Facebook**: https://developers.facebook.com/tools/debug/
2. **Twitter**: https://cards-dev.twitter.com/validator
3. **Lighthouse**: Chrome DevTools → Lighthouse → Run PWA audit

## File Structure After Implementation

```
app/
├── layout.tsx           # Updated with metadata
├── manifest.ts          # New - PWA manifest
├── icon.png             # Moved from public/Favicon 128.png
├── apple-icon.png       # Moved from public/apple-touch-gradient.png
└── opengraph-image.png  # Moved from public/OpenGraph Meta Image.png

public/
├── favicon.ico          # Unchanged
├── icon-192.png         # Unchanged
└── icon-512.png         # Unchanged
```

## Troubleshooting

### Social media preview not showing

- Clear platform cache using debugger tools
- Verify `NEXT_PUBLIC_BASE_URL` is set correctly in production
- Check that images are accessible at their URLs

### Favicon not appearing

- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Clear browser cache
- Verify `app/icon.png` exists and is valid PNG

### PWA install prompt not appearing

- Ensure site is served over HTTPS (required for PWA)
- Check manifest.ts for syntax errors
- Verify icons are accessible at `/icon-192.png` and `/icon-512.png`
