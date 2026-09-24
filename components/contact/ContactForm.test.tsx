// @vitest-environment jsdom
import { act } from "react";
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * What the contact form really does, held against what the privacy notice
 * says it does (bead hq-u8n82).
 *
 * The notice promised a conversion the form never reported and described the
 * written door as mail-only, so this suite is written from the notice's own
 * sentences: one conversion per DELIVERED message and none for an attempt,
 * nothing at all without consent, and exactly the fields the notice
 * enumerates leaving the browser. A claim in lib/i18n/privacy.ts that no test
 * can fail is how the first two got there.
 */

/* The measurement ids are read once, at module scope, as literal
   process.env.NEXT_PUBLIC_* members (lib/analytics/config.ts says why), so
   they have to exist before the first import rather than inside a beforeEach.
   vi.hoisted is the only thing that runs earlier than a static import. */
vi.hoisted(() => {
  process.env.NEXT_PUBLIC_GA4_ID = "G-TESTONLY";
  process.env.NEXT_PUBLIC_ADS_ID = "AW-000000000";
  process.env.NEXT_PUBLIC_ADS_LABEL_CONTACT = "testLabel";
});

// vitest compiles this app's JSX with the classic runtime, so the components
// below resolve a global React. Test-only, the same shim Media.test.tsx uses.
(globalThis as unknown as { React: typeof React }).React = React;

import ConversionListeners from "../consent/ConversionListeners";
import ContactForm from "./ContactForm";
import { CONSENT_COOKIE } from "../../lib/analytics/consent";
import { LocaleProvider } from "../../lib/i18n/LocaleProvider";
import { locales, type Locale } from "../../lib/i18n/config";
import { privacy } from "../../lib/i18n/privacy";
import { HONEYPOT_FIELD } from "../../lib/contact/validate";

type GtagCall = unknown[];

/** One mounted page: the form, and the document-level listener beside it. */
class Page {
  container = document.createElement("div");
  root: Root;
  /** Every gtag argument list, in order, so a double count is visible. */
  calls: GtagCall[] = [];
  /** Every body POSTed to /api/contact, parsed. */
  posted: Record<string, unknown>[] = [];
  reply: { ok: boolean; status: number } = { ok: true, status: 200 };
  /** Set when the network itself fails rather than the server answering. */
  offline = false;

  constructor(locale: Locale = "es") {
    // Without this React runs the updates but warns on every act call, and
    // the warning would bury a real one. Same flag world.tsx sets.
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    document.body.appendChild(this.container);
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag = (...a) => {
      this.calls.push(a);
    };
    vi.stubGlobal("fetch", async (_url: string, init: { body: string }) => {
      this.posted.push(JSON.parse(init.body) as Record<string, unknown>);
      if (this.offline) throw new Error("network down");
      return {
        ok: this.reply.ok,
        status: this.reply.status,
        json: async () => ({}),
      };
    });
    this.root = createRoot(this.container);
    act(() => {
      this.root.render(
        <LocaleProvider locale={locale}>
          <ConversionListeners />
          <ContactForm />
        </LocaleProvider>,
      );
    });
  }

  consent(decision: "granted" | "denied" | null): void {
    document.cookie =
      CONSENT_COOKIE + "=" + (decision ?? "") + "; path=/; max-age=" + (decision ? 600 : 0);
  }

  get form(): HTMLFormElement {
    return this.container.querySelector("form") as HTMLFormElement;
  }

