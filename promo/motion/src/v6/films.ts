/**
 * The ten shorts: 5 Hindi, 5 Punjabi. Each has three story beats and an end
 * card; every beat and the end card has one narrator line (ElevenLabs eleven_v3,
 * with direction tags and pauses) saved as public/shorts/<id>/l1-4.mp3.
 *
 * All footage is the respectful set made for "ਘਰ ਦੀ ਆਵਾਜ਼" (public/home) plus
 * real screenshots of indiradio.ca. No numbers or claims beyond what the station
 * is: a Punjabi/South Asian radio station live from Surrey.
 */
import type { ShortProps } from "./Short";

type Line = { visual: string; visual2?: string; trim?: number; text: string; sub: string; say: string };
type FilmDef = {
  id: string;
  lang: ShortProps["lang"];
  style: ShortProps["style"];
  hook: string;
  /** ElevenLabs voice, from creative_list_voices. */
  voice: { id: string; name: string };
  beats: [Line, Line, Line];
  end: { tagline: string; sub: string; say: string };
  music: string;
  musicVolume: number;
};

const S1 = "home/shot1.jpg"; // grandfather with chai at dawn
const S2 = "home/shot2.mp4"; // young woman driving to work
const S3 = "home/shot3.mp4"; // shopkeeper opening up
const S4 = "home/shot4.mp4"; // three generations at dinner
const S5 = "home/shot5.mp4"; // grandmother calling in to the show
const LISTEN = "shots/listen-pa.jpg";
const HOME = "shots/home-pa.jpg";
const PACKAGES = "shots/packages-en.jpg";
const PRICING = "shots/pricing-pa.jpg";

const RUHAAN = { id: "LYBUVClTvAjOGucefCqd", name: "Ruhaan – Warm Brand Ad Commercial (hi)" };
const RIYA = { id: "e6h2ged6ThVk1jTnIwnC", name: "Riya Rao – Elegant Ad Narration (hi)" };
const AAKASH = { id: "SHbhumHCu8CeDYRlXKea", name: "Aakash Aryan – Charismatic Mass Ads (hi)" };
const JASKIRAT = { id: "fBXc7vfuym7wUXyB57Eo", name: "Jaskirat – Expressive Punjabi Narrator (pa)" };
const SIMRAN = { id: "9UNN0bXPo2Z6G30E64lz", name: "Simran – Proud Majhi Narrator (pa)" };
const NAVJOT = { id: "eGmg6o3kXJVO1TqU1fVF", name: "Navjot – Cheerful Majhi Ad (pa)" };

