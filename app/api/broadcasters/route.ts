import { NextResponse } from 'next/server';
import { listBroadcasters } from '@/lib/api/broadcasters';
import type { APIError } from '@/types';

export async function GET() {
  try {
    const data = await listBroadcasters();
    return NextResponse.json(data);
  } catch (error) {
    const apiError = error as APIError;
    return NextResponse.json(
      { error: apiError.detail || 'Failed to fetch broadcasters' },
      { status: apiError.status || 500 }
    );
  }
}
