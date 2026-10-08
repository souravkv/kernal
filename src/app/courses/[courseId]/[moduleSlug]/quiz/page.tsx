import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getQuizForModule } from "@/lib/courses";
import QuizRunner from "@/components/course/QuizRunner";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string; moduleSlug: string }>;
}) {
  const { courseId, moduleSlug } = await params;
  const data = await getQuizForModule(courseId, moduleSlug);
  return {
    title: data ? `${data.quiz.title} — ${data.course.code} — Kernal` : "Quiz — Kernal",
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleSlug: string }>;
}) {
  const { courseId, moduleSlug } = await params;
  const data = await getQuizForModule(courseId, moduleSlug);
  if (!data) notFound();

  const { course, module: mod, quiz, questions } = data;

  return (
    <div className="mx-auto max-w-[900px] px-6 py-20 sm:px-10 sm:py-24">
      <div className="mb-10 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
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
        <Link
          href={`/courses/${course.slug}/${mod.slug}`}
          className="transition-colors hover:text-[var(--fg)]"
        >
          Module {mod.number}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[var(--fg)]">Quiz</span>
      </div>

      <QuizRunner
        quizId={quiz.id}
        title={quiz.title}
        passScore={quiz.passScore}
        questions={questions}
        doneHref={`/courses/${course.slug}/${mod.slug}`}
      />
    </div>
  );
}
