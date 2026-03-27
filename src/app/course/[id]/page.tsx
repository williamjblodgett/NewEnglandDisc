"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Heart, CheckCircle, Star, TreePine, Wind, Layers,
  MapPin, DollarSign, Disc, Clock, Mountain, Droplets, Zap,
  Plus, ChevronDown, Trash2, CalendarDays,
} from "lucide-react";
import { getCourseById } from "@/data/courses";
import {
  useFavorites,
  usePlayedCourses,
  useRounds,
  useRecentlyViewed,
} from "@/hooks/useUserData";
import { getCourseStats, formatDate, scoreLabel } from "@/lib/stats";
import DifficultyBadge from "@/components/courses/DifficultyBadge";
import DifficultyMeter from "@/components/courses/DifficultyMeter";
import EmptyState from "@/components/shared/EmptyState";
import { Round } from "@/types";
import clsx from "clsx";

const CONDITIONS = ["Great", "Windy", "Muddy", "Wet", "Dry", "Cold", "Hot"] as const;

function StatRow({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-forest-800/60 last:border-0">
      <div className="flex items-center gap-2 text-forest-400 text-sm">
        {icon}
        {label}
      </div>
      <span className="text-forest-100 font-semibold text-sm">{value}</span>
    </div>
  );
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const course = getCourseById(id);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isPlayed, togglePlayed } = usePlayedCourses();
  const { rounds, addRound, deleteRound, getRoundsForCourse } = useRounds();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [showRoundForm, setShowRoundForm] = useState(false);
  const [showAllRounds, setShowAllRounds] = useState(false);

  // Round form state
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formScore, setFormScore] = useState("");
  const [formVsPar, setFormVsPar] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formCondition, setFormCondition] = useState("Great");
  const [formRating, setFormRating] = useState(4);

  useEffect(() => {
    if (course) addRecentlyViewed(course.id);
  }, [course?.id]);

  if (!course) {
    return (
      <div className="min-h-screen bg-forest-900 flex items-center justify-center">
        <EmptyState icon="🥏" title="Course not found" body="This course doesn't exist." />
      </div>
    );
  }

  const courseRounds = getRoundsForCourse(course.id);
  const stats = getCourseStats(courseRounds);
  const played = isPlayed(course.id);
  const favorited = isFavorite(course.id);
  const displayedRounds = showAllRounds ? courseRounds : courseRounds.slice(0, 3);
  const imageSrc = course.imageUrl ?? "/course-placeholder.svg";
  const terrainLabel = course.terrain ?? "Unknown";
  const feeLabel = course.free === true ? "Free" : course.free === false ? "Paid" : "Not verified";
  const detailsSource = course.source ?? "Source not listed";

  const TerrainIcon =
    terrainLabel === "Wooded" ? TreePine :
    terrainLabel === "Open" ? Wind : Layers;

  const handleAddRound = () => {
    if (!formScore) return;
    const score = parseInt(formScore);
    const vsPar = formVsPar ? parseInt(formVsPar) : course.par !== undefined ? score - course.par : 0;
    addRound({
      courseId: course.id,
      date: new Date(formDate).toISOString(),
      totalScore: score,
      scoreVsPar: vsPar,
      notes: formNotes,
      conditions: formCondition,
      personalRating: formRating,
    });
    if (!played) togglePlayed(course.id);
    setShowRoundForm(false);
    setFormScore("");
    setFormVsPar("");
    setFormNotes("");
    setFormCondition("Great");
    setFormRating(4);
  };

  return (
    <div className="min-h-screen bg-forest-900 page-enter">
      {/* Hero Image */}
      <div className="relative h-60 w-full">
        <Image
          src={imageSrc}
          alt={course.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/40 via-transparent to-forest-900" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-12 left-4 p-2 rounded-full bg-forest-900/70 backdrop-blur-sm border border-forest-700/50 text-forest-100"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Favorite button */}
        <button
          onClick={() => toggleFavorite(course.id)}
          className="absolute top-12 right-4 p-2 rounded-full bg-forest-900/70 backdrop-blur-sm border border-forest-700/50"
        >
          <Heart
            size={18}
            strokeWidth={2}
            className={favorited ? "text-red-400 fill-red-400" : "text-forest-200"}
          />
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-6 relative z-10">
        {/* Title card */}
        <div className="bg-forest-800 border border-forest-700/50 rounded-2xl p-4 mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-forest-50 leading-tight">{course.name}</h1>
              <div className="flex items-center gap-1.5 mt-1 text-forest-400 text-sm">
                <MapPin size={12} />
                <span>{course.city}, {course.region}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="text-forest-100 font-bold text-sm">{course.rating}</span>
              <span className="text-forest-500 text-xs">({course.ratingCount})</span>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <DifficultyBadge label={course.difficultyLabel} score={course.difficultyScore} />
            {course.free === true ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300">Free</span>
            ) : course.free === false ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-900/50 border border-amber-700/50 text-amber-300">Paid</span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-forest-700/80 border border-forest-600/50 text-forest-300">Fee Unknown</span>
            )}
            {played && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-pine/20 border border-pine/40 text-pine">
                <CheckCircle size={10} /> Played
              </span>
            )}
          </div>

          {/* Difficulty meter */}
          <div className="mt-3">
            <p className="text-forest-500 text-xs mb-1.5">Difficulty Rating</p>
            <DifficultyMeter score={course.difficultyScore} />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-forest-300 text-sm leading-relaxed">
            {course.description ?? `${detailsSource}-listed course in ${course.city}, Maine.`}
          </p>
          <p className="text-forest-500 text-xs mt-2">
            Verified source: {detailsSource}
            {course.coordinatePrecision === "town" ? " · map pin shows town center" : ""}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowRoundForm((v) => !v)}
            className="flex-1 flex items-center justify-center gap-2 bg-pine text-forest-900 font-bold text-sm py-3 rounded-full"
          >
            <Plus size={16} /> Log a Round
          </button>
          <button
            onClick={() => togglePlayed(course.id)}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 font-semibold text-sm py-3 rounded-full border transition-all",
              played
                ? "bg-pine/20 border-pine/40 text-pine"
                : "bg-forest-800 border-forest-700/60 text-forest-300"
            )}
          >
            <CheckCircle size={16} />
            {played ? "Played ✓" : "Mark Played"}
          </button>
        </div>

        {/* Round Logger Form */}
        {showRoundForm && (
          <div className="bg-forest-800 border border-forest-700/50 rounded-2xl p-4 mb-6">
            <h3 className="text-forest-50 font-bold text-base mb-4">Log a Round</h3>
            <div className="space-y-3">
              <div>
                <label className="text-forest-400 text-xs font-semibold block mb-1">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-forest-700/80 border border-forest-600/60 rounded-xl px-3 py-2.5 text-forest-100 text-sm outline-none focus:border-pine/60"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-forest-400 text-xs font-semibold block mb-1">Total Score</label>
                  <input
                    type="number"
                    placeholder={course.par !== undefined ? `e.g. ${course.par + 4}` : "Enter total score"}
                    value={formScore}
                    onChange={(e) => setFormScore(e.target.value)}
                    className="w-full bg-forest-700/80 border border-forest-600/60 rounded-xl px-3 py-2.5 text-forest-100 text-sm outline-none focus:border-pine/60"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-forest-400 text-xs font-semibold block mb-1">vs Par (optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. +4"
                    value={formVsPar}
                    onChange={(e) => setFormVsPar(e.target.value)}
                    className="w-full bg-forest-700/80 border border-forest-600/60 rounded-xl px-3 py-2.5 text-forest-100 text-sm outline-none focus:border-pine/60"
                  />
                </div>
              </div>
              <div>
                <label className="text-forest-400 text-xs font-semibold block mb-2">Conditions</label>
                <div className="flex gap-2 flex-wrap">
                  {CONDITIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFormCondition(c)}
                      className={clsx(
                        "text-xs px-3 py-1.5 rounded-full border transition-all",
                        formCondition === c
                          ? "bg-pine text-forest-900 border-pine"
                          : "bg-forest-700/60 text-forest-400 border-forest-600/50"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-forest-400 text-xs font-semibold block mb-1">Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Best round yet, lost a disc on 7, muddy back nine…"
                  rows={2}
                  className="w-full bg-forest-700/80 border border-forest-600/60 rounded-xl px-3 py-2.5 text-forest-100 text-sm outline-none focus:border-pine/60 resize-none"
                />
              </div>
              <div>
                <label className="text-forest-400 text-xs font-semibold block mb-2">Personal Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setFormRating(n)}>
                      <Star
                        size={22}
                        className={n <= formRating ? "text-amber-400 fill-amber-400" : "text-forest-600"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleAddRound}
                  disabled={!formScore}
                  className="flex-1 bg-pine disabled:opacity-40 text-forest-900 font-bold text-sm py-2.5 rounded-full"
                >
                  Save Round
                </button>
                <button
                  onClick={() => setShowRoundForm(false)}
                  className="flex-1 bg-forest-700/60 text-forest-300 font-semibold text-sm py-2.5 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Personal Stats */}
        {stats.totalRounds > 0 && (
          <div className="bg-forest-800 border border-forest-700/50 rounded-2xl p-4 mb-4">
            <h3 className="text-forest-50 font-bold text-base mb-3">Your Stats</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-forest-700/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-extrabold text-pine stat-number">{stats.bestScore}</div>
                <div className="text-forest-400 text-xs mt-0.5">Best Score</div>
              </div>
              <div className="bg-forest-700/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-extrabold text-forest-100 stat-number">{stats.avgScore}</div>
                <div className="text-forest-400 text-xs mt-0.5">Avg Score</div>
              </div>
              <div className="bg-forest-700/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-extrabold text-forest-100 stat-number">{stats.totalRounds}</div>
                <div className="text-forest-400 text-xs mt-0.5">Rounds Played</div>
              </div>
              <div className="bg-forest-700/50 rounded-xl p-3 text-center">
                <div className="text-xs font-bold text-forest-100">{stats.lastPlayed ? formatDate(stats.lastPlayed) : "—"}</div>
                <div className="text-forest-400 text-xs mt-0.5">Last Played</div>
              </div>
            </div>
            {stats.improvement !== null && stats.improvement > 0 && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium bg-emerald-900/30 rounded-xl px-3 py-2">
                📈 You&apos;ve improved by ~{stats.improvement.toFixed(1)} strokes recently. Keep it up!
              </div>
            )}
          </div>
        )}

        {/* Round History */}
        {courseRounds.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-forest-50 font-bold text-base">Round History</h3>
              {courseRounds.length > 3 && (
                <button
                  onClick={() => setShowAllRounds((v) => !v)}
                  className="text-pine text-xs font-medium"
                >
                  {showAllRounds ? "Show less" : `See all ${courseRounds.length}`}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {displayedRounds.map((r) => (
                <div
                  key={r.id}
                  className="bg-forest-800 border border-forest-700/40 rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-forest-100 font-bold text-sm">{r.totalScore}</span>
                      <span className={clsx(
                        "text-xs font-semibold",
                        r.scoreVsPar < 0 ? "text-emerald-400" :
                        r.scoreVsPar === 0 ? "text-sky-400" : "text-forest-400"
                      )}>
                        {r.scoreVsPar > 0 ? `+${r.scoreVsPar}` : r.scoreVsPar} · {scoreLabel(r.scoreVsPar)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-forest-500">
                      <CalendarDays size={10} /> {formatDate(r.date)}
                      {r.conditions && <span>· {r.conditions}</span>}
                    </div>
                    {r.notes && <p className="text-forest-400 text-xs mt-1 truncate">{r.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={10} className={n <= r.personalRating ? "text-amber-400 fill-amber-400" : "text-forest-700"} />
                      ))}
                    </div>
                    <button onClick={() => deleteRound(r.id)} className="p-1.5 text-forest-600 hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Stats */}
        <div className="bg-forest-800 border border-forest-700/50 rounded-2xl p-4 mb-4">
          <h3 className="text-forest-50 font-bold text-base mb-1">Course Details</h3>
          <StatRow label="Holes" value={course.holes} icon={<Disc size={13} />} />
          <StatRow label="Course Length" value={course.lengthFeet !== undefined ? `${course.lengthFeet.toLocaleString()} ft` : "Not verified"} icon={<Zap size={13} />} />
          <StatRow label="Par" value={course.par ?? "Not verified"} icon={<Star size={13} />} />
          <StatRow label="Terrain" value={terrainLabel} icon={<TerrainIcon size={13} />} />
          <StatRow label="Elevation Change" value={course.elevationChange !== undefined ? `${course.elevationChange} ft` : "Not verified"} icon={<Mountain size={13} />} />
          <StatRow label="Water Hazards" value={course.waterHazards !== undefined ? (course.waterHazards ? "Yes" : "No") : "Not verified"} icon={<Droplets size={13} />} />
          <StatRow label="Fee" value={feeLabel} icon={<DollarSign size={13} />} />
          <StatRow label="Established" value={course.established ?? "Not verified"} icon={<Clock size={13} />} />
        </div>

        {/* Amenities */}
        {(course.amenities?.length ?? 0) > 0 && (
          <div className="bg-forest-800 border border-forest-700/50 rounded-2xl p-4 mb-4">
            <h3 className="text-forest-50 font-bold text-base mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {course.amenities?.map((a) => (
                <span key={a} className="text-xs bg-forest-700/70 border border-forest-600/50 text-forest-200 px-2.5 py-1 rounded-full">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Local Tips */}
        {(course.localTips?.length ?? 0) > 0 && (
          <div className="bg-gradient-to-br from-forest-700/60 to-forest-800 border border-forest-600/40 rounded-2xl p-4 mb-4">
            <h3 className="text-forest-50 font-bold text-base mb-3">💡 Local Tips</h3>
            <ul className="space-y-2">
              {course.localTips?.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-forest-300">
                  <span className="text-pine mt-0.5 shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Location placeholder */}
        <div className="bg-forest-800 border border-forest-700/50 rounded-2xl p-4 mb-8">
          <h3 className="text-forest-50 font-bold text-base mb-2">Location</h3>
          <div className="flex items-center gap-2 text-forest-400 text-sm mb-3">
            <MapPin size={14} className="text-pine" />
            <span>{course.city}, Maine</span>
          </div>
          <div className="w-full h-28 bg-forest-700/60 rounded-xl flex items-center justify-center border border-forest-600/30">
            <div className="text-center">
              {course.coordinates ? (
                <>
                  <p className="text-forest-500 text-xs">
                    📍 {course.coordinates.lat.toFixed(4)}°N, {Math.abs(course.coordinates.lng).toFixed(4)}°W
                  </p>
                  <p className="text-forest-600 text-xs mt-1">
                    {course.coordinatePrecision === "town" ? "Approximate town-center location" : "Open in Maps"}
                  </p>
                </>
              ) : (
                <p className="text-forest-500 text-xs">Location coordinates not yet verified</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
