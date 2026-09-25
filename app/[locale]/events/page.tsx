import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader, Section } from "@/components/ui/Page";
import { CalendarIcon, PinIcon } from "@/components/ui/Icons";
import { getEvents } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { eventNode, graph } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/lib/site";
import { STATION_TZ, formatDate, formatTime } from "@/lib/time";
import type { CommunityEvent, Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("events", (await params).locale);
}

const COPY = {
  en: {
    h1: "Community events & live broadcasts",
    lead: "Melas, cultural nights, fundraisers and live broadcasts: find Indi Radio out in the community, from Surrey to wherever Punjabi families gather.",
    upcoming: "Upcoming",
    past: "Past events",
    live: "Broadcasting live",
    none: "No upcoming events are listed right now. Join the WhatsApp channel to hear first when the next one is announced.",
    hostTitle: "Planning a community event?",
    hostBody: "Invite Indi Radio to broadcast live from your mela, cultural night or grand opening, or book Indi Jaswal as your host and MC.",
    hostCta: "Book Indi for your event",
  },
  pa: {
    h1: "ਭਾਈਚਾਰਕ ਸਮਾਗਮ ਅਤੇ ਲਾਈਵ ਪ੍ਰਸਾਰਣ",
    lead: "ਮੇਲੇ, ਸੱਭਿਆਚਾਰਕ ਸ਼ਾਮਾਂ, ਫ਼ੰਡਰੇਜ਼ਰ ਅਤੇ ਲਾਈਵ ਪ੍ਰਸਾਰਣ: ਇੰਡੀ ਰੇਡੀਓ ਨੂੰ ਭਾਈਚਾਰੇ ਵਿੱਚ ਮਿਲੋ, ਸਰੀ ਤੋਂ ਲੈ ਕੇ ਉੱਥੇ ਤੱਕ ਜਿੱਥੇ ਵੀ ਪੰਜਾਬੀ ਪਰਿਵਾਰ ਇਕੱਠੇ ਹੁੰਦੇ ਹਨ।",
    upcoming: "ਆਉਣ ਵਾਲੇ",
    past: "ਪਿਛਲੇ ਸਮਾਗਮ",
    live: "ਲਾਈਵ ਪ੍ਰਸਾਰਣ",
    none: "ਇਸ ਵੇਲੇ ਕੋਈ ਆਉਣ ਵਾਲਾ ਸਮਾਗਮ ਸੂਚੀ ਵਿੱਚ ਨਹੀਂ ਹੈ। ਅਗਲੇ ਸਮਾਗਮ ਦੀ ਖ਼ਬਰ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਸੁਣਨ ਲਈ WhatsApp ਚੈਨਲ ਜੁਆਇਨ ਕਰੋ।",
    hostTitle: "ਭਾਈਚਾਰਕ ਸਮਾਗਮ ਕਰ ਰਹੇ ਹੋ?",
    hostBody: "ਆਪਣੇ ਮੇਲੇ, ਸੱਭਿਆਚਾਰਕ ਸ਼ਾਮ ਜਾਂ ਉਦਘਾਟਨ ਤੋਂ ਲਾਈਵ ਪ੍ਰਸਾਰਣ ਲਈ ਇੰਡੀ ਰੇਡੀਓ ਨੂੰ ਸੱਦੋ, ਜਾਂ ਇੰਡੀ ਜਸਵਾਲ ਨੂੰ ਹੋਸਟ ਅਤੇ MC ਵਜੋਂ ਬੁੱਕ ਕਰੋ।",
    hostCta: "ਆਪਣੇ ਸਮਾਗਮ ਲਈ ਇੰਡੀ ਨੂੰ ਬੁੱਕ ਕਰੋ",
  },
};

function EventCard({ ev, locale, m, liveLabel }: { ev: CommunityEvent; locale: Locale; m: ReturnType<typeof getMessages>; liveLabel: string }) {
  const start = new Date(ev.start);
  const end = new Date(ev.end);
  return (
    <article id={ev.slug} className="reveal card grid overflow-hidden md:grid-cols-[240px_1fr]">
      <div className="relative aspect-video bg-surface-2 md:aspect-auto">
        {ev.image ? <Image src={ev.image} alt={t(ev.title, locale)} fill sizes="(min-width: 768px) 240px, 100vw" className="object-cover" /> : <div className="phulkari size-full" />}
      </div>
      <div className="p-6">
        {ev.liveBroadcast ? (
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-live px-3 py-1 text-xs font-extrabold text-on-live uppercase">
            <span className="size-2 rounded-full bg-white" aria-hidden="true" /> {liveLabel}
          </p>
        ) : null}
        <h3 className="text-xl font-extrabold">{t(ev.title, locale)}</h3>
        <p className="mt-2 flex items-center gap-2 font-semibold">
          <CalendarIcon size={18} className="text-saffron" />
          <time dateTime={ev.start}>
            {formatDate(start, STATION_TZ, locale)} · {formatTime(start, STATION_TZ, locale)}–{formatTime(end, STATION_TZ, locale)} PT
          </time>
        </p>
        <p className="mt-1 flex items-center gap-2 text-muted">
          <PinIcon size={18} /> {ev.venue}, {ev.city}
        </p>
        <p className="mt-3">{t(ev.description, locale)}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {ev.mapUrl ? (
            <a href={ev.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              {m.cta.getDirections}
            </a>
          ) : null}
          {ev.ticketUrl ? (
            <a href={ev.ticketUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {m.cta.tickets}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const events = await getEvents();
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.end).getTime() >= now);
  const past = events.filter((e) => new Date(e.end).getTime() < now).reverse().slice(0, 6);

  return (
    <>
      <JsonLd data={graph(upcoming.map((e) => eventNode(e, locale)))} />
      <PageHeader locale={locale} m={m} crumbs={[{ name: m.nav.events, path: PAGES.events.path }]} title={c.h1} lead={c.lead} />
      <Section id="upcoming" title={c.upcoming}>
        {upcoming.length ? (
          <div className="grid gap-6">
            {upcoming.map((ev) => (
              <EventCard key={ev.slug} ev={ev} locale={locale} m={m} liveLabel={c.live} />
            ))}
          </div>
        ) : (
          <p className="card p-6 text-muted">{c.none}</p>
        )}
      </Section>
      {past.length ? (
        <Section id="past" title={c.past}>
          <div className="grid gap-6 opacity-90">
            {past.map((ev) => (
              <EventCard key={ev.slug} ev={ev} locale={locale} m={m} liveLabel={c.live} />
            ))}
          </div>
        </Section>
      ) : null}
      <Section>
        <div className="card phulkari p-6 md:p-10">
          <h2 className="display-md">{c.hostTitle}</h2>
          <p className="mt-3 max-w-2xl text-muted">{c.hostBody}</p>
          <Link href={`/${locale}/indi-jaswal#book`} className="btn btn-primary mt-6">
            {c.hostCta}
          </Link>
        </div>
      </Section>
    </>
  );
}
