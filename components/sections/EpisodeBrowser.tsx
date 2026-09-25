"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { SearchIcon } from "@/components/ui/Icons";
import type { Episode } from "@/lib/types";
import { VideoFacade } from "./VideoFacade";

const PAGE = 12;

export function EpisodeBrowser({ episodes, shows }: { episodes: Episode[]; shows: { slug: string; name: string }[] }) {
  const { locale, m } = useLocale();
  const [query, setQuery] = useState("");
  const [show, setShow] = useState<string>("all");
  const [limit, setLimit] = useState(PAGE);
  const q = useDeferredValue(query.trim().toLowerCase());

  const filtered = useMemo(
    () =>
      episodes.filter(
        (e) => (show === "all" || e.showSlug === show) && (!q || `${e.title} ${e.description}`.toLowerCase().includes(q)),
      ),
    [episodes, show, q],
  );
  const dateFmt = new Intl.DateTimeFormat(locale === "pa" ? "pa-IN" : "en-CA", { dateStyle: "medium" });

  if (!episodes.length) return <p className="card p-6 text-muted">{m.episodes.notConnected}</p>;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative block md:w-80">
          <span className="sr-only">{m.episodes.search}</span>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE);
            }}
            placeholder={m.episodes.search}
            className="input pl-10"
          />
        </label>
        <div role="group" aria-label={m.nav.shows} className="flex flex-wrap gap-2">
          {[{ slug: "all", name: m.episodes.all }, ...shows].map((s) => (
            <button
              key={s.slug}
              type="button"
              className="chip"
              aria-pressed={show === s.slug}
              onClick={() => {
                setShow(s.slug);
                setLimit(PAGE);
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {filtered.length} / {episodes.length}
      </p>

      {filtered.length ? (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, limit).map((ep) => (
            <li key={ep.id} className="grid content-start gap-3">
              <VideoFacade id={ep.id} title={ep.title} thumbnail={ep.thumbnail} playLabel={m.episodes.watch} />
              <h2 className="line-clamp-2 font-bold">
                <a href={ep.url} target="_blank" rel="noopener noreferrer" className="hover:text-saffron">
                  {ep.title}
                </a>
              </h2>
              <p className="-mt-2 text-sm text-muted">
                {m.episodes.published} <time dateTime={ep.publishedAt}>{dateFmt.format(new Date(ep.publishedAt))}</time>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="card mt-4 p-6 text-muted">{m.episodes.none}</p>
      )}

      {filtered.length > limit ? (
        <div className="mt-8 text-center">
          <button type="button" className="btn btn-ghost" onClick={() => setLimit((l) => l + PAGE)}>
            {m.cta.loadMore}
          </button>
        </div>
      ) : null}
    </div>
  );
}
