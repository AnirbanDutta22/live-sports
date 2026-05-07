import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ListVideo,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useAdminMatches } from "../hooks/match.hook";
import { StatCard, Button, Badge, EmptyState } from "../components/ui";
import { MatchFormModal } from "../components/MatchFormModal";
import { TeamLogo } from "../../components/TeamLogo";
import { LiveBadge } from "../../components/StatusBadge";
import { getLiveMinute, getSportEmoji } from "../../utils";
import type { Match } from "../../types";

function RecentMatchRow({ match }: { match: Match }) {
  const navigate = useNavigate();
  const liveMinute =
    match.status === "live" ? getLiveMinute(match.startTime) : null;

  const statusBadge = {
    live: <LiveBadge size="sm" />,
    scheduled: <Badge color="gray">SOON</Badge>,
    finished: <Badge color="gray">FT</Badge>,
    postponed: <Badge color="ember">PPD</Badge>,
  }[match.status];

  return (
    <div
      onClick={() => navigate(`/admin/matches/${match.id}`)}
      className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer"
    >
      <span className="text-base flex-shrink-0">
        {getSportEmoji(match.sport)}
      </span>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <TeamLogo name={match.homeTeam} size="sm" />
        <span className="font-body text-sm text-white/70 truncate">
          {match.homeTeam}
        </span>
        <span className="font-display font-bold text-sm text-white/90 tabular-nums flex-shrink-0">
          {match.status !== "scheduled"
            ? `${match.homeScore}–${match.awayScore}`
            : "vs"}
        </span>
        <span className="font-body text-sm text-white/70 truncate">
          {match.awayTeam}
        </span>
        <TeamLogo name={match.awayTeam} size="sm" />
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {liveMinute !== null && (
          <span className="text-[11px] font-mono text-lime-neon/70">
            {liveMinute}'
          </span>
        )}
        {statusBadge}
      </div>

      <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
    </div>
  );
}

export function AdminOverviewPage() {
  const { data: matches, isLoading } = useAdminMatches();
  const [showCreate, setShowCreate] = useState(false);

  const stats = useMemo(
    () => ({
      total: matches?.length ?? 0,
      live: matches?.filter((m) => m.status === "live").length ?? 0,
      finished: matches?.filter((m) => m.status === "finished").length ?? 0,
      scheduled: matches?.filter((m) => m.status === "scheduled").length ?? 0,
    }),
    [matches],
  );

  const recent = matches?.slice(0, 8) ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white tracking-wide">
            Overview
          </h1>
          <p className="text-sm font-body text-white/35 mt-0.5">
            Control centre for all matches & events
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setShowCreate(true)}
        >
          New Match
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Matches"
          value={stats.total}
          icon={<ListVideo className="w-4 h-4" />}
          accent="text-white/60"
        />
        <StatCard
          label="Live Now"
          value={stats.live}
          icon={<Activity className="w-4 h-4" />}
          accent="text-ruby-500"
        />
        <StatCard
          label="Upcoming"
          value={stats.scheduled}
          icon={<Clock className="w-4 h-4" />}
          accent="text-cyan-400"
        />
        <StatCard
          label="Completed"
          value={stats.finished}
          icon={<CheckCircle2 className="w-4 h-4" />}
          accent="text-lime-neon"
        />
      </div>

      {/* Recent matches */}
      <div className="bg-card-gradient border border-white/[0.07] rounded-xl shadow-card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-white/30" />
            <h2 className="font-display font-semibold text-sm text-white/70 tracking-wide">
              Recent Matches
            </h2>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => window.location.assign("/admin/matches")}
          >
            View all <ArrowRight className="w-3 h-3" />
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-1 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-lg"
              >
                <div className="w-5 h-5 bg-white/[0.05] rounded animate-pulse" />
                <div className="flex-1 h-3 bg-white/[0.05] rounded animate-pulse" />
                <div className="w-12 h-4 bg-white/[0.05] rounded animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && recent.length === 0 && (
          <EmptyState
            icon={<Zap className="w-6 h-6" />}
            title="No matches yet"
            description="Create your first match to get started"
            action={
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setShowCreate(true)}
              >
                Create Match
              </Button>
            }
          />
        )}

        {!isLoading && recent.length > 0 && (
          <div className="p-2">
            {recent.map((m) => (
              <RecentMatchRow key={m.id} match={m} />
            ))}
          </div>
        )}
      </div>

      <MatchFormModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