export const FILM_DEFS: FilmDef[] = [
  /* ── Hindi ── */
  {
    id: "hi1-apni-zubaan",
    lang: "hi",
    style: "cinema",
    hook: "अपनी ज़ुबान",
    voice: RUHAAN,
    beats: [
      { visual: S1, text: "परदेस में… सबसे ज़्यादा याद आती है — अपनी ज़ुबान।", sub: "Far from home, you miss your language most", say: "[warmly] परदेस में… सबसे ज़्यादा याद आती है — अपनी ज़ुबान।" },
      { visual: S4, text: "शाम का खाना… और घर जैसी बातें।", sub: "Dinner, and talk that feels like home", say: "[softly] शाम का खाना… और घर जैसी बातें।" },
      { visual: S5, text: "रेडियो पर… अपनों की आवाज़।", sub: "On the radio, voices of our own", say: "[warmly] रेडियो पर… अपनों की आवाज़।" },
    ],
    end: { tagline: "घर की आवाज़", sub: "सरी से लाइव", say: "[warmly] इंडी रेडियो… घर की आवाज़। सरी से लाइव।" },
    music: "shorts/music-warm.mp3",
    musicVolume: 0.5,
  },
  {
    id: "hi2-safar-ka-saathi",
    lang: "hi",
    style: "frame",
    hook: "सफ़र का साथी",
    voice: RIYA,
    beats: [
      { visual: S2, text: "ट्रैफ़िक लंबा हो… या दिन थकाने वाला —", sub: "A long drive or a long day", say: "[casually, warm] ट्रैफ़िक लंबा हो… या दिन थकाने वाला —" },
      { visual: LISTEN, text: "बस एक टैप… और इंडी रेडियो लाइव।", sub: "One tap and you're live", say: "[cheerfully] बस एक टैप… और इंडी रेडियो लाइव।" },
      { visual: S2, trim: 2.5, text: "अपने गाने, अपनी बातें — पूरे रास्ते।", sub: "Our songs, our talk, all the way", say: "[warmly, smiling] अपने गाने, अपनी बातें — पूरे रास्ते।" },
    ],
    end: { tagline: "हर सफ़र का साथी", sub: "सरी से लाइव", say: "[confidently] इंडी रेडियो — हर सफ़र में, आपके साथ।" },
    music: "viral/music.mp3",
    musicVolume: 0.4,
  },
  {
    id: "hi3-business",
    lang: "hi",
    style: "kinetic",
    hook: "बिज़नेस वालों के लिए",
    voice: AAKASH,
    beats: [
      { visual: S3, text: "आपकी दुकान… आपकी मेहनत…", sub: "Your shop, your hard work", say: "[confidently] आपकी दुकान… आपकी मेहनत…" },
      { visual: PACKAGES, text: "अब सीधे पहुँचाइए अपनी कम्युनिटी तक।", sub: "Now reach your community directly", say: "[excited] अब सीधे पहुँचाइए — अपनी कम्युनिटी तक!" },
      { visual: S4, text: "वहाँ, जहाँ आपके ग्राहक सुनते हैं।", sub: "Right where your customers listen", say: "[warmly] वहाँ… जहाँ आपके ग्राहक सुनते हैं।" },
    ],
    end: { tagline: "इंडी रेडियो पर विज्ञापन दें", sub: "पैकेज देखें", say: "[confidently] इंडी रेडियो पर विज्ञापन दीजिए। इंडीरेडियो डॉट सी ए।" },
    music: "music/bhangra1.mp3",
    musicVolume: 0.4,
  },
  {
    id: "hi4-teen-peedhiyan",
    lang: "hi",
    style: "split",
    hook: "तीन पीढ़ियाँ",
    voice: RUHAAN,
    beats: [
      { visual: S1, visual2: S5, text: "दादा-दादी की सुबह की चाय…", sub: "Grandparents' morning chai", say: "[warmly] दादा-दादी की सुबह की चाय…" },
      { visual: S2, visual2: S3, text: "मम्मी का सफ़र… पापा की दुकान…", sub: "Mom's drive, Dad's shop", say: "[gently] मम्मी का सफ़र… पापा की दुकान…" },
      { visual: S4, visual2: S4, trim: 2.5, text: "और शाम को — सब एक साथ।", sub: "And every evening, all together", say: "[warmly] और शाम को — सब एक साथ।" },
    ],
    end: { tagline: "पूरे परिवार का रेडियो", sub: "तीन पीढ़ियाँ, एक आवाज़", say: "[warmly, with pride] तीन पीढ़ियाँ… एक आवाज़। इंडी रेडियो।" },
    music: "home/music.mp3",
    musicVolume: 0.5,
  },
  {
    id: "hi5-aapki-awaaz",
    lang: "hi",
    style: "dial",
    hook: "आपकी आवाज़",
    voice: RIYA,
    beats: [
      { visual: S5, text: "कभी सोचा है… आपकी आवाज़ रेडियो पर गूँजे?", sub: "Ever imagined your voice on the radio?", say: "[softly, curious] कभी सोचा है… आपकी आवाज़ रेडियो पर गूँजे?" },
      { visual: LISTEN, text: "ट्यून कीजिए… कॉल कीजिए…", sub: "Tune in. Call in.", say: "[warmly] ट्यून कीजिए… कॉल कीजिए…" },
      { visual: S5, trim: 2.5, text: "और दिल की बात कहिए — लाइव।", sub: "And say what's in your heart, live", say: "[emotional, warm] और दिल की बात कहिए — लाइव।" },
    ],
    end: { tagline: "यहाँ हर आवाज़ सुनी जाती है", sub: "सरी से लाइव", say: "[warmly] इंडी रेडियो… यहाँ हर आवाज़ सुनी जाती है।" },
    music: "shorts/music-morning.mp3",
    musicVolume: 0.5,
  },

  /* ── Punjabi ── */
  {
    id: "pa1-savere-da-saath",
    lang: "pa",
    style: "dial",
    hook: "ਸਵੇਰ ਦਾ ਸਾਥ",
    voice: JASKIRAT,
    beats: [
      { visual: S1, text: "ਸਵੇਰ ਦੀ ਪਹਿਲੀ ਚਾਹ…", sub: "The first chai of the morning", say: "[softly, warmly] ਸਵੇਰ ਦੀ ਪਹਿਲੀ ਚਾਹ…" },
      { visual: HOME, text: "ਤੇ ਰੇਡੀਓ ’ਤੇ ਆਪਣੀ ਬੋਲੀ।", sub: "And our own language on the radio", say: "[warmly] ਤੇ ਰੇਡੀਓ ’ਤੇ… ਆਪਣੀ ਬੋਲੀ।" },
      { visual: S3, text: "ਦੁਕਾਨਾਂ ਖੁੱਲ੍ਹਦੀਆਂ ਨੇ… ਦਿਨ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।", sub: "Shops open, the day begins", say: "[gently] ਦੁਕਾਨਾਂ ਖੁੱਲ੍ਹਦੀਆਂ ਨੇ… ਦਿਨ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।" },
    ],
    end: { tagline: "ਘਰ ਵਰਗੀ ਸਵੇਰ", sub: "ਸਰੀ ਤੋਂ ਲਾਈਵ", say: "[warmly] ਇੰਡੀ ਰੇਡੀਓ… ਘਰ ਵਰਗੀ ਸਵੇਰ।" },
    music: "shorts/music-morning.mp3",
    musicVolume: 0.5,
  },
  {
    id: "pa2-raah-da-saathi",
    lang: "pa",
    style: "kinetic",
    hook: "ਰਾਹ ਦਾ ਸਾਥੀ",
    voice: NAVJOT,
    beats: [
      { visual: S2, text: "ਕੰਮ ’ਤੇ ਜਾਣਾ ਹੋਵੇ…", sub: "Heading to work?", say: "[cheerfully] ਕੰਮ ’ਤੇ ਜਾਣਾ ਹੋਵੇ…" },
      { visual: LISTEN, text: "ਬੱਸ ਇੱਕ ਟੈਪ — ਤੇ ਇੰਡੀ ਰੇਡੀਓ ਲਾਈਵ!", sub: "One tap and you're live", say: "[excited] ਬੱਸ ਇੱਕ ਟੈਪ — ਤੇ ਇੰਡੀ ਰੇਡੀਓ ਲਾਈਵ!" },
      { visual: S2, trim: 2.5, text: "ਰਾਹ ਵਿੱਚ ਆਪਣੇ ਗੀਤ, ਆਪਣੀਆਂ ਗੱਲਾਂ!", sub: "Our songs and talk on the road", say: "[cheerfully] ਰਾਹ ਵਿੱਚ… ਆਪਣੇ ਗੀਤ, ਆਪਣੀਆਂ ਗੱਲਾਂ!" },
    ],
    end: { tagline: "ਹਰ ਸਫ਼ਰ ਦਾ ਸਾਥੀ", sub: "ਸਰੀ ਤੋਂ ਲਾਈਵ", say: "[confidently] ਇੰਡੀ ਰੇਡੀਓ — ਹਰ ਸਫ਼ਰ ਦਾ ਸਾਥੀ!" },
    music: "music/bhangra2.mp3",
    musicVolume: 0.4,
  },
  {
    id: "pa3-karobaar",
    lang: "pa",
    style: "frame",
    hook: "ਕਾਰੋਬਾਰ ਲਈ",
    voice: JASKIRAT,
    beats: [
      { visual: S3, text: "ਮਿਹਨਤ ਨਾਲ ਬਣਾਇਆ ਕਾਰੋਬਾਰ…", sub: "A business built on hard work", say: "[confidently] ਮਿਹਨਤ ਨਾਲ ਬਣਾਇਆ ਕਾਰੋਬਾਰ…" },
      { visual: PRICING, text: "ਹੁਣ ਪਹੁੰਚਾਓ ਸਿੱਧਾ ਆਪਣੇ ਭਾਈਚਾਰੇ ਤੱਕ।", sub: "Now reach your community directly", say: "[warmly] ਹੁਣ ਪਹੁੰਚਾਓ… ਸਿੱਧਾ ਆਪਣੇ ਭਾਈਚਾਰੇ ਤੱਕ।" },
      { visual: S4, text: "ਉੱਥੇ, ਜਿੱਥੇ ਤੁਹਾਡੇ ਗਾਹਕ ਸੁਣਦੇ ਨੇ।", sub: "Right where your customers listen", say: "[warmly] ਉੱਥੇ… ਜਿੱਥੇ ਤੁਹਾਡੇ ਗਾਹਕ ਸੁਣਦੇ ਨੇ।" },
    ],
    end: { tagline: "ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਇਸ਼ਤਿਹਾਰ ਦਿਓ", sub: "ਪੈਕੇਜ ਵੇਖੋ", say: "[confidently] ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਇਸ਼ਤਿਹਾਰ ਦਿਓ। ਇੰਡੀਰੇਡੀਓ ਡਾਟ ਸੀ ਏ।" },
    music: "music/bhangra1.mp3",
    musicVolume: 0.4,
  },
  {
    id: "pa4-maa-boli",
    lang: "pa",
    style: "cinema",
    hook: "ਮਾਂ ਬੋਲੀ",
    voice: SIMRAN,
    beats: [
      { visual: S4, text: "ਬੱਚੇ ਵੱਡੇ ਹੋ ਰਹੇ ਨੇ ਕੈਨੇਡਾ ਵਿੱਚ…", sub: "Our kids are growing up in Canada", say: "[warmly] ਬੱਚੇ ਵੱਡੇ ਹੋ ਰਹੇ ਨੇ… ਕੈਨੇਡਾ ਵਿੱਚ…" },
      { visual: S1, text: "ਪਰ ਬਾਪੂ ਜੀ ਦੀਆਂ ਗੱਲਾਂ ਅੱਜ ਵੀ ਪੰਜਾਬੀ ’ਚ ਨੇ।", sub: "But grandpa's stories are still in Punjabi", say: "[softly, with pride] ਪਰ ਬਾਪੂ ਜੀ ਦੀਆਂ ਗੱਲਾਂ… ਅੱਜ ਵੀ ਪੰਜਾਬੀ ’ਚ ਨੇ।" },
      { visual: S4, trim: 2.5, text: "ਮਾਂ ਬੋਲੀ… ਹਰ ਸ਼ਾਮ ਘਰ ਵਿੱਚ ਗੂੰਜਦੀ ਹੈ।", sub: "Our mother tongue fills the home every evening", say: "[emotional, warm] ਮਾਂ ਬੋਲੀ… ਹਰ ਸ਼ਾਮ ਘਰ ਵਿੱਚ ਗੂੰਜਦੀ ਹੈ।" },
    ],
    end: { tagline: "ਆਪਣੀ ਬੋਲੀ, ਆਪਣਾ ਰੇਡੀਓ", sub: "ਸਰੀ ਤੋਂ ਲਾਈਵ", say: "[warmly, proudly] ਇੰਡੀ ਰੇਡੀਓ — ਆਪਣੀ ਬੋਲੀ, ਆਪਣਾ ਰੇਡੀਓ।" },
    music: "shorts/music-warm.mp3",
    musicVolume: 0.5,
  },
  {
    id: "pa5-biji-di-call",
    lang: "pa",
    style: "split",
    hook: "ਬੀਜੀ ਦੀ ਕਾਲ",
    voice: SIMRAN,
    beats: [
      { visual: S5, visual2: S1, text: "ਪੰਜਾਬ ਦੂਰ ਹੈ…", sub: "Punjab is far away", say: "[softly, emotional] ਪੰਜਾਬ ਦੂਰ ਹੈ…" },
      { visual: S4, visual2: S3, text: "ਪਰ ਆਪਣੇ ਲੋਕ ਨੇੜੇ ਨੇ।", sub: "But our people are close", say: "[warmly] ਪਰ ਆਪਣੇ ਲੋਕ… ਨੇੜੇ ਨੇ।" },
      { visual: S5, visual2: LISTEN, trim: 2.5, text: "ਇੱਕ ਕਾਲ… ਤੇ ਤੁਹਾਡੀ ਗੱਲ ਰੇਡੀਓ ’ਤੇ।", sub: "One call, and your words are on air", say: "[warmly, smiling] ਇੱਕ ਕਾਲ… ਤੇ ਤੁਹਾਡੀ ਗੱਲ, ਰੇਡੀਓ ’ਤੇ।" },
    ],
    end: { tagline: "ਤੁਹਾਡੀ ਆਵਾਜ਼, ਤੁਹਾਡਾ ਰੇਡੀਓ", sub: "ਸਰੀ ਤੋਂ ਲਾਈਵ", say: "[proudly] ਇੰਡੀ ਰੇਡੀਓ। ਤੁਹਾਡੀ ਆਵਾਜ਼… ਤੁਹਾਡਾ ਰੇਡੀਓ।" },
    music: "home/music.mp3",
    musicVolume: 0.5,
  },
];

/** Props for a film, with placeholder voice lengths (calculateMetadata measures the real ones). */
export const filmProps = (d: FilmDef): ShortProps => ({
  lang: d.lang,
  style: d.style,
  hook: d.hook,
  beats: d.beats.map((b, i) => ({
    visual: b.visual,
    visual2: b.visual2 ?? null,
    trim: b.trim ?? 0,
    text: b.text,
    sub: b.sub,
    voice: `shorts/${d.id}/l${i + 1}.mp3`,
  })),
  end: { tagline: d.end.tagline, sub: d.end.sub, voice: `shorts/${d.id}/l4.mp3`, url: "indiradio.ca" },
  music: d.music,
  musicVolume: d.musicVolume,
  voiceSeconds: [3, 3, 3, 3],
});
