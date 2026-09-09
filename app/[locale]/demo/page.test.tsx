import { afterEach, describe, expect, it, vi } from "vitest";
import React from "react";

// vitest transforms this app's JSX with the classic runtime, so the holding
// page's createElement calls resolve a global React; Next itself uses the
// automatic runtime and needs no import. This shim is test-only.
(globalThis as unknown as { React: typeof React }).React = React;

const { redirect } = vi.hoisted(() => ({ redirect: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect }));

import DemoPage from "./page";
import { DEMO_HOST, DEMO_PATH } from "../../../lib/demo";
import { locales, localePath } from "../../../lib/i18n/config";

// The route must never send the visitor back to its own path. While the host
// is set it redirects off site; while it is cleared it renders the holding
// page instead of redirecting to /demo (which would loop). Both states are
// covered here (bead hq-wrig5.18).
describe("app/[locale]/demo", () => {
  describe("host set (live)", () => {
    afterEach(() => redirect.mockClear());

    it.each(locales)(
      "redirects %s straight to the live demo with all three modules",
      (locale) => {
        DemoPage({ params: { locale } });
        const target = redirect.mock.calls[0][0];
        expect(target).toBe(
          `${DEMO_HOST}/?modulos=produccion,hospitalidad,restaurante`,
        );
        // Never the route's own path.
        expect(target).not.toBe(localePath(locale, DEMO_PATH));
      },
    );

    it("falls back to the es locale for an unknown segment", () => {
      DemoPage({ params: { locale: "fr" } });
      expect(redirect).toHaveBeenCalledWith(
        `${DEMO_HOST}/?modulos=produccion,hospitalidad,restaurante`,
      );
    });
  });

  describe("host cleared", () => {
    afterEach(() => {
      redirect.mockClear();
      vi.resetModules();
    });

    // Re-import the page with DEMO_HOST forced empty (and demoIsLive derived
    // from it), so the cleared branch is exercised with the real page logic.
    async function clearedPage() {
      vi.resetModules();
      vi.doMock("../../../lib/demo", async () => {
        const actual = await vi.importActual<typeof import("../../../lib/demo")>(
          "../../../lib/demo",
        );
        return { ...actual, DEMO_HOST: "", demoIsLive: false };
      });
      return (await import("./page")).default;
    }

    it.each(locales)(
      "renders the holding page for %s and does not redirect to itself",
      async (locale) => {
        const Page = await clearedPage();
        const out = Page({ params: { locale } });
        // A rendered element, not the undefined a redirect() call returns.
        expect(out).toBeTruthy();
        expect(redirect).not.toHaveBeenCalled();
      },
    );
  });
});
