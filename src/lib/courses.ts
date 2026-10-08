import { cache } from "react";
import { db } from "@/lib/db";

// ---------- serializable types (safe to pass to client components) ----------

export interface CodeProblem {
  number: number;
  title: string;
  difficulty: string;
  statement: string;
  example: string;
  solution: string;
  complexity: string;
}

export interface TopicRef {
  id: string;
  slug: string;
  title: string;
}

export interface CourseSummary {
  id: string;
  code: string;
  slug: string;
  title: string;
  level: string;
  order: number;
  description: string;
  duration: string;
  price: number;
  rating: number;
  students: number;
  tags: string[];
  moduleCount: number;
  topicCount: number;
}

export interface ModuleSummary {
  id: string;
  number: string;
  order: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  topicCount: number;
  hasQuiz: boolean;
  questionCount: number;
  topics: TopicRef[];
}

export interface CourseDetail extends CourseSummary {
  longDescription: string;
  instructor: string;
  modules: ModuleSummary[];
}

export interface TopicDetail {
  id: string;
  order: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  content: string;
  codeExample: string | null;
  codeLanguage: string | null;
}

export interface ModuleDetail extends ModuleSummary {
  coldOpen: string;
  outcomes: string[];
  practiceProblems: CodeProblem[];
  topics: TopicDetail[];
  quiz: { id: string; title: string; passScore: number; questionCount: number } | null;
}

export interface QuizQuestionPublic {
  id: string;
  order: number;
  prompt: string;
  options: string[];
}

// ---------- helpers ----------

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ---------- queries ----------

const courseInclude = {
  modules: {
    orderBy: { order: "asc" } as const,
    include: {
      topics: {
        orderBy: { order: "asc" } as const,
        select: { id: true, slug: true, title: true },
      },
      _count: { select: { topics: true } },
      quiz: { include: { _count: { select: { questions: true } } } },
    },
  },
  _count: { select: { modules: true } },
};

type CourseRow = {
  id: string;
  code: string;
  slug: string;
  title: string;
  level: string;
  order: number;
  description: string;
  duration: string;
  price: number;
  rating: number;
  students: number;
  tags: string;
  longDescription: string;
  instructor: string;
  modules: {
    id: string;
    number: string;
    order: number;
    title: string;
    slug: string;
    description: string;
    icon: string;
    _count: { topics: number };
    topics: { id: string; slug: string; title: string }[];
    quiz: { _count: { questions: number } } | null;
  }[];
};

function mapCourse(c: CourseRow): CourseDetail {
  return {
    id: c.id,
    code: c.code,
    slug: c.slug,
    title: c.title,
    level: c.level,
    order: c.order,
    description: c.description,
    duration: c.duration,
    price: c.price,
    rating: c.rating,
    students: c.students,
    tags: parseJson<string[]>(c.tags, []),
    moduleCount: c.modules.length,
    topicCount: c.modules.reduce((a, m) => a + m._count.topics, 0),
    longDescription: c.longDescription,
    instructor: c.instructor,
    modules: c.modules.map((m) => ({
      id: m.id,
      number: m.number,
      order: m.order,
      title: m.title,
      slug: m.slug,
      description: m.description,
      icon: m.icon,
      topicCount: m._count.topics,
      hasQuiz: !!m.quiz,
      questionCount: m.quiz?._count.questions ?? 0,
      topics: m.topics,
    })),
  };
}

// cache(): generateMetadata + page share one query set per request
export const getAllCourses = cache(async (): Promise<CourseDetail[]> => {
  const courses = await db.course.findMany({
    orderBy: { order: "asc" },
    include: courseInclude,
  });
  return courses.map(mapCourse);
});

export const getCourseBySlug = cache(
  async (slug: string): Promise<CourseDetail | null> => {
    const course = await db.course.findFirst({
      where: { slug },
      include: courseInclude,
    });
    return course ? mapCourse(course) : null;
  }
);

