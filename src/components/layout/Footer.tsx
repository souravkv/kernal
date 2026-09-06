import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10 sm:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="text-[13px] font-medium tracking-[0.2em] uppercase">Kernal</span>
            <p className="body-md mt-4 max-w-sm text-[var(--muted)]">
              The modern way to master data structures & algorithms. Built for students who want more than just video lectures.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="body-xs mb-4 text-[var(--muted)]">Platform</h4>
            <ul className="space-y-3">
              {["Learn", "Code", "Questions"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase() === "learn" ? "courses" : item.toLowerCase() === "code" ? "practice" : "questions"}`}
                    className="body-sm hover-line transition-opacity hover:opacity-100 opacity-60"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="body-xs mb-4 text-[var(--muted)]">Course</h4>
            <ul className="space-y-3">
              {["Curriculum", "Problems", "Visualizers"].map((item) => (
                <li key={item}>
                  <Link href="/courses/dsa-masterclass" className="body-sm hover-line transition-opacity hover:opacity-100 opacity-60">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="body-xs mb-4 text-[var(--muted)]">Stay Updated</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-full border border-[var(--border)] bg-transparent px-4 py-2 text-[13px] font-light outline-none transition-colors focus:border-[var(--fg)]"
              />
              <button className="rounded-full border border-[var(--fg)] bg-[var(--fg)] px-5 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="body-sm text-[var(--muted)]">&copy; {new Date().getFullYear()} Kernal. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="body-sm cursor-pointer transition-opacity hover:opacity-100 opacity-40">Twitter</span>
            <span className="body-sm cursor-pointer transition-opacity hover:opacity-100 opacity-40">GitHub</span>
            <span className="body-sm cursor-pointer transition-opacity hover:opacity-100 opacity-40">Discord</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
