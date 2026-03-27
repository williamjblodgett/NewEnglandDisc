import { Course, DifficultyLabel, Region } from "@/types";

const PLACEHOLDER_IMAGE = "/course-placeholder.svg";
const PDGA_SOURCE = "PDGA Course Directory";

type SourceCourse = {
  id: string;
  name: string;
  city: string;
  region: Region;
  holes: number;
  established: number;
  rating: number;
  ratingCount: number;
  coordinates: { lat: number; lng: number };
};

function estimateDifficulty(holeCount: number, rating: number, established: number) {
  const holeBase = holeCount >= 21 ? 58 : holeCount >= 18 ? 48 : 28;
  const ratingBoost =
    rating >= 4.75 ? 18 :
    rating >= 4.5 ? 15 :
    rating >= 4 ? 10 :
    rating > 0 ? 4 : 0;
  const legacyBoost = established <= 2005 ? 6 : established <= 2012 ? 3 : 0;
  const score = Math.min(92, holeBase + ratingBoost + legacyBoost);

  const label: DifficultyLabel =
    score < 40 ? "Beginner" :
    score < 60 ? "Intermediate" :
    score < 80 ? "Advanced" : "Pro";

  return { score, label };
}

function toCourse(course: SourceCourse): Course {
  const difficulty = estimateDifficulty(course.holes, course.rating, course.established);

  return {
    ...course,
    difficultyScore: difficulty.score,
    difficultyLabel: difficulty.label,
    description: `${PDGA_SOURCE}-listed ${course.holes}-hole course in ${course.city}, Maine.`,
    amenities: [],
    imageUrl: PLACEHOLDER_IMAGE,
    featured:
      course.rating >= 4.5 ||
      course.ratingCount >= 3 ||
      course.name.includes("Pineland") ||
      course.name.includes("Sabattus") ||
      course.name.includes("Sugarloaf"),
    localTips: [],
    source: PDGA_SOURCE,
    coordinatePrecision: "town",
  };
}

