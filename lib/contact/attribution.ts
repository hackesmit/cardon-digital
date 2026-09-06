/**
 * Reading the source a lead arrived from, on the client.
 *
 * The ads plan (google-ads-plan.md section 6.6) keeps a first touch record in
 * a first-party cd_src entry so a WhatsApp message or a form submission can be
 * tied back to the campaign that paid for it. This module is the read half:
 * it reports what is already stored, filling gaps from the current URL.
 *
 * It deliberately writes nothing. Persisting a first touch has to happen on
 * every landing page, which means the site shell, and the privacy notice has
 * to describe the entry before it exists. Both files belong to other work, so
 * the writer ships with them and this reader is ready for it: the moment a
 * cd_src entry exists, these fields start arriving filled.
 */

export type Attribution = {
  cd_lead_id: string;
  cd_gclid: string;
  cd_lane: string;
  cd_campaign: string;
  cd_landing: string;
  cd_first_seen: string;
};

/** The cookie and localStorage key the first touch record lives under. */
export const SOURCE_KEY = "cd_src";

export const EMPTY_ATTRIBUTION: Attribution = {
  cd_lead_id: "",
  cd_gclid: "",
  cd_lane: "",
  cd_campaign: "",
  cd_landing: "",
  cd_first_seen: "",
};

type StoredSource = {
  lead_id?: unknown;
  gclid?: unknown;
  cd_lane?: unknown;
  utm_campaign?: unknown;
  landing?: unknown;
  first_seen?: unknown;
};

function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  // Whatever wrote the entry, nothing longer or stranger than this reaches the
  // form: the server holds these to the same rules again.
  return value.trim().replace(/[^\w.@:/?&=+-]/g, "").slice(0, 200);
}

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(name + "="));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function readStored(): StoredSource {
  const sources: string[] = [];
  try {
    const stored = window.localStorage.getItem(SOURCE_KEY);
    if (stored) sources.push(stored);
  } catch {
    // Private browsing can refuse localStorage. The cookie still answers.
  }
  const cookie = readCookie(SOURCE_KEY);
  if (cookie) sources.push(cookie);

  for (const source of sources) {
    try {
      const parsed = JSON.parse(source) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as StoredSource;
      }
    } catch {
      // A corrupt entry is treated as no entry.
    }
  }
  return {};
}

/**
 * The six hidden fields, from the stored first touch where there is one and
 * from the current URL where there is not. The stored record wins on every
 * field it holds, because first touch is what the ads plan reports on.
 */
export function readAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY_ATTRIBUTION;

  const stored = readStored();
  const params = new URLSearchParams(window.location.search);
  const fromUrl = (name: string) => clean(params.get(name));

  return {
    cd_lead_id: clean(stored.lead_id),
    cd_gclid: clean(stored.gclid) || fromUrl("gclid"),
    cd_lane: clean(stored.cd_lane) || fromUrl("cd_lane"),
    cd_campaign: clean(stored.utm_campaign) || fromUrl("utm_campaign"),
    cd_landing: clean(stored.landing) || window.location.pathname,
    cd_first_seen: clean(stored.first_seen),
  };
}

/** The human-visible half of a lead id, for the WhatsApp prefill. */
export function shortLeadId(leadId: string): string {
  return leadId.slice(0, 8);
}
