/**
 * Stub tests for scripts/vino-go-public.sh (bead hq-rbdwt, review of hq-60dkt).
 *
 *   node --test scripts/vino-go-public.test.mjs
 *   VINO_SCRIPT=/path/to/old/vino-go-public.sh node --test scripts/vino-go-public.test.mjs
 *
 * curl, gh and whois are stubs on a hermetic PATH (no real curl, so no network
 * and no Vercel write). Each Vercel call is logged as "METHOD URL". The cases
 * hold the two promises of the fix:
 *   1. set_env never removes a production variable: no DELETE ever, a failing
 *      list or write stops with a FAIL message and no later step runs;
 *   2. registered() says "is registered" only on positive evidence, and stops
 *      with a FAIL message when it cannot tell.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, symlinkSync, chmodSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = resolve(process.env.VINO_SCRIPT || join(HERE, "vino-go-public.sh"));
const BASH = "/bin/bash";
const SYS_TOOLS = ["jq", "sed", "grep", "head", "base64", "seq", "sleep", "rm", "cat", "tr", "env", "printf", "mktemp"];

// The curl stub: answers the Vercel, RDAP and site calls from env knobs.
const CURL = `#!/bin/bash
args="$*"; method=GET; url=""; wfmt=""; prev=""
for a in "$@"; do
  case "$prev" in -X) method="$a" ;; -w) wfmt="$a" ;; esac
  case "$a" in http*) url="$a" ;; esac
  prev="$a"
done
case "$url" in https://api.vercel.com/*) echo "$method $url" >> "$STUB_LOG" ;; esac
write_answer() { # $1 = shape for ok
  case "\${WRITE:-ok}" in
    ok) echo "$1" ;;
    exit) exit 7 ;;
    error) echo '{"error":{"code":"rate_limited","message":"Too many requests"}}' ;;
    partial) echo '{"created":[],"failed":[{"error":{"code":"ENV_CONFLICT","message":"conflict"}}]}' ;;
  esac
}
case "$method $url" in
  "GET https://api.vercel.com/v2/user"*)
    [ "\${USER_CALL:-ok}" = exit ] && exit 7
    echo '{"user":{"username":"hackesmit"}}' ;;
  "GET https://rdap"*)
    case "\${RDAP:-200}" in
      down) printf 000; exit 6 ;;
      302) if [[ " $args" =~ \ -[a-zA-Z]*L ]]; then printf 200; else printf 302; fi ;;
      *) printf '%s' "\${RDAP:-200}" ;;
    esac ;;
  "POST https://api.vercel.com/v10/projects/"*"/domains"*) echo '{"name":"x"}' ;;
  "GET https://api.vercel.com/v6/domains/"*) echo '{"misconfigured":false}' ;;
  "GET https://api.vercel.com/v9/projects/"*"/env"*)
    case "\${LIST:-existing}" in
      existing) echo '{"envs":[{"id":"env_old","key":"NEXT_PUBLIC_SITE_URL","target":["production"]},{"id":"env_old2","key":"NEXT_PUBLIC_VINO_URL","target":["production","preview"]}]}' ;;
      none) echo '{"envs":[]}' ;;
      exit) exit 7 ;;
      error) echo '{"error":{"code":"forbidden","message":"Not authorized"}}' ;;
    esac ;;
  "PATCH https://api.vercel.com/v9/projects/"*"/env/"*) write_answer '{"id":"env_old","key":"KEY","value":"v","type":"plain","target":["production"]}' ;;
  "POST https://api.vercel.com/v10/projects/"*"/env"*) write_answer '{"created":{"id":"env_new","key":"KEY","value":"v","type":"plain","target":["production"]},"failed":[]}' ;;
  "DELETE "*) echo '{}' ;;
  "POST https://api.vercel.com/v13/deployments"*) echo '{"id":"dpl_1"}' ;;
  "GET https://api.vercel.com/v13/deployments/"*) echo '{"readyState":"READY"}' ;;
  *) [ -n "$wfmt" ] && printf '000'; exit 6 ;;
esac
`;

const GH = `#!/bin/bash
[ "\${GH:-ok}" = fail ] && { echo "gh: HTTP 502" >&2; exit 1; }
printf 'export const VINO_NAME = "Vino";\\n' | base64 -w0
`;

const WHOIS = `#!/bin/bash
case "\${WHOIS:-registered}" in
  registered) printf 'Domain Name:       %s\\n\\nRegistrar:  X\\n' "$3" ;;
  free) echo "No_Se_Encontro_El_Objeto/Object_Not_Found" ;;
  empty) exit 0 ;;
  exit) exit 2 ;;
esac
`;

function run(args, knobs = {}, { whois = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "vino-go-public-"));
  const bin = join(dir, "bin");
  mkdirSync(bin);
  for (const t of SYS_TOOLS) {
    for (const d of ["/usr/bin", "/bin"]) {
      if (existsSync(join(d, t))) { symlinkSync(join(d, t), join(bin, t)); break; }
    }
  }
  const stubs = { curl: CURL, gh: GH, ...(whois ? { whois: WHOIS } : {}) };
  for (const [name, body] of Object.entries(stubs)) {
    writeFileSync(join(bin, name), body);
    chmodSync(join(bin, name), 0o755);
  }
  const log = join(dir, "calls.log");
  writeFileSync(log, "");
  const r = spawnSync(BASH, [SCRIPT, ...args], {
    encoding: "utf8",
    timeout: 30000,
    env: { PATH: bin, HOME: dir, VERCEL_TOKEN: "tok_stub_secret", STUB_LOG: log, ...knobs },
  });
  const calls = readFileSync(log, "utf8").split("\n").filter(Boolean);
  rmSync(dir, { recursive: true, force: true });
  return { code: r.status, out: r.stdout, err: r.stderr, calls };
}

const APPLY = ["vino.com", "Vino", "--apply"];
const deletes = (calls) => calls.filter((c) => c.startsWith("DELETE "));
const envWrites = (calls) => calls.filter((c) => /^(POST|PATCH|PUT) \S+\/env/.test(c));
const deploys = (calls) => calls.filter((c) => c.startsWith("POST https://api.vercel.com/v13/deployments"));

// ---- set_env --------------------------------------------------------------

test("re-run of --apply over an existing variable: updated in place, never deleted", () => {
  const r = run(APPLY);
  assert.deepEqual(deletes(r.calls), [], r.calls.join("\n"));
  assert.match(r.out, /cardon-vino: NEXT_PUBLIC_SITE_URL=https:\/\/vino\.com \(production\)/);
  assert.match(r.out, /cardon-digital: NEXT_PUBLIC_VINO_URL=https:\/\/vino\.com \(production\)/);
  assert.equal(deploys(r.calls).length, 2);
  assert.doesNotMatch(r.out + r.err, /tok_stub_secret/);
});

test("first --apply with no variable yet: one POST with upsert, no delete", () => {
  const r = run(APPLY, { LIST: "none" });
  assert.deepEqual(deletes(r.calls), []);
  const w = envWrites(r.calls);
  assert.equal(w.length, 2, w.join("\n"));
  for (const c of w) assert.match(c, /^POST https:\/\/api\.vercel\.com\/v10\/projects\/[^/]+\/env\?upsert=true&teamId=/);
  assert.equal(deploys(r.calls).length, 2);
});

for (const [name, knobs] of [
  ["write call failing (curl error)", { WRITE: "exit" }],
  ["write call returning an error body", { WRITE: "error" }],
  ["write call returning a failed entry", { WRITE: "partial", LIST: "none" }],
  ["write call returning an error body, no variable yet", { WRITE: "error", LIST: "none" }],
  ["env list call failing (curl error)", { LIST: "exit" }],
  ["env list call returning an error body", { LIST: "error" }],
]) {
  test(`${name}: FAIL, no delete, no further write, no redeploy`, () => {
    const r = run(APPLY, knobs);
    assert.notEqual(r.code, 0);
    assert.match(r.err, /vino-go-public: FAIL .*NEXT_PUBLIC_SITE_URL.*cardon-vino|vino-go-public: FAIL .*cardon-vino/);
    assert.deepEqual(deletes(r.calls), [], r.calls.join("\n"));
    assert.ok(envWrites(r.calls).length <= 1, r.calls.join("\n"));
    assert.deepEqual(deploys(r.calls), []);
    assert.doesNotMatch(r.out, /4\. redeploy/);
  });
}

// ---- registered() -----------------------------------------------------------

const PLAN_MX = ["zq7x91nonexist.mx", "Vino"];

test(".mx with a Domain Name line: registered", () => {
  const r = run(PLAN_MX);
  assert.equal(r.code, 0);
  assert.match(r.out, /zq7x91nonexist\.mx is registered/);
});

test(".mx with No_Se_Encontro: not registered, plan says buy it first", () => {
  const r = run(PLAN_MX, { WHOIS: "free" });
  assert.equal(r.code, 0);
  assert.match(r.out, /is NOT registered yet/);
});

for (const [name, knobs, opts] of [
  ["whois missing", {}, { whois: false }],
  ["whois exit non-zero", { WHOIS: "exit" }, {}],
  ["whois empty output", { WHOIS: "empty" }, {}],
]) {
  test(`.mx, ${name}: FAIL (cannot tell), never "is registered"`, () => {
    const r = run(PLAN_MX, knobs, opts);
    assert.notEqual(r.code, 0);
    assert.doesNotMatch(r.out, /is registered/);
    assert.match(r.err, /vino-go-public: FAIL .*cannot tell whether zq7x91nonexist\.mx is registered/);
  });
}

test("rdap.org 302 is followed: a registered .wine reads registered", () => {
  const r = run(["vino.wine", "Vino"], { RDAP: "302" });
  assert.equal(r.code, 0);
  assert.match(r.out, /vino\.wine is registered/);
});

test("rdap 404: not registered, --apply refuses before any write", () => {
  const r = run(APPLY, { RDAP: "404" });
  assert.notEqual(r.code, 0);
  assert.match(r.err, /vino\.com is not registered/);
  assert.deepEqual(r.calls.filter((c) => !c.startsWith("GET ")), []);
});

test("rdap unreachable: FAIL (cannot tell), even in plan mode", () => {
  const r = run(["vino.com", "Vino"], { RDAP: "down" });
  assert.notEqual(r.code, 0);
  assert.doesNotMatch(r.out, /is (NOT )?registered/);
  assert.match(r.err, /vino-go-public: FAIL .*cannot tell whether vino\.com is registered/);
});

// ---- plan mode and silent exits ----------------------------------------------

test("plan mode makes GET calls only", () => {
  const r = run(["vino.com", "Vino"]);
  assert.equal(r.code, 0);
  assert.match(r.out, /plan \(nothing changed\)/);
  assert.deepEqual(r.calls.filter((c) => !c.startsWith("GET ")), []);
});

test("gh failure reading lib/brand.ts prints a FAIL message, not a silent exit", () => {
  const r = run(["vino.com", "Vino"], { GH: "fail" });
  assert.notEqual(r.code, 0);
  assert.match(r.err, /vino-go-public: FAIL .*lib\/brand\.ts/);
});

test("Vercel whoami call failing prints a FAIL message, not a silent exit", () => {
  const r = run(["vino.com", "Vino"], { USER_CALL: "exit" });
  assert.notEqual(r.code, 0);
  assert.match(r.err, /vino-go-public: FAIL /);
});
