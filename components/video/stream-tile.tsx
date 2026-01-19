'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { StreamPlayer } from './stream-player';
import { StreamStatus } from './stream-status';
import { Skeleton } from '@/components/ui/skeleton';
import type { StreamWithBroadcaster } from '@/types';

interface StreamTileProps {
  stream: StreamWithBroadcaster;
  onClick?: () => void;
}

export function StreamTile({ stream, onClick }: StreamTileProps) {
  const [isLoading, setIsLoading] = useState(true);

  const broadcasterName = stream.broadcaster?.display_name || 'Unknown Broadcaster';
  const startedAt = new Date(stream.started_at);
  const duration = formatDistanceToNow(startedAt, { addSuffix: false });

  return (
    <div
      className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg bg-muted"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Video Player */}
      <StreamPlayer
        urls={stream.urls}
        muted
        autoPlay
        onReady={() => setIsLoading(false)}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="h-full w-full" />
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute left-2 top-2 z-20">
        <StreamStatus status={stream.status} />
      </div>

      {/* Metadata Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
        <p className="truncate text-sm font-medium text-white">
          {broadcasterName}
        </p>
        <p className="text-xs text-white/70">
          Streaming for {duration}
        </p>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 z-10 bg-black/0 transition-colors group-hover:bg-black/10" />
    </div>
  );
}

export function StreamTileSkeleton() {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg">
      <Skeleton className="h-full w-full" />
      <div className="absolute left-2 top-2">
        <Skeleton className="h-5 w-12" />
      </div>
      <div className="absolute inset-x-0 bottom-0 space-y-1 p-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
