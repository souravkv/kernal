"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, BookOpen, Code2, Target } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
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
            description: "Pick up where you left off in the DSA Masterclass",
            href: "/courses/dsa-masterclass",
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
