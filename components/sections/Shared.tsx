import Image from "next/image";
import Link from "next/link";
import type { Messages } from "@/messages/en";
import type { DedicationTier, Episode, Locale, SiteSettings, SocialPost, Sponsor } from "@/lib/types";
import { t, whatsappLink } from "@/lib/site";
import { AppBadges } from "@/components/ui/AppBadges";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ArrowRightIcon, CheckIcon, FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon, YouTubeIcon } from "@/components/ui/Icons";
import { VideoFacade } from "./VideoFacade";
import { NewsletterForm } from "@/components/forms/Forms";

export function formatPrice(price: number | null, locale: Locale) {
  if (price == null) return "[CONFIRM]";
  return new Intl.NumberFormat(locale === "pa" ? "pa-IN" : "en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(price);
}

/* ── Episodes ──────────────────────────────────────────────────────── */

export function EpisodeCard({ ep, locale, m }: { ep: Episode; locale: Locale; m: Messages }) {
  return (
    <article className="reveal grid content-start gap-3">
      <VideoFacade id={ep.id} title={ep.title} thumbnail={ep.thumbnail} playLabel={m.episodes.watch} />
      <div>
        <h3 className="line-clamp-2 font-bold">
          <a href={ep.url} target="_blank" rel="noopener noreferrer" className="hover:text-saffron">
            {ep.title}
          </a>
        </h3>
        <p className="text-sm text-muted">
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
    return <p className="card p-6 text-muted">{m.episodes.notConnected}</p>;
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {episodes.map((ep) => (
        <EpisodeCard key={ep.id} ep={ep} locale={locale} m={m} />
      ))}
    </div>
  );
}

/* ── Sponsors ──────────────────────────────────────────────────────── */

export function SponsorStrip({ sponsors, locale, m }: { sponsors: Sponsor[]; locale: Locale; m: Messages }) {
  const advertise = (
    <Link href={`/${locale}/advertise`} className="link">
      {m.sponsors.becomeSponsor}
    </Link>
  );
  return (
    <section aria-labelledby="sponsors-title" className="border-y border-line bg-surface py-8">
      <div className="container-ir">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="sponsors-title" className="eyebrow">
            {m.sponsors.title}
          </h2>
          {advertise}
        </div>
        {sponsors.length ? (
          <div className="marquee mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <ul className="marquee-track flex w-max items-center gap-12">
              {[...sponsors, ...sponsors].map((s, i) => (
                <li key={`${s.name}-${i}`} aria-hidden={i >= sponsors.length ? true : undefined}>
                  <a
                    href={s.url || undefined}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    tabIndex={i >= sponsors.length ? -1 : undefined}
                    className="grid h-16 min-w-32 place-items-center opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
                  >
                    {s.logo ? (
                      <Image src={s.logo} alt={s.name} width={160} height={64} className="h-12 w-auto object-contain" />
                    ) : (
                      <span className="font-display text-xl font-extrabold">{s.name}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ── App download + WhatsApp + newsletter ──────────────────────────── */

export function JoinSection({ settings, locale, m }: { settings: SiteSettings; locale: Locale; m: Messages }) {
  const whatsapp = settings.whatsappChannelUrl || whatsappLink(settings.whatsappNumber, locale === "pa" ? "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਨੂੰ ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਅੱਪਡੇਟ ਭੇਜੋ।" : "Hi Indi Radio! Please add me to your updates.");
  return (
    <section aria-labelledby="join-title" className="container-ir py-12 md:py-16">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="reveal card phulkari overflow-hidden p-6 md:p-10">
          <p className="eyebrow">iPhone · Android</p>
          <h2 id="join-title" className="display-md mt-1">
            {m.apps.title}
          </h2>
          <p className="mt-3 text-muted">{m.apps.body}</p>
          <AppBadges appStoreUrl={settings.appStoreUrl} playStoreUrl={settings.playStoreUrl} m={m} className="mt-6" />
        </div>
        <div className="reveal card p-6 md:p-10">
          <h2 className="display-md">{m.newsletter.title}</h2>
          <p className="mt-3 text-muted">{m.newsletter.body}</p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp_join"
            className="btn btn-whatsapp btn-lg mt-6 w-full sm:w-fit"
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

/* ── Dedication tiers ──────────────────────────────────────────────── */

export function TierCards({ tiers, locale, m, linkToForm = true }: { tiers: DedicationTier[]; locale: Locale; m: Messages; linkToForm?: boolean }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {tiers.map((tier) => (
        <li
          key={tier.id}
          className={`reveal card flex flex-col p-6 ${tier.highlighted ? "border-2 border-saffron shadow-[var(--shadow-glow)]" : ""}`}
        >
          <h3 className="text-xl font-extrabold">{t(tier.name, locale)}</h3>
          <p className="mt-1 font-display text-3xl font-black text-saffron">{formatPrice(tier.priceCad, locale)}</p>
          <p className="mt-2 text-muted">{t(tier.description, locale)}</p>
          <ul className="mt-4 flex-1 space-y-2">
            {tier.features.map((f, i) => (
              <li key={i} className="flex gap-2">
                <CheckIcon size={18} className="mt-1 shrink-0 text-whatsapp" />
                <span>{t(f, locale)}</span>
              </li>
            ))}
          </ul>
          {linkToForm ? (
            <Link href={`/${locale}/dedications?tier=${tier.id}#book`} className={`btn mt-6 ${tier.highlighted ? "btn-primary" : "btn-ghost"}`}>
              {m.cta.bookDedication}
            </Link>
          ) : null}
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
    <section aria-labelledby="social-title" className="container-ir py-12 md:py-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
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
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="group card block overflow-hidden">
                  <span className="relative block aspect-[4/5] bg-surface-2">
                    {item.thumbnail ? (
                      <Image src={item.thumbnail} alt="" fill sizes="240px" className="object-cover transition group-hover:scale-105" />
                    ) : null}
                    <span className="absolute top-2 left-2 grid size-9 place-items-center rounded-full bg-black/70 text-white">
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
