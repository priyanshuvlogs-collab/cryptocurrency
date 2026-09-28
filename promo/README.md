# Indi Radio promo video

`main.py` turns a Punjabi script into a short vertical promo video:

1. **ElevenLabs:** generates the voiceover with `eleven_multilingual_v2` and saves `build/voice.mp3`.
2. **FFmpeg:** loops `assets/bg.mp4` under the voice, puts the Indi Radio logo in the top-right corner, draws the timed captions, and stops exactly when the voice ends.

| Time | Caption | Box |
| --- | --- | --- |
| 0.0–2.5 s | Tuhadda Apna Radio / Indi Radio | black, 50% |
| 2.5–5.0 s | Visit: www.indiradio.ca | blue |
| 5.0 s–end | Promote Your Business | green |

## Setup

```bash
cd promo
pip install -r requirements.txt           # elevenlabs + python-dotenv
cp .env.example .env                      # then paste your ElevenLabs API key
# FFmpeg with drawtext: apt-get install -y ffmpeg  |  brew install ffmpeg
```

## Run

```bash
python main.py                            # voice + video -> build/indi-radio-promo.mp4
python main.py --skip-tts                 # re-render with the existing build/voice.mp3 (no credits)
python main.py --voice other.mp3          # use any audio file instead of ElevenLabs
python main.py --dry-run --skip-tts       # print the FFmpeg command only
```

## Change things

Everything is in `config.json`:

- `elevenlabs.text`, `voice_id`, `model_id`, `output_format`. `ELEVENLABS_VOICE_ID` in `.env` overrides the voice.
- `assets.background`, `logo` (defaults to the website's `public/logo.png`), `font`.
- `output.width`, `height` (1080×1920 for Reels/TikTok/Shorts; use 1920×1080 for YouTube), `fps`.
- `captions`: start/end times (`end: null` means until the end), lines, box colour (`black@0.5`, `0x1d4ed8@0.85`…), text colour.

## Assets

- `assets/bg.mp4`: an 8-second looping brand gradient (ink, maroon, marigold). Replace it with any footage; it is scaled and cropped to fill the frame.
- `assets/fonts/DejaVuSans-Bold.ttf`: free to redistribute (see `DejaVu-LICENSE.txt`). The captions are in English letters, so any bold TTF works. To draw Gurmukhi text, switch to a Gurmukhi font such as Noto Sans Gurmukhi.
