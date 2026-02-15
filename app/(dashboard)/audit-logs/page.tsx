'use client';

import { useState } from 'react';
import { AuditLogTable } from '@/components/audit-logs/audit-log-table';
import { AuditLogFilters } from '@/components/audit-logs/audit-log-filters';
import { AuditLogDetail } from '@/components/audit-logs/audit-log-detail';
import { useAuditLogs } from '@/hooks/use-audit-logs';
import type { AuditLogEntry } from '@/types';

export default function AuditLogsPage() {
  const {
    auditLogs,
    pagination,
    page,
    pageSize,
    totalPages,
    filters,
    isLoading,
    error,
    refresh,
    updateFilters,
    clearFilters,
    goToPage,
    changePageSize,
  } = useAuditLogs();

  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleRowClick = (entry: AuditLogEntry) => {
    setSelectedEntry(entry);
    setDetailOpen(true);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive font-medium">Failed to load audit logs</p>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        <button
          onClick={refresh}
          className="mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Check if filters are active to show appropriate empty state
  const hasActiveFilters = !!(filters.eventType || filters.actor);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground">
          View all system events and user actions.
        </p>
      </div>

      <AuditLogFilters
        filters={filters}
        onFilterChange={updateFilters}
        onClearFilters={clearFilters}
      />

      <AuditLogTable
        data={auditLogs}
        pagination={pagination}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        isLoading={isLoading}
        onRefresh={refresh}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        onRowClick={handleRowClick}
        hasActiveFilters={hasActiveFilters}
      />

      <AuditLogDetail
        entry={selectedEntry}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
