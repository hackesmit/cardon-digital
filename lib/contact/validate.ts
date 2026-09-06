/**
 * Contact payload shape and its validation.
 *
 * The rules live here rather than in the route so the field limits are stated
 * once and read the same way from every caller. Nothing in this module touches
 * the network or the environment, so it stays cheap to import and to reason
 * about.
 */

import { isLocale, type Locale } from "@/lib/i18n/config";

/** Largest request body the route will read, in bytes. */
export const MAX_BODY_BYTES = 16 * 1024;

/** Per field character limits, applied after trimming. */
export const LIMITS = {
  name: { min: 2, max: 120 },
  winery: { min: 0, max: 160 },
  email: { min: 5, max: 254 },
  whatsapp: { min: 0, max: 32 },
  message: { min: 10, max: 4000 },
} as const;

/** The field a human never sees and a bot fills in. */
export const HONEYPOT_FIELD = "website";

export type ContactField =
  | "name"
  | "winery"
  | "email"
  | "whatsapp"
  | "message";

/** Attribution carried by the form, all optional, all opaque to this module. */
export type ContactAttribution = {
  leadId: string;
  gclid: string;
  lane: string;
  campaign: string;
  landing: string;
  firstSeen: string;
};

export type ContactSubmission = {
  name: string;
  winery: string;
  email: string;
  whatsapp: string;
  message: string;
  locale: Locale;
  attribution: ContactAttribution;
};

export type ValidationResult =
  | { ok: true; value: ContactSubmission; honeypot: boolean }
  | { ok: false; errors: ContactField[] };

/* Anything that could open a new header line, plus the rest of the C0 and C1
   control ranges. A header safe string contains none of them. */
const CONTROL = /[\u0000-\u001F\u007F-\u009F]/;
const CONTROL_ALL = /[\u0000-\u001F\u007F-\u009F]/g;

/* The message is the one multi-line field: it keeps tab, newline and carriage
   return and loses every other control character. */
const CONTROL_IN_TEXT = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/;

/* Deliberately narrower than the RFC: one at sign, a dotted domain, no spaces,
   no quoted local parts, no comments. A winery owner's address always fits. */
const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;

/* Digits with the punctuation a phone number is written with. */
const PHONE = /^[0-9+()\-. ]+$/;

/** True when the string is safe to place on a mail header line. */
export function isHeaderSafe(value: string): boolean {
  return !CONTROL.test(value);
}

/**
 * Removes everything that could start a new header line, collapses the
 * whitespace left behind and cuts the result short. Every value that reaches a
 * header goes through here, validated or not.
 */
export function headerSafe(value: string, max = 200): string {
  return value
    .replace(CONTROL_ALL, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function str(input: unknown): string {
  return typeof input === "string" ? input : "";
}

function attributionField(input: unknown): string {
  // Attribution is machine written and lands in the mail body, so it is held
  // to the same control character rule as everything else and cut short.
  const value = str(input).trim();
  if (!value || CONTROL.test(value)) return "";
  return value.slice(0, 200);
}

/**
 * Validates a parsed JSON body. Returns the field names that failed rather
 * than prose, so the client renders its own localized messages.
 */
export function validateSubmission(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, errors: ["name", "email", "message"] };
  }
  const raw = body as Record<string, unknown>;
  const errors: ContactField[] = [];

  const name = str(raw.name).trim();
  const winery = str(raw.winery).trim();
  const email = str(raw.email).trim();
  const whatsapp = str(raw.whatsapp).trim();
  const message = str(raw.message).trim();

  // A control character is a header injection attempt in the fields that reach
  // a header and a malformed value everywhere else. Both answer 400.
  if (
    name.length < LIMITS.name.min ||
    name.length > LIMITS.name.max ||
    !isHeaderSafe(name)
  ) {
    errors.push("name");
  }
  if (winery.length > LIMITS.winery.max || !isHeaderSafe(winery)) {
    errors.push("winery");
  }
  if (
    email.length < LIMITS.email.min ||
    email.length > LIMITS.email.max ||
    !isHeaderSafe(email) ||
    !EMAIL.test(email)
  ) {
    errors.push("email");
  }
  if (
    whatsapp.length > LIMITS.whatsapp.max ||
    (whatsapp.length > 0 && !PHONE.test(whatsapp))
  ) {
    errors.push("whatsapp");
  }
  if (
    message.length < LIMITS.message.min ||
    message.length > LIMITS.message.max ||
    CONTROL_IN_TEXT.test(message)
  ) {
    errors.push("message");
  }

  if (errors.length > 0) return { ok: false, errors };

  const localeRaw = str(raw.locale).trim();
  const locale: Locale = isLocale(localeRaw) ? localeRaw : "es";

  return {
    ok: true,
    honeypot: str(raw[HONEYPOT_FIELD]).trim().length > 0,
    value: {
      name,
      winery,
      email,
      whatsapp,
      message,
      locale,
      attribution: {
        leadId: attributionField(raw.cd_lead_id),
        gclid: attributionField(raw.cd_gclid),
        lane: attributionField(raw.cd_lane),
        campaign: attributionField(raw.cd_campaign),
        landing: attributionField(raw.cd_landing),
        firstSeen: attributionField(raw.cd_first_seen),
      },
    },
  };
}
