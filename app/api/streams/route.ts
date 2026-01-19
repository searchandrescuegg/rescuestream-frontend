import { NextResponse } from 'next/server';
import { listStreams } from '@/lib/api/streams';
import type { APIError } from '@/types';

export async function GET() {
  try {
    const data = await listStreams();
    return NextResponse.json(data);
  } catch (error) {
    const apiError = error as APIError;
    return NextResponse.json(
      { error: apiError.detail || 'Failed to fetch streams' },
      { status: apiError.status || 500 }
    );
  }
}
