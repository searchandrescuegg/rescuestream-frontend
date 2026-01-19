# API Integration Contract: RescueStream API

**Date**: 2026-01-18
**Feature**: 001-livestream-dashboard
**API Base URL**: `${RESCUESTREAM_API_URL}` (e.g., `http://localhost:8080`)

## Authentication

All protected endpoints require HMAC-SHA256 signature authentication.

### Headers

| Header | Value |
|--------|-------|
| `X-API-Key` | `${RESCUESTREAM_API_KEY}` |
| `X-Timestamp` | Unix epoch seconds |
| `X-Signature` | HMAC-SHA256 signature |
| `Content-Type` | `application/json` |

### Signature Generation

```typescript
const stringToSign = `${method}\n${path}\n${timestamp}\n${body}`;
const signature = crypto
  .createHmac('sha256', RESCUESTREAM_API_SECRET)
  .update(stringToSign)
  .digest('hex');
```

**Important**: Signature generation MUST occur server-side only to protect the API secret.

---

## Endpoints

### Health Check

```
GET /health
```

**Authentication**: Not required

**Response 200**:
```json
{
  "status": "ok",
  "database": "ok"
}
```

**Response 503** (Degraded):
```json
{
  "status": "degraded",
  "database": "unreachable"
}
```

**Frontend Usage**: Health indicator in sidebar/header, connection status monitoring.

---

### Streams

#### List Active Streams

```
GET /streams
```

**Response 200**:
```json
{
  "streams": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "stream_key_id": "660e8400-e29b-41d4-a716-446655440001",
      "path": "live/stream-abc123",
      "status": "active",
      "started_at": "2026-01-18T10:30:00Z",
      "ended_at": null,
      "source_type": "rtmp",
      "source_id": "192.168.1.100",
      "metadata": {},
      "recording_ref": null,
      "urls": {
        "hls": "http://localhost:8888/live/stream-abc123/index.m3u8",
        "webrtc": "http://localhost:8889/live/stream-abc123"
      }
    }
  ],
  "count": 1
}
```

**Frontend Usage**: Stream grid display, polling every 5 seconds.

#### Get Single Stream

```
GET /streams/{id}
```

**Response 200**: Single stream object (same structure as list item)

**Response 404**:
```json
{
  "type": "/errors/not-found",
  "title": "Not Found",
  "status": 404,
  "detail": "The requested resource was not found",
  "instance": "/streams/invalid-id"
}
```

**Frontend Usage**: Fullscreen stream view, detailed metadata display.

---

### Broadcasters

#### List Broadcasters

```
GET /broadcasters
```

**Response 200**:
```json
{
  "broadcasters": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "display_name": "Field Team Alpha",
      "metadata": {
        "region": "northeast",
        "team_size": 5
      },
      "created_at": "2026-01-15T08:00:00Z",
      "updated_at": "2026-01-15T08:00:00Z"
    }
  ],
  "count": 1
}
```

**Frontend Usage**: Broadcasters data table, stream tile metadata resolution.

#### Create Broadcaster

```
POST /broadcasters
```

**Request Body**:
```json
{
  "display_name": "Field Team Alpha",
  "metadata": {
    "region": "northeast"
  }
}
```

**Response 201**: Created broadcaster object

**Response 400**:
```json
{
  "type": "/errors/invalid-request",
  "title": "Invalid Request",
  "status": 400,
  "detail": "display_name is required",
  "instance": "/broadcasters"
}
```

**Frontend Usage**: "Add Broadcaster" dialog form submission.

#### Get Broadcaster

```
GET /broadcasters/{id}
```

**Response 200**: Single broadcaster object

**Frontend Usage**: Edit dialog pre-population, detail view.

#### Update Broadcaster

```
PATCH /broadcasters/{id}
```

**Request Body**:
```json
{
  "display_name": "Field Team Beta",
  "metadata": {
    "region": "northwest"
  }
}
```

**Response 200**: Updated broadcaster object

**Frontend Usage**: "Edit Broadcaster" dialog form submission.

#### Delete Broadcaster

```
DELETE /broadcasters/{id}
```

**Response 204**: No content

**Frontend Usage**: Delete confirmation dialog action.

---

### Stream Keys

#### List Stream Keys

```
GET /stream-keys
```

