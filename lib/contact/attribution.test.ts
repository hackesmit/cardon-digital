// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";

import { AI_SOURCES, aiSource, forgetLanding, readAttribution, rememberLanding } from "./attribution";
import { validateSubmission } from "./validate";

/**
 * Leads that arrive from an AI answer (bead hq-i4b5.3).
 *
 * The AEO plan's first measurement is how many conversations start in an
 * assistant's answer. The source is classified in the browser, from the page
 * that linked here and from ChatGPT's own utm_source, and only the label
 * leaves it: never the referring address itself.
 */

describe("aiSource, from the referring page", () => {
  const cases: [string, string][] = [
    ["https://chatgpt.com/", "ai:chatgpt"],
    ["https://chat.openai.com/c/abc", "ai:chatgpt"],
    ["https://www.perplexity.ai/search?q=web", "ai:perplexity"],
    ["https://perplexity.ai/", "ai:perplexity"],
    ["https://gemini.google.com/app", "ai:gemini"],
    ["https://copilot.microsoft.com/", "ai:copilot"],
    ["https://claude.ai/chat/1", "ai:claude"],
    ["HTTPS://ChatGPT.com/", "ai:chatgpt"],
  ];

  for (const [referrer, label] of cases) {
    it(`reads ${referrer} as ${label}`, () => {
      expect(aiSource(referrer, "")).toBe(label);
    });
  }

  it("leaves a referrer that is not an assistant unlabelled", () => {
    expect(aiSource("https://www.google.com/", "")).toBe("");
    expect(aiSource("https://cardondigital.com/es", "")).toBe("");
    // Google's own search is not Gemini, even though Gemini lives under it.
    expect(aiSource("https://google.com/", "")).toBe("");
  });

  it("leaves an empty or unreadable referrer unlabelled", () => {
    expect(aiSource("", "")).toBe("");
    expect(aiSource("not a url", "")).toBe("");
    expect(aiSource("android-app://com.openai.chatgpt", "")).toBe("");
  });

  it("does not match a lookalike host", () => {
    expect(aiSource("https://chatgpt.com.evil.example/", "")).toBe("");
    expect(aiSource("https://evilchatgpt.com/", "")).toBe("");
    expect(aiSource("https://claude.ai.evil.example/", "")).toBe("");
    expect(aiSource("https://evil.example/?ref=chatgpt.com", "")).toBe("");
    expect(aiSource("https://chatgpt.com@evil.example/", "")).toBe("");
  });
});

describe("aiSource, from utm_source", () => {
  it("reads ChatGPT's utm_source=chatgpt.com", () => {
    expect(aiSource("", "chatgpt.com")).toBe("ai:chatgpt");
  });

  it("reads the other assistants' hosts the same way", () => {
    expect(aiSource("", "perplexity.ai")).toBe("ai:perplexity");
    expect(aiSource("", "claude.ai")).toBe("ai:claude");
  });

  it("does not match a lookalike or unrelated utm_source", () => {
    expect(aiSource("", "chatgpt.com.evil.example")).toBe("");
    expect(aiSource("", "newsletter")).toBe("");
    expect(aiSource("", "google")).toBe("");
  });

  it("lets the referrer answer when the utm_source is not an assistant", () => {
    expect(aiSource("https://claude.ai/", "newsletter")).toBe("ai:claude");
  });
});

describe("readAttribution carries the label", () => {
  const referrer = Object.getOwnPropertyDescriptor(Document.prototype, "referrer");

  function landFrom(ref: string, search = "") {
    Object.defineProperty(document, "referrer", { configurable: true, get: () => ref });
    window.history.replaceState(null, "", "/es/contacto" + search);
  }

  afterEach(() => {
    delete (document as unknown as Record<string, unknown>).referrer;
    if (referrer) Object.defineProperty(Document.prototype, "referrer", referrer);
    window.history.replaceState(null, "", "/");
    window.localStorage.clear();
    forgetLanding();
  });

  it("keeps ChatGPT's utm_source after a client-side move to the form", () => {
    // Land on the home page from a noreferrer answer link, then navigate.
    Object.defineProperty(document, "referrer", { configurable: true, get: () => "" });
    window.history.replaceState(null, "", "/es?utm_source=chatgpt.com");
    rememberLanding(window.location.search, document.referrer);
    window.history.pushState(null, "", "/es/contacto");
    expect(readAttribution().cd_source).toBe("ai:chatgpt");
    expect(window.localStorage.length).toBe(0);
  });

  it("keeps the landing engine when the referrer names another one", () => {
    Object.defineProperty(document, "referrer", { configurable: true, get: () => "https://claude.ai/" });
    window.history.replaceState(null, "", "/es?utm_source=chatgpt.com");
    expect(readAttribution().cd_source).toBe("ai:chatgpt");
    rememberLanding(window.location.search, document.referrer);
    window.history.pushState(null, "", "/es/contacto");
    expect(readAttribution().cd_source).toBe("ai:chatgpt");
  });

  it("remembers only the first landing of the document", () => {
    rememberLanding("?utm_source=perplexity.ai", "");
    rememberLanding("?utm_source=chatgpt.com", "");
    landFrom("");
    expect(readAttribution().cd_source).toBe("ai:perplexity");
  });

  it("labels a visit referred by an assistant", () => {
    landFrom("https://chatgpt.com/");
    expect(readAttribution().cd_source).toBe("ai:chatgpt");
  });

  it("labels a visit carrying ChatGPT's utm_source", () => {
    landFrom("", "?utm_source=chatgpt.com");
    expect(readAttribution().cd_source).toBe("ai:chatgpt");
  });

  it("leaves every other source as it was", () => {
    landFrom("https://www.google.com/", "?utm_campaign=web&gclid=abc");
    const a = readAttribution();
    expect(a.cd_source).toBe("");
    expect(a.cd_campaign).toBe("web");
    expect(a.cd_gclid).toBe("abc");
    expect(a.cd_landing).toBe("/es/contacto");
  });

  it("reads the utm_source a stored first touch kept", () => {
    landFrom("");
    window.localStorage.setItem("cd_src", JSON.stringify({ utm_source: "perplexity.ai" }));
    expect(readAttribution().cd_source).toBe("ai:perplexity");
  });

  it("writes nothing to the browser", () => {
    landFrom("https://chatgpt.com/");
    const cookie = document.cookie;
    readAttribution();
    expect(window.localStorage.length).toBe(0);
    expect(document.cookie).toBe(cookie);
  });
});

describe("the server keeps only a known label", () => {
  const base = {
    name: "Ana",
    email: "ana@bodegaejemplo.mx",
    message: "Queremos ordenar las anadas.",
    locale: "es",
  };

  it("accepts every label the browser can send", () => {
    for (const label of AI_SOURCES) {
      const r = validateSubmission({ ...base, cd_source: label });
      expect(r.ok && r.value.attribution.source).toBe(label);
    }
  });

  it("drops anything else a caller writes there", () => {
    for (const forged of ["ai:evil", "chatgpt", "ai:chatgpt\nBcc: x", "<b>ai:claude</b>", 3]) {
      const r = validateSubmission({ ...base, cd_source: forged });
      expect(r.ok && r.value.attribution.source).toBe("");
    }
  });
});
