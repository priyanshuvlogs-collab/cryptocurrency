import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdvertiseInquiryForm } from "@/components/advertise/InquiryForm";
import { PackageCta } from "@/components/advertise/PackageCta";
import { SampleAds } from "@/components/advertise/SampleAds";
import { StickyCtaBar } from "@/components/advertise/StickyCtaBar";
import { SponsorStrip } from "@/components/sections/Shared";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Page";
import { ArrowRightIcon, DownloadIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { getAdPackages, getAdvertiseContent, getSchedule, getSettings, getSponsors } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { STATION_ID, breadcrumbNode, graph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, isFilled, t, whatsappLink } from "@/lib/site";
import type { AdPackage, AdvertiseContent, L10n, Locale, ScheduleSlot } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSettings();
  const page = PAGES.advertise[locale];
  // Only promise a download when a PDF is actually uploaded.
  const description = isFilled(settings.mediaKitUrl)
    ? page.description
    : page.description.replace("Get the media kit.", "Request the media kit.").replace("ਮੀਡੀਆ ਕਿੱਟ ਲਓ।", "ਮੀਡੀਆ ਕਿੱਟ ਮੰਗਵਾਓ।");
  return buildMetadata({ locale, path: PAGES.advertise.path, title: page.title, description, ogHeading: "Advertise on Punjabi radio in Surrey" });
}

/* ── Copy (EN + PA, section for section) ──────────────────────────────── */

