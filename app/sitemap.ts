import type { MetadataRoute } from "next";
import { getAdvertiseContent, getShows, getSponsors } from "@/lib/cms";
import { PAGES } from "@/lib/i18n";
import { isFilled, SITE_URL } from "@/lib/site";
import { LOCALES } from "@/lib/types";

export const revalidate = 3600;

const PRIORITY: Record<string, number> = { "/": 1, "/listen-live": 0.9, "/schedule": 0.9, "/shows": 0.8, "/call-in": 0.8, "/dedications": 0.8, "/advertise": 0.7, "/advertise/get-pricing": 0.7 };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [shows, sponsors, advertise] = await Promise.all([getShows(), getSponsors(), getAdvertiseContent()]);
  // The Advertisers page only exists once there is a real sponsor or testimonial.
  const hasSuccess = sponsors.some((s) => isFilled(s.name)) || advertise.testimonials.some((q) => isFilled(q.quote) && isFilled(q.name));
  const pages = Object.values(PAGES)
    .map((p) => p.path)
    .filter((path) => hasSuccess || path !== PAGES.advertiseSuccess.path);
  const paths = [...pages, ...shows.map((s) => `/shows/${s.slug}`)];
  const now = new Date();
  return paths.flatMap((path) => {
    const suffix = path === "/" ? "" : path;
    const languages = { "en-CA": `${SITE_URL}/en${suffix}`, "pa-IN": `${SITE_URL}/pa${suffix}`, "x-default": `${SITE_URL}/en${suffix}` };
    return LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${suffix}`,
      lastModified: now,
      changeFrequency: path === "/" || path === "/schedule" || path === "/episodes" ? ("daily" as const) : ("weekly" as const),
      priority: PRIORITY[path] ?? (path.startsWith("/shows/") ? 0.7 : 0.5),
      alternates: { languages },
    }));
  });
}
