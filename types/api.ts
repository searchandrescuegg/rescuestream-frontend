/**
 * API Types for RescueStream API
 * Based on data-model.md specification
 */

// Core Entities

export interface Broadcaster {
  id: string;
  display_name: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface StreamKey {
  id: string;
  key_value?: string; // Only returned on creation
  broadcaster_id: string;
  status: 'active' | 'revoked' | 'expired';
  created_at: string;
  expires_at: string | null;
  revoked_at: string | null;
  last_used_at: string | null;
}

export interface StreamURLs {
  hls: string;
  webrtc: string;
}

export interface Stream {
  id: string;
  stream_key_id: string;
  path: string;
  status: 'active' | 'ended';
  started_at: string;
  ended_at: string | null;
  source_type: string | null;
  source_id: string | null;
  metadata: Record<string, unknown>;
  recording_ref: string | null;
  urls: StreamURLs;
}

// Derived Types

export interface StreamWithBroadcaster extends Stream {
  broadcaster: Broadcaster | null;
}

export interface BroadcasterWithKeyCount extends Broadcaster {
  stream_key_count: number;
  active_stream_count: number;
}

// API Response Wrappers

export interface BroadcastersResponse {
  broadcasters: Broadcaster[];
  count: number;
}

export interface StreamKeysResponse {
  stream_keys: StreamKey[];
  count: number;
}

export interface StreamsResponse {
  streams: Stream[];
  count: number;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  database: 'ok' | 'unreachable';
}

// API Error (RFC 9457 Problem Details)

export interface APIError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}

// Request Payloads

export interface CreateBroadcasterRequest {
  display_name: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateBroadcasterRequest {
  display_name?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateStreamKeyRequest {
  broadcaster_id: string;
  expires_at?: string;
}

// Audit Log Types

export interface CreateAuditLogRequest {
  // Required
  event_type: string;

  // Optional overrides (defaults derived from request context)
  actor?: string;
  resource_type?: string;
  resource_id?: string;
  request_method?: string;
  request_path?: string;
  outcome?: 'success' | 'failure';
  failure_reason?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  request_method: string;
  request_path: string;
  ip_address: string;
  outcome: 'success' | 'failure';
  failure_reason: string | null;
  metadata: Record<string, unknown>;
  request_id: string | null;
}

export interface AuditLogPagination {
  limit: number;
  offset: number;
  total: number;
}

export interface AuditLogsResponse {
  audit_logs: AuditLogEntry[];
  pagination: AuditLogPagination;
}

export interface AuditLogFilters {
  eventType?: string;
  actor?: string;
  resourceType?: string;
  resourceId?: string;
  from?: string;
  to?: string;
}

export type AuditLogOutcome = 'success' | 'failure';

export type AuditEventType =
  | 'stream_started'
  | 'user_login'
  | 'user_logout'
  | 'stream_key_created'
  | 'stream_key_updated'
  | 'stream_key_deleted'
  | 'broadcaster_created'
  | 'broadcaster_updated'
  | 'broadcaster_deleted';
