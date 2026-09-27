import Link from "next/link";
import type { Metadata } from "next";
import { LiveHero } from "@/components/sections/Hero";
import { EpisodeGrid, JoinSection, SocialStrip, SponsorStrip } from "@/components/sections/Shared";
import { NextShowCountdown } from "@/components/player/PlayerControls";
import { WorldClocks } from "@/components/player/WorldClocks";
import { Section } from "@/components/ui/Page";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { getSettings, getShows, getSocialPosts, getSponsors } from "@/lib/cms";
import { getMessages } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getAllEpisodes } from "@/lib/episodes";
import type { Locale } from "@/lib/types";

export const revalidate = 300;

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("home", locale);
}

const COPY = {
  en: {
    callTitle: "Your voice on air",
    callBody: "During live shows the phone lines are open. Share your view, your story or a shout-out, and keep it family-friendly.",
    tzTitle: "Never miss a show",
    tzBody: "Every show time converts automatically to Vancouver, India, UK or Australia time, or wherever you are.",
    clipsEyebrow: "Replay",
    clipsTitle: "Latest clips & episodes",
    exploreEyebrow: "Explore",
    exploreTitle: "Everything on Indi Radio",
    explore: [
      ["/schedule", "Weekly schedule", "Every show, in your own time zone."],
      ["/shows", "Our shows", "Bhedan Da Kaal, Punjabi music and more."],
      ["/call-in", "Call in live", "How to get on air during the live shows."],
      ["/dedications", "Dedications", "Birthday, anniversary and festival shout-outs."],
      ["/song-request", "Request a song", "Ask for your favourite Punjabi song."],
      ["/events", "Events", "Community events and live broadcasts."],
      ["/advertise", "Advertise with us", "Reach Punjabi families in Surrey and beyond."],
      ["/indi-jaswal", "Meet Indi Jaswal", "The founder and voice of Indi Radio."],
    ] as [string, string, string][],
    factsEyebrow: "At a glance",
    factsTitle: "Indi Radio in 30 seconds",
    facts: [
      ["What", "A live Punjabi online radio station: call-in talk shows, Punjabi music, culture and community conversation."],
      ["Who", "Founded and hosted by Indi Jaswal. The flagship show is the live call-in Bhedan Da Kaal."],
      ["Where", "Broadcasting from Surrey, British Columbia, Canada, to listeners in Canada, India, the UK, Australia, the USA and Dubai."],
      ["How to listen", "Press Listen Live on this website, use the free iPhone or Android app, or watch live on TikTok, YouTube and Facebook."],
      ["Cost", "Free to listen. Dedications and advertising are optional paid services."],
    ],
  },
  pa: {
    callTitle: "ਤੁਹਾਡੀ ਆਵਾਜ਼, ਆਨ-ਏਅਰ",
    callBody: "ਲਾਈਵ ਸ਼ੋਆਂ ਦੌਰਾਨ ਫ਼ੋਨ ਲਾਈਨਾਂ ਖੁੱਲ੍ਹੀਆਂ ਹੁੰਦੀਆਂ ਹਨ। ਆਪਣੇ ਵਿਚਾਰ, ਆਪਣੀ ਕਹਾਣੀ ਜਾਂ ਸ਼ਾਊਟ-ਆਊਟ ਸਾਂਝਾ ਕਰੋ, ਅਤੇ ਗੱਲ ਪਰਿਵਾਰ ਨਾਲ ਸੁਣਨ ਯੋਗ ਰੱਖੋ।",
    tzTitle: "ਕੋਈ ਸ਼ੋਅ ਨਾ ਖੁੰਝੇ",
    tzBody: "ਹਰ ਸ਼ੋਅ ਦਾ ਸਮਾਂ ਆਪਣੇ-ਆਪ ਵੈਨਕੂਵਰ, ਭਾਰਤ, ਯੂ.ਕੇ. ਜਾਂ ਆਸਟ੍ਰੇਲੀਆ ਦੇ ਸਮੇਂ ਵਿੱਚ ਬਦਲ ਜਾਂਦਾ ਹੈ, ਜਾਂ ਜਿੱਥੇ ਵੀ ਤੁਸੀਂ ਹੋ।",
    clipsEyebrow: "ਦੁਬਾਰਾ ਸੁਣੋ",
    clipsTitle: "ਨਵੇਂ ਕਲਿੱਪ ਅਤੇ ਐਪੀਸੋਡ",
    exploreEyebrow: "ਹੋਰ ਦੇਖੋ",
    exploreTitle: "ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਸਭ ਕੁਝ",
    explore: [
      ["/schedule", "ਹਫ਼ਤੇ ਦੀ ਸਮਾਂ-ਸੂਚੀ", "ਹਰ ਸ਼ੋਅ, ਤੁਹਾਡੇ ਆਪਣੇ ਸਮੇਂ ਵਿੱਚ।"],
      ["/shows", "ਸਾਡੇ ਸ਼ੋਅ", "‘ਭੇਡਾਂ ਦਾ ਕਾਲ’, ਪੰਜਾਬੀ ਸੰਗੀਤ ਅਤੇ ਹੋਰ ਬਹੁਤ ਕੁਝ।"],
      ["/call-in", "ਲਾਈਵ ਕਾਲ ਕਰੋ", "ਲਾਈਵ ਸ਼ੋਅ ਦੌਰਾਨ ਆਨ-ਏਅਰ ਕਿਵੇਂ ਆਈਏ।"],
      ["/dedications", "ਸੁਨੇਹੇ ਤੇ ਸ਼ਾਊਟ-ਆਊਟ", "ਜਨਮਦਿਨ, ਵਰ੍ਹੇਗੰਢ ਅਤੇ ਤਿਉਹਾਰਾਂ ਦੇ ਸੁਨੇਹੇ।"],
      ["/song-request", "ਗੀਤ ਦੀ ਫ਼ਰਮਾਇਸ਼", "ਆਪਣਾ ਮਨਪਸੰਦ ਪੰਜਾਬੀ ਗੀਤ ਮੰਗਵਾਓ।"],
      ["/events", "ਸਮਾਗਮ", "ਭਾਈਚਾਰੇ ਦੇ ਸਮਾਗਮ ਅਤੇ ਲਾਈਵ ਪ੍ਰਸਾਰਣ।"],
      ["/advertise", "ਸਾਡੇ ਨਾਲ ਮਸ਼ਹੂਰੀ ਕਰੋ", "ਸਰੀ ਅਤੇ ਹੋਰ ਥਾਵਾਂ ਦੇ ਪੰਜਾਬੀ ਪਰਿਵਾਰਾਂ ਤੱਕ ਪਹੁੰਚੋ।"],
      ["/indi-jaswal", "ਇੰਡੀ ਜਸਵਾਲ ਨੂੰ ਮਿਲੋ", "ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਬਾਨੀ ਅਤੇ ਆਵਾਜ਼।"],
    ] as [string, string, string][],
    factsEyebrow: "ਇੱਕ ਨਜ਼ਰ ਵਿੱਚ",
    factsTitle: "30 ਸਕਿੰਟਾਂ ਵਿੱਚ ਇੰਡੀ ਰੇਡੀਓ",
    facts: [
      ["ਕੀ", "ਲਾਈਵ ਪੰਜਾਬੀ ਆਨਲਾਈਨ ਰੇਡੀਓ ਸਟੇਸ਼ਨ: ਕਾਲ-ਇਨ ਸ਼ੋਅ, ਪੰਜਾਬੀ ਸੰਗੀਤ, ਸੱਭਿਆਚਾਰ ਅਤੇ ਭਾਈਚਾਰੇ ਦੀ ਗੱਲਬਾਤ।"],
      ["ਕੌਣ", "ਇੰਡੀ ਜਸਵਾਲ ਵੱਲੋਂ ਸ਼ੁਰੂ ਕੀਤਾ ਅਤੇ ਚਲਾਇਆ ਜਾਂਦਾ। ਮੁੱਖ ਸ਼ੋਅ ਹੈ ਲਾਈਵ ਕਾਲ-ਇਨ ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’।"],
      ["ਕਿੱਥੋਂ", "ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ, ਕੈਨੇਡਾ ਤੋਂ, ਕੈਨੇਡਾ, ਭਾਰਤ, ਯੂ.ਕੇ., ਆਸਟ੍ਰੇਲੀਆ, ਅਮਰੀਕਾ ਅਤੇ ਦੁਬਈ ਦੇ ਸਰੋਤਿਆਂ ਲਈ।"],
      ["ਕਿਵੇਂ ਸੁਣੀਏ", "ਇਸ ਵੈੱਬਸਾਈਟ ’ਤੇ ‘ਲਾਈਵ ਸੁਣੋ’ ਦਬਾਓ, ਮੁਫ਼ਤ iPhone ਜਾਂ Android ਐਪ ਵਰਤੋ, ਜਾਂ TikTok, YouTube ਅਤੇ Facebook ’ਤੇ ਲਾਈਵ ਦੇਖੋ।"],
      ["ਖ਼ਰਚਾ", "ਸੁਣਨਾ ਮੁਫ਼ਤ ਹੈ। ਸੁਨੇਹੇ ਅਤੇ ਮਸ਼ਹੂਰੀ ਮਰਜ਼ੀ ਨਾਲ ਲਈਆਂ ਜਾਣ ਵਾਲੀਆਂ ਪੇਡ ਸੇਵਾਵਾਂ ਹਨ।"],
    ],
  },
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const [settings, shows, sponsors, posts] = await Promise.all([
    getSettings(),
    getShows(),
    getSponsors(),
    getSocialPosts(),
  ]);
  const episodes = await getAllEpisodes(settings.youtubeChannelId, shows);

  return (
    <>
      <LiveHero locale={locale} m={m} settings={settings} />

      <section aria-label={m.countdown.nextShow} className="container-ir py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x-2 md:divide-fg">
          <div className="reveal md:pr-8">
            <NextShowCountdown />
          </div>
          <div className="reveal flex flex-col md:px-8">
            <p className="eyebrow">{c.callTitle}</p>
            <a href={`tel:${settings.phoneE164}`} className="mt-3 font-display text-[3.4rem] leading-none font-black tabular-nums hover:text-accent">
              {settings.phoneDisplay}
            </a>
            <p className="mt-4 flex-1 text-muted">{c.callBody}</p>
            <Link href={`/${locale}/call-in`} className="link mt-4 inline-flex items-center gap-1">
              {m.nav.callIn} <ArrowRightIcon size={16} />
            </Link>
          </div>
          <div className="reveal flex flex-col md:pl-8">
            <p className="eyebrow mb-4">{c.tzTitle}</p>
            <WorldClocks />
            <Link href={`/${locale}/schedule`} className="link mt-6 inline-flex items-center gap-1">
              {m.cta.seeSchedule} <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Section
        id="clips"
        eyebrow={c.clipsEyebrow}
        title={c.clipsTitle}
        action={
          <Link href={`/${locale}/episodes`} className="btn btn-ghost">
            {m.cta.allEpisodes} <ArrowRightIcon size={18} />
          </Link>
        }
      >
        <EpisodeGrid episodes={episodes.slice(0, 6)} locale={locale} m={m} />
      </Section>

      <Section id="explore" eyebrow={c.exploreEyebrow} title={c.exploreTitle}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.explore.map(([path, title, body]) => (
            <li key={path}>
              <Link
                href={`/${locale}${path}`}
                className="reveal group flex h-full flex-col rounded-md border-2 border-fg bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--fg)]"
              >
                <span className="flex items-start justify-between gap-3 font-display text-2xl leading-none font-extrabold uppercase group-hover:text-accent">
                  {title} <ArrowRightIcon size={20} className="shrink-0" />
                </span>
                <span className="mt-3 text-muted">{body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <SponsorStrip sponsors={sponsors} locale={locale} m={m} />

      <Section id="facts" eyebrow={c.factsEyebrow} title={c.factsTitle}>
        <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {c.facts.map(([term, def], i) => (
            <li key={term} className="reveal border-t-2 border-fg pt-4">
              <p className="font-display text-6xl leading-none font-black text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="meta mt-4">{term}</h3>
              <p className="mt-2">{def}</p>
            </li>
          ))}
        </ol>
      </Section>

      <JoinSection settings={settings} locale={locale} m={m} />
      <SocialStrip posts={posts} episodes={episodes} settings={settings} m={m} />
    </>
  );
}
