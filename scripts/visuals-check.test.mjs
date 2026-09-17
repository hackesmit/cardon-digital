/**
 * Unit tests for scripts/visuals-check.mjs.
 *
 *   node --test scripts/visuals-check.test.mjs
 *
 * The rule has a path half and a substance half. The path half is tested on
 * plain arrays with no git and no filesystem in the way; the substance half on
 * pairs of sources. The ones that need a repo build one in a temp directory and
 * commit into it, because "a rename out of the tree is still a deletion", "a
 * `git rm --cached` is a deletion" and "an unstaged cp plus rm is not one" are
 * claims about git's behaviour and a fake cannot prove them.
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
  COLLAPSE,
  COLLAPSE_FLOOR,
  CODE_FLOOR,
  lineCount,
  substance,
  stripComments,
  markupCount,
  paintCount,
  canvasCount,
  motionCounts,
  lostLines,
  facultyMoved,
  recordedLoss,
  MARKUP_TAG,
  profile,
  isLiveSource,
  compareVisual,
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
  assert.ok(notes[0].text.includes(`${lineCount(before)} lines down to ${lineCount(after)}`));
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
  assert.ok(text.includes("was emptied in place"), text);
  assert.ok(text.includes(`${lines} lines of source at the base, 1 left`), text);
  assert.match(text, /REWIRES a visual/, "tells the worker to rewire rather than delete");
  assert.match(text, /Daniel's decision alone/, "and whose decision retiring one is");
});


/* ---------- substance: a path kept is not a visual kept ----------

   Every case below is one of the seven shapes review s-48db walked through the
   round-one rule (state/review/s-48db/cases.txt, 7 of 13 exit 0), or a sibling
   of one. They share a single defect: the file measured its own existence, and
   a visual can lose its substance without losing its path.                  */

/** A visual with a canvas, an animation loop and some elements in it. */
function animatedSource(name, elements = 6, filler = 0) {
  const tags = Array.from(
    { length: elements },
    (_, i) => `      <span className="tick" key={${i}} />`,
  ).join("\n");
  const body = Array.from({ length: filler }, (_, i) => `    const step${i} = ${i} * 3 + 1;`).join("\n");
  return [
    `"use client";`,
    `import { useEffect, useRef } from "react";`,
    ``,
    `export default function ${name}() {`,
    `  const ref = useRef(null);`,
    `  useEffect(() => {`,
    `    const ctx = ref.current.getContext("2d");`,
    ...(filler ? [body] : []),
    `    let raf = 0;`,
    `    const frame = () => {`,
    `      ctx.clearRect(0, 0, 100, 100);`,
    `      ctx.beginPath();`,
    `      ctx.arc(50, 50, 20, 0, Math.PI * 2);`,
    `      ctx.fill();`,
    `      raf = requestAnimationFrame(frame);`,
    `    };`,
    `    raf = requestAnimationFrame(frame);`,
    `    return () => cancelAnimationFrame(raf);`,
    `  }, []);`,
    `  return (`,
    `    <figure className="vis-frame">`,
    `      <canvas ref={ref} width={100} height={100} />`,
    tags,
    `    </figure>`,
    `  );`,
    `}`,
  ].join("\n");
}

/** classify() over one file changed in place, which is most of what follows. */
function inPlace(before, after, extra = {}) {
  return classify({
    basePaths: [B],
    nowPaths: [B],
    baseText: new Map([[B, before]]),
    nowText: new Map([[B, after]]),
    retired: [],
    ...extra,
  });
}

test("the four faculties are read off a real visual", () => {
  const p = profile(animatedSource("SectorMap"));
  assert.equal(p.markup, 8, "figure, canvas and six ticks");
  assert.equal(p.canvas, 1);
  assert.equal(p.paint, 4, "clearRect, beginPath, arc, fill");
  assert.equal(p.motion.requestAnimationFrame, 2);
  assert.ok(p.code > 0);
});

test("a stub that keeps ONE element does not clear the rule (s-48db case E)", () => {
  // The named root cause: the round-one rule fired only at markupCount === 0,
  // so one surviving tag cleared it and a 402-line visual collapsed to three
  // lines fell through to a shrink note, which never blocks.
  const before = animatedSource("SectorMap");
  const after = `export default function SectorMap() {\n  return <div className="vis-frame" aria-hidden="true" />;\n}\n`;
  assert.notEqual(markupCount(after), 0, "control: the round-one rule only fired at zero markup");
  assert.notEqual(substance(after), "", "control: and it is not empty either");
  const { failures } = inPlace(before, after);
  assert.deepEqual(failures.map((f) => [f.kind, f.path]), [["gutted", B]]);
  assert.ok(failures[0].detail.some((d) => d.includes("elements at the base")), failures[0].detail);
});

test("...and neither does one that keeps THREE", () => {
  // The sibling four lines away. A fix that special-cased one element would
  // leave this alive, which is this rig's most repeated failure.
  const before = animatedSource("SectorMap");
  const after = [
    `export default function SectorMap() {`,
    `  return (`,
    `    <figure className="vis-frame">`,
    `      <figcaption>Valle de Guadalupe</figcaption>`,
    `      <div className="vis-tag" />`,
    `    </figure>`,
    `  );`,
    `}`,
  ].join("\n");
  assert.equal(markupCount(after), 3);
  const { failures } = inPlace(before, after);
  assert.deepEqual(failures.map((f) => f.kind), ["gutted"]);
});

