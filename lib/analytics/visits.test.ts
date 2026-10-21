import { describe, expect, it } from "vitest";
import { visitEvent, visitUrl } from "./visits";

/**
 * Cookieless visit counting (bead hq-i4b5.18).
 *
 * Vercel Web Analytics counts every visit, consent or not, because it sets no
 * cookie and keeps nothing that identifies the visitor. What it does receive
 * is the address of the page, so the address is cut down before it leaves the
 * browser: the path stays, the utm_ marks stay (ChatGPT tags its links with
 * utm_source=chatgpt.com, which is the AEO measurement), and anything else a
 * link could carry, an email in a query string or a fragment, never goes.
 */

describe("visitUrl", () => {
  it("keeps the path and the utm marks", () => {
    expect(visitUrl("https://cardondigital.com/es/precios?utm_source=chatgpt.com")).toBe(
      "https://cardondigital.com/es/precios?utm_source=chatgpt.com",
    );
    expect(
      visitUrl("https://cardondigital.com/en?utm_source=g&utm_medium=cpc&utm_campaign=web"),
    ).toBe("https://cardondigital.com/en?utm_source=g&utm_medium=cpc&utm_campaign=web");
  });

  it("drops every other parameter and the fragment", () => {
    expect(
      visitUrl("https://cardondigital.com/es/contacto?email=ana%40x.mx&utm_source=chatgpt.com&gclid=abc#form"),
    ).toBe("https://cardondigital.com/es/contacto?utm_source=chatgpt.com");
    expect(visitUrl("https://cardondigital.com/es?name=Ana#top")).toBe("https://cardondigital.com/es");
  });

  it("drops personal data under any utm key, standard or not", () => {
    expect(
      visitUrl("https://cardondigital.com/es?utm_email=ana%40example.com&utm_source=ana%40example.com"),
    ).toBe("https://cardondigital.com/es");
    expect(visitUrl("https://cardondigital.com/es?utm_campaign=Ana%20Lopez&utm_medium=6461234567")).toBe(
      "https://cardondigital.com/es",
    );
    expect(visitUrl("https://cardondigital.com/es?utm_content=x&utm_term=y&utm_source=chatgpt.com")).toBe(
      "https://cardondigital.com/es?utm_source=chatgpt.com",
    );
  });

  it("reads the utm prefix exactly, never a look-alike", () => {
    expect(visitUrl("https://cardondigital.com/es?UTM_SOURCE=x&utmx=1&xutm_source=2")).toBe(
      "https://cardondigital.com/es",
    );
  });

  it("sends nothing it cannot parse", () => {
    expect(visitUrl("not a url")).toBeNull();
  });
});

describe("visitEvent", () => {
  it("passes the event on with the cut address", () => {
    expect(visitEvent({ type: "pageview", url: "https://cardondigital.com/es?q=1&utm_source=chatgpt.com" })).toEqual({
      type: "pageview",
      url: "https://cardondigital.com/es?utm_source=chatgpt.com",
    });
  });

  it("drops an event whose address it cannot read", () => {
    expect(visitEvent({ type: "pageview", url: "::" })).toBeNull();
  });
});
