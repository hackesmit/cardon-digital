import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// vitest transforms this app's JSX with the classic runtime; Next does not need
// this. Same shim as Media.test.tsx.
(globalThis as unknown as { React: typeof React }).React = React;

import { locales } from "../../lib/i18n/config";
import { AEO_FUNDAMENTALS, CREDENTIALS } from "../../lib/credentials";
import CredentialFloat, { BADGE_PX, VERIFY, credentialLabel } from "./CredentialFloat";

const ROOT = process.cwd();
const CSS = readFileSync(join(ROOT, "components/site/credential-float.css"), "utf8");
const PAGE = readFileSync(join(ROOT, "app/[locale]/page.tsx"), "utf8");

/** The body of the first rule whose selector list is exactly `selector`. */
function rule(selector: string): string {
  const at = CSS.indexOf(`\n${selector} {`);
  expect(at, `rule ${selector}`).toBeGreaterThanOrEqual(0);
  return CSS.slice(at, CSS.indexOf("}", at));
}

describe("CredentialFloat: the link to the issuer's verification", () => {
  it.each(locales)("%s: links to the verify page in a new tab, named in words", (locale) => {
    const html = renderToStaticMarkup(
      <CredentialFloat credential={AEO_FUNDAMENTALS} locale={locale} />,
    );
    expect(html).toContain(`href="${AEO_FUNDAMENTALS.verifyUrl}"`);
    expect(html).toContain('target="_blank"');
    expect(html).toMatch(/rel="[^"]*noopener[^"]*"/);
    const label = credentialLabel(AEO_FUNDAMENTALS, locale);
    expect(html).toContain(`aria-label="${label}"`);
    // The name is the certificate's own, read from lib/credentials.ts.
    expect(label.startsWith(AEO_FUNDAMENTALS.name[locale])).toBe(true);
    expect(label).toContain(VERIFY[locale].label);
    expect(html).toContain(VERIFY[locale].caption(AEO_FUNDAMENTALS.issuer.name));
    expect(html).toContain(`alt="${AEO_FUNDAMENTALS.alt[locale]}"`);
  });

  it.each(["es", "en"] as const)("%s caption names the credential's own issuer", (locale) => {
    const other = { ...AEO_FUNDAMENTALS, issuer: { name: "Google Skillshop", url: "https://skillshop.withgoogle.com" } };
    const html = renderToStaticMarkup(<CredentialFloat credential={other} locale={locale} />);
    expect(html).toContain("Google Skillshop");
    expect(html).not.toContain("HubSpot Academy</span>");
  });

  it("Spanish reads as the bead asked: the certificate, then verificar", () => {
    expect(credentialLabel(AEO_FUNDAMENTALS, "es")).toMatch(
      /^Certificación AEO Fundamentals de HubSpot Academy, verificar/,
    );
  });

  it("reserves the image box before it loads and does not compete with the LCP", () => {
    const html = renderToStaticMarkup(
      <CredentialFloat credential={AEO_FUNDAMENTALS} locale="es" />,
    );
    expect(html).toContain(`src="${AEO_FUNDAMENTALS.badgeSrc}"`);
    expect(html).toContain(`width="${BADGE_PX}"`);
    expect(html).toContain(`height="${BADGE_PX}"`);
    expect(html).toContain('loading="lazy"');
  });

  it.each(CREDENTIALS)("$id: the badge file exists and stays small", (c) => {
    const file = join(ROOT, "public", c.badgeSrc);
    expect(statSync(file).size).toBeLessThanOrEqual(16 * 1024);
  });
});

describe("credential-float.css: it can never cover the title", () => {
  it("the anchor takes no room, so the title starts where it did", () => {
    const anchor = rule(".cred-float");
    expect(anchor).toMatch(/height:\s*0;/);
    expect(anchor).toMatch(/margin:\s*0;/);
    expect(anchor).not.toMatch(/padding/);
  });

  it("the badge hangs upward from the anchor, a gap above the title", () => {
    const link = rule(".cred-float-link");
    expect(link).toMatch(/position:\s*absolute;/);
    expect(link).toMatch(/bottom:\s*var\(--cf-gap\);/);
    expect(link).not.toMatch(/\btop:/);
    // Every gap covers the -6deg tilt of its box (about 4.5px at 88px).
    const gaps = Array.from(CSS.matchAll(/--cf-gap:\s*(\d+)px;/g)).map((m) => Number(m[1]));
    expect(gaps.length).toBeGreaterThan(0);
    for (const g of gaps) expect(g).toBeGreaterThanOrEqual(8);
  });

  it("the drift only ever moves up", () => {
    const frames = CSS.slice(CSS.indexOf("@keyframes cred-float-drift"));
    const ys = Array.from(frames.matchAll(/translate\(\s*-?[\d.]+px,\s*(-?[\d.]+)px\)/g)).map((m) =>
      Number(m[1]),
    );
    expect(ys.length).toBeGreaterThan(0);
    for (const y of ys) expect(y).toBeLessThanOrEqual(0);
  });

  it("the drift runs only when the reader allows motion", () => {
    const at = CSS.indexOf("animation: cred-float-drift");
    expect(at).toBeGreaterThan(0);
    const gate = CSS.lastIndexOf("@media (prefers-reduced-motion: no-preference)", at);
    expect(gate).toBeGreaterThan(0);
    expect(CSS.slice(gate, at)).not.toContain("}");
  });
});

describe("the home hero", () => {
  it("places the badge between the eyebrow and the title", () => {
    const eyebrow = PAGE.indexOf('<p className="eyebrow">{d.hero.eyebrow}</p>');
    const badge = PAGE.indexOf("<CredentialFloat");
    const h1 = PAGE.indexOf("<h1>", eyebrow);
    expect(eyebrow).toBeGreaterThan(0);
    expect(badge).toBeGreaterThan(eyebrow);
    expect(badge).toBeLessThan(h1);
  });
});