const COPY = {
  en: {
    h1: "Advertise on Punjabi radio in Surrey",
    lead: "Reach Surrey’s Punjabi families in their own language, from a voice they already trust. Host-read ads on Bhedan Da Kaal, live on radio, TikTok and YouTube.",
    getPricing: "Get pricing",
    whatsappUs: "WhatsApp us",
    waMessage: "Hi Indi Radio, I’d like to advertise my business",
    hearSample: "Hear a sample ad",
    photoAlt: "Indi Jaswal, host of Indi Radio, in the studio",
    audienceTitle: "Who you’ll reach",
    stats: {
      monthlyListeners: "Monthly unique listeners",
      bcListenersPercent: "Listeners in BC / Lower Mainland",
      avgLiveViewers: "Average live viewers (TikTok + YouTube)",
      callInsPerWeek: "Live call-ins per week",
      appInstalls: "App installs",
      socialFollowers: "Social followers",
      countriesListening: "Countries listening",
    },
    statsSource: "Source: stream and platform analytics",
    statsUpdated: "updated",
    whoTitle: "Who listens",
    who: [
      "Punjabi-speaking families, mostly aged 25 to 65",
      "Rooted in Surrey and the Lower Mainland, with listeners across Canada",
      "Listeners in India and across the diaspora in the UK, Australia, the USA and the UAE",
      "Mostly on mobile: website, iPhone and Android apps, TikTok and YouTube",
      "Engaged listeners who call in, message on WhatsApp and show up at events",
    ],
    whyTitle: "Why it works",
    why: [
      ["Trusted voice", "Indi reads your message live, in Punjabi or English, so it lands as a recommendation, not an interruption."],
      ["Live and social", "The live shows also stream on TikTok and YouTube, so your mention reaches radio listeners and the live chat."],
      ["Community moments", "Vaisakhi, Diwali and Bandi Chhor Divas, weddings, melas and grand openings: be there when families celebrate."],
    ] as [string, string][],
    eventsLink: "See upcoming community events",
    samplesTitle: "Hear a sample ad",
    samplesIntro: "Host-read ads, the way your customers will hear them.",
    idealTitle: "Ideal for",
    packagesTitle: "Packages",
    packagesIntro: "Every package is written and produced with you. Tell us your goals and we’ll match the right mix.",
    from: (price: string) => `From ${price}/month`,
    onRequest: "Pricing on request",
    quoteFor: (name: string) => `Get a quote for ${name}`,
    rows: {
      airs: "On air",
      spotsPerWeek: "Spots per week",
      length: "Length",
      languages: "Languages",
      minimumTerm: "Minimum term",
      productionIncluded: "Production",
      monthlyPlayReport: "Monthly play report",
    },
    included: "Included",
    notIncluded: "Not included",
    pacific: "Pacific Time",
    customQuote: "Custom quote",
    mediaKit: "Download the media kit (PDF)",
    spotsLeft: (n: number) => `${n} ${n === 1 ? "spot" : "spots"} left`,
    howTitle: "How it works",
    how: [
      ["Tell us about your business", "Send the form below or message us on WhatsApp."],
      ["We write and record your ad", "In Punjabi, English or both, and you approve it before it airs."],
      ["You go live", "Your ad starts running and you get a monthly play report."],
    ] as [string, string][],
    sponsorsTitle: "Already advertising with us",
    testimonialsTitle: "What advertisers say",
    faqTitle: "Advertiser questions",
    formTitle: "Get pricing",
    formIntro: "Tell us a little about your business. There’s no obligation.",
    preferTalk: "Prefer to talk?",
    or: "or",
    call: (phone: string) => `call ${phone}`,
    replyWithin: (time: string) => `We reply within ${time}.`,
  },
  pa: {
    h1: "ਸਰੀ ਦੇ ਪੰਜਾਬੀ ਰੇਡੀਓ ’ਤੇ ਮਸ਼ਹੂਰੀ ਕਰੋ",
    lead: "ਸਰੀ ਦੇ ਪੰਜਾਬੀ ਪਰਿਵਾਰਾਂ ਤੱਕ ਉਹਨਾਂ ਦੀ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਪਹੁੰਚੋ, ਉਸ ਆਵਾਜ਼ ਰਾਹੀਂ ਜਿਸ ’ਤੇ ਉਹ ਪਹਿਲਾਂ ਹੀ ਭਰੋਸਾ ਕਰਦੇ ਹਨ। ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ’ਤੇ ਹੋਸਟ ਵੱਲੋਂ ਪੜ੍ਹੀ ਮਸ਼ਹੂਰੀ, ਰੇਡੀਓ, TikTok ਅਤੇ YouTube ’ਤੇ ਲਾਈਵ।",
    getPricing: "ਕੀਮਤ ਪੁੱਛੋ",
    whatsappUs: "WhatsApp ਕਰੋ",
    waMessage: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਇੰਡੀ ਰੇਡੀਓ ਜੀ, ਸਾਡੇ ਕਾਰੋਬਾਰ ਦੀ ਮਸ਼ਹੂਰੀ ਬਾਰੇ ਗੱਲ ਕਰਨੀ ਹੈ।",
    hearSample: "ਨਮੂਨੇ ਦੀ ਮਸ਼ਹੂਰੀ ਸੁਣੋ",
    photoAlt: "ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਹੋਸਟ ਇੰਡੀ ਜਸਵਾਲ ਸਟੂਡੀਓ ਵਿੱਚ",
    audienceTitle: "ਤੁਸੀਂ ਕਿਸ ਤੱਕ ਪਹੁੰਚੋਗੇ",
    stats: {
      monthlyListeners: "ਹਰ ਮਹੀਨੇ ਵੱਖਰੇ ਸਰੋਤੇ",
      bcListenersPercent: "ਬੀ.ਸੀ. / ਲੋਅਰ ਮੇਨਲੈਂਡ ਦੇ ਸਰੋਤੇ",
      avgLiveViewers: "ਔਸਤ ਲਾਈਵ ਦਰਸ਼ਕ (TikTok + YouTube)",
      callInsPerWeek: "ਹਰ ਹਫ਼ਤੇ ਲਾਈਵ ਕਾਲਾਂ",
      appInstalls: "ਐਪ ਇੰਸਟਾਲ",
      socialFollowers: "ਸੋਸ਼ਲ ਮੀਡੀਆ ਫ਼ਾਲੋਅਰ",
      countriesListening: "ਸੁਣਨ ਵਾਲੇ ਦੇਸ਼",
    },
    statsSource: "ਸਰੋਤ: ਸਟ੍ਰੀਮ ਅਤੇ ਪਲੇਟਫ਼ਾਰਮਾਂ ਦੇ ਅੰਕੜੇ",
    statsUpdated: "ਅੱਪਡੇਟ",
    whoTitle: "ਕੌਣ ਸੁਣਦਾ ਹੈ",
    who: [
      "ਪੰਜਾਬੀ ਬੋਲਣ ਵਾਲੇ ਪਰਿਵਾਰ, ਜ਼ਿਆਦਾਤਰ 25 ਤੋਂ 65 ਸਾਲ ਦੇ",
      "ਸਰੀ ਅਤੇ ਲੋਅਰ ਮੇਨਲੈਂਡ ਨਾਲ ਜੁੜੇ, ਅਤੇ ਪੂਰੇ ਕੈਨੇਡਾ ਵਿੱਚ ਸਰੋਤੇ",
      "ਭਾਰਤ ਵਿੱਚ, ਅਤੇ ਯੂ.ਕੇ., ਆਸਟ੍ਰੇਲੀਆ, ਅਮਰੀਕਾ ਤੇ ਯੂ.ਏ.ਈ. ਵਿੱਚ ਵੱਸਦੇ ਪੰਜਾਬੀ ਸਰੋਤੇ",
      "ਜ਼ਿਆਦਾਤਰ ਮੋਬਾਈਲ ’ਤੇ: ਵੈੱਬਸਾਈਟ, iPhone ਅਤੇ Android ਐਪ, TikTok ਅਤੇ YouTube",
      "ਜੁੜੇ ਹੋਏ ਸਰੋਤੇ ਜੋ ਕਾਲ ਕਰਦੇ ਹਨ, WhatsApp ’ਤੇ ਸੁਨੇਹੇ ਭੇਜਦੇ ਹਨ ਅਤੇ ਸਮਾਗਮਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ",
    ],
    whyTitle: "ਇਹ ਕਿਉਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    why: [
      ["ਭਰੋਸੇਯੋਗ ਆਵਾਜ਼", "ਇੰਡੀ ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਆਪ ਲਾਈਵ ਪੜ੍ਹਦੇ ਹਨ, ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ, ਇਸ ਲਈ ਸਰੋਤਿਆਂ ਨੂੰ ਇਹ ਇਸ਼ਤਿਹਾਰ ਨਹੀਂ, ਸਿਫ਼ਾਰਸ਼ ਲੱਗਦੀ ਹੈ।"],
      ["ਲਾਈਵ ਅਤੇ ਸੋਸ਼ਲ", "ਲਾਈਵ ਸ਼ੋਅ TikTok ਅਤੇ YouTube ’ਤੇ ਵੀ ਚੱਲਦੇ ਹਨ, ਇਸ ਲਈ ਤੁਹਾਡਾ ਜ਼ਿਕਰ ਰੇਡੀਓ ਸਰੋਤਿਆਂ ਦੇ ਨਾਲ-ਨਾਲ ਲਾਈਵ ਚੈਟ ਤੱਕ ਵੀ ਪਹੁੰਚਦਾ ਹੈ।"],
      ["ਭਾਈਚਾਰੇ ਦੇ ਖ਼ਾਸ ਮੌਕੇ", "ਵਿਸਾਖੀ, ਦੀਵਾਲੀ ਤੇ ਬੰਦੀ ਛੋੜ ਦਿਵਸ, ਵਿਆਹ, ਮੇਲੇ ਅਤੇ ਨਵੇਂ ਕਾਰੋਬਾਰਾਂ ਦੇ ਉਦਘਾਟਨ: ਜਦੋਂ ਪਰਿਵਾਰ ਖ਼ੁਸ਼ੀਆਂ ਮਨਾਉਂਦੇ ਹਨ, ਉੱਥੇ ਤੁਸੀਂ ਵੀ ਹੋਵੋ।"],
    ] as [string, string][],
    eventsLink: "ਆਉਣ ਵਾਲੇ ਭਾਈਚਾਰਕ ਸਮਾਗਮ ਦੇਖੋ",
    samplesTitle: "ਨਮੂਨੇ ਦੀ ਮਸ਼ਹੂਰੀ ਸੁਣੋ",
    samplesIntro: "ਹੋਸਟ ਵੱਲੋਂ ਪੜ੍ਹੀਆਂ ਮਸ਼ਹੂਰੀਆਂ, ਬਿਲਕੁਲ ਉਵੇਂ ਜਿਵੇਂ ਤੁਹਾਡੇ ਗਾਹਕ ਸੁਣਨਗੇ।",
    idealTitle: "ਇਹਨਾਂ ਕਾਰੋਬਾਰਾਂ ਲਈ ਬਹੁਤ ਵਧੀਆ",
    packagesTitle: "ਪੈਕੇਜ",
    packagesIntro: "ਹਰ ਪੈਕੇਜ ਤੁਹਾਡੇ ਨਾਲ ਮਿਲ ਕੇ ਲਿਖਿਆ ਅਤੇ ਤਿਆਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਆਪਣੇ ਟੀਚੇ ਦੱਸੋ, ਅਸੀਂ ਤੁਹਾਡੇ ਲਈ ਸਹੀ ਮੇਲ ਬਣਾਵਾਂਗੇ।",
    from: (price: string) => `${price}/ਮਹੀਨਾ ਤੋਂ ਸ਼ੁਰੂ`,
    onRequest: "ਕੀਮਤ ਪੁੱਛਣ ’ਤੇ",
    quoteFor: (name: string) => `${name} ਦੀ ਕੀਮਤ ਪੁੱਛੋ`,
    rows: {
      airs: "ਕਦੋਂ ਚੱਲਦਾ ਹੈ",
      spotsPerWeek: "ਹਫ਼ਤੇ ਵਿੱਚ ਇਸ਼ਤਿਹਾਰ",
      length: "ਲੰਬਾਈ",
      languages: "ਭਾਸ਼ਾ",
      minimumTerm: "ਘੱਟੋ-ਘੱਟ ਮਿਆਦ",
      productionIncluded: "ਇਸ਼ਤਿਹਾਰ ਤਿਆਰ ਕਰਨਾ",
      monthlyPlayReport: "ਮਹੀਨਾਵਾਰ ਪਲੇਅ ਰਿਪੋਰਟ",
    },
    included: "ਸ਼ਾਮਲ",
    notIncluded: "ਸ਼ਾਮਲ ਨਹੀਂ",
    pacific: "ਪੈਸੀਫ਼ਿਕ ਟਾਈਮ",
    customQuote: "ਤੁਹਾਡੀ ਲੋੜ ਮੁਤਾਬਕ ਕੀਮਤ",
    mediaKit: "ਮੀਡੀਆ ਕਿੱਟ ਡਾਊਨਲੋਡ ਕਰੋ (PDF)",
    spotsLeft: (n: number) => `${n} ਥਾਵਾਂ ਬਾਕੀ`,
    howTitle: "ਕਿਵੇਂ ਹੁੰਦਾ ਹੈ",
    how: [
      ["ਆਪਣੇ ਕਾਰੋਬਾਰ ਬਾਰੇ ਦੱਸੋ", "ਹੇਠਾਂ ਵਾਲਾ ਫ਼ਾਰਮ ਭੇਜੋ ਜਾਂ WhatsApp ’ਤੇ ਸੁਨੇਹਾ ਕਰੋ।"],
      ["ਅਸੀਂ ਮਸ਼ਹੂਰੀ ਲਿਖ ਕੇ ਰਿਕਾਰਡ ਕਰਦੇ ਹਾਂ", "ਪੰਜਾਬੀ, ਅੰਗਰੇਜ਼ੀ ਜਾਂ ਦੋਵਾਂ ਵਿੱਚ, ਅਤੇ ਚੱਲਣ ਤੋਂ ਪਹਿਲਾਂ ਤੁਸੀਂ ਇਸਨੂੰ ਪਾਸ ਕਰਦੇ ਹੋ।"],
      ["ਤੁਹਾਡੀ ਮਸ਼ਹੂਰੀ ਲਾਈਵ", "ਮਸ਼ਹੂਰੀ ਚੱਲਣੀ ਸ਼ੁਰੂ ਹੋ ਜਾਂਦੀ ਹੈ ਅਤੇ ਤੁਹਾਨੂੰ ਹਰ ਮਹੀਨੇ ਪਲੇਅ ਰਿਪੋਰਟ ਮਿਲਦੀ ਹੈ।"],
    ] as [string, string][],
    sponsorsTitle: "ਜੋ ਪਹਿਲਾਂ ਹੀ ਸਾਡੇ ਨਾਲ ਮਸ਼ਹੂਰੀ ਕਰਦੇ ਹਨ",
    testimonialsTitle: "ਮਸ਼ਹੂਰੀ ਕਰਨ ਵਾਲੇ ਕੀ ਕਹਿੰਦੇ ਹਨ",
    faqTitle: "ਮਸ਼ਹੂਰੀ ਬਾਰੇ ਸਵਾਲ",
    formTitle: "ਕੀਮਤ ਪੁੱਛੋ",
    formIntro: "ਆਪਣੇ ਕਾਰੋਬਾਰ ਬਾਰੇ ਥੋੜ੍ਹਾ ਦੱਸੋ। ਕੋਈ ਪਾਬੰਦੀ ਨਹੀਂ।",
    preferTalk: "ਗੱਲ ਕਰਨਾ ਚਾਹੋਗੇ?",
    or: "ਜਾਂ",
    call: (phone: string) => `${phone} ’ਤੇ ਫ਼ੋਨ ਕਰੋ`,
    replyWithin: (time: string) => `ਅਸੀਂ ${time} ਦੇ ਅੰਦਰ ਜਵਾਬ ਦਿੰਦੇ ਹਾਂ।`,
  },
};

