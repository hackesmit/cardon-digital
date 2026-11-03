/**
 * gemini-web against a real (headless) Chrome: every request is routed to a
 * fake of Google's sign-in pages and the Gemini app, so the sign-in flow, the
 * identity check, the trusted-signal page checks and prompt entry run for
 * real with no network and no Google account. Skipped when Chrome or
 * playwright-core is missing.
 */

import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { callGeminiWeb, closeGeminiWeb, failureGeminiWeb, parseGeminiWeb, auth, testHooks } from "../lib/gemini-web.mjs";
import { ENGINES, liveSecrets } from "../lib/engines.mjs";
import { main } from "../run.mjs";

const CHROME = "/usr/bin/google-chrome";
let chromium = null;
try {
  ({ chromium } = await import("playwright-core"));
} catch {
  chromium = null;
}
const skip = !chromium || !existsSync(CHROME) ? "needs playwright-core and Chrome" : false;

const EMAIL = "daniel@cardondigital.com";
const PASSWORD = "fixture-password-1234";
const ANSWER = "<message-content><div class=\"markdown\"><p>Estas son las agencias: <b>Ola Studio</b> y Nopal Digital.</p></div></message-content>";

const html = (body) => `<!doctype html><html><head><meta charset="utf-8"></head><body>${body}</body></html>`;

/**
 * A fake Google. `sc` drives it: signedIn, as (the email the account link
 * shows), afterPassword ("gemini" or "totp"), pwdDisabled, answer (inner HTML
 * of the reply), bannerAfterSubmit; it records identifier, password and
 * submissions.
 */
function fakeGoogle(sc) {
  sc.submissions = [];
  const signedOut = html(`<a href="https://accounts.google.com/v3/signin/identifier?continue=gemini">Sign in</a><rich-textarea><div contenteditable="true" style="min-height:40px"></div></rich-textarea>`);
  const app = () =>
    html(`<a href="https://accounts.google.com/SignOutOptions?continue=x" aria-label="Google Account: Test User (${sc.as || EMAIL})">T</a>
<div id="chat"></div><div id="banner"></div>
<rich-textarea><div contenteditable="true" role="textbox" style="min-height:40px;border:1px solid #888"></div></rich-textarea>
<script>
const box = document.querySelector('[contenteditable]');
box.addEventListener('keydown', async (e) => {
  if (e.key !== 'Enter' || e.shiftKey) return;
  e.preventDefault();
  const text = box.innerText;
  box.innerHTML = '';
  await fetch('/_fake/submit', { method: 'POST', body: text });
  const q = document.createElement('user-query'); q.textContent = text; chat.appendChild(q);
  const r = document.createElement('model-response'); r.innerHTML = ${JSON.stringify(sc.answer || ANSWER)}; chat.appendChild(r);
  ${sc.bannerAfterSubmit ? `document.getElementById('banner').innerHTML = '<div role="alert">' + ${JSON.stringify(sc.bannerAfterSubmit)} + '</div>';` : ""}
});
</script>`);
  const identifier = html(`<h1>Accede</h1><input id="identifierId" name="identifier" type="email">
<script>document.querySelector('input').addEventListener('keydown', async (e) => {
  if (e.key !== 'Enter') return;
  await fetch('/_fake/id', { method: 'POST', body: e.target.value });
  location.href = '/v3/signin/challenge/pwd?TL=fixture';
});</script>`);
  const pwd = html(`<h1>Verify it's you</h1><p>${EMAIL}</p><input name="Passwd" type="password" ${sc.pwdDisabled ? "disabled" : ""}>
<script>document.querySelector('input').addEventListener('keydown', async (e) => {
  if (e.key !== 'Enter') return;
  const r = await fetch('/_fake/pw', { method: 'POST', body: e.target.value });
  location.href = (await r.json()).next;
});</script>`);
  const totp = html(`<h1>2-Step Verification</h1><input name="totpPin">`);
  return async (route) => {
    const req = route.request();
    const u = new URL(req.url());
    const send = (body, type = "text/html") => route.fulfill({ status: 200, contentType: type, body });
    if (u.host === "gemini.google.com" && u.pathname === "/_fake/submit") {
      sc.submissions.push(req.postData());
      return send("{}", "application/json");
    }
    if (u.host === "gemini.google.com" && u.pathname.startsWith("/app")) return send(sc.signedIn ? app() : signedOut);
    if (u.host === "accounts.google.com") {
      if (u.pathname === "/v3/signin/identifier") return send(identifier);
      if (u.pathname === "/_fake/id") {
        sc.identifier = req.postData();
        return send("{}", "application/json");
      }
      if (u.pathname === "/v3/signin/challenge/pwd") return send(pwd);
      if (u.pathname === "/_fake/pw") {
        sc.password = req.postData();
        const ok = sc.password === PASSWORD;
        if (ok && sc.afterPassword !== "totp") sc.signedIn = true;
        return send(JSON.stringify({ next: !ok ? "/v3/signin/challenge/pwd?TL=again" : sc.afterPassword === "totp" ? "/v3/signin/challenge/totp?TL=x" : "https://gemini.google.com/app" }), "application/json");
      }
      if (u.pathname === "/v3/signin/challenge/totp") return send(totp);
    }
    return route.fulfill({ status: 404, body: "" });
  };
}

