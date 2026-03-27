"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, CheckCircle, Bookmark } from "lucide-react";
import { getCourseById, getCourseCount } from "@/data/courses";
import { useFavorites, usePlayedCourses } from "@/hooks/useUserData";
import CourseCard from "@/components/courses/CourseCard";
import EmptyState from "@/components/shared/EmptyState";
import { Course } from "@/types";
import clsx from "clsx";

type Tab = "favorites" | "played" | "wishlist";

export default function FavoritesPage() {
  const [tab, setTab] = useState<Tab>("favorites");
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { played, togglePlayed, isPlayed } = usePlayedCourses();

  const favoriteCourses = favorites.map((id) => getCourseById(id)).filter(Boolean) as Course[];
  const playedCourses = played.map((id) => getCourseById(id)).filter(Boolean) as Course[];
  const wishlistCourses = favoriteCourses.filter((c) => !played.includes(c.id));
  const totalCourses = getCourseCount();

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "favorites", label: "Favorites", icon: <Heart size={14} />, count: favoriteCourses.length },
    { key: "played", label: "Played", icon: <CheckCircle size={14} />, count: playedCourses.length },
    { key: "wishlist", label: "Bucket List", icon: <Bookmark size={14} />, count: wishlistCourses.length },
  ];

  const displayCourses =
    tab === "favorites" ? favoriteCourses :
    tab === "played" ? playedCourses :
    wishlistCourses;

  return (
    <div className="min-h-screen bg-forest-900 page-enter">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-forest-900/95 backdrop-blur-md border-b border-forest-800/60 px-4 pt-12 pb-0">
        <h1 className="text-xl font-bold text-forest-50 mb-4">My Courses</h1>

        {/* Tabs */}
        <div className="flex border-b border-forest-800/60">
          {tabs.map(({ key, label, icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-1.5 pb-3 text-sm font-semibold border-b-2 transition-all",
                tab === key
                  ? "border-pine text-pine"
                  : "border-transparent text-forest-500"
              )}
            >
              {icon}
              {label}
              {count > 0 && (
                <span className={clsx(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  tab === key ? "bg-pine/20 text-pine" : "bg-forest-800 text-forest-500"
                )}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progress toward total */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-forest-800/60 border border-forest-700/40 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-forest-100 font-semibold text-sm">Maine Passport</p>
            <p className="text-forest-500 text-xs mt-0.5">{played.length} of {totalCourses} courses completed</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-forest-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-pine rounded-full transition-all duration-700"
                style={{ width: `${(played.length / totalCourses) * 100}%` }}
              />
            </div>
            <span className="text-pine font-bold text-xs">{Math.round((played.length / totalCourses) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Course list */}
      <div className="px-4 pt-2 pb-6 flex flex-col gap-3">
        {displayCourses.length === 0 ? (
          <EmptyState
            icon={tab === "favorites" ? "❤️" : tab === "played" ? "✅" : "📍"}
            title={
              tab === "favorites"
                ? "No favorites yet"
                : tab === "played"
                ? "No courses played yet"
                : "Bucket list is empty"
            }
            body={
              tab === "favorites"
                ? "Tap the heart icon on any course to save it here."
                : tab === "played"
                ? "Mark courses as played from the course detail page."
                : "Add courses to favorites that you haven't played yet."
            }
            action={
              <Link
                href="/explore"
                className="text-sm font-bold text-forest-900 bg-pine px-5 py-2.5 rounded-full"
              >
                Explore Courses
              </Link>
            }
          />
        ) : (
          displayCourses.map((c) => (
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
