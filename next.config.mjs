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
    return [{ source: "/:path*", headers }];
  },
  async redirects() {
    // RFC 9116 section 3: the legacy top-level location points at the real one.
    return [{ source: "/security.txt", destination: "/.well-known/security.txt", permanent: true }];
  },
};

export default nextConfig;
