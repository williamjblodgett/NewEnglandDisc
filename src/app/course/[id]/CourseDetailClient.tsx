"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  CheckCircle,
  Star,
  TreePine,
  Wind,
  Layers,
  MapPin,
  DollarSign,
  Disc,
  Clock,
  Mountain,
  Droplets,
  Zap,
  Plus,
  Trash2,
  CalendarDays,
} from "lucide-react";
import clsx from "clsx";
import CourseArtwork from "@/components/courses/CourseArtwork";
import DifficultyBadge from "@/components/courses/DifficultyBadge";
import DifficultyMeter from "@/components/courses/DifficultyMeter";
import EmptyState from "@/components/shared/EmptyState";
import { getCourseById } from "@/data/courses";
import {
  useFavorites,
  usePlayedCourses,
  useRecentlyViewed,
  useRounds,
} from "@/hooks/useUserData";
import { formatDate, getCourseStats, scoreLabel } from "@/lib/stats";

const CONDITIONS = ["Great", "Windy", "Muddy", "Wet", "Dry", "Cold", "Hot"] as const;

function StatRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-forest-800/60 py-3 last:border-0">
      <div className="flex items-center gap-2 text-sm text-forest-400">
        {icon}
        {label}
      </div>
      <span className="text-sm font-semibold text-forest-100">{value}</span>
    </div>
  );
}

function HeroFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-forest-700/60 bg-forest-800/72 px-3 py-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-forest-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-forest-100">{value}</div>
    </div>
  );
}

function LocationCard({
  label,
  value,
  helpText,
}: {
  label: string;
  value: string;
  helpText: string;
}) {
  return (
    <div className="rounded-2xl border border-forest-700/40 bg-forest-700/35 px-3 py-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-forest-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-forest-100">{value}</div>
      <div className="mt-1 text-xs leading-relaxed text-forest-400">{helpText}</div>
    </div>
  );
}

