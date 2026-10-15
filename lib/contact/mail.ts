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
  html?: string;
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

/** The subject a lead notification arrives under: who wrote, and for whom. */
function subjectFor(s: ContactSubmission): string {
  const who = s.winery ? s.name + " (" + s.winery + ")" : s.name;
  return headerSafe("New lead: " + who, 160);
}

/**
 * A wa.me link for the number the visitor gave, or "" when it cannot be one.
 * Ten digits with no country code is a Mexican number written the way people
 * here write it, so it gets 52 in front; anything longer already carries its
 * country code.
 */
export function whatsappLink(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && !raw.trim().startsWith("+")) return "https://wa.me/52" + digits;
  return digits.length >= 11 && digits.length <= 15 ? "https://wa.me/" + digits : "";
}

/** The campaign marks a lead arrived with, labelled, with the empty ones left out. */
function sourceRows(s: ContactSubmission): [string, string][] {
  const a = s.attribution;
  const rows: [string, string][] = [
    ["Landing page", a.landing],
    ["Campaign", a.campaign],
    ["Lane", a.lane],
    ["First seen", a.firstSeen],
    ["Lead id", a.leadId],
    ["Google click id", a.gclid],
  ];
  return rows.filter(([, v]) => v);
}

function languageOf(s: ContactSubmission): string {
  return s.locale === "es" ? "Spanish" : "English";
}

/**
 * Plain text body, for mail clients that do not show HTML. The message comes
 * first because it is what gets read first; how to reach them comes next.
 */
function bodyFor(s: ContactSubmission): string {
  const wa = s.whatsapp ? whatsappLink(s.whatsapp) : "";
  const lines = [
    s.name + (s.winery ? ", " + s.winery : ""),
    "Wrote from the " + languageOf(s) + " site.",
    "",
    s.message,
    "",
    "Email: " + s.email,
  ];
  if (s.whatsapp) lines.push("WhatsApp: " + s.whatsapp + (wa ? " (" + wa + ")" : ""));
  lines.push("", "Reply to this email to answer " + s.name + " directly.");

  const source = sourceRows(s);
  if (source.length > 0) {
    lines.push("", "How they found us:");
    for (const [k, v] of source) lines.push("  " + k + ": " + v);
  }
  return lines.join("\n");
}

/** Every visitor value goes through this before it touches the HTML body. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * The HTML body: the same content as the text body, laid out to scan. Inline
 * styles and tables only, because that is what mail clients render; no
 * images and no remote resources. Visitor input is escaped, and the only
 * links are a mailto to the address that passed validation and a wa.me link
 * built from digits.
 */
function htmlFor(s: ContactSubmission): string {
  const wa = s.whatsapp ? whatsappLink(s.whatsapp) : "";
  const ink = "#221418";
  const muted = "#6b5a5e";
  const accent = "#B4531F";
  const button = (href: string, label: string, bg: string) =>
    '<a href="' + esc(href) + '" style="display:inline-block;padding:10px 18px;margin:0 8px 8px 0;border-radius:6px;background:' +
    bg + ';color:#ffffff;text-decoration:none;font-weight:600;font-size:14px">' + label + "</a>";

  const contact: string[] = [
    '<tr><td style="padding:4px 16px 4px 0;color:' + muted + '">Email</td><td style="padding:4px 0"><a href="mailto:' +
      esc(s.email) + '" style="color:' + ink + '">' + esc(s.email) + "</a></td></tr>",
  ];
  if (s.whatsapp) {
    contact.push(
      '<tr><td style="padding:4px 16px 4px 0;color:' + muted + '">WhatsApp</td><td style="padding:4px 0">' +
        (wa ? '<a href="' + esc(wa) + '" style="color:' + ink + '">' + esc(s.whatsapp) + "</a>" : esc(s.whatsapp)) +
        "</td></tr>",
    );
  }

  const source = sourceRows(s);
  const sourceBlock =
    source.length === 0
      ? ""
      : '<p style="margin:24px 0 6px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:' + muted +
        '">How they found us</p><table style="font-size:13px;color:' + muted + ';border-collapse:collapse">' +
        source
          .map(([k, v]) => '<tr><td style="padding:2px 16px 2px 0">' + k + '</td><td style="padding:2px 0;color:' + ink + '">' + esc(v) + "</td></tr>")
          .join("") +
        "</table>";

  return (
    '<!doctype html><html><body style="margin:0;padding:0;background:#F4EFE8">' +
    '<table role="presentation" width="100%" style="background:#F4EFE8;border-collapse:collapse"><tr><td style="padding:24px 12px">' +
    '<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;border-collapse:separate;font-family:Arial,Helvetica,sans-serif;color:' + ink + '"><tr><td style="padding:28px">' +
    '<p style="margin:0 0 4px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:' + accent + '">New lead, ' + languageOf(s) + " site</p>" +
    '<h1 style="margin:0;font-size:22px;line-height:1.25">' + esc(s.name) + "</h1>" +
    (s.winery ? '<p style="margin:2px 0 0;font-size:15px;color:' + muted + '">' + esc(s.winery) + "</p>" : "") +
    '<div style="margin:20px 0;padding:16px 18px;background:#F7F3EF;border-left:3px solid ' + accent + ';border-radius:4px;font-size:15px;line-height:1.55;white-space:pre-wrap">' +
    esc(s.message) + "</div>" +
    '<table style="font-size:14px;border-collapse:collapse">' + contact.join("") + "</table>" +
    '<div style="margin-top:20px">' + button("mailto:" + s.email, "Reply by email", ink) + (wa ? button(wa, "Open WhatsApp", "#1f8f4e") : "") + "</div>" +
    '<p style="margin:4px 0 0;font-size:13px;color:' + muted + '">Replying to this email also goes straight to ' + esc(s.name) + ".</p>" +
    sourceBlock +
    "</td></tr></table></td></tr></table></body></html>"
  );
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
    html: htmlFor(s),
  };
}

/**
 * The provider's error name alone, never its body. Resend answers a rejection
 * with { statusCode, name, message }, where name is a fixed token and message
 * can quote the request. Anything else, or any token that is not a plain word,
 * comes back as "rejected".
 */
function errorName(body: string): string {
  try {
    const parsed = JSON.parse(body) as { name?: unknown };
    if (typeof parsed.name === "string" && /^[a-z0-9_-]{1,40}$/i.test(parsed.name)) {
      return parsed.name;
    }
  } catch {
    // A non-JSON body (a gateway's HTML page, say) says nothing worth keeping.
  }
  return "rejected";
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
        ...(email.html ? { html: email.html } : {}),
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      /* The provider's own words are not logged. Its rejection body quotes the
         request back, which for a rejected address means the visitor's email
         address in a log the privacy notice says holds no address at all.
         What survives is the status and the provider's error name, a fixed
         token like validation_error, held to that shape so nothing a visitor
         typed can ride out inside it. */
      const detail = errorName(await res.text());
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
