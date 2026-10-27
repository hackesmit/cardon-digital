/**
 * report: the Markdown report for one run, from its summary object.
 *
 * Every number in it comes from summary.json, written alongside, so a later
 * run can diff against this one without parsing prose.
 */

const fmtPct = (m) => `${m.pct}% (${m.lo} to ${m.hi})`;
const usd = (x) => `$${x.toFixed(2)}`;

function nameOf(config, id) {
  if (id === config.brand.id) return config.brand.name;
  return (config.competitors || []).find((c) => c.id === id)?.name || id;
}

function headline(summary) {
  const rows = [["Slice", "Answers", "Visibility (95% CI)", "Non-branded visibility", "Share of voice", "Avg position (n)", "Citation share", "Sentiment +/=/-"]];
  const slices = [...Object.entries(summary.metrics.engines), ["all engines", summary.metrics.overall]];
  for (const [name, m] of slices) {
    rows.push([
      name,
      String(m.answers),
      `${m.mentioned}/${m.answers}, ${fmtPct(m.visibility)}`,
      `${m.nonBranded.mentioned}/${m.nonBranded.answers}, ${fmtPct(m.nonBranded)}`,
      `${m.shareOfVoice}%`,
      m.avgPosition == null ? "n/a" : `${m.avgPosition} (${m.positioned})`,
      `${m.citationShare.cited}/${m.answers}, ${m.citationShare.pct}%`,
      `${m.sentiment.positive}/${m.sentiment.neutral}/${m.sentiment.negative}`,
    ]);
  }
  return table(rows);
}

function table(rows) {
  const esc = (c) => String(c).replace(/\|/g, "\\|").replace(/\n/g, " ");
  return [rows[0], rows[0].map(() => "---"), ...rows.slice(1)].map((r) => `| ${r.map(esc).join(" | ")} |`).join("\n");
}

function comparison(summary, previous) {
  if (!previous) return "No earlier run of this client in the tracker; this run is the first point of the series.";
  const rows = [["Slice", "Previous", "This run", "Change (points)"]];
  const slices = [...Object.keys(summary.metrics.engines), "all engines"];
  for (const s of slices) {
    const now = s === "all engines" ? summary.metrics.overall : summary.metrics.engines[s];
    const was = s === "all engines" ? previous.metrics.overall : previous.metrics.engines?.[s];
    if (!was) continue;
    rows.push([s, `${was.visibility.pct}%`, `${now.visibility.pct}%`, (Math.round((now.visibility.pct - was.visibility.pct) * 10) / 10).toString()]);
  }
  return `Against the run of ${previous.startedAt} (${previous.runDir}). A change inside both confidence intervals is noise.\n\n${table(rows)}`;
}

function competitors(summary, config) {
  const engines = Object.keys(summary.metrics.engines);
  const ids = [config.brand.id, ...(config.competitors || []).map((c) => c.id)];
  const rows = [["Business", ...engines, "All engines (95% CI)"]];
  const sorted = ids.sort((a, b) => summary.metrics.overall.brands[b].mentioned - summary.metrics.overall.brands[a].mentioned);
  for (const id of sorted) {
    const o = summary.metrics.overall.brands[id];
    rows.push([
      id === config.brand.id ? `**${nameOf(config, id)}**` : nameOf(config, id),
      ...engines.map((e) => `${summary.metrics.engines[e].brands[id].mentioned}/${summary.metrics.engines[e].answers}`),
      `${o.mentioned}/${summary.metrics.overall.answers}, ${fmtPct(o)}`,
    ]);
  }
  return table(rows);
}

function prompts(summary, config) {
  const engines = Object.keys(summary.metrics.engines);
  const rows = [["Prompt", "Intent", "Text", ...engines.map((e) => `${e} (us)`), "Competitors named (answers)"]];
  for (const p of config.prompts.filter((q) => summary.promptIds.includes(q.id))) {
    const row = summary.metrics.prompts[p.id] || {};
    const comp = {};
    for (const e of engines) for (const [id, n] of Object.entries(row[e]?.competitors || {})) comp[id] = (comp[id] || 0) + n;
    const top = Object.entries(comp).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([id, n]) => `${nameOf(config, id)} ${n}`).join(", ");
    rows.push([p.id, p.intent, p.text, ...engines.map((e) => (row[e] ? `${row[e].k}/${row[e].n}` : "n/a")), top || "none"]);
  }
  return table(rows);
}

