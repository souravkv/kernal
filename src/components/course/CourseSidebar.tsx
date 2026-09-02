"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, BookOpen, Play, Menu, X } from "lucide-react";
import { Course, Chapter } from "@/data/courses";

interface CourseSidebarProps {
  course: Course;
  currentTopicSlug?: string;
}

export default function CourseSidebar({ course, currentTopicSlug }: CourseSidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(course.chapters.map((c) => c.id))
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sidebar = (
    <nav className="space-y-1">
      {course.chapters.map((chapter) => {
        const isExpanded = expandedChapters.has(chapter.id);
        return (
          <div key={chapter.id} className="rounded-xl border border-border bg-surface overflow-hidden">
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-card-hover"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">
                {chapter.icon}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-foreground truncate">{chapter.title}</span>
                <span className="block text-[10px] text-muted">{chapter.topics.length} topics</span>
              </span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
              )}
            </button>

            {isExpanded && (
              <div className="border-t border-border px-2 pb-2">
                {chapter.topics.map((topic) => {
                  const isActive = topic.slug === currentTopicSlug;
                  return (
                    <Link
                      key={topic.id}
                      href={`/courses/${course.slug}/${topic.slug}`}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted hover:bg-card-hover hover:text-foreground"
                      }`}
                    >
                      {isActive ? (
                        <Play className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 shrink-0" />
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
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto border-r border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Course Content</h3>
              <button onClick={() => setMobileOpen(false)} className="text-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      <div className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-8">
          {sidebar}
        </div>
      </div>
    </>
  );
}
