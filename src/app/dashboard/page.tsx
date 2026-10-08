"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, BookOpen, Code2, Target, ClipboardCheck } from "lucide-react";
import Link from "next/link";

interface ProgressData {
  completedTopics: number;
  totalTopics: number;
  attempts: {
    score: number;
    date: string;
    moduleNumber: string;
    moduleTitle: string;
  }[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetch("/api/progress")
        .then((r) => r.json())
        .then((d) => setProgress(d))
        .catch(() => {});
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--muted)]" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-32 sm:px-10 sm:py-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">Dashboard</span>
        <h1 className="heading-lg mb-2">
          Welcome, {session.user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="body-lg mb-16 text-[var(--muted)]">
          Track your progress and continue where you left off.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            icon: BookOpen,
            title: "Continue Course",
            description: "Browse the catalog and continue where you left off",
            href: "/courses",
            label: "Resume",
          },
          {
            icon: Code2,
            title: "Practice Code",
            description: "Run code in the integrated editor with 5 languages",
            href: "/practice",
            label: "Open IDE",
          },
          {
            icon: Target,
            title: "Question Bank",
            description: "100 top interview problems from FAANG companies",
            href: "/questions",
            label: "Browse",
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={item.href}
              className="group block border border-[var(--border)] bg-[var(--surface)] p-8 transition-all duration-300 hover:border-[var(--fg)]"
            >
              <item.icon className="h-5 w-5 text-[var(--muted)] mb-6" />
              <h3 className="body-md font-medium mb-2">{item.title}</h3>
              <p className="body-sm text-[var(--muted)] mb-6">{item.description}</p>
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors group-hover:text-[var(--fg)] text-[var(--muted)]">
                {item.label}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-16 border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 className="body-xs text-[var(--muted)] mb-6 uppercase tracking-[0.3em]">
          Your Progress
        </h3>
        {progress ? (
          <div className="space-y-8">
            <div>
              <div className="mb-3 flex items-end justify-between">
                <span className="body-sm text-[var(--muted)]">
                  Topics completed
                </span>
                <span className="heading-sm">
                  {progress.completedTopics} / {progress.totalTopics}
                </span>
              </div>
              <div className="h-[3px] w-full bg-[var(--border)]">
                <div
                  className="h-full bg-[var(--fg)] transition-all duration-700"
                  style={{
                    width: `${
                      progress.totalTopics
                        ? (progress.completedTopics / progress.totalTopics) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="body-xs mb-4 uppercase tracking-[0.25em] text-[var(--muted)]">
                Recent Quiz Attempts
              </div>
              {progress.attempts.length === 0 ? (
                <p className="body-sm text-[var(--muted)]">
                  No quiz attempts yet — finish a module and take its quiz.
                </p>
              ) : (
                <div className="space-y-0">
                  {progress.attempts.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 border-t border-[var(--border)] py-3"
                    >
                      <ClipboardCheck className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                      <span className="body-sm flex-1 truncate">
                        Module {a.moduleNumber} · {a.moduleTitle}
                      </span>
                      <span className="text-[11px] text-[var(--muted)]">
                        {new Date(a.date).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          a.score >= 60 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {a.score}%
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-[var(--border)]" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="body-sm text-[var(--muted)]">Loading progress…</p>
        )}
      </motion.div>

      <motion.div
        className="mt-4 border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 className="body-xs text-[var(--muted)] mb-6 uppercase tracking-[0.3em]">Account</h3>
        <div className="flex items-center gap-4">
          {session.user?.image ? (
            <img src={session.user.image} alt="" className="h-12 w-12 rounded-full" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)]">
              <span className="text-sm font-light">{session.user?.name?.charAt(0) || "?"}</span>
            </div>
          )}
          <div>
            <p className="body-md font-medium">{session.user?.name}</p>
            <p className="body-sm text-[var(--muted)]">{session.user?.email}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
