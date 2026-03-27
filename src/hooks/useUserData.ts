"use client";
import { useLocalStorage } from "./useLocalStorage";
import { Round } from "@/types";
import { useCallback } from "react";

const FAVORITES_KEY = "mdg_favorites";
const PLAYED_KEY = "mdg_played";
const ROUNDS_KEY = "mdg_rounds";
const RECENT_KEY = "mdg_recent";

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(FAVORITES_KEY, []);

  const toggleFavorite = useCallback(
    (courseId: string) => {
      setFavorites((prev) =>
        prev.includes(courseId)
          ? prev.filter((id) => id !== courseId)
          : [...prev, courseId]
      );
    },
    [setFavorites]
  );

  const isFavorite = (courseId: string) => favorites.includes(courseId);
  return { favorites, toggleFavorite, isFavorite };
}

export function usePlayedCourses() {
  const [played, setPlayed] = useLocalStorage<string[]>(PLAYED_KEY, []);

  const togglePlayed = useCallback(
    (courseId: string) => {
      setPlayed((prev) =>
        prev.includes(courseId)
          ? prev.filter((id) => id !== courseId)
          : [...prev, courseId]
      );
    },
    [setPlayed]
  );

  const isPlayed = (courseId: string) => played.includes(courseId);
  return { played, togglePlayed, isPlayed };
}

export function useRounds() {
  const [rounds, setRounds] = useLocalStorage<Round[]>(ROUNDS_KEY, []);

  const addRound = useCallback(
    (round: Omit<Round, "id">) => {
      const newRound: Round = {
        ...round,
        id: `round_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      };
      setRounds((prev) => [newRound, ...prev]);
      return newRound;
    },
    [setRounds]
  );

  const deleteRound = useCallback(
    (roundId: string) => {
      setRounds((prev) => prev.filter((r) => r.id !== roundId));
    },
    [setRounds]
  );

  const getRoundsForCourse = (courseId: string) =>
    rounds.filter((r) => r.courseId === courseId);

  return { rounds, addRound, deleteRound, getRoundsForCourse };
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useLocalStorage<string[]>(RECENT_KEY, []);

  const addRecentlyViewed = useCallback(
    (courseId: string) => {
      setRecent((prev) => {
        const filtered = prev.filter((id) => id !== courseId);
        return [courseId, ...filtered].slice(0, 10);
      });
    },
    [setRecent]
  );

  return { recent, addRecentlyViewed };
}
