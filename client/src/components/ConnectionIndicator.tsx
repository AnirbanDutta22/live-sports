import type { ConnectionStatus } from '../types';

interface Props {
  status: ConnectionStatus;
}

export function ConnectionIndicator({ status }: Props) {
  if (status === 'connected') return null;

  const config = {
    connecting: { label: 'Connecting...', color: 'text-gold-400', dot: 'bg-gold-400', pulse: true },
    disconnected: { label: 'Reconnecting', color: 'text-ember-500', dot: 'bg-ember-500', pulse: true },
    error: { label: 'Connection Error', color: 'text-ruby-500', dot: 'bg-ruby-500', pulse: false },
  }[status] ?? null;

  if (!config) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-pitch-800 border border-white/10 rounded-full px-3 py-1.5 shadow-card backdrop-blur-sm">
      <span
        className={`inline-block w-2 h-2 rounded-full ${config.dot} ${config.pulse ? 'animate-pulse' : ''}`}
      />
      <span className={`text-xs font-body font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
}
