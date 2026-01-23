'use client';

import { StreamGrid } from '@/components/video/stream-grid';
import { useStreams } from '@/hooks/use-streams';

export default function StreamsPage() {
  const { streams, isLoading, error } = useStreams();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive">Failed to load streams</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="hidden shrink-0 md:block">
        <h1 className="text-2xl font-bold tracking-tight">Live Streams</h1>
        <p className="text-muted-foreground">
          Monitor active broadcast streams in real-time.
        </p>
      </div>
      <StreamGrid streams={streams} isLoading={isLoading} />
    </div>
  );
}
