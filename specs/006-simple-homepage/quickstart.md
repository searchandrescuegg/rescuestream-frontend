# Quickstart: Simple Homepage

**Feature**: 006-simple-homepage
**Date**: 2026-01-23

## Prerequisites

- Node.js 18+ or Bun runtime
- Project dependencies installed (`bun install`)

## Development Setup

1. **Ensure you're on the feature branch**:
   ```bash
   git checkout 006-simple-homepage
   ```

2. **Install dependencies** (if not already done):
   ```bash
   bun install
   ```

3. **Start the development server**:
   ```bash
   bun dev
   ```

4. **View the homepage**:
   Open `http://localhost:3000` in your browser.

## File Structure to Create

```text
app/
└── (home)/
    ├── layout.tsx      # Homepage layout (header, footer)
    └── page.tsx        # Homepage content

components/
└── home/
    └── feature-card.tsx  # Reusable feature card
```

## Implementation Order

1. **Create `components/home/feature-card.tsx`**
   - Simple component with icon, title, description props
   - Uses existing Card component styling

2. **Create `app/(home)/layout.tsx`**
   - Header with logo (dark/light mode)
   - Navigation link to dashboard/login
   - Footer with legal page links

3. **Create `app/(home)/page.tsx`**
   - Hero section with headline and tagline
   - Features grid (2x2 on desktop, stacked on mobile)
   - CTA button linking to /streams

4. **Remove redirect from `app/page.tsx`**
   - The root page currently redirects to /streams
   - Keep the redirect or update as needed

## Testing Checklist

- [ ] Homepage loads at root URL (`/`)
- [ ] Hero section displays correctly
- [ ] All 4 feature cards render
- [ ] CTA button navigates to /streams (or /login if unauthenticated)
- [ ] Dark mode toggle works (inherited from root layout)
- [ ] Responsive layout works on mobile (320px+)
- [ ] Footer links to /privacy and /terms work
- [ ] Logo displays correctly in both light and dark modes

## No API Endpoints

This feature is entirely static and does not require any API changes.

## No Environment Variables

No new environment variables are required for this feature.
