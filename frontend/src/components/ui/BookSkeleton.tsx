export function BookSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse" aria-hidden>
      <div className="h-4 w-24 rounded skeleton-shimmer bg-stone-200/70" />
      <div className="mt-6 flex flex-col gap-8 md:flex-row">
        <div className="w-full shrink-0 md:w-56">
          <div className="aspect-[3/4] w-full rounded-xl skeleton-shimmer bg-stone-200/80" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-9 max-w-md rounded-lg skeleton-shimmer bg-stone-200/80" />
          <div className="h-5 w-48 rounded skeleton-shimmer bg-stone-200/60" />
          <div className="mt-8 space-y-2">
            <div className="h-3 rounded skeleton-shimmer bg-stone-200/50" />
            <div className="h-3 rounded skeleton-shimmer bg-stone-200/50" />
            <div className="h-3 max-w-[92%] rounded skeleton-shimmer bg-stone-200/50" />
          </div>
        </div>
      </div>
      <p className="sr-only">Carregando livro</p>
    </div>
  );
}
