import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Zap,
  Filter,
  MessageSquarePlus,
} from "lucide-react";
import { useAdminMatches } from "../hooks/match.hook";
import { Button, Badge, EmptyState } from "../components/ui";
import { MatchFormModal } from "../components/MatchFormModal";
import { ScoreUpdateModal } from "../components/ScoreUpdateModal";
import { TeamLogo } from "../../components/TeamLogo";
import { LiveBadge } from "../../components/StatusBadge";
import { getLiveMinute, getSportEmoji } from "../../utils";
import type { Match, MatchStatus } from "../../types";

type FilterStatus = "all" | MatchStatus;

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "🔴 Live" },
  { value: "scheduled", label: "Upcoming" },
  { value: "finished", label: "Finished" },
  { value: "postponed", label: "Postponed" },
];

function MatchRow({
  match,
  onEdit,
  onScore,
}: {
  match: Match;
  onEdit: (m: Match) => void;
  onScore: (m: Match) => void;
}) {
  const navigate = useNavigate();
  const liveMin =
    match.status === "live" ? getLiveMinute(match.startTime) : null;

  return (
    <tr className="group border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors">
      {/* Sport */}
      <td className="px-4 py-3 text-center">
        <span className="text-lg">{getSportEmoji(match.sport)}</span>
      </td>

      {/* Teams */}
      <td className="px-3 py-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <TeamLogo name={match.homeTeam} size="sm" />
            <span className="font-body text-sm text-white/80">
              {match.homeTeam}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TeamLogo name={match.awayTeam} size="sm" />
            <span className="font-body text-sm text-white/80">
              {match.awayTeam}
            </span>
          </div>
        </div>
      </td>

      {/* Score */}
      <td className="px-3 py-3 text-center">
        {match.status !== "scheduled" ? (
          <span className="font-display font-bold text-lg text-white tabular-nums">
            {match.homeScore}–{match.awayScore}
          </span>
        ) : (
          <span className="font-body text-sm text-white/25">vs</span>
        )}
      </td>

      {/* Status */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          {match.status === "live" && <LiveBadge size="sm" />}
          {match.status === "live" && liveMin !== null && (
            <span className="text-[11px] font-mono text-lime-neon/60">
              {liveMin}'
            </span>
          )}
          {match.status === "scheduled" && <Badge color="cyan">SOON</Badge>}
          {match.status === "finished" && <Badge color="gray">FT</Badge>}
          {match.status === "postponed" && <Badge color="ember">PPD</Badge>}
        </div>
      </td>

      {/* Competition */}
      <td className="px-3 py-3 hidden lg:table-cell">
        <span className="text-xs font-body text-white/35 truncate block max-w-[120px]">
          {match.competition ?? "—"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {match.status === "live" && (
            <Button
              variant="primary"
              size="xs"
              icon={<Zap className="w-3 h-3" />}
              onClick={() => onScore(match)}
            >
              Score
            </Button>
          )}
          <Button
            variant="secondary"
            size="xs"
            icon={<MessageSquarePlus className="w-3 h-3" />}
            onClick={() => navigate(`/admin/commentary/${match.id}`)}
          />
          <Button
            variant="ghost"
            size="xs"
            icon={<Pencil className="w-3 h-3" />}
            onClick={() => onEdit(match)}
          />
          <Button
            variant="danger"
            size="xs"
            icon={<Trash2 className="w-3 h-3" />}
          />
        </div>
      </td>
    </tr>
  );
}

export function AdminMatchesPage() {
  const { data: matches, isLoading } = useAdminMatches();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [editMatch, setEditMatch] = useState<Match | null>(null);
  const [scoreMatch, setScoreMatch] = useState<Match | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    if (!matches) return [];
    return matches.filter((m) => {
      const matchesStatus = filterStatus === "all" || m.status === filterStatus;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        m.homeTeam.toLowerCase().includes(q) ||
        m.awayTeam.toLowerCase().includes(q) ||
        (m.competition ?? "").toLowerCase().includes(q) ||
        (m.venue ?? "").toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [matches, filterStatus, search]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white tracking-wide">
            Matches
          </h1>
          <p className="text-sm font-body text-white/35 mt-0.5">
            {matches?.length ?? 0} total matches
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input
            type="text"
            placeholder="Search teams, competitions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-pitch-800 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm font-body text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-lime-neon/30 focus:border-lime-neon/50 transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-1 bg-pitch-800 border border-white/[0.06] rounded-lg p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className={`px-2.5 py-1 rounded-md text-xs font-body font-medium transition-all whitespace-nowrap ${
                filterStatus === f.value
                  ? "bg-lime-neon/15 text-lime-neon border border-lime-neon/25"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-gradient border border-white/[0.07] rounded-xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="space-y-px p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-4 py-4 items-center">
                <div className="w-6 h-6 bg-white/[0.05] rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="w-36 h-3 bg-white/[0.05] rounded animate-pulse" />
                  <div className="w-28 h-3 bg-white/[0.05] rounded animate-pulse" />
                </div>
                <div className="w-10 h-6 bg-white/[0.05] rounded animate-pulse" />
                <div className="w-16 h-5 bg-white/[0.05] rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Filter className="w-6 h-6" />}
            title={
              search || filterStatus !== "all"
                ? "No matches found"
                : "No matches yet"
            }
            description={
              search || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Create your first match"
            }
            action={
              !search && filterStatus === "all" ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setShowCreate(true)}
                >
                  Create Match
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {[
                    "",
                    "Teams",
                    "Score",
                    "Status",
                    "Competition",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-[10px] font-body font-medium text-white/30 uppercase tracking-widest first:px-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <MatchRow
                    key={m.id}
                    match={m}
                    onEdit={setEditMatch}
                    onScore={setScoreMatch}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer count */}
        {!isLoading && filtered.length > 0 && (
          <div className="px-4 py-2 border-t border-white/[0.04]">
            <span className="text-[11px] font-body text-white/25">
              Showing {filtered.length} of {matches?.length ?? 0} matches
            </span>
          </div>
        )}
      </div>

      {/* Modals */}
      <MatchFormModal open={showCreate} onClose={() => setShowCreate(false)} />
      <MatchFormModal
        open={!!editMatch}
        onClose={() => setEditMatch(null)}
        editMatch={editMatch}
      />
      {scoreMatch && (
        <ScoreUpdateModal
          open={!!scoreMatch}
          onClose={() => setScoreMatch(null)}
          match={scoreMatch}
        />
      )}
    </div>
  );
}
