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
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, rmSync, renameSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  WATCHED,
  RETIRED,
  RENAME_THRESHOLD,
  SHRINK_NOTE,
  validateRetired,
  findRemovals,
  classify,
  lineCount,
  substance,
  markupCount,
  similarity,
  main,
} from "./visuals-check.mjs";

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

/* ---------- the content half: a name kept is not a visual kept ---------- */

/** A believable visual: enough lines for a similarity score to mean something. */
function visualSource(name, extra = "") {
  return [
    `import { useEffect, useRef } from "react";`,
    ``,
    `export default function ${name}() {`,
    `  const ref = useRef(null);`,
    `  useEffect(() => {`,
    `    const ctx = ref.current.getContext("2d");`,
    `    ctx.clearRect(0, 0, 100, 100);`,
    `  }, []);`,
    `  return (`,
    `    <figure className="vis-frame">`,
    `      <canvas ref={ref} width={100} height={100} />`,
    `    </figure>`,
    `  );`,
    `}`,
    extra,
  ].join("\n");
}

test("lineCount counts source lines, not blank ones", () => {
  assert.equal(lineCount("a\n\n\nb\n"), 2);
  assert.equal(lineCount("   \n\t\n"), 0);
});

test("substance is empty for a file whose source is only comments", () => {
  assert.equal(substance(""), "");
  assert.equal(substance("// visual retired by the copy bead\n"), "");
  assert.equal(substance("/* gone\n   for now */\n\n"), "");
  assert.notEqual(substance("export default function A() {}\n"), "");
});

test("markupCount counts opening tags, and not a less-than comparison", () => {
  // Closing tags are deliberately not counted. The rule only asks whether a
  // file has any markup left at all, and opens are the cheaper half to match.
  assert.equal(markupCount("<figure><canvas /></figure>"), 2);
  assert.equal(markupCount('<svg viewBox="0 0 10 10"><path d="M0 0" /></svg>'), 2);
  assert.equal(markupCount("if (a < b && c<d) return null;"), 0);
});

test("similarity is git's measure: shared source lines over the larger file", () => {
  const a = "one\ntwo\nthree\nfour";
  assert.equal(similarity(a, a), 1);
  assert.equal(similarity(a, "five\nsix\nseven\neight"), 0);
  assert.equal(similarity(a, "one\ntwo\nthree\nfour\nfive\nsix\nseven\neight"), 0.5);
});

test("a move inside the tree is a note, not a failure", () => {
  // The bead's constraint, and the regression this file exists to stop: a bare
  // set difference called `git mv SectorMap.tsx SectorDiagram.tsx` a deletion.
  const moved = `${WATCHED}/home/SectorDiagram.tsx`;
  const text = visualSource("SectorMap");
  const { failures, notes } = classify({
    basePaths: [A, B],
    nowPaths: [A, moved],
    baseText: new Map([[B, text]]),
    nowText: new Map([[moved, text]]),
    retired: [],
  });
  assert.deepEqual(failures, []);
  assert.deepEqual(notes.map((n) => n.kind), ["moved"]);
  assert.ok(notes[0].text.includes(moved));
});

test("a move that keeps most of the file is still a move", () => {
  const moved = `${WATCHED}/home/SectorDiagram.tsx`;
  const before = visualSource("SectorMap");
  const after = visualSource("SectorDiagram", "// one new line\n// and another");
  assert.ok(similarity(before, after) >= RENAME_THRESHOLD, "control: git would call this a rename");
  const { failures } = classify({
    basePaths: [B],
    nowPaths: [moved],
    baseText: new Map([[B, before]]),
    nowText: new Map([[moved, after]]),
    retired: [],
  });
  assert.deepEqual(failures, []);
});

