/**
 * Auth Allowlist Utilities
 * Functions for loading and checking email/domain allowlists
 */

import type {
  AllowlistConfig,
  AuthorizationResult,
  DenyReason,
} from '@/types/auth';

/**
 * Parse a comma-separated environment variable into a normalized array
 */
function parseEnvList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Normalize domain entries by removing leading @ if present
 */
function normalizeDomain(domain: string): string {
  return domain.startsWith('@') ? domain.slice(1) : domain;
}

/**
 * Load allowlist configuration from environment variables
 * - AUTH_ALLOWED_DOMAINS: Comma-separated domain list
 * - AUTH_ALLOWED_EMAILS: Comma-separated email list
 */
export function loadAllowlistConfig(): AllowlistConfig {
  const rawDomains = parseEnvList(process.env.AUTH_ALLOWED_DOMAINS);
  const domains = rawDomains.map(normalizeDomain);
  const emails = parseEnvList(process.env.AUTH_ALLOWED_EMAILS);

  return {
    domains,
    emails,
    isEmpty: domains.length === 0 && emails.length === 0,
  };
}

/**
 * Check if a user's email is authorized based on allowlists
 * Order of checks:
 * 1. Email allowlist (more specific)
 * 2. Domain allowlist
 *
 * Returns denied if:
 * - No email provided
 * - Both allowlists are empty (fail-closed)
 * - Email/domain not in any allowlist
 */
export function checkAllowlist(
  email: string | null | undefined,
  config: AllowlistConfig
): AuthorizationResult {
  // No email provided
  if (!email) {
    return { allowed: false, reason: 'NO_EMAIL' };
  }

  // Fail-closed: deny all if both allowlists are empty
  if (config.isEmpty) {
    return { allowed: false, reason: 'ALLOWLIST_EMPTY' };
  }

  const normalizedEmail = email.toLowerCase();

  // Check email allowlist first (more specific)
  if (config.emails.includes(normalizedEmail)) {
    return { allowed: true, reason: 'EMAIL_MATCH' };
  }

  // Check domain allowlist
  const emailDomain = normalizedEmail.split('@')[1];
  if (emailDomain && config.domains.includes(emailDomain)) {
    return { allowed: true, reason: 'DOMAIN_MATCH' };
  }

  // Not in any allowlist
  return { allowed: false, reason: 'DOMAIN_NOT_ALLOWED' };
}

/**
 * Log denied access attempts server-side
 * Format: [AUTH] Access denied: email=<email>, reason=<reason>, timestamp=<ISO>
 */
export function logAccessDenied(email: string, reason: DenyReason): void {
  const timestamp = new Date().toISOString();
  console.warn(
    `[AUTH] Access denied: email=${email}, reason=${reason}, timestamp=${timestamp}`
  );
}
