/**
 * detect: finds tracked brands in one engine answer, without a model.
 *
 * A mention is a definite alias (or the brand's domain) matched on word
 * boundaries, case and accent insensitive, so "Cardón Digital", "cardon
 * digital" and "cardondigital.com" are one brand. That count can be recomputed
 * from the stored answer and comes out the same every time, which is why the
 * headline numbers rest on it (the idea is limelit-co/open's, Apache-2.0; the
 * code here is our own).
 *
 * Some aliases are too loose to trust: a bare "Cardón" also names Cardón Media
 * and a cactus. Those go in `ambiguous`; a hit on one is reported as unclear
 * and the judge (judge.mjs) decides. An alias may carry `notFollowedBy` words
 * (namedrop's idea, MIT), so "Cardón" followed by "Media" is never a hit.
 *
 * Position is the 1-based rank of the top-level list item (numbered, bulleted,
 * a numbered heading, or a table row) that encloses the first mention; null
 * when the brand is named outside any list. "Third in a ranked list" and
 * "named in passing" are different facts, so passing mentions do not get a
 * made-up rank.
 */

/** Lowercase and strip combining marks, one output string per input char. */
function foldChar(ch) {
  return ch.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/**
 * Folds text and keeps a map from each folded index back to the original
 * index, so a match found in folded text has an offset in the answer.
 */
export function fold(text) {
  let out = "";
  const map = [];
  let i = 0;
  for (const ch of text) {
    const f = foldChar(ch);
    for (let k = 0; k < f.length; k++) map.push(i);
    out += f;
    i += ch.length;
  }
  map.push(i);
  return { text: out, map };
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Letters and digits in any script count as word characters. */
const WORD = "[\\p{L}\\p{N}]";

function aliasRegex(alias) {
  const folded = fold(alias.trim()).text;
  // Spaces in an alias match any run of spaces or hyphens: "cardon digital"
  // also finds "Cardon-Digital".
  const body = folded.split(/\s+/).map(escape).join("[\\s\\-]+");
  return new RegExp(`(?<!${WORD})${body}(?!${WORD})`, "gu");
}

/** The word right after `index` in folded text, '' at the end. */
function nextWord(folded, index) {
  const m = /^[^\p{L}\p{N}]*([\p{L}\p{N}]+)/u.exec(folded.slice(index));
  return m ? m[1] : "";
}

/** Normalises an alias entry: a string or { text, notFollowedBy }. */
function aliasEntry(a) {
  if (typeof a === "string") return { text: a, notFollowedBy: [] };
  return { text: a.text, notFollowedBy: (a.notFollowedBy || []).map((w) => fold(w).text) };
}

/** Every original offset where any of `aliases` matches. */
function findOffsets(folded, aliases) {
  const offsets = [];
  for (const raw of aliases) {
    const a = aliasEntry(raw);
    if (!a.text || !a.text.trim()) continue;
    const re = aliasRegex(a.text);
    let m;
    while ((m = re.exec(folded.text)) !== null) {
      if (a.notFollowedBy.length && a.notFollowedBy.includes(nextWord(folded.text, m.index + m[0].length))) continue;
      offsets.push(folded.map[m.index]);
    }
  }
  // Two aliases that fold to the same string hit the same offset once.
  return [...new Set(offsets)].sort((x, y) => x - y);
}

const ITEM =
  /^(#{1,6}\s*)?(?:\*\*|__)?\s*(?:(\d{1,2})[.)]|[-*+\u2022])\s+\S/u;
const HEADING = /^#{1,6}\s/;
const TABLE_SEP = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

/**
 * Splits an answer into top-level list items: [{ start, end, rank }], offsets
 * in the original text.
 *
 * A numbered item ranks by its own number, so a paragraph between "2." and
 * "3." does not reset anything. Bullets rank by count, and a non-indented
 * paragraph or heading restarts the count. Blank and indented lines belong to
 * the item above them; under a numbered heading ("### 2. Name") plain
 * paragraphs do too, until the next heading. Table data rows rank in order;
 * the header row and the separator do not count.
 */
export function listItems(text) {
  const lines = [];
  let pos = 0;
  for (const line of text.split("\n")) {
    lines.push({ line, start: pos, end: pos + line.length });
    pos += line.length + 1;
  }
  const items = [];
  let count = 0;
  let open = null;
  const close = (end) => {
    if (open) {
      items.push({ start: open.start, end, rank: open.rank });
      open = null;
    }
  };
  for (let i = 0; i < lines.length; i++) {
    const { line, start } = lines[i];
    const indent = line.length - line.trimStart().length;
    const body = line.trimStart();
    if (body.startsWith("|")) {
      if (TABLE_SEP.test(body)) continue;
      const isHeader = i + 1 < lines.length && TABLE_SEP.test(lines[i + 1].line.trimStart());
      close(start);
      if (isHeader) {
        count = 0;
        continue;
      }
      count += 1;
      items.push({ start, end: lines[i].end, rank: count });
      continue;
    }
    if (body === "") continue;
    const m = indent < 2 ? ITEM.exec(body) : null;
    if (m) {
      close(start);
      count = m[2] ? Number(m[2]) : count + 1;
      open = { start, rank: count, heading: Boolean(m[1]) };
      continue;
    }
    if (indent >= 2) continue;
    if (open?.heading && !HEADING.test(body)) continue;
    // A non-indented paragraph or a plain heading ends the item; it restarts
    // the bullet count (a numbered item brings its own number).
    close(start);
    count = 0;
  }
  close(text.length);
  return items;
}

function rankAt(items, offset) {
  const it = items.find((x) => offset >= x.start && offset < x.end);
  return it ? it.rank : null;
}

/**
 * Detects every tracked brand in `text`.
 *
 * brands: [{ id, name, aliases, ambiguous?, domains? }]. Returns
 *   { mentions: [{ id, count, first, position }], unclear: [{ id, count, first }] }
 * A brand with a definite hit is never also unclear.
 */
export function detect(text, brands) {
  const folded = fold(text || "");
  const items = listItems(text || "");
  const mentions = [];
  const unclear = [];
  for (const b of brands) {
    const definite = [b.name, ...(b.aliases || []), ...(b.domains || [])];
    const hits = findOffsets(folded, definite);
    if (hits.length) {
      mentions.push({ id: b.id, count: hits.length, first: hits[0], position: rankAt(items, hits[0]) });
      continue;
    }
    const loose = findOffsets(folded, b.ambiguous || []);
    if (loose.length) unclear.push({ id: b.id, count: loose.length, first: loose[0], position: rankAt(items, loose[0]) });
  }
  return { mentions, unclear };
}

/** Lowercased host without "www.", or null for an unparsable url. */
export function domainOf(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** True when `host` is `domain` or a subdomain of it. */
export function hostMatches(host, domain) {
  const d = domain.toLowerCase().replace(/^www\./, "");
  return host === d || host.endsWith("." + d);
}
