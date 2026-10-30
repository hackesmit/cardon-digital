import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";
import { localePath, locales } from "@/lib/i18n/config";
import { RETIRED_ROUTES, retiredPaths, retiredRoute } from "@/lib/routes";

/**
 * The retired routes (bead hq-4pu0q.8). /modulos is gone and every address it
 * answered on has to land somewhere real, in one hop, in the visitor's own
 * language. These tests run the middleware itself rather than reading its
 * source, so the status, the target and the locale are all measured.
 *
 * The pre-launch gate is not exercised here: COMING_SOON is read per call and
 * the retired paths are answered before it, which the last case pins.
 */

const ORIGIN = "https://cardondigital.com";

function request(
  path: string,
  init: { cookie?: string; country?: string } = {},
) {
  const headers = new Headers();
  if (init.cookie) headers.set("cookie", `cardon-locale=${init.cookie}`);
  if (init.country) headers.set("x-vercel-ip-country", init.country);
  return new NextRequest(ORIGIN + path, { headers });
}

function landing(res: Response) {
  const location = res.headers.get("location");
  return { status: res.status, path: location ? new URL(location).pathname : null };
}

describe("middleware: retired routes", () => {
  it.each(retiredPaths)(
    "%s answers on every locale prefix and on none",
    async (path) => {
      const entry = RETIRED_ROUTES[path];

      for (const locale of locales) {
        expect(landing(await middleware(request(localePath(locale, path))))).toEqual({
          status: entry.status,
          path: localePath(locale, entry.to),
        });
      }

      // No prefix at all: the cookie is a choice and wins, the geo header
      // decides when there is none, and the redirect is still a single hop
      // rather than a bounce through the locale rule.
      expect(landing(await middleware(request(path, { cookie: "en" })))).toEqual({
        status: entry.status,
        path: localePath("en", entry.to),
      });
      expect(landing(await middleware(request(path, { country: "US" })))).toEqual({
        status: entry.status,
        path: localePath("en", entry.to),
      });
      expect(landing(await middleware(request(path, { country: "MX" })))).toEqual({
        status: entry.status,
        path: localePath("es", entry.to),
      });
      expect(landing(await middleware(request(path)))).toEqual({
        status: entry.status,
        path: localePath("es", entry.to),
      });

      // A chosen language beats the country it is read from.
      expect(
        landing(await middleware(request(path, { cookie: "es", country: "US" }))),
      ).toEqual({ status: entry.status, path: localePath("es", entry.to) });
    },
  );

  it.each(retiredPaths)(
    "%s lands with the trailing slash on too",
    async (path) => {
      const entry = RETIRED_ROUTES[path];
      expect(
        landing(await middleware(request(localePath("es", path) + "/"))),
      ).toEqual({ status: entry.status, path: localePath("es", entry.to) });
    },
  );

  it("carries the query string across, so a campaign parameter survives", async () => {
    const res = await middleware(
      new NextRequest(ORIGIN + "/es/modulos?utm_source=ads&utm_campaign=valle"),
    );
    const url = new URL(res.headers.get("location")!);
    expect(url.pathname).toBe("/es/precios");
    expect(url.search).toBe("?utm_source=ads&utm_campaign=valle");
  });

  it("sends nobody from one retired path to another", async () => {
    for (const path of retiredPaths) {
      const entry = RETIRED_ROUTES[path];
      expect(retiredRoute(entry.to)).toBeUndefined();
      // And the hop it makes is final: the target, fed back in, redirects
      // nowhere.
      const res = await middleware(request(localePath("es", entry.to)));
      expect(res.headers.get("location")).toBeNull();
    }
  });

  it("answers a retired path before the pre-launch gate rewrites it", async () => {
    const previous = process.env.COMING_SOON;
    process.env.COMING_SOON = "1";
    try {
      const res = await middleware(request(localePath("es", "/modulos")));
      expect(landing(res)).toEqual({ status: 308, path: localePath("es", "/precios") });
    } finally {
      if (previous === undefined) delete process.env.COMING_SOON;
      else process.env.COMING_SOON = previous;
    }
  });
});

describe("middleware: the locale rule the retired paths sit in front of", () => {
  it("still prefixes an ordinary path", async () => {
    const { status, path } = landing(await middleware(request("/precios", { country: "US" })));
    expect(status).toBe(307);
    expect(path).toBe(localePath("en", "/precios"));
  });

  it("leaves a prefixed path alone", async () => {
    expect((await middleware(request(localePath("en", "/precios")))).headers.get("location")).toBeNull();
  });
});

