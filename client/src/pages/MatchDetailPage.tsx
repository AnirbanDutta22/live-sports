import { useParams, Link } from 'react-router-dom';
import { useMatch } from '../hooks/useMatches';
import { useCommentary } from '../hooks/useCommentary';
import { CommentaryItem, CommentaryItemSkeleton } from '../components/CommentaryItem';
import { TeamLogo } from '../components/TeamLogo';
import { LiveBadge, ScheduledBadge, FinishedBadge } from '../components/StatusBadge';
import { ConnectionIndicator } from '../components/ConnectionIndicator';
import { MatchDetailSkeleton } from '../components/Skeletons';
import { formatMatchTime, getLiveMinute, getSportEmoji, formatDate } from '../utils';
import { AlertCircle, MessageCircle } from 'lucide-react';

export function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const matchId = Number(id);

  const { match, isLoading: matchLoading, error: matchError } = useMatch(matchId);
  const {
    data: commentary,
    isLoading: commLoading,
    error: commError,
    wsStatus,
    isNew,
  } = useCommentary(matchId);

  if (matchLoading || (commLoading && !commentary)) {
    return <MatchDetailSkeleton />;
  }

  if (matchError || !match) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-ruby-500/60" />
          <h2 className="font-display font-semibold text-xl text-white/60">Match not found</h2>
          <Link
            to="/"
            className="text-sm font-body text-lime-neon hover:text-lime-neon/80 transition-colors"
          >
            ← Back to matches
          </Link>
        </div>
      </div>
    );
  }

  const liveMinute = match.status === 'live' ? getLiveMinute(match.startTime) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      {/* Match header card */}
      <div className="relative rounded-2xl overflow-hidden bg-card-gradient border border-white/[0.07] shadow-card mb-6">
        {/* Live top accent */}
        {match.status === 'live' && (
          <>
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-lime-neon/70 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-lime-neon/[0.03] to-transparent pointer-events-none" />
          </>
        )}

        <div className="relative p-6">
          {/* Competition + Status */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="text-sm">{getSportEmoji(match.sport)}</span>
            <span className="text-xs font-body font-medium text-white/40 uppercase tracking-widest">
              {match.competition ?? match.sport}
            </span>
            {match.status !== 'live' && (
              <span className="text-xs font-body text-white/25">·</span>
            )}
            {match.status === 'scheduled' && (
              <ScheduledBadge time={formatDate(match.startTime)} />
            )}
            {match.status === 'finished' && <FinishedBadge />}
          </div>

          {/* Teams + Score row */}
          <div className="flex items-center gap-4 sm:gap-8">
            {/* Home team */}
            <div className="flex-1 flex flex-col items-center gap-2 sm:gap-3">
              <TeamLogo name={match.homeTeam} logoUrl={match.homeLogoUrl} size="xl" />
              <span className="font-display font-semibold text-base sm:text-lg text-white text-center leading-tight">
                {match.homeTeam}
              </span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="flex items-baseline gap-2">
                <span
                  className={`font-display font-bold tabular-nums leading-none ${
                    match.status === 'scheduled'
                      ? 'text-3xl sm:text-4xl text-white/20'
                      : 'text-4xl sm:text-5xl text-white'
                  }`}
                >
                  {match.status === 'scheduled' ? '-' : match.homeScore}
                </span>
                <span className="font-display text-2xl text-white/20 leading-none">:</span>
                <span
                  className={`font-display font-bold tabular-nums leading-none ${
                    match.status === 'scheduled'
                      ? 'text-3xl sm:text-4xl text-white/20'
                      : 'text-4xl sm:text-5xl text-white'
                  }`}
                >
                  {match.status === 'scheduled' ? '-' : match.awayScore}
                </span>
              </div>

              {/* Live indicator below score */}
              {match.status === 'live' && (
                <div className="flex items-center gap-2">
                  <LiveBadge size="md" />
                  {liveMinute !== null && (
                    <span className="font-mono text-sm text-lime-neon/80 font-medium">
                      {liveMinute}'
                    </span>
                  )}
                </div>
              )}
              {match.status === 'scheduled' && (
                <span className="text-sm font-body text-white/30">
                  {formatMatchTime(match.startTime, 'scheduled')}
                </span>
              )}
            </div>

            {/* Away team */}
            <div className="flex-1 flex flex-col items-center gap-2 sm:gap-3">
              <TeamLogo name={match.awayTeam} logoUrl={match.awayLogoUrl} size="xl" />
              <span className="font-display font-semibold text-base sm:text-lg text-white text-center leading-tight">
                {match.awayTeam}
              </span>
            </div>
          </div>

          {/* Venue */}
          {match.venue && (
            <p className="mt-4 text-center text-xs font-body text-white/25">
              📍 {match.venue}
            </p>
          )}
        </div>
      </div>

      {/* Commentary section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-4 h-4 text-white/40" />
          <h2 className="font-display font-semibold text-sm tracking-widest text-white/50 uppercase">
            Commentary
          </h2>
          {commentary && (
            <span className="text-xs font-mono text-white/25 bg-white/[0.04] px-1.5 py-0.5 rounded">
              {commentary.length}
            </span>
          )}
        </div>

        {/* Commentary error */}
        {commError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-ruby-500/10 border border-ruby-500/20 mb-4">
            <AlertCircle className="w-4 h-4 text-ruby-500 flex-shrink-0" />
            <p className="text-sm font-body text-ruby-500/80">Failed to load commentary</p>
          </div>
        )}

        {/* Commentary loading */}
        {commLoading && !commentary && (
          <div className="space-y-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <CommentaryItemSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty commentary */}
        {!commLoading && commentary?.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-body text-white/25 text-sm">
              {match.status === 'scheduled'
                ? 'Commentary will begin when the match starts'
                : 'No commentary available yet'}
            </p>
          </div>
        )}

        {/* Commentary list */}
        {commentary && commentary.length > 0 && (
          <div className="space-y-0.5">
            {commentary.map((item) => (
              <CommentaryItem
                key={item.id}
                commentary={item}
                isNew={isNew(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ConnectionIndicator status={wsStatus} />
    </div>
  );
}
