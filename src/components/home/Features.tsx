"use client";

import { motion } from "framer-motion";
import { Code2, Brain, Zap, Shield, BarChart3, Rocket } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Structured Curriculum",
    description: "University-aligned 12-module DSA course that builds concepts progressively from basics to advanced.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Code2,
    title: "Integrated Code Editor",
    description: "Write and run code directly in the browser with Monaco Editor. Support for Python, C++, Java, and more.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Zap,
    title: "Instant Execution",
    description: "Sandboxed code execution engine that evaluates your solutions against multiple test cases in real time.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Track your learning journey with XP points, streak counters, and detailed skill analytics.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Shield,
    title: "Mastery Gates",
    description: "Prove your understanding before advancing. Pass each module with 70%+ to unlock the next topic.",
    color: "text-danger",
    bg: "bg-danger/10",
  },
  {
    icon: Rocket,
    title: "Interview Ready",
    description: "1000 curated problems across 21 categories. Practice exactly what top tech companies ask in interviews.",
    color: "text-primary-light",
    bg: "bg-primary/10",
  },
];

export default function Features() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why <span className="text-gradient">KERNAL</span> Works
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-muted"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            We combined the best of structured learning with hands-on practice to create an experience that actually works.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover-lift hover:border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.bg} transition-transform group-hover:scale-110`}>
                <feature.icon className={`h-5.5 w-5.5 ${feature.color}`} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
