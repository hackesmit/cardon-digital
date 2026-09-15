#!/usr/bin/env node
/**
 * visuals-check: the runnable half of docs/copy-doctrine.md section 8.
 *
 * A copy bead never deletes a visual. This fails when a visual that was under
 * `components/pages/` at the merge base with the default branch is gone from
 * the working tree, emptied in place, or stripped of the markup that made it a
 * visual.
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
 * WHAT COUNTS AS GONE, and why each rule is here rather than a simpler one.
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
 *    Comparing sets sees the file leave whatever the operation was called and
 *    whether or not it was staged. That is also why the current side is read
 *    off the filesystem rather than out of the index: an unstaged `rm` is a
 *    deleted visual.
 *
 * 2. ...but a move INSIDE the tree is not a deletion, and a bare set difference
 *    calls it one. `git mv components/pages/home/SectorMap.tsx
 *    components/pages/home/SectorDiagram.tsx` failed this check before the
 *    rescue below existed. So a path that left is matched against the paths
 *    that arrived, by shared source lines, and a match at or above
 *    RENAME_THRESHOLD is reported as a move and passes. The threshold is git's
 *    own default for rename detection.
 *
 * 3. Emptying a file in place is deleting it with the name left behind, and a
 *    set difference cannot see it: `: > SectorMap.tsx` and a one line
 *    `// visual retired` stub both passed this check before, exit 0. A file
 *    whose substance (source with whitespace and comments removed) was
 *    non-empty at the base and is empty now fails.
 *
 * 4. Neither can a set difference see a component gutted down to a shell that
 *    still parses. A file that carried JSX or SVG markup at the base and
 *    carries none now fails as well. Anything short of zero markup is reported
 *    as a shrink note and never blocks, because a visual can legitimately get
 *    smaller and a guard that argues with every rewrite gets deleted.
 *
 * Every failure names the file and its line count at the base, because the line
 * count is what got noticed (6157 lines of animation across hq-4pu0q.3 and
 * hq-4pu0q.4) and a path alone does not carry that.
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

/**
 * Every visual Daniel has approved retiring, with the date and the reason.
 * Adding an entry here is how a visual is retired, and the entry is what a
 * reviewer reads. Nothing else in this repo may remove, empty or gut a file
 * under `components/pages/`.
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
 * drive it. `base` and `now` are arrays of repo-relative paths.
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
 * Source with comments and whitespace removed. An emptied file is one whose
 * substance is gone, so a `// visual retired` stub is as empty as a zero byte
 * file. Stripping `//` inside a string literal (a url) only ever shortens this
 * further, and the rule only asks whether the result is empty.
 */
export function substance(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|\n)[ \t]*\/\/[^\n]*/g, "$1")
    .replace(/\s+/g, "");
}

/**
 * Opening JSX or SVG tags. No space after `<`, so a `a <b` comparison does not
 * read as markup. The rule that uses it only fires when a file had markup and
 * has none at all now, so a stray overcount cannot cause a failure.
 */
