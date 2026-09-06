"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink } from "lucide-react";
import { top100Questions, categories } from "@/data/questions";

export default function QuestionsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return top100Questions.filter((q) => {
      const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "All" || q.category === selectedCategory;
      const matchDifficulty = !selectedDifficulty || q.difficulty === selectedDifficulty;
      return matchSearch && matchCategory && matchDifficulty;
    });
  }, [search, selectedCategory, selectedDifficulty]);

  const easyCount = filtered.filter((q) => q.difficulty === "Easy").length;
  const medCount = filtered.filter((q) => q.difficulty === "Medium").length;
  const hardCount = filtered.filter((q) => q.difficulty === "Hard").length;

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-32 sm:px-10 sm:py-40">
      <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">Question Bank</span>
      <h1 className="heading-xl mb-4">Top 100</h1>
      <p className="body-lg mb-16 max-w-xl text-[var(--muted)]">
        The most frequently asked interview problems at top tech companies. Curated and categorized.
      </p>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="body-sm text-[var(--muted)] mr-2">{filtered.length} problems</span>
          <span className="text-[10px] font-medium text-[var(--muted)]">{easyCount} Easy</span>
          <span className="text-[10px] text-[var(--muted)]">·</span>
          <span className="text-[10px] font-medium text-[var(--muted)]">{medCount} Medium</span>
          <span className="text-[10px] text-[var(--muted)]">·</span>
          <span className="text-[10px] font-medium text-[var(--muted)]">{hardCount} Hard</span>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-[13px] font-light outline-none transition-colors focus:border-[var(--fg)]"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full border px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--fg)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-6 flex gap-2">
        {["Easy", "Medium", "Hard"].map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
            className={`rounded-full border px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-all ${
              selectedDifficulty === diff
                ? diff === "Easy"
                  ? "border-green-500 bg-green-500 text-white"
                  : diff === "Medium"
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-red-500 bg-red-500 text-white"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--fg)]"
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      <div className="border-t border-[var(--border)]">
        {filtered.map((q, i) => (
          <motion.div
            key={q.id}
            className="group flex items-center gap-4 border-b border-[var(--border)] py-4 transition-colors hover:bg-[var(--surface)] -mx-6 px-6 sm:-mx-10 sm:px-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.5) }}
          >
            <span className="w-10 text-[11px] font-medium text-[var(--muted)]">{q.id}</span>

            <div className="flex-1 min-w-0">
              <span className="body-sm block truncate transition-colors group-hover:text-[var(--fg)]">{q.title}</span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-0.5 block">{q.category}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              {q.companies.slice(0, 3).map((c) => (
                <span key={c} className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-[var(--muted)]">
                  {c}
                </span>
              ))}
            </div>

            <span className={`text-[10px] font-medium uppercase tracking-wider ${
              q.difficulty === "Easy" ? "text-green-500" : q.difficulty === "Medium" ? "text-amber-500" : "text-red-500"
            }`}>
              {q.difficulty}
            </span>

            <ExternalLink className="h-3.5 w-3.5 text-[var(--muted)] opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="heading-sm text-[var(--muted)]">No problems found</p>
          <p className="body-md mt-2 text-[var(--muted)]">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
