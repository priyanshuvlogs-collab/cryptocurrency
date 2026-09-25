"use client";

import { useState } from "react";
import {
  bookDedication,
  submitContact,
  submitEventBooking,
  submitSongRequest,
  submitSponsorInquiry,
  subscribeNewsletter,
} from "@/app/actions";
import { useLocale } from "@/components/LocaleProvider";
import { ChoiceGroup, ConsentField, SelectField, SmartForm, TextArea, TextField } from "./Form";

const L = <T,>(locale: string, en: T, pa: T) => (locale === "pa" ? pa : en);

/* ── Newsletter ─────────────────────────────────────────────────────── */

export function NewsletterForm() {
  const { m } = useLocale();
  return (
    <SmartForm action={subscribeNewsletter} event="newsletter_signup" submitLabel={m.newsletter.submit}>
      <TextField name="email" type="email" label={m.newsletter.email} autoComplete="email" required />
    </SmartForm>
  );
}

/* ── Contact ────────────────────────────────────────────────────────── */

export function ContactForm() {
  const { locale, m } = useLocale();
  const topics = L(
    locale,
    ["General question", "Shows & call-ins", "Dedications", "Advertising", "Events", "Technical help"],
    ["ਆਮ ਸਵਾਲ", "ਸ਼ੋਅ ਅਤੇ ਕਾਲ-ਇਨ", "ਸੁਨੇਹੇ", "ਮਸ਼ਹੂਰੀ", "ਸਮਾਗਮ", "ਤਕਨੀਕੀ ਮਦਦ"],
  );
  return (
    <SmartForm action={submitContact} event="contact_submit">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label={m.forms.name} autoComplete="name" required />
        <TextField name="email" type="email" label={m.forms.email} autoComplete="email" required />
        <TextField name="phone" type="tel" label={m.forms.phoneOptional} autoComplete="tel" inputMode="tel" />
        <SelectField name="topic" label={L(locale, "Topic", "ਵਿਸ਼ਾ")} options={topics.map((x) => ({ value: x, label: x }))} />
      </div>
      <TextArea name="message" label={m.forms.message} required rows={5} maxLength={3000} />
      <ConsentField />
    </SmartForm>
  );
}

/* ── Sponsor inquiry ────────────────────────────────────────────────── */

export function SponsorForm({ packages }: { packages: { value: string; label: string }[] }) {
  const { locale, m } = useLocale();
  return (
    <SmartForm action={submitSponsorInquiry} event="sponsor_inquiry" submitLabel={L(locale, "Send inquiry", "ਪੁੱਛਗਿੱਛ ਭੇਜੋ")}>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label={m.forms.name} autoComplete="name" required />
        <TextField name="business" label={L(locale, "Business name", "ਕਾਰੋਬਾਰ ਦਾ ਨਾਂ")} autoComplete="organization" required />
        <TextField name="email" type="email" label={m.forms.email} autoComplete="email" required />
        <TextField name="phone" type="tel" label={m.forms.phone} autoComplete="tel" inputMode="tel" required />
        <SelectField
          name="package"
          label={L(locale, "Interested in", "ਕਿਸ ਵਿੱਚ ਦਿਲਚਸਪੀ ਹੈ")}
          options={[...packages, { value: "not-sure", label: L(locale, "Not sure yet", "ਅਜੇ ਪੱਕਾ ਨਹੀਂ") }]}
        />
        <SelectField
          name="budget"
          label={L(locale, "Monthly budget (CAD)", "ਮਹੀਨਾਵਾਰ ਬਜਟ (CAD)")}
          options={["< $500", "$500–$1,500", "$1,500–$5,000", "$5,000+"].map((v) => ({ value: v, label: v }))}
        />
      </div>
      <TextArea name="message" label={L(locale, "Tell us about your goals", "ਆਪਣੇ ਟੀਚਿਆਂ ਬਾਰੇ ਦੱਸੋ")} rows={4} maxLength={3000} />
      <ConsentField />
    </SmartForm>
  );
}

/* ── Song request / contest entry ───────────────────────────────────── */

