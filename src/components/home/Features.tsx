"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    number: "01",
    title: "Structured Curriculum",
    description: "University-aligned 6-unit DSA course building concepts progressively from fundamentals to advanced problem solving.",
  },
  {
    number: "02",
    title: "Integrated IDE",
    description: "Monaco code editor with Python, C++, Java, JavaScript. Write, run, and test code without leaving the browser.",
  },
  {
    number: "03",
    title: "Mastery Gates",
    description: "Prove understanding before advancing. Pass each module assessment to unlock the next chapter.",
  },
  {
    number: "04",
    title: "100+ Problems",
    description: "Curated problems across 19 categories — exactly what top tech companies ask in coding interviews.",
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 sm:py-40">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">Why Kernal</span>
              <h2 className="heading-lg">
                Built different,<br />
                <span className="italic text-[var(--muted)]">by design</span>
              </h2>
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-0">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.number}
                  className="group grid grid-cols-12 gap-6 border-t border-[var(--border)] py-10 transition-colors hover:bg-[var(--surface)] -mx-6 px-6 sm:-mx-10 sm:px-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[11px] font-medium text-[var(--muted)]">{feature.number}</span>
                  </div>
                  <div className="col-span-10 sm:col-span-4">
                    <h3 className="heading-sm transition-colors group-hover:text-[var(--fg)]">{feature.title}</h3>
                  </div>
                  <div className="col-span-12 sm:col-span-7">
                    <p className="body-md text-[var(--muted)]">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
              <div className="border-t border-[var(--border)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
