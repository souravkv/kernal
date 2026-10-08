import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let body: { topicId?: string; done?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { topicId, done } = body;
  if (!topicId || typeof done !== "boolean") {
    return NextResponse.json(
      { error: "topicId and done are required" },
      { status: 400 }
    );
  }

  const userId = session.user.id;

  try {
    if (done) {
      await db.topicProgress.upsert({
        where: { userId_topicId: { userId, topicId } },
        update: {},
        create: { userId, topicId },
      });
    } else {
      await db.topicProgress.deleteMany({ where: { userId, topicId } });
    }
  } catch {
    // FK violation — topicId does not exist
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  return NextResponse.json({ completed: done });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ signedIn: false, completedTopics: 0, totalTopics: 0, attempts: [] });
  }

  const userId = session.user.id;
  const [completedTopics, totalTopics, attempts] = await Promise.all([
    db.topicProgress.count({ where: { userId } }),
    db.topic.count(),
    db.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { quiz: { include: { module: { select: { number: true, title: true } } } } },
    }),
  ]);

  return NextResponse.json({
    signedIn: true,
    completedTopics,
    totalTopics,
    attempts: attempts.map((a) => ({
      score: a.score,
      date: a.createdAt,
      moduleNumber: a.quiz.module.number,
      moduleTitle: a.quiz.module.title,
    })),
  });
}
