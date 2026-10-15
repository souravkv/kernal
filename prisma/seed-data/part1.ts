import type { SeedModule } from "./types";

const c = (...lines: string[]) => lines.join("\n");

export const part1: SeedModule[] = [
  {
    number: 1,
    title: "What Is DSA?",
    slug: "what-is-dsa",
    coldOpen:
      "Code Chronicles (Ep. 1): Zara hands Bit a jigsaw box and a recipe card at the same time. 'Same pieces, different order of work — one finishes in minutes, the other in hours. That difference is this whole course.'",
    outcomes: [
      "Define data structures and algorithms and explain how the two work together.",
      "Spot data structures and algorithms hiding inside everyday apps.",
      "Follow this course's flow: idea → code (Python or C++) → real uses → quiz.",
    ],
    topics: [
      {
        order: 1,
        title: "What is DSA?",
        slug: "what-is-data-structures-and-algorithms",
        description: "The two words behind every efficient program.",
        content: c(
          "Every program does the same three things: take **input**, do some **work**, and produce **output**. The interesting part is the work — and work has two ingredients.",
          "",
          "A **data structure** is *where* the data lives: a shelf, a stack of plates, a tree of folders. An **algorithm** is *how* the work gets done: the recipe — step 1, step 2, done.",
          "",
          "| Term | What it means | Everyday example |",
          "| --- | --- | --- |",
          "| Data structure | A way to organise and store data | Your contacts list |",
          "| Algorithm | A finite set of steps that solves a problem | The route your map app picks |",
          "",
          "They always work as a pair. Your phone stores contacts in a list (structure) and finds 'Anita' by scanning or searching it (algorithm). Store the data differently — say, alphabetically in a tree — and a different algorithm becomes the smart choice.",
          "",
          "That pairing decides two things programmers care about most: **how fast** the program runs and **how much memory** it eats. Two solutions can give the exact same answer, yet one can be a thousand times faster on real data. DSA is the craft of choosing — and inventing — the good pairs."
        ),
      },
      {
        order: 2,
        title: "Where DSA hides in daily life",
        slug: "where-dsa-hides",
        description: "You already use this stuff ten times a day.",
        content: c(
          "Before any theory, a tour. Every app you touch is a thin skin over data structures and algorithms:",
          "",
          "- **Maps** — roads are a *graph*; finding the fastest route is a *search* algorithm.",
          "- **Your social feed** — posts are *sorted* and *ranked* before you see them.",
          "- **Autocomplete** — your typed prefix is matched against a *tree* of words.",
          "- **Video streaming** — frames arrive into a *queue* so playback never stutters.",
          "- **Login** — your password is checked against a *hash* (a scrambled fingerprint), never the plain text.",
          "- **Files on your laptop** — folders inside folders form a *tree*.",
          "- **Your music playlist** — a *linked list* of songs, each pointing to the next.",
          "",
          "None of this is exotic. The structures in this course are the moving parts of software you used this morning — once you learn the names, you'll start seeing them everywhere. That's the real goal: not memorising definitions, but *recognising the shape of a problem* so you can reach for the right tool."
        ),
      },
      {
        order: 3,
        title: "A brief history",
        slug: "a-brief-history",
        description: "From punch cards to Python lists.",
        content: c(
          "The ideas are younger than computing itself — but they grew up fast.",
          "",
          "**1940s–50s — the scarce-memory era.** Early machines had a few kilobytes of memory. Programmers packed data by hand into the tiniest space, counting bytes like accountants. Wasting memory wasn't sloppy; it was impossible.",
          "",
          "**1960s–70s — the ideas get names.** Arrays, linked lists and sorting algorithms were formalised and analysed mathematically. In 1968 Donald Knuth published *The Art of Computer Programming*, asking the question that defines the field: *how does the work grow as the input grows?*",
          "",
          "**1980s–90s — structures become libraries.** The C++ Standard Template Library, Java Collections and friends shipped ready-made stacks, queues and maps. Programmers stopped rebuilding them in every project.",
          "",
          "**Today — they're built into your language.** A Python `list` is a dynamic array. A Python `dict` is a hash map. A C++ `std::vector` is a growable array. You've been using these structures already — this course simply opens the hood.",
          "",
          "The hardware changed completely; the ideas stayed. That's a good sign they're worth learning."
        ),
      },
      {
        order: 4,
        title: "How this course works",
        slug: "how-this-course-works",
        description: "One predictable rhythm, ten chapters.",
        content: c(
          "Every chapter in this course follows the same four beats, so you always know what's coming:",
          "",
          "1. **The idea** — a plain-English explanation with pictures and tables, no jargon unless it's defined first.",
          "2. **The code** — the same thing implemented in **Python and C++**, with a language switcher on the example. Read one, skim the other, or both.",
          "3. **The uses** — where this structure shows up in real software.",
          "4. **The quiz** — six to eight questions to lock it in (60% passes).",
          "",
          "Use the **sidebar on the left** to jump between chapters and topics any time — it follows you everywhere and tracks what you've completed. Hit **Mark complete** at the end of each topic so your progress bar stays honest.",
          "",
          "The order is deliberate: arrays first (everything is built on them), then lists, stacks, queues, hashing, trees and graphs — each chapter leaning on the one before it. By the last chapter you'll see that these aren't eight separate topics but one connected map."
        ),
      },
      {
        order: 5,
        title: "Why speed matters",
        slug: "why-speed-matters",
        description: "Big-O explained without the panic.",
        content: c(
          "Two programmers solve the same problem. Both are correct. On 10 items they finish in a blink — but feed each one **1,000,000 items** and one finishes in 0.1 seconds while the other needs 3 hours. Same answer, wildly different work. DSA is how we predict that gap *before* writing the code.",
          "",
          "We measure it with **big-O notation** — not a stopwatch, but a growth rate. It answers: *if the input gets bigger, how much extra work do we do?*",
          "",
          "| Big-O | Name | What it means | Example |",
          "| --- | --- | --- | --- |",
          "| O(1) | Constant | Input size doesn't matter | Reading `arr[5]` |",
          "| O(log n) | Logarithmic | Double the input → +1 step | Binary search |",
          "| O(n) | Linear | Ten times the input → ten times the work | Scanning a list |",
          "| O(n²) | Quadratic | Double the input → 4x the work | Naive nested loops |",
          "",
          "A human-scale feel: if O(n) takes 1 second, O(n²) on the same input takes about 3000 years. You don't need the maths — you need the reflex: *how will this behave at scale?*",
          "",
          "You'll meet the formal version again in Chapter 02 when we sort arrays. For now, carry one habit: **before you code, ask how the work grows.** That single question is the heart of this entire course."
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
          prompt:
            "In big-O terms, what does O(n) mean?",
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
    practiceProblems: [],
  },
  {
    number: 2,
    title: "Arrays",
    slug: "arrays",
    coldOpen:
      "Code Chronicles (Ep. 2): Bit finally steps inside the memory vault — one long street of identical, numbered mailboxes. 'Every box the same size, numbered from zero,' says Zara. 'That simple rule is why arrays never went out of style.'",
    outcomes: [
      "Explain how arrays store items in indexed, equally sized slots.",
      "Create, read and update arrays in both Python and C++.",
      "Sort an array, search it, and know when an array is the wrong tool.",
    ],
    topics: [
      {
        order: 1,
        title: "What is an array?",
        slug: "what-is-an-array",
        description: "One street of numbered, same-sized boxes.",
        content: c(
          "An array is the simplest data structure there is: a **contiguous row of equal-sized slots**, each with a number — the **index** — starting at **0**.",
          "",
          "```",
          "Index:    0     1     2     3     4",
          "        +----+----+----+----+----+",
          "        | 10 | 20 | 30 | 40 | 50 |",
          "        +----+----+----+----+----+",
          "```",
          "",
          "Three properties do all the magic:",
          "",
          "- **Same size** — every slot holds the same kind of thing (numbers, characters…), so the machine can predict where each slot begins.",
          "- **Numbered from 0** — index 0 is the first item; index 3 is the fourth. (Zero-based counting is a convention, but it's universal.)",
          "- **Instant access** — because slots are evenly spaced, the computer computes any address in one step: *address = start + index × slot size*. That's why `arr[3]` is **O(1)** — the same speed for a 5-item array or a 5-million-item array.",
          "",
          "The trade-off: slots are **fixed in place**. To squeeze something into the middle, everything after it must shift down — that's the price we'll pay (and later learn to avoid) in this chapter."
        ),
      },
      {
        order: 2,
        title: "Implementing arrays in Python & C++",
        slug: "implementing-arrays",
        description: "The same idea, two languages — switch between them.",
        content: c(
          "Languages dress arrays up differently, but underneath it's the same numbered row. Use the **tabs above the code** to flip between Python and C++ — the operations match one-for-one.",
          "",
          "Python's `list` is a growable array (it automatically resizes when you append), while C++ offers a fixed `array` and a growable `vector`. Learn both once and every later chapter gets easier."
        ),
        codeExample: {
          python: `# --- creating ---
nums = [10, 20, 30, 40, 50]

# --- reading by index (starts at 0) ---
print(nums[0])      # 10
print(nums[3])      # 40

# --- updating in place ---
nums[1] = 99        # [10, 99, 30, 40, 50]

# --- length & appending (array grows) ---
print(len(nums))    # 5
nums.append(60)     # [10, 99, 30, 40, 50, 60]

# --- looping (traversal) ---
for x in nums:
    print(x)`,
          cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // --- creating (fixed-size array) ---
    int nums[5] = {10, 20, 30, 40, 50};

    // --- reading by index (starts at 0) ---
    cout << nums[0] << endl;   // 10
    cout << nums[3] << endl;   // 40

    // --- updating in place ---
    nums[1] = 99;              // {10, 99, 30, 40, 50}

    // --- growable array: std::vector ---
    vector<int> v = {10, 99, 30, 40, 50};
    v.push_back(60);           // appends 60
    cout << v.size() << endl;  // 6

    // --- looping (traversal) ---
    for (int x : v) cout << x << " ";
    return 0;
}`,
        },
      },
      {
        order: 3,
        title: "Basic operations: add, remove, search",
        slug: "basic-operations",
        description: "What each move costs — in plain English.",
        content: c(
          "Four operations cover 90% of array work. What matters is what each one **costs**:",
          "",
          "| Operation | How it works | Cost |",
          "| --- | --- | --- |",
          "| Read / update by index | Jump straight there | O(1) — instant |",
          "| Append at the end | Stick it on (array grows) | O(1) on average |",
          "| Insert / remove in the middle | Shift every later item | O(n) — touches the tail |",
          "| Search (unsorted) | Scan item by item | O(n) — may check all |",
          "",
          "The middle-shift is the one to feel in your bones. Inserting `X` at index 1 forces everything after it to move one slot right:",
          "",
          "```",
          "before:  [A][B][C][D][E]",
          "insert X at index 1",
          "after:   [A][X][B][C][D][E]   <- B, C, D, E all shifted\n```",
          "",
          "A tiny Python example of the cheap and the costly:",
          "",
          "```python",
          "scores = [70, 85, 90]",
          "",
          "scores.append(95)          # cheap: O(1)",
          "print(scores[2])            # cheap: O(1) -> 90",
          "",
          "scores.insert(1, 60)        # pricey: O(n) -> shifts 85, 90, 95",
          "# scores = [70, 60, 85, 90, 95]",
          "```",
          "",
          "Rule of thumb: **ends are cheap, the middle is expensive.** Keep that in your head and half of this course's design decisions will make sense."
        ),
      },
      {
        order: 4,
        title: "Sorting an array",
        slug: "sorting-an-array",
        description: "Bubble, selection, insertion — three beginner classics.",
        content: c(
          "Sorting means rearranging items into an order — ascending by default. Why bother? Because **sorted data is searchable, comparable and displayable** in ways unsorted data isn't (binary search next topic; leaderboards; merge reports).",
          "",
          "Three classic beginner algorithms — all O(n²), all easy to picture:",
          "",
          "**1. Bubble sort** — walk left to right, swapping any neighbouring pair that's out of order. The largest value 'bubbles' to the end each pass.",
          "",
          "```",
          "[5, 3, 4]",
          " pass 1: (5,3) swap -> [3, 5, 4] ; (5,4) swap -> [3, 4, 5]  # 5 landed",
          " pass 2: (3,4) ok    -> [3, 4, 5] ; (4,5) ok    -> done\n```",
          "",
          "**2. Selection sort** — scan for the smallest item, swap it into position 0; then find the next smallest for position 1; repeat.",
          "",
          "**3. Insertion sort** — build a sorted pile on the left: take the next item and slide it into its correct spot inside the pile (like sorting cards in your hand). Fastest of the three on nearly-sorted data.",
          "",
          "Switch the tabs below to see bubble sort written in Python and C++.",
          "",
          "You don't hand-roll sorts in real code — languages ship optimised ones (Python's `sorted()`, C++'s `std::sort`, typically O(n log n)). You learn these three to *understand* what sorting costs, and to recognise O(n²) when you see it in the wild."
        ),
        codeExample: {
          python: `def bubble_sort(a):
    n = len(a)
    for i in range(n):
        swapped = False
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:        # neighbours out of order?
                a[j], a[j + 1] = a[j + 1], a[j]   # swap
                swapped = True
        if not swapped:                 # already sorted
            break
    return a

print(bubble_sort([5, 3, 4, 1, 2]))   # [1, 2, 3, 4, 5]`,
          cpp: `#include <iostream>
using namespace std;

void bubbleSort(int a[], int n) {
    for (int i = 0; i < n; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {      // neighbours out of order?
                int t = a[j];           // swap
                a[j] = a[j + 1];
                a[j + 1] = t;
                swapped = true;
            }
        }
        if (!swapped) break;            // already sorted
    }
}

int main() {
    int a[] = {5, 3, 4, 1, 2};
    bubbleSort(a, 5);
    for (int x : a) cout << x << " ";   // 1 2 3 4 5
    return 0;
}`,
        },
      },
      {
        order: 5,
        title: "Searching a sorted array",
        slug: "searching-sorted-arrays",
        description: "Sort once, then find things the fast way.",
        content: c(
          "Two ways to find an item in an array:",
          "",
          "**Linear search** — check every item, one by one. Works on any array, sorted or not, but it's O(n): a million items can mean a million checks.",
          "",
          "**Binary search** — only for **sorted** arrays, and dramatically faster. The trick: *halve the guess space every step*.",
          "",
          "Find `7` in `[1, 3, 5, 7, 9]`:",
          "",
          "1. Look at the middle: `5`. Is 7 after 5? Yes → discard the whole left half.",
          "2. Remaining `[7, 9]`, middle `7`. Found it — **two steps instead of four**.",
          "",
          "```",
          "sorted: [1, 3, 5, 7, 9]   target: 7",
          "step 1: mid = 5  -> 7 > 5  -> search right half [7, 9]",
          "step 2: mid = 7  -> hit!\n```",
          "",
          "Every step kills half the remainder, so 1,000,000 items take ~20 steps, not 1,000,000. That's O(log n) — the growth curve you met in Chapter 01.",
          "",
          "```python",
          "def binary_search(a, target):",
          "    lo, hi = 0, len(a) - 1",
          "    while lo <= hi:",
          "        mid = (lo + hi) // 2",
          "        if a[mid] == target:",
          "            return mid",
          "        elif a[mid] < target:",
          "            lo = mid + 1     # look right",
          "        else:",
          "            hi = mid - 1     # look left",
          "    return -1                 # not found",
          "",
          "print(binary_search([1, 3, 5, 7, 9], 7))   # 3 (index of 7)\n```",
          "",
          "**The connection:** sorting (pay once) unlocks searching (collect many times). That trade shows up everywhere — from databases to build systems."
        ),
      },
      {
        order: 6,
        title: "Strings are arrays",
        slug: "strings-are-arrays",
        description: "Text is just an array of characters.",
        content: c(
          "A string is an **array of characters**. That's genuinely all it is — which means everything you learned in the last four topics applies to text.",
          "",
          "```",
          "S = \"hello\"",
          "Index:  0    1    2    3    4",
          "       [h]  [e]  [l]  [l]  [o]\n```",
          "",
          "- Indexing: `S[0]` is `'h'`; loop through it like any array.",
          "- Common moves: reverse, count vowels, check palindrome, join two strings.",
          "",
          "```python",
          "s = \"level\"",
          "print(s[0], s[-1])        # l l  (negative index = from the end)",
          "print(reversed_s := s[::-1])   # level  -> palindrome!",
          "",
          "vowels = 0",
          "for ch in \"algorithm\":",
          "    if ch in \"aeiou\":",
          "        vowels += 1",
          "print(vowels)            # 4 (a, o, i, a)\n```",
          "",
          "One important twist: in **Python strings are immutable** — changing one creates a *new* string (so `s[0] = 'H'` is illegal). In **C++, `std::string` is mutable** — you can edit characters in place. Same structure, different rule.",
          "",
          "Why this chapter matters: text search, spell checkers, and autocomplete all treat words as character arrays — we're one chapter ahead of the curve."
        ),
      },
      {
        order: 7,
        title: "Arrays in the real world",
        slug: "arrays-in-the-real-world",
        description: "Why they're everywhere — and when to skip them.",
        content: c(
          "Arrays are the most-used structure in existence, and it's not nostalgia — it's physics. Contiguous, evenly spaced memory is exactly what CPUs are optimised for.",
          "",
          "**Where you meet them:**",
          "",
          "- **Images** — a photo is a 2D array of pixels (rows × columns × colour values).",
          "- **Sensor & game data** — frame buffers, scoreboards, time series.",
          "- **Buffers** — video streaming fills an array and plays from the front.",
          "- **Underneath your list** — Python's `list` is a *dynamic array*: it over-allocates space, so `append` is almost always O(1). That's why lists feel fast until you insert in the middle.",
          "- **`std::vector` in C++** — the same growable-array trick.",
          "",
          "```python",
          "grid = [                 # a tiny 2D array (image-like)",
          "    [1, 0, 1],",
          "    [0, 1, 0],",
          "    [1, 1, 1],",
          "]",
          "print(grid[1][2])        # 0  (row 1, column 2)\n```",
          "",
          "**When NOT to use an array:** frequent insertions/deletions in the *middle* (constant shifting), or a collection whose size is wildly unpredictable in both directions. The first problem is solved by the very next chapter — the **linked list**. Hold that thought."
        ),
      },
    ],
    quiz: {
      questions: [
        {
          order: 1,
          prompt: "Array indices start at…",
          options: ["1", "0", "-1", "It depends on the language"],
          correctIndex: 1,
          explanation:
            "Zero-based indexing is the universal convention: index 0 is the first element.",
        },
        {
          order: 2,
          prompt: "Reading arr[3] on a normal array costs…",
          options: ["O(1)", "O(n)", "O(n²)", "O(log n)"],
          correctIndex: 0,
          explanation:
            "Address = start + index × size — computed in one step, regardless of array length.",
        },
        {
          order: 3,
          prompt: "Inserting an item in the middle of a large array is costly because…",
          options: [
            "The array must be sorted first",
            "Every later element must shift one slot",
            "Memory must be freed",
            "Indices start at 0",
          ],
          correctIndex: 1,
          explanation:
            "Everything after the insertion point moves one position right — an O(n) shift.",
        },
        {
          order: 4,
          prompt: "Bubble sort repeatedly…",
          options: [
            "Splits the array in half",
            "Swaps adjacent elements that are out of order",
            "Picks the minimum and moves it to the end",
            "Sorts only even numbers",
          ],
          correctIndex: 1,
          explanation:
            "Each pass swaps neighbouring out-of-order pairs, bubbling the largest to the end.",
        },
        {
          order: 5,
          prompt:
            "Roughly how many steps does binary search need for 1,000,000 sorted items (worst case)?",
          options: ["About 20", "About 1,000,000", "About 500,000", "Exactly 1,000,000"],
          correctIndex: 0,
          explanation:
            "Halving each step ≈ log₂(1,000,000) ≈ 20 — that's the power of O(log n).",
        },
        {
          order: 6,
          prompt: "In Python, appending to a list is…",
          options: [
            "Always O(n²)",
            "O(1) on average (amortised)",
            "O(n) — the whole list copies",
            "Only allowed on sorted lists",
          ],
          correctIndex: 1,
          explanation:
            "Lists over-allocate space, so appends almost never trigger a resize.",
        },
        {
          order: 7,
          prompt: "A string is essentially…",
          options: [
            "A tree of characters",
            "An array of characters",
            "A hash map of words",
            "A queue of letters",
          ],
          correctIndex: 1,
          explanation:
            "Characters stored in indexed order — that's why string ops mirror array ops.",
        },
        {
          order: 8,
          prompt:
            "A photo is typically stored as which kind of structure?",
          options: [
            "A 2D array of pixel values",
            "A stack of colours",
            "A linked list of rows only",
            "A queue of frames",
          ],
          correctIndex: 0,
          explanation:
            "Rows × columns of pixel data — a two-dimensional array.",
        },
      ],
    },
  },
  {
    number: 3,
    title: "Linked Lists",
    slug: "linked-lists",
    coldOpen:
      "Code Chronicles (Ep. 3): Beyond the vault street, Zara leads Bit along a trail of cabins — each holding a note that points to the next cabin. 'No fixed addresses here,' she says. 'Just follow the arrows.'",
    outcomes: [
      "Explain how nodes and pointers form a linked list.",
      "Build a singly linked list in Python and C++.",
      "Insert, delete and traverse a list — and know when to prefer it over an array.",
    ],
    topics: [
      {
        order: 1,
        title: "What is a linked list?",
        slug: "what-is-a-linked-list",
        description: "Nodes holding data, each pointing to the next.",
        content: c(
          "An array keeps everything in one solid row. A **linked list** takes the opposite approach: items live in separate **nodes**, and each node stores two things:",
          "",
          "1. The **data** (a number, a name, an object).",
          "2. A **pointer** — an arrow to where the next node lives.",
          "",
          "```",
          "  +--------+------+   +--------+------+   +--------+------+",
          "  | data: A| next |-->| data: B| next |-->| data: C| next |--> null",
          "  +--------+------+   +--------+------+   +--------+------+\n```",
          "",
          "The **head** is the first node; the last node points to **null** (no next). That's the entire structure.",
          "",
          "**The big trade-off versus an array:**",
          "",
          "- ✅ **Flexible size** — add or remove nodes anywhere without shifting anything.",
          "- ✅ **Cheap inserts/deletions at the front** — just re-point two arrows.",
          "- ❌ **No instant access** — to reach the 5th node you must walk 1 → 2 → 3 → 4 → 5. No magic address arithmetic; O(n) to index.",
          "",
          "Arrays let you *jump*; linked lists let you *rewire*. Choose based on which move your program does most."
        ),
      },
      {
        order: 2,
        title: "Implementing a linked list",
        slug: "implementing-a-linked-list",
        description: "Node by node, in Python and C++.",
        content: c(
          "A node is just data + a reference to the next node. Build three of them, connect the arrows, keep one `head` pointer — done. Switch tabs below for Python vs C++.",
          "",
          "C++ note: we use `new` to create nodes on the heap and raw pointers (`->`) to link them — the classic manual style. (Real C++ code often uses smart pointers, but the structure is identical.)"
        ),
        codeExample: {
          python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None     # pointer to next node

# build: A -> B -> C
head = Node("A")
head.next = Node("B")
head.next.next = Node("C")

# walk the list (traversal)
cur = head
while cur:
    print(cur.data, end=" ")   # A B C
    cur = cur.next              # follow the arrow`,
          cpp: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

int main() {
    // build: 1 -> 2 -> 3
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);

    // walk the list (traversal)
    for (Node* cur = head; cur != nullptr; cur = cur->next)
        cout << cur->data << " ";   // 1 2 3
    return 0;
}`,
        },
      },
      {
        order: 3,
        title: "Insert, delete & traverse",
        slug: "insert-delete-and-traverse",
        description: "The three moves — and what each costs.",
        content: c(
          "**Traverse** — start at `head`, follow `next` until null. Every node visited once: O(n).",
          "",
          "**Insert at the head** — the classic O(1) move: point the new node at the old head, then update `head`.",
          "",
          "```",
          "before:   head -> B -> C",
          "new node: A",
          "step 1:   A.next = B",
          "step 2:   head = A",
          "after:    head -> A -> B -> C\n```",
          "",
          "**Delete a node** — find the node *before* it, re-point that node's `next` around the victim: O(n) to find + O(1) to unlink.",
          "",
          "```python",
          "def push_front(head, data):",
          "    node = Node(data)",
          "    node.next = head      # 1. point at old head",
          "    return node           # 2. new head (caller saves it)",
          "",
          "def delete_after(prev):",
          "    if prev and prev.next:",
          "        prev.next = prev.next.next   # skip the victim\n```",
          "",
          "**Cost summary:**",
          "",
          "| Move | Cost | Why |",
          "| --- | --- | --- |",
          "| Insert/delete at head | O(1) | Two pointer re-points |",
          "| Access by index | O(n) | Must walk from the head |",
          "| Search (unsorted) | O(n) | Must walk anyway |",
          "",
          "Note the reversal versus arrays: arrays win at *access*, lists win at *front edits*. Never insert at the head of an array if you can rewire a list instead."
        ),
      },
      {
        order: 4,
        title: "Doubly & circular lists",
        slug: "doubly-and-circular-lists",
        description: "Two-way arrows and loops back to the start.",
        content: c(
          "The single-pointer version is the baseline. Two easy variants handle more situations:",
          "",
          "**Doubly linked list** — each node carries `prev` *and* `next`:",
          "",
          "```",
          "  null <- [A] <-> [B] <-> [C] -> null\n```",
          "",
          "- You can walk **backwards** (browser Back button, text editors' undo history).",
          "- Deleting a known node becomes O(1): with `prev` available, you unlink without hunting for the predecessor.",
          "- Cost: each node stores one extra pointer — a little more memory.",
          "",
          "**Circular linked list** — the tail points back to the head:",
          "",
          "```",
          "  [A] -> [B] -> [C] -> (back to A)\n```",
          "",
          "- Great for **round-robin** turns: everyone gets a turn, then it cycles (CPU scheduling, multiplayer game turns).",
          "- Music players use it: the playlist loops from the last song to the first.",
          "",
          "```python",
          "# circular: close the loop after building A -> B -> C",
          "tail = head",
          "while tail.next:",
          "    tail = tail.next",
          "tail.next = head        # C now points back to A\n```",
          "",
          "You rarely build these by hand in application code, but you'll *recognise* them everywhere — the browser back/forward pair, the playlist loop, the scheduler."
        ),
      },
      {
        order: 5,
        title: "Linked lists vs arrays",
        slug: "linked-lists-vs-arrays",
        description: "The decision table you'll reuse forever.",
        content: c(
          "Both store ordered data. They differ on *which moves are cheap*:",
          "",
          "| | Array | Linked list |",
          "| --- | --- | --- |",
          "| Memory | One contiguous block | Scattered nodes + pointers |",
          "| Access by index | O(1) — jump | O(n) — walk |",
          "| Insert at front | O(n) — shift | O(1) — rewire |",
          "| Insert in middle | O(n) — shift | O(n) find + O(1) unlink/relink |",
          "| Search (unsorted) | O(n) | O(n) |",
          "| Size changes | Needs resizing (usually hidden) | Naturally flexible |",
          "| Cache speed | Excellent (contiguous) | Weaker (nodes scattered) |",
          "",
          "**Real-world linked lists:**",
          "",
          "- **Music playlists / undo history** — sequences extended at the ends.",
          "- **LRU caches** (image viewers, page caches) — list + hash map together (a taste of Chapter 06).",
          "- **Huge unpredictable data** — where one giant contiguous array would be impossible to allocate.",
          "",
          "**Rule of thumb:** default to an array; reach for a linked list when you'll do lots of insert/delete at the ends and rarely need index jumps. With that instinct, every structure after this one becomes a design choice rather than a guess."
        ),
      },
    ],
    quiz: {
      questions: [
        {
          order: 1,
          prompt: "What does a node in a singly linked list contain?",
          options: [
            "Only data",
            "Data and a pointer to the next node",
            "Data and pointers to both neighbours",
            "A sorted index",
          ],
          correctIndex: 1,
          explanation:
            "Singly linked = data + one arrow (next). Doubly linked adds prev.",
        },
        {
          order: 2,
          prompt: "To read the 5th element of a linked list you must…",
          options: [
            "Jump directly using an address formula",
            "Walk from the head, following next pointers",
            "Sort the list first",
            "Use binary search",
          ],
          correctIndex: 1,
          explanation:
            "No random access — every lookup starts at head and walks forward.",
        },
        {
          order: 3,
          prompt: "Inserting at the head of a linked list costs…",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correctIndex: 0,
          explanation:
            "Two pointer updates: new node → old head, then head → new node.",
        },
        {
          order: 4,
          prompt: "In a doubly linked list, each node has…",
          options: [
            "next only",
            "prev only",
            "both next and prev",
            "a hash function",
          ],
          correctIndex: 2,
          explanation:
            "Two-way arrows enable backwards walking and O(1) deletion of a known node.",
        },
        {
          order: 5,
          prompt: "In a circular linked list, the tail points to…",
          options: ["null", "the head", "itself", "a random node"],
          correctIndex: 1,
          explanation:
            "Tail → head closes the loop — perfect for playlists and round-robins.",
        },
        {
          order: 6,
          prompt: "The main advantage of a linked list over an array is…",
          options: [
            "Faster index access",
            "Less memory always",
            "Insert/delete at the front without shifting",
            "Built-in sorting",
          ],
          correctIndex: 2,
          explanation:
            "Rewiring pointers avoids the array's costly element shifting.",
        },
      ],
    },
  },
  {
    number: 4,
    title: "Stacks",
    slug: "stacks",
    coldOpen:
      "Code Chronicles (Ep. 4): In the mess hall, Bit stacks plates one on top of another — and reaches for the top one, always. 'Only ever the top?' asks Zara. 'That's the whole rule,' she says. 'You've just met LIFO.'",
    outcomes: [
      "Describe stacks using the LIFO rule and the push/pop/peek vocabulary.",
      "Implement a stack in Python and C++.",
      "Match stacks to real problems: undo, back buttons, bracket checking, recursion.",
    ],
    topics: [
      {
        order: 1,
        title: "What is a stack?",
        slug: "what-is-a-stack",
        description: "Last in, first out — like plates.",
        content: c(
          "A **stack** is a collection where you may only work at **one end** — the top. It follows one rule:",
          "",
          "> **LIFO — Last In, First Out.** The most recently added item is the first one removed.",
          "",
          "Physical analogues are everywhere: a stack of plates (top plate first), a stack of trays in a cafeteria, a pile of books. You *cannot* grab the middle plate without lifting everything above it — and the structure doesn't even let you try.",
          "",
          "Three operations, all at the top:",
          "",
          "| Operation | Meaning | Example |",
          "| --- | --- | --- |",
          "| **push** | Add to the top | Place a plate on the pile |",
          "| **pop** | Remove from the top | Take the top plate off |",
          "| **peek** (top) | Read the top without removing | See which book is on top |",
          "",
          "That deliberate restriction is the *point*. By forbidding random access, stacks give you **perfectly remembered order** — everything you need to undo, retrace, or nest. The next three topics show exactly that."
        ),
      },
      {
        order: 2,
        title: "Implementing a stack",
        slug: "implementing-a-stack",
        description: "Two languages, one rule.",
        content: c(
          "Any structure with cheap add/remove at one end works: Python's list (`append`/`pop` at the end is O(1)) or C++'s `vector`. Switch tabs to compare.",
          "",
          "Note how both implementations **only ever touch the end** — enforcing LIFO is a discipline you, the programmer, keep."
        ),
        codeExample: {
          python: `stack = []

stack.push = None  # (conceptual) — in Python we use list methods:
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
        description: "O(1) everywhere — plus a first real trick.",
        content: c(
          "Every stack operation touches only the top element: **push, pop and peek are all O(1)** — no loops, no shifting, no matter how tall the stack grows.",
          "",
          "Two failure states worth knowing:",
          "",
          "- **Underflow** — popping an empty stack (there's nothing on top!).",
          "- **Overflow** — pushing onto a stack with a fixed size limit (real hardware stacks have one; Python lists don't care).",
          "",
          "A first trick — **reversing with a stack**. Push everything, then pop everything: order flips for free, because LIFO plays time backwards:",
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
          "This reversal trick quietly powers undo systems, expression evaluators, and the depth-first search you'll meet in the graphs chapter. One rule, many uses."
        ),
      },
      {
        order: 4,
        title: "What stacks are for",
        slug: "what-stacks-are-for",
        description: "Undo, back buttons and bracket checking.",
        content: c(
          "Whenever a problem has the flavour of 'retrace your steps exactly in reverse', reach for a stack:",
          "",
          "**1. Undo (every editor).** Each change is pushed. Undo pops — newest change reverted first. Perfect LIFO.",
          "",
          "**2. Browser Back.** Every page you visit is pushed; Back pops to the previous one. (Forward is a second stack — we'll see this dance again in queues.)",
          "",
          "**3. Bracket checking** — the classic interview problem. Scan left to right: push every opening bracket; on a closing bracket, pop and match. Empty stack at the end = balanced.",
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
          "**4. Expression maths** — evaluating `3 + (4 × 2)` uses a stack of numbers and operators (how calculators work underneath).",
          "",
          "Spot the pattern: **nested structure + reverse-order cleanup = stack**."
        ),
      },
      {
        order: 5,
        title: "Stacks & recursion",
        slug: "stacks-and-recursion",
        description: "The stack your program already keeps for you.",
        content: c(
          "Here's the reveal: your programming language **already uses a stack every second you run code** — the **call stack**.",
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
          "Any recursive solution can be rewritten with an *explicit* stack you control — same order, no risk of blowing the real one. Remember this when trees arrive: recursion and stacks are the same idea wearing different hats."
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
          options: [
            "The bottom element",
            "The oldest element",
            "The top element",
            "Every element",
          ],
          correctIndex: 2,
          explanation: "Only the top is reachable — that's the entire rule.",
        },
        {
          order: 3,
          prompt: "An editor's Undo history is best implemented with…",
          options: ["A queue", "A stack", "A sorted array", "A hash map"],
          correctIndex: 1,
          explanation:
            "Undo reverts the most recent change first — pure LIFO.",
        },
        {
          order: 4,
          prompt:
            "To check that '( [ { } ] )' is balanced, you push every opening bracket and on each closing bracket you…",
          options: [
            "Push the closer too",
            "Pop and match",
            "Restart the scan",
            "Sort the brackets",
          ],
          correctIndex: 1,
          explanation:
            "The last opener must be the first closed — exactly what a stack enforces.",
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
  },
  {
    number: 5,
    title: "Queues",
    slug: "queues",
    coldOpen:
      "Code Chronicles (Ep. 5): The office printer beeps, swallowing jobs in the order they arrive. 'First submitted, first printed?' asks Bit. 'FIFO,' Zara writes in the air. 'Hold that thought — you'll use this exact rule to find shortest routes later.'",
    outcomes: [
      "Describe queues using the FIFO rule and enqueue/dequeue vocabulary.",
      "Implement a queue in Python and C++.",
      "Connect queues to printers, task schedulers and breadth-first search.",
    ],
    topics: [
      {
        order: 1,
        title: "What is a queue?",
        slug: "what-is-a-queue",
        description: "First in, first out — like a bank line.",
        content: c(
          "A **queue** is a collection with two ends and one rule:",
          "",
          "> **FIFO — First In, First Out.** The earliest added item is the first one served.",
          "",
          "You know this as a queue at a bank or a line for a food truck: you join at the **rear**, you're served from the **front**. Cutting the line is not allowed — and the structure won't let it happen.",
          "",
          "| Operation | End | Meaning |",
          "| --- | --- | --- |",
          "| **enqueue** | rear (tail) | Join the line |",
          "| **dequeue** | front (head) | Leave the line (be served) |",
          "| **peek** | front | See who's next, without removing |",
          "",
          "**Stack vs queue, locked in:**",
          "",
          "- Stack = *undo / go back* (LIFO, one end).",
          "- Queue = *fair turn-taking / process in arrival order* (FIFO, two ends).",
          "",
          "Same simplicity as a stack, but the two-end twist gives it a completely different superpower: preserving **order of arrival**."
        ),
      },
      {
        order: 2,
        title: "Implementing a queue",
        slug: "implementing-a-queue",
        description: "deque in Python, std::queue in C++.",
        content: c(
          "The catch: adding at the rear and removing at the front must both be fast. A plain array makes front-removal shift everything (O(n)) — so we use a structure built for it:",
          "",
          "- **Python:** `collections.deque` (double-ended queue) — O(1) at both ends.",
          "- **C++:** `std::queue` — wraps a deque underneath.",
          "",
          "Switch tabs for the pair."
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
        description: "Both ends O(1) — and why naive arrays fail.",
        content: c(
          "With the right structure, **enqueue, dequeue and peek are all O(1)**: add at the rear, remove at the front, read the front — no element ever shifts through the middle.",
          "",
          "**Why a plain array doesn't cut it:** suppose front is index 0. Dequeue removes `q[0]`, and now every remaining element must slide left — O(n) per removal, O(n²) for n jobs. Disaster for a busy printer queue.",
          "",
          "```",
          "naive array queue:",
          "  [a][b][c][d]     dequeue 'a'",
          "     [b][c][d]     <- everyone shifted (costly!)\n```",
          "",
          "That's precisely why we reach for a deque (and why an advanced fix — the *circular buffer* — wraps indices around instead of shifting; you'll meet it again under hashing).",
          "",
          "A tiny example — a lunch line:",
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
        description: "Printers, schedulers, chats — and BFS.",
        content: c(
          "Anywhere order-of-arrival *should be respected*, there's a queue:",
          "",
          "- **Print spoolers** — documents print in the order submitted (your office printer is a queue).",
          "- **Task schedulers** — the OS keeps runnables in a queue and hands out CPU time.",
          "- **Message & chat apps** — your messages are delivered oldest-first.",
          "- **Web servers** — incoming requests line up while worker threads are busy.",
          "",
          "**The big preview — breadth-first search (Chapter 08).** Want the *shortest* path in an unexplored network? Explore in rings: everything 1 hop away, then 2 hops, then 3… The structure that guarantees that perfect order is a **queue** — process what you entered first. Zara's promise from the cold open pays off there.",
          "",
          "**Beyond FIFO — priority queues.** Sometimes the *most urgent* job should jump the line (emergency rooms, high-priority downloads). That's a **priority queue**: not first-*come*, first-served, but first-*important*. It's typically built on a structure called a heap — a tree we'll touch in Chapter 07 and expand in *What's Next*.",
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
          "Stacks remember how to go **back**; queues remember who came **first**. Together they cover a surprising share of real systems."
        ),
      },
      {
        order: 5,
        title: "Deques: queues with both ends open",
        slug: "deques-double-ended",
        description: "The Swiss army knife of ends.",
        content: c(
          "A **deque** (double-ended queue) relaxes the last rule: *both* ends accept adds and removes. Front behaves like a queue's front; either end may act like a stack's top.",
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
          "In C++ it's `std::deque`; under the hood Python's `deque` is exactly this.",
          "",
          "**When a deque is the perfect fit:**",
          "",
          "- Sliding windows over data (max of the last k items — interview favourite).",
          "- Anything with *both* undo and redo (two-ended history).",
          "- The implementation backing both queues *and* efficient stacks.",
          "",
          "Deques quietly unify this chapter and the last one. Structures keep doing this — each new one absorbs tricks from the previous. Next up: a structure that skips walking entirely — **hashing**."
        ),
      },
    ],
    quiz: {
      questions: [
        {
          order: 1,
          prompt: "A queue follows which rule?",
          options: [
            "LIFO — last in, first out",
            "FIFO — first in, first out",
            "Priority only",
            "Sorted order",
          ],
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
            "Breadth-first search (preview of Chapter 08) relies on which structure?",
          options: ["Stack", "Queue", "Hash map", "Sorted array"],
          correctIndex: 1,
          explanation:
            "A queue keeps exploration in perfect ring order — hop 1, then 2, then 3.",
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
          explanation:
            "FIFO is about fairness of service — exactly the queue's purpose.",
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
          explanation:
            "Double-ended: it behaves like a queue and a stack rolled into one.",
        },
      ],
    },
  },
];
