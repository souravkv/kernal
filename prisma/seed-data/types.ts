export interface SeedTopic {
  order: number;
  title: string;
  slug: string;
  description: string;
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
  coldOpen: string;
  outcomes: string[];
  topics: SeedTopic[];
  quiz: {
    title?: string;
    questions: SeedQuizQuestion[];
  } | null;
  /** Filled in by seed.ts from practice.json (kept out of syllabus prose for clarity). */
  practiceProblems?: unknown[];
}
