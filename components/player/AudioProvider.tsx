"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * One <audio> element for the whole site, mounted in the locale layout so it
 * survives client-side navigation: the stream keeps playing while visitors
 * move between pages.
 *
 * - iPhone Safari / Android Chrome: plays MP3/AAC Icecast/Shoutcast directly;
 *   HLS (.m3u8) is native on Safari and loads hls.js on demand elsewhere.
 * - Lock-screen / notification controls via the Media Session API.
 * - Pausing a live stream releases the connection; resuming rejoins the live
 *   edge instead of replaying stale buffered audio.
 * - Automatic reconnect with backoff when the connection drops.
 */

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "reconnecting" | "error" | "nostream";

interface PlayerContextValue {
  status: PlayerStatus;
  isActive: boolean;
  play: (source?: string) => void;
  pause: () => void;
  toggle: (source?: string) => void;
  volume: number;
  setVolume: (v: number) => void;
  muted: boolean;
  toggleMute: () => void;
  setTrackInfo: (info: { title: string; artist: string }) => void;
  hasStream: boolean;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <AudioProvider>");
  return ctx;
}

const RESUME_KEY = "ir-resume";
const BACKOFF_MS = [1000, 2000, 4000, 8000, 15000];
const isHls = (url: string) => /\.m3u8(\?|$)/i.test(url);

export function AudioProvider({ streamUrl, children }: { streamUrl: string; children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<{ destroy: () => void } | null>(null);
  const retryRef = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wantPlayRef = useRef(false);
  const trackRef = useRef({ title: "Indi Radio", artist: "Live Punjabi radio · Surrey, BC" });

  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);

  const updateMediaSession = useCallback(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: trackRef.current.title,
      artist: trackRef.current.artist,
      album: "Indi Radio · Surrey, BC",
      artwork: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    });
  }, []);

  const release = useCallback(() => {
    const audio = audioRef.current;
    hlsRef.current?.destroy();
    hlsRef.current = null;
    if (audio) {
      audio.removeAttribute("src");
      audio.load();
    }
  }, []);

  const attach = useCallback(
    async (url: string) => {
      const audio = audioRef.current;
      if (!audio) return;
      release();
      if (isHls(url) && !audio.canPlayType("application/vnd.apple.mpegurl")) {
        const { default: Hls } = await import("hls.js");
        if (Hls.isSupported()) {
          const hls = new Hls({ liveSyncDurationCount: 3, lowLatencyMode: false });
          hls.on(Hls.Events.ERROR, (_e, data) => {
            if (data.fatal) audio.dispatchEvent(new Event("error"));
          });
          hls.loadSource(url);
          hls.attachMedia(audio);
          hlsRef.current = hls;
          return;
        }
      }
      audio.src = url;
    },
    [release],
  );

  const start = useCallback(
    async (source?: string) => {
      const url = source || streamUrl;
      const audio = audioRef.current;
      if (!audio) return;
      if (!url) {
        setStatus("nostream");
        return;
      }
      wantPlayRef.current = true;
      setStatus((s) => (s === "reconnecting" ? s : "loading"));
      updateMediaSession();
      try {
        if (isHls(url) && !audio.canPlayType("application/vnd.apple.mpegurl")) {
          await attach(url);
          await audio.play();
        } else {
          // Keep src + play() synchronous inside the tap handler: iOS Safari
          // only honours play() while the user gesture is still active.
          release();
          audio.src = url;
          await audio.play();
        }
      } catch (err) {
        const name = (err as DOMException)?.name;
        if (name === "NotAllowedError") {
          // Autoplay blocked (e.g. resume after a language switch) – wait for a tap.
          wantPlayRef.current = false;
          setStatus("paused");
          release();
        } else if (name !== "AbortError") {
          audio.dispatchEvent(new Event("error"));
        }
      }
    },
    [attach, release, streamUrl, updateMediaSession],
  );

  const pause = useCallback(() => {
    wantPlayRef.current = false;
    if (retryTimer.current) clearTimeout(retryTimer.current);
    audioRef.current?.pause();
    release();
    setStatus("paused");
    try {
      sessionStorage.removeItem(RESUME_KEY);
    } catch {}
  }, [release]);

  const play = useCallback(
    (source?: string) => {
      retryRef.current = 0;
      trackEvent("listen_live", { source: source ? "custom" : "stream" });
      void start(source);
    },
    [start],
  );

  const toggle = useCallback(
    (source?: string) => {
      if (status === "playing" || status === "loading" || status === "reconnecting") pause();
      else play(source);
    },
    [pause, play, status],
  );

  // Wire element events once.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlaying = () => {
      retryRef.current = 0;
      setStatus("playing");
      if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing";
      try {
        sessionStorage.setItem(RESUME_KEY, String(Date.now()));
      } catch {}
    };
    const onWaiting = () => {
      if (wantPlayRef.current) setStatus((s) => (s === "playing" ? "loading" : s));
    };
    const onPause = () => {
      if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "paused";
    };
    const onError = () => {
      if (!wantPlayRef.current) return;
      const attempt = retryRef.current;
      if (attempt >= BACKOFF_MS.length) {
        wantPlayRef.current = false;
        release();
        setStatus("error");
        return;
      }
      setStatus("reconnecting");
      retryRef.current = attempt + 1;
      retryTimer.current = setTimeout(() => void start(), BACKOFF_MS[attempt]);
    };
    // A live stream "ending" means the server dropped us – reconnect.
    const onEnded = onError;

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("stalled", onWaiting);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("stalled", onWaiting);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
    };
  }, [release, start]);

  // Lock-screen controls.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => play()],
      ["pause", () => pause()],
      ["stop", () => pause()],
    ];
    for (const [action, handler] of handlers) {
      try {
        ms.setActionHandler(action, handler);
      } catch {}
    }
    return () => {
      for (const [action] of handlers) {
        try {
          ms.setActionHandler(action, null);
        } catch {}
      }
    };
  }, [pause, play]);

  // Resume after a full page change (e.g. switching language) if the visitor
  // was listening a moment ago. Browsers may block this; then we show "paused".
  useEffect(() => {
    try {
      const ts = Number(sessionStorage.getItem(RESUME_KEY));
      if (ts && Date.now() - ts < 15_000) void start();
    } catch {}
  }, [start]);

  // Resume the live edge when an offline device reconnects.
  useEffect(() => {
    const onOnline = () => {
      if (wantPlayRef.current) void start();
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [start]);

  const setVolume = useCallback((v: number) => {
    const next = Math.min(1, Math.max(0, v));
    setVolumeState(next);
    if (audioRef.current) audioRef.current.volume = next;
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      if (audioRef.current) audioRef.current.muted = !m;
      return !m;
    });
  }, []);

  const setTrackInfo = useCallback(
    (info: { title: string; artist: string }) => {
      trackRef.current = info;
      if (wantPlayRef.current) updateMediaSession();
    },
    [updateMediaSession],
  );

  const value = useMemo<PlayerContextValue>(
    () => ({
      status,
      isActive: status === "playing" || status === "loading" || status === "reconnecting",
      play,
      pause,
      toggle,
      volume,
      setVolume,
      muted,
      toggleMute,
      setTrackInfo,
      hasStream: Boolean(streamUrl),
    }),
    [status, play, pause, toggle, volume, setVolume, muted, toggleMute, setTrackInfo, streamUrl],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* playsInline keeps iOS from going fullscreen; preload none saves data until the visitor taps play. */}
      <audio ref={audioRef} preload="none" playsInline aria-hidden="true" />
    </PlayerContext.Provider>
  );
}
