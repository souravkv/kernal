import type { SeedModule } from "../types";

const c = (...lines: string[]) => lines.join("\n");

export const m04: SeedModule = {
  number: 4,
  title: "Stacks",
  slug: "stacks",
  summary:
    "One rule — last in, first out — and the undo, bracket checking and recursion it powers.",
  intro:
    "Imagine you're in a mess hall, stacking plates one on top of another. You can only reach the top plate — always. That single restriction turns out to be exactly what editors, browsers and even your programming language use to keep track of 'where was I?'. This module is the stack.",
  topics: [
    {
      order: 1,
      title: "What is a stack?",
      slug: "what-is-a-stack",
      content: c(
        "A **stack** is a collection where you may only work at **one end** — the top. It follows one rule:",
        "",
        "> **Note:** LIFO — Last In, First Out. The most recently added item is the first one removed.",
        "",
        "Physical stacks are everywhere: plates in a pile, trays in a cafeteria, books on a desk. You *can't* grab the middle plate without lifting everything above it — and the structure doesn't even let you try.",
        "",
        "Three operations, all at the top:",
        "",
        "| Operation | Meaning | Everyday action |",
        "| --- | --- | --- |",
        "| **push** | Add to the top | Place a plate on the pile |",
        "| **pop** | Remove from the top | Take the top plate off |",
        "| **peek** (top) | Read the top without removing | See which book is on top |",
        "",
        "The restriction is the *point*. By forbidding random access, a stack gives you **perfectly remembered order** — everything you need to undo, retrace, or nest. Each of the next four topics shows one place where that's exactly what you want.",
        ""
      ),
    },
    {
      order: 2,
      title: "Implementing a stack",
      slug: "implementing-a-stack",
      content: c(
        "Any structure with cheap add/remove at one end works as a stack: Python's list (`append`/`pop` at the end are both O(1)) or C++'s `vector`. Switch the tabs below to compare — the operations line up one for one.",
        "",
        "> **Note:** Nothing in the code *forces* LIFO. Both implementations give you access to the whole array if you ask for it. Keeping to push/pop at the end is a discipline you, the programmer, maintain — because that discipline is what makes undo behave correctly."
      ),
      codeExample: {
        python: `stack = []

stack.append("first")   # push  -> ["first"]
stack.append("second")  # push  -> ["first", "second"]
stack.append("third")   # push  -> ["first", "second", "third"]

top = stack.pop()       # pop   -> "third"  (last in, first out)
print(top)              # third
print(stack.pop())      # second
print(stack[-1])        # peek  -> "first"  (still there)`,
        cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    vector<string> stack;

    stack.push_back("first");    // push
    stack.push_back("second");   // push
    stack.push_back("third");    // push

    string top = stack.back();   // peek -> "third"
    stack.pop_back();            // pop  -> removes "third"
    cout << top << endl;         // third
    cout << stack.back() << endl;// second (new top)
    return 0;
}`,
      },
    },
    {
      order: 3,
      title: "Push, pop & peek",
      slug: "push-pop-and-peek",
      content: c(
        "Every stack operation touches only the top element: **push, pop and peek are all O(1)** — no loops, no shifting, no matter how tall the stack grows.",
        "",
        "Two failure states are worth knowing by name:",
        "",
        "- **Underflow** — popping an empty stack (there's nothing on top).",
        "- **Overflow** — pushing onto a stack with a fixed size limit. Real hardware stacks have one; Python lists don't care.",
        "",
        "Now a first trick — **reversing with a stack**. Push everything in, then pop everything out: the order flips for free, because LIFO plays time backwards.",
        "",
        "```python",
        "stack = []",
        "word = \"hello\"",
        "",
        "for ch in word:",
        "    stack.append(ch)      # push  h e l l o",
        "",
        "reversed_word = \"\"",
        "while stack:",
        "    reversed_word += stack.pop()   # pop o l l e h",
        "",
        "print(reversed_word)     # olleh\n```",
        "",
        "Trace that on paper once — push `h,e,l,l,o`, pop `o,l,l,e,h` — and the reversal becomes obvious. This quiet trick powers undo systems, expression evaluators, and the depth-first search you'll meet in the graphs module. One rule, many uses.",
        ""
      ),
    },
    {
      order: 4,
      title: "What stacks are for",
      slug: "what-stacks-are-for",
      content: c(
        "Whenever a problem has the flavour of *'retrace your steps exactly in reverse'*, reach for a stack. Four places you'll meet it:",
        "",
        "**1. Undo, in every editor.** Each change is pushed. Undo pops — the newest change is reverted first. Perfect LIFO.",
        "",
        "**2. Browser Back.** Every page you visit is pushed; Back pops to the previous one. (Forward is a second stack — we'll see that two-stack dance again in the queues module.)",
        "",
        "**3. Bracket checking** — the classic interview problem. Scan left to right: push every opening bracket; on a closing bracket, pop and match. Empty stack at the end means balanced.",
        "",
        "```python",
        "def is_balanced(s):",
        "    pairs = {')': '(', ']': '[', '}': '{'}",
        "    stack = []",
        "    for ch in s:",
        "        if ch in \"([{\":",
        "            stack.append(ch)           # push openers",
        "        elif ch in pairs:",
        "            if not stack or stack.pop() != pairs[ch]:",
        "                return False            # mismatch",
        "    return not stack                     # all closed?",
        "",
        "print(is_balanced(\"({[]})\"))   # True",
        "print(is_balanced(\"(]\"))       # False\n```",
        "",
        "Walk `\"({[]})\"` through that code by hand once: four pushes, then four matching pops, stack empty at the end. It's the same motion as lifting plates off a pile in reverse.",
        "",
        "**4. Expression maths** — evaluating `3 + (4 × 2)` uses a stack of numbers and operators. That's how calculators work underneath.",
        "",
        "> **Note:** The pattern to memorise: *nested structure + reverse-order cleanup = stack*. Brackets nest, so closing them runs backwards. Calls nest, so returning runs backwards — which is the topic we're heading into now."
      ),
    },
    {
      order: 5,
      title: "Stacks & recursion",
      slug: "stacks-and-recursion",
      content: c(
        "Here's something you may not have noticed: your programming language **already uses a stack every second you run code** — it's called the **call stack**.",
        "",
        "Each time a function is called, the language *pushes* a frame (its variables, its return spot). Each time a function returns, its frame is *popped*. That's why functions return to exactly where they were called from.",
        "",
        "```",
        "main() calls work() calls helper():",
        "",
        "  call stack (top at right):",
        "  [ main ][ work ][ helper ]   <- helper runs now",
        "   pop: helper returns -> [ main ][ work ]\n```",
        "",
        "**Recursion** — a function calling itself — simply leans on this stack. Factorial, countdown, tree walking: each call pushes a frame until a **base case** stops the descent, then frames pop on the way back.",
        "",
        "And now the failure mode makes sense: **stack overflow** happens when frames pile up past the stack's limit — infinite recursion, or recursion that's simply too deep.",
        "",
        "```python",
        "def countdown(n):",
        "    if n == 0:              # base case: stop pushing frames",
        "        print(\"Liftoff!\")",
        "        return",
        "    print(n)",
        "    countdown(n - 1)        # pushes another frame",
        "",
        "countdown(3)   # 3 2 1 Liftoff!\n```",
        "",
        "> **Remember:** Any recursive solution can be rewritten with an *explicit* stack you control — same order, no risk of blowing the real one. Keep this in your pocket: trees arrive in Module 07, and recursion is how we'll walk them.",
        "",
        "Next up: the opposite rule. Stacks take the newest item first; the next structure insists on serving the oldest first."
      ),
    },
  ],
  quiz: {
    questions: [
      {
        order: 1,
        prompt: "A stack follows which rule?",
        options: [
          "FIFO — first in, first out",
          "LIFO — last in, first out",
          "Sorted order",
          "Random order",
        ],
        correctIndex: 1,
        explanation: "LIFO: the most recently pushed item is popped first.",
      },
      {
        order: 2,
        prompt: "pop() removes…",
        options: ["The bottom element", "The oldest element", "The top element", "Every element"],
        correctIndex: 2,
        explanation: "Only the top is reachable — that's the entire rule.",
      },
      {
        order: 3,
        prompt: "An editor's Undo history is best implemented with…",
        options: ["A queue", "A stack", "A sorted array", "A hash map"],
        correctIndex: 1,
        explanation: "Undo reverts the most recent change first — pure LIFO.",
      },
      {
        order: 4,
        prompt:
          "To check that '( [ { } ] )' is balanced, you push every opening bracket and on each closing bracket you…",
        options: ["Push the closer too", "Pop and match", "Restart the scan", "Sort the brackets"],
        correctIndex: 1,
        explanation: "The last opener must be the first closed — exactly what a stack enforces.",
      },
      {
        order: 5,
        prompt: "push, pop and peek on a stack are each…",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 0,
        explanation: "Everything happens at the top — no scanning needed.",
      },
      {
        order: 6,
        prompt: "'Stack overflow' in recursion happens when…",
        options: [
          "The disk is full",
          "Too many call frames pile up beyond the stack's limit",
          "A pop is attempted on an empty stack",
          "The array is full",
        ],
        correctIndex: 1,
        explanation:
          "Each recursive call pushes a frame; unbounded calls exhaust the stack.",
      },
    ],
  },
};
