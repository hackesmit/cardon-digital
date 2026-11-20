import { describe, expect, it } from "vitest";
import {
  decodeSelection,
  encodeSelection,
  estimate,
  parseSelection,
  type BuilderSelection,
} from "@/lib/builder";
import {
  adsScope,
  quote,
  sumPriced,
  webCareMonthly,
  webFeaturePrices,
  webPackageById,
  webPackagePrice,
  webPackages,
} from "@/lib/pricing";
import { buildEmail } from "@/lib/contact/mail";
import { validateSubmission } from "@/lib/contact/validate";

const FULL: BuilderSelection = {
  web: "negocio",
  care: true,
  ads: "local",
  modules: ["hospitalidad", "restaurante"],
};

describe("reading a selection from the visitor", () => {
  it("keeps exactly the known ids", () => {
    expect(parseSelection(FULL)).toEqual(FULL);
  });

  it("drops what it does not know and never throws", () => {
    for (const junk of [null, 1, "x", [], { web: "mansion" }, { modules: "produccion" }, { ads: { $gt: "" } }]) {
      expect(() => parseSelection(junk)).not.toThrow();
    }
    expect(parseSelection({ web: "mansion", ads: "local" })).toEqual({ web: null, care: false, ads: "local", modules: [] });
    expect(parseSelection({ web: "mansion" })).toBeNull();
  });

  it("puts modules in catalogue order, each once", () => {
    expect(parseSelection({ modules: ["restaurante", "produccion", "restaurante", "spa"] })?.modules).toEqual([
      "produccion",
      "restaurante",
    ]);
  });

  it("keeps a real module however much junk comes before it", () => {
    expect(parseSelection({ modules: [...Array(50).fill("junk"), "produccion"] })?.modules).toEqual(["produccion"]);
  });

  it("has no care without a website", () => {
    expect(parseSelection({ care: true, ads: "local" })?.care).toBe(false);
  });

  it("ignores any price the browser sends", () => {
    const sel = parseSelection({ ...FULL, setup: 1, monthly: 1, total: { MXN: 1 } });
    expect(sel).toEqual(FULL);
  });
});

describe("handing a package from /precios to /contacto", () => {
  it("round-trips through the link", () => {
    expect(encodeSelection(FULL)).toBe("w:negocio,c,a:local,m:hospitalidad+restaurante");
    expect(decodeSelection(encodeSelection(FULL))).toEqual(FULL);
  });

  it("forgives a mangled link", () => {
    expect(decodeSelection("w:nope,zz,m:+")).toBeNull();
    expect(decodeSelection(null)).toBeNull();
    expect(decodeSelection("a:crecimiento")?.ads).toBe("crecimiento");
    // A hand-typed "+" arrives from URLSearchParams as a space.
    expect(decodeSelection("m:restaurante hospitalidad")?.modules).toEqual(["hospitalidad", "restaurante"]);
  });
});

describe("the estimate", () => {
  it("is nothing when nothing is picked", () => {
    expect(estimate({ web: null, care: false, ads: null, modules: [] })).toBeNull();
  });

  it("adds up exactly the published figures", () => {
    const est = estimate(FULL)!;
    const web = webPackageById("negocio").from;
    const ads = adsScope("local");
    const sw = quote(["hospitalidad", "restaurante"], "S");
    expect(est.setup).toEqual(sumPriced([web, ads.setup, sw.setup]));
    expect(est.monthly).toEqual(sumPriced([webCareMonthly(), ads.base, sw.monthly]));
    expect(est.yearOne.MXN).toBe(est.setup.MXN + 12 * est.monthly.MXN);
    expect(est.perContactOnTop).toBe(true);
  });

  it("prices software as the published mix at the entry size", () => {
    const est = estimate({ web: null, care: false, ads: null, modules: ["produccion", "hospitalidad", "restaurante"] })!;
    const sw = est.lines.find((l) => l.kind === "software");
    expect(sw && sw.kind === "software" ? sw.setup : null).toEqual(
      quote(["produccion", "hospitalidad", "restaurante"], "S").setup,
    );
    expect(sw && sw.kind === "software" ? sw.discounts.filter((x) => x.rate > 0).length : 0).toBe(2);
  });
});

describe("the package in the lead email", () => {
  const body = {
    name: "Ana Ruiz",
    email: "ana@bodega.mx",
    message: "Queremos cotizar el sitio.",
    locale: "es",
    package: { ...FULL, setup: 1 },
  };

  it("arrives through validation as ids", () => {
    const r = validateSubmission(body);
    expect(r.ok && r.value.package).toEqual(FULL);
  });

  it("is rebuilt on the server, in pesos", () => {
    const r = validateSubmission(body);
    if (!r.ok) throw new Error("invalid");
    const mail = buildEmail(r.value);
    const setup = estimate(FULL)!.setup.MXN.toLocaleString("en-US");
    expect(mail.text).toContain("Package they built:");
    expect(mail.text).toContain("Paid once: $" + setup + " MXN");
    expect(mail.html).toContain("Package they built");
    expect(mail.text).not.toContain("$1 MXN");
  });

  it("does not stop a lead whose package is junk", () => {
    const r = validateSubmission({ ...body, package: "drop table" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.package).toBeNull();
      expect(buildEmail(r.value).text).not.toContain("Package they built");
    }
  });
});

