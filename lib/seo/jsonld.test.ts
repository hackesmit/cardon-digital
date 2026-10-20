import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// vitest transforms this app's JSX with the classic runtime, so the
// components' createElement calls resolve a global React. Test-only shim.
(globalThis as unknown as { React: typeof React }).React = React;

import Faq from "../../components/site/Faq";
import JsonLd from "../../components/site/JsonLd";
import { AEO_FUNDAMENTALS, CREDENTIALS } from "../credentials";
import { locales } from "../i18n/config";
import { SITE_URL } from "../i18n/metadata";
import {
  FOUNDER_ID,
  ORGANIZATION_ID,
  absoluteUrl,
  articleLd,
  breadcrumbLd,
  faqPageLd,
  founderLd,
  ldGraph,
  organizationLd,
  serializeLd,
  serviceLd,
  siteGraph,
  websiteId,
  websiteLd,
  type LdNode,
} from "./jsonld";

const h = React.createElement;

/** The JSON inside every ld+json script in a chunk of markup. */
function scripts(html: string): unknown[] {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  return Array.from(html.matchAll(re)).map((m) => JSON.parse(m[1]));
}

/** Every @id a node or graph defines, and every bare {"@id"} it points at. */
function ids(value: unknown, defined: Set<string>, pointed: Set<string>) {
  if (Array.isArray(value)) return value.forEach((v) => ids(v, defined, pointed));
  if (value === null || typeof value !== "object") return;
  const o = value as Record<string, unknown>;
  if (typeof o["@id"] === "string") {
    (Object.keys(o).length === 1 ? pointed : defined).add(o["@id"]);
  }
  Object.values(o).forEach((v) => ids(v, defined, pointed));
}

describe("credentials", () => {
  it("holds the AEO Fundamentals certificate exactly as printed", () => {
    expect(CREDENTIALS).toContain(AEO_FUNDAMENTALS);
    expect(AEO_FUNDAMENTALS).toMatchObject({
      holder: "Daniel Hack",
      code: "bdbd83da48704002855820786ace136e",
      validFrom: "2026-10-20",
      validUntil: "2028-11-18",
      badgeSrc: "/media/badges/aeo-fundamentals.png",
    });
    expect(AEO_FUNDAMENTALS.issuer.name).toBe("HubSpot Academy");
    expect(AEO_FUNDAMENTALS.verifyUrl).toMatch(/^https:\/\/app\.hubspot\.com\/academy\/achievements\//);
  });

  it("names and describes the badge in both locales", () => {
    for (const l of locales) {
      expect(AEO_FUNDAMENTALS.name[l].length).toBeGreaterThan(0);
      expect(AEO_FUNDAMENTALS.alt[l].length).toBeGreaterThan(0);
    }
  });
});

describe("site graph", () => {
  for (const locale of locales) {
    it(`links organization, site and founder by @id (${locale})`, () => {
      const g = siteGraph(locale);
      expect(g["@context"]).toBe("https://schema.org");
      const types = g["@graph"].map((n) => n["@type"]);
      expect(types).toEqual(["ProfessionalService", "WebSite", "Person"]);

      const defined = new Set<string>();
      const pointed = new Set<string>();
      ids(g, defined, pointed);
      for (const id of Array.from(pointed)) expect(defined, id).toContain(id);
    });
  }

  it("states only facts the repo has: no address, phone or legal name", () => {
    const org = organizationLd("es");
    for (const k of ["address", "telephone", "legalName", "email", "priceRange"]) {
      expect(org).not.toHaveProperty(k);
    }
    expect(org).toMatchObject({
      name: "Cardon Digital",
      url: SITE_URL + "/es",
      founder: { "@id": FOUNDER_ID },
    });
    expect(JSON.stringify(org.areaServed)).toContain("Baja California");
    expect(JSON.stringify(org.areaServed)).toContain("Ensenada");
  });

  it("drops sameAs while there are no profiles, keeps it once there are", () => {
    expect(organizationLd("es")).not.toHaveProperty("sameAs");
    expect(organizationLd("es", { sameAs: ["", "  "] })).not.toHaveProperty("sameAs");
    expect(organizationLd("es", { sameAs: ["https://example.com/p", ""] }).sameAs).toEqual([
      "https://example.com/p",
    ]);
  });

  it("gives each locale its own WebSite node in its own language", () => {
    expect(websiteLd("es")).toMatchObject({ "@id": websiteId("es"), inLanguage: "es-MX" });
    expect(websiteLd("en")).toMatchObject({ "@id": websiteId("en"), inLanguage: "en-US" });
    expect(websiteId("es")).not.toBe(websiteId("en"));
    expect(websiteLd("en").publisher).toEqual({ "@id": ORGANIZATION_ID });
  });

  it("gives the founder his certificate as an EducationalOccupationalCredential", () => {
    const p = founderLd("es");
    expect(p).toMatchObject({ "@type": "Person", name: "Daniel Hack", jobTitle: "Fundador" });
    expect(founderLd("en").jobTitle).toBe("Founder");
    const creds = p.hasCredential as LdNode[];
    expect(creds).toHaveLength(1);
    expect(creds[0]).toMatchObject({
      "@type": "EducationalOccupationalCredential",
      name: AEO_FUNDAMENTALS.name.es,
      identifier: AEO_FUNDAMENTALS.code,
      url: AEO_FUNDAMENTALS.verifyUrl,
      dateCreated: "2026-10-20",
      expires: "2028-11-18",
      recognizedBy: { "@type": "Organization", name: "HubSpot Academy" },
    });
    expect(founderLd("es", [])).not.toHaveProperty("hasCredential");
  });
});

describe("page builders", () => {
  it("serviceLd makes the url absolute and points at the provider", () => {
    expect(serviceLd("Sitios **web**", "Desc", "/es/sitios-web")).toMatchObject({
      "@type": "Service",
      name: "Sitios web",
      url: SITE_URL + "/es/sitios-web",
      provider: { "@id": ORGANIZATION_ID },
    });
  });

  it("faqPageLd flattens the rich markers into the text the page shows", () => {
    const ld = faqPageLd([{ question: "¿Cuánto **tarda**?", answer: "Dos __semanas__.|Luego más." }]);
    expect(ld).toEqual({
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Cuánto tarda?",
          acceptedAnswer: { "@type": "Answer", text: "Dos semanas. Luego más." },
        },
      ],
    });
  });

  it("breadcrumbLd numbers items from 1 with absolute urls", () => {
    const ld = breadcrumbLd([
      { name: "Inicio", url: "/es" },
      { name: "Guías", url: SITE_URL + "/es/guias" },
    ]);
    expect(ld.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL + "/es" },
      { "@type": "ListItem", position: 2, name: "Guías", item: SITE_URL + "/es/guias" },
    ]);
  });

  it("articleLd credits the founder and defaults dateModified to publish", () => {
    const ld = articleLd({
      locale: "es",
      headline: "Cuánto cuesta",
      description: "Respuesta",
      url: "/es/guias/x",
      datePublished: "2026-10-21",
    });
    expect(ld).toMatchObject({
      "@type": "Article",
      author: { "@id": FOUNDER_ID },
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: "es-MX",
      datePublished: "2026-10-21",
      dateModified: "2026-10-21",
      mainEntityOfPage: SITE_URL + "/es/guias/x",
    });
    expect(ld).not.toHaveProperty("image");
  });

  it("absoluteUrl leaves absolute urls alone", () => {
    expect(absoluteUrl("https://x.test/a")).toBe("https://x.test/a");
    expect(absoluteUrl("a")).toBe(SITE_URL + "/a");
  });
});

