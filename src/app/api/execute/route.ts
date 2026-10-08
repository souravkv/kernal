import { NextRequest, NextResponse } from "next/server";
import { executeCode, runTests, TestCase } from "@/lib/runner/executor";

const MAX_CODE = 100_000;
const MAX_STDIN = 10_000;
const MAX_TEST_CASES = 20;

// Playground supports only Python + JavaScript: no compilers (gcc/g++/javac)
// exist on the serverless runtime, and python3 runs via the api/pyexec.py
// sidecar (Python runtime) when the local binary is missing.
const ALLOWED_LANGS = new Set(["python", "python3", "javascript", "js", "nodejs"]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { language, code, stdin, mode } = body;

    if (!language || typeof language !== "string" || typeof code !== "string") {
      return NextResponse.json({ error: "Language and code are required" }, { status: 400 });
    }
    if (!ALLOWED_LANGS.has(language.toLowerCase())) {
      return NextResponse.json(
        { error: `Language "${language}" is not available on this platform — use Python or JavaScript.` },
        { status: 400 }
      );
    }
    if (code.length > MAX_CODE) {
      return NextResponse.json({ error: "Code too large" }, { status: 413 });
    }
    if (stdin && String(stdin).length > MAX_STDIN) {
      return NextResponse.json({ error: "Input too large" }, { status: 413 });
    }

    if (mode === "test") {
      const testCases: TestCase[] = Array.isArray(body.testCases) ? body.testCases : [];
      if (testCases.length === 0 || testCases.length > MAX_TEST_CASES) {
        return NextResponse.json({ error: "Invalid test cases" }, { status: 400 });
      }
      if (!testCases.every((tc) => typeof tc?.input === "string" && typeof tc?.expected === "string")) {
        return NextResponse.json({ error: "Invalid test cases" }, { status: 400 });
      }
      const result = await runTests(language, code, testCases);
      return NextResponse.json(result);
    }

    const result = await executeCode(language, code, String(stdin || ""));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Execution failed", details: String(error) },
      { status: 500 }
    );
  }
}
