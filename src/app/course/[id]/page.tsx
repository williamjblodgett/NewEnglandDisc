import { courses } from "@/data/courses";
import CourseDetailClient from "./CourseDetailClient";

export function generateStaticParams() {
  return courses.map((course) => ({ id: course.id }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CourseDetailClient id={id} />;
}
