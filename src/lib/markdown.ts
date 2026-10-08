/**
 * Minimal markdown renderer for course content.
 * Supports headings, bold/italic, inline code, fenced code blocks,
 * bullet/numbered lists, tables and paragraphs.
 *
 * Fenced code blocks are extracted FIRST and restored last so that no
 * other rule (headings from '#' comments, lists, paragraphs…) can touch
 * their contents.
 */
export function renderMarkdown(md: string): string {
  const blocks: string[] = [];

  // 1. pull out fenced code blocks
  let src = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, _l, code: string) => {
    blocks.push(
      `<pre class="border border-[var(--border)] bg-[var(--surface)] p-5 overflow-x-auto my-6"><code class="text-[13px] font-mono leading-relaxed">${esc(
        code.replace(/\s+$/, "")
      )}</code></pre>`
    );
    return `\u0000${blocks.length - 1}\u0000`;
  });

  // escape raw HTML in prose (PDF content may contain '<T>', 'a < b', …)
  src = src.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // 2. headings
  src = src.replace(/^### (.+)$/gm, '<h3 class="heading-sm mt-8 mb-3">$1</h3>');
  src = src.replace(/^## (.+)$/gm, '<h2 class="heading-md mt-12 mb-4">$1</h2>');
  src = src.replace(/^# (.+)$/gm, '<h1 class="heading-lg mb-4">$1</h1>');
  src = src.replace(
    /^#### (.+)$/gm,
    '<h4 class="mt-8 mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">$1</h4>'
  );

  // 3. inline formatting
  src = src.replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium">$1</strong>');
  src = src.replace(/\*(.+?)\*/g, '<em>$1</em>');
  src = src.replace(
    /`([^`]+)`/g,
    '<code class="bg-[var(--surface-alt)] px-1.5 py-0.5 text-[0.85em] font-mono">$1</code>'
  );

  // 4. tables
  src = src.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split("|").filter(Boolean).map((c) => c.trim());
    if (cells.every((c) => /^[-:]+$/.test(c))) return "";
    return `<tr>${cells
      .map(
        (c) =>
          `<td class="border-b border-[var(--border)] px-4 py-3 text-[13px] font-light">${c}</td>`
      )
      .join("")}</tr>`;
  });
  src = src.replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (match) => {
    const cleaned = match.replace(/<tr><td>([-:]+)<\/td>.*?<\/tr>\n?/g, "");
    if (!cleaned.trim()) return "";
    return `<div class="overflow-x-auto my-6"><table class="w-full"><tbody>${cleaned}</tbody></table></div>`;
  });

  // 5. lists
  src = src.replace(/^- (.+)$/gm, '<li class="mb-2 text-[var(--muted)]">$1</li>');
  src = src.replace(/^(\d+)\. (.+)$/gm, '<li class="mb-2 text-[var(--muted)]">$2</li>');
  src = src.replace(
    /(<li[^>]*>.*?<\/li>\n?)+/g,
    (match) => `<ul class="my-4 space-y-1">${match}</ul>`
  );

  // 6. paragraphs (never wrap code placeholders, tags or list items)
  src = src.replace(
    /^(?!<[/a-z]|$|\u0000)(.+)$/gm,
    (match) => {
      const trimmed = match.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("\u0000")) return trimmed;
      return `<p class="mb-4 font-light leading-relaxed text-[var(--muted)]">${trimmed}</p>`;
    }
  );

  // 7. put the code blocks back
  return src.replace(/\u0000(\d+)\u0000/g, (_m, i) => blocks[Number(i)] ?? "");
}

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
