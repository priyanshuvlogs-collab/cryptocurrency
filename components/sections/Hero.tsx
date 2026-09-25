import type { Messages } from "@/messages/en";
import type { Locale, SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/site";
import { Disc } from "@/components/player/Disc";
import { NowPlaying, PlayButton, PlayerStatusText, Waveform } from "@/components/player/PlayerControls";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { Ticker } from "./Ticker";

const COPY = {
  en: {
    kicker: ["On air", "Surrey, BC", "24/7"],
    fact: "Indi Radio is a live Punjabi online radio station from Surrey, British Columbia, hosted by Indi Jaswal. Call in, request a song, or just press play. It’s free, and it’s heard worldwide.",
    host: "Hosted by",
    ticker: ["On air now", "Live call-ins", "Bhedan Da Kaal", "Punjabi music 24/7", "Surrey · BC · Canada", "ਲਾਈਵ ਪੰਜਾਬੀ ਰੇਡੀਓ"],
    sticker: "Live call-in",
    dial: ["Vancouver", "London", "Dubai", "Delhi", "Sydney"],
  },
  pa: {
    kicker: ["ਆਨ-ਏਅਰ", "ਸਰੀ, ਬੀ.ਸੀ.", "24/7"],
    fact: "ਇੰਡੀ ਰੇਡੀਓ ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਤੋਂ ਲਾਈਵ ਪੰਜਾਬੀ ਆਨਲਾਈਨ ਰੇਡੀਓ ਸਟੇਸ਼ਨ ਹੈ, ਜਿਸਦੇ ਹੋਸਟ ਇੰਡੀ ਜਸਵਾਲ ਹਨ। ਕਾਲ ਕਰੋ, ਗੀਤ ਦੀ ਫ਼ਰਮਾਇਸ਼ ਕਰੋ, ਜਾਂ ਬੱਸ ਪਲੇਅ ਦਬਾਓ: ਮੁਫ਼ਤ, ਦੁਨੀਆ ਭਰ ਵਿੱਚ।",
    host: "ਹੋਸਟ",
    ticker: ["ਹੁਣ ਆਨ-ਏਅਰ", "ਲਾਈਵ ਕਾਲ-ਇਨ", "ਭੇਡਾਂ ਦਾ ਕਾਲ", "24/7 ਪੰਜਾਬੀ ਸੰਗੀਤ", "ਸਰੀ · ਬੀ.ਸੀ. · ਕੈਨੇਡਾ", "Live Punjabi radio"],
    sticker: "ਲਾਈਵ ਕਾਲ-ਇਨ",
    dial: ["ਵੈਨਕੂਵਰ", "ਲੰਡਨ", "ਦੁਬਈ", "ਦਿੱਲੀ", "ਸਿਡਨੀ"],
  },
};

/**
 * Home hero: always-dark "broadcast" band. The H1 and the key-fact sentence
 * are server-rendered text (LCP + crawlers); the record is the player.
 */
export function LiveHero({ locale, m, settings }: { locale: Locale; m: Messages; settings: SiteSettings }) {
  const c = COPY[locale];
  return (
    <section aria-labelledby="hero-title" className="band-ink overflow-hidden">
      <Ticker items={[...c.ticker, `${m.cta.callIn} ${settings.phoneDisplay}`]} />

      <div className="container-ir grid items-center gap-12 pt-10 pb-8 md:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pt-16">
        <div className="relative z-10">
          <p className="meta flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
            <span className="onair-dot" aria-hidden="true" />
            <span className="text-fg">{c.kicker[0]}</span>
            <span aria-hidden="true">/</span>
            <span>{c.kicker[1]}</span>
            <span aria-hidden="true">/</span>
            <span>{c.kicker[2]}</span>
          </p>

          <h1 id="hero-title" className="display-xl mt-6">
            {locale === "pa" ? (
              <>
                <span className="block text-[0.42em] text-muted">ਸਰੀ, ਕੈਨੇਡਾ ਤੋਂ</span>
                <span className="block">ਲਾਈਵ ਪੰਜਾਬੀ</span>
                <span className="block text-marigold">ਰੇਡੀਓ</span>
              </>
            ) : (
              <>
                <span className="block">Live</span>
                <span className="block text-marigold">Punjabi</span>
                <span className="block">Radio</span>
                <span className="serif mt-3 block text-[0.34em] leading-none text-muted">from Surrey, Canada</span>
              </>
            )}
          </h1>

          <p className="mt-7 max-w-xl text-lg text-muted">{c.fact}</p>

          <div className="mt-8 flex items-end justify-between gap-6 border-y border-line py-5">
            <NowPlaying />
            <Waveform bars={16} className="hidden h-12 shrink-0 sm:flex" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PlayButton variant="hero" className="grow sm:grow-0" />
            <a href={`tel:${settings.phoneE164}`} className="btn btn-live btn-lg grow sm:grow-0">
              <PhoneIcon size={20} />
              {m.cta.callIn} <span className="tabular-nums">{settings.phoneDisplay}</span>
            </a>
            <a
              href={whatsappLink(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-lg"
            >
              <WhatsAppIcon size={20} /> {m.cta.whatsapp}
            </a>
          </div>
          <PlayerStatusText className="mt-2" />
        </div>

        <div className="relative mx-auto w-full max-w-[min(88vw,540px)]">
          <Disc />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 right-0 grid size-28 rotate-[10deg] place-items-center rounded-full bg-[#FF6FB5] p-3 text-center text-ink shadow-xl md:size-32"
          >
            <span className="meta block text-[0.7rem]! leading-tight font-extrabold">{c.sticker}</span>
            <span className="-mt-3 block font-display text-xl leading-none font-black tabular-nums">{settings.phoneDisplay}</span>
          </div>
          <p className="mt-5 text-center text-muted">
            {c.host} <span className="serif text-2xl text-fg">Indi Jaswal</span>
          </p>
        </div>
      </div>

      {/* "Tuned in worldwide": a decorative FM-style dial of the cities listening. */}
      <div className="container-ir pb-8" aria-hidden="true">
        <div className="relative text-on-ink">
          <div className="dial" />
          <span className="absolute bottom-0 left-[8%] h-10 w-[3px] bg-live" />
        </div>
        <div className="meta mt-2 flex justify-between text-muted">
          {c.dial.map((city) => (
            <span key={city}>{city}</span>
          ))}
        </div>
      </div>
      <div className="phulkari-band" aria-hidden="true" />
    </section>
  );
}