const sourceCourses: SourceCourse[] = [
  {
    id: "ackers-acres-the-wicked",
    name: "Acker's Acres - The Wicked",
    city: "Bowdoinham",
    region: "Mid-Coast",
    holes: 18,
    established: 2001,
    rating: 4.5,
    ratingCount: 4,
    coordinates: { lat: 44.009897, lng: -69.8969355 },
  },
  {
    id: "ackers-acres-the-twisted",
    name: "Acker's Acres - The Twisted",
    city: "Bowdoinham",
    region: "Mid-Coast",
    holes: 18,
    established: 2003,
    rating: 4,
    ratingCount: 1,
    coordinates: { lat: 44.009897, lng: -69.8969355 },
  },
  {
    id: "beaver-brook-disc-golf-course",
    name: "Beaver Brook Disc Golf Course",
    city: "North Monmouth",
    region: "Central Maine",
    holes: 18,
    established: 1977,
    rating: 3,
    ratingCount: 1,
    coordinates: { lat: 44.277848, lng: -70.0308851 },
  },
  {
    id: "burnsboro-disc-golf-course",
    name: "Burnsboro Disc Golf Course",
    city: "Vassalboro",
    region: "Central Maine",
    holes: 18,
    established: 1992,
    rating: 4,
    ratingCount: 2,
    coordinates: { lat: 44.459521, lng: -69.6778992 },
  },
  {
    id: "cr-farm-disc-golf",
    name: "CR Farm Disc Golf",
    city: "West Gardiner",
    region: "Central Maine",
    holes: 21,
    established: 2008,
    rating: 4,
    ratingCount: 3,
    coordinates: { lat: 44.227535, lng: -69.8768446 },
  },
  {
    id: "quarry-run-augusta",
    name: "Quarry Run at Augusta Disc Golf",
    city: "Augusta",
    region: "Central Maine",
    holes: 18,
    established: 2004,
    rating: 4.5,
    ratingCount: 4,
    coordinates: { lat: 44.3148027, lng: -69.7743945 },
  },
  {
    id: "dr-disc-golf-long-18",
    name: "DR Disc Golf - Long 18",
    city: "Orrington",
    region: "Down East",
    holes: 18,
    established: 2009,
    rating: 5,
    ratingCount: 1,
    coordinates: { lat: 44.731189, lng: -68.8264258 },
  },
  {
    id: "dragan-field-red-dragon",
    name: "Dragan Field - Red Dragon",
    city: "Auburn",
    region: "Western Maine",
    holes: 18,
    established: 2000,
    rating: 4,
    ratingCount: 3,
    coordinates: { lat: 44.0965374, lng: -70.2249487 },
  },
  {
    id: "dragan-field-talon",
    name: "Dragan Field - Talon",
    city: "Auburn",
    region: "Western Maine",
    holes: 18,
    established: 2020,
    rating: 0,
    ratingCount: 0,
    coordinates: { lat: 44.0965374, lng: -70.2249487 },
  },
  {
    id: "sabattus-hawk",
    name: "Sabattus Disc Golf - Hawk",
    city: "Sabattus",
    region: "Western Maine",
    holes: 18,
    established: 2005,
    rating: 4.75,
    ratingCount: 4,
    coordinates: { lat: 44.120018, lng: -70.1076532 },
  },
  {
    id: "sabattus-eagle",
    name: "Sabattus Disc Golf - Eagle",
    city: "Sabattus",
    region: "Western Maine",
    holes: 18,
    established: 2005,
    rating: 4,
    ratingCount: 2,
    coordinates: { lat: 44.120018, lng: -70.1076532 },
  },
  {
    id: "woodland-valley-black-bear",
    name: "Woodland Valley Disc Golf Course - Black Bear",
    city: "Limerick",
    region: "Southern Maine",
    holes: 18,
    established: 2005,
    rating: 4.75,
    ratingCount: 4,
    coordinates: { lat: 43.688469, lng: -70.7948584 },
  },
  {
    id: "woodland-valley-grizzly",
    name: "Woodland Valley Disc Golf - The Grizzly",
    city: "Limerick",
    region: "Southern Maine",
    holes: 18,
    established: 2007,
    rating: 4.666665,
    ratingCount: 3,
    coordinates: { lat: 43.688469, lng: -70.7948584 },
  },
  {
    id: "pleasant-hill-disc-golf",
    name: "Pleasant Hill Disc Golf",
    city: "Scarborough",
    region: "Greater Portland",
    holes: 18,
    established: 2007,
    rating: 4,
    ratingCount: 2,
    coordinates: { lat: 43.59014, lng: -70.3344722 },
  },
  {
    id: "pineland-farms-patriot",
    name: "Pineland Farms Disc Golf - Patriot",
    city: "New Gloucester",
    region: "Greater Portland",
    holes: 18,
    established: 2015,
    rating: 0,
    ratingCount: 0,
    coordinates: { lat: 43.963241, lng: -70.2814344 },
  },
  {
    id: "pineland-farms-minuteman",
    name: "Pineland Farms - Minuteman",
    city: "New Gloucester",
    region: "Greater Portland",
    holes: 18,
    established: 2017,
    rating: 0,
    ratingCount: 0,
    coordinates: { lat: 43.963241, lng: -70.2814344 },
  },
  {
    id: "bittersweet-ridge-south",
    name: "Bittersweet Ridge Disc Golf - South",
    city: "North Yarmouth",
    region: "Greater Portland",
    holes: 18,
    established: 2012,
    rating: 0,
    ratingCount: 0,
    coordinates: { lat: 43.828939, lng: -70.2487493 },
  },
  {
    id: "bittersweet-ridge-north",
    name: "Bittersweet Ridge Disc Golf - North",
    city: "North Yarmouth",
    region: "Greater Portland",
    holes: 18,
    established: 2015,
    rating: 0,
    ratingCount: 0,
    coordinates: { lat: 43.828939, lng: -70.2487493 },
  },
  {
    id: "twin-brook-recreation-facility",
    name: "Twin Brook Recreation Facility",
    city: "Cumberland",
    region: "Greater Portland",
    holes: 9,
    established: 2013,
    rating: 0,
    ratingCount: 0,
    coordinates: { lat: 43.796658, lng: -70.2581692 },
  },
  {
    id: "boom-field",
    name: "Boom Field",
    city: "Saco",
    region: "Southern Maine",
    holes: 18,
    established: 2005,
    rating: 3,
    ratingCount: 1,
    coordinates: { lat: 43.500739, lng: -70.4429855 },
  },
  {
    id: "firefly-disc-golf",
    name: "Firefly Disc Golf",
    city: "Lyman",
    region: "Southern Maine",
    holes: 18,
    established: 2020,
    rating: 4,
    ratingCount: 1,
    coordinates: { lat: 43.49602, lng: -70.5981446 },
  },
  {
    id: "ledgewood-pass",
    name: "Ledgewood Pass",
    city: "Arundel",
    region: "Southern Maine",
    holes: 18,
    established: 2024,
    rating: 4,
    ratingCount: 1,
    coordinates: { lat: 43.382585, lng: -70.4778292 },
  },
  {
    id: "hammond-farm-disc-golf-course",
    name: "Hammond Farm Disc Golf Course",
    city: "North Berwick",
    region: "Southern Maine",
    holes: 18,
    established: 2019,
    rating: 0,
    ratingCount: 0,
    coordinates: { lat: 43.303839, lng: -70.7330239 },
  },
  {
    id: "cider-hill-farm",
    name: "Cider Hill Farm",
    city: "Waldoboro",
    region: "Mid-Coast",
    holes: 18,
    established: 2016,
    rating: 3,
    ratingCount: 1,
    coordinates: { lat: 44.095361, lng: -69.3757748 },
  },
  {
    id: "quaker-hill-disc-golf",
    name: "Quaker Hill Disc Golf",
    city: "Fairfield",
    region: "Central Maine",
    holes: 21,
    established: 2003,
    rating: 4,
    ratingCount: 2,
    coordinates: { lat: 44.588511, lng: -69.599075 },
  },
  {
    id: "troll-valley-disc-golf",
    name: "Troll Valley Disc Golf",
    city: "Farmington",
    region: "Western Maine",
    holes: 18,
    established: 2007,
    rating: 5,
    ratingCount: 1,
    coordinates: { lat: 44.67062, lng: -70.1514536 },
  },
  {
    id: "fort-kent-outdoor-center-disc-golf-course",
    name: "Fort Kent Outdoor Center Disc Golf Course",
    city: "Fort Kent",
    region: "Aroostook",
    holes: 18,
    established: 2019,
    rating: 0,
    ratingCount: 0,
    coordinates: { lat: 47.255904, lng: -68.5904597 },
  },
  {
    id: "talon-trails",
    name: "Talon Trails",
    city: "Presque Isle",
    region: "Aroostook",
    holes: 18,
    established: 2009,
    rating: 4,
    ratingCount: 1,
    coordinates: { lat: 46.6812216, lng: -68.0154578 },
  },
  {
    id: "sugarloaf-disc-golf-course",
    name: "Sugarloaf Disc Golf Course",
    city: "Carrabassett Valley",
    region: "Western Mountains",
    holes: 18,
    established: 2017,
    rating: 0,
    ratingCount: 0,
    coordinates: { lat: 45.078232, lng: -70.2114804 },
  },
  {
    id: "hapana-disc-golf",
    name: "Hapana Disc Golf",
    city: "Trenton",
    region: "Down East",
    holes: 18,
    established: 1994,
    rating: 0,
    ratingCount: 0,
    coordinates: { lat: 44.43917, lng: -68.370667 },
  },
];

export const courses: Course[] = sourceCourses.map(toCourse);

export const getCourseById = (id: string): Course | undefined =>
  courses.find((course) => course.id === id);

export const getFeaturedCourses = (n = 8): Course[] =>
  courses.filter((course) => course.featured).slice(0, n);

export const getTopRatedCourses = (n = 5): Course[] =>
  [...courses].sort((left, right) => right.rating - left.rating).slice(0, n);

export const getHardestCourses = (n = 5): Course[] =>
  [...courses]
    .sort((left, right) => right.difficultyScore - left.difficultyScore)
    .slice(0, n);

export const getBeginnerCourses = (n = 5): Course[] =>
  courses.filter((course) => course.difficultyLabel === "Beginner").slice(0, n);

export const getCourseCount = (): number => courses.length;