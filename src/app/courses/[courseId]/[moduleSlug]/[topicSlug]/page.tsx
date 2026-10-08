import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { getTopicDetail } from "@/lib/courses";
import { getUserProgress } from "@/lib/progress";
import { hasCourseAccess } from "@/lib/access";
import { renderMarkdown } from "@/lib/markdown";
import { auth } from "@/auth";
import CourseSidebar from "@/components/course/CourseSidebar";
import CodeBlock from "@/components/editor/CodeBlock";
import MarkComplete from "@/components/course/MarkComplete";
import Paywall from "@/components/course/Paywall";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string; moduleSlug: string; topicSlug: string }>;
}) {
  const { courseId, moduleSlug, topicSlug } = await params;
  const ctx = await getTopicDetail(courseId, moduleSlug, topicSlug);
  return { title: ctx ? `${ctx.topic.title} — ${ctx.course.code} — Kernal` : "Topic — Kernal" };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleSlug: string; topicSlug: string }>;
}) {
  const { courseId, moduleSlug, topicSlug } = await params;
  const [ctx, session] = await Promise.all([
    getTopicDetail(courseId, moduleSlug, topicSlug),
    auth(),
  ]);
  if (!ctx) notFound();

  const { course, module: mod, topic, prev, next } = ctx;

  // completed state (only for signed-in users)
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
  const completed = progress?.topicDone[topic.id] ?? false;

  return (
    <div className="mx-auto flex max-w-[1400px] gap-0 px-6 py-20 sm:px-10 sm:py-24 lg:gap-16">
      <CourseSidebar
        course={course}
        currentModuleSlug={mod.slug}
        currentTopicSlug={topic.slug}
        progress={progress}
      />

      <article className="min-w-0 flex-1">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
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
            <span className="text-[var(--fg)]">{topic.title}</span>
          </div>
        </div>

        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              {topic.difficulty}
            </span>
            <span className="text-[10px] text-[var(--muted)]">·</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              {Math.max(1, Math.ceil(topic.content.split(" ").length / 200))} min read
            </span>
          </div>
          <h1 className="heading-lg mb-4">{topic.title}</h1>
          <p className="body-lg max-w-2xl text-[var(--muted)]">{topic.description}</p>
        </div>

        <div className="prose max-w-none">
          <div
            className="border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(topic.content) }}
          />
        </div>

        {topic.codeExample && (
          <div className="mt-12">
            <h2 className="heading-sm mb-6">Code Example</h2>
            <CodeBlock code={topic.codeExample} language={topic.codeLanguage || "python"} />
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-[var(--border)] pt-8">
          <span className="body-sm text-[var(--muted)]">
            Finished reading?
          </span>
          {session?.user ? (
            <MarkComplete topicId={topic.id} initialDone={completed} />
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 border border-[var(--border)] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--muted)] transition-all duration-300 hover:border-[var(--fg)] hover:text-[var(--fg)]"
            >
              Sign in to track progress
            </Link>
          )}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-[var(--border)] pt-8">
          {prev ? (
            <Link
              href={`/courses/${course.slug}/${prev.moduleSlug}/${prev.topic.slug}`}
              className="group flex items-center gap-3 text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="body-sm">{prev.topic.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/courses/${course.slug}/${next.moduleSlug}/${next.topic.slug}`}
              className="group flex items-center gap-3 text-right text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              <span className="body-sm">{next.topic.title}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link href={`/courses/${course.slug}`} className="body-sm text-[var(--fg)]">
              Course Complete →
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
