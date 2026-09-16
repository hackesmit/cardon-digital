#!/usr/bin/env node
/**
 * visuals-check: the runnable half of docs/copy-doctrine.md section 8.
 *
 * A copy bead never deletes a visual. This fails when a visual that was under
 * `components/pages/` at the merge base with the default branch has lost its
 * substance, wherever its path ended up.
 *
 *   node scripts/visuals-check.mjs
 *   node scripts/visuals-check.mjs --base <ref>
 *
 * Exit 0 clean, 1 when a visual is gone, 2 on a usage or environment error.
 *
 * It also runs inside `node scripts/copy-check.mjs <page>`, because that is the
 * command every copy bead's Definition of Done names and a guard that only
 * fires from a sibling script nobody runs is voluntary (measured on hq-4pu0q.3:
 * with all four home visuals deleted, copy-check printed "1 page(s) clean").
 *
 * THE ONE IDEA. A visual can lose its substance without losing its path, so a
 * guard that measures whether a FILE exists cannot guard a VISUAL. Round one of
 * this check measured existence in three places and a review (s-48db) walked
 * seven deletion shapes straight through all three: a 402 line canvas component
 * rewritten to `return <div className="vis-frame" />` (one surviving tag beat a
 * markup-count-is-zero test), the same hole through a re-export, the animation
 * loop cut out in place with the line count untouched, a `git mv` onto
 * `.tsx.bak`, a `git rm` with the source parked beside it as a `.txt`, a rename
 * plus stripping every markup line in one commit, and `git rm --cached` with a
 * `.gitignore` line. Each one keeps a path, or keeps a file, or keeps a line
 * count, and none of them keeps the drawing.
 *
 * So this measures SUBSTANCE, in four faculties, and follows the visual through
 * a rename before measuring:
 *
 *   code      source with comments and whitespace removed
 *   markup    the elements it draws, JSX or SVG opening tags
 *   motion    the animation drivers, counted one kind at a time
 *   paint     the canvas operations it draws with
 *
 * A faculty the visual HAD and no longer has at all is a deletion of that
 * faculty. A faculty that survives below COLLAPSE of what it was is a gutting:
 * one tag out of sixty-three is a deleted drawing with a tag left on top of it.
 * Anything short of that is a shrink note and never blocks, because a visual
 * can legitimately get smaller and a guard that argues with every rewrite gets
 * deleted.
 *
 * WHAT COUNTS AS STILL HERE, and why each rule is here rather than a simpler one.
 *
 * 1. The path left the tree. Compared as a set difference on paths rather than
 *    `git diff --diff-filter=D`, both measured against the commit this rule
 *    undoes (11d43c3, four visuals gone) and against a `git mv` of one of them
 *    out of the tree:
 *
 *      git diff -M --diff-filter=D --name-only <base>          the rename reads
 *        as R100, so the filter reports 0 files under components/pages
 *      git diff --cached --diff-filter=D --name-only <base> -- components/pages
 *        reports the rename, because its destination is outside the pathspec,
 *        but reports 0 for a plain unstaged `rm` of a tracked visual
 *      this script                                             reports 1 for
 *        each of those three, because it compares two sets of paths
 *
 * 2. Still here means still in the REPOSITORY, not still on this disk. The
 *    working tree is read from disk, because an unstaged `rm` is a deleted
 *    visual and the index does not know it yet. But a path that is on disk and
 *    no longer in the index is gone from every clone and every other worktree,
 *    and only this machine can see it: `git rm --cached` plus a `.gitignore`
 *    line passed round one. Present means on disk AND tracked.
 *
 * 3. ...but a move INSIDE the tree is not a deletion, and a bare set difference
 *    calls it one. `git mv components/pages/home/SectorMap.tsx
 *    components/pages/home/SectorDiagram.tsx` failed this check before the
 *    rescue below existed. So a path that left is matched against the paths
 *    that arrived, by shared source lines, and a match at or above
 *    RENAME_THRESHOLD is reported as a move. The threshold is git's own default
 *    for rename detection.
 *
 * 4. A move only rescues a deletion when the destination is somewhere the
 *    visual can still be a visual, which means two things. It has to be a file
 *    the build compiles (LIVE_EXTENSIONS): `SectorMap.tsx.bak` and
 *    `SectorMap.old.txt` are parking spaces, not destinations, and round one
 *    vouched for both in its own output. And a deletion already recorded in the
 *    index has to be answered by an arrival that is also recorded, or a
 *    committed removal can be excused by an untracked file nobody else will
 *    ever get. An unstaged move, where neither end is recorded, still passes:
 *    `cp` then `rm` mid-edit is how a move gets made by hand.
 *
 * 5. A rescued move is then measured AT ITS DESTINATION, not waved through.
 *    Round one stopped looking once a removal was classified as moved, so
 *    stripping every markup line from a component scored 84% (a 300 line
 *    component is only 49 unique lines of markup) and passed, while the exact
 *    same content left under its own name failed. Renaming is not a discount.
 *
 * 6. The same two tests decide where a FACULTY may move to. facultyMoved() is
 *    the counterweight that stops an extract-to-helper being a false positive,
 *    and round two gave it no liveness test at all, so a copy parked beside the
 *    gutted file excused every faculty it lost: review s-4009 gutted
 *    SectorMap.tsx in place, left the body as SectorMap.old.txt, and the guard
 *    printed "drawing operations moved to components/pages/home/SectorMap.old
 *    .txt" and exited 0, on the exact destination rule 4 rejects for a removal.
 *    A destination good enough to rescue a removal is the only destination good
 *    enough to rescue a gutting, so rule 4's predicate is applied here too: the
 *    arrival must be a file the build compiles AND a file the index records.
 *    An untracked sibling is a scratch copy, not the drawing's new home.
 *
 * 7. The band that passes does not pass in silence, and the faculties lead the
 *    note. Between COLLAPSE and SHRINK_NOTE a visual is smaller but not gone,
 *    which is legitimate and must not block. Round two measured that band on
 *    the LINE COUNT alone, and the line count is a weak spine for a rule about
 *    drawings: s-4009 cut 74 elements to 26 (35%, just above COLLAPSE) while
 *    the file went 402 lines to 398, and the guard printed nothing at all. So
 *    every faculty is compared against SHRINK_NOTE, not just the body, and the
 *    note reads elements first and lines last.
 *
 * Every failure names the file and its line count at the base, because the line
 * count is what got noticed (6157 lines of animation across hq-4pu0q.3 and
 * hq-4pu0q.4) and a path alone does not carry that.
 *
 * WHAT THIS CHECK CANNOT DO, stated here rather than implied away. It reads
 * source as TEXT, so it cannot tell live code from dead code. Wherever a
 * drawing's text survives but nothing renders it, the faculties still count and
 * this check stays quiet. Review s-4009 demonstrated three shapes it does not
 * catch, and two of them are still open on purpose:
 *
 *   - the body kept as an uncalled function with a stub exported in its place
 *     (the file gets LONGER, every faculty intact, the page renders an empty
 *     div)
 *   - the paint calls kept verbatim but aimed at a no-op object, so `.fill(` is
 *     still there and the receiver draws nothing
 *
 * Closing that class means asking the BUILD what renders instead of asking the
 * source what it says, which is a different measurement with its own Definition
 * of Done: hq-4pu0q.23. Do not read a green run of this check as proof that a
 * visual still renders. It proves the drawing's substance is still in the tree,
 * in a file the build compiles, which is less than that and worth having.
 *
 * RETIRED is the only way out, and retiring an animation is Daniel's decision
 * alone. An entry covers its path being removed, emptied, gutted or stilled.
 *
 * No dependencies. Node built-ins only, so it runs before `npm install`.
 */

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, posix } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/** The tree this rule guards, as a git pathspec and a directory name. */
export const WATCHED = "components/pages";