**Response 200**:
```json
{
  "stream_keys": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "broadcaster_id": "770e8400-e29b-41d4-a716-446655440002",
      "status": "active",
      "created_at": "2026-01-15T09:00:00Z",
      "expires_at": "2026-02-15T09:00:00Z",
      "revoked_at": null,
      "last_used_at": "2026-01-18T10:30:00Z"
    }
  ],
  "count": 1
}
```

**Note**: `key_value` is NOT included in list responses for security.

**Frontend Usage**: Stream keys data table.

#### Create Stream Key

```
POST /stream-keys
```

**Request Body**:
```json
{
  "broadcaster_id": "770e8400-e29b-41d4-a716-446655440002",
  "expires_at": "2026-02-15T09:00:00Z"
}
```

**Response 201**:
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "key_value": "sk_live_abc123def456ghi789jkl012mno345",
  "broadcaster_id": "770e8400-e29b-41d4-a716-446655440002",
  "status": "active",
  "created_at": "2026-01-18T10:30:00Z",
  "expires_at": "2026-02-15T09:00:00Z",
  "revoked_at": null,
  "last_used_at": null
}
```

**Important**: `key_value` is ONLY returned on creation. Display immediately with copy button.

**Frontend Usage**: "Generate Stream Key" dialog, show key with copy-to-clipboard.

#### Get Stream Key

```
GET /stream-keys/{id}
```

**Response 200**: Single stream key object (without `key_value`)

**Frontend Usage**: Detail view, status checking.

#### Revoke Stream Key

```
DELETE /stream-keys/{id}
```

**Response 204**: No content

**Frontend Usage**: Revoke confirmation dialog action.

---

## Error Handling

All errors follow RFC 9457 Problem Details format.

### Error Response Structure

```typescript
interface APIError {
  type: string;      // Error type URI
  title: string;     // Short title
  status: number;    // HTTP status
  detail: string;    // Human-readable detail
  instance: string;  // Request path
}
```

### Error Type Mapping

| API Error Type | Frontend Action |
|----------------|-----------------|
| `/errors/not-found` | Show "not found" toast, redirect if needed |
| `/errors/invalid-request` | Show validation errors on form fields |
| `/errors/unauthorized` | Redirect to login, show auth error |
| `/errors/conflict` | Show conflict message (e.g., duplicate) |
| `/errors/internal-error` | Show generic error toast, enable retry |

---

## Frontend Implementation

### Server Actions (actions/)

```typescript
// actions/broadcasters.ts
'use server';

export async function createBroadcaster(data: CreateBroadcasterRequest) {
  const client = getRescueStreamClient();
  const result = await client.createBroadcaster(data);
  revalidatePath('/broadcasters');
  return result;
}

export async function updateBroadcaster(id: string, data: UpdateBroadcasterRequest) {
  const client = getRescueStreamClient();
  const result = await client.updateBroadcaster(id, data);
  revalidatePath('/broadcasters');
  return result;
}

export async function deleteBroadcaster(id: string) {
  const client = getRescueStreamClient();
  await client.deleteBroadcaster(id);
  revalidatePath('/broadcasters');
}
```

### Client Hooks (hooks/)

```typescript
// hooks/use-streams.ts
'use client';

import useSWR from 'swr';

export function useStreams() {
  const { data, error, isLoading, mutate } = useSWR<StreamsResponse>(
    '/api/streams',
    fetcher,
    { refreshInterval: 5000 }
  );

  return {
    streams: data?.streams ?? [],
    count: data?.count ?? 0,
    isLoading,
    error,
    refresh: mutate,
  };
}
```

### API Routes (app/api/)

```typescript
// app/api/streams/route.ts
import { getRescueStreamClient } from '@/lib/api/client';

export async function GET() {
  const client = getRescueStreamClient();
  const data = await client.listStreams();
  return Response.json(data);
}
```

---

## Polling Strategy

| Data | Endpoint | Interval | Trigger |
|------|----------|----------|---------|
| Streams | `GET /streams` | 5s | Continuous while on grid page |
| Broadcasters | `GET /broadcasters` | On-demand | After mutations, tab focus |
| Stream Keys | `GET /stream-keys` | On-demand | After mutations, tab focus |
| Health | `GET /health` | 30s | Background check |

---

## Environment Variables

```env
# Required
RESCUESTREAM_API_URL=http://localhost:8080
RESCUESTREAM_API_KEY=admin
RESCUESTREAM_API_SECRET=your-hmac-secret

# Optional
RESCUESTREAM_API_TIMEOUT=10000  # Request timeout in ms
```
