# Data Model: Audit Logging Dashboard

**Branch**: `007-audit-logging` | **Date**: 2026-02-06

## Entities

### AuditLogEntry

Represents a single audit event from the RescueStream API.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Unique identifier |
| `timestamp` | `string` (RFC3339) | Yes | When the event occurred |
| `actor` | `string` | Yes | API key identifier / user who performed action |
| `action` | `string` | Yes | Action type (create, update, delete, login, logout, etc.) |
| `resource_type` | `string \| null` | No | Type of resource affected (broadcaster, stream, stream_key) |
| `resource_id` | `string \| null` | No | UUID of affected resource |
| `request_method` | `string` | Yes | HTTP method (GET, POST, PATCH, DELETE) |
| `request_path` | `string` | Yes | API endpoint path |
| `ip_address` | `string` | Yes | Client IP address |
| `outcome` | `'success' \| 'failure'` | Yes | Whether the action succeeded |
| `failure_reason` | `string \| null` | No | Error message if outcome is failure |
| `metadata` | `Record<string, unknown>` | Yes | Additional event-specific data |
| `request_id` | `string \| null` | No | Request correlation ID |

**Notes**:
- `actor` corresponds to the API key name (e.g., "admin", "frontend-app")
- For user-initiated actions via frontend, `metadata` may contain `user_email`
- `metadata` for stream key events contains key name, partial key, broadcaster info

### AuditLogPagination

Pagination metadata returned by the API.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `limit` | `number` | Yes | Max items per page |
| `offset` | `number` | Yes | Current offset |
| `total` | `number` | Yes | Total count of matching records |

### AuditLogsResponse

API response wrapper for audit log list.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `audit_logs` | `AuditLogEntry[]` | Yes | Array of audit entries |
| `pagination` | `AuditLogPagination` | Yes | Pagination metadata |

### AuditLogFilters

Client-side filter state for audit log queries.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `eventType` | `string \| null` | No | Filter by mapped event type |
| `actor` | `string \| null` | No | Filter by user/actor |
| `resourceType` | `string \| null` | No | Filter by resource type |
| `resourceId` | `string \| null` | No | Filter by specific resource |
| `from` | `Date \| null` | No | Start date filter |
| `to` | `Date \| null` | No | End date filter |

## Event Type Mapping

Mapping between spec-defined event types and API action/resource combinations:

| Display Name | API `action` | API `resource_type` | Icon |
|--------------|--------------|---------------------|------|
| Stream Started | `started_stream` | `null` | IconPlayerPlay |
| User Login | `login` | `null` | IconLogin |
| User Logout | `logout` | `null` | IconLogout |
| Stream Key Created | `create` | `stream_key` | IconKeyPlus |
| Stream Key Updated | `update` | `stream_key` | IconKeyOff |
| Stream Key Deleted | `delete` | `stream_key` | IconKeyMinus |
| Broadcaster Created | `create` | `broadcaster` | IconUserPlus |
| Broadcaster Updated | `update` | `broadcaster` | IconUserEdit |
| Broadcaster Deleted | `delete` | `broadcaster` | IconUserMinus |

## Validation Rules

### Filter Validation
- `from` must be before `to` if both provided
- `limit` must be between 1 and 100 (API constraint)
- `offset` must be non-negative
- `resourceId` must be valid UUID format if provided

### Display Rules
- Timestamps displayed in user's local timezone
- Stream key values masked: show only last 4 characters (`••••xxxx`)
- Long metadata values truncated with "View more" option
- Empty `actor` defaults to "System"

## Relationships

```
AuditLogEntry
    └── resource_id → links to:
        ├── Broadcaster (when resource_type = "broadcaster")
        ├── StreamKey (when resource_type = "stream_key")
        └── Stream (when resource_type = "stream")
```

## TypeScript Definitions

```typescript
// types/api.ts - additions

export interface AuditLogEntry {
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

export interface AuditLogPagination {
  limit: number;
  offset: number;
  total: number;
}

export interface AuditLogsResponse {
  audit_logs: AuditLogEntry[];
  pagination: AuditLogPagination;
}

export interface AuditLogFilters {
  eventType?: string;
  actor?: string;
  resourceType?: string;
  resourceId?: string;
  from?: string; // RFC3339
  to?: string;   // RFC3339
}

export type AuditLogOutcome = 'success' | 'failure';

export type AuditEventType =
  | 'stream_started'
  | 'user_login'
  | 'user_logout'
  | 'stream_key_created'
  | 'stream_key_updated'
  | 'stream_key_deleted'
  | 'broadcaster_created'
  | 'broadcaster_updated'
  | 'broadcaster_deleted';
```

## State Transitions

Audit log entries are immutable - no state transitions occur. The `outcome` field is set at creation time and never changes.

## Data Volume Considerations

- Default page size: 10 entries (per spec clarification)
- API max page size: 100 entries
- Expected volume: Varies by usage; pagination handles large datasets
- No client-side caching beyond SWR defaults (manual refresh pattern)
