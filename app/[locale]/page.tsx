import Link from "next/link";
import type { Metadata } from "next";
import { LiveHero } from "@/components/sections/Hero";
import { EpisodeGrid, JoinSection, SocialStrip, SponsorStrip, TierCards } from "@/components/sections/Shared";
import { NextShowCountdown } from "@/components/player/PlayerControls";
import { WorldClocks } from "@/components/player/WorldClocks";
import { Section } from "@/components/ui/Page";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { getDedicationTiers, getSettings, getShows, getSocialPosts, getSponsors } from "@/lib/cms";
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
    dedEyebrow: "Dedications & shout-outs",
    dedTitle: "Make someone’s day, live on air",
    dedIntro: "Birthdays, anniversaries, weddings, festivals and grand openings: let Indi Jaswal share your message with Punjabi families around the world.",
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
    dedEyebrow: "ਸੁਨੇਹੇ ਅਤੇ ਸ਼ਾਊਟ-ਆਊਟ",
    dedTitle: "ਕਿਸੇ ਦਾ ਦਿਨ ਖ਼ਾਸ ਬਣਾਓ, ਲਾਈਵ ਆਨ-ਏਅਰ",
    dedIntro: "ਜਨਮਦਿਨ, ਵਰ੍ਹੇਗੰਢ, ਵਿਆਹ, ਤਿਉਹਾਰ ਅਤੇ ਨਵੇਂ ਕਾਰੋਬਾਰ ਦੀ ਸ਼ੁਰੂਆਤ: ਇੰਡੀ ਜਸਵਾਲ ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਦੁਨੀਆ ਭਰ ਦੇ ਪੰਜਾਬੀ ਪਰਿਵਾਰਾਂ ਤੱਕ ਪਹੁੰਚਾਉਣਗੇ।",
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
  const [settings, shows, tiers, sponsors, posts] = await Promise.all([
    getSettings(),
    getShows(),
    getDedicationTiers(),
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

      <Section id="dedications" eyebrow={c.dedEyebrow} title={c.dedTitle} intro={c.dedIntro}>
        <TierCards tiers={tiers} locale={locale} m={m} />
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
