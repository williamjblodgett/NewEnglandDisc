"use client";
import Link from "next/link";
import { Heart, CheckCircle, Star, TreePine, Wind, Layers } from "lucide-react";
import { Course } from "@/types";
import DifficultyBadge from "./DifficultyBadge";
import CourseArtwork from "./CourseArtwork";
import clsx from "clsx";

interface Props {
  course: Course;
  isFavorite?: boolean;
  isPlayed?: boolean;
  onToggleFavorite?: (id: string) => void;
  compact?: boolean;
}

export default function CourseCard({
  course,
  isFavorite = false,
  isPlayed = false,
  onToggleFavorite,
  compact = false,
}: Props) {
  const terrainLabel = course.terrain ?? "Unknown";
  const terrainIcon =
    terrainLabel === "Wooded" ? TreePine :
    terrainLabel === "Open" ? Wind : Layers;
  const TerrainIcon = terrainIcon;
  const hasVerifiedMetadata = course.lengthFeet !== undefined || course.free !== undefined || course.terrain !== undefined;

  return (
    <div className={clsx("card-hover relative group", compact ? "w-48" : "w-full")}>
      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(course.id)}
          className="absolute right-4 top-4 z-10 rounded-full border border-forest-700/60 bg-forest-900/72 p-2 backdrop-blur-sm transition-colors hover:border-forest-500/70"
          aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
        >
          <Heart
            size={16}
            strokeWidth={2}
            className={isFavorite ? "text-red-400 fill-red-400" : "text-forest-400"}
          />
        </button>
      )}

      <Link href={`/course/${course.id}`} className="block">
        <div
          className={clsx(
            "relative overflow-hidden rounded-[30px] border border-forest-700/50 bg-[linear-gradient(180deg,rgba(21,34,20,0.98)_0%,rgba(11,18,13,1)_100%)] p-4",
            "transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-forest-500/70 group-hover:shadow-[0_22px_50px_rgba(2,10,6,0.42)]"
          )}
        >
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1 pr-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <DifficultyBadge label={course.difficultyLabel} size="sm" />
                {isPlayed && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-pine/40 bg-pine/12 px-2 py-1 text-[11px] font-semibold text-pine">
                    <CheckCircle size={11} /> Played
                  </span>
                )}
                {course.free === true && (
                  <span className="rounded-full border border-emerald-700/50 bg-emerald-900/45 px-2 py-1 text-[11px] font-semibold text-emerald-300">
                    Free to play
                  </span>
                )}
              </div>

              <h3 className={clsx("editorial-title leading-tight text-forest-50", compact ? "text-lg" : "text-[1.65rem]")}>{course.name}</h3>
              <p className="mt-1 text-sm text-forest-300">{course.city}, {course.region}</p>
              <p className={clsx("mt-3 max-w-xl text-sm leading-relaxed text-forest-400", compact ? "line-clamp-2" : "line-clamp-2")}>
                {course.description ?? `${course.source ?? "PDGA"}-listed course in ${course.city} with ${course.holes} holes and a ${course.difficultyLabel.toLowerCase()} profile.`}
              </p>
            </div>

            <CourseArtwork course={course} compact={compact} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <InfoPill label="Rating" value={`${course.rating} (${course.ratingCount})`} icon={<Star size={12} className="text-amber-400 fill-amber-400" />} />
            <InfoPill label="Terrain" value={terrainLabel} icon={<TerrainIcon size={12} className="text-forest-300" />} />
            <InfoPill label="Layout" value={`${course.holes} holes`} />
            <InfoPill
              label={course.lengthFeet !== undefined ? "Length" : "Listing"}
              value={course.lengthFeet !== undefined ? `${course.lengthFeet.toLocaleString()} ft` : feeOnlyLabel(course)}
            />
          </div>
        </div>
      </Link>
    </div>
  );
}

function InfoPill({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-forest-700/70 bg-forest-800/65 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-forest-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1 text-sm font-semibold text-forest-100">{value}</div>
    </div>
  );
}

function feeOnlyLabel(course: Course) {
  if (course.free === true) return "Free to play";
  if (course.free === false) return "Pay to play";
  return "PDGA listed";
}
