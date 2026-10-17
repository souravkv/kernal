import type { SeedModule } from "../types";

const c = (...lines: string[]) => lines.join("\n");

export const m06: SeedModule = {
  number: 6,
  title: "Hashing",
  slug: "hashing",
  summary:
    "Turning keys into addresses so lookup skips searching entirely — and handling the collisions that come with it.",
  intro:
    "Everything so far searched: arrays scan, lists walk, binary search needs sorted data. Hashing throws that away. You hand it a name, it computes an address, and the value is just *there* — one step, no scan. This module shows how that trick works, and how real hash tables survive it when two keys want the same slot.",
  topics: [
    {
      order: 1,
      title: "What is hashing?",
      slug: "what-is-hashing",
      content: c(
        "Suppose a wall of hundreds of tiny lockers. Each locker has a number, and there's a keypad: type a name, and exactly one locker pops open. No scanning row by row — the name itself *is* the address.",
        "",
        "That's hashing. A **hash function** takes a key (a name, a word, an ID) and computes a number — the **hash** — telling you *where* the value should live. Same key in, same hash out, every time.",
        "",
        "```",
        "key: \"alice\"   --hash-->  42   -> store value at slot 42",
        "key: \"bob\"     --hash-->  17   -> store value at slot 17\n```",
        "",
        "Lookups become **O(1)**: hash the key, jump to that slot, done. No scan, no walk — regardless of how many items are stored. That's why Python `dict`, JavaScript objects, database indexes, caches and password checks are all built on this idea. In Module 01 I said you already use these structures daily; this is the one behind `ages[\"bob\"]`.",
        "",
        "The catch: two keys can hash to the same slot — a **collision**. Managing collisions is the real engineering challenge, and we'll spend two topics on it. First, the three pieces every hash table has: a hash function, an array of **buckets**, and key-value pairs stored inside the buckets.",
        "",
        "> **Note:** Hashing doesn't make data *sorted* or *range-searchable* — it only makes *exact-key lookup* fast. 'Find user 47' is perfect for a hash table; 'find all users older than 30' is not."
      ),
    },
    {
      order: 2,
      title: "Hash functions",
      slug: "hash-functions",
      content: c(
        "A hash table is only as trustworthy as its hash function, so every decent one obeys three rules:",
        "",
        "1. **Deterministic** — the same key always produces the same hash. Break this and nothing is findable: you'd store with one hash and look up with another.",
        "2. **Fast** — computed in about O(1); hashing happens on every store and every lookup.",
        "3. **Evenly spread** — different keys should scatter across buckets. Clumping is what causes collisions.",
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
        "Modulo arithmetic is the classic beginner hash: take the remainder, land somewhere in range. Real hash functions are more careful — languages ship battle-tested ones (`hash()` in Python, `std::hash` in C++).",
        "",
        "The same one-way idea also secures passwords: a server stores a hash of your password, never the password itself (Module 01 mentioned this — now you know why it's called a hash).",
        "",
        "One design choice worth knowing: **bucket count**. More buckets means fewer collisions but more memory. Most implementations start small and **resize** — grow the array and rehash everything — once the table gets too full.",
        "",
        "> **Note:** Rehashing is expensive (every key is recomputed), but it happens rarely. Amortised across all the inserts, put stays about O(1)."
      ),
    },
    {
      order: 3,
      title: "Dictionaries & maps",
      slug: "dictionaries-and-maps",
      content: c(
        "You've already used a hash table — it's the `dict` in Python and the `unordered_map` in C++. Both store **key → value** pairs with near-instant set and get. Use the tabs below to compare them line by line.",
        "",
        "Typical jobs: count word frequencies, look up a user by ID, cache an expensive result, group anagrams. Any time you'd say *\"look it up by name\"*, a map is the tool — and by now you know *why* it's fast: the key gets hashed straight to its bucket.",
        "",
        "> **Note:** In C++, `ages[\"dave\"]` on a missing key *inserts* a default value. Use `ages.count(\"dave\")` or `find` when you only want to check existence — otherwise you'll pollute the map with empty entries. Python's `d[\"dave\"]` instead raises KeyError; use `d.get(\"dave\")` to avoid it."
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
      content: c(
        "Here's the mathematical fact that no hash function can dodge: a hash maps *many* possible keys onto *fewer* buckets. Collisions are **guaranteed eventually** — it's the birthday problem in disguise. A good function makes them rare; every table must still handle them.",
        "",
        "Two classic strategies:",
        "",
        "**1. Separate chaining** — each bucket holds a small list (chain) of all keys that hashed there. Lookup: hash the key, then scan just that short chain.",
        "",
        "```",
        "bucket[2]: [ alice -> 30 ]",
        "bucket[7]: [ bob -> 25 ] -> [ zoe -> 22 ]   # bob and zoe collided\n```",
        "",
        "**2. Open addressing** — everything lives in the array itself. On collision, probe forward to the next free slot (linear probing), or follow a smarter pattern (quadratic probing, double hashing).",
        "",
        "```",
        "store bob at 7 (taken by zoe?) -> try 8, then 9 ... first free slot\n```",
        "",
        "Here's a small chained hash table you can read end to end — this is the whole data structure:",
        "",
        "```python",
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
        "Whichever strategy you pick: while collisions stay rare, **put and get remain O(1) on average**. Let too many keys pile into one bucket and performance slides toward O(n) — which is exactly why real tables **resize** when they get crowded.",
        "",
        "> **Remember:** average case, not worst case. A hostile key set (or a careless hash) can force collisions on purpose — a real attack called hash-flooding. Modern languages add randomness to their hash functions to prevent it."
      ),
    },
    {
      order: 5,
      title: "Hashing in the real world",
      slug: "hashing-in-the-real-world",
      content: c(
        "You use hash tables dozens of times a day without naming them:",
        "",
        "- **Login systems** — your password is checked against a stored *hash*, never plain text.",
        "- **Caches** — a URL is hashed to find its cached page in milliseconds.",
        "- **Sets & uniqueness** — a `set` is a hash table that only stores keys: deduplicate a list, detect repeats.",
        "- **Database indexes** — hash indexes give O(1) equality lookups on a column.",
        "- **Language runtimes** — Python names, JS objects, Ruby symbols: all hash maps underneath.",
        "",
        "The set example deserves one line of code, because it's the handiest trick in the language:",
        "",
        "```python",
        "# a set is a hash table of keys only",
        "seen = {3, 1, 4, 1, 5}",
        "print(seen)          # {1, 3, 4, 5}  — duplicates gone",
        "print(9 in seen)     # O(1) membership\n```",
        "",
        "And when hashing is the *wrong* tool:",
        "",
        "- You need **sorted** iteration or range queries (`give me everything > 50`) — hash tables have no order. Use a sorted array, a tree, or a database index.",
        "- Your keys barely differ and collide constantly.",
        "",
        "> **Rule of thumb:** need fast lookup by *exact key*? Hash. Need order or ranges? Something else. That 'something else' is the next module — a structure built entirely on order."
      ),
    },
  ],
  quiz: {
    questions: [
      {
        order: 1,
        prompt: "The main purpose of a hash function is to…",
        options: [
          "Sort the keys alphabetically",
          "Turn a key into a bucket address for O(1) lookup",
          "Compress files on disk",
          "Encrypt the value",
        ],
        correctIndex: 1,
        explanation: "Hash(key) → index. Same key, same slot — lookup without searching.",
      },
      {
        order: 2,
        prompt: "A hash function must be deterministic, which means…",
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
        prompt: "In Python, ages[\"bob\"] relies on which structure under the hood?",
        options: ["A sorted array", "A linked list", "A hash table", "A binary tree"],
        correctIndex: 2,
        explanation: "dict is a hash table: key hashed to a bucket, near-instant get/set.",
      },
      {
        order: 4,
        prompt: "A collision happens when…",
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
        prompt: "Separate chaining handles collisions by…",
        options: [
          "Storing each key in its own new array",
          "Keeping a list of colliding pairs at each bucket",
          "Sorting all keys after every insert",
          "Deleting the older key",
        ],
        correctIndex: 1,
        explanation: "Each bucket becomes a small chain; lookup scans only that short list.",
      },
      {
        order: 6,
        prompt: "A set in Python is best thought of as…",
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
};
