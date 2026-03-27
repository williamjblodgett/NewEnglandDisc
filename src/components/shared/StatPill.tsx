import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  icon: ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

export default function StatPill({ icon, label, value, className }: Props) {
  return (
    <div className={clsx("flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl bg-forest-800/80 border border-forest-700/50 min-w-0", className)}>
      <span className="text-forest-400">{icon}</span>
      <span className="text-forest-50 font-bold text-sm leading-none stat-number">{value}</span>
      <span className="text-forest-500 text-[10px] text-center leading-tight">{label}</span>
    </div>
  );
}
