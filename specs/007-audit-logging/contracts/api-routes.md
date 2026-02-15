# API Routes Contract: Audit Logging Dashboard

**Branch**: `007-audit-logging` | **Date**: 2026-02-06

## Frontend API Routes

These are Next.js API routes that proxy requests to the RescueStream backend API.

---

### GET /api/audit-logs

Fetch paginated and filtered audit log entries.

**Authentication**: Required (session-based via Auth.js)
**Authorization**: Admin role required

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-indexed) |
| `pageSize` | integer | No | 10 | Items per page (1-100) |
| `eventType` | string | No | - | Filter by event type |
| `actor` | string | No | - | Filter by actor/user |
| `resourceType` | string | No | - | Filter by resource type |
| `resourceId` | string | No | - | Filter by resource ID |
| `from` | string | No | - | Start date (RFC3339) |
| `to` | string | No | - | End date (RFC3339) |

#### Success Response (200)

```json
{
  "audit_logs": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "timestamp": "2026-01-18T10:30:00Z",
      "actor": "admin",
      "action": "create",
      "resource_type": "broadcaster",
      "resource_id": "770e8400-e29b-41d4-a716-446655440002",
      "request_method": "POST",
      "request_path": "/broadcasters",
      "ip_address": "192.168.1.100",
      "outcome": "success",
      "failure_reason": null,
      "metadata": {},
      "request_id": "abc123-def456"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 150
  }
}
```

#### Error Responses

**401 Unauthorized** - Not authenticated
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden** - Not an admin
```json
{
  "error": "Admin privileges required"
}
```

**400 Bad Request** - Invalid parameters
```json
{
  "error": "Invalid 'from' date format"
}
```

**500 Internal Server Error** - Backend API failure
```json
{
  "error": "Failed to fetch audit logs"
}
```

---

## Backend API Mapping

Frontend route `/api/audit-logs` maps to backend `GET /audit-logs` with parameter transformation:

| Frontend Param | Backend Param | Transformation |
|----------------|---------------|----------------|
| `page` | `offset` | `offset = (page - 1) * pageSize` |
| `pageSize` | `limit` | Direct mapping |
| `eventType` | `action` | Map display name to API action |
| `actor` | `actor` | Direct mapping |
| `resourceType` | `resource_type` | Direct mapping |
| `resourceId` | `resource_id` | Direct mapping |
| `from` | `from` | Direct mapping (RFC3339) |
| `to` | `to` | Direct mapping (RFC3339) |

## Event Type Mapping (Frontend to API)

| Frontend `eventType` | API `action` | API `resource_type` |
|---------------------|--------------|---------------------|
| `stream_started` | `started_stream` | `null` |
| `user_login` | `login` | `null` |
| `user_logout` | `logout` | `null` |
| `stream_key_created` | `create` | `stream_key` |
| `stream_key_updated` | `update` | `stream_key` |
| `stream_key_deleted` | `delete` | `stream_key` |
| `broadcaster_created` | `create` | `broadcaster` |
| `broadcaster_updated` | `update` | `broadcaster` |
| `broadcaster_deleted` | `delete` | `broadcaster` |

## Implementation Notes

1. **HMAC Authentication**: The frontend API route must use `getRescueStreamClient()` to sign requests to the backend API.

2. **Error Handling**: Backend errors should be caught and transformed to user-friendly messages. The backend returns RFC 9457 Problem Details format.

3. **Admin Check**: While the backend enforces admin-only access (returns 403), the frontend route should also verify admin status for better UX (faster rejection).

4. **Caching**: No caching at the API route level; SWR handles client-side caching.

5. **Rate Limiting**: Defer to backend rate limiting; frontend should debounce rapid filter changes.
