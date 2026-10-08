import Link from "next/link";
import { ArrowRight, Check, ClipboardCheck, BookOpen } from "lucide-react";
import { auth } from "@/auth";
import { getAllCourses } from "@/lib/courses";
import { getUserProgress } from "@/lib/progress";

export const metadata = { title: "Progress — Kernal" };

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 sm:py-24">
        <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">
          Progress
        </span>
        <h1 className="heading-xl mb-6">Your Progress</h1>
        <p className="body-lg mb-10 max-w-lg text-[var(--muted)]">
          Sign in to save your progress, track completed sections and see quiz
          results across every course.
        </p>
        <Link
          href="/login"
          className="group inline-flex items-center gap-3 rounded-full border border-[var(--fg)] bg-[var(--fg)] px-7 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
        >
          Sign in
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  const [courses, progress] = await Promise.all([
    getAllCourses(),
    getUserProgress(session.user.id),
  ]);

  const stats = courses.map((c) => ({
    course: c,
    stat: progress.courseStats[c.id],
  }));

  const totals = stats.reduce(
    (acc, s) => {
      if (!s.stat) return acc;
      acc.doneTopics += s.stat.doneTopics;
      acc.totalTopics += s.stat.totalTopics;
      acc.quizzesPassed += s.stat.quizzesPassed;
      acc.quizzesTotal += s.stat.quizzesTotal;
      acc.modulesComplete += s.stat.modulesComplete;
      acc.modulesTotal += s.stat.modulesTotal;
      return acc;
    },
    { doneTopics: 0, totalTopics: 0, quizzesPassed: 0, quizzesTotal: 0, modulesComplete: 0, modulesTotal: 0 }
  );
  const overallPercent =
    totals.totalTopics > 0 ? Math.round((totals.doneTopics / totals.totalTopics) * 100) : 0;
  const hasAnyActivity = totals.doneTopics > 0 || totals.quizzesPassed > 0;

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 sm:py-24">
      <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">
        Progress
      </span>
      <h1 className="heading-xl mb-6">Your Progress</h1>
      <p className="body-lg mb-14 max-w-2xl text-[var(--muted)]">
        {session.user?.name?.split(" ")[0]
          ? `Welcome back, ${session.user.name.split(" ")[0]}. `
          : ""}{" "}
        Every section you mark complete and every quiz you pass shows up here.
      </p>

      {/* overall */}
      <div className="mb-6 border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="body-xs mb-3 block uppercase tracking-[0.3em] text-[var(--muted)]">
              Course completion
            </span>
            <span className="heading-xl">{overallPercent}%</span>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <div className="heading-sm">
                {totals.doneTopics} / {totals.totalTopics}
              </div>
              <div className="body-xs mt-1 uppercase tracking-[0.2em] text-[var(--muted)]">
                Topics
              </div>
            </div>
            <div>
              <div className="heading-sm">
                {totals.quizzesPassed} / {totals.quizzesTotal}
              </div>
              <div className="body-xs mt-1 uppercase tracking-[0.2em] text-[var(--muted)]">
                Quizzes passed
              </div>
            </div>
            <div>
              <div className="heading-sm">
                {totals.modulesComplete} / {totals.modulesTotal}
              </div>
              <div className="body-xs mt-1 uppercase tracking-[0.2em] text-[var(--muted)]">
                Modules done
              </div>
            </div>
          </div>
        </div>
        <div className="h-[3px] w-full bg-[var(--border)]">
          <div
            className="h-full bg-[var(--fg)] transition-all duration-700"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {!hasAnyActivity && (
        <div className="mb-6 border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10">
          <p className="body-md text-[var(--muted)]">
            No progress yet — open a section and hit{" "}
            <span className="text-[var(--fg)]">Mark complete</span> when
            you&apos;re done reading, then take the module quiz.
          </p>
          <Link
            href="/courses"
            className="group mt-6 inline-flex items-center gap-3 rounded-full border border-[var(--fg)] bg-[var(--fg)] px-7 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
          >
            Browse courses
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      {/* per course */}
      <div className="space-y-6">
        {stats.map(({ course, stat }) => {
          if (!stat) return null;
          return (
            <div
              key={course.id}
              className="border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"
            >
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium tracking-[0.15em] text-[var(--fg)]">
                      {course.code}
                    </span>
                    {stat.percent === 100 && (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-[var(--fg)]">
                        <Check className="h-3 w-3" />
                        Complete
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="heading-md transition-colors hover:text-[var(--muted)]"
                  >
                    {course.title}
                  </Link>
                  <div className="body-sm mt-2 text-[var(--muted)]">
                    {stat.doneTopics}/{stat.totalTopics} topics ·{" "}
                    {stat.quizzesPassed}/{stat.quizzesTotal} quizzes passed
                  </div>
                </div>
                <div className="text-right">
                  <div className="heading-sm">{stat.percent}%</div>
                </div>
              </div>

              <div className="mb-6 h-[3px] w-full bg-[var(--border)]">
                <div
                  className="h-full bg-[var(--fg)] transition-all duration-700"
                  style={{ width: `${stat.percent}%` }}
                />
              </div>

              <div className="space-y-0">
                {course.modules.map((mod) => {
                  const ms = progress.moduleStats[mod.id];
                  if (!ms) return null;
                  return (
                    <div
                      key={mod.id}
                      className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--border)] py-3"
                    >
                      <span className="w-8 text-[11px] font-medium text-[var(--muted)]">
                        {mod.number}
                      </span>
                      <Link
                        href={`/courses/${course.slug}/${mod.slug}`}
                        className={`body-sm min-w-0 flex-1 truncate transition-colors hover:text-[var(--fg)] ${
                          ms.complete ? "text-[var(--fg)]" : "text-[var(--muted)]"
                        }`}
                      >
                        {mod.title}
                      </Link>
                      <span className="text-[11px] text-[var(--muted)]">
                        {ms.doneTopics}/{ms.totalTopics}
                      </span>
                      {ms.complete && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--fg)]" />}
                      {ms.hasQuiz && (
                        <span
                          className={`flex items-center gap-1.5 text-[11px] ${
                            ms.quizPassed ? "text-[var(--fg)]" : "text-[var(--muted)]"
                          }`}
                        >
                          {ms.quizPassed ? (
                            <>
                              <Check className="h-3 w-3" />
                              Quiz {ms.quizBest}%
                            </>
                          ) : (
                            <>
                              <ClipboardCheck className="h-3 w-3" />
                              Quiz pending
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
                <div className="border-t border-[var(--border)]" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
        <BookOpen className="h-3.5 w-3.5" />
        Progress updates the moment you mark a section complete or pass a quiz.
      </div>
    </div>
  );
}
