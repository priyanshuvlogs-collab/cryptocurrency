# Indi Radio promo: motion-graphics video (Remotion)

A 32-second vertical (1080×1920) SaaS-style promo for Reels, TikTok and Shorts, built in React with [Remotion](https://www.remotion.dev).

| # | Scene | What moves |
| --- | --- | --- |
| 1 | Hook, "ਤੁਹਾਡਾ ਆਪਣਾ ਰੇਡੀਓ" | Words rise out of a mask, LIVE pill, equalizer |
| 2 | Logo reveal | Record spins in, letters stagger up, phulkari band scrolls |
| 3 | Website tour | Real phone screenshot scrolls in 3D, feature callouts pop in |
| 4 | "ਇੱਕ ਟੈਪ। ਲਾਈਵ।" | Finger taps play, screen zooms, "Now playing" + equalizer |
| 5 | Every show in your time zone | Four world clocks sweep to the same moment (example time) |
| 6 | "ਪ੍ਰਮੋਟ ਕਰਵਾਓ ਆਪਣਾ ਬਿਜ਼ਨਸ" | Packages scroll, tap on Get pricing, pricing form, WhatsApp |
| 7 | End card | indiradio.ca, Listen Live, WhatsApp 778-834-0325 |

Brand colours, fonts (bundled in `public/fonts`, OFL) and screenshots come from the real website.

## Run

```bash
cd promo/motion
npm install
npm run studio        # live preview and timeline in the browser
npm run render        # → out/indi-radio-promo.mp4
```

If Remotion can't download its own browser (firewall), point it at Chrome: `REMOTION_CHROME=/path/to/chrome npm run render`.

## Change the words (no code)

Every headline, callout, subtitle and the phone number live in `src/schema.ts` (`defaultPromoProps`). In `npm run studio`, open the **Props** panel on the right to edit them live, then save or render. Punjabi subtitles are burned in for muted autoplay (`subtitles.show`, one line per scene).

## Voiceover and music

The video ships with a Punjabi voiceover made with ElevenLabs (voice "Pind Waali Desi Punjabi Voice", model `eleven_multilingual_v2`): three takes in `public/voiceover/`, loudness-normalised to about -16 LUFS. Take 1 is used and the scene lengths (`sceneFrames`) are timed to it; switch takes with `audio.voiceover` in the Props panel.

To make a new one:

1. Voiceover: from `promo/`, run `python main.py --config config.motion.json --tts-only`. ElevenLabs (`eleven_multilingual_v2`) writes `motion/public/voiceover.mp3`.
2. Set `audio.voiceover` to `"voiceover.mp3"` (Props panel or `src/schema.ts`). For music, put a licensed track in `public/music.mp3` and set `audio.music`.
3. `npm run render`. The video lengthens itself so the end card holds until the voiceover ends (`calculateMetadata` in `src/Root.tsx`).

The voiceover script (in `../config.motion.json`) and the subtitles follow the scenes: hook → live radio → one tap → time zones → promote your business → indiradio.ca.

## Remotion practices used

- Every animation is driven by `useCurrentFrame()` / `spring()`; no CSS animations or randomness, so renders are identical every time.
- Images through `<Img>` + `staticFile()` (the render waits for them); fonts bundled and loaded with `@remotion/fonts`.
- Typed, editable props with a zod schema; `calculateMetadata` for audio-driven length; `TransitionSeries` for scene transitions.

## Update the screenshots

Start the website on port 3100 (`npm run build && npx next start -p 3100` in the repo root), then run `npm run shots`. Pages showing `[CONFIRM]` placeholders (schedule, dedications) are left out on purpose.
