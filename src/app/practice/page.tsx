"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, ChevronDown } from "lucide-react";

const languages = [
  { id: "python", label: "Python", monaco: "python", template: `# Write your code here\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))` },
  { id: "javascript", label: "JavaScript", monaco: "javascript", template: `// Write your code here\nfunction twoSum(nums, target) {\n    const seen = {};\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (complement in seen) {\n            return [seen[complement], i];\n        }\n        seen[nums[i]] = i;\n    }\n    return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));` },
  { id: "cpp", label: "C++", monaco: "cpp", template: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (seen.count(complement)) {\n            return {seen[complement], i};\n        }\n        seen[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    auto result = twoSum(nums, 9);\n    cout << "[" << result[0] << ", " << result[1] << "]" << endl;\n    return 0;\n}` },
  { id: "java", label: "Java", monaco: "java", template: `import java.util.*;\n\npublic class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (seen.containsKey(complement)) {\n                return new int[]{seen.get(complement), i};\n            }\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        int[] result = twoSum(new int[]{2, 7, 11, 15}, 9);\n        System.out.println("[" + result[0] + ", " + result[1] + "]");\n    }\n}` },
  { id: "c", label: "C", monaco: "c", template: `#include <stdio.h>\n#include <stdlib.h>\n\nvoid twoSum(int* nums, int numsSize, int target, int* result) {\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                result[0] = i;\n                result[1] = j;\n                return;\n            }\n        }\n    }\n}\n\nint main() {\n    int nums[] = {2, 7, 11, 15};\n    int result[2];\n    twoSum(nums, 4, 9, result);\n    printf("[%d, %d]\\n", result[0], result[1]);\n    return 0;\n}` },
];

const sampleProblems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", description: "Given an array of integers and a target, find two numbers that add up to the target.", testCases: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]" },
  { id: 2, title: "Reverse String", difficulty: "Easy", description: "Write a function that reverses a string given as an array of characters.", testCases: 'Input: ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]' },
  { id: 3, title: "Fibonacci Number", difficulty: "Easy", description: "Find the nth Fibonacci number using recursion or iteration.", testCases: "Input: n = 2\nOutput: 1\n\nInput: n = 4\nOutput: 3" },
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
      setOutput(data.run?.stdout || data.run?.stderr || "No output");
    } catch {
      setOutput("Error: Could not connect to execution engine.");
    }
    setIsRunning(false);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-32 sm:px-10 sm:py-40">
      <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">Playground</span>
      <h1 className="heading-lg mb-2">Code</h1>
      <p className="body-lg mb-16 max-w-lg text-[var(--muted)]">Write, run, and test your code directly in the browser.</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr]">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="body-xs mb-6 text-[var(--muted)]">Problems</h2>
          <div className="space-y-2">
            {sampleProblems.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProblem(p)}
                className={`w-full border p-4 text-left transition-all ${
                  selectedProblem.id === p.id
                    ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                    : "border-[var(--border)] hover:border-[var(--fg)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="body-sm">{p.title}</span>
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${
                    selectedProblem.id === p.id ? "opacity-60" : "text-[var(--muted)]"
                  }`}>{p.difficulty}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 border border-[var(--border)] bg-[var(--surface-alt)] p-5">
            <h3 className="body-sm font-medium mb-2">{selectedProblem.title}</h3>
            <p className="body-sm text-[var(--muted)] mb-4">{selectedProblem.description}</p>
            <pre className="text-[12px] font-mono text-[var(--muted)] whitespace-pre-wrap leading-relaxed">{selectedProblem.testCases}</pre>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[13px] font-light transition-all hover:border-[var(--fg)]"
              >
                {selectedLang.label}
                <ChevronDown className="h-3 w-3 text-[var(--muted)]" />
              </button>
              {langDropdownOpen && (
                <div className="absolute top-full left-0 z-10 mt-1 w-40 border border-[var(--border)] bg-[var(--surface)]">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang)}
                      className="w-full px-4 py-2.5 text-left text-[13px] font-light transition-colors hover:bg-[var(--surface-alt)]"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setCode(selectedLang.template); setOutput(""); }}
                className="flex items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)] transition-all hover:border-[var(--fg)] hover:text-[var(--fg)]"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 border border-[var(--fg)] bg-[var(--fg)] px-5 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)] disabled:opacity-50"
              >
                <Play className="h-3 w-3" />
                {isRunning ? "Running..." : "Run"}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden border border-[var(--border)]">
            <Editor
              height="420px"
              language={selectedLang.monaco}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "SF Mono, Fira Code, monospace",
                fontWeight: "300",
                minimap: { enabled: false },
                padding: { top: 20, bottom: 20 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                lineHeight: 1.7,
                letterSpacing: 0.3,
              }}
            />
          </div>

          <div className="mt-4 border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--fg)]" />
              <span className="body-xs text-[var(--muted)]">Output</span>
            </div>
            <pre className="min-h-[60px] overflow-auto text-[13px] font-mono font-light text-[var(--muted)] whitespace-pre-wrap leading-relaxed">
              {output || "Click Run to see output..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
