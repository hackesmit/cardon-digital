/**
 * gemini-web: the Gemini consumer app (gemini.google.com), driven through a
 * logged-in Google account with Playwright, instead of the billed API.
 *
 * The stored body is the answer's own HTML (the last <model-response>
 * element) plus what the page showed around it, so parseGeminiWeb can be
 * re-run on old answers, offline, when it improves:
 *
 *   { html, url, mode, complete, elapsedMs }
 *
 * The answer text is the markdown-shaped rendering of <message-content> (the
 * list markers and headings detect.mjs ranks by); source chips are left out of
 * the text. Citations come from the chips: each chip button carries a jslog
 * attribute whose BardVeMetadataKey is base64 JSON holding the cited urls, so
 * no chip has to be clicked. A chip without that metadata falls back to its
 * title when the title is a bare domain.
 *
 * Browser-driven: no tokens are billed, so there is no price, no key and no
 * per-token cost row. A captcha, a usage limit or a signed-out session stops
 * the engine (error.stop) with the reason, and the run records it; a canned
 * "I can't do that" reply is a failure that --resume retries.
 *
 * The browser profile lives in the tracker home (browser/gemini-web), outside
 * this public repository, so the session cookies never reach git.
 */

import { join } from "node:path";
import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { cleanUrl } from "./engines.mjs";

const APP_URL = "https://gemini.google.com/app";

/** Subtrees that are chrome, not answer text. */
const SKIP = new Set(["script", "style", "svg", "button", "mat-icon", "gem-icon", "source-footnote", "sources-carousel-inline", "source-inline-chip", "sup", "message-actions", "sources-list", "thinking-overlay", "gem-popover", "template"]);
const VOID = new Set(["br", "hr", "img", "input", "meta", "link", "source", "wbr", "area", "base", "col", "embed", "param", "track"]);
const BLOCK = new Set(["p", "div", "section", "blockquote", "pre", "figure"]);

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", iexcl: "¡", iquest: "¿", laquo: "«", raquo: "»", middot: "·", ndash: "–", mdash: "—", hellip: "…", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”" };
// Spanish letters by name (&aacute;, &Ntilde;, &uuml;): Chrome writes them as
// characters, but a saved page from another tool may not.
const ACCENTS = { acute: "\u0301", grave: "\u0300", uml: "\u0308", tilde: "\u0303", circ: "\u0302" };

function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d*);/gi, (m, e) => {
    if (e[0] === "#") {
      const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    if (ENTITIES[e] ?? ENTITIES[e.toLowerCase()]) return ENTITIES[e] ?? ENTITIES[e.toLowerCase()];
    const a = /^([a-zA-Z])(acute|grave|uml|tilde|circ)$/.exec(e);
    return a ? (a[1] + ACCENTS[a[2]]).normalize("NFC") : m;
  });
}

