export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-[900px] flex-col justify-center px-6 py-20 sm:px-10">
      <div className="mb-10 flex items-center gap-3">
        <span className="text-[13px] font-medium uppercase tracking-[0.2em] text-[var(--fg)]">
          Kernal
        </span>
        <span className="flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted)] [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted)] [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted)]" />
        </span>
      </div>

      <div className="space-y-4" aria-busy="true" aria-live="polite">
        <div className="h-3 w-24 animate-pulse bg-[var(--border)]" />
        <div className="h-10 w-3/4 animate-pulse bg-[var(--border)]" />
        <div className="h-4 w-full animate-pulse bg-[var(--border)]" />
        <div className="h-4 w-5/6 animate-pulse bg-[var(--border)]" />
        <div className="h-4 w-2/3 animate-pulse bg-[var(--border)]" />
        <div className="h-px w-full bg-[var(--border)]" />
        <div className="h-20 w-full animate-pulse bg-[var(--surface)]" />
        <div className="h-20 w-full animate-pulse bg-[var(--surface)]" />
      </div>
    </div>
  );
}