describe("website features the client unticks (hq-lgjo.6)", () => {
  it("every package's features add up to its published price, in both currencies", () => {
    for (const p of webPackages) {
      const parts = webFeaturePrices(p.id);
      expect(parts.map((f) => f.id)).toEqual(p.features);
      expect(parts.reduce((a, f) => a + f.price.MXN, 0)).toBe(p.from.MXN);
      expect(parts.reduce((a, f) => a + f.price.USD, 0)).toBe(p.from.USD);
      expect(parts.reduce((a, f) => a + f.hours, 0)).toBeCloseTo(p.buildHours, 9);
      expect(webPackagePrice(p.id)).toEqual(p.from);
      for (const f of parts) {
        expect(f.price.MXN % 50).toBe(0);
        expect(f.price.MXN >= 0 && Number.isInteger(f.price.USD)).toBe(true);
        if (f.hours > 0) expect(f.price.MXN).toBeGreaterThan(0);
      }
    }
  });

  it("design and AEO cannot be unticked; AEO has no price of its own", () => {
    for (const p of webPackages) {
      const parts = webFeaturePrices(p.id);
      expect(parts.filter((f) => f.required).map((f) => f.id).sort()).toEqual(["aeo-ready", "custom-design"]);
      expect(parts.find((f) => f.id === "aeo-ready")!.price).toEqual({ MXN: 0, USD: 0 });
      const all = parts.map((f) => f.id);
      expect(webPackagePrice(p.id, all)).toEqual(parts.find((f) => f.id === "custom-design")!.price);
    }
  });

  it("unticking a feature takes exactly its price off, and reticking puts it back", () => {
    const parts = webFeaturePrices("negocio");
    const portfolio = parts.find((f) => f.id === "work-portfolio")!;
    const sel: BuilderSelection = { ...FULL, webOff: ["work-portfolio"] };
    const web = estimate(sel)!.lines.find((l) => l.kind === "web");
    if (!web || web.kind !== "web") throw new Error("no web line");
    expect(web.setup.MXN).toBe(webPackageById("negocio").from.MXN - portfolio.price.MXN);
    expect(web.full).toEqual(webPackageById("negocio").from);
    expect(web.omitted).toEqual(["work-portfolio"]);
    expect(estimate(sel)!.setup.MXN).toBe(estimate(FULL)!.setup.MXN - portfolio.price.MXN);
    expect(estimate({ ...sel, webOff: [] })).toEqual(estimate(FULL));
  });

  it("reads unticked features from untrusted input: only optional features of the package, in order", () => {
    const sel = parseSelection({ web: "negocio", webOff: ["lead-capture", "custom-design", "checkout", 7, "work-portfolio", "lead-capture"] });
    expect(sel?.webOff).toEqual(["work-portfolio", "lead-capture"]);
    expect(parseSelection({ web: null, ads: "local", webOff: ["copy-written"] })?.webOff).toBeUndefined();
    expect(parseSelection({ web: "negocio", webOff: "copy-written" })?.webOff).toBeUndefined();
  });

  it("travels in the /precios link", () => {
    const sel: BuilderSelection = { web: "tienda", webOff: ["copy-written", "order-notifications"], care: false, ads: null, modules: [] };
    const code = encodeSelection(sel);
    expect(code).toBe("w:tienda,x:copy-written+order-notifications");
    expect(decodeSelection(code)).toEqual(sel);
    // Every optional feature of the biggest package still fits the link reader.
    const every = webFeaturePrices("tienda").filter((f) => !f.required).map((f) => f.id);
    expect(decodeSelection(encodeSelection({ ...sel, webOff: every }))?.webOff).toEqual(every);
  });

  it("the lead email states the features left out and the price without them", () => {
    const r = validateSubmission({
      name: "Ana Ruiz",
      email: "ana@bodega.mx",
      message: "Queremos cotizar el sitio.",
      locale: "es",
      package: { web: "negocio", webOff: ["work-portfolio"], modules: [] },
    });
    if (!r.ok) throw new Error("invalid");
    const mail = buildEmail(r.value);
    const without = webPackagePrice("negocio", ["work-portfolio"]).MXN.toLocaleString("en-US");
    expect(mail.text).toContain("from $" + without + " MXN");
    expect(mail.text).toContain("Website without: Work and portfolio section");
    expect(mail.text).not.toMatch(/IVA|factura/i);
  });
});
