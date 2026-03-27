"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, CheckCircle, Star, TreePine, Wind, Layers } from "lucide-react";
import { Course } from "@/types";
import DifficultyBadge from "./DifficultyBadge";
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
  const imageSrc = course.imageUrl ?? "/course-placeholder.svg";

  return (
    <div className={clsx("card-hover relative group", compact ? "w-48" : "w-full")}>
      <Link href={`/course/${course.id}`} className="block">
        <div
          className={clsx(
            "relative rounded-2xl overflow-hidden bg-forest-800 border border-forest-700/50",
            "transition-all duration-200 group-hover:border-forest-500/70 group-hover:shadow-lg group-hover:shadow-forest-900/80"
          )}
        >
          {/* Image */}
          <div className={clsx("relative w-full overflow-hidden", compact ? "h-32" : "h-44")}>
            <Image
              src={imageSrc}
              alt={course.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={compact ? "192px" : "(max-width: 768px) 100vw, 50vw"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-transparent to-transparent" />

            {/* Top badges */}
            <div className="absolute top-2 left-2 flex gap-1.5">
              <DifficultyBadge label={course.difficultyLabel} size="sm" />
            </div>

            {/* Free badge */}
            {course.free === true && (
              <div className="absolute top-2 right-10 bg-forest-700/80 backdrop-blur-sm border border-forest-600/60 text-forest-100 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                FREE
              </div>
            )}

            {/* Played indicator */}
            {isPlayed && (
              <div className="absolute bottom-2 left-2">
                <CheckCircle size={16} className="text-pine drop-shadow-md" fill="rgba(74,222,128,0.3)" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className={clsx("font-semibold text-forest-50 truncate leading-tight", compact ? "text-sm" : "text-base")}>
                  {course.name}
                </h3>
                <p className="text-xs text-forest-400 mt-0.5 truncate">
                  {course.city} · {course.region}
                </p>
              </div>

              {/* Favorite button */}
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

            {!compact && (
              <div className="mt-2.5 flex items-center gap-3 text-xs text-forest-400">
                <div className="flex items-center gap-1">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-forest-200 font-medium">{course.rating}</span>
                  <span className="text-forest-500">({course.ratingCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <TerrainIcon size={11} className="text-forest-400" />
                  <span>{terrainLabel}</span>
                </div>
                <span>{course.holes} holes</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
