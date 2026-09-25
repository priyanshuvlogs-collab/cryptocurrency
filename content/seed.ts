/**
 * Built-in content. Used when Sanity is not connected, and as the initial
 * import for the CMS (see studio/seed). Anything the station has not
 * verified is marked [CONFIRM]: nothing here is invented as fact.
 */
import type {
  AdPackage,
  Announcement,
  CommunityEvent,
  DedicationTier,
  Faq,
  PressItem,
  ScheduleSlot,
  Show,
  SocialPost,
  SpecialBroadcast,
  Sponsor,
} from "@/lib/types";

export const shows: Show[] = [
  {
    slug: "bhedan-da-kaal",
    name: { en: "Bhedan Da Kaal", pa: "ਭੇਡਾਂ ਦਾ ਕਾਲ" },
    nativeName: "ਭੇਡਾਂ ਦਾ ਕਾਲ",
    tagline: {
      en: "Indi Jaswal’s flagship live call-in show: your voice, on air, unfiltered and family-friendly.",
      pa: "ਇੰਡੀ ਜਸਵਾਲ ਦਾ ਮੁੱਖ ਲਾਈਵ ਕਾਲ-ਇਨ ਸ਼ੋਅ: ਤੁਹਾਡੀ ਆਵਾਜ਼, ਸਿੱਧੀ ਆਨ-ਏਅਰ, ਖੁੱਲ੍ਹੀ ਗੱਲ ਪਰ ਪਰਿਵਾਰ ਨਾਲ ਸੁਣਨ ਯੋਗ।",
    },
    description: [
      {
        en: "Bhedan Da Kaal is the heartbeat of Indi Radio. Indi Jaswal opens the phone lines and Punjabi listeners from Surrey, across Canada and around the world call in live to share their views, their stories and sometimes a good laugh.",
        pa: "‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਧੜਕਣ ਹੈ। ਇੰਡੀ ਜਸਵਾਲ ਫ਼ੋਨ ਲਾਈਨਾਂ ਖੋਲ੍ਹਦੇ ਹਨ ਅਤੇ ਸਰੀ, ਪੂਰੇ ਕੈਨੇਡਾ ਅਤੇ ਦੁਨੀਆ ਭਰ ਤੋਂ ਪੰਜਾਬੀ ਸਰੋਤੇ ਲਾਈਵ ਕਾਲ ਕਰਕੇ ਆਪਣੇ ਵਿਚਾਰ, ਆਪਣੀਆਂ ਕਹਾਣੀਆਂ ਅਤੇ ਕਦੇ-ਕਦੇ ਹਾਸਾ-ਠੱਠਾ ਸਾਂਝਾ ਕਰਦੇ ਹਨ।",
      },
      {
        en: "The show is live, unscripted and built around the people calling in. Every caller is welcome, and the conversation stays respectful so the whole family can listen together.",
        pa: "ਇਹ ਸ਼ੋਅ ਲਾਈਵ ਹੈ, ਬਿਨਾਂ ਸਕ੍ਰਿਪਟ ਦੇ, ਅਤੇ ਕਾਲ ਕਰਨ ਵਾਲਿਆਂ ਦੁਆਲੇ ਘੁੰਮਦਾ ਹੈ। ਹਰ ਕਾਲਰ ਦਾ ਸਵਾਗਤ ਹੈ, ਅਤੇ ਗੱਲਬਾਤ ਸਤਿਕਾਰ ਵਾਲੀ ਰਹਿੰਦੀ ਹੈ ਤਾਂ ਜੋ ਸਾਰਾ ਪਰਿਵਾਰ ਇਕੱਠੇ ਬੈਠ ਕੇ ਸੁਣ ਸਕੇ।",
      },
      {
        en: "[CONFIRM: one paragraph from Indi Jaswal on what the name ‘Bhedan Da Kaal’ means and the topics the show covers.]",
        pa: "[CONFIRM: ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਨਾਂ ਦੇ ਅਰਥ ਅਤੇ ਸ਼ੋਅ ਦੇ ਵਿਸ਼ਿਆਂ ਬਾਰੇ ਇੰਡੀ ਜਸਵਾਲ ਵੱਲੋਂ ਇੱਕ ਪੈਰਾ।]",
      },
    ],
    host: "Indi Jaswal",
    image: null,
    youtubePlaylistId: null, // [CONFIRM] YouTube playlist ID for this show
    keywords: ["bhedan", "ਭੇਡਾਂ", "kaal"],
    callIn: true,
    featured: true,
  },
  {
    slug: "punjabi-music",
    name: { en: "Punjabi Music Non-Stop", pa: "ਨਾਨ-ਸਟਾਪ ਪੰਜਾਬੀ ਸੰਗੀਤ" },
    tagline: {
      en: "Punjabi music between the live shows, around the clock.",
      pa: "ਲਾਈਵ ਸ਼ੋਆਂ ਦੇ ਵਿਚਕਾਰ, ਦਿਨ-ਰਾਤ ਪੰਜਾਬੀ ਸੰਗੀਤ।",
    },
    description: [
      {
        en: "When the phone lines are closed, Indi Radio keeps playing Punjabi music for listeners in every time zone: new releases, classics your parents love and songs for every family celebration.",
        pa: "ਜਦੋਂ ਫ਼ੋਨ ਲਾਈਨਾਂ ਬੰਦ ਹੁੰਦੀਆਂ ਹਨ, ਇੰਡੀ ਰੇਡੀਓ ਹਰ ਟਾਈਮ ਜ਼ੋਨ ਦੇ ਸਰੋਤਿਆਂ ਲਈ ਪੰਜਾਬੀ ਸੰਗੀਤ ਚਲਾਉਂਦਾ ਰਹਿੰਦਾ ਹੈ: ਨਵੇਂ ਗੀਤ, ਮਾਪਿਆਂ ਦੇ ਮਨਪਸੰਦ ਪੁਰਾਣੇ ਗੀਤ, ਅਤੇ ਹਰ ਪਰਿਵਾਰਕ ਖ਼ੁਸ਼ੀ ਲਈ ਗੀਤ।",
      },
      {
        en: "Have a song you want to hear? Send a request and it may be played on air.",
        pa: "ਕੋਈ ਗੀਤ ਸੁਣਨਾ ਚਾਹੁੰਦੇ ਹੋ? ਫ਼ਰਮਾਇਸ਼ ਭੇਜੋ, ਹੋ ਸਕਦਾ ਹੈ ਉਹ ਆਨ-ਏਅਰ ਚੱਲੇ।",
      },
    ],
    host: "Indi Radio",
    image: null,
    youtubePlaylistId: null,
    keywords: ["song", "music", "ਗੀਤ"],
    callIn: false,
    featured: false,
  },
];

