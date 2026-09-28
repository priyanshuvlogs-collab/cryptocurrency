# Viral ad: "POV: ਮੰਮੀ ਨੇ ਰੇਡੀਓ ’ਤੇ ਆਪਣਾ ਗੀਤ ਸੁਣ ਲਿਆ"

A 20 s vertical ad for Reels, TikTok and Shorts.

| Time | Picture | Sound |
| --- | --- | --- |
| 0–1.5 s | Hook caption; mummy stirring a pot | soft tumbi intro |
| 1.5 s | She starts dancing | **dhol drop** (aligned to her first move) |
| 4.9 s | "ਪਾਪਾ, ਟ੍ਰੈਫ਼ਿਕ ਵਿੱਚ ਵੀ:", dad dancing at the wheel | whoosh, cut on the beat |
| 8.9 s | "ਬਾਪੂ ਜੀ ਵੀ ਨਹੀਂ ਰੁਕੇ:", grandfather's bhangra | whoosh |
| 12.9 s | "ਤੇ ਫਿਰ ਪੂਰਾ ਟੱਬਰ:", the whole family in the backyard | whoosh |
| 16.9 s | End card: INDI RADIO, ਘਰ ਦੀ ਆਵਾਜ਼, indiradio.ca | record scratch, then the voice "ਘਰ ਦੀ ਆਵਾਜ਼… ਇੰਡੀ ਰੇਡੀਓ!" |
| 20 s | Hard cut back to the hook (loops) | |

**Made with:**
- **ElevenLabs:** four Kling 2.5 Turbo 9:16 clips; the bhangra track (`eleven_music_v2`, instrumental); the scratch and whoosh sound effects; the voice (`eleven_v3`).
- **Remotion:** captions, beat punch-ins on the 105 BPM grid, the brand bug and the end card (`../motion/src/v4/Viral.tsx`).
- **ffmpeg:** the audio mix (drop alignment, SFX placement, side-chain ducking under the voice, -14 LUFS master) and the final H.264 export (`build.sh`).

Run `./build.sh` to get `out/indi-radio-viral.mp4` and `out/cover.jpg`.
