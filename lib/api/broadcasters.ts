/**
 * Broadcasters API Functions
 * Re-exports broadcaster-related methods from the client
 */

import { getRescueStreamClient } from './client';
import type {
  Broadcaster,
  BroadcastersResponse,
  CreateBroadcasterRequest,
  UpdateBroadcasterRequest,
} from '@/types';

export async function listBroadcasters(): Promise<BroadcastersResponse> {
  const client = getRescueStreamClient();
  return client.listBroadcasters();
}

export async function getBroadcaster(id: string): Promise<Broadcaster> {
  const client = getRescueStreamClient();
  return client.getBroadcaster(id);
}

export async function createBroadcaster(
  data: CreateBroadcasterRequest
): Promise<Broadcaster> {
  const client = getRescueStreamClient();
  return client.createBroadcaster(data);
}

export async function updateBroadcaster(
  id: string,
  data: UpdateBroadcasterRequest
): Promise<Broadcaster> {
  const client = getRescueStreamClient();
  return client.updateBroadcaster(id, data);
}

export async function deleteBroadcaster(id: string): Promise<void> {
  const client = getRescueStreamClient();
  return client.deleteBroadcaster(id);
}
