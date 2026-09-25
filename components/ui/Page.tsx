import Link from "next/link";
import type { Messages } from "@/messages/en";
import type { Locale } from "@/lib/types";
import { breadcrumbNode, graph } from "@/lib/jsonld";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  name: string;
  path: string;
}

/** Breadcrumbs + the page's single H1 + lead paragraph. */
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
    <header className="phulkari border-b border-line bg-gradient-to-b from-[var(--hero-from)] to-[var(--hero-to)]">
      <JsonLd data={graph(breadcrumbNode(locale, all))} />
      <div className="container-ir py-10 md:py-16">
        <nav aria-label={m.breadcrumbs.label}>
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                {i < all.length - 1 ? (
                  <Link href={`/${locale}${c.path === "/" ? "" : c.path}`} className="hover:text-saffron">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-semibold text-fg">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow ? <p className="eyebrow mt-6">{eyebrow}</p> : null}
        <h1 className={`display-lg ${eyebrow ? "mt-2" : "mt-6"} max-w-4xl`}>{title}</h1>
        {lead ? <div className="mt-4 max-w-2xl text-lg text-muted md:text-xl">{lead}</div> : null}
        {children}
      </div>
    </header>
  );
}

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
        <div className="reveal mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2 id={headingId} className="display-md mt-1">
              {title}
            </h2>
            {intro ? <div className="mt-3 text-muted">{intro}</div> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
