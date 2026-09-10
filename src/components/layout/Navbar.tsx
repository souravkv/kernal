"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Learn" },
  { href: "/practice", label: "Code" },
  { href: "/questions", label: "Questions" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--bg)]/90 backdrop-blur-xl border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 sm:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="text-[13px] font-medium tracking-[0.2em] uppercase transition-colors group-hover:opacity-60">
            Kernal
          </span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="body-sm hover-line transition-opacity hover:opacity-100 opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <ThemeToggle />

          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full border border-[var(--border)] animate-pulse" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all hover:border-[var(--fg)]"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-medium">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "?"}
                  </span>
                )}
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 border border-[var(--border)] bg-[var(--surface)] py-2">
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                      <p className="text-[13px] font-medium truncate">{session.user?.name}</p>
                      <p className="text-[11px] text-[var(--muted)] truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-light transition-colors hover:bg-[var(--surface-alt)]"
                    >
                      <User className="h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-light text-[var(--muted)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--fg)]"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/login"
                className="text-[12px] font-light text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
              >
                Sign in
              </Link>
              <Link
                href="/courses/dsa-masterclass"
                className="rounded-full border border-[var(--fg)] bg-[var(--fg)] px-5 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
              >
                Start
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--bg)] px-6 pb-8 pt-6 md:hidden">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-[1.5rem] font-light tracking-tight transition-opacity hover:opacity-60"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-6 border-t border-[var(--border)] pt-6">
            {session ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)]">
                      <span className="text-[11px]">{session.user?.name?.charAt(0) || "?"}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-[13px] font-medium">{session.user?.name}</p>
                    <p className="text-[11px] text-[var(--muted)]">{session.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="w-full border border-[var(--border)] py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--muted)]"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-full border border-[var(--fg)] bg-[var(--fg)] px-6 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)]"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
