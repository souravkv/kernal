import { execSync, spawn } from "child_process";
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const TIMEOUT_MS = 10000;
const WORK_DIR = join(tmpdir(), "kernal-runner");

if (!existsSync(WORK_DIR)) {
  mkdirSync(WORK_DIR, { recursive: true });
}

interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  time: number;
  memory: number;
  compileOutput?: string;
}

function getExt(lang: string): string {
  const map: Record<string, string> = {
    python: "py", python3: "py", javascript: "js", nodejs: "js",
    cpp: "cpp", "c++": "cpp", c: "c", java: "java", typescript: "ts",
  };
  return map[lang.toLowerCase()] || "txt";
}

function runCommand(cmd: string, args: string[], input: string, timeout: number): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, {
      timeout,
      maxBuffer: 1024 * 1024,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });

    if (input) {
      proc.stdin.write(input);
      proc.stdin.end();
    }

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      stderr += "\nTime Limit Exceeded";
    }, timeout);

    proc.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout: stdout.slice(0, 50000), stderr: stderr.slice(0, 50000), exitCode: code ?? 1 });
    });

    proc.on("error", () => {
      clearTimeout(timer);
      resolve({ stdout: "", stderr: "Process spawn error", exitCode: 1 });
    });
  });
}

async function runPython(code: string, stdin: string): Promise<RunResult> {
  const start = Date.now();
  const file = join(WORK_DIR, `run_${Date.now()}.py`);
  writeFileSync(file, code);
  try {
    const result = await runCommand("python3", [file], stdin, TIMEOUT_MS);
    return { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode, time: Date.now() - start, memory: 0 };
  } finally {
    try { unlinkSync(file); } catch {}
  }
}

async function runNode(code: string, stdin: string): Promise<RunResult> {
  const start = Date.now();
  const file = join(WORK_DIR, `run_${Date.now()}.js`);
  writeFileSync(file, code);
  try {
    const result = await runCommand("node", ["--max-old-space-size=128", file], stdin, TIMEOUT_MS);
    return { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode, time: Date.now() - start, memory: 0 };
  } finally {
    try { unlinkSync(file); } catch {}
  }
}

async function runCpp(code: string, stdin: string): Promise<RunResult> {
  const start = Date.now();
  const id = `run_${Date.now()}`;
  const srcFile = join(WORK_DIR, `${id}.cpp`);
  const binFile = join(WORK_DIR, `${id}.out`);
  writeFileSync(srcFile, code);

  try {
    const compile = await runCommand("g++", ["-O2", "-o", binFile, srcFile, "-std=c++17"], "", 8000);
    if (compile.exitCode !== 0) {
      return { stdout: "", stderr: compile.stderr || compile.stdout, exitCode: 1, time: 0, memory: 0, compileOutput: compile.stderr };
    }
    const result = await runCommand(binFile, [], stdin, TIMEOUT_MS);
    return { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode, time: Date.now() - start, memory: 0 };
  } finally {
    try { unlinkSync(srcFile); } catch {}
    try { unlinkSync(binFile); } catch {}
  }
}

async function runC(code: string, stdin: string): Promise<RunResult> {
  const start = Date.now();
  const id = `run_${Date.now()}`;
  const srcFile = join(WORK_DIR, `${id}.c`);
  const binFile = join(WORK_DIR, `${id}.out`);
  writeFileSync(srcFile, code);

  try {
    const compile = await runCommand("gcc", ["-O2", "-o", binFile, srcFile, "-lm"], "", 8000);
    if (compile.exitCode !== 0) {
      return { stdout: "", stderr: compile.stderr || compile.stdout, exitCode: 1, time: 0, memory: 0, compileOutput: compile.stderr };
    }
    const result = await runCommand(binFile, [], stdin, TIMEOUT_MS);
    return { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode, time: Date.now() - start, memory: 0 };
  } finally {
    try { unlinkSync(srcFile); } catch {}
    try { unlinkSync(binFile); } catch {}
  }
}

async function runJava(code: string, stdin: string): Promise<RunResult> {
  const start = Date.now();
  const id = `Run_${Date.now()}`;
  const dir = join(WORK_DIR, id);
  mkdirSync(dir, { recursive: true });

  const className = code.match(/class\s+(\w+)/)?.[1] || "Main";
  const srcFile = join(dir, `${className}.java`);
  writeFileSync(srcFile, code);

  try {
    const compile = await runCommand("javac", ["-d", dir, srcFile], "", 10000);
    if (compile.exitCode !== 0) {
      return { stdout: "", stderr: compile.stderr || compile.stdout, exitCode: 1, time: 0, memory: 0, compileOutput: compile.stderr };
    }
    const result = await runCommand("java", ["-cp", dir, className], stdin, TIMEOUT_MS);
    return { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode, time: Date.now() - start, memory: 0 };
  } finally {
    try { require("fs").rmSync(dir, { recursive: true, force: true }); } catch {}
  }
}

export async function executeCode(language: string, code: string, stdin: string = ""): Promise<RunResult> {
  const lang = language.toLowerCase();
  switch (lang) {
    case "python": case "python3": return runPython(code, stdin);
    case "javascript": case "js": case "nodejs": return runNode(code, stdin);
    case "cpp": case "c++": return runCpp(code, stdin);
    case "c": return runC(code, stdin);
    case "java": return runJava(code, stdin);
    default: return { stdout: "", stderr: `Unsupported language: ${language}`, exitCode: 1, time: 0, memory: 0 };
  }
}

function normalizeOutput(s: string): string {
  return s
    .trim()
    .replace(/[\[\]()]/g, "")
    .replace(/,/g, "\n")
    .split(/[\s\n]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join("\n")
    .toLowerCase();
}

export interface TestCase {
  input: string;
  expected: string;
  hidden?: boolean;
}

export interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  got: string;
  time: number;
  exitCode: number;
}

export async function runTests(
  language: string,
  code: string,
  testCases: TestCase[]
): Promise<{ allPassed: boolean; results: TestResult[]; totalTime: number }> {
  const results: TestResult[] = [];
  let totalTime = 0;

  for (const tc of testCases) {
    const result = await executeCode(language, code, tc.input);
    const got = result.stdout.trim();
    const expected = tc.expected.trim();
    const passed = result.exitCode === 0 && normalizeOutput(got) === normalizeOutput(expected);

    results.push({
      passed,
      input: tc.input,
      expected,
      got,
      time: result.time,
      exitCode: result.exitCode,
    });

    totalTime += result.time;

    if (!passed && result.exitCode !== 0) break;
  }

  return {
    allPassed: results.every((r) => r.passed),
    results,
    totalTime,
  };
}
