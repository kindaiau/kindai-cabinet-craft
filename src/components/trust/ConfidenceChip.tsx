import { cn } from "@/lib/utils";

type ConfidenceLevel = "high" | "medium" | "low";

interface ConfidenceChipProps {
  level: ConfidenceLevel;
  label?: string;
  className?: string;
}

const DEFAULT_LABELS: Record<ConfidenceLevel, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

export function ConfidenceChip({ level, label, className }: ConfidenceChipProps) {
  return (
    <span
      className={cn("status-chip", className)}
      data-status={level}
      role="status"
      aria-label={label ?? DEFAULT_LABELS[level]}
    >
      <span aria-hidden>●</span>
      <span>{label ?? DEFAULT_LABELS[level]}</span>
    </span>
  );
}
