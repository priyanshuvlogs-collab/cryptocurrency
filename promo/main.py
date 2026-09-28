#!/usr/bin/env python3
"""
Indi Radio promo video pipeline: ElevenLabs Punjabi voiceover -> FFmpeg render.

    python main.py                  # generate voice.mp3 with ElevenLabs, then render
    python main.py --voice my.mp3   # skip TTS and use an existing audio file
    python main.py --skip-tts       # reuse build/voice.mp3 from a previous run
    python main.py --dry-run        # print the FFmpeg command without running it
    python main.py --config config.motion.json --tts-only
                                    # 32 s voiceover for the Remotion video (motion/)

Settings live in config.json. The API key is read from the environment
(ELEVENLABS_API_KEY), or from promo/.env or the repo's .env.local; it is never
stored in the repository. ELEVENLABS_VOICE_ID overrides the voice in config.json.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent


class PipelineError(RuntimeError):
    """A problem the user can fix (missing key, asset or tool)."""


# ── Config ────────────────────────────────────────────────────────────────


def load_env() -> None:
    """Load promo/.env and the repo's .env.local / .env if python-dotenv is installed."""
    try:
        from dotenv import load_dotenv
    except ImportError:
        return
    for candidate in (HERE / ".env", REPO / ".env.local", REPO / ".env"):
        if candidate.is_file():
            load_dotenv(candidate, override=False)


def load_config(path: Path) -> dict:
    if not path.is_file():
        raise PipelineError(f"Config file not found: {path}")
    with path.open(encoding="utf-8") as f:
        cfg = json.load(f)
    base = path.parent

    def resolve(p: str) -> Path:
        q = Path(p)
        return q if q.is_absolute() else (base / q).resolve()

    cfg["assets"] = {k: resolve(v) for k, v in cfg["assets"].items()}
    cfg["output"]["voice"] = resolve(cfg["output"]["voice"])
    cfg["output"]["video"] = resolve(cfg["output"]["video"])
    cfg["elevenlabs"]["voice_id"] = os.environ.get("ELEVENLABS_VOICE_ID") or cfg["elevenlabs"]["voice_id"]
    return cfg


def find_font(configured: Path) -> Path:
    """Configured font, else any TTF/OTF in the repo's promo assets, else a system bold sans."""
    if configured.is_file():
        return configured
    for pattern in ("*.ttf", "*.otf"):
        found = sorted((HERE / "assets").rglob(pattern))
        if found:
            return found[0]
    if shutil.which("fc-match"):
        out = subprocess.run(["fc-match", "-f", "%{file}", "sans:bold"], capture_output=True, text=True)
        if out.returncode == 0 and Path(out.stdout).is_file():
            return Path(out.stdout)
    raise PipelineError(f"No font found. Put a .ttf file at {configured}.")


# ── Phase 1: ElevenLabs ───────────────────────────────────────────────────


def generate_voice(cfg: dict) -> Path:
    """Render the Punjabi voiceover with ElevenLabs and save it as an MP3."""
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        raise PipelineError(
            "ELEVENLABS_API_KEY is not set. Add it to promo/.env (see .env.example), "
            "or run with --voice path/to/audio.mp3 to skip text-to-speech."
        )
    try:
        from elevenlabs.client import ElevenLabs
    except ImportError as exc:
        raise PipelineError("The ElevenLabs SDK is missing. Run: pip install -r requirements.txt") from exc

    el = cfg["elevenlabs"]
    out = cfg["output"]["voice"]
    out.parent.mkdir(parents=True, exist_ok=True)
    print(f"[1/2] ElevenLabs: {el['model_id']} · voice {el['voice_id']}")

    client = ElevenLabs(api_key=api_key)
    tmp = out.with_suffix(".part")
    try:
        stream = client.text_to_speech.convert(
            voice_id=el["voice_id"],
            text=el["text"],
            model_id=el["model_id"],  # eleven_multilingual_v2: native Punjabi pronunciation
            output_format=el["output_format"],
        )
        with tmp.open("wb") as f:
            for chunk in stream:
                if chunk:
                    f.write(chunk)
    except Exception as exc:  # the SDK raises ApiError and network errors
        tmp.unlink(missing_ok=True)
        raise PipelineError(f"ElevenLabs request failed: {exc}") from exc

    if tmp.stat().st_size == 0:
        tmp.unlink(missing_ok=True)
        raise PipelineError("ElevenLabs returned an empty audio file.")
    tmp.replace(out)
    print(f"      saved {out.relative_to(HERE) if out.is_relative_to(HERE) else out}")
    return out


# ── Phase 2: FFmpeg ───────────────────────────────────────────────────────


def require_ffmpeg() -> None:
    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            raise PipelineError(f"{tool} is not installed (e.g. apt-get install -y ffmpeg, or brew install ffmpeg).")
    filters = subprocess.run(["ffmpeg", "-hide_banner", "-filters"], capture_output=True, text=True).stdout
    if " drawtext " not in filters:
        raise PipelineError("This FFmpeg build has no drawtext filter (it needs libfreetype).")


def audio_duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True,
        text=True,
    )
    try:
        return float(out.stdout.strip())
    except ValueError as exc:
        raise PipelineError(f"Could not read the length of {path}: {out.stderr.strip()}") from exc


