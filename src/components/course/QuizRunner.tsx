"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Loader2, RotateCcw, ArrowRight } from "lucide-react";
import { QuizQuestionPublic } from "@/lib/courses";

interface QuestionResult {
  correct: boolean;
  correctIndex: number;
  explanation: string;
}

interface SubmitResponse {
  score: number;
  passed: boolean;
  correctCount: number;
  results: QuestionResult[];
  saved: boolean;
}

export default function QuizRunner({
  quizId,
  title,
  passScore,
  questions,
  doneHref,
  passed,
  bestScore,
}: {
  quizId: string;
  title: string;
  passScore: number;
  questions: QuizQuestionPublic[];
  doneHref: string;
  passed?: boolean;
  bestScore?: number | null;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    questions.map(() => null)
  );
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const answeredCount = answers.filter((a) => a !== null).length;

  const select = (qIdx: number, optIdx: number) => {
    if (result) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  };

  const submit = async () => {
    if (submitting) return;
    if (answeredCount < questions.length) {
      setError(
        `Answer all questions first (${answeredCount}/${questions.length} done).`
      );
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, answers }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as SubmitResponse;
      setResult(data);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const retake = () => {
    setAnswers(questions.map(() => null));
    setResult(null);
    setError("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ---------- results view ----------
  if (result) {
    const correctCount = result.correctCount;
    return (
      <div>
        <div
          className={`mb-10 border p-8 sm:p-10 ${
            result.passed
              ? "border-[var(--fg)] bg-[var(--surface)]"
              : "border-[var(--border)] bg-[var(--surface)]"
          }`}
        >
          <div className="body-xs mb-4 uppercase tracking-[0.3em] text-[var(--muted)]">
            {result.passed ? "Passed" : "Not quite"}
          </div>
          <div className="heading-xl mb-4">{result.score}%</div>
          <p className="body-md text-[var(--muted)]">
            You answered {correctCount} of {questions.length} questions
            correctly. Pass mark is {passScore}%
            {result.saved ? " — your attempt has been saved." : "."}
            {!result.saved && " — sign in to save attempts."}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={retake}
              className="flex items-center gap-2 rounded-full border border-[var(--fg)] bg-[var(--fg)] px-7 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retake
            </button>
            <Link
              href={doneHref}
              className="group flex items-center gap-2 text-[13px] font-light text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              Back to module
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, i) => {
            const r = result.results[i];
            if (!r) return null;
            return (
              <div
                key={q.id}
                className={`border p-6 ${
                  r.correct
                    ? "border-green-500/30 bg-green-500/[0.03]"
                    : "border-red-500/30 bg-red-500/[0.03]"
                }`}
              >
                <div className="mb-4 flex items-start gap-3">
                  {r.correct ? (
                    <Check className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                  ) : (
                    <X className="mt-1 h-4 w-4 shrink-0 text-red-500" />
                  )}
                  <span className="body-md">
                    <span className="mr-2 text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">
                      Q{i + 1}
                    </span>
                    {q.prompt}
                  </span>
                </div>
                <div className="ml-7 space-y-1.5">
                  {q.options.map((opt, oi) => {
                    const isCorrect = oi === r.correctIndex;
                    const chosen = answers[i] === oi;
                    return (
                      <div
                        key={oi}
                        className={`flex items-center gap-2 px-3 py-1.5 text-[13px] font-light ${
                          isCorrect
                            ? "bg-green-500/10 text-green-500"
                            : chosen
                            ? "bg-red-500/10 text-red-500 line-through"
                            : "text-[var(--muted)]"
                        }`}
                      >
                        <span className="text-[10px] uppercase">
                          {String.fromCharCode(97 + oi)}.
                        </span>
                        {opt}
                        {isCorrect && (
                          <span className="ml-auto text-[9px] uppercase tracking-wider">
                            correct
                          </span>
                        )}
                        {chosen && !isCorrect && (
                          <span className="ml-auto text-[9px] uppercase tracking-wider">
                            your answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {r.explanation && (
                  <p className="body-sm mt-3 ml-7 text-[var(--muted)]">
                    {r.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------- attempt view ----------
  return (
    <div>
      <div className="mb-10">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="body-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Module Quiz · optional
          </span>
          {passed && (
            <span className="flex items-center gap-1.5 border border-[var(--fg)] px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-[var(--fg)]">
              <Check className="h-3 w-3" />
              Passed · {bestScore}%
            </span>
          )}
        </div>
        <h1 className="heading-lg mb-3">{title}</h1>
        <p className="body-md text-[var(--muted)]">
          {questions.length} questions · pass mark {passScore}% · answers are
          graded the moment you submit.
          {passed &&
            " You have already passed this quiz — retaking it can only improve your score."}
        </p>
      </div>

      <div className="space-y-8">
        {questions.map((q, i) => (
          <div key={q.id} className="border border-[var(--border)] p-6 sm:p-8">
            <div className="mb-5 flex items-start gap-4">
              <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="body-md flex-1">{q.prompt}</h3>
            </div>
            <div className="ml-0 space-y-2 sm:ml-10">
              {q.options.map((opt, oi) => {
                const chosen = answers[i] === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => select(i, oi)}
                    className={`flex w-full items-center gap-3 border px-4 py-3 text-left text-[13px] font-light transition-all ${
                      chosen
                        ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]"
                    }`}
                  >
                    <span className="text-[10px] font-medium uppercase">
                      {String.fromCharCode(97 + oi)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[var(--border)] pt-8">
        <button
          onClick={submit}
          disabled={submitting}
          className="flex items-center gap-2 rounded-full border border-[var(--fg)] bg-[var(--fg)] px-8 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)] disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Submit Answers
        </button>
        <span className="text-[12px] font-light text-[var(--muted)]">
          {answeredCount}/{questions.length} answered
        </span>
        {error && <span className="text-[12px] text-red-500">{error}</span>}
      </div>
    </div>
  );
}
