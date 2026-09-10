export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  starterCode: Record<string, string>;
  testCases: { input: string; expected: string }[];
  hiddenTestCases: { input: string; expected: string }[];
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
}

export const practiceProblems: Problem[] = [
  {
    id: "hello-world",
    title: "Hello World",
    difficulty: "Easy",
    description: `Write a program that prints exactly \`Hello, World!\` followed by a newline.

This is your first program on Kernal. Successfully submitting this confirms your environment is working correctly.`,
    starterCode: {
      python: `print("Hello, World!")`,
      javascript: `console.log("Hello, World!");`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}`,
      java: `class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
      c: `#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
    },
    examples: [
      { input: "", output: "Hello, World!" },
    ],
    constraints: ["Output must be exactly: Hello, World!"],
    testCases: [
      { input: "", expected: "Hello, World!" },
    ],
    hiddenTestCases: [],
  },
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Return the answer in any order.`,
    starterCode: {
      python: `def two_sum(nums, target):
    # Write your solution here
    pass

# Test
print(two_sum([2, 7, 11, 15], 9))`,
      javascript: `function twoSum(nums, target) {
    // Write your solution here
}

// Test
console.log(twoSum([2, 7, 11, 15], 9));`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    auto result = twoSum(nums, 9);
    cout << "[" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] result = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println("[" + result[0] + ", " + result[1] + "]");
    }
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

void twoSum(int* nums, int numsSize, int target, int* result) {
    // Write your solution here
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int result[2];
    twoSum(nums, 4, 9, result);
    printf("[%d, %d]\\n", result[0], result[1]);
    return 0;
}`,
    },
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
    testCases: [
      { input: "2 7 11 15\n9", expected: "0\n1" },
      { input: "3 2 4\n6", expected: "1\n2" },
      { input: "3 3\n6", expected: "0\n1" },
    ],
    hiddenTestCases: [
      { input: "1 5 3 7 2 8\n10", expected: "3\n4" },
      { input: "-1 -2 -3 -4 -5\n-8", expected: "2\n4" },
      { input: "0 4 3 0\n0", expected: "0\n3" },
    ],
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    starterCode: {
      python: `def reverse_string(s):
    # Write your solution here
    pass

# Test
s = list("hello")
reverse_string(s)
print("".join(s))`,
      javascript: `function reverseString(s) {
    // Write your solution here
}

// Test
let s = ["h","e","l","l","o"];
reverseString(s);
console.log(s.join(","));`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void reverseString(vector<char>& s) {
    // Write your solution here
}

int main() {
    vector<char> s = {'h','e','l','l','o'};
    reverseString(s);
    for (char c : s) cout << c;
    cout << endl;
    return 0;
}`,
      java: `class Main {
    public static void reverseString(char[] s) {
        // Write your solution here
    }

    public static void main(String[] args) {
        char[] s = {'h','e','l','l','o'};
        reverseString(s);
        System.out.println(new String(s));
    }
}`,
      c: `#include <stdio.h>
#include <string.h>

void reverseString(char* s, int sSize) {
    // Write your solution here
}

int main() {
    char s[] = "hello";
    reverseString(s, 5);
    printf("%s\\n", s);
    return 0;
}`,
    },
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character."],
    testCases: [
      { input: "hello", expected: "olleh" },
      { input: "Hannah", expected: "hannaH" },
      { input: "ab", expected: "ba" },
    ],
    hiddenTestCases: [
      { input: "a", expected: "a" },
      { input: "abcdefg", expected: "gfedcba" },
    ],
  },
  {
    id: "fibonacci",
    title: "Fibonacci Number",
    difficulty: "Easy",
    description: `The Fibonacci numbers, commonly denoted \`F(n)\`, form a sequence called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

Given \`n\`, calculate \`F(n)\`.

- F(0) = 0, F(1) = 1
- F(n) = F(n - 1) + F(n - 2), for n > 1`,
    starterCode: {
      python: `def fibonacci(n):
    # Write your solution here
    pass

# Test
for i in range(7):
    print(fibonacci(i), end=" ")
print()`,
      javascript: `function fibonacci(n) {
    // Write your solution here
}

// Test
for (let i = 0; i < 7; i++) {
    process.stdout.write(fibonacci(i) + " ");
}
console.log();`,
      cpp: `#include <iostream>
using namespace std;

int fibonacci(int n) {
    // Write your solution here
    return 0;
}

int main() {
    for (int i = 0; i < 7; i++) {
        cout << fibonacci(i) << " ";
    }
    cout << endl;
    return 0;
}`,
      java: `class Main {
    public static int fibonacci(int n) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 7; i++) {
            sb.append(fibonacci(i)).append(" ");
        }
        System.out.println(sb.toString().trim());
    }
}`,
      c: `#include <stdio.h>

int fibonacci(int n) {
    // Write your solution here
    return 0;
}

int main() {
    for (int i = 0; i < 7; i++) {
        printf("%d ", fibonacci(i));
    }
    printf("\\n");
    return 0;
}`,
    },
    examples: [
      { input: "n = 2", output: "1", explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1" },
      { input: "n = 4", output: "3", explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3" },
      { input: "n = 0", output: "0" },
    ],
    constraints: ["0 <= n <= 30"],
    testCases: [
      { input: "2", expected: "1" },
      { input: "4", expected: "3" },
      { input: "0", expected: "0" },
      { input: "1", expected: "1" },
      { input: "6", expected: "8" },
    ],
    hiddenTestCases: [
      { input: "10", expected: "55" },
      { input: "20", expected: "6765" },
      { input: "30", expected: "832040" },
    ],
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    starterCode: {
      python: `def is_valid(s):
    # Write your solution here
    pass

# Test
print(is_valid("()"))
print(is_valid("()[]{}"))
print(is_valid("(]"))`,
      javascript: `function isValid(s) {
    // Write your solution here
}

// Test
console.log(isValid("()"));
console.log(isValid("()[]{}"));
console.log(isValid("(]"));`,
      cpp: `#include <iostream>
#include <stack>
using namespace std;

bool isValid(string s) {
    // Write your solution here
    return false;
}

int main() {
    cout << (isValid("()") ? "true" : "false") << endl;
    cout << (isValid("()[]{}") ? "true" : "false") << endl;
    cout << (isValid("(]") ? "true" : "false") << endl;
    return 0;
}`,
      java: `class Main {
    public static boolean isValid(String s) {
        // Write your solution here
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isValid("()"));
        System.out.println(isValid("()[]{}"));
        System.out.println(isValid("(]"));
    }
}`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool isValid(char* s) {
    // Write your solution here
    return false;
}

int main() {
    printf("%s\\n", isValid("()") ? "true" : "false");
    printf("%s\\n", isValid("()[]{}") ? "true" : "false");
    printf("%s\\n", isValid("(]") ? "true" : "false");
    return 0;
}`,
    },
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
    testCases: [
      { input: "()", expected: "true" },
      { input: "()[]{}", expected: "true" },
      { input: "(]", expected: "false" },
      { input: "([)]", expected: "false" },
      { input: "{[]}", expected: "true" },
    ],
    hiddenTestCases: [
      { input: "((()))", expected: "true" },
      { input: "({[}])", expected: "false" },
    ],
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    starterCode: {
      python: `def max_subarray(nums):
    # Write your solution here (Kadane's algorithm)
    pass

# Test
print(max_subarray([-2,1,-3,4,-1,2,1,-5,4]))
print(max_subarray([1]))
print(max_subarray([5,4,-1,7,8]))`,
      javascript: `function maxSubArray(nums) {
    // Write your solution here
}

// Test
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));
console.log(maxSubArray([1]));
console.log(maxSubArray([5,4,-1,7,8]));`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> nums1 = {-2,1,-3,4,-1,2,1,-5,4};
    cout << maxSubArray(nums1) << endl;
    vector<int> nums2 = {1};
    cout << maxSubArray(nums2) << endl;
    vector<int> nums3 = {5,4,-1,7,8};
    cout << maxSubArray(nums3) << endl;
    return 0;
}`,
      java: `class Main {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4}));
        System.out.println(maxSubArray(new int[]{1}));
        System.out.println(maxSubArray(new int[]{5,4,-1,7,8}));
    }
}`,
      c: `#include <stdio.h>

int maxSubArray(int* nums, int numsSize) {
    // Write your solution here
    return 0;
}

int main() {
    int nums1[] = {-2,1,-3,4,-1,2,1,-5,4};
    printf("%d\\n", maxSubArray(nums1, 9));
    int nums2[] = {1};
    printf("%d\\n", maxSubArray(nums2, 1));
    int nums3[] = {5,4,-1,7,8};
    printf("%d\\n", maxSubArray(nums3, 5));
    return 0;
}`,
    },
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1", explanation: "The subarray [1] has the largest sum 1." },
      { input: "nums = [5,4,-1,7,8]", output: "23", explanation: "The subarray [5,4,-1,7,8] has the largest sum 23." },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    testCases: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", expected: "6" },
      { input: "1", expected: "1" },
      { input: "5 4 -1 7 8", expected: "23" },
    ],
    hiddenTestCases: [
      { input: "-1", expected: "-1" },
      { input: "-2 -1", expected: "-1" },
      { input: "1 2 3 4 5", expected: "15" },
    ],
  },
  {
    id: "merge-sorted",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
    starterCode: {
      python: `def merge_two_lists(l1, l2):
    # Write your solution
    pass

def list_to_str(head):
    result = []
    while head:
        result.append(str(head[0]))
        head = head[1] if len(head) > 1 else None
    return " -> ".join(result) if result else "NULL"

# Test as arrays for simplicity
print(merge_two_lists([1,2,4], [1,3,4]))`,
      javascript: `function mergeTwoLists(l1, l2) {
    // Write your solution here
    return [];
}

// Test
console.log(mergeTwoLists([1,2,4], [1,3,4]));`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> mergeTwoLists(vector<int>& l1, vector<int>& l2) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> l1 = {1,2,4}, l2 = {1,3,4};
    auto result = mergeTwoLists(l1, l2);
    for (int i = 0; i < result.size(); i++) {
        cout << result[i] << (i < result.size()-1 ? " " : "\\n");
    }
    return 0;
}`,
      java: `class Main {
    public static int[] mergeTwoLists(int[] l1, int[] l2) {
        // Write your solution here
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] result = mergeTwoLists(new int[]{1,2,4}, new int[]{1,3,4});
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.length; i++) {
            sb.append(result[i]);
            if (i < result.length - 1) sb.append(" ");
        }
        System.out.println(sb.toString());
    }
}`,
      c: `#include <stdio.h>

int mergeTwoLists(int* l1, int n1, int* l2, int n2, int* result) {
    // Write your solution - return merged size
    return 0;
}

int main() {
    int l1[] = {1,2,4}, l2[] = {1,3,4};
    int result[6];
    int n = mergeTwoLists(l1, 3, l2, 3, result);
    for (int i = 0; i < n; i++) {
        printf("%d ", result[i]);
    }
    printf("\\n");
    return 0;
}`,
    },
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]" },
      { input: "list1 = [], list2 = [0]", output: "[0]" },
    ],
    constraints: ["Both lists are sorted in non-decreasing order."],
    testCases: [
      { input: "1 2 4\n1 3 4", expected: "1 1 2 3 4 4" },
      { input: "\n", expected: "" },
      { input: "\n0", expected: "0" },
    ],
    hiddenTestCases: [
      { input: "1 3 5 7\n2 4 6 8", expected: "1 2 3 4 5 6 7 8" },
      { input: "5\n1 2 3", expected: "1 2 3 5" },
    ],
  },
];

export function getProblemById(id: string): Problem | undefined {
  return practiceProblems.find((p) => p.id === id);
}
