#!/usr/bin/env bash
# Builds the final viral ad: Remotion renders the pictures, ffmpeg builds and
# masters the sound, then muxes them.
#
#   ./build.sh            # needs ffmpeg and the files in ../motion/public/viral
#
# Audio mix (ffmpeg):
#   - ElevenLabs bhangra track, shifted so its dhol drop lands at 1.5 s
#     (the moment mummy starts dancing)
#   - a whoosh on every cut (5, 9, 13 s) and a record scratch on the end card (17 s)
#   - the voice tagline at 17.6 s, with the music side-chain ducked under it
#   - mastered to -14 LUFS / -1 dBTP (the Instagram/TikTok/YouTube target), 20 s,
#     short fade so the loop back to the hook is clean
set -euo pipefail
cd "$(dirname "$0")"
MOTION=../motion
A=$MOTION/public/viral
OUT=out
mkdir -p "$OUT"

# Where the drop sits in the music file (seconds). Measured by measure_drop.py;
# override with DROP=... ./build.sh
DROP=${DROP:-$(python3 measure_drop.py "$A/music.mp3")}
SHIFT=$(python3 -c "print(max(0.0, $DROP - 1.5))")
echo "music drop at ${DROP}s → trimming ${SHIFT}s so it lands at 1.5s"

# 1) Pictures (silent) from Remotion
(cd "$MOTION" && npx remotion render IndiRadioViral "$PWD/../viral/$OUT/video.mp4" --muted --concurrency=4)

# 2) Sound
ffmpeg -loglevel error -y \
  -i "$A/music.mp3" -i "$A/whoosh.mp3" -i "$A/scratch.mp3" -i "$A/tagline.mp3" \
  -filter_complex "
    [0:a]atrim=start=${SHIFT},asetpts=PTS-STARTPTS,volume=0.9[mus];
    [3:a]adelay=17600|17600,apad=whole_dur=20,asplit=2[vo][vokey];
    [mus][vokey]sidechaincompress=threshold=0.04:ratio=10:attack=15:release=350:makeup=1[musduck];
    [1:a]asplit=3[w1][w2][w3];
    [w1]adelay=4850|4850,volume=0.8[w1d];
    [w2]adelay=8850|8850,volume=0.8[w2d];
    [w3]adelay=12850|12850,volume=0.8[w3d];
    [2:a]adelay=16900|16900,volume=1.0[scr];
    [musduck][w1d][w2d][w3d][scr][vo]amix=inputs=6:duration=first:normalize=0,
      atrim=0:20,afade=t=in:d=0.05,afade=t=out:st=19.7:d=0.3,
      loudnorm=I=-14:TP=-1:LRA=9[mix]" \
  -map "[mix]" -ar 48000 -c:a pcm_s16le "$OUT/mix.wav"

# 3) Mux + social-ready encode (H.264 high, yuv420p, faststart)
ffmpeg -loglevel error -y -i "$OUT/video.mp4" -i "$OUT/mix.wav" \
  -map 0:v -map 1:a -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high \
  -c:a aac -b:a 256k -movflags +faststart -shortest "$OUT/indi-radio-viral.mp4"

# 4) Cover image (first frame people see in the grid)
ffmpeg -loglevel error -y -ss 2.2 -i "$OUT/indi-radio-viral.mp4" -frames:v 1 -q:v 2 "$OUT/cover.jpg"

ffmpeg -hide_banner -i "$OUT/indi-radio-viral.mp4" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
echo "done → $OUT/indi-radio-viral.mp4"
