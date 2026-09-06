"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { getCourseBySlug, getTopicBySlug, getNextTopic, getPrevTopic } from "@/data/courses";
import CourseSidebar from "@/components/course/CourseSidebar";
import CodeBlock from "@/components/editor/CodeBlock";

export default function TopicPage({ params }: { params: Promise<{ courseId: string; topicSlug: string }> }) {
  const resolvedParams = use(params);
  const course = getCourseBySlug(resolvedParams.courseId);
  const result = getTopicBySlug(resolvedParams.courseId, resolvedParams.topicSlug);

  if (!course || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="heading-lg">Not Found</h1>
          <Link href="/courses" className="body-md mt-4 block text-[var(--muted)] hover:text-[var(--fg)] transition-colors">← Back to courses</Link>
        </div>
      </div>
    );
  }

  const { chapter, topic } = result;
  const nextTopic = getNextTopic(course.slug, topic.slug);
  const prevTopic = getPrevTopic(course.slug, topic.slug);

  return (
    <div className="mx-auto flex max-w-[1400px] gap-0 px-6 py-32 sm:px-10 sm:py-40 lg:gap-16">
      <CourseSidebar course={course} currentTopicSlug={topic.slug} />

      <article className="min-w-0 flex-1">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
            <Link href="/courses" className="hover:text-[var(--fg)] transition-colors">Courses</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/courses/${course.slug}`} className="hover:text-[var(--fg)] transition-colors">{course.title}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[var(--fg)]">{chapter.title}</span>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">{topic.difficulty}</span>
            <span className="text-[10px] text-[var(--muted)]">·</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              {Math.ceil(topic.content.split(" ").length / 200)} min read
            </span>
          </div>
          <h1 className="heading-lg mb-4">{topic.title}</h1>
          <p className="body-lg max-w-2xl text-[var(--muted)]">{topic.description}</p>
        </div>

        <div className="prose max-w-none">
          <div
            className="border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(topic.content) }}
          />
        </div>

        {topic.codeExample && (
          <div className="mt-12">
            <h2 className="heading-sm mb-6">Code Example</h2>
            <CodeBlock code={topic.codeExample} language={topic.language || "python"} />
          </div>
        )}

        {topic.practiceProblems.length > 0 && (
          <div className="mt-12 border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10">
            <h2 className="heading-sm mb-6">Practice Problems</h2>
            <ul className="space-y-4">
              {topic.practiceProblems.map((problem, i) => (
                <li key={i} className="flex items-start gap-4 text-[var(--muted)]">
                  <span className="mt-0.5 text-[10px] font-medium text-[var(--muted)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="body-md">{problem}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-16 flex items-center justify-between border-t border-[var(--border)] pt-8">
          {prevTopic ? (
            <Link
              href={`/courses/${course.slug}/${prevTopic.slug}`}
              className="group flex items-center gap-3 text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="body-sm">{prevTopic.title}</span>
            </Link>
          ) : <div />}
          {nextTopic ? (
            <Link
              href={`/courses/${course.slug}/${nextTopic.slug}`}
              className="group flex items-center gap-3 text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              <span className="body-sm">{nextTopic.title}</span>
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

function renderMarkdown(md: string): string {
  let html = md;
  html = html.replace(/^### (.+)$/gm, '<h3 class="heading-sm mt-8 mb-3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="heading-md mt-12 mb-4">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="heading-lg mb-4">$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[var(--surface-alt)] px-1.5 py-0.5 text-[0.85em] font-mono">$1</code>');
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, _l, code) => `<pre class="border border-[var(--border)] bg-[var(--surface)] p-5 overflow-x-auto my-6"><code class="text-[13px] font-mono leading-relaxed">${esc(code.trim())}</code></pre>`);
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split("|").filter(Boolean).map((c) => c.trim());
    if (cells.every((c) => /^[-:]+$/.test(c))) return "";
    return `<tr>${cells.map((c) => `<td class="border-b border-[var(--border)] px-4 py-3 text-[13px] font-light">${c}</td>`).join("")}</tr>`;
  });
  html = html.replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (match) => {
    const cleaned = match.replace(/<tr><td>([-:]+)<\/td>.*?<\/tr>\n?/g, "");
    if (!cleaned.trim()) return "";
    return `<div class="overflow-x-auto my-6"><table class="w-full"><thead><tr><th class="border-b border-[var(--fg)] px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider">Header</th></tr></thead><tbody>${cleaned}</tbody></table></div>`;
  });
  html = html.replace(/^- (.+)$/gm, '<li class="text-[var(--muted)] mb-2">$1</li>');
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="text-[var(--muted)] mb-2">$2</li>');
  html = html.replace(/(<li[^>]*>.*?<\/li>\n?)+/g, (match) => `<ul class="my-4 space-y-1">${match}</ul>`);
  html = html.replace(/^(?!<[huptol]|<\/|<tr|<li|<code|<pre|<div|<table|<tbody|<strong|<em|<thead)(.+)$/gm, (match) => {
    const trimmed = match.trim();
    if (!trimmed) return "";
    return `<p class="mb-4 leading-relaxed text-[var(--muted)] font-light">${trimmed}</p>`;
  });
  return html;
}

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
