#!/usr/bin/env node
/**
 * visuals-check: the runnable half of docs/copy-doctrine.md section 8.
 *
 * A copy bead never deletes a visual. This fails when a file that was under
 * `components/pages/` at the merge base with the default branch is not under
 * it any more.
 *
 *   node scripts/visuals-check.mjs
 *   node scripts/visuals-check.mjs --base <ref>
 *
 * Exit 0 clean, 1 when a visual is gone, 2 on a usage or environment error.
 *
 * Why a set difference on paths rather than `git diff --diff-filter=D`, both
 * measured against the commit this correction undoes (11d43c3, four visuals
 * gone) and against a `git mv` of one of them out of the tree:
 *
 *   git diff -M --diff-filter=D --name-only <base>          the rename reads
 *     as R100, so the filter reports 0 files under components/pages
 *   git diff --cached --diff-filter=D --name-only <base> -- components/pages
 *     reports the rename, because its destination is outside the pathspec,
 *     but reports 0 for a plain unstaged `rm` of a tracked visual
 *   this script                                             reports 1 for
 *     each of those three, because it compares two sets of paths
 *
 * Comparing sets sees the file leave whatever the operation was called and
 * whether or not it was staged, which is the only thing this rule cares
 * about. That is also why the current side is read off the filesystem rather
 * than out of the index: an unstaged `rm` is a deleted visual.
 *
 * No dependencies. Node built-ins only.
 */

import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, posix } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/** The tree this rule guards, as a git pathspec and a directory name. */
export const WATCHED = "components/pages";

/**
 * Every visual Daniel has approved retiring, with the date and the reason.
 * Adding an entry here is how a visual is retired, and the entry is what a
 * reviewer reads. Nothing else in this repo may remove a file under
 * `components/pages/`.
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
 * The whole rule, with no git and no filesystem in it so a test can drive it.
 * `base` and `now` are arrays of repo-relative paths.
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

function run(argv, out, err, overrides) {
  const cwd = overrides.cwd ?? ROOT;
  const retired = overrides.retired ?? RETIRED;

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

  let baseFiles;
  try {
    baseFiles = filesAt(base, cwd);
  } catch (e) {
    err(`cannot read ${WATCHED} at ${base}: ${e.message.trim()}`);
    return 2;
  }

  const { removals, notes } = findRemovals(baseFiles, filesNow(cwd), retired);

  out(`${WATCHED}  ${baseFiles.length} file(s) at ${base.slice(0, 12)}, ${filesNow(cwd).length} now`);
  for (const n of notes) out(`  note  ${n.text}`);

  if (removals.length === 0) {
    out(`\nno visual was removed`);
    return 0;
  }

  for (const path of removals) out(`  FAIL  ${path} is gone, and no RETIRED entry covers it`);
  out(
    `\n${removals.length} visual(s) removed. docs/copy-doctrine.md section 8: a copy bead rewires a` +
      `\nvisual to its new dictionary keys and never deletes it, and retiring an animation is` +
      `\nDaniel's decision alone. Recover with:` +
      `\n\n  git checkout ${base.slice(0, 12)} -- ${removals.join(" ")}\n` +
      `\nIf Daniel has approved retiring one, add it to RETIRED in this file with the date and` +
      `\nthe reason, so the decision is in the diff.`,
  );
  return 1;
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
