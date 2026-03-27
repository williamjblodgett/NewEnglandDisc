import clsx from "clsx";

interface Props {
  score: number; // 0–100
  className?: string;
}

export default function DifficultyMeter({ score, className }: Props) {
  const pct = Math.min(100, Math.max(0, score));
  const color =
    pct < 35 ? "bg-emerald-400" :
    pct < 55 ? "bg-sky-400" :
    pct < 75 ? "bg-orange-400" :
    "bg-red-500";

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <div className="flex-1 h-1.5 bg-forest-700 rounded-full overflow-hidden">
        <div
          className={clsx("h-full rounded-full transition-all duration-700 ease-out", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-forest-300 font-mono w-7 text-right">{pct}</span>
    </div>
  );
}
