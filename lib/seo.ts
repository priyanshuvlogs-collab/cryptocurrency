import type { Metadata } from "next";
import { PAGES, type PageKey } from "./i18n";
import { SITE_NAME, SITE_URL } from "./site";
import type { Locale } from "./types";

interface MetaInput {
  locale: Locale;
  /** Path without locale prefix, e.g. "/schedule" or "/" */
  path: string;
  title: string;
  description: string;
  /** Short heading printed on the social share image */
  ogHeading?: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
}

export function ogImageUrl(heading: string, sub?: string) {
  const params = new URLSearchParams({ title: heading });
  if (sub) params.set("sub", sub);
  return `/api/og?${params.toString()}`;
}

export function buildMetadata({ locale, path, title, description, ogHeading, type = "website", noindex }: MetaInput): Metadata {
  const suffix = path === "/" ? "" : path;
  const canonical = `/${locale}${suffix}`;
  // Share images are rendered with Latin fonts, so use the English heading.
  const image = ogImageUrl(ogHeading || title.split(/ [|–] /)[0]);
  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        "en-CA": `/en${suffix}`,
        "pa-IN": `/pa${suffix}`,
        "x-default": `/en${suffix}`,
      },
    },
    openGraph: {
      type,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      locale: locale === "pa" ? "pa_IN" : "en_CA",
      alternateLocale: locale === "pa" ? ["en_CA"] : ["pa_IN"],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large" },
  };
}

export function pageMetadata(key: PageKey, locale: Locale): Metadata {
  const page = PAGES[key];
  return buildMetadata({
    locale,
    path: page.path,
    title: page[locale].title,
    description: page[locale].description,
    ogHeading: page.en.title.split(/ [|–] /)[0],
  });
}
