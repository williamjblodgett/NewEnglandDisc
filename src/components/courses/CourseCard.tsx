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
      <Link href={`/course/${course.id}`} className="block">
        <div
          className={clsx(
            "relative overflow-hidden rounded-[28px] border border-forest-700/50 bg-[linear-gradient(180deg,rgba(20,34,20,0.98)_0%,rgba(10,18,12,1)_100%)]",
            "transition-all duration-200 group-hover:border-forest-500/70 group-hover:shadow-[0_18px_40px_rgba(2,10,6,0.45)]"
          )}
        >
          <div className={clsx("relative w-full overflow-hidden", compact ? "h-28" : "h-36")}>
            <CourseArtwork course={course} compact={compact} />

            <div className="absolute top-2 left-2 flex gap-1.5">
              <DifficultyBadge label={course.difficultyLabel} size="sm" />
            </div>

            {course.free === true && (
              <div className="absolute top-2 right-10 rounded-full border border-white/16 bg-black/20 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                FREE
              </div>
            )}

            {isPlayed && (
              <div className="absolute bottom-2 left-2">
                <CheckCircle size={16} className="text-pine drop-shadow-md" fill="rgba(74,222,128,0.3)" />
              </div>
            )}
          </div>

          <div className="p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className={clsx("font-semibold text-forest-50 leading-tight", compact ? "text-sm" : "text-base")}>
                  {course.name}
                </h3>
                <p className="mt-1 text-xs text-forest-400 truncate">
                  {course.city} · {course.region}
                </p>
              </div>

              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite(course.id);
                  }}
                  className="p-1.5 rounded-full hover:bg-forest-700/60 transition-colors shrink-0"
                  aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
                >
                  <Heart
                    size={16}
                    strokeWidth={2}
                    className={isFavorite ? "text-red-400 fill-red-400" : "text-forest-400"}
                  />
                </button>
              )}
            </div>

            <div className={clsx("mt-3 flex flex-wrap items-center gap-2 text-xs", compact ? "text-forest-400" : "text-forest-300")}>
              <div className="flex items-center gap-1 rounded-full border border-forest-700/80 bg-forest-800/70 px-2 py-1">
                <div className="flex items-center gap-1">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-forest-200 font-medium">{course.rating}</span>
                  <span className="text-forest-500">({course.ratingCount})</span>
                </div>
              </div>

              <div className="flex items-center gap-1 rounded-full border border-forest-700/80 bg-forest-800/70 px-2 py-1">
                <TerrainIcon size={11} className="text-forest-400" />
                <span>{terrainLabel}</span>
              </div>

              <div className="rounded-full border border-forest-700/80 bg-forest-800/70 px-2 py-1">
                {course.holes} holes
              </div>

              {!compact && hasVerifiedMetadata && (
                <div className="rounded-full border border-forest-700/80 bg-forest-800/70 px-2 py-1">
                  {course.lengthFeet !== undefined ? `${course.lengthFeet.toLocaleString()} ft` : feeOnlyLabel(course)}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function feeOnlyLabel(course: Course) {
  if (course.free === true) return "Free to play";
  if (course.free === false) return "Pay to play";
  return "PDGA listed";
}
