"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ArrowRight, ClipboardCheck, Check } from "lucide-react";
import { CourseDetail } from "@/lib/courses";
import { UserProgress } from "@/lib/progress";

export default function ModuleAccordion({
  course,
  progress,
}: {
  course: CourseDetail;
  progress?: UserProgress | null;
}) {
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
        const stat = progress?.moduleStats[mod.id];
        const isDone = stat?.complete;
        const quizPassed = stat?.quizPassed;
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
                {stat && (
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">
                    {stat.doneTopics}/{stat.totalTopics}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">
                  {mod.topicCount} topics
                </span>
                {mod.hasQuiz && (
                  <span
                    className={`flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] ${
                      quizPassed ? "text-[var(--fg)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {quizPassed ? <Check className="h-3 w-3" /> : <ClipboardCheck className="h-3 w-3" />}
                    {quizPassed ? `Quiz ${stat?.quizBest}%` : `${mod.questionCount} questions`}
                  </span>
                )}
                {isDone && (
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-[var(--fg)]">
                    <Check className="h-3 w-3" />
                    Done
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
                  {mod.topics.map((t) => {
                    const done = progress?.topicDone[t.id];
                    return (
                      <Link
                        key={t.id}
                        href={`/courses/${course.slug}/${mod.slug}/${t.slug}`}
                        className="group flex items-center gap-3 py-2 text-[13px] font-light text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                      >
                        {done ? (
                          <Check className="h-3 w-3 shrink-0 text-[var(--fg)]" />
                        ) : (
                          <ArrowRight className="h-3 w-3 shrink-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                        )}
                        <span className={done ? "text-[var(--fg)]" : ""}>{t.title}</span>
                      </Link>
                    );
                  })}
                  {mod.hasQuiz && (
                    <div className="mt-2 border-t border-[var(--border)] pt-2">
                      <Link
                        href={`/courses/${course.slug}/${mod.slug}/quiz`}
                        className="group flex items-center gap-3 py-2 text-[13px] font-light text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                      >
                        {quizPassed ? (
                          <Check className="h-3 w-3 shrink-0 text-[var(--fg)]" />
                        ) : (
                          <ClipboardCheck className="h-3 w-3 shrink-0" />
                        )}
                        <span className={quizPassed ? "text-[var(--fg)]" : ""}>
                          {quizPassed
                            ? `Quiz passed — ${stat?.quizBest}%`
                            : `Module Quiz — ${mod.questionCount} questions`}
                        </span>
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
