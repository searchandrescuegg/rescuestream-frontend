'use client';

import { StreamKeyTable } from '@/components/stream-keys/stream-key-table';
import { useStreamKeys } from '@/hooks/use-stream-keys';
import { useBroadcasters } from '@/hooks/use-broadcasters';

export default function StreamKeysPage() {
  const { streamKeys, isLoading: keysLoading, error: keysError, refresh } = useStreamKeys();
  const { broadcasters, isLoading: broadcastersLoading } = useBroadcasters();

  const isLoading = keysLoading || broadcastersLoading;

  if (keysError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive">Failed to load stream keys</p>
        <p className="text-sm text-muted-foreground">{keysError.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stream Keys</h1>
        <p className="text-muted-foreground">
          Generate and manage streaming credentials for broadcasters.
        </p>
      </div>
      <StreamKeyTable
        data={streamKeys}
        broadcasters={broadcasters}
        isLoading={isLoading}
        onRefresh={refresh}
      />
    </div>
  );
}
