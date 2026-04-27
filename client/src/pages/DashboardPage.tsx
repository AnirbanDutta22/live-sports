import { useMemo } from 'react';
import { useMatches } from '../hooks/useMatches';
import { MatchCard } from '../components/MatchCard';
import { MatchCardSkeleton } from '../components/Skeletons';
import { ConnectionIndicator } from '../components/ConnectionIndicator';
import { Radio, AlertCircle } from 'lucide-react';

export function DashboardPage() {
  const { data: matches, isLoading, error, wsStatus } = useMatches(50);

  const { live, scheduled, finished } = useMemo(() => {
    if (!matches) return { live: [], scheduled: [], finished: [] };
    return {
      live: matches.filter((m) => m.status === 'live'),
      scheduled: matches.filter((m) => m.status === 'scheduled'),
      finished: matches.filter((m) => m.status === 'finished'),
    };
  }, [matches]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="font-display font-bold text-2xl text-white tracking-wide">
            MATCHES
          </h1>
          {matches && (
            <span className="text-xs font-mono text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full">
              {matches.length}
            </span>
          )}
        </div>
        <p className="text-sm font-body text-white/40">
          Real-time scores across all competitions
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-ruby-500/10 border border-ruby-500/20 mb-6">
          <AlertCircle className="w-5 h-5 text-ruby-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-body font-medium text-ruby-500">Failed to load matches</p>
            <p className="text-xs font-body text-ruby-500/70 mt-0.5">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && matches?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mb-4">
            <Radio className="w-7 h-7 text-white/20" />
          </div>
          <p className="font-display font-medium text-white/40 text-lg">No matches yet</p>
          <p className="text-sm font-body text-white/25 mt-1">
            Matches will appear here in real-time
          </p>
        </div>
      )}

      {/* Live matches */}
      {live.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-ruby-500 animate-pulse-live" />
            <h2 className="font-display font-semibold text-sm tracking-widest text-white/60 uppercase">
              Live Now
            </h2>
            <span className="text-xs font-mono text-lime-neon/60 bg-lime-neon/[0.06] px-1.5 py-0.5 rounded">
              {live.length}
            </span>
          </div>
          <div className="space-y-3">
            {live.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Scheduled matches */}
      {scheduled.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-display font-semibold text-sm tracking-widest text-white/40 uppercase">
              Upcoming
            </h2>
            <span className="text-xs font-mono text-white/30 bg-white/[0.04] px-1.5 py-0.5 rounded">
              {scheduled.length}
            </span>
          </div>
          <div className="space-y-3">
            {scheduled.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Finished matches */}
      {finished.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-display font-semibold text-sm tracking-widest text-white/30 uppercase">
              Completed
            </h2>
            <span className="text-xs font-mono text-white/20 bg-white/[0.03] px-1.5 py-0.5 rounded">
              {finished.length}
            </span>
          </div>
          <div className="space-y-3">
            {finished.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      <ConnectionIndicator status={wsStatus} />
    </div>
  );
}
