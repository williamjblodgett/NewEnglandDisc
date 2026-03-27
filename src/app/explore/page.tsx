"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { courses } from "@/data/courses";
import { Course, DifficultyLabel, TerrainType } from "@/types";
import CourseCard from "@/components/courses/CourseCard";
import DifficultyBadge from "@/components/courses/DifficultyBadge";
import EmptyState from "@/components/shared/EmptyState";
import { useFavorites, usePlayedCourses } from "@/hooks/useUserData";
import clsx from "clsx";

type SortKey = "rating" | "difficulty" | "name" | "length" | "holes";
type UserFilter = "all" | "favorites" | "played" | "not-played";

const DIFFICULTIES: DifficultyLabel[] = ["Beginner", "Intermediate", "Advanced", "Pro"];
const TERRAINS: TerrainType[] = ["Wooded", "Open", "Mixed"];
const HOLES_OPTIONS = [9, 18];

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
        active
          ? "bg-pine text-forest-900 border-pine"
          : "bg-forest-800/80 text-forest-300 border-forest-700/60 hover:border-forest-500"
      )}
    >
      {label}
    </button>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const { isPlayed, played } = usePlayedCourses();

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [difficulties, setDifficulties] = useState<DifficultyLabel[]>([]);
  const [terrains, setTerrains] = useState<TerrainType[]>([]);
  const [freeOnly, setFreeOnly] = useState(false);
  const [userFilter, setUserFilter] = useState<UserFilter>("all");
  const [holesFilter, setHolesFilter] = useState<number | null>(null);

  // Read URL params on mount
  useEffect(() => {
    const sort = searchParams.get("sort");
    const diff = searchParams.get("difficulty") as DifficultyLabel | null;
    if (sort === "rating" || sort === "difficulty" || sort === "name") setSortKey(sort as SortKey);
    if (diff && DIFFICULTIES.includes(diff)) setDifficulties([diff]);
  }, [searchParams]);

  const toggle = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const filtered = useMemo(() => {
    let list = [...courses];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q)
      );
    }

    // Difficulty
    if (difficulties.length) {
      list = list.filter((c) => difficulties.includes(c.difficultyLabel));
    }

    // Terrain
    if (terrains.length) {
      list = list.filter((c) => c.terrain !== undefined && terrains.includes(c.terrain));
    }

    // Free
    if (freeOnly) list = list.filter((c) => c.free);

    // Holes
    if (holesFilter) list = list.filter((c) => c.holes === holesFilter);

    // User filter
    if (userFilter === "favorites")
      list = list.filter((c) => favorites.includes(c.id));
    if (userFilter === "played")
      list = list.filter((c) => played.includes(c.id));
    if (userFilter === "not-played")
      list = list.filter((c) => !played.includes(c.id));

    // Sort
    list.sort((a, b) => {
      if (sortKey === "rating") return b.rating - a.rating;
      if (sortKey === "difficulty") return b.difficultyScore - a.difficultyScore;
      if (sortKey === "name") return a.name.localeCompare(b.name);
        if (sortKey === "length") return (b.lengthFeet ?? 0) - (a.lengthFeet ?? 0);
      if (sortKey === "holes") return b.holes - a.holes;
      return 0;
    });

    return list;
  }, [query, difficulties, terrains, freeOnly, userFilter, holesFilter, sortKey, favorites, played]);

  const hasActiveFilters =
    difficulties.length > 0 ||
    terrains.length > 0 ||
    freeOnly ||
    holesFilter !== null ||
    userFilter !== "all";

  return (
    <div className="min-h-screen bg-forest-900 page-enter">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-forest-900/95 backdrop-blur-md border-b border-forest-800/60 px-4 pt-12 pb-3">
        <h1 className="text-xl font-bold text-forest-50 mb-3">
          Explore Courses
        </h1>

        {/* Search bar */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-forest-800 border border-forest-700/60 rounded-xl px-3 py-2.5">
            <Search size={15} className="text-forest-500 shrink-0" />
            <input
              type="text"
              placeholder="Search courses, towns…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-forest-100 text-sm placeholder:text-forest-600 outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X size={14} className="text-forest-500" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-colors",
              showFilters || hasActiveFilters
                ? "bg-pine text-forest-900 border-pine"
                : "bg-forest-800 text-forest-300 border-forest-700/60"
            )}
          >
            <SlidersHorizontal size={15} />
            {hasActiveFilters && (
              <span className="text-xs">{difficulties.length + terrains.length + (freeOnly ? 1 : 0)}</span>
            )}
          </button>
        </div>

        {/* Sort chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto [scrollbar-width:none]">
          {(["rating", "difficulty", "name", "length"] as SortKey[]).map((k) => (
            <FilterChip
              key={k}
              label={k.charAt(0).toUpperCase() + k.slice(1)}
              active={sortKey === k}
              onClick={() => setSortKey(k)}
            />
          ))}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-forest-800/90 border-b border-forest-700/50 px-4 py-4 space-y-4">
          {/* Difficulty */}
          <div>
            <p className="text-forest-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Difficulty
            </p>
            <div className="flex gap-2 flex-wrap">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulties((prev) => toggle(prev, d))}
                >
                  <DifficultyBadge
                    label={d}
                    size="sm"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Terrain */}
          <div>
            <p className="text-forest-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Terrain
            </p>
            <div className="flex gap-2">
              {TERRAINS.map((t) => (
                <FilterChip
                  key={t}
                  label={t}
                  active={terrains.includes(t)}
                  onClick={() => setTerrains((prev) => toggle(prev, t))}
                />
              ))}
            </div>
          </div>

          {/* Holes + Free */}
          <div className="flex gap-3 flex-wrap">
            <FilterChip
              label="Free Only"
              active={freeOnly}
              onClick={() => setFreeOnly((v) => !v)}
            />
            {HOLES_OPTIONS.map((h) => (
              <FilterChip
                key={h}
                label={`${h} holes`}
                active={holesFilter === h}
                onClick={() => setHolesFilter((v) => (v === h ? null : h))}
              />
            ))}
          </div>

          {/* My Courses */}
          <div>
            <p className="text-forest-400 text-xs font-semibold uppercase tracking-wider mb-2">
              My Courses
            </p>
            <div className="flex gap-2 flex-wrap">
              {(["all", "favorites", "played", "not-played"] as UserFilter[]).map((f) => (
                <FilterChip
                  key={f}
                  label={f === "not-played" ? "Not Played" : f.charAt(0).toUpperCase() + f.slice(1)}
                  active={userFilter === f}
                  onClick={() => setUserFilter(f)}
                />
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setDifficulties([]);
                setTerrains([]);
                setFreeOnly(false);
                setHolesFilter(null);
                setUserFilter("all");
              }}
              className="text-xs text-red-400 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="px-4 py-3 border-b border-forest-800/50">
        <p className="text-forest-500 text-xs">
          <span className="text-forest-200 font-semibold">{filtered.length}</span> courses
          {hasActiveFilters && " matching filters"}
        </p>
      </div>

      {/* Course list */}
      <div className="px-4 py-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No courses found"
            body="Try adjusting your search or clearing filters."
          />
        ) : (
          filtered.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              isFavorite={isFavorite(c.id)}
              isPlayed={isPlayed(c.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreContent />
    </Suspense>
  );
}
