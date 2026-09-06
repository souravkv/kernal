"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight, Play, Circle, X, Menu } from "lucide-react";
import { Course } from "@/data/courses";

interface CourseSidebarProps {
  course: Course;
  currentTopicSlug?: string;
}

export default function CourseSidebar({ course, currentTopicSlug }: CourseSidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(course.chapters.map((c) => c.id))
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sidebar = (
    <nav className="space-y-0">
      {course.chapters.map((chapter) => {
        const isExpanded = expandedChapters.has(chapter.id);
        return (
          <div key={chapter.id} className="border-b border-[var(--border)]">
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-[var(--surface)] -mx-6 px-6 sm:mx-0 sm:px-0"
            >
              <span className="text-[10px] font-medium text-[var(--muted)]">{chapter.icon}</span>
              <span className="flex-1 min-w-0">
                <span className="block body-sm truncate text-[var(--fg)]">{chapter.title}</span>
                <span className="block text-[10px] text-[var(--muted)] mt-0.5">{chapter.topics.length} topics</span>
              </span>
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
              )}
            </button>

            {isExpanded && (
              <div className="pb-2 pl-4">
                {chapter.topics.map((topic) => {
                  const isActive = topic.slug === currentTopicSlug;
                  return (
                    <Link
                      key={topic.id}
                      href={`/courses/${course.slug}/${topic.slug}`}
                      className={`flex items-center gap-3 py-2 text-[13px] font-light transition-all ${
                        isActive
                          ? "text-[var(--fg)] font-normal"
                          : "text-[var(--muted)] hover:text-[var(--fg)]"
                      }`}
                    >
                      {isActive ? (
                        <Play className="h-2.5 w-2.5 shrink-0" />
                      ) : (
                        <Circle className="h-2 w-2 shrink-0" />
                      )}
                      <span className="truncate">{topic.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center border border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto border-r border-[var(--border)] bg-[var(--bg)] p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="body-xs text-[var(--muted)]">Course Content</span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 pb-8">
          {sidebar}
        </div>
      </div>
    </>
  );
}
