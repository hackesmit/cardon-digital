/**
 * A small fixed window rate limiter held in module memory.
 *
 * Deliberately not a shared store. The site runs on serverless instances, so
 * this counts per instance and a determined flood spread across cold starts
 * gets more than the nominal quota. That is the right trade at this volume:
 * it stops the ordinary case, a stuck retry loop or a single script hammering
 * the form, without adding a database to a contact form. If the site ever
 * needs a real ceiling, the shape of this module is what a shared store would
 * replace.
 */

export type RateLimitVerdict = {
  allowed: boolean;
  /** Seconds until the window resets, for the Retry-After header. */
  retryAfter: number;
};

/** Submissions allowed from one address inside one window. */
export const RATE_LIMIT_MAX = 5;

/** Window length in milliseconds. */
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/** Stops the map from growing without bound on a long lived instance. */
const MAX_TRACKED_KEYS = 5000;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function sweep(now: number): void {
  const expired: string[] = [];
  buckets.forEach((bucket, key) => {
    if (bucket.resetAt <= now) expired.push(key);
  });
  expired.forEach((key) => buckets.delete(key));
}

/**
 * Counts one hit against a key and says whether it is allowed. The key is
 * whatever the caller can identify a client by, normally an IP address.
 */
export function hit(
  key: string,
  now = Date.now(),
  max = RATE_LIMIT_MAX,
  windowMs = RATE_LIMIT_WINDOW_MS,
): RateLimitVerdict {
  if (buckets.size > MAX_TRACKED_KEYS) sweep(now);

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  current.count += 1;
  if (current.count > max) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfter: 0 };
}

/** Test and development helper: forgets every window. */
export function reset(): void {
  buckets.clear();
}

/**
 * Best guess at the client address.
 *
 * The key is bound to the Vercel header first: on Vercel the edge network
 * writes x-vercel-forwarded-for itself, per request, with the address it saw,
 * so it is the one value here that a caller cannot choose. Anywhere else it
 * is absent and the fallback is the LAST entry of x-forwarded-for, which is
 * the hop nearest to this server, the entry a proxy in front of us appended.
 * The first entry, which this used to read, is simply whatever the caller
 * wrote, so rotating that header walked straight past this limiter.
 *
 * A direct caller with no proxy in front of it can still forge the whole
 * header. Nothing readable from a Request object fixes that; a self-host
 * would have to take the key from the connection instead.
 */
export function clientKey(headers: Headers): string {
  // Written by the platform, not by the caller. This is the trusted path.
  const vercel = firstEntry(headers.get("x-vercel-forwarded-for"));
  if (vercel) return vercel;

  // Nearest hop, not the caller's own first entry. See the note above.
  const nearestHop = lastEntry(headers.get("x-forwarded-for"));
  if (nearestHop) return nearestHop;

  return headers.get("x-real-ip")?.trim() || "unknown";
}

function entries(raw: string | null): string[] {
  return (raw ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function firstEntry(raw: string | null): string {
  return entries(raw)[0] ?? "";
}

function lastEntry(raw: string | null): string {
  const all = entries(raw);
  return all.length > 0 ? all[all.length - 1] : "";
}