/** Tags and text in document order: { tag, attrs, close, self } or { text }. */
function* tokens(html) {
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+|<)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[0].startsWith("<!--")) continue;
    if (m[5] !== undefined) {
      yield { text: m[5] };
      continue;
    }
    const attrs = {};
    for (const a of m[3].matchAll(/([^\s=>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[a[1].toLowerCase()] = decode(a[2] ?? a[3] ?? a[4] ?? "");
    yield { tag: m[2].toLowerCase(), attrs, close: m[1] === "/", self: m[4] === "/" };
  }
}

/** The inner HTML of the first element named `tag`, or null. */
export function innerOf(html, tag) {
  const open = new RegExp(`<${tag}\\b[^>]*>`, "i").exec(html);
  if (!open) return null;
  let depth = 1;
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  re.lastIndex = open.index + open[0].length;
  let m;
  while ((m = re.exec(html)) !== null) {
    depth += m[1] ? -1 : 1;
    if (!depth) return html.slice(open.index + open[0].length, m.index);
  }
  return html.slice(open.index + open[0].length);
}

/**
 * Answer HTML to the markdown shape the other engines return: "### " for
 * headings, "1. " and "- " list items indented two spaces per level, pipe
 * rows for tables, "**" for bold. Chrome subtrees (SKIP) are dropped.
 */
export function htmlToMarkdown(html) {
  const out = [];
  let line = "";
  const lists = [];
  let skip = 0;
  let skipTag = null;
  let row = null;
  let rows = 0;
  let cell = null;
  const flush = () => {
    // Leading spaces are a nested item's indent; keep them.
    const indent = /^ */.exec(line)[0];
    const t = line.slice(indent.length).replace(/[ \t]+/g, " ").trim();
    if (t) out.push(indent + t);
    line = "";
  };
  const blank = () => {
    flush();
    if (out.length && out.at(-1) !== "") out.push("");
  };
  const write = (s) => {
    if (cell !== null) cell += s;
    else line += s;
  };
  for (const t of tokens(html)) {
    if (skip) {
      if (t.tag === skipTag && !VOID.has(t.tag) && !t.self) skip += t.close ? -1 : 1;
      continue;
    }
    if (t.text !== undefined) {
      write(decode(t.text).replace(/\s+/g, " "));
      continue;
    }
    const { tag, close } = t;
    if (!close && SKIP.has(tag) && !t.self) {
      skip = 1;
      skipTag = tag;
      continue;
    }
    if (tag === "h6" && /visually-hidden/.test(t.attrs.class || "")) {
      if (!close) {
        skip = 1;
        skipTag = tag;
      }
      continue;
    }
    if (/^h[1-6]$/.test(tag)) {
      blank();
      if (!close) line = `${"#".repeat(Math.min(6, Number(tag[1])))} `;
      else blank();
    } else if (tag === "ul" || tag === "ol") {
      if (!close) {
        flush();
        if (!lists.length) blank();
        lists.push({ ordered: tag === "ol", n: tag === "ol" ? Number(t.attrs.start || 1) - 1 : 0 });
      } else {
        flush();
        lists.pop();
        if (!lists.length) blank();
      }
    } else if (tag === "li") {
      flush();
      if (!close) {
        const l = lists.at(-1) || { ordered: false, n: 0 };
        l.n += 1;
        line = `${"  ".repeat(Math.max(0, lists.length - 1))}${l.ordered ? `${l.n}.` : "-"} `;
      }
    } else if (tag === "table") {
      blank();
      rows = 0;
    } else if (tag === "tr") {
      if (!close) row = [];
      else if (row) {
        out.push(`| ${row.join(" | ")} |`);
        if (++rows === 1) out.push(`| ${row.map(() => "---").join(" | ")} |`);
        row = null;
      }
    } else if (tag === "td" || tag === "th") {
      if (!close) cell = "";
      else if (cell !== null) {
        row?.push(cell.replace(/\s+/g, " ").trim().replace(/\|/g, "\\|"));
        cell = null;
      }
    } else if (tag === "b" || tag === "strong") {
      write("**");
    } else if (tag === "br") {
      flush();
    } else if (BLOCK.has(tag)) {
      // A paragraph inside a list item continues that item's line.
      if (lists.length && /^\s*(\d+\.|-) $/.test(line)) continue;
      if (lists.length) flush();
      else blank();
    }
  }
  flush();
  return out.join("\n").replace(/\*\*\s*\*\*/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

/** Urls in a decoded jslog metadata value (nested JSON arrays). */
function urlsIn(node, acc = []) {
  if (typeof node === "string" && /^https?:\/\//.test(node)) acc.push(node);
  else if (Array.isArray(node)) for (const x of node) urlsIn(x, acc);
  return acc;
}

/** A cited url without utm parameters or a #:~:text= highlight fragment. */
function citedUrl(u) {
  return cleanUrl(u).replace(/#:~:text=.*$/, "");
}

/** Every distinct url the answer's source chips cite, in order. */
export function chipCitations(html) {
  const out = [];
  for (const chip of html.matchAll(/<source-inline-chip\b[\s\S]*?<\/source-inline-chip>/gi)) {
    const found = [];
    for (const j of chip[0].matchAll(/jslog="[^"]*?BardVeMetadataKey:([A-Za-z0-9+/=_-]+)/g)) {
      try {
        urlsIn(JSON.parse(Buffer.from(j[1], "base64").toString("utf8")), found);
      } catch {
        // Metadata that is not base64 JSON gives no url; the title may.
      }
    }
    if (!found.length) {
      const title = /class="source-title"[^>]*>([^<]*)</.exec(chip[0]);
      const t = title && decode(title[1]).trim().toLowerCase();
      if (t && /^[a-z0-9.-]+\.[a-z]{2,}$/.test(t)) found.push(`https://${t}/`);
    }
    out.push(...found.map(citedUrl));
  }
  return out;
}

/** Links written inside the answer text itself (not Google's own). */
function inlineLinks(content) {
  return [...content.matchAll(/<a\b[^>]*\bhref="(https?:\/\/[^"]+)"/gi)].map((m) => decode(m[1])).filter((u) => !/^https?:\/\/([a-z0-9-]+\.)*(google|gstatic)\.com\//i.test(u)).map(citedUrl);
}

export function parseGeminiWeb(body) {
  const html = body?.html || "";
  const content = innerOf(html, "message-content") ?? "";
  return {
    text: htmlToMarkdown(content),
    citations: [...new Set([...chipCitations(html), ...inlineLinks(content)])],
    usage: { input: 0, cachedInput: 0, output: 0, searches: 0 },
    model: body?.mode ? `gemini-app (${body.mode})` : "gemini-app",
  };
}

/** Gemini's canned non-answers: a reply, but not an answer to the prompt. */
export const CANNED = /^(soy un modelo de lenguaje,? as[ií] que no tengo esa capacidad|no puedo ayudarte con eso|i'?m a language model and don'?t have the capacity|i can'?t help with that)/i;

/**
 * Why a stored gemini-web body is not a usable answer, or null. A reply that
 * never finished streaming, no answer element, empty text or a canned
 * refusal is an error --resume retries, never an answer in the denominator.
 */
export function failureGeminiWeb(body) {
  if (!body || typeof body.html !== "string") return "no stored page";
  if (body.complete === false) return "the answer never finished";
  if (innerOf(body.html, "message-content") == null) return "no answer element";
  const text = parseGeminiWeb(body).text.trim();
  if (!text) return "empty text";
  if (CANNED.test(text)) return `canned refusal: ${text.slice(0, 80)}`;
  return null;
}

/**
 * What a page state means for the run: null when Gemini is usable, else
 * { stop } naming why the engine has to stop (no retry can fix it) or
 * { login } when the session is signed out and a login may fix it.
 */
export function classifyPage({ url = "", text = "" }) {
  if (/google\.com\/sorry\//.test(url) || /unusual traffic|tr[aá]fico inusual|not a robot|no soy un robot|recaptcha/i.test(text)) return { stop: "Google shows a captcha (unusual traffic); try later or from a residential IP" };
  if (/you'?ve reached your (usage )?limit|reached the limit|alcanzaste el l[ií]mite|has alcanzado el l[ií]mite|l[ií]mite de uso/i.test(text)) return { stop: "the free Gemini usage limit is reached; resume after it resets" };
  if (/accounts\.google\.com\/.*(challenge|signin\/v2\/challenge)/.test(url) || /verify it'?s you|verifica que eres t[uú]|2-step verification|verificaci[oó]n en dos pasos/i.test(text)) return { stop: "Google asks for a sign-in challenge (2-step or verify it's you); sign in once by hand in the tracker browser profile" };
  if (/accounts\.google\.com\//.test(url)) return { login: true };
  return null;
}

const stopError = (reason) => Object.assign(new Error(`gemini-web stopped: ${reason}`), { stop: reason });

/** One field of a Proton Pass item; never printed. */
function ppField(account, field) {
  const r = spawnSync("pp", ["item", "view", "--vault-name", account.vault, "--item-title", account.item, "--field", field], {
    encoding: "utf8",
    env: { ...process.env, PROTON_PASS_AGENT_REASON: "visibility tracker gemini-web login" },
  });
  const v = (r.stdout || "").trim();
  if (r.status !== 0 || !v) throw stopError(`cannot read ${field} of ${account.item} from Proton Pass`);
  return v;
}

/** The one browser the engine drives per process, launched on first use. */
let session = null;

async function launch(opts) {
  if (!process.env.DISPLAY && !opts.config?.headless) throw stopError("no display: run the tracker under xvfb-run -a (Google refuses headless Chrome)");
  let chromium;
  try {
    ({ chromium } = await import("playwright-core"));
  } catch {
    throw stopError("playwright-core is not installed (npm ci in the repo)");
  }
  const dir = join(opts.home, "browser", "gemini-web");
  mkdirSync(dir, { recursive: true });
  const ctx = await chromium.launchPersistentContext(dir, {
    executablePath: opts.config?.chrome || "/usr/bin/google-chrome",
    headless: Boolean(opts.config?.headless),
    locale: "es-MX",
    viewport: { width: 1280, height: 900 },
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const page = ctx.pages()[0] || (await ctx.newPage());
  return { ctx, page, loggedIn: false };
}

const pageState = async (page) => ({ url: page.url(), text: await page.locator("body").innerText({ timeout: 5000 }).catch(() => "") });

async function signIn(page, account) {
  if (!account) throw stopError("signed out and no engines.gemini-web.account (Proton Pass vault and item) to sign in with");
  if (!/accounts\.google\.com/.test(page.url())) {
    const btn = page.locator("a,button").filter({ hasText: /^\s*(Acceder|Sign in|Iniciar sesi[oó]n)\s*$/ }).first();
    if (await btn.count()) await btn.click();
    await page.waitForURL(/accounts\.google\.com/, { timeout: 20000 }).catch(() => {});
  }
  const id = page.locator('input#identifierId, input[name="identifier"]').first();
  await id.waitFor({ timeout: 20000 });
  await id.fill(ppField(account, "email"));
  await page.keyboard.press("Enter");
  const pw = page.locator('input[name="Passwd"], input[type="password"]').first();
  await pw.waitFor({ timeout: 20000 }).catch(() => {});
  const s = classifyPage(await pageState(page));
  if (s?.stop) throw stopError(s.stop);
  await pw.fill(ppField(account, "password"));
  await page.keyboard.press("Enter");
  await page.waitForURL(/gemini\.google\.com/, { timeout: 30000 }).catch(() => {});
  const after = classifyPage(await pageState(page));
  if (after?.stop) throw stopError(after.stop);
  if (after?.login) throw stopError("Google did not accept the sign-in; sign in once by hand in the tracker browser profile");
}

/** Opens a fresh chat and returns its prompt box, signing in when needed. */
async function freshChat(s, opts) {
  const { page } = s;
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.goto(APP_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    const box = page.locator('rich-textarea [contenteditable="true"]').first();
    // The signed-out app also has a prompt box, so a session counts as
    // signed in only when the account menu shows; a Workspace account's
    // first visit shows the landing page and a terms dialog instead.
    await Promise.race([box.waitFor({ timeout: 20000 }), page.waitForURL(/accounts\.google\.com/, { timeout: 20000 })]).catch(() => {});
    const state = await pageState(page);
    const c = classifyPage(state);
    if (c?.stop) throw stopError(c.stop);
    const signedOut = c?.login || /\b(Acceder|Sign in)\b/.test(state.text.split("\n").slice(0, 40).join("\n")) || !(await box.count());
    if (!signedOut) return box;
    if (!(await box.count())) {
      // Landing page or first-use dialogs: walk through them once.
      for (const name of [/Chat with Gemini|Chatear con Gemini/, /Use Gemini|Usar Gemini/, /^Continue$|^Continuar$/]) {
        const b = page.getByRole("button", { name }).or(page.getByRole("link", { name })).first();
        if (await b.count()) {
          await b.click().catch(() => {});
          await page.waitForTimeout(3000);
        }
      }
      if (await box.count()) return box;
    }
    if (attempt) break;
    await signIn(page, opts.config?.account);
  }
  throw stopError("still signed out after signing in; sign in once by hand in the tracker browser profile");
}

/**
 * Asks one prompt in a fresh chat and returns the stored body. Waits until
 * the reply stops changing and the stop button is gone (up to timeoutMs).
 */
export async function callGeminiWeb(prompt, opts) {
  session ||= await launch(opts);
  const { page } = session;
  const box = await freshChat(session, opts);
  await box.click();
  await page.keyboard.type(prompt.text, { delay: 10 });
  await page.keyboard.press("Enter");
  const t0 = Date.now();
  const timeoutMs = opts.config?.timeoutMs || 180000;
  let last = "";
  let stable = 0;
  let complete = false;
  while (Date.now() - t0 < timeoutMs) {
    await page.waitForTimeout(2000);
    const s = await page.evaluate(() => {
      const r = [...document.querySelectorAll("model-response")].at(-1);
      const busy = !!document.querySelector('button[aria-label*="Stop" i], button[aria-label*="Detener" i]');
      return { len: r ? r.innerText.length : -1, busy };
    });
    const key = JSON.stringify(s);
    stable = key === last && !s.busy && s.len > 0 ? stable + 1 : 0;
    last = key;
    if (stable >= 2) {
      complete = true;
      break;
    }
    const c = classifyPage(await pageState(page));
    if (c?.stop) throw stopError(c.stop);
  }
  const state = await pageState(page);
  const c = classifyPage(state);
  if (c?.stop) throw stopError(c.stop);
  const html = await page.evaluate(() => [...document.querySelectorAll("model-response")].at(-1)?.outerHTML || "");
  if (!html && /\b(limit|l[ií]mite)\b/i.test(state.text)) throw stopError("Gemini refused the prompt with a limit message");
  const mode = await page.locator("bard-mode-switcher button, [data-test-id='bard-mode-menu-button']").first().innerText({ timeout: 2000 }).catch(() => null);
  return { html, url: page.url(), mode: mode ? mode.trim() : null, complete, elapsedMs: Date.now() - t0 };
}

/** Closes the browser, if one was launched. */
export async function closeGeminiWeb() {
  const s = session;
  session = null;
  if (s) await s.ctx.close().catch(() => {});
}
