/**
 * Privacy Policy (PIPEDA) and Terms of Use, English + Punjabi.
 * [CONFIRM] Have a Canadian lawyer review both before launch. The English
 * version governs if the two differ.
 */

export interface LegalDoc {
  h1: string;
  updated: string;
  intro: string;
  sections: { h: string; p?: string[]; list?: string[] }[];
}

export const privacy: Record<"en" | "pa", LegalDoc> = {
  en: {
    h1: "Privacy Policy",
    updated: "Last updated: [CONFIRM effective date]",
    intro:
      "Indi Radio (“we”, “us”) respects your privacy. This policy explains what personal information we collect through indiradio.ca, our forms, payments and live shows, why we collect it, and how you can control it. We follow Canada’s Personal Information Protection and Electronic Documents Act (PIPEDA) and British Columbia’s Personal Information Protection Act (PIPA).",
    sections: [
      {
        h: "1. Who is responsible",
        p: [
          "Indi Radio, Surrey, British Columbia, Canada, is responsible for personal information under its control. Our Privacy Officer is [CONFIRM name], who can be reached at [CONFIRM privacy email] or through the contact page.",
        ],
      },
      {
        h: "2. What we collect",
        list: [
          "Contact forms, song requests, contest entries and event bookings: your name, email, phone number, city and the message you send.",
          "Dedication bookings: your name, email, phone/WhatsApp number, the names and message to be read on air, and your preferred date.",
          "Payments: handled by Stripe. We receive the payment status, amount and your email, but never your full card number.",
          "Sponsor and advertising inquiries: your name, business name, contact details and the information you choose to share.",
          "Newsletter: your email address.",
          "Website analytics: pages visited, device and browser type, approximate location (city/country) and how you arrived, collected by Google Analytics 4 with IP anonymisation.",
          "Live call-ins and WhatsApp messages: your voice, first name, city and anything you say on air. Calls are broadcast live and may be recorded.",
        ],
      },
      {
        h: "3. Why we use it",
        list: [
          "To answer your questions and deliver the service you asked for (a dedication, a booking, a reply).",
          "To process payments and keep required financial records.",
          "To send the newsletter or WhatsApp updates you signed up for. You can unsubscribe at any time.",
          "To run contests and contact winners.",
          "To understand how the website is used and improve it.",
          "To broadcast, record and share live shows, including call-ins, on Indi Radio’s website, apps and social media.",
        ],
      },
      {
        h: "4. Consent",
        p: [
          "We collect personal information with your consent, which you give by submitting a form, ticking a consent box, calling in or signing up. You can withdraw consent at any time by contacting us, subject to legal or contractual limits (for example, we must keep payment records). Withdrawing consent may mean we can no longer provide a service.",
        ],
      },
      {
        h: "5. Who we share it with",
        p: [
          "We do not sell personal information. We share it only with service providers who help us run the station and website, under contracts that require them to protect it:",
        ],
        list: [
          "Vercel (website hosting)",
          "Sanity (content management)",
          "Stripe (payments)",
          "Resend (email delivery)",
          "HighLevel / GoHighLevel (customer relationship management, WhatsApp and SMS messaging)",
          "Google (Analytics; YouTube for embedded videos)",
          "Meta (WhatsApp), when you choose to message us there",
        ],
      },
      {
        h: "6. Storage outside Canada",
        p: [
          "Some of these providers store or process information in the United States and other countries. When they do, your information may be accessible to courts, law enforcement and national security authorities in those countries.",
        ],
      },
      {
        h: "7. How long we keep it",
        p: [
          "We keep personal information only as long as needed for the purpose it was collected: generally up to 24 months for inquiries and bookings, and up to 7 years for payment records as required by Canadian tax law. Newsletter data is kept until you unsubscribe. [CONFIRM retention periods]",
        ],
      },
      {
        h: "8. Cookies and analytics",
        p: [
          "The website uses a small number of cookies and local storage for things like your language, colour theme and time-zone choice, and Google Analytics cookies to measure visits. YouTube videos only load (and set cookies) when you press play; we use YouTube’s privacy-enhanced mode. You can block or delete cookies in your browser settings; the site will still work.",
        ],
      },
      {
        h: "9. Security",
        p: [
          "We use HTTPS encryption, reputable service providers, limited staff access and spam protection to safeguard your information. No system is perfectly secure, so please do not send sensitive information (such as health or banking details) through our forms.",
        ],
      },
      {
        h: "10. Your rights",
        p: [
          "You can ask to see the personal information we hold about you, ask us to correct it, or ask us to delete it where we are not required to keep it. Contact our Privacy Officer; we will respond within 30 days. If you are not satisfied, you can complain to the Office of the Privacy Commissioner of Canada (priv.gc.ca) or the Office of the Information and Privacy Commissioner for British Columbia (oipc.bc.ca).",
        ],
      },
      {
        h: "11. Children",
        p: [
          "Our website and services are intended for a general family audience. We do not knowingly collect personal information from children under 13 without a parent’s or guardian’s consent. Contest eligibility rules are set out in the Terms of Use.",
        ],
      },
      {
        h: "12. Changes",
        p: ["We may update this policy. The date at the top shows the latest version. Significant changes will be highlighted on the website."],
      },
    ],
  },
  pa: {
    h1: "ਪਰਦੇਦਾਰੀ ਨੀਤੀ",
    updated: "ਆਖ਼ਰੀ ਵਾਰ ਅੱਪਡੇਟ: [CONFIRM effective date]",
    intro:
      "ਇੰਡੀ ਰੇਡੀਓ (“ਅਸੀਂ”) ਤੁਹਾਡੀ ਪਰਦੇਦਾਰੀ ਦਾ ਸਤਿਕਾਰ ਕਰਦਾ ਹੈ। ਇਹ ਨੀਤੀ ਦੱਸਦੀ ਹੈ ਕਿ ਅਸੀਂ indiradio.ca, ਆਪਣੇ ਫ਼ਾਰਮਾਂ, ਭੁਗਤਾਨਾਂ ਅਤੇ ਲਾਈਵ ਸ਼ੋਆਂ ਰਾਹੀਂ ਕਿਹੜੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਇਕੱਠੀ ਕਰਦੇ ਹਾਂ, ਕਿਉਂ ਕਰਦੇ ਹਾਂ, ਅਤੇ ਤੁਸੀਂ ਇਸਨੂੰ ਕਿਵੇਂ ਕਾਬੂ ਕਰ ਸਕਦੇ ਹੋ। ਅਸੀਂ ਕੈਨੇਡਾ ਦੇ PIPEDA ਕਾਨੂੰਨ ਅਤੇ ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਦੇ PIPA ਕਾਨੂੰਨ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹਾਂ। ਜੇ ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਪੰਜਾਬੀ ਰੂਪ ਵਿੱਚ ਫ਼ਰਕ ਹੋਵੇ ਤਾਂ ਅੰਗਰੇਜ਼ੀ ਰੂਪ ਮੰਨਿਆ ਜਾਵੇਗਾ।",
    sections: [
      {
        h: "1. ਜ਼ਿੰਮੇਵਾਰ ਕੌਣ ਹੈ",
        p: [
          "ਇੰਡੀ ਰੇਡੀਓ, ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ, ਕੈਨੇਡਾ, ਆਪਣੇ ਕੋਲ ਮੌਜੂਦ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਲਈ ਜ਼ਿੰਮੇਵਾਰ ਹੈ। ਸਾਡੇ ਪਰਦੇਦਾਰੀ ਅਧਿਕਾਰੀ [CONFIRM name] ਹਨ, ਜਿਨ੍ਹਾਂ ਨਾਲ [CONFIRM privacy email] ’ਤੇ ਜਾਂ ਸੰਪਰਕ ਪੰਨੇ ਰਾਹੀਂ ਗੱਲ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ।",
        ],
      },
      {
        h: "2. ਅਸੀਂ ਕੀ ਇਕੱਠਾ ਕਰਦੇ ਹਾਂ",
        list: [
          "ਸੰਪਰਕ ਫ਼ਾਰਮ, ਗੀਤ ਫ਼ਰਮਾਇਸ਼ਾਂ, ਮੁਕਾਬਲਾ ਐਂਟਰੀਆਂ ਅਤੇ ਸਮਾਗਮ ਬੁਕਿੰਗ: ਤੁਹਾਡਾ ਨਾਂ, ਈਮੇਲ, ਫ਼ੋਨ ਨੰਬਰ, ਸ਼ਹਿਰ ਅਤੇ ਤੁਹਾਡਾ ਸੁਨੇਹਾ।",
          "ਸੁਨੇਹਾ ਬੁਕਿੰਗ: ਤੁਹਾਡਾ ਨਾਂ, ਈਮੇਲ, ਫ਼ੋਨ/WhatsApp ਨੰਬਰ, ਆਨ-ਏਅਰ ਪੜ੍ਹੇ ਜਾਣ ਵਾਲੇ ਨਾਂ ਅਤੇ ਸੁਨੇਹਾ, ਅਤੇ ਪਸੰਦੀਦਾ ਤਾਰੀਖ਼।",
          "ਭੁਗਤਾਨ: Stripe ਰਾਹੀਂ ਹੁੰਦੇ ਹਨ। ਸਾਨੂੰ ਭੁਗਤਾਨ ਦੀ ਸਥਿਤੀ, ਰਕਮ ਅਤੇ ਤੁਹਾਡੀ ਈਮੇਲ ਮਿਲਦੀ ਹੈ, ਪਰ ਕਦੇ ਵੀ ਤੁਹਾਡਾ ਪੂਰਾ ਕਾਰਡ ਨੰਬਰ ਨਹੀਂ।",
          "ਸਪਾਂਸਰ ਅਤੇ ਮਸ਼ਹੂਰੀ ਪੁੱਛਗਿੱਛ: ਤੁਹਾਡਾ ਨਾਂ, ਕਾਰੋਬਾਰ ਦਾ ਨਾਂ, ਸੰਪਰਕ ਵੇਰਵੇ ਅਤੇ ਜੋ ਜਾਣਕਾਰੀ ਤੁਸੀਂ ਦੇਣਾ ਚਾਹੋ।",
          "ਨਿਊਜ਼ਲੈਟਰ: ਤੁਹਾਡਾ ਈਮੇਲ ਪਤਾ।",
          "ਵੈੱਬਸਾਈਟ ਐਨਾਲਿਟਿਕਸ: ਦੇਖੇ ਗਏ ਪੰਨੇ, ਡਿਵਾਈਸ ਅਤੇ ਬ੍ਰਾਊਜ਼ਰ, ਅੰਦਾਜ਼ਨ ਟਿਕਾਣਾ (ਸ਼ਹਿਰ/ਦੇਸ਼) ਅਤੇ ਤੁਸੀਂ ਕਿੱਥੋਂ ਆਏ, Google Analytics 4 ਰਾਹੀਂ, IP ਲੁਕਾ ਕੇ।",
          "ਲਾਈਵ ਕਾਲਾਂ ਅਤੇ WhatsApp ਸੁਨੇਹੇ: ਤੁਹਾਡੀ ਆਵਾਜ਼, ਪਹਿਲਾ ਨਾਂ, ਸ਼ਹਿਰ ਅਤੇ ਜੋ ਵੀ ਤੁਸੀਂ ਆਨ-ਏਅਰ ਕਹੋ। ਕਾਲਾਂ ਲਾਈਵ ਪ੍ਰਸਾਰਿਤ ਹੁੰਦੀਆਂ ਹਨ ਅਤੇ ਰਿਕਾਰਡ ਹੋ ਸਕਦੀਆਂ ਹਨ।",
        ],
      },
      {
        h: "3. ਅਸੀਂ ਇਸਨੂੰ ਕਿਉਂ ਵਰਤਦੇ ਹਾਂ",
        list: [
          "ਤੁਹਾਡੇ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦੇਣ ਅਤੇ ਮੰਗੀ ਗਈ ਸੇਵਾ ਦੇਣ ਲਈ (ਸੁਨੇਹਾ, ਬੁਕਿੰਗ, ਜਵਾਬ)।",
          "ਭੁਗਤਾਨ ਕਰਨ ਅਤੇ ਲਾਜ਼ਮੀ ਵਿੱਤੀ ਰਿਕਾਰਡ ਰੱਖਣ ਲਈ।",
          "ਤੁਹਾਡੇ ਵੱਲੋਂ ਚੁਣੇ ਨਿਊਜ਼ਲੈਟਰ ਜਾਂ WhatsApp ਅੱਪਡੇਟ ਭੇਜਣ ਲਈ। ਤੁਸੀਂ ਕਦੇ ਵੀ ਬੰਦ ਕਰਵਾ ਸਕਦੇ ਹੋ।",
          "ਮੁਕਾਬਲੇ ਕਰਵਾਉਣ ਅਤੇ ਜੇਤੂਆਂ ਨਾਲ ਸੰਪਰਕ ਕਰਨ ਲਈ।",
          "ਵੈੱਬਸਾਈਟ ਦੀ ਵਰਤੋਂ ਸਮਝਣ ਅਤੇ ਇਸਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਲਈ।",
          "ਕਾਲਾਂ ਸਮੇਤ ਲਾਈਵ ਸ਼ੋਅ ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਵੈੱਬਸਾਈਟ, ਐਪਾਂ ਅਤੇ ਸੋਸ਼ਲ ਮੀਡੀਆ ’ਤੇ ਪ੍ਰਸਾਰਿਤ, ਰਿਕਾਰਡ ਅਤੇ ਸਾਂਝੇ ਕਰਨ ਲਈ।",
        ],
      },
      {
        h: "4. ਸਹਿਮਤੀ",
        p: [
          "ਅਸੀਂ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਤੁਹਾਡੀ ਸਹਿਮਤੀ ਨਾਲ ਇਕੱਠੀ ਕਰਦੇ ਹਾਂ, ਜੋ ਤੁਸੀਂ ਫ਼ਾਰਮ ਭੇਜ ਕੇ, ਸਹਿਮਤੀ ਵਾਲਾ ਖ਼ਾਨਾ ਚੁਣ ਕੇ, ਕਾਲ ਕਰਕੇ ਜਾਂ ਸਾਈਨ ਅੱਪ ਕਰਕੇ ਦਿੰਦੇ ਹੋ। ਤੁਸੀਂ ਕਾਨੂੰਨੀ ਜਾਂ ਇਕਰਾਰਨਾਮੇ ਦੀਆਂ ਹੱਦਾਂ ਅੰਦਰ ਕਦੇ ਵੀ ਸਹਿਮਤੀ ਵਾਪਸ ਲੈ ਸਕਦੇ ਹੋ (ਜਿਵੇਂ ਭੁਗਤਾਨ ਰਿਕਾਰਡ ਰੱਖਣੇ ਲਾਜ਼ਮੀ ਹਨ)। ਸਹਿਮਤੀ ਵਾਪਸ ਲੈਣ ’ਤੇ ਹੋ ਸਕਦਾ ਹੈ ਅਸੀਂ ਕੋਈ ਸੇਵਾ ਨਾ ਦੇ ਸਕੀਏ।",
        ],
      },
      {
        h: "5. ਅਸੀਂ ਕਿਸ ਨਾਲ ਸਾਂਝਾ ਕਰਦੇ ਹਾਂ",
        p: ["ਅਸੀਂ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਵੇਚਦੇ ਨਹੀਂ। ਅਸੀਂ ਇਸਨੂੰ ਸਿਰਫ਼ ਉਹਨਾਂ ਸੇਵਾ-ਪ੍ਰਦਾਤਾਵਾਂ ਨਾਲ ਸਾਂਝਾ ਕਰਦੇ ਹਾਂ ਜੋ ਸਟੇਸ਼ਨ ਅਤੇ ਵੈੱਬਸਾਈਟ ਚਲਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ, ਅਤੇ ਜਿਨ੍ਹਾਂ ਲਈ ਇਸਦੀ ਸੁਰੱਖਿਆ ਲਾਜ਼ਮੀ ਹੈ:"],
        list: [
          "Vercel (ਵੈੱਬਸਾਈਟ ਹੋਸਟਿੰਗ)",
          "Sanity (ਸਮੱਗਰੀ ਪ੍ਰਬੰਧਨ)",
          "Stripe (ਭੁਗਤਾਨ)",
          "Resend (ਈਮੇਲ)",
          "HighLevel / GoHighLevel (ਗਾਹਕ ਪ੍ਰਬੰਧਨ, WhatsApp ਅਤੇ SMS ਸੁਨੇਹੇ)",
          "Google (Analytics; ਵੀਡੀਓ ਲਈ YouTube)",
          "Meta (WhatsApp), ਜਦੋਂ ਤੁਸੀਂ ਉੱਥੇ ਸੁਨੇਹਾ ਭੇਜਦੇ ਹੋ",
        ],
      },
      {
        h: "6. ਕੈਨੇਡਾ ਤੋਂ ਬਾਹਰ ਸਟੋਰੇਜ",
        p: [
          "ਇਹਨਾਂ ਵਿੱਚੋਂ ਕੁਝ ਪ੍ਰਦਾਤਾ ਜਾਣਕਾਰੀ ਅਮਰੀਕਾ ਜਾਂ ਹੋਰ ਦੇਸ਼ਾਂ ਵਿੱਚ ਸਟੋਰ ਕਰਦੇ ਹਨ। ਅਜਿਹੇ ਵਿੱਚ ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਉਹਨਾਂ ਦੇਸ਼ਾਂ ਦੀਆਂ ਅਦਾਲਤਾਂ, ਪੁਲਿਸ ਅਤੇ ਰਾਸ਼ਟਰੀ ਸੁਰੱਖਿਆ ਅਧਿਕਾਰੀਆਂ ਦੀ ਪਹੁੰਚ ਵਿੱਚ ਹੋ ਸਕਦੀ ਹੈ।",
        ],
      },
      {
        h: "7. ਅਸੀਂ ਕਿੰਨਾ ਸਮਾਂ ਰੱਖਦੇ ਹਾਂ",
        p: [
          "ਅਸੀਂ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਸਿਰਫ਼ ਲੋੜ ਜਿੰਨਾ ਸਮਾਂ ਰੱਖਦੇ ਹਾਂ: ਪੁੱਛਗਿੱਛਾਂ ਅਤੇ ਬੁਕਿੰਗਾਂ ਲਈ ਆਮ ਤੌਰ ’ਤੇ 24 ਮਹੀਨੇ ਤੱਕ, ਅਤੇ ਕੈਨੇਡੀਅਨ ਟੈਕਸ ਕਾਨੂੰਨ ਮੁਤਾਬਕ ਭੁਗਤਾਨ ਰਿਕਾਰਡ 7 ਸਾਲ ਤੱਕ। ਨਿਊਜ਼ਲੈਟਰ ਦੀ ਜਾਣਕਾਰੀ ਤੁਹਾਡੇ ਬੰਦ ਕਰਵਾਉਣ ਤੱਕ। [CONFIRM retention periods]",
        ],
      },
      {
        h: "8. ਕੂਕੀਜ਼ ਅਤੇ ਐਨਾਲਿਟਿਕਸ",
        p: [
          "ਵੈੱਬਸਾਈਟ ਤੁਹਾਡੀ ਭਾਸ਼ਾ, ਰੰਗ ਅਤੇ ਟਾਈਮ ਜ਼ੋਨ ਦੀ ਚੋਣ ਯਾਦ ਰੱਖਣ ਲਈ ਕੁਝ ਕੂਕੀਜ਼ ਅਤੇ ਲੋਕਲ ਸਟੋਰੇਜ, ਅਤੇ ਵਿਜ਼ਿਟ ਮਾਪਣ ਲਈ Google Analytics ਕੂਕੀਜ਼ ਵਰਤਦੀ ਹੈ। YouTube ਵੀਡੀਓ (ਅਤੇ ਉਹਨਾਂ ਦੀਆਂ ਕੂਕੀਜ਼) ਸਿਰਫ਼ ਪਲੇਅ ਦਬਾਉਣ ’ਤੇ ਲੋਡ ਹੁੰਦੀਆਂ ਹਨ; ਅਸੀਂ YouTube ਦਾ ਪਰਦੇਦਾਰੀ ਵਾਲਾ ਮੋਡ ਵਰਤਦੇ ਹਾਂ। ਤੁਸੀਂ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਕੂਕੀਜ਼ ਰੋਕ ਜਾਂ ਮਿਟਾ ਸਕਦੇ ਹੋ; ਸਾਈਟ ਫਿਰ ਵੀ ਚੱਲੇਗੀ।",
        ],
      },
      {
        h: "9. ਸੁਰੱਖਿਆ",
        p: [
          "ਅਸੀਂ ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਦੀ ਸੁਰੱਖਿਆ ਲਈ HTTPS ਇਨਕ੍ਰਿਪਸ਼ਨ, ਭਰੋਸੇਯੋਗ ਸੇਵਾ-ਪ੍ਰਦਾਤਾ, ਸੀਮਤ ਸਟਾਫ਼ ਪਹੁੰਚ ਅਤੇ ਸਪੈਮ ਸੁਰੱਖਿਆ ਵਰਤਦੇ ਹਾਂ। ਕੋਈ ਵੀ ਸਿਸਟਮ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹੁੰਦਾ, ਇਸ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਫ਼ਾਰਮਾਂ ਰਾਹੀਂ ਸੰਵੇਦਨਸ਼ੀਲ ਜਾਣਕਾਰੀ (ਜਿਵੇਂ ਸਿਹਤ ਜਾਂ ਬੈਂਕ ਵੇਰਵੇ) ਨਾ ਭੇਜੋ।",
        ],
      },
      {
        h: "10. ਤੁਹਾਡੇ ਹੱਕ",
        p: [
          "ਤੁਸੀਂ ਸਾਡੇ ਕੋਲ ਆਪਣੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਦੇਖਣ, ਠੀਕ ਕਰਵਾਉਣ, ਜਾਂ ਜਿੱਥੇ ਰੱਖਣੀ ਲਾਜ਼ਮੀ ਨਹੀਂ ਉੱਥੇ ਮਿਟਵਾਉਣ ਦੀ ਬੇਨਤੀ ਕਰ ਸਕਦੇ ਹੋ। ਸਾਡੇ ਪਰਦੇਦਾਰੀ ਅਧਿਕਾਰੀ ਨਾਲ ਸੰਪਰਕ ਕਰੋ; ਅਸੀਂ 30 ਦਿਨਾਂ ਵਿੱਚ ਜਵਾਬ ਦੇਵਾਂਗੇ। ਜੇ ਤੁਸੀਂ ਸੰਤੁਸ਼ਟ ਨਹੀਂ, ਤਾਂ ਕੈਨੇਡਾ ਦੇ ਪਰਦੇਦਾਰੀ ਕਮਿਸ਼ਨਰ ਦੇ ਦਫ਼ਤਰ (priv.gc.ca) ਜਾਂ ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਦੇ ਸੂਚਨਾ ਅਤੇ ਪਰਦੇਦਾਰੀ ਕਮਿਸ਼ਨਰ ਦੇ ਦਫ਼ਤਰ (oipc.bc.ca) ਕੋਲ ਸ਼ਿਕਾਇਤ ਕਰ ਸਕਦੇ ਹੋ।",
        ],
      },
      {
        h: "11. ਬੱਚੇ",
        p: [
          "ਸਾਡੀ ਵੈੱਬਸਾਈਟ ਅਤੇ ਸੇਵਾਵਾਂ ਆਮ ਪਰਿਵਾਰਕ ਸਰੋਤਿਆਂ ਲਈ ਹਨ। ਅਸੀਂ ਜਾਣਬੁੱਝ ਕੇ ਮਾਪਿਆਂ ਜਾਂ ਸਰਪ੍ਰਸਤ ਦੀ ਸਹਿਮਤੀ ਤੋਂ ਬਿਨਾਂ 13 ਸਾਲ ਤੋਂ ਛੋਟੇ ਬੱਚਿਆਂ ਦੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਇਕੱਠੀ ਨਹੀਂ ਕਰਦੇ। ਮੁਕਾਬਲਿਆਂ ਦੀ ਯੋਗਤਾ ਦੇ ਨਿਯਮ ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ ਵਿੱਚ ਹਨ।",
        ],
      },
      { h: "12. ਬਦਲਾਅ", p: ["ਅਸੀਂ ਇਹ ਨੀਤੀ ਬਦਲ ਸਕਦੇ ਹਾਂ। ਉੱਪਰ ਲਿਖੀ ਤਾਰੀਖ਼ ਨਵਾਂ ਰੂਪ ਦਿਖਾਉਂਦੀ ਹੈ। ਵੱਡੇ ਬਦਲਾਅ ਵੈੱਬਸਾਈਟ ’ਤੇ ਉਘਾੜ ਕੇ ਦੱਸੇ ਜਾਣਗੇ।"] },
    ],
  },
};

