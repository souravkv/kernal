"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

export default function MarkComplete({
  topicId,
  initialDone,
}: {
  topicId: string;
  initialDone: boolean;
}) {
  const [done, setDone] = useState(initialDone);
  const [loading, setLoading] = useState(false);

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

  return (
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
  );
}
