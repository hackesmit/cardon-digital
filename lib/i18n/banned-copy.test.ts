import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { extractLocaleStrings } from "../../scripts/copy-check.mjs";
import { webPackages } from "../pricing";
import { sitios } from "./sitios";
import { locales } from "./config";

/**
 * The copy habits Daniel struck off the site on 2026-10-16, reading it live
 * (bead hq-lgjo.1), kept off it. Three kinds of thing went:
 *
 *  - over-explaining that a human does the work ("the team that does the work
 *    reads it and answers"), which tells a buyer nothing;
 *  - currency and rounding notes ("quoted and charged in Mexican pesos; the
 *    dollar figures are rounded conversions"), which are irrelevant to the
 *    decision and were on six surfaces;
 *  - poetic lines and the brand's two cute ones ("Built to hold water",
 *    "Working both sides of the border", "It reads like the land it is walked
 *    on"), plus the word "lands", which he dislikes.
 *
 * Checked per locale on the STRINGS of every dictionary, not on the file text,
 * so a comment in a source file is not copy: `extractLocaleStrings` is the
 * same reader scripts/copy-check.mjs uses, and it reads every `const en...`
 * and `const es...` declaration in the file, contact.ts's `enIntro` included.
 * An English rule is never tried against Spanish, which is why "lands" can be
 * banned at all.
 *
 * The companion of lib/i18n/no-factura.test.ts, which guards the same way
 * against a factura or an IVA promise.
 */

type Rule = { re: RegExp; why: string };

const EN: Rule[] = [
  { re: /team that does the work/i, why: 'the "team that does the work" line (Daniel: not relevant)' },
  { re: /\bhold water\b/i, why: 'the old brandline "Built to hold water"' },
  { re: /both sides of the border/i, why: "the old footer line about both sides of the border" },
  { re: /rounded conversions?/i, why: "a currency rounding note" },
  { re: /in Mexican pesos/i, why: "a note that prices are quoted in Mexican pesos" },
  { re: /\bwe quote and charge\b/i, why: "a note that prices are quoted in Mexican pesos" },
  { re: /take the memo and go/i, why: "a line that encourages the reader to leave" },
  { re: /\bland(?:s|ed)\b/i, why: 'the word "lands" (Daniel dislikes it)' },
  { re: /whatsapp button/i, why: 'name the function, not the app (Daniel: no "WhatsApp button")' },
  { re: /reads on a phone/i, why: 'the old phone line; say "works on any screen" or "optimized for mobile and desktop"' },
  { re: /published by what (?:it|they) include/i, why: 'the old pricing line; say "feature-based pricing"' },
];

const ES: Rule[] = [
  { re: /equipo que hace el trabajo/i, why: 'the "equipo que hace el trabajo" line (Daniel: no es relevante)' },
  { re: /conversiones redondeadas/i, why: "a currency rounding note" },
  { re: /pesos mexicanos/i, why: "a note that prices are quoted in pesos" },
  { re: /cotizamos y cobramos/i, why: "a note that prices are quoted in pesos" },
  { re: /se lleva el informe/i, why: "a line that encourages the reader to leave" },
  { re: /del otro lado de la l[ií]nea/i, why: "the old footer line about both sides of the border" },
  { re: /bot[oó]n de whatsapp/i, why: 'name the function, not the app (Daniel: no "botón de WhatsApp")' },
  { re: /se lee (?:bien )?en el tel[eé]fono/i, why: 'the old phone line; say "se ve bien en cualquier pantalla"' },
  { re: /publicados? seg[uú]n lo que incluye/i, why: 'the old pricing line; say "precios por funciones"' },
  { re: /siguen funcionando cuando nos vamos/i, why: "the old Spanish brandline" },
  { re: /lo que cambia si su vendimia/i, why: "a Monte Xanic case-study metaphor (Daniel: remove)" },
  { re: /^cada n[uú]mero queda en su cuadro/i, why: "a Monte Xanic case-study metaphor (Daniel: remove)" },
  { re: /se lee igual que se recorre/i, why: "a Monte Xanic case-study metaphor (Daniel: remove)" },
];

const RULES: Record<string, Rule[]> = { en: EN, es: ES };

const dir = join(__dirname);
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
  .sort();

describe("the copy habits struck off on 2026-10-16 stay off the site", () => {
  it("reads every dictionary in lib/i18n, so a file cannot be missed", () => {
    // The two machinery modules carry no locale declaration; every other file
    // is a dictionary and has to be read, or this guard covers nothing.
    expect(files).toContain("site.ts");
    expect(files).toContain("terms.ts");
    expect(files.length).toBeGreaterThanOrEqual(20);
    for (const file of files) {
      const { errors } = extractLocaleStrings(readFileSync(join(dir, file), "utf8"));
      expect(errors, `lib/i18n/${file} could not be read: ${errors.join("; ")}`).toEqual([]);
    }
  });

  for (const file of files) {
    for (const locale of locales) {
      it(`${file} (${locale})`, () => {
        const extracted = extractLocaleStrings(readFileSync(join(dir, file), "utf8")) as {
          en: { value: string }[];
          es: { value: string }[];
        };
        const strings = extracted[locale as "en" | "es"];
        for (const rule of RULES[locale]) {
          const hit = strings.filter((s) => rule.re.test(s.value))[0];
          expect(hit?.value, `lib/i18n/${file} ${locale} carries ${rule.why}`).toBeUndefined();
        }
      });
    }
  }
});

/**
 * The package features Daniel took off the four website packages, and the rule
 * that no feature is named after a channel: a package lists the function
 * ("Contact button and a short form"), never WhatsApp.
 */
describe("the website packages list functions, and the two struck features stay off", () => {
  const ids = webPackages.map((p) => p.features).reduce((a, b) => a.concat(b), [] as string[]);

  it("no package carries the editable section or the Google Business Profile line", () => {
    expect(ids).not.toContain("editable-section");
    expect(ids).not.toContain("google-business-profile-optimisation");
  });

  it("no feature id names WhatsApp", () => {
    expect(ids.filter((id) => /whatsapp/i.test(id))).toEqual([]);
  });

  it.each(locales)("%s feature names describe the function, never WhatsApp", (locale) => {
    const names = sitios[locale].packages.features;
    for (const id of ids) {
      const label = names[id];
      expect(label, `lib/i18n/sitios.ts has no ${locale} name for feature ${id}`).toBeTruthy();
      expect(label, `feature ${id} names WhatsApp in ${locale}`).not.toMatch(/whatsapp/i);
    }
  });
});
