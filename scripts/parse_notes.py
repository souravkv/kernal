#!/usr/bin/env python3
"""
Parse DSA Foundations Course Notes (pdftotext -layout output) into seed JSON
for the KERNAL LMS Prisma seed.

Usage:
    python3 scripts/parse_notes.py [input.txt] [output.json]

Output shape:
{
  "modules": [
    {
      "number": 1, "title": "...", "slug": "...",
      "description": "...", "coldOpen": "...", "outcomes": ["..."],
      "topics": [{ "order": 1, "title": "...", "slug": "...",
                   "description": "...", "content": "...markdown..." }],
      "quiz": { "questions": [
        { "order": 1, "prompt": "...", "options": ["..","..","..",".."],
          "correctIndex": 0, "explanation": "..." } ] },
      "practiceProblems": [ { "number": 1, "title": "...", "difficulty": "Easy",
                              "statement": "...", "example": "...",
                              "solution": "code", "complexity": "..." } ]
    }
  ]
}
"""
import json
import re
import sys
import unicodedata

# ---------------------------------------------------------------- helpers

# Box-drawing / diagram characters.
# NOTE: prose frequently contains "→" ("A → B"), so arrows must NOT be here
# or text paragraphs get swallowed into diagram blocks.
BOX_CHARS = "─│┌┐└┘├┤┬┴┼═║╔╗╚╝▼▲▶◀✓✗"
MODULE_RE = re.compile(r"^\s*MODULE\s+(\d+)\s*[—-]\s*(.*)$")
SECTION_RE = re.compile(r"^(\d+\.\d+)\s+(\S.*)$")
MCQ_RE = re.compile(r"^Q(\d+)\.\s*(.*)$")
ANSWER_RE = re.compile(r"^Answer:\s*\(([a-d])\)\s*(.*)$")
CODE_PROBLEM_RE = re.compile(r"^Code Problem\s+(\d+)\s*\((\w+)\):\s*(.+)$")
PROSE_LABEL_RE = re.compile(
    r"^(Idea|Note|Explanation|Approach|Intuition|Observation|Key insight|Takeaway|Tip)\b\s*:",
    re.I,
)
OPT_MARK_RE = re.compile(r"\(([a-d])\)")
END_MARKERS = ("Practice Set A", "Practice Set B", "MODULE ")

MODULE_SLUGS = {
    "Thinking in Data & Algorithms": "thinking-in-data-algorithms",
    "Analysing Algorithms (Complexity)": "analysing-algorithms",
    "Arrays & Records": "arrays-and-records",
    "Strings": "strings",
    "Recursion": "recursion",
    "Searching & Basic Sorting": "searching-and-basic-sorting",
    "Linked Lists": "linked-lists",
    "Stacks": "stacks",
    "Queues": "queues",
    "Trees & Binary Search Trees": "trees-and-bst",
    "Graph Basics": "graph-basics",
    "Hashing & Putting It All Together": "hashing-and-review",
    "ASSESSMENT": "assessment",
}

# Difficulty ladder for a beginner→intermediate foundations course
MODULE_DIFFICULTY = {
    **{i: "Beginner" for i in range(1, 7)},
    **{i: "Intermediate" for i in range(7, 10)},
    **{i: "Advanced" for i in range(10, 13)},
    13: "Intermediate",
}


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\[.*?\]", "", text)          # drop [L], [AHU] refs
    text = text.replace("&", " and ")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def at_col0(line: str) -> bool:
    return bool(line) and line[0] not in " \t"


def contains_box(line: str) -> bool:
    return any(ch in BOX_CHARS for ch in line)


def internal_double_space(line: str) -> bool:
    """True when visible content is separated by 2+ spaces (table columns)."""
    stripped = line.rstrip()
    if not stripped.strip():
        return False
    return re.search(r"\S {2,}\S", stripped) is not None


def is_symbol_line(line: str) -> bool:
    """True for diagram fragments like '*', '/ \', '50' — no letters at all."""
    s = line.strip()
    if not s:
        return False
    return re.search(r"[A-Za-z]", s) is None


