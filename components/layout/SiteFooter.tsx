import Link from "next/link";
import type { Messages } from "@/messages/en";
import type { Locale, SiteSettings } from "@/lib/types";
import { BRAND_DESCRIPTION, t, whatsappLink } from "@/lib/site";
import { AppBadges } from "@/components/ui/AppBadges";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { PhoneIcon } from "@/components/ui/Icons";
import type { NavKey } from "./nav";

const SIGNOFF = {
  en: ["Tune in.", "Call in.", "Stay close to home."],
  pa: ["ਸੁਣੋ।", "ਕਾਲ ਕਰੋ।", "ਘਰ ਦੇ ਨੇੜੇ ਰਹੋ।"],
};

export function SiteFooter({ locale, m, settings }: { locale: Locale; m: Messages; settings: SiteSettings }) {
  const href = (p: string) => `/${locale}${p}`;
  const col = (title: string, items: [NavKey, string][]) => (
    <div>
      <h2 className="meta text-marigold">{title}</h2>
      <ul className="mt-4 space-y-1">
        {items.map(([key, path]) => (
          <li key={key}>
            <Link href={href(path)} className="inline-flex min-h-10 items-center font-semibold hover:text-marigold">
              {m.nav[key]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="band-ink mt-24 overflow-hidden">
      <div className="phulkari-band" aria-hidden="true" />

      <div className="container-ir grid gap-8 border-b border-line py-14 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <p className="display-lg">
          {SIGNOFF[locale].map((line, i) => (
            <span key={line} className={`block ${i === 1 ? "text-marigold" : ""}`}>
              {line}
            </span>
          ))}
        </p>
        <div className="flex flex-col gap-3 lg:items-end">
          <a href={`tel:${settings.phoneE164}`} className="btn btn-live btn-lg">
            <PhoneIcon size={20} /> {m.cta.callIn} <span className="tabular-nums">{settings.phoneDisplay}</span>
          </a>
          <AppBadges appStoreUrl={settings.appStoreUrl} playStoreUrl={settings.playStoreUrl} m={m} />
        </div>
      </div>

      <div className="container-ir grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          {/* Key facts in plain HTML for search engines and AI answer engines. */}
          <p className="max-w-md text-muted">{t(BRAND_DESCRIPTION, locale)}</p>
          <address className="leading-8 not-italic">
            <strong>Indi Radio</strong> · Surrey, British Columbia, Canada
            {settings.address.street ? <span className="block">{settings.address.street}</span> : null}
            <span className="block">
              <a href={`tel:${settings.phoneE164}`} className="link inline-block py-1">
                {settings.phoneDisplay}
              </a>
              <span aria-hidden="true"> · </span>
              <a href={whatsappLink(settings.whatsappNumber)} className="link inline-block py-1" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <span aria-hidden="true"> · </span>
              <a href={`mailto:${settings.email}`} className="link inline-block py-1">
                {settings.email}
              </a>
            </span>
          </address>
          <SocialLinks settings={settings} />
        </div>
        {col(m.footer.listen, [
          ["listenLive", "/listen-live"],
          ["schedule", "/schedule"],
          ["shows", "/shows"],
          ["episodes", "/episodes"],
          ["events", "/events"],
        ])}
        {col(m.footer.getInvolved, [
          ["callIn", "/call-in"],
          ["dedications", "/dedications"],
          ["songRequest", "/song-request"],
          ["advertise", "/advertise"],
        ])}
        {col(m.footer.station, [
          ["about", "/about"],
          ["indi", "/indi-jaswal"],
          ["faq", "/faq"],
          ["contact", "/contact"],
        ])}
      </div>

      {/* Oversized wordmark sign-off */}
      <div className="container-ir" aria-hidden="true">
        <p className="font-display text-[24vw] leading-[0.8] font-black tracking-[-0.02em] uppercase select-none xl:text-[20.5rem]">
          Indi<span className="text-marigold">Radio</span>
        </p>
      </div>

      <div className="container-ir flex flex-col gap-2 border-t border-line py-6 text-sm text-muted md:flex-row md:justify-between md:gap-8">
        <p>
          © {new Date().getFullYear()} Indi Radio. {m.footer.rights}{" "}
          <Link href={href("/privacy")} className="inline-block py-1 underline underline-offset-2">
            {m.nav.privacy}
          </Link>
          {" · "}
          <Link href={href("/terms")} className="inline-block py-1 underline underline-offset-2">
            {m.nav.terms}
          </Link>
        </p>
        <p className="max-w-xl md:text-right">{m.footer.licensing}</p>
      </div>
    </footer>
  );
}
