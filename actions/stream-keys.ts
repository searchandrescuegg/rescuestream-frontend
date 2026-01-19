'use server';

import { revalidatePath } from 'next/cache';
import { getRescueStreamClient } from '@/lib/api/client';
import type {
  StreamKey,
  CreateStreamKeyRequest,
  APIError,
} from '@/types';

export async function createStreamKey(
  data: CreateStreamKeyRequest
): Promise<{ success: true; streamKey: StreamKey } | { success: false; error: string }> {
  try {
    const client = getRescueStreamClient();
    const streamKey = await client.createStreamKey(data);
    revalidatePath('/stream-keys');
    return { success: true, streamKey };
  } catch (error) {
    const apiError = error as APIError;
    return { success: false, error: apiError.detail || 'Failed to create stream key' };
  }
}

export async function revokeStreamKey(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const client = getRescueStreamClient();
    await client.revokeStreamKey(id);
    revalidatePath('/stream-keys');
    return { success: true };
  } catch (error) {
    const apiError = error as APIError;
    return { success: false, error: apiError.detail || 'Failed to revoke stream key' };
  }
}
