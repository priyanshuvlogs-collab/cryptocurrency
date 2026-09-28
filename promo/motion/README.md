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

## V2: heavier motion graphics (`IndiRadioPromoV2`)

Same voice, music and text props, with more motion. Render it with `npm run render:v2`.

| Scene | Motion |
| --- | --- |
| Hook | Words slam in on the voice with an RGB split and a shake, radio-wave rings pulse on every dhol beat, light rays |
| Logo | Record flips in 3D, particle burst, letters flip up one by one |
| Website | Three real phone screenshots in a 3D coverflow, two diagonal ticker bands |
| One tap | Play button morphs to LIVE, a radial visualizer driven by the actual voice audio |
| Time zones | A rotating 3D globe with real continents; arcs fly from Surrey to the USA, UK, Dubai, India and Australia |
| Advertise | Package cards flip in 3D, a tap on the most popular one, confetti, CTA pills |
| End | A phulkari diamond draws itself, the URL types out, CTA buttons |

Transitions include a custom phulkari diamond wipe (`src/v2/fx.tsx`). Beat-synced motion uses `beatPeriodFrames` / `beatOffsetFrames` (100 BPM, measured from `bhangra1.mp3`).

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

## Voice and music

Both made with the ElevenLabs connector:

- **Voice:** `eleven_v3`, voice "Pind Waali Desi Punjabi Voice", one clip per scene in `public/voice/line1–7.mp3`. Each line was written with pauses (`…`, `—`) and a delivery tag (`[warmly]`, `[excited]`, `[cheerfully]`, `[confidently]`), then loudness-normalised. Each line starts right after its scene's transition, and `calculateMetadata` stretches a scene when its line needs more room, so there is always a breath between lines.
- **Music:** `eleven_music_v2` with `instrumental: true`, a Punjabi bhangra bed (dhol, tumbi, algoza, chimta), two takes in `public/music/`. It ducks under each line and lifts in the gaps.

To change a line, generate a new clip, save it over `public/voice/lineN.mp3` and render again. The scene timing adjusts on its own. Switch music with `audio.music` in the Props panel.

## Remotion practices used

- Every animation is driven by `useCurrentFrame()` / `spring()`; no CSS animations or randomness, so renders are identical every time.
- Images through `<Img>` + `staticFile()` (the render waits for them); fonts bundled and loaded with `@remotion/fonts`.
- Typed, editable props with a zod schema; `calculateMetadata` sizes each scene to its voice line; `TransitionSeries` for scene transitions; music ducked with a smooth volume curve.

## Update the screenshots

Start the website on port 3100 (`npm run build && npx next start -p 3100` in the repo root), then run `npm run shots`. Pages showing `[CONFIRM]` placeholders (schedule, dedications) are left out on purpose.
