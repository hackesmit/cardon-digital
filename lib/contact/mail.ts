/**
 * Turning a validated submission into an email, and putting it on the wire.
 *
 * Delivery goes through Resend's HTTP API with plain fetch. The SDK would add
 * a dependency for one POST, which this site does not take.
 *
 * Delivery is either wired or it is not, and the site says which. With no
 * RESEND_API_KEY, or no addresses to send between, nothing can be delivered,
 * so the form does not accept a message at all: the contact page shows the
 * mailto door instead (see ./doors) and this module reports the state through
 * deliveryConfigured. Accepting a message we cannot deliver and answering the
 * visitor with success would lose a real lead while promising an answer,
 * which is worse than showing one door fewer.
 */

import { headerSafe, type ContactSubmission } from "./validate";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/* Either a bare address or the "Name <address>" form, and nothing that could
   open a second header line. Env values are trusted more than form input, but
   not blindly: a bad value closes the form and leaves the mailto door instead
   of shipping a broken header. */
const ADDRESS = /^[^\u0000-\u001F<>]*<?[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+>?$/;

export type Email = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

/**
 * The shape a lead takes in a log line: enough to know a message arrived,
 * roughly who from and how long it was, and not enough to be a second copy of
 * somebody's personal data sitting in a log nobody prunes. A server log is
 * not an inbox: it records that something happened, never the lead itself.
 */
export type RedactedLead = {
  name: string;
  emailDomain: string;
  messageChars: number;
  locale: string;
};

export function redactLead(s: ContactSubmission): RedactedLead {
  const first = s.name.trim().slice(0, 1).toUpperCase();
  const at = s.email.lastIndexOf("@");
  return {
    name: first ? first + "." : "unknown",
    emailDomain: at >= 0 ? s.email.slice(at + 1) : "unknown",
    messageChars: s.message.length,
    locale: s.locale,
  };
}

export type DeliveryResult =
  | { mode: "unavailable"; ok: false; reason: string }
  | { mode: "sent"; ok: true; id: string }
  | { mode: "sent"; ok: false; status: number; detail: string };

function envAddress(name: string): string {
  const value = headerSafe(process.env[name] ?? "");
  return ADDRESS.test(value) ? value : "";
}

/**
 * Whether this environment can actually deliver a message: a key to send with
 * and two usable addresses to send between. Server side only, because
 * RESEND_API_KEY is not a NEXT_PUBLIC value and must never be. The contact
 * page asks this before it decides whether the written door is the form or
 * the mailto, and the route asks it again through deliver().
 */
export function deliveryConfigured(): boolean {
  const key = (process.env.RESEND_API_KEY ?? "").trim();
  return key !== "" && envAddress("CONTACT_FROM") !== "" && envAddress("CONTACT_TO") !== "";
}

/** The subject a lead notification arrives under. */
function subjectFor(s: ContactSubmission): string {
  const who = s.winery ? s.winery + ", " + s.name : s.name;
  const label = s.locale === "es" ? "Contacto" : "Contact";
  return headerSafe(label + ": " + who, 160);
}

/**
 * Plain text body. Every value here has already been validated, and it is
 * built as text rather than HTML so nothing a visitor types can be markup.
 */
function bodyFor(s: ContactSubmission): string {
  const lines = [
    "Name: " + s.name,
    "Winery: " + (s.winery || "not given"),
    "Email: " + s.email,
    "WhatsApp: " + (s.whatsapp || "not given"),
    "Locale: " + s.locale,
    "",
    "Message:",
    s.message,
  ];

  const a = s.attribution;
  if (a.leadId || a.gclid || a.lane || a.campaign || a.landing || a.firstSeen) {
    lines.push(
      "",
      "Source:",
      "  lead id: " + (a.leadId || "none"),
      "  gclid: " + (a.gclid || "none"),
      "  lane: " + (a.lane || "none"),
      "  campaign: " + (a.campaign || "none"),
      "  landing: " + (a.landing || "none"),
      "  first seen: " + (a.firstSeen || "none"),
    );
  }

  return lines.join("\n");
}

export function buildEmail(s: ContactSubmission): Email {
  return {
    from: envAddress("CONTACT_FROM"),
    to: envAddress("CONTACT_TO"),
    // The visitor's address is what a reply must go to, and it is the only
    // place their input reaches a header. It passed the address check in
    // validation and is scrubbed once more here.
    replyTo: headerSafe(s.email, 254),
    subject: subjectFor(s),
    text: bodyFor(s),
  };
}

/**
 * Sends the email, or reports that this environment cannot. Never throws: a
 * network failure comes back as an unsuccessful sent result and the route
 * decides what the visitor sees.
 */
export async function deliver(email: Email): Promise<DeliveryResult> {
  const key = (process.env.RESEND_API_KEY ?? "").trim();

  if (!key || !email.from || !email.to) {
    // The route writes the one redacted line for this, as it does for the
    // other two outcomes; the reason travels with the result so that line can
    // say which environment value is missing.
    const reason = !key ? "no RESEND_API_KEY" : "no CONTACT_FROM or CONTACT_TO";
    return { mode: "unavailable", ok: false, reason };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: email.from,
        to: [email.to],
        reply_to: email.replyTo,
        subject: email.subject,
        text: email.text,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const detail = (await res.text()).slice(0, 400);
      console.error("[contact] resend rejected the message", res.status, detail);
      return { mode: "sent", ok: false, status: res.status, detail };
    }

    const payload = (await res.json().catch(() => ({}))) as { id?: string };
    return { mode: "sent", ok: true, id: payload.id ?? "" };
  } catch (err) {
    console.error("[contact] resend request failed", err);
    return { mode: "sent", ok: false, status: 0, detail: "request failed" };
  }
}
