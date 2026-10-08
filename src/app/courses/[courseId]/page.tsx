import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getCourseBySlug } from "@/lib/courses";
import ModuleAccordion from "@/components/course/ModuleAccordion";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourseBySlug(courseId);
  return { title: course ? `${course.code} — ${course.title} — Kernal` : "Course — Kernal" };
}

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourseBySlug(courseId);
  if (!course) notFound();

  const firstModule = course.modules[0];

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 sm:py-24">
      <div className="mb-8">
        <Link
          href="/courses"
          className="body-sm inline-block text-[var(--muted)] transition-colors hover:text-[var(--fg)] hover-line"
        >
          ← All Courses
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="border border-[var(--fg)] px-2.5 py-1 text-[11px] font-medium tracking-[0.2em]">
          {course.code}
        </span>
        <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--muted)]">
          {course.level}
        </span>
      </div>

      <h1 className="heading-xl mb-8">{course.title}</h1>
      <p className="body-lg mb-12 max-w-2xl text-[var(--muted)]">
        {course.longDescription}
      </p>

      <div className="mb-8 flex flex-wrap gap-x-8 gap-y-3">
        <span className="body-sm text-[var(--muted)]">{course.duration}</span>
        <span className="body-sm text-[var(--muted)]">
          {course.students.toLocaleString()} students
        </span>
        <span className="body-sm text-[var(--muted)]">
          {course.moduleCount} modules · {course.topicCount} topics
        </span>
        <span className="body-sm text-[var(--muted)]">★ {course.rating}</span>
        <span className="body-sm text-[var(--muted)]">{course.instructor}</span>
      </div>

      <div className="mb-16 flex items-center gap-4">
        {firstModule ? (
          <Link
            href={`/courses/${course.slug}/${firstModule.slug}`}
            className="group flex items-center gap-3 rounded-full border border-[var(--fg)] bg-[var(--fg)] px-7 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
          >
            Begin Course
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : null}
        <span className="heading-md font-light">
          {course.price > 0 ? `₹${course.price}` : "Free"}
        </span>
      </div>

      <h2 className="heading-sm mb-6 uppercase tracking-[0.2em] text-[var(--muted)]">
        Syllabus
      </h2>
      <ModuleAccordion course={course} />
    </div>
  );
}
