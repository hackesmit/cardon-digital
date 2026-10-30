import { bootstrapScript } from "@/lib/analytics/gtag";
import { modeScript } from "@/lib/site/modeScript";

/**
 * The Content-Security-Policy for every page (bead hq-fnhrj.6, site-baseline
 * checklist T7). The middleware builds it per request with a fresh nonce.
 *
 * Three kinds of inline script reach a page, and each is allowed its own way:
 *   - Next's own inline scripts (the RSC flight data) carry the nonce: Next
 *     reads it from the CSP request header the middleware forwards and stamps
 *     it on every script it writes. That only works on a page rendered per
 *     request, which is why the root layout is force-dynamic.
 *   - The pre-paint mode script and the gtag bootstrap are fixed strings, so
 *     they are allowed by hash. A hash also covers the bootstrap when the
 *     consent banner injects it during the visit, where no nonce would be.
 *   - JSON-LD is a data block (type application/ld+json) and never runs, so CSP
 *     does not apply to it.
 *
 * There is no 'strict-dynamic': it would switch off 'self' and the host list,
 * and the gtag loader (rendered for a visitor who already consented, or
 * injected by the banner) carries no nonce. The Google hosts are the ones
 * Google lists for GA4 and Ads conversions at
 * developers.google.com/tag-platform/security/guides/csp, with google.com.mx
 * spelled out because CSP has no wildcard for a top-level domain.
 *
 * On a Vercel preview the Vercel Toolbar loads from vercel.live (comments and
 * the share button), so the preview policy adds the hosts Vercel lists for it
 * at vercel.com/docs/vercel-toolbar/managing-toolbar ("Using a Content
 * Security Policy").
 * Production never gets them.
 *
 * The policy ships as Report-Only (violations are logged, nothing is blocked)
 * until CSP_ENFORCE=1 is set on the Vercel environment.
 */

const GOOGLE_SCRIPT = [
  "https://www.googletagmanager.com",
  "https://www.googleadservices.com",
  "https://www.google.com",
];

const GOOGLE_CONNECT = [
  "https://www.googletagmanager.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.google.com",
  "https://www.google.com.mx",
  "https://*.g.doubleclick.net",
  "https://ad.doubleclick.net",
  "https://pagead2.googlesyndication.com",
  "https://www.googleadservices.com",
];

/** The fixed inline scripts the site writes itself, allowed by hash. */
export function inlineScripts(): string[] {
  return [modeScript, bootstrapScript()];
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  let binary = "";
  for (const byte of new Uint8Array(digest)) binary += String.fromCharCode(byte);
  return "'sha256-" + btoa(binary) + "'";
}

let hashes: Promise<string[]> | null = null;

/** CSP source expressions for inlineScripts(), computed once per instance. */
export function inlineHashes(): Promise<string[]> {
  hashes ??= Promise.all(inlineScripts().map(sha256));
  return hashes;
}

/** A fresh, unguessable nonce: 128 random bits, base64. */
export function newNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

const TOOLBAR = "https://vercel.live";

export type CspOptions = {
  nonce: string;
  hashes: string[];
  /** next dev needs eval for React Refresh; never set in a build. */
  dev?: boolean;
  /** A Vercel preview deployment, which carries the Vercel Toolbar. */
  preview?: boolean;
  enforce?: boolean;
};

export function buildCsp({
  nonce,
  hashes,
  dev = false,
  preview = false,
  enforce = false,
}: CspOptions): string {
  const toolbar = (...extra: string[]) => (preview ? [TOOLBAR, ...extra] : []);
  const directives: [string, string[]][] = [
    ["default-src", ["'self'"]],
    [
      "script-src",
      [
        "'self'",
        "'nonce-" + nonce + "'",
        ...hashes,
        ...GOOGLE_SCRIPT,
        ...toolbar(),
        ...(dev ? ["'unsafe-eval'"] : []),
      ],
    ],
    // Next, next/font and the motion code write inline styles.
    ["style-src", ["'self'", "'unsafe-inline'", ...toolbar()]],
    ["img-src", ["'self'", "data:", "blob:", "https:"]],
    ["font-src", ["'self'", "data:", ...toolbar("https://assets.vercel.com")]],
    ["media-src", ["'self'"]],
    [
      "connect-src",
      ["'self'", ...GOOGLE_CONNECT, ...toolbar("wss://ws-us3.pusher.com"), ...(dev ? ["ws:"] : [])],
    ],
    ["frame-src", ["'self'", "https://www.googletagmanager.com", ...toolbar()]],
    ["frame-ancestors", ["'none'"]],
    ["object-src", ["'none'"]],
    ["base-uri", ["'self'"]],
    ["form-action", ["'self'"]],
    // Browsers ignore this in a Report-Only policy and log a warning for it.
    ...(enforce ? ([["upgrade-insecure-requests", []]] as [string, string[]][]) : []),
  ];
  return directives.map(([k, v]) => (v.length ? k + " " + v.join(" ") : k)).join("; ");
}

/** The header name: Report-Only until CSP_ENFORCE=1. */
export function cspHeaderName(): string {
  return process.env.CSP_ENFORCE === "1"
    ? "Content-Security-Policy"
    : "Content-Security-Policy-Report-Only";
}
