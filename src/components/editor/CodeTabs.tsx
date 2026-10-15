"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const LABELS: Record<string, string> = {
  python: "Python",
  py: "Python",
  cpp: "C++",
  c: "C",
  javascript: "JavaScript",
  js: "JavaScript",
  java: "Java",
  ts: "TypeScript",
  typescript: "TypeScript",
};

export function languageLabel(lang: string): string {
  return LABELS[lang.toLowerCase()] ?? lang.toUpperCase();
}

export default function CodeTabs({ codes }: { codes: Record<string, string> }) {
  const langs = Object.keys(codes);
  const [active, setActive] = useState(langs[0]);
  const [copied, setCopied] = useState(false);

  if (langs.length === 0) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codes[active]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden border border-[var(--border)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-2 py-1.5">
        <div className="flex items-center gap-1">
          {langs.map((lang) => (
            <button
              key={lang}
              onClick={() => setActive(lang)}
              className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                lang === active
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              {languageLabel(lang)}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 text-[11px] text-[var(--muted)] opacity-60 transition-opacity hover:opacity-100"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[var(--surface-alt)] p-5">
        <code className="text-[13px] font-mono font-light leading-relaxed text-[var(--fg)]">
          {codes[active]}
        </code>
      </pre>
    </div>
  );
}
