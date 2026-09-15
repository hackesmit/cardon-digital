/**
 * Unit tests for scripts/visuals-check.mjs.
 *
 *   node --test scripts/visuals-check.test.mjs
 *
 * The rule is a set difference, so most of it is tested on plain arrays of
 * paths with no git and no filesystem in the way. The two that do need a repo
 * build one in a temp directory and commit into it, because "a rename out of
 * the tree is still a deletion" is a claim about git's behaviour and a fake
 * cannot prove it.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, renameSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { WATCHED, RETIRED, validateRetired, findRemovals, main } from "./visuals-check.mjs";

const A = `${WATCHED}/home/HeroAssembly.tsx`;
const B = `${WATCHED}/home/SectorMap.tsx`;

test("a file that stays is not a removal", () => {
  const { removals, notes } = findRemovals([A, B], [A, B], []);
  assert.deepEqual(removals, []);
  assert.deepEqual(notes, []);
});

test("a file that leaves the tree is a removal", () => {
  const { removals } = findRemovals([A, B], [A], []);
  assert.deepEqual(removals, [B]);
});

test("a file added on the branch is not a removal", () => {
  const { removals } = findRemovals([A], [A, B], []);
  assert.deepEqual(removals, []);
});

test("a RETIRED entry covers exactly its own path", () => {
  const retired = [{ path: B, date: "2026-09-15", reason: "Daniel approved it" }];
  const covered = findRemovals([A, B], [A], retired);
  assert.deepEqual(covered.removals, []);
  assert.deepEqual(covered.notes.map((n) => n.kind), ["retired"]);

  const other = findRemovals([A, B], [B], retired);
  assert.deepEqual(other.removals, [A], "the entry must not exempt a different file");
});

test("an entry whose file is still here is a note, not a failure", () => {
  const retired = [{ path: A, date: "2026-09-15", reason: "going next commit" }];
  const { removals, notes } = findRemovals([A], [A], retired);
  assert.deepEqual(removals, []);
  assert.deepEqual(notes.map((n) => n.kind), ["pending"]);
});

test("an entry whose file left before this branch is historical, not a failure", () => {
  // Otherwise a retirement that has been on the default branch for a while
  // rots into a permanent failure, and the first person to hit it deletes the
  // record of the decision to get a green build.
  const retired = [{ path: B, date: "2026-01-01", reason: "retired long ago" }];
  const { removals, notes } = findRemovals([A], [A], retired);
  assert.deepEqual(removals, []);
  assert.deepEqual(notes.map((n) => n.kind), ["historical"]);
});

test("removals are reported in a stable order", () => {
  const { removals } = findRemovals([B, A], [], []);
  assert.deepEqual(removals, [A, B]);
});

test("the shipped RETIRED list is well formed", () => {
  assert.deepEqual(validateRetired(RETIRED), []);
});

test("a malformed RETIRED entry is a config error, never a throw", () => {
  assert.equal(validateRetired("nope").length, 1);
  assert.equal(validateRetired([{ path: A, date: "2026-09-15" }]).length, 1);
  assert.equal(validateRetired([{ path: "lib/i18n/home.ts", date: "d", reason: "r" }]).length, 1);
});

test("main exits 2 on a malformed RETIRED list rather than checking anything", () => {
  const errs = [];
  const code = main([], () => {}, (m) => errs.push(m), { retired: [{}] });
  assert.equal(code, 2);
  assert.ok(errs.length > 0);
});

test("main exits 2 when --base is given no ref", () => {
  const code = main(["--base"], () => {}, () => {}, { retired: [] });
  assert.equal(code, 2);
});

/* ---------- the two that need a real repository ---------- */

/** A throwaway repo with one commit holding two visuals. Returns its path. */
function repoWithVisuals() {
  const dir = mkdtempSync(join(tmpdir(), "visuals-check-"));
  const git = (...args) => execFileSync("git", args, { cwd: dir, stdio: "ignore" });
  git("init", "-q", "-b", "main");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "test");
  mkdirSync(join(dir, WATCHED, "home"), { recursive: true });
  writeFileSync(join(dir, A), "export default function A() {}\n");
  writeFileSync(join(dir, B), "export default function B() {}\n");
  git("add", "-A");
  git("commit", "-qm", "visuals");
  return dir;
}

test("a plain unstaged rm fails, which a staged diff filter does not see", (t) => {
  const dir = repoWithVisuals();
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  rmSync(join(dir, B));
  const staged = execFileSync(
    "git",
    ["diff", "--cached", "--diff-filter=D", "--name-only", "HEAD", "--", WATCHED],
    { cwd: dir, encoding: "utf8" },
  ).trim();
  assert.equal(staged, "", "control: the staged diff filter sees nothing here");

  const out = [];
  const code = main(["--base", "HEAD"], (m) => out.push(m), (m) => out.push(m), { cwd: dir, retired: [] });
  assert.equal(code, 1);
  assert.ok(out.join("\n").includes(B));
});

test("a rename out of the tree fails, which git reports as a rename", (t) => {
  const dir = repoWithVisuals();
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  mkdirSync(join(dir, "attic"));
  renameSync(join(dir, A), join(dir, "attic", "HeroAssembly.tsx"));
  execFileSync("git", ["add", "-A"], { cwd: dir, stdio: "ignore" });
  const status = execFileSync(
    "git",
    ["diff", "--cached", "-M", "--name-status", "HEAD"],
    { cwd: dir, encoding: "utf8" },
  );
  assert.match(status, /^R\d*\t/m, "control: git calls this a rename, not a deletion");

  const out = [];
  const code = main(["--base", "HEAD"], (m) => out.push(m), (m) => out.push(m), { cwd: dir, retired: [] });
  assert.equal(code, 1);
  assert.ok(out.join("\n").includes(A));
});

test("an untouched repository is clean", (t) => {
  const dir = repoWithVisuals();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const out = [];
  const code = main([], (m) => out.push(m), (m) => out.push(m), { cwd: dir, retired: [] });
  assert.equal(code, 0, out.join("\n"));
});
