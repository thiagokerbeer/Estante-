export function CatalogSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="h-4 w-28 rounded skeleton-shimmer bg-stone-200/80" />
      <div className="mt-3 h-10 max-w-md rounded-lg skeleton-shimmer bg-stone-200/60" />
      <div className="mt-2 h-4 max-w-lg rounded skeleton-shimmer bg-stone-200/50" />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="overflow-hidden rounded-xl border border-stone-200/80 bg-white">
            <div className="aspect-[3/4] skeleton-shimmer bg-stone-200/70" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-[88%] max-w-[200px] rounded skeleton-shimmer bg-stone-200/70" />
              <div className="h-3 w-1/2 rounded skeleton-shimmer bg-stone-200/50" />
            </div>
          </li>
        ))}
      </ul>
      <p className="sr-only">Carregando catálogo</p>
    </div>
  );
}
