import { describe, expect, it } from "vitest";
import { VINO_FALLBACK_URL, parseOrigin, vinoHostRedirects } from "./brand-env.mjs";

/**
 * The redirect that retires cardon-vino.vercel.app once the wine brand has its
 * own domain (bead hq-60dkt). Next matches `has` host values as a regular
 * expression over the whole host, so the test does the same.
 */
const matches = (value: string, host: string) => new RegExp("^" + value + "$").test(host);

describe("vinoHostRedirects", () => {
  it("sends every path on the Vercel address to the same path on the domain", () => {
    const [r, ...rest] = vinoHostRedirects("vino", parseOrigin("https://vino.example"));
    expect(rest).toEqual([]);
    expect(r).toEqual({
      source: "/:path*",
      has: [{ type: "host", value: "cardon-vino\\.vercel\\.app" }],
      destination: "https://vino.example/:path*",
      permanent: true,
    });
    expect(matches(r.has[0].value, new URL(VINO_FALLBACK_URL).hostname)).toBe(true);
  });

  it("leaves a preview deployment's address and the domain itself alone", () => {
    const [r] = vinoHostRedirects("vino", "https://vino.example");
    for (const host of [
      "cardon-vino-git-main-hackesmits-projects.vercel.app",
      "cardon-vino-abc123-hackesmits-projects.vercel.app",
      "cardon-vinoXvercel.app",
      "vino.example",
      "evilcardon-vino.vercel.app",
    ]) {
      expect(matches(r.has[0].value, host), host).toBe(false);
    }
  });

  it("does nothing while the brand has no domain, on a vercel.app origin, or on cardon", () => {
    expect(vinoHostRedirects("vino", "")).toEqual([]);
    expect(vinoHostRedirects("vino", parseOrigin("https://cardon-vino.vercel.app"))).toEqual([]);
    expect(vinoHostRedirects("vino", parseOrigin("http://vino.example"))).toEqual([]);
    expect(vinoHostRedirects("cardon", "https://vino.example")).toEqual([]);
  });
});
