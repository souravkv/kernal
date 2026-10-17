/**
 * Minimal markdown renderer for course content.
 * Supports headings, bold/italic, inline code, fenced code blocks,
 * bullet/numbered lists, tables, paragraphs, and blockquotes / notes.
 *
 * Fenced code blocks and blockquotes are extracted FIRST and restored last
 * so that no other rule (headings from '#' comments, lists, paragraphs...)
 * can touch their contents.
 *
 * Note syntax (rendered as a callout box):
 *   > **Note:** text   (also Tip / Remember / Watch out / Common mistake / Rule of thumb)
 * Plain blockquotes (no leading **Label:** prefix) render as quoted text.
 */
export function renderMarkdown(md: string): string {
  const blocks: string[] = [];

  const restoreInner = (s: string) =>
    s.replace(/%%KB(\d+)%%/g, (_m, i) => blocks[Number(i)] ?? "");

  // 1. pull out fenced code blocks
  let src = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, _l, code: string) => {
    blocks.push(
      `<pre class="border border-[var(--border)] bg-[var(--surface)] p-5 overflow-x-auto my-6"><code class="text-[13px] font-mono leading-relaxed">${esc(
        code.replace(/\s+$/, "")
      )}</code></pre>`
    );
    return `%%KB${blocks.length - 1}%%`;
  });

  // 2. pull out blockquotes / notes (consecutive "> ..." lines)
  src = src.replace(/(?:^>.*(?:\n|$))+/gm, (match) => {
    const lines = match
      .trim()
      .split("\n")
      .map((l) => l.replace(/^>\s?/, ""))
      .map((l) => inlineFmt(esc(l)));
    let body = restoreInner(lines.join("<br />"));
    // "**Label:** text" -> callout; anything else -> plain quote
    const labelMatch = body.match(
      /^<strong class="font-medium">([^<]{1,40}):<\/strong>\s*/i
    );
    if (labelMatch) {
      const label = labelMatch[1];
      body = body.slice(labelMatch[0].length);
      blocks.push(
        `<div class="my-6 border-l-2 border-[var(--fg)] bg-[var(--surface)] px-5 py-4"><div class="mb-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--fg)]">${label}</div><div class="text-[14px] font-light leading-relaxed text-[var(--muted)]">${body}</div></div>`
      );
    } else {
      blocks.push(
        `<div class="my-6 border-l-2 border-[var(--border)] px-5 py-3 text-[14px] font-light italic leading-relaxed text-[var(--muted)]">${body}</div>`
      );
    }
    return `%%KB${blocks.length - 1}%%`;
  });

  // escape raw HTML in prose (PDF content may contain '<T>', 'a < b', ...)
  src = src.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // 3. headings
  src = src.replace(/^### (.+)$/gm, '<h3 class="heading-sm mt-8 mb-3">$1</h3>');
  src = src.replace(/^## (.+)$/gm, '<h2 class="heading-md mt-12 mb-4">$1</h2>');
  src = src.replace(/^# (.+)$/gm, '<h1 class="heading-lg mb-4">$1</h1>');
  src = src.replace(
    /^#### (.+)$/gm,
    '<h4 class="mt-8 mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">$1</h4>'
  );

  // 4. inline formatting
  src = inlineFmt(src);

  // 5. tables
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

  // 6. lists
  src = src.replace(/^- (.+)$/gm, '<li class="mb-2 text-[var(--muted)]">$1</li>');
  src = src.replace(/^(\d+)\. (.+)$/gm, '<li class="mb-2 text-[var(--muted)]">$2</li>');
  src = src.replace(
    /(<li[^>]*>.*?<\/li>\n?)+/g,
    (match) => `<ul class="my-4 space-y-1">${match}</ul>`
  );

  // 7. paragraphs (never wrap placeholders, tags or list items)
  src = src.replace(/^(?!<[/a-z]|$|%%KB)(.+)$/gm, (match) => {
    const trimmed = match.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("%%KB")) return trimmed;
    return `<p class="mb-4 font-light leading-relaxed text-[var(--muted)]">${trimmed}</p>`;
  });

  // 8. put the code blocks and notes back
  return src.replace(/%%KB(\d+)%%/g, (_m, i) => blocks[Number(i)] ?? "");
}

function inlineFmt(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-[var(--surface-alt)] px-1.5 py-0.5 text-[0.85em] font-mono">$1</code>'
    );
}

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
