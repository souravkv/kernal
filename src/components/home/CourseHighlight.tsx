"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Users, Star, ArrowRight, BookOpen } from "lucide-react";
import { dsaCourse } from "@/data/courses";

export default function CourseHighlight() {
  const course = dsaCourse;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured <span className="text-gradient">Course</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Our flagship DSA course — designed to take you from zero to interview-ready.
          </p>
        </motion.div>

        <motion.div
          className="mt-14 rounded-3xl border border-border bg-card p-8 sm:p-10 hover-lift"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-bold text-white">
                  FLAGSHIP
                </span>
                <div className="flex items-center gap-1 text-xs text-warning">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-semibold">{course.rating}</span>
                </div>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">{course.title}</h3>
              <p className="mt-3 text-muted leading-relaxed">{course.description}</p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-accent" />
                  {course.students.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-success" />
                  {course.chapters.length} units &middot; {course.chapters.reduce((a, c) => a + c.topics.length, 0)} topics
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs font-medium text-muted">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href={`/courses/${course.slug}`}
                  className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:scale-[1.02]"
                >
                  Start Course
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <span className="text-2xl font-bold text-gradient">₹99</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">Course Curriculum</h4>
              {course.chapters.map((chapter, i) => (
                <div
                  key={chapter.id}
                  className="rounded-xl border border-border bg-surface-elevated p-4 transition-all hover:border-primary/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {chapter.icon}
                    </span>
                    <div className="min-w-0">
                      <h5 className="text-sm font-semibold text-foreground">{chapter.title}</h5>
                      <p className="mt-0.5 text-xs text-muted">{chapter.topics.length} topics</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
