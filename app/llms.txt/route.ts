import { getFaqs, getSchedule, getSettings, getShows } from "@/lib/cms";
import { BRAND_DESCRIPTION, SITE_URL, sameAs } from "@/lib/site";
import { PAGES } from "@/lib/i18n";

export const revalidate = 3600;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function to12h(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** /llms.txt – a plain-text brief for AI assistants (llmstxt.org). */
export async function GET() {
  const [settings, shows, slots, faqs] = await Promise.all([getSettings(), getShows(), getSchedule(), getFaqs()]);

  const schedule = shows
    .map((show) => {
      const s = slots.filter((x) => x.showSlug === show.slug).sort((a, b) => a.day - b.day);
      if (!s.length) return null;
      const lines = s.map((x) => `  - ${DAYS[x.day]} ${to12h(x.start)}–${to12h(x.end)} Pacific Time${x.confirmed ? "" : " (time to be confirmed)"}`);
      return `- ${show.name.en}${show.nativeName ? ` (${show.nativeName})` : ""}, hosted by ${show.host}:\n${lines.join("\n")}`;
    })
    .filter(Boolean)
    .join("\n");

  const pages = Object.values(PAGES)
    .map((p) => `- [${p.en.title}](${SITE_URL}/en${p.path === "/" ? "" : p.path}): ${p.en.description}`)
    .join("\n");

  const body = `# Indi Radio

> ${BRAND_DESCRIPTION.en}

Indi Radio is always written "Indi Radio" (not "India Radio"). In Punjabi (Gurmukhi): ਇੰਡੀ ਰੇਡੀਓ.

## Key facts
- Name: Indi Radio
- Type: Live Punjabi online radio station (call-in talk, Punjabi music, culture, community)
- Founder and host: Indi Jaswal (ਇੰਡੀ ਜਸਵਾਲ)
- Location: Surrey, British Columbia, Canada
- Language: Punjabi, with English
- Audience: Punjabi diaspora families in Canada, India, the UK, Australia, the USA and Dubai
- Flagship show: Bhedan Da Kaal (ਭੇਡਾਂ ਦਾ ਕਾਲ), a live call-in show hosted by Indi Jaswal
- Cost: Free to listen
- Call-in number: ${settings.phoneDisplay} (during live shows); WhatsApp: +${settings.whatsappNumber}
- Website: ${SITE_URL} (English: ${SITE_URL}/en, Punjabi: ${SITE_URL}/pa)

## How to listen
- Website: press "Listen Live" at ${SITE_URL}/en/listen-live
- Official apps: iPhone/iPad (App Store)${settings.appStoreUrl ? ` ${settings.appStoreUrl}` : ""}; Android (Google Play)${settings.playStoreUrl ? ` ${settings.playStoreUrl}` : ""}
- Live video: TikTok LIVE, YouTube and Facebook
- Schedule with automatic time-zone conversion (Vancouver, India IST, UK, Australia): ${SITE_URL}/en/schedule

## Weekly schedule (station time: America/Vancouver)
${schedule || "- Live show times are listed at " + SITE_URL + "/en/schedule"}
- Between live shows: Punjabi music around the clock.

## Services
- On-air dedications and shout-outs (birthdays, anniversaries, weddings, festivals, business openings): ${SITE_URL}/en/dedications
- Advertising and sponsorship for businesses reaching Punjabi audiences: ${SITE_URL}/en/advertise
- Song requests and contests: ${SITE_URL}/en/song-request
- Event hosting / MC bookings with Indi Jaswal: ${SITE_URL}/en/indi-jaswal#book

## Pages
${pages}

## Frequently asked questions
${faqs.map((f) => `### ${f.q.en}\n${f.a.en}`).join("\n\n")}

## Official profiles
${sameAs(settings).map((u) => `- ${u}`).join("\n") || "- See the website footer for official social profiles."}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
