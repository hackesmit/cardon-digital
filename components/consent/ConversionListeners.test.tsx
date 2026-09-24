// @vitest-environment jsdom
import { act } from "react";
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The other two doors, and the written door in its mailto shape (bead
 * hq-u8n82).
 *
 * The privacy notice promises three counted actions. ContactForm.test.tsx
 * holds the form half; this holds the click half, so the whole sentence in
 * lib/i18n/privacy.ts has a test behind it rather than a reading of the
 * listener's source.
 */

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_GA4_ID = "G-TESTONLY";
});

(globalThis as unknown as { React: typeof React }).React = React;

import ConversionListeners from "./ConversionListeners";
import { CONSENT_COOKIE } from "../../lib/analytics/consent";

let root: Root | null = null;
let container: HTMLDivElement | null = null;
let calls: unknown[][] = [];

/** Mounts the listener over a page of links and returns a click function. */
function page(): (href: string) => void {
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.appendChild(container);
  // jsdom refuses to navigate and says so on stderr; the click is the whole
  // stimulus here, so the default action is dropped once the listener has run.
  container.addEventListener("click", (e) => e.preventDefault());
  (window as unknown as { gtag: (...a: unknown[]) => void }).gtag = (...a) => {
    calls.push(a);
  };

  const host = document.createElement("div");
  container.appendChild(host);
  root = createRoot(host);
  act(() => root!.render(<ConversionListeners />));

  return (href: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = "door";
    container!.appendChild(a);
    act(() => a.click());
  };
}

const named = (name: string) => calls.filter((c) => c[0] === "event" && c[1] === name);

beforeEach(() => {
  calls = [];
  document.cookie = CONSENT_COOKIE + "=; path=/; max-age=0";
});

afterEach(() => {
  if (root) act(() => root!.unmount());
  container?.remove();
  root = null;
  container = null;
  delete (window as unknown as { gtag?: unknown }).gtag;
});

describe("the three actions the privacy notice says are counted", () => {
  it("counts a contact link that opens the visitor's email client", () => {
    const click = page();
    document.cookie = CONSENT_COOKIE + "=granted; path=/; max-age=600";
    click("mailto:daniel@cardondigital.com?subject=Hola");

    expect(named("contact_submit")).toHaveLength(1);
    expect(named("contact_submit")[0][2]).toMatchObject({ method: "email" });
  });

  it("counts opening WhatsApp and opening the booking link, once each", () => {
    const click = page();
    document.cookie = CONSENT_COOKIE + "=granted; path=/; max-age=600";
    click("https://wa.me/526462278690?text=Hola");
    click("https://calendar.app.google/abc123");

    expect(named("whatsapp_click")).toHaveLength(1);
    expect(named("booking_click")).toHaveLength(1);
  });

  it("counts none of them without consent, which is what the notice promises", () => {
    const click = page();
    document.cookie = CONSENT_COOKIE + "=denied; path=/; max-age=600";
    click("mailto:daniel@cardondigital.com");
    click("https://wa.me/526462278690");
    click("https://calendar.app.google/abc123");

    expect(calls).toHaveLength(0);
  });

  it("counts nothing for an ordinary link, so the three stay three", () => {
    const click = page();
    document.cookie = CONSENT_COOKIE + "=granted; path=/; max-age=600";
    click("/es/precios");
    click("https://example.com/algo");

    expect(calls).toHaveLength(0);
  });
});
