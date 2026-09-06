"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-[1400px] px-6 pt-32 pb-20 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="body-xs text-[var(--muted)] mb-8 block tracking-[0.3em]">
            Learning Platform — 2024
          </span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            className="heading-xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            Data
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            className="heading-xl italic"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Structures
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            className="heading-xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <span className="text-[var(--muted)]">&</span> Algorithms
          </motion.h1>
        </div>

        <motion.div
          className="mt-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="body-lg max-w-md text-[var(--muted)]">
            Go from zero to solving medium/hard problems independently.
            University-aligned, hands-on, mastery-based.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/courses/dsa-masterclass"
              className="group flex items-center gap-3 rounded-full border border-[var(--fg)] bg-[var(--fg)] px-7 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
            >
              Start Learning
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/questions"
              className="text-[13px] font-light text-[var(--muted)] transition-colors hover:text-[var(--fg)] hover-line"
            >
              View Questions →
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mt-24 grid grid-cols-2 gap-8 border-t border-[var(--border)] pt-10 sm:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { value: "16", label: "Topics" },
            { value: "100+", label: "Problems" },
            { value: "6", label: "Units" },
            { value: "∞", label: "Practice" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="heading-lg">{stat.value}</div>
              <div className="body-xs mt-1 text-[var(--muted)]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.div
          className="h-[1px] w-[1px] rounded-full bg-[var(--fg)]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </section>
  );
}
