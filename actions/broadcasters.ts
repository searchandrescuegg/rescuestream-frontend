'use server';

import { revalidatePath } from 'next/cache';
import { getRescueStreamClient } from '@/lib/api/client';
import type {
  Broadcaster,
  CreateBroadcasterRequest,
  UpdateBroadcasterRequest,
  APIError,
} from '@/types';

export async function createBroadcaster(
  data: CreateBroadcasterRequest
): Promise<{ success: true; broadcaster: Broadcaster } | { success: false; error: string }> {
  try {
    const client = getRescueStreamClient();
    const broadcaster = await client.createBroadcaster(data);
    revalidatePath('/broadcasters');
    return { success: true, broadcaster };
  } catch (error) {
    const apiError = error as APIError;
    return { success: false, error: apiError.detail || 'Failed to create broadcaster' };
  }
}

export async function updateBroadcaster(
  id: string,
  data: UpdateBroadcasterRequest
): Promise<{ success: true; broadcaster: Broadcaster } | { success: false; error: string }> {
  try {
    const client = getRescueStreamClient();
    const broadcaster = await client.updateBroadcaster(id, data);
    revalidatePath('/broadcasters');
    return { success: true, broadcaster };
  } catch (error) {
    const apiError = error as APIError;
    return { success: false, error: apiError.detail || 'Failed to update broadcaster' };
  }
}

export async function deleteBroadcaster(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const client = getRescueStreamClient();
    await client.deleteBroadcaster(id);
    revalidatePath('/broadcasters');
    return { success: true };
  } catch (error) {
    const apiError = error as APIError;
    return { success: false, error: apiError.detail || 'Failed to delete broadcaster' };
  }
}
