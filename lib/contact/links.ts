/**
 * The two click-out doors: WhatsApp and the booking page.
 *
 * Both read their target from the environment, so a value that is missing or
 * malformed produces an empty href and the button that would carry it is not
 * rendered at all. A dead door is worse than no door.
 */

import { shortLeadId, type Attribution } from "./attribution";

/**
 * Ad group lane to the token that appears in the WhatsApp text.
 *
 * A Map, not an object literal, because the lane arrives from the URL and an
 * object literal answers for every name on Object.prototype: cd_lane=
 * constructor would otherwise put "[function Object() { [native code] }]" in
 * the prefill a prospect sends us. A Map only answers for lanes we put in it,
 * and an unknown lane leaves the prefill alone.
 */
const LANE_TOKENS = new Map<string, string>([
  ["vin-sistemas", "VIN-A1"],
  ["vin-marketing", "VIN-A2"],
  ["ens-servicios", "ENS-B1"],
]);

/** wa.me wants digits only: no plus, no spaces, no punctuation. */
export function whatsappNumber(raw: string | undefined): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  // Country code plus a national number. Anything shorter is a typo.
  return digits.length >= 10 && digits.length <= 15 ? digits : "";
}

/**
 * The prefilled message, with the lane token and the short lead id appended
 * when the visit carries them, so a reply can be traced to its campaign.
 */
export function whatsappText(base: string, attribution: Attribution): string {
  const token = LANE_TOKENS.get(attribution.cd_lane) ?? "";
  const short = shortLeadId(attribution.cd_lead_id);
  const marks = [token, short].filter(Boolean);
  return marks.length > 0 ? base + " [" + marks.join(" ") + "]" : base;
}

/** Empty when there is no usable number, which hides the button. */
export function whatsappHref(
  raw: string | undefined,
  text: string,
): string {
  const number = whatsappNumber(raw);
  if (!number) return "";
  return "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
}

/**
 * The booking link, carrying the full lead id. Empty when the environment has
 * no booking URL yet, or when the value is not an ordinary https address.
 */
export function bookingHref(
  raw: string | undefined,
  attribution: Attribution,
): string {
  const value = (raw ?? "").trim();
  if (!value) return "";
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "";
  }
  if (url.protocol !== "https:") return "";
  if (attribution.cd_lead_id) {
    url.searchParams.set("cd_lead_id", attribution.cd_lead_id);
  }
  return url.toString();
}
