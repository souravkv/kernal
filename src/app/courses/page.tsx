import Link from "next/link";
import { Clock, Users, Star, ArrowRight, BookOpen } from "lucide-react";
import { getAllCourses } from "@/data/courses";

export const metadata = {
  title: "Courses — KERNAL",
};

export default function CoursesPage() {
  const courses = getAllCourses();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Explore <span className="text-gradient">Courses</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Structured, hands-on courses designed to take you from fundamentals to mastery.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover-lift hover:border-primary/20"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-bold text-white">
                DSA
              </span>
              <div className="flex items-center gap-1 text-xs text-warning">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="font-semibold">{course.rating}</span>
              </div>
            </div>

            <h2 className="mt-4 text-xl font-bold text-foreground">{course.title}</h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">{course.description}</p>

            <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-accent" />
                {course.students.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-success" />
                {course.chapters.reduce((a, c) => a + c.topics.length, 0)} topics
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {course.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-[10px] font-medium text-muted">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xl font-bold text-gradient">₹{course.price}</span>
              <span className="flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                View Course
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
