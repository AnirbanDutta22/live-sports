import { useState } from "react";
import { Minus, Plus, Zap } from "lucide-react";
import { Modal, Button } from "../components/ui";
import { useUpdateScore } from "../hooks/match.hook";
import { useToast } from "../context/ToastContext";
import type { Match } from "../../types";

interface Props {
  open: boolean;
  onClose: () => void;
  match: Match;
}

export function ScoreUpdateModal({ open, onClose, match }: Props) {
  const toast = useToast();
  const mutation = useUpdateScore();
  const [home, setHome] = useState(match.homeScore);
  const [away, setAway] = useState(match.awayScore);

  // Sync when match prop changes
  const resetToMatch = () => {
    setHome(match.homeScore);
    setAway(match.awayScore);
  };

  async function handleSave() {
    try {
      await mutation.mutateAsync({
        matchId: match.id,
        homeScore: home,
        awayScore: away,
      });
      toast("Score updated");
      onClose();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to update score",
        "error",
      );
    }
  }

  const ScoreControl = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs font-body font-medium text-white/40 uppercase tracking-widest">
        {label}
      </span>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-display font-bold text-5xl text-white w-14 text-center tabular-nums">
          {value}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-full bg-lime-neon/10 hover:bg-lime-neon/20 border border-lime-neon/30 flex items-center justify-center text-lime-neon transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={() => {
        resetToMatch();
        onClose();
      }}
      title="Update Score"
      maxWidth="max-w-sm"
    >
      <div className="space-y-6">
        {/* Match name */}
        <p className="text-center text-sm font-body text-white/40">
          {match.homeTeam} vs {match.awayTeam}
        </p>

        {/* Score controls */}
        <div className="flex items-center justify-center gap-6">
          <ScoreControl
            label={match.homeTeam}
            value={home}
            onChange={setHome}
          />
          <span className="font-display text-2xl text-white/20 mt-6">:</span>
          <ScoreControl
            label={match.awayTeam}
            value={away}
            onChange={setAway}
          />
        </div>

        {/* Changed indicator */}
        {(home !== match.homeScore || away !== match.awayScore) && (
          <div className="flex items-center justify-center gap-2 text-lime-neon/60">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs font-body">
              {match.homeScore}–{match.awayScore} → {home}–{away}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2 border-t border-white/[0.06]">
          <Button
            variant="ghost"
            onClick={() => {
              resetToMatch();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={<Zap className="w-3.5 h-3.5" />}
            loading={mutation.isPending}
            onClick={handleSave}
            disabled={home === match.homeScore && away === match.awayScore}
          >
            Apply Score
          </Button>
        </div>
      </div>
    </Modal>
  );
}
