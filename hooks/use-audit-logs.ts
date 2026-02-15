'use client';

import { useState, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import type { AuditLogsResponse, AuditLogFilters } from '@/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to fetch' }));
    throw new Error(error.error || 'Failed to fetch audit logs');
  }
  return res.json();
};

interface UseAuditLogsOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialFilters?: AuditLogFilters;
}

export function useAuditLogs(options: UseAuditLogsOptions = {}) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    initialFilters = {},
  } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filters, setFilters] = useState<AuditLogFilters>(initialFilters);

  // Build URL with query params
  const url = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());

    if (filters.eventType) params.set('eventType', filters.eventType);
    if (filters.actor) params.set('actor', filters.actor);
    if (filters.resourceType) params.set('resourceType', filters.resourceType);
    if (filters.resourceId) params.set('resourceId', filters.resourceId);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);

    return `/api/audit-logs?${params.toString()}`;
  }, [page, pageSize, filters]);

  const { data, error, isLoading, mutate } = useSWR<AuditLogsResponse>(
    url,
    fetcher,
    {
      refreshInterval: 0, // Manual refresh only
      revalidateOnFocus: false,
      dedupingInterval: 2000, // Prevent duplicate requests
    }
  );

  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  const updateFilters = useCallback((newFilters: Partial<AuditLogFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  }, []);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!data?.pagination?.total) return 1;
    return Math.ceil(data.pagination.total / pageSize);
  }, [data, pageSize]);

  return {
    auditLogs: data?.audit_logs ?? [],
    pagination: data?.pagination ?? { limit: pageSize, offset: 0, total: 0 },
    totalPages,
    page,
    pageSize,
    filters,
    isLoading,
    error,
    refresh,
    updateFilters,
    clearFilters,
    goToPage,
    changePageSize,
  };
}
