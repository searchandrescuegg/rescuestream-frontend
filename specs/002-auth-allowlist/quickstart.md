# Quickstart: Auth Allowlist Configuration

**Feature**: 002-auth-allowlist
**Date**: 2026-01-20

## Prerequisites

- Existing RescueStream Frontend codebase with Auth.js configured
- Google OAuth credentials already set up
- Node.js 18+ / Bun runtime

## Configuration

### 1. Set Environment Variables

Add to your `.env.local` (development) or deployment environment:

```bash
# Domain allowlist - users from these domains are authorized
AUTH_ALLOWED_DOMAINS=searchandrescue.gg,partner.org

# Email allowlist - specific emails authorized regardless of domain
AUTH_ALLOWED_EMAILS=contractor@external.com,consultant@gmail.com
```

**Rules**:
- Comma-separated, no spaces around commas
- Domains without `@` prefix (e.g., `searchandrescue.gg` not `@searchandrescue.gg`)
- Case-insensitive (stored lowercase internally)
- At least one list must have entries, or all access is denied

### 2. Verify Configuration

After deployment, test with:

1. **Allowed domain user**: Should access dashboard normally
2. **Allowed email user**: Should access dashboard normally
3. **Unauthorized user**: Should see access denied page

## File Structure After Implementation

```
lib/
├── auth.ts                    # Modified - adds allowlist checks
└── auth/
    └── allowlist.ts           # New - allowlist utilities

app/(auth)/
├── login/page.tsx             # Unchanged
└── access-denied/page.tsx     # New - access denied page

types/
└── auth.ts                    # New - auth type definitions
```

## Testing Scenarios

| Scenario | Email | Expected Result |
|----------|-------|-----------------|
| Allowed domain | user@searchandrescue.gg | Access granted |
| Allowed email | contractor@external.com | Access granted |
| Unauthorized domain | random@gmail.com | Access denied page |
| Case mismatch | User@SearchAndRescue.GG | Access granted (case-insensitive) |
| Empty allowlists | any@any.com | Access denied (fail-closed) |

## Troubleshooting

### "Access Denied" for all users
- Check that `AUTH_ALLOWED_DOMAINS` or `AUTH_ALLOWED_EMAILS` is set
- Verify environment variables are loaded (no typos in variable names)
- Redeploy if you just added the variables

### User was allowed before, now denied
- Check if their email/domain was removed from allowlists
- Verify the user's Google account email matches expected value

### Environment variable not loading
- Ensure no spaces around `=` in env file
- Restart dev server after changing `.env.local`
- For production, verify deployment platform has the variables set

## Local Development

```bash
# Start development server
bun dev

# Test login flow at http://localhost:3000/login
```

## Deployment Notes

- Environment variables must be set before deployment
- Changes to allowlists require redeployment
- No database migrations required