export const terms: Record<"en" | "pa", LegalDoc> = {
  en: {
    h1: "Terms of Use",
    updated: "Last updated: [CONFIRM effective date]",
    intro:
      "These terms apply to indiradio.ca, the Indi Radio live stream and apps, and the services we offer through them, including dedications, contests and song requests. By using them you agree to these terms.",
    sections: [
      {
        h: "1. Using the website and stream",
        p: [
          "Indi Radio is free to listen to for personal, non-commercial use. You may not rebroadcast, record for redistribution, or embed the live stream on another website or service without our written permission.",
        ],
      },
      {
        h: "2. Content and trademarks",
        p: [
          "Shows, recordings, clips, text, graphics and the Indi Radio name and logo belong to Indi Radio or its licensors. Music is broadcast under licence from the relevant Canadian collective societies. You may share links to our pages and clips; please don’t copy or reuse our content in any other way without permission.",
        ],
      },
      {
        h: "3. Calling in and messaging",
        p: [
          "When you call in, send a WhatsApp message or voice note, or submit a request, you agree that it may be broadcast live, recorded, edited and shared on Indi Radio’s website, apps and social media, with your first name and city. Callers must follow the family-friendly standard on the Call In page. The host may end any call and we may decline to air any message.",
        ],
      },
      {
        h: "4. Dedications and shout-outs",
        list: [
          "Bookings are confirmed once payment is received (or, for request-only bookings, once the team confirms with you).",
          "We do our best to air your dedication on the date you choose. If a live show changes, we will contact you to agree a new date.",
          "Messages must be family-friendly and lawful. We may edit wording for air or refuse a message, with a full refund if we refuse it.",
          "Refunds: [CONFIRM refund policy, e.g. full refund if cancelled at least 48 hours before the air date].",
          "Prices are in Canadian dollars and include applicable taxes unless stated otherwise. [CONFIRM GST/PST treatment]",
        ],
      },
      {
        h: "5. Contests",
        list: [
          "No purchase is necessary to enter or win.",
          "Eligibility: [CONFIRM, e.g. residents of Canada aged 18+; employees of Indi Radio and their households are not eligible].",
          "Canadian winners must correctly answer a time-limited, mathematical skill-testing question before receiving a prize.",
          "Each contest’s specific rules (dates, prize, how the winner is chosen) are announced on air and on the Song Requests page.",
          "Prizes must be accepted as awarded and may not be exchanged for cash unless we decide otherwise.",
        ],
      },
      {
        h: "6. Song requests",
        p: ["We welcome requests, but we can’t guarantee that any request will be played or when."],
      },
      {
        h: "7. Advertising and sponsorship",
        p: ["Advertising and sponsorship are governed by a separate written agreement. We may decline any advertisement that does not fit our community standards."],
      },
      {
        h: "8. Third-party services",
        p: [
          "Our website links to and embeds services such as YouTube, TikTok, Facebook, Instagram, WhatsApp, the App Store, Google Play and Stripe. Their own terms and privacy policies apply when you use them.",
        ],
      },
      {
        h: "9. Opinions on air",
        p: [
          "Views expressed by callers and guests are their own and are not necessarily those of Indi Radio or Indi Jaswal. Nothing on Indi Radio is professional legal, financial, medical or immigration advice.",
        ],
      },
      {
        h: "10. Availability and liability",
        p: [
          "We work hard to keep the stream and website running but cannot guarantee they will always be available or error-free. To the extent permitted by law, Indi Radio is not liable for indirect or consequential losses arising from your use of the website, stream or services, and our total liability for any paid service is limited to the amount you paid for it.",
        ],
      },
      {
        h: "11. Governing law",
        p: ["These terms are governed by the laws of British Columbia and the federal laws of Canada that apply there."],
      },
      {
        h: "12. Changes and contact",
        p: ["We may update these terms from time to time. Questions? Contact us through the contact page."],
      },
    ],
  },
  pa: {
    h1: "ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ",
    updated: "ਆਖ਼ਰੀ ਵਾਰ ਅੱਪਡੇਟ: [CONFIRM effective date]",
    intro:
      "ਇਹ ਸ਼ਰਤਾਂ indiradio.ca, ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਲਾਈਵ ਸਟ੍ਰੀਮ ਅਤੇ ਐਪਾਂ, ਅਤੇ ਉਹਨਾਂ ਰਾਹੀਂ ਮਿਲਣ ਵਾਲੀਆਂ ਸੇਵਾਵਾਂ, ਜਿਵੇਂ ਸੁਨੇਹੇ, ਮੁਕਾਬਲੇ ਅਤੇ ਗੀਤ ਫ਼ਰਮਾਇਸ਼ਾਂ, ’ਤੇ ਲਾਗੂ ਹੁੰਦੀਆਂ ਹਨ। ਇਹਨਾਂ ਨੂੰ ਵਰਤ ਕੇ ਤੁਸੀਂ ਇਹਨਾਂ ਸ਼ਰਤਾਂ ਨਾਲ ਸਹਿਮਤ ਹੁੰਦੇ ਹੋ। ਜੇ ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਪੰਜਾਬੀ ਰੂਪ ਵਿੱਚ ਫ਼ਰਕ ਹੋਵੇ ਤਾਂ ਅੰਗਰੇਜ਼ੀ ਰੂਪ ਮੰਨਿਆ ਜਾਵੇਗਾ।",
    sections: [
      {
        h: "1. ਵੈੱਬਸਾਈਟ ਅਤੇ ਸਟ੍ਰੀਮ ਦੀ ਵਰਤੋਂ",
        p: [
          "ਨਿੱਜੀ, ਗ਼ੈਰ-ਵਪਾਰਕ ਵਰਤੋਂ ਲਈ ਇੰਡੀ ਰੇਡੀਓ ਸੁਣਨਾ ਮੁਫ਼ਤ ਹੈ। ਸਾਡੀ ਲਿਖਤੀ ਇਜਾਜ਼ਤ ਤੋਂ ਬਿਨਾਂ ਤੁਸੀਂ ਲਾਈਵ ਸਟ੍ਰੀਮ ਨੂੰ ਦੁਬਾਰਾ ਪ੍ਰਸਾਰਿਤ, ਅੱਗੇ ਵੰਡਣ ਲਈ ਰਿਕਾਰਡ, ਜਾਂ ਕਿਸੇ ਹੋਰ ਵੈੱਬਸਾਈਟ ਜਾਂ ਸੇਵਾ ਵਿੱਚ ਨਹੀਂ ਲਗਾ ਸਕਦੇ।",
        ],
      },
      {
        h: "2. ਸਮੱਗਰੀ ਅਤੇ ਟ੍ਰੇਡਮਾਰਕ",
        p: [
          "ਸ਼ੋਅ, ਰਿਕਾਰਡਿੰਗਾਂ, ਕਲਿੱਪ, ਲਿਖਤਾਂ, ਗ੍ਰਾਫ਼ਿਕਸ ਅਤੇ ਇੰਡੀ ਰੇਡੀਓ ਦਾ ਨਾਂ ਤੇ ਲੋਗੋ ਇੰਡੀ ਰੇਡੀਓ ਜਾਂ ਉਸਦੇ ਲਾਇਸੈਂਸਦਾਤਾਵਾਂ ਦੇ ਹਨ। ਸੰਗੀਤ ਸਬੰਧਤ ਕੈਨੇਡੀਅਨ ਸੰਸਥਾਵਾਂ ਦੇ ਲਾਇਸੈਂਸ ਅਧੀਨ ਪ੍ਰਸਾਰਿਤ ਹੁੰਦਾ ਹੈ। ਤੁਸੀਂ ਸਾਡੇ ਪੰਨਿਆਂ ਅਤੇ ਕਲਿੱਪਾਂ ਦੇ ਲਿੰਕ ਸਾਂਝੇ ਕਰ ਸਕਦੇ ਹੋ; ਇਜਾਜ਼ਤ ਤੋਂ ਬਿਨਾਂ ਸਾਡੀ ਸਮੱਗਰੀ ਹੋਰ ਕਿਸੇ ਤਰੀਕੇ ਕਾਪੀ ਜਾਂ ਵਰਤੋਂ ਨਾ ਕਰੋ।",
        ],
      },
      {
        h: "3. ਕਾਲ ਕਰਨਾ ਅਤੇ ਸੁਨੇਹੇ",
        p: [
          "ਜਦੋਂ ਤੁਸੀਂ ਕਾਲ ਕਰਦੇ ਹੋ, WhatsApp ਸੁਨੇਹਾ ਜਾਂ ਵੌਇਸ ਨੋਟ ਭੇਜਦੇ ਹੋ, ਜਾਂ ਕੋਈ ਬੇਨਤੀ ਭੇਜਦੇ ਹੋ, ਤਾਂ ਤੁਸੀਂ ਸਹਿਮਤ ਹੁੰਦੇ ਹੋ ਕਿ ਇਹ ਤੁਹਾਡੇ ਪਹਿਲੇ ਨਾਂ ਅਤੇ ਸ਼ਹਿਰ ਨਾਲ ਲਾਈਵ ਪ੍ਰਸਾਰਿਤ, ਰਿਕਾਰਡ, ਸੰਪਾਦਿਤ ਅਤੇ ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਵੈੱਬਸਾਈਟ, ਐਪਾਂ ਅਤੇ ਸੋਸ਼ਲ ਮੀਡੀਆ ’ਤੇ ਸਾਂਝਾ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ। ਕਾਲਰਾਂ ਨੂੰ ‘ਕਾਲ ਕਰੋ’ ਪੰਨੇ ’ਤੇ ਦਿੱਤੇ ਪਰਿਵਾਰਕ ਮਿਆਰ ਦੀ ਪਾਲਣਾ ਕਰਨੀ ਪਵੇਗੀ। ਹੋਸਟ ਕੋਈ ਵੀ ਕਾਲ ਕੱਟ ਸਕਦਾ ਹੈ ਅਤੇ ਅਸੀਂ ਕੋਈ ਵੀ ਸੁਨੇਹਾ ਨਾ ਚਲਾਉਣ ਦਾ ਫ਼ੈਸਲਾ ਕਰ ਸਕਦੇ ਹਾਂ।",
        ],
      },
      {
        h: "4. ਸੁਨੇਹੇ ਅਤੇ ਸ਼ਾਊਟ-ਆਊਟ",
        list: [
          "ਬੁਕਿੰਗ ਭੁਗਤਾਨ ਮਿਲਣ ’ਤੇ ਪੱਕੀ ਹੁੰਦੀ ਹੈ (ਜਾਂ ਸਿਰਫ਼-ਬੇਨਤੀ ਵਾਲੀਆਂ ਬੁਕਿੰਗਾਂ ਲਈ, ਟੀਮ ਵੱਲੋਂ ਤੁਹਾਡੇ ਨਾਲ ਪੱਕਾ ਕਰਨ ’ਤੇ)।",
          "ਅਸੀਂ ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਤੁਹਾਡੀ ਚੁਣੀ ਤਾਰੀਖ਼ ’ਤੇ ਚਲਾਉਣ ਦੀ ਪੂਰੀ ਕੋਸ਼ਿਸ਼ ਕਰਦੇ ਹਾਂ। ਜੇ ਲਾਈਵ ਸ਼ੋਅ ਬਦਲੇ, ਅਸੀਂ ਨਵੀਂ ਤਾਰੀਖ਼ ਲਈ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰਾਂਗੇ।",
          "ਸੁਨੇਹੇ ਪਰਿਵਾਰ ਨਾਲ ਸੁਣਨ ਯੋਗ ਅਤੇ ਕਾਨੂੰਨੀ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ। ਅਸੀਂ ਆਨ-ਏਅਰ ਲਈ ਸ਼ਬਦ ਸੋਧ ਸਕਦੇ ਹਾਂ ਜਾਂ ਸੁਨੇਹਾ ਨਾਮਨਜ਼ੂਰ ਕਰ ਸਕਦੇ ਹਾਂ; ਨਾਮਨਜ਼ੂਰ ਕਰਨ ’ਤੇ ਪੂਰੇ ਪੈਸੇ ਵਾਪਸ।",
          "ਰਿਫ਼ੰਡ: [CONFIRM refund policy]",
          "ਕੀਮਤਾਂ ਕੈਨੇਡੀਅਨ ਡਾਲਰਾਂ ਵਿੱਚ ਹਨ। [CONFIRM GST/PST treatment]",
        ],
      },
      {
        h: "5. ਮੁਕਾਬਲੇ",
        list: [
          "ਹਿੱਸਾ ਲੈਣ ਜਾਂ ਜਿੱਤਣ ਲਈ ਕੁਝ ਵੀ ਖ਼ਰੀਦਣ ਦੀ ਲੋੜ ਨਹੀਂ।",
          "ਯੋਗਤਾ: [CONFIRM eligibility]",
          "ਕੈਨੇਡਾ ਦੇ ਜੇਤੂਆਂ ਨੂੰ ਇਨਾਮ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਸਮਾਂ-ਸੀਮਾ ਵਾਲੇ ਗਣਿਤ ਦੇ ਹੁਨਰ-ਪਰਖ ਸਵਾਲ ਦਾ ਸਹੀ ਜਵਾਬ ਦੇਣਾ ਪਵੇਗਾ।",
          "ਹਰ ਮੁਕਾਬਲੇ ਦੇ ਖ਼ਾਸ ਨਿਯਮ (ਤਾਰੀਖ਼ਾਂ, ਇਨਾਮ, ਜੇਤੂ ਕਿਵੇਂ ਚੁਣਿਆ ਜਾਵੇਗਾ) ਆਨ-ਏਅਰ ਅਤੇ ‘ਗੀਤ ਦੀ ਫ਼ਰਮਾਇਸ਼’ ਪੰਨੇ ’ਤੇ ਦੱਸੇ ਜਾਂਦੇ ਹਨ।",
          "ਇਨਾਮ ਜਿਵੇਂ ਦਿੱਤੇ ਜਾਣ ਉਸੇ ਤਰ੍ਹਾਂ ਸਵੀਕਾਰ ਕਰਨੇ ਪੈਣਗੇ ਅਤੇ ਨਕਦ ਵਿੱਚ ਨਹੀਂ ਬਦਲੇ ਜਾ ਸਕਦੇ, ਜਦੋਂ ਤੱਕ ਅਸੀਂ ਹੋਰ ਫ਼ੈਸਲਾ ਨਾ ਕਰੀਏ।",
        ],
      },
      { h: "6. ਗੀਤ ਫ਼ਰਮਾਇਸ਼ਾਂ", p: ["ਫ਼ਰਮਾਇਸ਼ਾਂ ਦਾ ਸਵਾਗਤ ਹੈ, ਪਰ ਅਸੀਂ ਗਾਰੰਟੀ ਨਹੀਂ ਦੇ ਸਕਦੇ ਕਿ ਕੋਈ ਫ਼ਰਮਾਇਸ਼ ਚੱਲੇਗੀ ਜਾਂ ਕਦੋਂ ਚੱਲੇਗੀ।"] },
      { h: "7. ਮਸ਼ਹੂਰੀ ਅਤੇ ਸਪਾਂਸਰਸ਼ਿਪ", p: ["ਮਸ਼ਹੂਰੀ ਅਤੇ ਸਪਾਂਸਰਸ਼ਿਪ ਵੱਖਰੇ ਲਿਖਤੀ ਇਕਰਾਰਨਾਮੇ ਅਧੀਨ ਹੁੰਦੀ ਹੈ। ਅਸੀਂ ਭਾਈਚਾਰਕ ਮਿਆਰਾਂ ’ਤੇ ਪੂਰਾ ਨਾ ਉਤਰਨ ਵਾਲਾ ਕੋਈ ਵੀ ਇਸ਼ਤਿਹਾਰ ਨਾਮਨਜ਼ੂਰ ਕਰ ਸਕਦੇ ਹਾਂ।"] },
      {
        h: "8. ਤੀਜੀ-ਧਿਰ ਦੀਆਂ ਸੇਵਾਵਾਂ",
        p: ["ਸਾਡੀ ਵੈੱਬਸਾਈਟ YouTube, TikTok, Facebook, Instagram, WhatsApp, App Store, Google Play ਅਤੇ Stripe ਵਰਗੀਆਂ ਸੇਵਾਵਾਂ ਨਾਲ ਜੁੜਦੀ ਹੈ। ਉਹਨਾਂ ਨੂੰ ਵਰਤਣ ਵੇਲੇ ਉਹਨਾਂ ਦੀਆਂ ਆਪਣੀਆਂ ਸ਼ਰਤਾਂ ਅਤੇ ਪਰਦੇਦਾਰੀ ਨੀਤੀਆਂ ਲਾਗੂ ਹੁੰਦੀਆਂ ਹਨ।"],
      },
      {
        h: "9. ਆਨ-ਏਅਰ ਵਿਚਾਰ",
        p: ["ਕਾਲਰਾਂ ਅਤੇ ਮਹਿਮਾਨਾਂ ਦੇ ਵਿਚਾਰ ਉਹਨਾਂ ਦੇ ਆਪਣੇ ਹਨ, ਜ਼ਰੂਰੀ ਨਹੀਂ ਕਿ ਇੰਡੀ ਰੇਡੀਓ ਜਾਂ ਇੰਡੀ ਜਸਵਾਲ ਦੇ ਹੋਣ। ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਕੁਝ ਵੀ ਪੇਸ਼ੇਵਰ ਕਾਨੂੰਨੀ, ਵਿੱਤੀ, ਡਾਕਟਰੀ ਜਾਂ ਇਮੀਗ੍ਰੇਸ਼ਨ ਸਲਾਹ ਨਹੀਂ ਹੈ।"],
      },
      {
        h: "10. ਉਪਲਬਧਤਾ ਅਤੇ ਜ਼ਿੰਮੇਵਾਰੀ",
        p: [
          "ਅਸੀਂ ਸਟ੍ਰੀਮ ਅਤੇ ਵੈੱਬਸਾਈਟ ਚਲਾਈ ਰੱਖਣ ਦੀ ਪੂਰੀ ਕੋਸ਼ਿਸ਼ ਕਰਦੇ ਹਾਂ ਪਰ ਗਾਰੰਟੀ ਨਹੀਂ ਦੇ ਸਕਦੇ ਕਿ ਇਹ ਹਮੇਸ਼ਾ ਉਪਲਬਧ ਜਾਂ ਗ਼ਲਤੀ-ਰਹਿਤ ਰਹਿਣਗੀਆਂ। ਕਾਨੂੰਨ ਦੀ ਇਜਾਜ਼ਤ ਅਨੁਸਾਰ, ਇੰਡੀ ਰੇਡੀਓ ਅਸਿੱਧੇ ਨੁਕਸਾਨਾਂ ਲਈ ਜ਼ਿੰਮੇਵਾਰ ਨਹੀਂ ਹੈ, ਅਤੇ ਕਿਸੇ ਪੇਡ ਸੇਵਾ ਲਈ ਸਾਡੀ ਕੁੱਲ ਜ਼ਿੰਮੇਵਾਰੀ ਤੁਹਾਡੇ ਵੱਲੋਂ ਦਿੱਤੀ ਰਕਮ ਤੱਕ ਸੀਮਤ ਹੈ।",
        ],
      },
      { h: "11. ਲਾਗੂ ਕਾਨੂੰਨ", p: ["ਇਹ ਸ਼ਰਤਾਂ ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਦੇ ਕਾਨੂੰਨਾਂ ਅਤੇ ਉੱਥੇ ਲਾਗੂ ਕੈਨੇਡਾ ਦੇ ਸੰਘੀ ਕਾਨੂੰਨਾਂ ਅਧੀਨ ਹਨ।"] },
      { h: "12. ਬਦਲਾਅ ਅਤੇ ਸੰਪਰਕ", p: ["ਅਸੀਂ ਸਮੇਂ-ਸਮੇਂ ’ਤੇ ਇਹ ਸ਼ਰਤਾਂ ਬਦਲ ਸਕਦੇ ਹਾਂ। ਸਵਾਲ? ਸੰਪਰਕ ਪੰਨੇ ਰਾਹੀਂ ਸਾਡੇ ਨਾਲ ਗੱਲ ਕਰੋ।"] },
    ],
  },
};
