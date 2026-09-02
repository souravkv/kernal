import courseData from "./courses.json";

export interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  codeExample?: string;
  language?: string;
  practiceProblems: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  topics: Topic[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  instructor: string;
  duration: string;
  level: string;
  students: number;
  rating: number;
  price: number;
  tags: string[];
  chapters: Chapter[];
}

export const dsaCourse: Course = courseData as Course;

export function getCourseBySlug(slug: string): Course | undefined {
  if (slug === dsaCourse.slug) return dsaCourse;
  return undefined;
}

export function getTopicBySlug(courseSlug: string, topicSlug: string): { chapter: Chapter; topic: Topic } | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;
  for (const chapter of course.chapters) {
    const topic = chapter.topics.find(t => t.slug === topicSlug);
    if (topic) return { chapter, topic };
  }
  return undefined;
}

export function getNextTopic(courseSlug: string, currentTopicSlug: string): Topic | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;
  const allTopics = course.chapters.flatMap(c => c.topics);
  const idx = allTopics.findIndex(t => t.slug === currentTopicSlug);
  if (idx >= 0 && idx < allTopics.length - 1) return allTopics[idx + 1];
  return undefined;
}

export function getPrevTopic(courseSlug: string, currentTopicSlug: string): Topic | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;
  const allTopics = course.chapters.flatMap(c => c.topics);
  const idx = allTopics.findIndex(t => t.slug === currentTopicSlug);
  if (idx > 0) return allTopics[idx - 1];
  return undefined;
}

export function getAllCourses(): Course[] {
  return [dsaCourse];
}
