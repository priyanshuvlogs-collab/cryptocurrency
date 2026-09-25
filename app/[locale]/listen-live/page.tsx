import type { Metadata } from "next";
import Link from "next/link";
import { Disc } from "@/components/player/Disc";
import { NextShowCountdown, NowPlaying, OnAirBadge, PlayButton, PlayerStatusText, VolumeControl, Waveform } from "@/components/player/PlayerControls";
import { WatchLiveInline } from "@/components/player/LiveStatus";
import { PageHeader, Section } from "@/components/ui/Page";
import { AppBadges } from "@/components/ui/AppBadges";
import { AppleIcon, FacebookIcon, GlobeIcon, GooglePlayIcon, MicIcon, PhoneIcon, TikTokIcon, YouTubeIcon } from "@/components/ui/Icons";
import { getFaqs, getSettings } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/lib/site";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("listenLive", (await params).locale);
}

const COPY = {
  en: {
    h1: "Listen to Indi Radio live",
    lead: "Press play and Indi Radio starts streaming straight away, free, on any phone, tablet or computer. The player keeps going while you browse the rest of the site.",
    waysTitle: "All the ways to listen",
    ways: {
      web: ["On this website", "Works in Safari, Chrome, Edge and Firefox. Tap Listen Live, no sign-up needed."],
      ios: ["iPhone & iPad app", "The official Indi Radio app from the App Store. Plays in the background and on the lock screen."],
      android: ["Android app", "The official Indi Radio app on Google Play for Android phones and tablets."],
      tiktok: ["TikTok LIVE", "Watch Indi Jaswal live on TikTok and join the chat. A red badge appears on this site when Indi is live."],
      youtube: ["YouTube", "Live streams and replays of shows and clips on the Indi Radio YouTube channel."],
      facebook: ["Facebook", "Follow Indi Radio on Facebook for live video and community updates."],
      smart: ["Smart speakers", "Alexa and TuneIn listening details are being confirmed. [CONFIRM TuneIn / Alexa listing]"],
    },
    troubleTitle: "Player not working?",
    trouble: [
      "Tap Listen Live once and wait a few seconds: live radio needs a moment to connect.",
      "On iPhone, check the ring/silent switch and the volume; the stream plays through the media volume.",
      "On mobile data, a weak signal can pause the stream. The player reconnects automatically.",
      "Still silent? Try the free Indi Radio app, or send us a WhatsApp message and we’ll help.",
    ],
    callTitle: "Want to be on air?",
    callBody: "During live shows, call the studio line and talk to Indi Jaswal.",
  },
  pa: {
    h1: "ਇੰਡੀ ਰੇਡੀਓ ਲਾਈਵ ਸੁਣੋ",
    lead: "ਪਲੇਅ ਦਬਾਓ ਅਤੇ ਇੰਡੀ ਰੇਡੀਓ ਤੁਰੰਤ ਚੱਲ ਪੈਂਦਾ ਹੈ, ਮੁਫ਼ਤ, ਕਿਸੇ ਵੀ ਫ਼ੋਨ, ਟੈਬਲੈੱਟ ਜਾਂ ਕੰਪਿਊਟਰ ’ਤੇ। ਵੈੱਬਸਾਈਟ ਦੇ ਹੋਰ ਪੰਨੇ ਦੇਖਦਿਆਂ ਵੀ ਰੇਡੀਓ ਚੱਲਦਾ ਰਹਿੰਦਾ ਹੈ।",
    waysTitle: "ਸੁਣਨ ਦੇ ਸਾਰੇ ਤਰੀਕੇ",
    ways: {
      web: ["ਇਸ ਵੈੱਬਸਾਈਟ ’ਤੇ", "Safari, Chrome, Edge ਅਤੇ Firefox ਵਿੱਚ ਚੱਲਦਾ ਹੈ। ‘ਲਾਈਵ ਸੁਣੋ’ ਦਬਾਓ, ਕੋਈ ਸਾਈਨ-ਅੱਪ ਨਹੀਂ।"],
      ios: ["iPhone ਅਤੇ iPad ਐਪ", "App Store ਤੋਂ ਅਧਿਕਾਰਤ ਇੰਡੀ ਰੇਡੀਓ ਐਪ। ਫ਼ੋਨ ਲਾਕ ਹੋਣ ’ਤੇ ਵੀ ਚੱਲਦੀ ਰਹਿੰਦੀ ਹੈ।"],
      android: ["Android ਐਪ", "Android ਫ਼ੋਨਾਂ ਅਤੇ ਟੈਬਲੈੱਟਾਂ ਲਈ Google Play ’ਤੇ ਅਧਿਕਾਰਤ ਇੰਡੀ ਰੇਡੀਓ ਐਪ।"],
      tiktok: ["TikTok LIVE", "ਇੰਡੀ ਜਸਵਾਲ ਨੂੰ TikTok ’ਤੇ ਲਾਈਵ ਦੇਖੋ ਅਤੇ ਚੈਟ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ। ਇੰਡੀ ਲਾਈਵ ਹੋਣ ’ਤੇ ਇਸ ਸਾਈਟ ’ਤੇ ਲਾਲ ਬਟਨ ਆ ਜਾਂਦਾ ਹੈ।"],
      youtube: ["YouTube", "ਇੰਡੀ ਰੇਡੀਓ ਦੇ YouTube ਚੈਨਲ ’ਤੇ ਲਾਈਵ ਸਟ੍ਰੀਮ, ਸ਼ੋਆਂ ਦੇ ਰੀਪਲੇਅ ਅਤੇ ਕਲਿੱਪ।"],
      facebook: ["Facebook", "ਲਾਈਵ ਵੀਡੀਓ ਅਤੇ ਭਾਈਚਾਰੇ ਦੀਆਂ ਖ਼ਬਰਾਂ ਲਈ Facebook ’ਤੇ ਇੰਡੀ ਰੇਡੀਓ ਨੂੰ ਫ਼ਾਲੋ ਕਰੋ।"],
      smart: ["ਸਮਾਰਟ ਸਪੀਕਰ", "Alexa ਅਤੇ TuneIn ’ਤੇ ਸੁਣਨ ਦੀ ਜਾਣਕਾਰੀ ਪੱਕੀ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ। [CONFIRM TuneIn / Alexa listing]"],
    },
    troubleTitle: "ਪਲੇਅਰ ਨਹੀਂ ਚੱਲ ਰਿਹਾ?",
    trouble: [
      "‘ਲਾਈਵ ਸੁਣੋ’ ਇੱਕ ਵਾਰ ਦਬਾਓ ਅਤੇ ਕੁਝ ਸਕਿੰਟ ਉਡੀਕ ਕਰੋ: ਲਾਈਵ ਰੇਡੀਓ ਨੂੰ ਜੁੜਨ ਵਿੱਚ ਥੋੜ੍ਹਾ ਸਮਾਂ ਲੱਗਦਾ ਹੈ।",
      "iPhone ’ਤੇ ਸਾਈਲੈਂਟ ਸਵਿੱਚ ਅਤੇ ਆਵਾਜ਼ ਦੇਖੋ; ਸਟ੍ਰੀਮ ਮੀਡੀਆ ਵਾਲੀ ਆਵਾਜ਼ ’ਤੇ ਚੱਲਦੀ ਹੈ।",
      "ਮੋਬਾਈਲ ਡਾਟਾ ’ਤੇ ਕਮਜ਼ੋਰ ਸਿਗਨਲ ਨਾਲ ਸਟ੍ਰੀਮ ਰੁਕ ਸਕਦੀ ਹੈ। ਪਲੇਅਰ ਆਪਣੇ-ਆਪ ਦੁਬਾਰਾ ਜੁੜ ਜਾਂਦਾ ਹੈ।",
      "ਫਿਰ ਵੀ ਆਵਾਜ਼ ਨਹੀਂ? ਮੁਫ਼ਤ ਇੰਡੀ ਰੇਡੀਓ ਐਪ ਵਰਤੋ, ਜਾਂ ਸਾਨੂੰ WhatsApp ਸੁਨੇਹਾ ਭੇਜੋ, ਅਸੀਂ ਮਦਦ ਕਰਾਂਗੇ।",
    ],
    callTitle: "ਆਨ-ਏਅਰ ਆਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    callBody: "ਲਾਈਵ ਸ਼ੋਆਂ ਦੌਰਾਨ ਸਟੂਡੀਓ ਲਾਈਨ ’ਤੇ ਕਾਲ ਕਰੋ ਅਤੇ ਇੰਡੀ ਜਸਵਾਲ ਨਾਲ ਗੱਲ ਕਰੋ।",
  },
};