test("a re-export in place of a component is the same hole (s-48db case F)", () => {
  const before = animatedSource("SectorMap");
  const after = `import Placeholder from "@/components/Placeholder";\nexport default function SectorMap() {\n  return <Placeholder />;\n}\n`;
  const { failures } = inPlace(before, after);
  assert.deepEqual(failures.map((f) => f.kind), ["gutted"]);
});

test("a small visual is judged by what it lost, never by a ratio", () => {
  // COLLAPSE_FLOOR is why one element of three reads as an edit and one of
  // seventy-four as a deleted drawing.
  assert.ok(1 / (COLLAPSE_FLOOR - 1) >= COLLAPSE, "control: below the floor no ratio can trip");
  const tiny = `export default function Tag() {\n  return <p><b>x</b><i>y</i></p>;\n}\n`;
  const smaller = `export default function Tag() {\n  return <p>x</p>;\n}\n`;
  assert.equal(markupCount(tiny), 3, "control: three opening tags");
  assert.equal(markupCount(smaller), 1);
  const { failures } = inPlace(tiny, smaller);
  assert.deepEqual(failures, []);
});

test("killing the animation loop is a deletion, with every line kept (s-48db case G)", () => {
  // Two lines changed, 0 lines lost, all the markup intact, and round one did
  // not even print a note. There was no animation predicate in the file at all.
  const before = animatedSource("SectorMap");
  const after = before.split("raf = requestAnimationFrame(frame);").join("raf = 0;");
  assert.equal(lineCount(after), lineCount(before), "control: the line count did not move");
  assert.equal(markupCount(after), markupCount(before), "control: every element is still there");
  assert.equal(paintCount(after), paintCount(before), "control: it still draws");
  const { failures } = inPlace(before, after);
  assert.deepEqual(failures.map((f) => [f.kind, f.path]), [["stilled", B]]);
  assert.match(failures[0].detail.join(" "), /requestAnimationFrame/);
});

test("an animation driver is counted on its own, never pooled into a total", () => {
  // SectorMap.tsx debounces its resize handler with a setTimeout four lines
  // from the loop. A single motion total would let the loop hide behind it.
  const before = animatedSource("SectorMap") + '\nconst spin = "@keyframes spin { to { opacity: 1; } }";\n';
  const after = before.split("raf = requestAnimationFrame(frame);").join("raf = 0;");
  assert.equal(motionCounts(after)["@keyframes"], motionCounts(before)["@keyframes"], "control: another driver survives");
  assert.ok(motionCounts(before)["@keyframes"] > 0);
  const { failures } = inPlace(before, after);
  assert.deepEqual(failures.map((f) => f.kind), ["stilled"]);
});

test("a canvas that stops taking a context has lost its drawing", () => {
  const before = animatedSource("SectorMap");
  const after = before.split("\n").filter((l) => !/getContext|ctx\./.test(l)).join("\n");
  assert.equal(canvasCount(after), 0);
  assert.equal(markupCount(after), markupCount(before), "control: the <canvas> element is still there");
  const { failures } = inPlace(before, after);
  assert.deepEqual(failures.map((f) => f.kind), ["gutted"]);
});

test("commenting a component out is deleting it, not keeping it", () => {
  // Every faculty but the line count is measured on comment-stripped source,
  // because a commented-out visual still counts its tags and its frames as text
  // and the line count goes UP.
  const before = animatedSource("SectorMap");
  const after = `/*\n${before}\n*/\nexport default function SectorMap() {\n  return <div className="vis-frame" />;\n}\n`;
  assert.ok(lineCount(after) > lineCount(before), "control: the file got longer");
  assert.equal(markupCount(stripComments(after)), 1);
  assert.equal(motionCounts(stripComments(after)).requestAnimationFrame, 0);
  const { failures } = inPlace(before, after);
  assert.equal(failures.length, 1);
  assert.equal(failures[0].path, B);
});

test("a body that collapses to a fraction of itself is gutted, markup or not", () => {
  const before = "export const steps = [\n" +
    Array.from({ length: 120 }, (_, i) => `  { id: ${i}, label: "step ${i}", x: ${i * 3}, y: ${i * 5} },`).join("\n") +
    "\n];\n";
  assert.ok(substance(before).length >= CODE_FLOOR, "control: big enough to judge by ratio");
  assert.equal(markupCount(before), 0, "control: no markup, so only the body rule can catch this");
  const after = "export const steps = [\n  { id: 0, label: \"step 0\", x: 0, y: 0 },\n];\n";
  const helper = `${WATCHED}/demos/steps.ts`;
  const { failures } = classify({
    basePaths: [helper],
    nowPaths: [helper],
    baseText: new Map([[helper, before]]),
    nowText: new Map([[helper, after]]),
    retired: [],
  });
  assert.deepEqual(failures.map((f) => f.kind), ["gutted"]);
});

