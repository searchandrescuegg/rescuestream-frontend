'use client';

import { Badge } from '@/components/ui/badge';
import { ActivityLogIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

interface StreamStatusProps {
  status: 'active' | 'ended';
  className?: string;
}

export function StreamStatus({ status, className }: StreamStatusProps) {
  const isLive = status === 'active';

  return (
    <Badge
      variant={isLive ? 'default' : 'secondary'}
      className={cn(
        'gap-1',
        isLive && 'bg-red-600 hover:bg-red-600',
        className
      )}
    >
      {isLive ? (
        <>
          <ActivityLogIcon className="h-3 w-3 animate-pulse" />
          LIVE
        </>
      ) : (
        <>
          <CrossCircledIcon className="h-3 w-3" />
          OFFLINE
        </>
      )}
    </Badge>
  );
}