export const getModuleDetail = cache(
  async (
    courseSlug: string,
    moduleSlug: string
  ): Promise<{ course: CourseDetail; module: ModuleDetail } | null> => {
    const [mod, course] = await Promise.all([
      db.module.findFirst({
        where: { slug: moduleSlug, course: { slug: courseSlug } },
        include: {
          topics: { orderBy: { order: "asc" } },
          quiz: { include: { _count: { select: { questions: true } } } },
          course: true,
        },
      }),
      getCourseBySlug(courseSlug),
    ]);
    if (!mod || !course) return null;

  return {
    course,
    module: {
      id: mod.id,
      number: mod.number,
      order: mod.order,
      title: mod.title,
      slug: mod.slug,
      description: mod.description,
      icon: mod.icon,
      coldOpen: mod.coldOpen,
      outcomes: parseJson<string[]>(mod.outcomes, []),
      practiceProblems: parseJson<CodeProblem[]>(mod.practiceProblems, []),
      topicCount: mod.topics.length,
      topics: mod.topics.map((t) => ({
        id: t.id,
        order: t.order,
        title: t.title,
        slug: t.slug,
        description: t.description,
        difficulty: t.difficulty,
        content: t.content,
        codeExample: t.codeExample,
        codeLanguage: t.codeLanguage,
      })),
      hasQuiz: !!mod.quiz,
      questionCount: mod.quiz?._count.questions ?? 0,
      quiz: mod.quiz
        ? {
            id: mod.quiz.id,
            title: mod.quiz.title,
            passScore: mod.quiz.passScore,
            questionCount: mod.quiz._count.questions,
          }
        : null,
    },
  };
  }
);

export interface TopicContext {
  course: CourseDetail;
  module: ModuleDetail;
  topic: TopicDetail;
  prev: { moduleSlug: string; topic: TopicRef } | null;
  next: { moduleSlug: string; topic: TopicRef } | null;
}

export const getTopicDetail = cache(
  async (
    courseSlug: string,
    moduleSlug: string,
    topicSlug: string
  ): Promise<TopicContext | null> => {
    const [ctx, rows] = await Promise.all([
      getModuleDetail(courseSlug, moduleSlug),
      // flat order across the whole course (single query)
      db.topic.findMany({
        where: { module: { course: { slug: courseSlug } } },
        orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
        select: {
          slug: true,
          title: true,
          id: true,
          module: { select: { slug: true } },
        },
      }),
    ]);
    if (!ctx) return null;
    const topic = ctx.module.topics.find((t) => t.slug === topicSlug);
    if (!topic) return null;

    const flat = rows.map((r) => ({
      moduleSlug: r.module.slug,
      topic: { id: r.id, slug: r.slug, title: r.title },
    }));
    const idx = flat.findIndex(
      (f) => f.moduleSlug === moduleSlug && f.topic.slug === topicSlug
    );

    return {
      ...ctx,
      topic,
      prev: idx > 0 ? flat[idx - 1] : null,
      next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
    };
  }
);

export const getQuizForModule = cache(
  async (
    courseSlug: string,
    moduleSlug: string
  ): Promise<
    | {
        course: CourseDetail;
        module: ModuleDetail;
        quiz: { id: string; title: string; passScore: number };
        questions: QuizQuestionPublic[];
      }
    | null
  > => {
    const ctx = await getModuleDetail(courseSlug, moduleSlug);
    if (!ctx || !ctx.module.quiz) return null;

    const questions = await db.quizQuestion.findMany({
      where: { quizId: ctx.module.quiz.id },
      orderBy: { order: "asc" },
    });

    return {
      course: ctx.course,
      module: ctx.module,
      quiz: {
        id: ctx.module.quiz.id,
        title: ctx.module.quiz.title,
        passScore: ctx.module.quiz.passScore,
      },
      // NOTE: correctIndex is intentionally NOT sent to the client
      questions: questions.map((q) => ({
        id: q.id,
        order: q.order,
        prompt: q.prompt,
        options: parseJson<string[]>(q.options, []),
      })),
    };
  }
);
