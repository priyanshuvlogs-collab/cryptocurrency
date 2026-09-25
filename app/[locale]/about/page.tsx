import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader, Section } from "@/components/ui/Page";
import { getSettings } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { graph, STATION_ID } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import type { Locale } from "@/lib/types";

export const revalidate = 3600;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("about", (await params).locale);
}

/** Station story: 520 words (EN). Rewritten from scratch for Punjabi culture and community. */
const COPY = {
  en: {
    h1: "About Indi Radio",
    lead: "Live Punjabi radio from Surrey, British Columbia, made for Punjabi families wherever they call home.",
    sections: [
      {
        h: null,
        p: [
          "Indi Radio is a live Punjabi online radio station broadcasting from Surrey, British Columbia, Canada. It was founded by Indi Jaswal with one simple idea: Punjabi families living far from Punjab deserve a radio station that sounds like home. [CONFIRM: year Indi Radio launched]",
        ],
      },
      {
        h: "Rooted in Surrey",
        p: [
          "Surrey is home to one of the largest Punjabi communities anywhere outside India. It is a city of gurdwaras and kabaddi grounds, of banquet halls that are busy every weekend, of grandparents who still start the day with Punjabi radio and grandchildren who listen on their phones. Indi Radio grew out of that community, and it still sounds like it: familiar voices, local names, and conversations about the things people actually talk about at the dinner table.",
        ],
      },
      {
        h: "Radio you can talk back to",
        p: [
          "At the heart of Indi Radio is the live call-in. On Bhedan Da Kaal, Indi Jaswal’s flagship show, the phone lines open and listeners take the microphone. Callers share opinions, tell stories, ask questions and sometimes disagree, and Indi keeps the conversation lively, honest and respectful. Every call goes out live, so a listener in Surrey can hear a caller from Ludhiana, Leicester or Melbourne in the same hour.",
          "The station holds itself to a family-friendly standard. In many Punjabi homes the radio is on in the kitchen or the car with three generations listening, so every show is made for everyone in the room.",
        ],
      },
      {
        h: "Punjabi culture, every day",
        p: [
          "Between live shows, Indi Radio plays Punjabi music around the clock, from the newest releases to the classics that fill every wedding dance floor. The station celebrates the moments that matter to the community, including Vaisakhi, Lohri, Diwali, Gurpurab, weddings, birthdays and new business openings, with on-air dedications and shout-outs, and it shows up in person at melas and community events.",
        ],
      },
      {
        h: "Heard around the world",
        p: [
          "Because Indi Radio streams online, the Punjabi diaspora can listen wherever they live. Listeners tune in from across Canada and from India, the United Kingdom, Australia, the United States and Dubai: on this website, on the official Indi Radio app for iPhone and Android, and live on TikTok, YouTube and Facebook. The schedule converts every show time into the listener’s own time zone, so nobody has to do the maths to catch a live call-in.",
        ],
      },
      {
        h: "For the community, by the community",
        p: [
          "Indi Radio is community-first. Local businesses advertise on the station to reach Punjabi families they can’t reach any other way, and their support keeps Indi Radio free for everyone. Listeners shape what goes on air through their calls, song requests and WhatsApp messages.",
          "Whether you grew up with Punjabi radio or you are discovering it for the first time, you are welcome here. Press play, pick up the phone, and join the conversation.",
        ],
      },
    ],
    factsTitle: "Station facts",
    facts: [
      ["Name", "Indi Radio"],
      ["Founder & host", "Indi Jaswal"],
      ["Based in", "Surrey, British Columbia, Canada"],
      ["Language", "Punjabi (with English)"],
      ["Format", "Live call-in talk, Punjabi music, culture and community"],
      ["Flagship show", "Bhedan Da Kaal (ਭੇਡਾਂ ਦਾ ਕਾਲ)"],
      ["Listen on", "indiradio.ca, iPhone & Android apps, TikTok LIVE, YouTube, Facebook"],
    ],
    meet: "Meet Indi Jaswal",
    listen: "Listen live",
  },
  pa: {
    h1: "ਇੰਡੀ ਰੇਡੀਓ ਬਾਰੇ",
    lead: "ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਤੋਂ ਲਾਈਵ ਪੰਜਾਬੀ ਰੇਡੀਓ, ਉਹਨਾਂ ਪੰਜਾਬੀ ਪਰਿਵਾਰਾਂ ਲਈ ਜੋ ਜਿੱਥੇ ਵੀ ਵੱਸਦੇ ਹਨ।",
    sections: [
      {
        h: null,
        p: [
          "ਇੰਡੀ ਰੇਡੀਓ ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ, ਕੈਨੇਡਾ ਤੋਂ ਚੱਲਣ ਵਾਲਾ ਲਾਈਵ ਪੰਜਾਬੀ ਆਨਲਾਈਨ ਰੇਡੀਓ ਸਟੇਸ਼ਨ ਹੈ। ਇਸਨੂੰ ਇੰਡੀ ਜਸਵਾਲ ਨੇ ਇੱਕ ਸਿੱਧੀ ਜਿਹੀ ਸੋਚ ਨਾਲ ਸ਼ੁਰੂ ਕੀਤਾ: ਪੰਜਾਬ ਤੋਂ ਦੂਰ ਵੱਸਦੇ ਪੰਜਾਬੀ ਪਰਿਵਾਰਾਂ ਦਾ ਵੀ ਇੱਕ ਅਜਿਹਾ ਰੇਡੀਓ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਜੋ ਘਰ ਵਰਗਾ ਲੱਗੇ। [CONFIRM: ਇੰਡੀ ਰੇਡੀਓ ਸ਼ੁਰੂ ਹੋਣ ਦਾ ਸਾਲ]",
        ],
      },
      {
        h: "ਸਰੀ ਦੀਆਂ ਜੜ੍ਹਾਂ",
        p: [
          "ਸਰੀ ਵਿੱਚ ਭਾਰਤ ਤੋਂ ਬਾਹਰ ਪੰਜਾਬੀਆਂ ਦੇ ਸਭ ਤੋਂ ਵੱਡੇ ਭਾਈਚਾਰਿਆਂ ਵਿੱਚੋਂ ਇੱਕ ਵੱਸਦਾ ਹੈ। ਇਹ ਗੁਰਦੁਆਰਿਆਂ ਅਤੇ ਕਬੱਡੀ ਦੇ ਮੈਦਾਨਾਂ ਦਾ ਸ਼ਹਿਰ ਹੈ, ਹਰ ਹਫ਼ਤੇ ਭਰੇ ਰਹਿੰਦੇ ਬੈਂਕੁਇਟ ਹਾਲਾਂ ਦਾ, ਉਹਨਾਂ ਦਾਦਾ-ਦਾਦੀਆਂ ਦਾ ਜੋ ਅੱਜ ਵੀ ਦਿਨ ਦੀ ਸ਼ੁਰੂਆਤ ਪੰਜਾਬੀ ਰੇਡੀਓ ਨਾਲ ਕਰਦੇ ਹਨ, ਅਤੇ ਉਹਨਾਂ ਪੋਤੇ-ਪੋਤੀਆਂ ਦਾ ਜੋ ਫ਼ੋਨ ’ਤੇ ਸੁਣਦੇ ਹਨ। ਇੰਡੀ ਰੇਡੀਓ ਇਸੇ ਭਾਈਚਾਰੇ ਵਿੱਚੋਂ ਉੱਗਿਆ ਹੈ, ਅਤੇ ਅੱਜ ਵੀ ਉਸੇ ਵਰਗਾ ਲੱਗਦਾ ਹੈ: ਜਾਣੀਆਂ-ਪਛਾਣੀਆਂ ਆਵਾਜ਼ਾਂ, ਆਪਣੇ ਨਾਂ, ਅਤੇ ਉਹ ਗੱਲਾਂ ਜੋ ਲੋਕ ਸੱਚਮੁੱਚ ਰੋਟੀ ਖਾਂਦਿਆਂ ਕਰਦੇ ਹਨ।",
        ],
      },
      {
        h: "ਅਜਿਹਾ ਰੇਡੀਓ ਜਿਸ ਨਾਲ ਗੱਲ ਕਰ ਸਕੋ",
        p: [
          "ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਜਿੰਦ-ਜਾਨ ਹੈ ਲਾਈਵ ਕਾਲ-ਇਨ। ਇੰਡੀ ਜਸਵਾਲ ਦੇ ਮੁੱਖ ਸ਼ੋਅ ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਵਿੱਚ ਫ਼ੋਨ ਲਾਈਨਾਂ ਖੁੱਲ੍ਹਦੀਆਂ ਹਨ ਅਤੇ ਮਾਈਕ ਸਰੋਤਿਆਂ ਦੇ ਹੱਥ ਆ ਜਾਂਦਾ ਹੈ। ਕਾਲਰ ਆਪਣੇ ਵਿਚਾਰ ਦੱਸਦੇ ਹਨ, ਕਹਾਣੀਆਂ ਸੁਣਾਉਂਦੇ ਹਨ, ਸਵਾਲ ਪੁੱਛਦੇ ਹਨ ਅਤੇ ਕਦੇ-ਕਦੇ ਅਸਹਿਮਤ ਵੀ ਹੁੰਦੇ ਹਨ, ਅਤੇ ਇੰਡੀ ਗੱਲਬਾਤ ਨੂੰ ਜਿਊਂਦੀ, ਸੱਚੀ ਅਤੇ ਸਤਿਕਾਰ ਵਾਲੀ ਰੱਖਦੇ ਹਨ। ਹਰ ਕਾਲ ਲਾਈਵ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ਸਰੀ ਦਾ ਸਰੋਤਾ ਉਸੇ ਘੰਟੇ ਵਿੱਚ ਲੁਧਿਆਣੇ, ਲੈਸਟਰ ਜਾਂ ਮੈਲਬਰਨ ਦੇ ਕਾਲਰ ਨੂੰ ਸੁਣ ਸਕਦਾ ਹੈ।",
          "ਸਟੇਸ਼ਨ ਪਰਿਵਾਰ ਨਾਲ ਸੁਣਨ ਯੋਗ ਮਿਆਰ ’ਤੇ ਚੱਲਦਾ ਹੈ। ਬਹੁਤ ਸਾਰੇ ਪੰਜਾਬੀ ਘਰਾਂ ਵਿੱਚ ਰਸੋਈ ਜਾਂ ਕਾਰ ਵਿੱਚ ਤਿੰਨ ਪੀੜ੍ਹੀਆਂ ਇਕੱਠੀਆਂ ਰੇਡੀਓ ਸੁਣਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਹਰ ਸ਼ੋਅ ਕਮਰੇ ਵਿੱਚ ਬੈਠੇ ਹਰ ਜੀਅ ਲਈ ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ।",
        ],
      },
      {
        h: "ਹਰ ਦਿਨ ਪੰਜਾਬੀ ਸੱਭਿਆਚਾਰ",
        p: [
          "ਲਾਈਵ ਸ਼ੋਆਂ ਦੇ ਵਿਚਕਾਰ ਇੰਡੀ ਰੇਡੀਓ ਦਿਨ-ਰਾਤ ਪੰਜਾਬੀ ਸੰਗੀਤ ਚਲਾਉਂਦਾ ਹੈ, ਨਵੇਂ ਗੀਤਾਂ ਤੋਂ ਲੈ ਕੇ ਉਹਨਾਂ ਪੁਰਾਣੇ ਗੀਤਾਂ ਤੱਕ ਜਿਨ੍ਹਾਂ ’ਤੇ ਹਰ ਵਿਆਹ ਵਿੱਚ ਭੰਗੜੇ ਪੈਂਦੇ ਹਨ। ਸਟੇਸ਼ਨ ਭਾਈਚਾਰੇ ਦੇ ਖ਼ਾਸ ਮੌਕੇ ਮਨਾਉਂਦਾ ਹੈ, ਜਿਵੇਂ ਵਿਸਾਖੀ, ਲੋਹੜੀ, ਦੀਵਾਲੀ, ਗੁਰਪੁਰਬ, ਵਿਆਹ, ਜਨਮਦਿਨ ਅਤੇ ਨਵੇਂ ਕਾਰੋਬਾਰਾਂ ਦੇ ਉਦਘਾਟਨ, ਆਨ-ਏਅਰ ਸੁਨੇਹਿਆਂ ਅਤੇ ਸ਼ਾਊਟ-ਆਊਟਾਂ ਨਾਲ, ਅਤੇ ਮੇਲਿਆਂ ਤੇ ਭਾਈਚਾਰਕ ਸਮਾਗਮਾਂ ਵਿੱਚ ਖ਼ੁਦ ਪਹੁੰਚਦਾ ਹੈ।",
        ],
      },
      {
        h: "ਦੁਨੀਆ ਭਰ ਵਿੱਚ ਸੁਣਿਆ ਜਾਂਦਾ",
        p: [
          "ਇੰਡੀ ਰੇਡੀਓ ਆਨਲਾਈਨ ਚੱਲਦਾ ਹੈ, ਇਸ ਲਈ ਪਰਵਾਸੀ ਪੰਜਾਬੀ ਜਿੱਥੇ ਵੀ ਰਹਿੰਦੇ ਹਨ, ਸੁਣ ਸਕਦੇ ਹਨ। ਸਰੋਤੇ ਪੂਰੇ ਕੈਨੇਡਾ ਤੋਂ ਅਤੇ ਭਾਰਤ, ਯੂ.ਕੇ., ਆਸਟ੍ਰੇਲੀਆ, ਅਮਰੀਕਾ ਅਤੇ ਦੁਬਈ ਤੋਂ ਸੁਣਦੇ ਹਨ: ਇਸ ਵੈੱਬਸਾਈਟ ’ਤੇ, iPhone ਅਤੇ Android ਲਈ ਅਧਿਕਾਰਤ ਇੰਡੀ ਰੇਡੀਓ ਐਪ ’ਤੇ, ਅਤੇ TikTok, YouTube ਤੇ Facebook ’ਤੇ ਲਾਈਵ। ਸਮਾਂ-ਸੂਚੀ ਹਰ ਸ਼ੋਅ ਦਾ ਸਮਾਂ ਸਰੋਤੇ ਦੇ ਆਪਣੇ ਟਾਈਮ ਜ਼ੋਨ ਵਿੱਚ ਬਦਲ ਦਿੰਦੀ ਹੈ, ਤਾਂ ਜੋ ਲਾਈਵ ਕਾਲ-ਇਨ ਫੜਨ ਲਈ ਕਿਸੇ ਨੂੰ ਹਿਸਾਬ ਨਾ ਲਾਉਣਾ ਪਵੇ।",
        ],
      },
      {
        h: "ਭਾਈਚਾਰੇ ਲਈ, ਭਾਈਚਾਰੇ ਵੱਲੋਂ",
        p: [
          "ਇੰਡੀ ਰੇਡੀਓ ਲਈ ਭਾਈਚਾਰਾ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਹੈ। ਸਥਾਨਕ ਕਾਰੋਬਾਰ ਸਟੇਸ਼ਨ ’ਤੇ ਮਸ਼ਹੂਰੀ ਕਰਕੇ ਉਹਨਾਂ ਪੰਜਾਬੀ ਪਰਿਵਾਰਾਂ ਤੱਕ ਪਹੁੰਚਦੇ ਹਨ ਜਿਨ੍ਹਾਂ ਤੱਕ ਹੋਰ ਕਿਸੇ ਤਰੀਕੇ ਪਹੁੰਚਣਾ ਔਖਾ ਹੈ, ਅਤੇ ਉਹਨਾਂ ਦੇ ਸਹਿਯੋਗ ਨਾਲ ਇੰਡੀ ਰੇਡੀਓ ਹਰ ਕਿਸੇ ਲਈ ਮੁਫ਼ਤ ਰਹਿੰਦਾ ਹੈ। ਆਨ-ਏਅਰ ਕੀ ਜਾਵੇਗਾ, ਇਹ ਸਰੋਤੇ ਆਪਣੀਆਂ ਕਾਲਾਂ, ਗੀਤਾਂ ਦੀਆਂ ਫ਼ਰਮਾਇਸ਼ਾਂ ਅਤੇ WhatsApp ਸੁਨੇਹਿਆਂ ਨਾਲ ਤੈਅ ਕਰਦੇ ਹਨ।",
          "ਚਾਹੇ ਤੁਸੀਂ ਪੰਜਾਬੀ ਰੇਡੀਓ ਸੁਣਦਿਆਂ ਵੱਡੇ ਹੋਏ ਹੋ ਜਾਂ ਪਹਿਲੀ ਵਾਰ ਸੁਣ ਰਹੇ ਹੋ, ਤੁਹਾਡਾ ਇੱਥੇ ਸਵਾਗਤ ਹੈ। ਪਲੇਅ ਦਬਾਓ, ਫ਼ੋਨ ਚੁੱਕੋ, ਅਤੇ ਗੱਲਬਾਤ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ।",
        ],
      },
    ],
    factsTitle: "ਸਟੇਸ਼ਨ ਬਾਰੇ ਤੱਥ",
    facts: [
      ["ਨਾਂ", "ਇੰਡੀ ਰੇਡੀਓ (Indi Radio)"],
      ["ਸੰਸਥਾਪਕ ਅਤੇ ਹੋਸਟ", "ਇੰਡੀ ਜਸਵਾਲ"],
      ["ਕਿੱਥੋਂ", "ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ, ਕੈਨੇਡਾ"],
      ["ਭਾਸ਼ਾ", "ਪੰਜਾਬੀ (ਅੰਗਰੇਜ਼ੀ ਨਾਲ)"],
      ["ਫ਼ਾਰਮੈਟ", "ਲਾਈਵ ਕਾਲ-ਇਨ ਗੱਲਬਾਤ, ਪੰਜਾਬੀ ਸੰਗੀਤ, ਸੱਭਿਆਚਾਰ ਅਤੇ ਭਾਈਚਾਰਾ"],
      ["ਮੁੱਖ ਸ਼ੋਅ", "ਭੇਡਾਂ ਦਾ ਕਾਲ (Bhedan Da Kaal)"],
      ["ਕਿੱਥੇ ਸੁਣੋ", "indiradio.ca, iPhone ਅਤੇ Android ਐਪ, TikTok LIVE, YouTube, Facebook"],
    ],
    meet: "ਇੰਡੀ ਜਸਵਾਲ ਨੂੰ ਮਿਲੋ",
    listen: "ਲਾਈਵ ਸੁਣੋ",
  },
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const settings = await getSettings();

  return (
    <>
      <JsonLd
        data={graph({ "@type": "AboutPage", url: absoluteUrl(`/${locale}/about`), about: { "@id": STATION_ID }, inLanguage: locale === "pa" ? "pa" : "en-CA" })}
      />
      <PageHeader locale={locale} m={m} crumbs={[{ name: m.nav.about, path: PAGES.about.path }]} title={c.h1} lead={c.lead} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
          <article className="prose-ir text-lg">
            {c.sections.map((s, i) => (
              <div key={i} className="space-y-4">
                {s.h ? <h2>{s.h}</h2> : null}
                {s.p.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            ))}
          </article>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h2 className="text-lg font-extrabold">{c.factsTitle}</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {c.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-muted">{m.nav.callIn}</dt>
                  <dd className="font-semibold">
                    <a href={`tel:${settings.phoneE164}`} className="link">
                      {settings.phoneDisplay}
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="mt-6 grid gap-2">
                <Link href={`/${locale}/listen-live`} className="btn btn-primary">
                  {c.listen}
                </Link>
                <Link href={`/${locale}/indi-jaswal`} className="btn btn-ghost">
                  {c.meet}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
