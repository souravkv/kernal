"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ArrowRight, ClipboardCheck } from "lucide-react";
import { CourseDetail } from "@/lib/courses";

export default function ModuleAccordion({ course }: { course: CourseDetail }) {
  const [open, setOpen] = useState<Set<string>>(new Set([course.modules[0]?.id]));

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-0">
      {course.modules.map((mod) => {
        const isOpen = open.has(mod.id);
        return (
          <div key={mod.id} className="border-t border-[var(--border)]">
            <button
              onClick={() => toggle(mod.id)}
              className="flex w-full items-center gap-5 py-6 text-left transition-colors hover:bg-[var(--surface)] -mx-6 px-6 sm:-mx-10 sm:px-10"
            >
              <span className="text-[11px] font-medium text-[var(--muted)]">
                {mod.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="body-md block text-[var(--fg)]">
                  {mod.title}
                </span>
                <span className="body-sm mt-1 block text-[var(--muted)]">
                  {mod.description}
                </span>
              </span>
              <span className="hidden items-center gap-4 sm:flex">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">
                  {mod.topicCount} topics
                </span>
                {mod.hasQuiz && (
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">
                    <ClipboardCheck className="h-3 w-3" />
                    {mod.questionCount} questions
                  </span>
                )}
              </span>
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
              )}
            </button>

            {isOpen && (
              <div className="pb-6 pl-10 sm:pl-16">
                <div className="space-y-0 border-l border-[var(--border)] pl-5">
                  <Link
                    href={`/courses/${course.slug}/${mod.slug}`}
                    className="group flex items-center gap-3 py-2 text-[13px] font-light text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    <span>Module overview</span>
                  </Link>
                  {mod.topics.map((t) => (
                    <Link
                      key={t.id}
                      href={`/courses/${course.slug}/${mod.slug}/${t.slug}`}
                      className="group flex items-center gap-3 py-2 text-[13px] font-light text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                      <span>{t.title}</span>
                    </Link>
                  ))}
                  {mod.hasQuiz && (
                    <div className="mt-2 border-t border-[var(--border)] pt-2">
                      <Link
                        href={`/courses/${course.slug}/${mod.slug}/quiz`}
                        className="group flex items-center gap-3 py-2 text-[13px] font-light text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                      >
                        <ClipboardCheck className="h-3 w-3" />
                        <span>Module Quiz — {mod.questionCount} questions</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div className="border-t border-[var(--border)]" />
    </div>
  );
}
