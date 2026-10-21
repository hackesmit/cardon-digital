import type { BeforeSendEvent } from "@vercel/analytics/next";

/**
 * What Vercel Web Analytics is told about a visit.
 *
 * It counts without cookies and without consent, so the one thing it receives
 * from this site, the page address, is cut to what the count needs: the path
 * and the three utm marks that say which campaign or answer engine sent the visit,
 * each kept only when it is a plain token.
 * Any other parameter and the fragment are dropped in the browser, because a
 * link can carry anything (an email, a name) and none of it is ours to send.
 */
const KEPT_MARKS = ["utm_source", "utm_medium", "utm_campaign"] as const;

/**
 * A campaign mark is a short token such as chatgpt.com, cpc or web-ensenada.
 * Anything else is dropped whole rather than cleaned: an address with an @ in
 * it, a value with spaces, or one carrying a run of digits long enough to be a
 * phone number is somebody's data, whatever key it arrived under.
 */
function isPlainMark(value: string): boolean {
  if (!/^[a-z0-9][a-z0-9._-]{0,59}$/i.test(value)) return false;
  return (value.match(/[0-9]/g) ?? []).length < 7;
}

export function visitUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const kept = new URLSearchParams();
  for (const key of KEPT_MARKS) {
    const value = url.searchParams.get(key);
    if (value !== null && isPlainMark(value)) kept.set(key, value);
  }
  const query = kept.toString();
  return url.origin + url.pathname + (query ? "?" + query : "");
}

/** The beforeSend hook: the same event with the cut address, or nothing. */
export function visitEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = visitUrl(event.url);
  return url ? { ...event, url } : null;
}
