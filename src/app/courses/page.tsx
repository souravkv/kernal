import { getAllCourses } from "@/lib/courses";
import CourseList from "@/components/course/CourseList";

export const metadata = { title: "Courses — Kernal" };

export const revalidate = 30;

export default async function CoursesPage() {
  const courses = await getAllCourses();

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 sm:py-24">
      <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">
        Courses
      </span>
      <h1 className="heading-xl mb-6">Learn</h1>
      <p className="body-lg mb-14 max-w-lg text-[var(--muted)]">
        Structured, hands-on courses that take you from fundamentals to
        mastery — theory, quizzes and coding problems in one place.
      </p>

      <CourseList courses={courses} />
    </div>
  );
}
