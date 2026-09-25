import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader, Section } from "@/components/ui/Page";
import { ArrowRightIcon, PhoneIcon } from "@/components/ui/Icons";
import { getSchedule, getShows } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { graph, itemListNode } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, t } from "@/lib/site";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("shows", (await params).locale);
}

const COPY = {
  en: {
    h1: "Shows on Indi Radio",
    lead: "Live Punjabi talk, call-ins and music from Surrey, BC. Start with Bhedan Da Kaal, Indi Jaswal’s flagship call-in show.",
    flagship: "Flagship show",
    weekly: (n: number) => `${n} live ${n === 1 ? "show" : "shows"} a week`,
  },
  pa: {
    h1: "ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਸ਼ੋਅ",
    lead: "ਸਰੀ, ਬੀ.ਸੀ. ਤੋਂ ਲਾਈਵ ਪੰਜਾਬੀ ਗੱਲਬਾਤ, ਕਾਲ-ਇਨ ਅਤੇ ਸੰਗੀਤ। ਸ਼ੁਰੂਆਤ ਕਰੋ ਇੰਡੀ ਜਸਵਾਲ ਦੇ ਮੁੱਖ ਕਾਲ-ਇਨ ਸ਼ੋਅ ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਨਾਲ।",
    flagship: "ਮੁੱਖ ਸ਼ੋਅ",
    weekly: (n: number) => `ਹਫ਼ਤੇ ਵਿੱਚ ${n} ਲਾਈਵ ਸ਼ੋਅ`,
  },
};

export default async function ShowsPage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const [shows, slots] = await Promise.all([getShows(), getSchedule()]);

  return (
    <>
      <JsonLd
        data={graph(itemListNode(shows.map((s) => ({ name: t(s.name, locale), url: absoluteUrl(`/${locale}/shows/${s.slug}`) }))))}
      />
      <PageHeader locale={locale} m={m} crumbs={[{ name: m.nav.shows, path: PAGES.shows.path }]} title={c.h1} lead={c.lead} />
      <Section>
        <ul className="grid gap-6 md:grid-cols-2">
          {shows.map((show) => {
            const count = slots.filter((s) => s.showSlug === show.slug).length;
            return (
              <li key={show.slug} className={`reveal card phulkari flex flex-col overflow-hidden p-6 md:p-8 ${show.featured ? "md:col-span-2" : ""}`}>
                {show.featured ? <p className="eyebrow">{c.flagship}</p> : null}
                <h2 className="display-md mt-1">
                  <Link href={`/${locale}/shows/${show.slug}`} className="hover:text-saffron">
                    {t(show.name, locale)}
                  </Link>
                </h2>
                {show.nativeName && locale === "en" ? (
                  <p lang="pa" className="mt-1 font-display text-xl text-gold">
                    {show.nativeName}
                  </p>
                ) : null}
                <p className="mt-3 max-w-2xl flex-1 text-lg text-muted">{t(show.tagline, locale)}</p>
                <p className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold">
                  <span>
                    {m.player.withHost} {show.host}
                  </span>
                  {count ? <span className="rounded-full bg-surface-2 px-3 py-1">{c.weekly(count)}</span> : null}
                  {show.callIn ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-live px-3 py-1 text-on-live">
                      <PhoneIcon size={14} /> {m.nav.callIn}
                    </span>
                  ) : null}
                </p>
                <Link href={`/${locale}/shows/${show.slug}`} className="btn btn-ghost mt-6 w-fit">
                  {m.cta.viewShow} <ArrowRightIcon size={18} />
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
