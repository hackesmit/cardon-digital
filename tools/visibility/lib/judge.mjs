/**
 * judge: one cheap structured-output call per answer, only for answers where
 * detect() found a tracked brand or an unclear hit. It does two things the
 * string match cannot:
 *
 *   refers     for an unclear hit (a bare "Cardón"), does the answer mean the
 *              tracked business or something else with that word?
 *   sentiment  how the answer frames each brand it names: positive, neutral
 *              or negative.
 *
 * The judge never adds a brand detect() did not find, and never removes a
 * definite hit, so the mention count stays reproducible from the stored text;
 * only unclear hits depend on it. Its verdict is stored with the answer, so a
 * re-analysis does not pay for it twice.
 */

import { postJson } from "./engines.mjs";

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["brands"],
  properties: {
    brands: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "refers", "sentiment"],
        properties: {
          id: { type: "string" },
          refers: { type: "boolean" },
          sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
        },
      },
    },
  },
};

/** The judge's instruction and input, kept pure so a test can read it. */
export function judgePrompt(text, candidates) {
  const list = candidates.map((c) => `- id "${c.id}": ${c.name}${c.description ? `, ${c.description}` : ""}${c.unclear ? " (UNCLEAR: decide whether the answer means this business)" : ""}`).join("\n");
  return [
    "You audit an AI assistant's answer for brand mentions. For each listed business, return:",
    "refers: true if the answer names or recommends this specific business; false if a matching word means something else (another company, a plant, a place).",
    "sentiment: how the answer presents this business: positive (recommended or praised), neutral (listed or described plainly), negative (criticised, warned against, or said not to exist or not to be found).",
    "Return one entry per listed id, in the same order.",
    "",
    "Businesses:",
    list,
    "",
    "Answer:",
    '"""',
    text,
    '"""',
  ].join("\n");
}

/**
 * Calls the judge. candidates: [{ id, name, description?, unclear }]. Returns
 * { verdicts: { [id]: { refers, sentiment } }, usage }.
 */
export async function judge(text, candidates, { model, key, fetchImpl, limits }) {
  const body = {
    model,
    input: judgePrompt(text, candidates),
    text: { format: { type: "json_schema", name: "brand_judgement", strict: true, schema: SCHEMA } },
    ...(limits && { max_output_tokens: limits.maxOutputTokens }),
    store: false,
  };
  const res = await postJson("https://api.openai.com/v1/responses", { Authorization: `Bearer ${key}` }, body, { keys: [key], fetchImpl });
  const u = res.usage || {};
  const usage = { input: u.input_tokens || 0, cachedInput: u.input_tokens_details?.cached_tokens || 0, output: u.output_tokens || 0, searches: 0 };
  // Every failure below carries the usage of the paid response, so the caller
  // charges it to the ledger even when the verdict is unusable.
  const fail = (msg) => Object.assign(new Error(msg), { usage });
  if (res.status !== "completed") throw fail(`judge status ${res.status ?? "missing"}${res.incomplete_details?.reason ? ` (${res.incomplete_details.reason})` : ""}`);
  const out = (res.output || []).filter((o) => o.type === "message").flatMap((m) => m.content || []).find((c) => c.type === "output_text");
  if (!out?.text) throw fail("judge returned no text");
  let parsed;
  try { parsed = JSON.parse(out.text); } catch { throw fail("judge returned invalid JSON"); }
  const verdicts = {};
  for (const b of parsed.brands || []) {
    if (verdicts[b.id]) throw fail(`judge returned ${b.id} twice`);
    verdicts[b.id] = { refers: b.refers, sentiment: b.sentiment };
  }
  // A verdict set that does not match the asked candidates one for one would
  // turn an unjudged mention into a silent non-mention.
  const asked = [...new Set(candidates.map((c) => c.id))];
  const missing = asked.filter((id) => !verdicts[id] || typeof verdicts[id].refers !== "boolean");
  const extra = Object.keys(verdicts).filter((id) => !asked.includes(id));
  if (missing.length || extra.length) throw fail(`judge verdicts do not match the candidates (missing ${missing.join(",") || "none"}, extra ${extra.join(",") || "none"})`);
  return { verdicts, usage, model: res.model };
}