export function markupCount(text) {
  const found = text.match(/<[A-Za-z][A-Za-z0-9._:-]*[\s/>]/g);
  return found ? found.length : 0;
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

/**
 * The whole rule, with no git and no filesystem in it.
 *
 *   basePaths, nowPaths   arrays of repo-relative paths
 *   baseText, nowText     Maps path -> source. Partial on purpose: a file the
 *                         caller knows is byte identical to the base need not
 *                         be read, and an unread file cannot have been emptied.
 *
 * Returns failures, each with a kind ("removed", "emptied" or "gutted"), and
 * notes, which never block.
 */
export function classify({ basePaths, nowPaths, baseText = new Map(), nowText = new Map(), retired = RETIRED }) {
  const { removals, notes } = findRemovals(basePaths, nowPaths, retired);
  const approved = new Set(retired.map((e) => e.path));
  const failures = [];

  // A path that arrived on this branch is a candidate destination for a move.
  const wasThere = new Set(basePaths);
  const arrivals = nowPaths.filter((p) => !wasThere.has(p));

  for (const path of removals) {
    const before = baseText.get(path);
    const lines = before === undefined ? null : lineCount(before);

    let moved = null;
    if (before !== undefined) {
      let best = 0;
      for (const candidate of arrivals) {
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
        text: `${path} moved to ${moved.to} (${Math.round(moved.score * 100)}% of its lines kept); a move inside ${WATCHED}/ is not a deletion`,
      });
      continue;
    }

    failures.push({ kind: "removed", path, baseLines: lines, nowLines: 0 });
  }

  // Files that are still here. Only the ones the caller read can have changed.
  const present = new Set(nowPaths);
  for (const path of [...new Set(basePaths)].sort()) {
    if (!present.has(path)) continue;
    const before = baseText.get(path);
    const after = nowText.get(path);
    if (before === undefined || after === undefined) continue;

    const baseLines = lineCount(before);
    const nowLines = lineCount(after);

    if (approved.has(path)) continue;

    if (substance(before) !== "" && substance(after) === "") {
      failures.push({ kind: "emptied", path, baseLines, nowLines });
      continue;
    }
    if (markupCount(before) > 0 && markupCount(after) === 0) {
      failures.push({ kind: "gutted", path, baseLines, nowLines });
      continue;
    }
    if (baseLines > 0 && nowLines / baseLines < SHRINK_NOTE) {
      notes.push({
        kind: "shrink",
        text: `${path} went from ${baseLines} to ${nowLines} lines; not a failure, but say in the bead what left`,
      });
    }
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

/** Files under the watched tree on disk, which is what "still here" means. */
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

/**
 * Paths under the watched tree whose working tree content differs from the
 * base, plus the ones that left. One git call, so the source of a 36 file tree
 * is only read for the handful a branch actually touched.
 */
function changedSince(base, cwd) {
  const out = git(["diff", "--name-only", base, "--", WATCHED], cwd);
  return out.split("\n").filter(Boolean);
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
  emptied: (f) => `${f.path} was emptied in place (${f.baseLines} lines of source, ${f.nowLines} left)`,
  gutted: (f) => `${f.path} lost all of its markup (${f.baseLines} lines, ${f.nowLines} left, 0 elements)`,
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
  const asked = flag !== -1 ? argv[flag + 1] : process.env.VISUALS_BASE;

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

  // Read source only where it can matter: what git says changed, what left,
  // and what arrived (a move needs both ends to compare).
  const wasThere = new Set(basePaths);
  const present = new Set(nowPaths);
  const interesting = new Set([
    ...changedSince(base, cwd),
    ...basePaths.filter((p) => !present.has(p)),
    ...nowPaths.filter((p) => !wasThere.has(p)),
  ]);

  const baseText = new Map();
  const nowText = new Map();
  for (const path of interesting) {
    if (wasThere.has(path)) {
      const t = textAt(base, path, cwd);
      if (t !== undefined) baseText.set(path, t);
    }
    if (present.has(path)) {
      const t = textNow(path, cwd);
      if (t !== undefined) nowText.set(path, t);
    }
  }

  const { failures, notes } = classify({ basePaths, nowPaths, baseText, nowText, retired });

  if (failures.length === 0 && quiet) return 0;

  out(`${WATCHED}  ${basePaths.length} file(s) at ${base.slice(0, 12)}, ${nowPaths.length} now`);
  for (const n of notes) out(`  note  ${n.text}`);

  if (failures.length === 0) {
    out(`\nno visual was removed`);
    return 0;
  }

  for (const f of failures) out(`  FAIL  ${HEADLINE[f.kind](f)}`);

  const removed = failures.filter((f) => f.kind === "removed").map((f) => f.path);
  const kept = failures.filter((f) => f.kind !== "removed").map((f) => f.path);
  const lost = failures.reduce((n, f) => n + Math.max(0, (f.baseLines ?? 0) - f.nowLines), 0);

  out(
    `\n${failures.length} visual(s) deleted, ${lost} line(s) of it. docs/copy-doctrine.md section 8:` +
      `\na copy bead REWIRES a visual to its new dictionary keys and never deletes it, and` +
      `\nretiring an animation is Daniel's decision alone. Moving one inside ${WATCHED}/ is fine.` +
      `\n\nPut it back with:\n` +
      (removed.length ? `\n  git checkout ${base.slice(0, 12)} -- ${removed.join(" ")}\n` : "") +
      (kept.length ? `\n  git checkout ${base.slice(0, 12)} -- ${kept.join(" ")}\n` : "") +
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
