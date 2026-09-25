import { defineField, defineType } from "sanity";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const time = (r: any) => r.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "24-hour time, e.g. 19:00" });

/** One weekly time slot. Times are Vancouver time; the website converts them for every listener. */
export const scheduleSlot = defineType({
  name: "scheduleSlot",
  title: "Schedule slot",
  type: "document",
  fields: [
    defineField({ name: "show", type: "reference", to: [{ type: "show" }], validation: (r) => r.required() }),
    defineField({
      name: "day",
      type: "number",
      options: { list: DAYS.map((title, value) => ({ title, value })), layout: "radio", direction: "horizontal" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "start", title: "Start (Vancouver time, 24h)", type: "string", placeholder: "19:00", validation: time }),
    defineField({ name: "end", title: "End (Vancouver time, 24h)", type: "string", placeholder: "21:00", description: "If the end is earlier than the start, the show runs past midnight.", validation: time }),
    defineField({ name: "live", title: "Live show", type: "boolean", initialValue: true }),
    defineField({ name: "confirmed", title: "Time confirmed", type: "boolean", initialValue: true, description: "Untick to show “time to be confirmed” on the site." }),
  ],
  orderings: [{ title: "Day & time", name: "dayTime", by: [{ field: "day", direction: "asc" }, { field: "start", direction: "asc" }] }],
  preview: {
    select: { show: "show.name.en", day: "day", start: "start", end: "end" },
    prepare: ({ show, day, start, end }) => ({ title: `${DAYS[day] ?? "?"} ${start}–${end}`, subtitle: show }),
  },
});

export const specialBroadcast = defineType({
  name: "specialBroadcast",
  title: "Special broadcast",
  type: "document",
  description: "A one-off show (e.g. live from a mela). Overrides “Now playing” while it runs.",
  fields: [
    defineField({ name: "title", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "start", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "end", type: "datetime", validation: (r) => r.required().min(r.valueOfField("start")) }),
    defineField({ name: "show", title: "Related show (optional)", type: "reference", to: [{ type: "show" }] }),
  ],
  preview: { select: { title: "title.en", subtitle: "start" } },
});
