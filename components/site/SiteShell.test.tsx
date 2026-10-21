import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// The classic JSX runtime vitest uses resolves a global React (see Media.test.tsx).
(globalThis as unknown as { React: typeof React }).React = React;

/**
 * The shell mounts the cookieless visit counter on every page, and the Google
 * tag stays behind its consent cookie (bead hq-i4b5.18). The counter itself
 * renders nothing on the server, so it is stood in for by a marker that says
 * which hook it was handed.
 */

let consent: string | undefined;

vi.mock("next/headers", () => ({
  cookies: () => ({ get: () => (consent ? { value: consent } : undefined) }),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/es",
  useRouter: () => ({ push: () => {}, replace: () => {}, refresh: () => {} }),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));
vi.mock("@/lib/fonts", () => ({ fontVariables: "" }));
vi.mock("@vercel/analytics/next", async () => {
  const { visitEvent } = await import("@/lib/analytics/visits");
  return {
    Analytics: ({ beforeSend }: { beforeSend?: unknown }) => (
      <i data-visit-count={beforeSend === visitEvent ? "cut" : "raw"} />
    ),
  };
});

process.env.NEXT_PUBLIC_GA4_ID = "G-TESTONLY";
process.env.NEXT_PUBLIC_MEASUREMENT = "1";

async function shell() {
  const { default: SiteShell } = await import("./SiteShell");
  return renderToStaticMarkup(<SiteShell locale="es">{null}</SiteShell>);
}

describe("SiteShell measurement", () => {
  it("counts the visit with the address cut, and loads no Google tag without consent", async () => {
    consent = undefined;
    const html = await shell();
    expect(html).toContain('data-visit-count="cut"');
    expect(html).not.toContain("googletagmanager");
  });

  it("counts the visit after consent too, beside the Google tag", async () => {
    consent = "granted";
    const html = await shell();
    expect(html).toContain('data-visit-count="cut"');
    expect(html).toContain("googletagmanager");
  });
});
