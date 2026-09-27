"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdPackages, getAdvertiseContent, getDedicationTiers, getSettings } from "@/lib/cms";
import { deliverLead, escapeHtml, sendEmail, type Lead } from "@/lib/forms/deliver";
import { looksLikeBot, rateLimited } from "@/lib/forms/protect";
import { getMessages, isLocale } from "@/lib/i18n";
import { SITE_URL, isFilled, t, whatsappLink } from "@/lib/site";
import { createCheckoutSession, stripeEnabled } from "@/lib/stripe";
import type { Locale } from "@/lib/types";

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Optional follow-up link shown with a success message (e.g. WhatsApp). */
  followUp?: { href: string; label: string };
}

const FIELD_MSG = {
  en: {
    required: "This field is required.",
    email: "Please enter a valid email address.",
    tooLong: "This is too long.",
    contactNeeded: "Add a phone/WhatsApp number or an email so we can reach you.",
    emailForKit: "Add your email so we can send you the media kit.",
  },
  pa: {
    required: "ਇਹ ਖ਼ਾਨਾ ਲਾਜ਼ਮੀ ਹੈ।",
    email: "ਕਿਰਪਾ ਕਰਕੇ ਸਹੀ ਈਮੇਲ ਪਤਾ ਲਿਖੋ।",
    tooLong: "ਇਹ ਬਹੁਤ ਲੰਮਾ ਹੈ।",
    contactNeeded: "ਫ਼ੋਨ/WhatsApp ਨੰਬਰ ਜਾਂ ਈਮੇਲ ਵਿੱਚੋਂ ਇੱਕ ਜ਼ਰੂਰ ਲਿਖੋ, ਤਾਂ ਜੋ ਅਸੀਂ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰ ਸਕੀਏ।",
    emailForKit: "ਮੀਡੀਆ ਕਿੱਟ ਭੇਜਣ ਲਈ ਆਪਣੀ ਈਮੇਲ ਲਿਖੋ।",
  },
};

const str = (max = 200) => z.string().trim().min(1, "required").max(max, "tooLong");
const optStr = (max = 200) => z.string().trim().max(max, "tooLong").optional().default("");
const email = z.string().trim().min(1, "required").email("email").max(200, "tooLong");
const consent = z.literal("on", { message: "required" });

function localeOf(fd: FormData): Locale {
  const l = String(fd.get("locale") || "en");
  return isLocale(l) ? l : "en";
}

function toObject(fd: FormData) {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string" && !k.startsWith("$ACTION")) out[k] = v;
  return out;
}

/** Shared guard + validation. Returns parsed data or an error FormState. */
async function guard<T extends z.ZodTypeAny>(
  form: string,
  fd: FormData,
  schema: T,
): Promise<{ ok: true; data: z.infer<T>; locale: Locale } | { ok: false; state: FormState }> {
  const locale = localeOf(fd);
  const m = getMessages(locale);
  if (looksLikeBot(fd)) {
    // Pretend success so bots learn nothing.
    return { ok: false, state: { status: "success", message: m.forms.success } };
  }
  if (await rateLimited(form)) return { ok: false, state: { status: "error", message: m.forms.rateLimited } };
  const parsed = schema.safeParse(toObject(fd));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      const code = (issue.message in FIELD_MSG.en ? issue.message : "required") as keyof typeof FIELD_MSG.en;
      fieldErrors[key] ??= FIELD_MSG[locale][code];
    }
    return { ok: false, state: { status: "error", message: m.forms.invalid, fieldErrors } };
  }
  return { ok: true, data: parsed.data, locale };
}

async function finish(lead: Lead, locale: Locale, successMessage?: string, followUp?: FormState["followUp"]): Promise<FormState> {
  const m = getMessages(locale);
  const ok = await deliverLead(lead);
  return ok ? { status: "success", message: successMessage || m.forms.success, followUp } : { status: "error", message: m.forms.error };
}

/* ── Newsletter ─────────────────────────────────────────────────────── */

