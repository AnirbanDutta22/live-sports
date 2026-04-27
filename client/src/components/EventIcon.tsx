import {
  Trophy,
  Square,
  ArrowLeftRight,
  Wind,
  Clock,
  Shield,
  AlertTriangle,
  Flag,
  CornerUpRight,
  Hand,
  Minus,
  MessageCircle,
  Zap,
  Eye,
} from 'lucide-react';
import type { CommentaryEventType } from '../types';

interface EventIconProps {
  eventType: CommentaryEventType;
  className?: string;
}

export function EventIcon({ eventType, className = 'w-4 h-4' }: EventIconProps) {
  const icons: Record<CommentaryEventType, { icon: React.ReactNode; color: string }> = {
    goal: { icon: <Trophy className={className} />, color: 'text-lime-neon' },
    yellow_card: { icon: <Square className={className} />, color: 'text-gold-400' },
    red_card: { icon: <Square className={className} />, color: 'text-ruby-500' },
    substitution: { icon: <ArrowLeftRight className={className} />, color: 'text-cyan-400' },
    kickoff: { icon: <Wind className={className} />, color: 'text-white/60' },
    halftime: { icon: <Clock className={className} />, color: 'text-white/60' },
    fulltime: { icon: <Shield className={className} />, color: 'text-white/60' },
    penalty: { icon: <Zap className={className} />, color: 'text-ember-500' },
    var: { icon: <Eye className={className} />, color: 'text-cyan-neon' },
    injury: { icon: <AlertTriangle className={className} />, color: 'text-ruby-500' },
    corner: { icon: <CornerUpRight className={className} />, color: 'text-white/50' },
    foul: { icon: <Flag className={className} />, color: 'text-gold-400' },
    offside: { icon: <Minus className={className} />, color: 'text-white/40' },
    save: { icon: <Hand className={className} />, color: 'text-cyan-400' },
    comment: { icon: <MessageCircle className={className} />, color: 'text-white/30' },
  };

  const config = icons[eventType] ?? icons.comment;
  return <span className={config.color}>{config.icon}</span>;
}
