"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ArrowRight, ChevronRight, Circle, ArrowLeft } from "lucide-react";
import { getCourseBySlug } from "@/data/courses";

export default function CourseOverviewPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const course = getCourseBySlug(resolvedParams.courseId);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="heading-lg">Not Found</h1>
          <Link href="/courses" className="body-md mt-4 block text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
            ← Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalTopics = course.chapters.reduce((a, c) => a + c.topics.length, 0);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-32 sm:px-10 sm:py-40">
      <div className="mb-8">
        <Link href="/courses" className="body-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors hover-line inline-block">
          ← All Courses
        </Link>
      </div>

      <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">Course</span>
      <h1 className="heading-xl mb-8">{course.title}</h1>
      <p className="body-lg mb-12 max-w-2xl text-[var(--muted)]">{course.longDescription}</p>

      <div className="mb-8 flex flex-wrap gap-x-8 gap-y-3">
        <span className="body-sm text-[var(--muted)]">{course.duration}</span>
        <span className="body-sm text-[var(--muted)]">{course.students.toLocaleString()} students</span>
        <span className="body-sm text-[var(--muted)]">{course.chapters.length} units · {totalTopics} topics</span>
        <span className="body-sm text-[var(--muted)]">★ {course.rating}</span>
      </div>

      <div className="mb-16 flex items-center gap-4">
        <Link
          href={`/courses/${course.slug}/${course.chapters[0].topics[0].slug}`}
          className="group flex items-center gap-3 rounded-full border border-[var(--fg)] bg-[var(--fg)] px-7 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
        >
          Start Learning
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
        <span className="heading-md font-light">₹{course.price}</span>
      </div>

      <div>
        <h2 className="heading-sm mb-8 text-[var(--muted)]">Curriculum</h2>
        <div className="space-y-0">
          {course.chapters.map((chapter) => (
            <div key={chapter.id} className="border-t border-[var(--border)]">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="group flex w-full items-center gap-6 py-6 text-left transition-colors hover:bg-[var(--surface)] -mx-6 px-6 sm:-mx-10 sm:px-10"
              >
                <span className="text-[11px] font-medium text-[var(--muted)]">{chapter.icon}</span>
                <div className="flex-1">
                  <h3 className="body-md transition-colors group-hover:text-[var(--fg)]">{chapter.title}</h3>
                  <p className="body-sm mt-1 text-[var(--muted)]">{chapter.description}</p>
                </div>
                <ChevronRight className={`h-4 w-4 text-[var(--muted)] transition-transform duration-300 ${expandedChapters.has(chapter.id) ? "rotate-90" : ""}`} />
              </button>
              {expandedChapters.has(chapter.id) && (
                <div className="pb-4 pl-6 sm:pl-10">
                  {chapter.topics.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/courses/${course.slug}/${topic.slug}`}
                      className="group flex items-center gap-4 py-3 pl-6 transition-colors hover:text-[var(--fg)] text-[var(--muted)]"
                    >
                      <Circle className="h-2 w-2 shrink-0" />
                      <span className="body-sm">{topic.title}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] opacity-50">{topic.difficulty}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
