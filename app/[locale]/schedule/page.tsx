import type { Metadata } from "next";
import { NextShowCountdown, NowPlaying } from "@/components/player/PlayerControls";
import { ScheduleGrid } from "@/components/sections/ScheduleGrid";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader, Section } from "@/components/ui/Page";
import { getSchedule, getShows } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { broadcastNodes, graph, seriesNode } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { thisWeek } from "@/lib/time";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("schedule", (await params).locale);
}

const COPY = {
  en: {
    h1: "Indi Radio weekly schedule",
    lead: "Every show, in your time zone. Indi Radio broadcasts live from Surrey, BC (Pacific Time). Tap a zone to see the times for Vancouver, India, the UK or Australia, or leave it on your own local time.",
    between: "Between live shows, Indi Radio plays Punjabi music around the clock, so there is always something on when you press play.",
  },
  pa: {
    h1: "ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਹਫ਼ਤਾਵਾਰੀ ਸਮਾਂ-ਸੂਚੀ",
    lead: "ਹਰ ਸ਼ੋਅ, ਤੁਹਾਡੇ ਟਾਈਮ ਜ਼ੋਨ ਵਿੱਚ। ਇੰਡੀ ਰੇਡੀਓ ਸਰੀ, ਬੀ.ਸੀ. (ਪੈਸੀਫ਼ਿਕ ਟਾਈਮ) ਤੋਂ ਲਾਈਵ ਪ੍ਰਸਾਰਿਤ ਹੁੰਦਾ ਹੈ। ਵੈਨਕੂਵਰ, ਭਾਰਤ, ਯੂ.ਕੇ. ਜਾਂ ਆਸਟ੍ਰੇਲੀਆ ਦਾ ਸਮਾਂ ਦੇਖਣ ਲਈ ਬਟਨ ਦਬਾਓ, ਜਾਂ ਆਪਣਾ ਸਥਾਨਕ ਸਮਾਂ ਰਹਿਣ ਦਿਓ।",
    between: "ਲਾਈਵ ਸ਼ੋਆਂ ਦੇ ਵਿਚਕਾਰ ਇੰਡੀ ਰੇਡੀਓ ਦਿਨ-ਰਾਤ ਪੰਜਾਬੀ ਸੰਗੀਤ ਚਲਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਪਲੇਅ ਦਬਾਉਣ ’ਤੇ ਹਮੇਸ਼ਾ ਕੁਝ ਨਾ ਕੁਝ ਚੱਲ ਰਿਹਾ ਹੁੰਦਾ ਹੈ।",
  },
};

export default async function SchedulePage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const [slots, shows] = await Promise.all([getSchedule(), getShows()]);
  const now = Date.now();
  const summaries = shows.map(({ slug, name, host, callIn }) => ({ slug, name, host, callIn }));

  return (
    <>
      <JsonLd data={graph(shows.map((s) => seriesNode(s, locale)), broadcastNodes(thisWeek(slots, new Date(now)), shows, locale))} />
      <PageHeader locale={locale} m={m} crumbs={[{ name: m.nav.schedule, path: PAGES.schedule.path }]} title={c.h1} lead={c.lead} />
      <Section>
        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <NowPlaying />
          </div>
          <div className="card p-6">
            <NextShowCountdown />
          </div>
        </div>
        <h2 className="sr-only">{c.h1}</h2>
        <ScheduleGrid slots={slots} shows={summaries} serverNow={now} />
        <p className="mt-8 max-w-2xl text-muted">{c.between}</p>
      </Section>
    </>
  );
}