test("a deletion dressed as a move fails, because nothing of it survived", () => {
  // Fail closed. A new file that shares nothing with the one that left is a new
  // file, and the visual is still gone.
  const other = `${WATCHED}/home/Unrelated.tsx`;
  const before = visualSource("SectorMap");
  const after = "export const flag = true;\n";
  assert.ok(similarity(before, after) < RENAME_THRESHOLD, "control: git would not call this a rename");
  const { failures } = classify({
    basePaths: [B],
    nowPaths: [other],
    baseText: new Map([[B, before]]),
    nowText: new Map([[other, after]]),
    retired: [],
  });
  assert.deepEqual(failures.map((f) => [f.kind, f.path]), [["removed", B]]);
  assert.equal(failures[0].baseLines, lineCount(before));
});

test("emptying a file in place is a deletion with the name left behind", () => {
  const before = visualSource("SectorMap");
  for (const after of ["", "\n\n", "// visual retired\n"]) {
    const { failures } = classify({
      basePaths: [B],
      nowPaths: [B],
      baseText: new Map([[B, before]]),
      nowText: new Map([[B, after]]),
      retired: [],
    });
    assert.deepEqual(
      failures.map((f) => [f.kind, f.path]),
      [["emptied", B]],
      `"${after.replace(/\n/g, "\\n")}" must not pass`,
    );
    assert.equal(failures[0].baseLines, lineCount(before), "the line count is the part Daniel noticed");
  }
});

test("gutting a component down to a shell that still parses is a deletion too", () => {
  const before = visualSource("SectorMap");
  const after = "export default function SectorMap() {\n  return null;\n}\n";
  assert.notEqual(substance(after), "", "control: this one is not empty, so only the markup rule catches it");
  const { failures } = classify({
    basePaths: [B],
    nowPaths: [B],
    baseText: new Map([[B, before]]),
    nowText: new Map([[B, after]]),
    retired: [],
  });
  assert.deepEqual(failures.map((f) => [f.kind, f.path]), [["gutted", B]]);
});

test("a file that never had markup cannot be gutted", () => {
  // components/pages/demos/palette.ts and friends are data, not drawings.
  const helper = `${WATCHED}/demos/palette.ts`;
  const { failures } = classify({
    basePaths: [helper],
    nowPaths: [helper],
    baseText: new Map([[helper, "export const RED = '#f00';\nexport const BLUE = '#00f';\n"]]),
    nowText: new Map([[helper, "export const RED = '#f00';\n"]]),
    retired: [],
  });
  assert.deepEqual(failures, []);
});

test("a visual that merely got smaller is a note, never a failure", () => {
  // A guard that argues with every rewrite gets deleted. This one reports the
  // shrink so a reviewer can ask about it, and still exits 0.
  const before = visualSource("SectorMap", Array.from({ length: 20 }, (_, i) => `  // step ${i}`).join("\n"));
  const after = visualSource("SectorMap");
  assert.ok(lineCount(after) / lineCount(before) < SHRINK_NOTE, "control: this is a big cut");
  const { failures, notes } = classify({
    basePaths: [B],
    nowPaths: [B],
    baseText: new Map([[B, before]]),
    nowText: new Map([[B, after]]),
    retired: [],
  });
  assert.deepEqual(failures, []);
  assert.deepEqual(notes.map((n) => n.kind), ["shrink"]);
  assert.ok(notes[0].text.includes(`${lineCount(before)} to ${lineCount(after)}`));
});

test("a RETIRED entry covers its file being emptied as well as removed", () => {
  const retired = [{ path: B, date: "2026-09-15", reason: "Daniel approved it" }];
  const { failures } = classify({
    basePaths: [B],
    nowPaths: [B],
    baseText: new Map([[B, visualSource("SectorMap")]]),
    nowText: new Map([[B, ""]]),
    retired,
  });
  assert.deepEqual(failures, []);
});

test("a file the caller did not read is never a failure", () => {
  // The runner only reads what git says changed, so an absent text entry means
  // "identical to the base" and must not be guessed at.
  const { failures, notes } = classify({ basePaths: [A, B], nowPaths: [A, B], retired: [] });
  assert.deepEqual(failures, []);
  assert.deepEqual(notes, []);
});

