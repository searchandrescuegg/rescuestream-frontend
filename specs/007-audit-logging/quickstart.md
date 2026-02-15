# Quickstart: Audit Logging Dashboard

**Branch**: `007-audit-logging` | **Date**: 2026-02-06

## Prerequisites

- Node.js 18+ / Bun runtime
- RescueStream API running locally or accessible
- Environment variables configured (see below)

## Environment Setup

Ensure these variables are set in `.env.local`:

```bash
# Existing API configuration
RESCUESTREAM_API_URL=http://localhost:8080
RESCUESTREAM_API_KEY=admin
RESCUESTREAM_API_SECRET=your-secret-key

# Auth configuration (existing)
AUTH_SECRET=your-auth-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Optional: Admin email allowlist (comma-separated)
ADMIN_EMAILS=admin@example.com,superuser@example.com
```

## Quick Start Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Navigate to audit logs (when logged in as admin)
open http://localhost:3000/audit-logs
```

## Feature Files Overview

| File | Purpose |
|------|---------|
| `app/(dashboard)/audit-logs/page.tsx` | Page component (entry point) |
| `components/audit-logs/audit-log-table.tsx` | Main data table |
| `components/audit-logs/audit-log-columns.tsx` | Column definitions |
| `components/audit-logs/audit-log-filters.tsx` | Filter controls |
| `components/audit-logs/audit-log-detail.tsx` | Event detail view |
| `hooks/use-audit-logs.ts` | SWR data fetching hook |
| `lib/api/audit-logs.ts` | API client functions |
| `app/api/audit-logs/route.ts` | Next.js API route |
| `types/api.ts` | TypeScript type additions |

## Testing the Feature

### Manual Testing Checklist

1. **Page Load**
   - [ ] Navigate to `/audit-logs` as an admin user
   - [ ] Table loads with audit events
   - [ ] Loading skeleton shown while fetching

2. **Pagination**
   - [ ] Page controls visible when >10 events
   - [ ] Next/Previous buttons work
   - [ ] Page size selector works (10, 20, 30, 50)

3. **Filtering**
   - [ ] Event type dropdown filters correctly
   - [ ] Search input filters by actor
   - [ ] Clear filters button resets view

4. **Event Details**
   - [ ] Click row to expand details
   - [ ] Stream ID visible for stream events
   - [ ] Key info (masked) visible for key events

5. **Access Control**
   - [ ] Non-admin users see 403 or redirect
   - [ ] Navigation hidden for non-admins

6. **Error States**
   - [ ] API error shows user-friendly message
   - [ ] Retry button available on error
   - [ ] Empty state shown when no events

### Generate Test Data

Use the RescueStream API to create audit events:

```bash
# Login event
./scripts/api-test.sh POST /audit-events '{"event_type":"login"}'

# Logout event
./scripts/api-test.sh POST /audit-events '{"event_type":"logout"}'

# Create broadcaster (generates audit entry automatically)
./scripts/api-test.sh POST /broadcasters '{"display_name":"Test Team"}'

# Create stream key (generates audit entry automatically)
./scripts/api-test.sh POST /stream-keys '{"broadcaster_id":"<broadcaster-id>"}'
```

## Common Development Tasks

### Add a new column

1. Edit `components/audit-logs/audit-log-columns.tsx`
2. Add new `ColumnDef` to the columns array
3. Update types if needed in `types/api.ts`

### Change default page size

1. Edit `hooks/use-audit-logs.ts`
2. Modify `DEFAULT_PAGE_SIZE` constant

### Add new filter

1. Edit `components/audit-logs/audit-log-filters.tsx`
2. Add filter control UI
3. Update `AuditLogFilters` type in `types/api.ts`
4. Update `use-audit-logs.ts` to include filter in query

### Modify event type mapping

1. Edit `lib/api/audit-logs.ts`
2. Update `EVENT_TYPE_MAP` constant
3. Update display labels in `audit-log-columns.tsx`

## Troubleshooting

### "Admin privileges required" error
- Verify your email is in `ADMIN_EMAILS` environment variable
- Check that backend API key has admin privileges

### Empty audit log table
- Verify RescueStream API is running
- Check that audit events exist: `./scripts/api-test.sh GET /audit-logs`
- Verify HMAC credentials are correct

### Filters not working
- Check browser console for API errors
- Verify query parameters are being sent correctly
- Check that backend supports the filter combination

## Architecture Reference

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────┐ │
│  │ audit-logs  │───▶│ use-audit-   │───▶│ /api/audit-   │ │
│  │ page.tsx    │    │ logs.ts      │    │ logs/route.ts │ │
│  └─────────────┘    │ (SWR hook)   │    └───────┬────────┘ │
│         │           └──────────────┘            │          │
│         ▼                                       │          │
│  ┌─────────────┐                                │          │
│  │ audit-log-  │                                │          │
│  │ table.tsx   │                                │          │
│  └─────────────┘                                │          │
└─────────────────────────────────────────────────┼──────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Server                            │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────┐         ┌─────────────────────────────┐│
│  │ lib/api/       │────────▶│ RescueStreamClient          ││
│  │ audit-logs.ts  │         │ (HMAC-signed requests)      ││
│  └────────────────┘         └──────────────┬──────────────┘│
└────────────────────────────────────────────┼───────────────┘
                                             │
                                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   RescueStream API                          │
├─────────────────────────────────────────────────────────────┤
│  GET /audit-logs?action=...&limit=10&offset=0               │
└─────────────────────────────────────────────────────────────┘
```
