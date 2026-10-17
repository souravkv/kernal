import type { SeedModule } from "../types";

const c = (...lines: string[]) => lines.join("\n");

export const m05: SeedModule = {
  number: 5,
  title: "Queues",
  slug: "queues",
  summary:
    "Two ends and arrival order: from print jobs and chat messages to the queue that powers breadth-first search.",
  intro:
    "The office printer beeps, swallowing jobs in the order they arrived. First submitted, first printed. That fairness rule has a name — FIFO — and I want you to hold on to it, because in Module 08 we'll use this exact structure to find shortest routes on a map.",
  topics: [
    {
      order: 1,
      title: "What is a queue?",
      slug: "what-is-a-queue",
      content: c(
        "A **queue** is a collection with two ends and one rule:",
        "",
        "> **Note:** FIFO — First In, First Out. The earliest added item is the first one served.",
        "",
        "You know this as a line at a bank or a food truck: you join at the **rear**, you're served from the **front**. Cutting the line isn't allowed — and the structure won't let it happen.",
        "",
        "| Operation | End | Meaning |",
        "| --- | --- | --- |",
        "| **enqueue** | rear (tail) | Join the line |",
        "| **dequeue** | front (head) | Leave the line (be served) |",
        "| **peek** | front | See who's next, without removing |",
        "",
        "Stack vs queue, locked in:",
        "",
        "- Stack = *undo / go back* (LIFO, one end) — what we just finished.",
        "- Queue = *fair turn-taking / process in arrival order* (FIFO, two ends) — this module.",
        "",
        "Same simplicity as a stack, but the two-end twist gives it a completely different job: preserving **order of arrival**."
      ),
    },
    {
      order: 2,
      title: "Implementing a queue",
      slug: "implementing-a-queue",
      content: c(
        "The catch: adding at the rear and removing at the front must *both* be fast. A plain array makes front-removal shift everything (O(n) — remember Module 02), so we use a structure built for the job:",
        "",
        "- **Python:** `collections.deque` (double-ended queue) — O(1) at both ends.",
        "- **C++:** `std::queue` — a deque underneath.",
        "",
        "Switch the tabs to compare. Watch how enqueue lands at the back and dequeue always leaves from the front — the operations mirror the bank-line picture exactly.",
        "",
        "> **Note:** If you ever reach for `list.pop(0)` in Python as a queue, don't — that's O(n) because every remaining item shifts left. `deque.popleft()` is O(1). The mistake is common enough that it's worth repeating."
      ),
      codeExample: {
        python: `from collections import deque

q = deque()

q.append("alice")     # enqueue (rear) -> [alice]
q.append("bob")       # enqueue        -> [alice, bob]
q.append("carol")     # enqueue        -> [alice, bob, carol]

first = q.popleft()   # dequeue (front) -> "alice" (first in!)
print(first)          # alice
print(q.popleft())    # bob

print(q[0])           # peek -> carol (still in line)`,
        cpp: `#include <iostream>
#include <queue>
#include <string>
using namespace std;

int main() {
    queue<string> q;

    q.push("alice");    // enqueue (rear)
    q.push("bob");      // enqueue
    q.push("carol");    // enqueue

    string first = q.front();  // front of the line
    q.pop();                   // dequeue
    cout << first << endl;     // alice (first in)

    q.pop();                   // dequeue bob
    cout << q.front() << endl; // carol (now front)
    return 0;
}`,
      },
    },
    {
      order: 3,
      title: "Enqueue, dequeue & peek",
      slug: "enqueue-dequeue-and-peek",
      content: c(
        "With the right structure, **enqueue, dequeue and peek are all O(1)**: add at the rear, remove at the front, read the front — no element ever shifts through the middle.",
        "",
        "It's worth seeing *why* a plain array fails at this, because the failure explains why `deque` exists. Suppose the front is index 0. Dequeue removes `q[0]`, and every remaining element must slide left — O(n) per removal, O(n²) for n jobs. On a busy printer queue, that's a disaster.",
        "",
        "```",
        "naive array queue:",
        "  [a][b][c][d]     dequeue 'a'",
        "     [b][c][d]     <- everyone shifted (costly!)\n```",
        "",
        "A deque solves it without shifting, and there's an older trick for fixed-size queues — the **circular buffer** — which wraps indices around instead of shifting. You'll meet that idea again under hashing.",
        "",
        "A small lunch line to make the motions concrete:",
        "",
        "```python",
        "from collections import deque",
        "line = deque()",
        "",
        "for name in [\"zoe\", \"yasir\", \"mia\"]:   # arrive",
        "    line.append(name)",
        "",
        "print(line[0])        # peek: zoe (next to be served)",
        "print(line.popleft()) # zoe served",
        "print(line.popleft()) # yasir served",
        "print(list(line))     # [mia]\n```",
        "",
        "Fairness, preserved automatically."
      ),
    },
    {
      order: 4,
      title: "Queues in the real world",
      slug: "queues-in-the-real-world",
      content: c(
        "Anywhere arrival order *should* be respected, there's a queue:",
        "",
        "- **Print spoolers** — documents print in submission order (your office printer is a queue).",
        "- **Task schedulers** — the OS keeps runnable tasks in a queue and hands out CPU time.",
        "- **Message & chat apps** — your messages are delivered oldest-first.",
        "- **Web servers** — incoming requests line up while worker threads are busy.",
        "",
        "One big preview is coming in Module 08. Want the *shortest* path through an unexplored network? Explore in rings: everything 1 hop away, then 2 hops, then 3... The structure that guarantees that perfect order is a **queue** — process what you entered first. That promise from the printer will pay off there.",
        "",
        "**Beyond FIFO — priority queues.** Sometimes the *most urgent* job should jump the line (emergency rooms, high-priority downloads). That's a **priority queue**: not first-*come*, first-served, but first-*important*. It's built on a structure called a heap — a tree we'll touch in Module 07 and expand in *What's Next*.",
        "",
        "```python",
        "# mini task queue: jobs served in arrival order",
        "from collections import deque",
        "jobs = deque([\"export pdf\", \"resize image\", \"send email\"])",
        "",
        "while jobs:",
        "    job = jobs.popleft()          # FIFO!",
        "    print(\"working on:\", job)\n```",
        "",
        "Stacks remember how to go **back**; queues remember who came **first**. Between them they cover a surprising share of real systems — and one variant combines both, next."
      ),
    },
    {
      order: 5,
      title: "Deques: queues with both ends open",
      slug: "deques-double-ended",
      content: c(
        "A **deque** (double-ended queue) relaxes the last rule: *both* ends accept adds and removes. The front behaves like a queue's front; either end may act like a stack's top.",
        "",
        "```",
        "  add/remove        add/remove",
        "   at front          at rear",
        "   <-> [ a | b | c ] <->\n```",
        "",
        "```python",
        "from collections import deque",
        "d = deque([\"b\", \"c\"])",
        "",
        "d.appendleft(\"a\")   # add at front -> [a, b, c]",
        "d.append(\"d\")       # add at rear  -> [a, b, c, d]",
        "d.pop()             # remove rear  -> d",
        "d.popleft()         # remove front -> a\n```",
        "",
        "In C++ it's `std::deque`; under the hood, Python's `deque` *is* this.",
        "",
        "When a deque is the perfect fit:",
        "",
        "- Sliding windows over data (the maximum of the last k items — an interview favourite).",
        "- Anything with *both* undo and redo (two-ended history).",
        "- The implementation that backs efficient queues *and* efficient stacks.",
        "",
        "> **Note:** Deques quietly unify the last two modules. Structures keep doing this — each new one absorbs tricks from the previous. So will the next one: it skips walking altogether.",
        "",
        "You now know five structures — arrays, lists, stacks, queues, deques. The next leap is different in kind: instead of storing items in order, it stores them by *address*, so lookup stops being a search at all."
      ),
    },
  ],
  quiz: {
    questions: [
      {
        order: 1,
        prompt: "A queue follows which rule?",
        options: ["LIFO — last in, first out", "FIFO — first in, first out", "Priority only", "Sorted order"],
        correctIndex: 1,
        explanation: "The earliest arrival is served first — FIFO.",
      },
      {
        order: 2,
        prompt: "enqueue adds at…",
        options: ["The front", "The rear", "The middle", "A random spot"],
        correctIndex: 1,
        explanation: "New arrivals join the back of the line.",
      },
      {
        order: 3,
        prompt: "dequeue removes from…",
        options: ["The front", "The rear", "Both ends", "A random spot"],
        correctIndex: 0,
        explanation: "Whoever waited longest leaves from the front.",
      },
      {
        order: 4,
        prompt:
          "Breadth-first search (preview of Module 08) relies on which structure?",
        options: ["Stack", "Queue", "Hash map", "Sorted array"],
        correctIndex: 1,
        explanation: "A queue keeps exploration in perfect ring order — hop 1, then 2, then 3.",
      },
      {
        order: 5,
        prompt: "Print jobs line up FIFO because…",
        options: [
          "Printers are slow",
          "Fairness: first submitted should print first",
          "Queues are faster than stacks",
          "Jobs must be sorted by name",
        ],
        correctIndex: 1,
        explanation: "FIFO is about fairness of service — exactly the queue's purpose.",
      },
      {
        order: 6,
        prompt: "A deque differs from a queue in that it…",
        options: [
          "Only allows removal at the front",
          "Allows insertion and removal at both ends",
          "Must stay sorted",
          "Stores only numbers",
        ],
        correctIndex: 1,
        explanation: "Double-ended: it behaves like a queue and a stack rolled into one.",
      },
    ],
  },
};
