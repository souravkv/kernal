"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { dsaCourse } from "@/data/courses";

export default function CourseHighlight() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const course = dsaCourse;

  return (
    <section ref={ref} className="py-32 sm:py-40">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">Flagship Course</span>
          <h2 className="heading-lg mb-16">
            {course.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="body-lg mb-8 max-w-lg text-[var(--muted)]">{course.longDescription}</p>

            <div className="mb-8 flex flex-wrap gap-x-8 gap-y-3">
              <span className="body-sm text-[var(--muted)]">{course.duration}</span>
              <span className="body-sm text-[var(--muted)]">{course.students.toLocaleString()} students</span>
              <span className="body-sm text-[var(--muted)]">{course.chapters.length} units</span>
              <span className="body-sm text-[var(--muted)]">{course.chapters.reduce((a, c) => a + c.topics.length, 0)} topics</span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={`/courses/${course.slug}/${course.chapters[0].topics[0].slug}`}
                className="group flex items-center gap-3 rounded-full border border-[var(--fg)] bg-[var(--fg)] px-7 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
              >
                Begin Course
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="heading-md font-light">₹99</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-0">
              {course.chapters.map((chapter, i) => (
                <Link
                  key={chapter.id}
                  href={`/courses/${course.slug}/${chapter.topics[0].slug}`}
                  className="group flex items-center gap-6 border-t border-[var(--border)] py-6 transition-colors hover:bg-[var(--surface)] -mx-6 px-6 sm:-mx-10 sm:px-10"
                >
                  <span className="text-[11px] font-medium text-[var(--muted)]">{chapter.icon}</span>
                  <div className="flex-1">
                    <h4 className="body-md font-light transition-colors group-hover:text-[var(--fg)]">{chapter.title}</h4>
                    <p className="body-sm mt-1 text-[var(--muted)]">{chapter.topics.length} topics</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--muted)] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              ))}
              <div className="border-t border-[var(--border)]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
