import { defineArrayMember, defineField, defineType } from "sanity";

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
  description: "Leave any field empty to hide it on the Advertise page. Nothing is ever shown as a placeholder.",
  fields: [
    defineField({ name: "name", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "code",
      title: "Package code",
      type: "slug",
      description: "Used in links (?package=…) and the inquiry form. Don’t change it once the page is live.",
      options: { source: "name.en" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Shown as",
      type: "string",
      options: { list: [{ title: "Package card", value: "card" }, { title: "Station Partner strip", value: "partner" }], layout: "radio" },
      initialValue: "card",
    }),
    defineField({ name: "enabled", title: "Show on the website", type: "boolean", initialValue: true, description: "The Station Partner strip only appears when this is ON." }),
    defineField({ name: "description", type: "localeString" }),
    defineField({ name: "badge", title: "Badge", type: "localeString", description: "e.g. “Most popular”. Leave empty for no badge." }),
    defineField({ name: "priceMonthly", title: "Starting price (CAD per month)", type: "number", description: "Empty → “Pricing on request”.", validation: (r) => r.min(0) }),
    defineField({ name: "spotsPerWeek", title: "Spots per week", type: "string", placeholder: "e.g. 14" }),
    defineField({ name: "length", title: "Spot length", type: "localeString", description: "e.g. “30 seconds”" }),
    defineField({ name: "languages", title: "Languages", type: "localeString", description: "e.g. “Punjabi, English or both”" }),
    defineField({ name: "minimumTerm", title: "Minimum term", type: "localeString", description: "e.g. “1 month”" }),
    defineField({ name: "productionIncluded", title: "Ad production included", type: "boolean", description: "Leave unset to hide this row." }),
    defineField({ name: "monthlyPlayReport", title: "Monthly play report", type: "boolean", description: "Leave unset to hide this row." }),
    defineField({ name: "show", title: "Sponsored show", type: "reference", to: [{ type: "show" }], description: "Its confirmed schedule days and times appear on the card." }),
    defineField({ name: "features", title: "Extra bullet points", type: "array", of: [{ type: "localeString" }] }),
    defineField({ name: "order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name.en", subtitle: "code.current" } },
});

/** Singleton holding everything else on /advertise. Empty fields hide their element. */
export const advertisePage = defineType({
  name: "advertisePage",
  title: "Advertise page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "audience", title: "Audience stats" },
    { name: "proof", title: "Samples & testimonials" },
    { name: "packages", title: "Packages extras" },
    { name: "faq", title: "FAQ & contact" },
  ],
  fields: [
    defineField({
      name: "heroImage",
      title: "Photo of Indi (hero)",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description: "Falls back to the photo in Site settings. No photo → the hero has no image.",
      fields: [defineField({ name: "alt", title: "Description (alt text)", type: "localeString" })],
    }),
    defineField({
      name: "stats",
      title: "Audience figures",
      type: "object",
      group: "audience",
      description: "Only filled figures are shown, in this order. Fewer than two → the stats row is hidden. Use real analytics only.",
      fields: [
        defineField({ name: "monthlyListeners", title: "Monthly listeners", type: "string", placeholder: "e.g. 25,000+" }),
        defineField({ name: "bcListenersPercent", title: "% of listeners in BC", type: "string", placeholder: "e.g. 60%" }),
        defineField({ name: "avgLiveViewers", title: "Average live viewers", type: "string" }),
        defineField({ name: "callInsPerWeek", title: "Call-ins per week", type: "string" }),
        defineField({ name: "appInstalls", title: "App installs", type: "string" }),
        defineField({ name: "socialFollowers", title: "Social followers", type: "string" }),
        defineField({ name: "countriesListening", title: "Countries listening", type: "string" }),
      ],
    }),
    defineField({ name: "statsAsOf", title: "Figures updated (month / year)", type: "string", group: "audience", placeholder: "e.g. September 2026" }),
    defineField({
      name: "sampleAds",
      title: "Sample ads",
      type: "array",
      group: "proof",
      description: "Up to 3. None → the section is hidden.",
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "localeString", validation: (r) => r.required() }),
            defineField({ name: "audio", type: "file", options: { accept: "audio/*" }, validation: (r) => r.required() }),
            defineField({ name: "language", type: "string", options: { list: [{ title: "Punjabi", value: "pa" }, { title: "English", value: "en" }, { title: "Both", value: "both" }], layout: "radio" }, initialValue: "pa" }),
            defineField({ name: "transcript", type: "localeText" }),
          ],
          preview: { select: { title: "title.en", subtitle: "language" } },
        }),
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Advertiser testimonials",
      type: "array",
      group: "proof",
      description: "Up to 2, real and with permission.",
      validation: (r) => r.max(2),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", type: "localeText", validation: (r) => r.required() }),
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "business", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "business" } },
        }),
      ],
    }),
    defineField({ name: "idealFor", title: "“Ideal for” business types", type: "array", group: "packages", of: [{ type: "localeString" }], description: "Also used as the “Business type” options in the inquiry form." }),
    defineField({
      name: "foundingBanner",
      title: "Founding-sponsor banner",
      type: "object",
      group: "packages",
      fields: [
        defineField({ name: "enabled", title: "Show the banner", type: "boolean", initialValue: false }),
        defineField({ name: "text", type: "localeString" }),
        defineField({ name: "spotsLeft", title: "Spots left", type: "number", description: "Optional. Empty → not shown.", validation: (r) => r.min(0).integer() }),
      ],
    }),
    defineField({
      name: "faq",
      title: "Advertiser FAQ",
      type: "array",
      group: "faq",
      description: "Questions without an answer are hidden.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [defineField({ name: "q", title: "Question", type: "localeString", validation: (r) => r.required() }), defineField({ name: "a", title: "Answer", type: "localeText" })],
          preview: { select: { title: "q.en", subtitle: "a.en" } },
        }),
      ],
    }),
    defineField({ name: "replyTime", title: "We reply within…", type: "localeString", group: "faq", description: "e.g. “one business day”. Empty → the reply-time sentence is hidden." }),
  ],
  preview: { prepare: () => ({ title: "Advertise page" }) },
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
