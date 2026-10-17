import type { SeedModule } from "../types";

const c = (...lines: string[]) => lines.join("\n");

export const m01: SeedModule = {
  number: 1,
  title: "What Is DSA?",
  slug: "what-is-dsa",
  summary:
    "What data structures and algorithms are, where they hide in the apps you use, and how we'll judge whether a program is fast enough.",
  intro:
    "Welcome. I'm Kern, and I'll be teaching you data structures and algorithms in this course — one idea at a time, with working code and notes where I want you to slow down. Read at your own pace; if you sit on any topic for a minute, it marks itself complete automatically. Let's begin.",
  topics: [
    {
      order: 1,
      title: "What is DSA?",
      slug: "what-is-data-structures-and-algorithms",
      content: c(
        "Every program you have ever used does the same three things: it takes **input**, it does some **work**, and it produces **output**. The input and output are usually obvious — a search query goes in, results come out. This course is about the middle part: the work.",
        "",
        "Work has two ingredients.",
        "",
        "A **data structure** is *where* the data lives. Think of it as the shape you choose for your data: a shelf of numbered slots, a stack of plates, a trail of cabins pointing to the next one.",
        "",
        "An **algorithm** is *how* the work gets done: the recipe — step 1, step 2, done. Finding a name in a contacts list, sorting today's orders, checking if a password matches: those are algorithms.",
        "",
        "| Term | What it means | Everyday example |",
        "| --- | --- | --- |",
        "| Data structure | A way to organise and store data | Your contacts list |",
        "| Algorithm | A finite set of steps that solves a problem | The route your map app picks |",
        "",
        "The two always work as a pair. Your phone stores contacts in a list (structure) and finds 'Anita' by scanning or searching it (algorithm). Store the same contacts alphabetically in a tree instead, and a different algorithm becomes the smart choice.",
        "",
        "> **Note:** The pairing is the whole point. The structure you pick decides *which algorithms are cheap*. Pick badly, and even a well-written algorithm will crawl on real data.",
        "",
        "That pairing decides the two things programmers argue about most: **how fast** the program runs and **how much memory** it eats. Two solutions can produce the exact same answer, yet one can be a thousand times faster once you feed it a million items instead of ten.",
        "",
        "DSA is the craft of choosing those good pairs — and of reading any solution and predicting how it will behave at scale. That's what we're here to learn."
      ),
    },
    {
      order: 2,
      title: "Where DSA hides in daily life",
      slug: "where-dsa-hides",
      content: c(
        "Before any theory, let's look around. Every app you touched today is a thin skin over data structures and algorithms:",
        "",
        "- **Maps** — roads form a *graph*; finding the fastest route is a *search* algorithm walking that graph.",
        "- **Your social feed** — posts are *sorted* and *ranked* before you ever see them.",
        "- **Autocomplete** — the prefix you typed is matched against a *tree* of known words.",
        "- **Video streaming** — frames arrive into a *queue* so playback never stutters.",
        "- **Login** — your password is compared against a *hash* (a scrambled fingerprint), never the plain text.",
        "- **Files on your laptop** — folders inside folders form a *tree*.",
        "- **Your music playlist** — a *linked list* of songs, each pointing to the next.",
        "",
        "None of that is exotic. The structures in this course are the moving parts of software you used this morning. The only thing that changes once you finish this course is that you'll know their names.",
        "",
        "> **Note:** That's the real skill we're building: not memorising definitions, but *recognising the shape of a problem* so you can reach for the right tool without thinking.",
        "",
        "Each of those examples also raises a question: *is it fast enough?* Ten routes can be checked by brute force; ten million cannot. To answer that question properly, we need a short history lesson first — then a way to measure speed. Both are coming."
      ),
    },
    {
      order: 3,
      title: "A brief history",
      slug: "a-brief-history",
      content: c(
        "The ideas are younger than computing itself, but they grew up fast. Four short eras are worth knowing, because each one explains a habit we still have today.",
        "",
        "**1940s–50s — the scarce-memory era.** Early machines had a few kilobytes of memory. Programmers packed data by hand into the tiniest space, counting bytes like accountants. Wasting memory wasn't sloppy — it was impossible.",
        "",
        "**1960s–70s — the ideas get names.** Arrays, linked lists and sorting algorithms were formalised and studied mathematically. In 1968 Donald Knuth published *The Art of Computer Programming* and asked the question that defines this field: *how does the work grow as the input grows?* Hold on to that question — we'll spend all of Module 01's last topic on it.",
        "",
        "**1980s–90s — structures become libraries.** The C++ Standard Template Library, the Java Collections, and their friends shipped ready-made stacks, queues and maps. Programmers stopped rebuilding them in every project.",
        "",
        "**Today — they're built into your language.** A Python `list` is a dynamic array. A Python `dict` is a hash map. A C++ `std::vector` is a growable array. You have already been using these structures; this course simply opens the hood.",
        "",
        "> **Note:** The hardware changed completely across eighty years — the ideas stayed. That's a good sign they're worth your time.",
        "",
        "Next, let me show you how this course itself works, so you always know what's coming."
      ),
    },
    {
      order: 4,
      title: "How this course works",
      slug: "how-this-course-works",
      content: c(
        "Ten modules are ahead of you, and every topic inside them follows the same four beats, so you never have to guess what's coming:",
        "",
        "1. **The idea** — I explain it in plain English first, with pictures and tables. Nothing is used before it's defined.",
        "2. **The code** — the same thing implemented in **Python and C++**, with a language switcher on the example. Read one, skim the other, or both.",
        "3. **The uses** — where this structure shows up in real software.",
        "4. **The quiz** — six to eight questions to lock it in (60% passes).",
        "",
        "A few things about the page you're reading right now:",
        "",
        "- The **sidebar on the left** follows you everywhere. It lists every module and topic, marks what you've finished, and you can jump between chapters any time.",
        "- At the bottom of each topic you'll find **Mark complete** and a **Next** button. Next saves your progress and takes you to the following topic — you never need to go back to the overview.",
        "- **Stay on a topic for about a minute and it ticks itself off automatically.** Read in peace; I'll handle the bookkeeping.",
        "- Quizzes are optional but useful. Each one tells you exactly which questions you missed and why.",
        "",
        "> **Note:** The order of the modules is deliberate: arrays first, because everything else is built on them; then lists, stacks, queues, hashing, trees and graphs — each module leaning on the one before it. By the last one you'll see that these aren't ten separate topics but one connected map.",
        "",
        "One more thing before we start: we need a language for *speed* — a way to say 'this solution will be fine at a million items' without running it a million times."
      ),
    },
    {
      order: 5,
      title: "Why speed matters",
      slug: "why-speed-matters",
      content: c(
        "Two programmers solve the same problem. Both are correct. On 10 items they finish in a blink — but feed each of them **1,000,000 items**, and one finishes in 0.1 seconds while the other needs three hours. Same answer, wildly different work.",
        "",
        "We want to predict that gap *before* writing the code. The tool is **big-O notation** — not a stopwatch, but a growth rate. It answers one question: *if the input gets bigger, how much extra work do we do?*",
        "",
        "| Big-O | Name | What it means | Example |",
        "| --- | --- | --- | --- |",
        "| O(1) | Constant | Input size doesn't matter | Reading `arr[5]` |",
        "| O(log n) | Logarithmic | Double the input, add one step | Binary search |",
        "| O(n) | Linear | Ten times the input, ten times the work | Scanning a list |",
        "| O(n²) | Quadratic | Double the input, four times the work | Naive nested loops |",
        "",
        "Let's make that concrete. If O(n) takes 1 second on your machine, then O(n²) on the *same* input takes roughly 3,000 years. That's not a typo — that's what squaring does at scale.",
        "",
        "> **Note:** Big-O ignores your machine, your language, and constant overheads on purpose. It only tracks *how the work grows*. A solution that's slower on 10 items can still be the one that finishes at 10,000,000.",
        "",
        "You'll meet the formal version again when we sort arrays in Module 02. For now, carry one habit: **before you code, ask how the work will grow.** That single question is the heart of this entire course — and it starts paying off immediately, because the first structure we're about to study lives or dies by it: the array."
      ),
    },
  ],
  quiz: {
    questions: [
      {
        order: 1,
        prompt:
          "A program takes input, does work, and produces output. The 'work' combines which two things?",
        options: [
          "A data structure (where data lives) and an algorithm (the steps)",
          "The programming language and the operating system",
          "Only the speed of the CPU",
          "Only the amount of RAM available",
        ],
        correctIndex: 0,
        explanation:
          "DSA is exactly this pair: a structure to hold data plus an algorithm to process it.",
      },
      {
        order: 2,
        prompt:
          "A maps app finding the fastest route between two places is best modelled with which structure?",
        options: ["A stack of plates", "A graph of roads", "A shopping list", "A queue at a bank"],
        correctIndex: 1,
        explanation:
          "Places are nodes and roads are edges — a graph. Route-finding is graph search.",
      },
      {
        order: 3,
        prompt: "In big-O terms, what does O(n) mean?",
        options: [
          "Work stays the same no matter the input size",
          "Work grows linearly with the input size",
          "Work grows with the square of the input",
          "Work shrinks as input grows",
        ],
        correctIndex: 1,
        explanation:
          "O(n) = linear: ten times the input means roughly ten times the work.",
      },
      {
        order: 4,
        prompt: "Website passwords are normally stored on the server as…",
        options: [
          "Plain text for easy login",
          "Hashes (scrambled fingerprints)",
          "Full backups of the password",
          "Sorted arrays",
        ],
        correctIndex: 1,
        explanation:
          "Servers store hashes so a leaked database doesn't leak usable passwords.",
      },
      {
        order: 5,
        prompt:
          "Autocomplete suggesting words that start with what you typed mainly relies on finding a shared…",
        options: ["Index", "Prefix", "Hash collision", "Queue"],
        correctIndex: 1,
        explanation:
          "Autocomplete matches a prefix against stored words — we'll meet the structures for this later.",
      },
      {
        order: 6,
        prompt:
          "Which author published 'The Art of Computer Programming' in 1968, formalising algorithm analysis?",
        options: ["Donald Knuth", "Alan Turing", "Grace Hopper", "Edsger Dijkstra"],
        correctIndex: 0,
        explanation:
          "Knuth's series became the classic reference for analysing algorithms.",
      },
    ],
  },
};
