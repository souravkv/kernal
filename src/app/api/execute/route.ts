import { NextRequest, NextResponse } from "next/server";
import { executeCode, runTests, TestCase } from "@/lib/runner/executor";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { language, code, stdin, mode } = body;

    if (!language || !code) {
      return NextResponse.json({ error: "Language and code are required" }, { status: 400 });
    }

    if (mode === "test") {
      const testCases: TestCase[] = body.testCases || [];
      if (testCases.length === 0) {
        return NextResponse.json({ error: "No test cases provided" }, { status: 400 });
      }
      const result = await runTests(language, code, testCases);
      return NextResponse.json(result);
    }

    const result = await executeCode(language, code, stdin || "");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Execution failed", details: String(error) },
      { status: 500 }
    );
  }
}
