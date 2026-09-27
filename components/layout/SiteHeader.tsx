"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { usePlayer } from "@/components/player/AudioProvider";
import { CloseIcon, MenuIcon, PhoneIcon, PlayIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { Logo } from "./Logo";
import { NAV_GROUPS, type NavGroup } from "./nav";
import { LanguageToggle, ThemeToggle } from "./Toggles";

export function SiteHeader({ phoneDisplay, phoneE164, whatsappUrl }: { phoneDisplay: string; phoneE164: string; whatsappUrl: string }) {
  const { locale, m } = useLocale();
  const pathname = usePathname() || "";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { status } = usePlayer();
  const href = (path: string) => `/${locale}${path}`;
  const isExact = (path: string) => pathname === href(path);
  const isCurrent = (path: string) => isExact(path) || pathname.startsWith(`${href(path)}/`);

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
            {NAV_GROUPS.map((group) => (
              <li key={group.key}>
                <NavDropdown group={group} href={href} isCurrent={isCurrent} pathname={pathname} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <Link href={href("/listen-live")} className="btn btn-live hidden min-h-11! px-4! py-2! text-[0.8rem]! md:inline-flex">
            <PlayIcon size={16} />
            {m.nav.listenLive}
          </Link>
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
          <nav aria-label={m.nav.primary} className="flex-1 overflow-y-auto px-4 py-2">
            {NAV_GROUPS.map((group) => (
              <div key={group.key} className="border-b border-line py-3 last:border-b-0">
                <p className="meta text-marigold">{m.nav[group.key]}</p>
                <ul className="mt-1">
                  {group.items.map((item) => (
                    <li key={item.key}>
                      <Link
                        href={href(item.path)}
                        aria-current={isExact(item.path) ? "page" : undefined}
                        className="flex min-h-11 items-center font-display text-2xl font-extrabold uppercase hover:text-marigold aria-[current=page]:text-marigold"
                      >
                        {m.nav[item.key]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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

/** Desktop menu group: a button that opens a short list of pages. */
function NavDropdown({
  group,
  href,
  isCurrent,
  pathname,
}: {
  group: NavGroup;
  href: (path: string) => string;
  isCurrent: (path: string) => boolean;
  pathname: string;
}) {
  const { m } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const active = group.items.some((item) => isCurrent(item.path));
  // A child is "current" only for its own page, so /advertise is not marked on /advertise/packages.
  const exact = (path: string) => pathname === href(path) || (path !== "/advertise" && pathname.startsWith(`${href(path)}/`));

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`relative flex min-h-11 items-center gap-1.5 px-2.5 text-[0.9rem] font-bold hover:text-accent ${
          active ? "after:absolute after:inset-x-2.5 after:-bottom-[12px] after:h-[3px] after:bg-marigold" : ""
        }`}
      >
        {m.nav[group.key]}
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className={`transition ${open ? "rotate-180" : ""}`}>
          <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      <ul
        id={panelId}
        hidden={!open}
        className="absolute top-[calc(100%+10px)] left-0 z-50 min-w-56 rounded-md border-2 border-fg bg-bg p-2 shadow-[6px_6px_0_var(--fg)]"
      >
        {group.items.map((item) => (
          <li key={item.key}>
            <Link
              href={href(item.path)}
              aria-current={exact(item.path) ? "page" : undefined}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-sm px-3 font-bold hover:bg-surface hover:text-accent aria-[current=page]:bg-fg aria-[current=page]:text-bg"
            >
              {m.nav[item.key]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
