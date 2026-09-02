"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ArrowRight, BookOpen, Clock, Users, Star, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { getCourseBySlug } from "@/data/courses";
import CourseSidebar from "@/components/course/CourseSidebar";

export default function CourseOverviewPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const course = getCourseBySlug(resolvedParams.courseId);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Course Not Found</h1>
          <Link href="/courses" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
            Browse Courses
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-2 text-xs text-muted">
        <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{course.title}</span>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 mb-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-bold text-white">FLAGSHIP</span>
              <span className="flex items-center gap-1 text-xs text-warning"><Star className="h-3.5 w-3.5 fill-current" />{course.rating}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{course.title}</h1>
            <p className="mt-4 text-muted leading-relaxed">{course.longDescription}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" />{course.duration}</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-accent" />{course.students.toLocaleString()} students</span>
              <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-success" />{course.chapters.length} units &middot; {totalTopics} topics</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs font-medium text-muted">{tag}</span>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href={`/courses/${course.slug}/${course.chapters[0].topics[0].slug}`}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:scale-[1.02]"
              >
                Start Learning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <span className="text-2xl font-bold text-gradient">₹{course.price}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Curriculum</h3>
            {course.chapters.map((chapter) => (
              <div key={chapter.id} className="rounded-xl border border-border bg-surface-elevated overflow-hidden">
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-card-hover"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{chapter.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-foreground truncate">{chapter.title}</span>
                    <span className="block text-[10px] text-muted">{chapter.topics.length} topics &middot; {chapter.description}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 text-muted transition-transform ${expandedChapters.has(chapter.id) ? "rotate-90" : ""}`} />
                </button>
                {expandedChapters.has(chapter.id) && (
                  <div className="border-t border-border px-4 pb-3">
                    {chapter.topics.map((topic) => (
                      <Link
                        key={topic.id}
                        href={`/courses/${course.slug}/${topic.slug}`}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-all hover:bg-card-hover hover:text-foreground"
                      >
                        <Circle className="h-3 w-3 shrink-0" />
                        <span className="flex-1 truncate">{topic.title}</span>
                        <span className="text-[10px] text-muted">{topic.difficulty}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
