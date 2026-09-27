"use client";

import { useId } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { usePlayer } from "@/components/player/AudioProvider";
import { trackEvent } from "@/lib/analytics";
import { t } from "@/lib/site";
import type { AdvertiseContent } from "@/lib/types";

type Sample = AdvertiseContent["sampleAds"][number];

const LANG = {
  en: { pa: "Punjabi", en: "English", both: "Punjabi & English", transcript: "Transcript" },
  pa: { pa: "ਪੰਜਾਬੀ", en: "ਅੰਗਰੇਜ਼ੀ", both: "ਪੰਜਾਬੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ", transcript: "ਲਿਖਤ" },
};

/** Host-read sample ads. Each <audio> is labelled by its visible title. */
export function SampleAds({ samples }: { samples: Sample[] }) {
  const { locale } = useLocale();
  const { isActive, pause } = usePlayer();
  const l = LANG[locale];
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {samples.map((s) => (
        <SampleAd
          key={s.id}
          sample={s}
          langLabel={l[s.language] || l.both}
          transcriptLabel={l.transcript}
          title={t(s.title, locale)}
          transcript={t(s.transcript, locale)}
          onPlay={(el) => {
            // One thing at a time: stop the live stream and any other sample.
            if (isActive) pause();
            document.querySelectorAll<HTMLAudioElement>("audio[data-sample-ad]").forEach((a) => a !== el && a.pause());
            trackEvent("sample_ad_play", { sample: t(s.title, "en"), language: s.language });
          }}
        />
      ))}
    </ul>
  );
}

function SampleAd({
  sample,
  title,
  transcript,
  langLabel,
  transcriptLabel,
  onPlay,
}: {
  sample: Sample;
  title: string;
  transcript: string;
  langLabel: string;
  transcriptLabel: string;
  onPlay: (el: HTMLAudioElement) => void;
}) {
  const id = useId();
  return (
    <li className="reveal flex flex-col rounded-md border-2 border-fg bg-surface p-5">
      <p className="meta text-accent">{langLabel}</p>
      <h3 id={`${id}-title`} className="mt-2 font-display text-2xl leading-none font-extrabold uppercase">
        {title}
      </h3>
      <audio
        data-sample-ad
        controls
        preload="none"
        src={sample.audioUrl}
        aria-labelledby={`${id}-title`}
        className="mt-4 w-full"
        onPlay={(e) => onPlay(e.currentTarget)}
      />
      {transcript ? (
        <div className="mt-4 border-t border-line pt-3">
          <p className="meta text-muted">{transcriptLabel}</p>
          <p className="mt-1 text-sm" lang={sample.language === "en" ? "en" : "pa"}>
            {transcript}
          </p>
        </div>
      ) : null}
    </li>
  );
}
