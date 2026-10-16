import { describe, expect, it } from "vitest";
import {
  decodeSelection,
  encodeSelection,
  estimate,
  parseSelection,
  type BuilderSelection,
} from "@/lib/builder";
import { adsScope, quote, sumPriced, webCareMonthly, webPackageById } from "@/lib/pricing";
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
