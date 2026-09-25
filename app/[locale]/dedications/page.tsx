import type { Metadata } from "next";
import { Suspense } from "react";
import { DedicationBooking } from "@/components/forms/DedicationBooking";
import { TierCards, formatPrice } from "@/components/sections/Shared";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader, Section } from "@/components/ui/Page";
import { getDedicationTiers } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { STATION_ID, graph } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, t } from "@/lib/site";
import { stripeEnabled } from "@/lib/stripe";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("dedications", (await params).locale);
}

const COPY = {
  en: {
    h1: "Book a dedication or shout-out",
    lead: "Birthday, anniversary, wedding, Vaisakhi or Diwali greeting, or a new business opening: celebrate it live on Indi Radio, heard by Punjabi families around the world.",
    packagesTitle: "Choose your package",
    howTitle: "How it works",
    how: [
      ["Tell us the occasion", "Pick the celebration, a package and a date, and write your message in English or Punjabi."],
      ["Pay securely", "Checkout is handled by Stripe. Indi Radio never sees your card details. You get an email receipt."],
      ["Confirm on WhatsApp", "Tap the WhatsApp button on the confirmation page. The team confirms the air time with you."],
      ["Listen live", "Gather the family and press play. Your message goes out live on Indi Radio."],
    ],
    formTitle: "Book now",
    formIntro: "Takes about two minutes. Messages must be family-friendly; the team may lightly edit wording for air.",
    confirmPrices: "Prices marked [CONFIRM] are being finalised. Until then, bookings are sent as requests and the team will confirm the price with you before you pay.",
  },
  pa: {
    h1: "ਸੁਨੇਹਾ ਜਾਂ ਸ਼ਾਊਟ-ਆਊਟ ਬੁੱਕ ਕਰੋ",
    lead: "ਜਨਮਦਿਨ, ਵਰ੍ਹੇਗੰਢ, ਵਿਆਹ, ਵਿਸਾਖੀ ਜਾਂ ਦੀਵਾਲੀ ਦੀ ਵਧਾਈ, ਜਾਂ ਨਵੇਂ ਕਾਰੋਬਾਰ ਦਾ ਉਦਘਾਟਨ: ਇਹ ਖ਼ੁਸ਼ੀ ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਲਾਈਵ ਮਨਾਓ, ਜਿਸਨੂੰ ਦੁਨੀਆ ਭਰ ਦੇ ਪੰਜਾਬੀ ਪਰਿਵਾਰ ਸੁਣਦੇ ਹਨ।",
    packagesTitle: "ਆਪਣਾ ਪੈਕੇਜ ਚੁਣੋ",
    howTitle: "ਕਿਵੇਂ ਹੁੰਦਾ ਹੈ",
    how: [
      ["ਮੌਕਾ ਦੱਸੋ", "ਖ਼ੁਸ਼ੀ ਦਾ ਮੌਕਾ, ਪੈਕੇਜ ਅਤੇ ਤਾਰੀਖ਼ ਚੁਣੋ, ਅਤੇ ਆਪਣਾ ਸੁਨੇਹਾ ਅੰਗਰੇਜ਼ੀ ਜਾਂ ਪੰਜਾਬੀ ਵਿੱਚ ਲਿਖੋ।"],
      ["ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਕਰੋ", "ਭੁਗਤਾਨ Stripe ਰਾਹੀਂ ਹੁੰਦਾ ਹੈ। ਇੰਡੀ ਰੇਡੀਓ ਕਦੇ ਤੁਹਾਡੇ ਕਾਰਡ ਦੇ ਵੇਰਵੇ ਨਹੀਂ ਦੇਖਦਾ। ਤੁਹਾਨੂੰ ਈਮੇਲ ਰਸੀਦ ਮਿਲਦੀ ਹੈ।"],
      ["WhatsApp ’ਤੇ ਪੱਕਾ ਕਰੋ", "ਪੁਸ਼ਟੀ ਵਾਲੇ ਪੰਨੇ ’ਤੇ WhatsApp ਬਟਨ ਦਬਾਓ। ਟੀਮ ਤੁਹਾਡੇ ਨਾਲ ਆਨ-ਏਅਰ ਸਮਾਂ ਪੱਕਾ ਕਰਦੀ ਹੈ।"],
      ["ਲਾਈਵ ਸੁਣੋ", "ਪਰਿਵਾਰ ਨੂੰ ਇਕੱਠਾ ਕਰੋ ਅਤੇ ਪਲੇਅ ਦਬਾਓ। ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਲਾਈਵ ਜਾਂਦਾ ਹੈ।"],
    ],
    formTitle: "ਹੁਣੇ ਬੁੱਕ ਕਰੋ",
    formIntro: "ਲਗਭਗ ਦੋ ਮਿੰਟ ਲੱਗਦੇ ਹਨ। ਸੁਨੇਹੇ ਪਰਿਵਾਰ ਨਾਲ ਸੁਣਨ ਯੋਗ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ; ਟੀਮ ਆਨ-ਏਅਰ ਲਈ ਸ਼ਬਦਾਂ ਵਿੱਚ ਥੋੜ੍ਹਾ ਸੁਧਾਰ ਕਰ ਸਕਦੀ ਹੈ।",
    confirmPrices: "[CONFIRM] ਵਾਲੀਆਂ ਕੀਮਤਾਂ ਅਜੇ ਤੈਅ ਹੋ ਰਹੀਆਂ ਹਨ। ਉਦੋਂ ਤੱਕ ਬੁਕਿੰਗ ਬੇਨਤੀ ਵਜੋਂ ਜਾਂਦੀ ਹੈ ਅਤੇ ਭੁਗਤਾਨ ਤੋਂ ਪਹਿਲਾਂ ਟੀਮ ਤੁਹਾਡੇ ਨਾਲ ਕੀਮਤ ਪੱਕੀ ਕਰੇਗੀ।",
  },
};

