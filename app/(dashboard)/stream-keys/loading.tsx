import { Skeleton } from '@/components/ui/skeleton';

export default function StreamKeysLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Search/filter skeleton */}
      <Skeleton className="h-9 w-64" />

      {/* Table skeleton */}
      <div className="rounded-md border">
        {/* Table header */}
        <div className="border-b p-4">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        {/* Table rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-b p-4 last:border-0">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
