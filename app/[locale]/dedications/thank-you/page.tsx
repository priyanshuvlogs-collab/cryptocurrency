import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/ui/Page";
import { CheckIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { getSettings } from "@/lib/cms";
import { getMessages } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";
import { getCheckoutSession } from "@/lib/stripe";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ session_id?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/dedications/thank-you",
    title: locale === "pa" ? "ਬੁਕਿੰਗ ਪੱਕੀ ਹੋ ਗਈ | ਇੰਡੀ ਰੇਡੀਓ" : "Booking confirmed | Indi Radio",
    description: locale === "pa" ? "ਤੁਹਾਡਾ ਇੰਡੀ ਰੇਡੀਓ ਸੁਨੇਹਾ ਬੁੱਕ ਹੋ ਗਿਆ ਹੈ।" : "Your Indi Radio dedication is booked.",
    noindex: true,
  });
}

export default async function ThankYouPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { session_id } = await searchParams;
  const m = getMessages(locale);
  const [session, settings] = await Promise.all([getCheckoutSession(session_id || ""), getSettings()]);
  const paid = session?.payment_status === "paid";
  const md = session?.metadata || {};
  const order = session ? session.id.slice(-8).toUpperCase() : "";

  const waText =
    locale === "pa"
      ? `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਇੰਡੀ ਰੇਡੀਓ! ਮੈਂ ਸੁਨੇਹਾ ਬੁੱਕ ਕੀਤਾ ਹੈ। ਆਰਡਰ: ${order}. ਕਿਸ ਲਈ: ${md.for_name || ""}. ਤਾਰੀਖ਼: ${md.preferred_date || ""}.`
      : `Hi Indi Radio! I just booked a dedication. Order: ${order}. For: ${md.for_name || ""}. Date: ${md.preferred_date || ""}.`;

  return (
    <>
      <PageHeader
        locale={locale}
        m={m}
        crumbs={[
          { name: m.nav.dedications, path: "/dedications" },
          { name: locale === "pa" ? "ਧੰਨਵਾਦ" : "Thank you", path: "/dedications/thank-you" },
        ]}
        title={paid ? (locale === "pa" ? "ਧੰਨਵਾਦ! ਤੁਹਾਡੀ ਬੁਕਿੰਗ ਪੱਕੀ ਹੈ" : "Thank you! Your booking is confirmed") : locale === "pa" ? "ਤੁਹਾਡੀ ਬੁਕਿੰਗ" : "Your booking"}
      />
      <Section>
        {paid ? (
          <div className="card max-w-2xl p-6 md:p-8">
            <p className="flex items-center gap-3 text-lg font-semibold">
              <span className="grid size-9 place-items-center rounded-full bg-whatsapp text-on-whatsapp">
                <CheckIcon />
              </span>
              {locale === "pa" ? `ਆਰਡਰ ਨੰਬਰ ${order}` : `Order number ${order}`}
            </p>
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
              <dt className="text-muted">{locale === "pa" ? "ਪੈਕੇਜ" : "Package"}</dt>
              <dd>{md.tier}</dd>
              <dt className="text-muted">{locale === "pa" ? "ਕਿਸ ਲਈ" : "For"}</dt>
              <dd>{md.for_name}</dd>
              <dt className="text-muted">{locale === "pa" ? "ਤਾਰੀਖ਼" : "Date"}</dt>
              <dd>{md.preferred_date}</dd>
            </dl>
            <p className="mt-6">
              {locale === "pa"
                ? "ਈਮੇਲ ਰਸੀਦ ਤੁਹਾਡੇ ਇਨਬਾਕਸ ਵਿੱਚ ਆ ਰਹੀ ਹੈ। ਆਨ-ਏਅਰ ਸਮਾਂ ਪੱਕਾ ਕਰਨ ਲਈ ਹੁਣੇ WhatsApp ’ਤੇ ਸੁਨੇਹਾ ਭੇਜੋ।"
                : "An email receipt is on its way. Send us a WhatsApp message now to confirm the air time."}
            </p>
            <a
              href={whatsappLink(settings.whatsappNumber, waText)}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp_join"
              data-track-label="dedication_confirm"
              className="btn btn-whatsapp btn-lg mt-6"
            >
              <WhatsAppIcon size={22} /> {locale === "pa" ? "WhatsApp ’ਤੇ ਪੱਕਾ ਕਰੋ" : "Confirm on WhatsApp"}
            </a>
          </div>
        ) : (
          <div className="card max-w-2xl p-6 md:p-8">
            <p>
              {locale === "pa"
                ? "ਸਾਨੂੰ ਇਸ ਬੁਕਿੰਗ ਦਾ ਭੁਗਤਾਨ ਨਹੀਂ ਮਿਲਿਆ। ਜੇ ਤੁਹਾਡੇ ਤੋਂ ਪੈਸੇ ਲਏ ਗਏ ਹਨ, ਤਾਂ WhatsApp ’ਤੇ ਸੰਪਰਕ ਕਰੋ ਅਤੇ ਅਸੀਂ ਤੁਰੰਤ ਮਦਦ ਕਰਾਂਗੇ।"
                : "We couldn’t find a completed payment for this booking. If you were charged, message us on WhatsApp and we’ll sort it out right away."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${locale}/dedications#book`} className="btn btn-primary">
                {m.cta.bookDedication}
              </Link>
              <a href={whatsappLink(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <WhatsAppIcon /> {m.cta.whatsapp}
              </a>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