/**
 * [CONFIRM] Draft schedule. Every slot is `confirmed: false` until the
 * station supplies real times (Vancouver time). The site flags unconfirmed
 * times visibly.
 */
export const schedule: ScheduleSlot[] = [
  { id: "bdk-mon", showSlug: "bhedan-da-kaal", day: 1, start: "19:00", end: "21:00", live: true, confirmed: false },
  { id: "bdk-tue", showSlug: "bhedan-da-kaal", day: 2, start: "19:00", end: "21:00", live: true, confirmed: false },
  { id: "bdk-wed", showSlug: "bhedan-da-kaal", day: 3, start: "19:00", end: "21:00", live: true, confirmed: false },
  { id: "bdk-thu", showSlug: "bhedan-da-kaal", day: 4, start: "19:00", end: "21:00", live: true, confirmed: false },
  { id: "bdk-fri", showSlug: "bhedan-da-kaal", day: 5, start: "19:00", end: "21:00", live: true, confirmed: false },
];

export const specialBroadcasts: SpecialBroadcast[] = [];

export const faqs: Faq[] = [
  {
    id: "listen-live",
    category: "listening",
    q: { en: "How do I listen to Indi Radio live?", pa: "ਇੰਡੀ ਰੇਡੀਓ ਲਾਈਵ ਕਿਵੇਂ ਸੁਣਾਂ?" },
    a: {
      en: "Press Listen Live on indiradio.ca and the stream starts instantly in your browser on any phone or computer. You can also listen on the free Indi Radio app for iPhone and Android, or watch Indi Jaswal live on TikTok, YouTube and Facebook. The player keeps playing while you browse the site.",
      pa: "indiradio.ca ’ਤੇ ‘ਲਾਈਵ ਸੁਣੋ’ ਦਬਾਓ, ਸਟ੍ਰੀਮ ਤੁਰੰਤ ਤੁਹਾਡੇ ਫ਼ੋਨ ਜਾਂ ਕੰਪਿਊਟਰ ਦੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਸ਼ੁਰੂ ਹੋ ਜਾਂਦੀ ਹੈ। ਤੁਸੀਂ iPhone ਅਤੇ Android ਲਈ ਮੁਫ਼ਤ ਇੰਡੀ ਰੇਡੀਓ ਐਪ ’ਤੇ ਵੀ ਸੁਣ ਸਕਦੇ ਹੋ, ਜਾਂ ਇੰਡੀ ਜਸਵਾਲ ਨੂੰ TikTok, YouTube ਅਤੇ Facebook ’ਤੇ ਲਾਈਵ ਦੇਖ ਸਕਦੇ ਹੋ। ਵੈੱਬਸਾਈਟ ਦੇ ਹੋਰ ਪੰਨੇ ਖੋਲ੍ਹਣ ਵੇਲੇ ਵੀ ਰੇਡੀਓ ਚੱਲਦਾ ਰਹਿੰਦਾ ਹੈ।",
    },
  },
  {
    id: "what-is",
    category: "general",
    q: { en: "What is Indi Radio?", pa: "ਇੰਡੀ ਰੇਡੀਓ ਕੀ ਹੈ?" },
    a: {
      en: "Indi Radio is a live Punjabi online radio station based in Surrey, British Columbia, Canada. Founded and hosted by Indi Jaswal, it broadcasts live call-in talk shows, Punjabi music and cultural programming to Punjabi families in Canada, India, the UK, Australia, the USA and Dubai.",
      pa: "ਇੰਡੀ ਰੇਡੀਓ ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ (ਕੈਨੇਡਾ) ਤੋਂ ਚੱਲਣ ਵਾਲਾ ਲਾਈਵ ਪੰਜਾਬੀ ਆਨਲਾਈਨ ਰੇਡੀਓ ਸਟੇਸ਼ਨ ਹੈ। ਇੰਡੀ ਜਸਵਾਲ ਵੱਲੋਂ ਸ਼ੁਰੂ ਕੀਤਾ ਇਹ ਸਟੇਸ਼ਨ ਲਾਈਵ ਕਾਲ-ਇਨ ਸ਼ੋਅ, ਪੰਜਾਬੀ ਸੰਗੀਤ ਅਤੇ ਸੱਭਿਆਚਾਰਕ ਪ੍ਰੋਗਰਾਮ ਕੈਨੇਡਾ, ਭਾਰਤ, ਯੂ.ਕੇ., ਆਸਟ੍ਰੇਲੀਆ, ਅਮਰੀਕਾ ਅਤੇ ਦੁਬਈ ਦੇ ਪੰਜਾਬੀ ਪਰਿਵਾਰਾਂ ਤੱਕ ਪਹੁੰਚਾਉਂਦਾ ਹੈ।",
    },
  },
  {
    id: "bdk-time",
    category: "shows",
    q: { en: "What time is Bhedan Da Kaal?", pa: "‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਕਿਸ ਸਮੇਂ ਆਉਂਦਾ ਹੈ?" },
    a: {
      en: "Bhedan Da Kaal airs live on Indi Radio [CONFIRM: days and start time, Pacific Time]. The schedule page converts the time automatically to your own time zone, with one-tap views for Vancouver, India, the UK and Australia, and a countdown to the next live show.",
      pa: "‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਲਾਈਵ ਆਉਂਦਾ ਹੈ [CONFIRM: ਦਿਨ ਅਤੇ ਸਮਾਂ, ਪੈਸੀਫ਼ਿਕ ਟਾਈਮ]। ਸਮਾਂ-ਸੂਚੀ ਵਾਲਾ ਪੰਨਾ ਸਮਾਂ ਆਪਣੇ-ਆਪ ਤੁਹਾਡੇ ਟਾਈਮ ਜ਼ੋਨ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ। ਵੈਨਕੂਵਰ, ਭਾਰਤ, ਯੂ.ਕੇ. ਅਤੇ ਆਸਟ੍ਰੇਲੀਆ ਲਈ ਇੱਕ-ਕਲਿੱਕ ਬਟਨ ਹਨ, ਅਤੇ ਅਗਲੇ ਲਾਈਵ ਸ਼ੋਅ ਦੀ ਉਲਟੀ ਗਿਣਤੀ ਵੀ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ।",
    },
  },
  {
    id: "call-in",
    category: "call-in",
    q: { en: "How can I call in to Indi Radio?", pa: "ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਕਾਲ ਕਿਵੇਂ ਕਰਾਂ?" },
    a: {
      en: "During live shows, call Indi Radio at 778-834-0325 [CONFIRM]. If the line is busy, keep trying or send a WhatsApp message and the team will pass it to Indi. Please keep your language family-friendly, because every call is broadcast live to listeners around the world.",
      pa: "ਲਾਈਵ ਸ਼ੋਅ ਦੌਰਾਨ ਇੰਡੀ ਰੇਡੀਓ ਨੂੰ 778-834-0325 [CONFIRM] ’ਤੇ ਕਾਲ ਕਰੋ। ਜੇ ਲਾਈਨ ਰੁੱਝੀ ਹੋਵੇ ਤਾਂ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ WhatsApp ਸੁਨੇਹਾ ਭੇਜੋ, ਟੀਮ ਇਸਨੂੰ ਇੰਡੀ ਤੱਕ ਪਹੁੰਚਾ ਦੇਵੇਗੀ। ਕਿਰਪਾ ਕਰਕੇ ਭਾਸ਼ਾ ਪਰਿਵਾਰ ਨਾਲ ਸੁਣਨ ਯੋਗ ਰੱਖੋ, ਕਿਉਂਕਿ ਹਰ ਕਾਲ ਦੁਨੀਆ ਭਰ ਵਿੱਚ ਲਾਈਵ ਸੁਣੀ ਜਾਂਦੀ ਹੈ।",
    },
  },
  {
    id: "free",
    category: "listening",
    q: { en: "Is Indi Radio free?", pa: "ਕੀ ਇੰਡੀ ਰੇਡੀਓ ਮੁਫ਼ਤ ਹੈ?" },
    a: {
      en: "Yes. Listening to Indi Radio is completely free on the website, the official iPhone and Android apps, TikTok, YouTube and Facebook. There is no subscription and no sign-up. Paid options exist only if you want something extra, such as an on-air birthday dedication or advertising for your business.",
      pa: "ਹਾਂ। ਵੈੱਬਸਾਈਟ, ਅਧਿਕਾਰਤ iPhone ਅਤੇ Android ਐਪ, TikTok, YouTube ਅਤੇ Facebook ’ਤੇ ਇੰਡੀ ਰੇਡੀਓ ਸੁਣਨਾ ਬਿਲਕੁਲ ਮੁਫ਼ਤ ਹੈ। ਕੋਈ ਸਬਸਕ੍ਰਿਪਸ਼ਨ ਜਾਂ ਸਾਈਨ-ਅੱਪ ਨਹੀਂ। ਪੈਸੇ ਸਿਰਫ਼ ਵਾਧੂ ਸੇਵਾਵਾਂ ਲਈ ਲੱਗਦੇ ਹਨ, ਜਿਵੇਂ ਆਨ-ਏਅਰ ਜਨਮਦਿਨ ਸੁਨੇਹਾ ਜਾਂ ਤੁਹਾਡੇ ਕਾਰੋਬਾਰ ਦੀ ਮਸ਼ਹੂਰੀ।",
    },
  },
  {
    id: "birthday",
    category: "dedications",
    q: { en: "How do I book a birthday dedication?", pa: "ਜਨਮਦਿਨ ਦਾ ਸੁਨੇਹਾ ਕਿਵੇਂ ਬੁੱਕ ਕਰਾਂ?" },
    a: {
      en: "Open the Dedications page, choose Birthday, pick a package, then enter the name, your message and the preferred date. You can write the message in English or Punjabi. After paying securely online you get an email receipt and a WhatsApp link to confirm the details with the Indi Radio team.",
      pa: "‘ਸੁਨੇਹੇ ਤੇ ਸ਼ਾਊਟ-ਆਊਟ’ ਪੰਨਾ ਖੋਲ੍ਹੋ, ‘ਜਨਮਦਿਨ’ ਚੁਣੋ, ਪੈਕੇਜ ਚੁਣੋ, ਫਿਰ ਨਾਂ, ਆਪਣਾ ਸੁਨੇਹਾ ਅਤੇ ਪਸੰਦੀਦਾ ਤਾਰੀਖ਼ ਲਿਖੋ। ਸੁਨੇਹਾ ਅੰਗਰੇਜ਼ੀ ਜਾਂ ਪੰਜਾਬੀ ਵਿੱਚ ਲਿਖ ਸਕਦੇ ਹੋ। ਸੁਰੱਖਿਅਤ ਆਨਲਾਈਨ ਭੁਗਤਾਨ ਤੋਂ ਬਾਅਦ ਤੁਹਾਨੂੰ ਈਮੇਲ ਰਸੀਦ ਅਤੇ ਇੰਡੀ ਰੇਡੀਓ ਟੀਮ ਨਾਲ ਵੇਰਵੇ ਪੱਕੇ ਕਰਨ ਲਈ WhatsApp ਲਿੰਕ ਮਿਲਦਾ ਹੈ।",
    },
  },
  {
    id: "advertise",
    category: "advertising",
    q: {
      en: "How can my business advertise on Punjabi radio in Surrey?",
      pa: "ਮੇਰਾ ਕਾਰੋਬਾਰ ਸਰੀ ਦੇ ਪੰਜਾਬੀ ਰੇਡੀਓ ’ਤੇ ਮਸ਼ਹੂਰੀ ਕਿਵੇਂ ਕਰੇ?",
    },
    a: {
      en: "Indi Radio offers on-air spots, show sponsorships and presenting partnerships that reach Punjabi families in Surrey, across Canada and worldwide. Visit the Advertise page to see packages and audience figures, download the media kit and send an inquiry. The team replies with a plan built around your business and budget.",
      pa: "ਇੰਡੀ ਰੇਡੀਓ ਆਨ-ਏਅਰ ਇਸ਼ਤਿਹਾਰ, ਸ਼ੋਅ ਸਪਾਂਸਰਸ਼ਿਪ ਅਤੇ ਪ੍ਰੈਜ਼ੈਂਟਿੰਗ ਪਾਰਟਨਰਸ਼ਿਪ ਦਿੰਦਾ ਹੈ, ਜੋ ਸਰੀ, ਪੂਰੇ ਕੈਨੇਡਾ ਅਤੇ ਦੁਨੀਆ ਭਰ ਦੇ ਪੰਜਾਬੀ ਪਰਿਵਾਰਾਂ ਤੱਕ ਪਹੁੰਚਦੇ ਹਨ। ‘ਮਸ਼ਹੂਰੀ ਕਰੋ’ ਪੰਨੇ ’ਤੇ ਪੈਕੇਜ ਅਤੇ ਸਰੋਤਿਆਂ ਦੇ ਅੰਕੜੇ ਦੇਖੋ, ਮੀਡੀਆ ਕਿੱਟ ਡਾਊਨਲੋਡ ਕਰੋ ਅਤੇ ਪੁੱਛਗਿੱਛ ਭੇਜੋ। ਟੀਮ ਤੁਹਾਡੇ ਕਾਰੋਬਾਰ ਅਤੇ ਬਜਟ ਮੁਤਾਬਕ ਯੋਜਨਾ ਨਾਲ ਜਵਾਬ ਦਿੰਦੀ ਹੈ।",
    },
  },
  {
    id: "app",
    category: "listening",
    q: { en: "Is there an Indi Radio app?", pa: "ਕੀ ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਕੋਈ ਐਪ ਹੈ?" },
    a: {
      en: "Yes. The official Indi Radio app is free on the Apple App Store for iPhone and iPad, and on Google Play for Android phones. Download links are at the bottom of every page on indiradio.ca. The app lets you listen live and follow the shows anywhere you have mobile data or Wi-Fi.",
      pa: "ਹਾਂ। ਅਧਿਕਾਰਤ ਇੰਡੀ ਰੇਡੀਓ ਐਪ iPhone ਅਤੇ iPad ਲਈ Apple App Store ’ਤੇ ਅਤੇ Android ਫ਼ੋਨਾਂ ਲਈ Google Play ’ਤੇ ਮੁਫ਼ਤ ਹੈ। ਡਾਊਨਲੋਡ ਲਿੰਕ indiradio.ca ਦੇ ਹਰ ਪੰਨੇ ਦੇ ਹੇਠਾਂ ਹਨ। ਐਪ ਨਾਲ ਤੁਸੀਂ ਮੋਬਾਈਲ ਡਾਟਾ ਜਾਂ Wi-Fi ਨਾਲ ਕਿਤੇ ਵੀ ਲਾਈਵ ਸੁਣ ਸਕਦੇ ਹੋ ਅਤੇ ਸ਼ੋਅ ਫ਼ਾਲੋ ਕਰ ਸਕਦੇ ਹੋ।",
    },
  },
  {
    id: "where",
    category: "general",
    q: { en: "Where is Indi Radio based?", pa: "ਇੰਡੀ ਰੇਡੀਓ ਕਿੱਥੋਂ ਚੱਲਦਾ ਹੈ?" },
    a: {
      en: "Indi Radio broadcasts from Surrey, British Columbia, home to one of the largest Punjabi communities outside India. Because the station streams online, it reaches listeners worldwide, with strong audiences in Canada, India, the United Kingdom, Australia, the United States and Dubai.",
      pa: "ਇੰਡੀ ਰੇਡੀਓ ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਤੋਂ ਪ੍ਰਸਾਰਿਤ ਹੁੰਦਾ ਹੈ, ਜਿੱਥੇ ਭਾਰਤ ਤੋਂ ਬਾਹਰ ਪੰਜਾਬੀਆਂ ਦੇ ਸਭ ਤੋਂ ਵੱਡੇ ਭਾਈਚਾਰਿਆਂ ਵਿੱਚੋਂ ਇੱਕ ਵੱਸਦਾ ਹੈ। ਸਟੇਸ਼ਨ ਆਨਲਾਈਨ ਹੋਣ ਕਰਕੇ ਦੁਨੀਆ ਭਰ ਵਿੱਚ ਸੁਣਿਆ ਜਾਂਦਾ ਹੈ, ਖ਼ਾਸ ਕਰਕੇ ਕੈਨੇਡਾ, ਭਾਰਤ, ਯੂ.ਕੇ., ਆਸਟ੍ਰੇਲੀਆ, ਅਮਰੀਕਾ ਅਤੇ ਦੁਬਈ ਵਿੱਚ।",
    },
  },
  {
    id: "who-indi",
    category: "general",
    q: { en: "Who is Indi Jaswal?", pa: "ਇੰਡੀ ਜਸਵਾਲ ਕੌਣ ਹਨ?" },
    a: {
      en: "Indi Jaswal is the founder and host of Indi Radio in Surrey, BC. Indi presents the flagship live call-in show Bhedan Da Kaal, talking with listeners about everyday life, community issues and Punjabi culture. Indi is also available to host community events and work as an MC through the booking form.",
      pa: "ਇੰਡੀ ਜਸਵਾਲ ਸਰੀ, ਬੀ.ਸੀ. ਵਿੱਚ ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਸੰਸਥਾਪਕ ਅਤੇ ਹੋਸਟ ਹਨ। ਇੰਡੀ ਮੁੱਖ ਲਾਈਵ ਕਾਲ-ਇਨ ਸ਼ੋਅ ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਪੇਸ਼ ਕਰਦੇ ਹਨ, ਜਿਸ ਵਿੱਚ ਸਰੋਤਿਆਂ ਨਾਲ ਰੋਜ਼ਾਨਾ ਜ਼ਿੰਦਗੀ, ਭਾਈਚਾਰੇ ਦੇ ਮਸਲਿਆਂ ਅਤੇ ਪੰਜਾਬੀ ਸੱਭਿਆਚਾਰ ਬਾਰੇ ਗੱਲ ਹੁੰਦੀ ਹੈ। ਬੁਕਿੰਗ ਫ਼ਾਰਮ ਰਾਹੀਂ ਇੰਡੀ ਨੂੰ ਸਮਾਗਮਾਂ ਦੀ ਮੇਜ਼ਬਾਨੀ ਜਾਂ ਸਟੇਜ ਸਕੱਤਰ (MC) ਵਜੋਂ ਵੀ ਬੁੱਕ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
    },
  },
  {
    id: "song-request",
    category: "shows",
    q: { en: "Can I request a song on Indi Radio?", pa: "ਕੀ ਮੈਂ ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਗੀਤ ਦੀ ਫ਼ਰਮਾਇਸ਼ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?" },
    a: {
      en: "Yes. Use the Song Request form on the website to send the song name, the artist and a short message. Requests go straight to the on-air team and are played when they fit the show. When a contest is running, you can enter it from the same page.",
      pa: "ਹਾਂ। ਵੈੱਬਸਾਈਟ ’ਤੇ ‘ਗੀਤ ਦੀ ਫ਼ਰਮਾਇਸ਼’ ਫ਼ਾਰਮ ਰਾਹੀਂ ਗੀਤ ਦਾ ਨਾਂ, ਗਾਇਕ ਅਤੇ ਛੋਟਾ ਜਿਹਾ ਸੁਨੇਹਾ ਭੇਜੋ। ਫ਼ਰਮਾਇਸ਼ਾਂ ਸਿੱਧੀਆਂ ਆਨ-ਏਅਰ ਟੀਮ ਕੋਲ ਜਾਂਦੀਆਂ ਹਨ ਅਤੇ ਸ਼ੋਅ ਮੁਤਾਬਕ ਚਲਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਜਦੋਂ ਕੋਈ ਮੁਕਾਬਲਾ ਚੱਲ ਰਿਹਾ ਹੋਵੇ, ਉਸੇ ਪੰਨੇ ਤੋਂ ਹਿੱਸਾ ਲੈ ਸਕਦੇ ਹੋ।",
    },
  },
  {
    id: "watch-live",
    category: "listening",
    q: {
      en: "How do I watch Indi Radio live on TikTok or YouTube?",
      pa: "ਇੰਡੀ ਰੇਡੀਓ ਨੂੰ TikTok ਜਾਂ YouTube ’ਤੇ ਲਾਈਵ ਕਿਵੇਂ ਦੇਖਾਂ?",
    },
    a: {
      en: "When Indi Jaswal goes live on TikTok or YouTube, a red Watch Live badge appears at the top of indiradio.ca with a direct link to the stream. Follow Indi Radio on both platforms and turn on notifications, so your phone alerts you the moment a live show begins.",
      pa: "ਜਦੋਂ ਇੰਡੀ ਜਸਵਾਲ TikTok ਜਾਂ YouTube ’ਤੇ ਲਾਈਵ ਹੁੰਦੇ ਹਨ, indiradio.ca ਦੇ ਉੱਪਰ ਲਾਲ ‘ਲਾਈਵ ਦੇਖੋ’ ਬਟਨ ਆ ਜਾਂਦਾ ਹੈ, ਜੋ ਸਿੱਧਾ ਸਟ੍ਰੀਮ ’ਤੇ ਲੈ ਜਾਂਦਾ ਹੈ। ਦੋਵਾਂ ਪਲੇਟਫ਼ਾਰਮਾਂ ’ਤੇ ਇੰਡੀ ਰੇਡੀਓ ਨੂੰ ਫ਼ਾਲੋ ਕਰੋ ਅਤੇ ਨੋਟੀਫ਼ਿਕੇਸ਼ਨ ਚਾਲੂ ਕਰੋ, ਤਾਂ ਜੋ ਸ਼ੋਅ ਸ਼ੁਰੂ ਹੁੰਦੇ ਹੀ ਤੁਹਾਡੇ ਫ਼ੋਨ ’ਤੇ ਸੂਚਨਾ ਆ ਜਾਵੇ।",
    },
  },
  {
    id: "abroad",
    category: "listening",
    q: {
      en: "Can I listen to Indi Radio from India, the UK or Australia?",
      pa: "ਕੀ ਮੈਂ ਭਾਰਤ, ਯੂ.ਕੇ. ਜਾਂ ਆਸਟ੍ਰੇਲੀਆ ਤੋਂ ਇੰਡੀ ਰੇਡੀਓ ਸੁਣ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    },
    a: {
      en: "Yes. Indi Radio streams online, so you can listen from any country with an internet connection. Many listeners tune in from India, the UK, Australia, the USA and Dubai. The schedule page shows every show time converted automatically to your local time zone, so you never miss a live call-in.",
      pa: "ਹਾਂ। ਇੰਡੀ ਰੇਡੀਓ ਆਨਲਾਈਨ ਚੱਲਦਾ ਹੈ, ਇਸ ਲਈ ਇੰਟਰਨੈੱਟ ਵਾਲੇ ਕਿਸੇ ਵੀ ਦੇਸ਼ ਤੋਂ ਸੁਣਿਆ ਜਾ ਸਕਦਾ ਹੈ। ਬਹੁਤ ਸਾਰੇ ਸਰੋਤੇ ਭਾਰਤ, ਯੂ.ਕੇ., ਆਸਟ੍ਰੇਲੀਆ, ਅਮਰੀਕਾ ਅਤੇ ਦੁਬਈ ਤੋਂ ਸੁਣਦੇ ਹਨ। ਸਮਾਂ-ਸੂਚੀ ਪੰਨਾ ਹਰ ਸ਼ੋਅ ਦਾ ਸਮਾਂ ਆਪਣੇ-ਆਪ ਤੁਹਾਡੇ ਟਾਈਮ ਜ਼ੋਨ ਵਿੱਚ ਦਿਖਾਉਂਦਾ ਹੈ, ਤਾਂ ਜੋ ਕੋਈ ਲਾਈਵ ਕਾਲ-ਇਨ ਨਾ ਖੁੰਝੇ।",
    },
  },
  {
    id: "updates",
    category: "general",
    q: { en: "How do I get updates about shows and events?", pa: "ਸ਼ੋਆਂ ਅਤੇ ਸਮਾਗਮਾਂ ਦੀ ਜਾਣਕਾਰੀ ਕਿਵੇਂ ਮਿਲੇ?" },
    a: {
      en: "Join the Indi Radio WhatsApp channel for show alerts, contest news and event updates, or sign up for the email newsletter on any page. You can also follow Indi Radio on TikTok, YouTube, Facebook and Instagram, and check the Events page for upcoming melas and live broadcasts.",
      pa: "ਸ਼ੋਅ ਅਲਰਟ, ਮੁਕਾਬਲਿਆਂ ਅਤੇ ਸਮਾਗਮਾਂ ਦੀ ਜਾਣਕਾਰੀ ਲਈ ਇੰਡੀ ਰੇਡੀਓ ਦਾ WhatsApp ਚੈਨਲ ਜੁਆਇਨ ਕਰੋ, ਜਾਂ ਕਿਸੇ ਵੀ ਪੰਨੇ ’ਤੇ ਈਮੇਲ ਨਿਊਜ਼ਲੈਟਰ ਲਈ ਸਾਈਨ ਅੱਪ ਕਰੋ। TikTok, YouTube, Facebook ਅਤੇ Instagram ’ਤੇ ਵੀ ਫ਼ਾਲੋ ਕਰੋ, ਅਤੇ ਆਉਣ ਵਾਲੇ ਮੇਲਿਆਂ ਤੇ ਲਾਈਵ ਪ੍ਰਸਾਰਣਾਂ ਲਈ ‘ਸਮਾਗਮ’ ਪੰਨਾ ਦੇਖੋ।",
    },
  },
];

export const dedicationTiers: DedicationTier[] = [
  {
    id: "shout-out",
    name: { en: "On-Air Shout-Out", pa: "ਆਨ-ਏਅਰ ਸ਼ਾਊਟ-ਆਊਟ" },
    description: {
      en: "Your message read live by the host during a show.",
      pa: "ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਸ਼ੋਅ ਦੌਰਾਨ ਹੋਸਟ ਵੱਲੋਂ ਲਾਈਵ ਪੜ੍ਹਿਆ ਜਾਵੇਗਾ।",
    },
    priceCad: null, // [CONFIRM]
    features: [
      { en: "Message read live on air", pa: "ਸੁਨੇਹਾ ਲਾਈਵ ਆਨ-ਏਅਰ ਪੜ੍ਹਿਆ ਜਾਵੇਗਾ" },
      { en: "English or Punjabi", pa: "ਅੰਗਰੇਜ਼ੀ ਜਾਂ ਪੰਜਾਬੀ ਵਿੱਚ" },
    ],
  },
  {
    id: "dedication-song",
    name: { en: "Dedication + Song", pa: "ਸੁਨੇਹਾ + ਗੀਤ" },
    description: {
      en: "A personal dedication by Indi Jaswal followed by a song of your choice.",
      pa: "ਇੰਡੀ ਜਸਵਾਲ ਵੱਲੋਂ ਨਿੱਜੀ ਸੁਨੇਹਾ ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ਤੁਹਾਡੀ ਪਸੰਦ ਦਾ ਗੀਤ।",
    },
    priceCad: null, // [CONFIRM]
    highlighted: true,
    features: [
      { en: "Personal dedication by Indi Jaswal", pa: "ਇੰਡੀ ਜਸਵਾਲ ਵੱਲੋਂ ਨਿੱਜੀ ਸੁਨੇਹਾ" },
      { en: "Your chosen song played on air", pa: "ਤੁਹਾਡਾ ਚੁਣਿਆ ਗੀਤ ਆਨ-ਏਅਰ" },
      { en: "Audio clip sent on WhatsApp [CONFIRM]", pa: "WhatsApp ’ਤੇ ਆਡੀਓ ਕਲਿੱਪ [CONFIRM]" },
    ],
  },
  {
    id: "business-feature",
    name: { en: "Celebration Feature", pa: "ਖ਼ਾਸ ਜਸ਼ਨ ਫ਼ੀਚਰ" },
    description: {
      en: "For weddings, grand openings and big milestones: a live on-air feature with repeat mentions.",
      pa: "ਵਿਆਹਾਂ, ਨਵੇਂ ਕਾਰੋਬਾਰਾਂ ਦੇ ਉਦਘਾਟਨ ਅਤੇ ਵੱਡੇ ਮੌਕਿਆਂ ਲਈ: ਲਾਈਵ ਆਨ-ਏਅਰ ਫ਼ੀਚਰ ਅਤੇ ਵਾਰ-ਵਾਰ ਜ਼ਿਕਰ।",
    },
    priceCad: null, // [CONFIRM]
    features: [
      { en: "Live feature during a show", pa: "ਸ਼ੋਅ ਦੌਰਾਨ ਲਾਈਵ ਫ਼ੀਚਰ" },
      { en: "Repeat mentions [CONFIRM number]", pa: "ਵਾਰ-ਵਾਰ ਜ਼ਿਕਰ [CONFIRM ਗਿਣਤੀ]" },
      { en: "Social media shout-out [CONFIRM]", pa: "ਸੋਸ਼ਲ ਮੀਡੀਆ ਸ਼ਾਊਟ-ਆਊਟ [CONFIRM]" },
    ],
  },
];

export const adPackages: AdPackage[] = [
  {
    id: "spot",
    name: { en: "On-Air Spots", pa: "ਆਨ-ਏਅਰ ਇਸ਼ਤਿਹਾਰ" },
    description: {
      en: "Radio ads read by the host or produced for your brand, placed in live shows.",
      pa: "ਹੋਸਟ ਵੱਲੋਂ ਪੜ੍ਹੇ ਜਾਂ ਤੁਹਾਡੇ ਬ੍ਰਾਂਡ ਲਈ ਤਿਆਰ ਕੀਤੇ ਰੇਡੀਓ ਇਸ਼ਤਿਹਾਰ, ਲਾਈਵ ਸ਼ੋਆਂ ਵਿੱਚ।",
    },
    priceNote: { en: "From [CONFIRM] / month", pa: "[CONFIRM] / ਮਹੀਨੇ ਤੋਂ ਸ਼ੁਰੂ" },
    features: [
      { en: "Host-read or produced spots", pa: "ਹੋਸਟ ਵੱਲੋਂ ਪੜ੍ਹੇ ਜਾਂ ਤਿਆਰ ਇਸ਼ਤਿਹਾਰ" },
      { en: "English and Punjabi", pa: "ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਪੰਜਾਬੀ" },
      { en: "Monthly play report", pa: "ਮਹੀਨਾਵਾਰ ਰਿਪੋਰਟ" },
    ],
  },
  {
    id: "show-sponsor",
    name: { en: "Show Sponsor", pa: "ਸ਼ੋਅ ਸਪਾਂਸਰ" },
    description: {
      en: "Your business presents a show, with opening and closing mentions and a logo on the website.",
      pa: "ਤੁਹਾਡਾ ਕਾਰੋਬਾਰ ਸ਼ੋਅ ਪੇਸ਼ ਕਰੇ: ਸ਼ੁਰੂ ਅਤੇ ਅਖ਼ੀਰ ਵਿੱਚ ਜ਼ਿਕਰ, ਅਤੇ ਵੈੱਬਸਾਈਟ ’ਤੇ ਲੋਗੋ।",
    },
    priceNote: { en: "From [CONFIRM] / month", pa: "[CONFIRM] / ਮਹੀਨੇ ਤੋਂ ਸ਼ੁਰੂ" },
    features: [
      { en: "“Brought to you by” mentions", pa: "“ਤੁਹਾਡੇ ਲਈ ਪੇਸ਼ ਕਰਦੇ ਹਨ” ਜ਼ਿਕਰ" },
      { en: "Logo on the show page and sponsor strip", pa: "ਸ਼ੋਅ ਪੰਨੇ ਅਤੇ ਸਪਾਂਸਰ ਪੱਟੀ ’ਤੇ ਲੋਗੋ" },
      { en: "Social media mentions", pa: "ਸੋਸ਼ਲ ਮੀਡੀਆ ’ਤੇ ਜ਼ਿਕਰ" },
    ],
  },
  {
    id: "presenting",
    name: { en: "Presenting Partner", pa: "ਪ੍ਰੈਜ਼ੈਂਟਿੰਗ ਪਾਰਟਨਰ" },
    description: {
      en: "Station-wide partnership for community leaders: live remotes, events and year-round presence.",
      pa: "ਭਾਈਚਾਰੇ ਦੇ ਮੋਹਰੀ ਕਾਰੋਬਾਰਾਂ ਲਈ ਪੂਰੇ ਸਟੇਸ਼ਨ ਦੀ ਭਾਈਵਾਲੀ: ਲਾਈਵ ਪ੍ਰਸਾਰਣ, ਸਮਾਗਮ ਅਤੇ ਸਾਰਾ ਸਾਲ ਹਾਜ਼ਰੀ।",
    },
    priceNote: { en: "Custom quote", pa: "ਤੁਹਾਡੀ ਲੋੜ ਮੁਤਾਬਕ ਕੀਮਤ" },
    features: [
      { en: "Live broadcast from your location [CONFIRM]", pa: "ਤੁਹਾਡੀ ਥਾਂ ਤੋਂ ਲਾਈਵ ਪ੍ਰਸਾਰਣ [CONFIRM]" },
      { en: "Event and contest naming rights", pa: "ਸਮਾਗਮ ਅਤੇ ਮੁਕਾਬਲਿਆਂ ’ਤੇ ਤੁਹਾਡਾ ਨਾਂ" },
      { en: "Top placement across the website and app", pa: "ਵੈੱਬਸਾਈਟ ਅਤੇ ਐਪ ’ਤੇ ਸਭ ਤੋਂ ਉੱਪਰ ਥਾਂ" },
    ],
  },
];

export const sponsors: Sponsor[] = [];
export const events: CommunityEvent[] = [];
export const announcements: Announcement[] = [];
export const press: PressItem[] = [];
export const socialPosts: SocialPost[] = [];
