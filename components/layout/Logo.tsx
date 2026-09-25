/** Indi Radio wordmark: a phulkari diamond "on-air" mark + wordmark. */
export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="36" height="36" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="M24 2 46 24 24 46 2 24Z" fill="var(--saffron)" />
        <path d="M24 10 38 24 24 38 10 24Z" fill="var(--magenta)" />
        <path d="M24 17 31 24 24 31 17 24Z" fill="var(--gold)" />
        <circle cx="24" cy="24" r="3.2" fill="var(--red)" />
      </svg>
      {compact ? null : (
        <span className="font-display text-[1.35rem] leading-none font-black tracking-tight uppercase [font-stretch:80%]">
          Indi <span className="text-saffron">Radio</span>
        </span>
      )}
    </span>
  );
}
