'use client';

import useSWR from 'swr';
import type { StreamKeysResponse } from '@/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
};

export function useStreamKeys() {
  const { data, error, isLoading, mutate } = useSWR<StreamKeysResponse>(
    '/api/stream-keys',
    fetcher,
    { refreshInterval: 30000 }
  );

  return {
    streamKeys: data?.stream_keys ?? [],
    count: data?.count ?? 0,
    isLoading,
    error,
    refresh: mutate,
  };
}