  fill(values: Partial<Record<string, string>> = {}): void {
    const filled: Record<string, string> = {
      name: "Ana Robles",
      email: "ana@bodegaejemplo.mx",
      message: "Queremos ordenar las anadas de las ultimas tres cosechas.",
      ...values,
    };
    for (const [field, value] of Object.entries(filled)) {
      const el = this.container.querySelector(
        "#contact-" + field,
      ) as HTMLInputElement | HTMLTextAreaElement | null;
      if (!el) continue;
      act(() => {
        const setter = Object.getOwnPropertyDescriptor(
          el instanceof HTMLTextAreaElement
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype,
          "value",
        )!.set!;
        setter.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
  }

  /** Submits the way a person does: the submit button, not form.submit(). */
  async send(): Promise<void> {
    const button = this.container.querySelector(
      "button[type=submit]",
    ) as HTMLButtonElement;
    await act(async () => {
      button.click();
    });
  }

  /** The GA4 contact event, however many times it was sent. */
  get contactEvents(): GtagCall[] {
    return this.calls.filter((c) => c[0] === "event" && c[1] === "contact_submit");
  }

  /** The Google Ads half, which only fires when a label is configured. */
  get adsConversions(): GtagCall[] {
    return this.calls.filter((c) => c[0] === "event" && c[1] === "conversion");
  }

  get sent(): boolean {
    return this.container.querySelector(".form-sent") !== null;
  }

  destroy(): void {
    act(() => this.root.unmount());
    this.container.remove();
  }
}

let page: Page | null = null;

beforeEach(() => {
  document.cookie = CONSENT_COOKIE + "=; path=/; max-age=0";
});

afterEach(() => {
  page?.destroy();
  page = null;
  vi.unstubAllGlobals();
  delete (window as unknown as { gtag?: unknown }).gtag;
});

describe("the contact form as a counted conversion", () => {
  it("reports exactly one conversion for a delivered message", async () => {
    page = new Page();
    page.consent("granted");
    page.fill();
    await page.send();

    expect(page.sent).toBe(true);
    expect(page.contactEvents).toHaveLength(1);
    expect(page.contactEvents[0][2]).toMatchObject({ method: "form" });
    // The Ads half is the Primary action the ads plan bids on.
    expect(page.adsConversions).toHaveLength(1);
    expect(page.adsConversions[0][2]).toMatchObject({
      send_to: "AW-000000000/testLabel",
    });
  });

  it("reports nothing when consent was denied", async () => {
    page = new Page();
    page.consent("denied");
    page.fill();
    await page.send();

    expect(page.sent).toBe(true);
    expect(page.calls).toHaveLength(0);
  });

  it("reports nothing while the question is still unanswered", async () => {
    page = new Page();
    page.consent(null);
    page.fill();
    await page.send();

    expect(page.sent).toBe(true);
    expect(page.calls).toHaveLength(0);
  });

  it("counts the message that arrived, not the attempt: a refused send is not a lead", async () => {
    page = new Page();
    page.consent("granted");
    page.reply = { ok: false, status: 502 };
    page.fill();
    await page.send();

    expect(page.posted).toHaveLength(1);
    expect(page.sent).toBe(false);
    expect(page.calls).toHaveLength(0);
  });

  it("counts nothing when the network never answers", async () => {
    page = new Page();
    page.consent("granted");
    page.offline = true;
    page.fill();
    await page.send();

    expect(page.sent).toBe(false);
    expect(page.calls).toHaveLength(0);
  });

  it("counts nothing for a submission its own validation refuses", async () => {
    page = new Page();
    page.consent("granted");
    page.fill({ email: "not-an-address" });
    await page.send();

    expect(page.posted).toHaveLength(0);
    expect(page.calls).toHaveLength(0);
  });

  it("stays one conversion for a visitor who fixes a field and tries again", async () => {
    page = new Page();
    page.consent("granted");
    page.fill({ email: "not-an-address" });
    await page.send();
    page.fill();
    await page.send();

    expect(page.sent).toBe(true);
    expect(page.contactEvents).toHaveLength(1);
  });

  /* The delegated listener counts a form marked with id="contact-form" or
     data-conversion="contact" on the submit event, which fires on every
     attempt. This form reports its own delivery instead, so carrying either
     marker would count the same lead twice. The test above would catch the
     duplicate; this one names the reason, so the next reader sees why the
     markers are missing on purpose. */
  it("carries neither marker the delegated listener counts on", () => {
    page = new Page();
    expect(page.form.id).not.toBe("contact-form");
    expect(page.form.hasAttribute("data-conversion")).toBe(false);
  });
});

describe("the privacy notice against what leaves the browser", () => {
  /* Exactly the fields the notice enumerates: what you typed, the language
     the page was in, the page you were on and the marks the link carried,
     plus the honeypot. A field added here without a matching sentence in
     lib/i18n/privacy.ts is processing the notice does not describe, which is
     the defect this bead was filed for. */
  const DISCLOSED = [
    "name",
    "winery",
    "email",
    "whatsapp",
    "message",
    "locale",
    "cd_lead_id",
    "cd_gclid",
    "cd_lane",
    "cd_campaign",
    "cd_landing",
    "cd_first_seen",
    HONEYPOT_FIELD,
  ].sort();

  it("posts exactly the fields the notice describes, and nothing else", async () => {
    page = new Page();
    page.consent("granted");
    page.fill();
    await page.send();

    expect(Object.keys(page.posted[0]).sort()).toEqual(DISCLOSED);
  });

  it("names both shapes of the written door, in both locales", () => {
    for (const locale of locales) {
      const body = privacy[locale].contactBody;
      const form = locale === "en" ? /contact form/i : /formulario de contacto/i;
      const mail = locale === "en" ? /email client/i : /programa de correo/i;
      expect(body).toMatch(form);
      expect(body).toMatch(mail);
      // The claim this bead removed: the links, and only the links.
      expect(body).not.toMatch(
        locale === "en"
          ? /^The contact links on this site open your own email client\./
          : /^Los enlaces de contacto de este sitio abren su propio programa de correo\./,
      );
    }
  });

  it("names what the form sends besides the message, in both locales", () => {
    for (const locale of locales) {
      const body = privacy[locale].contactBody;
      const landing = locale === "en" ? /the page you were on/i : /la página en la que estaba/i;
      const marks = locale === "en" ? /marks the link you arrived by/i : /marcas que trajera el enlace/i;
      const log = locale === "en" ? /server log/i : /registro de nuestro servidor/i;
      expect(body).toMatch(landing);
      expect(body).toMatch(marks);
      expect(body).toMatch(log);
    }
  });
});
