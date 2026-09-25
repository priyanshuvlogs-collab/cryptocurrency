import { getSchedule, getSettings, getShows } from "@/lib/cms";
import { SITE_URL } from "@/lib/site";
import { STATION_TZ, getZonedParts } from "@/lib/time";

/**
 * "Add to calendar" – a weekly recurring event in the station's time zone.
 * Calendar apps convert it to the listener's local time automatically.
 */
const DAY = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

/** Next calendar date (in Vancouver) that falls on `day`, as YYYYMMDD. */
function nextDateFor(day: number): string {
  const p = getZonedParts(new Date(), STATION_TZ);
  const d = new Date(Date.UTC(p.year, p.month - 1, p.day));
  d.setUTCDate(d.getUTCDate() + ((day - p.weekday + 7) % 7));
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("slot");
  const [slots, shows, settings] = await Promise.all([getSchedule(), getShows(), getSettings()]);
  const slot = slots.find((s) => s.id === id);
  if (!slot) return new Response("Not found", { status: 404 });
  const show = shows.find((s) => s.slug === slot.showSlug);
  const name = show ? `${show.name.en} – Indi Radio` : "Indi Radio";
  const date = nextDateFor(slot.day);
  const [sh, sm] = slot.start.split(":");
  const [eh, em] = slot.end.split(":");
  const overnight = Number(eh) * 60 + Number(em) <= Number(sh) * 60 + Number(sm);
  const endDate = overnight
    ? (() => {
        const d = new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}T00:00:00Z`);
        d.setUTCDate(d.getUTCDate() + 1);
        return d.toISOString().slice(0, 10).replace(/-/g, "");
      })()
    : date;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Indi Radio//Schedule//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE",
    "TZID:America/Vancouver",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:-0800",
    "TZOFFSETTO:-0700",
    "TZNAME:PDT",
    "DTSTART:19700308T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:-0700",
    "TZOFFSETTO:-0800",
    "TZNAME:PST",
    "DTSTART:19701101T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${slot.id}@indiradio.ca`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;TZID=America/Vancouver:${date}T${sh}${sm}00`,
    `DTEND;TZID=America/Vancouver:${endDate}T${eh}${em}00`,
    `RRULE:FREQ=WEEKLY;BYDAY=${DAY[slot.day]}`,
    `SUMMARY:${name}`,
    `DESCRIPTION:Listen live: ${SITE_URL}/en/listen-live\\nCall in: ${settings.phoneDisplay}`,
    `URL:${SITE_URL}/en/listen-live`,
    "BEGIN:VALARM",
    "TRIGGER:-PT10M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${name} starts in 10 minutes`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="indi-radio-${slot.showSlug}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
