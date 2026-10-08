import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllCourses } from "@/lib/courses";

export default async function CourseHighlight() {
  const courses = await getAllCourses();

  if (courses.length === 0) return null;

  return (
    <section className="py-32 sm:py-40">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">
          Courses
        </span>
        <h2 className="heading-lg mb-16">
          Start with the <span className="italic text-[var(--muted)]">curriculum</span>
        </h2>

        <div className="space-y-0">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group flex flex-col gap-6 border-t border-[var(--border)] py-10 transition-colors hover:bg-[var(--surface)] -mx-6 px-6 sm:-mx-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium tracking-[0.15em] text-[var(--fg)]">
                    {course.code}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                    {course.level}
                  </span>
                  <span className="text-[10px] text-[var(--muted)]">
                    ★ {course.rating}
                  </span>
                </div>
                <h3 className="heading-md transition-transform duration-300 group-hover:translate-x-2">
                  {course.title}
                </h3>
                <p className="body-md mt-2 max-w-2xl text-[var(--muted)]">
                  {course.description}
                </p>
              </div>

              <div className="flex items-center gap-8 lg:text-right">
                <div className="space-y-1">
                  <div className="body-sm text-[var(--muted)]">{course.duration}</div>
                  <div className="body-sm text-[var(--muted)]">
                    {course.moduleCount} modules · {course.topicCount} topics
                  </div>
                  <div className="body-sm text-[var(--muted)]">
                    {course.students.toLocaleString()} students
                  </div>
                </div>
                <div>
                  <div className="heading-md mb-2">
                    {course.price > 0 ? `₹${course.price}` : "Free"}
                  </div>
                  <ArrowRight className="h-5 w-5 text-[var(--muted)] transition-all group-hover:translate-x-2 group-hover:text-[var(--fg)]" />
                </div>
              </div>
            </Link>
          ))}
          <div className="border-t border-[var(--border)]" />
        </div>
      </div>
    </section>
  );
}
