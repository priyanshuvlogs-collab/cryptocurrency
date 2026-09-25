"use client";

import { useEffect } from "react";
import { usePlayer } from "./AudioProvider";
import { useLiveState } from "./ScheduleProvider";
import { useLocale } from "@/components/LocaleProvider";
import { PauseIcon, PlayIcon, VolumeIcon } from "@/components/ui/Icons";
import { formatTime, splitDuration } from "@/lib/time";
import { t } from "@/lib/site";

/* ── Play / pause ──────────────────────────────────────────────────── */

export function PlayButton({ variant = "hero", className = "" }: { variant?: "hero" | "mini" | "inline"; className?: string }) {
  const { status, toggle, isActive } = usePlayer();
  const { m } = useLocale();
  const busy = status === "loading" || status === "reconnecting";
  const label = isActive ? m.player.pause : m.player.play;

  if (variant === "mini") {
    return (
      <button
        type="button"
        onClick={() => toggle()}
        aria-label={label}
        className={`grid size-12 shrink-0 place-items-center rounded-full bg-saffron text-on-saffron ${className}`}
      >
        {busy ? <Spinner /> : isActive ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
      </button>
    );
  }

  return (
    // Visible text is the accessible name (WCAG 2.5.3 label-in-name).
    <button type="button" onClick={() => toggle()} className={`btn btn-primary ${variant === "hero" ? "btn-lg" : ""} ${className}`}>
      {busy ? <Spinner /> : isActive ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
      <span>{busy ? m.player.loading : isActive ? m.player.pause : m.player.listenLive}</span>
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-5 animate-spin rounded-full border-[3px] border-current border-r-transparent motion-reduce:animate-none"
    />
  );
}

/* ── Status line (errors are announced to screen readers) ─────────── */

export function PlayerStatusText({ className = "" }: { className?: string }) {
  const { status } = usePlayer();
  const { m } = useLocale();
  const text =
    status === "error"
      ? m.player.error
      : status === "nostream"
        ? m.player.noStream
        : status === "reconnecting"
          ? m.player.reconnecting
          : status === "loading"
            ? m.player.loading
            : "";
  return (
    <p role="status" aria-live="polite" className={`min-h-[1.5em] text-sm text-muted ${className}`}>
      {text}
    </p>
  );
}

/* ── Waveform ─────────────────────────────────────────────────────── */

const BARS = Array.from({ length: 28 }, (_, i) => ({
  dur: 0.7 + ((i * 37) % 11) / 10,
  delay: -((i * 53) % 17) / 10,
  still: 0.3 + ((i * 29) % 7) / 10,
}));

export function Waveform({ className = "", bars = 28 }: { className?: string; bars?: number }) {
  const { status } = usePlayer();
  const playing = status === "playing";
  return (
    <div aria-hidden="true" className={`flex h-12 items-end gap-[3px] ${playing ? "is-playing" : "is-idle"} ${className}`}>
      {BARS.slice(0, bars).map((b, i) => (
        <span
          key={i}
          className="wave-bar block h-full w-[5px] rounded-full"
          style={
            {
              "--dur": `${b.dur}s`,
              "--delay": `${b.delay}s`,
              "--static": b.still,
              background: i % 3 === 0 ? "var(--magenta)" : i % 3 === 1 ? "var(--saffron)" : "var(--gold)",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ── On-air badge ─────────────────────────────────────────────────── */

export function OnAirBadge({ className = "" }: { className?: string }) {
  const { m } = useLocale();
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-live px-3 py-1 text-sm font-extrabold tracking-wider text-on-live uppercase ${className}`}
    >
      <span className="onair-dot bg-white!" aria-hidden="true" />
      {m.player.onAir}
    </span>
  );
}

/* ── Now playing ──────────────────────────────────────────────────── */

export function NowPlaying({ timeZone, className = "" }: { timeZone?: string; className?: string }) {
  const live = useLiveState();
  const { locale, m } = useLocale();
  const { setTrackInfo } = usePlayer();

  const title = live?.current ? t(live.current.title, locale) : m.player.betweenShows;
  const host = live?.current?.show?.host;

  useEffect(() => {
    if (live) setTrackInfo({ title, artist: host ? `${host} · Indi Radio` : "Indi Radio · Surrey, BC" });
  }, [title, host, live, setTrackInfo]);

  const tz = timeZone || (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/Vancouver");
  const occ = live?.current?.occurrence;

  return (
    <div className={className}>
      <p className="eyebrow">{m.player.nowPlaying}</p>
      {/* Fixed min-height so the client-side fill-in causes no layout shift. */}
      <p className="mt-1 min-h-[2.6rem] font-display text-2xl leading-tight font-extrabold md:text-3xl">
        {live ? title : <span className="text-muted">Indi Radio</span>}
      </p>
      <p className="min-h-[1.6em] text-muted">
        {live && host ? (
          <>
            {m.player.withHost} <strong className="text-fg">{host}</strong>
            {occ ? (
              <>
                {" · "}
                <time dateTime={occ.start.toISOString()} suppressHydrationWarning>
                  {formatTime(occ.start, tz, locale)}
                </time>
                {"–"}
                <time dateTime={occ.end.toISOString()} suppressHydrationWarning>
                  {formatTime(occ.end, tz, locale)}
                </time>
              </>
            ) : null}
          </>
        ) : null}
      </p>
    </div>
  );
}

/* ── Countdown to next show ───────────────────────────────────────── */

export function NextShowCountdown({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const live = useLiveState();
  const { locale, m } = useLocale();
  const next = live?.next;
  const parts = next ? splitDuration(next.occurrence.start.getTime() - live!.now) : null;
  const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/Vancouver";
  const name = next?.show ? t(next.show.name, locale) : "";

  const units: [number, string][] = parts
    ? [
        [parts.days, m.countdown.days],
        [parts.hours, m.countdown.hours],
        [parts.minutes, m.countdown.minutes],
        [parts.seconds, m.countdown.seconds],
      ]
    : [];

  return (
    <div className={className}>
      <p className="eyebrow">{m.countdown.nextShow}</p>
      <p className="mt-1 min-h-[1.75rem] text-lg font-bold">{next ? name : " "}</p>
      <div className="mt-2 flex min-h-[3.25rem] items-center gap-2" aria-live="off">
        {parts ? (
          <>
            <span className="sr-only">
              {m.player.startsIn} {parts.days} {m.countdown.days} {parts.hours} {m.countdown.hours} {parts.minutes}{" "}
              {m.countdown.minutes}
            </span>
            {units
              .filter(([v], i) => !(i === 0 && v === 0))
              .map(([v, unit]) => (
                <span
                  key={unit}
                  aria-hidden="true"
                  className={`grid ${compact ? "min-w-11" : "min-w-14"} place-items-center rounded-xl bg-surface-2 px-2 py-1.5 tabular-nums`}
                >
                  <span className={`${compact ? "text-xl" : "text-2xl"} leading-none font-extrabold`}>
                    {String(v).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-muted">{unit}</span>
                </span>
              ))}
          </>
        ) : null}
      </div>
      {next ? (
        <p className="mt-2 text-sm text-muted">
          <time dateTime={next.occurrence.start.toISOString()}>
            {new Intl.DateTimeFormat(locale === "pa" ? "pa-IN" : "en-CA", {
              timeZone: tz,
              weekday: "long",
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "short",
            }).format(next.occurrence.start)}
          </time>
          {!next.occurrence.slot.confirmed ? <span className="ml-1">[CONFIRM]</span> : null}
        </p>
      ) : null}
    </div>
  );
}

/* ── Volume (desktop only – phones use hardware buttons) ──────────── */

export function VolumeControl() {
  const { volume, setVolume, muted, toggleMute } = usePlayer();
  const { m } = useLocale();
  return (
    <div className="hidden items-center gap-2 md:flex">
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? m.player.unmute : m.player.mute}
        className="grid size-11 place-items-center rounded-full hover:bg-surface-2"
      >
        <VolumeIcon muted={muted} />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={muted ? 0 : volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label={m.player.volume}
        className="w-24 accent-[var(--saffron)]"
      />
    </div>
  );
}
