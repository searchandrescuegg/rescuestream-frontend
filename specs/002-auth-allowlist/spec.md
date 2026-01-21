# Feature Specification: Auth Allowlist Configuration

**Feature Branch**: `002-auth-allowlist`
**Created**: 2026-01-20
**Status**: Draft
**Input**: User description: "I need to configure the existing auth with a domain allowlist and specific email allowlist"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Domain-Based Access Control (Priority: P1)

An administrator configures the system to only allow users from approved email domains (e.g., @company.com, @partner.org) to access the RescueStream dashboard. When a user attempts to sign in with Google OAuth, the system checks if their email domain is in the allowlist and grants or denies access accordingly.

**Why this priority**: Domain allowlisting is the primary access control mechanism for organizations, enabling bulk authorization of all employees from trusted domains without individual email management.

**Independent Test**: Can be fully tested by attempting sign-in with emails from allowed domains (should succeed) and disallowed domains (should be denied), delivering core access control value.

**Acceptance Scenarios**:

1. **Given** a domain allowlist containing "searchandrescue.gg", **When** a user signs in with "user@searchandrescue.gg", **Then** they are granted access to the dashboard
2. **Given** a domain allowlist containing "searchandrescue.gg", **When** a user signs in with "user@gmail.com", **Then** they are denied access with a clear error message explaining why
3. **Given** an empty domain allowlist, **When** a user attempts to sign in, **Then** the system falls back to the email allowlist for authorization

---

### User Story 2 - Individual Email Access Control (Priority: P2)

An administrator grants access to specific individuals who are not part of approved domains (e.g., external consultants, temporary collaborators). The system maintains a list of individually approved email addresses that are authorized regardless of their domain.

**Why this priority**: Email allowlisting provides fine-grained control for exceptions and external collaborators, complementing the domain-based approach.

**Independent Test**: Can be tested by adding a specific email to the allowlist and verifying that user can sign in while other users from the same domain (if not in domain allowlist) are denied.

**Acceptance Scenarios**:

1. **Given** an email allowlist containing "contractor@external.com", **When** that user signs in, **Then** they are granted access even if "external.com" is not in the domain allowlist
2. **Given** an email allowlist that does not contain "random@gmail.com", **When** that user signs in (and their domain is not allowed), **Then** they are denied access
3. **Given** a user whose email is in the email allowlist AND whose domain is in the domain allowlist, **When** they sign in, **Then** they are granted access (both checks pass)

---

### User Story 3 - Access Denial Feedback (Priority: P3)

When a user is denied access due to allowlist restrictions, they receive a clear, helpful message explaining that their account is not authorized and how they can request access if needed.

**Why this priority**: Good user experience for denied users reduces confusion and support burden, but is not core to the access control functionality.

**Independent Test**: Can be tested by attempting to sign in with an unauthorized email and verifying the error page displays appropriate messaging.

**Acceptance Scenarios**:

1. **Given** a user whose email and domain are not in any allowlist, **When** they complete Google OAuth sign-in, **Then** they see a clear message stating their account is not authorized to access this system
2. **Given** a denied user, **When** they view the access denied page, **Then** they see instructions for how to request access (e.g., contact administrator)

---

### Edge Cases

- What happens when both allowlists are empty? System should deny all access (fail-closed security posture)
- What happens when a user's email exactly matches an entry in the email allowlist but with different casing? Matching should be case-insensitive
- What happens when a domain in the allowlist has a leading @ vs without? System should normalize entries (treat "example.com" and "@example.com" as equivalent)
- How does the system handle subdomains? Allowlisting "company.com" should NOT automatically allow "sub.company.com" (explicit subdomain entries required)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST check user's email against configured allowlists after successful Google OAuth authentication
- **FR-002**: System MUST support a list of allowed email domains (domain allowlist)
- **FR-003**: System MUST support a list of specific allowed email addresses (email allowlist)
- **FR-004**: System MUST grant access if the user's email domain matches any entry in the domain allowlist
- **FR-005**: System MUST grant access if the user's email address exactly matches any entry in the email allowlist
- **FR-006**: System MUST perform case-insensitive matching for both domain and email comparisons
- **FR-007**: System MUST deny access and redirect to an error page if neither allowlist check passes
- **FR-008**: System MUST display a clear, user-friendly message when access is denied
- **FR-009**: System MUST load allowlist configuration from environment variables
- **FR-010**: System MUST fail closed (deny access) when both allowlists are empty or unconfigured
- **FR-011**: System MUST normalize domain entries (handle with or without leading @)
- **FR-012**: System MUST NOT automatically allow subdomains when parent domain is allowlisted
- **FR-013**: System MUST re-validate user authorization against allowlists on each page navigation or API call, denying access if no longer authorized
- **FR-014**: System MUST log denied access attempts server-side, capturing email address, timestamp, and denial reason

### Key Entities

- **Domain Allowlist**: A collection of email domain suffixes (e.g., "company.com") that authorize all users from those domains
- **Email Allowlist**: A collection of specific email addresses (e.g., "user@example.com") that authorize individual users regardless of domain
- **Authorization Decision**: The result of checking a user's email against both allowlists, resulting in either access granted or access denied

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authorized users (matching domain or email allowlist) can access the dashboard within 2 seconds of completing OAuth sign-in
- **SC-002**: Unauthorized users are denied access and shown an error page within 2 seconds of completing OAuth sign-in
- **SC-003**: 100% of sign-in attempts from non-allowlisted emails are blocked (zero unauthorized access)
- **SC-004**: 100% of sign-in attempts from allowlisted emails/domains succeed (zero false denials for authorized users)
- **SC-005**: Users denied access understand why within 5 seconds of reading the error message (message is clear and actionable)
- **SC-006**: Configuration changes to allowlists take effect after application redeployment

## Clarifications

### Session 2026-01-20

- Q: What happens to existing sessions when a user is removed from the allowlist? → A: Terminate session on next page navigation/API call if user no longer authorized; allowlist changes require app redeployment.
- Q: What observability is needed for access denials? → A: Log denied access attempts server-side (email, timestamp, reason).

## Assumptions

- Allowlist configuration will be stored in environment variables as comma-separated values (standard approach for Next.js applications)
- The system uses a single tenant model - one global set of allowlists for the entire application
- Google OAuth is the only authentication provider (as currently implemented)
- The existing Auth.js/NextAuth.js infrastructure will be extended rather than replaced
- Email addresses returned by Google OAuth are verified and trustworthy
