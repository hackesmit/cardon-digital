import { describe, expect, it } from "vitest";
import { llmsTxt } from "./llms";
import { GET } from "./route";
import sitemap from "../sitemap";
import { home } from "@/lib/i18n/home";
import { sitios } from "@/lib/i18n/sitios";
import { precios } from "@/lib/i18n/precios";
import { SITE_URL } from "@/lib/i18n/metadata";

/**
 * /llms.txt (bead hq-i4b5.2): the llmstxt.org shape, a page list that is the
 * sitemap's and nothing else, and no sentence the site does not already say,
 * which holds because every line is read out of the page dictionaries.
 */

const text = llmsTxt("formOnly");
const links = Array.from(text.matchAll(/\]\((https:[^)]+)\)/g)).map((m) => m[1]);

describe("llms.txt", () => {
  it("opens with the H1 name and a blockquote summary", () => {
    const lines = text.split("\n");
    expect(lines[0]).toBe("# Cardon Digital");
    expect(lines[2]).toBe("> " + home.es.meta.description);
  });

  it("links every page in the sitemap, both locales, and no other", () => {
    const listed = sitemap().map((e) => e.url).sort();
    expect([...links].sort()).toEqual(listed);
  });

  it("describes pages in their own words", () => {
    expect(text).toContain(`[${sitios.es.meta.title}](${SITE_URL}/es/sitios-web): ${sitios.es.meta.description}`);
    expect(text).toContain(`(${SITE_URL}/en/precios): ${precios.en.meta.description}`);
  });

  it("is plain prose: no em dashes, no unfilled values", () => {
    expect(text).not.toContain("—");
    expect(text).not.toMatch(/undefined|\[object/);
  });
});

describe("GET /llms.txt", () => {
  it("serves the text as plain UTF-8", async () => {
    const res = GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await res.text()).toMatch(/^# Cardon Digital\n/);
  });

  it("has nothing to describe behind the pre-launch gate", () => {
    const previous = process.env.COMING_SOON;
    process.env.COMING_SOON = "1";
    try {
      expect(GET().status).toBe(404);
    } finally {
      if (previous === undefined) delete process.env.COMING_SOON;
      else process.env.COMING_SOON = previous;
    }
  });
});
