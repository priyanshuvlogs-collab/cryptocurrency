import type { L10n, Locale, SiteSettings } from "./types";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://indiradio.ca").replace(/\/$/, "");
export const SITE_NAME = "Indi Radio";
export const HOST_NAME = "Indi Jaswal";

/**
 * The one brand description reused across meta tags, JSON-LD, llms.txt and
 * page copy. Keeping it identical everywhere teaches search and AI engines a
 * single, consistent entity.
 */
export const BRAND_DESCRIPTION: L10n = {
  en: "Indi Radio is a live Punjabi online radio station broadcasting from Surrey, British Columbia, Canada. Founded and hosted by Indi Jaswal, it brings live call-in talk shows like Bhedan Da Kaal, Punjabi music, culture and community conversation to listeners in Canada, India, the UK, Australia, the USA and Dubai.",
  pa: "ਇੰਡੀ ਰੇਡੀਓ ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ (ਕੈਨੇਡਾ) ਤੋਂ ਚੱਲਣ ਵਾਲਾ ਲਾਈਵ ਪੰਜਾਬੀ ਆਨਲਾਈਨ ਰੇਡੀਓ ਸਟੇਸ਼ਨ ਹੈ। ਇੰਡੀ ਜਸਵਾਲ ਵੱਲੋਂ ਸ਼ੁਰੂ ਕੀਤਾ ਅਤੇ ਚਲਾਇਆ ਜਾਂਦਾ ਇਹ ਸਟੇਸ਼ਨ ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਵਰਗੇ ਲਾਈਵ ਕਾਲ-ਇਨ ਸ਼ੋਅ, ਪੰਜਾਬੀ ਸੰਗੀਤ, ਸੱਭਿਆਚਾਰ ਅਤੇ ਭਾਈਚਾਰੇ ਦੀ ਗੱਲਬਾਤ ਕੈਨੇਡਾ, ਭਾਰਤ, ਯੂ.ਕੇ., ਆਸਟ੍ਰੇਲੀਆ, ਅਮਰੀਕਾ ਅਤੇ ਦੁਬਈ ਦੇ ਸਰੋਤਿਆਂ ਤੱਕ ਪਹੁੰਚਾਉਂਦਾ ਹੈ।",
};

export const SHORT_TAGLINE: L10n = {
  en: "Live Punjabi radio from Surrey, Canada",
  pa: "ਸਰੀ, ਕੈਨੇਡਾ ਤੋਂ ਲਾਈਵ ਪੰਜਾਬੀ ਰੇਡੀਓ",
};

/**
 * Defaults used when the CMS is not connected (and as fallbacks for empty
 * CMS fields). Every value the station has not verified is marked [CONFIRM].
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  // [CONFIRM] stream URL – must be HTTPS for iPhone Safari.
  streamUrl: process.env.NEXT_PUBLIC_STREAM_URL || "",
  // [CONFIRM] call-in number
  phoneDisplay: "778-834-0325",
  phoneE164: "+17788340325",
  // [CONFIRM] WhatsApp number (assumed same as call-in line)
  whatsappNumber: "17788340325",
  // [CONFIRM] WhatsApp channel invite link
  whatsappChannelUrl: null,
  // [CONFIRM] public email address
  email: "info@indiradio.ca",
  address: {
    street: null, // [CONFIRM] street address, or keep service-area only
    locality: "Surrey",
    region: "BC",
    postalCode: null, // [CONFIRM]
    country: "CA",
  },
  // Found via public search: "Indi Radio and TV" by Inderjit Singh. [CONFIRM] this is the one official iOS app.
  appStoreUrl: "https://apps.apple.com/ca/app/indi-radio-and-tv/id6739446010",
  // [CONFIRM] replace developer page with the single official app listing (https://play.google.com/store/apps/details?id=…)
  playStoreUrl: "https://play.google.com/store/apps/dev?id=8956785483204484089",
  tuneInUrl: null, // [CONFIRM] TuneIn / Alexa listing
  socials: {
    tiktok: null, // [CONFIRM]
    youtube: null, // [CONFIRM]
    facebook: null, // [CONFIRM]
    instagram: null, // [CONFIRM]
  },
  youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || null,
  tiktokLiveNow: false,
  tiktokLiveUrl: null,
  mediaKitUrl: null, // [CONFIRM] upload media kit PDF in the CMS
  hostImage: null, // [CONFIRM] upload a licensed photo of Indi Jaswal in the CMS
  audienceStats: [
    { label: { en: "Monthly listeners", pa: "ਮਹੀਨਾਵਾਰ ਸਰੋਤੇ" }, value: "[CONFIRM]" },
    { label: { en: "App installs", pa: "ਐਪ ਇੰਸਟਾਲ" }, value: "[CONFIRM]" },
    { label: { en: "Social followers", pa: "ਸੋਸ਼ਲ ਫ਼ਾਲੋਅਰ" }, value: "[CONFIRM]" },
    { label: { en: "Countries listening", pa: "ਸੁਣਨ ਵਾਲੇ ਦੇਸ਼" }, value: "6+" },
  ],
};

export function t(value: L10n | undefined | null, locale: Locale): string {
  if (!value) return "";
  return value[locale] || value.en;
}

export function localePath(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function whatsappLink(number: string, text?: string): string {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function sameAs(settings: SiteSettings): string[] {
  return [
    settings.socials.youtube,
    settings.socials.tiktok,
    settings.socials.facebook,
    settings.socials.instagram,
    settings.appStoreUrl,
    settings.playStoreUrl,
    settings.tuneInUrl,
    settings.whatsappChannelUrl,
  ].filter((u): u is string => Boolean(u));
}
