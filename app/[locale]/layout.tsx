import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Anybody, Inter_Tight, Mukta_Mahee, Noto_Sans_Gurmukhi } from "next/font/google";
import "../globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";
import { AudioProvider } from "@/components/player/AudioProvider";
import { ScheduleProvider } from "@/components/player/ScheduleProvider";
import { LiveStatusProvider, WatchLiveBadge } from "@/components/player/LiveStatus";
import { MiniPlayer } from "@/components/player/MiniPlayer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Analytics, RevealOnScroll } from "@/components/layout/ClientEffects";
import { themeScript } from "@/components/layout/Toggles";
import { JsonLd } from "@/components/ui/JsonLd";
import { getAnnouncements, getSchedule, getSettings, getShows, getSpecialBroadcasts } from "@/lib/cms";
import { getMessages, isLocale } from "@/lib/i18n";
import { graph, stationNode, websiteNode } from "@/lib/jsonld";
import { SITE_NAME, SITE_URL, t, whatsappLink } from "@/lib/site";
import { LOCALES } from "@/lib/types";

const anybody = Anybody({ subsets: ["latin"], axes: ["wdth"], variable: "--font-anybody", display: "swap" });
const inter = Inter_Tight({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const muktaMahee = Mukta_Mahee({
  weight: ["600", "800"],
  subsets: ["gurmukhi"],
  variable: "--font-gurmukhi-display",
  display: "swap",
  preload: false,
});
const notoGurmukhi = Noto_Sans_Gurmukhi({
  subsets: ["gurmukhi"],
  variable: "--font-gurmukhi-body",
  display: "swap",
  preload: false,
});

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#12090f" },
    { media: "(prefers-color-scheme: light)", color: "#fff8ef" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: "Indi Radio" }],
  creator: "Indi Radio",
  publisher: "Indi Radio",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "black-translucent" },
  // [CONFIRM] Apple app id for the Smart App Banner on iPhone Safari
  itunes: { appId: "6739446010" },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  formatDetection: { telephone: false },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);

  const [settings, shows, slots, specials, announcements] = await Promise.all([
    getSettings(),
    getShows(),
    getSchedule(),
    getSpecialBroadcasts(),
    getAnnouncements(),
  ]);
  const showSummaries = shows.map(({ slug, name, host, callIn }) => ({ slug, name, host, callIn }));
  const announcement = announcements[0];

  return (
    <html
      lang={locale === "pa" ? "pa" : "en-CA"}
      className={`${anybody.variable} ${inter.variable} ${muktaMahee.variable} ${notoGurmukhi.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly summary" />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only-focusable fixed top-2 left-2 z-50 rounded-full bg-saffron px-4 py-2 font-bold text-on-saffron"
        >
          {m.skipToContent}
        </a>
        <JsonLd data={graph(stationNode(settings, locale), websiteNode(locale))} />
        <LocaleProvider locale={locale} messages={m}>
          <AudioProvider streamUrl={settings.streamUrl}>
            <ScheduleProvider value={{ slots, shows: showSummaries, specials }}>
              <LiveStatusProvider>
                <AnnouncementBar
                  item={announcement ? { id: announcement.id, text: t(announcement.text, locale), href: announcement.href } : undefined}
                />
                <SiteHeader
                  phoneDisplay={settings.phoneDisplay}
                  phoneE164={settings.phoneE164}
                  whatsappUrl={whatsappLink(settings.whatsappNumber)}
                />
                <WatchLiveBadge />
                <main id="main" tabIndex={-1} className="outline-none">
                  {children}
                </main>
                <SiteFooter locale={locale} m={m} settings={settings} />
                <MiniPlayer />
              </LiveStatusProvider>
            </ScheduleProvider>
          </AudioProvider>
          <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          <RevealOnScroll />
        </LocaleProvider>
      </body>
    </html>
  );
}
