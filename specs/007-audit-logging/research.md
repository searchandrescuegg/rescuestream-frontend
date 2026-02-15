# Research: Audit Logging Dashboard

**Branch**: `007-audit-logging` | **Date**: 2026-02-06

## API Contract Analysis

### Decision: Use existing RescueStream API audit endpoints
**Rationale**: The API already provides fully-featured audit logging endpoints with pagination, filtering, and proper authentication.

**Endpoints discovered**:
- `GET /audit-logs` - List audit entries with filtering (requires admin)
- `POST /audit-events` - Submit custom events (any authenticated user)

**API Response Shape**:
```typescript
interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  request_method: string;
  request_path: string;
  ip_address: string;
  outcome: 'success' | 'failure';
  failure_reason: string | null;
  metadata: Record<string, unknown>;
  request_id: string | null;
}

interface AuditLogListResponse {
  audit_logs: AuditLogEntry[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}
```

**Query Parameters Available**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | RFC3339 | Start timestamp (inclusive) |
| `to` | RFC3339 | End timestamp (exclusive) |
| `actor` | string | Filter by API key identifier |
| `action` | string | Filter by action type |
| `resource_type` | string | Filter by resource type |
| `resource_id` | UUID | Filter by specific resource |
| `limit` | 1-100 | Max entries per page (default 50) |
| `offset` | integer | Pagination offset (default 0) |

**Alternatives considered**:
- Building custom logging in frontend: Rejected - API provides comprehensive logging
- Using third-party logging service: Rejected - API already handles this

---

## Event Type Mapping

### Decision: Map API action types to user-friendly display names
**Rationale**: The API uses action names like `create`, `update`, `delete` combined with `resource_type`. Need to present as user-friendly event types per spec.

**Mapping Strategy**:
| Spec Event Type | API action | API resource_type | Display Label |
|-----------------|------------|-------------------|---------------|
| `stream_started` | `login` (event_type) | null | Stream Started |
| `user_login` | `login` | null | User Login |
| `user_logout` | `logout` | null | User Logout |
| `stream_key_created` | `create` | `stream_key` | Stream Key Created |
| `stream_key_deleted` | `delete` | `stream_key` | Stream Key Deleted |
| `stream_key_updated` | `update` | `stream_key` | Stream Key Updated |

**Note**: The API tracks these via `POST /audit-events` with `event_type` field for custom events (login, logout, started_stream) and automatic logging for CRUD operations.

---

## Data Table Implementation

### Decision: Use @tanstack/react-table with shadcn/ui DataTable pattern
**Rationale**: Existing codebase uses this pattern for broadcaster-table.tsx and stream-key-table.tsx. Maintains consistency and leverages existing infrastructure.

**Key files to follow**:
- `components/broadcasters/broadcaster-table.tsx` - Table structure
- `components/broadcasters/broadcaster-columns.tsx` - Column definitions
- `components/ui/data-table.tsx` - Base table component

**Features from existing pattern**:
- Server-side pagination (via SWR)
- Column visibility toggles
- Skeleton loading states
- Responsive design
- Action dropdown menus

---

## Navigation & Access Control

### Decision: Add top-level sidebar item with admin-only visibility
**Rationale**: Per clarification, audit logs should be a top-level navigation item visible only to administrators.

**Implementation approach**:
1. Add entry to `navMain` array in `app-sidebar.tsx`
2. Conditionally render based on user role/email
3. API enforces admin access (returns 403 for non-admins)
4. Frontend should also hide navigation item from non-admins

**Current auth pattern** (`lib/auth.ts`):
- Uses allowlist for sign-in authorization
- No explicit role system yet
- Admin check needs to be implemented (could use allowlist or new role field)

**Recommended approach**:
- Check if user email is in an admin allowlist (similar to sign-in allowlist)
- Environment variable: `ADMIN_EMAILS` or similar
- Falls back to API 403 response if frontend check bypassed

---

## Data Fetching Strategy

### Decision: Use SWR with manual refresh (no auto-refresh)
**Rationale**: Per clarification, audit logs should use manual refresh only. SWR provides caching, error handling, and mutation support.

**Implementation**:
```typescript
// hooks/use-audit-logs.ts
const { data, error, isLoading, mutate } = useSWR<AuditLogsResponse>(
  `/api/audit-logs?${queryParams}`,
  fetcher,
  { refreshInterval: 0 } // Manual refresh only
);
```

**Alternatives considered**:
- React Query: Rejected - SWR already used in codebase
- Direct fetch in useEffect: Rejected - SWR provides better caching/deduplication
- Auto-refresh: Rejected - Per spec clarification

---

## Sensitive Data Handling

### Decision: Display partial stream key (last 4 chars) with broadcaster name
**Rationale**: Per clarification, key event details should include key name, timestamp, partial key (last 4 chars), and associated broadcaster name.

**Implementation**:
- API returns `metadata` field with key info
- Frontend extracts and masks key value: `••••${key.slice(-4)}`
- Broadcaster lookup from `resource_id` if needed

---

## Pagination Strategy

### Decision: Use offset-based pagination with 10 items per page
**Rationale**: API supports offset/limit pagination. Spec clarification specifies 10 events per page default.

**Implementation**:
- API default is 50, but we request 10 via `limit=10`
- Track current page in component state
- Calculate offset: `offset = (page - 1) * pageSize`
- Use `pagination.total` for page count calculation

---

## Search/Filter Architecture

### Decision: Server-side filtering via API query parameters
**Rationale**: API supports filtering by actor, action, resource_type, resource_id, and date range. More efficient than client-side filtering.

**Implementation approach**:
1. Event type filter → maps to `action` + `resource_type` params
2. Search by user → maps to `actor` param
3. Search by details → Client-side search within displayed results (API doesn't support full-text)

**Filter state management**:
- URL query params for shareable/bookmarkable filters
- React state for immediate UI response
- Sync state to URL on filter change

---

## UI Component Architecture

### Decision: Create dedicated audit-logs component directory
**Rationale**: Follows existing pattern (components/broadcasters/, components/stream-keys/).

**Component structure**:
```
components/audit-logs/
├── audit-log-table.tsx      # Main table component
├── audit-log-columns.tsx    # Column definitions
├── audit-log-filters.tsx    # Filter controls
└── audit-log-detail.tsx     # Event detail view (drawer/sheet)
```

---

## Outstanding Questions (Resolved)

All clarifications from spec have been resolved. No blocking unknowns remain.
