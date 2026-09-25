/**
 * Scrolling "on-air" ticker. Content is duplicated for a seamless loop; the
 * copy is hidden from screen readers (the same facts are in the page text).
 */
export function Ticker({ items, className = "" }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-5 px-5">
          <span>{item}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M5 0 10 5 5 10 0 5Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee overflow-hidden bg-live py-2.5 text-on-live ${className}`} aria-hidden="true">
      <div className="marquee-track meta flex w-max text-[0.8rem]! font-extrabold">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
