"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Send, RotateCcw, ChevronDown, ChevronRight, Check, X, Loader2, Eye, EyeOff } from "lucide-react";
import { practiceProblems, Problem } from "@/data/problems";

const langMap: Record<string, string> = {
  python: "python", javascript: "javascript", cpp: "cpp", java: "java", c: "c",
};

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  got: string;
  time: number;
}

export default function PracticePage() {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(practiceProblems[0]);
  const [selectedLang, setSelectedLang] = useState("python");
  const [code, setCode] = useState(practiceProblems[0].starterCode.python);
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"run" | "tests">("run");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showBoilerplate, setShowBoilerplate] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const scrollToOutput = useCallback(() => {
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }, []);

  const handleProblemChange = (problem: Problem) => {
    setSelectedProblem(problem);
    setCode(problem.starterCode[selectedLang] || problem.starterCode.python);
    setOutput("");
    setTestResults(null);
  };

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    setCode(selectedProblem.starterCode[lang] || "");
    setLangDropdownOpen(false);
    setTestResults(null);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab("run");
    setOutput("Running...");
    setTestResults(null);
    scrollToOutput();

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selectedLang, code, stdin: "" }),
      });
      const data = await response.json();
      setOutput(data.stderr || data.stdout || data.compileOutput || "No output");
    } catch {
      setOutput("Error: Could not execute code.");
    }
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setActiveTab("tests");
    setTestResults(null);
    setOutput("");
    scrollToOutput();

    try {
      const allTests = [...selectedProblem.testCases, ...selectedProblem.hiddenTestCases];
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selectedLang, code, mode: "test", testCases: allTests }),
      });
      const data = await response.json();
      setTestResults(data.results);
    } catch {
      setOutput("Error: Submission failed.");
    }
    setIsSubmitting(false);
  };

  const passedCount = testResults ? testResults.filter((r) => r.passed).length : 0;
  const totalCount = testResults ? testResults.length : 0;
  const allPassed = testResults ? testResults.every((r) => r.passed) : false;

  // Extract only the function part from starter code
  const getFunctionCode = (code: string): string => {
    const lines = code.split("\n");
    const fnStart = lines.findIndex((l) => l.trim().startsWith("def ") || l.trim().startsWith("function ") || l.trim().startsWith("int ") || l.trim().startsWith("void ") || l.trim().startsWith("public static"));
    if (fnStart === -1) return code;
    const commentIdx = lines.findIndex((l, i) => i > fnStart && (l.trim().startsWith("# Test") || l.trim().startsWith("// Test") || l.trim().startsWith("int main") || l.trim().startsWith("public static void main")));
    if (commentIdx === -1) return code;
    return lines.slice(fnStart, commentIdx).join("\n");
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 sm:py-24">
      <span className="body-xs text-[var(--muted)] mb-3 block tracking-[0.3em]">Playground</span>
      <h1 className="heading-lg mb-2">Code</h1>
      <p className="body-lg mb-8 max-w-lg text-[var(--muted)]">Solve problems, run code, and test against test cases.</p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        {/* Problem Panel */}
        <div className="border border-[var(--border)] bg-[var(--surface)] flex flex-col max-h-[calc(100vh-200px)]">
          <div className="border-b border-[var(--border)] p-3">
            <div className="space-y-0.5">
              {practiceProblems.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProblemChange(p)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left transition-all ${
                    selectedProblem.id === p.id ? "bg-[var(--fg)] text-[var(--bg)]" : "hover:bg-[var(--surface-alt)]"
                  }`}
                >
                  <span className={`text-[10px] font-medium ${
                    selectedProblem.id === p.id ? "opacity-60" : p.difficulty === "Easy" ? "text-green-500" : p.difficulty === "Medium" ? "text-amber-500" : "text-red-500"
                  }`}>{p.difficulty.charAt(0)}</span>
                  <span className="body-sm truncate flex-1">{p.title}</span>
                  {selectedProblem.id === p.id && <ChevronRight className="h-3 w-3 opacity-60" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="heading-sm">{selectedProblem.title}</h3>
              <span className={`text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 ${
                selectedProblem.difficulty === "Easy" ? "text-green-500 bg-green-500/10" : selectedProblem.difficulty === "Medium" ? "text-amber-500 bg-amber-500/10" : "text-red-500 bg-red-500/10"
              }`}>{selectedProblem.difficulty}</span>
            </div>

            <div className="body-sm text-[var(--muted)] whitespace-pre-wrap mb-4 leading-relaxed">{selectedProblem.description}</div>

            <div className="space-y-3">
              {selectedProblem.examples.map((ex, i) => (
                <div key={i} className="border border-[var(--border)] p-3">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted)] mb-1.5">Example {i + 1}</div>
                  <div className="text-[11px] font-mono space-y-0.5">
                    <div><span className="text-[var(--muted)]">Input:</span> {ex.input}</div>
                    <div><span className="text-[var(--muted)]">Output:</span> {ex.output}</div>
                    {ex.explanation && <div className="text-[var(--muted)] mt-1">{ex.explanation}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <h4 className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted)] mb-1">Constraints</h4>
              <ul className="space-y-0.5">
                {selectedProblem.constraints.map((c, i) => (
                  <li key={i} className="text-[11px] font-mono text-[var(--muted)]">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Editor + Output */}
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[12px] font-light transition-all hover:border-[var(--fg)]"
                >
                  {selectedLang}
                  <ChevronDown className="h-3 w-3 text-[var(--muted)]" />
                </button>
                {langDropdownOpen && (
                  <div className="absolute top-full left-0 z-10 mt-1 w-36 border border-[var(--border)] bg-[var(--surface)]">
                    {Object.keys(langMap).map((lang) => (
                      <button key={lang} onClick={() => handleLangChange(lang)}
                        className="w-full px-3 py-2 text-left text-[12px] font-light transition-colors hover:bg-[var(--surface-alt)]">
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowBoilerplate(!showBoilerplate)}
                className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                title={showBoilerplate ? "Hide boilerplate" : "Show boilerplate (main/test code)"}
              >
                {showBoilerplate ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showBoilerplate ? "Hide main" : "Show main"}
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setCode(selectedProblem.starterCode[selectedLang] || ""); setOutput(""); setTestResults(null); }}
                className="flex items-center gap-1.5 border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--muted)] transition-all hover:border-[var(--fg)] hover:text-[var(--fg)]">
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
              <button onClick={handleRun} disabled={isRunning}
                className="flex items-center gap-1.5 border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--muted)] transition-all hover:border-[var(--fg)] hover:text-[var(--fg)] disabled:opacity-50">
                {isRunning ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />} Run
              </button>
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="flex items-center gap-1.5 border border-[var(--fg)] bg-[var(--fg)] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)] disabled:opacity-50">
                {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} Submit
              </button>
            </div>
          </div>

          <div className="overflow-hidden border border-[var(--border)]">
            <Editor
              height="350px"
              language={langMap[selectedLang] || "python"}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 13, fontFamily: "SF Mono, Fira Code, monospace", fontWeight: "300",
                minimap: { enabled: false }, padding: { top: 12, bottom: 12 },
                scrollBeyondLastLine: false, smoothScrolling: true,
                cursorBlinking: "smooth", cursorSmoothCaretAnimation: "on",
                lineHeight: 1.7, letterSpacing: 0.3, tabSize: 4,
                renderLineHighlight: "none", overviewRulerBorder: false,
                scrollbar: { vertical: "hidden", horizontal: "auto" },
              }}
            />
          </div>

          {/* Output Panel */}
          <div ref={outputRef} className="mt-2 border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex border-b border-[var(--border)]">
              <button onClick={() => setActiveTab("run")}
                className={`px-4 py-2 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                  activeTab === "run" ? "text-[var(--fg)] border-b border-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--fg)]"
                }`}>Output</button>
              <button onClick={() => setActiveTab("tests")}
                className={`px-4 py-2 text-[10px] font-medium uppercase tracking-wider transition-colors flex items-center gap-2 ${
                  activeTab === "tests" ? "text-[var(--fg)] border-b border-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--fg)]"
                }`}>
                Tests
                {testResults && (
                  <span className={`text-[9px] px-1 py-0.5 ${allPassed ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {passedCount}/{totalCount}
                  </span>
                )}
              </button>
            </div>

            <div className="p-3 max-h-[200px] overflow-auto">
              {activeTab === "run" ? (
                <pre className="text-[12px] font-mono font-light text-[var(--muted)] whitespace-pre-wrap leading-relaxed">
                  {output || "Click Run to see output..."}
                </pre>
              ) : testResults ? (
                <div className="space-y-1.5">
                  {testResults.map((result, i) => (
                    <div key={i} className={`flex items-center gap-2 px-2 py-1.5 text-[12px] ${
                      result.passed ? "bg-green-500/5 border border-green-500/20" : "bg-red-500/5 border border-red-500/20"
                    }`}>
                      {result.passed ? <Check className="h-3 w-3 text-green-500 shrink-0" /> : <X className="h-3 w-3 text-red-500 shrink-0" />}
                      <span className="font-light">Test {i + 1}</span>
                      {result.passed ? (
                        <span className="text-green-500 text-[10px]">Passed</span>
                      ) : (
                        <div className="flex gap-3 text-[10px] font-mono ml-auto">
                          <span className="text-green-500">Expected: {result.expected}</span>
                          <span className="text-red-500">Got: {result.got || "(empty)"}</span>
                        </div>
                      )}
                      <span className="text-[9px] text-[var(--muted)] ml-auto">{result.time}ms</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-[var(--muted)] font-light">Click Submit to run against all test cases.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
