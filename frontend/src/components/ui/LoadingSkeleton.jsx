export function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
      <div className="h-44 w-full bg-bg-soft" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 rounded bg-bg-soft" />
        <div className="h-3 w-1/2 rounded bg-bg-soft" />
        <div className="h-3 w-1/3 rounded bg-bg-soft" />
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
