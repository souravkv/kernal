"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2 } from "lucide-react";

const AUTO_COMPLETE_MS = 60_000;

export default function TopicNav({
  topicId,
  initialDone,
  nextHref,
}: {
  topicId: string;
  initialDone: boolean;
  nextHref: string | null;
}) {
  const router = useRouter();
  const [done, setDone] = useState(initialDone);
  const [loading, setLoading] = useState(false);

  const markDone = async () => {
    // upsert on the server is idempotent — safe to call even if already done
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, done: true }),
      });
      if (res.ok) setDone(true);
    } catch {
      // network hiccup — user can still mark manually
    }
  };

  // auto-complete after 60s spent on this topic
  useEffect(() => {
    if (initialDone) return;
    const t = setTimeout(() => {
      void markDone();
    }, AUTO_COMPLETE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, initialDone]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, done: !done }),
      });
      if (res.ok) {
        const data = await res.json();
        setDone(data.completed);
      }
    } finally {
      setLoading(false);
    }
  };

  const goNext = async () => {
    if (!nextHref) return;
    await markDone();
    router.push(nextHref);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <span className="body-sm text-[var(--muted)]">Finished reading?</span>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          disabled={loading}
          className={`flex items-center gap-2 border px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 ${
            done
              ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
              : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]"
          }`}
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Check className="h-3 w-3" />
          )}
          {done ? "Completed" : "Mark complete"}
        </button>
        {nextHref && (
          <button
            onClick={goNext}
            className="group flex items-center gap-2 border border-[var(--fg)] bg-[var(--fg)] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
          >
            Next
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}
