import { NextResponse } from "next/server";
import { deliverLead, escapeHtml, sendEmail } from "@/lib/forms/deliver";
import { getSettings } from "@/lib/cms";
import { verifyStripeSignature, type CheckoutSession } from "@/lib/stripe";
import { whatsappLink } from "@/lib/site";

/**
 * Stripe → checkout.session.completed. Sends the paid booking to staff email
 * + GoHighLevel (which triggers the WhatsApp confirmation workflow) and emails
 * the customer a confirmation with a WhatsApp link.
 *
 * Stripe dashboard: Developers → Webhooks → add endpoint
 *   https://indiradio.ca/api/stripe/webhook  (event: checkout.session.completed)
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });

  const payload = await req.text();
  if (!verifyStripeSignature(payload, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(payload) as { type: string; data: { object: CheckoutSession } };
  if (event.type !== "checkout.session.completed") return NextResponse.json({ received: true });

  const session = event.data.object;
  if (session.payment_status !== "paid") return NextResponse.json({ received: true });

  const md = session.metadata || {};
  const email = session.customer_details?.email || session.customer_email || "";
  const locale = md.locale === "pa" ? "pa" : "en";
  const order = session.id.slice(-8).toUpperCase();

  await deliverLead({
    type: "dedication_paid",
    name: md.booker_name || session.customer_details?.name || "",
    email,
    phone: md.booker_phone || session.customer_details?.phone || "",
    locale,
    fields: {
      order,
      amount_cad: session.amount_total != null ? (session.amount_total / 100).toFixed(2) : "",
      stripe_session: session.id,
      ...md,
    },
  });

  if (email) {
    const settings = await getSettings();
    const wa = whatsappLink(settings.whatsappNumber, `Hi Indi Radio! Dedication order ${order} for ${md.for_name || ""} on ${md.preferred_date || ""}.`);
    await sendEmail({
      to: [email],
      subject: locale === "pa" ? `ਇੰਡੀ ਰੇਡੀਓ: ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਬੁੱਕ ਹੋ ਗਿਆ (${order})` : `Indi Radio: your dedication is booked (${order})`,
      html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.6">
        <h2>${locale === "pa" ? "ਧੰਨਵਾਦ!" : "Thank you!"}</h2>
        <p>${locale === "pa" ? "ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਬੁੱਕ ਹੋ ਗਿਆ ਹੈ।" : "Your dedication on Indi Radio is booked."}</p>
        <p><strong>Order:</strong> ${order}<br><strong>For:</strong> ${escapeHtml(md.for_name || "")}<br><strong>Date:</strong> ${escapeHtml(md.preferred_date || "")}</p>
        <p><a href="${escapeHtml(wa)}">${locale === "pa" ? "WhatsApp ’ਤੇ ਸਮਾਂ ਪੱਕਾ ਕਰੋ" : "Confirm the air time on WhatsApp"}</a></p>
        <p>Indi Radio · Surrey, BC · ${settings.phoneDisplay}</p></div>`,
    });
  }

  return NextResponse.json({ received: true });
}
