import type { SeedModule } from "../types";

const c = (...lines: string[]) => lines.join("\n");

export const m02: SeedModule = {
  number: 2,
  title: "Arrays",
  slug: "arrays",
  summary:
    "Storing items in a numbered row: instant reads, costly middle inserts, and the sorting and searching that follow from that rule.",
  intro:
    "With the basics in place, we start with the structure everything else is built from: the array. You'll create one, break one, sort one, and see exactly where it hurts — because every structure after this one is, in some way, a fix for an array's weakness.",
  topics: [
    {
      order: 1,
      title: "What is an array?",
      slug: "what-is-an-array",
      content: c(
        "The simplest data structure there is: a **contiguous row of equal-sized slots**, each with a number — the **index** — starting at **0**.",
        "",
        "```",
        "Index:    0     1     2     3     4",
        "        +----+----+----+----+----+",
        "        | 10 | 20 | 30 | 40 | 50 |",
        "        +----+----+----+----+----+",
        "```",
        "",
        "Three properties do all the work:",
        "",
        "- **Same size** — every slot holds the same kind of thing (numbers, characters...), so the machine can calculate where each slot begins without asking anyone.",
        "- **Numbered from 0** — index 0 is the first item; index 3 is the fourth. Zero-based counting is just a convention, but it's universal, so it's worth internalising now.",
        "- **Instant access** — because slots are evenly spaced, the computer computes any address in one step: *address = start + index × slot size*. That's why `arr[3]` costs the **same** on a 5-item array and a 5-million-item array.",
        "",
        "Let's put a cost on it: reading by index is **O(1)** — constant time. Nothing else in this course will beat that.",
        "",
        "> **Note:** The price of this arrangement is that slots are *fixed in place*. To squeeze something into the middle, everything after it has to shift down. Feel that pain in the next few topics — it's the reason the rest of the course exists.",
        "",
        "Next, let's actually build one in Python and C++."
      ),
    },
    {
      order: 2,
      title: "Implementing arrays in Python & C++",
      slug: "implementing-arrays",
      content: c(
        "Languages dress arrays up differently, but underneath it's the same numbered row. Use the **tabs above the code** to flip between Python and C++ — the operations match one-for-one, so you can compare them line by line.",
        "",
        "Python's `list` is a growable array: it automatically resizes when you append. C++ gives you a fixed `array` and a growable `vector`. Learn both once and every later chapter gets easier, because stacks, queues and hash tables are all built on top of these.",
        "",
        "> **Note:** If you've ever wondered why Python lists can hold mixed types while C++ vectors can't — that's an implementation choice, not a difference in the underlying structure. The indexing rules we just learned are identical in both."
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
      content: c(
        "Four operations cover 90% of array work. What matters is what each one **costs** — so here they are with their big-O attached:",
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
        "Watch both the cheap and the costly move in Python:",
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
        "> **Rule of thumb:** ends are cheap, the middle is expensive. Keep that in your head and half of this course's design decisions will make sense before I even explain them.",
        "",
        "Now let's do something useful with an array: put it in order."
      ),
    },
    {
      order: 4,
      title: "Sorting an array",
      slug: "sorting-an-array",
      content: c(
        "Sorting means rearranging items into order — ascending by default. Why bother? Because **sorted data is searchable, comparable and displayable** in ways unsorted data isn't: leaderboards need it, merge reports need it, and binary search (next topic) refuses to run without it.",
        "",
        "Three classic beginner algorithms, all O(n²), all easy to picture by hand:",
        "",
        "**1. Bubble sort** — walk left to right, swapping any neighbouring pair that's out of order. The largest value 'bubbles' to the end on each pass.",
        "",
        "```",
        "[5, 3, 4]",
        " pass 1: (5,3) swap -> [3, 5, 4] ; (5,4) swap -> [3, 4, 5]  # 5 landed",
        " pass 2: (3,4) ok    -> [3, 4, 5] ; (4,5) ok    -> done\n```",
        "",
        "**2. Selection sort** — scan for the smallest item, swap it into position 0; then find the next smallest for position 1; repeat until done.",
        "",
        "**3. Insertion sort** — build a sorted pile on the left: take the next item and slide it into its correct spot inside the pile, the way you sort cards in your hand. It's the fastest of the three on nearly-sorted data.",
        "",
        "Switch the tabs below to read bubble sort written in Python and C++. Notice it's the same picture: nested loops, a swap, an early exit when nothing moved.",
        "",
        "> **Note:** You don't hand-roll sorts in real code — languages ship optimised ones (Python's `sorted()`, C++'s `std::sort`, typically O(n log n)). You learn these three to *feel* what sorting costs and to recognise O(n²) when you see it later.",
        "",
        "Sorted data unlocks a much faster way to search — that's next."
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
      content: c(
        "There are two ways to find an item in an array, and the difference between them is the whole point of sorting.",
        "",
        "**Linear search** — check every item, one by one. Works on any array, sorted or not, but it's O(n): a million items can mean a million checks.",
        "",
        "**Binary search** — only for **sorted** arrays, and dramatically faster. The trick: *halve the guess space on every step*.",
        "",
        "Find `7` in `[1, 3, 5, 7, 9]`:",
        "",
        "1. Look at the middle: `5`. Is 7 after 5? Yes — discard the whole left half.",
        "2. Remaining `[7, 9]`, middle `7`. Found — **two steps instead of four**.",
        "",
        "```",
        "sorted: [1, 3, 5, 7, 9]   target: 7",
        "step 1: mid = 5  -> 7 > 5  -> search right half [7, 9]",
        "step 2: mid = 7  -> hit!\n```",
        "",
        "Every step kills half the remainder, so 1,000,000 items take about 20 steps, not 1,000,000. That's O(log n) — the growth curve you met in the last topic of Module 01.",
        "",
        "Here's the complete function:",
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
        "> **Common mistake:** running binary search on an *unsorted* array. It doesn't throw an error — it just gives you wrong answers confidently. Sort first, or use linear search.",
        "",
        "Notice the deal you just made: sorting is a one-time cost (pay it once), and searching becomes cheap forever after (collect many times). We'll see that deal again in databases, build systems, and interview questions.",
        ""
      ),
    },
    {
      order: 6,
      title: "Strings are arrays",
      slug: "strings-are-arrays",
      content: c(
        "A string is an **array of characters**. That's genuinely all it is — which means everything from the last five topics applies to text:",
        "",
        "```",
        "S = \"hello\"",
        "Index:  0    1    2    3    4",
        "       [h]  [e]  [l]  [l]  [o]\n```",
        "",
        "- Indexing: `S[0]` is `'h'`; you loop through it like any array.",
        "- Common moves: reverse it, count vowels, check for a palindrome, join two strings.",
        "",
        "```python",
        "s = \"level\"",
        "print(s[0], s[-1])        # l l  (negative index = from the end)",
        "print(s[::-1])            # level  -> palindrome!",
        "",
        "vowels = 0",
        "for ch in \"algorithm\":",
        "    if ch in \"aeiou\":",
        "        vowels += 1",
        "print(vowels)            # 4 (a, o, i, a)\n```",
        "",
        "One important twist to remember:",
        "",
        "> **Note:** In **Python, strings are immutable** — changing one creates a *new* string, so `s[0] = 'H'` raises an error. In **C++, `std::string` is mutable** — you can edit characters in place. Same structure, different rule; it catches people out constantly.",
        "",
        "Why does this topic matter? Text search, spell checkers and autocomplete all treat words as character arrays — we're one chapter ahead of the curve.",
        ""
      ),
    },
    {
      order: 7,
      title: "Arrays in the real world",
      slug: "arrays-in-the-real-world",
      content: c(
        "Arrays are the most-used structure in existence, and it isn't nostalgia — it's physics. Contiguous, evenly spaced memory is exactly what CPUs are optimised for, so arrays are fast in a way that scattered structures simply can't be.",
        "",
        "Where you'll meet them:",
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
        "And when an array is the *wrong* tool — because you'll do lots of insertions in the middle, or the size swings unpredictably — the fix is a different structure entirely. That's exactly what the next module is: the **linked list**, which rewrites connections instead of shifting data.",
        "",
        "> **Note:** Default to an array. It's the correct first choice in almost every situation. Change your mind only when you can name the specific operation that's hurting."
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
        explanation: "Rows × columns of pixel data — a two-dimensional array.",
      },
    ],
  },
};