/* ---------- the same two rules, against real git ---------- */

/** A throwaway repo whose visual is a real component with markup in it. */
function repoWithMarkup() {
  const dir = mkdtempSync(join(tmpdir(), "visuals-check-real-"));
  const git = (...args) => execFileSync("git", args, { cwd: dir, stdio: "ignore" });
  git("init", "-q", "-b", "main");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "test");
  mkdirSync(join(dir, WATCHED, "home"), { recursive: true });
  writeFileSync(join(dir, B), visualSource("SectorMap"));
  git("add", "-A");
  git("commit", "-qm", "one visual");
  return dir;
}

test("git mv inside the tree passes, which the path set alone did not", (t) => {
  const dir = repoWithMarkup();
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  execFileSync("git", ["mv", B, `${WATCHED}/home/SectorDiagram.tsx`], { cwd: dir, stdio: "ignore" });
  const out = [];
  const code = main(["--base", "HEAD"], (m) => out.push(m), (m) => out.push(m), { cwd: dir, retired: [] });
  assert.equal(code, 0, out.join("\n"));
  assert.match(out.join("\n"), /moved to/);
});

test("an emptied file fails against real git, naming the file and the line count", (t) => {
  const dir = repoWithMarkup();
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  writeFileSync(join(dir, B), "// retired\n");
  const out = [];
  const code = main(["--base", "HEAD"], (m) => out.push(m), (m) => out.push(m), { cwd: dir, retired: [] });
  assert.equal(code, 1);
  const text = out.join("\n");
  assert.ok(text.includes(B), "names the file");
  const lines = lineCount(visualSource("SectorMap"));
  assert.ok(text.includes(`emptied in place (${lines} lines of source, 1 left)`), text);
  assert.match(text, /REWIRES a visual/, "tells the worker to rewire rather than delete");
  assert.match(text, /Daniel's decision alone/, "and whose decision retiring one is");
});

/* ---------- the wiring, which is the half that makes it enforcement ---------- */

test("the npm scripts a worker runs invoke the guard", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  assert.match(pkg.scripts["copy:check"], /visuals-check\.mjs/, "npm run copy:check must run it");
  assert.match(pkg.scripts.test, /visuals-check\.mjs/, "npm test must run it");
});

test("node scripts/copy-check.mjs <page> fails on a deleted visual", (t) => {
  // The measured hole this bead closes (s-08a3): every copy bead's Definition
  // of Done names THIS command, and with all four home visuals deleted it
  // printed "1 page(s) clean" and exited 0. A guard wired only into a sibling
  // script is voluntary.
  const dir = repoWithMarkup();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(join(dir, "scripts"), { recursive: true });
  mkdirSync(join(dir, "lib", "i18n"), { recursive: true });
  for (const f of ["copy-check.mjs", "visuals-check.mjs"]) copyFileSync(join("scripts", f), join(dir, "scripts", f));
  copyFileSync(join("lib", "i18n", "home.ts"), join(dir, "lib", "i18n", "home.ts"));
  execFileSync("git", ["add", "-A"], { cwd: dir, stdio: "ignore" });
  execFileSync("git", ["commit", "-qm", "scripts and a dictionary"], { cwd: dir, stdio: "ignore" });

  const copyCheck = () => spawnSync("node", ["scripts/copy-check.mjs", "home"], { cwd: dir, encoding: "utf8" });

  const clean = copyCheck();
  assert.equal(clean.status, 0, clean.stdout + clean.stderr);
  assert.ok(!clean.stdout.includes(WATCHED), "the guard says nothing when there is nothing to say");

  rmSync(join(dir, B));
  const broken = copyCheck();
  assert.equal(broken.status, 1, broken.stdout + broken.stderr);
  assert.ok(broken.stdout.includes(B), "the failure names the file");
  assert.match(broken.stdout, /REWIRES a visual/);
  assert.ok(!broken.stdout.includes("page(s) clean"), "and it stops before copy-check can say clean");
});
