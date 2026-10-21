import type { BeforeSendEvent } from "@vercel/analytics/next";

/**
 * What Vercel Web Analytics is told about a visit.
 *
 * It counts without cookies and without consent, so the one thing it receives
 * from this site, the page address, is cut to what the count needs: the path
 * and the utm source and medium that say which answer engine or channel sent
 * the visit, each kept only when it is a word from the lists below.
 * Any other parameter and the fragment are dropped in the browser, because a
 * link can carry anything (an email, a name) and none of it is ours to send.
 */
/**
 * The marks the count keeps, each from a closed vocabulary: a value outside the
 * list is dropped whole. A link can put anything under a utm key (a name, a
 * customer number), so shape checks are not enough; only words we chose can
 * leave the browser. utm_campaign is never kept, because campaign names are
 * free text and the ads report already has its own record of them.
 */
const SOURCES = new Set([
  "chatgpt.com", "chat.openai.com", "openai", "perplexity", "perplexity.ai", "gemini",
  "gemini.google.com", "copilot", "copilot.microsoft.com", "claude", "claude.ai",
  "google", "bing", "facebook", "instagram", "whatsapp", "linkedin", "newsletter",
]);
const MEDIUMS = new Set(["cpc", "organic", "social", "email", "referral", "paid", "display"]);
const KEPT_MARKS: [string, Set<string>][] = [
  ["utm_source", SOURCES],
  ["utm_medium", MEDIUMS],
];

export function visitUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const kept = new URLSearchParams();
  for (const [key, allowed] of KEPT_MARKS) {
    const value = url.searchParams.get(key)?.trim().toLowerCase();
    if (value && allowed.has(value)) kept.set(key, value);
  }
  const query = kept.toString();
  return url.origin + url.pathname + (query ? "?" + query : "");
}

/** The beforeSend hook: the same event with the cut address, or nothing. */
export function visitEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = visitUrl(event.url);
  return url ? { ...event, url } : null;
}
