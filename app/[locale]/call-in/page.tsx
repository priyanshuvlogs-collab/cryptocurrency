import type { Metadata } from "next";
import Link from "next/link";
import { NextShowCountdown, NowPlaying } from "@/components/player/PlayerControls";
import { PageHeader, Section } from "@/components/ui/Page";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { getSettings } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("callIn", (await params).locale);
}

const COPY = {
  en: {
    h1: "Call in to Indi Radio",
    lead: "Indi Radio is Punjabi call-in radio: during live shows the studio line is open to listeners everywhere. Here’s how to get on air.",
    lineLabel: "Studio call-in line",
    whenTitle: "When to call",
    whenBody: "Call while a live show is on air. Between shows the station plays music, and the team may not be able to answer.",
    stepsTitle: "What to expect",
    steps: [
      "Call the studio line during a live show. If it’s busy, the lines are full, so try again in a few minutes.",
      "When the team answers, give your first name and the city you’re calling from.",
      "Turn down any radio, TV or live stream near you. The broadcast runs a few seconds behind and causes echo.",
      "When Indi brings you on air, speak clearly and close to the phone. You’re live around the world!",
    ],
    rulesTitle: "Our family-friendly standard",
    rulesIntro: "Families listen together, so every call follows the same simple rules:",
    rules: [
      "No swearing, slurs or abusive language, in any language.",
      "Respect other callers, guests and the host, especially when you disagree.",
      "No personal attacks, and no sharing other people’s private information.",
      "Don’t make accusations about named people or businesses that you can’t back up.",
      "Business promotions are welcome as paid advertising, not in call-ins.",
      "The host may end any call that breaks these rules.",
    ],
    recording: "Calls are broadcast live and may be recorded and shared as clips on Indi Radio’s website and social media. By calling in you agree to this.",
    whatsappTitle: "Can’t get through?",
    whatsappBody: "Send a WhatsApp message or voice note with your comment, question or shout-out. The team passes the best ones to Indi on air.",
  },
  pa: {
    h1: "ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਕਾਲ ਕਰੋ",
    lead: "ਇੰਡੀ ਰੇਡੀਓ ਪੰਜਾਬੀ ਕਾਲ-ਇਨ ਰੇਡੀਓ ਹੈ: ਲਾਈਵ ਸ਼ੋਆਂ ਦੌਰਾਨ ਸਟੂਡੀਓ ਲਾਈਨ ਹਰ ਥਾਂ ਦੇ ਸਰੋਤਿਆਂ ਲਈ ਖੁੱਲ੍ਹੀ ਹੁੰਦੀ ਹੈ। ਆਨ-ਏਅਰ ਆਉਣ ਦਾ ਤਰੀਕਾ ਇਹ ਹੈ।",
    lineLabel: "ਸਟੂਡੀਓ ਕਾਲ-ਇਨ ਲਾਈਨ",
    whenTitle: "ਕਦੋਂ ਕਾਲ ਕਰੀਏ",
    whenBody: "ਜਦੋਂ ਕੋਈ ਲਾਈਵ ਸ਼ੋਅ ਚੱਲ ਰਿਹਾ ਹੋਵੇ, ਉਦੋਂ ਕਾਲ ਕਰੋ। ਸ਼ੋਆਂ ਦੇ ਵਿਚਕਾਰ ਸਟੇਸ਼ਨ ’ਤੇ ਸੰਗੀਤ ਚੱਲਦਾ ਹੈ, ਅਤੇ ਹੋ ਸਕਦਾ ਹੈ ਟੀਮ ਫ਼ੋਨ ਨਾ ਚੁੱਕ ਸਕੇ।",
    stepsTitle: "ਕਾਲ ਕਿਵੇਂ ਹੁੰਦੀ ਹੈ",
    steps: [
      "ਲਾਈਵ ਸ਼ੋਅ ਦੌਰਾਨ ਸਟੂਡੀਓ ਲਾਈਨ ’ਤੇ ਕਾਲ ਕਰੋ। ਲਾਈਨ ਰੁੱਝੀ ਹੋਵੇ ਤਾਂ ਲਾਈਨਾਂ ਭਰੀਆਂ ਹਨ, ਕੁਝ ਮਿੰਟਾਂ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      "ਜਦੋਂ ਟੀਮ ਫ਼ੋਨ ਚੁੱਕੇ, ਆਪਣਾ ਨਾਂ ਅਤੇ ਸ਼ਹਿਰ ਦੱਸੋ।",
      "ਨੇੜੇ ਚੱਲ ਰਿਹਾ ਰੇਡੀਓ, ਟੀਵੀ ਜਾਂ ਲਾਈਵ ਸਟ੍ਰੀਮ ਬੰਦ ਕਰੋ। ਪ੍ਰਸਾਰਣ ਕੁਝ ਸਕਿੰਟ ਪਿੱਛੇ ਚੱਲਦਾ ਹੈ ਅਤੇ ਗੂੰਜ ਪੈਦਾ ਕਰਦਾ ਹੈ।",
      "ਜਦੋਂ ਇੰਡੀ ਤੁਹਾਨੂੰ ਆਨ-ਏਅਰ ਲੈਣ, ਫ਼ੋਨ ਦੇ ਨੇੜੇ ਸਾਫ਼ ਬੋਲੋ। ਤੁਸੀਂ ਦੁਨੀਆ ਭਰ ਵਿੱਚ ਲਾਈਵ ਹੋ!",
    ],
    rulesTitle: "ਪਰਿਵਾਰ ਨਾਲ ਸੁਣਨ ਯੋਗ ਮਿਆਰ",
    rulesIntro: "ਪਰਿਵਾਰ ਇਕੱਠੇ ਬੈਠ ਕੇ ਸੁਣਦੇ ਹਨ, ਇਸ ਲਈ ਹਰ ਕਾਲ ਲਈ ਇਹ ਸਧਾਰਨ ਨਿਯਮ ਹਨ:",
    rules: [
      "ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਗਾਲ੍ਹ, ਅਪਮਾਨਜਨਕ ਜਾਂ ਭੱਦੀ ਸ਼ਬਦਾਵਲੀ ਨਹੀਂ।",
      "ਦੂਜੇ ਕਾਲਰਾਂ, ਮਹਿਮਾਨਾਂ ਅਤੇ ਹੋਸਟ ਦਾ ਸਤਿਕਾਰ ਕਰੋ, ਖ਼ਾਸ ਕਰਕੇ ਅਸਹਿਮਤੀ ਵੇਲੇ।",
      "ਨਿੱਜੀ ਹਮਲੇ ਨਹੀਂ, ਅਤੇ ਦੂਜਿਆਂ ਦੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਨਹੀਂ ਕਰਨੀ।",
      "ਕਿਸੇ ਵਿਅਕਤੀ ਜਾਂ ਕਾਰੋਬਾਰ ’ਤੇ ਅਜਿਹੇ ਦੋਸ਼ ਨਾ ਲਗਾਓ ਜੋ ਸਾਬਤ ਨਾ ਕਰ ਸਕੋ।",
      "ਕਾਰੋਬਾਰ ਦੀ ਮਸ਼ਹੂਰੀ ਪੇਡ ਇਸ਼ਤਿਹਾਰ ਰਾਹੀਂ ਕਰੋ, ਕਾਲ-ਇਨ ਵਿੱਚ ਨਹੀਂ।",
      "ਨਿਯਮ ਤੋੜਨ ਵਾਲੀ ਕੋਈ ਵੀ ਕਾਲ ਹੋਸਟ ਕੱਟ ਸਕਦਾ ਹੈ।",
    ],
    recording: "ਕਾਲਾਂ ਲਾਈਵ ਪ੍ਰਸਾਰਿਤ ਹੁੰਦੀਆਂ ਹਨ ਅਤੇ ਰਿਕਾਰਡ ਕਰਕੇ ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਵੈੱਬਸਾਈਟ ਅਤੇ ਸੋਸ਼ਲ ਮੀਡੀਆ ’ਤੇ ਕਲਿੱਪਾਂ ਵਜੋਂ ਸਾਂਝੀਆਂ ਕੀਤੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ। ਕਾਲ ਕਰਕੇ ਤੁਸੀਂ ਇਸ ਨਾਲ ਸਹਿਮਤ ਹੁੰਦੇ ਹੋ।",
    whatsappTitle: "ਲਾਈਨ ਨਹੀਂ ਮਿਲ ਰਹੀ?",
    whatsappBody: "ਆਪਣੀ ਗੱਲ, ਸਵਾਲ ਜਾਂ ਸ਼ਾਊਟ-ਆਊਟ WhatsApp ਸੁਨੇਹੇ ਜਾਂ ਵੌਇਸ ਨੋਟ ਰਾਹੀਂ ਭੇਜੋ। ਟੀਮ ਚੰਗੇ ਸੁਨੇਹੇ ਆਨ-ਏਅਰ ਇੰਡੀ ਤੱਕ ਪਹੁੰਚਾਉਂਦੀ ਹੈ।",
  },
};

