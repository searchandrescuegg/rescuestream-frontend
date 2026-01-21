# Research: Auth Allowlist Configuration

**Feature**: 002-auth-allowlist
**Date**: 2026-01-20

## Research Topics

### 1. Auth.js v5 Callback Selection for Authorization

**Decision**: Use the `signIn` callback for email/domain allowlist checks

**Rationale**:
- Runs before JWT is created, allowing early rejection of unauthorized users
- Supports returning URL strings for custom error page redirects
- Has access to both `user.email` and `profile.email` from OAuth provider
- Google's `profile.email_verified` boolean available for verification check

**Alternatives Considered**:
| Callback | Why Not Chosen |
|----------|---------------|
| `jwt` | Runs after sign-in is allowed; too late for rejection |
| `session` | Only exposes data to client, doesn't control access |
| `authorized` | Route-level protection only; doesn't prevent token creation |

### 2. Rejecting Sign-in Attempts

**Decision**: Return URL string to redirect to custom access-denied page

**Rationale**:
- Returning `false` shows generic Auth.js error page (poor UX)
- Returning URL string allows custom error page with specific messaging
- Query parameters can indicate reason (e.g., `?error=AccessDenied`)

**Implementation Pattern**:
```typescript
async signIn({ user, profile }) {
  if (!isAllowed(user.email)) {
    return '/access-denied';  // Redirect to custom page
  }
  return true;
}
```

### 3. Custom Error Page Location

**Decision**: Create `/app/(auth)/access-denied/page.tsx`

**Rationale**:
- Follows existing `(auth)` route group pattern
- Separate from `/login` to maintain clear UX flow
- Server Component by default (no client-side state needed)
- URL-based error parameter not needed since only one error type

### 4. Accessing User Email in Callbacks

**Decision**: Use `profile?.email || user.email` with lowercase normalization

**Rationale**:
- Google provides email in both `user` and `profile` objects
- `profile.email_verified` confirms Google has verified the email
- Case-insensitive matching requires lowercase normalization

**Google Profile Object Structure**:
- `email`: User's email address
- `email_verified`: Boolean (true if Google verified)
- `picture`: Profile image URL

### 5. Environment Variable Configuration

**Decision**: Two environment variables with comma-separated values

**Rationale**:
- `AUTH_ALLOWED_DOMAINS`: Comma-separated domain list (e.g., `searchandrescue.gg,partner.org`)
- `AUTH_ALLOWED_EMAILS`: Comma-separated email list (e.g., `contractor@external.com`)
- Standard Next.js pattern for configuration
- Server-side only (no `NEXT_PUBLIC_` prefix) for security

**Parsing Pattern**:
```typescript
const domains = (process.env.AUTH_ALLOWED_DOMAINS || '')
  .split(',')
  .map(d => d.trim().toLowerCase())
  .filter(Boolean);
```

### 6. Authorization Re-validation on Navigation

**Decision**: Check allowlist in `authorized` callback on each request

**Rationale**:
- Per FR-013, must re-validate on each page navigation
- `authorized` callback runs in middleware for every request
- Can access user email from `auth?.user?.email`
- Redirect to `/access-denied` if no longer authorized

**Note**: Since allowlist changes require redeployment (per clarification), this primarily catches edge cases where a user's email might change or tokens persist across deploys.

### 7. Logging Denied Access Attempts

**Decision**: Use `console.warn` for server-side logging

**Rationale**:
- No external logging infrastructure specified
- `console.warn` writes to server logs (captured by deployment platform)
- Log format: `[AUTH] Access denied: email=<email>, reason=<reason>, timestamp=<ISO>`
- Meets FR-014 requirements for email, timestamp, and reason capture

## Key Implementation Notes

1. **Fail-closed security**: If both allowlists are empty, deny all access
2. **Order of checks**: Email allowlist first (more specific), then domain allowlist
3. **Domain normalization**: Strip leading `@` if present, lowercase all comparisons
4. **No subdomain wildcard**: `company.com` does NOT match `sub.company.com`
