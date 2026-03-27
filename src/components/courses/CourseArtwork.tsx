import Image from "next/image";
import { Layers, MapPin, TreePine, Wind } from "lucide-react";
import { Course } from "@/types";
import clsx from "clsx";

const REGION_STYLES: Record<string, string> = {
  "Southern Maine": "from-[#173226] via-[#1f4c34] to-[#2a6f4d]",
  "Greater Portland": "from-[#123042] via-[#1d4d61] to-[#2b7483]",
  "Mid-Coast": "from-[#203447] via-[#35576b] to-[#4c7d8e]",
  "Central Maine": "from-[#2e2417] via-[#55442f] to-[#7a6546]",
  "Western Maine": "from-[#233119] via-[#40592d] to-[#648a4b]",
  "Down East": "from-[#1d2f36] via-[#294d5c] to-[#3f7581]",
  Aroostook: "from-[#2b253e] via-[#4a3f67] to-[#71639a]",
  "Western Mountains": "from-[#2b2217] via-[#5b4428] to-[#8a6738]",
};

interface Props {
  course: Course;
  variant?: "card" | "hero";
  compact?: boolean;
}

export default function CourseArtwork({
  course,
  variant = "card",
  compact = false,
}: Props) {
  const hasRealImage = Boolean(
    course.imageUrl && course.imageUrl !== "/course-placeholder.svg"
  );

  const TerrainIcon =
    course.terrain === "Wooded" ? TreePine :
    course.terrain === "Open" ? Wind : Layers;

  if (hasRealImage) {
    return (
      <>
        <Image
          src={course.imageUrl!}
          alt={course.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={variant === "hero" ? "100vw" : compact ? "192px" : "(max-width: 768px) 100vw, 50vw"}
          priority={variant === "hero"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/10 to-transparent" />
      </>
    );
  }

  const gradient = REGION_STYLES[course.region] ?? "from-[#173226] via-[#1f4c34] to-[#2a6f4d]";
  const titleClass =
    variant === "hero"
      ? "text-3xl font-semibold"
      : compact
        ? "text-base font-semibold"
        : "text-xl font-semibold";

  return (
    <div className={clsx("absolute inset-0 bg-gradient-to-br", gradient)}>
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(140deg,rgba(255,255,255,0.22)_0%,transparent_30%,transparent_70%,rgba(255,255,255,0.12)_100%)]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.28),transparent_30%),radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.14),transparent_24%),radial-gradient(circle_at_68%_78%,rgba(255,255,255,0.14),transparent_20%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-white/15" />
      <div className="absolute right-12 top-10 h-14 w-14 rounded-full border border-white/12" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-3 text-[10px] uppercase tracking-[0.24em] text-white/72">
        <span>PDGA listed</span>
        <span>{course.region}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-4 pb-4">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] text-white/80">
            <MapPin size={12} />
            <span className="truncate">{course.city}, Maine</span>
          </div>
          <p className={clsx("leading-none text-white", titleClass)}>{course.city}</p>
          <p className="mt-2 text-xs text-white/74">
            {course.holes} holes
            {course.terrain ? ` · ${course.terrain}` : ""}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/18 bg-black/15 text-white/90 backdrop-blur-sm">
          <TerrainIcon size={20} />
        </div>
      </div>
    </div>
  );
}