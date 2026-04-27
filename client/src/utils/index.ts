import type { CommentaryEventType, MatchStatus } from '../types';

export function formatMatchTime(startTime: string, status: MatchStatus): string {
  if (status === 'finished') return 'FT';
  if (status === 'scheduled') {
    const date = new Date(startTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return 'LIVE';
}

export function getLiveMinute(startTime: string): number {
  const start = new Date(startTime).getTime();
  const now = Date.now();
  const diffMs = now - start;
  const diffMins = Math.floor(diffMs / 60000);
  return Math.min(diffMins, 90);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getSportEmoji(sport: string): string {
  const map: Record<string, string> = {
    football: '⚽',
    soccer: '⚽',
    basketball: '🏀',
    cricket: '🏏',
    tennis: '🎾',
    rugby: '🏉',
    baseball: '⚾',
    hockey: '🏒',
  };
  return map[sport.toLowerCase()] ?? '🏆';
}

export function getEventTypeLabel(eventType: CommentaryEventType): string {
  const map: Record<CommentaryEventType, string> = {
    goal: 'GOAL',
    yellow_card: 'YELLOW CARD',
    red_card: 'RED CARD',
    substitution: 'SUB',
    kickoff: 'KICKOFF',
    halftime: 'HALF TIME',
    fulltime: 'FULL TIME',
    penalty: 'PENALTY',
    var: 'VAR',
    injury: 'INJURY',
    corner: 'CORNER',
    foul: 'FOUL',
    offside: 'OFFSIDE',
    save: 'SAVE',
    comment: '',
  };
  return map[eventType] ?? eventType.toUpperCase();
}

export function getTeamInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
}

// Generate a stable pastel color from team name
export function getTeamColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981',
    '#06b6d4', '#f59e0b', '#ef4444', '#84cc16', '#6366f1',
  ];
  return colors[Math.abs(hash) % colors.length];
}
