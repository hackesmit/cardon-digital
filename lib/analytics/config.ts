/**
 * Measurement identifiers, all of them from the environment.
 *
 * Every id is read as a literal process.env.NEXT_PUBLIC_* member so Next can
 * inline it at build time; a computed lookup would arrive as undefined in the
 * browser bundle. Nothing here has a fallback value on purpose: an unset id
 * means the site measures nothing, which is the correct state for a preview
 * deployment and for production until Daniel runs the LAUNCH.md steps.
 */

/** GA4 measurement id, of the form G-XXXXXXXXXX. */
export const GA4_ID = (process.env.NEXT_PUBLIC_GA4_ID ?? "").trim();

/** Google Ads conversion id, of the form AW-XXXXXXXXX. */
export const ADS_ID = (process.env.NEXT_PUBLIC_ADS_ID ?? "").trim();

/** The three conversions the Ads account counts. */
export type ConversionKind = "contact" | "whatsapp" | "booking";

/**
 * Conversion labels, the second half of an Ads send_to value. Google issues one
 * per conversion action, so they are separate env vars rather than a parsed
 * list: a typo in one label then breaks one conversion instead of all three.
 */
export const ADS_LABELS: Record<ConversionKind, string> = {
  contact: (process.env.NEXT_PUBLIC_ADS_LABEL_CONTACT ?? "").trim(),
  whatsapp: (process.env.NEXT_PUBLIC_ADS_LABEL_WHATSAPP ?? "").trim(),
  booking: (process.env.NEXT_PUBLIC_ADS_LABEL_BOOKING ?? "").trim(),
};

/**
 * The id the gtag loader is fetched with. GA4 leads when both are present; a
 * property configured after load still reports, so one loader serves both.
 */
export function loaderId(): string {
  return GA4_ID || ADS_ID;
}

/**
 * True when there is anything at all to measure. When this is false the site
 * loads no tag, shows no consent banner and sets no consent cookie, so the
 * privacy policy's promise of no third-party analytics stays literally true.
 */
export function measurementConfigured(): boolean {
  return loaderId() !== "";
}

/** The Ads send_to for one conversion, or null when it is not configured. */
export function sendTo(kind: ConversionKind): string | null {
  const label = ADS_LABELS[kind];
  if (!ADS_ID || !label) return null;
  return ADS_ID + "/" + label;
}
