interface LiveBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LiveBadge({ size = 'md' }: LiveBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-1 gap-1.5',
    lg: 'text-sm px-2.5 py-1 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center ${sizeClasses} bg-ruby-500/15 border border-ruby-500/40 rounded-sm font-display font-semibold text-ruby-500 tracking-widest shadow-live`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-ruby-500 animate-pulse-live" />
      LIVE
    </span>
  );
}

export function ScheduledBadge({ time }: { time: string }) {
  return (
    <span className="inline-flex items-center text-xs px-2 py-0.5 bg-pitch-700 border border-white/10 rounded-sm font-mono text-white/60 tracking-wider">
      {time}
    </span>
  );
}

export function FinishedBadge() {
  return (
    <span className="inline-flex items-center text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded-sm font-display font-semibold text-white/40 tracking-widest">
      FT
    </span>
  );
}
