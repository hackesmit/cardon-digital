/**
 * The consent decision, stored in one first-party cookie.
 *
 * A cookie rather than local storage because the decision has to be readable on
 * the server: the tag is rendered into the HTML only for a visitor who has
 * already accepted, so a visitor who has not accepted never receives a single
 * byte of Google script, not even one that decides not to run.
 */

export const CONSENT_COOKIE = "cardon-consent";

/** Six months, in seconds. Long enough not to nag, short enough to re-ask. */
export const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export type ConsentDecision = "granted" | "denied";

export function isDecision(value: string | null | undefined): value is ConsentDecision {
  return value === "granted" || value === "denied";
}

/** Reads a decision out of a raw cookie value. Anything else means undecided. */
export function decisionFrom(value: string | null | undefined): ConsentDecision | null {
  return isDecision(value) ? value : null;
}

/** Client-side read of the current decision. Null means undecided. */
export function readConsent(): ConsentDecision | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + CONSENT_COOKIE + "=([^;]*)"),
  );
  return decisionFrom(match ? decodeURIComponent(match[1]) : null);
}

/** Client-side write. Lax and path-wide, mirroring the locale cookie. */
export function writeConsent(decision: ConsentDecision): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie =
      CONSENT_COOKIE +
      "=" +
      decision +
      "; path=/; max-age=" +
      CONSENT_COOKIE_MAX_AGE +
      "; samesite=lax";
  } catch (e) {
    /* storage may be unavailable; the visitor is simply asked again */
  }
}
