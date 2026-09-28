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
    /** One voice clip per scene (files in public/, or null for silence), in scene order. */
    voiceLines: z.array(z.string().nullable()).length(7),
    /** Frames after a scene's transition before its line starts. */
    voiceLeadFrames: z.number().int().min(0),
    music: z.string().nullable(), // background track in public/
    musicVolume: z.number().min(0).max(1), // while the voice speaks
    musicVolumeNoVoice: z.number().min(0).max(1), // in the gaps between lines
  }),
  /**
   * Minimum length of each scene in frames (30 fps): hook, logo, home, listen,
   * clocks, advertise, end. calculateMetadata stretches a scene when its voice
   * line needs more room. Neighbouring scenes overlap by 16 frames.
   */
  sceneFrames: z.array(z.number().int().min(40)).length(7),
  /** Frame (inside the listen scene) where the finger taps play: on the word "ਟੈਪ". */
  listenTapFrame: z.number().int().min(10),
  /** Music beat grid for beat-synced motion (V2): frames per beat and the first beat's frame. */
  beatPeriodFrames: z.number().min(4),
  beatOffsetFrames: z.number().min(0),
  /** Set automatically by calculateMetadata: final scene lengths and each voice line's length. */
  resolvedSceneFrames: z.array(z.number().int()).length(7),
  voiceLineSeconds: z.array(z.number().min(0)).length(7),
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
    // Matches the voice lines. Hook, logo and end card
    // already carry their words on screen, so they stay empty.
    lines: [
      "",
      "",
      "ਸਰੀ ਤੋਂ, ਲਾਈਵ ਪੰਜਾਬੀ ਰੇਡੀਓ… ਗੱਲਬਾਤ, ਸੰਗੀਤ, ਤੇ ਭਾਈਚਾਰਾ — ਸਾਰਾ ਦਿਨ।",
      "ਬੱਸ ਇੱਕ ਟੈਪ… ਤੇ ਤੁਸੀਂ ਲਾਈਵ ਸੁਣ ਰਹੇ ਹੋ!",
      "ਦੁਨੀਆ ਵਿੱਚ ਕਿਤੇ ਵੀ ਹੋਵੋ… ਹਰ ਸ਼ੋਅ ਦਾ ਸਮਾਂ, ਤੁਹਾਡੇ ਆਪਣੇ ਸ਼ਹਿਰ ਮੁਤਾਬਕ।",
      "ਤੇ ਜੇ ਤੁਹਾਡਾ ਕੋਈ ਕਾਰੋਬਾਰ ਹੈ… ਤਾਂ ਪ੍ਰਮੋਟ ਕਰਵਾਓ ਆਪਣਾ ਬਿਜ਼ਨਸ — ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ!",
      "",
    ],
  },
  // Voice: ElevenLabs eleven_v3, "Pind Waali Desi Punjabi Voice", one clip per scene (public/voice).
  // Music: ElevenLabs eleven_music_v2, instrumental Punjabi bhangra (public/music).
  audio: {
    voiceLines: [1, 2, 3, 4, 5, 6, 7].map((n) => `voice/line${n}.mp3`),
    voiceLeadFrames: 4,
    music: "music/bhangra1.mp3",
    musicVolume: 0.16,
    musicVolumeNoVoice: 0.34,
  },
  sceneFrames: [90, 70, 150, 120, 130, 180, 150],
  listenTapFrame: 40,
  beatPeriodFrames: 18, // 100 BPM, measured from bhangra1.mp3
  beatOffsetFrames: 8.25, // first dhol hit of bhangra1.mp3
  resolvedSceneFrames: [90, 70, 150, 120, 130, 180, 150],
  voiceLineSeconds: [0, 0, 0, 0, 0, 0, 0],
};
