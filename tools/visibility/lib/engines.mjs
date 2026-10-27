/**
 * engines: one call per engine, and pure parsers that turn a raw response body
 * into { text, citations: [url], usage: { input, output, searches } }.
 *
 * The raw body is what gets stored per run, so the parsers can be re-run on
 * old answers when they improve; they never see a key.
 *
 *   openai  Responses API with the web_search tool and an approximate user
 *           location from the prompt (country, region, city).
 *   gemini  generateContent with the google_search grounding tool. The API has
 *           no location parameter, so the city in the prompt text is all the
 *           locality signal it gets.
 *
 * Keys travel in headers only (never a query string), so no url that reaches a
 * log or an error message carries one.
 */

const OPENAI_URL = "https://api.openai.com/v1/responses";
const GEMINI_URL = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

/** Removes anything that looks like a key from a string bound for a log. */
export function redact(s, keys = []) {
  let out = String(s);
  for (const k of keys) if (k && k.length > 8) out = out.split(k).join("[redacted]");
  return out.replace(/\b(sk-[A-Za-z0-9_-]{6})[A-Za-z0-9_*-]+/g, "$1[redacted]").replace(/\bAIza[0-9A-Za-z_-]{10,}/g, "AIza[redacted]").replace(/\bAQ\.[0-9A-Za-z_.-]{10,}/g, "AQ.[redacted]");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * POSTs JSON with retries on 429 and 5xx (exponential backoff, honouring
 * Retry-After). Throws a redacted error on the last failure.
 */
export async function postJson(url, headers, body, { retries = 5, keys = [], fetchImpl = fetch } = {}) {
  let last;
  for (let attempt = 0; attempt <= retries; attempt++) {
    let res;
    try {
      res = await fetchImpl(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
    } catch (e) {
      last = new Error(redact(`network: ${e.message}`, keys));
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    const txt = await res.text();
    if (res.ok) return JSON.parse(txt);
    last = new Error(redact(`HTTP ${res.status}: ${txt.slice(0, 400)}`, keys));
    if (res.status !== 429 && res.status < 500) throw last;
    const ra = Number(res.headers.get("retry-after"));
    await sleep(Number.isFinite(ra) && ra > 0 ? ra * 1000 : Math.min(60000, 2000 * 2 ** attempt));
  }
  throw last;
}

/** Strips tracking parameters that the engines append to cited urls. */
export function cleanUrl(url) {
  try {
    const u = new URL(url);
    for (const p of [...u.searchParams.keys()]) if (/^utm_/.test(p)) u.searchParams.delete(p);
    return u.toString();
  } catch {
    return url;
  }
}

export function parseOpenAI(body) {
  const out = body.output || [];
  const msgs = out.filter((o) => o.type === "message");
  const parts = msgs.flatMap((m) => m.content || []).filter((c) => c.type === "output_text");
  const text = parts.map((p) => p.text).join("\n");
  const citations = [...new Set(parts.flatMap((p) => p.annotations || []).filter((a) => a.type === "url_citation").map((a) => cleanUrl(a.url)))];
  // Sources the search returned but the answer did not cite inline are not
  // citations; only url_citation annotations count.
  const u = body.usage || {};
  return {
    text,
    citations,
    usage: {
      input: u.input_tokens || 0,
      cachedInput: u.input_tokens_details?.cached_tokens || 0,
      output: u.output_tokens || 0,
      searches: out.filter((o) => o.type === "web_search_call").length,
    },
    model: body.model || null,
  };
}

export function parseGemini(body) {
  const cand = (body.candidates || [])[0] || {};
  const text = (cand.content?.parts || []).map((p) => p.text || "").join("");
  const gm = cand.groundingMetadata || {};
  // Each chunk's uri is a Google redirect; resolveGemini() stores the target in
  // `resolved`. The chunk title is usually the bare domain, the fallback.
  const citations = [...new Set((gm.groundingChunks || []).map((c) => c.web).filter(Boolean).map((w) => {
    if (w.resolved) return cleanUrl(w.resolved);
    if (w.domain) return `https://${w.domain}/`;
    if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(w.title || "")) return `https://${w.title.toLowerCase()}/`;
    return w.uri;
  }))];
  const u = body.usageMetadata || {};
  return {
    text,
    citations,
    usage: {
      input: u.promptTokenCount || 0,
      cachedInput: u.cachedContentTokenCount || 0,
      output: (u.candidatesTokenCount || 0) + (u.thoughtsTokenCount || 0),
      searches: (gm.webSearchQueries || []).length,
    },
    model: body.modelVersion || null,
  };
}

export async function callOpenAI(prompt, opts, key) {
  const body = {
    model: opts.model,
    input: prompt.text,
    tools: [{
      type: "web_search",
      user_location: { type: "approximate", country: prompt.country || "MX", ...(prompt.region && { region: prompt.region }), ...(prompt.city && { city: prompt.city }) },
    }],
    store: false,
  };
  const res = await postJson(OPENAI_URL, { Authorization: `Bearer ${key}` }, body, { keys: [key], fetchImpl: opts.fetchImpl });
  // Reasoning items carry encrypted content that is useless in an archive.
  res.output = (res.output || []).filter((o) => o.type !== "reasoning");
  return res;
}

/** Follows one grounding redirect to learn the cited url, without fetching the page body. */
async function resolveRedirect(uri, fetchImpl = fetch) {
  try {
    const r = await fetchImpl(uri, { method: "HEAD", redirect: "manual" });
    return r.headers.get("location") || null;
  } catch {
    return null;
  }
}

export async function callGemini(prompt, opts, key) {
  const body = { contents: [{ role: "user", parts: [{ text: prompt.text }] }], tools: [{ google_search: {} }] };
  const res = await postJson(GEMINI_URL(opts.model), { "x-goog-api-key": key }, body, { keys: [key], fetchImpl: opts.fetchImpl });
  for (const c of res.candidates?.[0]?.groundingMetadata?.groundingChunks || []) {
    if (c.web?.uri && !c.web.resolved) c.web.resolved = await resolveRedirect(c.web.uri, opts.fetchImpl);
  }
  return res;
}

export const ENGINES = {
  openai: { call: callOpenAI, parse: parseOpenAI, keyName: "OPENAI_API_KEY" },
  gemini: { call: callGemini, parse: parseGemini, keyName: "GEMINI_API_KEY" },
};