test("a faculty that moved to another file under the tree is a note, not a failure", () => {
  // Extracting a drawing into a helper takes paint to zero in the file that had
  // it and loses nothing. The lines have to actually be there, and be NEW there.
  const helper = `${WATCHED}/home/canvasKit.ts`;
  const before = animatedSource("SectorMap");
  const drawing = before
    .split("\n")
    .filter((l) => /ctx\.|getContext/.test(l))
    .map((l) => l.trim());
  const after = before.split("\n").filter((l) => !/ctx\.|getContext/.test(l)).join("\n");
  const helperAfter = `export function draw(ctx) {\n  ${drawing.join("\n  ")}\n}\n`;
  const { failures, notes } = classify({
    basePaths: [B, helper],
    nowPaths: [B, helper],
    baseText: new Map([[B, before], [helper, "export function draw() {}\n"]]),
    nowText: new Map([[B, after], [helper, helperAfter]]),
    retired: [],
  });
  assert.deepEqual(failures, [], notes.map((n) => n.text).join("\n"));
  assert.ok(notes.some((n) => n.kind === "moved" && n.text.includes(helper)), notes.map((n) => n.text).join("\n"));
});

test("...and a line the other file always had rescues nothing", () => {
  // `raf = requestAnimationFrame(frame);` is a line four other visuals already
  // have. Only lines the destination GAINED count, or every loop in the tree
  // vouches for every loop that was cut out of it.
  const other = `${WATCHED}/winery/VineField.tsx`;
  const before = animatedSource("SectorMap");
  const after = before.split("raf = requestAnimationFrame(frame);").join("raf = 0;");
  const unchanged = animatedSource("VineField");
  const { failures } = classify({
    basePaths: [B, other],
    nowPaths: [B, other],
    baseText: new Map([[B, before], [other, unchanged]]),
    nowText: new Map([[B, after], [other, unchanged]]),
    retired: [],
  });
  assert.deepEqual(failures.map((f) => f.kind), ["stilled"]);
});

test("lostLines is the unit a faculty moves in, and facultyMoved needs it to be new", () => {
  const before = "<figure>\n<canvas />\n<span />\nconst x = 1;";
  const after = "const x = 1;";
  const lost = lostLines(before, after, MARKUP_TAG);
  assert.deepEqual(lost.sort(), ["<canvas />", "<figure>", "<span />"]);
  const live = "components/pages/home/draw-hub.tsx";
  assert.equal(facultyMoved(lost, [{ path: live, before: "", after }]), null, "nothing gained them");
  assert.equal(facultyMoved(lost, [{ path: live, before, after: before }]), null, "it always had them");
  assert.equal(facultyMoved(lost, [{ path: live, before: "", after: before }]).to, live);
});

/* ---------- a path kept is not a repository entry kept ---------- */

test("a file on this disk and out of the index is gone (s-48db case K)", () => {
  // `git rm --cached` plus a .gitignore line takes the visual out of every
  // clone and every other worktree, and leaves this machine's copy behind.
  const { failures } = classify({
    basePaths: [A, B],
    nowPaths: [A, B],
    trackedNow: [A],
    baseText: new Map([[B, animatedSource("SectorMap")]]),
    retired: [],
  });
  assert.deepEqual(failures.map((f) => [f.kind, f.path]), [["untracked", B]]);
  assert.match(failures[0].detail, /every clone/);
});

test("an unstaged rm is still a removal, which is why the disk is read at all", () => {
  const { failures } = classify({
    basePaths: [A, B],
    nowPaths: [A],
    trackedNow: [A, B],
    baseText: new Map([[B, animatedSource("SectorMap")]]),
    retired: [],
  });
  assert.deepEqual(failures.map((f) => [f.kind, f.path]), [["removed", B]]);
});

/* ---------- a rename is a move only where a visual can still be one ---------- */

test("a rename onto a dead extension is a deletion (s-48db cases H and I)", () => {
  // Round one printed "100% of its lines kept; a move inside components/pages/
  // is not a deletion" for exactly this, and exited 0. A .tsx.bak is never
  // compiled, never imported and never rendered.
  const text = animatedSource("SectorMap");
  for (const parked of [`${WATCHED}/home/SectorMap.tsx.bak`, `${WATCHED}/home/SectorMap.old.txt`]) {
    assert.equal(isLiveSource(parked), false, parked);
    const { failures } = classify({
      basePaths: [B],
      nowPaths: [parked],
      trackedNow: [parked],
      baseText: new Map([[B, text]]),
      nowText: new Map([[parked, text]]),
      retired: [],
    });
    assert.deepEqual(failures.map((f) => [f.kind, f.path]), [["removed", B]], parked);
  }
});

test("isLiveSource is about what the build compiles", () => {
  for (const live of ["a/b.tsx", "a/b.ts", "a/b.jsx", "a/b.mjs", "a/b.svg", "a/b.css"]) {
    assert.equal(isLiveSource(live), true, live);
  }
  for (const dead of ["a/b.tsx.bak", "a/b.old.txt", "a/b.md", "a/b", "a/.keep", "a/b.tsx~"]) {
    assert.equal(isLiveSource(dead), false, dead);
  }
});