/** Shared source lines at or above this fraction means it moved, not left. */
export const RENAME_THRESHOLD = 0.5;

/** A surviving visual that kept less than this fraction of its lines is noted. */
export const SHRINK_NOTE = 0.6;

/** A faculty that kept less than this fraction of itself was gutted, not cut. */
export const COLLAPSE = 1 / 3;

/**
 * A faculty is only judged by ratio once it is big enough for a ratio to mean
 * anything: 1 of 3 elements is an edit, 1 of 63 is a deleted drawing.
 */
export const COLLAPSE_FLOOR = 4;

/** ...and the same for the body, in characters of comment-free source. */
export const CODE_FLOOR = 600;

/**
 * Extensions the build actually compiles. A rename is only a move when it lands
 * on one of these: `.tsx.bak` and `.old.txt` are never imported, never
 * rendered, and never seen again by anyone reading the site.
 */
export const LIVE_EXTENSIONS = [
  ".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs",
  ".svg", ".css", ".scss", ".sass", ".json",
];

/**
 * The animation drivers, counted ONE KIND AT A TIME on purpose. A single total
 * would let `raf = requestAnimationFrame(frame)` become `raf = 0` and hide
 * behind the `setTimeout` that debounces the resize handler four lines away,
 * which is exactly the two line diff that retired an animation in round one.
 * Only unambiguous drivers are in here: a bare `setTimeout` is as often a
 * debounce as a loop, and a rule that fires to zero must not guess.
 */
