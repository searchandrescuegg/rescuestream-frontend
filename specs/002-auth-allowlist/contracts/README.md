# API Contracts: Auth Allowlist Configuration

**Feature**: 002-auth-allowlist
**Date**: 2026-01-20

## Overview

This feature does not introduce new API endpoints. Authorization is handled entirely within Auth.js callbacks.

## Existing Endpoints (No Changes)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | Auth.js route handler (unchanged) |

## New Routes (Pages)

| Route | Type | Description |
|-------|------|-------------|
| `/access-denied` | Page | Access denied page shown when user is not authorized |

## Auth.js Callback Modifications

### signIn Callback

**Purpose**: Check email/domain allowlist before allowing sign-in

**Input**: `{ user, account, profile }`
- `user.email`: User's email address
- `profile.email`: OAuth profile email
- `profile.email_verified`: Boolean (Google)

**Output**:
- `true`: Allow sign-in
- `'/access-denied'`: Redirect to access denied page

### authorized Callback

**Purpose**: Re-validate authorization on each request

**Input**: `{ auth, request }`
- `auth.user.email`: Current user's email

**Output**:
- `true`: Allow access
- `false`: Redirect to login
- `Response.redirect('/access-denied')`: Redirect to access denied page

## Environment Variables (Configuration Contract)

| Variable | Format | Example | Required |
|----------|--------|---------|----------|
| `AUTH_ALLOWED_DOMAINS` | Comma-separated domains | `searchandrescue.gg,partner.org` | No* |
| `AUTH_ALLOWED_EMAILS` | Comma-separated emails | `admin@external.com` | No* |

*At least one must be configured; if both empty, all access is denied (fail-closed).
