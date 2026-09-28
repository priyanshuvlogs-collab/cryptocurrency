#!/usr/bin/env bash
# Builds "ਘਰ ਦੀ ਆਵਾਜ਼ — The Sound of Home": Remotion renders the pictures
# (composition IndiRadioHome), ffmpeg builds and masters the sound, then muxes.
#
#   ./build.sh            # needs ffmpeg and the files in ../motion/public/home
#
# Audio mix (ffmpeg):
#   - ElevenLabs instrumental score (sarangi, tumbi, strings, soft dhol at the end),
#     extended by two bars so its closing chord lands on the end card
#   - six eleven_v3 narrator lines, each placed where its words appear on screen
#     (VO_AT, seconds), with the music gently side-chain ducked under the voice
#   - mastered to -14 LUFS / -1 dBTP with a slow fade out
set -euo pipefail
cd "$(dirname "$0")"
MOTION=../motion
A=$MOTION/public/home
OUT=out
mkdir -p "$OUT"

# Where each narrator line starts (seconds). Keep in step with the scene starts
# in src/v5/Home.tsx (homeStarts): opening 0, shots at 5.9, 10.3, 14.2, 18.1, 22.5, end 27.4.
# Line 4 ("ਹਰ ਦੁਕਾਨ, ਹਰ ਰਸੋਈ… ਹਰ ਸ਼ਾਮ — ਆਪਣਾ ਭਾਈਚਾਰਾ") is placed so "ਹਰ ਸ਼ਾਮ" lands
# just after the cut to the family dinner.
VO_AT=(${VO_AT:-0.7 6.3 10.7 16.27 23.0 28.2})
# Film length in seconds (homeDuration(defaultHomeProps) / 30 = 1002 frames).
DUR=${DUR:-33.4}

# 1) Pictures (silent) from Remotion
# (SKIP_RENDER=1 re-uses out/video.mp4 when only the sound changed)
[ -n "${SKIP_RENDER:-}" ] || (cd "$MOTION" && npx remotion render IndiRadioHome "$PWD/../home/$OUT/video.mp4" --muted --concurrency=4)

# 2) Sound
# The score is 32 s but its final chord decays from ~25 s. Stretch it to the film
# by repeating two bars (84 BPM → 5.714 s) at the most similar point (9.43 s,
# found by comparing spectra), with a short crossfade on the beat.
XF=0.75
SPLICE_END=$(python3 -c "print(9.429 + $XF)")
SPLICE_FROM=$(python3 -c "print(9.429 - 5.714)")
inputs=(-i "$A/music.mp3")
chain=""
labels=""
for i in 0 1 2 3 4 5; do
  inputs+=(-i "$A/vo$((i + 1)).mp3")
  ms=$(python3 -c "print(int(${VO_AT[$i]} * 1000))")
  chain+="[$((i + 1)):a]aformat=sample_rates=44100:channel_layouts=stereo,adelay=${ms}|${ms}[v$i];"
  labels+="[v$i]"
done
ffmpeg -loglevel error -y "${inputs[@]}" -filter_complex "
  ${chain}
  ${labels}amix=inputs=6:duration=longest:normalize=0,apad=whole_dur=${DUR},loudnorm=I=-16:TP=-2,asplit=2[vo][vokey];
  [0:a]aformat=sample_rates=44100:channel_layouts=stereo,asplit=2[m1][m2];
  [m1]atrim=0:${SPLICE_END}[ma];
  [m2]atrim=start=${SPLICE_FROM},asetpts=PTS-STARTPTS[mb];
  [ma][mb]acrossfade=d=${XF}:c1=tri:c2=tri,afade=t=in:d=2.5,volume=0.55,apad=whole_dur=${DUR}[mus];
  [mus][vokey]sidechaincompress=threshold=0.05:ratio=4:attack=40:release=600:makeup=1[musduck];
  [musduck][vo]amix=inputs=2:duration=longest:normalize=0,apad=whole_dur=${DUR},
    atrim=0:${DUR},afade=t=in:d=0.4,afade=t=out:st=$(python3 -c "print(${DUR} - 2.0)"):d=2.0,
    loudnorm=I=-14:TP=-1:LRA=11[mix]" \
  -map "[mix]" -ar 48000 -c:a pcm_s16le "$OUT/mix.wav"

# 3) Mux + social-ready encode (H.264 high, yuv420p, faststart)
ffmpeg -loglevel error -y -i "$OUT/video.mp4" -i "$OUT/mix.wav" \
  -map 0:v -map 1:a -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high \
  -c:a aac -b:a 256k -movflags +faststart -shortest "$OUT/indi-radio-ghar-di-awaaz.mp4"

# 4) Cover image
ffmpeg -loglevel error -y -ss 5 -i "$OUT/indi-radio-ghar-di-awaaz.mp4" -frames:v 1 -q:v 2 "$OUT/cover.jpg"

ffmpeg -hide_banner -i "$OUT/indi-radio-ghar-di-awaaz.mp4" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
echo "done → $OUT/indi-radio-ghar-di-awaaz.mp4"
