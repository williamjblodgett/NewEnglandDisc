import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, body, action, className }: Props) {
  return (
    <div className={clsx("flex flex-col items-center justify-center text-center py-16 px-6", className)}>
      {icon && <div className="text-5xl mb-4 opacity-60">{icon}</div>}
      <h3 className="text-forest-100 font-semibold text-lg mb-2">{title}</h3>
      {body && <p className="text-forest-400 text-sm max-w-xs leading-relaxed mb-5">{body}</p>}
      {action}
    </div>
  );
}
