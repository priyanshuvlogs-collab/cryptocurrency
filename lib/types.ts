import type { Weekday } from "./time";

export const LOCALES = ["en", "pa"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** A string in both site languages. */
export interface L10n {
  en: string;
  pa: string;
}

export interface SiteSettings {
  streamUrl: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappNumber: string; // digits only, for wa.me links
  whatsappChannelUrl: string | null;
  email: string;
  address: {
    street: string | null;
    locality: string;
    region: string;
    postalCode: string | null;
    country: string;
  };
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  tuneInUrl: string | null;
  socials: {
    tiktok: string | null;
    youtube: string | null;
    facebook: string | null;
    instagram: string | null;
  };
  youtubeChannelId: string | null;
  /** Manual switch in the CMS – TikTok has no public "is live" API. */
  tiktokLiveNow: boolean;
  tiktokLiveUrl: string | null;
  mediaKitUrl: string | null;
  /** Shown in the footer only when set. */
  socanLicence: string | null;
  resoundLicence: string | null;
  hostImage: string | null;
  audienceStats: { label: L10n; value: string }[];
}

export interface Show {
  slug: string;
  name: L10n;
  /** Name as written in Gurmukhi, shown alongside the English name. */
  nativeName?: string;
  tagline: L10n;
  description: L10n[]; // paragraphs
  host: string;
  image?: string | null;
  youtubePlaylistId?: string | null;
  /** Words matched against YouTube titles when no playlist is set. */
  keywords: string[];
  callIn: boolean;
  featured: boolean;
}

export interface ScheduleSlot {
  id: string;
  showSlug: string;
  day: Weekday;
  start: string;
  end: string;
  live: boolean;
  /** false until the station confirms this time – shows a [CONFIRM] flag. */
  confirmed: boolean;
}

export interface SpecialBroadcast {
  id: string;
  title: L10n;
  start: string; // ISO
  end: string; // ISO
  showSlug?: string | null;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  showSlug: string | null;
  duration?: string | null; // ISO 8601
  isLive?: boolean;
}

export interface Sponsor {
  name: string;
  logo?: string | null;
  url?: string | null;
  tier: "presenting" | "gold" | "community";
}

export interface CommunityEvent {
  slug: string;
  title: L10n;
  description: L10n;
  start: string; // ISO
  end: string; // ISO
  venue: string;
  address: string;
  city: string;
  mapUrl?: string | null;
  ticketUrl?: string | null;
  liveBroadcast: boolean;
  image?: string | null;
}

export interface Faq {
  id: string;
  q: L10n;
  a: L10n;
  category: "listening" | "shows" | "call-in" | "dedications" | "advertising" | "general";
}

export interface Announcement {
  id: string;
  text: L10n;
  href?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
}

export type Occasion = "birthday" | "anniversary" | "wedding" | "festival" | "business";

export interface DedicationTier {
  id: string;
  name: L10n;
  description: L10n;
  /** CAD. null = price not confirmed yet → booking is taken as a request, no payment. */
  priceCad: number | null;
  features: L10n[];
  highlighted?: boolean;
}

export interface AdPackage {
  id: string;
  /** URL-safe code used in ?package=… and the inquiry form. */
  slug: string;
  /** "card" = one of the three package cards; "partner" = the Station Partner strip. */
  kind: "card" | "partner";
  /** The partner strip only renders when this is true. Cards render unless explicitly false. */
  enabled: boolean;
  name: L10n;
  description: L10n;
  badge?: L10n | null;
  /** CAD per month. null → "Pricing on request". */
  priceMonthly: number | null;
  spotsPerWeek?: string | null;
  length?: L10n | null;
  languages?: L10n | null;
  minimumTerm?: L10n | null;
  productionIncluded?: boolean | null;
  monthlyPlayReport?: boolean | null;
  /** Extra bullet points (used by the partner strip). */
  features: L10n[];
  /** Show whose confirmed schedule times appear on the card (sponsor package). */
  showSlug?: string | null;
}

/** Everything on /advertise that the station edits in the CMS ("Advertise page" singleton). */
export interface AdvertiseContent {
  heroImage: string | null;
  heroImageAlt: L10n | null;
  stats: {
    monthlyListeners: string | null;
    bcListenersPercent: string | null;
    avgLiveViewers: string | null;
    callInsPerWeek: string | null;
    appInstalls: string | null;
    socialFollowers: string | null;
    countriesListening: string | null;
  };
  /** e.g. "September 2026" – shown in the stats caption. */
  statsAsOf: string | null;
  sampleAds: { id: string; title: L10n; transcript: L10n; audioUrl: string; language: "pa" | "en" | "both" }[];
  idealFor: L10n[];
  foundingBanner: { enabled: boolean; text: L10n | null; spotsLeft: number | null };
  testimonials: { id: string; quote: L10n; name: string; business: string | null }[];
  faq: { id: string; q: L10n; a: L10n | null }[];
  /** e.g. "one business day" – completes "We reply within …". */
  replyTime: L10n | null;
}

export interface PressItem {
  outlet: string;
  title: string;
  url: string;
  date: string;
}

export interface SocialPost {
  id: string;
  platform: "tiktok" | "instagram" | "youtube" | "facebook";
  url: string;
  caption: string;
  thumbnail?: string | null;
  postedAt: string;
}
