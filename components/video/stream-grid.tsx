'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { StreamTile, type StreamTileRef } from './stream-tile';
import { Loader2 } from 'lucide-react';
import { FullscreenPlayer } from './fullscreen-player';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { VideoIcon } from '@radix-ui/react-icons';
import type { StreamWithBroadcaster } from '@/types';

interface StreamGridProps {
  streams: StreamWithBroadcaster[];
  isLoading?: boolean;
}

const PAGE_SIZE = 9;

interface FullscreenState {
  stream: StreamWithBroadcaster;
  videoElement: HTMLVideoElement | null;
  protocol: 'webrtc' | 'hls';
}

export function StreamGrid({ streams, isLoading }: StreamGridProps) {
  const [page, setPage] = useState(1);
  const [fullscreenState, setFullscreenState] = useState<FullscreenState | null>(null);
  const [isClosingFullscreen, setIsClosingFullscreen] = useState(false);
  const tileRefs = useRef<Map<string, StreamTileRef>>(new Map());

  // Filter to only active streams
  const activeStreams = useMemo(
    () => streams.filter((s) => s.status === 'active'),
    [streams]
  );

  const totalPages = Math.ceil(activeStreams.length / PAGE_SIZE);
  const pagedStreams = activeStreams.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Calculate grid dimensions based on stream count for md+ screens
  // Layouts: 1x1, 2x1, 2x2, 3x2, 3x3
  const { gridCols, gridRows } = useMemo(() => {
    const count = pagedStreams.length;
    if (count <= 1) return { gridCols: 1, gridRows: 1 };
    if (count === 2) return { gridCols: 2, gridRows: 1 };
    if (count <= 4) return { gridCols: 2, gridRows: 2 };
    if (count <= 6) return { gridCols: 3, gridRows: 2 };
    return { gridCols: 3, gridRows: 3 };
  }, [pagedStreams.length]);

  // Responsive grid classes: single column on mobile, calculated grid on md+
  const gridColsClass = gridCols === 1 ? 'md:grid-cols-1' : gridCols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  const gridRowsClass = gridRows === 1 ? 'md:grid-rows-1' : gridRows === 2 ? 'md:grid-rows-2' : 'md:grid-rows-3';

  // Handle tile click - get video element and open fullscreen
  const handleTileClick = useCallback((stream: StreamWithBroadcaster) => {
    // Prevent opening fullscreen while closing animation is in progress
    if (isClosingFullscreen) return;

    const tileRef = tileRefs.current.get(stream.id);
    if (tileRef) {
      const videoElement = tileRef.getVideoElement();
      const protocol = tileRef.getProtocol();
      setFullscreenState({ stream, videoElement, protocol });
    }
  }, [isClosingFullscreen]);

  // Handle fullscreen close
  const handleFullscreenClose = useCallback(() => {
    setIsClosingFullscreen(true);
    setFullscreenState(null);
    // Allow clicks again after the video has been moved back
    setTimeout(() => setIsClosingFullscreen(false), 100);
  }, []);

  // Store tile ref
  const setTileRef = useCallback((streamId: string, ref: StreamTileRef | null) => {
    if (ref) {
      tileRefs.current.set(streamId, ref);
    } else {
      tileRefs.current.delete(streamId);
    }
  }, []);

  // Loading state - simple centered spinner
  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Empty state
  if (activeStreams.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <VideoIcon className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Active Streams</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          When broadcasters go live, their streams will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Stream Grid - tiles constrained by both width and height */}
      <div
        className={`grid grid-cols-1 ${gridColsClass} ${gridRowsClass} min-h-0 flex-1 gap-4 overflow-auto md:overflow-visible items-center justify-items-center ${
          pagedStreams.length === 1 ? 'content-start' : 'place-content-center'
        }`}
      >
        {pagedStreams.map((stream) => (
          <StreamTile
            key={stream.id}
            ref={(ref) => setTileRef(stream.id, ref)}
            stream={stream}
            onClick={() => handleTileClick(stream)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4 shrink-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page === 1}
                className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setPage(i + 1)}
                  isActive={page === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-disabled={page === totalPages}
                className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Fullscreen View - passes the actual video element */}
      {fullscreenState && (
        <FullscreenPlayer
          stream={fullscreenState.stream}
          videoElement={fullscreenState.videoElement}
          protocol={fullscreenState.protocol}
          onClose={handleFullscreenClose}
        />
      )}
    </div>
  );
}
