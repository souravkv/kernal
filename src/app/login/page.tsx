"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--muted)]" />
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="border border-[var(--border)] bg-[var(--surface)] p-10 sm:p-12">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-alt)]">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Avatar"
                    className="h-16 w-16 rounded-full"
                  />
                ) : (
                  <span className="text-lg font-light">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "?"}
                  </span>
                )}
              </div>
              <h1 className="heading-sm mb-2">Welcome back</h1>
              <p className="body-md text-[var(--muted)]">{session.user?.name || session.user?.email}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push("/courses/dsa-masterclass")}
                className="group flex w-full items-center justify-center gap-3 border border-[var(--fg)] bg-[var(--fg)] py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
              >
                Continue Learning
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => router.push("/questions")}
                className="w-full border border-[var(--border)] py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--muted)] transition-all hover:border-[var(--fg)] hover:text-[var(--fg)]"
              >
                Browse Questions
              </button>

              <button
                onClick={handleSignOut}
                className="w-full py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="border border-[var(--border)] bg-[var(--surface)] p-10 sm:p-12">
          <div className="mb-10">
            <span className="body-xs text-[var(--muted)] mb-4 block tracking-[0.3em]">Account</span>
            <h1 className="heading-lg mb-3">Sign in</h1>
            <p className="body-md text-[var(--muted)]">
              Continue with your Google account to track your progress.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="group flex w-full items-center justify-center gap-4 border border-[var(--border)] bg-[var(--surface)] py-3.5 text-[13px] font-light transition-all duration-300 hover:border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {loading ? "Signing in..." : "Continue with Google"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="bg-[var(--surface)] px-3 text-[var(--muted)] uppercase tracking-wider">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[13px] font-light outline-none transition-colors focus:border-[var(--fg)] placeholder:text-[var(--muted)]/50"
                disabled
              />
              <button
                disabled
                className="w-full border border-[var(--border)] py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--muted)] opacity-50 cursor-not-allowed"
              >
                Email Login (Coming Soon)
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-[11px] text-[var(--muted)]">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p className="mt-6 text-center text-[12px] text-[var(--muted)]">
          Don&apos;t have an account?{" "}
          <span className="text-[var(--fg)]">Signing in creates one automatically.</span>
        </p>
      </motion.div>
    </div>
  );
}
