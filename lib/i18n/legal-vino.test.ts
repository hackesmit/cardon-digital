import { describe, expect, it } from "vitest";
import { branded } from "./variant";
import { privacyVino } from "./privacy-vino";
import { termsVino } from "./terms-vino";

const flat = (v: unknown): string => JSON.stringify(v);

describe("wine brand legal pages (hq-3f6ut.4)", () => {
  const all = { privacy: branded(privacyVino), terms: branded(termsVino) };

  it.each(["en", "es"] as const)("%s: no placeholder or brand token is left", (l) => {
    for (const d of [all.privacy[l], all.terms[l]]) {
      expect(flat(d)).not.toContain("{{");
      expect(flat(d)).not.toContain("{brand}");
    }
  });

  it("never names INAI; the Spanish aviso names the SABG and the ARCO rights", () => {
    expect(flat(all)).not.toMatch(/INAI/);
    expect(all.privacy.es.rightsBody).toContain("SABG");
    expect(all.privacy.es.rightsBody).toContain("ARCO");
    expect(all.privacy.en.rightsBody).toContain("ARCO");
  });

  it("does not carry Cardon's own page identity or Cardon-only services", () => {
    const s = flat(all);
    expect(s).not.toContain("cardondigital.com");
    expect(s).not.toMatch(/Growth Diagnostic|Diagnóstico de Crecimiento/);
  });

  it("keeps the consent and form promises the privacy page makes", () => {
    for (const l of ["en", "es"] as const) {
      expect(all.privacy[l].contactBody.length).toBeGreaterThan(500);
      expect(all.privacy[l].measureList.length).toBe(4);
    }
  });
});
