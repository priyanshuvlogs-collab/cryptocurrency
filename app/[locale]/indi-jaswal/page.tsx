import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EventBookingForm } from "@/components/forms/Forms";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader, Section } from "@/components/ui/Page";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { MicIcon } from "@/components/ui/Icons";
import { getPress, getSettings } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { graph, personNode } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = pageMetadata("indi", (await params).locale);
  return { ...meta, openGraph: { ...meta.openGraph, type: "profile" } };
}

const COPY = {
  en: {
    eyebrow: "Host & founder",
    h1: "Indi Jaswal",
    lead: "The voice of Indi Radio: live Punjabi call-in radio from Surrey, British Columbia.",
    bioTitle: "The story",
    bio: [
      "Indi Jaswal is the voice behind Indi Radio. From a studio in Surrey, British Columbia, Indi hosts live Punjabi radio that feels less like a broadcast and more like a conversation around the family table: open phone lines, honest opinions, plenty of laughter, and music that carries listeners straight back to Punjab.",
      "Indi founded Indi Radio to give the Punjabi diaspora a station of its own, one that speaks the community’s language, understands its humour and makes room for every caller, whether they are phoning in from Surrey, Brampton, Ludhiana or Melbourne.",
      "On Bhedan Da Kaal, Indi’s flagship live call-in show, the listeners set the agenda. Indi’s job is to keep the conversation moving, keep it respectful, and make sure every voice gets heard.",
      "Beyond the studio, Indi is part of the community the station serves, turning up at melas, family celebrations and local events, and taking the Indi Radio microphone wherever Punjabi families gather.",
      "[CONFIRM: Indi’s personal background, including where Indi grew up, how Indi came to broadcasting, the year Indi Radio launched, and any awards or milestones.]",
    ],
    photoAlt: "Portrait of Indi Jaswal, host and founder of Indi Radio",
    galleryNote: "[CONFIRM: upload 4–8 licensed photos of Indi in the CMS for this gallery]",
    pressTitle: "Press & media",
    pressEmpty: "Journalists and producers: for interviews, quotes or photos, contact the Indi Radio team.",
    bookTitle: "Book Indi for your event",
    bookIntro:
      "Indi Jaswal hosts and MCs weddings, receptions, melas, business launches and community fundraisers, in Punjabi, English or both. Tell us about your event and the team will get back to you with availability.",
    showsLink: "Hear Indi on Bhedan Da Kaal",
  },
  pa: {
    eyebrow: "ਹੋਸਟ ਅਤੇ ਸੰਸਥਾਪਕ",
    h1: "ਇੰਡੀ ਜਸਵਾਲ",
    lead: "ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਆਵਾਜ਼: ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਤੋਂ ਲਾਈਵ ਪੰਜਾਬੀ ਕਾਲ-ਇਨ ਰੇਡੀਓ।",
    bioTitle: "ਕਹਾਣੀ",
    bio: [
      "ਇੰਡੀ ਜਸਵਾਲ ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਆਵਾਜ਼ ਹਨ। ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਦੇ ਸਟੂਡੀਓ ਤੋਂ ਇੰਡੀ ਅਜਿਹਾ ਲਾਈਵ ਪੰਜਾਬੀ ਰੇਡੀਓ ਪੇਸ਼ ਕਰਦੇ ਹਨ ਜੋ ਪ੍ਰਸਾਰਣ ਘੱਟ ਅਤੇ ਪਰਿਵਾਰ ਨਾਲ ਬੈਠ ਕੇ ਗੱਲਾਂ ਕਰਨ ਵਰਗਾ ਵੱਧ ਲੱਗਦਾ ਹੈ: ਖੁੱਲ੍ਹੀਆਂ ਫ਼ੋਨ ਲਾਈਨਾਂ, ਸਿੱਧੀਆਂ ਗੱਲਾਂ, ਖੁੱਲ੍ਹਾ ਹਾਸਾ, ਅਤੇ ਅਜਿਹਾ ਸੰਗੀਤ ਜੋ ਸਰੋਤਿਆਂ ਨੂੰ ਸਿੱਧਾ ਪੰਜਾਬ ਲੈ ਜਾਂਦਾ ਹੈ।",
      "ਇੰਡੀ ਨੇ ਇੰਡੀ ਰੇਡੀਓ ਇਸ ਲਈ ਸ਼ੁਰੂ ਕੀਤਾ ਤਾਂ ਜੋ ਪਰਵਾਸੀ ਪੰਜਾਬੀਆਂ ਦਾ ਆਪਣਾ ਸਟੇਸ਼ਨ ਹੋਵੇ, ਜੋ ਭਾਈਚਾਰੇ ਦੀ ਬੋਲੀ ਬੋਲੇ, ਉਸਦੇ ਹਾਸੇ-ਮਜ਼ਾਕ ਨੂੰ ਸਮਝੇ ਅਤੇ ਹਰ ਕਾਲਰ ਨੂੰ ਥਾਂ ਦੇਵੇ, ਚਾਹੇ ਉਹ ਸਰੀ ਤੋਂ ਕਾਲ ਕਰ ਰਿਹਾ ਹੋਵੇ, ਬਰੈਂਪਟਨ, ਲੁਧਿਆਣੇ ਜਾਂ ਮੈਲਬਰਨ ਤੋਂ।",
      "ਇੰਡੀ ਦੇ ਮੁੱਖ ਲਾਈਵ ਕਾਲ-ਇਨ ਸ਼ੋਅ ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਵਿੱਚ ਗੱਲਬਾਤ ਦਾ ਰੁਖ਼ ਸਰੋਤੇ ਤੈਅ ਕਰਦੇ ਹਨ। ਇੰਡੀ ਦਾ ਕੰਮ ਗੱਲ ਨੂੰ ਅੱਗੇ ਤੋਰਨਾ, ਸਤਿਕਾਰ ਬਣਾਈ ਰੱਖਣਾ ਅਤੇ ਇਹ ਯਕੀਨੀ ਬਣਾਉਣਾ ਹੈ ਕਿ ਹਰ ਆਵਾਜ਼ ਸੁਣੀ ਜਾਵੇ।",
      "ਸਟੂਡੀਓ ਤੋਂ ਬਾਹਰ ਵੀ ਇੰਡੀ ਉਸੇ ਭਾਈਚਾਰੇ ਦਾ ਹਿੱਸਾ ਹਨ ਜਿਸਦੀ ਸੇਵਾ ਸਟੇਸ਼ਨ ਕਰਦਾ ਹੈ: ਮੇਲਿਆਂ, ਪਰਿਵਾਰਕ ਖ਼ੁਸ਼ੀਆਂ ਅਤੇ ਸਥਾਨਕ ਸਮਾਗਮਾਂ ਵਿੱਚ ਪਹੁੰਚਣਾ, ਅਤੇ ਜਿੱਥੇ ਵੀ ਪੰਜਾਬੀ ਪਰਿਵਾਰ ਇਕੱਠੇ ਹੋਣ, ਉੱਥੇ ਇੰਡੀ ਰੇਡੀਓ ਦਾ ਮਾਈਕ ਲੈ ਕੇ ਜਾਣਾ।",
      "[CONFIRM: ਇੰਡੀ ਦਾ ਨਿੱਜੀ ਪਿਛੋਕੜ, ਜਿਵੇਂ ਕਿੱਥੇ ਵੱਡੇ ਹੋਏ, ਪ੍ਰਸਾਰਣ ਵਿੱਚ ਕਿਵੇਂ ਆਏ, ਇੰਡੀ ਰੇਡੀਓ ਕਿਸ ਸਾਲ ਸ਼ੁਰੂ ਹੋਇਆ, ਅਤੇ ਕੋਈ ਸਨਮਾਨ ਜਾਂ ਪ੍ਰਾਪਤੀਆਂ।]",
    ],
    photoAlt: "ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਹੋਸਟ ਅਤੇ ਸੰਸਥਾਪਕ ਇੰਡੀ ਜਸਵਾਲ ਦੀ ਤਸਵੀਰ",
    galleryNote: "[CONFIRM: ਇਸ ਗੈਲਰੀ ਲਈ CMS ਵਿੱਚ ਇੰਡੀ ਦੀਆਂ 4–8 ਲਾਇਸੈਂਸ-ਸ਼ੁਦਾ ਤਸਵੀਰਾਂ ਅੱਪਲੋਡ ਕਰੋ]",
    pressTitle: "ਪ੍ਰੈੱਸ ਅਤੇ ਮੀਡੀਆ",
    pressEmpty: "ਪੱਤਰਕਾਰ ਅਤੇ ਪ੍ਰੋਡਿਊਸਰ: ਇੰਟਰਵਿਊ, ਬਿਆਨ ਜਾਂ ਤਸਵੀਰਾਂ ਲਈ ਇੰਡੀ ਰੇਡੀਓ ਟੀਮ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
    bookTitle: "ਆਪਣੇ ਸਮਾਗਮ ਲਈ ਇੰਡੀ ਨੂੰ ਬੁੱਕ ਕਰੋ",
    bookIntro:
      "ਇੰਡੀ ਜਸਵਾਲ ਵਿਆਹਾਂ, ਰਿਸੈਪਸ਼ਨਾਂ, ਮੇਲਿਆਂ, ਨਵੇਂ ਕਾਰੋਬਾਰਾਂ ਦੀ ਸ਼ੁਰੂਆਤ ਅਤੇ ਭਾਈਚਾਰਕ ਫ਼ੰਡਰੇਜ਼ਰਾਂ ਦੀ ਮੇਜ਼ਬਾਨੀ ਅਤੇ ਸਟੇਜ ਸੰਚਾਲਨ ਕਰਦੇ ਹਨ, ਪੰਜਾਬੀ, ਅੰਗਰੇਜ਼ੀ ਜਾਂ ਦੋਵਾਂ ਵਿੱਚ। ਆਪਣੇ ਸਮਾਗਮ ਬਾਰੇ ਦੱਸੋ, ਟੀਮ ਉਪਲਬਧਤਾ ਬਾਰੇ ਜਵਾਬ ਦੇਵੇਗੀ।",
    showsLink: "‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ’ਤੇ ਇੰਡੀ ਨੂੰ ਸੁਣੋ",
  },
};

