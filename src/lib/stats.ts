import { Round, CourseStats } from "@/types";

export function getCourseStats(rounds: Round[]): CourseStats {
  if (rounds.length === 0) {
    return { bestScore: null, avgScore: null, totalRounds: 0, lastPlayed: null, improvement: null };
  }
  const sorted = [...rounds].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const scores = rounds.map((r) => r.totalScore);
  const best = Math.min(...scores);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const last = sorted[0].date;

  let improvement: number | null = null;
  if (sorted.length >= 2) {
    const firstFive = sorted.slice(-5).map((r) => r.totalScore);
    const lastFive = sorted.slice(0, 5).map((r) => r.totalScore);
    const avgFirst = firstFive.reduce((a, b) => a + b, 0) / firstFive.length;
    const avgLast = lastFive.reduce((a, b) => a + b, 0) / lastFive.length;
    improvement = avgFirst - avgLast; // positive = improving
  }

  return {
    bestScore: best,
    avgScore: Math.round(avg * 10) / 10,
    totalRounds: rounds.length,
    lastPlayed: last,
    improvement,
  };
}

export function getGlobalStats(rounds: Round[], playedIds: string[]) {
  const totalRounds = rounds.length;
  const totalCourses = playedIds.length;
  const courseFrequency: Record<string, number> = {};
  rounds.forEach((r) => {
    courseFrequency[r.courseId] = (courseFrequency[r.courseId] || 0) + 1;
  });
  const mostPlayed = Object.entries(courseFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);

  const bestScoreByCourse: Record<string, number> = {};
  rounds.forEach((r) => {
    if (
      bestScoreByCourse[r.courseId] === undefined ||
      r.totalScore < bestScoreByCourse[r.courseId]
    ) {
      bestScoreByCourse[r.courseId] = r.totalScore;
    }
  });

  return { totalRounds, totalCourses, mostPlayed, bestScoreByCourse };
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function scoreLabel(scoreVsPar: number): string {
  if (scoreVsPar < -5) return "Incredible";
  if (scoreVsPar < -2) return "Great round";
  if (scoreVsPar < 0) return "Under par";
  if (scoreVsPar === 0) return "Even par";
  if (scoreVsPar <= 3) return "Solid";
  if (scoreVsPar <= 8) return "Decent";
  return "Keep practicing!";
}