describe("escaping", () => {
  const hostile = 'x</script><script>alert(1)</script><!-- & "q" \u2028 end';

  it("serializeLd leaves no < > or & and parses back to the same data", () => {
    const data = ldGraph([{ "@type": "Thing", name: hostile }]);
    const out = serializeLd(data);
    expect(out).not.toMatch(/[<>&\u2028\u2029]/);
    expect(JSON.parse(out)).toEqual(data);
  });

  it("JsonLd renders one script whose content cannot close the tag", () => {
    const html = renderToStaticMarkup(h(JsonLd, { data: { "@type": "Thing", name: hostile } }));
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(html.startsWith('<script type="application/ld+json">')).toBe(true);
    expect(scripts(html)).toEqual([
      { "@context": "https://schema.org", "@graph": [{ "@type": "Thing", name: hostile }] },
    ]);
  });

  it("JsonLd gives a bare node the schema.org context, and leaves a graph as it is", () => {
    const bare = renderToStaticMarkup(h(JsonLd, { data: { "@type": "Service", name: "Sitios" } }));
    expect((scripts(bare)[0] as Record<string, unknown>)["@context"]).toBe("https://schema.org");
    const graph = { "@context": "https://schema.org" as const, "@graph": [{ "@type": "Thing" }] };
    expect(scripts(renderToStaticMarkup(h(JsonLd, { data: graph })))).toEqual([graph]);
  });
});

describe("Faq", () => {
  const items = [
    { question: "¿Cuánto tarda un sitio?", answer: "Entre **dos y cuatro** semanas." },
    { question: "¿Sale en ChatGPT?", answer: "Hacemos el trabajo y lo medimos.|No prometemos el resultado." },
  ];

  it("shows every question and answer, and marks up exactly what it shows", () => {
    const html = renderToStaticMarkup(h(Faq, { title: "Preguntas frecuentes", items }));
    expect(html).toContain("<h2");
    expect(html).toContain("Preguntas frecuentes");
    expect(html.match(/<h3/g)).toHaveLength(items.length);
    expect(html).not.toContain("<details");

    const [ld] = scripts(html) as [{ "@graph": LdNode[] }];
    const page = ld["@graph"][0];
    expect(page["@type"]).toBe("FAQPage");
    const entities = page.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    expect(entities).toHaveLength(items.length);

    // The visible text, tags stripped, holds every marked-up question and answer.
    const visible = html
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<br\/?>/g, " ")
      .replace(/<[^>]+>/g, "");
    for (const e of entities) {
      expect(visible).toContain(e.name);
      expect(visible).toContain(e.acceptedAnswer.text);
    }
  });

  it("renders nothing, and no markup, for an empty list", () => {
    expect(renderToStaticMarkup(h(Faq, { title: "x", items: [] }))).toBe("");
  });
});

describe("wiring", () => {
  it("the locale layout injects the site graph once", () => {
    const src = readFileSync(new URL("../../app/[locale]/layout.tsx", import.meta.url), "utf8");
    expect(src.match(/<JsonLd /g)).toHaveLength(1);
    expect(src).toContain("siteGraph(params.locale)");
  });
});
