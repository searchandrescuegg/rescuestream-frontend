'use client';

import { useMemo, useState } from 'react';
import { StreamTile, StreamTileSkeleton } from './stream-tile';
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

export function StreamGrid({ streams, isLoading }: StreamGridProps) {
  const [page, setPage] = useState(1);
  const [selectedStream, setSelectedStream] = useState<StreamWithBroadcaster | null>(null);

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

  // Calculate grid columns based on stream count
  const gridCols = useMemo(() => {
    const count = pagedStreams.length;
    if (count <= 1) return 1;
    if (count <= 4) return 2;
    return 3;
  }, [pagedStreams.length]);

  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <StreamTileSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (activeStreams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <VideoIcon className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Active Streams</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          When broadcasters go live, their streams will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Stream Grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        }}
      >
        {pagedStreams.map((stream) => (
          <StreamTile
            key={stream.id}
            stream={stream}
            onClick={() => setSelectedStream(stream)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
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

      {/* Fullscreen View */}
      {selectedStream && (
        <FullscreenPlayer
          stream={selectedStream}
          onClose={() => setSelectedStream(null)}
        />
      )}
    </>
  );
}
