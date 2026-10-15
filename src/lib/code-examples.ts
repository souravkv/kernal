export type ParsedCodeExample =
  | { kind: "single"; code: string; language: string }
  | { kind: "multi"; codes: Record<string, string> }
  | null;

/**
 * Topic.codeExample may be either a plain code string, or a JSON object of
 * { language: code } pairs — the latter renders as switchable tabs.
 */
export function parseCodeExample(
  raw: string | null | undefined,
  fallbackLanguage = "python"
): ParsedCodeExample {
  if (!raw || !raw.trim()) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const entries = Object.entries(parsed as Record<string, unknown>).filter(
        (e): e is [string, string] => typeof e[1] === "string"
      );
      if (entries.length > 0) {
        return { kind: "multi", codes: Object.fromEntries(entries) };
      }
    }
  } catch {
    /* not JSON — plain code string */
  }
  return { kind: "single", code: raw, language: fallbackLanguage };
}
