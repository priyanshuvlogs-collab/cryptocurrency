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
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="container-ir flex h-16 items-center gap-3">
        <Link href={href("")} className="shrink-0 rounded-md" aria-label="Indi Radio – home">
          <Logo />
        </Link>
        {status === "playing" ? (
          <span className="hidden items-center gap-1.5 rounded-full bg-live px-2.5 py-0.5 text-xs font-extrabold text-on-live sm:inline-flex">
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
                  className="rounded-full px-3 py-2 text-[0.9375rem] font-semibold hover:text-saffron aria-[current=page]:text-saffron"
                >
                  {m.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <a href={`tel:${phoneE164}`} className="btn btn-live hidden min-h-11! px-4! py-2! text-sm md:inline-flex">
            <PhoneIcon size={18} />
            {m.cta.callIn}
          </a>
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            aria-haspopup="dialog"
            className="grid size-11 place-items-center rounded-full border border-line lg:hidden"
          >
            <MenuIcon />
            <span className="sr-only">{m.nav.menu}</span>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={m.nav.menu}
        className="m-0 ml-auto h-dvh max-h-none w-[min(22rem,100vw)] max-w-none bg-surface p-0 text-fg backdrop:bg-black/60 lg:hidden"
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
              className="grid size-11 place-items-center rounded-full border border-line"
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
                    className="flex min-h-12 items-center rounded-xl px-3 text-lg font-semibold hover:bg-surface-2 aria-[current=page]:text-saffron"
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
