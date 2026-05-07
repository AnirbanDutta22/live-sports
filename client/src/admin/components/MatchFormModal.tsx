import { useState, useEffect, type FormEvent } from "react";
import { Modal, Input, Select, Button } from "../components/ui";
import { useCreateMatch, useUpdateMatch } from "../hooks/match.hook";
import { useToast } from "../context/ToastContext";
import type { Match } from "../../types";
import type { CreateMatchPayload } from "../api";

const SPORT_OPTIONS = [
  { value: "football", label: "⚽ Football" },
  { value: "basketball", label: "🏀 Basketball" },
  { value: "cricket", label: "🏏 Cricket" },
  { value: "tennis", label: "🎾 Tennis" },
  { value: "rugby", label: "🏉 Rugby" },
  { value: "baseball", label: "⚾ Baseball" },
  { value: "hockey", label: "🏒 Hockey" },
];

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "🔴 Live" },
  { value: "finished", label: "Finished" },
  { value: "postponed", label: "Postponed" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  editMatch?: Match | null;
}

const empty: CreateMatchPayload = {
  homeTeam: "",
  awayTeam: "",
  sport: "football",
  status: "scheduled",
  startTime: new Date().toISOString().slice(0, 16),
  homeScore: 0,
  awayScore: 0,
  venue: "",
  competition: "",
  homeLogoUrl: "",
  awayLogoUrl: "",
};

export function MatchFormModal({ open, onClose, editMatch }: Props) {
  const toast = useToast();
  const createMutation = useCreateMatch();
  const updateMutation = useUpdateMatch();
  const [form, setForm] = useState<CreateMatchPayload>(empty);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateMatchPayload, string>>
  >({});

  const isEdit = !!editMatch;
  const isPending = createMutation.isPending || updateMutation.isPending;

  // Populate form when editing
  useEffect(() => {
    if (editMatch) {
      setForm({
        homeTeam: editMatch.homeTeam,
        awayTeam: editMatch.awayTeam,
        sport: editMatch.sport,
        status: editMatch.status,
        startTime: editMatch.startTime.slice(0, 16),
        homeScore: editMatch.homeScore,
        awayScore: editMatch.awayScore,
        venue: editMatch.venue ?? "",
        competition: editMatch.competition ?? "",
        homeLogoUrl: editMatch.homeLogoUrl ?? "",
        awayLogoUrl: editMatch.awayLogoUrl ?? "",
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [editMatch, open]);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.homeTeam.trim()) e.homeTeam = "Required";
    if (!form.awayTeam.trim()) e.awayTeam = "Required";
    if (form.homeTeam.trim() === form.awayTeam.trim())
      e.awayTeam = "Must differ from home team";
    if (!form.startTime) e.startTime = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      homeScore: Number(form.homeScore ?? 0),
      awayScore: Number(form.awayScore ?? 0),
    };

    try {
      if (isEdit && editMatch) {
        await updateMutation.mutateAsync({ id: editMatch.id, ...payload });
        toast("Match updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast("Match created successfully");
      }
      onClose();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Something went wrong",
        "error",
      );
    }
  }

  function set<K extends keyof CreateMatchPayload>(
    key: K,
    value: CreateMatchPayload[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Match" : "Create Match"}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Teams */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Home Team"
            placeholder="e.g. Arsenal"
            value={form.homeTeam}
            onChange={(e) => set("homeTeam", e.target.value)}
            error={errors.homeTeam}
          />
          <Input
            label="Away Team"
            placeholder="e.g. Chelsea"
            value={form.awayTeam}
            onChange={(e) => set("awayTeam", e.target.value)}
            error={errors.awayTeam}
          />
        </div>

        {/* Sport + Status */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Sport"
            value={form.sport}
            onChange={(e) => set("sport", e.target.value)}
            options={SPORT_OPTIONS}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) =>
              set("status", e.target.value as typeof form.status)
            }
            options={STATUS_OPTIONS}
          />
        </div>

        {/* Start time */}
        <Input
          label="Start Time"
          type="datetime-local"
          value={form.startTime}
          onChange={(e) => set("startTime", e.target.value)}
          error={errors.startTime}
        />

        {/* Score (only when not scheduled) */}
        {form.status !== "scheduled" && (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Home Score"
              type="number"
              min={0}
              value={form.homeScore}
              onChange={(e) => set("homeScore", Number(e.target.value))}
            />
            <Input
              label="Away Score"
              type="number"
              min={0}
              value={form.awayScore}
              onChange={(e) => set("awayScore", Number(e.target.value))}
            />
          </div>
        )}

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Competition"
            placeholder="e.g. Premier League"
            value={form.competition}
            onChange={(e) => set("competition", e.target.value)}
          />
          <Input
            label="Venue"
            placeholder="e.g. Wembley Stadium"
            value={form.venue}
            onChange={(e) => set("venue", e.target.value)}
          />
        </div>

        {/* Logos */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Home Logo URL"
            placeholder="https://..."
            value={form.homeLogoUrl}
            onChange={(e) => set("homeLogoUrl", e.target.value)}
          />
          <Input
            label="Away Logo URL"
            placeholder="https://..."
            value={form.awayLogoUrl}
            onChange={(e) => set("awayLogoUrl", e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2 border-t border-white/[0.06]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isPending}>
            {isEdit ? "Save Changes" : "Create Match"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
