import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Minimal Stripe client over the REST API (no SDK needed): Checkout Session
 * creation, retrieval and webhook signature verification.
 */

const API = "https://api.stripe.com/v1";
export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

function encode(obj: Record<string, unknown>, prefix = ""): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === "object") out.push(...encode(v as Record<string, unknown>, key));
    else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  }
  return out;
}

async function stripe<T>(path: string, init: { method?: string; body?: Record<string, unknown> } = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: init.method || "GET",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: init.body ? encode(init.body).join("&") : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Stripe ${res.status}: ${data?.error?.message || "request failed"}`);
  return data as T;
}

export interface CheckoutSession {
  id: string;
  url: string;
  payment_status: "paid" | "unpaid" | "no_payment_required";
  amount_total: number | null;
  currency: string;
  customer_details?: { email?: string; name?: string; phone?: string } | null;
  customer_email?: string | null;
  metadata: Record<string, string>;
}

export async function createCheckoutSession(opts: {
  amountCad: number;
  productName: string;
  description: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
  locale: "en" | "pa";
  metadata: Record<string, string>;
}): Promise<CheckoutSession> {
  const metadata = Object.fromEntries(Object.entries(opts.metadata).map(([k, v]) => [k, v.slice(0, 480)]));
  return stripe<CheckoutSession>("/checkout/sessions", {
    method: "POST",
    body: {
      mode: "payment",
      success_url: opts.successUrl,
      cancel_url: opts.cancelUrl,
      customer_email: opts.email,
      locale: opts.locale === "pa" ? "auto" : "en",
      "phone_number_collection": { enabled: "true" },
      line_items: {
        0: {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: Math.round(opts.amountCad * 100),
            product_data: { name: opts.productName, description: opts.description.slice(0, 300) },
          },
        },
      },
      payment_intent_data: { description: opts.productName, metadata },
      metadata,
    },
  });
}

export async function getCheckoutSession(id: string): Promise<CheckoutSession | null> {
  if (!stripeEnabled || !/^cs_[A-Za-z0-9_]+$/.test(id)) return null;
  try {
    return await stripe<CheckoutSession>(`/checkout/sessions/${id}`);
  } catch {
    return null;
  }
}

/** Verifies the Stripe-Signature header (v1 scheme, 5 minute tolerance). */
export function verifyStripeSignature(payload: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i), p.slice(i + 1)];
    }),
  ) as Record<string, string>;
  const ts = Number(parts.t);
  if (!ts || Math.abs(Date.now() / 1000 - ts) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${ts}.${payload}`).digest("hex");
  const signatures = header
    .split(",")
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.slice(3));
  return signatures.some((sig) => {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  });
}