function domains(summary, limit) {
  const rows = [["Domain", "Class", "Answers citing", "With us", "With a competitor"]];
  for (const d of summary.metrics.domains.slice(0, limit)) rows.push([d.host, d.cls, d.answers, d.withUs, d.withCompetitor]);
  return table(rows);
}

function gaps(summary, limit) {
  if (!summary.metrics.gaps.length) return "No gaps: every third-party domain cited next to a competitor was also cited next to us.";
  const rows = [["Domain", "Class", "Answers naming a competitor that cite it"]];
  for (const d of summary.metrics.gaps.slice(0, limit)) rows.push([d.host, d.cls, d.withCompetitor]);
  return table(rows);
}

function cost(summary) {
  const rows = [["Part", "Model", "Calls", "Input tokens", "Output tokens", "Search calls", "Cost", "List price"]];
  for (const [part, c] of Object.entries(summary.cost.parts)) {
    rows.push([part, c.model, c.calls, c.input, c.output, c.searches, usd(c.usd), usd(c.listUsd)]);
  }
  rows.push(["total", "", summary.cost.calls, summary.cost.input, summary.cost.output, summary.cost.searches, usd(summary.cost.usd), usd(summary.cost.listUsd)]);
  return table(rows);
}

export function renderReport(summary, config, previous) {
  const engines = Object.entries(summary.engines).map(([e, o]) => `${e} (${o.model})`).join(", ");
  const lines = [
    `# AI visibility, ${config.brand.name}: ${summary.startedAt.slice(0, 10)}`,
    "",
    `**API panel, directional.** These answers come from the engines' developer APIs with web search on, not from the consumer apps. Consumer answers differ (published overlap of brands between API and UI answers is 6 to 24%), so read the numbers as a trend line, not as what a given person sees.`,
    "",
    `- Run: ${summary.runDir}, ${summary.startedAt} to ${summary.finishedAt}`,
    `- Engines: ${engines}. Judge: ${summary.judge.model}.`,
    `- Prompts: ${summary.promptIds.length} x ${summary.runs} runs per engine = ${summary.metrics.overall.answers} answers analysed.${summary.partial ? ` **Partial run:** ${summary.partialReason}.` : ""}`,
    `- Errors: ${summary.errors.length ? summary.errors.length + " calls failed (listed at the end)" : "none"}.`,
    `- Cost: ${usd(summary.cost.usd)} billed estimate, ${usd(summary.cost.listUsd)} at list price (table below).`,
    "",
    "## Headline",
    "",
    headline(summary),
    "",
    "Visibility counts answers whose text names the brand or its domain (definite aliases; unclear hits only when the judge confirms them). Non-branded leaves out prompts tagged `branded`. Share of voice divides our mentioning answers by all tracked brands' mentioning answers. Position is the rank of the list item that names us, over mentions that sit in a list. Citation share counts answers that cite one of our domains.",
    "",
    "## Change since the last run",
    "",
    comparison(summary, previous),
    "",
    ...(config.baseline ? ["## Manual baseline", "", config.baseline, ""] : []),
    "## Tracked businesses",
    "",
    competitors(summary, config),
    "",
    "## By prompt",
    "",
    prompts(summary, config),
    "",
    "## Cited domains (top 25)",
    "",
    domains(summary, 25),
    "",
    "## Gap list",
    "",
    "Third-party domains the engines cite in answers that name a competitor, and never in an answer that names us. Getting listed or covered there is the off-site work most likely to move the numbers.",
    "",
    gaps(summary, 20),
    "",
    "## Cost",
    "",
    cost(summary),
    "",
    "## Method notes",
    "",
    "- Each prompt runs several times per engine because brand lists rarely repeat between runs; mention rate pooled over runs is the stable number, position is not.",
    "- OpenAI gets the prompt's country, region and city as an approximate user location. The Gemini API has no location setting, so only the city named in the prompt localises it.",
    "- Google AI Overviews and AI Mode have no API; they stay a manual check (tools/visibility/README.md in the cardon-digital repo).",
    "",
  ];
  if (summary.errors.length) {
    lines.push("## Failed calls", "", ...summary.errors.map((e) => `- ${e.engine} ${e.promptId} run ${e.run}: ${e.message}`), "");
  }
  return lines.join("\n");
}