export default async function IndiPage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const [settings, press] = await Promise.all([getSettings(), getPress()]);

  return (
    <>
      <JsonLd
        data={graph(
          {
            "@type": "ProfilePage",
            url: absoluteUrl(`/${locale}/indi-jaswal`),
            mainEntity: personNode(settings, locale, { description: c.bio[0] }),
          },
        )}
      />
      <PageHeader
        locale={locale}
        m={m}
        crumbs={[{ name: m.nav.indi, path: PAGES.indi.path }]}
        eyebrow={c.eyebrow}
        title={c.h1}
        lead={c.lead}
      >
        <SocialLinks settings={settings} className="mt-6" />
      </PageHeader>

      <Section id="story">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-surface">
              {settings.hostImage ? (
                <Image src={settings.hostImage} alt={c.photoAlt} fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
              ) : (
                <div className="phulkari grid size-full place-items-center">
                  <span className="grid size-28 place-items-center rounded-full bg-saffron text-on-saffron">
                    <MicIcon size={56} />
                  </span>
                </div>
              )}
            </div>
            <figcaption className="mt-3 text-sm text-muted">{settings.hostImage ? c.photoAlt : "[CONFIRM host photo]"}</figcaption>
          </figure>
          <div>
            <h2 className="display-md">{c.bioTitle}</h2>
            <div className="prose-ir mt-4 text-lg">
              {c.bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link href={`/${locale}/shows/bhedan-da-kaal`} className="btn btn-primary mt-8">
              {c.showsLink}
            </Link>
            <p className="mt-6 text-sm text-muted">{c.galleryNote}</p>
          </div>
        </div>
      </Section>

      <Section id="press" title={c.pressTitle}>
        {press.length ? (
          <ul className="grid gap-3">
            {press.map((p) => (
              <li key={p.url} className="card p-5">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-saffron">
                  {p.title}
                </a>
                <p className="text-sm text-muted">
                  {p.outlet} · <time dateTime={p.date}>{p.date}</time>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">
            {c.pressEmpty}{" "}
            <a href={`mailto:${settings.email}`} className="link">
              {settings.email}
            </a>
          </p>
        )}
      </Section>

      <Section id="book" title={c.bookTitle} intro={c.bookIntro}>
        <div className="card max-w-3xl p-6 md:p-8">
          <EventBookingForm />
        </div>
      </Section>
    </>
  );
}
