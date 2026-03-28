"use client";
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
    <div className="mb-3 flex items-end justify-between gap-3 px-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-forest-500">Field guide</p>
        <h2 className="editorial-title text-2xl leading-none text-forest-50">{title}</h2>
      </div>
      <Link
        href={linkHref}
        className="flex items-center gap-1 text-sm font-medium text-pine"
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
  const passportPct = totalCourses > 0 ? (played.length / totalCourses) * 100 : 0;
  const topCourse = topRated[0];

  return (
    <div className="min-h-screen bg-forest-900 page-enter">
      <div className="relative overflow-hidden px-4 pt-14 pb-8">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute left-[8%] top-6 h-72 w-72 rounded-full bg-pine/20 blur-3xl" />
          <div className="absolute right-[5%] top-14 h-60 w-60 rounded-full bg-sky-cool/15 blur-3xl" />
        </div>

        <div className="relative rounded-[36px] border border-forest-700/50 bg-[linear-gradient(135deg,rgba(24,39,28,0.96)_0%,rgba(12,20,15,1)_55%,rgba(16,28,20,0.98)_100%)] p-5 shadow-[0_30px_70px_rgba(2,10,6,0.35)] sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-forest-700/60 bg-forest-800/65 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-pine">
                <span className="text-base leading-none">◌</span>
                Maine Disc Golf
              </div>

              <h1 className="editorial-title max-w-3xl text-4xl leading-[0.95] text-white sm:text-5xl">
                Maine&apos;s better-looking,
                better-organized disc golf field guide.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-forest-300 sm:text-lg">
                Real PDGA-listed courses, stronger regional discovery, and a cleaner product built for players planning weekends, tracking rounds, and finding the right course fast.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/explore"
                  className="flex items-center gap-2 rounded-full bg-pine px-5 py-3 text-sm font-bold text-forest-950 shadow-lg shadow-pine/20 transition-transform active:scale-95"
                >
                  <Compass size={16} />
                  Explore the catalog
                </Link>
                <Link
                  href="/map"
                  className="flex items-center gap-2 rounded-full border border-forest-600/60 bg-forest-800/70 px-5 py-3 text-sm font-semibold text-forest-100 transition-transform active:scale-95"
                >
                  <MapPin size={16} />
                  Open the atlas
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] border border-forest-700/60 bg-forest-800/72 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-forest-500">Verified catalog</div>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-4xl font-extrabold text-forest-50 stat-number">{totalCourses}</div>
                    <p className="mt-1 text-sm text-forest-300">Real courses across Maine, organized by region and difficulty.</p>
                  </div>
                  <div className="rounded-2xl border border-forest-700/60 bg-forest-900/60 px-3 py-2 text-right">
                    <div className="text-sm font-semibold text-pine">{featured.length} featured</div>
                    <div className="text-[11px] text-forest-500">road-trip picks</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-forest-700/60 bg-[linear-gradient(180deg,rgba(24,40,29,0.92),rgba(12,20,15,1))] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-forest-500">Passport progress</div>
                    <div className="mt-2 text-3xl font-extrabold text-forest-50 stat-number">{played.length}/{totalCourses}</div>
                  </div>
                  {topCourse && (
                    <div className="rounded-2xl border border-forest-700/60 bg-forest-900/60 px-3 py-2 text-right">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-forest-500">Top rated</div>
                      <div className="mt-1 text-sm font-semibold text-forest-100">{topCourse.city}</div>
                    </div>
                  )}
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-forest-700">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#4ade80_0%,#8bdf9c_50%,#c7f2d2_100%)] transition-all duration-700"
                    style={{ width: `${passportPct}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-forest-300">
                  {played.length > 0
                    ? `${totalCourses - played.length} courses left before you complete the statewide passport.`
                    : "Start logging rounds and your statewide passport will build itself automatically."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[26px] border border-forest-700/50 bg-forest-800/75 p-4">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-forest-500">
            <MapPin size={13} /> Atlas
          </div>
          <p className="mt-3 text-lg font-semibold text-forest-50">Browse by geography, not just a long list.</p>
          <p className="mt-2 text-sm leading-relaxed text-forest-400">See which regions are dense, which ones are road-trip territory, and where your next round actually fits.</p>
        </div>
        <div className="rounded-[26px] border border-forest-700/50 bg-forest-800/75 p-4">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-forest-500">
            <TrendingUp size={13} /> Tracking
          </div>
          <p className="mt-3 text-lg font-semibold text-forest-50">A personal passport, not generic bookmarking.</p>
          <p className="mt-2 text-sm leading-relaxed text-forest-400">Keep played courses, favorites, and round history in one place without cluttering the discovery flow.</p>
        </div>
        <div className="rounded-[26px] border border-forest-700/50 bg-forest-800/75 p-4">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-forest-500">
            <Sparkles size={13} /> Credibility
          </div>
          <p className="mt-3 text-lg font-semibold text-forest-50">No fake filler content, no missing-photo dead zones.</p>
          <p className="mt-2 text-sm leading-relaxed text-forest-400">Every surface is now built to work on verified course data first, so the product still feels complete without a photo library.</p>
        </div>
      </div>

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

      <div className="mx-4 mt-6 mb-8 rounded-[30px] border border-forest-600/50 bg-gradient-to-br from-forest-700 to-forest-800 p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-pine" />
          <span className="text-pine font-semibold text-sm">Track Your Game</span>
        </div>
        <p className="mb-4 text-sm text-forest-200">
          Log rounds, track scores, and build a real history as you work your way through Maine&apos;s course list.
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

