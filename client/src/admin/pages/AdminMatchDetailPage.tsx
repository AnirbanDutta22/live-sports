import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Pencil,
  Zap,
  MessageSquarePlus,
  Trash2,
  Clock,
  Trophy,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useAdminCommentary } from "../hooks/commentary.hook";
import { useAdminMatch, useUpdateMatch } from "../hooks/match.hook";
import { Button, Badge, EmptyState } from "../components/ui";
import { MatchFormModal } from "../components/MatchFormModal";
import { ScoreUpdateModal } from "../components/ScoreUpdateModal";
import { CommentaryFormModal } from "../components/CommentaryFormModal";
import { TeamLogo } from "../../components/TeamLogo";
import { LiveBadge } from "../../components/StatusBadge";
import { EventIcon } from "../../components/EventIcon";
import { useToast } from "../context/ToastContext";
import {
  getLiveMinute,
  getSportEmoji,
  getEventTypeLabel,
  formatDate,
} from "../../utils";
import type { Commentary, MatchStatus } from "../../types";

const STATUS_OPTIONS: { value: MatchStatus; label: string; color: string }[] = [
  { value: "scheduled", label: "Scheduled", color: "text-cyan-400" },
  { value: "live", label: "Live", color: "text-ruby-500" },
  { value: "finished", label: "Finished", color: "text-white/50" },
  { value: "postponed", label: "Postponed", color: "text-ember-500" },
];

