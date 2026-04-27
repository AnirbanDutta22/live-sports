export function MatchCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-card-gradient p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="w-24 h-3 bg-white/[0.06] rounded animate-pulse" />
        <div className="w-10 h-4 bg-white/[0.06] rounded animate-pulse" />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-10 h-10 rounded-full bg-white/[0.06] animate-pulse" />
          <div className="w-28 h-4 bg-white/[0.06] rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-7 bg-white/[0.06] rounded animate-pulse" />
          <div className="w-2 h-2 bg-white/[0.04] rounded animate-pulse" />
          <div className="w-6 h-7 bg-white/[0.06] rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2.5 flex-1 justify-end">
          <div className="w-28 h-4 bg-white/[0.06] rounded animate-pulse" />
          <div className="w-10 h-10 rounded-full bg-white/[0.06] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function MatchDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header skeleton */}
      <div className="rounded-2xl border border-white/[0.06] bg-card-gradient p-6 mb-6 shadow-card">
        <div className="w-36 h-3 bg-white/[0.06] rounded mx-auto mb-6 animate-pulse" />
        <div className="flex items-center gap-4">
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/[0.06] animate-pulse" />
            <div className="w-24 h-4 bg-white/[0.06] rounded animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-12 bg-white/[0.06] rounded animate-pulse" />
            <div className="w-16 h-4 bg-white/[0.06] rounded animate-pulse" />
          </div>
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/[0.06] animate-pulse" />
            <div className="w-24 h-4 bg-white/[0.06] rounded animate-pulse" />
          </div>
        </div>
      </div>
      {/* Commentary skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 py-3 px-4">
            <div className="w-10 h-4 bg-white/[0.04] rounded animate-pulse" />
            <div className="w-4 h-4 bg-white/[0.04] rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="w-full h-3 bg-white/[0.04] rounded animate-pulse" />
              <div className="w-3/4 h-3 bg-white/[0.04] rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