export async function subscribeNewsletter(_prev: FormState, fd: FormData): Promise<FormState> {
  const g = await guard("newsletter", fd, z.object({ email }));
  if (!g.ok) return g.state;
  return finish(
    { type: "newsletter", email: g.data.email, locale: g.locale, fields: { list: "newsletter" } },
    g.locale,
    getMessages(g.locale).newsletter.success,
  );
}

/* ── Contact ────────────────────────────────────────────────────────── */

export async function submitContact(_prev: FormState, fd: FormData): Promise<FormState> {
  const g = await guard(
    "contact",
    fd,
    z.object({ name: str(), email, phone: optStr(40), topic: optStr(60), message: str(3000), consent }),
  );
  if (!g.ok) return g.state;
  const { name, email: em, phone, topic, message } = g.data;
  return finish({ type: "contact", name, email: em, phone, locale: g.locale, fields: { topic, message } }, g.locale);
}

/* ── Sponsor / advertising inquiry (/advertise) ───────────────────── */

export async function submitSponsorInquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  const optEmail = z.union([z.literal(""), z.string().trim().max(200, "tooLong").email("email")]).optional().default("");
  const g = await guard(
    "sponsor",
    fd,
    z
      .object({
        name: str(),
        business: str(),
        phone: optStr(40),
        email: optEmail,
        contactPref: z.enum(["whatsapp", "call", "email"]).optional(),
        language: z.enum(["pa", "en"]).optional(),
        businessType: optStr(80),
        package: optStr(60),
        budget: optStr(60),
        message: optStr(3000),
        mediaKit: z.literal("on").optional(),
        consent,
      })
      .superRefine((d, ctx) => {
        // At least one way to reach them; email is required for the media kit.
        if (!d.phone && !d.email) {
          ctx.addIssue({ code: "custom", path: ["phone"], message: "contactNeeded" });
          ctx.addIssue({ code: "custom", path: ["email"], message: "contactNeeded" });
        } else if (d.mediaKit && !d.email) {
          ctx.addIssue({ code: "custom", path: ["email"], message: "emailForKit" });
        }
      }),
  );
  if (!g.ok) return g.state;
  const { locale, data } = g;
  const [settings, packages, content] = await Promise.all([getSettings(), getAdPackages(), getAdvertiseContent()]);
  const pkg = packages.find((p) => p.slug === data.package);
  const wantsKit = data.mediaKit === "on";
  const kitUrl = isFilled(settings.mediaKitUrl) ? settings.mediaKitUrl : null;

  const delivered = await deliverLead({
    type: "sponsor",
    name: data.name,
    email: data.email,
    phone: data.phone,
    locale,
    fields: {
      business: data.business,
      business_type: data.businessType,
      package: pkg ? t(pkg.name, "en") : data.package,
      package_slug: data.package,
      budget: data.budget,
      preferred_contact: data.contactPref,
      preferred_language: data.language === "pa" ? "Punjabi" : data.language === "en" ? "English" : undefined,
      media_kit_requested: wantsKit ? "yes" : "no",
      message: data.message,
    },
  });
  if (!delivered) return { status: "error", message: getMessages(locale).forms.error };

  // Media kit PDF goes out automatically when it exists and was asked for.
  let kitSent = false;
  if (wantsKit && kitUrl && data.email) {
    const pa = (data.language || locale) === "pa";
    kitSent = await sendEmail({
      to: [data.email],
      subject: pa ? "ਇੰਡੀ ਰੇਡੀਓ ਮੀਡੀਆ ਕਿੱਟ" : "Indi Radio media kit",
      html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.6">
        <p>${pa ? `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${escapeHtml(data.name)} ਜੀ,` : `Hi ${escapeHtml(data.name)},`}</p>
        <p>${pa ? "ਇੰਡੀ ਰੇਡੀਓ ਦੀ ਮੀਡੀਆ ਕਿੱਟ ਨਾਲ ਲੱਗੀ ਹੈ।" : "Thanks for your interest in advertising on Indi Radio. The media kit is attached."}</p>
        <p><a href="${escapeHtml(kitUrl)}">${pa ? "ਮੀਡੀਆ ਕਿੱਟ ਖੋਲ੍ਹੋ (PDF)" : "Open the media kit (PDF)"}</a></p>
        <p>Indi Radio · Surrey, BC · ${escapeHtml(settings.phoneDisplay)}</p></div>`,
      attachments: [{ filename: "Indi-Radio-media-kit.pdf", path: kitUrl }],
    });
  }

  const reply = isFilled(content.replyTime) ? t(content.replyTime, locale) : null;
  const parts =
    locale === "pa"
      ? [
          `ਧੰਨਵਾਦ, ${data.name} ਜੀ! ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਸਾਨੂੰ ਮਿਲ ਗਈ ਹੈ।`,
          reply ? `ਅਸੀਂ ${reply} ਦੇ ਅੰਦਰ ਜਵਾਬ ਦਿੰਦੇ ਹਾਂ।` : "ਅਸੀਂ ਜਲਦੀ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰਾਂਗੇ।",
          wantsKit ? (kitSent ? "ਮੀਡੀਆ ਕਿੱਟ ਤੁਹਾਡੀ ਈਮੇਲ ’ਤੇ ਭੇਜ ਦਿੱਤੀ ਹੈ।" : "ਮੀਡੀਆ ਕਿੱਟ ਟੀਮ ਤੁਹਾਨੂੰ ਭੇਜ ਦੇਵੇਗੀ।") : "",
        ]
      : [
          `Thank you, ${data.name}! We’ve got your details.`,
          reply ? `We reply within ${reply}.` : "We’ll be in touch soon.",
          wantsKit ? (kitSent ? "The media kit is on its way to your inbox." : "The team will send you the media kit.") : "",
        ];
  const waText =
    locale === "pa"
      ? `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਇੰਡੀ ਰੇਡੀਓ, ਮੈਂ ਹੁਣੇ ${data.business} ਦੀ ਮਸ਼ਹੂਰੀ ਬਾਰੇ ਫ਼ਾਰਮ ਭੇਜਿਆ ਹੈ।`
      : `Hi Indi Radio, I just sent an advertising inquiry for ${data.business}.`;
  return {
    status: "success",
    message: parts.filter(Boolean).join(" "),
    followUp: { href: whatsappLink(settings.whatsappNumber, waText), label: locale === "pa" ? "WhatsApp ’ਤੇ ਗੱਲ ਕਰੋ" : "Chat on WhatsApp" },
  };
}

/* ── Song request & contest entry ───────────────────────────────────── */

export async function submitSongRequest(_prev: FormState, fd: FormData): Promise<FormState> {
  const kind = fd.get("kind") === "contest" ? "contest" : "song_request";
  const schema =
    kind === "contest"
      ? z.object({ name: str(), email, phone: str(40), contest: str(120), answer: str(1000), city: optStr(80), consent })
      : z.object({ name: str(), song: str(150), artist: optStr(150), dedicatedTo: optStr(150), message: optStr(500), city: optStr(80), email: z.string().trim().email("email").optional().or(z.literal("")) });
  const g = await guard(kind, fd, schema);
  if (!g.ok) return g.state;
  const { name, email: em = "", phone = "", ...fields } = g.data as Record<string, string>;
  return finish({ type: kind, name, email: em, phone, locale: g.locale, fields }, g.locale);
}

/* ── Event / MC booking for Indi Jaswal ─────────────────────────────── */

export async function submitEventBooking(_prev: FormState, fd: FormData): Promise<FormState> {
  const g = await guard(
    "event_booking",
    fd,
    z.object({
      name: str(),
      email,
      phone: str(40),
      eventType: str(80),
      eventDate: str(40),
      venue: optStr(200),
      guests: optStr(20),
      message: optStr(2000),
      consent,
    }),
  );
  if (!g.ok) return g.state;
  const { name, email: em, phone, ...fields } = g.data;
  return finish({ type: "event_booking", name, email: em, phone, locale: g.locale, fields }, g.locale);
}

/* ── Dedication booking → Stripe Checkout ───────────────────────────── */

const OCCASIONS = ["birthday", "anniversary", "wedding", "festival", "business"] as const;

export async function bookDedication(_prev: FormState, fd: FormData): Promise<FormState> {
  const g = await guard(
    "dedication",
    fd,
    z.object({
      occasion: z.enum(OCCASIONS, { message: "required" }),
      tier: str(60),
      forName: str(120),
      fromName: str(120),
      message: str(600),
      language: z.enum(["en", "pa"]).default("pa"),
      date: str(20),
      song: optStr(150),
      name: str(),
      email,
      phone: str(40),
      consent,
    }),
  );
  if (!g.ok) return g.state;
  const { locale, data } = g;
  const m = getMessages(locale);
  const [tiers, settings] = await Promise.all([getDedicationTiers(), getSettings()]);
  const tier = tiers.find((x) => x.id === data.tier);
  if (!tier) return { status: "error", message: m.forms.invalid, fieldErrors: { tier: FIELD_MSG[locale].required } };

  const summary = `${t(tier.name, locale)} · ${data.occasion} · ${data.forName} · ${data.date}`;
  const fields = {
    occasion: data.occasion,
    tier: t(tier.name, "en"),
    price_cad: tier.priceCad ?? "not set",
    for_name: data.forName,
    from_name: data.fromName,
    message: data.message,
    message_language: data.language,
    preferred_date: data.date,
    song: data.song,
  };

  // Price confirmed and Stripe configured → pay online first.
  if (tier.priceCad && stripeEnabled) {
    let url: string;
    try {
      const session = await createCheckoutSession({
        amountCad: tier.priceCad,
        productName: `Indi Radio – ${t(tier.name, "en")} (${data.occasion})`,
        description: `For ${data.forName} on ${data.date}`,
        email: data.email,
        locale,
        successUrl: `${SITE_URL}/${locale}/dedications/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${SITE_URL}/${locale}/dedications?cancelled=1#book`,
        metadata: {
          booker_name: data.name,
          booker_phone: data.phone,
          locale,
          ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, String(v ?? "")])),
        },
      });
      url = session.url;
    } catch (err) {
      console.error("[dedication] checkout failed", err);
      return { status: "error", message: m.forms.error };
    }
    redirect(url);
  }

  // Otherwise take it as a request: the team confirms price & time on WhatsApp.
  const whatsappText =
    locale === "pa"
      ? `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਇੰਡੀ ਰੇਡੀਓ! ਮੈਂ ਸੁਨੇਹਾ ਬੁੱਕ ਕਰਨਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ: ${summary}. ਨਾਂ: ${data.name}`
      : `Hi Indi Radio! I just requested a dedication: ${summary}. Name: ${data.name}`;
  return finish(
    { type: "dedication_request", name: data.name, email: data.email, phone: data.phone, locale, fields },
    locale,
    locale === "pa"
      ? "ਧੰਨਵਾਦ! ਤੁਹਾਡੀ ਬੇਨਤੀ ਮਿਲ ਗਈ ਹੈ। ਕੀਮਤ ਅਤੇ ਸਮਾਂ ਪੱਕਾ ਕਰਨ ਲਈ ਟੀਮ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੇਗੀ। ਹੁਣੇ WhatsApp ’ਤੇ ਵੀ ਪੱਕਾ ਕਰ ਸਕਦੇ ਹੋ।"
      : "Thank you! Your request is in. The team will contact you to confirm the price and air time. You can also confirm on WhatsApp right now.",
    { href: whatsappLink(settings.whatsappNumber, whatsappText), label: locale === "pa" ? "WhatsApp ’ਤੇ ਪੱਕਾ ਕਰੋ" : "Confirm on WhatsApp" },
  );
}