test("a recorded deletion needs a recorded arrival, an unstaged one does not", () => {
  // The false positive to avoid is a move made by hand mid-edit: cp then rm,
  // nothing staged, both ends untracked. The hole to close is a COMMITTED
  // deletion excused by a file nobody else will ever get.
  const moved = `${WATCHED}/home/SectorDiagram.tsx`;
  const text = animatedSource("SectorMap");
  const shared = {
    basePaths: [B],
    nowPaths: [moved],
    baseText: new Map([[B, text]]),
    nowText: new Map([[moved, text]]),
    retired: [],
  };

  const byHand = classify({ ...shared, trackedNow: [B] });
  assert.deepEqual(byHand.failures, [], "cp + rm, nothing staged: the index still has the source");
  assert.deepEqual(byHand.notes.map((n) => n.kind), ["moved"]);

  const committed = classify({ ...shared, trackedNow: [] });
  assert.deepEqual(committed.failures.map((f) => f.kind), ["removed"], "the deletion is recorded, the arrival is not");
});

test("a rescued move is measured at its destination (s-48db case J)", () => {
  // Round one stopped looking once a removal was called a move, so `git mv`
  // plus stripping every markup line scored 84% and passed, while the identical
  // content left under its own name failed as gutted. Renaming is not a
  // discount: 84% because a 300-line component is only 49 lines of markup.
  const moved = `${WATCHED}/home/SectorDiagram.tsx`;
  const before = animatedSource("SectorMap", 6, 80);
  const after = before.split("\n").filter((l) => !new RegExp(MARKUP_TAG.source).test(l)).join("\n");
  assert.ok(
    similarity(before, after) >= RENAME_THRESHOLD,
    `control: git would still call this a rename (${similarity(before, after)})`,
  );
  const { failures, notes } = classify({
    basePaths: [B],
    nowPaths: [moved],
    trackedNow: [moved],
    baseText: new Map([[B, before]]),
    nowText: new Map([[moved, after]]),
    retired: [],
  });
  assert.deepEqual(failures.map((f) => [f.kind, f.path]), [["gutted", B]]);
  assert.equal(failures[0].at, moved, "and it says where it measured");
  assert.ok(notes.some((n) => n.kind === "moved"));
});

test("RETIRED still covers every shape, which is the only way out", () => {
  const retired = [{ path: B, date: "2026-09-15", reason: "Daniel approved it" }];
  const before = animatedSource("SectorMap");
  const stub = `export default function SectorMap() {\n  return <div />;\n}\n`;
  const stilled = before.split("raf = requestAnimationFrame(frame);").join("raf = 0;");
  for (const [what, after] of [["gutted", stub], ["stilled", stilled], ["emptied", ""]]) {
    const { failures } = inPlace(before, after, { retired });
    assert.deepEqual(failures, [], what);
  }
  const gone = classify({ basePaths: [B], nowPaths: [], baseText: new Map([[B, before]]), retired });
  assert.deepEqual(gone.failures, [], "removed");
});

/* ---------- and the same shapes against real git ---------- */

/** A throwaway repo whose visual is a real component with a loop in it. */
function repoWithAnimation() {
  const dir = mkdtempSync(join(tmpdir(), "visuals-check-anim-"));
  const git = (...args) => execFileSync("git", args, { cwd: dir, stdio: "ignore" });
  git("init", "-q", "-b", "main");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "test");
  mkdirSync(join(dir, WATCHED, "home"), { recursive: true });
  writeFileSync(join(dir, B), animatedSource("SectorMap", 6, 80));
  git("add", "-A");
  git("commit", "-qm", "one animated visual");
  return dir;
}

const runIn = (dir, argv = ["--base", "HEAD"]) => {
  const out = [];
  const code = main(argv, (m) => out.push(m), (m) => out.push(m), { cwd: dir, retired: [] });
  return { code, text: out.join("\n") };
};

test("git rm --cached plus a .gitignore line fails against real git", (t) => {
  const dir = repoWithAnimation();
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  execFileSync("git", ["rm", "-q", "--cached", B], { cwd: dir, stdio: "ignore" });
  writeFileSync(join(dir, ".gitignore"), `${B}\n`);
  execFileSync("git", ["add", ".gitignore"], { cwd: dir, stdio: "ignore" });
  execFileSync("git", ["commit", "-qm", "untrack it"], { cwd: dir, stdio: "ignore" });
  assert.ok(readFileSync(join(dir, B), "utf8").length > 0, "control: the file is still on this disk");

  const { code, text } = runIn(dir, ["--base", "HEAD^"]);
  assert.equal(code, 1, text);
  assert.ok(text.includes(B), text);
  assert.match(text, /removed from the repository/);
});

test("a git mv onto .tsx.bak fails against real git", (t) => {
  const dir = repoWithAnimation();
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  execFileSync("git", ["mv", B, `${B}.bak`], { cwd: dir, stdio: "ignore" });
  execFileSync("git", ["commit", "-qm", "retire it"], { cwd: dir, stdio: "ignore" });

  const { code, text } = runIn(dir, ["--base", "HEAD^"]);
  assert.equal(code, 1, text);
  assert.ok(text.includes(B), text);
});

