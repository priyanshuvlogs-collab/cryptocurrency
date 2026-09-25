"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayIcon } from "@/components/ui/Icons";

/**
 * Lightweight YouTube facade: just a thumbnail until tapped, then the real
 * (privacy-enhanced) player. Saves ~500 KB of JavaScript per embed.
 * Captions: cc_load_policy=1 turns YouTube captions on by default.
 */
export function VideoFacade({ id, title, thumbnail, playLabel }: { id: string; title: string; thumbnail: string; playLabel: string }) {
  const [active, setActive] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-2">
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&cc_load_policy=1&hl=pa`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button type="button" onClick={() => setActive(true)} className="group absolute inset-0 size-full">
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-saffron text-on-saffron shadow-xl">
            <PlayIcon size={28} />
          </span>
          <span className="sr-only">
            {playLabel}: {title}
          </span>
        </button>
      )}
    </div>
  );
}
