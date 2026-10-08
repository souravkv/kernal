import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  let body: { quizId?: string; answers?: number[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { quizId, answers } = body;
  if (!quizId || !Array.isArray(answers)) {
    return NextResponse.json(
      { error: "quizId and answers are required" },
      { status: 400 }
    );
  }
  if (answers.length > 100 || !answers.every((a) => Number.isInteger(a))) {
    return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
  }

  const questions = await db.quizQuestion.findMany({
    where: { quizId },
    orderBy: { order: "asc" },
  });

  if (questions.length === 0) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }
  if (answers.length !== questions.length) {
    return NextResponse.json(
      { error: "Answer count does not match question count" },
      { status: 400 }
    );
  }

  // score on the server — correctIndex never reaches the browser before grading
  const results = questions.map((q, i) => {
    const chosen = answers[i];
    return {
      correct: chosen === q.correctIndex,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    };
  });

  const correctCount = results.filter((r) => r.correct).length;
  const score = Math.round((correctCount / questions.length) * 100);

  const quiz = await db.quiz.findUnique({ where: { id: quizId } });
  const passScore = quiz?.passScore ?? 60;
  const passed = score >= passScore;

  // persist attempt when signed in
  let saved = false;
  const session = await auth();
  if (session?.user?.id && quiz) {
    await db.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId,
        score,
        answers: JSON.stringify(answers),
      },
    });
    saved = true;
  }

  return NextResponse.json({
    score,
    passed,
    correctCount,
    results,
    saved,
  });
}
