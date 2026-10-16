import { afterEach, describe, expect, it, vi } from "vitest";

import { buildEmail, deliver, whatsappLink } from "./mail";
import type { ContactSubmission } from "./validate";

/**
 * What a rejected send leaves behind (bead hq-u8n82, round one).
 *
 * The privacy notice says the server log holds the time, the language, the
 * business name and two campaign marks, and never the visitor's address or
 * what they wrote. A provider rejection used to be logged with 400 characters
 * of the provider's own answer, which quotes the request back and therefore
 * can carry both. The notice cannot be made true by the route alone: the line
 * this module writes has to be redacted too.
 */

const EMAIL = {
  from: "hola@cardondigital.com",
  to: "daniel@cardondigital.com",
  replyTo: "ana@bodegaejemplo.mx",
  subject: "Contacto: Bodega Ejemplo, Ana",
  text: "Queremos ordenar las anadas de las ultimas tres cosechas.",
};

/** A rejection shaped the way Resend answers one, quoting the request. */
const REJECTION = JSON.stringify({
  statusCode: 422,
  name: "validation_error",
  message:
    "Invalid `reply_to` field. ana@bodegaejemplo.mx is not a verified address. Body: Queremos ordenar las anadas.",
});

function stub(body: string) {
  const logged: unknown[][] = [];
  vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    logged.push(args);
  });
  vi.stubGlobal("fetch", async () => ({
    ok: false,
    status: 422,
    text: async () => body,
    json: async () => ({}),
  }));
  process.env.RESEND_API_KEY = "re_test_only";
  return logged;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env.RESEND_API_KEY;
});

describe("what a refused send writes to the log", () => {
  it("keeps the provider's error name and nothing else it said", async () => {
    const logged = stub(REJECTION);

    const result = await deliver(EMAIL);

    expect(result).toMatchObject({ ok: false, status: 422, detail: "validation_error" });
    expect(logged).toHaveLength(1);
    const line = logged[0].map(String).join(" ");
    expect(line).toContain("422");
    expect(line).toContain("validation_error");
    // The two things the notice promises are never in a log line.
    expect(line).not.toContain(EMAIL.replyTo);
    expect(line).not.toContain("Queremos ordenar");
  });

  it("says only that it was rejected when the body is not the provider's", async () => {
    const logged = stub("<html><body>502 Bad Gateway ana@bodegaejemplo.mx</body></html>");

    const result = await deliver(EMAIL);

    expect(result).toMatchObject({ detail: "rejected" });
    expect(logged[0].map(String).join(" ")).not.toContain(EMAIL.replyTo);
  });
});

const LEAD: ContactSubmission = {
  name: "Ana <b>Ruiz</b>",
  winery: "Bodega \"Ejemplo\"",
  email: "ana@bodegaejemplo.mx",
  whatsapp: "646 227 8690",
  message: "Hola <script>alert(1)</script>\nSegunda linea",
  locale: "es",
  attribution: { leadId: "", gclid: "", lane: "", campaign: "", landing: "/es/contacto", firstSeen: "" },
  package: null,
};

describe("the lead email a person reads", () => {
  it("names who wrote in the subject", () => {
    expect(buildEmail(LEAD).subject).toBe('New lead: Ana <b>Ruiz</b> (Bodega "Ejemplo")');
  });

  it("escapes everything the visitor typed in the HTML body", () => {
    const html = buildEmail(LEAD).html ?? "";
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>Ruiz");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("Bodega &quot;Ejemplo&quot;");
  });

  it("leaves out the source marks that are empty", () => {
    const { text, html } = buildEmail(LEAD);
    expect(text).toContain("Landing page: /es/contacto");
    expect(text).not.toContain("gclid");
    expect(text).not.toContain("none");
    expect(html).not.toContain("Google click id");
  });

  it("links WhatsApp, adding Mexico's code to a ten digit number", () => {
    expect(whatsappLink("646 227 8690")).toBe("https://wa.me/526462278690");
    expect(whatsappLink("+1 619 555 0100")).toBe("https://wa.me/16195550100");
    expect(whatsappLink("52 646 227 8690")).toBe("https://wa.me/526462278690");
    expect(whatsappLink("+47 912 34 567")).toBe("https://wa.me/4791234567");
    expect(whatsappLink("12345")).toBe("");
    expect(buildEmail(LEAD).html).toContain('href="https://wa.me/526462278690"');
  });

  it("percent-encodes the reply address inside the mailto link", () => {
    const html = buildEmail({ ...LEAD, email: "ana%ventas@bodega.mx" }).html ?? "";
    expect(html).toContain('href="mailto:ana%25ventas@bodega.mx"');
    expect(html).not.toContain('href="mailto:ana%ventas');
  });
});
