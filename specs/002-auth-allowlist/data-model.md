# Data Model: Auth Allowlist Configuration

**Feature**: 002-auth-allowlist
**Date**: 2026-01-20

## Overview

This feature does not introduce persistent data storage. Allowlist configuration is stored in environment variables and parsed at runtime.

## Entities

### AllowlistConfig

Represents the parsed allowlist configuration loaded from environment variables.

| Field | Type | Description |
|-------|------|-------------|
| `domains` | `string[]` | Normalized domain suffixes (lowercase, no leading @) |
| `emails` | `string[]` | Normalized email addresses (lowercase) |
| `isEmpty` | `boolean` | True if both arrays are empty |

**Source**: Environment variables
- `AUTH_ALLOWED_DOMAINS`: Comma-separated domain list
- `AUTH_ALLOWED_EMAILS`: Comma-separated email list

**Validation Rules**:
- Domains normalized: strip leading `@`, convert to lowercase, trim whitespace
- Emails normalized: convert to lowercase, trim whitespace
- Empty strings filtered out after split

### AuthorizationResult

Represents the result of checking a user's email against allowlists.

| Field | Type | Description |
|-------|------|-------------|
| `allowed` | `boolean` | Whether access is granted |
| `reason` | `AllowReason \| DenyReason` | Why allowed or denied |

**AllowReason** (enum):
- `DOMAIN_MATCH`: User's domain is in domain allowlist
- `EMAIL_MATCH`: User's email is in email allowlist

**DenyReason** (enum):
- `NO_EMAIL`: User has no email address
- `DOMAIN_NOT_ALLOWED`: Domain not in allowlist
- `ALLOWLIST_EMPTY`: Both allowlists are empty (fail-closed)

## Type Definitions

```typescript
// types/auth.ts

export interface AllowlistConfig {
  domains: string[];
  emails: string[];
  isEmpty: boolean;
}

export type AllowReason = 'DOMAIN_MATCH' | 'EMAIL_MATCH';

export type DenyReason = 'NO_EMAIL' | 'DOMAIN_NOT_ALLOWED' | 'ALLOWLIST_EMPTY';

export interface AuthorizationResult {
  allowed: boolean;
  reason: AllowReason | DenyReason;
}
```

## State Transitions

N/A - No stateful entities. Authorization is computed on each request.

## Data Flow

```
┌─────────────────────┐
│ Environment Variables│
│ AUTH_ALLOWED_DOMAINS │
│ AUTH_ALLOWED_EMAILS  │
└──────────┬──────────┘
           │ parse (once per cold start)
           ▼
┌─────────────────────┐
│  AllowlistConfig    │
│  (in-memory)        │
└──────────┬──────────┘
           │ check on each sign-in/request
           ▼
┌─────────────────────┐
│ User Email (from    │
│ OAuth profile)      │
└──────────┬──────────┘
           │ compare
           ▼
┌─────────────────────┐
│ AuthorizationResult │
│ allowed: boolean    │
│ reason: string      │
└─────────────────────┘
```

## Relationships

- **AllowlistConfig ↔ AuthorizationResult**: One config produces one result per user check
- **User Email → AuthorizationResult**: Each email check produces exactly one result

## Notes

- No database tables or persistent storage required
- Config is immutable during application lifecycle (changes require redeploy)
- All comparisons are case-insensitive (data normalized to lowercase)
