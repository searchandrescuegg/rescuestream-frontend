'use client';

import { BroadcasterTable } from '@/components/broadcasters/broadcaster-table';
import { useBroadcasters } from '@/hooks/use-broadcasters';

export default function BroadcastersPage() {
  const { broadcasters, isLoading, error, refresh } = useBroadcasters();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive">Failed to load broadcasters</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Broadcasters</h1>
        <p className="text-muted-foreground">
          Manage users and devices authorized to stream.
        </p>
      </div>
      <BroadcasterTable
        data={broadcasters}
        isLoading={isLoading}
        onRefresh={refresh}
      />
    </div>
  );
}
