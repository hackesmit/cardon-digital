import { describe, expect, it } from "vitest";

import { decodeSelection, parseSelection } from "@/lib/builder";
import { buildEmail } from "@/lib/contact/mail";
import { LIMITS, validateSubmission } from "@/lib/contact/validate";
import { webFeaturePrices, webPackagePrice } from "@/lib/pricing";

/**
 * How the lead email handles what a visitor types, now that the builder sends
 * unticked website features with it (review prep, hq-lgjo.12 / hq-lgjo.6):
 * every visitor value is escaped in the HTML, the feature list is rebuilt from
 * known ids only, and every field has a size limit that holds.
 */

const HOSTILE = '<script>alert(1)</script><img src=x onerror="x()">&\'';

function lead(extra: Record<string, unknown> = {}) {
  const r = validateSubmission({
    name: "Ana Ruiz",
    email: "ana@bodega.mx",
    message: "Queremos cotizar el sitio.",
    locale: "en",
    package: { web: "negocio", webOff: ["work-portfolio"], modules: [] },
    ...extra,
  });
  if (!r.ok) throw new Error("invalid: " + r.errors.join(","));
  return r.value;
}

describe("the lead email escapes what the visitor typed", () => {
  it("name, business, message and attribution never reach the HTML as markup", () => {
    const mail = buildEmail(
      lead({ name: "Ana " + HOSTILE, winery: "Bodega " + HOSTILE, message: "Hola " + HOSTILE, cd_campaign: HOSTILE, cd_landing: HOSTILE }),
    );
    expect(mail.html).not.toContain("<script");
    expect(mail.html).not.toContain("<img");
    expect(mail.html).not.toMatch(/onerror="/);
    expect(mail.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(mail.html).toContain("&#39;");
    // The package block still renders from server prices next to the hostile input.
    expect(mail.html).toContain("Website without: Work and portfolio section");
  });

  it("feature ids from the visitor are never echoed: unknown ones are dropped before the email", () => {
    const value = lead({ package: { web: "negocio", webOff: [HOSTILE, "work-portfolio", "x".repeat(5000)] } });
    expect(value.package?.webOff).toEqual(["work-portfolio"]);
    const mail = buildEmail(value);
    expect(mail.text).not.toContain("script");
    expect(mail.text).not.toContain("xxxxx");
    expect(mail.html).not.toContain("xxxxx");
  });

  it("the price in the email comes from the ids, never from figures the browser sends", () => {
    const value = lead({
      package: { web: "negocio", webOff: ["work-portfolio"], setup: { MXN: 1, USD: 1 }, price: 1, total: 1 },
    });
    const mail = buildEmail(value);
    const want = webPackagePrice("negocio", ["work-portfolio"]).MXN.toLocaleString("en-US");
    expect(mail.text).toContain("from $" + want + " MXN");
    expect(mail.text).not.toMatch(/\$1 MXN/);
  });

  it("a name or business with a line break cannot add a mail header", () => {
    for (const field of ["name", "winery"]) {
      const r = validateSubmission({
        name: "Ana Ruiz",
        email: "ana@bodega.mx",
        message: "Queremos cotizar el sitio.",
        [field]: "Ana\r\nBcc: someone@example.com",
      });
      expect(r.ok, field).toBe(false);
    }
    const mail = buildEmail(lead());
    expect(mail.subject).not.toMatch(/[\r\n]/);
  });
});

describe("size limits on lead input", () => {
  it("each text field is refused one character past its limit and accepted at it", () => {
    const base = { name: "Ana Ruiz", email: "ana@bodega.mx", message: "Queremos cotizar el sitio." };
    const at: Record<string, string> = {
      name: "a".repeat(LIMITS.name.max),
      winery: "b".repeat(LIMITS.winery.max),
      message: "m".repeat(LIMITS.message.max),
      whatsapp: "6" + " ".repeat(LIMITS.whatsapp.max - 2) + "6",
    };
    for (const [field, ok] of Object.entries(at)) {
      expect(validateSubmission({ ...base, [field]: ok }).ok, field + " at limit").toBe(true);
      expect(validateSubmission({ ...base, [field]: ok + "x" }).ok, field + " past limit").toBe(false);
    }
  });

  it("only the first 50 unticked features are read, however long the list", () => {
    const optional = webFeaturePrices("tienda").filter((f) => !f.required).map((f) => f.id);
    const junk = Array.from({ length: 50 }, (_, i) => "junk-" + i);
    // The real ids sit past the 50th entry, so they are never read.
    expect(parseSelection({ web: "tienda", webOff: [...junk, ...optional] })?.webOff).toBeUndefined();
    const huge = Array.from({ length: 100_000 }, () => "copy-written");
    expect(parseSelection({ web: "tienda", webOff: huge })?.webOff).toEqual(["copy-written"]);
  });

  it("the /precios link reader stops at 600 characters", () => {
    const padded = "w:negocio," + "m:".padEnd(600, "z") + ",x:work-portfolio";
    expect(decodeSelection(padded)?.webOff).toBeUndefined();
    expect(decodeSelection("w:negocio,x:work-portfolio")?.webOff).toEqual(["work-portfolio"]);
  });

  it("attribution marks are cut to 200 characters before the email", () => {
    const value = lead({ cd_campaign: "c".repeat(5000) });
    expect(value.attribution.campaign).toHaveLength(200);
    expect(buildEmail(value).text).not.toContain("c".repeat(201));
  });
});
