export type DifficultyLabel = "Beginner" | "Intermediate" | "Advanced" | "Pro";
export type TerrainType = "Wooded" | "Open" | "Mixed" | "Unknown";
export type Region =
  | "Southern Maine"
  | "Greater Portland"
  | "Mid-Coast"
  | "Central Maine"
  | "Western Maine"
  | "Down East"
  | "Aroostook"
  | "Western Mountains";

export interface Course {
  id: string;
  name: string;
  city: string;
  region: Region;
  difficultyScore: number; // 1–100
  difficultyLabel: DifficultyLabel;
  rating: number; // 1–5
  ratingCount: number;
  lengthFeet?: number;
  holes: number;
  terrain?: TerrainType;
  free?: boolean;
  description?: string;
  amenities?: string[];
  imageUrl?: string;
  coordinates?: { lat: number; lng: number };
  featured?: boolean;
  elevationChange?: number; // feet
  waterHazards?: boolean;
  obHazards?: boolean;
  par?: number;
  localTips?: string[];
  established?: number; // year
  source?: string;
  coordinatePrecision?: "exact" | "town";
}

export interface Round {
  id: string;
  courseId: string;
  date: string; // ISO string
  totalScore: number;
  scoreVsPar: number;
  notes: string;
  conditions: string; // "great" | "windy" | "muddy" | "wet" | "dry"
  personalRating: number; // 1–5
}

export interface UserData {
  favorites: string[]; // course ids
  played: string[]; // course ids
  rounds: Round[];
  recentlyViewed: string[]; // course ids, max 10
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  total?: number;
}

export interface CourseStats {
  bestScore: number | null;
  avgScore: number | null;
  totalRounds: number;
  lastPlayed: string | null;
  improvement: number | null; // positive = improving
}
