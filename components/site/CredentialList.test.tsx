import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// vitest transforms this app's JSX with the classic runtime; Next does not need
// this. Same shim as Media.test.tsx.
(globalThis as unknown as { React: typeof React }).React = React;

import { locales, type Locale } from "../../lib/i18n/config";
import { about } from "../../lib/i18n/about";
import { AEO_FUNDAMENTALS, CREDENTIALS, type Credential } from "../../lib/credentials";
import { VERIFY, credentialLabel } from "./CredentialFloat";
import CredentialList, { CredentialRow, ROW_LABEL, formatDate } from "./CredentialList";
import Footer from "./Footer";
import AboutPage from "../../app/[locale]/about/page";

/** A second certificate with every fact different, to prove the markup reads
    each one from the entry and types none of them. */
const OTHER: Credential = {
  id: "skillshop-search",
  name: { es: "Certificación de Búsqueda de Google Ads", en: "Google Ads Search Certification" },
  attests: { es: "Acredita algo distinto.", en: "It attests something else." },
  alt: { es: "Insignia de Búsqueda", en: "Search badge" },
  issuer: { name: "Google Skillshop", url: "https://skillshop.withgoogle.com" },
  holder: "Otra Persona",
  code: "zz99",
  validFrom: "2025-01-02",
  validUntil: "2026-03-04",
  verifyUrl: "https://skillshop.example/verify/zz99",
  badgeSrc: "/media/badges/other.png",
};

const list = (locale: Locale, credentials: readonly Credential[] = CREDENTIALS) =>
  renderToStaticMarkup(
    <CredentialList credentials={credentials} locale={locale} copy={about[locale].credentials} />,
  );

describe("CredentialList: the full block on /about", () => {
  it.each(locales)("%s: shows every fact of the certificate, from lib/credentials.ts", (locale) => {
    const html = list(locale);
    const c = AEO_FUNDAMENTALS;
    expect(html).toContain(`<h3 class="cred-card-name">${c.name[locale]}</h3>`);
    expect(html).toContain(c.attests[locale]);
    expect(html).toContain(c.holder);
    expect(html).toContain(c.issuer.name);
    expect(html).toContain(c.code);
    expect(html).toContain(`<time dateTime="${c.validFrom}">${formatDate(c.validFrom, locale)}</time>`);
    expect(html).toContain(`<time dateTime="${c.validUntil}">${formatDate(c.validUntil, locale)}</time>`);
    expect(html).toContain(`src="${c.badgeSrc}"`);
  });

  it.each(locales)("%s: links to the issuer's verification page in a new tab, and says so", (locale) => {
    const html = list(locale);
    const at = html.indexOf(`href="${AEO_FUNDAMENTALS.verifyUrl}"`);
    expect(at).toBeGreaterThan(0);
    const link = html.slice(html.lastIndexOf("<a", at), html.indexOf("</a>", at));
    expect(link).toContain('target="_blank"');
    expect(link).toMatch(/rel="[^"]*noopener[^"]*"/);
    // The visible text is the hero badge's own verb, and the accessible name
    // starts with it (WCAG 2.5.3), then says the tab is new.
    expect(link).toContain(VERIFY[locale].caption(AEO_FUNDAMENTALS.issuer.name));
    expect(link).not.toContain("aria-label");
    expect(link).toContain(`<span class="sr-only"> ${about[locale].credentials.newTab}</span>`);
  });

  it("writes the dates as each locale writes a date, on the printed day", () => {
    expect(formatDate("2026-10-20", "es")).toBe("20 de octubre de 2026");
    expect(formatDate("2028-11-18", "es")).toBe("18 de noviembre de 2028");
    expect(formatDate("2026-10-20", "en")).toBe("October 20, 2026");
    // The first of a month stays the first in any server time zone.
    expect(formatDate("2027-01-01", "en")).toBe("January 1, 2027");
  });

  it("reads the validity sentence from the dictionary, both dates in their places", () => {
    expect(list("es")).toContain(
      "del <time dateTime=\"2026-10-20\">20 de octubre de 2026</time> al <time dateTime=\"2028-11-18\">18 de noviembre de 2028</time>",
    );
    for (const locale of locales) {
      const range = about[locale].credentials.validRange;
      expect(range.indexOf("{from}")).toBeGreaterThanOrEqual(0);
      expect(range.indexOf("{until}")).toBeGreaterThan(range.indexOf("{from}"));
    }
  });

  it("a new certificate is one more entry: nothing about it is typed in the component", () => {
    const html = list("en", [AEO_FUNDAMENTALS, OTHER]);
    expect(html.match(/<li class="cred-card"/g)).toHaveLength(2);
    for (const fact of [OTHER.name.en, OTHER.attests.en, OTHER.holder, OTHER.code, OTHER.verifyUrl, OTHER.badgeSrc]) {
      expect(html).toContain(fact);
    }
    expect(html).toContain("Verify on Google Skillshop");
    expect(html).toContain("January 2, 2025");
  });

  it("the badge is decoration here: the name beside it says what it is", () => {
    expect(list("es")).toMatch(/<img class="cred-card-badge"[^>]*alt=""/);
  });
});

describe("CredentialRow: the small row in the footer", () => {
  it.each(locales)("%s: one named link per certificate, to the issuer's page", (locale) => {
    const html = renderToStaticMarkup(
      <CredentialRow credentials={[AEO_FUNDAMENTALS, OTHER]} locale={locale} />,
    );
    expect(html).toContain(`aria-label="${ROW_LABEL[locale]}"`);
    expect(html.match(/<a /g)).toHaveLength(2);
    for (const c of [AEO_FUNDAMENTALS, OTHER]) {
      expect(html).toContain(`href="${c.verifyUrl}"`);
      expect(html).toContain(`aria-label="${credentialLabel(c, locale)}"`);
      expect(html).toContain(`alt="${c.alt[locale]}"`);
    }
    expect(html.match(/target="_blank"/g)).toHaveLength(2);
  });

  it.each(locales)("%s: every page's footer carries the row", (locale) => {
    const html = renderToStaticMarkup(<Footer locale={locale} />);
    expect(html).toContain('class="cred-row"');
    expect(html).toContain(`href="${AEO_FUNDAMENTALS.verifyUrl}"`);
  });
});

describe("/about", () => {
  it.each(locales)("%s: the certificates sit right after the mission that names the founder", async (locale) => {
    const html = renderToStaticMarkup(await AboutPage({ params: Promise.resolve({ locale }) }));
    const d = about[locale];
    const mission = html.indexOf(d.mission.title);
    const creds = html.indexOf(d.credentials.title.replace(/'/g, "&#x27;"));
    const beliefs = html.indexOf(d.beliefs.title);
    expect(mission).toBeGreaterThan(0);
    expect(creds).toBeGreaterThan(mission);
    expect(beliefs).toBeGreaterThan(creds);
    expect(html.slice(creds, beliefs)).toContain(AEO_FUNDAMENTALS.holder);
    expect(html.slice(creds, beliefs)).toContain(`href="${AEO_FUNDAMENTALS.verifyUrl}"`);
  });
});
