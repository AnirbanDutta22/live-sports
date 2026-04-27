import type { Commentary } from '../types';
import { EventIcon } from './EventIcon';
import { getEventTypeLabel } from '../utils';

interface CommentaryItemProps {
  commentary: Commentary;
  isNew?: boolean;
}

const highlightEvents = new Set(['goal', 'red_card', 'penalty', 'fulltime', 'halftime']);

export function CommentaryItem({ commentary, isNew }: CommentaryItemProps) {
  const isHighlight = highlightEvents.has(commentary.eventType);

  return (
    <div
      className={`
        relative flex gap-3 py-3 px-4 rounded-lg border transition-all
        ${isNew ? 'animate-slide-in-top' : ''}
        ${isNew && commentary.eventType !== 'comment'
          ? 'border-lime-neon/20 bg-lime-neon/[0.04]'
          : 'border-transparent bg-transparent'
        }
        ${isHighlight && !isNew
          ? 'border-white/[0.06] bg-white/[0.025]'
          : ''
        }
        hover:bg-white/[0.02]
      `}
    >
      {/* Minute column */}
      <div className="flex-shrink-0 w-10 text-right">
        <span
          className={`font-mono text-sm font-medium ${
            isHighlight ? 'text-lime-neon' : 'text-white/35'
          }`}
        >
          {commentary.minute}'
        </span>
      </div>

      {/* Icon column */}
      <div className="flex-shrink-0 mt-0.5">
        <EventIcon eventType={commentary.eventType} />
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0">
        {/* Event type label */}
        {commentary.eventType !== 'comment' && (
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`text-[10px] font-display font-semibold tracking-widest ${
                commentary.eventType === 'goal' ? 'text-lime-neon' :
                commentary.eventType === 'red_card' ? 'text-ruby-500' :
                commentary.eventType === 'yellow_card' ? 'text-gold-400' :
                commentary.eventType === 'penalty' ? 'text-ember-500' :
                commentary.eventType === 'var' ? 'text-cyan-neon' :
                'text-white/50'
              }`}
            >
              {getEventTypeLabel(commentary.eventType)}
            </span>

            {/* Metadata tags inline */}
            {commentary.metadata && Object.entries(commentary.metadata).map(([key, val]) => (
              key === 'goal_type' || key === 'card_reason' ? (
                <span
                  key={key}
                  className="text-[9px] font-body font-medium px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 uppercase tracking-wider"
                >
                  {String(val)}
                </span>
              ) : null
            ))}
          </div>
        )}

        {/* Message */}
        <p
          className={`font-body leading-relaxed ${
            isHighlight
              ? 'text-white/90 text-sm font-medium'
              : 'text-white/60 text-sm'
          }`}
        >
          {commentary.message}
        </p>

        {/* Tags */}
        {commentary.tags && commentary.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {commentary.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-body text-cyan-400/60 hover:text-cyan-400/90 transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* New indicator dot */}
      {isNew && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-lime-neon rounded-full" />
      )}
    </div>
  );
}

export function CommentaryItemSkeleton() {
  return (
    <div className="flex gap-3 py-3 px-4 rounded-lg">
      <div className="w-10 h-4 bg-white/5 rounded animate-shimmer" style={{ backgroundImage: 'var(--tw-gradient-stops)', backgroundSize: '200% 100%' }} />
      <div className="w-4 h-4 bg-white/5 rounded-full mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="w-24 h-3 bg-white/5 rounded" />
        <div className="w-full h-4 bg-white/5 rounded" />
        <div className="w-3/4 h-4 bg-white/5 rounded" />
      </div>
    </div>
  );
}
