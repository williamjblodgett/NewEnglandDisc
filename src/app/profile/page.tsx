"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Trophy, MapPin, Disc, TrendingUp, Star, CalendarDays,
  BarChart2, ChevronRight, Trash2, Award,
} from "lucide-react";
import { courses, getCourseById, getHardestCourses } from "@/data/courses";
import {
  useFavorites,
  usePlayedCourses,
  useRounds,
} from "@/hooks/useUserData";
import { computeBadges } from "@/lib/badges";
import { getGlobalStats, formatDate, scoreLabel } from "@/lib/stats";
import { Badge, Round } from "@/types";
import EmptyState from "@/components/shared/EmptyState";
import clsx from "clsx";

function StatCard({
  label,
  value,
  sub,
  icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={clsx(
      "rounded-2xl p-4 border flex flex-col gap-2",
      accent
        ? "bg-gradient-to-br from-forest-600 to-forest-700 border-forest-500/60"
        : "bg-forest-800 border-forest-700/50"
    )}>
      <div className="flex items-center justify-between">
        <span className="text-forest-400 text-sm">{label}</span>
        <span className="text-pine">{icon}</span>
      </div>
      <div className="text-3xl font-extrabold text-forest-50 stat-number leading-none">{value}</div>
      {sub && <p className="text-forest-500 text-xs">{sub}</p>}
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <div
      className={clsx(
        "rounded-2xl p-4 border transition-all",
        badge.earned
          ? "bg-gradient-to-br from-forest-700 to-forest-800 border-pine/40 badge-earned"
          : "bg-forest-800/60 border-forest-800/60 opacity-50"
      )}
    >
      <div className="text-3xl mb-2">{badge.icon}</div>
      <h4 className={clsx("font-bold text-sm", badge.earned ? "text-forest-50" : "text-forest-400")}>
        {badge.name}
      </h4>
      <p className="text-forest-500 text-xs mt-0.5 leading-tight">{badge.description}</p>
      {badge.progress !== undefined && badge.total !== undefined && !badge.earned && (
        <div className="mt-2">
          <div className="w-full h-1.5 bg-forest-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-pine/60 rounded-full"
              style={{ width: `${(badge.progress / badge.total) * 100}%` }}
            />
          </div>
          <p className="text-forest-600 text-[10px] mt-1">{badge.progress}/{badge.total}</p>
        </div>
      )}
    </div>
  );
}

type ActiveTab = "overview" | "rounds" | "badges";