test("an unstaged cp then rm still passes against real git", (t) => {
  // The bead's own constraint, and the false positive a stricter rename rule
  // would introduce: a move made by hand, with nothing staged at either end.
  const dir = repoWithAnimation();
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  copyFileSync(join(dir, B), join(dir, WATCHED, "home", "SectorDiagram.tsx"));
  rmSync(join(dir, B));

  const { code, text } = runIn(dir);
  assert.equal(code, 0, text);
  assert.match(text, /moved to/);
});

test("the animation cut out in place fails against real git", (t) => {
  const dir = repoWithAnimation();
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  const src = readFileSync(join(dir, B), "utf8");
  writeFileSync(join(dir, B), src.split("raf = requestAnimationFrame(frame);").join("raf = 0;"));

  const { code, text } = runIn(dir);
  assert.equal(code, 1, text);
  assert.match(text, /lost its animation/);
  assert.match(text, /Daniel's decision alone/);
});

test("VISUALS_BASE says so, because it is an off switch", (t) => {
  // Undocumented in round one: with visuals deleted and committed,
  // VISUALS_BASE=HEAD made the whole suite green and nothing printed why.
  const dir = repoWithAnimation();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  execFileSync("git", ["rm", "-q", B], { cwd: dir, stdio: "ignore" });
  execFileSync("git", ["commit", "-qm", "delete it"], { cwd: dir, stdio: "ignore" });

  const before = process.env.VISUALS_BASE;
  process.env.VISUALS_BASE = "HEAD";
  t.after(() => {
    if (before === undefined) delete process.env.VISUALS_BASE;
    else process.env.VISUALS_BASE = before;
  });

  const errs = [];
  const code = main([], () => {}, (m) => errs.push(m), { cwd: dir, retired: [] });
  assert.equal(code, 0, "control: an overridden baseline really does pass anything");
  assert.match(errs.join("\n"), /VISUALS_BASE=HEAD/, "and it is on the record");
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

/* ---------- rule 6: a faculty moves only where it can still be a visual ---------- */

// The body of the visual, kept verbatim, parked somewhere it cannot render.
// Before rule 6 every one of these excused the gutting and the guard said so in
// its own output: "drawing operations moved to .../SectorMap.old.txt", exit 0.
const GUTTED = `export default function SectorMap() {\n  return <div className="vis-frame" />;\n}`;

const gutWithCopyAt = (copy, trackedNow) =>
  classify({
    basePaths: [B],
    nowPaths: [B, copy],
    trackedNow,
    baseText: new Map([[B, visualSource("SectorMap")]]),
    nowText: new Map([[B, GUTTED], [copy, visualSource("SectorMap")]]),
    retired: [],
  });

test("a copy parked on a dead extension does not rescue a gutting (s-4009 case AC)", () => {
  // The exact destination rule 4 already rejects for a removal, committed.
  const copy = `${WATCHED}/home/SectorMap.old.txt`;
  assert.equal(isLiveSource(copy), false, "control: .old.txt is not a file the build compiles");
  const { failures, notes } = gutWithCopyAt(copy, [B, copy]);
  assert.equal(failures.length, 1, JSON.stringify(notes));
  assert.equal(failures[0].path, B);
  assert.equal(failures[0].kind, "gutted");
  assert.ok(!notes.some((n) => n.text.includes(copy)), "and it is not named as the drawing's new home");
});

test("an untracked sibling rescues a gutting still in progress on disk (s-4009 case AB, unrecorded)", () => {
  // This expectation was the opposite until round three's review (s-1ae3), and
  // it is worth writing down why it flipped rather than quietly deleting it.
  // It holds only while the gutting itself is unrecorded; the test after this
  // one is the same tree with the gutting staged, and that fails.
  //
  // Catching AB meant demanding an INDEXED arrival unconditionally, and that
  // failed the most ordinary honest refactor there is: extract a drawing into a
  // helper, run the tests before staging anything, and the helper is untracked,
  // so the drawing reads as deleted and the failure prints a git checkout that
  // discards the refactor's call-site edit. A guard that fails honest work gets
  // bypassed, and this one was charging that price for nothing: AB passes with a
  // single `git add` of the sibling, so the index never stopped an attacker who
  // could type six characters. It only ever stopped an author mid-refactor.
  //
  // What actually separates AB from a real extraction is that nothing IMPORTS
  // SectorMapLegacy.tsx: it is dead code wearing a live extension. That is the
  // reachability question, which this guard cannot answer by reading source as
  // text, and it is carried by hq-4pu0q.23 rather than pretended at here.
  const copy = `${WATCHED}/home/SectorMapLegacy.tsx`;
  assert.equal(isLiveSource(copy), true, "control: .tsx is a file the build compiles");
  const { failures, notes } = gutWithCopyAt(copy, [B]);
  assert.deepEqual(failures, [], "not caught, and the comment above says why");
  assert.ok(
    notes.some((n) => n.kind === "moved" && n.text.includes(copy)),
    "it is reported as a move, so the band is not silent",
  );
});

test("an untracked sibling does not rescue a gutting HEAD or the index records (s-7729 G1)", () => {
  const copy = `${WATCHED}/home/SectorMapLegacy.tsx`;
  const { failures } = classify({
    basePaths: [B],
    nowPaths: [B, copy],
    trackedNow: [B],
    baseText: new Map([[B, visualSource("SectorMap")]]),
    nowText: new Map([[B, GUTTED], [copy, visualSource("SectorMap")]]),
    recordedText: new Map([[B, [visualSource("SectorMap"), GUTTED]]]),
    retired: [],
  });
  assert.equal(failures.length, 1);
  assert.equal(failures[0].path, B);
  assert.deepEqual(failures[0].addTo, [copy], "the remedy is to add the home, not to take the file back");
});

test("rule 6 keeps the counterweight it was added to: a tracked helper still rescues", () => {
  // Same content and the same extension as the case above. The only difference
  // is that the index records it, so an extract-to-helper is still not a
  // false positive. This is the pair that proves rule 6 cuts where it means to.
  const copy = `${WATCHED}/home/draw-hub.tsx`;
  const { failures, notes } = gutWithCopyAt(copy, [B, copy]);
  assert.deepEqual(failures, []);
  assert.ok(notes.some((n) => n.kind === "moved" && n.text.includes(copy)));
});

test("facultyMoved applies rule 4's two tests itself", () => {
  const lost = ["<figure>"];
  const arrival = (path) => [{ path, before: "", after: "<figure>" }];
  assert.equal(facultyMoved(lost, arrival("a/b/park.tsx.bak")), null, "a dead extension is no home");
  assert.equal(facultyMoved(lost, arrival("a/b/park.txt")), null, "nor is a .txt");
  assert.equal(facultyMoved(lost, arrival("a/b/live.tsx")).to, "a/b/live.tsx");
  // The index test is rule 4's and it is CONDITIONAL there: an indexed arrival is
  // demanded only for the part of the loss HEAD or the index already records.
  // Unconditional, it failed an extraction tested before staging (s-1ae3); never
  // asked, it passed a committed gutting whose helper no clone has (s-7729).
  const untracked = new Set(["a/b/other.tsx"]);
  assert.equal(
    facultyMoved(lost, arrival("a/b/live.tsx"), untracked).to,
    "a/b/live.tsx",
    "an unstaged helper is still a home while the loss is unstaged too",
  );
  const inHead = [new Set(lost), new Set()];
  assert.equal(
    facultyMoved(lost, arrival("a/b/live.tsx"), untracked, inHead),
    null,
    "but once the loss is recorded, the arrival has to be recorded too",
  );
  // Recorded means its recorded TEXT holds the lines, not that its path is
  // listed: a stub helper committed first and filled only on disk is no home
  // for a committed gutting (s-01c6 A1).
  const tracked = new Set(["a/b/live.tsx"]);
  const recordedAs = (head, index) => [{ path: "a/b/live.tsx", before: "", after: "<figure>", recorded: [head, index] }];
  assert.equal(facultyMoved(lost, arrival("a/b/live.tsx"), tracked, inHead), null, "tracked, recorded text unknown");
  assert.equal(facultyMoved(lost, recordedAs("export {};", "export {};"), tracked, inHead), null, "a recorded stub");
  assert.equal(facultyMoved(lost, recordedAs("<figure>", "<figure>"), tracked, inHead).to, "a/b/live.tsx");
  // Each version answers for its own loss: HEAD for what HEAD lacks, the index
  // for what the index lacks.
  const inIndexOnly = [new Set(), new Set(lost)];
  assert.equal(facultyMoved(lost, recordedAs("export {};", "<figure>"), tracked, inIndexOnly).to, "a/b/live.tsx");
  assert.equal(facultyMoved(lost, recordedAs("<figure>", "export {};"), tracked, inIndexOnly), null);
  // isLiveSource is the half of rule 6 that holds whether or not anything is staged.
  assert.equal(facultyMoved(lost, arrival("a/b/park.txt"), new Set(["a/b/park.txt"])), null);
});

test("the recorded part of a loss is what HEAD or the index lacks, line by line", () => {
  const lost = ["<figure>", "<canvas />"];
  const sets = (versions) => versions.map((v) => [...v]);
  assert.deepEqual(sets(recordedLoss(lost, [])), [[], []], "nothing recorded: nothing asked");
  assert.deepEqual(sets(recordedLoss(lost, ["<figure>\n<canvas />", undefined])), [[], []], "both still recorded");
  assert.deepEqual(
    sets(recordedLoss(lost, ["<figure>\n<canvas />", "<figure>"])),
    [[], ["<canvas />"]],
    "the index lacks one, and it is the index that lacks it",
  );
  // Half the lines staged gone and half only on disk: the untracked helper
  // rescues the unrecorded half and not the recorded half, so it scores below
  // the threshold and a gutting cannot be smuggled through by staging most of it.
  const four = ["<a>", "<b>", "<c>", "<d>"];
  const helper = [{ path: "a/b/live.tsx", before: "", after: four.join("\n") }];
  assert.equal(facultyMoved(four, helper, new Set(), [new Set(), new Set(["<a>", "<b>", "<c>"])]), null);
  assert.equal(facultyMoved(four, helper, new Set(), [new Set(), new Set(["<a>"])]).to, "a/b/live.tsx");
  // The same holds for a TRACKED helper whose recorded copy has only some of
  // them: partial recorded content does not rescue the whole loss (s-01c6 A1p).
  const part = [{ ...helper[0], recorded: ["<a>", "<a>"] }];
  const allRecorded = [new Set(four), new Set(four)];
  assert.equal(facultyMoved(four, part, new Set(["a/b/live.tsx"]), allRecorded), null);
});

/* ---------- rule 7: the band that passes does not pass in silence ---------- */

test("a faculty in the residual band is a note even when the line count does not move", () => {
  // s-4009 case AL: 26 of 74 elements, just above COLLAPSE, and the file went
  // 402 lines to 398, so the line-count spine printed nothing at all.
  const rects = (n) => Array.from({ length: n }, (_, i) => `      <rect x={${i}} />`).join("\n");
  const pad = (n) => Array.from({ length: n }, () => `      const pad = 1;`).join("\n");
  const before = visualSource("SectorMap", rects(20));
  const after = visualSource("SectorMap", `${rects(7)}\n${pad(13)}`);
  assert.equal(lineCount(before), lineCount(after), "control: the line count does not move at all");

  const { failures, notes } = classify({
    basePaths: [B],
    nowPaths: [B],
    baseText: new Map([[B, before]]),
    nowText: new Map([[B, after]]),
    retired: [],
  });
  assert.deepEqual(failures, [], "still not a failure: it kept more than COLLAPSE");
  assert.deepEqual(notes.map((n) => n.kind), ["shrink"]);
  assert.match(notes[0].text, /elements 22 down to 9 \(41%\)/);
});

test("the shrink note leads with the faculties and puts the line count last", () => {
  // N3: a gutting can make a file LONGER, so the line count is a weak spine.
  // When both shrink, the measurement comes first and what got noticed second.
  const rects = (n) => Array.from({ length: n }, (_, i) => `      <rect x={${i}} />`).join("\n");
  const before = visualSource("SectorMap", rects(40));
  const after = visualSource("SectorMap", rects(14));
  const verdict = compareVisual(B, before, after);
  assert.equal(verdict.note.kind, "shrink");
  const text = verdict.note.text;
  assert.ok(text.includes("elements"), text);
  assert.ok(text.includes("lines down to"), text);
  assert.ok(text.indexOf("elements") < text.indexOf("lines down to"), `faculties must lead: ${text}`);
});

test("a faculty too small for a ratio to mean anything is not a note", () => {
  // The same floor the gutted rule uses: 1 of 3 is an edit, 1 of 63 is a loss.
  const before = visualSource("SectorMap");
  assert.ok(markupCount(before) < COLLAPSE_FLOOR, "control: this visual has few tags");
  const verdict = compareVisual(B, before, before);
  assert.equal(verdict, null);
});

/* ---------- s-7729: the loss recorded, its arrival not, against real git ---------- */

/** SectorMap.tsx becomes a wrapper that imports its whole body from `helper`. */
function extractWhole(dir, helper) {
  const rel = `./${helper.split("/").pop().replace(/\.tsx$/, "")}`;
  mkdirSync(join(dir, helper, ".."), { recursive: true });
  writeFileSync(join(dir, helper), animatedSource("SectorMapBody", 6, 80));
  writeFileSync(
    join(dir, B),
    `import SectorMapBody from "${rel}";\n\nexport default function SectorMap() {\n  return <SectorMapBody />;\n}\n`,
  );
}

const inRepo = (dir) => (...args) => execFileSync("git", args, { cwd: dir, stdio: "ignore" });
const HELPER = `${WATCHED}/home/SectorMapBody.tsx`;

test("a gutting committed with its imported helper left untracked fails, and says git add (G1)", (t) => {
  const dir = repoWithAnimation();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const git = inRepo(dir);
  git("tag", "base");
  extractWhole(dir, HELPER);
  git("add", B);
  git("commit", "-qm", "the wrapper only");

  const { code, text } = runIn(dir, ["--base", "base"]);
  assert.equal(code, 1, text);
  assert.ok(text.includes(`FAIL  ${B}`), text);
  assert.ok(text.includes(`git add ${HELPER}`), text);
  assert.ok(!text.includes("git checkout"), `a checkout would discard the refactor: ${text}`);
  assert.ok(text.indexOf("git show") < text.indexOf("git add"), "reading what left still leads");
});

test("the same with the helper gitignored fails too, which the disk cannot see (G1i)", (t) => {
  const dir = repoWithAnimation();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const git = inRepo(dir);
  git("tag", "base");
  extractWhole(dir, HELPER);
  writeFileSync(join(dir, WATCHED, "home", ".gitignore"), "SectorMapBody.tsx\n");
  git("add", "-A");
  git("commit", "-qm", "gut, and ignore the helper");

  const { code, text } = runIn(dir, ["--base", "base"]);
  assert.equal(code, 1, text);
  assert.ok(text.includes(B), text);
});

test("the gutting staged and its helper not is one tree, and it fails with git add (G1s, H1s)", (t) => {
  const dir = repoWithAnimation();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  extractWhole(dir, HELPER);
  inRepo(dir)("add", B);

  const { code, text } = runIn(dir);
  assert.equal(code, 1, text);
  assert.ok(text.includes(`git add ${HELPER}`), text);
  assert.ok(!text.includes("git checkout"), text);
});

test("a committed gutting is not unrecorded by an unrelated unstaged edit on top", (t) => {
  const dir = repoWithAnimation();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const git = inRepo(dir);
  git("tag", "base");
  extractWhole(dir, HELPER);
  git("add", B);
  git("commit", "-qm", "the wrapper only");
  writeFileSync(join(dir, B), `${readFileSync(join(dir, B), "utf8")}// an unrelated edit\n`);

  const { code, text } = runIn(dir, ["--base", "base"]);
  assert.equal(code, 1, text);
});

test("an extraction tested before anything is staged passes, in any directory (H2, H3, s-1ae3 F1)", (t) => {
  for (const helper of [HELPER, `${WATCHED}/home/sector/SectorMapBody.tsx`, `${WATCHED}/home/canvas/draw/SectorMapBody.tsx`]) {
    const dir = repoWithAnimation();
    t.after(() => rmSync(dir, { recursive: true, force: true }));
    extractWhole(dir, helper);
    const { code, text } = runIn(dir);
    assert.equal(code, 0, `${helper}: ${text}`);
    assert.match(text, /moved to/);
  }
});

test("the helper staged and the call site not passes, and so does a committed extraction edited on top (H3s, H4)", (t) => {
  const staged = repoWithAnimation();
  t.after(() => rmSync(staged, { recursive: true, force: true }));
  extractWhole(staged, HELPER);
  inRepo(staged)("add", HELPER);
  assert.equal(runIn(staged).code, 0, runIn(staged).text);

  const done = repoWithAnimation();
  t.after(() => rmSync(done, { recursive: true, force: true }));
  const git = inRepo(done);
  git("tag", "base");
  extractWhole(done, HELPER);
  git("add", "-A");
  git("commit", "-qm", "extract");
  writeFileSync(join(done, B), `${readFileSync(join(done, B), "utf8")}// an unrelated edit\n`);
  const { code, text } = runIn(done, ["--base", "base"]);
  assert.equal(code, 0, text);
});

/* ---------- s-01c6: the arrival tracked by path, not by content ---------- */

/** Commit a helper stub, or the first `keep` of a real body, before the move. */
function stubFirst(dir, keep = null) {
  const git = inRepo(dir);
  git("tag", "base");
  mkdirSync(join(dir, HELPER, ".."), { recursive: true });
  const body = animatedSource("SectorMapBody", 6, 80).split("\n");
  const recorded = keep === null ? "export {};\n" : `${body.slice(0, Math.floor(body.length * keep)).join("\n")}\n`;
  writeFileSync(join(dir, HELPER), recorded);
  git("add", HELPER);
  git("commit", "-qm", "the helper, before anything moves into it");
}

test("a gutting committed into a helper whose committed copy is a stub fails, and says git add (s-01c6 A1)", (t) => {
  const dir = repoWithAnimation();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  stubFirst(dir);
  extractWhole(dir, HELPER);
  inRepo(dir)("add", B);
  inRepo(dir)("commit", "-qm", "the wrapper only");

  const { code, text } = runIn(dir, ["--base", "base"]);
  assert.equal(code, 1, text);
  assert.ok(text.includes(`FAIL  ${B}`), text);
  assert.ok(text.includes(`git add ${HELPER}`), text);
  assert.ok(!text.includes("git checkout"), text);
  assert.ok(text.indexOf("git show") < text.indexOf("git add"), "reading what left still leads");
});

test("the same staged instead of committed fails too (s-01c6 A1s)", (t) => {
  const dir = repoWithAnimation();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  stubFirst(dir);
  extractWhole(dir, HELPER);
  inRepo(dir)("add", B);

  const { code, text } = runIn(dir, ["--base", "base"]);
  assert.equal(code, 1, text);
  assert.ok(text.includes(`git add ${HELPER}`), text);
});

test("a helper committed with part of the body does not rescue all of it (s-01c6 A1p)", (t) => {
  const dir = repoWithAnimation();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  stubFirst(dir, 0.3);
  extractWhole(dir, HELPER);
  inRepo(dir)("add", B);
  inRepo(dir)("commit", "-qm", "the wrapper only");

  const { code, text } = runIn(dir, ["--base", "base"]);
  assert.equal(code, 1, text);
});

test("a stub helper filled and committed with its call site passes, and so does one filled on disk only", (t) => {
  // The controls for the three above: the same pre-existing stub is an honest
  // home once its recorded copy holds the drawing, or while nothing is recorded.
  const done = repoWithAnimation();
  t.after(() => rmSync(done, { recursive: true, force: true }));
  stubFirst(done);
  extractWhole(done, HELPER);
  inRepo(done)("add", B, HELPER);
  inRepo(done)("commit", "-qm", "extract into the stub");
  const committed = runIn(done, ["--base", "base"]);
  assert.equal(committed.code, 0, committed.text);

  const disk = repoWithAnimation();
  t.after(() => rmSync(disk, { recursive: true, force: true }));
  stubFirst(disk);
  extractWhole(disk, HELPER);
  const unstaged = runIn(disk, ["--base", "base"]);
  assert.equal(unstaged.code, 0, unstaged.text);
  assert.match(unstaged.text, /moved to/);
});
