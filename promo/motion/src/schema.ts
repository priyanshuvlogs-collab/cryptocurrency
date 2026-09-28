import { z } from "zod";

/**
 * Every word in the video. Editable in Remotion Studio (npm run studio →
 * Props panel) without touching the scene code.
 */
export const promoSchema = z.object({
  hook: z.object({
    pill: z.string(),
    words: z.array(z.string()).min(1).max(4),
    sub: z.string(),
  }),
  logo: z.object({ tagline: z.string() }),
  home: z.object({
    title: z.string(),
    sub: z.string(),
    callouts: z.array(z.string()).length(4),
  }),
  listen: z.object({ title: z.array(z.string()).length(2), sub: z.string(), nowPlaying: z.string() }),
  clocks: z.object({ title: z.array(z.string()).length(2), sub: z.string() }),
  advertise: z.object({
    title: z.array(z.string()).length(2),
    sub: z.string(),
    packages: z.array(z.string()).length(3),
    cta: z.string(),
    whatsapp: z.string(),
  }),
  end: z.object({
    visit: z.string(),
    url: z.string(),
    listen: z.string(),
    whatsapp: z.string(),
    footer: z.string(),
  }),
  subtitles: z.object({
    show: z.boolean(),
    // One line per scene, in order: hook, logo, home, listen, clocks, advertise, end. Empty = none.
    lines: z.array(z.string()).length(7),
  }),
  audio: z.object({
    voiceover: z.string().nullable(), // file in public/, e.g. "voiceover.mp3"
    voiceoverStartSeconds: z.number().min(0),
    music: z.string().nullable(), // licensed track in public/
    musicVolume: z.number().min(0).max(1),
  }),
  /** Set automatically by calculateMetadata so the end card holds until the voiceover ends. */
  extraEndFrames: z.number().int().min(0),
});

export type PromoProps = z.infer<typeof promoSchema>;

export const defaultPromoProps: PromoProps = {
  hook: { pill: "LIVE · SURREY, BC", words: ["ਤੁਹਾਡਾ", "ਆਪਣਾ", "ਰੇਡੀਓ"], sub: "Your own Punjabi radio station." },
  logo: { tagline: "LIVE PUNJABI RADIO" },
  home: {
    title: "ਲਾਈਵ ਪੰਜਾਬੀ ਰੇਡੀਓ",
    sub: "Talk shows, music and community, all day.",
    callouts: ["LIVE NOW", "Call-in shows", "ਪੰਜਾਬੀ + English", "Bhedan Da Kaal"],
  },
  listen: { title: ["ਇੱਕ ਟੈਪ।", "ਲਾਈਵ।"], sub: "One tap and\nyou’re listening.", nowPlaying: "Now playing" },
  clocks: { title: ["ਹਰ ਸ਼ੋਅ,", "ਤੁਹਾਡੇ ਸਮੇਂ ਵਿੱਚ"], sub: "Show times convert to your city automatically." },
  advertise: {
    title: ["ਪ੍ਰਮੋਟ ਕਰਵਾਓ", "ਆਪਣਾ ਬਿਜ਼ਨਸ"],
    sub: "Reach Punjabi families in Surrey and beyond.",
    packages: ["On-Air Spots", "★ Live Host-Read", "Show sponsorship"],
    cta: "Get pricing →",
    whatsapp: "WhatsApp 778-834-0325",
  },
  end: {
    visit: "ਹੁਣੇ ਵਿਜ਼ਿਟ ਕਰੋ",
    url: "indiradio.ca",
    listen: "▶ LISTEN LIVE",
    whatsapp: "WhatsApp 778-834-0325",
    footer: "Advertise: indiradio.ca/advertise",
  },
  subtitles: {
    show: true,
    // Matches the voiceover script in ../config.motion.json. Hook, logo and end card
    // already carry their words on screen, so they stay empty.
    lines: [
      "",
      "",
      "ਸਰੀ ਤੋਂ ਲਾਈਵ ਪੰਜਾਬੀ ਰੇਡੀਓ: ਗੱਲਬਾਤ, ਸੰਗੀਤ ਅਤੇ ਭਾਈਚਾਰਾ, ਸਾਰਾ ਦਿਨ।",
      "ਬੱਸ ਇੱਕ ਟੈਪ, ਤੇ ਤੁਸੀਂ ਲਾਈਵ ਸੁਣ ਰਹੇ ਹੋ।",
      "ਦੁਨੀਆ ਵਿੱਚ ਕਿਤੇ ਵੀ ਹੋਵੋ, ਹਰ ਸ਼ੋਅ ਦਾ ਸਮਾਂ ਤੁਹਾਡੇ ਸ਼ਹਿਰ ਮੁਤਾਬਕ।",
      "ਤੇ ਜੇ ਤੁਹਾਡਾ ਕੋਈ ਕਾਰੋਬਾਰ ਹੈ, ਤਾਂ ਪ੍ਰਮੋਟ ਕਰਵਾਓ ਆਪਣਾ ਬਿਜ਼ਨਸ ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ।",
      "",
    ],
  },
  audio: { voiceover: null, voiceoverStartSeconds: 0.5, music: null, musicVolume: 0.18 },
  extraEndFrames: 0,
};
