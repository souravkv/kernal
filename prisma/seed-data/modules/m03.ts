import type { SeedModule } from "../types";

const c = (...lines: string[]) => lines.join("\n");

export const m03: SeedModule = {
  number: 3,
  title: "Linked Lists",
  slug: "linked-lists",
  summary:
    "Trading instant access for easy rewiring: nodes, pointers, and the moves that make front edits fast.",
  intro:
    "The array has one weakness: to insert or delete in the middle, it shifts everything after the spot. This module replaces shifting with rewiring — nodes that point at each other instead of living side by side. The result is a structure that's worse at reading and much better at editing.",
  topics: [
    {
      order: 1,
      title: "What is a linked list?",
      slug: "what-is-a-linked-list",
      content: c(
        "An array keeps everything in one solid row. A **linked list** does the opposite: items live in separate **nodes**, and each node stores two things —",
        "",
        "1. The **data** (a number, a name, an object).",
        "2. A **pointer** — an arrow saying where the next node lives.",
        "",
        "```",
        "  +--------+------+   +--------+------+   +--------+------+",
        "  | data: A| next |-->| data: B| next |-->| data: C| next |--> null",
        "  +--------+------+   +--------+------+   +--------+------+\n```",
        "",
        "The **head** is the first node. The last node points to **null**, meaning 'nothing follows'. That's the entire structure — no indices, no arithmetic, just arrows.",
        "",
        "Compare it honestly with the array:",
        "",
        "- **Flexible size** — add or remove nodes anywhere without shifting anything.",
        "- **Cheap edits at the front** — just re-point two arrows.",
        "- **No instant access** — to reach the 5th node you must walk 1 → 2 → 3 → 4 → 5. Indexing costs O(n).",
        "",
        "> **Note:** The trade is precise: arrays let you *jump*, linked lists let you *rewire*. Choose based on which move your program does more — that instinct gets reused in every module that follows.",
        "",
        "Let's build one."
      ),
    },
    {
      order: 2,
      title: "Implementing a linked list",
      slug: "implementing-a-linked-list",
      content: c(
        "A node is just data plus a reference to the next node. Build three of them, connect the arrows, keep one `head` pointer — done. Switch the tabs below to compare Python and C++.",
        "",
        "In C++ we use `new` to create nodes on the heap and raw pointers (`->`) to link them — the classic manual style. (Real C++ code often uses smart pointers instead, but the structure is identical.)",
        "",
        "> **Note:** In Python, a node is any object with a `next` attribute — there's no special syntax. The 'pointer' is just a normal reference holding `None` when there's no next node."
      ),
      codeExample: {
        python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None     # points to the next node

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
      content: c(
        "Three moves cover almost everything you'll do with a list. Here they are with their costs.",
        "",
        "**Traverse** — start at `head`, follow `next` until null. Every node is visited exactly once: O(n).",
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
        "**Delete a node** — find the node *before* it, and re-point that node's `next` around the victim: O(n) to find, O(1) to unlink.",
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
        "| Move | Cost | Why |",
        "| --- | --- | --- |",
        "| Insert / delete at head | O(1) | Two pointer re-points |",
        "| Access by index | O(n) | Must walk from the head |",
        "| Search (unsorted) | O(n) | Must walk anyway |",
        "",
        "> **Note:** Look at the cost table next to the array's from Module 02 — the numbers are exactly reversed for front edits. Arrays win at access; lists win at front edits. No structure wins everywhere.",
        "",
        "The single-pointer version is the baseline. Two easy variants handle more situations, next."
      ),
    },
    {
      order: 4,
      title: "Doubly & circular lists",
      slug: "doubly-and-circular-lists",
      content: c(
        "**Doubly linked list** — each node carries `prev` *and* `next`:",
        "",
        "```",
        "  null <- [A] <-> [B] <-> [C] -> null\n```",
        "",
        "What changes when you add that second arrow:",
        "",
        "- You can walk **backwards** — which is why browser Back buttons and editors' undo histories are built on this.",
        "- Deleting a node you already hold becomes O(1): with `prev` available, there's no hunting for the predecessor.",
        "- Cost: one extra pointer per node — a little more memory.",
        "",
        "**Circular linked list** — the tail points back to the head:",
        "",
        "```",
        "  [A] -> [B] -> [C] -> (back to A)\n```",
        "",
        "That loop is perfect for **round-robin** turns: everyone gets a turn, then it cycles. CPU scheduling works this way, and so do multiplayer game turns and music playlists that repeat.",
        "",
        "Closing the loop after building is one line:",
        "",
        "```python",
        "# circular: close the loop after building A -> B -> C",
        "tail = head",
        "while tail.next:",
        "    tail = tail.next",
        "tail.next = head        # C now points back to A\n```",
        "",
        "> **Note:** You'll rarely build these by hand in application code — but you'll *recognise* them everywhere: the browser back/forward pair, the playlist loop, the task scheduler.",
        ""
      ),
    },
    {
      order: 5,
      title: "Linked lists vs arrays",
      slug: "linked-lists-vs-arrays",
      content: c(
        "Both store ordered data. They differ only in *which moves are cheap* — so put the two cost tables side by side:",
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
        "The last row matters more than it looks: because array items sit next to each other in memory, the CPU keeps them in its fast cache. Lists hop around, so equal big-O doesn't always mean equal speed in practice.",
        "",
        "Where linked lists actually appear:",
        "",
        "- **Music playlists and undo histories** — sequences extended at the ends.",
        "- **LRU caches** (image viewers, page caches) — list *plus* hash map together. Keep that pairing in mind; we meet hash maps in Module 06.",
        "- **Huge unpredictable data** — where one giant contiguous array would be impossible to allocate up front.",
        "",
        "> **Rule of thumb:** default to an array; reach for a linked list when you'll do lots of insert/delete at the ends and rarely need index jumps.",
        "",
        "You now have two linear structures. The next two modules specialise them with one rule each — and both rules come from situations you already know from real life. First up: doing things in reverse order, with stacks."
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
        explanation: "Singly linked = data + one arrow (next). Doubly linked adds prev.",
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
        explanation: "Two pointer updates: new node → old head, then head → new node.",
      },
      {
        order: 4,
        prompt: "In a doubly linked list, each node has…",
        options: ["next only", "prev only", "both next and prev", "a hash function"],
        correctIndex: 2,
        explanation:
          "Two-way arrows enable backwards walking and O(1) deletion of a known node.",
      },
      {
        order: 5,
        prompt: "In a circular linked list, the tail points to…",
        options: ["null", "the head", "itself", "a random node"],
        correctIndex: 1,
        explanation: "Tail → head closes the loop — perfect for playlists and round-robins.",
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
        explanation: "Rewiring pointers avoids the array's costly element shifting.",
      },
    ],
  },
};