def join_wrapped(lines):
    """Join paragraph lines that wrapped across page width."""
    out = []
    for ln in lines:
        if not ln.strip():
            if out and out[-1] != "":
                out.append("")
            continue
        if out and out[-1]:
            prev = out[-1]
            # continuation: previous line has no terminal punctuation,
            # current line starts lowercase or is very short
            if not re.search(r"[.!?:;)\]\"']\s*$", prev) and (
                ln[:1].islower() or len(ln) < 60
            ):
                out[-1] = prev + " " + ln.strip()
                continue
            if re.search(r"[a-z]-$", prev.rstrip()):
                # hyphenated break: "what-" + "only" -> what-only
                out[-1] = prev.rstrip()[:-1] + ln.strip()
                continue
        out.append(ln.strip())
    return [x for x in out if x]


# ---------------------------------------------------------------- sections -> markdown

def lines_to_markdown(raw_lines):
    """Convert one section's raw text into markdown."""
    md = []
    para = []

    def flush():
        if para:
            md.append(" ".join(para).strip())
            para.clear()

    i = 0
    n = len(raw_lines)
    mode = None          # None | "pre"
    pre_buf = []

    def flush_pre():
        if pre_buf:
            while pre_buf and not pre_buf[-1].strip():
                pre_buf.pop()
            body = "\n".join(pre_buf)
            md.append("```" + "\n" + body.rstrip() + "\n```")
            pre_buf.clear()

    while i < n:
        line = raw_lines[i]
        raw = line.rstrip("\n")
        stripped = raw.strip()

        if not stripped:
            if mode == "pre":
                # peek ahead: blank line inside a pre block only if the next
                # non-blank line is still indented / boxed
                j = i + 1
                while j < n and not raw_lines[j].strip():
                    j += 1
                if j < n:
                    nxt = raw_lines[j]
                    nxt_stripped = nxt.strip()
                    nxt_indent = len(nxt) - len(nxt.lstrip())
                    if (
                        contains_box(nxt_stripped)
                        or internal_double_space(nxt)
                        or (nxt_indent >= 1 and not SECTION_RE.match(nxt_stripped))
                    ) and not SECTION_RE.match(nxt_stripped):
                        pre_buf.append("")
                        i += 1
                        continue
                flush_pre()
                mode = None
            else:
                flush()
            i += 1
            continue

        indent = len(raw) - len(raw.lstrip())

        # -- section header ends any open block
        if SECTION_RE.match(stripped) and indent == 0:
            flush_pre()
            flush()
            m = SECTION_RE.match(stripped)
            md.append(f"### {m.group(1)} {m.group(2)}")
            i += 1
            continue

        if mode == "pre":
            if (
                indent == 0
                and not contains_box(stripped)
                and not internal_double_space(raw)
            ):
                flush_pre()
                mode = None
                continue  # reprocess in prose mode
            pre_buf.append(raw.rstrip())
            i += 1
            continue

        # -- diagram (box drawing / arrows / unicode art)
        if contains_box(stripped):
            flush()
            mode = "pre"
            pre_buf.append(raw.rstrip())
            i += 1
            continue

        # -- table columns
        if internal_double_space(raw):
            flush()
            mode = "pre"
            pre_buf.append(raw.rstrip())
            i += 1
            continue

        # -- indented code / algorithm listing (1-2 spaces)
        if indent in (1, 2):
            flush()
            mode = "pre"
            pre_buf.append(raw.rstrip())
            i += 1
            continue

        # -- indented bullet (3+ spaces, not code)
        if indent >= 3:
            # pure-symbol lines (tree roots like "*", "+", node numbers)
            # belong to the surrounding diagram, not to a bullet list
            if is_symbol_line(stripped):
                flush()
                mode = "pre"
                pre_buf.append(raw.rstrip())
                i += 1
                continue
            # peek: a diagram/table may start on the very next line, in which
            # case this line is the diagram's caption and belongs in the block
            j = i + 1
            while j < n and not raw_lines[j].strip():
                j += 1
            if j < n and (
                contains_box(raw_lines[j].strip())
                or internal_double_space(raw_lines[j])
                or is_symbol_line(raw_lines[j])
            ):
                flush()
                mode = "pre"
                pre_buf.append(raw.rstrip())
                i += 1
                continue
            if para:
                flush()
            md.append("- " + stripped)
            i += 1
            continue

        # -- numbered list at column 0 ("1. Input: zero or more.")
        if re.match(r"^\d+\.\s+\S", stripped) and not SECTION_RE.match(stripped):
            if para:
                flush()
            md.append("- " + stripped)
            i += 1
            continue

        # -- standalone label ending with a colon -> sub heading
        if re.match(r"^[^:]{1,45}:$", stripped):
            flush()
            md.append(f"#### {stripped.rstrip(':')}")
            i += 1
            continue

        # -- known standalone sub headings
        if stripped.lower() in ("common mistakes", "quick revision"):
            flush()
            md.append(f"#### {stripped.title()}")
            i += 1
            continue

        # -- "Quick revision" style title case heading without colon
        if (
            len(stripped) <= 45
            and not stripped.endswith(".")
            and re.match(r"^[A-Z][A-Za-z0-9 ,'()&/\-]+$", stripped)
            and not re.match(r"^[A-Z]\.", stripped)
        ):
            nxt = ""
            for j in range(i + 1, n):
                if raw_lines[j].strip():
                    nxt = raw_lines[j]
                    break
            if nxt and (contains_box(nxt) or internal_double_space(nxt)):
                flush()
                md.append(f"#### {stripped}")
                i += 1
                continue
            if nxt and SECTION_RE.match(nxt.strip()):
                flush()
                md.append(f"#### {stripped}")
                i += 1
                continue

        para.append(stripped)
        i += 1

    flush()
    flush_pre()
    return "\n\n".join(md)


