"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseDetail } from "@/lib/courses";

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;

export default function CourseList({ courses }: { courses: CourseDetail[] }) {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All");

  const filtered =
    level === "All" ? courses : courses.filter((c) => c.level === level);

  return (
    <>
      <div className="mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-4">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors ${
              level === l
                ? "border border-[var(--fg)] text-[var(--fg)]"
                : "border border-transparent text-[var(--muted)] hover:text-[var(--fg)]"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-0">
        {filtered.map((course, i) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="group flex flex-col gap-6 border-t border-[var(--border)] py-10 transition-colors hover:bg-[var(--surface)] -mx-6 px-6 sm:-mx-10 sm:px-10 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="body-xs text-[var(--muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
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
              <h2 className="heading-md transition-transform duration-300 group-hover:translate-x-2">
                {course.title}
              </h2>
              <p className="body-md mt-2 max-w-lg text-[var(--muted)]">
                {course.description}
              </p>
            </div>

            <div className="flex items-center gap-8 sm:text-right">
              <div className="space-y-1">
                <div className="body-sm text-[var(--muted)]">
                  {course.duration}
                </div>
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
        {filtered.length === 0 && (
          <p className="body-md py-10 text-[var(--muted)]">
            No courses at this level yet — more are on the way.
          </p>
        )}
      </div>
    </>
  );
}
