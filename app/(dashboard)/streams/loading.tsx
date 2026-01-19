import { Skeleton } from '@/components/ui/skeleton';

export default function StreamsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Grid controls skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Stream grid skeleton - 2x2 grid */}
      <div className="grid flex-1 grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-video w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
