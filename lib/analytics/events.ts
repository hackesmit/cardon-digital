import { sendTo, measurementConfigured, type ConversionKind } from "./config";
import { readConsent } from "./consent";
import { gtag } from "./gtag";

/** GA4 event names, one per conversion, plus the method that produced it. */
const EVENT_NAME: Record<ConversionKind, string> = {
  contact: "contact_submit",
  whatsapp: "whatsapp_click",
  booking: "booking_click",
};

type Params = Record<string, string | number | boolean>;

/**
 * Development logging. A conversion is invisible by design in production, so a
 * local run needs some way to see that the wiring reaches the right element.
 * The line says whether the event was sent and, when it was not, why.
 */
function log(kind: ConversionKind, sent: boolean, reason: string, params: Params): void {
  if (process.env.NODE_ENV === "production") return;
  // eslint-disable-next-line no-console
  console.info("[analytics] " + EVENT_NAME[kind], { sent, reason, ...params });
}

/**
 * Reports one conversion to GA4 and, when a label is configured, to Google Ads.
 *
 * Every guard is checked here rather than at the call sites, so a component can
 * call this unconditionally: no ids, no consent cookie, or a declined cookie all
 * end in a silent no-op.
 */
export function trackConversion(kind: ConversionKind, params: Params = {}): void {
  if (!measurementConfigured()) {
    log(kind, false, "no measurement id configured", params);
    return;
  }
  if (readConsent() !== "granted") {
    log(kind, false, "consent not granted", params);
    return;
  }
  const send = gtag();
  if (!send) {
    log(kind, false, "gtag not loaded yet", params);
    return;
  }

  send("event", EVENT_NAME[kind], params);

  const target = sendTo(kind);
  if (target) send("event", "conversion", { send_to: target, ...params });

  log(kind, true, target ? "ga4 and ads" : "ga4 only", params);
}

/** The contact form was submitted, or a contact address was opened. */
export function trackContactSubmit(method: "form" | "email" = "form"): void {
  trackConversion("contact", { method });
}

/** A WhatsApp link was clicked. */
export function trackWhatsAppClick(): void {
  trackConversion("whatsapp");
}

/** A booking link was clicked. */
export function trackBookingClick(): void {
  trackConversion("booking");
}
