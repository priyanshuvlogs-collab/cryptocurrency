import "server-only";
import { cache } from "react";
import { createClient, type SanityClient } from "@sanity/client";
import * as seed from "@/content/seed";
import { DEFAULT_SETTINGS } from "./site";
import type {
  AdPackage,
  Announcement,
  CommunityEvent,
  DedicationTier,
  Faq,
  L10n,
  PressItem,
  ScheduleSlot,
  Show,
  SiteSettings,
  SocialPost,
  SpecialBroadcast,
  Sponsor,
} from "./types";

/**
 * Content access. With Sanity configured (NEXT_PUBLIC_SANITY_PROJECT_ID) every
 * getter reads from the CMS; without it the site runs on content/seed.ts, so
 * local development and preview deployments always work.
 *
 * Pages are statically generated and refreshed every 5 minutes, and instantly
 * when the Sanity webhook calls /api/revalidate on publish.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

let client: SanityClient | null = null;
if (projectId) {
  client = createClient({
    projectId,
    dataset,
    apiVersion: "2025-01-01",
    useCdn: !process.env.SANITY_API_READ_TOKEN,
    token: process.env.SANITY_API_READ_TOKEN,
    perspective: "published",
  });
}

export const cmsEnabled = Boolean(client);

async function query<T>(groq: string, fallback: T, params: Record<string, unknown> = {}): Promise<T> {
  if (!client) return fallback;
  try {
    const result = await client.fetch<T>(groq, params, { next: { revalidate: 300, tags: ["sanity"] } });
    return result ?? fallback;
  } catch (err) {
    console.error("[cms] query failed, using seed content", err);
    return fallback;
  }
}

const img = (field: string) => `"${field}": ${field}.asset->url`;

/** Sanity stores long text as {en, pa} with blank-line paragraphs. */
function paragraphs(value: L10n | null | undefined): L10n[] {
  if (!value) return [];
  const en = (value.en || "").split(/\n\s*\n/).filter(Boolean);
  const pa = (value.pa || "").split(/\n\s*\n/).filter(Boolean);
  return Array.from({ length: Math.max(en.length, pa.length) }, (_, i) => ({ en: en[i] || "", pa: pa[i] || en[i] || "" }));
}

type RawSettings = Partial<Omit<SiteSettings, "socials" | "address">> & {
  socials?: Partial<SiteSettings["socials"]>;
  address?: Partial<SiteSettings["address"]>;
};

function pickDefined<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== "")) as Partial<T>;
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const raw = await query<RawSettings | null>(
    `*[_type == "siteSettings"][0]{
      streamUrl, phoneDisplay, phoneE164, whatsappNumber, whatsappChannelUrl, email,
      address, appStoreUrl, playStoreUrl, tuneInUrl, socials, youtubeChannelId,
      tiktokLiveNow, tiktokLiveUrl, "mediaKitUrl": mediaKit.asset->url, ${img("hostImage")},
      audienceStats[]{label, value}
    }`,
    null,
  );
  if (!raw) return DEFAULT_SETTINGS;
  const { socials, address, audienceStats, ...rest } = raw;
  return {
    ...DEFAULT_SETTINGS,
    ...pickDefined(rest),
    tiktokLiveNow: Boolean(raw.tiktokLiveNow),
    address: { ...DEFAULT_SETTINGS.address, ...pickDefined(address) },
    socials: { ...DEFAULT_SETTINGS.socials, ...pickDefined(socials) },
    audienceStats: audienceStats?.length ? audienceStats : DEFAULT_SETTINGS.audienceStats,
  };
});

type RawShow = Omit<Show, "description"> & { description: L10n | null };

export const getShows = cache(async (): Promise<Show[]> => {
  if (!client) return seed.shows;
  const raw = await query<RawShow[]>(
    `*[_type == "show"] | order(featured desc, orderRank asc, name.en asc){
      "slug": slug.current, name, nativeName, tagline, description, host, ${img("image")},
      youtubePlaylistId, "keywords": coalesce(keywords, []), "callIn": coalesce(callIn, false),
      "featured": coalesce(featured, false)
    }`,
    [],
  );
  return raw.length ? raw.map((s) => ({ ...s, description: paragraphs(s.description) })) : seed.shows;
});

