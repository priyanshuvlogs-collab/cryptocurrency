import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScheduleGrid } from "@/components/sections/ScheduleGrid";
import { EpisodeGrid } from "@/components/sections/Shared";
import { PlayButton } from "@/components/player/PlayerControls";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader, Section } from "@/components/ui/Page";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { getSchedule, getSettings, getShow, getShows } from "@/lib/cms";
import { getMessages } from "@/lib/i18n";
import { broadcastNodes, graph, seriesNode, videoNode } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { t, whatsappLink } from "@/lib/site";
import { thisWeek } from "@/lib/time";
import { getAllEpisodes } from "@/lib/episodes";
import { LOCALES, type Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateStaticParams() {
  const shows = await getShows();
  return LOCALES.flatMap((locale) => shows.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const show = await getShow(slug);
  if (!show) return {};
  const name = t(show.name, locale);
  return buildMetadata({
    locale,
    path: `/shows/${slug}`,
    title:
      locale === "pa"
        ? `${name} – ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਲਾਈਵ | ${show.host === "Indi Jaswal" ? "ਇੰਡੀ ਜਸਵਾਲ" : show.host}`
        : `${name} – Live on Indi Radio | ${show.host}`,
    description: t(show.tagline, locale).slice(0, 158),
    ogHeading: show.name.en,
  });
}

const COPY = {
  en: { when: "When it’s on", about: "About the show", clips: "Clips & episodes", callTitle: "Call in to the show", callBody: "Lines open when the show goes live." },
  pa: { when: "ਕਦੋਂ ਆਉਂਦਾ ਹੈ", about: "ਸ਼ੋਅ ਬਾਰੇ", clips: "ਕਲਿੱਪ ਅਤੇ ਐਪੀਸੋਡ", callTitle: "ਸ਼ੋਅ ਵਿੱਚ ਕਾਲ ਕਰੋ", callBody: "ਸ਼ੋਅ ਲਾਈਵ ਹੁੰਦੇ ਹੀ ਲਾਈਨਾਂ ਖੁੱਲ੍ਹ ਜਾਂਦੀਆਂ ਹਨ।" },
};

export default async function ShowPage({ params }: Props) {
  const { locale, slug } = await params;
  const show = await getShow(slug);
  if (!show) notFound();
  const m = getMessages(locale);
  const c = COPY[locale];
  const [slots, shows, settings] = await Promise.all([getSchedule(), getShows(), getSettings()]);
  const episodes = (await getAllEpisodes(settings.youtubeChannelId, shows)).filter((e) => e.showSlug === slug).slice(0, 6);
  const showSlots = slots.filter((s) => s.showSlug === slug);
  const now = Date.now();
  const summaries = shows.map(({ slug: s, name, host, callIn }) => ({ slug: s, name, host, callIn }));

  return (
    <>
      <JsonLd
        data={graph(seriesNode(show, locale), broadcastNodes(thisWeek(showSlots, new Date(now)), shows, locale), episodes.map(videoNode))}
      />
      <PageHeader
        locale={locale}
        m={m}
        crumbs={[
          { name: m.nav.shows, path: "/shows" },
          { name: t(show.name, locale), path: `/shows/${slug}` },
        ]}
        eyebrow={`${m.player.withHost} ${show.host}`}
        title={
          <>
            {t(show.name, locale)}
            {show.nativeName && locale === "en" ? (
              <span lang="pa" className="mt-2 block text-[0.6em] text-gold">
                {show.nativeName}
              </span>
            ) : null}
          </>
        }
        lead={t(show.tagline, locale)}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <PlayButton />
          {show.callIn ? (
            <a href={`tel:${settings.phoneE164}`} className="btn btn-live btn-lg">
              <PhoneIcon size={22} /> {m.cta.callIn}
            </a>
          ) : null}
        </div>
      </PageHeader>

      <Section id="about" title={c.about}>
        <div className="prose-ir text-lg">
          {show.description.map((p, i) => (
            <p key={i}>{t(p, locale)}</p>
          ))}
        </div>
      </Section>

      {showSlots.length ? (
        <Section id="when" title={c.when}>
          <ScheduleGrid slots={slots} shows={summaries} serverNow={now} showFilter={slug} />
        </Section>
      ) : null}

      <Section id="clips" title={c.clips}>
        <EpisodeGrid episodes={episodes} locale={locale} m={m} />
      </Section>

      {show.callIn ? (
        <Section>
          <div className="card flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <h2 className="display-md">{c.callTitle}</h2>
              <p className="mt-2 text-muted">{c.callBody}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${settings.phoneE164}`} className="btn btn-live btn-lg">
                <PhoneIcon /> {settings.phoneDisplay}
              </a>
              <a href={whatsappLink(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <WhatsAppIcon /> {m.cta.whatsapp}
              </a>
            </div>
          </div>
        </Section>
      ) : null}
    </>
  );
}
