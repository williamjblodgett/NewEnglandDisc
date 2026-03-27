import { DifficultyLabel } from "@/types";
import clsx from "clsx";

const config: Record<DifficultyLabel, { color: string; bg: string; dot: string }> = {
  Beginner: {
    color: "text-emerald-300",
    bg: "bg-emerald-900/60 border border-emerald-700/60",
    dot: "bg-emerald-400",
  },
  Intermediate: {
    color: "text-sky-300",
    bg: "bg-sky-900/60 border border-sky-700/60",
    dot: "bg-sky-400",
  },
  Advanced: {
    color: "text-orange-300",
    bg: "bg-orange-900/60 border border-orange-700/60",
    dot: "bg-orange-400",
  },
  Pro: {
    color: "text-red-300",
    bg: "bg-red-900/60 border border-red-700/60",
    dot: "bg-red-400",
  },
};

interface Props {
  label: DifficultyLabel;
  score?: number;
  size?: "sm" | "md" | "lg";
}

export default function DifficultyBadge({ label, score, size = "md" }: Props) {
  const c = config[label];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        c.bg,
        c.color,
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-xs px-2.5 py-1",
        size === "lg" && "text-sm px-3 py-1.5"
      )}
    >
      <span className={clsx("rounded-full shrink-0", c.dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {label}
      {score !== undefined && <span className="opacity-70 ml-0.5">·{score}</span>}
    </span>
  );
}
