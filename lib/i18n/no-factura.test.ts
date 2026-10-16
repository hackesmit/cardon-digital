import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Cardon is not registered to issue facturas (Daniel, 2026-10-16), so no page
 * may promise one. Words about a CLIENT's own invoicing (the restaurant module
 * capturing a factura request, the market notes about who issues a CFDI) are
 * about other businesses and are not checked; this guards the phrases that
 * say Cardon itself invoices.
 */
const BANNED = [
  /con factura/i,
  /facturamos/i,
  /se factura\b/i,
  /le facturamos/i,
  /quoted and invoiced/i,
  /\bwe invoice\b/i,
  /\binvoiced the month after\b/i,
  /\bfacturado al mes siguiente\b/i,
  // No IVA either: an unregistered business does not charge it (Daniel, 2026-10-16).
  /\bIVA\b/,
];

describe("no page promises a factura from Cardon", () => {
  const dir = join(__dirname);
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))) {
    it(file, () => {
      const text = readFileSync(join(dir, file), "utf8");
      for (const re of BANNED) expect(text, `${file} matches ${re}`).not.toMatch(re);
    });
  }
});
