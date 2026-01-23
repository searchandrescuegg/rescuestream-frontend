# Quickstart: Legal Pages for OAuth Consent

**Feature**: 005-legal-pages
**Date**: 2026-01-23

## Overview

This feature adds Privacy Policy and Terms of Service pages required for Google OAuth Consent Screen verification.

## Prerequisites

- Node.js 18+ or Bun
- Existing RescueStream frontend codebase

## Implementation Order

### 1. Create Legal Footer Component

Create `components/legal-footer.tsx` - a reusable footer with links to legal pages.

```typescript
// components/legal-footer.tsx
import Link from "next/link";

interface LegalFooterProps {
  className?: string;
}

export function LegalFooter({ className }: LegalFooterProps) {
  return (
    <footer className={className}>
      <nav>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
      </nav>
    </footer>
  );
}
```

### 2. Create Legal Pages Layout

Create `app/(legal)/layout.tsx` - minimal layout for legal pages with logo, navigation, and footer.

Key elements:
- Logo linking back to main app
- Simple centered content area
- Legal footer with cross-links
- Dark mode support via existing theme

### 3. Create Privacy Policy Page

Create `app/(legal)/privacy/page.tsx` with:
- Page metadata for SEO
- Effective date
- All required sections (see spec FR-005)
- Contact email: contact@searchandrescue.gg

### 4. Create Terms of Service Page

Create `app/(legal)/terms/page.tsx` with:
- Page metadata for SEO
- Effective date
- All required sections (see spec FR-006)
- Contact email: contact@searchandrescue.gg

### 5. Update Login Page

Modify `app/(auth)/login/page.tsx`:
- Convert existing "terms of service and privacy policy" text to actual links

## Testing

1. **Public Access Test**:
   ```bash
   # Start dev server
   bun dev

   # In incognito/private browser, access:
   # http://localhost:3000/privacy
   # http://localhost:3000/terms
   # Both should load without requiring login
   ```

2. **Mobile Responsiveness**:
   - Test at 320px, 768px, and 1024px+ viewport widths
   - Content should be readable at all sizes

3. **Dark Mode**:
   - Toggle theme and verify both pages render correctly

4. **Navigation**:
   - Verify logo links back to /streams (or /login if not authenticated)
   - Verify cross-links between Privacy and Terms pages work
   - Verify login page links to both legal pages

## Google OAuth Configuration

After deployment, update Google Cloud Console:

1. Go to APIs & Services → OAuth consent screen
2. Update Privacy Policy URL to: `https://your-domain.com/privacy`
3. Update Terms of Service URL to: `https://your-domain.com/terms`
4. Submit for verification if not already verified

## Files Changed

| File | Action |
|------|--------|
| `components/legal-footer.tsx` | Create |
| `app/(legal)/layout.tsx` | Create |
| `app/(legal)/privacy/page.tsx` | Create |
| `app/(legal)/terms/page.tsx` | Create |
| `app/(auth)/login/page.tsx` | Modify |

## Estimated Effort

This is a straightforward static content feature. The main work is writing the actual legal content for the Privacy Policy and Terms of Service pages.
