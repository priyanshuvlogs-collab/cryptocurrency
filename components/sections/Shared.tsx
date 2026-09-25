import Image from "next/image";
import Link from "next/link";
import type { Messages } from "@/messages/en";
import type { DedicationTier, Episode, Locale, SiteSettings, SocialPost, Sponsor } from "@/lib/types";
import { t, whatsappLink } from "@/lib/site";
import { AppBadges } from "@/components/ui/AppBadges";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ArrowRightIcon, FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon, YouTubeIcon } from "@/components/ui/Icons";
import { VideoFacade } from "./VideoFacade";
import { NewsletterForm } from "@/components/forms/Forms";

export function formatPrice(price: number | null, locale: Locale) {
  if (price == null) return "[CONFIRM]";
  return new Intl.NumberFormat(locale === "pa" ? "pa-IN" : "en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(price);
}

/* ── Episodes ──────────────────────────────────────────────────────── */

export function EpisodeCard({ ep, locale, m }: { ep: Episode; locale: Locale; m: Messages }) {
  return (
    <article className="reveal grid content-start gap-4">
      <VideoFacade id={ep.id} title={ep.title} thumbnail={ep.thumbnail} playLabel={m.episodes.watch} />
      <div>
        <h3 className="line-clamp-2 text-lg leading-snug font-bold">
          <a href={ep.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            {ep.title}
          </a>
        </h3>
        <p className="meta mt-1 text-muted">
          <time dateTime={ep.publishedAt}>
            {new Intl.DateTimeFormat(locale === "pa" ? "pa-IN" : "en-CA", { dateStyle: "medium" }).format(new Date(ep.publishedAt))}
          </time>
        </p>
      </div>
    </article>
  );
}

export function EpisodeGrid({ episodes, locale, m }: { episodes: Episode[]; locale: Locale; m: Messages }) {
  if (!episodes.length) {
    return (
      <div className="band-ink grid min-h-64 place-items-center overflow-hidden rounded-md p-8 text-center">
        <div>
          <YouTubeIcon size={44} className="mx-auto text-marigold" />
          <p className="display-md mt-4">{locale === "pa" ? "ਰੀਪਲੇਅ ਜਲਦੀ ਆ ਰਹੇ ਹਨ" : "Replays coming up"}</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">{m.episodes.notConnected}</p>
        </div>
      </div>
    );
  }
  const [first, ...rest] = episodes;
  return (
    <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
      <div className="md:col-span-2 lg:row-span-2">
        <EpisodeCard ep={first} locale={locale} m={m} />
      </div>
      {rest.map((ep) => (
        <EpisodeCard key={ep.id} ep={ep} locale={locale} m={m} />
      ))}
    </div>
  );
}

/* ── Sponsors ──────────────────────────────────────────────────────── */

export function SponsorStrip({ sponsors, locale, m }: { sponsors: Sponsor[]; locale: Locale; m: Messages }) {
  const filler = locale === "pa" ? ["ਤੁਹਾਡਾ ਕਾਰੋਬਾਰ ਇੱਥੇ", "Your business here"] : ["Your business here", "ਤੁਹਾਡਾ ਕਾਰੋਬਾਰ ਇੱਥੇ"];
  return (
    <section aria-labelledby="sponsors-title" className="band-ink overflow-hidden py-10">
      <div className="container-ir flex flex-wrap items-center justify-between gap-3">
        <h2 id="sponsors-title" className="eyebrow">
          {m.sponsors.title}
        </h2>
        <Link href={`/${locale}/advertise`} className="link">
          {m.sponsors.becomeSponsor}
        </Link>
      </div>
      <div className="marquee mt-8 overflow-hidden">
        {sponsors.length ? (
          <ul className="marquee-track flex w-max items-center gap-16 pl-16">
            {[...sponsors, ...sponsors].map((s, i) => (
              <li key={`${s.name}-${i}`} aria-hidden={i >= sponsors.length ? true : undefined}>
                <a
                  href={s.url || undefined}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  tabIndex={i >= sponsors.length ? -1 : undefined}
                  className="grid h-16 min-w-32 place-items-center opacity-80 transition hover:opacity-100"
                >
                  {s.logo ? (
                    <Image src={s.logo} alt={s.name} width={160} height={64} className="h-12 w-auto object-contain brightness-0 invert" />
                  ) : (
                    <span className="font-display text-4xl font-extrabold uppercase">{s.name}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          // No sponsors yet: the strip itself becomes the sales pitch.
          <div aria-hidden="true">
            <span className="marquee-track flex w-max items-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="flex items-center gap-8 pr-8 font-display text-5xl font-black uppercase md:text-7xl">
                  <span className={i % 2 ? "text-marigold" : "text-transparent [-webkit-text-stroke:1.5px_var(--on-ink)]"}>{filler[i % 2]}</span>
                  <svg width="22" height="22" viewBox="0 0 10 10">
                    <path d="M5 0 10 5 5 10 0 5Z" fill="#E4007C" />
                  </svg>
                </span>
              ))}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── App download + WhatsApp + newsletter ──────────────────────────── */

export function JoinSection({ settings, locale, m }: { settings: SiteSettings; locale: Locale; m: Messages }) {
  const whatsapp =
    settings.whatsappChannelUrl ||
    whatsappLink(settings.whatsappNumber, locale === "pa" ? "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਨੂੰ ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਅੱਪਡੇਟ ਭੇਜੋ।" : "Hi Indi Radio! Please add me to your updates.");
  return (
    <section aria-labelledby="join-title" className="band-marigold overflow-hidden">
      <div className="container-ir grid gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="reveal">
          <p className="eyebrow">iPhone · Android</p>
          <h2 id="join-title" className="display-lg mt-4">
            {m.apps.title}
          </h2>
          <p className="mt-5 max-w-lg text-lg text-muted">{m.apps.body}</p>
          <AppBadges appStoreUrl={settings.appStoreUrl} playStoreUrl={settings.playStoreUrl} m={m} className="mt-8" />
        </div>
        <div className="reveal band-ink rounded-md p-6 shadow-[10px_10px_0_#140b0e] md:p-9">
          <h2 className="display-md">{m.newsletter.title}</h2>
          <p className="mt-3 text-muted">{m.newsletter.body}</p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp_join"
            className="btn btn-whatsapp btn-lg mt-6 w-full"
          >
            <WhatsAppIcon size={22} /> {m.cta.joinWhatsApp}
          </a>
          {!settings.whatsappChannelUrl ? <p className="mt-2 text-xs text-muted">[CONFIRM WhatsApp channel link]</p> : null}
          <div className="mt-6 border-t border-line pt-6">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Dedication tiers: ticket stubs ────────────────────────────────── */

export function TierCards({ tiers, locale, m, linkToForm = true }: { tiers: DedicationTier[]; locale: Locale; m: Messages; linkToForm?: boolean }) {
  return (
    <ul className="grid gap-6 md:grid-cols-3 md:items-start">
      {tiers.map((tier, i) => (
        <li key={tier.id} className={`reveal ${tier.highlighted ? "md:-mt-4" : ""}`}>
          <article
            className={`ticket flex h-full flex-col border-2 border-fg ${tier.highlighted ? "band-marigold" : ""}`}
            style={{ ["--notch-y" as string]: "132px" }}
          >
            <div className="flex h-[132px] flex-col justify-between p-6">
              <p className="meta flex justify-between">
                <span>№ {String(i + 1).padStart(2, "0")}</span>
                {tier.highlighted ? <span className="font-extrabold">{locale === "pa" ? "ਸਭ ਤੋਂ ਪਸੰਦੀਦਾ" : "Most loved"}</span> : null}
              </p>
              <div className="flex items-end justify-between gap-3">
                <h3 className="font-display text-3xl leading-none font-extrabold uppercase">{t(tier.name, locale)}</h3>
                <p className="font-display text-3xl leading-none font-black tabular-nums">{formatPrice(tier.priceCad, locale)}</p>
              </div>
            </div>
            <div className="ticket-perf mx-6" aria-hidden="true" />
            <div className="flex flex-1 flex-col p-6">
              <p className="text-muted">{t(tier.description, locale)}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex gap-2.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="mt-2 shrink-0 text-magenta">
                      <path d="M5 0 10 5 5 10 0 5Z" fill="currentColor" />
                    </svg>
                    <span>{t(f, locale)}</span>
                  </li>
                ))}
              </ul>
              {linkToForm ? (
                <Link href={`/${locale}/dedications?tier=${tier.id}#book`} className={`btn mt-6 w-full ${tier.highlighted ? "btn-primary" : "btn-ghost"}`}>
                  {m.cta.bookDedication}
                </Link>
              ) : null}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

/* ── Social strip ──────────────────────────────────────────────────── */

const PLATFORM_ICON = { tiktok: TikTokIcon, instagram: InstagramIcon, youtube: YouTubeIcon, facebook: FacebookIcon };

export function SocialStrip({ posts, episodes, settings, m }: { posts: SocialPost[]; episodes: Episode[]; settings: SiteSettings; m: Messages }) {
  const items = [
    ...posts.map((p) => ({ id: p.id, platform: p.platform, url: p.url, caption: p.caption, thumbnail: p.thumbnail, date: p.postedAt })),
    ...episodes.slice(0, 4).map((e) => ({ id: e.id, platform: "youtube" as const, url: e.url, caption: e.title, thumbnail: e.thumbnail, date: e.publishedAt })),
  ]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 8);

  return (
    <section aria-labelledby="social-title" className="container-ir py-14 md:py-20">
      <div className="rule-t mb-8 flex flex-wrap items-center justify-between gap-4 pt-6">
        <h2 id="social-title" className="display-md">
          {m.social.title}
        </h2>
        <SocialLinks settings={settings} />
      </div>
      {items.length ? (
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin]">
          {items.map((item) => {
            const Icon = PLATFORM_ICON[item.platform];
            return (
              <li key={`${item.platform}-${item.id}`} className="w-60 shrink-0 snap-start">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-md border-2 border-fg bg-surface">
                  <span className="relative block aspect-[4/5] bg-surface-2">
                    {item.thumbnail ? (
                      <Image src={item.thumbnail} alt="" fill sizes="240px" className="object-cover transition group-hover:scale-105" />
                    ) : null}
                    <span className="absolute top-2 left-2 grid size-9 place-items-center rounded-sm bg-ink text-on-ink">
                      <Icon size={18} />
                    </span>
                  </span>
                  <span className="line-clamp-2 p-3 text-sm font-semibold">{item.caption}</span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-muted">
          {m.social.follow} TikTok · Instagram · YouTube <ArrowRightIcon size={16} className="inline" />
        </p>
      )}
    </section>
  );
}
