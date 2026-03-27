import { Badge, Round } from "@/types";

export function computeBadges(
  playedIds: string[],
  rounds: Round[],
  hardestIds: string[],
  totalListedCourses = 30
): Badge[] {
  const played = playedIds.length;
  const totalRounds = rounds.length;
  const hardestPlayed = hardestIds.filter((id) => playedIds.includes(id)).length;

  const hasBrokenPersonalBest = (() => {
    const byCourse: Record<string, number[]> = {};
    [...rounds]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((r) => {
        if (!byCourse[r.courseId]) byCourse[r.courseId] = [];
        const prev = byCourse[r.courseId];
        byCourse[r.courseId].push(r.totalScore);
        return prev;
      });
    return Object.values(byCourse).some((scores) => {
      for (let i = 1; i < scores.length; i++) {
        if (scores[i] < scores[i - 1]) return true;
      }
      return false;
    });
  })();

  return [
    {
      id: "first_round",
      name: "First Disc",
      description: "Log your first round",
      icon: "🥏",
      earned: totalRounds >= 1,
    },
    {
      id: "explorer_5",
      name: "Maine Explorer",
      description: "Play 5 different courses",
      icon: "🗺️",
      earned: played >= 5,
      progress: Math.min(played, 5),
      total: 5,
    },
    {
      id: "explorer_10",
      name: "Course Collector",
      description: "Play 10 different courses",
      icon: "📍",
      earned: played >= 10,
      progress: Math.min(played, 10),
      total: 10,
    },
    {
      id: "explorer_20",
      name: "Maine Wanderer",
      description: "Play 20 different courses",
      icon: "🌲",
      earned: played >= 20,
      progress: Math.min(played, 20),
      total: 20,
    },
    {
      id: "all_courses",
      name: "Maine Passport Complete",
      description: "Play all listed Maine courses",
      icon: "🏆",
      earned: played >= totalListedCourses,
      progress: Math.min(played, totalListedCourses),
      total: totalListedCourses,
    },
    {
      id: "hardest_5",
      name: "Iron Arm",
      description: "Play the top 5 hardest courses",
      icon: "💪",
      earned: hardestPlayed >= 5,
      progress: Math.min(hardestPlayed, 5),
      total: 5,
    },
    {
      id: "hardest_10",
      name: "Pain Seeker",
      description: "Play the top 10 hardest courses",
      icon: "🔥",
      earned: hardestPlayed >= 10,
      progress: Math.min(hardestPlayed, 10),
      total: 10,
    },
    {
      id: "personal_best",
      name: "Always Improving",
      description: "Break your personal best at any course",
      icon: "⬇️",
      earned: hasBrokenPersonalBest,
    },
    {
      id: "round_10",
      name: "Dedicated",
      description: "Log 10 total rounds",
      icon: "🎯",
      earned: totalRounds >= 10,
      progress: Math.min(totalRounds, 10),
      total: 10,
    },
    {
      id: "round_50",
      name: "Regular",
      description: "Log 50 total rounds",
      icon: "⭐",
      earned: totalRounds >= 50,
      progress: Math.min(totalRounds, 50),
      total: 50,
    },
  ];
}

export const MAINE_REGIONS = [
  "Southern Maine",
  "Greater Portland",
  "Mid-Coast",
  "Central Maine",
  "Western Maine",
  "Down East",
  "Aroostook",
  "Western Mountains",
] as const;
