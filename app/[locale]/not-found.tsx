"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { PlayButton } from "@/components/player/PlayerControls";

export default function NotFound() {
  const { locale, m } = useLocale();
  return (
    <section className="container-ir grid min-h-[60vh] place-content-center gap-6 py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display-lg">{m.notFound.title}</h1>
      <p className="mx-auto max-w-lg text-lg text-muted">{m.notFound.body}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <PlayButton />
        <Link href={`/${locale}`} className="btn btn-ghost btn-lg">
          {m.notFound.back}
        </Link>
      </div>
    </section>
  );
}
