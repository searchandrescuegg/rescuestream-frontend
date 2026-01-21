/**
 * Auth Allowlist Type Definitions
 * Types for domain and email allowlist authorization
 */

/**
 * Parsed allowlist configuration from environment variables
 */
export interface AllowlistConfig {
  /** Normalized domain suffixes (lowercase, no leading @) */
  domains: string[];
  /** Normalized email addresses (lowercase) */
  emails: string[];
  /** True if both arrays are empty */
  isEmpty: boolean;
}

/**
 * Reasons why access was granted
 */
export type AllowReason = 'DOMAIN_MATCH' | 'EMAIL_MATCH';

/**
 * Reasons why access was denied
 */
export type DenyReason = 'NO_EMAIL' | 'DOMAIN_NOT_ALLOWED' | 'ALLOWLIST_EMPTY';

/**
 * Result of checking a user's email against allowlists
 */
export interface AuthorizationResult {
  /** Whether access is granted */
  allowed: boolean;
  /** Why allowed or denied */
  reason: AllowReason | DenyReason;
}
