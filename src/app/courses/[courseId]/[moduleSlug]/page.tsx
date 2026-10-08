import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ClipboardCheck, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getCourseBySlug, getModuleDetail } from "@/lib/courses";
import { getUserProgress } from "@/lib/progress";
import { hasCourseAccess } from "@/lib/access";
import { auth } from "@/auth";
import CodeBlock from "@/components/editor/CodeBlock";
import Paywall from "@/components/course/Paywall";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string; moduleSlug: string }>;
}) {
  const { courseId, moduleSlug } = await params;
  const ctx = await getModuleDetail(courseId, moduleSlug);
  return {
    title: ctx
      ? `Module ${ctx.module.number}: ${ctx.module.title} — ${ctx.course.code} — Kernal`
      : "Module — Kernal",
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ courseId: string; moduleSlug: string }>;
}) {
  const { courseId, moduleSlug } = await params;
  const [ctx, session] = await Promise.all([
    getModuleDetail(courseId, moduleSlug),
    auth(),
  ]);
  if (!ctx) notFound();
  const { course, module: mod } = ctx;

  if (!(await hasCourseAccess(session?.user?.id ?? null, course.id, course.price))) {
    return (
      <Paywall
        course={{
          id: course.id,
          slug: course.slug,
          code: course.code,
          title: course.title,
          price: course.price,
        }}
      />
    );
  }
  const progress = session?.user?.id ? await getUserProgress(session.user.id) : null;
  const stat = progress?.moduleStats[mod.id];
  const quizPassed = stat?.quizPassed ?? false;

  const idx = course.modules.findIndex((m) => m.slug === moduleSlug);
  const prevModule = idx > 0 ? course.modules[idx - 1] : null;
  const nextModule =
    idx >= 0 && idx < course.modules.length - 1 ? course.modules[idx + 1] : null;

  return (
    <div className="mx-auto max-w-[900px] px-6 py-20 sm:px-10 sm:py-24">
      {/* breadcrumb */}
      <nav className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
        <Link href="/courses" className="transition-colors hover:text-[var(--fg)]">
          Courses
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/courses/${course.slug}`}
          className="transition-colors hover:text-[var(--fg)]"
        >
          {course.code}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[var(--fg)]">Module {mod.number}</span>
      </nav>

      <div className="mb-3 flex items-center gap-3">
        <span className="text-[11px] font-medium tracking-[0.2em] text-[var(--muted)]">
          MODULE {mod.number}
        </span>
        <span className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
          {mod.topicCount} topics
          {mod.hasQuiz ? ` · ${mod.questionCount} questions` : ""}
        </span>
      </div>

      <h1 className="heading-lg mb-6">{mod.title}</h1>
      {mod.description && (
        <p className="body-lg mb-10 max-w-2xl text-[var(--muted)]">
          {mod.description}
        </p>
      )}

      {/* story cold-open */}
      {mod.coldOpen && (
        <div className="mb-10 border-l-2 border-[var(--fg)] bg-[var(--surface)] px-6 py-5">
          <div className="body-xs mb-2 uppercase tracking-[0.25em] text-[var(--muted)]">
            The Code Chronicles
          </div>
          <p className="body-md font-light italic text-[var(--muted)]">
            {mod.coldOpen}
          </p>
        </div>
      )}

      {/* learning outcomes */}
      {mod.outcomes.length > 0 && (
        <div className="mb-12">
          <h2 className="heading-sm mb-4 uppercase tracking-[0.2em] text-[var(--muted)]">
            Learning Outcomes
          </h2>
          <ul className="space-y-3">
            {mod.outcomes.map((o, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-1 text-[10px] font-medium text-[var(--muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="body-md text-[var(--muted)]">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* topics */}
      <div className="mb-12">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="heading-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            Topics
          </h2>
          {stat && (
            <span
              className={`text-[11px] uppercase tracking-[0.2em] ${
                stat.complete ? "text-[var(--fg)]" : "text-[var(--muted)]"
              }`}
            >
              {stat.doneTopics}/{stat.totalTopics} completed
            </span>
          )}
        </div>
        <div className="space-y-0">
          {mod.topics.map((t, i) => {
            const done = progress?.topicDone[t.id];
            return (
              <Link
                key={t.id}
                href={`/courses/${course.slug}/${mod.slug}/${t.slug}`}
                className="group flex items-center gap-5 border-t border-[var(--border)] py-5 transition-colors hover:bg-[var(--surface)] -mx-6 px-6 sm:-mx-10 sm:px-10"
              >
                <span className="text-[11px] font-medium text-[var(--muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="body-md block transition-colors group-hover:text-[var(--fg)]">
                    {t.title}
                  </span>
                  <span className="body-sm mt-0.5 block text-[var(--muted)]">
                    {t.description}
                  </span>
                </span>
                {done && (
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-[var(--fg)]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
                <ArrowRight className="h-4 w-4 text-[var(--muted)] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            );
          })}
          <div className="border-t border-[var(--border)]" />
        </div>
      </div>

      {/* quiz card */}
      {mod.quiz && (
        <div className="mb-12 border border-[var(--fg)] p-8 sm:p-10">
          <div className="mb-4 flex items-center gap-3">
            <ClipboardCheck className="h-5 w-5" />
            <span className="body-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              Module Quiz
            </span>
            {quizPassed && (
              <span className="flex items-center gap-1.5 border border-[var(--fg)] px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-[var(--fg)]">
                <Check className="h-3 w-3" />
                Passed · {stat?.quizBest}%
              </span>
            )}
          </div>
          <h3 className="heading-sm mb-2">{mod.quiz.title}</h3>
          <p className="body-md mb-6 text-[var(--muted)]">
            {mod.quiz.questionCount} multiple-choice questions. Optional — but
            a great way to check what you absorbed. Pass mark {mod.quiz.passScore}%.
          </p>
          <Link
            href={`/courses/${course.slug}/${mod.slug}/quiz`}
            className="group inline-flex items-center gap-3 rounded-full border border-[var(--fg)] bg-[var(--fg)] px-7 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
          >
            {quizPassed ? "Retake Quiz" : "Start Quiz"}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      {/* coding problems */}
      {mod.practiceProblems.length > 0 && (
        <div className="mb-12">
          <h2 className="heading-sm mb-2 uppercase tracking-[0.2em] text-[var(--muted)]">
            Coding Problems
          </h2>
          <p className="body-md mb-6 text-[var(--muted)]">
            Worked solutions in Python. Try them yourself in the playground
            first.
          </p>
          <div className="space-y-6">
            {mod.practiceProblems.map((p) => (
              <div
                key={p.number}
                className="border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-medium text-[var(--muted)]">
                    {String(p.number).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 ${
                      p.difficulty === "Easy"
                        ? "text-green-500 bg-green-500/10"
                        : p.difficulty === "Medium"
                        ? "text-amber-500 bg-amber-500/10"
                        : "text-red-500 bg-red-500/10"
                    }`}
                  >
                    {p.difficulty}
                  </span>
                  <h4 className="body-md font-medium">{p.title}</h4>
                </div>
                {p.statement && (
                  <p className="body-md mb-3 text-[var(--muted)]">
                    <span className="text-[var(--fg)]">Statement: </span>
                    {p.statement}
                  </p>
                )}
                {p.example && (
                  <p className="body-md mb-4 font-mono text-[13px] text-[var(--muted)]">
                    <span className="font-sans text-[var(--fg)]">Example: </span>
                    {p.example}
                  </p>
                )}
                {p.solution && <CodeBlock code={p.solution} language="python" />}
                {p.complexity && (
                  <p className="body-sm mt-4 text-[var(--muted)]">
                    <span className="text-[var(--fg)]">Complexity: </span>
                    {p.complexity}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* prev / next module */}
      <div className="flex items-center justify-between border-t border-[var(--border)] pt-8">
        {prevModule ? (
          <Link
            href={`/courses/${course.slug}/${prevModule.slug}`}
            className="group flex items-center gap-3 text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="body-sm">
              {prevModule.number} · {prevModule.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {nextModule ? (
          <Link
            href={`/courses/${course.slug}/${nextModule.slug}`}
            className="group flex items-center gap-3 text-right text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            <span className="body-sm">
              {nextModule.number} · {nextModule.title}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : (
          <Link href={`/courses/${course.slug}`} className="body-sm text-[var(--fg)]">
            Back to Course →
          </Link>
        )}
      </div>
    </div>
  );
}
