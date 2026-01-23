'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { StreamStatus } from './stream-status';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { StreamWithBroadcaster } from '@/types';

interface FullscreenPlayerProps {
  stream: StreamWithBroadcaster;
  videoElement: HTMLVideoElement | null;
  protocol: 'webrtc' | 'hls';
  onClose: () => void;
}

export function FullscreenPlayer({
  stream,
  videoElement,
  protocol,
  onClose,
}: FullscreenPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Move the video element into fullscreen container
  useEffect(() => {
    if (!videoElement || !containerRef.current) return;

    const container = containerRef.current;
    const originalParent = videoElement.parentElement;
    const originalNextSibling = videoElement.nextSibling;

    // Store original styles
    const originalClassName = videoElement.className;
    const originalMuted = videoElement.muted;

    // Move video to fullscreen container and update styles
    // We need to directly manipulate the DOM element to move it between containers
    /* eslint-disable react-hooks/immutability */
    container.appendChild(videoElement);
    videoElement.className = 'h-full w-full object-contain';
    videoElement.muted = false;
    /* eslint-enable react-hooks/immutability */

    // Small delay to allow CSS transition
    requestAnimationFrame(() => {
      setIsTransitioning(false);
    });

    return () => {
      // Move video back to original location
      if (originalParent) {
        if (originalNextSibling) {
          originalParent.insertBefore(videoElement, originalNextSibling);
        } else {
          originalParent.appendChild(videoElement);
        }
        // Restore original styles
        videoElement.className = originalClassName;
        videoElement.muted = originalMuted;
      }
    };
  }, [videoElement]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
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
      {/* Video Container - the video element will be moved here */}
      <div
        ref={containerRef}
        className={`pointer-events-none h-full w-full transition-opacity duration-200 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
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
              <p>Playback: {protocol === 'webrtc' ? 'WebRTC (low latency)' : 'HLS'}</p>
            </div>
          </div>
          <p className="text-xs text-white/50">Click or press Escape to close</p>
        </div>
      </div>
    </div>
  );
}
