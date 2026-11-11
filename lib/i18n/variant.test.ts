import { describe, expect, it } from "vitest";
import { branded, withVariant } from "./variant";

/** The two helpers behind every wine-brand dictionary variant (hq-3f6ut.2). */
describe("withVariant", () => {
  const base = {
    meta: { title: "Base title", description: "Base description" },
    items: [{ h: "one" }, { h: "two" }, { h: "three" }],
    line: "kept",
  };

  it("replaces only the strings the variant names, key by key", () => {
    const out = withVariant(base, { meta: { title: "New title" } });
    expect(out.meta).toEqual({ title: "New title", description: "Base description" });
    expect(out.items).toBe(base.items);
    expect(out.line).toBe("kept");
  });

  it("replaces a list whole, so a dropped entry stays dropped", () => {
    const out = withVariant(base, { items: [{ h: "one" }, { h: "two" }] });
    expect(out.items).toEqual([{ h: "one" }, { h: "two" }]);
  });

  it("leaves the base untouched", () => {
    withVariant(base, { meta: { title: "x" }, line: "y" });
    expect(base.meta.title).toBe("Base title");
    expect(base.line).toBe("kept");
  });
});

describe("branded", () => {
  it("fills every {brand} at any depth with the given name", () => {
    const out = branded({ a: "{brand} home", b: [{ q: "What is {brand}? {brand}." }], n: 3 }, "Marca");
    expect(out).toEqual({ a: "Marca home", b: [{ q: "What is Marca? Marca." }], n: 3 });
  });

  it("leaves a string with no token as it was", () => {
    expect(branded("Cardon Digital", "Marca")).toBe("Cardon Digital");
  });
});
