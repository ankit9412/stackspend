import { cn } from '../../lib/utils';

export function Skeleton({ className }) {
  return (
    <div className={cn('shimmer rounded-lg animate-pulse', className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="card-glass p-6 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}