export default async function DedicationsPage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const tiers = await getDedicationTiers();
  const tierOptions = tiers.map((tier) => ({
    value: tier.id,
    label: `${t(tier.name, locale)} · ${formatPrice(tier.priceCad, locale)}`,
    description: t(tier.description, locale),
  }));

  return (
    <>
      <JsonLd
        data={graph({
          "@type": "Service",
          name: locale === "pa" ? "ਰੇਡੀਓ ਸੁਨੇਹੇ ਅਤੇ ਸ਼ਾਊਟ-ਆਊਟ" : "Radio dedications and shout-outs",
          serviceType: "On-air radio dedication",
          provider: { "@id": STATION_ID },
          areaServed: "Worldwide",
          url: absoluteUrl(`/${locale}/dedications`),
          offers: tiers
            .filter((tier) => tier.priceCad)
            .map((tier) => ({ "@type": "Offer", name: t(tier.name, locale), price: tier.priceCad, priceCurrency: "CAD" })),
        })}
      />
      <PageHeader locale={locale} m={m} crumbs={[{ name: m.nav.dedications, path: PAGES.dedications.path }]} title={c.h1} lead={c.lead} />

      <Section id="packages" title={c.packagesTitle}>
        <TierCards tiers={tiers} locale={locale} m={m} />
        {tiers.some((tier) => tier.priceCad == null) ? <p className="mt-4 text-sm text-muted">{c.confirmPrices}</p> : null}
      </Section>

      <Section id="how" title={c.howTitle}>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {c.how.map(([title, body], i) => (
            <li key={title} className="reveal card p-6">
              <span className="grid size-10 place-items-center rounded-full bg-magenta font-display text-lg font-black text-bg">{i + 1}</span>
              <h3 className="mt-3 text-lg font-extrabold">{title}</h3>
              <p className="mt-1 text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="book" title={c.formTitle} intro={c.formIntro}>
        <div className="card p-5 md:p-8">
          <Suspense fallback={null}>
            <DedicationBooking tiers={tierOptions} payable={stripeEnabled && tiers.some((tier) => tier.priceCad != null)} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