/**
 * The Content-Security-Policy (bead hq-fnhrj.6). Next finds the nonce in the
 * forwarded request header, so the tests read both sides: what the browser is
 * sent and what the render sees. Middleware passes request overrides to Next
 * as x-middleware-request-* response headers.
 */
describe("middleware: content security policy", () => {
  const REPORT_ONLY = "content-security-policy-report-only";

  function nonceOf(csp: string | null) {
    return csp?.match(/'nonce-([^']+)'/)?.[1] ?? null;
  }

  it("puts a policy with a fresh nonce on the page and on the request", async () => {
    const a = await middleware(request(localePath("es", "/precios")));
    const b = await middleware(request(localePath("es", "/precios")));
    const csp = a.headers.get(REPORT_ONLY);
    expect(csp).toBeTruthy();
    expect(a.headers.get("x-middleware-request-" + REPORT_ONLY)).toBe(csp);
    expect(nonceOf(csp)).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(nonceOf(b.headers.get(REPORT_ONLY))).not.toBe(nonceOf(csp));
  });

  it("allows the inline scripts the site writes by their hash", async () => {
    const csp = (await middleware(request(localePath("en", "/")))).headers.get(REPORT_ONLY)!;
    const { createHash } = await import("node:crypto");
    const { inlineScripts } = await import("@/lib/security/csp");
    for (const script of inlineScripts()) {
      const hash = createHash("sha256").update(script, "utf8").digest("base64");
      expect(csp).toContain("'sha256-" + hash + "'");
    }
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).not.toContain("'unsafe-inline' 'nonce");
    expect(csp).not.toContain("strict-dynamic");
    expect(csp).not.toContain("upgrade-insecure-requests");
    expect(csp).toContain("https://www.googletagmanager.com");
  });

  it("enforces, with upgrade-insecure-requests, when CSP_ENFORCE=1", async () => {
    const previous = process.env.CSP_ENFORCE;
    process.env.CSP_ENFORCE = "1";
    try {
      const res = await middleware(request(localePath("es", "/")));
      expect(res.headers.get(REPORT_ONLY)).toBeNull();
      expect(res.headers.get("content-security-policy")).toContain("upgrade-insecure-requests");
      expect(res.headers.get("x-middleware-request-content-security-policy")).toBeTruthy();
    } finally {
      if (previous === undefined) delete process.env.CSP_ENFORCE;
      else process.env.CSP_ENFORCE = previous;
    }
  });

  it("carries the policy through the pre-launch rewrite", async () => {
    const previous = process.env.COMING_SOON;
    process.env.COMING_SOON = "1";
    try {
      const res = await middleware(request(localePath("es", "/precios")));
      expect(res.headers.get("x-middleware-rewrite")).toContain("/es/coming-soon");
      expect(nonceOf(res.headers.get(REPORT_ONLY))).toBeTruthy();
      expect(res.headers.get("x-middleware-request-" + REPORT_ONLY)).toBe(res.headers.get(REPORT_ONLY));
    } finally {
      if (previous === undefined) delete process.env.COMING_SOON;
      else process.env.COMING_SOON = previous;
    }
  });

  it("lets the Vercel Toolbar load on a preview, and only there", async () => {
    const previous = process.env.VERCEL_ENV;
    try {
      process.env.VERCEL_ENV = "production";
      const prod = (await middleware(request(localePath("es", "/")))).headers.get(REPORT_ONLY)!;
      expect(prod).not.toContain("vercel.live");
      process.env.VERCEL_ENV = "preview";
      const preview = (await middleware(request(localePath("es", "/")))).headers.get(REPORT_ONLY)!;
      expect(preview).toMatch(/script-src [^;]*https:\/\/vercel\.live/);
      expect(preview).toMatch(/frame-src [^;]*https:\/\/vercel\.live/);
      expect(preview).toMatch(/connect-src [^;]*wss:\/\/ws-us3\.pusher\.com/);
    } finally {
      if (previous === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = previous;
    }
  });

  it("leaves redirects without a policy", async () => {
    const res = await middleware(request("/precios", { country: "MX" }));
    expect(res.status).toBe(307);
    expect(res.headers.get(REPORT_ONLY)).toBeNull();
  });
});
