'use client';

import { useMemo } from 'react';
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

// Deep compare function for SWR to prevent unnecessary updates
function compareStreamsResponse(a: StreamsResponse | undefined, b: StreamsResponse | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.count !== b.count) return false;
  if (a.streams.length !== b.streams.length) return false;
  return a.streams.every((streamA, i) => {
    const streamB = b.streams[i];
    return (
      streamA.id === streamB.id &&
      streamA.status === streamB.status &&
      streamA.started_at === streamB.started_at &&
      streamA.urls.hls === streamB.urls.hls &&
      streamA.urls.webrtc === streamB.urls.webrtc
    );
  });
}

function compareStreamKeysResponse(a: StreamKeysResponse | undefined, b: StreamKeysResponse | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.stream_keys.length !== b.stream_keys.length) return false;
  return a.stream_keys.every((skA, i) => {
    const skB = b.stream_keys[i];
    return skA.id === skB.id && skA.broadcaster_id === skB.broadcaster_id;
  });
}

function compareBroadcastersResponse(a: BroadcastersResponse | undefined, b: BroadcastersResponse | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.broadcasters.length !== b.broadcasters.length) return false;
  return a.broadcasters.every((bA, i) => {
    const bB = b.broadcasters[i];
    return bA.id === bB.id && bA.display_name === bB.display_name;
  });
}

export function useStreams() {
  const {
    data: streamsData,
    error: streamsError,
    isLoading: streamsLoading,
    mutate,
  } = useSWR<StreamsResponse>('/api/streams', fetcher, {
    refreshInterval: 5000,
    compare: compareStreamsResponse,
  });

  const { data: streamKeysData } = useSWR<StreamKeysResponse>(
    '/api/stream-keys',
    fetcher,
    {
      refreshInterval: 30000,
      compare: compareStreamKeysResponse,
    }
  );

  const { data: broadcastersData } = useSWR<BroadcastersResponse>(
    '/api/broadcasters',
    fetcher,
    {
      refreshInterval: 30000,
      compare: compareBroadcastersResponse,
    }
  );

  // Memoize the joined streams - will only recompute when SWR data objects change
  const streamsWithBroadcasters = useMemo(() => {
    // Build lookup maps for efficient joining
    const streamKeyToBroadcasterId = new Map(
      (streamKeysData?.stream_keys ?? []).map((sk) => [sk.id, sk.broadcaster_id])
    );

    const broadcasterById = new Map(
      (broadcastersData?.broadcasters ?? []).map((b) => [b.id, b])
    );

    // Join streams with their broadcasters via stream_key_id -> broadcaster_id
    const streams: StreamWithBroadcaster[] = (streamsData?.streams ?? []).map(
      (stream) => {
        const broadcasterId = streamKeyToBroadcasterId.get(stream.stream_key_id);
        const broadcaster = broadcasterId ? broadcasterById.get(broadcasterId) ?? null : null;
        return {
          ...stream,
          broadcaster,
        };
      }
    );

    return streams;
  }, [streamsData, streamKeysData, broadcastersData]);

  return {
    streams: streamsWithBroadcasters,
    count: streamsData?.count ?? 0,
    isLoading: streamsLoading,
    error: streamsError,
    refresh: mutate,
  };
}
