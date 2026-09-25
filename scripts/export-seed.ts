/**
 * Prints content/seed.ts as Sanity NDJSON so the CMS starts with the same
 * content as the site. Used by `cd studio && npm run seed`.
 *
 *   node --experimental-strip-types scripts/export-seed.ts > studio/seed/seed.ndjson
 */
import * as seed from "../content/seed.ts";
import { DEFAULT_SETTINGS } from "../lib/site.ts";

const docs: Record<string, unknown>[] = [];
const text = (v: { en: string; pa: string }) => ({ _type: "localeString", ...v });
const long = (paras: { en: string; pa: string }[]) => ({
  _type: "localeText",
  en: paras.map((p) => p.en).join("\n\n"),
  pa: paras.map((p) => p.pa).join("\n\n"),
});
const key = (i: number) => `k${i}`;

const { hostImage: _h, mediaKitUrl: _m, audienceStats, streamUrl, ...settings } = DEFAULT_SETTINGS;
docs.push({
  _id: "siteSettings",
  _type: "siteSettings",
  ...settings,
  ...(streamUrl ? { streamUrl } : {}),
  audienceStats: audienceStats.map((s, i) => ({ _key: key(i), label: text(s.label), value: s.value })),
});

seed.shows.forEach((s, i) =>
  docs.push({
    _id: `show-${s.slug}`,
    _type: "show",
    name: text(s.name),
    nativeName: s.nativeName,
    slug: { _type: "slug", current: s.slug },
    tagline: text(s.tagline),
    description: long(s.description),
    host: s.host,
    callIn: s.callIn,
    featured: s.featured,
    keywords: s.keywords,
    orderRank: i,
  }),
);

for (const slot of seed.schedule) {
  docs.push({
    _id: `slot-${slot.id}`,
    _type: "scheduleSlot",
    show: { _type: "reference", _ref: `show-${slot.showSlug}` },
    day: slot.day,
    start: slot.start,
    end: slot.end,
    live: slot.live,
    confirmed: slot.confirmed,
  });
}

seed.faqs.forEach((f, i) =>
  docs.push({ _id: `faq-${f.id}`, _type: "faq", q: text(f.q), a: { _type: "localeText", ...f.a }, category: f.category, order: i }),
);

seed.dedicationTiers.forEach((t, i) =>
  docs.push({
    _id: `tier-${t.id}`,
    _type: "dedicationTier",
    name: text(t.name),
    code: { _type: "slug", current: t.id },
    description: text(t.description),
    ...(t.priceCad != null ? { priceCad: t.priceCad } : {}),
    features: t.features.map((f, j) => ({ _key: key(j), ...text(f) })),
    highlighted: Boolean(t.highlighted),
    order: i,
  }),
);

seed.adPackages.forEach((p, i) =>
  docs.push({
    _id: `adpackage-${p.id}`,
    _type: "adPackage",
    name: text(p.name),
    description: text(p.description),
    priceNote: text(p.priceNote),
    features: p.features.map((f, j) => ({ _key: key(j), ...text(f) })),
    order: i,
  }),
);

process.stdout.write(docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
