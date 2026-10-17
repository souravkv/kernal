import type { SeedModule } from "../types";

const c = (...lines: string[]) => lines.join("\n");

export const m09: SeedModule = {
  number: 9,
  title: "Choosing the Right Structure",
  slug: "choosing-the-right-structure",
  summary:
    "The skill itself: name the operation, pick the tool, and sanity-check the growth rate.",
  intro:
    "You now know seven structures. Implementing them was the easy part — the real question comes at work: you have a problem in front of you and twenty minutes to decide what to build it from. This module hands you the method I use, plus the map showing why nothing you've learned was isolated.",
  topics: [
    {
      order: 1,
      title: "Which structure, when?",
      slug: "which-structure-when",
      content: c(
        "The reliable method: **name the dominant operation your program does most, then pick the structure where that operation is cheap.** That's it — the choice stops being guesswork.",
        "",
        "| If the program mostly… | Reach for | Why it's fast there |",
        "| --- | --- | --- |",
        "| Jumps by index, iterates in order | **Array / list** | O(1) index; cache-friendly |",
        "| Adds/removes at the front | **Linked list** | O(1) rewire, no shifting |",
        "| Goes back / undoes (LIFO) | **Stack** | push/pop O(1) at top |",
        "| Processes in arrival order (FIFO) | **Queue** | enqueue/dequeue O(1) |",
        "| Looks up by exact key | **Hash map** | O(1) average get/set |",
        "| Keeps keys sorted / does ranges | **Tree (BST)** | O(log n) when balanced |",
        "| Models connections / paths | **Graph + BFS/DFS** | O(V + E) traversals |",
        "",
        "A few worked calls:",
        "",
        "- *\"Undo in an editor\"* → **stack** (revert newest first).",
        "- *\"Count word frequencies in a document\"* → **hash map** (key = word).",
        "- *\"Find the playlist song you clicked\"* → **array/list** (index jump) or hash if keyed by name.",
        "- *\"Fewest flights between cities\"* → **graph + BFS**.",
        "- *\"Leaderboard updated live\"* → **tree** (or sorted structure) for order.",
        "",
        "There's no single \"best\" structure — only the best structure *for the operation you actually do*. When in doubt, write that sentence first; the data structure usually names itself.",
        "",
        "> **Tip:** This is the same instinct Module 02's table gave you for arrays-vs-lists, now applied across all seven. The habit scales; the method doesn't change."
      ),
    },
    {
      order: 2,
      title: "How everything connects",
      slug: "how-everything-connects",
      content: c(
        "These modules weren't isolated. Each structure borrows from — or builds on — the ones before:",
        "",
        "- **Strings are arrays** (Module 02).",
        "- **A stack is an array or list with a discipline**: only touch the end (Module 04).",
        "- **A queue is a deque** — two ends open (Module 05).",
        "- **A set is a hash table** with values stripped (Module 06).",
        "- **A BST is a binary tree** plus an ordering rule — and its in-order traversal emits sorted output (Module 07).",
        "- **BFS on a graph uses a queue** (Module 05 → 08); **DFS uses a stack** (Module 04 → 08).",
        "- **Level-order tree traversal is BFS** on a special graph (Module 07 + 08).",
        "- **Recursion is the call stack** doing your bookkeeping (Module 04 → every tree algorithm).",
        "",
        "```",
        "arrays ──> linked lists ──> stacks / queues ──┐",
        "                     ^                         │",
        "                     │   (BFS/DFS built on them)│",
        "hashing ──────────> sets / maps                v",
        "trees (BST) ─────────────────────────────> graphs\n```",
        "",
        "That's the course in one diagram: linear structures → specialised ends → keyed access → hierarchy → full networks. Master the *connections* and interview problems stop feeling like eight separate trick bags — they become variations on one theme: **arrange the data so the operation you need is cheap.**",
        "",
        "> **Note:** Every bridge in that list was a topic in this course — the deque note in Module 05, the set note in Module 06, the queue note in Module 08. Nothing here is new; it's the same pieces, finally seen together."
      ),
    },
    {
      order: 3,
      title: "Big-O cheat sheet",
      slug: "big-o-cheat-sheet",
      content: c(
        "Big-O from Module 01, now attached to everything you've built:",
        "",
        "| Operation | Array | Linked list | Stack/Queue | Hash map | BST (balanced) |",
        "| --- | --- | --- | --- | --- | --- |",
        "| Access by index/key | O(1) | O(n) | O(n) | O(1) avg | O(log n) |",
        "| Search (unsorted) | O(n) | O(n) | O(n) | O(1) avg | O(log n) |",
        "| Insert at end | O(1) amortised | O(1)* | O(1) | O(1) avg | O(log n) |",
        "| Insert at front | O(n) | O(1) | O(n) | O(1) avg | O(log n) |",
        "| Delete | O(n) | O(1)† | O(1) | O(1) avg | O(log n) |",
        "",
        "*with a tail pointer. †when you already hold the node.",
        "",
        "And the traversal costs that matter for graphs:",
        "",
        "- **BFS / DFS**: **O(V + E)** — every node and edge once.",
        "- **Binary search**: **O(log n)** — half the space each step.",
        "- **Naive nested loops**: **O(n²)** — the smell to eliminate.",
        "",
        "Two habits worth keeping:",
        "",
        "1. **Quote average *and* worst case** — hash maps are O(1) *average*; a pathological hash degrades to O(n).",
        "2. **Count the whole picture** — a structure that's O(1) per operation but O(n) space may still be wrong for a memory-bound system.",
        "",
        "> **Watch out:** half this table has already bit someone in a quiz — `list.pop(0)` is O(n), sorted data through a BST stacks up, average ≠ worst. The cells aren't trivia; each one marks a mistake you now know how to avoid.",
        "",
        "You don't need to memorise every cell — you need the reflex: *how does the work grow?* Ask it on every design, and you're already thinking like an engineer."
      ),
    },
  ],
  quiz: {
    questions: [
      {
        order: 1,
        prompt:
          "A program needs instant lookup of users by email. Best structure?",
        options: ["Sorted array", "Linked list", "Hash map", "Stack"],
        correctIndex: 2,
        explanation:
          "Lookup by exact key is the hash map's signature O(1) operation.",
      },
      {
        order: 2,
        prompt:
          "Undo history in a text editor maps to which structure and rule?",
        options: [
          "Queue + FIFO",
          "Stack + LIFO",
          "BST + in-order",
          "Graph + BFS",
        ],
        correctIndex: 1,
        explanation:
          "Undo reverts the most recent change first — last in, first out.",
      },
      {
        order: 3,
        prompt:
          "BFS on a graph is implemented using which structure from Module 05?",
        options: ["A stack", "A queue", "A hash map", "A BST"],
        correctIndex: 1,
        explanation:
          "FIFO processing gives ring-by-ring exploration — shortest unweighted paths.",
      },
      {
        order: 4,
        prompt:
          "The time complexity of BFS/DFS on a graph with V vertices and E edges is…",
        options: ["O(1)", "O(log V)", "O(V + E)", "O(V · E)"],
        correctIndex: 2,
        explanation:
          "Every vertex is enqueued/pushed once and every edge examined once.",
      },
      {
        order: 5,
        prompt:
          "Which statement best captures 'choosing a data structure well'?",
        options: [
          "Always use a hash map — it's the fastest",
          "Name the dominant operation and pick the structure where it's cheap",
          "Always choose the structure with the fewest lines of code",
          "Always use recursion",
        ],
        correctIndex: 1,
        explanation:
          "There is no universally best structure — only the best fit for the operation you actually do most.",
      },
    ],
  },
};
