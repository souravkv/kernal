import Link from "next/link";
import { Code2, ExternalLink, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Code2 className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">KERNAL</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Bridge the gap between university CS education and coding interview standards.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Platform</h3>
            <ul className="mt-3 space-y-2">
              {["Courses", "Practice", "Dashboard"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-sm text-muted transition-colors hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Resources</h3>
            <ul className="mt-3 space-y-2">
              {["DSA Masterclass", "Problem Bank", "Visualizers"].map((item) => (
                <li key={item}>
                  <Link href="/courses" className="text-sm text-muted transition-colors hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Connect</h3>
            <div className="mt-3 flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-all hover:border-primary/30 hover:text-primary">
                <ExternalLink className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-all hover:border-primary/30 hover:text-primary">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} KERNAL. Built for students, by students.
          </p>
        </div>
      </div>
    </footer>
  );
}
