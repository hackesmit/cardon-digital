/**
 * metrics: turns analysed answers into the panel's numbers.
 *
 * An analysed answer (see analyse() in run.mjs) is
 *   { engine, promptId, intent, run, mentions: { [brandId]: { position, sentiment } },
 *     domains: [host, ...] }
 * where `mentions` holds only brands confirmed present (definite alias, or an
 * unclear hit the judge accepted) and `domains` the distinct cited hosts.
 *
 * The definitions follow the 2026-10-27 market research:
 *   visibility     answers mentioning the brand / answers, Wilson 95% CI
 *   share of voice our mentioning answers / all tracked brands' mentioning answers
 *   avg position   mean list rank, over mentions that sit in a list
 *   citation share answers citing an own domain / answers
 * Mention rate is the stable metric; position is reported but repeats poorly.
 */

import { hostMatches } from "./detect.mjs";

/** Wilson score interval for k successes in n trials, as fractions. */
export function wilson(k, n, z = 1.96) {
  if (n === 0) return { p: 0, lo: 0, hi: 0 };
  const p = k / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const centre = (p + z2 / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return { p, lo: Math.max(0, centre - half), hi: Math.min(1, centre + half) };
}

/** Default host lists for citation classes; a client config can extend them. */
export const DEFAULT_CLASSES = {
  directory: [
    "google.com", "maps.google.com", "yelp.com", "tripadvisor.com", "tripadvisor.com.mx", "clutch.co",
    "sortlist.com", "sortlist.mx", "goodfirms.co", "designrush.com", "seccionamarilla.com.mx", "allbiz.mx",
    "cylex.mx", "cylex-mexico.mx", "paginasamarillas.com.mx", "foursquare.com", "infoisinfo.com.mx",
    "top-rated.online", "empresite.mx", "doplim.com.mx", "hotfrog.com.mx", "waze.com", "bing.com",
  ],
  ugc: [
    "facebook.com", "instagram.com", "reddit.com", "youtube.com", "tiktok.com", "linkedin.com", "x.com",
    "twitter.com", "quora.com", "pinterest.com", "sites.google.com", "medium.com", "wikipedia.org",
  ],
};

/** Classifies one cited host: own, competitor, directory, ugc or other. */
export function classify(host, config) {
  if ((config.brand.domains || []).some((d) => hostMatches(host, d))) return "own";
  if ((config.competitors || []).some((c) => (c.domains || []).some((d) => hostMatches(host, d)))) return "competitor";
  const classes = config.domainClasses || {};
  for (const cls of ["directory", "ugc"]) {
    const list = [...DEFAULT_CLASSES[cls], ...(classes[cls] || [])];
    if (list.some((d) => hostMatches(host, d))) return cls;
  }
  return "other";
}

const pct = (x) => Math.round(x * 1000) / 10;

/** The numbers for one slice of answers (one engine, or all of them). */
export function sliceMetrics(answers, config) {
  const own = config.brand.id;
  const brandIds = [own, ...(config.competitors || []).map((c) => c.id)];
  const n = answers.length;
  const count = (id) => answers.filter((a) => a.mentions[id]).length;
  const k = count(own);
  const totalMentions = brandIds.reduce((s, id) => s + count(id), 0);
  const positions = answers.map((a) => a.mentions[own]?.position).filter((p) => Number.isInteger(p));
  const sentiment = { positive: 0, neutral: 0, negative: 0, unknown: 0 };
  for (const a of answers) {
    const m = a.mentions[own];
    if (m) sentiment[m.sentiment in sentiment ? m.sentiment : "unknown"] += 1;
  }
  const cited = answers.filter((a) => a.domains.some((h) => classify(h, config) === "own")).length;
  const nonBranded = answers.filter((a) => a.intent !== "branded");
  const kNon = nonBranded.filter((a) => a.mentions[own]).length;
  const ci = wilson(k, n);
  const ciNon = wilson(kNon, nonBranded.length);
  return {
    answers: n,
    mentioned: k,
    visibility: { pct: pct(ci.p), lo: pct(ci.lo), hi: pct(ci.hi) },
    nonBranded: { answers: nonBranded.length, mentioned: kNon, pct: pct(ciNon.p), lo: pct(ciNon.lo), hi: pct(ciNon.hi) },
    shareOfVoice: totalMentions ? pct(k / totalMentions) : 0,
    avgPosition: positions.length ? Math.round((positions.reduce((s, p) => s + p, 0) / positions.length) * 10) / 10 : null,
    positioned: positions.length,
    citationShare: { cited, pct: n ? pct(cited / n) : 0 },
    sentiment,
    brands: Object.fromEntries(brandIds.map((id) => {
      const c = wilson(count(id), n);
      return [id, { mentioned: count(id), pct: pct(c.p), lo: pct(c.lo), hi: pct(c.hi) }];
    })),
  };
}

/**
 * Cited-domain table: per host, its class, the answers citing it, and how many
 * of those also mention us or a competitor. Sorted by answers citing it.
 */
export function domainTable(answers, config) {
  const own = config.brand.id;
  const compIds = (config.competitors || []).map((c) => c.id);
  const rows = new Map();
  for (const a of answers) {
    const withUs = Boolean(a.mentions[own]);
    const withComp = compIds.some((id) => a.mentions[id]);
    for (const host of new Set(a.domains)) {
      const r = rows.get(host) || { host, cls: classify(host, config), answers: 0, withUs: 0, withCompetitor: 0 };
      r.answers += 1;
      if (withUs) r.withUs += 1;
      if (withComp) r.withCompetitor += 1;
      rows.set(host, r);
    }
  }
  return [...rows.values()].sort((x, y) => y.answers - x.answers || x.host.localeCompare(y.host));
}

/**
 * Gap list: hosts that are neither ours nor a competitor's, cited in answers
 * that name a competitor, and never cited in an answer that names us. These
 * are the third-party pages that put competitors in front of the engines.
 */
export function gapList(answers, config) {
  return domainTable(answers, config)
    .filter((r) => r.cls !== "own" && r.cls !== "competitor" && r.withCompetitor > 0 && r.withUs === 0)
    .sort((x, y) => y.withCompetitor - x.withCompetitor || x.host.localeCompare(y.host));
}

/** Per-prompt mention counts for us, by engine: { [promptId]: { [engine]: { k, n } } }. */
export function promptTable(answers, config) {
  const own = config.brand.id;
  const out = {};
  for (const a of answers) {
    const row = (out[a.promptId] ||= {});
    const cell = (row[a.engine] ||= { k: 0, n: 0, competitors: {} });
    cell.n += 1;
    if (a.mentions[own]) cell.k += 1;
    for (const c of config.competitors || []) if (a.mentions[c.id]) cell.competitors[c.id] = (cell.competitors[c.id] || 0) + 1;
  }
  return out;
}

/** Everything the report and the summary JSON need. */
export function summarise(answers, config) {
  const engines = [...new Set(answers.map((a) => a.engine))].sort();
  return {
    overall: sliceMetrics(answers, config),
    engines: Object.fromEntries(engines.map((e) => [e, sliceMetrics(answers.filter((a) => a.engine === e), config)])),
    prompts: promptTable(answers, config),
    domains: domainTable(answers, config),
    gaps: gapList(answers, config),
  };
}
