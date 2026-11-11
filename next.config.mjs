import { brandIndexable, parseBrand, parseOrigin } from "./lib/brand-env.mjs";

/* The brand switch (lib/brand.ts, docs/BRANDS.md). parseBrand throws on any
   value other than cardon, vino or unset, so the build fails before a page is
   compiled. A wine-brand build with no domain of its own yet is noindex on
   every response, files included (robots.txt, sitemap.xml, llms.txt). */
const BRAND = parseBrand(process.env.NEXT_PUBLIC_SITE);
const INDEXABLE = brandIndexable(BRAND, parseOrigin(process.env.NEXT_PUBLIC_SITE_URL));

/**
 * Static security headers for every response (bead hq-fnhrj.6, site-baseline
 * checklist T6, T8, T21). The Content-Security-Policy is not here: it needs a
 * fresh nonce per request, so middleware.ts sets it on the pages.
 *
 * HSTS adds includeSubDomains to the two years Vercel already sends. The only
 * names under cardondigital.com are the apex and www (certificate transparency
 * and DNS, 2026-10-29), both served over https by Vercel. Add "; preload" only
 * after submitting the domain at hstspreload.org.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site uses none of these features. Remove an entry only when it does.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  // Legacy fallback for the CSP's frame-ancestors 'none'.
  { key: "X-Frame-Options", value: "DENY" },
];

/**
 * A wine build answers Cardon's root art paths with its own art (bead
 * hq-3f6ut.8, lib/brand-art.ts), so an old link or a browser's default
 * /favicon.ico request never shows Cardon's card or saguaro there. Pages link
 * the wine art by its own path; these only catch the root defaults.
 */
export const VINO_ART_REWRITES = [
  { source: "/og.png", destination: "/brand-art/og.png" },
  { source: "/icon.svg", destination: "/brand-art/icon-192.png" },
  { source: "/favicon.ico", destination: "/brand-art/icon-48.png" },
  { source: "/apple-icon.png", destination: "/brand-art/apple-icon.png" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    const headers = [...securityHeaders];
    // A preview deployment must never be indexed in place of the real domain,
    // and neither may the wine brand before it has one.
    if (process.env.VERCEL_ENV === "preview" || !INDEXABLE) {
      headers.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });
    }
    return [
      { source: "/:path*", headers },
      // A vercel.app address is never the canonical site, whatever the
      // environment and the configured domain say, files included
      // (cross-vendor review round 1).
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?:.+\\.)?vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async rewrites() {
    // beforeFiles: checked ahead of public/, which still holds Cardon's files.
    return { beforeFiles: BRAND === "vino" ? VINO_ART_REWRITES : [] };
  },
  async redirects() {
    // RFC 9116 section 3: the legacy top-level location points at the real one.
    return [{ source: "/security.txt", destination: "/.well-known/security.txt", permanent: true }];
  },
};

export default nextConfig;
