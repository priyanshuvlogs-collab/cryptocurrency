/**
 * Indi Radio wordmark: a record with a phulkari-diamond label and radiating
 * signal, next to a condensed poster-style wordmark.
 */
export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="38" height="38" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle cx="24" cy="24" r="22" fill="currentColor" />
        <circle cx="24" cy="24" r="17" fill="none" stroke="var(--bg)" strokeOpacity=".25" strokeWidth="1" />
        <circle cx="24" cy="24" r="13" fill="none" stroke="var(--bg)" strokeOpacity=".25" strokeWidth="1" />
        <path d="M24 13.5 34.5 24 24 34.5 13.5 24Z" fill="#FFA41B" />
        <path d="M24 18.5 29.5 24 24 29.5 18.5 24Z" fill="#E4007C" />
        <circle cx="24" cy="24" r="2.2" fill="#F4ECDD" />
      </svg>
      {compact ? null : (
        <span className="font-display text-[1.7rem] leading-none font-black tracking-[0.01em] uppercase">
          Indi <span className="text-accent">Radio</span>
        </span>
      )}
    </span>
  );
}