export const MOTION_DRIVERS = {
  requestAnimationFrame: /\brequestAnimationFrame\s*\(/g,
  setInterval: /\bsetInterval\s*\(/g,
  "element.animate": /\.animate\s*\(/g,
  "<animate>": /<animate[A-Za-z]*[\s/>]/g,
  "@keyframes": /@keyframes\b/g,
};

/**
 * The ink: the operations that actually put something on a `<canvas>`, and the
 * path calls that decide its shape. State writes (`fillStyle`, `globalAlpha`)
 * are deliberately NOT in here. They are settings, not drawing, and counting
 * them lets a canvas keep half its "paint" while drawing nothing at all.
 */
export const PAINT_OPS =
  /\.(?:fillRect|strokeRect|clearRect|beginPath|closePath|moveTo|lineTo|arcTo|arc|ellipse|quadraticCurveTo|bezierCurveTo|drawImage|fillText|strokeText|putImageData|createLinearGradient|createRadialGradient|createPattern|setLineDash|clip|fill|stroke)\s*\(/;

/**
 * Taking a drawing surface at all. Its own faculty, with a zero test and no
 * ratio: one `getContext` is as many as a visual ever needs, so the only honest
 * question is whether it still takes one.
 */
export const CANVAS_OPS = /\.getContext\s*\(/;

/**
 * Every visual Daniel has approved retiring, with the date and the reason.
 * Adding an entry here is how a visual is retired, and the entry is what a
 * reviewer reads. Nothing else in this repo may remove, empty, gut or still a
 * file under `components/pages/`.
 *
 * An entry is never itself a failure, in either direction. One whose file is
 * still present is reported as not yet removed, because the same commit that
 * adds the entry is the one that removes the file and the two orders of
 * writing it are both legitimate. One whose file left long ago and is no
 * longer at the merge base is reported as historical, because a retirement
 * that has been on the default branch for a while would otherwise rot into a
 * permanent failure and the first person to hit it would delete the record of
 * Daniel's decision to make the build green.
 */
export const RETIRED = [
  // { path: "components/pages/home/Example.tsx", date: "2026-09-15", reason: "..." },
];

/** Never throws. A malformed entry comes back as a message and main exits 2. */
export function validateRetired(retired) {
  if (!Array.isArray(retired)) return [`RETIRED must be an array, got ${typeof retired}`];
  const errors = [];
  retired.forEach((entry, i) => {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
      errors.push(`RETIRED entry ${i} must be an object with path, date and reason`);
      return;
    }
    for (const field of ["path", "date", "reason"]) {
      if (typeof entry[field] !== "string" || entry[field].trim() === "") {
        errors.push(`RETIRED entry ${i} needs a non-empty "${field}"`);
      }
    }
    if (typeof entry.path === "string" && !entry.path.startsWith(`${WATCHED}/`)) {
      errors.push(`RETIRED entry ${i} path must be under ${WATCHED}/, got "${entry.path}"`);
    }
  });
  return errors;
}

/**
 * The path half of the rule, with no git and no filesystem in it so a test can
 * drive it. `base` and `now` are arrays of repo-relative paths; `now` is what
 * is still here in the sense of rule 2, on disk AND in the index.
 */
export function findRemovals(base, now, retired = RETIRED) {
  const present = new Set(now);
  const wasThere = new Set(base);
  const approved = new Map(retired.map((e) => [e.path, e]));

  const removals = [];
  const notes = [];

  for (const path of [...wasThere].sort()) {
    if (present.has(path)) continue;
    const entry = approved.get(path);
    if (entry) notes.push({ kind: "retired", text: `${path}  retired ${entry.date}: ${entry.reason}` });
    else removals.push(path);
  }

  for (const entry of retired) {
    if (present.has(entry.path)) {
      notes.push({ kind: "pending", text: `${entry.path} is still here; the entry takes effect when it goes` });
    } else if (!wasThere.has(entry.path)) {
      notes.push({ kind: "historical", text: `${entry.path} left before this branch started; the entry is a record now` });
    }
  }

  return { removals, notes };
}

/** Non-blank lines, which is what "432 lines of animation" means here. */
export function lineCount(text) {
  return text.split("\n").filter((l) => l.trim() !== "").length;
}

/**
 * Source with its comments removed and its whitespace left alone, which is what
 * every faculty below is measured on. Commenting a component out is deleting it
 * with the text left behind: it keeps the line count, the tags and the
 * `requestAnimationFrame` calls, and it renders nothing. A `//` is only a
 * comment at the start of a line here, so a url inside a string survives.
 */
export function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|\n)[ \t]*\/\/[^\n]*/g, "$1");
}

/**
 * ...and with the whitespace gone too. An emptied file is one whose substance
 * is gone, so a `// visual retired` stub is as empty as a zero byte file.
 */
export function substance(text) {
  return stripComments(text).replace(/\s+/g, "");
}

/**
 * Opening JSX or SVG tags. No space after `<`, so a `a <b` comparison does not
 * read as markup.
 */
export const MARKUP_TAG = /<[A-Za-z][A-Za-z0-9._:-]*[\s/>]/;

export function markupCount(text) {
  const found = text.match(new RegExp(MARKUP_TAG.source, "g"));
  return found ? found.length : 0;
}

/** Canvas drawing operations. See PAINT_OPS. */
export function paintCount(text) {
  const found = text.match(new RegExp(PAINT_OPS.source, "g"));
  return found ? found.length : 0;
}

/** Canvas context acquisitions. See CANVAS_OPS. */
export function canvasCount(text) {
  const found = text.match(new RegExp(CANVAS_OPS.source, "g"));
  return found ? found.length : 0;
}

/** Animation drivers, per kind. See MOTION_DRIVERS. */
export function motionCounts(text) {
  const counts = {};
  for (const [name, re] of Object.entries(MOTION_DRIVERS)) {
    const found = text.match(new RegExp(re.source, "g"));
    counts[name] = found ? found.length : 0;
  }
  return counts;
}

/**
 * Everything the rules below measure, read once per file. Every faculty but the
 * line count is measured on the source with its comments stripped: a visual
 * wrapped in a block comment is a deleted visual that still counts 402 lines,
 * 63 tags and 2 animation frames if you read the file as text.
 */
export function profile(text) {
  const src = stripComments(text);
  return {
    lines: lineCount(text),
    code: substance(text).length,
    markup: markupCount(src),
    paint: paintCount(src),
    canvas: canvasCount(src),
    motion: motionCounts(src),
  };
}

/** Is this a path the build compiles? See rule 4. */
export function isLiveSource(path) {
  const slash = path.lastIndexOf("/");
  const dot = path.lastIndexOf(".");
  if (dot <= slash + 1) return false;
  return LIVE_EXTENSIONS.includes(path.slice(dot).toLowerCase());
}

/** Shared non-blank source lines over the larger file. git's own measure. */
export function similarity(a, b) {
  const linesOf = (t) => new Set(t.split("\n").map((l) => l.trim()).filter(Boolean));
  const la = linesOf(a);
  const lb = linesOf(b);
  if (la.size === 0 || lb.size === 0) return la.size === lb.size ? 1 : 0;
  let shared = 0;
  for (const line of la) if (lb.has(line)) shared++;
  return shared / Math.max(la.size, lb.size);
}

const pct = (n) => `${Math.round(n * 100)}%`;

const trimmedLines = (text) =>
  stripComments(text).split("\n").map((l) => l.trim()).filter(Boolean);

/**
 * The lines carrying `pattern` that this file had and no longer has. The unit
 * of a faculty moving house is a line of source, the same unit similarity() and
 * git's own rename detection use.
 */
export function lostLines(before, after, pattern) {
  const kept = new Set(trimmedLines(after));
  const re = new RegExp(pattern.source);
  const lost = new Set();
  for (const line of trimmedLines(before)) {
    if (kept.has(line) || !re.test(line)) continue;
    lost.add(line);
  }
  return [...lost];
}

/**
 * Did the substance move rather than die? Extracting a drawing into a helper
 * under the same tree, or splitting one big visual into two components, takes a
 * faculty to zero in the file that had it while losing nothing at all. The
 * honest question is not "is it still in this file" but "is it still in the
 * tree", so the lost lines are looked for in the files that CHANGED, and only
 * count where they are new: `raf = requestAnimationFrame(frame)` is a line four
 * other visuals already have, and a line a file always had rescues nothing.
 *
 * It cannot excuse a deletion: the source has to actually still be there, in a
 * live file under the watched tree, at git's own rename threshold.
 *
 * "Live file" is rule 4's own predicate, applied here for the reason in rule 6:
 * a destination good enough to rescue a REMOVAL is the only destination good
 * enough to rescue a GUTTING. `inIndex` is the set of paths the repository
 * knows about, or null for "do not ask", which is what a unit test wants.
 */
export function facultyMoved(lost, elsewhere, inIndex = null) {
  if (lost.length === 0) return null;
  for (const { path, before = "", after } of elsewhere) {
    if (after === undefined) continue;
    // Rule 6: a parking space is not a new home, in either direction.
    if (!isLiveSource(path)) continue;
    if (inIndex !== null && !inIndex.has(path)) continue;
    const had = new Set(trimmedLines(before));
    const has = new Set(trimmedLines(after));
    let gained = 0;
    for (const line of lost) if (has.has(line) && !had.has(line)) gained++;
    const score = gained / lost.length;
    if (score >= RENAME_THRESHOLD) return { to: path, score };
  }
  return null;
}

/**
 * The substance half of the rule: what the visual had against what it has,
 * wherever it now lives. `path` is the base path (what the worker has to put
 * back) and `at` is where it lives now, the same path unless it moved, and
 * `inIndex` is passed through to facultyMoved, which needs it for rule 6.
 *
 * Returns one failure, or one note, or null. A visual that lost its markup AND
 * its animation is one deleted visual carrying two reasons, not two failures,
 * and the headline is the loss a reader recognises first.
 */
export function compareVisual(path, before, after, at = path, elsewhere = [], inIndex = null) {
  const b = profile(before);
  const n = profile(after);
  const reasons = [];

  if (b.code !== 0 && n.code === 0) {
    reasons.push({
      kind: "emptied",
      pattern: /\S/,
      text: `${b.lines} lines of source at the base, ${n.lines} left`,
    });
  }

  const FACULTIES = [
    ["markup", "elements", MARKUP_TAG, true],
    ["paint", "drawing operations", PAINT_OPS, true],
    ["canvas", "canvas context(s)", CANVAS_OPS, false],
  ];
  for (const [faculty, what, pattern, byRatio] of FACULTIES) {
    if (b[faculty] > 0 && n[faculty] === 0) {
      reasons.push({ kind: "gutted", pattern, what, text: `${b[faculty]} ${what} at the base, 0 now` });
    } else if (byRatio && b[faculty] >= COLLAPSE_FLOOR && n[faculty] / b[faculty] < COLLAPSE) {
      reasons.push({
        kind: "gutted",
        pattern,
        what,
        text: `${b[faculty]} ${what} at the base, ${n[faculty]} now (${pct(n[faculty] / b[faculty])} of it)`,
      });
    }
  }

  for (const name of Object.keys(MOTION_DRIVERS)) {
    if (b.motion[name] > 0 && n.motion[name] === 0) {
      reasons.push({
        kind: "stilled",
        pattern: MOTION_DRIVERS[name],
        what: `${name} call(s)`,
        text: `${b.motion[name]} ${name} call(s) at the base, 0 now; the animation stopped`,
      });
    }
  }

  if (b.code >= CODE_FLOOR && n.code / b.code < COLLAPSE) {
    reasons.push({
      kind: "gutted",
      pattern: /\S/,
      what: "source",
      text: `${pct(n.code / b.code)} of its source left, comments and whitespace aside`,
    });
  }

  // A faculty that turned up somewhere else under the watched tree moved house.
  const moved = [];
  const lost = reasons.filter((r) => {
    const where = facultyMoved(lostLines(before, after, r.pattern), elsewhere, inIndex);
    if (!where) return true;
    moved.push(`${r.what ?? "its source"} moved to ${where.to} (${pct(where.score)} of the lines that left)`);
    return false;
  });

  if (!lost.length && moved.length) {
    return { note: { kind: "moved", text: `${path}: ${moved.join("; ")}` } };
  }

  const reported = lost;
  if (reported.length) {
    return {
      failure: {
        kind: reported[0].kind,
        path,
        baseLines: b.lines,
        nowLines: n.lines,
        detail: reported.map((r) => r.text).concat(moved),
        ...(at === path ? {} : { at }),
      },
    };
  }

  // Rule 7: the band between COLLAPSE and SHRINK_NOTE passes, but it does not
  // pass in silence, and the faculties lead because they are the measurement.
  const shrunk = [];
  const shrank = (was, now) => was > 0 && now / was < SHRINK_NOTE;
  const down = (was, now, what) => `${what} ${was} down to ${now} (${pct(now / was)})`;

  for (const [faculty, what] of [
    ["markup", "elements"],
    ["paint", "drawing operations"],
    ["canvas", "canvas context(s)"],
  ]) {
    if (b[faculty] >= COLLAPSE_FLOOR && shrank(b[faculty], n[faculty])) {
      shrunk.push(down(b[faculty], n[faculty], what));
    }
  }
  for (const name of Object.keys(MOTION_DRIVERS)) {
    if (b.motion[name] >= COLLAPSE_FLOOR && shrank(b.motion[name], n.motion[name])) {
      shrunk.push(down(b.motion[name], n.motion[name], `${name} call(s)`));
    }
  }
  if (b.code >= CODE_FLOOR && shrank(b.code, n.code)) {
    shrunk.push(`${pct(n.code / b.code)} of its source left, comments and whitespace aside`);
  }
  // The line count goes last. It is what got noticed, not what is measured:
  // a gutting can make a file LONGER (see rule 7).
  if (shrank(b.lines, n.lines)) shrunk.push(`${b.lines} lines down to ${n.lines}`);

  if (shrunk.length) {
    return {
      note: {
        kind: "shrink",
        text: `${path} kept its faculties but they got smaller: ${shrunk.join("; ")}` +
          `; not a failure, but say in the bead what left`,
      },
    };
  }

  return null;
}

/**
 * The whole rule, with no git and no filesystem in it.
 *
 *   basePaths             repo-relative paths under the watched tree at the base
 *   nowPaths              the same, on disk now (a move destination may be
 *                         untracked, so this is the disk and not the index)
 *   trackedNow            the subset of those the index knows about, or null to
 *                         say "do not ask", which is what a unit test wants
 *   baseText, nowText     Maps path -> source. Partial on purpose: a file the
 *                         caller knows is byte identical to the base need not
 *                         be read, and an unread file cannot have been gutted.
 *   movedOut              path -> a destination outside the watched tree, for
 *                         the message only. Never changes a verdict.
 *
 * Returns failures, each with a kind ("removed", "untracked", "emptied",
 * "gutted" or "stilled"), and notes, which never block.
 */
export function classify({
  basePaths,
  nowPaths,
  trackedNow = null,
  baseText = new Map(),
  nowText = new Map(),
  retired = RETIRED,
  movedOut = new Map(),
}) {
  const onDisk = new Set(nowPaths);
  const inIndex = trackedNow === null ? onDisk : new Set(trackedNow);
  // Rule 2: still here means on disk AND in the repository.
  const livePaths = nowPaths.filter((p) => inIndex.has(p));

  const { removals, notes } = findRemovals(basePaths, livePaths, retired);
  const approved = new Set(retired.map((e) => e.path));
  const failures = [];

  // A path that arrived on this branch is a candidate destination for a move.
  const wasThere = new Set(basePaths);
  const arrivals = nowPaths.filter((p) => !wasThere.has(p));

  // Base path -> where that visual lives now. Null means it is gone.
  const incarnation = new Map();
  for (const path of basePaths) if (inIndex.has(path) && onDisk.has(path)) incarnation.set(path, path);

  for (const path of removals) {
    const before = baseText.get(path);
    const lines = before === undefined ? null : lineCount(before);
    // Rule 4: a deletion the index already records needs an arrival it records too.
    const recordedGone = !inIndex.has(path);

    let moved = null;
    if (before !== undefined) {
      let best = 0;
      for (const candidate of arrivals) {
        if (!isLiveSource(candidate)) continue;
        if (recordedGone && !inIndex.has(candidate)) continue;
        const after = nowText.get(candidate);
        if (after === undefined) continue;
        const score = similarity(before, after);
        if (score > best) {
          best = score;
          moved = { to: candidate, score };
        }
      }
      if (best < RENAME_THRESHOLD) moved = null;
    }

    if (moved) {
      notes.push({
        kind: "moved",
        text: `${path} moved to ${moved.to} (${pct(moved.score)} of its lines kept); a move inside ${WATCHED}/ is not a deletion, and it is measured there`,
      });
      // Rule 5: and it is measured there, like any other surviving visual.
      incarnation.set(path, moved.to);
      continue;
    }

    const elsewhere = movedOut.get(path);
    if (onDisk.has(path) && !inIndex.has(path)) {
      failures.push({
        kind: "untracked",
        path,
        baseLines: lines,
        nowLines: lines ?? 0,
        detail: "on this disk, out of the repository: gone from every clone and every other worktree",
      });
    } else {
      failures.push({
        kind: "removed",
        path,
        baseLines: lines,
        nowLines: 0,
        detail: elsewhere ? `its content is now at ${elsewhere}, outside ${WATCHED}/` : null,
        outTo: elsewhere ?? null,
      });
    }
  }

  // Every visual that is still somewhere, measured against what it was.
  for (const path of [...new Set(basePaths)].sort()) {
    const at = incarnation.get(path);
    if (at === undefined) continue;
    if (approved.has(path)) continue;
    const before = baseText.get(path);
    const after = nowText.get(at);
    if (before === undefined || after === undefined) continue;

    const elsewhere = [...nowText.keys()]
      .filter((q) => q !== at)
      .map((q) => ({ path: q, before: baseText.get(q) ?? "", after: nowText.get(q) }));

    const verdict = compareVisual(path, before, after, at, elsewhere, trackedNow === null ? null : inIndex);
    if (!verdict) continue;
    if (verdict.failure) failures.push(verdict.failure);
    else notes.push(verdict.note);
  }

  failures.sort((a, b) => a.path.localeCompare(b.path));
  return { failures, notes };
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

/** The branch this repo merges into. Asked of git, never guessed silently. */
function defaultBranch(cwd) {
  for (const ref of ["origin/HEAD", "main", "master"]) {
    try {
      const name = git(["rev-parse", "--abbrev-ref", ref], cwd).trim();
      if (name) return name === "origin/HEAD" ? "main" : name;
    } catch {
      /* try the next one */
    }
  }
  return null;
}

/** Files under the watched tree at a commit. */
export function filesAt(rev, cwd = ROOT) {
  const out = git(["ls-tree", "-r", "--name-only", rev, "--", WATCHED], cwd);
  return out.split("\n").filter(Boolean);
}

/** Files under the watched tree on disk. See rule 2 for why that is not enough. */
export function filesNow(cwd = ROOT) {
  const found = [];
  const walk = (rel) => {
    let entries;
    try {
      entries = readdirSync(join(cwd, rel), { withFileTypes: true });
    } catch {
      return; // the whole tree is gone, which every base path will report
    }
    for (const e of entries) {
      const next = posix.join(rel, e.name);
      if (e.isDirectory()) walk(next);
      else if (e.isFile()) found.push(next);
    }
  };
  walk(WATCHED);
  return found.sort();
}

/** Files under the watched tree the index knows about. The other half of rule 2. */
export function filesTracked(cwd = ROOT) {
  const out = git(["ls-files", "--cached", "--", WATCHED], cwd);
  return out.split("\n").filter(Boolean);
}

/**
 * Paths under the watched tree whose working tree content differs from the
 * base, plus the ones that left. One git call, so the source of a 36 file tree
 * is only read for the handful a branch actually touched.
 */
function changedSince(base, cwd) {
  const out = git(["diff", "--name-only", base, "--", WATCHED], cwd);
  return out.split("\n").filter(Boolean);
}

/**
 * Where a visual moved to when it left the watched tree altogether. The verdict
 * is a failure either way (this tree is the one the rule guards), but round one
 * told the worker to `git checkout` a legitimate reorganisation back, and a
 * guard that prints the wrong remedy gets the wrong thing done. Message only.
 */
function arrivalsOutside(base, cwd) {
  let added;
  try {
    added = git(["diff", "--name-only", "--no-renames", "--diff-filter=A", base], cwd).split("\n").filter(Boolean);
  } catch {
    return [];
  }
  return added.filter((p) => !p.startsWith(`${WATCHED}/`) && isLiveSource(p));
}

function textAt(rev, path, cwd) {
  try {
    return git(["show", `${rev}:${path}`], cwd);
  } catch {
    return undefined;
  }
}

function textNow(path, cwd) {
  try {
    return readFileSync(join(cwd, path), "utf8");
  } catch {
    return undefined;
  }
}

const HEADLINE = {
  removed: (f) => `${f.path} is gone${f.baseLines === null ? "" : ` (${f.baseLines} lines)`}`,
  untracked: (f) => `${f.path} was removed from the repository (${f.baseLines} lines)`,
  emptied: (f) => `${f.path} was emptied in place`,
  gutted: (f) => `${f.path} lost the drawing it was (${f.baseLines} lines, ${f.nowLines} left)`,
  stilled: (f) => `${f.path} lost its animation (${f.baseLines} lines, ${f.nowLines} left)`,
};

function run(argv, out, err, overrides) {
  const cwd = overrides.cwd ?? ROOT;
  const retired = overrides.retired ?? RETIRED;
  const quiet = overrides.quietWhenClean === true;

  const configErrors = validateRetired(retired);
  if (configErrors.length) {
    for (const e of configErrors) err(`config error: ${e}`);
    return 2;
  }

  const flag = argv.indexOf("--base");
  if (flag !== -1 && !argv[flag + 1]) {
    err("usage: node scripts/visuals-check.mjs [--base <ref>]");
    return 2;
  }
  const fromEnv = flag === -1 && process.env.VISUALS_BASE;
  const asked = flag !== -1 ? argv[flag + 1] : process.env.VISUALS_BASE;

  // An overridden baseline is an off switch (VISUALS_BASE=HEAD passes anything),
  // so it is announced on stderr even when the run is clean and quiet.
  if (fromEnv) err(`visuals-check: baseline overridden by VISUALS_BASE=${asked}, not the merge base`);

  let base;
  if (asked) {
    base = asked;
  } else {
    const branch = defaultBranch(cwd);
    if (!branch) {
      // Fail closed. A guard that cannot find its baseline and shrugs is the
      // permissive branch that lets the thing it guards against through.
      err("cannot find the default branch (tried origin/HEAD, main, master); pass --base <ref>");
      return 2;
    }
    try {
      base = git(["merge-base", branch, "HEAD"], cwd).trim();
    } catch (e) {
      err(`cannot find the merge base with ${branch}: ${e.message.trim()}`);
      return 2;
    }
  }

  let basePaths;
  try {
    basePaths = filesAt(base, cwd);
  } catch (e) {
    err(`cannot read ${WATCHED} at ${base}: ${e.message.trim()}`);
    return 2;
  }
  const nowPaths = filesNow(cwd);
  let trackedNow;
  try {
    trackedNow = filesTracked(cwd);
  } catch (e) {
    err(`cannot list tracked files under ${WATCHED}: ${e.message.trim()}`);
    return 2;
  }

  // Read source only where it can matter: what git says changed, what left,
  // and what arrived (a move needs both ends to compare).
  const wasThere = new Set(basePaths);
  const live = new Set(trackedNow.filter((p) => nowPaths.includes(p)));
  const interesting = new Set([
    ...changedSince(base, cwd),
    ...basePaths.filter((p) => !live.has(p)),
    ...nowPaths.filter((p) => !wasThere.has(p)),
  ]);

  const onDisk = new Set(nowPaths);
  const baseText = new Map();
  const nowText = new Map();
  for (const path of interesting) {
    if (wasThere.has(path)) {
      const t = textAt(base, path, cwd);
      if (t !== undefined) baseText.set(path, t);
    }
    if (onDisk.has(path)) {
      const t = textNow(path, cwd);
      if (t !== undefined) nowText.set(path, t);
    }
  }

  // Message only: a visual whose content turns up outside the watched tree.
  const movedOut = new Map();
  const gone = basePaths.filter((p) => !live.has(p));
  if (gone.length) {
    for (const candidate of arrivalsOutside(base, cwd)) {
      const after = textNow(candidate, cwd);
      if (after === undefined) continue;
      for (const path of gone) {
        const before = baseText.get(path);
        if (before === undefined || movedOut.has(path)) continue;
        if (similarity(before, after) >= RENAME_THRESHOLD) movedOut.set(path, candidate);
      }
    }
  }

  const { failures, notes } = classify({
    basePaths, nowPaths, trackedNow, baseText, nowText, retired, movedOut,
  });

  if (failures.length === 0 && quiet) return 0;

  out(`${WATCHED}  ${basePaths.length} file(s) at ${base.slice(0, 12)}, ${live.size} now`);
  for (const n of notes) out(`  note  ${n.text}`);

  if (failures.length === 0) {
    out(`\nno visual was removed`);
    return 0;
  }

  for (const f of failures) {
    out(`  FAIL  ${HEADLINE[f.kind](f)}`);
    for (const d of [].concat(f.detail ?? [])) out(`        ${d}`);
    if (f.at) out(`        measured at ${f.at}, where it moved to`);
  }

  const restore = failures.filter((f) => !f.outTo).map((f) => f.path);
  const reorganised = failures.filter((f) => f.outTo);
  const lost = failures.reduce((n, f) => n + Math.max(0, (f.baseLines ?? 0) - f.nowLines), 0);

  out(
    `\n${failures.length} visual(s) deleted, ${lost} line(s) of it. docs/copy-doctrine.md section 8:` +
      `\na copy bead REWIRES a visual to its new dictionary keys and never deletes it, and` +
      `\nretiring an animation is Daniel's decision alone. Moving one inside ${WATCHED}/ is fine.` +
      `\n\nPut it back with:\n` +
      (restore.length ? `\n  git checkout ${base.slice(0, 12)} -- ${restore.join(" ")}\n` : "") +
      reorganised
        .map((f) => `\n  git mv ${f.outTo} ${f.path}    (it is not deleted, it left ${WATCHED}/)\n`)
        .join("") +
      `\nIf Daniel has approved retiring one, add it to RETIRED in scripts/visuals-check.mjs with` +
      `\nthe date and the reason, so his decision is in the diff. Nothing else retires a visual.`,
  );
  return 1;
}

/**
 * The same check, for a script that wants to run it before its own work.
 * `quietWhenClean` prints nothing at all when there is nothing to report, so
 * embedding it does not double up output.
 */
export function guard(overrides = {}) {
  return main([], overrides.out ?? console.log, overrides.err ?? console.error, {
    quietWhenClean: true,
    ...overrides,
  });
}

/** Exit 0 clean, 1 when a visual is gone, 2 on a usage or environment error. */
export function main(argv, out = console.log, err = console.error, overrides = {}) {
  try {
    return run(argv, out, err, overrides);
  } catch (e) {
    err(`config error: ${e && e.message ? e.message : e}`);
    return 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
