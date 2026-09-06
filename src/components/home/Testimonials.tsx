"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    text: "Kernal helped me crack my campus placement at Amazon. The structured modules and integrated coding IDE made practice effortless.",
    name: "Priya Sharma",
    role: "DTU, B.Tech CS",
    initials: "PS",
  },
  {
    text: "Switched from mechanical to software with zero coding background. Kernal gave me the foundation I needed, one mastery gate at a time.",
    name: "Rahul Verma",
    role: "Self-taught Developer",
    initials: "RV",
  },
  {
    text: "The split-screen editor is brilliant. Read theory, implement immediately. Solved 400+ problems through the question bank.",
    name: "Ananya Patel",
    role: "NIT Trichy, B.Tech IT",
    initials: "AP",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 sm:py-40">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">Testimonials</span>
          <h2 className="heading-lg mb-16">
            Students <span className="italic text-[var(--muted)]">love</span> it
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-[var(--bg)] p-8 sm:p-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="body-md mb-10 text-[var(--muted)] leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[10px] font-medium tracking-wider">
                  {t.initials}
                </div>
                <div>
                  <div className="body-sm font-medium">{t.name}</div>
                  <div className="text-[11px] text-[var(--muted)]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
