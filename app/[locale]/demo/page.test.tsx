import { describe, expect, it, vi } from "vitest";

const { redirect } = vi.hoisted(() => ({ redirect: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect }));

import DemoPage from "./page";
import { DEMO_HOST } from "../../../lib/demo";
import { locales } from "../../../lib/i18n/config";

describe("app/[locale]/demo", () => {
  it.each(locales)(
    "redirects %s straight to the live demo with all three modules",
    (locale) => {
      redirect.mockClear();
      DemoPage({ params: { locale } });
      expect(redirect).toHaveBeenCalledWith(
        `${DEMO_HOST}/?modulos=produccion,hospitalidad,restaurante`,
      );
    },
  );

  it("falls back to the es locale for an unknown segment", () => {
    redirect.mockClear();
    DemoPage({ params: { locale: "fr" } });
    expect(redirect).toHaveBeenCalledWith(
      `${DEMO_HOST}/?modulos=produccion,hospitalidad,restaurante`,
    );
  });
});
