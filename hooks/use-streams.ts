'use client';

import useSWR from 'swr';
import type {
  StreamsResponse,
  StreamKeysResponse,
  BroadcastersResponse,
  StreamWithBroadcaster,
} from '@/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
};

export function useStreams() {
  const {
    data: streamsData,
    error: streamsError,
    isLoading: streamsLoading,
    mutate,
  } = useSWR<StreamsResponse>('/api/streams', fetcher, { refreshInterval: 5000 });

  const { data: streamKeysData } = useSWR<StreamKeysResponse>(
    '/api/stream-keys',
    fetcher,
    { refreshInterval: 30000 }
  );

  const { data: broadcastersData } = useSWR<BroadcastersResponse>(
    '/api/broadcasters',
    fetcher,
    { refreshInterval: 30000 }
  );

  // Build lookup maps for efficient joining
  const streamKeyToBroadcasterId = new Map(
    (streamKeysData?.stream_keys ?? []).map((sk) => [sk.id, sk.broadcaster_id])
  );

  const broadcasterById = new Map(
    (broadcastersData?.broadcasters ?? []).map((b) => [b.id, b])
  );

  // Join streams with their broadcasters via stream_key_id -> broadcaster_id
  const streamsWithBroadcasters: StreamWithBroadcaster[] = (streamsData?.streams ?? []).map(
    (stream) => {
      const broadcasterId = streamKeyToBroadcasterId.get(stream.stream_key_id);
      const broadcaster = broadcasterId ? broadcasterById.get(broadcasterId) ?? null : null;
      return {
        ...stream,
        broadcaster,
      };
    }
  );

  return {
    streams: streamsWithBroadcasters,
    count: streamsData?.count ?? 0,
    isLoading: streamsLoading,
    error: streamsError,
    refresh: mutate,
  };
}