# ---------------------------------------------------------------- MCQ parsing

def parse_mcqs(lines):
    """Parse 'Practice Set A — MCQs with Answers' into quiz questions."""
    questions = []
    # locate question starts
    starts = [i for i, ln in enumerate(lines) if MCQ_RE.match(ln.strip())]
    if not starts:
        return questions

    for qi, si in enumerate(starts):
        ei = starts[qi + 1] if qi + 1 < len(starts) else len(lines)
        block = [ln.rstrip() for ln in lines[si:ei]]

        # strip blank lines but keep content order
        content = [ln.strip() for ln in block if ln.strip()]
        if not content:
            continue

        first = MCQ_RE.match(content[0])
        rest = content[1:]
        full = [first.group(2)] + rest if first.group(2) else rest
        text = " ".join(full)

        # split prompt / options / answer
        ans_match = re.search(r"\bAnswer:\s*\(([a-d])\)", text)
        if not ans_match:
            continue
        answer_letter = ans_match.group(1)
        explanation = text[ans_match.end():]
        explanation = re.sub(r"^[\s—–\-–]+", "", explanation).strip()

        before_answer = text[: ans_match.start()].strip()

        # find first option marker
        opt_match = OPT_MARK_RE.search(before_answer)
        if not opt_match:
            continue
        prompt = before_answer[: opt_match.start()].strip()
        options_text = before_answer[opt_match.start():]

        parts = re.split(r"\(([a-d])\)", options_text)
        # parts = [pre, letter, text, letter, text, ...]
        options = []
        for k in range(1, len(parts) - 1, 2):
            letter = parts[k]
            value = parts[k + 1].strip()
            options.append(value)
        if len(options) != 4:
            # malformed; keep what we have padded
            while len(options) < 4:
                options.append("")
            options = options[:4]

        correct_index = ord(answer_letter) - ord("a")
        if correct_index > 3:
            correct_index = 0

        p = prompt.rstrip("?:.,; ")
        if not p.endswith("?"):
            p += "?"
        prompt = p

        questions.append(
            {
                "order": len(questions) + 1,
                "prompt": prompt,
                "options": options,
                "correctIndex": correct_index,
                "explanation": explanation,
            }
        )
    return questions


# ---------------------------------------------------------------- code problem parsing

