import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllCourses } from "@/data/courses";

export const metadata = { title: "Learn — Kernal" };

export default function CoursesPage() {
  const courses = getAllCourses();

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-32 sm:px-10 sm:py-40">
      <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">Courses</span>
      <h1 className="heading-xl mb-6">Learn</h1>
      <p className="body-lg mb-20 max-w-lg text-[var(--muted)]">
        Structured, hands-on courses designed to take you from fundamentals to mastery.
      </p>

      <div className="space-y-0">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="group flex flex-col gap-6 border-t border-[var(--border)] py-10 transition-colors hover:bg-[var(--surface)] -mx-6 px-6 sm:-mx-10 sm:px-10 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="body-xs text-[var(--muted)]">01</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">DSA</span>
                <span className="text-[10px] text-[var(--muted)]">★ {course.rating}</span>
              </div>
              <h2 className="heading-md group-hover:translate-x-2 transition-transform duration-300">{course.title}</h2>
              <p className="body-md mt-2 max-w-lg text-[var(--muted)]">{course.description}</p>
            </div>

            <div className="flex items-center gap-8 sm:text-right">
              <div className="space-y-1">
                <div className="body-sm text-[var(--muted)]">{course.duration}</div>
                <div className="body-sm text-[var(--muted)]">{course.chapters.reduce((a, c) => a + c.topics.length, 0)} topics</div>
                <div className="body-sm text-[var(--muted)]">{course.students.toLocaleString()} students</div>
              </div>
              <div>
                <div className="heading-md mb-2">₹{course.price}</div>
                <ArrowRight className="h-5 w-5 text-[var(--muted)] transition-all group-hover:translate-x-2 group-hover:text-[var(--fg)]" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
