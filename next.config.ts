import type { NextConfig } from "next";

// Old syllabus (13 modules) → new beginner syllabus (10 modules).
// Modules with renamed slugs: whole subtree (`/:path*` matches the module
// itself and every old topic under it) redirects to the new module root.
// Modules that kept their slug (linked-lists, stacks, queues) only need
// their removed topic slugs redirected — the module URL itself still works.
const oldModuleRedirects = [
  { from: "thinking-in-data-algorithms", to: "what-is-dsa" },
  { from: "analysing-algorithms", to: "what-is-dsa" },
  { from: "arrays-and-records", to: "arrays" },
  { from: "strings", to: "arrays" },
  { from: "searching-and-basic-sorting", to: "arrays" },
  { from: "recursion", to: "trees" },
  { from: "trees-and-bst", to: "trees" },
  { from: "graph-basics", to: "graphs" },
  { from: "hashing-and-review", to: "hashing" },
  { from: "assessment", to: "wrap-up" },
];

const sameSlugModuleTopics: Record<string, string> = {
  // linked-lists (old topics → new module root)
  "linked-lists/why-linked-lists": "linked-lists",
  "linked-lists/traversal": "linked-lists",
  "linked-lists/insertion": "linked-lists",
  "linked-lists/deletion": "linked-lists",
  "linked-lists/reversing-a-linked-list-classic": "linked-lists",
  "linked-lists/variants": "linked-lists",
  "linked-lists/array-vs-linked-list": "linked-lists",
  "linked-lists/two-pointer-tricks": "linked-lists",
  // stacks
  "stacks/the-stack-adt": "stacks",
  "stacks/array-implementation": "stacks",
  "stacks/application-1-balanced-parentheses": "stacks",
  "stacks/application-2-infix-postfix-prefix": "stacks",
  "stacks/application-3-recursion-and-undo": "stacks",
  "stacks/complexity": "stacks",
  // queues
  "queues/the-queue-adt": "queues",
  "queues/simple-array-queue-and-its-flaw": "queues",
  "queues/circular-queue": "queues",
  "queues/linked-queue": "queues",
  "queues/deque-double-ended-queue": "queues",
  "queues/priority-queue-introduction": "queues",
  "queues/applications": "queues",
  "queues/stack-vs-queue": "queues",
};

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // old course slug -> new naming system
      { source: "/courses/dsa-masterclass", destination: "/courses/dsa-101", permanent: true },
      // old flat topic URLs -> new course page (topic slugs changed with the rewrite)
      { source: "/courses/dsa-masterclass/:topic", destination: "/courses/dsa-101", permanent: false },

      // old assessment quiz lands on the new final assessment
      {
        source: "/courses/dsa-101/assessment/quiz",
        destination: "/courses/dsa-101/wrap-up/quiz",
        permanent: true,
      },

      // renamed modules: module page + every old topic underneath
      ...oldModuleRedirects.map(({ from, to }) => ({
        source: `/courses/dsa-101/${from}/:path*`,
        destination: `/courses/dsa-101/${to}`,
        permanent: true,
      })),

      // same-slug modules: removed topic slugs → module root
      ...Object.entries(sameSlugModuleTopics).map(([from, to]) => ({
        source: `/courses/dsa-101/${from}`,
        destination: `/courses/dsa-101/${to}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
