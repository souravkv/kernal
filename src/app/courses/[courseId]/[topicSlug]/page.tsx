"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, BookOpen, ChevronRight } from "lucide-react";
import { getCourseBySlug, getTopicBySlug, getNextTopic, getPrevTopic } from "@/data/courses";
import CourseSidebar from "@/components/course/CourseSidebar";
import CodeBlock from "@/components/editor/CodeBlock";

export default function TopicPage({ params }: { params: Promise<{ courseId: string; topicSlug: string }> }) {
  const resolvedParams = use(params);
  const course = getCourseBySlug(resolvedParams.courseId);
  const result = getTopicBySlug(resolvedParams.courseId, resolvedParams.topicSlug);

  if (!course || !result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Topic Not Found</h1>
          <p className="mt-2 text-muted">The topic you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/courses" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const { chapter, topic } = result;
  const nextTopic = getNextTopic(course.slug, topic.slug);
  const prevTopic = getPrevTopic(course.slug, topic.slug);

  const difficultyColor = {
    Beginner: "bg-success/10 text-success",
    Intermediate: "bg-warning/10 text-warning",
    Advanced: "bg-danger/10 text-danger",
  }[topic.difficulty];

  return (
    <div className="mx-auto flex max-w-7xl gap-0 px-4 py-6 sm:px-6 lg:gap-8 lg:px-8">
      <CourseSidebar course={course} currentTopicSlug={topic.slug} />

      <article className="min-w-0 flex-1">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/courses/${course.slug}`} className="hover:text-primary transition-colors">{course.title}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{chapter.title}</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${difficultyColor}`}>
              {topic.difficulty}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted">
              <Clock className="h-3 w-3" />
              {Math.ceil(topic.content.split(" ").length / 200)} min read
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{topic.title}</h1>
          <p className="mt-3 text-lg text-muted">{topic.description}</p>
        </div>

        <div className="prose max-w-none">
          <div
            className="rounded-2xl border border-border bg-card p-6 sm:p-8"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(topic.content),
            }}
          />
        </div>

        {topic.codeExample && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-foreground">Code Example</h2>
            <CodeBlock code={topic.codeExample} language={topic.language || "python"} />
          </div>
        )}

        {topic.practiceProblems.length > 0 && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Practice Problems
            </h2>
            <ul className="space-y-3">
              {topic.practiceProblems.map((problem, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  {problem}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          {prevTopic ? (
            <Link
              href={`/courses/${course.slug}/${prevTopic.slug}`}
              className="group flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              {prevTopic.title}
            </Link>
          ) : (
            <div />
          )}
          {nextTopic ? (
            <Link
              href={`/courses/${course.slug}/${nextTopic.slug}`}
              className="group flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              {nextTopic.title}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <Link
              href={`/courses/${course.slug}`}
              className="group flex items-center gap-2 text-sm font-medium text-primary"
            >
              Course Complete!
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}

function renderMarkdown(md: string): string {
  let html = md;

  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-foreground mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-foreground mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-foreground mb-4">$1</h1>');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="rounded bg-code-bg px-1.5 py-0.5 text-sm font-mono">$1</code>');

  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre class="rounded-xl border border-border bg-code-bg p-4 overflow-x-auto my-4"><code class="text-sm font-mono">${escapeHtml(code.trim())}</code></pre>`;
  });

  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split("|").filter(Boolean).map((c) => c.trim());
    if (cells.every((c) => /^[-:]+$/.test(c))) return "";
    const tag = "td";
    return `<tr>${cells.map((c) => `<${tag} class="border border-border px-3 py-2 text-sm">${c}</${tag}>`).join("")}</tr>`;
  });

  html = html.replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (match) => {
    const cleaned = match.replace(/<tr><td>([-:]+)<\/td>.*?<\/tr>\n?/g, "");
    if (!cleaned.trim()) return "";
    return `<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-border"><tbody>${cleaned}</tbody></table></div>`;
  });

  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 text-muted mb-1">$1</li>');
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 text-muted mb-1 list-decimal">$2</li>');

  html = html.replace(/(<li[^>]*>.*?<\/li>\n?)+/g, (match) => {
    if (match.includes('list-decimal')) {
      return `<ol class="my-3 space-y-1">${match}</ol>`;
    }
    return `<ul class="my-3 space-y-1 list-disc">${match}</ul>`;
  });

  html = html.replace(/^(?!<[huptol]|<\/|<tr|<li|<code|<pre|<div|<table|<tbody|<strong|<em)(.+)$/gm, (match) => {
    const trimmed = match.trim();
    if (!trimmed) return "";
    return `<p class="mb-3 leading-relaxed text-muted">${trimmed}</p>`;
  });

  return html;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
