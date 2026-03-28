import { Layers, MapPin, TreePine, Wind } from "lucide-react";
import { Course } from "@/types";
import clsx from "clsx";

const REGION_STYLES: Record<string, { panel: string; accent: string; stamp: string }> = {
  "Southern Maine": {
    panel: "from-[#173226] via-[#1f4c34] to-[#2a6f4d]",
    accent: "rgba(109, 207, 143, 0.9)",
    stamp: "SOU",
  },
  "Greater Portland": {
    panel: "from-[#123042] via-[#1d4d61] to-[#2b7483]",
    accent: "rgba(125, 211, 252, 0.9)",
    stamp: "POR",
  },
  "Mid-Coast": {
    panel: "from-[#203447] via-[#35576b] to-[#4c7d8e]",
    accent: "rgba(191, 219, 254, 0.88)",
    stamp: "MID",
  },
  "Central Maine": {
    panel: "from-[#2e2417] via-[#55442f] to-[#7a6546]",
    accent: "rgba(217, 196, 168, 0.9)",
    stamp: "CEN",
  },
  "Western Maine": {
    panel: "from-[#233119] via-[#40592d] to-[#648a4b]",
    accent: "rgba(163, 230, 53, 0.85)",
    stamp: "WES",
  },
  "Down East": {
    panel: "from-[#1d2f36] via-[#294d5c] to-[#3f7581]",
    accent: "rgba(103, 232, 249, 0.88)",
    stamp: "EAST",
  },
  Aroostook: {
    panel: "from-[#2b253e] via-[#4a3f67] to-[#71639a]",
    accent: "rgba(196, 181, 253, 0.9)",
    stamp: "ARO",
  },
  "Western Mountains": {
    panel: "from-[#2b2217] via-[#5b4428] to-[#8a6738]",
    accent: "rgba(253, 186, 116, 0.88)",
    stamp: "MTN",
  },
};

interface Props {
  course: Course;
  variant?: "card" | "hero";
  compact?: boolean;
  className?: string;
}

export default function CourseArtwork({
  course,
  variant = "card",
  compact = false,
  className,
}: Props) {
  const TerrainIcon =
    course.terrain === "Wooded" ? TreePine :
    course.terrain === "Open" ? Wind : Layers;
  const theme = REGION_STYLES[course.region] ?? REGION_STYLES["Southern Maine"];
  const terrainLabel = course.terrain ?? "Unknown";
  const feeLabel = course.free === true ? "Free" : course.free === false ? "Fee" : "PDGA";
  const titleCode = buildCourseCode(course.name, theme.stamp);

  if (variant === "hero") {
    return (
      <div
        className={clsx(
          "relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br p-6 text-white shadow-[0_30px_70px_rgba(0,0,0,0.22)]",
          theme.panel,
          className
        )}
      >
        <div className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full border border-white/12" />
        <div className="absolute bottom-8 right-8 h-24 w-24 rounded-full border border-white/12" />
        <div className="absolute left-8 top-16 h-px w-28 bg-white/35" />
        <div className="absolute bottom-12 left-8 h-px w-20 bg-white/25" />

        <div className="relative flex h-full min-h-[260px] flex-col justify-between gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/72">Maine Disc Golf Atlas</p>
              <p className="mt-2 max-w-[16rem] text-sm text-white/76">
                Verified course listing for {course.city}, {course.region}.
              </p>
            </div>
            <div className="rounded-full border border-white/18 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/80">
              {course.region}
            </div>
          </div>

          <div>
            <div className="text-[64px] font-semibold leading-none tracking-[-0.06em] text-white/18">
              {titleCode}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
              <MapPin size={14} />
              <span>{course.city}, Maine</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left text-sm">
            <div className="rounded-2xl border border-white/14 bg-black/14 p-3 backdrop-blur-sm">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/62">Holes</div>
              <div className="mt-2 text-xl font-semibold">{course.holes}</div>
            </div>
            <div className="rounded-2xl border border-white/14 bg-black/14 p-3 backdrop-blur-sm">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/62">Terrain</div>
              <div className="mt-2 flex items-center gap-2 text-base font-semibold">
                <TerrainIcon size={16} />
                <span>{terrainLabel}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-white/14 bg-black/14 p-3 backdrop-blur-sm">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/62">Access</div>
              <div className="mt-2 text-xl font-semibold">{feeLabel}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br text-white shadow-[0_16px_34px_rgba(0,0,0,0.18)]",
        compact ? "h-24 w-24 p-3" : "h-28 w-28 p-3.5",
        theme.panel,
        className
      )}
    >
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:18px_18px]" />
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full border border-white/14" />
      <div className="absolute bottom-4 left-3 h-px w-12 bg-white/28" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.26em] text-white/72">Atlas</span>
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-forest-950"
            style={{ backgroundColor: theme.accent }}
          >
            {feeLabel}
          </span>
        </div>

        <div>
          <div className="text-[28px] font-semibold leading-none tracking-[-0.08em] text-white/24">{titleCode}</div>
          <div className="mt-2 text-sm font-semibold leading-none">{course.city}</div>
          <div className="mt-1 text-[11px] text-white/72">{course.holes} holes · {terrainLabel}</div>
        </div>
      </div>
    </div>
  );
}

function buildCourseCode(name: string, fallback: string) {
  const parts = name
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .filter((part) => !["disc", "golf", "course", "the", "at"].includes(part.toLowerCase()));

  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
  return parts.slice(0, 3).map((part) => part[0]).join("").toUpperCase();
}