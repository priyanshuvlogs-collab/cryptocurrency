import Image from "next/image";
import type { Messages } from "@/messages/en";
import type { Locale, SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/site";
import { NowPlaying, OnAirBadge, PlayButton, PlayerStatusText, Waveform } from "@/components/player/PlayerControls";
import { MicIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

const COPY = {
  en: {
    h1: "Live Punjabi radio from Surrey, Canada",
    fact: "Indi Radio is a live Punjabi online radio station from Surrey, British Columbia, hosted by Indi Jaswal. Call in, request a song, or just press play: it’s free, worldwide.",
    hostCaption: "Indi Jaswal · Host & founder",
    photoAlt: "Indi Jaswal, host and founder of Indi Radio, in the studio in Surrey, BC",
  },
  pa: {
    h1: "ਸਰੀ, ਕੈਨੇਡਾ ਤੋਂ ਲਾਈਵ ਪੰਜਾਬੀ ਰੇਡੀਓ",
    fact: "ਇੰਡੀ ਰੇਡੀਓ ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਤੋਂ ਲਾਈਵ ਪੰਜਾਬੀ ਆਨਲਾਈਨ ਰੇਡੀਓ ਸਟੇਸ਼ਨ ਹੈ, ਜਿਸਦੇ ਹੋਸਟ ਇੰਡੀ ਜਸਵਾਲ ਹਨ। ਕਾਲ ਕਰੋ, ਗੀਤ ਦੀ ਫ਼ਰਮਾਇਸ਼ ਕਰੋ, ਜਾਂ ਬੱਸ ਪਲੇਅ ਦਬਾਓ: ਮੁਫ਼ਤ, ਦੁਨੀਆ ਭਰ ਵਿੱਚ।",
    hostCaption: "ਇੰਡੀ ਜਸਵਾਲ · ਹੋਸਟ ਅਤੇ ਸੰਸਥਾਪਕ",
    photoAlt: "ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਹੋਸਟ ਅਤੇ ਸੰਸਥਾਪਕ ਇੰਡੀ ਜਸਵਾਲ, ਸਰੀ ਦੇ ਸਟੂਡੀਓ ਵਿੱਚ",
  },
};

/**
 * Home hero. The H1 and the key-fact sentence are server-rendered text, so
 * the LCP element paints immediately and crawlers read the facts.
 */
export function LiveHero({ locale, m, settings }: { locale: Locale; m: Messages; settings: SiteSettings }) {
  const c = COPY[locale];
  return (
    <section aria-labelledby="hero-title" className="phulkari relative overflow-hidden bg-gradient-to-br from-[var(--hero-from)] via-[var(--bg)] to-[var(--hero-to)]">
      <div className="container-ir grid items-center gap-10 py-10 md:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <OnAirBadge />
          <h1 id="hero-title" className="display-xl mt-5">
            {c.h1}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted md:text-xl">{c.fact}</p>

          <div className="card mt-8 max-w-xl p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <NowPlaying />
              <Waveform className="hidden shrink-0 sm:flex" bars={14} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <PlayButton variant="hero" className="col-span-2 whitespace-nowrap" />
              <a href={`tel:${settings.phoneE164}`} className="btn btn-live btn-lg">
                <PhoneIcon size={22} />
                {m.cta.callIn}
              </a>
              <a
                href={whatsappLink(settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
                aria-label={`${m.cta.whatsapp} Indi Radio`}
              >
                <WhatsAppIcon size={22} />
                <span>{m.cta.whatsapp}</span>
              </a>
            </div>
            <PlayerStatusText className="mt-3" />
            <p className="text-sm text-muted">
              {m.cta.callIn}:{" "}
              <a href={`tel:${settings.phoneE164}`} className="font-bold text-fg">
                {settings.phoneDisplay}
              </a>
            </p>
          </div>
        </div>

        <figure className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[var(--shadow-glow)]">
            {settings.hostImage ? (
              <Image src={settings.hostImage} alt={c.photoAlt} fill priority sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" />
            ) : (
              <HostPlaceholder />
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16 text-white">
              <Waveform bars={20} className="h-10" />
            </div>
          </div>
          <figcaption className="mt-3 text-center font-semibold">
            {c.hostCaption}
            {!settings.hostImage ? <span className="block text-xs font-normal text-muted">[CONFIRM host photo]</span> : null}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/** Art-directed stand-in until a licensed photo of Indi Jaswal is uploaded. */
function HostPlaceholder() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,var(--surface-2),var(--surface))]">
      <svg viewBox="0 0 200 200" className="w-3/4" aria-hidden="true">
        <g fill="none" strokeWidth="3">
          <path d="M100 8 192 100 100 192 8 100Z" stroke="var(--saffron)" />
          <path d="M100 32 168 100 100 168 32 100Z" stroke="var(--magenta)" />
          <path d="M100 56 144 100 100 144 56 100Z" stroke="var(--gold)" />
        </g>
      </svg>
      <span className="absolute grid size-28 place-items-center rounded-full bg-saffron text-on-saffron">
        <MicIcon size={56} />
      </span>
    </div>
  );
}
