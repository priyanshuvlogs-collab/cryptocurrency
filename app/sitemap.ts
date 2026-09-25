import type { MetadataRoute } from "next";
import { getShows } from "@/lib/cms";
import { PAGES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { LOCALES } from "@/lib/types";

export const revalidate = 3600;

const PRIORITY: Record<string, number> = { "/": 1, "/listen-live": 0.9, "/schedule": 0.9, "/shows": 0.8, "/call-in": 0.8, "/dedications": 0.8 };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shows = await getShows();
  const paths = [...Object.values(PAGES).map((p) => p.path), ...shows.map((s) => `/shows/${s.slug}`)];
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
