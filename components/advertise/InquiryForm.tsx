"use client";

import { useEffect, useId, useState } from "react";
import { submitSponsorInquiry } from "@/app/actions";
import { useLocale } from "@/components/LocaleProvider";
import { ChoiceGroup, ConsentField, SelectField, SmartForm, TextArea, TextField } from "@/components/forms/Form";

const COPY = {
  en: {
    name: "Your name",
    business: "Business name",
    phone: "Phone / WhatsApp",
    email: "Email",
    reachHint: "Give us a phone/WhatsApp number or an email (or both).",
    contactPref: "Best way to reach you",
    contactOptions: { whatsapp: "WhatsApp", call: "Phone call", email: "Email" },
    language: "Preferred language",
    businessType: "Type of business",
    other: "Other",
    interested: "Interested in",
    notSure: "Not sure yet",
    budget: "Monthly budget (CAD)",
    message: "Anything else we should know? (optional)",
    kit: "Email me the media kit",
    kitHint: "We’ll need your email for this.",
    submit: "Send my inquiry",
  },
  pa: {
    name: "ਤੁਹਾਡਾ ਨਾਂ",
    business: "ਕਾਰੋਬਾਰ ਦਾ ਨਾਂ",
    phone: "ਫ਼ੋਨ / WhatsApp",
    email: "ਈਮੇਲ",
    reachHint: "ਫ਼ੋਨ/WhatsApp ਨੰਬਰ ਜਾਂ ਈਮੇਲ ਲਿਖੋ (ਜਾਂ ਦੋਵੇਂ)।",
    contactPref: "ਤੁਹਾਡੇ ਨਾਲ ਕਿਵੇਂ ਸੰਪਰਕ ਕਰੀਏ",
    contactOptions: { whatsapp: "WhatsApp", call: "ਫ਼ੋਨ ਕਾਲ", email: "ਈਮੇਲ" },
    language: "ਗੱਲਬਾਤ ਦੀ ਭਾਸ਼ਾ",
    businessType: "ਕਾਰੋਬਾਰ ਦੀ ਕਿਸਮ",
    other: "ਹੋਰ",
    interested: "ਕਿਸ ਪੈਕੇਜ ਵਿੱਚ ਦਿਲਚਸਪੀ ਹੈ",
    notSure: "ਅਜੇ ਪੱਕਾ ਨਹੀਂ",
    budget: "ਮਹੀਨਾਵਾਰ ਬਜਟ (CAD)",
    message: "ਹੋਰ ਕੁਝ ਦੱਸਣਾ ਚਾਹੋ? (ਲੋੜ ਹੋਵੇ ਤਾਂ)",
    kit: "ਮੈਨੂੰ ਮੀਡੀਆ ਕਿੱਟ ਈਮੇਲ ਕਰੋ",
    kitHint: "ਇਸ ਲਈ ਤੁਹਾਡੀ ਈਮੇਲ ਚਾਹੀਦੀ ਹੈ।",
    submit: "ਪੁੱਛਗਿੱਛ ਭੇਜੋ",
  },
};

const BUDGETS = ["< $500", "$500–$1,500", "$1,500–$5,000", "$5,000+"];

export function AdvertiseInquiryForm({
  packages,
  businessTypes,
}: {
  packages: { value: string; label: string }[];
  businessTypes: { value: string; label: string }[];
}) {
  const { locale } = useLocale();
  const c = COPY[locale];
  const [pkg, setPkg] = useState("");
  const [wantsKit, setWantsKit] = useState(false);
  const pkgId = useId();
  const kitId = useId();

  // Pre-select the package from ?package=… (on load, from a package card,
  // or when the visitor goes back/forward).
  useEffect(() => {
    const valid = new Set(packages.map((p) => p.value));
    const fromUrl = () => {
      const slug = new URLSearchParams(window.location.search).get("package") || "";
      if (valid.has(slug)) setPkg(slug);
    };
    const fromCard = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      if (valid.has(slug)) setPkg(slug);
    };
    fromUrl();
    window.addEventListener("ir:package", fromCard);
    window.addEventListener("popstate", fromUrl);
    return () => {
      window.removeEventListener("ir:package", fromCard);
      window.removeEventListener("popstate", fromUrl);
    };
  }, [packages]);

  return (
    <SmartForm
      action={submitSponsorInquiry}
      event="sponsor_inquiry"
      submitLabel={c.submit}
      eventParams={(fd) => ({ package: String(fd.get("package") || ""), budget: String(fd.get("budget") || "") })}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label={c.name} autoComplete="name" required />
        <TextField name="business" label={c.business} autoComplete="organization" required />
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm text-muted">{c.reachHint}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="phone" type="tel" label={c.phone} autoComplete="tel" inputMode="tel" />
          <TextField name="email" type="email" label={c.email} autoComplete="email" required={wantsKit} />
        </div>
      </fieldset>

      <ChoiceGroup
        name="contactPref"
        legend={c.contactPref}
        defaultValue="whatsapp"
        columns={3}
        options={(["whatsapp", "call", "email"] as const).map((v) => ({ value: v, label: c.contactOptions[v] }))}
      />
      <ChoiceGroup
        name="language"
        legend={c.language}
        defaultValue={locale}
        options={[
          { value: "pa", label: "ਪੰਜਾਬੀ" },
          { value: "en", label: "English" },
        ]}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField name="businessType" label={c.businessType} options={[...businessTypes, { value: "Other", label: c.other }]} />
        <div className="field">
          <label htmlFor={pkgId}>{c.interested}</label>
          <select id={pkgId} name="package" value={pkg} onChange={(e) => setPkg(e.target.value)} className="input">
            <option value="">—</option>
            {packages.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
            <option value="not-sure">{c.notSure}</option>
          </select>
        </div>
        <SelectField name="budget" label={c.budget} options={BUDGETS.map((v) => ({ value: v, label: v }))} />
      </div>

      <TextArea name="message" label={c.message} rows={4} maxLength={3000} />

      <div className="field">
        <label htmlFor={kitId} className="flex items-start gap-3 font-normal!">
          <input
            id={kitId}
            type="checkbox"
            name="mediaKit"
            checked={wantsKit}
            onChange={(e) => setWantsKit(e.target.checked)}
            className="mt-1 size-5 shrink-0 accent-[var(--marigold)]"
          />
          <span>
            <span className="font-bold">{c.kit}</span>
            <span className="block text-sm text-muted">{c.kitHint}</span>
          </span>
        </label>
      </div>

      <ConsentField />
    </SmartForm>
  );
}
