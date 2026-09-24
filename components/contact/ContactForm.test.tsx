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
import { contact } from "../../lib/i18n/contact";
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
  /* Every key the form POSTs. Most of them are a sentence in the notice:
     what you typed, the language the page was in, the page you were on, the
     campaign marks on that page's address, plus the honeypot. Two are not,
     and cannot be yet: cd_lead_id and cd_first_seen come from the cd_src
     first-touch record, which nothing on this site writes (hq-3hjr9 ships the
     writer), so they leave the browser empty and the notice names no lead id
     and no first-seen time. EMPTY_TODAY below pins them empty for exactly
     that reason: the day the writer lands, this suite goes red and the notice
     gains its sentence in the same change. A field added to either list
     without one is processing the notice does not describe, which is the
     defect this bead was filed for. */
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

  /* Sent on every submission, always empty, and named nowhere in the notice.
     See the note above DISCLOSED. */
  const EMPTY_TODAY = ["cd_lead_id", "cd_first_seen"];

  it("posts exactly the fields the notice describes, and nothing else", async () => {
    page = new Page();
    page.consent("granted");
    page.fill();
    await page.send();

    expect(Object.keys(page.posted[0]).sort()).toEqual(DISCLOSED);
  });

  it("sends the two fields the notice does not name as empty", async () => {
    page = new Page();
    page.consent("granted");
    page.fill();
    await page.send();

    for (const key of EMPTY_TODAY) {
      expect(page.posted[0][key]).toBe("");
    }
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
      const marks =
        locale === "en"
          ? /marks that page's own address was carrying/i
          : /marcas que trajera la dirección de esa misma página/i;
      const log = locale === "en" ? /server log/i : /registro de nuestro servidor/i;
      expect(body).toMatch(landing);
      expect(body).toMatch(marks);
      expect(body).toMatch(log);
    }
  });
});

describe("the notice's own promises about itself", () => {
  /* The form's short line is the only privacy text most visitors read, and
     until this bead it ended "we share it with nobody" while the message
     travelled through a delivery service and a delivered send was reported to
     Google. It now says both, and carries the door to the long version. */
  it("links the short line to the locale's full notice", () => {
    for (const locale of locales) {
      page = new Page(locale);
      const link = page.form.querySelector(
        ".form-privacy a",
      ) as HTMLAnchorElement | null;
      expect(link).not.toBeNull();
      expect(link!.getAttribute("href")).toBe("/" + locale + "/privacy");
      expect(link!.textContent?.trim().length ?? 0).toBeGreaterThan(0);
      page.destroy();
      page = null;
    }
  });

  it("does not claim the message reaches nobody else", () => {
    for (const locale of locales) {
      const line = contact[locale].form.privacy.body;
      expect(line).not.toMatch(
        locale === "en" ? /share it with nobody/i : /no lo compartimos con nadie/i,
      );
      // The two things that sentence used to hide.
      expect(line).toMatch(
        locale === "en" ? /delivers this site's mail/i : /entrega el correo de este sitio/i,
      );
      expect(line).toMatch(locale === "en" ? /conversion/i : /conversión/i);
    }
  });

  /* The notice's last sentence promises a new effective date whenever what
     this site collects changes. A date alone cannot keep that promise, since
     nothing makes anyone move it, so the date is pinned here beside a digest
     of every section that describes collection. Change what the notice says
     and this test goes red with the digest it now wants; the only way to
     green is to write today's date into both locales and into DATE below. */
  const DATE = { en: "2026-09-24", es: "24 de septiembre de 2026" };
  const DESCRIBES_COLLECTION = [
    "measureBody",
    "measureList",
    "measureWithdraw",
    "deviceBody",
    "contactBody",
    "hostingBody",
    "clientBody",
  ] as const;
  const DIGEST = "0776e16d";

  function digest(text: string): string {
    /* FNV-1a, 32 bit: a short stable number, not a security hash. */
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, "0");
  }

  it("carries the effective date of the last change to what it describes", () => {
    const parts: string[] = [];
    for (const locale of locales) {
      expect(privacy[locale].effective).toContain(DATE[locale]);
      for (const section of DESCRIBES_COLLECTION) {
        const value = privacy[locale][section];
        parts.push(Array.isArray(value) ? value.join("\u0000") : value);
      }
    }
    expect(digest(parts.join("\u0001"))).toBe(DIGEST);
  });

  /* Added to this bead's scope on 2026-09-24 (J-own-20): the notice has to
     say where a client system's data and its backups live. It belongs in the
     client-data section, because none of it is data this site collects. */
  it("says where client-system data and its backups live, in both locales", () => {
    for (const locale of locales) {
      const body = privacy[locale].clientBody;
      const backup = locale === "en" ? /backup/i : /respaldo/i;
      const offsite =
        locale === "en"
          ? /second storage provider/i
          : /segundo proveedor de almacenamiento/i;
      const theirs =
        locale === "en" ? /client's own name/i : /nombre del propio cliente/i;
      const notThisSite =
        locale === "en"
          ? /this website collects or touches/i
          : /este sitio recabe ni toque/i;
      expect(body).toMatch(backup);
      expect(body).toMatch(offsite);
      expect(body).toMatch(theirs);
      expect(body).toMatch(notThisSite);
    }
  });
});