def build_filter(cfg: dict, font_name: str, text_files: list[list[str]]) -> str:
    """The -filter_complex graph: fill the frame, logo top-right, timed caption boxes."""
    o = cfg["output"]
    w, h, fps = o["width"], o["height"], o["fps"]
    logo_w = round(w * 0.17)
    margin = round(w * 0.045)
    parts = [
        f"[0:v]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},setsar=1,fps={fps}[bg]",
        f"[2:v]scale={logo_w}:-1[logo]",
        f"[bg][logo]overlay=W-w-{margin}:{margin}[v0]",
    ]
    label = "v0"
    n = 0
    for ci, cap in enumerate(cfg["captions"]):
        start, end = cap["start"], cap.get("end")
        enable = f"between(t,{start},{end})" if end is not None else f"gte(t,{start})"
        lines = cap["lines"]
        # One line: big CTA. Two lines: small kicker above a large name.
        sizes = [round(w * 0.085)] if len(lines) == 1 else [round(w * 0.06), round(w * 0.11)]
        sizes += [sizes[-1]] * (len(lines) - len(sizes))
        # Shrink any line that would not fit in 86% of the frame width (bold sans ≈ 0.62em per character).
        sizes = [min(s, int(w * 0.86 / (max(len(line), 1) * 0.62))) for s, line in zip(sizes, lines)]
        gap = round(h * 0.02)
        total = sum(s + 2 * round(s * 0.32) for s in sizes) + gap * (len(lines) - 1)
        y = round(h * 0.60 - total / 2)
        for li, size in enumerate(sizes):
            pad = round(size * 0.32)
            nxt = f"v{n + 1}"
            parts.append(
                f"[{label}]drawtext=fontfile='{font_name}':textfile='{text_files[ci][li]}'"
                f":fontsize={size}:fontcolor={cap.get('color', 'white')}"
                f":box=1:boxcolor={cap['box']}:boxborderw={pad}"
                f":x=(w-text_w)/2:y={y + pad}:enable='{enable}'[{nxt}]"
            )
            y += size + 2 * pad + gap
            label = nxt
            n += 1
    parts[-1] = parts[-1].rsplit("[", 1)[0] + "[v]"
    return ";".join(parts)


def render_video(cfg: dict, voice: Path, dry_run: bool = False) -> Path:
    """Composite background, logo, captions and the voiceover into the final MP4."""
    require_ffmpeg()
    assets = cfg["assets"]
    for key in ("background", "logo"):
        if not assets[key].is_file():
            raise PipelineError(f"Missing {key} asset: {assets[key]} (set it in config.json).")
    if not voice.is_file():
        raise PipelineError(f"Voiceover not found: {voice}")
    font = find_font(assets["font"])

    out = cfg["output"]["video"]
    work = out.parent
    work.mkdir(parents=True, exist_ok=True)

    # Stage the font and caption text next to the output and run FFmpeg from there,
    # so the filter graph only holds plain file names (no escaping of ':' or quotes).
    font_name = "caption-font" + font.suffix.lower()
    shutil.copyfile(font, work / font_name)
    text_files: list[list[str]] = []
    for ci, cap in enumerate(cfg["captions"]):
        names = []
        for li, line in enumerate(cap["lines"]):
            name = f"caption-{ci}-{li}.txt"
            (work / name).write_text(line, encoding="utf-8")
            names.append(name)
        text_files.append(names)

    duration = audio_duration(voice)
    cmd = [
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-stats",
        "-stream_loop", "-1", "-i", str(assets["background"]),  # loop the background as long as needed
        "-i", str(voice),
        "-i", str(assets["logo"]),
        "-filter_complex", build_filter(cfg, font_name, text_files),
        "-map", "[v]", "-map", "1:a",
        "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",  # stop when the voiceover ends
        "-t", f"{duration:.3f}",  # belt and braces: -shortest can overshoot with a looped input
        "-movflags", "+faststart",
        str(out),
    ]
    print(f"[2/2] FFmpeg: {duration:.2f}s at {cfg['output']['width']}x{cfg['output']['height']}")
    if dry_run:
        print(" ".join(f"'{c}'" if (" " in c or ";" in c) else c for c in cmd))
        return out
    result = subprocess.run(cmd, cwd=work)
    if result.returncode != 0:
        raise PipelineError(f"FFmpeg failed with exit code {result.returncode}.")
    print(f"      saved {out}")
    return out


# ── Entry point ───────────────────────────────────────────────────────────


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Render the Indi Radio Punjabi promo video.")
    parser.add_argument("--config", type=Path, default=HERE / "config.json")
    parser.add_argument("--voice", type=Path, help="use this audio file instead of calling ElevenLabs")
    parser.add_argument("--skip-tts", action="store_true", help="reuse the voice file from a previous run")
    parser.add_argument("--dry-run", action="store_true", help="print the FFmpeg command only")
    parser.add_argument("--tts-only", action="store_true", help="only generate the voiceover (e.g. for the Remotion video)")
    args = parser.parse_args(argv)

    load_env()
    try:
        cfg = load_config(args.config)
        if args.voice:
            voice = args.voice.resolve()
        elif args.skip_tts:
            voice = cfg["output"]["voice"]
        else:
            voice = generate_voice(cfg)
        if not args.tts_only:
            render_video(cfg, voice, dry_run=args.dry_run)
    except PipelineError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        return 130
    return 0


if __name__ == "__main__":
    sys.exit(main())
