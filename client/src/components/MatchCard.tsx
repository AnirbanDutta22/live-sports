import { useNavigate } from 'react-router-dom';
import type { Match } from '../types';
import { LiveBadge, ScheduledBadge, FinishedBadge } from './StatusBadge';
import { TeamLogo } from './TeamLogo';
import { formatMatchTime, getLiveMinute, getSportEmoji } from '../utils';

interface MatchCardProps {
  match: Match;
  isNew?: boolean;
}

export function MatchCard({ match, isNew }: MatchCardProps) {
  const navigate = useNavigate();
  const liveMinute = match.status === 'live' ? getLiveMinute(match.startTime) : null;

  return (
    <article
      onClick={() => navigate(`/match/${match.id}`)}
      className={`
        group relative cursor-pointer rounded-xl overflow-hidden
        bg-card-gradient border border-white/[0.07]
        shadow-card hover:shadow-card-hover hover:border-white/[0.13]
        transition-all duration-300 ease-out
        ${isNew ? 'animate-slide-in-top' : ''}
        ${match.status === 'live' ? 'hover:border-lime-neon/20' : ''}
      `}
    >
      {/* Live glow accent */}
      {match.status === 'live' && (
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-lime-neon/60 to-transparent" />
      )}

      {/* Card body */}
      <div className="p-4">
        {/* Header row: sport + status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm leading-none">{getSportEmoji(match.sport)}</span>
            <span className="text-[11px] font-body font-medium text-white/40 uppercase tracking-widest">
              {match.competition ?? match.sport}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {match.status === 'live' && liveMinute !== null && (
              <span className="text-[11px] font-mono text-lime-neon/80">{liveMinute}'</span>
            )}
            {match.status === 'live' && <LiveBadge size="sm" />}
            {match.status === 'scheduled' && (
              <ScheduledBadge time={formatMatchTime(match.startTime, 'scheduled')} />
            )}
            {match.status === 'finished' && <FinishedBadge />}
          </div>
        </div>

        {/* Teams + Score */}
        <div className="flex items-center gap-3">
          {/* Home team */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <TeamLogo name={match.homeTeam} logoUrl={match.homeLogoUrl} size="md" />
            <span
              className={`font-display font-semibold text-sm truncate transition-colors ${
                match.status === 'live' ? 'text-white' : 'text-white/80'
              }`}
            >
              {match.homeTeam}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className={`font-display font-bold text-2xl tabular-nums leading-none ${
                match.status === 'live'
                  ? 'text-white'
                  : match.status === 'finished'
                  ? 'text-white/70'
                  : 'text-white/25'
              }`}
            >
              {match.status === 'scheduled' ? '-' : match.homeScore}
            </span>
            <span className="font-display text-xl text-white/20 leading-none">:</span>
            <span
              className={`font-display font-bold text-2xl tabular-nums leading-none ${
                match.status === 'live'
                  ? 'text-white'
                  : match.status === 'finished'
                  ? 'text-white/70'
                  : 'text-white/25'
              }`}
            >
              {match.status === 'scheduled' ? '-' : match.awayScore}
            </span>
          </div>

          {/* Away team */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
            <span
              className={`font-display font-semibold text-sm truncate text-right transition-colors ${
                match.status === 'live' ? 'text-white' : 'text-white/80'
              }`}
            >
              {match.awayTeam}
            </span>
            <TeamLogo name={match.awayTeam} logoUrl={match.awayLogoUrl} size="md" />
          </div>
        </div>

        {/* Footer */}
        {match.venue && (
          <p className="mt-2.5 text-[11px] font-body text-white/25 text-center truncate">
            📍 {match.venue}
          </p>
        )}
      </div>

      {/* Hover arrow */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white/30">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </article>
  );
}
