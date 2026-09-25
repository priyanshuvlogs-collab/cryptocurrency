import { BRAND_DESCRIPTION, HOST_NAME, SITE_NAME, SITE_URL, absoluteUrl, sameAs, t } from "./site";
import type { Occurrence } from "./time";
import type { CommunityEvent, Episode, Faq, Locale, ScheduleSlot, Show, SiteSettings } from "./types";

/**
 * Structured data builders. All nodes share stable @ids so Google and AI
 * engines merge them into one entity graph: the station, its founder,
 * its shows and its broadcasts.
 */

export const STATION_ID = `${SITE_URL}/#station`;
export const PERSON_ID = `${SITE_URL}/#indi-jaswal`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

type Json = Record<string, unknown>;

export function graph(...nodes: (Json | Json[] | null | undefined)[]): Json {
  return { "@context": "https://schema.org", "@graph": nodes.flat().filter(Boolean) };
}

export function stationNode(settings: SiteSettings, locale: Locale): Json {
  const { address } = settings;
  return {
    "@type": ["RadioStation", "Organization"],
    "@id": STATION_ID,
    name: SITE_NAME,
    alternateName: ["ਇੰਡੀ ਰੇਡੀਓ", "Indi Radio Surrey", "indiradio.ca"],
    url: `${SITE_URL}/${locale}`,
    logo: absoluteUrl("/logo.png"),
    image: settings.hostImage || absoluteUrl("/og-default.png"),
    description: t(BRAND_DESCRIPTION, locale),
    slogan: locale === "pa" ? "ਸਰੀ, ਕੈਨੇਡਾ ਤੋਂ ਲਾਈਵ ਪੰਜਾਬੀ ਰੇਡੀਓ" : "Live Punjabi radio from Surrey, Canada",
    telephone: settings.phoneE164,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      ...(address.street ? { streetAddress: address.street } : {}),
      addressLocality: address.locality,
      addressRegion: address.region,
      ...(address.postalCode ? { postalCode: address.postalCode } : {}),
      addressCountry: address.country,
    },
    areaServed: ["Surrey, BC", "Canada", "India", "United Kingdom", "Australia", "United States", "United Arab Emirates"].map(
      (name) => ({ "@type": "Place", name }),
    ),
    knowsLanguage: ["pa", "en"],
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
    sameAs: sameAs(settings),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "call-in line",
        telephone: settings.phoneE164,
        availableLanguage: ["Punjabi", "English"],
      },
    ],
    potentialAction: {
      "@type": "ListenAction",
      target: { "@type": "EntryPoint", urlTemplate: absoluteUrl(`/${locale}/listen-live`) },
    },
  };
}

export function websiteNode(locale: Locale): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: ["en-CA", "pa-IN"],
    publisher: { "@id": STATION_ID },
    description: t(BRAND_DESCRIPTION, locale),
  };
}

export function personNode(settings: SiteSettings, locale: Locale, extra: Json = {}): Json {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: HOST_NAME,
    alternateName: "ਇੰਡੀ ਜਸਵਾਲ",
    jobTitle: locale === "pa" ? "ਰੇਡੀਓ ਹੋਸਟ ਅਤੇ ਸੰਸਥਾਪਕ, ਇੰਡੀ ਰੇਡੀਓ" : "Radio host and founder, Indi Radio",
    url: absoluteUrl(`/${locale}/indi-jaswal`),
    ...(settings.hostImage ? { image: settings.hostImage } : {}),
    worksFor: { "@id": STATION_ID },
    homeLocation: { "@type": "Place", name: "Surrey, British Columbia, Canada" },
    knowsLanguage: ["pa", "en"],
    sameAs: [settings.socials.tiktok, settings.socials.youtube, settings.socials.instagram, settings.socials.facebook].filter(Boolean),
    ...extra,
  };
}

export function breadcrumbNode(locale: Locale, items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(`/${locale}${item.path === "/" ? "" : item.path}`),
    })),
  };
}

export function faqNode(faqs: Faq[], locale: Locale): Json {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: t(f.q, locale),
      acceptedAnswer: { "@type": "Answer", text: t(f.a, locale) },
    })),
  };
}

export function seriesNode(show: Show, locale: Locale): Json {
  return {
    "@type": "RadioSeries",
    "@id": `${SITE_URL}/#show-${show.slug}`,
    name: t(show.name, locale),
    alternateName: show.nativeName,
    url: absoluteUrl(`/${locale}/shows/${show.slug}`),
    description: t(show.tagline, locale),
    inLanguage: "pa",
    ...(show.host === HOST_NAME ? { actor: { "@id": PERSON_ID }, creator: { "@id": PERSON_ID } } : {}),
    productionCompany: { "@id": STATION_ID },
    ...(show.image ? { image: show.image } : {}),
  };
}

export function broadcastNodes(
  occurrences: Occurrence<ScheduleSlot>[],
  shows: Show[],
  locale: Locale,
): Json[] {
  return occurrences
    .filter((o) => o.slot.confirmed)
    .map((o) => {
      const show = shows.find((s) => s.slug === o.slot.showSlug);
      const name = show ? t(show.name, locale) : SITE_NAME;
      return {
        "@type": "BroadcastEvent",
        name: `${name} – ${SITE_NAME}`,
        startDate: o.start.toISOString(),
        endDate: o.end.toISOString(),
        isLiveBroadcast: o.slot.live,
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: { "@type": "VirtualLocation", url: absoluteUrl(`/${locale}/listen-live`) },
        organizer: { "@id": STATION_ID },
        publishedOn: { "@type": "BroadcastService", name: SITE_NAME, broadcaster: { "@id": STATION_ID } },
        ...(show ? { workPerformed: { "@id": `${SITE_URL}/#show-${show.slug}` } } : {}),
        inLanguage: "pa",
      };
    });
}

export function eventNode(ev: CommunityEvent, locale: Locale): Json {
  return {
    "@type": "Event",
    name: t(ev.title, locale),
    description: t(ev.description, locale),
    startDate: ev.start,
    endDate: ev.end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: ev.liveBroadcast
      ? "https://schema.org/MixedEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: [
      {
        "@type": "Place",
        name: ev.venue,
        address: { "@type": "PostalAddress", streetAddress: ev.address, addressLocality: ev.city, addressCountry: "CA" },
      },
      ...(ev.liveBroadcast ? [{ "@type": "VirtualLocation", url: absoluteUrl(`/${locale}/listen-live`) }] : []),
    ],
    organizer: { "@id": STATION_ID },
    ...(ev.image ? { image: ev.image } : {}),
    ...(ev.ticketUrl ? { offers: { "@type": "Offer", url: ev.ticketUrl } } : {}),
    url: absoluteUrl(`/${locale}/events#${ev.slug}`),
  };
}

export function videoNode(ep: Episode): Json {
  return {
    "@type": "VideoObject",
    name: ep.title,
    description: ep.description?.slice(0, 300) || ep.title,
    thumbnailUrl: ep.thumbnail,
    uploadDate: ep.publishedAt,
    embedUrl: `https://www.youtube-nocookie.com/embed/${ep.id}`,
    url: ep.url,
    ...(ep.duration ? { duration: ep.duration } : {}),
    publisher: { "@id": STATION_ID },
  };
}

export function itemListNode(urls: { name: string; url: string }[]): Json {
  return {
    "@type": "ItemList",
    itemListElement: urls.map((u, i) => ({ "@type": "ListItem", position: i + 1, name: u.name, url: u.url })),
  };
}
