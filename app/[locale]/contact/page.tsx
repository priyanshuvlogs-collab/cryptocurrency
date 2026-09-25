import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/Forms";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader, Section } from "@/components/ui/Page";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { getSettings } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { STATION_ID, graph } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, whatsappLink } from "@/lib/site";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("contact", (await params).locale);
}

const COPY = {
  en: {
    h1: "Contact Indi Radio",
    lead: "Questions about a show, a dedication, advertising or an event? The fastest way to reach the team is WhatsApp. For everything else, use the form.",
    phone: "Call-in & studio line",
    whatsapp: "WhatsApp",
    email: "Email",
    location: "Location",
    locationValue: "Surrey, British Columbia, Canada",
    formTitle: "Send a message",
    shortcuts: "Looking for something specific?",
  },
  pa: {
    h1: "ਇੰਡੀ ਰੇਡੀਓ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    lead: "ਕਿਸੇ ਸ਼ੋਅ, ਸੁਨੇਹੇ, ਮਸ਼ਹੂਰੀ ਜਾਂ ਸਮਾਗਮ ਬਾਰੇ ਸਵਾਲ? ਟੀਮ ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਸਭ ਤੋਂ ਤੇਜ਼ ਤਰੀਕਾ WhatsApp ਹੈ। ਬਾਕੀ ਸਭ ਲਈ ਫ਼ਾਰਮ ਵਰਤੋ।",
    phone: "ਕਾਲ-ਇਨ ਅਤੇ ਸਟੂਡੀਓ ਲਾਈਨ",
    whatsapp: "WhatsApp",
    email: "ਈਮੇਲ",
    location: "ਟਿਕਾਣਾ",
    locationValue: "ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ, ਕੈਨੇਡਾ",
    formTitle: "ਸੁਨੇਹਾ ਭੇਜੋ",
    shortcuts: "ਕੁਝ ਖ਼ਾਸ ਲੱਭ ਰਹੇ ਹੋ?",
  },
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const settings = await getSettings();

  const channels = [
    { Icon: PhoneIcon, label: c.phone, value: settings.phoneDisplay, href: `tel:${settings.phoneE164}` },
    { Icon: WhatsAppIcon, label: c.whatsapp, value: settings.phoneDisplay, href: whatsappLink(settings.whatsappNumber) },
    { Icon: MailIcon, label: c.email, value: settings.email, href: `mailto:${settings.email}` },
    { Icon: PinIcon, label: c.location, value: c.locationValue, href: null },
  ];

  return (
    <>
      <JsonLd data={graph({ "@type": "ContactPage", url: absoluteUrl(`/${locale}/contact`), about: { "@id": STATION_ID } })} />
      <PageHeader locale={locale} m={m} crumbs={[{ name: m.nav.contact, path: PAGES.contact.path }]} title={c.h1} lead={c.lead} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            <ul className="grid gap-3">
              {channels.map(({ Icon, label, value, href }) => (
                <li key={label} className="card flex items-center gap-4 p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 text-saffron">
                    <Icon />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-muted">{label}</p>
                    {href ? (
                      <a href={href} className="font-bold break-words hover:text-saffron" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {value}
                      </a>
                    ) : (
                      <p className="font-bold">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted">[CONFIRM phone, WhatsApp and email]</p>
            <SocialLinks settings={settings} />
            <div className="card p-5">
              <h2 className="font-bold">{c.shortcuts}</h2>
              <ul className="mt-2 space-y-1">
                {(
                  [
                    ["dedications", "/dedications"],
                    ["advertise", "/advertise"],
                    ["songRequest", "/song-request"],
                    ["faq", "/faq"],
                  ] as const
                ).map(([key, path]) => (
                  <li key={key}>
                    <Link href={`/${locale}${path}`} className="link">
                      {m.nav[key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card p-6 md:p-8">
            <h2 className="display-md mb-6">{c.formTitle}</h2>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
