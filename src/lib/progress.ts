import { db } from "@/lib/db";

// Serializable progress snapshot for one user (safe to pass to client components).

export interface ModuleProgressStat {
  doneTopics: number;
  totalTopics: number;
  complete: boolean; // every topic in the module is marked complete
  hasQuiz: boolean;
  quizPassed: boolean;
  quizBest: number | null; // best score % across attempts
  quizPassScore: number;
}

export interface CourseProgressStat {
  doneTopics: number;
  totalTopics: number;
  percent: number; // topics-based 0-100
  modulesComplete: number;
  modulesTotal: number;
  quizzesPassed: number;
  quizzesTotal: number;
}

export interface UserProgress {
  topicDone: Record<string, boolean>;
  moduleStats: Record<string, ModuleProgressStat>;
  courseStats: Record<string, CourseProgressStat>;
}

export const emptyProgress = (): UserProgress => ({
  topicDone: {},
  moduleStats: {},
  courseStats: {},
});

export async function getUserProgress(userId: string): Promise<UserProgress> {
  const [modules, topicRows, attempts] = await Promise.all([
    db.module.findMany({
      select: {
        id: true,
        courseId: true,
        _count: { select: { topics: true } },
        quiz: { select: { passScore: true, _count: { select: { questions: true } } } },
      },
    }),
    db.topicProgress.findMany({
      where: { userId },
      select: { topicId: true, topic: { select: { moduleId: true } } },
    }),
    db.quizAttempt.findMany({
      where: { userId },
      select: {
        score: true,
        quiz: { select: { moduleId: true } },
      },
    }),
  ]);

  const progress = emptyProgress();

  const doneByModule: Record<string, number> = {};
  for (const row of topicRows) {
    progress.topicDone[row.topicId] = true;
    doneByModule[row.topic.moduleId] = (doneByModule[row.topic.moduleId] ?? 0) + 1;
  }

  const bestByModule: Record<string, number> = {};
  for (const a of attempts) {
    const mid = a.quiz.moduleId;
    bestByModule[mid] = Math.max(bestByModule[mid] ?? 0, a.score);
  }

  const courseAgg: Record<
    string,
    {
      doneTopics: number;
      totalTopics: number;
      modulesComplete: number;
      modulesTotal: number;
      quizzesPassed: number;
      quizzesTotal: number;
    }
  > = {};

  for (const mod of modules) {
    const totalTopics = mod._count.topics;
    const doneTopics = Math.min(doneByModule[mod.id] ?? 0, totalTopics);
    const hasQuiz = !!mod.quiz && mod.quiz._count.questions > 0;
    const quizBest = hasQuiz ? bestByModule[mod.id] ?? null : null;
    const quizPassed = hasQuiz && quizBest !== null && quizBest >= mod.quiz!.passScore;

    progress.moduleStats[mod.id] = {
      doneTopics,
      totalTopics,
      complete: totalTopics > 0 && doneTopics === totalTopics,
      hasQuiz,
      quizPassed,
      quizBest,
      quizPassScore: mod.quiz?.passScore ?? 60,
    };

    const agg = (courseAgg[mod.courseId] ??= {
      doneTopics: 0,
      totalTopics: 0,
      modulesComplete: 0,
      modulesTotal: 0,
      quizzesPassed: 0,
      quizzesTotal: 0,
    });
    agg.doneTopics += doneTopics;
    agg.totalTopics += totalTopics;
    agg.modulesTotal += 1;
    if (totalTopics > 0 && doneTopics === totalTopics) agg.modulesComplete += 1;
    if (hasQuiz) {
      agg.quizzesTotal += 1;
      if (quizPassed) agg.quizzesPassed += 1;
    }
  }

  for (const [courseId, agg] of Object.entries(courseAgg)) {
    const total = agg.totalTopics + agg.quizzesTotal;
    progress.courseStats[courseId] = {
      ...agg,
      percent:
        total > 0
          ? Math.round(((agg.doneTopics + agg.quizzesPassed) / total) * 100)
          : 0,
    };
  }

  return progress;
}
