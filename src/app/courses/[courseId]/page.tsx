import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { getCourseBySlug } from "@/lib/courses";
import { getUserProgress } from "@/lib/progress";
import { hasCourseAccess } from "@/lib/access";
import { auth } from "@/auth";
import ModuleAccordion from "@/components/course/ModuleAccordion";
import BuyButton from "@/components/course/BuyButton";

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

  const session = await auth();
  const owned = await hasCourseAccess(session?.user?.id ?? null, course.id);
  const progress = session?.user?.id ? await getUserProgress(session.user.id) : null;
  const stat = progress?.courseStats[course.id];

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

      <div className="mb-16 flex flex-wrap items-center gap-4">
        {owned && firstModule ? (
          <Link
            href={`/courses/${course.slug}/${firstModule.slug}`}
            className="group flex items-center gap-3 rounded-full border border-[var(--fg)] bg-[var(--fg)] px-7 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
          >
            Begin Course
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : null}
        <BuyButton
          course={{
            id: course.id,
            slug: course.slug,
            code: course.code,
            title: course.title,
            price: course.price,
          }}
          owned={owned}
        />
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 className="heading-sm uppercase tracking-[0.2em] text-[var(--muted)]">
          Syllabus
        </h2>
        {stat && stat.totalTopics > 0 && (
          <div className="min-w-[240px]">
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="body-sm text-[var(--muted)]">
                {stat.doneTopics}/{stat.totalTopics} topics · {stat.quizzesPassed}/
                {stat.quizzesTotal} quizzes
              </span>
              <span className="body-sm text-[var(--fg)]">{stat.percent}%</span>
            </div>
            <div className="h-[3px] w-full bg-[var(--border)]">
              <div
                className="h-full bg-[var(--fg)] transition-all duration-700"
                style={{ width: `${stat.percent}%` }}
              />
            </div>
          </div>
        )}
        {stat && stat.doneTopics === stat.totalTopics && stat.totalTopics > 0 && (
          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[var(--fg)]">
            <Check className="h-3.5 w-3.5" />
            All topics complete
          </span>
        )}
      </div>
      <ModuleAccordion course={course} progress={progress} />
    </div>
  );
}
