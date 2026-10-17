import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";
import { modules } from "./seed-data/syllabus";
import type { SeedModule } from "./seed-data/types";

const db = new PrismaClient();

const COURSE = {
  code: "DSA 101",
  slug: "dsa-101",
  title: "Data Structures & Algorithms Foundations",
  level: "Beginner",
  order: 1,
  description:
    "Master data structures and algorithms from first principles. 10 beginner modules taught by Kern, MCQ quizzes, and coding problems — Python & C++ throughout.",
  longDescription:
    "A complete beginner-friendly foundations course: what DSA is, arrays (with sorting & searching), linked lists, stacks, queues, hashing, trees, graphs, how to choose the right structure, and a wrap-up with project ideas. Every module follows the same flow: Kern's intro note, plain-English theory with diagrams, an MCQ quiz (60% passes), and practice problems with worked solutions. Code examples switch between Python and C++.",
  instructor: "KERNAL Platform",
  duration: "8 weeks",
  price: 2699,
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

// All modules in the restructured beginner syllabus are pitched at Beginner level.
const MODULE_DIFFICULTY: Record<number, string> = Object.fromEntries(
  modules.map((m) => [m.number, "Beginner"])
);

async function main() {
  const selection = process.argv[2] ?? "all";

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

  // practice problems live in a sibling JSON (slug -> problems), merged by module slug
  const practiceRaw = readFileSync(
    join(__dirname, "seed-data", "practice.json"),
    "utf-8"
  );
  const practiceMap = JSON.parse(practiceRaw) as Record<string, unknown[]>;

  const course = await db.course.upsert({
    where: { slug: COURSE.slug },
    // create-only for price: manual price edits in the DB survive re-seeds.
    // Everything else is refreshed from the source of truth on every deploy.
    update: { ...COURSE, price: undefined },
    create: COURSE,
  });

  // promo codes — only seeded when the table is empty, so manual edits survive.
  // (Redemptions are also never touched; upserts here are intentionally skipped.)
  const couponCount = await db.coupon.count();
  if (couponCount === 0) {
    const COUPONS = [
      { code: "KERNAL999", type: "SET_PRICE", value: 999 },
      { code: "KERNALFREE", type: "SET_PRICE", value: 0 },
    ];
    for (const c of COUPONS) {
      await db.coupon.create({ data: { ...c, active: true } });
    }
    console.log("Seeded default coupons (KERNAL999, KERNALFREE)");
  }

  for (const m of wanted) {
    // idempotent + user-data-safe: upsert keeping stable IDs so that
    // QuizAttempt / TopicProgress rows survive re-seeding
    const moduleData = {
      order: m.number,
      number: String(m.number).padStart(2, "0"),
      title: m.title,
      slug: m.slug,
      description: m.summary,
      icon: String(m.number).padStart(2, "0"),
      coldOpen: m.intro,
      outcomes: "[]",
      practiceProblems: JSON.stringify(m.practiceProblems ?? practiceMap[m.slug] ?? []),
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
      // codeExample is either a plain string (single language) or a
      // { language: code } map serialized to JSON (rendered as switchable tabs).
      const codeExample =
        typeof t.codeExample === "string"
          ? t.codeExample
          : t.codeExample
            ? JSON.stringify(t.codeExample)
            : null;
      const codeLanguage =
        typeof t.codeExample === "string" && t.codeLanguage
          ? t.codeLanguage
          : t.codeExample && typeof t.codeExample !== "string"
            ? "python" // default tab for multi-language examples
            : t.codeLanguage ?? "python";
      const topicData = {
        order: t.order,
        title: t.title,
        slug: t.slug,
        description: "",
        difficulty: MODULE_DIFFICULTY[m.number] ?? "Beginner",
        content: t.content,
        codeExample,
        codeLanguage,
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
    const quizTitle = m.quiz?.title ?? `Module ${m.number} Quiz`;
    if (m.quiz) {
      const existingQuiz = await db.quiz.findUnique({ where: { moduleId } });
      const quizId = existingQuiz
        ? (
            await db.quiz.update({
              where: { id: existingQuiz.id },
              data: { title: quizTitle, passScore: 60 },
            })
          ).id
        : (
            await db.quiz.create({
              data: {
                moduleId,
                title: quizTitle,
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

  // stale-module cleanup: when seeding the full syllabus, delete modules that
  // were removed from the source (e.g. the old 13-module structure).
  if (selection === "all") {
    const keepModuleSlugs = new Set(modules.map((m) => m.slug));
    const existingModules = await db.module.findMany({
      where: { courseId: course.id },
      select: { id: true, slug: true },
    });
    for (const stale of existingModules) {
      if (!keepModuleSlugs.has(stale.slug)) {
        await db.module.delete({ where: { id: stale.id } });
        console.log(`Removed stale module: ${stale.slug}`);
      }
    }
  }

  const totalModules = await db.module.count({ where: { courseId: course.id } });
  const totalTopics = await db.topic.count({
    where: { module: { courseId: course.id } },
  });
  console.log(`\nCourse: ${course.code} — ${course.title} (${course.slug})`);
  console.log(`Totals: ${totalModules} modules, ${totalTopics} topics`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
