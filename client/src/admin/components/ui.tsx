import {
  forwardRef,
  useEffect,
  useRef,
  type ReactNode,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

// ─── Input ───────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-body font-medium text-white/50 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full bg-pitch-800 border rounded-lg px-3 py-2.5
          font-body text-sm text-white placeholder-white/20
          focus:outline-none focus:ring-1 transition-all
          ${
            error
              ? "border-ruby-500/60 focus:ring-ruby-500/40 focus:border-ruby-500"
              : "border-white/10 focus:ring-lime-neon/30 focus:border-lime-neon/50"
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs font-body text-ruby-500">{error}</p>}
      {hint && !error && (
        <p className="text-xs font-body text-white/30">{hint}</p>
      )}
    </div>
  ),
);
Input.displayName = "Input";

// ─── Textarea ────────────────────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-body font-medium text-white/50 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={3}
        className={`
          w-full bg-pitch-800 border rounded-lg px-3 py-2.5
          font-body text-sm text-white placeholder-white/20 resize-none
          focus:outline-none focus:ring-1 transition-all
          ${
            error
              ? "border-ruby-500/60 focus:ring-ruby-500/40 focus:border-ruby-500"
              : "border-white/10 focus:ring-lime-neon/30 focus:border-lime-neon/50"
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs font-body text-ruby-500">{error}</p>}
      {hint && !error && (
        <p className="text-xs font-body text-white/30">{hint}</p>
      )}
    </div>
  ),
);
Textarea.displayName = "Textarea";

// ─── Select ──────────────────────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-body font-medium text-white/50 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full bg-pitch-800 border rounded-lg px-3 py-2.5
          font-body text-sm text-white
          focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer
          ${
            error
              ? "border-ruby-500/60 focus:ring-ruby-500/40"
              : "border-white/10 focus:ring-lime-neon/30 focus:border-lime-neon/50"
          }
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-pitch-800">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs font-body text-ruby-500">{error}</p>}
    </div>
  ),
);
Select.displayName = "Select";

// ─── Button ──────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "success";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-lime-neon/15 hover:bg-lime-neon/25 border-lime-neon/40 hover:border-lime-neon/70 text-lime-neon",
  secondary:
    "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/70 hover:text-white",
  danger:
    "bg-ruby-500/10 hover:bg-ruby-500/20 border-ruby-500/30 hover:border-ruby-500/60 text-ruby-500",
  ghost:
    "bg-transparent hover:bg-white/[0.05] border-transparent text-white/50 hover:text-white/80",
  success:
    "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "text-[11px] px-2 py-1 gap-1",
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
  lg: "text-base px-5 py-2.5 gap-2",
};

export function Button({
  variant = "secondary",
  size = "md",
  loading,
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-body font-medium
        border rounded-lg transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
      {children}
    </button>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`
          relative w-full ${maxWidth} bg-pitch-900 border border-white/[0.08]
          rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)]
          animate-slide-in-top max-h-[90vh] flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="font-display font-semibold text-base text-white tracking-wide">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Content */}
        <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: {
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
    },
    error: {
      icon: <AlertCircle className="w-4 h-4" />,
      color: "text-ruby-500",
      border: "border-ruby-500/30",
    },
    info: {
      icon: <AlertCircle className="w-4 h-4" />,
      color: "text-cyan-400",
      border: "border-cyan-400/30",
    },
  }[toast.type];

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl
        bg-pitch-800 border ${config.border}
        shadow-[0_8px_32px_rgba(0,0,0,0.6)]
        animate-slide-in-top cursor-pointer
      `}
      onClick={() => onDismiss(toast.id)}
    >
      <span className={config.color}>{config.icon}</span>
      <p className="text-sm font-body text-white/80">{toast.message}</p>
    </div>
  );
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-sm font-body text-white/60 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: string;
}

export function StatCard({
  label,
  value,
  icon,
  accent = "text-lime-neon",
}: StatCardProps) {
  return (
    <div className="bg-card-gradient border border-white/[0.06] rounded-xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-body font-medium text-white/40 uppercase tracking-wider">
          {label}
        </span>
        <span className={`${accent} opacity-60`}>{icon}</span>
      </div>
      <p className={`font-display font-bold text-3xl ${accent}`}>{value}</p>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <div className="w-14 h-14 rounded-full bg-white/[0.04] flex items-center justify-center text-white/20">
        {icon}
      </div>
      <div>
        <p className="font-display font-medium text-white/40 text-base">
          {title}
        </p>
        {description && (
          <p className="text-sm font-body text-white/25 mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: ReactNode;
  color?: "lime" | "ruby" | "gold" | "cyan" | "ember" | "gray";
}

const badgeColors = {
  lime: "bg-lime-neon/10 text-lime-neon border-lime-neon/25",
  ruby: "bg-ruby-500/10 text-ruby-500 border-ruby-500/25",
  gold: "bg-gold-400/10 text-gold-400 border-gold-400/25",
  cyan: "bg-cyan-400/10 text-cyan-400 border-cyan-400/25",
  ember: "bg-ember-500/10 text-ember-500 border-ember-500/25",
  gray: "bg-white/5 text-white/40 border-white/10",
};

export function Badge({ children, color = "gray" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-[10px] font-display font-semibold tracking-widest px-1.5 py-0.5 rounded border ${badgeColors[color]}`}
    >
      {children}
    </span>
  );
}
