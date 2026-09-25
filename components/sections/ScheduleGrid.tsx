"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { useNow, type ShowSummary } from "@/components/player/ScheduleProvider";
import { CalendarIcon, PhoneIcon } from "@/components/ui/Icons";
import { STATION_TZ, TIMEZONE_PRESETS, formatTime, getZonedParts, thisWeek, type Weekday } from "@/lib/time";
import { t } from "@/lib/site";
import type { ScheduleSlot } from "@/lib/types";

const TZ_KEY = "ir-tz";

/**
 * Weekly timetable with one-tap time-zone switching. The server renders
 * station (Vancouver) times, so the full schedule is in the HTML for search
 * engines; the browser then switches to the visitor's own zone.
 */
export function ScheduleGrid({
  slots,
  shows,
  serverNow,
  showFilter,
}: {
  slots: ScheduleSlot[];
  shows: ShowSummary[];
  serverNow: number;
  showFilter?: string;
}) {
  const { locale, m } = useLocale();
  const clientNow = useNow();
  const [tzId, setTzId] = useState<string>("vancouver");
  const [localTz, setLocalTz] = useState<string>(STATION_TZ);

  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || STATION_TZ;
    setLocalTz(detected);
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(TZ_KEY);
    } catch {}
    setTzId(saved && TIMEZONE_PRESETS.some((p) => p.id === saved) ? saved : "local");
  }, []);

  const tz = tzId === "local" ? localTz : TIMEZONE_PRESETS.find((p) => p.id === tzId)?.tz || STATION_TZ;
  const now = clientNow ?? serverNow;

  const days = useMemo(() => {
    const date = new Date(now);
    const list = thisWeek(showFilter ? slots.filter((s) => s.showSlug === showFilter) : slots, date);
    const todayInTz = getZonedParts(date, tz).weekday;
    const buckets = new Map<Weekday, typeof list>();
    for (const occ of list) {
      const wd = getZonedParts(occ.start, tz).weekday;
      buckets.set(wd, [...(buckets.get(wd) || []), occ]);
    }
    // Before hydration: fixed Monday-first order. After: start from today.
    const start = clientNow ? todayInTz : 1;
    return Array.from({ length: 7 }, (_, i) => ((start + i) % 7) as Weekday).map((wd) => ({
      weekday: wd,
      isToday: clientNow !== null && wd === todayInTz,
      items: (buckets.get(wd) || []).sort(
        (a, b) => getZonedParts(a.start, tz).hour * 60 + getZonedParts(a.start, tz).minute - (getZonedParts(b.start, tz).hour * 60 + getZonedParts(b.start, tz).minute),
      ),
    }));
  }, [now, tz, slots, showFilter, clientNow]);

  const hasUnconfirmed = slots.some((s) => !s.confirmed);
  const tzLabel =
    tzId === "local" ? `${m.schedule.yourZone} (${localTz.replace(/_/g, " ")})` : t(TIMEZONE_PRESETS.find((p) => p.id === tzId)!.label, locale);

  return (
    <div>
      <div role="group" aria-label={m.schedule.showTimesIn} className="flex flex-wrap items-center gap-2">
        <span className="meta mr-2">{m.schedule.showTimesIn}</span>
        {TIMEZONE_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className="chip"
            aria-pressed={tzId === p.id}
            onClick={() => {
              setTzId(p.id);
              try {
                localStorage.setItem(TZ_KEY, p.id);
              } catch {}
            }}
          >
            {t(p.label, locale)}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {tzLabel}
      </p>
      {hasUnconfirmed ? <p className="mt-2 text-sm font-semibold text-gold">{m.schedule.unconfirmedNote}</p> : null}

      {/* Departure-board timetable: one row per day. */}
      <ol className="band-ink mt-8 overflow-hidden rounded-md">
        {days.map((day) => (
          <li
            key={day.weekday}
            className={`grid gap-3 border-b border-line px-5 py-5 last:border-b-0 md:grid-cols-[200px_1fr] md:gap-8 md:px-8 ${
              day.isToday ? "bg-surface" : ""
            }`}
          >
            <h3 className="flex items-center gap-3 font-display text-3xl leading-none font-extrabold uppercase md:text-4xl">
              {m.schedule.days[day.weekday]}
              {day.isToday ? <span className="meta rounded-sm bg-marigold px-2 py-1 text-ink">{m.schedule.today}</span> : null}
            </h3>
            {day.items.length ? (
              <ul className="grid gap-3">
                {day.items.map((occ) => {
                  const show = shows.find((s) => s.slug === occ.slot.showSlug);
                  const onAir = clientNow !== null && occ.start.getTime() <= clientNow && clientNow < occ.end.getTime();
                  return (
                    <li
                      key={occ.slot.id}
                      className={`grid items-center gap-x-6 gap-y-1 border-l-4 py-1 pl-4 sm:grid-cols-[auto_1fr_auto] ${
                        onAir ? "border-live" : "border-marigold"
                      }`}
                    >
                      <p className="font-display text-4xl leading-none font-black tabular-nums text-marigold" suppressHydrationWarning>
                        <time dateTime={occ.start.toISOString()}>{formatTime(occ.start, tz, locale)}</time>
                        <span className="text-muted"> – </span>
                        <time dateTime={occ.end.toISOString()} className="text-fg">
                          {formatTime(occ.end, tz, locale)}
                        </time>
                      </p>
                      <div>
                        <p className="text-lg font-bold">
                          {show ? (
                            <Link href={`/${locale}/shows/${show.slug}`} className="underline-offset-4 hover:underline">
                              {t(show.name, locale)}
                            </Link>
                          ) : (
                            occ.slot.showSlug
                          )}
                          {onAir ? (
                            <span className="meta ml-3 inline-flex items-center gap-1.5 rounded-sm bg-live px-2 py-0.5 align-middle text-on-live">
                              <span className="onair-dot bg-white!" aria-hidden="true" />
                              {m.schedule.liveNow}
                            </span>
                          ) : null}
                        </p>
                        <p className="text-sm text-muted">
                          {show?.host}
                          {occ.slot.live ? ` · ${m.player.live}` : ""}
                          {show?.callIn ? (
                            <>
                              {" · "}
                              <PhoneIcon size={13} className="inline" /> {m.nav.callIn}
                            </>
                          ) : null}
                          {!occ.slot.confirmed ? <span className="text-gold"> · [CONFIRM] {m.schedule.unconfirmed}</span> : null}
                        </p>
                      </div>
                      <a
                        href={`/api/ics?slot=${encodeURIComponent(occ.slot.id)}`}
                        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-marigold underline-offset-4 hover:underline"
                      >
                        <CalendarIcon size={16} /> {m.cta.addToCalendar}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="self-center text-muted">{m.schedule.noShows}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
