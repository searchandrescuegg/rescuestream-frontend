# API Contracts: Legal Pages

**Feature**: 005-legal-pages

## Overview

This feature does not require any API contracts.

The legal pages are static Server Components that render content directly without making any API calls. All content is embedded in the page components themselves.

## Future Considerations

If the legal pages ever need to be managed dynamically (e.g., through a CMS or admin interface), the following endpoints could be added:

```
GET /api/legal/privacy    → Returns Privacy Policy content
GET /api/legal/terms      → Returns Terms of Service content
```

However, this is explicitly out of scope for the current implementation per the feature specification.
