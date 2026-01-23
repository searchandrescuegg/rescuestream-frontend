# Research: Legal Pages for OAuth Consent

**Feature**: 005-legal-pages
**Date**: 2026-01-23

## Research Tasks

### 1. Google OAuth Consent Screen Requirements

**Question**: What are Google's requirements for Privacy Policy and Terms of Service pages?

**Decision**: Pages must be publicly accessible URLs that Google reviewers can access without authentication.

**Rationale**: Google OAuth verification requires that the Privacy Policy and Terms of Service URLs provided in the OAuth consent screen configuration are:
- Publicly accessible (no authentication required)
- Hosted on the same domain as the application
- Contain relevant content about data handling and service terms

**Alternatives considered**:
- External hosted legal pages (e.g., legal service provider) - Rejected: adds external dependency
- PDF documents - Rejected: less accessible, harder to maintain

### 2. Next.js App Router Pattern for Public Pages

**Question**: How should public pages be structured alongside authenticated dashboard pages?

**Decision**: Use a `(legal)` route group with its own layout, separate from `(dashboard)` route group.

**Rationale**:
- Route groups in parentheses `()` allow organizing routes without affecting URL structure
- The existing codebase uses `(auth)` for login pages and `(dashboard)` for protected content
- Legal pages need a minimal layout (no sidebar, no auth checks) while maintaining visual consistency

**Alternatives considered**:
- Put under `(auth)` group - Rejected: semantic mismatch, auth group implies login-related pages
- Put under root without route group - Acceptable but less organized
- Put under `public/` as static HTML - Rejected: loses theme support and styling consistency

### 3. Footer Links Placement Strategy

**Question**: Where should legal page links be displayed?

**Decision**: Create a reusable `LegalFooter` component that can be included in:
1. The legal pages layout (for consistent navigation)
2. The login page (already mentions terms, should link to them)
3. Optionally in dashboard sidebar footer (low priority)

**Rationale**:
- Login page already has text "By signing in, you agree to our terms of service and privacy policy" but without links
- Legal pages themselves should have navigation back to the app and cross-links
- Dashboard users rarely need legal pages, but links could be in sidebar footer for completeness

**Alternatives considered**:
- Global footer on all pages - Rejected: dashboard uses sidebar layout, footer doesn't fit naturally
- Only on legal pages - Rejected: login page needs links for compliance

### 4. Legal Content Structure

**Question**: What sections should be included in each legal document?

**Decision**: Follow standard legal document structure for web applications:

**Privacy Policy sections**:
1. Information We Collect (Google OAuth data: email, name, profile picture)
2. How We Use Your Information
3. Data Storage and Security
4. Data Sharing
5. Your Rights
6. Contact Information

**Terms of Service sections**:
1. Service Description
2. User Accounts and Responsibilities
3. Acceptable Use
4. Intellectual Property
5. Limitation of Liability
6. Changes to Terms
7. Governing Law
8. Contact Information

**Rationale**: These sections cover the minimum requirements for Google OAuth verification and standard legal compliance. Content will be specific to RescueStream's actual data handling practices.

**Alternatives considered**:
- Generic boilerplate templates - Rejected: should reflect actual application behavior
- Legal service generated content - Could be done later, start with accurate self-authored content

### 5. Styling and Theme Support

**Question**: How should legal pages be styled?

**Decision**: Use Tailwind CSS prose classes for readable typography with dark mode support via `next-themes`.

**Rationale**:
- `@tailwindcss/typography` provides `prose` class for well-formatted long-form content
- Already using `next-themes` for dark mode throughout the app
- Maintains visual consistency with existing pages

**Alternatives considered**:
- Custom CSS - Rejected: more work, prose classes already optimized for readability
- Markdown files with MDX - Overkill for 2 static pages, adds unnecessary complexity

## Summary of Decisions

| Area | Decision |
|------|----------|
| Route structure | `app/(legal)/privacy/` and `app/(legal)/terms/` |
| Layout | Minimal layout with logo, back navigation, and legal footer |
| Footer component | Reusable `LegalFooter` for legal pages and login page |
| Content format | JSX with Tailwind prose classes |
| Theme support | Dark mode via existing next-themes setup |
| Server/Client | Server Components (no interactivity needed) |

## Dependencies to Add

None - all required dependencies (Tailwind, next-themes) are already installed.

## Files to Create/Modify

**New files**:
- `app/(legal)/layout.tsx` - Legal pages layout
- `app/(legal)/privacy/page.tsx` - Privacy Policy page
- `app/(legal)/terms/page.tsx` - Terms of Service page
- `components/legal-footer.tsx` - Reusable footer with legal links

**Modified files**:
- `app/(auth)/login/page.tsx` - Add links to legal pages in existing text
