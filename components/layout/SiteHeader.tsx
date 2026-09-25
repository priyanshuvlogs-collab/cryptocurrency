"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { usePlayer } from "@/components/player/AudioProvider";
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { Logo } from "./Logo";
import { PRIMARY_NAV, SECONDARY_NAV } from "./nav";
import { LanguageToggle, ThemeToggle } from "./Toggles";

export function SiteHeader({ phoneDisplay, phoneE164, whatsappUrl }: { phoneDisplay: string; phoneE164: string; whatsappUrl: string }) {
  const { locale, m } = useLocale();
  const pathname = usePathname() || "";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { status } = usePlayer();
  const href = (path: string) => `/${locale}${path}`;
  const isCurrent = (path: string) => pathname === href(path) || pathname.startsWith(`${href(path)}/`);

  // Close the mobile menu after navigating.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-fg bg-bg/95 backdrop-blur-md">
      <div className="container-ir flex h-[68px] items-center gap-3">
        <Link href={href("")} className="shrink-0 rounded-md">
          <Logo />
          <span className="sr-only"> {m.nav.home}</span>
        </Link>
        {status === "playing" ? (
          <span className="meta hidden items-center gap-1.5 rounded-sm bg-live px-2 py-1 font-extrabold text-on-live sm:inline-flex">
            <span className="onair-dot bg-white!" aria-hidden="true" />
            {m.player.live}
          </span>
        ) : null}

        <nav aria-label={m.nav.primary} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {PRIMARY_NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={href(item.path)}
                  aria-current={isCurrent(item.path) ? "page" : undefined}
                  className="relative px-2.5 py-2 text-[0.9rem] font-bold hover:text-accent aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-2.5 aria-[current=page]:after:-bottom-[15px] aria-[current=page]:after:h-[3px] aria-[current=page]:after:bg-marigold"
                >
                  {m.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <a href={`tel:${phoneE164}`} className="btn btn-live hidden min-h-11! px-4! py-2! text-[0.8rem]! md:inline-flex">
            <PhoneIcon size={18} />
            {m.cta.callIn}
          </a>
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            aria-haspopup="dialog"
            className="grid size-11 place-items-center rounded-sm border-2 border-fg lg:hidden"
          >
            <MenuIcon />
            <span className="sr-only">{m.nav.menu}</span>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={m.nav.menu}
        className="band-ink m-0 ml-auto h-dvh max-h-none w-[min(24rem,100vw)] max-w-none p-0 backdrop:bg-black/70 lg:hidden"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            <Logo />
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="grid size-11 place-items-center rounded-sm border border-line"
            >
              <CloseIcon />
              <span className="sr-only">{m.nav.close}</span>
            </button>
          </div>
          <nav aria-label={m.nav.primary} className="flex-1 overflow-y-auto px-2 py-3">
            <ul>
              {[...PRIMARY_NAV, ...SECONDARY_NAV].map((item) => (
                <li key={item.key}>
                  <Link
                    href={href(item.path)}
                    aria-current={isCurrent(item.path) ? "page" : undefined}
                    className="flex min-h-13 items-center border-b border-line px-3 font-display text-3xl font-extrabold uppercase hover:text-marigold aria-[current=page]:text-marigold"
                  >
                    {m.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid gap-2 border-t border-line p-4">
            <a href={`tel:${phoneE164}`} className="btn btn-live w-full">
              <PhoneIcon /> {m.cta.callIn}: {phoneDisplay}
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
              <WhatsAppIcon /> {m.cta.whatsapp}
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
