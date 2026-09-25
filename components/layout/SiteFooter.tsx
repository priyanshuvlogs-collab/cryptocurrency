import Link from "next/link";
import type { Messages } from "@/messages/en";
import type { Locale, SiteSettings } from "@/lib/types";
import { BRAND_DESCRIPTION, t, whatsappLink } from "@/lib/site";
import { AppBadges } from "@/components/ui/AppBadges";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Logo } from "./Logo";
import type { NavKey } from "./nav";

export function SiteFooter({ locale, m, settings }: { locale: Locale; m: Messages; settings: SiteSettings }) {
  const href = (p: string) => `/${locale}${p}`;
  const col = (title: string, items: [NavKey, string][]) => (
    <div>
      <h2 className="text-sm font-bold tracking-wider text-gold uppercase">{title}</h2>
      <ul className="mt-3 space-y-1">
        {items.map(([key, path]) => (
          <li key={key}>
            <Link href={href(path)} className="inline-flex min-h-10 items-center hover:text-saffron">
              {m.nav[key]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="border-phulkari" aria-hidden="true" />
      <div className="container-ir grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          {/* Key facts in plain HTML for search engines and AI answer engines. */}
          <p className="max-w-md text-sm text-muted">{t(BRAND_DESCRIPTION, locale)}</p>
          <address className="text-sm leading-7 not-italic">
            <strong>Indi Radio</strong>
            <br />
            {settings.address.street ? (
              <>
                {settings.address.street}
                <br />
              </>
            ) : null}
            Surrey, British Columbia, Canada
            <br />
            <a href={`tel:${settings.phoneE164}`} className="link inline-block py-1">
              {settings.phoneDisplay}
            </a>
            {" · "}
            <a href={whatsappLink(settings.whatsappNumber)} className="link inline-block py-1" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <br />
            <a href={`mailto:${settings.email}`} className="link inline-block py-1">
              {settings.email}
            </a>
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
      <div className="container-ir flex flex-col gap-6 border-t border-line py-8 md:flex-row md:items-center md:justify-between">
        <AppBadges appStoreUrl={settings.appStoreUrl} playStoreUrl={settings.playStoreUrl} m={m} />
        <div className="space-y-2 text-sm text-muted md:text-right">
          <p>{m.footer.licensing}</p>
          <p>
            © {new Date().getFullYear()} Indi Radio. {m.footer.rights}{" "}
            <Link href={href("/privacy")} className="underline underline-offset-2">
              {m.nav.privacy}
            </Link>
            {" · "}
            <Link href={href("/terms")} className="underline underline-offset-2">
              {m.nav.terms}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
