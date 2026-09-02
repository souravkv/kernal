"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Send, RotateCcw, ChevronDown } from "lucide-react";

const languages = [
  { id: "python", label: "Python", monaco: "python", template: `# Write your code here\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))` },
  { id: "javascript", label: "JavaScript", monaco: "javascript", template: `// Write your code here\nfunction twoSum(nums, target) {\n    const seen = {};\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (complement in seen) {\n            return [seen[complement], i];\n        }\n        seen[nums[i]] = i;\n    }\n    return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));` },
  { id: "cpp", label: "C++", monaco: "cpp", template: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (seen.count(complement)) {\n            return {seen[complement], i};\n        }\n        seen[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    auto result = twoSum(nums, 9);\n    cout << "[" << result[0] << ", " << result[1] << "]" << endl;\n    return 0;\n}` },
  { id: "java", label: "Java", monaco: "java", template: `import java.util.*;\n\npublic class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (seen.containsKey(complement)) {\n                return new int[]{seen.get(complement), i};\n            }\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        int[] result = twoSum(new int[]{2, 7, 11, 15}, 9);\n        System.out.println("[" + result[0] + ", " + result[1] + "]");\n    }\n}` },
  { id: "c", label: "C", monaco: "c", template: `#include <stdio.h>\n#include <stdlib.h>\n\nvoid twoSum(int* nums, int numsSize, int target, int* result) {\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                result[0] = i;\n                result[1] = j;\n                return;\n            }\n        }\n    }\n}\n\nint main() {\n    int nums[] = {2, 7, 11, 15};\n    int result[2];\n    twoSum(nums, 4, 9, result);\n    printf("[%d, %d]\\n", result[0], result[1]);\n    return 0;\n}` },
];

const sampleProblems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", description: "Given an array of integers and a target, find two numbers that add up to the target. Return their indices.", testCases: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]" },
  { id: 2, title: "Reverse String", difficulty: "Easy", description: "Write a function that reverses a string. The input string is given as an array of characters.", testCases: "Input: [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\nInput: [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]" },
  { id: 3, title: "Fibonacci Number", difficulty: "Easy", description: "The Fibonacci numbers are defined recursively. Find the nth Fibonacci number.", testCases: "Input: n = 2\nOutput: 1\n\nInput: n = 4\nOutput: 3" },
];

export default function PracticePage() {
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [code, setCode] = useState(languages[0].template);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(sampleProblems[0]);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleLanguageChange = (lang: typeof languages[0]) => {
    setSelectedLang(lang);
    setCode(lang.template);
    setLangDropdownOpen(false);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...");
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: selectedLang.id === "cpp" ? "c++" : selectedLang.id,
          version: "*",
          files: [{ name: `main.${selectedLang.id === "cpp" ? "cpp" : selectedLang.id === "java" ? "java" : selectedLang.id === "c" ? "c" : selectedLang.id === "javascript" ? "js" : "py"}`, content: code }],
        }),
      });
      const data = await response.json();
      if (data.run) {
        setOutput(data.run.stdout || data.run.stderr || "No output");
      } else {
        setOutput("Execution error: " + JSON.stringify(data));
      }
    } catch {
      setOutput("Error: Could not connect to execution engine. Try again later.");
    }
    setIsRunning(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Code Practice</h1>
        <p className="mt-1 text-sm text-muted">Write, run, and test your code directly in the browser.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-bold text-foreground">Problems</h2>
          <div className="space-y-2">
            {sampleProblems.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProblem(p)}
                className={`w-full rounded-xl border p-3 text-left transition-all ${
                  selectedProblem.id === p.id
                    ? "border-primary/30 bg-primary/5"
                    : "border-border hover:border-primary/20 hover:bg-card-hover"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{p.title}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    p.difficulty === "Easy" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}>{p.difficulty}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-border bg-surface-elevated p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">{selectedProblem.title}</h3>
            <p className="text-xs text-muted leading-relaxed mb-3">{selectedProblem.description}</p>
            <div className="rounded-lg bg-code-bg p-3">
              <pre className="text-[11px] font-mono text-muted whitespace-pre-wrap">{selectedProblem.testCases}</pre>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/20"
              >
                {selectedLang.label}
                <ChevronDown className="h-4 w-4 text-muted" />
              </button>
              {langDropdownOpen && (
                <div className="absolute top-full left-0 z-10 mt-1 w-40 rounded-xl border border-border bg-card shadow-xl">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang)}
                      className="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-card-hover first:rounded-t-xl last:rounded-b-xl"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setCode(selectedLang.template); setOutput(""); }}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted transition-all hover:bg-card-hover hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5" />
                {isRunning ? "Running..." : "Run Code"}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded-2xl border border-border">
            <Editor
              height="400px"
              language={selectedLang.monaco}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "var(--font-mono, monospace)",
                minimap: { enabled: false },
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          <div className="mt-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-xs font-semibold text-foreground">Output</span>
            </div>
            <pre className="min-h-[80px] overflow-auto rounded-xl bg-code-bg p-4 text-sm font-mono text-muted whitespace-pre-wrap">
              {output || "Click 'Run Code' to see output..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
