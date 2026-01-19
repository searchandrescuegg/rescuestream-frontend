/**
 * Stream Keys API Functions
 * Re-exports stream-key-related methods from the client
 */

import { getRescueStreamClient } from './client';
import type {
  StreamKey,
  StreamKeysResponse,
  CreateStreamKeyRequest,
} from '@/types';

export async function listStreamKeys(): Promise<StreamKeysResponse> {
  const client = getRescueStreamClient();
  return client.listStreamKeys();
}

export async function getStreamKey(id: string): Promise<StreamKey> {
  const client = getRescueStreamClient();
  return client.getStreamKey(id);
}

export async function createStreamKey(
  data: CreateStreamKeyRequest
): Promise<StreamKey> {
  const client = getRescueStreamClient();
  return client.createStreamKey(data);
}

export async function revokeStreamKey(id: string): Promise<void> {
  const client = getRescueStreamClient();
  return client.revokeStreamKey(id);
}
