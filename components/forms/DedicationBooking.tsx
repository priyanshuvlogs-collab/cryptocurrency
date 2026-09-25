"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { DedicationForm } from "./Forms";

/** Reads ?tier= and ?cancelled= so tier cards can deep-link into the form. */
export function DedicationBooking({ tiers, payable }: { tiers: { value: string; label: string; description?: string }[]; payable: boolean }) {
  const params = useSearchParams();
  const { locale } = useLocale();
  const tier = params.get("tier") || undefined;
  const cancelled = params.get("cancelled") === "1";
  return (
    <>
      {cancelled ? (
        <p role="status" className="mb-6 rounded-xl bg-surface-2 p-4 font-semibold">
          {locale === "pa"
            ? "ਭੁਗਤਾਨ ਰੱਦ ਹੋ ਗਿਆ, ਤੁਹਾਡੇ ਤੋਂ ਕੋਈ ਪੈਸਾ ਨਹੀਂ ਲਿਆ ਗਿਆ। ਤੁਸੀਂ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰ ਸਕਦੇ ਹੋ।"
            : "Payment was cancelled and you have not been charged. You can try again below."}
        </p>
      ) : null}
      <DedicationForm tiers={tiers} defaultTier={tier} payable={payable} />
    </>
  );
}
