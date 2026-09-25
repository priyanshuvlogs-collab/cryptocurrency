"use client";

import { usePlayer } from "./AudioProvider";
import { useLocale } from "@/components/LocaleProvider";
import { PauseIcon, PlayIcon } from "@/components/ui/Icons";

/**
 * The hero player: a record with a phulkari label that spins while the
 * stream plays. The centre is the play/pause button.
 */
export function Disc({ size = "lg" }: { size?: "lg" | "sm" }) {
  const { status, toggle, isActive } = usePlayer();
  const { m } = useLocale();
  const busy = status === "loading" || status === "reconnecting";
  const playing = status === "playing";
  const lg = size === "lg";

  return (
    <div className={`relative aspect-square w-full ${playing ? "is-playing" : ""}`}>
      <div
        className="disc-spin absolute inset-0 rounded-full shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]"
        style={{
          background:
            "conic-gradient(from 20deg, rgb(255 255 255/.10), transparent 12%, transparent 45%, rgb(255 255 255/.08) 52%, transparent 62%), repeating-radial-gradient(circle at center, #0c0709 0 2px, #1b1215 2px 4px)",
        }}
        aria-hidden="true"
      >
        {/* label */}
        <div className="phulkari-fill absolute inset-[31%] rounded-full ring-4 ring-black/40">
          {lg ? (
            <svg viewBox="0 0 200 200" className="absolute inset-0 size-full">
              <defs>
                <path id="disc-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <circle cx="100" cy="100" r="92" fill="#140B0E" opacity=".82" />
              {/* Latin only: Gurmukhi conjuncts don't shape correctly along a curve. */}
              <text fontSize="16" fontWeight="800" fill="#FFA41B" fontFamily="var(--font-display-latin), sans-serif">
                <textPath href="#disc-circle" textLength="486" lengthAdjust="spacing">
                  INDI RADIO ◆ SURREY BC ◆ LIVE 24/7 ◆
                </textPath>
              </text>
            </svg>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={() => toggle()}
        aria-label={isActive ? m.player.pause : m.player.play}
        className={`absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-marigold text-ink shadow-[0_0_0_6px_rgb(20_11_14/.9)] transition-transform hover:scale-105 active:scale-95 ${
          lg ? "size-24 md:size-28" : "size-12"
        }`}
      >
        {busy ? (
          <span className="size-7 animate-spin rounded-full border-4 border-ink border-r-transparent motion-reduce:animate-none" aria-hidden="true" />
        ) : isActive ? (
          <PauseIcon size={lg ? 40 : 20} />
        ) : (
          <PlayIcon size={lg ? 40 : 20} className="translate-x-[3px]" />
        )}
      </button>
    </div>
  );
}
