/**
 * Streams API Functions
 * Re-exports stream-related methods from the client
 */

import { getRescueStreamClient } from './client';
import type { Stream, StreamsResponse } from '@/types';

export async function listStreams(): Promise<StreamsResponse> {
  const client = getRescueStreamClient();
  return client.listStreams();
}

export async function getStream(id: string): Promise<Stream> {
  const client = getRescueStreamClient();
  return client.getStream(id);
}
