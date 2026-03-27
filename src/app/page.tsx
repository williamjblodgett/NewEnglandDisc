"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, ArrowRight, MapPin, TrendingUp, Sparkles } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import {
  courses,
  getFeaturedCourses,
  getTopRatedCourses,
  getHardestCourses,
  getBeginnerCourses,
  getCourseById,
} from "@/data/courses";
import { useFavorites, usePlayedCourses, useRecentlyViewed } from "@/hooks/useUserData";
import { Course } from "@/types";

function SectionHeader({
  title,
  linkHref,
  linkLabel = "See all",
}: {
  title: string;
  linkHref: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <h2 className="text-forest-50 font-bold text-lg">{title}</h2>
      <Link
        href={linkHref}
        className="text-pine text-sm font-medium flex items-center gap-1"
      >
        {linkLabel} <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function HorizontalScroll({
  courses,
  isFavorite,
  isPlayed,
  onToggleFavorite,
}: {
  courses: Course[];
  isFavorite: (id: string) => boolean;
  isPlayed: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] snap-x snap-mandatory">
      {courses.map((c) => (
        <div key={c.id} className="snap-start shrink-0">
          <CourseCard
            course={c}
            compact
            isFavorite={isFavorite(c.id)}
            isPlayed={isPlayed(c.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isPlayed, played } = usePlayedCourses();
  const { recent } = useRecentlyViewed();

  const featured = getFeaturedCourses();
  const topRated = getTopRatedCourses(8);
  const hardest = getHardestCourses(6);
  const beginnerFriendly = getBeginnerCourses(6);
  const totalCourses = courses.length;
  const recentCourses = recent
    .map((id) => getCourseById(id))
    .filter(Boolean) as Course[];

  return (
    <div className="min-h-screen bg-forest-900 page-enter">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-forest-700 via-forest-800 to-forest-900 pt-14 pb-8 px-4">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-pine rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🥏</span>
            <span className="text-pine font-bold text-xs tracking-widest uppercase">
              Maine Disc Golf
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-2">
            Discover Maine&apos;s
            <br />
            Best Courses
          </h1>
          <p className="text-forest-300 text-sm leading-relaxed mb-6 max-w-xs">
            {played.length > 0
              ? `You've played ${played.length} of ${totalCourses} Maine courses. Keep exploring!`
              : `${totalCourses} real PDGA-listed courses across Maine. Start your Maine disc golf journey.`}
          </p>
          <div className="flex gap-3">
            <Link
              href="/explore"
              className="flex items-center gap-2 bg-pine text-forest-900 font-bold text-sm px-5 py-2.5 rounded-full shadow-lg shadow-pine/20 active:scale-95 transition-transform"
            >
              <Compass size={16} />
              Explore
            </Link>
            <Link
              href="/map"
              className="flex items-center gap-2 bg-forest-700/80 border border-forest-600/60 text-forest-100 font-semibold text-sm px-5 py-2.5 rounded-full active:scale-95 transition-transform"
            >
              <MapPin size={16} />
              Map View
            </Link>
          </div>
        </div>
      </div>

      {/* Passport Progress */}
      {played.length > 0 && (
        <div className="mx-4 mt-4 bg-forest-800/80 border border-forest-700/50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-pine" />
              <span className="text-forest-100 font-semibold text-sm">
                Maine Passport
              </span>
            </div>
            <span className="text-pine font-bold text-sm">{played.length}/30</span>
          </div>
          <div className="w-full h-2 bg-forest-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pine to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${(played.length / totalCourses) * 100}%` }}
            />
          </div>
          <p className="text-forest-400 text-xs mt-1.5">
            {totalCourses - played.length} courses left to complete your Maine passport
          </p>
        </div>
      )}

      {/* Recently Viewed */}
      {recentCourses.length > 0 && (
        <section className="mt-6">
          <SectionHeader title="Recently Viewed" linkHref="/explore" />
          <HorizontalScroll
            courses={recentCourses}
            isFavorite={isFavorite}
            isPlayed={isPlayed}
            onToggleFavorite={toggleFavorite}
          />
        </section>
      )}

      {/* Featured */}
      <section className="mt-6">
        <SectionHeader
          title="✨ Featured Courses"
          linkHref="/explore?filter=featured"
        />
        <HorizontalScroll
          courses={featured}
          isFavorite={isFavorite}
          isPlayed={isPlayed}
          onToggleFavorite={toggleFavorite}
        />
      </section>

      {/* Top Rated */}
      <section className="mt-6">
        <SectionHeader title="⭐ Top Rated" linkHref="/explore?sort=rating" />
        <div className="px-4 flex flex-col gap-3">
          {topRated.slice(0, 4).map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              isFavorite={isFavorite(c.id)}
              isPlayed={isPlayed(c.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Hardest */}
      <section className="mt-6">
        <SectionHeader
          title="🔥 Hardest Courses"
          linkHref="/explore?sort=difficulty"
        />
        <HorizontalScroll
          courses={hardest}
          isFavorite={isFavorite}
          isPlayed={isPlayed}
          onToggleFavorite={toggleFavorite}
        />
      </section>

      {/* Beginner Friendly */}
      <section className="mt-6">
        <SectionHeader
          title="🌿 Beginner Friendly"
          linkHref="/explore?difficulty=Beginner"
        />
        <HorizontalScroll
          courses={beginnerFriendly}
          isFavorite={isFavorite}
          isPlayed={isPlayed}
          onToggleFavorite={toggleFavorite}
        />
      </section>

      {/* Stats CTA */}
      <div className="mx-4 mt-6 mb-8 bg-gradient-to-br from-forest-700 to-forest-800 border border-forest-600/50 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-pine" />
          <span className="text-pine font-semibold text-sm">Track Your Game</span>
        </div>
        <p className="text-forest-200 text-sm mb-4">
          Log rounds, track scores, and earn badges as you explore Maine.
        </p>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm font-bold text-forest-900 bg-pine px-4 py-2 rounded-full"
        >
          View My Stats <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

