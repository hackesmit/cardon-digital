import { describe, expect, it } from "vitest";
import { CARDON_URL, DIVISIONS, DIVISION_NAME, VINO_NAME, brandConfig, divisionHref, matchingPath, servesPath } from "./brand";

/**
 * The division switch (bead hq-yj0hq): cardondigital.com is the general
 * division, vino.cardondigital.com the wine division, and the top bar of each
 * moves a reader to the matching page of the other.
 */
const VINO = "https://vino.cardondigital.com";
const cardon = brandConfig({ site: "cardon", vinoUrl: VINO });
const cardonNoVino = brandConfig({ site: "cardon" });
const vino = brandConfig({ site: "vino", siteUrl: VINO });

describe("divisions", () => {
  it("are general first, then wine, named Cardon Digital and the wine label", () => {
    expect(DIVISIONS).toEqual(["cardon", "vino"]);
    expect(DIVISION_NAME.cardon).toBe("Cardon Digital");
    expect(DIVISION_NAME.vino).toBe(VINO_NAME);
  });

  it("a wine subdomain of cardondigital.com is the wine division's own origin, indexable", () => {
    expect(vino.siteUrl).toBe(VINO);
    expect(vino.indexable).toBe(true);
    expect(cardon.crossLink).toBe(VINO);
  });
});

describe("matchingPath", () => {
  it("keeps a page both divisions have", () => {
    for (const p of ["/precios", "/contacto", "/about", "/sitios-web", "/privacy", "/terms", "/guias"]) {
      expect(matchingPath("vino", p)).toBe(p);
      expect(matchingPath("cardon", p)).toBe(p);
    }
  });

  it("sends a guide to the other division's guides index", () => {
    expect(matchingPath("vino", "/guias/cuanto-cuesta-pagina-web")).toBe("/guias");
    expect(matchingPath("cardon", "/guias/automatizar-reportes-bodega")).toBe("/guias");
  });

  it("sends a page the other division lacks to its home", () => {
    expect(matchingPath("vino", "/anuncios")).toBe("/");
    expect(matchingPath("vino", "/estilos")).toBe("/");
    expect(matchingPath("cardon", "/demos")).toBe("/");
    expect(matchingPath("cardon", "/industries/winery")).toBe("/");
    expect(matchingPath("cardon", "/work/monte-xanic")).toBe("/");
  });

  it("drops a trailing slash", () => {
    expect(matchingPath("vino", "/precios/")).toBe("/precios");
  });

  it("every path it returns is one the target division serves", () => {
    const paths = ["/", "/precios", "/anuncios", "/demos", "/guias/x", "/industries/winery", "/estilos", "/nope"];
    for (const p of paths) {
      expect(servesPath(vino, matchingPath("vino", p))).toBe(true);
      expect(servesPath(cardon, matchingPath("cardon", p))).toBe(true);
    }
  });
});

describe("divisionHref", () => {
  it("the current division links to its own home, relative", () => {
    expect(divisionHref(cardon, "cardon", "es", "/precios")).toBe("/es");
    expect(divisionHref(vino, "vino", "en", "/precios")).toBe("/en");
  });

  it("cardon links to the matching wine page on the wine origin, in the same language", () => {
    expect(divisionHref(cardon, "vino", "es", "/precios")).toBe(VINO + "/es/precios");
    expect(divisionHref(cardon, "vino", "en", "/anuncios")).toBe(VINO + "/en");
  });

  it("wine links to the matching page on cardondigital.com", () => {
    expect(divisionHref(vino, "cardon", "en", "/contacto")).toBe(CARDON_URL + "/en/contacto");
    expect(divisionHref(vino, "cardon", "es", "/demos")).toBe(CARDON_URL + "/es");
  });

  it("before the wine origin is set, cardon points at the winery page it still serves", () => {
    expect(divisionHref(cardonNoVino, "vino", "es", "/precios")).toBe("/es/industries/winery");
  });
});
