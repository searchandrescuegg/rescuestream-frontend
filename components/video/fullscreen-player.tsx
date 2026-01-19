'use client';

import { useEffect, useCallback, useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { StreamPlayer } from './stream-player';
import { StreamStatus } from './stream-status';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { StreamWithBroadcaster } from '@/types';

interface FullscreenPlayerProps {
  stream: StreamWithBroadcaster;
  onClose: () => void;
}

export function FullscreenPlayer({ stream, onClose }: FullscreenPlayerProps) {
  const [playbackProtocol, setPlaybackProtocol] = useState<'webrtc' | 'hls'>('webrtc');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const broadcasterName = stream.broadcaster?.display_name || 'Unknown Broadcaster';
  const startedAt = new Date(stream.started_at);
  const duration = formatDistanceToNow(startedAt, { addSuffix: false });
  const startTime = format(startedAt, 'PPp');

  return (
    <div className="fixed inset-0 z-50 bg-black" onClick={onClose}>
      {/* Video */}
      <StreamPlayer
        urls={stream.urls}
        muted={false}
        autoPlay
        className="h-full w-full object-contain"
        onProtocolChange={setPlaybackProtocol}
      />

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-10 text-white hover:bg-white/20"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <Cross2Icon className="h-6 w-6" />
        <span className="sr-only">Close (Escape)</span>
      </Button>

      {/* Enhanced Metadata Overlay */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <StreamStatus status={stream.status} />
              <h2 className="text-xl font-semibold text-white">
                {broadcasterName}
              </h2>
            </div>
            <div className="flex flex-col gap-1 text-sm text-white/70">
              <p>Streaming for {duration}</p>
              <p>Started at {startTime}</p>
              {stream.source_type && (
                <p>Source: {stream.source_type.toUpperCase()}</p>
              )}
              <p>Playback: {playbackProtocol === 'webrtc' ? 'WebRTC (low latency)' : 'HLS'}</p>
            </div>
          </div>
          <p className="text-xs text-white/50">Click or press Escape to close</p>
        </div>
      </div>
    </div>
  );
}
