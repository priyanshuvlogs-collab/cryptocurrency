import { defineField, defineType } from "sanity";

export const episode = defineType({
  name: "episode",
  title: "Featured episode",
  type: "document",
  description: "YouTube videos appear automatically. Add one here only to feature it, or to tag it to a show.",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "youtubeId", title: "YouTube video ID", type: "string", description: "The part after watch?v= in the link.", validation: (r) => r.required() }),
    defineField({ name: "show", type: "reference", to: [{ type: "show" }] }),
    defineField({ name: "publishedAt", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({ name: "description", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title", subtitle: "show.name.en" } },
});

export const sponsor = defineType({
  name: "sponsor",
  title: "Sponsor",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "logo", type: "image", description: "PNG or SVG with a transparent background works best." }),
    defineField({ name: "url", title: "Website", type: "url" }),
    defineField({
      name: "tier",
      type: "string",
      options: { list: ["presenting", "gold", "community"], layout: "radio" },
      initialValue: "community",
    }),
    defineField({ name: "activeUntil", title: "Show on the site until", type: "date", description: "Leave empty to keep showing." }),
  ],
  preview: { select: { title: "name", subtitle: "tier", media: "logo" } },
});

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title.en" }, validation: (r) => r.required() }),
    defineField({ name: "description", type: "localeString" }),
    defineField({ name: "start", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "end", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "venue", type: "string", validation: (r) => r.required() }),
    defineField({ name: "address", type: "string" }),
    defineField({ name: "city", type: "string", initialValue: "Surrey, BC" }),
    defineField({ name: "mapUrl", title: "Google Maps link", type: "url" }),
    defineField({ name: "ticketUrl", title: "Tickets link", type: "url" }),
    defineField({ name: "liveBroadcast", title: "Indi Radio broadcasts live from this event", type: "boolean", initialValue: false }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
  ],
  orderings: [{ title: "Date", name: "date", by: [{ field: "start", direction: "asc" }] }],
  preview: { select: { title: "title.en", subtitle: "start", media: "image" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "q", title: "Question", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "a", title: "Answer (aim for 40–60 words)", type: "localeText", validation: (r) => r.required() }),
    defineField({
      name: "category",
      type: "string",
      options: { list: ["listening", "shows", "call-in", "dedications", "advertising", "general"] },
      initialValue: "general",
    }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "q.en", subtitle: "category" } },
});

export const announcement = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  description: "A banner across the top of every page. Only the newest active one is shown.",
  fields: [
    defineField({ name: "text", type: "localeString", validation: (r) => r.required().custom((v: any) => (v?.en?.length > 140 ? "Keep it under 140 characters" : true)) }),
    defineField({ name: "href", title: "Link (optional)", type: "string", description: "e.g. /en/events or a full https:// link" }),
    defineField({ name: "active", type: "boolean", initialValue: true }),
    defineField({ name: "startsAt", title: "Start showing", type: "datetime" }),
    defineField({ name: "endsAt", title: "Stop showing", type: "datetime" }),
  ],
  preview: { select: { title: "text.en", active: "active" }, prepare: ({ title, active }) => ({ title, subtitle: active ? "Active" : "Off" }) },
});

export const dedicationTier = defineType({
  name: "dedicationTier",
  title: "Dedication package",
  type: "document",
  fields: [
    defineField({ name: "name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "code", title: "Code", type: "slug", options: { source: "name.en" }, validation: (r) => r.required() }),
    defineField({ name: "description", type: "localeString" }),
    defineField({ name: "priceCad", title: "Price (CAD)", type: "number", description: "Leave empty to take bookings as requests (no online payment).", validation: (r) => r.min(0) }),
    defineField({ name: "features", type: "array", of: [{ type: "localeString" }] }),
    defineField({ name: "highlighted", title: "Highlight as most popular", type: "boolean" }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "name.en", subtitle: "priceCad" }, prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `$${subtitle} CAD` : "Price not set" }) },
});

export const adPackage = defineType({
  name: "adPackage",
  title: "Advertising package",
  type: "document",
  fields: [
    defineField({ name: "name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", type: "localeString" }),
    defineField({ name: "priceNote", title: "Price note", type: "localeString", description: "e.g. “From $500 / month”" }),
    defineField({ name: "features", type: "array", of: [{ type: "localeString" }] }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "name.en", subtitle: "priceNote.en" } },
});

export const pressItem = defineType({
  name: "pressItem",
  title: "Press mention",
  type: "document",
  fields: [
    defineField({ name: "outlet", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "url", type: "url", validation: (r) => r.required() }),
    defineField({ name: "date", type: "date" }),
  ],
});

export const socialPost = defineType({
  name: "socialPost",
  title: "Social post",
  type: "document",
  description: "Posts shown in the “Latest from Indi Radio” strip. YouTube videos are added automatically.",
  fields: [
    defineField({ name: "platform", type: "string", options: { list: ["tiktok", "instagram", "youtube", "facebook"], layout: "radio" }, validation: (r) => r.required() }),
    defineField({ name: "url", type: "url", validation: (r) => r.required() }),
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "thumbnail", type: "image" }),
    defineField({ name: "postedAt", type: "datetime", initialValue: () => new Date().toISOString() }),
  ],
  preview: { select: { title: "caption", subtitle: "platform", media: "thumbnail" } },
});

export const contest = defineType({
  name: "contest",
  title: "Contest",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "question", title: "Entry question", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "active", type: "boolean", initialValue: true }),
    defineField({ name: "endsAt", title: "Closes", type: "datetime" }),
  ],
  preview: { select: { title: "title.en", subtitle: "endsAt" } },
});
