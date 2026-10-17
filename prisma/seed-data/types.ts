export interface SeedTopic {
  order: number;
  title: string;
  slug: string;
  /** Tutorial-style body, written as Kern teaching. Supports **Note:** callouts. */
  content: string;
  /** Plain code string (renders as one block) or { language: code } map (rendered as switchable tabs). */
  codeExample?: string | Record<string, string>;
  codeLanguage?: string;
}

export interface SeedQuizQuestion {
  order: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SeedModule {
  number: number;
  title: string;
  slug: string;
  /** One-line summary shown under the module title (course overview + module page). */
  summary: string;
  /** Kern's opening note for the module (shown at the top of the module page). */
  intro: string;
  topics: SeedTopic[];
  quiz: {
    title?: string;
    questions: SeedQuizQuestion[];
  } | null;
  /** Filled in by seed.ts from practice.json (kept out of syllabus prose for clarity). */
  practiceProblems?: unknown[];
}
