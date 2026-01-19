'use client';

import useSWR from 'swr';
import type { BroadcastersResponse } from '@/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
};

export function useBroadcasters() {
  const { data, error, isLoading, mutate } = useSWR<BroadcastersResponse>(
    '/api/broadcasters',
    fetcher,
    { refreshInterval: 30000 }
  );

  return {
    broadcasters: data?.broadcasters ?? [],
    count: data?.count ?? 0,
    isLoading,
    error,
    refresh: mutate,
  };
}
