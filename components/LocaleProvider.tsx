"use client";

import { createContext, useContext } from "react";
import type { Messages } from "@/messages/en";
import type { Locale } from "@/lib/types";

const LocaleContext = createContext<{ locale: Locale; m: Messages } | null>(null);

export function LocaleProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: React.ReactNode }) {
  return <LocaleContext.Provider value={{ locale, m: messages }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
