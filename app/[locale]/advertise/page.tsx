import type { Metadata } from "next";
import { SponsorForm } from "@/components/forms/Forms";
import { SponsorStrip } from "@/components/sections/Shared";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader, Section } from "@/components/ui/Page";
import { CheckIcon, DownloadIcon } from "@/components/ui/Icons";
import { getAdPackages, getSettings, getSponsors } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { STATION_ID, graph } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, t } from "@/lib/site";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("advertise", (await params).locale);
}

const COPY = {
  en: {
    h1: "Advertise on Punjabi radio in Surrey",
    lead: "Put your business in front of Punjabi families in Surrey, across Canada and around the world, in the language they speak at home and with a host they trust.",
    whoTitle: "Who listens",
    who: [
      "Punjabi-speaking families, mostly aged 25 to 65",
      "Rooted in Surrey and the Lower Mainland, with listeners across Canada",
      "A worldwide diaspora audience in India, the UK, Australia, the USA and Dubai",
      "Mostly on mobile: website, iPhone and Android apps, TikTok and YouTube",
      "Engaged listeners who call in, message on WhatsApp and show up at events",
    ],
    statsTitle: "Audience at a glance",
    whyTitle: "Why Indi Radio works for local business",
    why: [
      ["Trusted voice", "Host-read messages from Indi Jaswal carry the credibility of a familiar voice, in Punjabi or English."],
      ["Live & social", "Your brand on air, on the website and across TikTok and YouTube live streams."],
      ["Community reach", "Weddings, melas, grand openings: be part of the moments that bring families together."],
    ],
    packagesTitle: "Advertising packages",
    kitTitle: "Media kit",
    kitBody: "Rate card, audience data and ad specifications in one PDF.",
    kitMissing: "The media kit PDF is being prepared [CONFIRM upload in CMS]. Request it with the form below and we’ll email it to you.",
    formTitle: "Talk to us about advertising",
    formIntro: "Tell us about your business and goals. We reply with a plan built around your budget.",
  },
  pa: {
    h1: "ਸਰੀ ਦੇ ਪੰਜਾਬੀ ਰੇਡੀਓ ’ਤੇ ਮਸ਼ਹੂਰੀ ਕਰੋ",
    lead: "ਆਪਣਾ ਕਾਰੋਬਾਰ ਸਰੀ, ਪੂਰੇ ਕੈਨੇਡਾ ਅਤੇ ਦੁਨੀਆ ਭਰ ਦੇ ਪੰਜਾਬੀ ਪਰਿਵਾਰਾਂ ਤੱਕ ਪਹੁੰਚਾਓ, ਉਸ ਬੋਲੀ ਵਿੱਚ ਜੋ ਉਹ ਘਰ ਬੋਲਦੇ ਹਨ ਅਤੇ ਉਸ ਹੋਸਟ ਰਾਹੀਂ ਜਿਸ ’ਤੇ ਉਹ ਭਰੋਸਾ ਕਰਦੇ ਹਨ।",
    whoTitle: "ਕੌਣ ਸੁਣਦਾ ਹੈ",
    who: [
      "ਪੰਜਾਬੀ ਬੋਲਣ ਵਾਲੇ ਪਰਿਵਾਰ, ਜ਼ਿਆਦਾਤਰ 25 ਤੋਂ 65 ਸਾਲ ਦੇ",
      "ਸਰੀ ਅਤੇ ਲੋਅਰ ਮੇਨਲੈਂਡ ਨਾਲ ਜੁੜੇ, ਅਤੇ ਪੂਰੇ ਕੈਨੇਡਾ ਵਿੱਚ ਸਰੋਤੇ",
      "ਭਾਰਤ, ਯੂ.ਕੇ., ਆਸਟ੍ਰੇਲੀਆ, ਅਮਰੀਕਾ ਅਤੇ ਦੁਬਈ ਵਿੱਚ ਵੱਸਦਾ ਪਰਵਾਸੀ ਪੰਜਾਬੀ ਭਾਈਚਾਰਾ",
      "ਜ਼ਿਆਦਾਤਰ ਮੋਬਾਈਲ ’ਤੇ: ਵੈੱਬਸਾਈਟ, iPhone ਅਤੇ Android ਐਪ, TikTok ਅਤੇ YouTube",
      "ਜੁੜੇ ਹੋਏ ਸਰੋਤੇ ਜੋ ਕਾਲ ਕਰਦੇ ਹਨ, WhatsApp ’ਤੇ ਸੁਨੇਹੇ ਭੇਜਦੇ ਹਨ ਅਤੇ ਸਮਾਗਮਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ",
    ],
    statsTitle: "ਸਰੋਤੇ ਇੱਕ ਨਜ਼ਰ ਵਿੱਚ",
    whyTitle: "ਇੰਡੀ ਰੇਡੀਓ ਸਥਾਨਕ ਕਾਰੋਬਾਰਾਂ ਲਈ ਕਿਉਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    why: [
      ["ਭਰੋਸੇਯੋਗ ਆਵਾਜ਼", "ਇੰਡੀ ਜਸਵਾਲ ਵੱਲੋਂ ਪੜ੍ਹੇ ਸੁਨੇਹਿਆਂ ਵਿੱਚ ਜਾਣੀ-ਪਛਾਣੀ ਆਵਾਜ਼ ਦਾ ਭਰੋਸਾ ਹੁੰਦਾ ਹੈ, ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ।"],
      ["ਲਾਈਵ ਅਤੇ ਸੋਸ਼ਲ", "ਤੁਹਾਡਾ ਬ੍ਰਾਂਡ ਆਨ-ਏਅਰ, ਵੈੱਬਸਾਈਟ ’ਤੇ, ਅਤੇ TikTok ਤੇ YouTube ਲਾਈਵ ਸਟ੍ਰੀਮਾਂ ਵਿੱਚ।"],
      ["ਭਾਈਚਾਰੇ ਤੱਕ ਪਹੁੰਚ", "ਵਿਆਹ, ਮੇਲੇ, ਨਵੇਂ ਕਾਰੋਬਾਰ: ਉਹਨਾਂ ਪਲਾਂ ਦਾ ਹਿੱਸਾ ਬਣੋ ਜੋ ਪਰਿਵਾਰਾਂ ਨੂੰ ਇਕੱਠੇ ਕਰਦੇ ਹਨ।"],
    ],
    packagesTitle: "ਮਸ਼ਹੂਰੀ ਪੈਕੇਜ",
    kitTitle: "ਮੀਡੀਆ ਕਿੱਟ",
    kitBody: "ਰੇਟ ਕਾਰਡ, ਸਰੋਤਿਆਂ ਦੇ ਅੰਕੜੇ ਅਤੇ ਇਸ਼ਤਿਹਾਰ ਦੀਆਂ ਲੋੜਾਂ, ਇੱਕ PDF ਵਿੱਚ।",
    kitMissing: "ਮੀਡੀਆ ਕਿੱਟ PDF ਤਿਆਰ ਹੋ ਰਹੀ ਹੈ [CONFIRM upload in CMS]। ਹੇਠਾਂ ਫ਼ਾਰਮ ਰਾਹੀਂ ਮੰਗੋ, ਅਸੀਂ ਈਮੇਲ ਕਰ ਦੇਵਾਂਗੇ।",
    formTitle: "ਮਸ਼ਹੂਰੀ ਬਾਰੇ ਗੱਲ ਕਰੋ",
    formIntro: "ਆਪਣੇ ਕਾਰੋਬਾਰ ਅਤੇ ਟੀਚਿਆਂ ਬਾਰੇ ਦੱਸੋ। ਅਸੀਂ ਤੁਹਾਡੇ ਬਜਟ ਮੁਤਾਬਕ ਯੋਜਨਾ ਨਾਲ ਜਵਾਬ ਦਿੰਦੇ ਹਾਂ।",
  },
};

