/**
 * Time-zone maths for the schedule, "now playing" and countdown.
 *
 * All schedule slots are stored in the station's wall-clock time
 * (America/Vancouver). These helpers turn a weekly slot into real instants,
 * so daylight-saving changes on either side (BC, UK, Australia) are handled
 * by the platform's time-zone database instead of hard-coded offsets.
 *
 * Dependency-free on purpose: this file runs on the server, in the browser
 * and in `node --test`.
 */

export const STATION_TZ = "America/Vancouver";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday (matches Date#getDay)

export interface WeeklySlot {
  id: string;
  day: Weekday;
  /** "HH:MM" 24h, station time */
  start: string;
  /** "HH:MM" 24h, station time. If <= start the slot runs past midnight. */
  end: string;
}

export interface Occurrence<S extends WeeklySlot = WeeklySlot> {
  slot: S;
  start: Date;
  end: Date;
}

export interface ZonedParts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: Weekday;
}

const WEEKDAY_INDEX: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const partsFormatters = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let f = partsFormatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    });
    partsFormatters.set(timeZone, f);
  }
  return f;
}

export function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const out: Record<string, string> = {};
  for (const p of partsFormatter(timeZone).formatToParts(date)) out[p.type] = p.value;
  return {
    year: Number(out.year),
    month: Number(out.month),
    day: Number(out.day),
    hour: Number(out.hour) % 24,
    minute: Number(out.minute),
    second: Number(out.second),
    weekday: WEEKDAY_INDEX[out.weekday] ?? 0,
  };
}

/** Offset of `timeZone` from UTC at `date`, in ms (e.g. Vancouver PDT = -7h). */
export function tzOffsetMs(date: Date, timeZone: string): number {
  const p = getZonedParts(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** Wall-clock time in `timeZone` → real instant. */
export function zonedToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const off1 = tzOffsetMs(new Date(guess), timeZone);
  let ts = guess - off1;
  const off2 = tzOffsetMs(new Date(ts), timeZone);
  if (off2 !== off1) ts = guess - off2;
  return new Date(ts);
}

function hm(value: string): [number, number] {
  const [h, m] = value.split(":").map(Number);
  return [h || 0, m || 0];
}

/**
 * Every real occurrence of the weekly slots whose *start day* falls in
 * [today + fromDay, today + toDay) in station time.
 */
export function occurrences<S extends WeeklySlot>(
  slots: S[],
  now: Date,
  fromDay = -1,
  toDay = 8,
  timeZone = STATION_TZ,
): Occurrence<S>[] {
  const today = getZonedParts(now, timeZone);
  const result: Occurrence<S>[] = [];
  for (let offset = fromDay; offset < toDay; offset++) {
    const cal = new Date(Date.UTC(today.year, today.month - 1, today.day + offset));
    const y = cal.getUTCFullYear();
    const m = cal.getUTCMonth() + 1;
    const d = cal.getUTCDate();
    const weekday = cal.getUTCDay() as Weekday;
    for (const slot of slots) {
      if (slot.day !== weekday) continue;
      const [sh, sm] = hm(slot.start);
      const [eh, em] = hm(slot.end);
      const start = zonedToUtc(y, m, d, sh, sm, timeZone);
      const overnight = eh * 60 + em <= sh * 60 + sm;
      const endCal = new Date(Date.UTC(y, m - 1, d + (overnight ? 1 : 0)));
      const end = zonedToUtc(
        endCal.getUTCFullYear(),
        endCal.getUTCMonth() + 1,
        endCal.getUTCDate(),
        eh,
        em,
        timeZone,
      );
      result.push({ slot, start, end });
    }
  }
  return result.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function currentOccurrence<S extends WeeklySlot>(slots: S[], now: Date): Occurrence<S> | null {
  return occurrences(slots, now, -1, 1).find((o) => o.start <= now && now < o.end) ?? null;
}

export function nextOccurrence<S extends WeeklySlot>(slots: S[], now: Date): Occurrence<S> | null {
  return occurrences(slots, now, 0, 8).find((o) => o.start > now) ?? null;
}

/** One occurrence per slot: the week starting today (station time). */
export function thisWeek<S extends WeeklySlot>(slots: S[], now: Date): Occurrence<S>[] {
  return occurrences(slots, now, 0, 7);
}

export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export const TIMEZONE_PRESETS = [
  { id: "local", tz: null, label: { en: "My time", pa: "ਮੇਰਾ ਸਮਾਂ" } },
  { id: "vancouver", tz: "America/Vancouver", label: { en: "Vancouver", pa: "ਵੈਨਕੂਵਰ" } },
  { id: "india", tz: "Asia/Kolkata", label: { en: "India (IST)", pa: "ਭਾਰਤ (IST)" } },
  { id: "uk", tz: "Europe/London", label: { en: "UK", pa: "ਯੂ.ਕੇ." } },
  // [CONFIRM] Sydney chosen as the default Australian zone; add Melbourne/Perth if needed.
  { id: "australia", tz: "Australia/Sydney", label: { en: "Australia (Sydney)", pa: "ਆਸਟ੍ਰੇਲੀਆ (ਸਿਡਨੀ)" } },
] as const;

export function intlLocale(locale: string): string {
  return locale === "pa" ? "pa-IN" : "en-CA";
}

export function formatTime(date: Date, timeZone: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "pa" ? "pa-IN" : "en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatWeekday(date: Date, timeZone: string, locale: string, style: "long" | "short" = "long") {
  return new Intl.DateTimeFormat(intlLocale(locale), { timeZone, weekday: style }).format(date);
}

export function formatDate(date: Date, timeZone: string, locale: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    ...opts,
  }).format(date);
}
