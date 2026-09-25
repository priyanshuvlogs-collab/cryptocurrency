"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { MoonIcon, SunIcon } from "@/components/ui/Icons";
import { otherLocale } from "@/lib/i18n";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, m } = useLocale();
  const pathname = usePathname() || `/${locale}`;
  const target = otherLocale(locale);
  const href = pathname.replace(/^\/(en|pa)(?=\/|$)/, `/${target}`);
  return (
    <a
      href={href}
      hrefLang={target === "pa" ? "pa-IN" : "en-CA"}
      lang={target}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000;samesite=lax`;
      }}
      className={`grid min-h-11 min-w-11 place-items-center rounded-sm border-2 border-line px-3 text-sm font-extrabold hover:border-fg ${className}`}
    >
      <span aria-hidden="true">{m.otherLangShort}</span>
      <span className="sr-only">{m.otherLangName}</span>
    </a>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { m } = useLocale();
  return (
    <button
      type="button"
      aria-label={m.theme.toggle}
      onClick={() => {
        const root = document.documentElement;
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try {
          localStorage.setItem("ir-theme", next);
        } catch {}
      }}
      className={`grid size-11 place-items-center rounded-sm border-2 border-line hover:border-fg ${className}`}
    >
      <SunIcon className="icon-when-dark" />
      <MoonIcon className="icon-when-light" />
    </button>
  );
}

/** Runs before first paint so the page never flashes the wrong theme. */
export const themeScript = `(function(){try{var t=localStorage.getItem('ir-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add('js')})();`;
