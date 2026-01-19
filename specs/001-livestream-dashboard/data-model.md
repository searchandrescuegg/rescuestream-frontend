# Data Model: Livestream Dashboard

**Date**: 2026-01-18
**Feature**: 001-livestream-dashboard

## Overview

This document defines the frontend data model for the Livestream Dashboard. All data is sourced from the RescueStream Go API - the frontend does not manage persistent storage directly.

## Core Entities

### Broadcaster

Represents a user or device authorized to stream.

```typescript
interface Broadcaster {
  id: string;                        // UUID
  display_name: string;              // Human-readable name
  metadata: Record<string, unknown>; // Arbitrary key-value data
  created_at: string;                // ISO 8601 timestamp
  updated_at: string;                // ISO 8601 timestamp
}
```

**Relationships**:
- One-to-many with StreamKey (a broadcaster can have multiple stream keys)

**Validation Rules**:
- `display_name` is required, non-empty
- `metadata` is optional, defaults to empty object

**State Transitions**: N/A (no explicit status field)

---

### StreamKey

Represents streaming credentials assigned to a broadcaster.

```typescript
interface StreamKey {
  id: string;                        // UUID
  key_value?: string;                // Only returned on creation - store securely!
  broadcaster_id: string;            // Foreign key to Broadcaster
  status: 'active' | 'revoked' | 'expired';
  created_at: string;                // ISO 8601 timestamp
  expires_at: string | null;         // Optional expiration
  revoked_at: string | null;         // Set when revoked
  last_used_at: string | null;       // Last stream start time
}
```

**Relationships**:
- Many-to-one with Broadcaster
- One-to-many with Stream (a key can be used for multiple sessions)

**Validation Rules**:
- `broadcaster_id` is required, must reference existing broadcaster
- `expires_at` is optional, must be RFC3339 format if provided

**State Transitions**:
```
[active] --revoke--> [revoked]
[active] --expire--> [expired] (automatic when expires_at passes)
```

**Security Notes**:
- `key_value` is only returned once on creation
- Never log or expose `key_value` after initial display to user

---

### Stream

Represents an active or historical broadcast session.

```typescript
interface Stream {
  id: string;                        // UUID
  stream_key_id: string;             // Foreign key to StreamKey
  path: string;                      // MediaMTX path (e.g., "live/stream-abc123")
  status: 'active' | 'ended';
  started_at: string;                // ISO 8601 timestamp
  ended_at: string | null;           // Set when stream ends
  source_type: string | null;        // e.g., "rtmp"
  source_id: string | null;          // e.g., IP address
  metadata: Record<string, unknown>; // Arbitrary data
  recording_ref: string | null;      // Reference to recording if enabled
  urls: StreamURLs;                  // Playback URLs
}

interface StreamURLs {
  hls: string;                       // HLS playlist URL
  webrtc: string;                    // WebRTC WHEP endpoint
}
```

**Relationships**:
- Many-to-one with StreamKey
- Derived: many-to-one with Broadcaster (via StreamKey)

**Validation Rules**: N/A (read-only from API)

**State Transitions**:
```
[active] --end--> [ended]
```

---

## Derived/Computed Types

### StreamWithBroadcaster

For display in the grid, we need broadcaster info attached to streams.

```typescript
interface StreamWithBroadcaster extends Stream {
  broadcaster: Broadcaster | null;   // Resolved from stream_key_id
}
```

**Usage**: Computed client-side by joining streams with broadcasters/stream-keys.

---

### BroadcasterWithKeyCount

For the broadcasters table, show how many keys each has.

```typescript
interface BroadcasterWithKeyCount extends Broadcaster {
  stream_key_count: number;          // Computed client-side
  active_stream_count: number;       // Computed client-side
}
```

---

## API Response Wrappers

### List Responses

```typescript
interface BroadcastersResponse {
  broadcasters: Broadcaster[];
  count: number;
}

interface StreamKeysResponse {
  stream_keys: StreamKey[];
  count: number;
}

interface StreamsResponse {
  streams: Stream[];
  count: number;
}
```

### Error Response

All API errors follow RFC 9457 Problem Details format:

```typescript
interface APIError {
  type: string;      // e.g., "/errors/not-found"
  title: string;     // e.g., "Not Found"
  status: number;    // HTTP status code
  detail: string;    // Human-readable explanation
  instance: string;  // Request path
}
```

**Error Types**:
| Type | Status | Description |
|------|--------|-------------|
| `/errors/not-found` | 404 | Resource not found |
| `/errors/invalid-request` | 400 | Validation failure |
| `/errors/unauthorized` | 401 | Authentication failed |
| `/errors/conflict` | 409 | Duplicate/conflict |
| `/errors/internal-error` | 500 | Server error |

---

## Request Payloads

### CreateBroadcasterRequest

```typescript
interface CreateBroadcasterRequest {
  display_name: string;              // Required
  metadata?: Record<string, unknown>;
}
```

### UpdateBroadcasterRequest

```typescript
interface UpdateBroadcasterRequest {
  display_name?: string;
  metadata?: Record<string, unknown>; // Replaces existing
}
```

### CreateStreamKeyRequest

```typescript
interface CreateStreamKeyRequest {
  broadcaster_id: string;            // Required, UUID
  expires_at?: string;               // Optional, RFC3339
}
```

---

## UI State Types

### StreamGridState

```typescript
interface StreamGridState {
  streams: StreamWithBroadcaster[];
  page: number;
  pageSize: 9;                       // Fixed at 9 (3x3 max)
  totalPages: number;
  selectedStreamId: string | null;   // For fullscreen mode
  isLoading: boolean;
  error: string | null;
}
```

### TableState (generic)

```typescript
interface TableState<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  sorting: SortingState;             // TanStack Table
  pagination: PaginationState;       // TanStack Table
  columnFilters: ColumnFiltersState; // TanStack Table
}
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     RescueStream API                        │
│  /broadcasters  /stream-keys  /streams  /health             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HMAC-authenticated requests
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   lib/api/client.ts                         │
│  - HMAC signature generation                                │
│  - Request/response type mapping                            │
│  - Error handling                                           │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │   actions/  │   │   hooks/    │   │   app/api/  │
    │  (Server    │   │  (SWR for   │   │  (Optional  │
    │   Actions)  │   │   polling)  │   │   routes)   │
    └─────────────┘   └─────────────┘   └─────────────┘
              │               │               │
              └───────────────┼───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Components                              │
│  StreamGrid, BroadcasterTable, StreamKeyTable, etc.         │
└─────────────────────────────────────────────────────────────┘
```

---

## Caching Strategy

| Data | Cache Duration | Refresh Strategy |
|------|---------------|------------------|
| Streams list | 5 seconds | SWR polling with `refreshInterval: 5000` |
| Broadcasters | 30 seconds | SWR with revalidation on mutation |
| Stream Keys | 30 seconds | SWR with revalidation on mutation |
| Single stream | 5 seconds | SWR polling for active streams |

---

## File Locations

```
types/
├── api.ts           # All API types (Broadcaster, StreamKey, Stream, etc.)
├── ui.ts            # UI state types (StreamGridState, etc.)
└── index.ts         # Re-exports
```
