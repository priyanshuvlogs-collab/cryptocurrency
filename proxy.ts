import { NextResponse, type NextRequest } from "next/server";

/**
 * Language routing. Every page lives under /en or /pa. A request without a
 * language prefix (e.g. "/" or "/schedule") is redirected to the visitor's
 * saved choice (NEXT_LOCALE cookie), else their browser language, else English.
 */

const LOCALES = ["en", "pa"] as const;

function preferredLocale(req: NextRequest): (typeof LOCALES)[number] {
  const saved = req.cookies.get("NEXT_LOCALE")?.value;
  if (saved === "en" || saved === "pa") return saved;
  const accept = req.headers.get("accept-language") || "";
  const first = accept.split(",")[0]?.trim().toLowerCase() || "";
  return first.startsWith("pa") ? "pa" : "en";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${preferredLocale(req)}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.redirect(url, 307);
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
}

export const config = {
  // Skip API routes, Next internals, SEO/AI files and anything with a file extension.
  matcher: ["/((?!api|_next|studio|\\.well-known|llms.txt|llms-full.txt|robots.txt|sitemap.xml|manifest.webmanifest|.*\\..*).*)"],
};
