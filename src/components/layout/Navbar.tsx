"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Learn" },
  { href: "/practice", label: "Code" },
  { href: "/questions", label: "Questions" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <Link
            href="/courses/dsa-masterclass"
            className="hidden rounded-full border border-[var(--fg)] bg-[var(--fg)] px-5 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)] md:block"
          >
            Start
          </Link>
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
          <Link
            href="/courses/dsa-masterclass"
            onClick={() => setMobileOpen(false)}
            className="mt-4 inline-block rounded-full border border-[var(--fg)] bg-[var(--fg)] px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)]"
          >
            Start Learning
          </Link>
        </div>
      )}
    </nav>
  );
}