function opts(home, extra = {}) {
  return { home, config: { model: "gemini-app", headless: true, chrome: CHROME, account: { vault: "V", item: "I", email: EMAIL }, authTimeoutMs: 3000, pollMs: 50, timeoutMs: 15000, ...extra } };
}

/** Runs fn with the fake Google routed in and the password stub installed. */
async function withFake(sc, fn, password = PASSWORD) {
  const read = mock.method(auth, "readSecret", (account, field) => (field === "password" ? password : EMAIL));
  testHooks.onContext = (ctx) => ctx.route("**/*", fakeGoogle(sc));
  try {
    return await fn(read);
  } finally {
    await closeGeminiWeb();
    testHooks.onContext = null;
    read.mock.restore();
  }
}

const tmpHome = () => mkdtempSync(join(tmpdir(), "vis-gw-"));

test("a fresh profile signs in (identifier, password, Gemini), checks the identity and sends a multiline prompt once, whole", { skip }, async () => {
  const sc = { signedIn: false };
  const h = tmpHome();
  const text = "¿Qué agencias web recomiendas en Ensenada?\nDame tres opciones.\nCon su sitio web.";
  const body = await withFake(sc, () => callGeminiWeb({ id: "P0", text }, opts(h)));
  assert.equal(sc.identifier, EMAIL, "the identifier step got the account email");
  assert.equal(sc.password, PASSWORD, "the password step was reached and filled (not taken for a challenge)");
  assert.equal(sc.submissions.length, 1, "the prompt was sent once: no newline sent it early");
  assert.equal(sc.submissions[0].replace(/\n+/g, "\n").trim(), text);
  assert.equal(failureGeminiWeb(body), null);
  assert.match(parseGeminiWeb(body).text, /Ola Studio/);
  const dir = join(h, "browser", "gemini-web", "daniel-cardondigital-com");
  for (const p of [join(h, "browser"), join(h, "browser", "gemini-web"), dir]) assert.equal(statSync(p).mode & 0o777, 0o700, p);
  assert.equal(liveSecrets.size, 0, "the password is forgotten when the browser closes");
});

test("a 2-step challenge after the password stops the engine", { skip }, async () => {
  const sc = { signedIn: false, afterPassword: "totp" };
  await assert.rejects(
    withFake(sc, () => callGeminiWeb({ id: "P0", text: "hola" }, opts(tmpHome()))),
    (e) => /challenge/.test(e.stop),
  );
  assert.equal(sc.password, PASSWORD);
  assert.equal(sc.submissions.length, 0);
});

test("a session signed in as another account stops before any prompt is sent", { skip }, async () => {
  const sc = { signedIn: true, as: "otra@ejemplo.test" };
  await assert.rejects(
    withFake(sc, (read) => callGeminiWeb({ id: "P0", text: "hola" }, opts(tmpHome())).finally(() => assert.equal(read.mock.calls.filter((c) => c.arguments[1] === "password").length, 0))),
    (e) => /signed in as otra@ejemplo\.test, not daniel@cardondigital\.com/.test(e.stop),
  );
  assert.equal(sc.submissions.length, 0);
});