type Copy = (typeof COPY)["en"];

/* ── Helpers ─────────────────────────────────────────────────────────── */

const STAT_ORDER = [
  "monthlyListeners",
  "bcListenersPercent",
  "avgLiveViewers",
  "callInsPerWeek",
  "appInstalls",
  "socialFollowers",
  "countriesListening",
] as const;

function price(value: number | null, locale: Locale, c: Copy) {
  if (value == null || !Number.isFinite(value) || value <= 0) return c.onRequest;
  const money = new Intl.NumberFormat(locale === "pa" ? "pa-IN" : "en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(value);
  return c.from(money);
}

function to12h(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** "Mon–Fri · 7:00 PM–9:00 PM Pacific Time" from confirmed schedule slots only. */
function airTimes(slots: ScheduleSlot[], showSlug: string | null | undefined, locale: Locale, c: Copy): string | null {
  if (!showSlug) return null;
  const mine = slots.filter((s) => s.showSlug === showSlug && s.confirmed);
  if (!mine.length) return null;
  const dayName = (d: number) =>
    new Intl.DateTimeFormat(locale === "pa" ? "pa-IN" : "en-CA", { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 7 + d)));
  const groups = new Map<string, number[]>();
  for (const s of mine) groups.set(`${s.start}-${s.end}`, [...(groups.get(`${s.start}-${s.end}`) || []), s.day]);
  return [...groups.entries()]
    .map(([range, days]) => {
      const sorted = [...new Set(days)].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)); // Monday first
      const monIdx = sorted.map((d) => (d + 6) % 7);
      const consecutive = monIdx.every((v, i) => i === 0 || v === monIdx[i - 1] + 1);
      const dayText =
        sorted.length >= 3 && consecutive ? `${dayName(sorted[0])}–${dayName(sorted[sorted.length - 1])}` : sorted.map(dayName).join(", ");
      const [start, end] = range.split("-");
      return `${dayText} · ${to12h(start)}–${to12h(end)} ${c.pacific}`;
    })
    .join(" / ");
}

