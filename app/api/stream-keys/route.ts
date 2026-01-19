import { NextResponse } from 'next/server';
import { listStreamKeys } from '@/lib/api/stream-keys';
import type { APIError } from '@/types';

export async function GET() {
  try {
    const data = await listStreamKeys();
    return NextResponse.json(data);
  } catch (error) {
    const apiError = error as APIError;
    return NextResponse.json(
      { error: apiError.detail || 'Failed to fetch stream keys' },
      { status: apiError.status || 500 }
    );
  }
}
