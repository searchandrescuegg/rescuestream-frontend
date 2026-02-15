/**
 * Audit Logs API Functions
 * Server-side only - never import in Client Components
 */

import { getRescueStreamClient } from './client';
import type { AuditLogsResponse, AuditLogFilters } from '@/types';

// Event type display mapping
export const EVENT_TYPE_DISPLAY: Record<string, { label: string; icon: string }> = {
  stream_started: { label: 'Stream Started', icon: 'IconPlayerPlay' },
  user_login: { label: 'User Login', icon: 'IconLogin' },
  user_logout: { label: 'User Logout', icon: 'IconLogout' },
  stream_key_created: { label: 'Stream Key Created', icon: 'IconKeyPlus' },
  stream_key_updated: { label: 'Stream Key Updated', icon: 'IconKey' },
  stream_key_deleted: { label: 'Stream Key Deleted', icon: 'IconKeyMinus' },
  broadcaster_created: { label: 'Broadcaster Created', icon: 'IconUserPlus' },
  broadcaster_updated: { label: 'Broadcaster Updated', icon: 'IconUserEdit' },
  broadcaster_deleted: { label: 'Broadcaster Deleted', icon: 'IconUserMinus' },
};

// Map frontend event types to API action and resource_type
export const EVENT_TYPE_TO_API: Record<string, { action: string; resource_type: string | null }> = {
  stream_started: { action: 'started_stream', resource_type: null },
  user_login: { action: 'login', resource_type: null },
  user_logout: { action: 'logout', resource_type: null },
  stream_key_created: { action: 'create', resource_type: 'stream_key' },
  stream_key_updated: { action: 'update', resource_type: 'stream_key' },
  stream_key_deleted: { action: 'delete', resource_type: 'stream_key' },
  broadcaster_created: { action: 'create', resource_type: 'broadcaster' },
  broadcaster_updated: { action: 'update', resource_type: 'broadcaster' },
  broadcaster_deleted: { action: 'delete', resource_type: 'broadcaster' },
};

// Map API action + resource_type back to frontend event type
export function getEventType(action: string, resourceType: string | null): string {
  if (action === 'started_stream') return 'stream_started';
  if (action === 'login') return 'user_login';
  if (action === 'logout') return 'user_logout';

  if (resourceType === 'stream_key') {
    if (action === 'create') return 'stream_key_created';
    if (action === 'update') return 'stream_key_updated';
    if (action === 'delete') return 'stream_key_deleted';
  }

  if (resourceType === 'broadcaster') {
    if (action === 'create') return 'broadcaster_created';
    if (action === 'update') return 'broadcaster_updated';
    if (action === 'delete') return 'broadcaster_deleted';
  }

  // Fallback: return raw action
  return action;
}

// Get display label for an event
export function getEventLabel(action: string, resourceType: string | null): string {
  const eventType = getEventType(action, resourceType);
  return EVENT_TYPE_DISPLAY[eventType]?.label ?? action;
}

interface ListAuditLogsParams {
  page?: number;
  pageSize?: number;
  filters?: AuditLogFilters;
}

export async function listAuditLogs(params: ListAuditLogsParams = {}): Promise<AuditLogsResponse> {
  const { page = 1, pageSize = 10, filters = {} } = params;
  const client = getRescueStreamClient();

  // Build query string for backend API
  const queryParams = new URLSearchParams();

  // Pagination: convert page to offset
  const offset = (page - 1) * pageSize;
  queryParams.set('limit', pageSize.toString());
  queryParams.set('offset', offset.toString());

  // Filters
  if (filters.eventType) {
    const mapping = EVENT_TYPE_TO_API[filters.eventType];
    if (mapping) {
      queryParams.set('action', mapping.action);
      if (mapping.resource_type) {
        queryParams.set('resource_type', mapping.resource_type);
      }
    }
  }

  if (filters.actor) {
    queryParams.set('actor', filters.actor);
  }

  if (filters.resourceType) {
    queryParams.set('resource_type', filters.resourceType);
  }

  if (filters.resourceId) {
    queryParams.set('resource_id', filters.resourceId);
  }

  if (filters.from) {
    queryParams.set('from', filters.from);
  }

  if (filters.to) {
    queryParams.set('to', filters.to);
  }

  return client.listAuditLogs(queryParams.toString());
}
