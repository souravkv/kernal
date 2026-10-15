import type { SeedModule } from "./types";

const c = (...lines: string[]) => lines.join("\n");

export const part2: SeedModule[] = [
  {
    number: 6,
    title: "Hashing",
    slug: "hashing",
    coldOpen:
      "Code Chronicles (Ep. 6): Zara stops at a wall of hundreds of tiny numbered lockers. She types a name into a keypad; one locker pops open instantly. 'No scanning, no searching,' she says. 'The name itself *is* the address.'",
    outcomes: [
      "Explain what a hash function does and why constant-time lookup is possible.",
      "Use dictionaries/maps to store and retrieve key-value pairs.",
      "Describe collisions and the two classic ways to handle them.",
    ],
    topics: [
      {
        order: 1,
        title: "What is hashing?",
        slug: "what-is-hashing",
        description: "Turn a key into an address — in one step.",
        content: c(
          "Everything so far searched: arrays scan, lists walk, binary search needs sorted data. **Hashing skips the search entirely.**",
          "",
          "A **hash function** takes a key (a name, a word, an ID) and computes a number — the **hash** — that tells you *where* the value should live. Same key → same hash, every time.",
          "",
          "```",
          "key: \"alice\"   --hash-->  42   -> store value at slot 42",
          "key: \"bob\"     --hash-->  17   -> store value at slot 17\n```",
          "",
          "Lookups become **O(1)**: hash the key, jump to that slot, done. No scan, no walk, no matter how many items are stored. That's the superpower — and it powers Python `dict`, JavaScript objects, database indexes, caches, and password checks.",
          "",
          "The catch: hashes can **collide** (two keys mapping to one slot). Managing those collisions is the whole engineering challenge — we'll get there. First, the pieces: a hash function, an array of **buckets**, and key-value pairs stored inside the buckets."
        ),
      },
      {
        order: 2,
        title: "Hash functions",
        slug: "hash-functions",
        description: "The rules that make jump-and-find trustworthy.",
        content: c(
          "A good hash function must be:",
          "",
          "1. **Deterministic** — the same key always produces the same hash. Break this and nothing is findable.",
          "2. **Fast** — computed in ~O(1); hashing happens on every store and every lookup.",
          "3. **Evenly spread** — different keys should scatter across the bucket array. Clumping creates collisions.",
          "",
          "A toy example for small integer keys:",
          "",
          "```python",
          "def hash_key(key, num_buckets):",
          "    return key % num_buckets     # spread keys over 0..num_buckets-1",
          "",
          "print(hash_key(42, 10))   # 2",
          "print(hash_key(17, 10))   # 7\n```",
          "",
          "Real hash functions are more careful — languages ship battle-tested ones (`hash()` in Python, `std::hash` in C++). Interestingly, the same idea secures passwords: a one-way hash of your password is stored, never the password itself (as you saw in Chapter 01).",
          "",
          "One design choice to know: **bucket count**. More buckets → fewer collisions, more memory. Most implementations start small and **resize** (grow the array and rehash everything) once the table gets too full."
        ),
      },
      {
        order: 3,
        title: "Dictionaries & maps",
        slug: "dictionaries-and-maps",
        description: "Your everyday hash table, in Python and C++.",
        content: c(
          "You've almost certainly used a hash table already — it's the `dict` in Python and `unordered_map` in C++. Both store **key → value** pairs with near-instant get and set. Switch the tabs below.",
          "",
          "Typical uses: counting word frequencies, looking up a user by ID, caching expensive results, grouping anagrams. Anytime you'd say \"look it up by name\", a map is the tool."
        ),
        codeExample: {
          python: `# Python dict — a hash table under the hood
ages = {}                      # create

ages["alice"] = 30             # insert / set   O(1) avg
ages["bob"]   = 25
ages["carol"] = 28

print(ages["bob"])             # get            O(1) avg -> 25

print("dave" in ages)          # membership     O(1) avg -> False
del ages["alice"]              # remove         O(1) avg

# classic use: count things
counts = {}
for word in "to be or not to be".split():
    counts[word] = counts.get(word, 0) + 1
print(counts["to"])            # 2`,
          cpp: `#include <iostream>
#include <unordered_map>
#include <string>
using namespace std;

int main() {
    unordered_map<string, int> ages;      // create

    ages["alice"] = 30;                   // insert / set  O(1) avg
    ages["bob"]   = 25;
    ages["carol"] = 28;

    cout << ages["bob"] << endl;          // get           O(1) avg -> 25

    // membership (find, not operator[] — [] would insert!)
    cout << ages.count("dave") << endl;   // 0 (not present)

    ages.erase("alice");                  // remove        O(1) avg
    return 0;
}`,
        },
      },
      {
        order: 4,
        title: "Collisions",
        slug: "collisions",
        description: "Two keys, one slot — and how tables cope.",
        content: c(
          "Here's the mathematical problem: a hash function maps *many* possible keys onto *fewer* buckets. Collisions are **guaranteed eventually** — the birthday problem in disguise. Good functions make them rare; every table must still handle them.",
          "",
          "Two classic strategies:",
          "",
          "**1. Separate chaining** — each bucket holds a small list (chain) of all keys that hashed there. Lookup: hash the key, then scan just that short chain.",
          "",
          "```",
          "bucket[2]: [ alice -> 30 ]",
          "bucket[7]: [ bob -> 25 ] -> [ zoe -> 22 ]   # bob and zoe collided\n```",
          "",
          "Python's `dict` uses chaining in spirit (with a twist called open addressing in modern versions); our mini hash table below uses it too.",
          "",
          "**2. Open addressing** — everything lives in the array itself. On collision, probe forward to the next free slot (linear probing), or follow a smarter pattern (quadratic, double hashing).",
          "",
          "```",
          "store bob at 7 (taken by zoe?) -> try 8, then 9 ... first free slot\n```",
          "",
          "```python",
          "# mini hash table with chaining",
          "class HashTable:",
          "    def __init__(self, m=8):",
          "        self.m = m",
          "        self.t = [[] for _ in range(m)]   # buckets = empty lists",
          "",
          "    def put(self, k, v):",
          "        b = self.t[hash(k) % self.m]     # find the bucket",
          "        for i, (kk, _) in enumerate(b):",
          "            if kk == k:                    # key exists? update",
          "                b[i] = (k, v); return",
          "        b.append((k, v))                   # new pair",
          "",
          "    def get(self, k):",
          "        for kk, v in self.t[hash(k) % self.m]:",
          "            if kk == k: return v",
          "        return None\n```",
          "",
          "Whichever strategy: as long as collisions stay rare, **put and get remain O(1) on average**. Let too many keys pile in and performance slides toward O(n) — which is why real tables **resize** when they get crowded."
        ),
      },
      {
        order: 5,
        title: "Hashing in the real world",
        slug: "hashing-in-the-real-world",
        description: "Logins, caches, sets — and when not to hash.",
        content: c(
          "You use hash tables dozens of times a day without naming them:",
          "",
          "- **Login systems** — your password is checked against a stored *hash*, never plain text.",
          "- **Caches** — a URL is hashed to find its cached page in milliseconds.",
          "- **Sets & uniqueness** — a `set` is a hash table that only stores keys: deduplicate a list, detect repeats.",
          "- **Database indexes** — hash indexes give O(1) equality lookups on columns.",
          "- **Language runtimes** — Python names, JS objects, Ruby symbols: all hash maps underneath.",
          "",
          "```python",
          "# a set is a hash table of keys only",
          "seen = {3, 1, 4, 1, 5}",
          "print(seen)          # {1, 3, 4, 5}  — duplicates gone",
          "print(9 in seen)     # O(1) membership\n```",
          "",
          "**When hashing is the wrong tool:**",
          "",
          "- You need **sorted** iteration or range queries (`> 50`) — hash tables have no order. Use a sorted array, tree, or database index.",
          "- Keys are almost-always-colliding or hard to hash well.",
          "",
          "Rule of thumb: **need fast lookup by exact key? Hash. Need order or ranges? Something else.** Next up: a structure built entirely on order — the tree."
        ),
      },
    ],
    quiz: {
      questions: [
        {
          order: 1,
          prompt:
            "The main purpose of a hash function is to…",
          options: [
            "Sort the keys alphabetically",
            "Turn a key into a bucket address for O(1) lookup",
            "Compress files on disk",
            "Encrypt the value",
          ],
          correctIndex: 1,
          explanation:
            "Hash(key) → index. Same key, same slot — lookup without searching.",
        },
        {
          order: 2,
          prompt:
            "A hash function must be deterministic, which means…",
          options: [
            "It returns random numbers",
            "The same key always produces the same hash",
            "It only works on integers",
            "It never produces collisions",
          ],
          correctIndex: 1,
          explanation:
            "If the hash changed between store and fetch, the value could never be found again.",
        },
        {
          order: 3,
          prompt:
            "In Python, ages[\"bob\"] relies on which structure under the hood?",
          options: ["A sorted array", "A linked list", "A hash table", "A binary tree"],
          correctIndex: 2,
          explanation:
            "dict is a hash table: key hashed to a bucket, near-instant get/set.",
        },
        {
          order: 4,
          prompt:
            "A collision happens when…",
          options: [
            "The hash table is empty",
            "Two different keys hash to the same bucket",
            "The key is longer than the value",
            "The array is resized",
          ],
          correctIndex: 1,
          explanation:
            "Fewer buckets than possible keys means some bucket must hold more than one pair.",
        },
        {
          order: 5,
          prompt:
            "Separate chaining handles collisions by…",
          options: [
            "Storing each key in its own new array",
            "Keeping a list of colliding pairs at each bucket",
            "Sorting all keys after every insert",
            "Deleting the older key",
          ],
          correctIndex: 1,
          explanation:
            "Each bucket becomes a small chain; lookup scans only that short list.",
        },
        {
          order: 6,
          prompt:
            "A set in Python is best thought of as…",
          options: [
            "A sorted array of unique items",
            "A hash table that stores only keys",
            "A queue with no duplicates",
            "A tree ordered by insertion",
          ],
          correctIndex: 1,
          explanation:
            "Sets give O(1) membership tests — the same hash-table trick with values stripped away.",
        },
      ],
    },
  },
  {
    number: 7,
    title: "Trees",
    slug: "trees",
    coldOpen:
      "Code Chronicles (Ep. 7): Zara opens a folder, then a folder inside it, then another. 'Folders inside folders…' Bit begins. 'A tree,' Zara smiles. 'Everything hierarchical you've ever used is one of these.'",
    outcomes: [
      "Describe trees using nodes, roots, leaves and levels.",
      "Walk a binary tree with in-order, pre-order and post-order traversals.",
      "Explain what makes a binary search tree fast — and where the speed comes from.",
    ],
    topics: [
      {
        order: 1,
        title: "What is a tree?",
        slug: "what-is-a-tree",
        description: "Hierarchical data: parents, children, leaves.",
        content: c(
          "Arrays and lists are *flat*: item 5 doesn't \"contain\" item 6. **Trees are hierarchical** — data nested inside data, like folders, org charts, or a family tree.",
          "",
          "```",
          "            [ A ]              <- root (top)",
          "           /     \\",
          "        [ B ]     [ C ]",
          "        /   \\         \\",
          "      [ D ] [ E ]     [ F ]   <- leaves (no children)\n```",
          "",
          "Vocabulary (locked in now — trees never feel scary again):",
          "",
          "- **Node** — one item holding data + references to its children.",
          "- **Root** — the top node; every node descends from it.",
          "- **Parent / child** — the direct relationships above/below.",
          "- **Leaf** — a node with no children.",
          "- **Edge** — the link between a parent and a child.",
          "- **Height** — the longest path from root down to a leaf.",
          "- **Level** — depth counting from the root (root = level 0).",
          "",
          "**Why trees beat flat lists:** they *divide the search space*. At each node you make a decision that eliminates whole branches — the same halving idea as binary search, but the data itself is arranged to exploit it."
        ),
      },
      {
        order: 2,
        title: "Binary trees",
        slug: "binary-trees",
        description: "At most two children — simple enough to master.",
        content: c(
          "A **binary tree**: every node has **at most two children** — a `left` and a `right`. That's the whole definition, and it's the sweet spot between simplicity and power (file-system trees can have many children; most algorithm classics stick to two).",
          "",
          "```python",
          "class TreeNode:",
          "    def __init__(self, val):",
          "        self.val   = val",
          "        self.left  = None    # child",
          "        self.right = None    # child",
          "",
          "# build this tree:",
          "#        1",
          "#       / \\",
          "#      2   3",
          "#     /",
          "#    4",
          "root = TreeNode(1)",
          "root.left      = TreeNode(2)",
          "root.right     = TreeNode(3)",
          "root.left.left = TreeNode(4)\n```",
          "",
          "In C++ the same shape uses `TreeNode*` pointers (as in the linked-list chapter).",
          "",
          "Two special flavours you'll meet constantly:",
          "",
          "- **Full** — every node has 0 or 2 children (never just 1).",
          "- **Complete** — filled level by level, left to right (heap-shaped; we'll see this under \"what's next\").",
          "",
          "Nothing else is required. Trees stay this friendly because the branching factor is small — which is what makes the next operations (traversals, searches) clean enough to reason about by hand."
        ),
      },
      {
        order: 3,
        title: "Recursion in three minutes",
        slug: "recursion-in-three-minutes",
        description: "The engine that drives every tree algorithm.",
        content: c(
          "You met recursion under stacks (Chapter 04). Trees are where it becomes *essential* — because a tree is recursion made visible: **a tree is a node plus (smaller) trees on each side.**",
          "",
          "```",
          "tree(1) = node(1) + tree(2) + tree(3)",
          "tree(2) = node(2) + tree(4) + empty",
          "...\n```",
          "",
          "So the code writes itself:",
          "",
          "```python",
          "def walk(node):",
          "    if node is None:          # base case: empty tree",
          "        return",
          "    print(node.val)           # do something with the node",
          "    walk(node.left)           # recurse on the smaller tree",
          "    walk(node.right)          # recurse on the other side\n```",
          "",
          "Three questions answer *every* recursive tree problem:",
          "",
          "1. **Base case** — an empty node (`None`): stop.",
          "2. **Work** — what do I do at this node? (print, count, compare…)",
          "3. **Recurse** — call the same function on left and right.",
          "",
          "The call stack does all the bookkeeping — exactly the mechanism from Chapter 04. If a tree solution feels impossible, it's almost always because the base case is missing. Fix that first; the rest follows."
        ),
      },
      {
        order: 4,
        title: "Tree traversals",
        slug: "tree-traversals",
        description: "Visit every node — three classic orders, one queue order.",
        content: c(
          "To \"process\" a tree (print it, sum it, serialise it) you need a **traversal**: a guaranteed order that visits every node exactly once. Three depth-first classics differ only in **when they visit the node itself**:",
          "",
          "| Order | When node is visited | Result on this tree |",
          "| --- | --- | --- |",
          "| **Pre-order** | *Before* children | 1 2 4 3 |",
          "| **In-order** | *Between* children | 4 2 1 3 |",
          "| **Post-order** | *After* children | 4 2 3 1 |",
          "",
          "```",
          "        1",
          "       / \\",
          "      2   3",
          "     /",
          "    4\n```",
          "",
          "```python",
          "def preorder(r):                       # node, left, right",
          "    if r: print(r.val); preorder(r.left); preorder(r.right)",
          "",
          "def inorder(r):                        # left, node, right",
          "    if r: inorder(r.left); print(r.val); inorder(r.right)",
          "",
          "def postorder(r):                      # left, right, node",
          "    if r: postorder(r.left); postorder(r.right); print(r.val)\n```",
          "",
          "There's also a fourth — **level-order** — which visits top to bottom, left to right. That's not recursion; it's a **queue** (exactly the BFS machinery from Chapter 05):",
          "",
          "```python",
          "from collections import deque",
          "def levelorder(r):",
          "    q = deque([r] if r else [])",
          "    while q:",
          "        n = q.popleft(); print(n.val)",
          "        if n.left:  q.append(n.left)",
          "        if n.right: q.append(n.right)\n```",
          "",
          "**Which one when?** In-order is magical on binary *search* trees (next topic) — it emits values in sorted order. Pre-order copies/serialises a tree; post-order deletes it (children before parent); level-order is for \"nearest first\" questions."
        ),
      },
      {
        order: 5,
        title: "Binary search trees",
        slug: "binary-search-trees",
        description: "The ordering rule that turns a tree into a fast dictionary.",
        content: c(
          "A **binary search tree (BST)** adds one rule to a binary tree:",
          "",
          "> For any node: everything in the **left** subtree is **smaller**, everything in the **right** subtree is **larger**.",
          "",
          "```",
          "            8",
          "           / \\",
          "          3   10",
          "         / \\    \\",
          "        1   6   14\n```",
          "",
          "That rule is binary search, encoded into the shape. To find `6`: start at 8 → 6 < 8 go left → 6 > 3 go right → found. Each step **halves the remaining tree** — O(log n) when the tree is balanced.",
          "",
          "**Insert** follows the same walk: go left or right until you find an empty slot; place the node there. **In-order traversal of a BST always prints values in sorted order** — a free bonus.",
          "",
          "```python",
          "def insert(r, k):",
          "    if r is None: return TreeNode(k)",
          "    if k < r.val:  r.left  = insert(r.left, k)",
          "    elif k > r.val: r.right = insert(r.right, k)",
          "    return r          # equal keys: already present",
          "",
          "def search(r, k):",
          "    while r and r.val != k:",
          "        r = r.left if k < r.val else r.right",
          "    return r          # None = not found\n```",
          "",
          "**The catch — balance.** Insert sorted data (1, 2, 3, 4…) and a BST degrades into a linked list: O(n) lookups. Real systems use *self-balancing* variants (AVL trees, red-black trees) that rotate to keep height logarithmic. You don't need their mechanics yet — just the insight: **a tree's speed is only as good as its balance.**"
        ),
      },
      {
        order: 6,
        title: "Trees in the real world",
        slug: "trees-everywhere",
        description: "File systems, autocomplete, databases — everywhere.",
        content: c(
          "Trees are the hierarchy workhorse of software:",
          "",
          "- **File systems** — folders inside folders: the original tree.",
          "- **The DOM** — every web page you open is a tree of HTML elements.",
          "- **Autocomplete / dictionaries** — a *trie* (prefix tree) stores words letter by letter; matching a prefix means walking down one path.",
          "- **Database indexes** — B-trees/B+ trees keep millions of rows searchable while staying shallow (they pack many keys per node to match disk layout).",
          "- **Compilers** — source code is parsed into an *abstract syntax tree* before it runs.",
          "- **Organ charts, comment threads, sitemaps** — anything with parent-child shape.",
          "",
          "**Trees vs hash tables — the pairing to remember:**",
          "",
          "| Need | Tool |",
          "| --- | --- |",
          "| Fast lookup by exact key | Hash table (Ch. 06) |",
          "| Sorted order / ranges / min-max | Tree (this chapter) |",
          "| Hierarchy itself | Tree |",
          "",
          "You now hold six structures: arrays, lists, stacks, queues, hashes, trees. The final structure unifies maps, networks and even these trees — the **graph**."
        ),
      },
    ],
    quiz: {
      questions: [
        {
          order: 1,
          prompt: "In a tree, a node with no children is called…",
          options: ["The root", "A leaf", "An edge", "A sibling"],
          correctIndex: 1,
          explanation: "Leaves are the endpoints; the root is the top.",
        },
        {
          order: 2,
          prompt: "A binary tree node has at most…",
          options: ["One child", "Two children", "Three children", "Unlimited children"],
          correctIndex: 1,
          explanation: "Left and right — that's the entire branching rule.",
        },
        {
          order: 3,
          prompt: "Which traversal visits left subtree, then the node, then right subtree?",
          options: ["Pre-order", "In-order", "Post-order", "Level-order"],
          correctIndex: 1,
          explanation:
            "In-order: left → node → right (sorted output on a BST).",
        },
        {
          order: 4,
          prompt: "Level-order traversal of a tree is implemented with…",
          options: ["A stack", "A queue", "A hash map", "Recursion only"],
          correctIndex: 1,
          explanation:
            "A queue processes nodes in the exact order they were discovered — top to bottom, left to right.",
        },
        {
          order: 5,
          prompt: "In a binary search tree, values smaller than a node go…",
          options: [
            "To the right subtree",
            "To the left subtree",
            "To the root",
            "Into a hash table",
          ],
          correctIndex: 1,
          explanation:
            "Left = smaller, right = larger — the rule that makes search O(log n) when balanced.",
        },
        {
          order: 6,
          prompt:
            "A BST built from already-sorted data degrades into…",
          options: [
            "A balanced tree",
            "A linked list (worst-case O(n))",
            "A hash table",
            "A complete binary tree",
          ],
          correctIndex: 1,
          explanation:
            "Each insert goes the same direction, producing a stick — balance is what buys the speed.",
        },
        {
          order: 7,
          prompt: "Which real system is *not* typically tree-structured?",
          options: [
            "A file system",
            "A web page's HTML (DOM)",
            "A print job queue",
            "A database index",
          ],
          correctIndex: 2,
          explanation:
            "Print jobs are FIFO — that's a queue (Chapter 05), not a hierarchy.",
        },
      ],
    },
  },
  {
    number: 8,
    title: "Graphs",
    slug: "graphs",
    coldOpen:
      "Code Chronicles (Ep. 8): Zara pins cities to a board and stretches string between them. 'Roads, friendships, the web itself — everything connected,' she says. 'Trees had one path down. Here, paths loop and cross. Time for the big one.'",
    outcomes: [
      "Model networks as graphs with nodes and edges — directed or undirected.",
      "Represent a graph with an adjacency list and know the adjacency matrix alternative.",
      "Run breadth-first and depth-first search, and know when each fits.",
    ],
    topics: [
      {
        order: 1,
        title: "What is a graph?",
        slug: "what-is-a-graph",
        description: "Nodes, edges — and why trees are special graphs.",
        content: c(
          "A **graph** is the most general structure in this course: a set of **nodes** (vertices) connected by **edges**. That's it — no root, no order, no one-direction rule.",
          "",
          "```",
          "   A --- B       nodes: A B C D",
          "   |   / |       edges: A-B, A-C, B-C, B-D, C-D",
          "   C --- D\n```",
          "",
          "Key terms:",
          "",
          "- **Directed** — edges have an arrow (follower relationships); **undirected** — two-way (roads on a map).",
          "- **Weighted** — edges carry a cost (km, price); **unweighted** — connections only.",
          "- **Path** — a sequence of edges linking two nodes; **cycle** — a path that returns to its start.",
          "",
          "Notice: **a tree is just an acyclic connected graph** — this chapter generalises trees by allowing extra edges and cycles. That's why graphs feel both familiar and wild.",
          "",
          "Real graphs surround you: road networks, social networks, the link structure of the web, dependency graphs in package managers, even recommendation \"you might like\" edges. Whenever the shape is **connections**, not hierarchy, you're looking at a graph."
        ),
      },
      {
        order: 2,
        title: "Representing graphs",
        slug: "representing-graphs",
        description: "Adjacency lists vs matrices — pick by density.",
        content: c(
          "Two standard ways to store a graph in code:",
          "",
          "**1. Adjacency list** — for each node, a list of its neighbours. Sparse-friendly, the default in almost all code.",
          "",
          "**2. Adjacency matrix** — a `V × V` grid; `matrix[u][v] = 1` (or the weight) if an edge exists. Dense-friendly, O(1) edge checks, but O(V²) memory even when most pairs have no edge.",
          "",
          "```",
          "graph:  0-1, 0-2, 1-2, 2-3",
          "",
          "adjacency list:        adjacency matrix:",
          "  0: [1, 2]              0 1 1 0",
          "  1: [0, 2]              1 0 1 0",
          "  2: [0, 1, 3]           1 1 0 1",
          "  3: [2]                 0 0 1 0\n```",
          "",
          "```python",
          "# adjacency list from edge pairs",
          "edges = [(0, 1), (0, 2), (1, 2), (2, 3)]",
          "n = 4",
          "adj = [[] for _ in range(n)]",
          "for u, v in edges:",
          "    adj[u].append(v)",
          "    adj[v].append(u)      # undirected: both directions",
          "",
          "print(adj[0])   # [1, 2]\n```",
          "",
          "**Rule of thumb:** road maps and social graphs are huge and sparse → adjacency list. Chess-board style grids or dense competition graphs → matrix. Everything in this course uses adjacency lists."
        ),
      },
      {
        order: 3,
        title: "Breadth-first search (BFS)",
        slug: "breadth-first-search",
        description: "Explore in rings — shortest path in unweighted graphs.",
        content: c(
          "You already know the machine: **BFS is a queue at work** (Chapter 05, as promised). Start at a node, visit all neighbours, then their neighbours — expanding in concentric **rings** of distance 1, 2, 3…",
          "",
          "```",
          "     A",
          "    / \\          ring 1: B, C",
          "   B   C         ring 2: D, E",
          "  / \\ /",
          " D   E\n```",
          "",
          "```python",
          "from collections import deque",
          "",
          "def bfs(adj, start):",
          "    seen  = {start}",
          "    order = []",
          "    q = deque([start])",
          "    while q:",
          "        u = q.popleft()            # oldest first — FIFO!",
          "        order.append(u)",
          "        for v in adj[u]:",
          "            if v not in seen:",
          "                seen.add(v); q.append(v)",
          "    return order\n```",
          "",
          "The queue guarantees you process a node only after *everything closer* has been processed. Two superpowers fall out:",
          "",
          "1. **Shortest path (unweighted)** — first time you reach a node via BFS, you've used the fewest hops. Map that parent link and you have the actual path.",
          "2. **Level-by-level processing** — \"all friends within 2 hops\", \"nearest exits first\".",
          "",
          "Cost: **O(V + E)** — every node and edge considered once. If the problem smells like \"fewest steps\" or \"nearest first\", BFS is your default."
        ),
      },
      {
        order: 4,
        title: "Depth-first search (DFS)",
        slug: "depth-first-search",
        description: "Go deep, backtrack — the stack's second act.",
        content: c(
          "DFS is the opposite instinct: from the current node, push as deep as possible along one path, then **backtrack** and try the next branch. The tool is a **stack** — either an explicit one, or the call stack via recursion (your choice; both are the same algorithm).",
          "",
          "```python",
          "def dfs(adj, u, seen, order):",
          "    seen.add(u)",
          "    order.append(u)",
          "    for v in adj[u]:",
          "        if v not in seen:",
          "            dfs(adj, v, seen, order)   # recurse deep",
          "",
          "# usage:",
          "order = []",
          "dfs(adj, 0, set(), order)\n```",
          "",
          "Stack version (identical behaviour, no recursion depth limit):",
          "",
          "```python",
          "def dfs_iter(adj, start):",
          "    seen, order = {start}, []",
          "    stack = [start]",
          "    while stack:",
          "        u = stack.pop()             # newest first — LIFO!",
          "        order.append(u)",
          "        for v in reversed(adj[u]):",
          "            if v not in seen:",
          "                seen.add(v); stack.append(v)",
          "    return order\n```",
          "",
          "**What DFS is for** (when you don't need shortest paths):",
          "",
          "- **Cycle detection** — reach a node that's already on your current path.",
          "- **Connected components** — \"how many islands?\" in a network or grid.",
          "- **Topological sorting** — ordering build steps / course prerequisites (a DAG classic).",
          "- **Maze solving** — carve a path to the end, backtracking on dead ends.",
          "",
          "| | BFS | DFS |",
          "| --- | --- | --- |",
          "| Structure | Queue | Stack / recursion |",
          "| Finds | Shortest unweighted path | Deep structure, components, cycles |",
          "| Order | Ring by ring | Branch by branch |",
          "",
          "Cost is also **O(V + E)**. Shortest path → BFS. Explore structure or go deep → DFS."
        ),
      },
      {
        order: 5,
        title: "Graphs in the real world",
        slug: "graphs-in-the-real-world",
        description: "Maps, feeds, dependencies — the connective tissue of software.",
        content: c(
          "Graphs are arguably the most-applied structure in modern software:",
          "",
          "- **Maps & navigation** — cities = nodes, roads = weighted edges; GPS runs variants of Dijkstra/A* (BFS's weighted cousins).",
          "- **Social networks** — \"friends of friends\", degree of separation, feed ranking via graph walks.",
          "- **The web** — pages = nodes, links = directed edges; Google's original PageRank is a graph algorithm.",
          "- **Dependency managers** — `npm install` / `pip install` resolves a dependency *graph*; build systems topologically sort it (DFS's job).",
          "- **Recommendations** — \"users who bought X also bought Y\" is edge mining.",
          "- **Networks & routing** — packets find paths through router graphs.",
          "",
          "Even trees and heaps are graphs — graphs are the container that holds the rest of this course.",
          "",
          "**You've completed the main structures.** Arrays, lists, stacks, queues, hashes, trees, graphs. The last two chapters don't add new ones — they teach you to *choose* between them, and to see how they connect."
        ),
      },
    ],
    quiz: {
      questions: [
        {
          order: 1,
          prompt: "A graph consists of…",
          options: [
            "Nodes and edges",
            "Only sorted nodes",
            "A root and leaves only",
            "Exactly two children per node",
          ],
          correctIndex: 0,
          explanation:
            "Vertices (nodes) plus connections (edges) — no other constraints.",
        },
        {
          order: 2,
          prompt:
            "A social network 'friend' connection (mutual) is best modelled as…",
          options: [
            "A directed edge",
            "An undirected edge",
            "A sorted array",
            "A stack",
          ],
          correctIndex: 1,
          explanation:
            "If A is friends with B, B is friends with A — two-way, undirected.",
        },
        {
          order: 3,
          prompt:
            "For a large sparse graph (many nodes, few edges), the preferred representation is…",
          options: [
            "Adjacency matrix",
            "Adjacency list",
            "Sorted array of all pairs",
            "Hash table of hashes",
          ],
          correctIndex: 1,
          explanation:
            "Lists use O(V + E) memory; a matrix wastes O(V²) on empty edges.",
        },
        {
          order: 4,
          prompt: "BFS explores nodes in order of…",
          options: [
            "Descending depth first",
            "Discovery distance (rings: 1 hop, then 2, then 3…)",
            "Alphabetical name",
            "Random shuffle",
          ],
          correctIndex: 1,
          explanation:
            "The queue processes closer nodes before farther ones — that's what makes BFS shortest-path on unweighted graphs.",
        },
        {
          order: 5,
          prompt:
            "To find the fewest moves in a maze or unweighted grid, use…",
          options: ["DFS", "BFS", "In-order traversal", "Binary search"],
          correctIndex: 1,
          explanation:
            "Fewest steps = unweighted shortest path = BFS's signature move.",
        },
        {
          order: 6,
          prompt: "DFS is naturally implemented with…",
          options: ["A queue", "A stack (or recursion)", "A heap", "A sorted list"],
          correctIndex: 1,
          explanation:
            "Go deep, backtrack — last-in-first-out, the stack's other classic role.",
        },
      ],
    },
  },
  {
    number: 9,
    title: "Choosing the Right Structure",
    slug: "choosing-the-right-structure",
    coldOpen:
      "Code Chronicles (Ep. 9): The vault now holds every tool they've met. Bit reaches for the wrong one twice in a row. 'Stop guessing,' Zara says, laying them out in a row. 'Match the tool to the move — that's the real skill.'",
    outcomes: [
      "Pick the right structure for a problem by naming the dominant operation.",
      "See how stacks, queues, trees and graphs connect through traversals.",
      "Use a big-O cheat sheet to sanity-check your designs.",
    ],
    topics: [
      {
        order: 1,
        title: "Which structure, when?",
        slug: "which-structure-when",
        description: "Decision guide: name the operation, pick the tool.",
        content: c(
          "You now know seven structures. The skill that separates a beginner from a hireable engineer isn't implementing them — it's **choosing well in 30 seconds**. The reliable method: **name the dominant operation your program does most, then pick the structure where that operation is cheap.**",
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
          "There's no single \"best\" structure — only the best structure *for the operation you actually do*. When in doubt, write that sentence first; the data structure usually names itself."
        ),
      },
      {
        order: 2,
        title: "How everything connects",
        slug: "how-everything-connects",
        description: "One map of the whole course.",
        content: c(
          "These chapters weren't isolated. Each structure borrows from — or builds on — the ones before:",
          "",
          "- **Strings are arrays** (Ch. 02).",
          "- **A stack is an array or list with a discipline**: only touch the end (Ch. 04).",
          "- **A queue is a deque** — two ends open (Ch. 05).",
          "- **A set is a hash table** with values stripped (Ch. 06).",
          "- **A BST is a binary tree** plus an ordering rule — and its in-order traversal emits sorted output (Ch. 07).",
          "- **BFS on a graph uses a queue** (Ch. 05 → Ch. 08); **DFS uses a stack** (Ch. 04 → Ch. 08).",
          "- **Level-order tree traversal is BFS** on a special graph (Ch. 07 + 08).",
          "- **Recursion is the call stack** doing your bookkeeping (Ch. 04 → every tree algorithm).",
          "",
          "```",
          "arrays ──> linked lists ──> stacks / queues ──┐",
          "                     ^                         │",
          "                     │   (BFS/DFS built on them)│",
          "hashing ──────────> sets / maps                v",
          "trees (BST) ─────────────────────────────> graphs\n```",
          "",
          "That's the course in one diagram: linear structures → specialised ends → keyed access → hierarchy → full networks. Master the *connections* and interview problems stop feeling like eight separate trick bags — they become variations on one theme: **arrange the data so the operation you need is cheap.**"
        ),
      },
      {
        order: 3,
        title: "Big-O cheat sheet",
        slug: "big-o-cheat-sheet",
        description: "The growth rates you'll quote in interviews and design reviews.",
        content: c(
          "Big-O from Chapter 01, now attached to everything you've built:",
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
            "BFS on a graph is implemented using which structure from Chapter 05?",
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
  },
  {
    number: 10,
    title: "Wrap-Up & What's Next",
    slug: "wrap-up",
    coldOpen:
      "Code Chronicles (Ep. 10): Bit closes the vault, then reopens it on an empty workbench. 'So what do I build now?' Zara slides over a keyboard. 'Anything. That's the point.'",
    outcomes: [
      "Recap the full map of structures and the ideas connecting them.",
      "Choose sensible next topics: heaps, tries, advanced graphs, complexity in practice.",
      "Plan a small project that uses what you've learned.",
    ],
    topics: [
      {
        order: 1,
        title: "The journey so far",
        slug: "journey-so-far",
        description: "Ten chapters, one connected map — the recap.",
        content: c(
          "Look at what you can now do that you couldn't ten chapters ago:",
          "",
          "| Chapter | Structure | The one-line takeaway |",
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
          "That's the whole field in three questions. Everything after this course is new vocabulary applied to the same questions."
        ),
      },
      {
        order: 2,
        title: "What to learn next",
        slug: "what-to-learn-next",
        description: "Natural next stops: heaps, tries, and beyond.",
        content: c(
          "This course built the foundation. When you're ready, these are the natural next steps — each one built from pieces you already know:",
          "",
          "**Heaps & priority queues** — \"not first-come, but most-urgent\" (you met the idea in Chapter 05). A heap is a special complete binary tree (Chapter 07) that always exposes the min or max in O(1) — powering task schedulers, Dijkstra's algorithm, and \"top-k\" features.",
          "",
          "**Tries (prefix trees)** — trees specialised for strings; the structure behind autocomplete (previewed in Chapters 01 and 07).",
          "",
          "**Balanced trees & advanced maps** — AVL/red-black trees, B-trees: what databases use when hash tables can't give sorted order.",
          "",
          "**Weighted graph algorithms** — Dijkstra, A*, Bellman-Ford: BFS's cousins for roads with real distances (Chapter 08's direct extension).",
          "",
          "**Complexity in practice** — cache locality, constants, and why an \"slower\" O(n) algorithm sometimes beats a \"faster\" one on real hardware.",
          "",
          "**Interview patterns** — two pointers, sliding window, prefix sums, topological sort: tricks that combine the structures you know in familiar recipes.",
          "",
          "You don't need all of them. Pick the one that matches a problem you actually care about solving — motivation compounds faster than any syllabus."
        ),
      },
      {
        order: 3,
        title: "Build something",
        slug: "build-something",
        description: "Three project ideas that force the structures to work together.",
        content: c(
          "Nothing cements DSA like a small project that *needs* the right structure. Three ideas sized for a weekend or two — each one quietly uses several chapters at once:",
          "",
          "**1. A task manager with undo** — tasks in a list (Ch. 02), tags in a hash map (Ch. 06), undo/redo stacks (Ch. 04), due dates in a priority queue once you add scheduling (Ch. 05 + heaps next).",
          "",
          "**2. A tiny search engine** — inverted index: word → list of documents (hash map of lists, Ch. 03 + 06). Rank results; add prefix search with a trie when you're ready (Ch. 07's cousin).",
          "",
          "**3. A route planner** — cities and roads as a weighted graph (Ch. 08); implement BFS for fewest stops, then upgrade to Dijkstra for shortest distance. Visualise paths on a map and it becomes a portfolio piece.",
          "",
          "Rules for any project:",
          "",
          "- **Write the problem in one sentence first**, then name the dominant operation (Ch. 09's method).",
          "- **Sketch the data structures before coding** — five minutes here saves five hours later.",
          "- **Reuse the standard library** where it exists (`dict`, `deque`, `list`) — knowing the structure means knowing which built-in is already it.",
          "",
          "You came here to learn data structures and algorithms. You leave able to *choose* them — which was always the point. Open the vault whenever you like; everything inside is yours now."
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
            "Every recursive call pushes a frame — that's Chapter 04 meeting Chapter 07.",
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
            "Chapter 09's method: hot path first — the right structure usually names itself.",
        },
      ],
    },
  },
];
