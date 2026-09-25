import en, { type Messages } from "@/messages/en";
import pa from "@/messages/pa";
import { LOCALES, type Locale } from "./types";

const dictionaries: Record<Locale, Messages> = { en, pa };

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "pa" : "en";
}

/** Page registry: one place for every route's title, description and nav label. */
export const PAGES = {
  home: {
    path: "/",
    en: {
      title: "Indi Radio – Live Punjabi Radio from Surrey, Canada | Indi Jaswal",
      description:
        "Listen live to Indi Radio, Punjabi radio from Surrey, BC. Call-in shows with Indi Jaswal, Punjabi music and culture 24/7. Free app for iPhone & Android.",
    },
    pa: {
      title: "ਇੰਡੀ ਰੇਡੀਓ – ਸਰੀ, ਕੈਨੇਡਾ ਤੋਂ ਲਾਈਵ ਪੰਜਾਬੀ ਰੇਡੀਓ | ਇੰਡੀ ਜਸਵਾਲ",
      description:
        "ਸਰੀ, ਬੀ.ਸੀ. ਤੋਂ ਇੰਡੀ ਰੇਡੀਓ ਲਾਈਵ ਸੁਣੋ। ਇੰਡੀ ਜਸਵਾਲ ਨਾਲ ਕਾਲ-ਇਨ ਸ਼ੋਅ, ਪੰਜਾਬੀ ਸੰਗੀਤ ਅਤੇ ਸੱਭਿਆਚਾਰ 24/7। iPhone ਅਤੇ Android ਲਈ ਮੁਫ਼ਤ ਐਪ।",
    },
  },
  listenLive: {
    path: "/listen-live",
    en: {
      title: "Listen Live – Indi Radio Punjabi Radio Online",
      description:
        "Listen to Indi Radio live in your browser, on the iPhone & Android app, TikTok LIVE or YouTube. Free Punjabi radio online from Surrey, Canada.",
    },
    pa: {
      title: "ਲਾਈਵ ਸੁਣੋ – ਇੰਡੀ ਰੇਡੀਓ ਆਨਲਾਈਨ ਪੰਜਾਬੀ ਰੇਡੀਓ",
      description:
        "ਇੰਡੀ ਰੇਡੀਓ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ, iPhone ਤੇ Android ਐਪ ’ਤੇ, TikTok LIVE ਜਾਂ YouTube ’ਤੇ ਲਾਈਵ ਸੁਣੋ। ਸਰੀ, ਕੈਨੇਡਾ ਤੋਂ ਮੁਫ਼ਤ ਆਨਲਾਈਨ ਪੰਜਾਬੀ ਰੇਡੀਓ।",
    },
  },
  schedule: {
    path: "/schedule",
    en: {
      title: "Show Schedule in Your Time Zone | Indi Radio",
      description:
        "The weekly Indi Radio schedule in your local time: Vancouver, India (IST), UK and Australia. See when Bhedan Da Kaal and the live call-ins start.",
    },
    pa: {
      title: "ਤੁਹਾਡੇ ਟਾਈਮ ਜ਼ੋਨ ਵਿੱਚ ਸ਼ੋਆਂ ਦੀ ਸਮਾਂ-ਸੂਚੀ | ਇੰਡੀ ਰੇਡੀਓ",
      description:
        "ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਹਫ਼ਤਾਵਾਰੀ ਸਮਾਂ-ਸੂਚੀ ਤੁਹਾਡੇ ਸਮੇਂ ਮੁਤਾਬਕ: ਵੈਨਕੂਵਰ, ਭਾਰਤ (IST), ਯੂ.ਕੇ. ਅਤੇ ਆਸਟ੍ਰੇਲੀਆ। ਦੇਖੋ ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਅਤੇ ਲਾਈਵ ਕਾਲ-ਇਨ ਕਦੋਂ ਸ਼ੁਰੂ ਹੁੰਦੇ ਹਨ।",
    },
  },
  shows: {
    path: "/shows",
    en: {
      title: "Shows on Indi Radio | Punjabi Talk & Music",
      description:
        "Explore Indi Radio shows, from Indi Jaswal’s live call-in Bhedan Da Kaal to non-stop Punjabi music. Show times, clips and how to call in.",
    },
    pa: {
      title: "ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਸ਼ੋਅ | ਪੰਜਾਬੀ ਗੱਲਬਾਤ ਤੇ ਸੰਗੀਤ",
      description:
        "ਇੰਡੀ ਜਸਵਾਲ ਦੇ ਲਾਈਵ ਕਾਲ-ਇਨ ਸ਼ੋਅ ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਤੋਂ ਲੈ ਕੇ ਨਾਨ-ਸਟਾਪ ਪੰਜਾਬੀ ਸੰਗੀਤ ਤੱਕ, ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਸ਼ੋਅ ਦੇਖੋ। ਸਮਾਂ, ਕਲਿੱਪ ਅਤੇ ਕਾਲ ਕਰਨ ਦਾ ਤਰੀਕਾ।",
    },
  },
  indi: {
    path: "/indi-jaswal",
    en: {
      title: "Indi Jaswal – Host & Founder of Indi Radio, Surrey",
      description:
        "Meet Indi Jaswal, founder and host of Indi Radio and the live call-in show Bhedan Da Kaal. Biography, photos, press, and event or MC bookings.",
    },
    pa: {
      title: "ਇੰਡੀ ਜਸਵਾਲ – ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਹੋਸਟ ਅਤੇ ਸੰਸਥਾਪਕ, ਸਰੀ",
      description:
        "ਇੰਡੀ ਰੇਡੀਓ ਅਤੇ ਲਾਈਵ ਕਾਲ-ਇਨ ਸ਼ੋਅ ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਦੇ ਸੰਸਥਾਪਕ ਤੇ ਹੋਸਟ ਇੰਡੀ ਜਸਵਾਲ ਨੂੰ ਮਿਲੋ। ਜੀਵਨੀ, ਤਸਵੀਰਾਂ, ਪ੍ਰੈੱਸ, ਅਤੇ ਸਮਾਗਮ ਜਾਂ MC ਬੁਕਿੰਗ।",
    },
  },
  episodes: {
    path: "/episodes",
    en: {
      title: "Episodes & Clips | Indi Radio",
      description:
        "Watch and replay Indi Radio episodes and clips, including Bhedan Da Kaal. Search the archive and filter by show.",
    },
    pa: {
      title: "ਐਪੀਸੋਡ ਅਤੇ ਕਲਿੱਪ | ਇੰਡੀ ਰੇਡੀਓ",
      description: "‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਸਮੇਤ ਇੰਡੀ ਰੇਡੀਓ ਦੇ ਐਪੀਸੋਡ ਅਤੇ ਕਲਿੱਪ ਦੇਖੋ ਤੇ ਦੁਬਾਰਾ ਸੁਣੋ। ਪੁਰਾਣੇ ਐਪੀਸੋਡ ਲੱਭੋ ਅਤੇ ਸ਼ੋਅ ਮੁਤਾਬਕ ਛਾਂਟੋ।",
    },
  },
  callIn: {
    path: "/call-in",
    en: {
      title: "Call In to Indi Radio – Live Punjabi Call-In Radio",
      description:
        "Call Indi Radio at 778-834-0325 during live shows or send a WhatsApp message. Punjabi call-in radio from Surrey with a family-friendly standard.",
    },
    pa: {
      title: "ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਕਾਲ ਕਰੋ – ਲਾਈਵ ਪੰਜਾਬੀ ਕਾਲ-ਇਨ ਰੇਡੀਓ",
      description:
        "ਲਾਈਵ ਸ਼ੋਅ ਦੌਰਾਨ ਇੰਡੀ ਰੇਡੀਓ ਨੂੰ 778-834-0325 ’ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ WhatsApp ਸੁਨੇਹਾ ਭੇਜੋ। ਸਰੀ ਤੋਂ ਪਰਿਵਾਰ ਨਾਲ ਸੁਣਨ ਯੋਗ ਪੰਜਾਬੀ ਕਾਲ-ਇਨ ਰੇਡੀਓ।",
    },
  },
  dedications: {
    path: "/dedications",
    en: {
      title: "Book a Radio Dedication or Shout-Out | Indi Radio",
      description:
        "Book an on-air birthday, anniversary, wedding, festival or business shout-out on Indi Radio. Choose a package, pay securely and confirm on WhatsApp.",
    },
    pa: {
      title: "ਰੇਡੀਓ ’ਤੇ ਸੁਨੇਹਾ ਜਾਂ ਸ਼ਾਊਟ-ਆਊਟ ਬੁੱਕ ਕਰੋ | ਇੰਡੀ ਰੇਡੀਓ",
      description:
        "ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਜਨਮਦਿਨ, ਵਰ੍ਹੇਗੰਢ, ਵਿਆਹ, ਤਿਉਹਾਰ ਜਾਂ ਕਾਰੋਬਾਰ ਲਈ ਸ਼ਾਊਟ-ਆਊਟ ਬੁੱਕ ਕਰੋ। ਪੈਕੇਜ ਚੁਣੋ, ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਕਰੋ ਅਤੇ WhatsApp ’ਤੇ ਪੱਕਾ ਕਰੋ।",
    },
  },
  advertise: {
    path: "/advertise",
    en: {
      title: "Advertise on Punjabi Radio in Surrey | Indi Radio",
      description:
        "Reach Punjabi families in Surrey, across Canada and worldwide. On-air spots, show sponsorships and partnerships on Indi Radio. Get the media kit.",
    },
    pa: {
      title: "ਸਰੀ ਦੇ ਪੰਜਾਬੀ ਰੇਡੀਓ ’ਤੇ ਮਸ਼ਹੂਰੀ ਕਰੋ | ਇੰਡੀ ਰੇਡੀਓ",
      description:
        "ਸਰੀ, ਪੂਰੇ ਕੈਨੇਡਾ ਅਤੇ ਦੁਨੀਆ ਭਰ ਦੇ ਪੰਜਾਬੀ ਪਰਿਵਾਰਾਂ ਤੱਕ ਪਹੁੰਚੋ। ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਇਸ਼ਤਿਹਾਰ, ਸ਼ੋਅ ਸਪਾਂਸਰਸ਼ਿਪ ਅਤੇ ਭਾਈਵਾਲੀ। ਮੀਡੀਆ ਕਿੱਟ ਲਓ।",
    },
  },
  events: {
    path: "/events",
    en: {
      title: "Punjabi Community Events & Live Broadcasts | Indi Radio",
      description:
        "Upcoming melas, community events and live broadcasts with Indi Radio and Indi Jaswal in Surrey and beyond.",
    },
    pa: {
      title: "ਪੰਜਾਬੀ ਭਾਈਚਾਰਕ ਸਮਾਗਮ ਅਤੇ ਲਾਈਵ ਪ੍ਰਸਾਰਣ | ਇੰਡੀ ਰੇਡੀਓ",
      description: "ਸਰੀ ਅਤੇ ਹੋਰ ਥਾਵਾਂ ’ਤੇ ਇੰਡੀ ਰੇਡੀਓ ਅਤੇ ਇੰਡੀ ਜਸਵਾਲ ਨਾਲ ਆਉਣ ਵਾਲੇ ਮੇਲੇ, ਭਾਈਚਾਰਕ ਸਮਾਗਮ ਅਤੇ ਲਾਈਵ ਪ੍ਰਸਾਰਣ।",
    },
  },
  about: {
    path: "/about",
    en: {
      title: "About Indi Radio – Punjabi Radio from Surrey, BC",
      description:
        "The story of Indi Radio: a live Punjabi radio station from Surrey, BC, founded by Indi Jaswal to connect Punjabi families around the world.",
    },
    pa: {
      title: "ਇੰਡੀ ਰੇਡੀਓ ਬਾਰੇ – ਸਰੀ, ਬੀ.ਸੀ. ਤੋਂ ਪੰਜਾਬੀ ਰੇਡੀਓ",
      description:
        "ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਕਹਾਣੀ: ਸਰੀ, ਬੀ.ਸੀ. ਤੋਂ ਲਾਈਵ ਪੰਜਾਬੀ ਰੇਡੀਓ ਸਟੇਸ਼ਨ, ਜੋ ਇੰਡੀ ਜਸਵਾਲ ਨੇ ਦੁਨੀਆ ਭਰ ਦੇ ਪੰਜਾਬੀ ਪਰਿਵਾਰਾਂ ਨੂੰ ਜੋੜਨ ਲਈ ਸ਼ੁਰੂ ਕੀਤਾ।",
    },
  },
  faq: {
    path: "/faq",
    en: {
      title: "Indi Radio FAQ – Listening, Call-Ins & Dedications",
      description:
        "Answers to common questions: how to listen live, Bhedan Da Kaal times, calling in, the Indi Radio app, dedications and advertising.",
    },
    pa: {
      title: "ਇੰਡੀ ਰੇਡੀਓ ਸਵਾਲ-ਜਵਾਬ – ਸੁਣਨਾ, ਕਾਲ-ਇਨ ਅਤੇ ਸੁਨੇਹੇ",
      description:
        "ਆਮ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ: ਲਾਈਵ ਕਿਵੇਂ ਸੁਣੀਏ, ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ ਦਾ ਸਮਾਂ, ਕਾਲ ਕਰਨਾ, ਇੰਡੀ ਰੇਡੀਓ ਐਪ, ਸੁਨੇਹੇ ਅਤੇ ਮਸ਼ਹੂਰੀ।",
    },
  },
  contact: {
    path: "/contact",
    en: {
      title: "Contact Indi Radio | Surrey, BC",
      description:
        "Contact Indi Radio in Surrey, BC by phone, WhatsApp, email or the contact form, about shows, dedications, advertising or events.",
    },
    pa: {
      title: "ਇੰਡੀ ਰੇਡੀਓ ਨਾਲ ਸੰਪਰਕ | ਸਰੀ, ਬੀ.ਸੀ.",
      description: "ਸ਼ੋਆਂ, ਸੁਨੇਹਿਆਂ, ਮਸ਼ਹੂਰੀ ਜਾਂ ਸਮਾਗਮਾਂ ਬਾਰੇ ਫ਼ੋਨ, WhatsApp, ਈਮੇਲ ਜਾਂ ਸੰਪਰਕ ਫ਼ਾਰਮ ਰਾਹੀਂ ਸਰੀ, ਬੀ.ਸੀ. ਵਿੱਚ ਇੰਡੀ ਰੇਡੀਓ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
    },
  },
  songRequest: {
    path: "/song-request",
    en: {
      title: "Request a Song or Enter a Contest | Indi Radio",
      description:
        "Send a Punjabi song request to Indi Radio or enter a current contest. Requests go straight to the on-air team.",
    },
    pa: {
      title: "ਗੀਤ ਦੀ ਫ਼ਰਮਾਇਸ਼ ਕਰੋ ਜਾਂ ਮੁਕਾਬਲੇ ਵਿੱਚ ਹਿੱਸਾ ਲਓ | ਇੰਡੀ ਰੇਡੀਓ",
      description: "ਇੰਡੀ ਰੇਡੀਓ ਨੂੰ ਪੰਜਾਬੀ ਗੀਤ ਦੀ ਫ਼ਰਮਾਇਸ਼ ਭੇਜੋ ਜਾਂ ਚੱਲ ਰਹੇ ਮੁਕਾਬਲੇ ਵਿੱਚ ਹਿੱਸਾ ਲਓ। ਫ਼ਰਮਾਇਸ਼ਾਂ ਸਿੱਧੀਆਂ ਆਨ-ਏਅਰ ਟੀਮ ਕੋਲ ਜਾਂਦੀਆਂ ਹਨ।",
    },
  },
  privacy: {
    path: "/privacy",
    en: {
      title: "Privacy Policy | Indi Radio",
      description:
        "How Indi Radio collects, uses and protects personal information from forms, payments and analytics, in line with Canada’s PIPEDA.",
    },
    pa: {
      title: "ਪਰਦੇਦਾਰੀ ਨੀਤੀ | ਇੰਡੀ ਰੇਡੀਓ",
      description: "ਇੰਡੀ ਰੇਡੀਓ ਫ਼ਾਰਮਾਂ, ਭੁਗਤਾਨਾਂ ਅਤੇ ਐਨਾਲਿਟਿਕਸ ਤੋਂ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਕਿਵੇਂ ਇਕੱਠੀ, ਵਰਤਦਾ ਅਤੇ ਸੁਰੱਖਿਅਤ ਰੱਖਦਾ ਹੈ, ਕੈਨੇਡਾ ਦੇ PIPEDA ਕਾਨੂੰਨ ਮੁਤਾਬਕ।",
    },
  },
  terms: {
    path: "/terms",
    en: {
      title: "Terms of Use | Indi Radio",
      description:
        "Terms for using indiradio.ca, booking dedications, entering contests and sending song requests to Indi Radio.",
    },
    pa: {
      title: "ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ | ਇੰਡੀ ਰੇਡੀਓ",
      description: "indiradio.ca ਵਰਤਣ, ਸੁਨੇਹੇ ਬੁੱਕ ਕਰਨ, ਮੁਕਾਬਲਿਆਂ ਵਿੱਚ ਹਿੱਸਾ ਲੈਣ ਅਤੇ ਇੰਡੀ ਰੇਡੀਓ ਨੂੰ ਗੀਤ ਫ਼ਰਮਾਇਸ਼ਾਂ ਭੇਜਣ ਦੀਆਂ ਸ਼ਰਤਾਂ।",
    },
  },
} as const;

export type PageKey = keyof typeof PAGES;
