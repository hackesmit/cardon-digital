/**
 * Unit tests for tools/visibility/lib/detect.mjs.
 *
 *   node --test tools/visibility/test/
 *
 * Fixture brands are invented (Nopal Digital, Ola Studio), so no test depends
 * on what an engine said about a real business.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { detect, listItems, fold, domainOf, hostMatches } from "../lib/detect.mjs";

const config = JSON.parse(readFileSync(new URL("./fixtures/client.json", import.meta.url), "utf8"));
const brands = [config.brand, ...config.competitors];
const ids = (r) => r.mentions.map((m) => m.id).sort();

test("fold strips accents and case and maps back to original offsets", () => {
  const f = fold("Áb Nopál");
  assert.equal(f.text, "ab nopal");
  assert.equal(f.map[3], 3);
});

test("an alias matches across case, accents and a hyphen", () => {
  for (const text of ["Te recomiendo NOPAL DIGITAL.", "Nopál Digital hace sitios.", "Prueba nopal-digital hoy"]) {
    assert.deepEqual(ids(detect(text, brands)), ["us"], text);
  }
});

test("the domain written in prose is a mention", () => {
  const r = detect("Mira https://nopaldigital.test/precios para precios.", brands);
  assert.deepEqual(ids(r), ["us"]);
});

test("word boundaries: an alias inside a longer word is not a mention", () => {
  assert.deepEqual(detect("Supernopal Digitales vende tunas.", brands).mentions, []);
});

test("a bare ambiguous alias is unclear, not a mention", () => {
  const r = detect("El Nopal de la esquina vende tacos.", brands);
  assert.deepEqual(r.mentions, []);
  assert.deepEqual(r.unclear.map((u) => u.id), ["us"]);
});

test("notFollowedBy rules out a look-alike business", () => {
  const r = detect("Nopal Media hace video; Nopal Studio también.", brands);
  assert.deepEqual(r.mentions, []);
  assert.deepEqual(r.unclear, []);
});

test("a definite hit wins over an unclear one for the same brand", () => {
  const r = detect("Nopal Digital. Nopal es su nombre corto.", brands);
  assert.deepEqual(ids(r), ["us"]);
  assert.deepEqual(r.unclear, []);
  assert.equal(r.mentions[0].count, 1);
});

test("position is the rank of the numbered item that names the brand", () => {
  const text = [
    "Opciones en Ensenada:",
    "",
    "1. **Ola Studio**",
    "   Estudio local con paquetes.",
    "",
    "2. **Treinta y Tres**",
    "   - Hace anuncios.",
    "3. **Nopal Digital**",
    "   Sitios y software.",
    "",
    "Recomiendo Ola Studio primero.",
  ].join("\n");
  const r = detect(text, brands);
  const pos = Object.fromEntries(r.mentions.map((m) => [m.id, m.position]));
  assert.deepEqual(pos, { ola: 1, ttt: 2, us: 3 });
});

test("bullets, numbered headings and table rows rank too", () => {
  assert.equal(detect("*   **Ola Studio:** web\n*   **Nopal Digital:** software", brands).mentions.find((m) => m.id === "us").position, 2);
  assert.equal(detect("### 1. Ola Studio\ntexto\n### 2. Nopal Digital\ntexto", brands).mentions.find((m) => m.id === "us").position, 2);
  const table = "| Agencia | Enfoque |\n|---|---|\n| Ola Studio | web |\n| Treinta y Tres | ads |\n| Nopal Digital | software |";
  assert.equal(detect(table, brands).mentions.find((m) => m.id === "us").position, 3);
});

test("a mention outside any list has no position", () => {
  const r = detect("Una opcion es Nopal Digital, en Ensenada.", brands);
  assert.equal(r.mentions[0].position, null);
});

test("a paragraph between two lists restarts the rank", () => {
  const items = listItems("1. a\n2. b\nAhora otra lista:\n1. c");
  assert.deepEqual(items.map((i) => i.rank), [1, 2, 1]);
});

test("domainOf and hostMatches normalise hosts", () => {
  assert.equal(domainOf("https://www.NopalDigital.test/x?utm_source=openai"), "nopaldigital.test");
  assert.equal(domainOf("not a url"), null);
  assert.ok(hostMatches("blog.nopaldigital.test", "nopaldigital.test"));
  assert.ok(!hostMatches("notnopaldigital.test", "nopaldigital.test"));
});
