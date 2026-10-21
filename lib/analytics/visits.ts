import type { BeforeSendEvent } from "@vercel/analytics/next";

/**
 * What Vercel Web Analytics is told about a visit.
 *
 * It counts without cookies and without consent, so the one thing it receives
 * from this site, the page address, is cut to what the count needs: the path
 * and the utm_ marks that say which campaign or answer engine sent the visit.
 * Any other parameter and the fragment are dropped in the browser, because a
 * link can carry anything (an email, a name) and none of it is ours to send.
 */
export function visitUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const kept = new URLSearchParams();
  url.searchParams.forEach((value, key) => {
    if (key.startsWith("utm_")) kept.append(key, value);
  });
  const query = kept.toString();
  return url.origin + url.pathname + (query ? "?" + query : "");
}

/** The beforeSend hook: the same event with the cut address, or nothing. */
export function visitEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = visitUrl(event.url);
  return url ? { ...event, url } : null;
}
