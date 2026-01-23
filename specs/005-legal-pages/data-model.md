# Data Model: Legal Pages for OAuth Consent

**Feature**: 005-legal-pages
**Date**: 2026-01-23

## Overview

This feature involves static content pages only. No database entities, API contracts, or state management are required.

## Entities

### LegalDocument (Conceptual)

Static content rendered directly in React components. No runtime data model needed.

| Attribute | Type | Description |
|-----------|------|-------------|
| title | string | Document title ("Privacy Policy" or "Terms of Service") |
| effectiveDate | string | Date the document takes effect |
| lastUpdated | string | Date of last modification |
| sections | Section[] | Ordered list of content sections |

### Section (Conceptual)

| Attribute | Type | Description |
|-----------|------|-------------|
| heading | string | Section title |
| content | ReactNode | Section content (paragraphs, lists) |

## Implementation Notes

Since the legal content is static and unlikely to change frequently:

1. **No database storage** - Content is hardcoded in page components
2. **No API endpoints** - Pages are Server Components with static content
3. **No state management** - No client-side state needed

If future requirements include:
- Dynamic legal content → Consider MDX files or CMS integration
- Version tracking → Add database table for document versions
- User acceptance tracking → Add user_agreements table (out of scope)

## Contracts

No API contracts required for this feature. All content is rendered server-side as static HTML.

## Component Props

### LegalFooter Props

```typescript
interface LegalFooterProps {
  className?: string;
}
```

### LegalPageLayout Props

```typescript
interface LegalLayoutProps {
  children: React.ReactNode;
}
```

These are standard React component props following the codebase conventions.
