"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { currentOccurrence, nextOccurrence, type Occurrence } from "@/lib/time";
import type { L10n, ScheduleSlot, SpecialBroadcast } from "@/lib/types";

/**
 * Schedule data for the live widgets (now playing, countdown, mini-player).
 * Current time only exists on the client, so the server renders a neutral
 * fallback and the widgets fill in after hydration without layout shift.
 */

export interface ShowSummary {
  slug: string;
  name: L10n;
  host: string;
  callIn: boolean;
}

interface ScheduleData {
  slots: ScheduleSlot[];
  shows: ShowSummary[];
  specials: SpecialBroadcast[];
}

const ScheduleContext = createContext<ScheduleData>({ slots: [], shows: [], specials: [] });

export function ScheduleProvider({ value, children }: { value: ScheduleData; children: React.ReactNode }) {
  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}

/* ── shared 1-second clock (one interval for the whole page) ─────────── */

let now = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

// Must return the same value until the next tick (useSyncExternalStore contract).
function getSnapshot() {
  if (!now) now = Date.now();
  return now;
}

/** Milliseconds since epoch on the client, `null` during SSR/hydration. */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export interface LiveState {
  current: { title: L10n; show: ShowSummary | null; occurrence: Occurrence<ScheduleSlot> | null; special: boolean } | null;
  next: { show: ShowSummary | null; occurrence: Occurrence<ScheduleSlot> } | null;
  now: number;
}

export function useLiveState(): LiveState | null {
  const { slots, shows, specials } = useContext(ScheduleContext);
  const ms = useNow();
  if (ms === null) return null;
  const date = new Date(ms);
  const byslug = (slug?: string | null) => shows.find((s) => s.slug === slug) ?? null;

  const special = specials.find((s) => new Date(s.start) <= date && date < new Date(s.end));
  const cur = currentOccurrence(slots, date);
  const nxt = nextOccurrence(slots, date);

  let current: LiveState["current"] = null;
  if (special) {
    current = { title: special.title, show: byslug(special.showSlug), occurrence: null, special: true };
  } else if (cur) {
    const show = byslug(cur.slot.showSlug);
    current = { title: show?.name ?? { en: "Indi Radio", pa: "ਇੰਡੀ ਰੇਡੀਓ" }, show, occurrence: cur, special: false };
  }
  return {
    current,
    next: nxt ? { show: byslug(nxt.slot.showSlug), occurrence: nxt } : null,
    now: ms,
  };
}