export function SongRequestForm({ contest }: { contest?: { title: string; question: string } | null }) {
  const { locale, m } = useLocale();
  const [kind, setKind] = useState<"song" | "contest">("song");
  const tabs = [
    { id: "song" as const, label: L(locale, "Request a song", "ਗੀਤ ਦੀ ਫ਼ਰਮਾਇਸ਼") },
    ...(contest ? [{ id: "contest" as const, label: L(locale, "Enter the contest", "ਮੁਕਾਬਲੇ ਵਿੱਚ ਹਿੱਸਾ ਲਓ") }] : []),
  ];
  return (
    <div>
      {tabs.length > 1 ? (
        <div role="group" aria-label={L(locale, "Form type", "ਫ਼ਾਰਮ ਦੀ ਕਿਸਮ")} className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" className="chip" aria-pressed={kind === tab.id} onClick={() => setKind(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}
      {kind === "song" ? (
        <SmartForm key="song" action={submitSongRequest} event="song_request" submitLabel={L(locale, "Send request", "ਫ਼ਰਮਾਇਸ਼ ਭੇਜੋ")}>
          <input type="hidden" name="kind" value="song" />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField name="song" label={L(locale, "Song title", "ਗੀਤ ਦਾ ਨਾਂ")} required />
            <TextField name="artist" label={L(locale, "Singer / artist", "ਗਾਇਕ")} />
            <TextField name="name" label={m.forms.name} autoComplete="name" required />
            <TextField name="city" label={L(locale, "Your city", "ਤੁਹਾਡਾ ਸ਼ਹਿਰ")} autoComplete="address-level2" />
            <TextField name="dedicatedTo" label={L(locale, "Dedicate it to (optional)", "ਕਿਸ ਨੂੰ ਸਮਰਪਿਤ (ਲੋੜ ਹੋਵੇ ਤਾਂ)")} />
            <TextField name="email" type="email" label={L(locale, "Email (optional)", "ਈਮੇਲ (ਲੋੜ ਹੋਵੇ ਤਾਂ)")} autoComplete="email" />
          </div>
          <TextArea name="message" label={L(locale, "Short message for the host", "ਹੋਸਟ ਲਈ ਛੋਟਾ ਸੁਨੇਹਾ")} rows={3} maxLength={500} />
        </SmartForm>
      ) : (
        <SmartForm key="contest" action={submitSongRequest} event="contest_entry" submitLabel={L(locale, "Submit entry", "ਐਂਟਰੀ ਭੇਜੋ")}>
          <input type="hidden" name="kind" value="contest" />
          <input type="hidden" name="contest" value={contest?.title || ""} />
          <p className="font-semibold">{contest?.question}</p>
          <TextArea name="answer" label={L(locale, "Your answer", "ਤੁਹਾਡਾ ਜਵਾਬ")} required rows={3} maxLength={1000} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField name="name" label={m.forms.name} autoComplete="name" required />
            <TextField name="city" label={L(locale, "Your city", "ਤੁਹਾਡਾ ਸ਼ਹਿਰ")} autoComplete="address-level2" />
            <TextField name="email" type="email" label={m.forms.email} autoComplete="email" required />
            <TextField name="phone" type="tel" label={m.forms.phone} autoComplete="tel" inputMode="tel" required />
          </div>
          <ConsentField
            label={L(
              locale,
              "I agree to the contest rules in the Terms of Use and to Indi Radio contacting me if I win.",
              "ਮੈਂ ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ ਵਿਚਲੇ ਮੁਕਾਬਲੇ ਦੇ ਨਿਯਮਾਂ ਨਾਲ ਸਹਿਮਤ ਹਾਂ, ਅਤੇ ਜਿੱਤਣ ’ਤੇ ਇੰਡੀ ਰੇਡੀਓ ਮੇਰੇ ਨਾਲ ਸੰਪਰਕ ਕਰ ਸਕਦਾ ਹੈ।",
            )}
          />
        </SmartForm>
      )}
    </div>
  );
}

/* ── Event / MC booking ─────────────────────────────────────────────── */

export function EventBookingForm() {
  const { locale, m } = useLocale();
  const types = L(
    locale,
    ["Wedding / reception", "Mela / cultural event", "Business launch", "Community fundraiser", "Other"],
    ["ਵਿਆਹ / ਰਿਸੈਪਸ਼ਨ", "ਮੇਲਾ / ਸੱਭਿਆਚਾਰਕ ਸਮਾਗਮ", "ਕਾਰੋਬਾਰ ਦੀ ਸ਼ੁਰੂਆਤ", "ਭਾਈਚਾਰਕ ਫ਼ੰਡਰੇਜ਼ਰ", "ਹੋਰ"],
  );
  return (
    <SmartForm action={submitEventBooking} event="event_booking" submitLabel={L(locale, "Request booking", "ਬੁਕਿੰਗ ਦੀ ਬੇਨਤੀ ਭੇਜੋ")}>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label={m.forms.name} autoComplete="name" required />
        <TextField name="email" type="email" label={m.forms.email} autoComplete="email" required />
        <TextField name="phone" type="tel" label={m.forms.phone} autoComplete="tel" inputMode="tel" required />
        <SelectField name="eventType" label={L(locale, "Type of event", "ਸਮਾਗਮ ਦੀ ਕਿਸਮ")} required options={types.map((x) => ({ value: x, label: x }))} />
        <TextField name="eventDate" type="date" label={L(locale, "Event date", "ਸਮਾਗਮ ਦੀ ਤਾਰੀਖ਼")} required />
        <TextField name="guests" label={L(locale, "Expected guests", "ਅੰਦਾਜ਼ਨ ਮਹਿਮਾਨ")} inputMode="numeric" />
      </div>
      <TextField name="venue" label={L(locale, "Venue & city", "ਥਾਂ ਅਤੇ ਸ਼ਹਿਰ")} />
      <TextArea name="message" label={L(locale, "Tell us about the event", "ਸਮਾਗਮ ਬਾਰੇ ਦੱਸੋ")} rows={4} maxLength={2000} />
      <ConsentField />
    </SmartForm>
  );
}

/* ── Dedication booking ─────────────────────────────────────────────── */

export function DedicationForm({
  tiers,
  defaultTier,
  payable,
}: {
  tiers: { value: string; label: string; description?: string }[];
  defaultTier?: string;
  /** false until prices are set and Stripe is connected → booking is sent as a request */
  payable: boolean;
}) {
  const { locale, m } = useLocale();
  const occasions = [
    { value: "birthday", label: L(locale, "Birthday", "ਜਨਮਦਿਨ") },
    { value: "anniversary", label: L(locale, "Anniversary", "ਵਰ੍ਹੇਗੰਢ") },
    { value: "wedding", label: L(locale, "Wedding", "ਵਿਆਹ") },
    { value: "festival", label: L(locale, "Festival greeting", "ਤਿਉਹਾਰ ਦੀ ਵਧਾਈ") },
    { value: "business", label: L(locale, "Business opening", "ਕਾਰੋਬਾਰ ਦਾ ਉਦਘਾਟਨ") },
  ];
  const today = new Date().toISOString().slice(0, 10);
  return (
    <SmartForm action={bookDedication} event="dedication_checkout" submitLabel={
        payable ? L(locale, "Continue to secure payment", "ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਵੱਲ ਜਾਓ") : L(locale, "Send booking request", "ਬੁਕਿੰਗ ਬੇਨਤੀ ਭੇਜੋ")
      }>
      <ChoiceGroup name="occasion" legend={L(locale, "1. What are we celebrating?", "1. ਕਿਹੜੀ ਖ਼ੁਸ਼ੀ ਮਨਾ ਰਹੇ ਹਾਂ?")} options={occasions} required columns={5} />
      <ChoiceGroup
        name="tier"
        legend={L(locale, "2. Choose a package", "2. ਪੈਕੇਜ ਚੁਣੋ")}
        options={tiers}
        defaultValue={defaultTier}
        required
        columns={3}
      />
      <fieldset className="grid gap-5">
        <legend className="mb-2 font-semibold">{L(locale, "3. The dedication", "3. ਸੁਨੇਹਾ")}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="forName" label={L(locale, "Who is it for?", "ਕਿਸ ਲਈ ਹੈ?")} required />
          <TextField name="fromName" label={L(locale, "From (names to read on air)", "ਵੱਲੋਂ (ਆਨ-ਏਅਰ ਪੜ੍ਹੇ ਜਾਣ ਵਾਲੇ ਨਾਂ)")} required />
          <TextField name="date" type="date" min={today} label={L(locale, "Preferred date", "ਪਸੰਦੀਦਾ ਤਾਰੀਖ਼")} required />
          <SelectField
            name="language"
            label={L(locale, "Read it in", "ਕਿਸ ਭਾਸ਼ਾ ਵਿੱਚ ਪੜ੍ਹਿਆ ਜਾਵੇ")}
            defaultValue="pa"
            options={[
              { value: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
              { value: "en", label: "English" },
            ]}
          />
        </div>
        <TextArea
          name="message"
          label={L(locale, "Your message", "ਤੁਹਾਡਾ ਸੁਨੇਹਾ")}
          required
          rows={4}
          maxLength={600}
          hint={L(locale, "Up to 600 characters. English or Gurmukhi both welcome.", "600 ਅੱਖਰਾਂ ਤੱਕ। ਅੰਗਰੇਜ਼ੀ ਜਾਂ ਗੁਰਮੁਖੀ ਦੋਵੇਂ ਠੀਕ ਹਨ।")}
        />
        <TextField name="song" label={L(locale, "Song request (optional)", "ਗੀਤ ਦੀ ਫ਼ਰਮਾਇਸ਼ (ਲੋੜ ਹੋਵੇ ਤਾਂ)")} />
      </fieldset>
      <fieldset className="grid gap-5">
        <legend className="mb-2 font-semibold">{L(locale, "4. Your details", "4. ਤੁਹਾਡੇ ਵੇਰਵੇ")}</legend>
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField name="name" label={m.forms.name} autoComplete="name" required />
          <TextField name="email" type="email" label={m.forms.email} autoComplete="email" required />
          <TextField
            name="phone"
            type="tel"
            label={L(locale, "WhatsApp / phone", "WhatsApp / ਫ਼ੋਨ")}
            autoComplete="tel"
            inputMode="tel"
            required
          />
        </div>
      </fieldset>
      <ConsentField
        label={L(
          locale,
          "I confirm the message is family-friendly and agree to the dedication terms. Indi Radio may contact me on WhatsApp to confirm.",
          "ਮੈਂ ਪੁਸ਼ਟੀ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਸੁਨੇਹਾ ਪਰਿਵਾਰ ਨਾਲ ਸੁਣਨ ਯੋਗ ਹੈ ਅਤੇ ਮੈਂ ਸ਼ਰਤਾਂ ਨਾਲ ਸਹਿਮਤ ਹਾਂ। ਇੰਡੀ ਰੇਡੀਓ ਪੁਸ਼ਟੀ ਲਈ WhatsApp ’ਤੇ ਸੰਪਰਕ ਕਰ ਸਕਦਾ ਹੈ।",
        )}
      />
    </SmartForm>
  );
}
