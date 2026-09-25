import "server-only";

/**
 * Lead delivery: every submission goes to staff email (Resend) AND the
 * GoHighLevel inbound webhook (which can create the contact, tag it, and send
 * the WhatsApp/SMS confirmation from a GHL workflow).
 *
 * A submission counts as delivered if at least one configured channel
 * accepted it. With nothing configured (local dev) it is logged instead.
 */

export interface Lead {
  type: "newsletter" | "contact" | "sponsor" | "song_request" | "contest" | "event_booking" | "dedication_request" | "dedication_paid";
  name?: string;
  email?: string;
  phone?: string;
  locale: string;
  fields: Record<string, string | number | boolean | null | undefined>;
}

const TIMEOUT_MS = 8000;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const SUBJECTS: Record<Lead["type"], string> = {
  newsletter: "New newsletter signup",
  contact: "New contact message",
  sponsor: "New sponsor / advertising inquiry",
  song_request: "New song request",
  contest: "New contest entry",
  event_booking: "New event / MC booking request",
  dedication_request: "New dedication request (unpaid)",
  dedication_paid: "PAID dedication booking",
};

export async function sendEmail(opts: { to: string[]; subject: string; html: string; replyTo?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !opts.to.length) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Indi Radio <website@indiradio.ca>",
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) console.error("[email] Resend error", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[email] failed", err);
    return false;
  }
}

async function postToCrm(lead: Lead): Promise<boolean> {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return false;
  const [firstName, ...rest] = (lead.name || "").trim().split(/\s+/);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "indiradio.ca",
        form: lead.type,
        tags: ["website", `form:${lead.type}`, `lang:${lead.locale}`],
        first_name: firstName || "",
        last_name: rest.join(" "),
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        language: lead.locale,
        submitted_at: new Date().toISOString(),
        ...lead.fields,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) console.error("[crm] GoHighLevel webhook error", res.status);
    return res.ok;
  } catch (err) {
    console.error("[crm] failed", err);
    return false;
  }
}

export async function deliverLead(lead: Lead): Promise<boolean> {
  const staff = (process.env.EMAIL_TO || "").split(",").map((s) => s.trim()).filter(Boolean);
  const rows = Object.entries({ Name: lead.name, Email: lead.email, Phone: lead.phone, Language: lead.locale, ...lead.fields })
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `<tr><th align="left" style="padding:4px 12px 4px 0;vertical-align:top">${escapeHtml(k)}</th><td style="padding:4px 0">${escapeHtml(String(v)).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  const html = `<h2 style="font-family:sans-serif">${SUBJECTS[lead.type]}</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table><p style="font-family:sans-serif;color:#666;font-size:12px">Sent from indiradio.ca</p>`;

  const configured = Boolean(process.env.RESEND_API_KEY && staff.length) || Boolean(process.env.GHL_WEBHOOK_URL);
  if (!configured) {
    console.info("[lead] (no delivery channel configured)", JSON.stringify(lead));
    return process.env.NODE_ENV !== "production";
  }

  const [emailOk, crmOk] = await Promise.all([
    sendEmail({ to: staff, subject: `${SUBJECTS[lead.type]}${lead.name ? ` – ${lead.name}` : ""}`, html, replyTo: lead.email }),
    postToCrm(lead),
  ]);
  return emailOk || crmOk;
}
