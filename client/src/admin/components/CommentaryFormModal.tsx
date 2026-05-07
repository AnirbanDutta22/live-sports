import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Modal, Input, Select, Textarea, Button } from "../components/ui";
import { useCreateCommentary } from "../hooks/commentary.hook";
import { useToast } from "../context/ToastContext";
import { EventIcon } from "../../components/EventIcon";
import type { CommentaryEventType } from "../../types";
import type { CreateCommentaryPayload } from "../api";

const EVENT_OPTIONS: { value: CommentaryEventType; label: string }[] = [
  { value: "comment", label: "💬 Comment" },
  { value: "goal", label: "⚽ Goal" },
  { value: "yellow_card", label: "🟨 Yellow Card" },
  { value: "red_card", label: "🟥 Red Card" },
  { value: "substitution", label: "🔄 Substitution" },
  { value: "kickoff", label: "🏁 Kickoff" },
  { value: "halftime", label: "⏱ Half Time" },
  { value: "fulltime", label: "🏆 Full Time" },
  { value: "penalty", label: "⚡ Penalty" },
  { value: "var", label: "👁 VAR Review" },
  { value: "injury", label: "🚑 Injury" },
  { value: "corner", label: "🚩 Corner" },
  { value: "foul", label: "🚩 Foul" },
  { value: "offside", label: "🚫 Offside" },
  { value: "save", label: "🧤 Save" },
];

// Event-specific metadata presets
const METADATA_PRESETS: Partial<
  Record<
    CommentaryEventType,
    { key: string; label: string; options: string[] }[]
  >
> = {
  goal: [
    {
      key: "goal_type",
      label: "Goal Type",
      options: ["open_play", "penalty", "free_kick", "header", "own_goal"],
    },
  ],
  yellow_card: [
    {
      key: "card_reason",
      label: "Reason",
      options: [
        "foul",
        "simulation",
        "dissent",
        "time_wasting",
        "second_booking",
      ],
    },
  ],
  red_card: [
    {
      key: "card_reason",
      label: "Reason",
      options: [
        "violent_conduct",
        "serious_foul",
        "second_yellow",
        "offensive_language",
      ],
    },
  ],
  substitution: [
    { key: "player_on", label: "Player On", options: [] },
    { key: "player_off", label: "Player Off", options: [] },
  ],
  var: [
    {
      key: "var_outcome",
      label: "Outcome",
      options: [
        "goal_awarded",
        "goal_disallowed",
        "penalty_awarded",
        "penalty_reversed",
        "no_change",
      ],
    },
  ],
};

interface Props {
  open: boolean;
  onClose: () => void;
  matchId: number;
  currentMinute?: number;
}

export function CommentaryFormModal({
  open,
  onClose,
  matchId,
  currentMinute = 0,
}: Props) {
  const toast = useToast();
  const mutation = useCreateCommentary();

  const [eventType, setEventType] = useState<CommentaryEventType>("comment");
  const [minute, setMinute] = useState(currentMinute);
  const [message, setMessage] = useState("");
  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ message?: string; minute?: string }>(
    {},
  );

  const metaFields = METADATA_PRESETS[eventType] ?? [];

  function reset() {
    setEventType("comment");
    setMinute(currentMinute);
    setMessage("");
    setMetadata({});
    setTagInput("");
    setTags([]);
    setErrors({});
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "_");
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }

  function handleTagKeydown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  }

  function validate() {
    const e: typeof errors = {};
    if (!message.trim()) e.message = "Commentary message is required";
    if (minute < 0 || minute > 120) e.minute = "Must be 0–120";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateCommentaryPayload = {
      matchId,
      minute: Number(minute),
      message: message.trim(),
      eventType,
      tags: tags.length > 0 ? tags : undefined,
      metadata:
        Object.keys(metadata).length > 0
          ? Object.fromEntries(
              Object.entries(metadata).filter(([, v]) => v.trim()),
            )
          : undefined,
    };

    try {
      await mutation.mutateAsync(payload);
      toast("Commentary added");
      reset();
      onClose();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to add commentary",
        "error",
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Add Commentary"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event type selector — visual grid */}
        <div>
          <label className="text-xs font-body font-medium text-white/50 uppercase tracking-wider block mb-2">
            Event Type
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
            {EVENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setEventType(opt.value);
                  setMetadata({});
                }}
                className={`
                  flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg border text-[11px] font-body
                  transition-all duration-150
                  ${
                    eventType === opt.value
                      ? "border-lime-neon/50 bg-lime-neon/10 text-lime-neon"
                      : "border-white/[0.06] bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/15"
                  }
                `}
              >
                <EventIcon eventType={opt.value} className="w-3.5 h-3.5" />
                <span className="leading-tight text-center">
                  {opt.label.replace(/^.+?\s/, "")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Minute + Message */}
        <div className="grid grid-cols-[80px_1fr] gap-3">
          <Input
            label="Minute"
            type="number"
            min={0}
            max={120}
            value={minute}
            onChange={(e) => setMinute(Number(e.target.value))}
            error={errors.minute}
          />
          <Textarea
            label="Commentary Message"
            placeholder="Describe the play..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={errors.message}
            rows={2}
          />
        </div>

        {/* Dynamic metadata fields */}
        {metaFields.length > 0 && (
          <div className="space-y-3 p-3 bg-pitch-800/50 rounded-lg border border-white/[0.06]">
            <p className="text-[11px] font-body font-medium text-white/40 uppercase tracking-wider">
              Event Details
            </p>
            {metaFields.map((field) =>
              field.options.length > 0 ? (
                <Select
                  key={field.key}
                  label={field.label}
                  value={metadata[field.key] ?? ""}
                  onChange={(e) =>
                    setMetadata((m) => ({ ...m, [field.key]: e.target.value }))
                  }
                  options={[
                    { value: "", label: `Select ${field.label}...` },
                    ...field.options.map((o) => ({
                      value: o,
                      label: o.replace(/_/g, " "),
                    })),
                  ]}
                />
              ) : (
                <Input
                  key={field.key}
                  label={field.label}
                  placeholder={field.label}
                  value={metadata[field.key] ?? ""}
                  onChange={(e) =>
                    setMetadata((m) => ({ ...m, [field.key]: e.target.value }))
                  }
                />
              ),
            )}
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="text-xs font-body font-medium text-white/50 uppercase tracking-wider block mb-1.5">
            Tags{" "}
            <span className="text-white/25 normal-case tracking-normal">
              (optional)
            </span>
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. mbappe, counterattack"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeydown}
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addTag}
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-body text-cyan-400 bg-cyan-400/10 border border-cyan-400/20"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => setTags((t) => t.filter((x) => x !== tag))}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2 border-t border-white/[0.06]">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={mutation.isPending}>
            Post Commentary
          </Button>
        </div>
      </form>
    </Modal>
  );
}
