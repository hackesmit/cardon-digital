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
    (path) => {
      const entry = RETIRED_ROUTES[path];

      for (const locale of locales) {
        expect(landing(middleware(request(localePath(locale, path))))).toEqual({
          status: entry.status,
          path: localePath(locale, entry.to),
        });
      }

      // No prefix at all: the cookie is a choice and wins, the geo header
      // decides when there is none, and the redirect is still a single hop
      // rather than a bounce through the locale rule.
      expect(landing(middleware(request(path, { cookie: "en" })))).toEqual({
        status: entry.status,
        path: localePath("en", entry.to),
      });
      expect(landing(middleware(request(path, { country: "US" })))).toEqual({
        status: entry.status,
        path: localePath("en", entry.to),
      });
      expect(landing(middleware(request(path, { country: "MX" })))).toEqual({
        status: entry.status,
        path: localePath("es", entry.to),
      });
      expect(landing(middleware(request(path)))).toEqual({
        status: entry.status,
        path: localePath("es", entry.to),
      });

      // A chosen language beats the country it is read from.
      expect(
        landing(middleware(request(path, { cookie: "es", country: "US" }))),
      ).toEqual({ status: entry.status, path: localePath("es", entry.to) });
    },
  );

  it.each(retiredPaths)(
    "%s lands with the trailing slash on too",
    (path) => {
      const entry = RETIRED_ROUTES[path];
      expect(
        landing(middleware(request(localePath("es", path) + "/"))),
      ).toEqual({ status: entry.status, path: localePath("es", entry.to) });
    },
  );

  it("carries the query string across, so a campaign parameter survives", () => {
    const res = middleware(
      new NextRequest(ORIGIN + "/es/modulos?utm_source=ads&utm_campaign=valle"),
    );
    const url = new URL(res.headers.get("location")!);
    expect(url.pathname).toBe("/es/precios");
    expect(url.search).toBe("?utm_source=ads&utm_campaign=valle");
  });

  it("sends nobody from one retired path to another", () => {
    for (const path of retiredPaths) {
      const entry = RETIRED_ROUTES[path];
      expect(retiredRoute(entry.to)).toBeUndefined();
      // And the hop it makes is final: the target, fed back in, redirects
      // nowhere.
      const res = middleware(request(localePath("es", entry.to)));
      expect(res.headers.get("location")).toBeNull();
    }
  });

  it("answers a retired path before the pre-launch gate rewrites it", () => {
    const previous = process.env.COMING_SOON;
    process.env.COMING_SOON = "1";
    try {
      const res = middleware(request(localePath("es", "/modulos")));
      expect(landing(res)).toEqual({ status: 308, path: localePath("es", "/precios") });
    } finally {
      if (previous === undefined) delete process.env.COMING_SOON;
      else process.env.COMING_SOON = previous;
    }
  });
});

describe("middleware: the locale rule the retired paths sit in front of", () => {
  it("still prefixes an ordinary path", () => {
    const { status, path } = landing(middleware(request("/precios", { country: "US" })));
    expect(status).toBe(307);
    expect(path).toBe(localePath("en", "/precios"));
  });

  it("leaves a prefixed path alone", () => {
    expect(middleware(request(localePath("en", "/precios"))).headers.get("location")).toBeNull();
  });
});