export default async function ListenLivePage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const [settings, faqs] = await Promise.all([getSettings(), getFaqs()]);
  const listeningFaqs = faqs.filter((f) => f.category === "listening").slice(0, 4);

  const ways = [
    { key: "web", Icon: GlobeIcon, href: null },
    { key: "ios", Icon: AppleIcon, href: settings.appStoreUrl },
    { key: "android", Icon: GooglePlayIcon, href: settings.playStoreUrl },
    { key: "tiktok", Icon: TikTokIcon, href: settings.socials.tiktok },
    { key: "youtube", Icon: YouTubeIcon, href: settings.socials.youtube },
    { key: "facebook", Icon: FacebookIcon, href: settings.socials.facebook },
    { key: "smart", Icon: MicIcon, href: settings.tuneInUrl },
  ] as const;

  return (
    <>
      <PageHeader locale={locale} m={m} crumbs={[{ name: m.nav.listenLive, path: PAGES.listenLive.path }]} title={c.h1} lead={c.lead} />

      <section aria-label={m.player.miniPlayer} className="container-ir py-10">
        <div className="band-ink grid items-center gap-10 overflow-hidden rounded-md p-6 md:p-10 lg:grid-cols-[380px_1fr]">
          <div className="mx-auto w-full max-w-[380px]">
            <Disc />
          </div>
          <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <OnAirBadge />
            <VolumeControl />
          </div>
          <div className="mt-6 grid items-end gap-8 border-y border-line py-6 lg:grid-cols-[1fr_auto]">
            <NowPlaying />
            <Waveform className="h-16" />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <PlayButton />
            <a href={`tel:${settings.phoneE164}`} className="btn btn-live btn-lg">
              <PhoneIcon size={22} /> {m.cta.callIn} {settings.phoneDisplay}
            </a>
          </div>
          <PlayerStatusText className="mt-3" />
          <div className="mt-4">
            <WatchLiveInline />
          </div>
          </div>
        </div>
        <div className="mt-10">
          <NextShowCountdown />
        </div>
      </section>

      <Section id="ways" title={c.waysTitle}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ways.map(({ key, Icon, href }) => {
            const [title, body] = c.ways[key];
            return (
              <li key={key} className="reveal card p-6">
                <Icon size={28} className="text-accent" />
                <h3 className="mt-3 text-lg font-extrabold">
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                      {title}
                    </a>
                  ) : (
                    title
                  )}
                </h3>
                <p className="mt-1 text-muted">{body}</p>
              </li>
            );
          })}
        </ul>
        <AppBadges appStoreUrl={settings.appStoreUrl} playStoreUrl={settings.playStoreUrl} m={m} className="mt-8" />
      </Section>

      <Section id="help" title={c.troubleTitle}>
        <div className="grid gap-8 lg:grid-cols-2">
          <ol className="prose-ir list-decimal pl-5">
            {c.trouble.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ol>
          <div className="space-y-4">
            {listeningFaqs.map((f) => (
              <details key={f.id} className="card p-5">
                <summary className="cursor-pointer font-bold">{t(f.q, locale)}</summary>
                <p className="mt-3 text-muted">{t(f.a, locale)}</p>
              </details>
            ))}
            <Link href={`/${locale}/faq`} className="link">
              {m.nav.faq}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