function packageRows(p: AdPackage, locale: Locale, c: Copy, slots: ScheduleSlot[]) {
  const yesNo = (v: boolean | null | undefined) => (v === true ? c.included : v === false ? c.notIncluded : null);
  const rows: [string, string | null][] = [
    [c.rows.airs, airTimes(slots, p.showSlug, locale, c)],
    [c.rows.spotsPerWeek, isFilled(p.spotsPerWeek) ? String(p.spotsPerWeek) : null],
    [c.rows.length, isFilled(p.length) ? t(p.length, locale) : null],
    [c.rows.languages, isFilled(p.languages) ? t(p.languages, locale) : null],
    [c.rows.minimumTerm, isFilled(p.minimumTerm) ? t(p.minimumTerm, locale) : null],
    [c.rows.productionIncluded, yesNo(p.productionIncluded)],
    [c.rows.monthlyPlayReport, yesNo(p.monthlyPlayReport)],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}

function filledL10n(list: (L10n | null | undefined)[]) {
  return list.filter((v): v is L10n => isFilled(v));
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default async function AdvertisePage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const [settings, allPackages, sponsors, content, slots] = await Promise.all([
    getSettings(),
    getAdPackages(),
    getSponsors(),
    getAdvertiseContent(),
    getSchedule(),
  ]);

  const whatsappHref = whatsappLink(settings.whatsappNumber, c.waMessage);
  const heroImage = isFilled(content.heroImage) ? content.heroImage : isFilled(settings.hostImage) ? settings.hostImage : null;
  const heroAlt = isFilled(content.heroImageAlt) ? t(content.heroImageAlt, locale) : c.photoAlt;

  const stats = STAT_ORDER.filter((k) => isFilled(content.stats[k])).map((k) => ({ key: k, label: c.stats[k], value: String(content.stats[k]) }));
  const samples = content.sampleAds.filter((s) => isFilled(s.audioUrl) && isFilled(s.title));
  const idealFor = filledL10n(content.idealFor);
  const cards = allPackages.filter((p) => p.kind === "card" && p.enabled && isFilled(p.name));
  const partner = allPackages.find((p) => p.kind === "partner" && p.enabled && isFilled(p.name));
  const mediaKitUrl = isFilled(settings.mediaKitUrl) ? settings.mediaKitUrl : null;
  const banner = content.foundingBanner.enabled && isFilled(content.foundingBanner.text) ? content.foundingBanner : null;
  const realSponsors = sponsors.filter((s) => isFilled(s.name));
  const testimonials = content.testimonials.filter((q) => isFilled(q.quote) && isFilled(q.name));
  const faq = content.faq.filter((f) => isFilled(f.q) && isFilled(f.a));
  const reply = isFilled(content.replyTime) ? t(content.replyTime, locale) : null;

  const formPackages = [...cards, ...(partner ? [partner] : [])].map((p) => ({ value: p.slug, label: t(p.name, locale) }));
  const businessTypes = idealFor.map((v) => ({ value: t(v, "en"), label: t(v, locale) }));
  const crumbs = [
    { name: m.breadcrumbs.home, path: "/" },
    { name: m.nav.advertise, path: PAGES.advertise.path },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, crumbs),
          {
            "@type": "Service",
            name: locale === "pa" ? "ਪੰਜਾਬੀ ਰੇਡੀਓ ਮਸ਼ਹੂਰੀ" : "Punjabi radio advertising",
            serviceType: "Radio advertising",
            provider: { "@id": STATION_ID },
            areaServed: ["Surrey, BC", "Lower Mainland, BC", "Canada"],
            audience: { "@type": "Audience", audienceType: "Punjabi-speaking families" },
            url: absoluteUrl(`/${locale}/advertise`),
          },
          faq.length
            ? {
                "@type": "FAQPage",
                mainEntity: faq.map((f) => ({ "@type": "Question", name: t(f.q, locale), acceptedAnswer: { "@type": "Answer", text: t(f.a, locale) } })),
              }
            : null,
        )}
      />

      {/* 1 ── Hero */}
      <header className="band-ink overflow-hidden">
        <div className="container-ir grid items-center gap-10 pt-8 pb-12 md:pt-10 md:pb-16 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <nav aria-label={m.breadcrumbs.label}>
              <ol className="meta flex flex-wrap items-center gap-2 text-muted">
                <li>
                  <Link href={`/${locale}`} className="inline-block py-1 hover:text-fg">
                    {m.breadcrumbs.home}
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="7" height="7" viewBox="0 0 10 10" aria-hidden="true" className="text-marigold">
                    <path d="M5 0 10 5 5 10 0 5Z" fill="currentColor" />
                  </svg>
                  <span aria-current="page" className="text-fg">
                    {m.nav.advertise}
                  </span>
                </li>
              </ol>
            </nav>
            <h1 className="display-lg mt-10 max-w-4xl">{c.h1}</h1>
            <p className="mt-6 max-w-2xl text-lg text-muted md:text-xl">{c.lead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#inquiry" className="btn btn-primary btn-lg">
                {c.getPricing}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp_join"
                data-track-label="advertise_hero"
                className="btn btn-whatsapp btn-lg"
              >
                <WhatsAppIcon size={20} /> {c.whatsappUs}
              </a>
              {samples.length ? (
                <a href="#sample-ads" className="link ml-1 inline-flex min-h-11 items-center">
                  {c.hearSample}
                </a>
              ) : null}
            </div>
          </div>
          {heroImage ? (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-md border-2 border-marigold shadow-[10px_10px_0_var(--marigold)]">
              <Image src={heroImage} alt={heroAlt} fill priority sizes="(min-width: 1024px) 380px, 90vw" className="object-cover" />
            </div>
          ) : null}
        </div>
        <div className="phulkari-band" aria-hidden="true" />
      </header>

      {/* 2 ── Audience */}
      <Section id="audience" title={c.audienceTitle}>
        {stats.length >= 2 ? (
          <div className="mb-12">
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.key} className="reveal rounded-md border-2 border-fg bg-surface p-5">
                  <dt className="meta text-muted">{s.label}</dt>
                  <dd className="mt-2 font-display text-5xl leading-none font-black text-accent">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-muted">
              {c.statsSource}
              {isFilled(content.statsAsOf) ? `, ${c.statsUpdated} ${content.statsAsOf}` : ""}
            </p>
          </div>
        ) : null}
        <h3 className="font-display text-3xl leading-none font-extrabold uppercase">{c.whoTitle}</h3>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {c.who.map((w) => (
            <li key={w} className="flex gap-3">
              <svg width="12" height="12" viewBox="0 0 10 10" aria-hidden="true" className="mt-2 shrink-0 text-magenta">
                <path d="M5 0 10 5 5 10 0 5Z" fill="currentColor" />
              </svg>
              {w}
            </li>
          ))}
        </ul>
      </Section>

      {/* 3 ── Why it works */}
      <Section id="why" title={c.whyTitle}>
        <ul className="grid gap-4 md:grid-cols-3">
          {c.why.map(([title, body], i) => (
            <li key={title} className="reveal flex flex-col rounded-md border-2 border-fg bg-surface p-6">
              <p className="font-display text-5xl leading-none font-black text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 text-xl font-extrabold">{title}</h3>
              <p className="mt-2 flex-1 text-muted">{body}</p>
              {i === 2 ? (
                <Link href={`/${locale}/events`} className="link mt-4 inline-flex items-center gap-1">
                  {c.eventsLink} <ArrowRightIcon size={16} />
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </Section>

      {/* 4 ── Sample ads (only when uploaded) */}
      {samples.length ? (
        <Section id="sample-ads" title={c.samplesTitle} intro={c.samplesIntro}>
          <SampleAds samples={samples} />
        </Section>
      ) : null}

      {/* 5 ── Ideal for */}
      {idealFor.length ? (
        <Section id="ideal-for" title={c.idealTitle}>
          <ul className="flex flex-wrap gap-2">
            {idealFor.map((v) => (
              <li key={v.en} className="meta rounded-sm border-2 border-fg px-3 py-2 text-fg">
                {t(v, locale)}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* 6 ── Packages */}
      {cards.length || partner ? (
        <Section id="packages" title={c.packagesTitle} intro={c.packagesIntro}>
          {banner ? (
            <div className="band-marigold mb-8 flex flex-wrap items-center justify-between gap-3 rounded-md px-6 py-4">
              <p className="text-lg font-bold">{t(banner.text, locale)}</p>
              {banner.spotsLeft && banner.spotsLeft > 0 ? (
                <p className="meta rounded-sm bg-ink px-3 py-1.5 text-on-ink">{c.spotsLeft(banner.spotsLeft)}</p>
              ) : null}
            </div>
          ) : null}

          {cards.length ? (
            <ul className={`grid gap-6 md:items-start ${cards.length >= 3 ? "md:grid-cols-3" : cards.length === 2 ? "md:grid-cols-2" : ""}`}>
              {cards.map((p) => {
                const badge = isFilled(p.badge) ? t(p.badge, locale) : null;
                const rows = packageRows(p, locale, c, slots);
                const name = t(p.name, locale);
                return (
                  <li key={p.slug} className="reveal">
                    <article className={`flex h-full flex-col rounded-md border-2 border-fg p-6 ${badge ? "band-marigold md:-mt-4" : "bg-surface"}`}>
                      {badge ? <p className="meta mb-3 w-fit rounded-sm bg-ink px-2.5 py-1 text-on-ink">{badge}</p> : null}
                      <h3 className="font-display text-3xl leading-none font-extrabold uppercase">{name}</h3>
                      <p className="mt-3 font-display text-2xl leading-none font-black">{price(p.priceMonthly, locale, c)}</p>
                      {isFilled(p.description) ? <p className="mt-4 text-muted">{t(p.description, locale)}</p> : null}
                      {rows.length ? (
                        <dl className="mt-5 flex-1 divide-y divide-line border-y border-line">
                          {rows.map(([label, value]) => (
                            <div key={label} className="flex justify-between gap-4 py-2 text-sm">
                              <dt className="text-muted">{label}</dt>
                              <dd className="text-right font-semibold">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <div className="flex-1" />
                      )}
                      <PackageCta
                        slug={p.slug}
                        label={c.quoteFor(name)}
                        className={`btn mt-6 w-full whitespace-normal! ${badge ? "btn-primary" : "btn-ghost"}`}
                      />
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {partner ? (
            <div className="band-ink mt-6 grid gap-6 rounded-md p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
              <div>
                <h3 className="font-display text-3xl leading-none font-extrabold uppercase">
                  {t(partner.name, locale)} <span className="serif text-2xl text-marigold normal-case">{c.customQuote}</span>
                </h3>
                {isFilled(partner.description) ? <p className="mt-3 text-muted">{t(partner.description, locale)}</p> : null}
                {filledL10n(partner.features).length ? (
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {filledL10n(partner.features).map((f) => (
                      <li key={f.en} className="flex items-center gap-2">
                        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="text-marigold">
                          <path d="M5 0 10 5 5 10 0 5Z" fill="currentColor" />
                        </svg>
                        {t(f, locale)}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <PackageCta slug={partner.slug} label={c.quoteFor(t(partner.name, locale))} className="btn btn-primary whitespace-normal!" />
            </div>
          ) : null}

          {mediaKitUrl ? (
            <p className="mt-8">
              <a href={mediaKitUrl} download data-track="media_kit_download" className="link inline-flex items-center gap-2">
                <DownloadIcon size={18} /> {c.mediaKit}
              </a>
            </p>
          ) : null}
        </Section>
      ) : null}

      {/* 7 ── How it works */}
      <Section id="how" title={c.howTitle}>
        <ol className="grid gap-6 md:grid-cols-3">
          {c.how.map(([title, body], i) => (
            <li key={title} className="reveal border-t-2 border-fg pt-4">
              <p className="font-display text-6xl leading-none font-black text-accent">{i + 1}</p>
              <h3 className="mt-3 text-xl font-extrabold">{title}</h3>
              <p className="mt-1 text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 8 ── Sponsors & testimonials (real ones only) */}
      {realSponsors.length >= 3 ? <SponsorStrip sponsors={realSponsors} locale={locale} m={m} linkHref="#inquiry" /> : null}
      {(realSponsors.length > 0 && realSponsors.length < 3) || testimonials.length ? (
        <Section id="advertisers" title={testimonials.length ? c.testimonialsTitle : c.sponsorsTitle}>
          {realSponsors.length > 0 && realSponsors.length < 3 ? (
            <ul className="flex flex-wrap items-center gap-10">
              {realSponsors.map((s) => (
                <li key={s.name}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer sponsored" className="block">
                      {s.logo ? (
                        <Image src={s.logo} alt={s.name} width={160} height={64} className="h-14 w-auto object-contain" />
                      ) : (
                        <span className="font-display text-3xl font-extrabold uppercase">{s.name}</span>
                      )}
                    </a>
                  ) : s.logo ? (
                    <Image src={s.logo} alt={s.name} width={160} height={64} className="h-14 w-auto object-contain" />
                  ) : (
                    <span className="font-display text-3xl font-extrabold uppercase">{s.name}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
          {testimonials.length ? (
            <ul className={`grid gap-6 md:grid-cols-2 ${realSponsors.length > 0 && realSponsors.length < 3 ? "mt-10" : ""}`}>
              {testimonials.map((q) => (
                <li key={q.id}>
                  <figure className="reveal h-full rounded-md border-2 border-fg bg-surface p-6">
                    <blockquote className="serif text-2xl leading-snug">“{t(q.quote, locale)}”</blockquote>
                    <figcaption className="mt-4 font-bold">
                      {q.name}
                      {isFilled(q.business) ? <span className="block font-normal text-muted">{q.business}</span> : null}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : null}
        </Section>
      ) : null}

      {/* 9 ── Advertiser FAQ (answered questions only) */}
      {faq.length ? (
        <Section id="advertiser-faq" title={c.faqTitle}>
          <div className="max-w-3xl space-y-3">
            {faq.map((f) => (
              <details key={f.id} className="group rounded-md border-2 border-fg bg-surface p-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-bold">
                  <h3>{t(f.q, locale)}</h3>
                  <span aria-hidden="true" className="mt-1 text-accent transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted">{t(f.a, locale)}</p>
              </details>
            ))}
          </div>
        </Section>
      ) : null}

      {/* 10 ── Inquiry form */}
      <Section id="inquiry" title={c.formTitle} intro={c.formIntro} className="scroll-mt-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-md border-2 border-fg bg-surface p-5 md:p-8">
            <AdvertiseInquiryForm packages={formPackages} businessTypes={businessTypes} />
          </div>
          <aside className="band-ink h-fit rounded-md p-6">
            <p className="font-display text-3xl leading-none font-extrabold uppercase">{c.preferTalk}</p>
            <p className="mt-4 text-lg">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp_join"
                data-track-label="advertise_form"
                className="link inline-block py-1"
              >
                {c.whatsappUs}
              </a>{" "}
              {c.or}{" "}
              <a href={`tel:${settings.phoneE164}`} data-track="call_in_click" data-track-label="advertise_form" className="link inline-block py-1">
                {c.call(settings.phoneDisplay)}
              </a>
              .
            </p>
            {reply ? <p className="mt-3 text-muted">{c.replyWithin(reply)}</p> : null}
            <div className="mt-6 grid gap-2">
              <a href={`tel:${settings.phoneE164}`} aria-hidden="true" tabIndex={-1} className="btn btn-live">
                <PhoneIcon size={18} /> {settings.phoneDisplay}
              </a>
            </div>
          </aside>
        </div>
      </Section>

      <StickyCtaBar pricingLabel={c.getPricing} whatsappLabel={c.whatsappUs} whatsappHref={whatsappHref} />
    </>
  );
}
