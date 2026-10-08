"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Play, Circle, X, Menu, ClipboardCheck } from "lucide-react";
import { CourseDetail } from "@/lib/courses";

interface CourseSidebarProps {
  course: CourseDetail;
  currentModuleSlug?: string;
  currentTopicSlug?: string;
}

export default function CourseSidebar({
  course,
  currentModuleSlug,
  currentTopicSlug,
}: CourseSidebarProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(currentModuleSlug ? [currentModuleSlug] : [course.modules[0]?.slug])
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const sidebar = (
    <nav className="space-y-0">
      <Link
        href={`/courses/${course.slug}`}
        className="mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-4 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
      >
        ← {course.code} · {course.level}
      </Link>
      {course.modules.map((mod) => {
        const isOpen = expanded.has(mod.slug);
        const isCurrentModule = mod.slug === currentModuleSlug;
        return (
          <div key={mod.id} className="border-b border-[var(--border)]">
            <button
              onClick={() => toggle(mod.slug)}
              className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-[var(--surface)] -mx-6 px-6 sm:mx-0 sm:px-0"
            >
              <span className="text-[10px] font-medium text-[var(--muted)]">
                {mod.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block body-sm truncate ${
                    isCurrentModule ? "text-[var(--fg)]" : "text-[var(--fg)]"
                  }`}
                >
                  {mod.title}
                </span>
                <span className="mt-0.5 block text-[10px] text-[var(--muted)]">
                  {mod.topicCount} topics
                  {mod.hasQuiz ? " · quiz" : ""}
                </span>
              </span>
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
              )}
            </button>

            {isOpen && (
              <div className="pb-2 pl-4">
                <Link
                  href={`/courses/${course.slug}/${mod.slug}`}
                  className="flex items-center gap-3 py-2 text-[13px] font-light text-[var(--muted)] transition-all hover:text-[var(--fg)]"
                >
                  <Circle className="h-2 w-2 shrink-0" />
                  <span className="truncate">Module overview</span>
                </Link>
                {mod.topics.map((topic) => {
                  const isActive =
                    topic.slug === currentTopicSlug && isCurrentModule;
                  return (
                    <Link
                      key={topic.id}
                      href={`/courses/${course.slug}/${mod.slug}/${topic.slug}`}
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
                {mod.hasQuiz && (
                  <Link
                    href={`/courses/${course.slug}/${mod.slug}/quiz`}
                    className="flex items-center gap-3 py-2 text-[13px] font-light text-[var(--muted)] transition-all hover:text-[var(--fg)]"
                  >
                    <ClipboardCheck className="h-3 w-3 shrink-0" />
                    <span className="truncate">Module Quiz</span>
                  </Link>
                )}
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
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto border-r border-[var(--border)] bg-[var(--bg)] p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="body-xs text-[var(--muted)]">Course Content</span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      <div className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8 pr-4">
          {sidebar}
        </div>
      </div>
    </>
  );
}
