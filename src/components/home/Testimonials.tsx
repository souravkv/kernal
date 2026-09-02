"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "B.Tech CS, Delhi Technological University",
    text: "KERNAL's DSA course helped me crack my campus placement at Amazon. The structured modules and integrated coding IDE made practice so much easier than watching YouTube videos.",
    avatar: "PS",
  },
  {
    name: "Rahul Verma",
    role: "Self-taught Developer",
    text: "I switched from mechanical engineering to software. KERNAL gave me the foundation I needed. The mastery gates ensured I actually understood each topic before moving on.",
    avatar: "RV",
  },
  {
    name: "Ananya Patel",
    role: "B.Tech IT, NIT Trichy",
    text: "The split-screen code editor is brilliant. I can read the theory and immediately implement what I learned. Solved 400+ problems through KERNAL's problem bank.",
    avatar: "AP",
  },
];

export default function Testimonials() {
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
            Loved by <span className="text-gradient">Students</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Join thousands of students who transformed their coding journey with KERNAL.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover-lift hover:border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Quote className="h-8 w-8 text-primary/20" />
              <p className="mt-3 text-sm leading-relaxed text-muted">{t.text}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
