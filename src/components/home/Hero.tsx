"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
      <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              DSA Masterclass — Now Live
            </span>
          </motion.div>

          <motion.h1
            className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Master{" "}
            <span className="text-gradient">Data Structures</span>
            <br />
            & Algorithms
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Go from zero coding knowledge to solving medium/hard DSA problems independently.
            University-aligned curriculum with hands-on coding practice.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/courses/dsa-masterclass"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
            >
              Start Learning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/practice"
              className="flex items-center gap-2 rounded-xl border border-border bg-surface px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-card-hover hover:border-primary/30"
            >
              <Play className="h-4 w-4 text-primary" />
              Try Problems
            </Link>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-6 sm:max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              { value: "18+", label: "Topics" },
              { value: "1000+", label: "Problems" },
              { value: "2847", label: "Students" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
