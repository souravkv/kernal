import type { SeedModule } from "../types";

const c = (...lines: string[]) => lines.join("\n");

export const m10: SeedModule = {
  number: 10,
  title: "Wrap-Up & What's Next",
  slug: "wrap-up",
  summary:
    "The map again, one page — then the shortest honest guide to what to learn and build next.",
  intro:
    "Ten modules in, you've earned the right to skip the review lecture. This one does three things quickly: lays out what you can now do, points at what's genuinely worth learning next, and gives you three projects that force these structures to work together. Then I hand the keyboard back.",
  topics: [
    {
      order: 1,
      title: "The journey so far",
      slug: "journey-so-far",
      content: c(
        "Look at what you can now do that you couldn't ten modules ago:",
        "",
        "| Module | Structure | The one-line takeaway |",
        "| --- | --- | --- |",
        "| 01 | Foundations | Pair data + steps; measure growth with big-O |",
        "| 02 | Arrays | Indexed, contiguous, O(1) access; sorting unlocks search |",
        "| 03 | Linked lists | Rewire pointers; cheap front edits, no index jumps |",
        "| 04 | Stacks | LIFO — undo, brackets, recursion's engine |",
        "| 05 | Queues | FIFO — fair order, BFS's engine |",
        "| 06 | Hashing | Turn keys into addresses; O(1) average lookup |",
        "| 07 | Trees | Hierarchy + binary search = sorted speed |",
        "| 08 | Graphs | General connections; BFS/DFS explore in O(V + E) |",
        "| 09 | Choosing | Name the operation → pick the tool |",
        "",
        "The deeper takeaway isn't the vocabulary — it's the *instinct*:",
        "",
        "1. **How does the work grow?** (big-O as a reflex)",
        "2. **What operation dominates?** (choose by the hot path)",
        "3. **What's already built in my language?** (`list` is a dynamic array; `dict` is a hash map; `deque` is a deque — you've been using these all along)",
        "",
        "That's the whole field in three questions. Everything after this course is new vocabulary applied to the same questions.",
        "",
        "> **Remember:** you didn't memorise ten unrelated tricks. You practiced one question from ten angles — and now it asks itself automatically. That's the actual outcome of this course."
      ),
    },
    {
      order: 2,
      title: "What to learn next",
      slug: "what-to-learn-next",
      content: c(
        "This course built the foundation. When you're ready, these are the natural next steps — each one built from pieces you already know:",
        "",
        "**Heaps & priority queues** — \"not first-come, but most-urgent\" (you met the idea in Module 05). A heap is a special complete binary tree (Module 07) that always exposes the min or max in O(1) — powering task schedulers, Dijkstra's algorithm, and \"top-k\" features.",
        "",
        "**Tries (prefix trees)** — trees specialised for strings; the structure behind autocomplete (previewed in Modules 01 and 07).",
        "",
        "**Balanced trees & advanced maps** — AVL/red-black trees, B-trees: what databases use when hash tables can't give sorted order.",
        "",
        "**Weighted graph algorithms** — Dijkstra, A*, Bellman-Ford: BFS's cousins for roads with real distances (Module 08's direct extension).",
        "",
        "**Complexity in practice** — cache locality, constants, and why a \"slower\" O(n) algorithm sometimes beats a \"faster\" one on real hardware.",
        "",
        "**Interview patterns** — two pointers, sliding window, prefix sums, topological sort: tricks that combine the structures you know in familiar recipes.",
        "",
        "> **Tip:** you don't need all of them. Pick the one that matches a problem you actually care about solving — motivation compounds faster than any syllabus."
      ),
    },
    {
      order: 3,
      title: "Build something",
      slug: "build-something",
      content: c(
        "Nothing cements DSA like a small project that *needs* the right structure. Three ideas sized for a weekend or two — each one quietly uses several modules at once:",
        "",
        "**1. A task manager with undo** — tasks in a list (M02), tags in a hash map (M06), undo/redo stacks (M04), due dates in a priority queue once you add scheduling (M05 + heaps next).",
        "",
        "**2. A tiny search engine** — inverted index: word → list of documents (hash map of lists, M03 + 06). Rank results; add prefix search with a trie when you're ready (M07's cousin).",
        "",
        "**3. A route planner** — cities and roads as a weighted graph (M08); implement BFS for fewest stops, then upgrade to Dijkstra for shortest distance. Visualise paths on a map and it becomes a portfolio piece.",
        "",
        "Rules for any project:",
        "",
        "- **Write the problem in one sentence first**, then name the dominant operation (M09's method).",
        "- **Sketch the data structures before coding** — five minutes here saves five hours later.",
        "- **Reuse the standard library** where it exists (`dict`, `deque`, `list`) — knowing the structure means knowing which built-in is already it.",
        "",
        "> **Remember:** you came here to learn data structures and algorithms. You leave able to *choose* them — which was always the point. Every module stays here; come back whenever a design decision needs a second opinion."
      ),
    },
  ],
  quiz: {
    title: "Final Assessment",
    questions: [
      {
        order: 1,
        prompt:
          "Which pair correctly matches a structure to its rule?",
        options: [
          "Stack — FIFO; Queue — LIFO",
          "Stack — LIFO; Queue — FIFO",
          "Stack — sorted; Queue — hashed",
          "Stack — tree; Queue — graph",
        ],
        correctIndex: 1,
        explanation:
          "Stacks pop the newest; queues dequeue the oldest.",
      },
      {
        order: 2,
        prompt:
          "Average-case lookup of a value by key in a hash map is…",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 0,
        explanation:
          "Hash the key, jump to the bucket — constant time on average.",
      },
      {
        order: 3,
        prompt:
          "In-order traversal of a balanced BST produces values in…",
        options: [
          "Reverse sorted order",
          "Sorted order",
          "Level order",
          "Random order",
        ],
        correctIndex: 1,
        explanation:
          "Left → node → right walks a BST from smallest to largest.",
      },
      {
        order: 4,
        prompt:
          "You need the fewest flights between two airports (each flight = 1 hop). Choose…",
        options: [
          "DFS with a stack",
          "BFS with a queue",
          "Binary search on a sorted array",
          "In-order tree traversal",
        ],
        correctIndex: 1,
        explanation:
          "Fewest hops in an unweighted graph is BFS's guarantee.",
      },
      {
        order: 5,
        prompt:
          "Which structure is NOT primarily about connections between arbitrary nodes?",
        options: ["Graph", "Social network model", "Stack", "Road map model"],
        correctIndex: 2,
        explanation:
          "A stack is a linear, one-end-only structure — no general node-to-node edges.",
      },
      {
        order: 6,
        prompt:
          "A collision in a hash table means…",
        options: [
          "The table is full",
          "Two keys hash to the same bucket",
          "The value is None",
          "The key is sorted",
        ],
        correctIndex: 1,
        explanation:
          "Distinct keys can share a bucket; chaining or probing resolves it.",
      },
      {
        order: 7,
        prompt:
          "The call stack is the engine underneath…",
        options: [
          "Queues only",
          "Recursion (including recursive tree traversals)",
          "Hash tables only",
          "Sorting only",
        ],
        correctIndex: 1,
        explanation:
          "Every recursive call pushes a frame — that's Module 04 meeting Module 07.",
      },
      {
        order: 8,
        prompt:
          "The best first step when choosing a data structure for a new problem is to…",
        options: [
          "Always start with a graph",
          "Name the dominant operation and pick where it's cheapest",
          "Copy the structure from the last project",
          "Sort the data first, always",
        ],
        correctIndex: 1,
        explanation:
          "Module 09's method: hot path first — the right structure usually names itself.",
      },
    ],
  },
};