export default async function AdvertisePage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const [settings, packages, sponsors] = await Promise.all([getSettings(), getAdPackages(), getSponsors()]);

  return (
    <>
      <JsonLd
        data={graph({
          "@type": "Service",
          name: locale === "pa" ? "ਪੰਜਾਬੀ ਰੇਡੀਓ ਮਸ਼ਹੂਰੀ" : "Punjabi radio advertising",
          serviceType: "Radio advertising",
          provider: { "@id": STATION_ID },
          areaServed: ["Surrey, BC", "Canada", "Worldwide"],
          audience: { "@type": "Audience", audienceType: "Punjabi-speaking families" },
          url: absoluteUrl(`/${locale}/advertise`),
        })}
      />
      <PageHeader locale={locale} m={m} crumbs={[{ name: m.nav.advertise, path: PAGES.advertise.path }]} title={c.h1} lead={c.lead}>
        <a href="#inquiry" className="btn btn-primary btn-lg mt-8">
          {m.cta.advertise}
        </a>
      </PageHeader>

      <Section id="audience" title={c.statsTitle}>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {settings.audienceStats.map((s) => (
            <div key={s.label.en} className="reveal card p-6">
              <dt className="text-muted">{t(s.label, locale)}</dt>
              <dd className="mt-1 font-display text-4xl font-black text-saffron">{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-extrabold">{c.whoTitle}</h3>
            <ul className="mt-4 space-y-3">
              {c.who.map((w) => (
                <li key={w} className="flex gap-3">
                  <CheckIcon className="mt-1 shrink-0 text-whatsapp" size={18} />
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-extrabold">{c.whyTitle}</h3>
            <dl className="mt-4 space-y-4">
              {c.why.map(([term, def]) => (
                <div key={term}>
                  <dt className="font-bold">{term}</dt>
                  <dd className="text-muted">{def}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section id="packages" title={c.packagesTitle}>
        <ul className="grid gap-4 md:grid-cols-3">
          {packages.map((p) => (
            <li key={p.id} className="reveal card flex flex-col p-6">
              <h3 className="text-xl font-extrabold">{t(p.name, locale)}</h3>
              <p className="mt-1 font-bold text-saffron">{t(p.priceNote, locale)}</p>
              <p className="mt-2 text-muted">{t(p.description, locale)}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckIcon size={18} className="mt-1 shrink-0 text-whatsapp" />
                    {t(f, locale)}
                  </li>
                ))}
              </ul>
              <a href="#inquiry" className="btn btn-ghost mt-6">
                {m.cta.learnMore}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="media-kit" title={c.kitTitle}>
        {settings.mediaKitUrl ? (
          <div className="card flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <p>{c.kitBody}</p>
            <a href={settings.mediaKitUrl} download data-track="media_kit_download" className="btn btn-primary">
              <DownloadIcon /> {m.cta.download} (PDF)
            </a>
          </div>
        ) : (
          <p className="card p-6 text-muted">{c.kitMissing}</p>
        )}
      </Section>

      <SponsorStrip sponsors={sponsors} locale={locale} m={m} />

      <Section id="inquiry" title={c.formTitle} intro={c.formIntro}>
        <div className="card max-w-3xl p-6 md:p-8">
          <SponsorForm packages={packages.map((p) => ({ value: t(p.name, "en"), label: t(p.name, locale) }))} />
        </div>
      </Section>
    </>
  );
}
