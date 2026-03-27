"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Compass, Heart, MapPin, Navigation, Star, Trees, Trophy, X } from "lucide-react";
import { courses } from "@/data/courses";
import { Course, DifficultyLabel, Region } from "@/types";
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

const REGION_ORDER: Region[] = [
  "Southern Maine",
  "Greater Portland",
  "Mid-Coast",
  "Central Maine",
  "Western Maine",
  "Down East",
  "Western Mountains",
  "Aroostook",
];

const REGION_META: Record<Region, { short: string; x: number; y: number; accent: string }> = {
  "Southern Maine": { short: "South", x: 38, y: 84, accent: "#4ade80" },
  "Greater Portland": { short: "Portland", x: 29, y: 72, accent: "#6dcf8f" },
  "Mid-Coast": { short: "Mid-Coast", x: 53, y: 61, accent: "#9fd3e2" },
  "Central Maine": { short: "Central", x: 39, y: 49, accent: "#d1b28a" },
  "Western Maine": { short: "West", x: 18, y: 49, accent: "#a5d36f" },
  "Down East": { short: "Down East", x: 73, y: 42, accent: "#70c5d8" },
  "Western Mountains": { short: "Mountains", x: 18, y: 28, accent: "#f0b15c" },
  Aroostook: { short: "Aroostook", x: 49, y: 13, accent: "#b39df5" },
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
  const [activeRegion, setActiveRegion] = useState<Region | "all">("all");
  const { favorites } = useFavorites();
  const { isPlayed, played } = usePlayedCourses();

  const filtered = courses.filter((c) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "free") return c.free === true;
    if (activeFilter === "played") return played.includes(c.id);
    if (activeFilter === "favorites") return favorites.includes(c.id);
    return c.difficultyLabel === activeFilter;
  });

  const regionFiltered = filtered.filter((course) =>
    activeRegion === "all" ? true : course.region === activeRegion
  );

  const mappableCourses = regionFiltered.filter((course) => course.coordinates);

  const regionSummaries = useMemo(
    () =>
      REGION_ORDER.map((region) => {
        const regionCourses = filtered.filter((course) => course.region === region);
        const topCourse = [...regionCourses].sort((left, right) => right.rating - left.rating)[0];

        return {
          region,
          count: regionCourses.length,
          topCourse,
          playedCount: regionCourses.filter((course) => played.includes(course.id)).length,
        };
      }).filter((summary) => summary.count > 0),
    [filtered, played]
  );

  const visibleCourses = useMemo(
    () =>
      [...regionFiltered].sort((left, right) => {
        if (played.includes(left.id) !== played.includes(right.id)) {
          return played.includes(right.id) ? 1 : -1;
        }

        return right.rating - left.rating;
      }),
    [regionFiltered, played]
  );

  const mapTitle = activeRegion === "all" ? "Maine Course Atlas" : `${activeRegion} Atlas`;
  const activeSummary =
    activeRegion === "all"
      ? null
      : regionSummaries.find((summary) => summary.region === activeRegion) ?? null;

  return (
    <div className="min-h-screen bg-forest-900 page-enter flex flex-col">
      <div className="sticky top-0 z-40 bg-forest-900/95 backdrop-blur-md border-b border-forest-800/60 px-4 pt-12 pb-3">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-forest-400">Geography first</p>
            <h1 className="mt-1 text-2xl font-bold text-forest-50">Course Atlas</h1>
            <p className="mt-1 text-sm text-forest-300">Browse by region, compare density, and use the map as a real navigation tool.</p>
          </div>
          <div className="rounded-2xl border border-forest-700/60 bg-forest-800/70 px-3 py-2 text-right">
            <div className="text-lg font-bold text-pine">{mappableCourses.length}</div>
            <div className="text-[11px] text-forest-400">courses in view</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm sm:grid-cols-4">
          <div className="rounded-2xl border border-forest-700/60 bg-forest-800/70 p-3">
            <div className="flex items-center gap-2 text-forest-400"><Compass size={14} /> Regions</div>
            <div className="mt-2 text-xl font-bold text-forest-50">{regionSummaries.length}</div>
          </div>
          <div className="rounded-2xl border border-forest-700/60 bg-forest-800/70 p-3">
            <div className="flex items-center gap-2 text-forest-400"><Navigation size={14} /> Free</div>
            <div className="mt-2 text-xl font-bold text-forest-50">{regionFiltered.filter((course) => course.free === true).length}</div>
          </div>
          <div className="rounded-2xl border border-forest-700/60 bg-forest-800/70 p-3">
            <div className="flex items-center gap-2 text-forest-400"><Heart size={14} /> Favorites</div>
            <div className="mt-2 text-xl font-bold text-forest-50">{regionFiltered.filter((course) => favorites.includes(course.id)).length}</div>
          </div>
          <div className="rounded-2xl border border-forest-700/60 bg-forest-800/70 p-3">
            <div className="flex items-center gap-2 text-forest-400"><Trophy size={14} /> Played</div>
            <div className="mt-2 text-xl font-bold text-forest-50">{regionFiltered.filter((course) => played.includes(course.id)).length}</div>
          </div>
        </div>

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

        <div className="mt-2 flex gap-2 overflow-x-auto [scrollbar-width:none] pb-1">
          <button
            onClick={() => setActiveRegion("all")}
            className={clsx(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
              activeRegion === "all"
                ? "border-forest-100 bg-forest-50 text-forest-900"
                : "border-forest-700/60 bg-forest-800 text-forest-300"
            )}
          >
            All Regions
          </button>
          {regionSummaries.map((summary) => (
            <button
              key={summary.region}
              onClick={() => setActiveRegion(summary.region)}
              className={clsx(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                activeRegion === summary.region
                  ? "border-forest-100 bg-forest-50 text-forest-900"
                  : "border-forest-700/60 bg-forest-800 text-forest-300"
              )}
            >
              {summary.region}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-4 mb-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="rounded-[30px] border border-forest-700/50 bg-[linear-gradient(180deg,rgba(17,26,20,0.92),rgba(10,17,12,1))] p-4 shadow-[0_24px_60px_rgba(2,10,6,0.35)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-forest-400">Atlas view</p>
              <h2 className="mt-1 text-xl font-bold text-forest-50">{mapTitle}</h2>
              <p className="mt-1 max-w-xl text-sm text-forest-300">
                Tap a region badge to narrow the map. Tap a pin to inspect a course and jump to its detail page.
              </p>
            </div>

            <div className="rounded-2xl border border-forest-700/60 bg-forest-800/80 px-3 py-2 text-right">
              <div className="text-lg font-bold text-pine">{visibleCourses.length}</div>
              <div className="text-[11px] text-forest-400">visible courses</div>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-forest-700/60 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.14),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(56,189,248,0.14),transparent_24%),linear-gradient(180deg,#132018_0%,#0d1611_100%)] p-4 sm:aspect-[16/13]">
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <path
                d="M19,6 L70,8 L77,13 L82,21 L88,37 L90,50 L88,64 L78,78 L70,84 L59,90 L44,95 L31,91 L25,84 L18,73 L15,60 L11,42 L10,28 L13,15 Z"
                fill="rgba(189,244,208,0.08)"
                stroke="rgba(179,232,195,0.42)"
                strokeWidth="0.75"
              />
              <path
                d="M67,15 L78,24 L83,37 L84,49 L82,58"
                fill="none"
                stroke="rgba(130,202,230,0.28)"
                strokeWidth="0.6"
                strokeDasharray="1.5 2.5"
              />
              <path
                d="M21,62 L39,54 L55,52 L66,60"
                fill="none"
                stroke="rgba(240,177,92,0.22)"
                strokeWidth="0.6"
                strokeDasharray="2 2"
              />
            </svg>

            {regionSummaries.map((summary) => {
              const meta = REGION_META[summary.region];
              const active = activeRegion === summary.region;

              return (
                <button
                  key={summary.region}
                  onClick={() => setActiveRegion(active ? "all" : summary.region)}
                  className={clsx(
                    "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-left shadow-lg backdrop-blur-sm transition-all",
                    active
                      ? "border-white/40 bg-white/18"
                      : "border-white/12 bg-black/22 hover:bg-black/30"
                  )}
                  style={{ left: `${meta.x}%`, top: `${meta.y}%` }}
                >
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/65">{meta.short}</div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{summary.count}</span>
                    <span className="text-[11px] text-white/70">courses</span>
                  </div>
                </button>
              );
            })}

            {mappableCourses.map((course) => {
              if (!course.coordinates) return null;

              const { x, y } = latLngToPercent(course.coordinates.lat, course.coordinates.lng);
              const isSelected = selected?.id === course.id;
              const playedCourse = isPlayed(course.id);

              return (
                <button
                  key={course.id}
                  onClick={() => setSelected(selected?.id === course.id ? null : course)}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  aria-label={course.name}
                >
                  <div className={clsx("relative rotate-45 rounded-[7px] border-2 shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition-all", isSelected ? "h-6 w-6 border-white" : "h-4.5 w-4.5 border-forest-950")}
                    style={{ backgroundColor: difficultyColor[course.difficultyLabel] }}
                  >
                    {playedCourse && (
                      <div className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 -rotate-45 rounded-full border border-white/80 bg-pine" />
                    )}
                  </div>
                </button>
              );
            })}

            <div className="absolute left-4 top-4 rounded-2xl border border-forest-700/60 bg-forest-900/72 px-3 py-2 text-xs text-forest-300 backdrop-blur-sm">
              Pins use verified coordinates or town centers when exact course coordinates are not available.
            </div>

            <div className="absolute bottom-4 left-4 rounded-2xl border border-forest-700/60 bg-forest-900/72 px-3 py-2 backdrop-blur-sm">
              <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-forest-500">Difficulty</div>
              <div className="space-y-1">
                {Object.entries(difficultyColor).map(([label, color]) => (
                  <div key={label} className="flex items-center gap-2 text-[11px] text-forest-300">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[30px] border border-forest-700/50 bg-[linear-gradient(180deg,rgba(18,28,21,0.98),rgba(10,17,12,1))] p-4 shadow-[0_24px_60px_rgba(2,10,6,0.3)]">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-forest-400">
                  {selected ? "Selected course" : activeSummary ? "Region focus" : "Statewide snapshot"}
                </p>
                <h3 className="mt-1 text-lg font-bold text-forest-50">
                  {selected ? selected.name : activeSummary ? activeSummary.region : "All visible regions"}
                </h3>
              </div>
              {selected && (
                <button onClick={() => setSelected(null)} className="rounded-full border border-forest-700/60 p-2 text-forest-400 hover:text-forest-100">
                  <X size={15} />
                </button>
              )}
            </div>

            {selected ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <DifficultyBadge label={selected.difficultyLabel} size="sm" />
                  <span className="rounded-full border border-forest-700/70 bg-forest-800/70 px-2 py-1 text-xs text-forest-300">{selected.holes} holes</span>
                  <span className="rounded-full border border-forest-700/70 bg-forest-800/70 px-2 py-1 text-xs text-forest-300">{selected.city}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-2xl border border-forest-700/60 bg-forest-800/65 p-3">
                    <div className="text-xs text-forest-400">Rating</div>
                    <div className="mt-1 font-bold text-forest-50">{selected.rating}</div>
                  </div>
                  <div className="rounded-2xl border border-forest-700/60 bg-forest-800/65 p-3">
                    <div className="text-xs text-forest-400">Source</div>
                    <div className="mt-1 font-bold text-forest-50">{selected.source ?? "PDGA"}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-forest-300">{selected.description}</p>
                <Link href={`/course/${selected.id}`} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-pine py-3 text-sm font-bold text-forest-900">
                  View course details
                </Link>
              </>
            ) : activeSummary ? (
              <>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-2xl border border-forest-700/60 bg-forest-800/65 p-3">
                    <div className="text-xs text-forest-400">Courses</div>
                    <div className="mt-1 font-bold text-forest-50">{activeSummary.count}</div>
                  </div>
                  <div className="rounded-2xl border border-forest-700/60 bg-forest-800/65 p-3">
                    <div className="text-xs text-forest-400">Played</div>
                    <div className="mt-1 font-bold text-forest-50">{activeSummary.playedCount}</div>
                  </div>
                  <div className="rounded-2xl border border-forest-700/60 bg-forest-800/65 p-3">
                    <div className="text-xs text-forest-400">Top rated</div>
                    <div className="mt-1 font-bold text-forest-50">{activeSummary.topCourse?.rating ?? "-"}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-forest-300">
                  {activeSummary.topCourse
                    ? `${activeSummary.topCourse.name} is currently the highest-rated course in this view.`
                    : "No rating data is available for this region yet."}
                </p>
              </>
            ) : (
              <p className="text-sm text-forest-300">
                Use the region controls to break Maine into practical travel zones instead of looking at a generic pin field.
              </p>
            )}
          </div>

          <div className="rounded-[30px] border border-forest-700/50 bg-[linear-gradient(180deg,rgba(18,28,21,0.98),rgba(10,17,12,1))] p-4 shadow-[0_24px_60px_rgba(2,10,6,0.3)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-forest-400">Courses in view</p>
                <h3 className="mt-1 text-lg font-bold text-forest-50">Browse the shortlist</h3>
              </div>
              <Link href="/explore" className="text-sm font-medium text-pine">Open full directory</Link>
            </div>

            <div className="space-y-2">
              {visibleCourses.slice(0, 8).map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelected(course)}
                  className={clsx(
                    "w-full rounded-2xl border p-3 text-left transition-all",
                    selected?.id === course.id
                      ? "border-pine/60 bg-pine/10"
                      : "border-forest-700/60 bg-forest-800/60 hover:border-forest-500/70"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-forest-50">{course.name}</div>
                      <div className="mt-1 text-xs text-forest-400">{course.city} · {course.region}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-forest-300">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      {course.rating}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-forest-300">
                    <span className="rounded-full border border-forest-700/70 bg-forest-900/40 px-2 py-1">{course.holes} holes</span>
                    <span className="rounded-full border border-forest-700/70 bg-forest-900/40 px-2 py-1">{course.difficultyLabel}</span>
                    {played.includes(course.id) && <span className="rounded-full border border-pine/40 bg-pine/10 px-2 py-1 text-pine">Played</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button className="rounded-full border border-forest-700/50 bg-forest-800 px-4 py-3 text-sm font-semibold text-forest-300">
            <div className="flex items-center justify-center gap-2">
              <Trees size={15} className="text-pine" />
              Real "near me" needs browser geolocation, so this atlas focuses on region-based discovery.
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
