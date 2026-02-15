import { NextRequest, NextResponse } from 'next/server';
import { listAuditLogs } from '@/lib/api/audit-logs';
import type { APIError, AuditLogFilters } from '@/types';

export async function GET(request: NextRequest) {
  console.log('[audit-logs] Route hit:', request.url);
  const searchParams = request.nextUrl.searchParams;

  // Parse pagination params
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') ?? '10', 10);

  // Parse filter params
  const filters: AuditLogFilters = {};

  const eventType = searchParams.get('eventType');
  if (eventType) filters.eventType = eventType;

  const actor = searchParams.get('actor');
  if (actor) filters.actor = actor;

  try {
    console.log('[audit-logs] Calling listAuditLogs with:', { page, pageSize, filters });
    const data = await listAuditLogs({ page, pageSize, filters });
    console.log('[audit-logs] Response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[audit-logs] Error:', error);
    const apiError = error as APIError;

    if (apiError.status === 403) {
      return NextResponse.json(
        { error: 'Admin privileges required to access audit logs' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: apiError.detail || 'Failed to fetch audit logs' },
      { status: apiError.status || 500 }
    );
  }
}
