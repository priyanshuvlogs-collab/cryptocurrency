import type { Metadata } from "next";
import { EpisodeBrowser } from "@/components/sections/EpisodeBrowser";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader, Section } from "@/components/ui/Page";
import { YouTubeIcon } from "@/components/ui/Icons";
import { getSettings, getShows } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { graph, videoNode } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/lib/site";
import { getEpisodes } from "@/lib/youtube";
import type { Locale } from "@/lib/types";

export const revalidate = 1800;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("episodes", (await params).locale);
}

const COPY = {
  en: {
    h1: "Episodes & clips",
    lead: "Missed a show? Replay Bhedan Da Kaal and the best moments from Indi Radio. New videos appear here automatically from the Indi Radio YouTube channel.",
    channel: "Open the YouTube channel",
  },
  pa: {
    h1: "ਐਪੀਸੋਡ ਅਤੇ ਕਲਿੱਪ",
    lead: "ਕੋਈ ਸ਼ੋਅ ਖੁੰਝ ਗਿਆ? ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਅਤੇ ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਸਭ ਤੋਂ ਵਧੀਆ ਪਲ ਦੁਬਾਰਾ ਦੇਖੋ। ਇੰਡੀ ਰੇਡੀਓ ਦੇ YouTube ਚੈਨਲ ਤੋਂ ਨਵੀਆਂ ਵੀਡੀਓ ਇੱਥੇ ਆਪਣੇ-ਆਪ ਆ ਜਾਂਦੀਆਂ ਹਨ।",
    channel: "YouTube ਚੈਨਲ ਖੋਲ੍ਹੋ",
  },
};

export default async function EpisodesPage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const [settings, shows] = await Promise.all([getSettings(), getShows()]);
  const episodes = await getEpisodes(settings.youtubeChannelId, shows);
  const showsWithEpisodes = shows.filter((s) => episodes.some((e) => e.showSlug === s.slug));

  return (
    <>
      <JsonLd data={graph(episodes.slice(0, 12).map(videoNode))} />
      <PageHeader locale={locale} m={m} crumbs={[{ name: m.nav.episodes, path: PAGES.episodes.path }]} title={c.h1} lead={c.lead}>
        {settings.socials.youtube ? (
          <a href={settings.socials.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6">
            <YouTubeIcon /> {c.channel}
          </a>
        ) : null}
      </PageHeader>
      <Section>
        <EpisodeBrowser episodes={episodes} shows={showsWithEpisodes.map((s) => ({ slug: s.slug, name: t(s.name, locale) }))} />
      </Section>
    </>
  );
}
