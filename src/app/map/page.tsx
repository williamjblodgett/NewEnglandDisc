"use client";
import { useState } from "react";
import Link from "next/link";
import { MapPin, X, Star, Navigation } from "lucide-react";
import { courses } from "@/data/courses";
import { Course, DifficultyLabel } from "@/types";
import DifficultyBadge from "@/components/courses/DifficultyBadge";
import { useFavorites, usePlayedCourses } from "@/hooks/useUserData";
import clsx from "clsx";

// Maine approximate bounds: lat 43.0–47.5, lng -71.1 to -66.9
const MAINE_BOUNDS = { minLat: 43.0, maxLat: 47.5, minLng: -71.1, maxLng: -66.9 };

function latLngToPercent(lat: number, lng: number) {
  const x = ((lng - MAINE_BOUNDS.minLng) / (MAINE_BOUNDS.maxLng - MAINE_BOUNDS.minLng)) * 100;
  const y = ((MAINE_BOUNDS.maxLat - lat) / (MAINE_BOUNDS.maxLat - MAINE_BOUNDS.minLat)) * 100;
  return { x: Math.min(98, Math.max(2, x)), y: Math.min(96, Math.max(2, y)) };
}

const difficultyColor: Record<DifficultyLabel, string> = {
  Beginner: "#34d399",
  Intermediate: "#38bdf8",
  Advanced: "#fb923c",
  Pro: "#f87171",
};

const FILTERS: { label: string; value: DifficultyLabel | "all" | "free" | "played" | "favorites" }[] = [
  { label: "All", value: "all" },
  { label: "🌿 Beginner", value: "Beginner" },
  { label: "🔵 Intermediate", value: "Intermediate" },
  { label: "🟠 Advanced", value: "Advanced" },
  { label: "🔴 Pro", value: "Pro" },
  { label: "Free", value: "free" },
  { label: "Played", value: "played" },
  { label: "❤️ Favorites", value: "favorites" },
];

export default function MapPage() {
  const [selected, setSelected] = useState<Course | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { isFavorite, favorites } = useFavorites();
  const { isPlayed, played } = usePlayedCourses();

  const filtered = courses.filter((c) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "free") return c.free === true;
    if (activeFilter === "played") return played.includes(c.id);
    if (activeFilter === "favorites") return favorites.includes(c.id);
    return c.difficultyLabel === activeFilter;
  });

  const mappableCourses = filtered.filter((course) => course.coordinates);

  return (
    <div className="min-h-screen bg-forest-900 page-enter flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-forest-900/95 backdrop-blur-md border-b border-forest-800/60 px-4 pt-12 pb-3">
        <h1 className="text-xl font-bold text-forest-50 mb-3">Course Map</h1>
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={clsx(
                "shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
                activeFilter === f.value
                  ? "bg-pine text-forest-900 border-pine"
                  : "bg-forest-800 text-forest-300 border-forest-700/60"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 mx-4 mt-4 rounded-2xl overflow-hidden border border-forest-700/50 bg-forest-800"
           style={{ minHeight: 420 }}>
        {/* Maine outline SVG background */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full opacity-10"
          preserveAspectRatio="none"
        >
          {/* Rough Maine state outline */}
          <path
            d="M20,5 L75,5 L80,15 L85,25 L88,40 L90,55 L85,70 L75,80 L65,88 L55,95 L45,95 L35,90 L25,85 L20,75 L15,60 L12,45 L10,30 L15,15 Z"
            fill="none"
            stroke="#4ade80"
            strokeWidth="0.5"
          />
        </svg>

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute w-full border-t border-pine" style={{ top: `${(i + 1) * 11}%` }} />
          ))}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute h-full border-l border-pine" style={{ left: `${(i + 1) * 14}%` }} />
          ))}
        </div>

        {/* Region labels */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[8px] text-forest-600 font-medium pointer-events-none">AROOSTOOK</div>
        <div className="absolute top-[25%] right-4 text-[8px] text-forest-600 font-medium pointer-events-none">DOWN EAST</div>
        <div className="absolute top-[50%] right-6 text-[8px] text-forest-600 font-medium pointer-events-none">MID-COAST</div>
        <div className="absolute bottom-[25%] left-4 text-[8px] text-forest-600 font-medium pointer-events-none">W. MOUNTAINS</div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[8px] text-forest-600 font-medium pointer-events-none">SOUTHERN</div>

        {/* Course pins */}
        {mappableCourses.map((c) => {
          if (!c.coordinates) return null;

          const { x, y } = latLngToPercent(c.coordinates.lat, c.coordinates.lng);
          const color = difficultyColor[c.difficultyLabel];
          const isSelectedPin = selected?.id === c.id;
          const coursePlayed = isPlayed(c.id);

          return (
            <button
              key={c.id}
              onClick={() => setSelected(selected?.id === c.id ? null : c)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div
                className={clsx(
                  "relative flex items-center justify-center rounded-full border-2 transition-all duration-200",
                  isSelectedPin ? "w-8 h-8 border-white shadow-lg" : "w-5 h-5 border-forest-900",
                  "shadow-md"
                )}
                style={{ backgroundColor: color }}
              >
                {coursePlayed && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-pine rounded-full" />
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Count badge */}
        <div className="absolute bottom-3 right-3 bg-forest-900/80 backdrop-blur-sm border border-forest-700/50 rounded-xl px-2.5 py-1.5">
          <span className="text-pine font-bold text-sm">{mappableCourses.length}</span>
          <span className="text-forest-400 text-xs ml-1">courses</span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-forest-900/80 backdrop-blur-sm border border-forest-700/50 rounded-xl px-2.5 py-2 space-y-1">
          {Object.entries(difficultyColor).map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full border border-forest-700/50" style={{ backgroundColor: color }} />
              <span className="text-[9px] text-forest-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-4 mt-2 text-[11px] text-forest-500">
        Map pins use verified course coordinates when available and town-center coordinates otherwise.
      </p>

      {/* Selected course card */}
      {selected && (
        <div className="mx-4 mt-3 mb-3 bg-forest-800 border border-forest-700/50 rounded-2xl p-4 relative">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-3 right-3 p-1 text-forest-500"
          >
            <X size={16} />
          </button>
          <div className="flex items-start gap-3">
            <div
              className="w-2 h-full min-h-[56px] rounded-full shrink-0"
              style={{ backgroundColor: difficultyColor[selected.difficultyLabel] }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-forest-50 font-bold text-sm leading-tight">{selected.name}</h3>
              <p className="text-forest-400 text-xs mt-0.5 flex items-center gap-1">
                <MapPin size={10} /> {selected.city}, {selected.region}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <DifficultyBadge label={selected.difficultyLabel} size="sm" />
                <span className="text-xs text-forest-500">{selected.holes} holes</span>
                <div className="flex items-center gap-0.5">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs text-forest-300">{selected.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <Link
            href={`/course/${selected.id}`}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-pine text-forest-900 font-bold text-sm py-2.5 rounded-full"
          >
            View Course Details
          </Link>
        </div>
      )}

      {/* Near Me placeholder */}
      <div className="mx-4 mb-6">
        <button className="w-full flex items-center justify-center gap-2 bg-forest-800 border border-forest-700/50 text-forest-300 font-semibold text-sm py-3 rounded-full">
          <Navigation size={15} className="text-pine" />
          Find Courses Near Me
        </button>
      </div>
    </div>
  );
}