export default async function CallInPage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const settings = await getSettings();

  return (
    <>
      <PageHeader locale={locale} m={m} crumbs={[{ name: m.nav.callIn, path: PAGES.callIn.path }]} title={c.h1} lead={c.lead} />

      <section aria-label={c.lineLabel} className="container-ir py-10">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="card phulkari p-6 md:p-10">
            <p className="eyebrow">{c.lineLabel}</p>
            <a
              href={`tel:${settings.phoneE164}`}
              className="mt-2 block font-display text-[clamp(2.5rem,9vw,4.5rem)] leading-none font-black tracking-tight text-live tabular-nums hover:underline"
            >
              {settings.phoneDisplay}
            </a>
            <p className="mt-2 text-sm text-muted">[CONFIRM call-in number]</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${settings.phoneE164}`} className="btn btn-live btn-lg">
                <PhoneIcon size={22} /> {m.cta.callNow}
              </a>
              <a href={whatsappLink(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <WhatsAppIcon size={22} /> {m.cta.whatsapp}
              </a>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="card p-6">
              <NowPlaying />
            </div>
            <div className="card p-6">
              <NextShowCountdown compact />
              <Link href={`/${locale}/schedule`} className="link mt-3 inline-block">
                {m.cta.seeSchedule}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section id="when" title={c.whenTitle}>
        <p className="max-w-2xl text-lg">{c.whenBody}</p>
      </Section>

      <Section id="steps" title={c.stepsTitle}>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((step, i) => (
            <li key={step} className="reveal card p-6">
              <span className="grid size-10 place-items-center rounded-full bg-saffron font-display text-lg font-black text-on-saffron">
                {i + 1}
              </span>
              <p className="mt-3">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="rules" title={c.rulesTitle} intro={c.rulesIntro}>
        <ul className="prose-ir text-lg">
          {c.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-sm text-muted">{c.recording}</p>
      </Section>

      <Section id="whatsapp" title={c.whatsappTitle}>
        <div className="card flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl">{c.whatsappBody}</p>
          <a href={whatsappLink(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
            <WhatsAppIcon size={22} /> {m.cta.whatsapp}
          </a>
        </div>
      </Section>
    </>
  );
}
