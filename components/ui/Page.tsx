import Link from "next/link";
import type { Messages } from "@/messages/en";
import type { Locale } from "@/lib/types";
import { breadcrumbNode, graph } from "@/lib/jsonld";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  name: string;
  path: string;
}

/** Dark broadcast band with breadcrumbs, the page's single H1 and a lead. */
export function PageHeader({
  locale,
  m,
  crumbs,
  title,
  lead,
  eyebrow,
  children,
}: {
  locale: Locale;
  m: Messages;
  crumbs: Crumb[];
  title: React.ReactNode;
  lead?: React.ReactNode;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  const all: Crumb[] = [{ name: m.breadcrumbs.home, path: "/" }, ...crumbs];
  return (
    <header className="band-ink overflow-hidden">
      <JsonLd data={graph(breadcrumbNode(locale, all))} />
      <div className="container-ir pt-8 pb-12 md:pt-10 md:pb-16">
        <nav aria-label={m.breadcrumbs.label}>
          <ol className="meta flex flex-wrap items-center gap-2 text-muted">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                {i > 0 ? (
                  <svg width="7" height="7" viewBox="0 0 10 10" aria-hidden="true" className="text-marigold">
                    <path d="M5 0 10 5 5 10 0 5Z" fill="currentColor" />
                  </svg>
                ) : null}
                {i < all.length - 1 ? (
                  <Link href={`/${locale}${c.path === "/" ? "" : c.path}`} className="inline-block py-1 hover:text-fg">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-fg">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow ? <p className="eyebrow mt-10">{eyebrow}</p> : null}
        <h1 className={`display-lg ${eyebrow ? "mt-4" : "mt-10"} max-w-5xl`}>{title}</h1>
        {lead ? <div className="mt-6 max-w-2xl text-lg text-muted md:text-xl">{lead}</div> : null}
        {children}
      </div>
      <div className="phulkari-band" aria-hidden="true" />
    </header>
  );
}

/** Editorial section: a heavy top rule, heading left, intro right. */
export function Section({
  id,
  title,
  eyebrow,
  intro,
  action,
  children,
  className = "",
}: {
  id?: string;
  title?: React.ReactNode;
  eyebrow?: string;
  intro?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={`container-ir py-12 md:py-16 ${className}`}>
      {title ? (
        <div className="reveal rule-t mb-10 grid gap-6 pt-6 md:grid-cols-[1fr_auto] md:items-end lg:grid-cols-[1.2fr_1fr]">
          <div>
            {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
            <h2 id={headingId} className="display-md">
              {title}
            </h2>
          </div>
          {intro || action ? (
            <div className="flex flex-col items-start gap-4 lg:items-end lg:text-right">
              {intro ? <div className="max-w-md text-muted lg:ml-auto">{intro}</div> : null}
              {action}
            </div>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