function CommentaryRow({ item }: { item: Commentary }) {
  return (
    <div className="group flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors">
      {/* Minute */}
      <span className="font-mono text-sm text-white/35 w-8 text-right flex-shrink-0 mt-0.5">
        {item.minute}'
      </span>

      {/* Icon */}
      <div className="mt-0.5 flex-shrink-0">
        <EventIcon eventType={item.eventType} className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {item.eventType !== "comment" && (
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-display font-semibold tracking-widest text-white/50">
              {getEventTypeLabel(item.eventType)}
            </span>
            {item.metadata &&
              Object.entries(item.metadata).map(([k, v]) => (
                <span
                  key={k}
                  className="text-[9px] px-1 py-0.5 rounded bg-white/[0.05] text-white/30"
                >
                  {String(v).replace(/_/g, " ")}
                </span>
              ))}
          </div>
        )}
        <p className="text-sm font-body text-white/70 leading-snug">
          {item.message}
        </p>
        {item.tags && item.tags.length > 0 && (
          <div className="flex gap-1.5 mt-1">
            {item.tags.map((t) => (
              <span key={t} className="text-[11px] font-body text-cyan-400/50">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Delete */}
      <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-white/25 hover:text-ruby-500 hover:bg-ruby-500/10 transition-all">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function AdminMatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const matchId = Number(id);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    data: match,
    isLoading: matchLoading,
    refetch: refetchMatch,
  } = useAdminMatch(matchId);
  const {
    data: commentary,
    isLoading: commLoading,
    refetch: refetchComm,
  } = useAdminCommentary(matchId);
  const updateMutation = useUpdateMatch();

  const [showEdit, setShowEdit] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showCommentary, setShowCommentary] = useState(false);

  if (matchLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="w-24 h-4 bg-white/[0.05] rounded animate-pulse" />
        <div className="h-40 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-64 bg-white/[0.03] rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="py-20 text-center">
        <AlertCircle className="w-10 h-10 text-ruby-500/40 mx-auto mb-3" />
        <p className="font-body text-white/40">Match not found</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/matches")}
          className="mt-4"
        >
          ← Back to matches
        </Button>
      </div>
    );
  }

  const liveMin =
    match.status === "live" ? getLiveMinute(match.startTime) : null;

  async function quickStatusChange(status: MatchStatus) {
    try {
      await updateMutation.mutateAsync({ id: match!.id, status });
      toast(`Status set to ${status}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed", "error");
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="xs"
          icon={<ChevronLeft className="w-3.5 h-3.5" />}
          onClick={() => navigate("/admin/matches")}
        >
          Matches
        </Button>
        <span className="text-white/20 text-xs">/</span>
        <span className="text-xs font-body text-white/40 truncate">
          {match.homeTeam} vs {match.awayTeam}
        </span>
      </div>

      {/* Match header card */}
      <div className="bg-card-gradient border border-white/[0.07] rounded-xl shadow-card overflow-hidden">
        {match.status === "live" && (
          <div className="h-[1px] bg-gradient-to-r from-transparent via-lime-neon/60 to-transparent" />
        )}

        <div className="p-5">
          {/* Top row: sport / competition + actions */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{getSportEmoji(match.sport)}</span>
                <span className="text-xs font-body text-white/40 uppercase tracking-wider">
                  {match.competition ?? match.sport}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <Clock className="w-3 h-3 text-white/25" />
                <span className="text-xs font-body text-white/30">
                  {formatDate(match.startTime)}
                </span>
                {match.venue && (
                  <span className="text-xs font-body text-white/25">
                    · {match.venue}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                icon={<RefreshCw className="w-3 h-3" />}
                onClick={() => {
                  refetchMatch();
                  refetchComm();
                }}
              >
                Refresh
              </Button>
              <Button
                variant="secondary"
                size="xs"
                icon={<Pencil className="w-3 h-3" />}
                onClick={() => setShowEdit(true)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="xs"
                icon={<Trash2 className="w-3 h-3" />}
              />
            </div>
          </div>

          {/* Teams + Score */}
          <div className="flex items-center gap-6">
            <div className="flex-1 flex items-center gap-3">
              <TeamLogo
                name={match.homeTeam}
                logoUrl={match.homeLogoUrl}
                size="lg"
              />
              <div>
                <p className="font-display font-semibold text-lg text-white">
                  {match.homeTeam}
                </p>
                <p className="text-xs font-body text-white/30">Home</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <span className="font-display font-bold text-4xl text-white tabular-nums">
                {match.status === "scheduled"
                  ? "–"
                  : `${match.homeScore}–${match.awayScore}`}
              </span>
              <div className="flex items-center gap-2">
                {match.status === "live" && <LiveBadge size="sm" />}
                {match.status === "live" && liveMin !== null && (
                  <span className="text-xs font-mono text-lime-neon/60">
                    {liveMin}'
                  </span>
                )}
                {match.status === "scheduled" && (
                  <Badge color="cyan">UPCOMING</Badge>
                )}
                {match.status === "finished" && (
                  <Badge color="gray">FULL TIME</Badge>
                )}
                {match.status === "postponed" && (
                  <Badge color="ember">POSTPONED</Badge>
                )}
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3 justify-end">
              <div className="text-right">
                <p className="font-display font-semibold text-lg text-white">
                  {match.awayTeam}
                </p>
                <p className="text-xs font-body text-white/30">Away</p>
              </div>
              <TeamLogo
                name={match.awayTeam}
                logoUrl={match.awayLogoUrl}
                size="lg"
              />
            </div>
          </div>

          {/* Quick actions row */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.06] flex-wrap">
            <span className="text-[11px] font-body text-white/30 uppercase tracking-wider mr-1">
              Status:
            </span>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => quickStatusChange(opt.value)}
                disabled={
                  match.status === opt.value || updateMutation.isPending
                }
                className={`px-2.5 py-1 rounded-md text-xs font-body font-medium border transition-all disabled:opacity-40 disabled:cursor-default ${
                  match.status === opt.value
                    ? `${opt.color} border-current bg-current/10`
                    : "text-white/35 border-white/[0.06] hover:text-white/70 hover:border-white/15"
                }`}
              >
                {opt.label}
              </button>
            ))}

            <div className="ml-auto flex gap-2">
              {match.status === "live" && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Zap className="w-3.5 h-3.5" />}
                  onClick={() => setShowScore(true)}
                >
                  Update Score
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                icon={<MessageSquarePlus className="w-3.5 h-3.5" />}
                onClick={() => setShowCommentary(true)}
              >
                Add Commentary
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Commentary panel */}
      <div className="bg-card-gradient border border-white/[0.07] rounded-xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-white/30" />
            <h2 className="font-display font-semibold text-sm text-white/70 tracking-wide">
              Commentary
            </h2>
            {commentary && (
              <span className="text-[11px] font-mono text-white/25 bg-white/[0.04] px-1.5 py-0.5 rounded">
                {commentary.length}
              </span>
            )}
          </div>
          <Button
            variant="primary"
            size="xs"
            icon={<MessageSquarePlus className="w-3 h-3" />}
            onClick={() => setShowCommentary(true)}
          >
            Add
          </Button>
        </div>

        {commLoading && (
          <div className="space-y-px p-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 px-4 py-3">
                <div className="w-8 h-3 bg-white/[0.04] rounded animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-full h-3 bg-white/[0.04] rounded animate-pulse" />
                  <div className="w-3/4 h-3 bg-white/[0.04] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!commLoading && (!commentary || commentary.length === 0) && (
          <EmptyState
            icon={<MessageSquarePlus className="w-6 h-6" />}
            title="No commentary yet"
            description="Add the first commentary entry for this match"
            action={
              <Button
                variant="primary"
                size="sm"
                icon={<MessageSquarePlus className="w-3.5 h-3.5" />}
                onClick={() => setShowCommentary(true)}
              >
                Add Commentary
              </Button>
            }
          />
        )}

        {!commLoading && commentary && commentary.length > 0 && (
          <div>
            {commentary.map((item) => (
              <CommentaryRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <MatchFormModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        editMatch={match}
      />
      {match && (
        <ScoreUpdateModal
          open={showScore}
          onClose={() => setShowScore(false)}
          match={match}
        />
      )}
      <CommentaryFormModal
        open={showCommentary}
        onClose={() => setShowCommentary(false)}
        matchId={matchId}
        currentMinute={liveMin ?? 0}
      />
    </div>
  );
}