def parse_code_problems(lines):
    problems = []
    starts = [i for i, ln in enumerate(lines) if CODE_PROBLEM_RE.match(ln.strip())]
    for pi, si in enumerate(starts):
        ei = starts[pi + 1] if pi + 1 < len(starts) else len(lines)
        block = [ln.rstrip() for ln in lines[si:ei]]
        head = CODE_PROBLEM_RE.match(block[0].strip())

        stmt, example, code_lines, complexity = [], [], [], []
        state = None
        for ln in block[1:]:
            s = ln.strip()
            raw_indent = len(ln) - len(ln.lstrip())
            if s.startswith("Statement:"):
                state = "stmt"
                s = s[len("Statement:"):].strip()
            elif s.startswith("Example:"):
                state = "example"
                s = s[len("Example:"):].strip()
            elif s.startswith("Solution:"):
                state = "code"
                s = s[len("Solution:"):].strip()
                if s:
                    code_lines.append(s)
                continue
            elif s.startswith("Complexity:"):
                state = "complexity"
                s = s[len("Complexity:"):].strip()
            elif state == "code" and raw_indent == 0 and PROSE_LABEL_RE.match(s):
                # trailing prose after the solution ("Idea: …", "Note: …", …)
                # must not leak into the code sample
                state = "stmt"
            elif state in (None, "stmt", "example") and 0 < raw_indent <= 2 and s:
                # unlabeled code block (PDF omits "Solution:" sometimes)
                state = "code"
            elif state == "code" and s.startswith(("MODULE ", "Practice Set")):
                state = None

            if state == "stmt" and s:
                stmt.append(s)
            elif state == "example" and s:
                example.append(s)
            elif state == "code":
                code_lines.append(ln.rstrip())
            elif state == "complexity" and s:
                complexity.append(s)

        while code_lines and not code_lines[0].strip():
            code_lines.pop(0)
        while code_lines and not code_lines[-1].strip():
            code_lines.pop()
        # dedent by common leading whitespace
        code = "\n".join(code_lines).strip("\n")
        indent_re = re.compile(r"^ +", re.M)
        indents = [len(m.group(0)) for m in indent_re.finditer(code)]
        if indents:
            common = min(indents)
            code = re.sub(r"^" + " " * common, "", code, flags=re.M)

        problems.append(
            {
                "number": int(head.group(1)),
                "difficulty": head.group(2),
                "title": head.group(3).strip(),
                "statement": " ".join(join_wrapped(stmt)),
                "example": " ".join(join_wrapped(example)),
                "solution": code,
                "complexity": " ".join(join_wrapped(complexity)),
            }
        )
    return problems


def problems_to_markdown(problems):
    out = []
    for p in problems:
        parts = [f"### Code Problem {p['number']} ({p['difficulty']}): {p['title']}", ""]
        if p["statement"]:
            parts += [f"**Statement:** {p['statement']}", ""]
        if p["example"]:
            parts += [f"**Example:** {p['example']}", ""]
        if p["solution"]:
            parts += ["```python", p["solution"], "```", ""]
        if p["complexity"]:
            parts += [f"**Complexity:** {p['complexity']}", ""]
        out.append("\n".join(parts).rstrip())
    return "\n\n".join(out)


# ---------------------------------------------------------------- module parsing

