import { describe, expect, it } from "vitest";
import robots, { AI_CRAWLERS } from "./robots";

/**
 * Answer engines are let in by name (bead hq-i4b5.2). A crawler that finds a
 * group with its own name obeys that group and ignores the * one, so each
 * named group must say exactly what * says, or naming a bot would quietly
 * narrow what it may read.
 */

const { rules, sitemap } = robots();
const groups = Array.isArray(rules) ? rules : [rules];
const agents = (g: (typeof groups)[number]) => [g.userAgent ?? []].flat();
const wildcard = groups.find((g) => agents(g).includes("*"));

describe("robots", () => {
  it("still allows everyone everything and disallows nothing", () => {
    expect(wildcard?.allow).toBe("/");
    for (const g of groups) expect(g.disallow, agents(g).join()).toBeUndefined();
  });

  it("names every AI crawler the bead lists, once each", () => {
    const named = groups.flatMap(agents).filter((a) => a !== "*");
    expect(named.sort()).toEqual(
      [
        "OAI-SearchBot",
        "GPTBot",
        "ChatGPT-User",
        "PerplexityBot",
        "Perplexity-User",
        "ClaudeBot",
        "Claude-SearchBot",
        "Claude-User",
        "Google-Extended",
        "Applebot-Extended",
        "Bingbot",
      ].sort(),
    );
    expect(named.sort()).toEqual([...AI_CRAWLERS].sort());
  });

  it("gives each named crawler the same rules as *", () => {
    for (const g of groups) {
      expect({ allow: g.allow, disallow: g.disallow }, agents(g).join()).toEqual({
        allow: wildcard?.allow,
        disallow: wildcard?.disallow,
      });
    }
  });

  it("points at the sitemap", () => {
    expect(sitemap).toBe("https://cardondigital.com/sitemap.xml");
  });
});
