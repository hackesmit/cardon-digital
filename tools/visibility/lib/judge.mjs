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
  const out = (res.output || []).filter((o) => o.type === "message").flatMap((m) => m.content || []).find((c) => c.type === "output_text");
  const parsed = JSON.parse(out?.text || '{"brands":[]}');
  const verdicts = {};
  for (const b of parsed.brands || []) verdicts[b.id] = { refers: b.refers, sentiment: b.sentiment };
  const u = res.usage || {};
  return { verdicts, usage: { input: u.input_tokens || 0, cachedInput: u.input_tokens_details?.cached_tokens || 0, output: u.output_tokens || 0, searches: 0 }, model: res.model };
}
