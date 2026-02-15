'use client';

import { useState, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { StreamPlayer } from './stream-player';
import { StreamStatus } from './stream-status';
import { Skeleton } from '@/components/ui/skeleton';
import type { StreamWithBroadcaster } from '@/types';

interface StreamTileProps {
  stream: StreamWithBroadcaster;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export interface StreamTileRef {
  getVideoElement: () => HTMLVideoElement | null;
  getProtocol: () => 'webrtc' | 'hls';
}

export const StreamTile = forwardRef<StreamTileRef, StreamTileProps>(
  function StreamTile({ stream, onClick, style }, ref) {
    const [isLoading, setIsLoading] = useState(true);
    const [playbackProtocol, setPlaybackProtocol] = useState<'webrtc' | 'hls'>('webrtc');
    const containerRef = useRef<HTMLDivElement>(null);

    // Stable callback reference to prevent unnecessary re-renders
    const handleReady = useCallback(() => setIsLoading(false), []);

    const broadcasterName = stream.broadcaster?.display_name || 'Unknown Broadcaster';
    const startedAt = new Date(stream.started_at);
    const duration = formatDistanceToNow(startedAt, { addSuffix: false });

    // Expose video element and protocol to parent
    useImperativeHandle(ref, () => ({
      getVideoElement: () => {
        return containerRef.current?.querySelector('video') ?? null;
      },
      getProtocol: () => playbackProtocol,
    }), [playbackProtocol]);

    return (
      <div
        ref={containerRef}
        className="group relative h-full w-full max-h-full max-w-full cursor-pointer overflow-hidden rounded-lg bg-muted"
        style={{ aspectRatio: '16/9', ...style }}
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
          onReady={handleReady}
          onProtocolChange={setPlaybackProtocol}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
);

export function StreamTileSkeleton({ style }: { style?: React.CSSProperties }) {
  // Default size matches a reasonable tile in a 3-column grid
  const defaultStyle: React.CSSProperties = {
    width: 320,
    height: 180,
    ...style,
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-muted" style={defaultStyle}>
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