export default function CourseDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const course = getCourseById(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isPlayed, togglePlayed } = usePlayedCourses();
  const { addRound, deleteRound, getRoundsForCourse } = useRounds();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [showRoundForm, setShowRoundForm] = useState(false);
  const [showAllRounds, setShowAllRounds] = useState(false);
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formScore, setFormScore] = useState("");
  const [formVsPar, setFormVsPar] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formCondition, setFormCondition] = useState("Great");
  const [formRating, setFormRating] = useState(4);

  useEffect(() => {
    if (course) addRecentlyViewed(course.id);
  }, [course, addRecentlyViewed]);

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-forest-900">
        <EmptyState icon="🥏" title="Course not found" body="This course doesn't exist." />
      </div>
    );
  }

  const courseRounds = getRoundsForCourse(course.id);
  const stats = getCourseStats(courseRounds);
  const played = isPlayed(course.id);
  const favorited = isFavorite(course.id);
  const displayedRounds = showAllRounds ? courseRounds : courseRounds.slice(0, 3);
  const terrainLabel = course.terrain ?? "Unknown";
  const feeLabel = course.free === true ? "Free" : course.free === false ? "Paid" : "Not verified";
  const detailsSource = course.source ?? "Source not listed";

  const TerrainIcon =
    terrainLabel === "Wooded" ? TreePine :
    terrainLabel === "Open" ? Wind : Layers;

  const handleAddRound = () => {
    if (!formScore) return;

    const score = parseInt(formScore, 10);
    const vsPar = formVsPar ? parseInt(formVsPar, 10) : course.par !== undefined ? score - course.par : 0;

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
      <div className="px-4 pb-8 pt-12">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-full border border-forest-700/60 bg-forest-800/72 p-2 text-forest-100 backdrop-blur-sm"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            onClick={() => toggleFavorite(course.id)}
            className="rounded-full border border-forest-700/60 bg-forest-800/72 p-2 backdrop-blur-sm"
          >
            <Heart size={18} strokeWidth={2} className={favorited ? "fill-red-400 text-red-400" : "text-forest-200"} />
          </button>
        </div>

        <div className="mb-5 rounded-[34px] border border-forest-700/50 bg-[linear-gradient(180deg,rgba(18,29,21,0.98),rgba(10,17,12,1))] p-5 shadow-[0_24px_60px_rgba(2,10,6,0.34)] sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-stretch">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <DifficultyBadge label={course.difficultyLabel} score={course.difficultyScore} />
                {course.free === true ? (
                  <span className="rounded-full border border-emerald-700/60 bg-emerald-900/45 px-2.5 py-1 text-xs font-semibold text-emerald-300">Free</span>
                ) : course.free === false ? (
                  <span className="rounded-full border border-amber-700/50 bg-amber-900/45 px-2.5 py-1 text-xs font-semibold text-amber-300">Paid</span>
                ) : (
                  <span className="rounded-full border border-forest-600/50 bg-forest-700/75 px-2.5 py-1 text-xs font-semibold text-forest-300">Fee Unknown</span>
                )}
                {played && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-pine/40 bg-pine/12 px-2.5 py-1 text-xs font-semibold text-pine">
                    <CheckCircle size={11} /> Played
                  </span>
                )}
              </div>

              <h1 className="editorial-title text-4xl leading-[0.94] text-forest-50 sm:text-5xl">{course.name}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-forest-300">
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {course.city}, {course.region}</span>
                <span className="flex items-center gap-1.5"><Star size={14} className="fill-amber-400 text-amber-400" /> {course.rating} rating ({course.ratingCount})</span>
              </div>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-forest-300">
                {course.description ?? `${detailsSource}-listed course in ${course.city}, Maine.`}
              </p>
              <p className="mt-2 text-xs text-forest-500">
                Verified source: {detailsSource}
                {course.coordinatePrecision === "town" ? " · location references town center" : ""}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <HeroFact label="Layout" value={`${course.holes} holes`} />
                <HeroFact label="Length" value={course.lengthFeet !== undefined ? `${course.lengthFeet.toLocaleString()} ft` : "Unverified"} />
                <HeroFact label="Terrain" value={terrainLabel} />
                <HeroFact label="Established" value={course.established?.toString() ?? "Unknown"} />
              </div>

              <div className="mt-5">
                <p className="mb-1.5 text-xs text-forest-500">Difficulty rating</p>
                <DifficultyMeter score={course.difficultyScore} />
              </div>
            </div>

            <CourseArtwork course={course} variant="hero" />
          </div>
        </div>

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setShowRoundForm((value) => !value)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-pine py-3 text-sm font-bold text-forest-900"
          >
            <Plus size={16} /> Log a Round
          </button>
          <button
            onClick={() => togglePlayed(course.id)}
            className={clsx(
              "flex flex-1 items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition-all",
              played
                ? "border-pine/40 bg-pine/20 text-pine"
                : "border-forest-700/60 bg-forest-800 text-forest-300"
            )}
          >
            <CheckCircle size={16} />
            {played ? "Played ✓" : "Mark Played"}
          </button>
        </div>

        {showRoundForm && (
          <div className="mb-6 rounded-2xl border border-forest-700/50 bg-forest-800 p-4">
            <h3 className="mb-4 text-base font-bold text-forest-50">Log a Round</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-forest-400">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(event) => setFormDate(event.target.value)}
                  className="w-full rounded-xl border border-forest-600/60 bg-forest-700/80 px-3 py-2.5 text-sm text-forest-100 outline-none focus:border-pine/60"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-semibold text-forest-400">Total Score</label>
                  <input
                    type="number"
                    placeholder={course.par !== undefined ? `e.g. ${course.par + 4}` : "Enter total score"}
                    value={formScore}
                    onChange={(event) => setFormScore(event.target.value)}
                    className="w-full rounded-xl border border-forest-600/60 bg-forest-700/80 px-3 py-2.5 text-sm text-forest-100 outline-none focus:border-pine/60"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-semibold text-forest-400">vs Par (optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. +4"
                    value={formVsPar}
                    onChange={(event) => setFormVsPar(event.target.value)}
                    className="w-full rounded-xl border border-forest-600/60 bg-forest-700/80 px-3 py-2.5 text-sm text-forest-100 outline-none focus:border-pine/60"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-forest-400">Conditions</label>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => setFormCondition(condition)}
                      className={clsx(
                        "rounded-full border px-3 py-1.5 text-xs transition-all",
                        formCondition === condition
                          ? "border-pine bg-pine text-forest-900"
                          : "border-forest-600/50 bg-forest-700/60 text-forest-400"
                      )}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-forest-400">Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(event) => setFormNotes(event.target.value)}
                  placeholder="Best round yet, lost a disc on 7, muddy back nine…"
                  rows={2}
                  className="w-full resize-none rounded-xl border border-forest-600/60 bg-forest-700/80 px-3 py-2.5 text-sm text-forest-100 outline-none focus:border-pine/60"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-forest-400">Personal Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} onClick={() => setFormRating(value)}>
                      <Star size={22} className={value <= formRating ? "fill-amber-400 text-amber-400" : "text-forest-600"} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleAddRound}
                  disabled={!formScore}
                  className="flex-1 rounded-full bg-pine py-2.5 text-sm font-bold text-forest-900 disabled:opacity-40"
                >
                  Save Round
                </button>
                <button
                  onClick={() => setShowRoundForm(false)}
                  className="flex-1 rounded-full bg-forest-700/60 py-2.5 text-sm font-semibold text-forest-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {stats.totalRounds > 0 && (
          <div className="mb-4 rounded-2xl border border-forest-700/50 bg-forest-800 p-4">
            <h3 className="mb-3 text-base font-bold text-forest-50">Your Stats</h3>
            <div className="mb-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-forest-700/50 p-3 text-center">
                <div className="stat-number text-2xl font-extrabold text-pine">{stats.bestScore}</div>
                <div className="mt-0.5 text-xs text-forest-400">Best Score</div>
              </div>
              <div className="rounded-xl bg-forest-700/50 p-3 text-center">
                <div className="stat-number text-2xl font-extrabold text-forest-100">{stats.avgScore}</div>
                <div className="mt-0.5 text-xs text-forest-400">Avg Score</div>
              </div>
              <div className="rounded-xl bg-forest-700/50 p-3 text-center">
                <div className="stat-number text-2xl font-extrabold text-forest-100">{stats.totalRounds}</div>
                <div className="mt-0.5 text-xs text-forest-400">Rounds Played</div>
              </div>
              <div className="rounded-xl bg-forest-700/50 p-3 text-center">
                <div className="text-xs font-bold text-forest-100">{stats.lastPlayed ? formatDate(stats.lastPlayed) : "—"}</div>
                <div className="mt-0.5 text-xs text-forest-400">Last Played</div>
              </div>
            </div>
            {stats.improvement !== null && stats.improvement > 0 && (
              <div className="rounded-xl bg-emerald-900/30 px-3 py-2 text-xs font-medium text-emerald-400">
                📈 You&apos;ve improved by ~{stats.improvement.toFixed(1)} strokes recently. Keep it up!
              </div>
            )}
          </div>
        )}

        {courseRounds.length > 0 && (
          <div className="mb-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-forest-50">Round History</h3>
              {courseRounds.length > 3 && (
                <button onClick={() => setShowAllRounds((value) => !value)} className="text-xs font-medium text-pine">
                  {showAllRounds ? "Show less" : `See all ${courseRounds.length}`}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {displayedRounds.map((round) => (
                <div key={round.id} className="flex items-center justify-between gap-3 rounded-xl border border-forest-700/40 bg-forest-800 p-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-bold text-forest-100">{round.totalScore}</span>
                      <span
                        className={clsx(
                          "text-xs font-semibold",
                          round.scoreVsPar < 0 ? "text-emerald-400" :
                          round.scoreVsPar === 0 ? "text-sky-400" : "text-forest-400"
                        )}
                      >
                        {round.scoreVsPar > 0 ? `+${round.scoreVsPar}` : round.scoreVsPar} · {scoreLabel(round.scoreVsPar)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-forest-500">
                      <CalendarDays size={10} /> {formatDate(round.date)}
                      {round.conditions && <span>· {round.conditions}</span>}
                    </div>
                    {round.notes && <p className="mt-1 truncate text-xs text-forest-400">{round.notes}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star key={value} size={10} className={value <= round.personalRating ? "fill-amber-400 text-amber-400" : "text-forest-700"} />
                      ))}
                    </div>
                    <button onClick={() => deleteRound(round.id)} className="p-1.5 text-forest-600 hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 rounded-2xl border border-forest-700/50 bg-forest-800 p-4">
          <h3 className="mb-1 text-base font-bold text-forest-50">Course Details</h3>
          <StatRow label="Holes" value={course.holes} icon={<Disc size={13} />} />
          <StatRow label="Course Length" value={course.lengthFeet !== undefined ? `${course.lengthFeet.toLocaleString()} ft` : "Not verified"} icon={<Zap size={13} />} />
          <StatRow label="Par" value={course.par ?? "Not verified"} icon={<Star size={13} />} />
          <StatRow label="Terrain" value={terrainLabel} icon={<TerrainIcon size={13} />} />
          <StatRow label="Elevation Change" value={course.elevationChange !== undefined ? `${course.elevationChange} ft` : "Not verified"} icon={<Mountain size={13} />} />
          <StatRow label="Water Hazards" value={course.waterHazards !== undefined ? (course.waterHazards ? "Yes" : "No") : "Not verified"} icon={<Droplets size={13} />} />
          <StatRow label="Fee" value={feeLabel} icon={<DollarSign size={13} />} />
          <StatRow label="Established" value={course.established ?? "Not verified"} icon={<Clock size={13} />} />
        </div>

        {(course.amenities?.length ?? 0) > 0 && (
          <div className="mb-4 rounded-2xl border border-forest-700/50 bg-forest-800 p-4">
            <h3 className="mb-3 text-base font-bold text-forest-50">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {course.amenities?.map((amenity) => (
                <span key={amenity} className="rounded-full border border-forest-600/50 bg-forest-700/70 px-2.5 py-1 text-xs text-forest-200">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {(course.localTips?.length ?? 0) > 0 && (
          <div className="mb-4 rounded-2xl border border-forest-600/40 bg-gradient-to-br from-forest-700/60 to-forest-800 p-4">
            <h3 className="mb-3 text-base font-bold text-forest-50">💡 Local Tips</h3>
            <ul className="space-y-2">
              {course.localTips?.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-forest-300">
                  <span className="mt-0.5 shrink-0 text-pine">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-8 rounded-2xl border border-forest-700/50 bg-forest-800 p-4">
          <h3 className="mb-2 text-base font-bold text-forest-50">Location</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <LocationCard label="Place" value={`${course.city}, Maine`} helpText={course.region} />
            <LocationCard
              label="Precision"
              value={course.coordinatePrecision === "town" ? "Town center" : course.coordinates ? "Verified point" : "Not verified"}
              helpText={course.coordinatePrecision === "town" ? "Good for planning, not for tee-pad navigation" : "Use the course listing for arrival details"}
            />
            <LocationCard
              label="Coordinates"
              value={course.coordinates ? `${course.coordinates.lat.toFixed(4)}°, ${course.coordinates.lng.toFixed(4)}°` : "Unavailable"}
              helpText={course.coordinates ? "Decimal degrees" : "Coordinates not yet verified"}
            />
            <LocationCard
              label="Source"
              value={detailsSource}
              helpText="Displayed as researched catalog metadata"
            />
          </div>

          {course.coordinates && (
            <a
              href={`https://www.google.com/maps?q=${course.coordinates.lat},${course.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-forest-600/60 bg-forest-700/60 px-4 py-2 text-sm font-semibold text-forest-100"
            >
              <MapPin size={14} className="text-pine" />
              Open coordinates in Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