export default function ProfilePage() {
  const [tab, setTab] = useState<ActiveTab>("overview");
  const { favorites } = useFavorites();
  const { played } = usePlayedCourses();
  const { rounds, deleteRound } = useRounds();
  const listedCourseCount = courses.length;

  const hardestIds = getHardestCourses(10).map((c) => c.id);
  const badges = computeBadges(played, rounds, hardestIds, listedCourseCount);
  const earnedBadges = badges.filter((b) => b.earned);
  const unearnedBadges = badges.filter((b) => !b.earned);
  const { totalRounds, totalCourses, mostPlayed, bestScoreByCourse } =
    getGlobalStats(rounds, played);

  const recentRounds = [...rounds]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  const mostPlayedCourses = mostPlayed
    .map((id) => getCourseById(id))
    .filter(Boolean);

  const regionProgress = Object.fromEntries(
    ["Southern Maine", "Greater Portland", "Mid-Coast", "Central Maine",
     "Western Maine", "Down East", "Aroostook", "Western Mountains"].map((r) => {
      const regionCourses = courses.filter((c) => c.region === r);
      const playedCount = regionCourses.filter((c) => played.includes(c.id)).length;
      return [r, { played: playedCount, total: regionCourses.length }];
    })
  );

  const tabs: { key: ActiveTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "rounds", label: `Rounds (${totalRounds})` },
    { key: "badges", label: `Badges (${earnedBadges.length})` },
  ];

  return (
    <div className="min-h-screen bg-forest-900 page-enter">
      {/* Header */}
      <div className="bg-gradient-to-b from-forest-700 to-forest-900 pt-14 pb-6 px-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-pine/20 border-2 border-pine/40 flex items-center justify-center text-3xl">
            🥏
          </div>
          <div>
            <h1 className="text-xl font-bold text-forest-50">My Profile</h1>
            <p className="text-forest-400 text-sm mt-0.5">
              {earnedBadges.length} badges · {totalCourses} courses explored
            </p>
          </div>
        </div>

        {/* Passport progress */}
        <div className="mt-4 bg-forest-800/60 border border-forest-700/40 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-forest-200 text-sm font-semibold">Maine Disc Golf Passport</span>
            <span className="text-pine font-bold text-sm">{played.length}/{listedCourseCount}</span>
          </div>
          <div className="w-full h-2 bg-forest-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pine to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${(played.length / listedCourseCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-forest-900/95 backdrop-blur-md border-b border-forest-800/60">
        <div className="flex px-4">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={clsx(
                "flex-1 py-3 text-sm font-semibold border-b-2 transition-all",
                tab === key
                  ? "border-pine text-pine"
                  : "border-transparent text-forest-500"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-8">
        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="space-y-4">
            {/* Key stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Courses Played"
                value={totalCourses}
                sub={`${listedCourseCount - totalCourses} left to explore`}
                icon={<MapPin size={16} />}
                accent
              />
              <StatCard
                label="Total Rounds"
                value={totalRounds}
                sub="All time"
                icon={<Disc size={16} />}
              />
              <StatCard
                label="Badges Earned"
                value={earnedBadges.length}
                sub={`${badges.length} total`}
                icon={<Trophy size={16} />}
              />
              <StatCard
                label="Favorites"
                value={favorites.length}
                icon={<Star size={16} />}
              />
            </div>

            {/* Region progress */}
            <div className="bg-forest-800 border border-forest-700/50 rounded-2xl p-4">
              <h3 className="text-forest-50 font-bold text-base mb-3 flex items-center gap-2">
                <BarChart2 size={16} className="text-pine" />
                Region Progress
              </h3>
              <div className="space-y-2.5">
                {Object.entries(regionProgress).map(([region, { played: p, total: t }]) => (
                  <div key={region}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-forest-300 text-xs">{region}</span>
                      <span className="text-forest-400 text-xs font-medium">{p}/{t}</span>
                    </div>
                    <div className="w-full h-1.5 bg-forest-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pine rounded-full"
                        style={{ width: `${(p / t) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most played courses */}
            {mostPlayedCourses.length > 0 && (
              <div className="bg-forest-800 border border-forest-700/50 rounded-2xl p-4">
                <h3 className="text-forest-50 font-bold text-base mb-3">Most Played</h3>
                <div className="space-y-2">
                  {mostPlayedCourses.slice(0, 5).map((c, i) => {
                    if (!c) return null;
                    const roundCount = rounds.filter((r) => r.courseId === c.id).length;
                    return (
                      <Link key={c.id} href={`/course/${c.id}`}>
                        <div className="flex items-center gap-3 py-2 border-b border-forest-700/40 last:border-0">
                          <span className="text-forest-500 font-bold text-sm w-5">{i + 1}</span>
                          <div className="flex-1">
                            <p className="text-forest-100 text-sm font-medium">{c.name}</p>
                            <p className="text-forest-500 text-xs">{c.city}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-pine font-bold text-sm">{roundCount}</p>
                            <p className="text-forest-600 text-xs">rounds</p>
                          </div>
                          <ChevronRight size={14} className="text-forest-600" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {totalRounds === 0 && (
              <EmptyState
                icon="🥏"
                title="No rounds logged yet"
                body="Visit a course detail page to log your first round and start tracking your Maine disc golf journey."
                action={
                  <Link
                    href="/explore"
                    className="text-sm font-bold text-forest-900 bg-pine px-5 py-2.5 rounded-full"
                  >
                    Find a Course
                  </Link>
                }
              />
            )}
          </div>
        )}

        {/* ROUNDS TAB */}
        {tab === "rounds" && (
          <div className="space-y-2">
            {recentRounds.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No rounds logged"
                body="Visit a course and tap 'Log a Round' to start tracking your game."
                action={
                  <Link href="/explore" className="text-sm font-bold text-forest-900 bg-pine px-5 py-2.5 rounded-full">
                    Explore Courses
                  </Link>
                }
              />
            ) : (
              recentRounds.map((r) => {
                const c = getCourseById(r.courseId);
                return (
                  <div key={r.id} className="bg-forest-800 border border-forest-700/40 rounded-xl p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <Link href={`/course/${r.courseId}`}>
                          <p className="text-forest-200 font-semibold text-sm truncate hover:text-pine transition-colors">
                            {c?.name ?? "Unknown Course"}
                          </p>
                        </Link>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-pine font-bold text-base stat-number">{r.totalScore}</span>
                          <span className={clsx(
                            "text-xs font-medium",
                            r.scoreVsPar < 0 ? "text-emerald-400" :
                            r.scoreVsPar === 0 ? "text-sky-400" : "text-forest-400"
                          )}>
                            {r.scoreVsPar > 0 ? `+${r.scoreVsPar}` : r.scoreVsPar}
                          </span>
                          <span className="text-forest-500 text-xs">·</span>
                          <span className="text-forest-400 text-xs">{scoreLabel(r.scoreVsPar)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-forest-500">
                          <CalendarDays size={10} />
                          {formatDate(r.date)}
                          {r.conditions && <span>· {r.conditions}</span>}
                        </div>
                        {r.notes && (
                          <p className="text-forest-500 text-xs mt-1 italic truncate">{r.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              size={10}
                              className={n <= r.personalRating ? "text-amber-400 fill-amber-400" : "text-forest-700"}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => deleteRound(r.id)}
                          className="p-1 text-forest-700 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* BADGES TAB */}
        {tab === "badges" && (
          <div className="space-y-4">
            {earnedBadges.length > 0 && (
              <div>
                <h3 className="text-forest-300 text-xs font-semibold uppercase tracking-wider mb-3">
                  🏆 Earned ({earnedBadges.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {earnedBadges.map((b) => <BadgeCard key={b.id} badge={b} />)}
                </div>
              </div>
            )}
            {unearnedBadges.length > 0 && (
              <div>
                <h3 className="text-forest-500 text-xs font-semibold uppercase tracking-wider mb-3">
                  Locked ({unearnedBadges.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {unearnedBadges.map((b) => <BadgeCard key={b.id} badge={b} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
