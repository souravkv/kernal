import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const db = new PrismaClient();

const COURSE = {
  code: "DSA 101",
  slug: "dsa-101",
  title: "Data Structures & Algorithms Foundations",
  level: "Beginner",
  order: 1,
  description:
    "Master data structures and algorithms from first principles. 13 modules, theory, MCQ quizzes, and coding problems — built on Lipschutz & Aho, Hopcroft & Ullman.",
  longDescription:
    "A beginner-to-intermediate foundations course covering data, algorithms, complexity, arrays, strings, recursion, searching, sorting, linked lists, stacks, queues, trees, graphs and hashing. Every module follows the same flow: story-driven intro, theory notes, an MCQ quiz, and coding problems with worked solutions.",
  instructor: "KERNAL Platform",
  duration: "12 weeks",
  price: 99,
  rating: 4.9,
  students: 2847,
  tags: JSON.stringify([
    "DSA",
    "Python",
    "C++",
    "Java",
    "Interview Prep",
    "CS Fundamentals",
  ]),
};

const MODULE_DIFFICULTY: Record<number, string> = {
  ...Object.fromEntries([1, 2, 3, 4, 5, 6].map((i) => [i, "Beginner"])),
  ...Object.fromEntries([7, 8, 9].map((i) => [i, "Intermediate"])),
  ...Object.fromEntries([10, 11, 12].map((i) => [i, "Advanced"])),
  13: "Intermediate",
};

interface SeedModule {
  number: number;
  title: string;
  slug: string;
  coldOpen: string;
  outcomes: string[];
  topics: {
    order: number;
    title: string;
    slug: string;
    description: string;
    content: string;
  }[];
  quiz: {
    questions: {
      order: number;
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }[];
  } | null;
  practiceProblems: unknown[];
}

async function main() {
  const selection = process.argv[2] ?? "all";
  const raw = readFileSync(
    join(__dirname, "seed-data", "full.json"),
    "utf-8"
  );
  const { modules } = JSON.parse(raw) as { modules: SeedModule[] };

  const wanted =
    selection === "all"
      ? modules
      : modules.filter((m) =>
          selection.split(",").map(Number).includes(m.number)
        );

  if (wanted.length === 0) {
    console.error(`No modules matched selection "${selection}"`);
    process.exit(1);
  }

  const course = await db.course.upsert({
    where: { slug: COURSE.slug },
    update: COURSE,
    create: COURSE,
  });

  for (const m of wanted) {
    // idempotent + user-data-safe: upsert keeping stable IDs so that
    // QuizAttempt / TopicProgress rows survive re-seeding
    const moduleData = {
      order: m.number,
      number: String(m.number).padStart(2, "0"),
      title: m.title,
      slug: m.slug,
      description: m.outcomes[0] ?? "",
      icon: String(m.number).padStart(2, "0"),
      coldOpen: m.coldOpen,
      outcomes: JSON.stringify(m.outcomes),
      practiceProblems: JSON.stringify(m.practiceProblems),
    };

    const existingModule = await db.module.findFirst({
      where: { courseId: course.id, slug: m.slug },
    });
    const moduleId = existingModule
      ? (await db.module.update({
          where: { id: existingModule.id },
          data: moduleData,
        })).id
      : (await db.module.create({
          data: { ...moduleData, courseId: course.id },
        })).id;

    // topics: upsert by (moduleId, slug); drop topics removed from the source
    const existingTopics = await db.topic.findMany({ where: { moduleId } });
    const keepSlugs = new Set(m.topics.map((t) => t.slug));
    for (const t of m.topics) {
      const topicData = {
        order: t.order,
        title: t.title,
        slug: t.slug,
        description: t.description,
        difficulty: MODULE_DIFFICULTY[m.number] ?? "Beginner",
        content: t.content,
        codeLanguage: "python",
        practiceProblems: "[]",
      };
      const existing = existingTopics.find((x) => x.slug === t.slug);
      if (existing) {
        await db.topic.update({ where: { id: existing.id }, data: topicData });
      } else {
        await db.topic.create({ data: { ...topicData, moduleId } });
      }
    }
    for (const stale of existingTopics) {
      if (!keepSlugs.has(stale.slug)) {
        await db.topic.delete({ where: { id: stale.id } });
      }
    }

    // quiz: upsert by moduleId (stable id keeps attempts), then refresh questions
    if (m.quiz) {
      const existingQuiz = await db.quiz.findUnique({ where: { moduleId } });
      const quizId = existingQuiz
        ? (
            await db.quiz.update({
              where: { id: existingQuiz.id },
              data: { title: `Module ${m.number} Quiz`, passScore: 60 },
            })
          ).id
        : (
            await db.quiz.create({
              data: {
                moduleId,
                title: `Module ${m.number} Quiz`,
                passScore: 60,
              },
            })
          ).id;

      await db.quizQuestion.deleteMany({ where: { quizId } });
      if (m.quiz.questions.length > 0) {
        await db.quizQuestion.createMany({
          data: m.quiz.questions.map((q) => ({
            quizId,
            order: q.order,
            prompt: q.prompt,
            options: JSON.stringify(q.options),
            correctIndex: q.correctIndex,
            explanation: q.explanation,
          })),
        });
      }
    } else {
      await db.quiz.deleteMany({ where: { moduleId } });
    }

    const topicCount = await db.topic.count({ where: { moduleId } });
    console.log(
      `Seeded module ${m.number}: ${m.title} (${topicCount} topics, ${
        m.quiz?.questions.length ?? 0
      } questions)`
    );
  }

  console.log(`\nCourse: ${course.code} — ${course.title} (${course.slug})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