def parse_module(chunk_lines, number, raw_title):
    title = raw_title.strip()
    slug = MODULE_SLUGS.get(title) or slugify(title)

    # ---- locate structural boundaries
    idx_outcomes = idx_secA = idx_secB = None
    first_section = None
    for i, ln in enumerate(chunk_lines):
        s = ln.strip()
        if s == "Learning outcomes" and idx_outcomes is None:
            idx_outcomes = i
        elif s.startswith("Practice Set A") and idx_secA is None:
            idx_secA = i
        elif s.startswith("Practice Set B") and idx_secB is None:
            idx_secB = i
        elif (
            first_section is None
            and idx_secA is None
            and at_col0(ln)
            and SECTION_RE.match(s)
        ):
            first_section = i

    end = len(chunk_lines)
    if idx_secA is None:
        idx_secA = end
    if idx_secB is None:
        idx_secB = end

    # ---- cold open (story)
    header_lines = chunk_lines[: idx_outcomes if idx_outcomes is not None else (first_section or end)]
    cold_open = " ".join(
        ln.strip() for ln in header_lines if ln.strip()
    )

    # ---- learning outcomes
    outcomes = []
    if idx_outcomes is not None:
        stop = first_section if first_section and first_section > idx_outcomes else idx_secA
        raw_out = chunk_lines[idx_outcomes + 1 : stop]
        outcomes = join_wrapped([ln for ln in raw_out if ln.strip()])

    # ---- sections (theory)
    body_end = idx_secA
    body = chunk_lines[(first_section if first_section is not None else 0) : body_end]

    sections = []
    cur = None
    for ln in body:
        s = ln.strip()
        m = SECTION_RE.match(s) if at_col0(ln) and s else None
        if m:
            if cur:
                sections.append(cur)
            cur = {"label": m.group(1), "title": m.group(2).strip(), "lines": []}
        elif cur is not None:
            cur["lines"].append(ln)
    if cur:
        sections.append(cur)

    # ---- quiz (Practice Set A)
    quiz_questions = []
    if idx_secA < end and idx_secB > idx_secA:
        quiz_questions = parse_mcqs(chunk_lines[idx_secA + 1 : idx_secB])

    # ---- code problems (Practice Set B)
    code_problems = []
    if idx_secB < end:
        code_problems = parse_code_problems(chunk_lines[idx_secB + 1 :])

    # ---- append trailing module-level notes (Common mistakes / Quick revision)
    # to the last theory section
    if sections:
        tail_start = None
        for i, ln in enumerate(body):
            if ln.strip().lower() in ("common mistakes", "quick revision"):
                tail_start = i
                break
        if tail_start is not None:
            tail_lines = body[tail_start:]
            sections[-1]["lines"] = sections[-1]["lines"] + [""] + tail_lines

    # ---- build topics
    topics = []
    used_slugs = set()
    for order, sec in enumerate(sections, 1):
        base = slugify(sec["title"]) or f"section-{sec['label']}"
        s = base
        k = 2
        while s in used_slugs:
            s = f"{base}-{k}"
            k += 1
        used_slugs.add(s)
        content = lines_to_markdown(sec["lines"])
        topics.append(
            {
                "order": order,
                "title": f"{sec['label']} {sec['title']}",
                "slug": s,
                "description": sec["title"],
                "content": content,
            }
        )

    return {
        "number": number,
        "title": title,
        "slug": slug,
        "coldOpen": cold_open,
        "outcomes": outcomes,
        "topics": topics,
        "quiz": {"questions": quiz_questions} if quiz_questions else None,
        "practiceProblems": code_problems,
        "practiceProblemsMd": problems_to_markdown(code_problems),
    }


# ---------------------------------------------------------------- main

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "scripts/dsa_notes.txt"
    dst = sys.argv[2] if len(sys.argv) > 2 else "prisma/seed-data/full.json"

    text = open(src, encoding="utf-8").read().replace("\x0c", "\n")
    lines = text.split("\n")

    # module boundaries
    bounds = []
    for i, ln in enumerate(lines):
        m = MODULE_RE.match(ln.lstrip())
        if m and re.match(r"^\s*MODULE", ln):
            bounds.append((i, int(m.group(1)), m.group(2)))
    # safety: only keep ascending numbers
    bounds = [b for idx, b in enumerate(bounds) if idx == 0 or b[1] == bounds[idx - 1][1] + 1]

    modules = []
    for bi, (start, number, mtitle) in enumerate(bounds):
        end = bounds[bi + 1][0] if bi + 1 < len(bounds) else len(lines)
        chunk = lines[start + 1 : end]
        modules.append(parse_module(chunk, number, mtitle))

    result = {"modules": modules}
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1)

    # report
    for m in modules:
        qn = len(m["quiz"]["questions"]) if m["quiz"] else 0
        pn = len(m["practiceProblems"])
        print(
            f"Module {m['number']:>2} | {m['title'][:44]:<44} | "
            f"topics {len(m['topics']):>2} | mcq {qn:>2} | code {pn:>2}"
        )
    print(f"\nWrote {dst}")


if __name__ == "__main__":
    main()