test("captcha, challenge and limit wording inside the prompt and the answer does not stop the engine", { skip }, async () => {
  const answer = `<message-content><div class="markdown"><p>Sobre reCAPTCHA: Google puede pedir "verify it's you" o decir "Has alcanzado el límite de uso" y "unusual traffic". Ola Studio lo explica.</p><div role="status">Has alcanzado el límite</div><iframe title="reCAPTCHA demo" width="300" height="100"></iframe></div></message-content>`;
  const sc = { signedIn: true, answer };
  const text = "¿Qué hago si Google me muestra un reCAPTCHA, me pide verify it's you, o dice has alcanzado el límite de uso o unusual traffic?";
  const body = await withFake(sc, () => callGeminiWeb({ id: "P0", text }, opts(tmpHome())));
  assert.equal(sc.submissions.length, 1);
  assert.equal(failureGeminiWeb(body), null);
  assert.match(parseGeminiWeb(body).text, /reCAPTCHA/);
});

test("a limit banner from the app itself stops the engine", { skip }, async () => {
  const sc = { signedIn: true, bannerAfterSubmit: "Has alcanzado el límite de Gemini. Vuelve más tarde." };
  await assert.rejects(withFake(sc, () => callGeminiWeb({ id: "P0", text: "hola" }, opts(tmpHome()))), (e) => /usage limit/.test(e.stop));
});

test("Playwright debug output stops the engine before the browser starts", async () => {
  const before = process.env.DEBUG;
  process.env.DEBUG = "pw:api";
  try {
    await assert.rejects(callGeminiWeb({ id: "P0", text: "hola" }, opts(tmpHome())), (e) => /debug output/.test(e.stop));
  } finally {
    if (before === undefined) delete process.env.DEBUG;
    else process.env.DEBUG = before;
    await closeGeminiWeb();
  }
});

test("a password fill that times out never puts the password on the console or in errors.json", { skip }, async () => {
  const SENTINEL = "SENTINEL-pw-7f3a9c";
  // The fixture's disabled password box does make Playwright's own error
  // carry the value, so the guard is what keeps it out.
  const b = await chromium.launch({ executablePath: CHROME, headless: true });
  try {
    const p = await b.newPage();
    await p.setContent('<input name="Passwd" type="password" disabled>');
    const raw = await p.locator("input").fill(SENTINEL, { timeout: 300 }).then(() => "", (e) => e.message);
    assert.ok(raw.includes(SENTINEL), "Playwright's raw error repeats the filled value");
  } finally {
    await b.close();
  }

  const h = tmpHome();
  mkdirSync(join(h, "clients"));
  const client = JSON.parse(readFileSync(new URL("./fixtures/client.json", import.meta.url), "utf8"));
  writeFileSync(join(h, "clients", "fixture.json"), JSON.stringify({ ...client, engines: { "gemini-web": opts(h, { authTimeoutMs: 1000 }).config } }));
  const sc = { signedIn: false, pwdDisabled: true };
  const printed = [];
  const capture = (...a) => printed.push(a.map(String).join(" "));
  const spies = ["log", "error", "warn", "info", "debug"].map((m) => mock.method(console, m, capture));
  const realOut = process.stdout.write;
  const realErr = process.stderr.write;
  process.stdout.write = function (chunk, ...rest) {
    printed.push(String(chunk));
    return realOut.call(this, chunk, ...rest);
  };
  process.stderr.write = function (chunk, ...rest) {
    printed.push(String(chunk));
    return realErr.call(this, chunk, ...rest);
  };
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  let code;
  try {
    code = await withFake(sc, () => main(["--client", "fixture", "--home", h, "--runs", "1", "--prompts", "P0", "--max-usd", "1"], capture), SENTINEL);
  } finally {
    process.stdout.write = realOut;
    process.stderr.write = realErr;
    for (const s of spies) s.mock.restore();
  }
  assert.equal(code, 3);
  const out = printed.join("\n");
  assert.match(out, /could not enter the password on Google's sign-in page/);
  assert.ok(!out.includes(SENTINEL), "no console output carries the password");
  const runDir = join(h, "runs", "fixture", readdirSync(join(h, "runs", "fixture"))[0]);
  const errors = readFileSync(join(runDir, "errors.json"), "utf8");
  assert.match(errors, /could not enter the password/);
  assert.ok(!errors.includes(SENTINEL), "errors.json does not carry the password");
  for (const f of readdirSync(runDir, { recursive: true })) {
    const p = join(runDir, f);
    if (statSync(p).isFile()) assert.ok(!readFileSync(p, "utf8").includes(SENTINEL), `${f} does not carry the password`);
  }
  assert.equal(ENGINES["gemini-web"].browser, true);
});