export const getShow = cache(async (slug: string) => (await getShows()).find((s) => s.slug === slug) ?? null);

export const getSchedule = cache(async (): Promise<ScheduleSlot[]> => {
  if (!client) return seed.schedule;
  const raw = await query<ScheduleSlot[]>(
    `*[_type == "scheduleSlot" && defined(show)]{
      "id": _id, "showSlug": show->slug.current, "day": day, start, end,
      "live": coalesce(live, true), "confirmed": coalesce(confirmed, true)
    }`,
    [],
  );
  return raw.length ? raw.map((s) => ({ ...s, day: Number(s.day) as ScheduleSlot["day"] })) : seed.schedule;
});

export const getSpecialBroadcasts = cache(async (): Promise<SpecialBroadcast[]> =>
  query(
    `*[_type == "specialBroadcast" && end > now()] | order(start asc){ "id": _id, title, start, end, "showSlug": show->slug.current }`,
    seed.specialBroadcasts,
  ),
);

export const getFaqs = cache(async (): Promise<Faq[]> => {
  if (!client) return seed.faqs;
  const raw = await query<Faq[]>(`*[_type == "faq"] | order(order asc){ "id": _id, q, a, category }`, []);
  return raw.length ? raw : seed.faqs;
});

export const getSponsors = cache(async (): Promise<Sponsor[]> =>
  query(
    `*[_type == "sponsor" && (!defined(activeUntil) || activeUntil > now())] | order(tier asc, name asc){ name, ${img("logo")}, url, tier }`,
    seed.sponsors,
  ),
);

export const getEvents = cache(async (): Promise<CommunityEvent[]> =>
  query(
    `*[_type == "event"] | order(start asc){
      "slug": slug.current, title, description, start, end, venue, address, city, mapUrl, ticketUrl,
      "liveBroadcast": coalesce(liveBroadcast, false), ${img("image")}
    }`,
    seed.events,
  ),
);

export const getAnnouncements = cache(async (): Promise<Announcement[]> =>
  query(
    `*[_type == "announcement" && coalesce(active, true) && (!defined(startsAt) || startsAt <= now()) && (!defined(endsAt) || endsAt > now())] | order(_updatedAt desc){ "id": _id, text, href, startsAt, endsAt }`,
    seed.announcements,
  ),
);

export const getDedicationTiers = cache(async (): Promise<DedicationTier[]> => {
  if (!client) return seed.dedicationTiers;
  const raw = await query<DedicationTier[]>(
    `*[_type == "dedicationTier"] | order(order asc){ "id": code.current, name, description, priceCad, "features": coalesce(features, []), highlighted }`,
    [],
  );
  return raw.length ? raw : seed.dedicationTiers;
});

export const getAdPackages = cache(async (): Promise<AdPackage[]> => {
  if (!client) return seed.adPackages;
  const raw = await query<AdPackage[]>(
    `*[_type == "adPackage"] | order(order asc){ "id": _id, name, description, priceNote, "features": coalesce(features, []) }`,
    [],
  );
  return raw.length ? raw : seed.adPackages;
});

export const getPress = cache(async (): Promise<PressItem[]> =>
  query(`*[_type == "pressItem"] | order(date desc){ outlet, title, url, date }`, seed.press),
);

export const getSocialPosts = cache(async (): Promise<SocialPost[]> =>
  query(
    `*[_type == "socialPost"] | order(postedAt desc)[0...8]{ "id": _id, platform, url, caption, ${img("thumbnail")}, postedAt }`,
    seed.socialPosts,
  ),
);

/** The currently running contest, if any (shown on the Song Requests page). */
export const getContest = cache(async (): Promise<{ title: L10n; question: L10n; endsAt: string | null } | null> =>
  query(
    `*[_type == "contest" && coalesce(active, false) && (!defined(endsAt) || endsAt > now())] | order(_updatedAt desc)[0]{ title, question, endsAt }`,
    null,
  ),
);
