# AI visibility tracker (API panel)

Measures how often AI answer engines name a business when asked the questions its customers ask, so the AEO work has a number that moves. Built for Cardon first (bead hq-i4b5.20) and meant for clients later. It is a Node script with no dependencies; it is not part of the Next app, nothing under `app/` imports it, and the site neither builds nor serves it.

```bash
npm run visibility -- --client cardon --dry-run      # plan and worst-case cost, no calls
npm run visibility -- --client cardon --max-usd 15   # full run: every prompt x every engine x 5 runs
npm run visibility -- --client cardon --runs 1 --prompts P0,P9 --engines openai
npm run visibility -- --resume <run dir>             # finish a run the cap or an error stopped
npm run visibility -- --analyse <run dir>            # rebuild report and summary from stored answers
npm run visibility:test                              # unit tests (also part of npm test)
```

Exit codes: 0 complete, 1 config or key error, 3 partial (the cap stopped it, or calls failed); the partial report is still written.

## Where things live

This repository is public, so client configs and outputs never go in it. The tracker home defaults to `~/hq/bunkers/cardon-digital/research/2026-10/aeo/tracker` (override with `--home` or `$VISIBILITY_HOME`):

- `clients/<client>.json`: brand, aliases, competitors, prompts, engines, judge, key sources.
- `runs/<client>/<stamp>/raw/<engine>/<prompt>-r<n>.json`: each answer's raw response body plus the judge's verdict.
- `runs/<client>/<stamp>/summary.json`: every number, machine-readable; the next run's report diffs against the newest earlier one.
- `runs/<client>/<stamp>/report.md`: the report, labelled "API panel, directional".
- `spend/<day>.json`: the daily cost cap's ledger (UTC day, all runs and clients).

## Client config

```json
{
  "client": "cardon",
  "brand": { "id": "cardon", "name": "Cardon Digital", "aliases": ["Cardón Digital"],
             "ambiguous": [{ "text": "Cardon", "notFollowedBy": ["media"] }],
             "domains": ["cardondigital.com"], "description": "one line the judge can use" },
  "competitors": [{ "id": "marea", "name": "Marea Studio", "aliases": [], "domains": ["mareabaja.mx"] }],
  "prompts": [{ "id": "P0", "text": "agencia de paginas web en Ensenada", "intent": "category",
                "language": "es", "country": "MX", "region": "Baja California", "city": "Ensenada" }],
  "engines": { "openai": { "model": "gpt-5.5", "concurrency": 4 }, "gemini": { "model": "gemini-2.5-flash", "concurrency": 2 } },
  "judge": { "model": "gpt-5.4-nano" },
  "keys": { "OPENAI_API_KEY": { "vault": "...", "item": "...", "field": "Secret" } },
  "domainClasses": { "directory": ["extra-directory.mx"], "ugc": [] },
  "baseline": "optional prose shown in the report"
}
```

- `intent` is one of `branded`, `category`, `comparison`. Non-branded visibility leaves out `branded`.
- Matching folds case and accents and treats spaces and hyphens alike. `aliases` and `domains` are definite; `ambiguous` hits go to the judge. Keep prompt and brand ids stable across runs, or the diffs mean nothing.
- Every model must have a price and `limits` in `pricing.json` (list prices, with the date they were read).

## Cost bounds

Each call is bounded by its model's `limits` in `pricing.json`. `maxOutputTokens` goes to the API (OpenAI `max_output_tokens`, reasoning included; Gemini `generationConfig.maxOutputTokens`, thoughts included) and `maxSearches` goes to OpenAI as `max_tool_calls`. The daily cap reserves `estimatePerCall` before a call starts, and that estimate is computed, never typed: (maxInputTokens x input price + maxOutputTokens x output price) / 1M + maxSearches x perSearch + perGroundedPrompt. Two terms are ceilings rather than API limits: input (prompt plus search content, set with headroom from the 2026-10-27 run, whose largest answer used 33,697 input tokens and 5 searches) and Gemini's search count (the API has no parameter for it). A call whose real price passes its estimate is logged as an overrun; raise `maxInputTokens` if that happens. A call that hits the output cap comes back incomplete and is recorded as an error, not as an answer.

Concurrent runs are unsupported: the spend ledger and run directories assume one tracker process at a time on this box.

## Keys

Read in this order, never printed, never written to an output: the environment (`OPENAI_API_KEY`, `GEMINI_API_KEY`), then `~/hq/ops/config/visibility.env` (gitignored, mode 600), then the Proton Pass item named under `keys` in the client config. Keys go in request headers only, and error messages are redacted before they reach the log or `errors.json`.

## What it measures

Per engine and overall, from answers pooled over runs (brand lists rarely repeat between runs, so mention rate is the stable number):

- **Visibility**: answers naming the brand / answers, with a Wilson 95% interval. About 300 answers gives roughly plus or minus 5 points; 100 answers gives about plus or minus 8 to 10.
- **Non-branded visibility**: the same without branded prompts.
- **Share of voice**: our mentioning answers / all tracked brands' mentioning answers.
- **Average position**: rank of the list item that names us, over mentions inside a list (a passing mention gets no rank).
- **Citation share**: answers citing one of our domains / answers.
- **Sentiment**: the judge's positive / neutral / negative for each answer naming us.
- **Cited domains** classed own, competitor, directory, ugc or other, and a **gap list**: third-party domains cited in answers that name a competitor and never in an answer that names us.

Detection is a string match, so the counts can be recomputed from the stored text. The judge (one cheap structured-output call per answer that names anyone tracked) only rules on unclear hits and gives sentiment; it never adds or removes a definite hit. Ideas for the matcher came from limelit-co/open (Apache-2.0: list rank of the enclosing item) and TheCraigHewitt/namedrop (MIT: `notFollowedBy`); no code was copied.

## Engines

- **openai**: Responses API, `web_search` tool, approximate user location from the prompt's country, region and city.
- **gemini**: `generateContent` with Google Search grounding. A free AI Studio key refuses grounding (every grounded call returns a quota error, and Gemini 2.5 is closed to new keys since 2026-10), so the project needs billing on before Gemini can run. The API has no location setting, so only the city in the prompt localises it. Cited urls are Google redirects; the tool follows each with one HEAD request (https on vertexaisearch.cloud.google.com only, no credentials or custom port, 5 s timeout; any other url is kept as-is with no request) to record the real domain.
- **Perplexity Sonar** is not wired in: its API needs prepaid credits and none are funded.

API answers are not consumer-app answers (published brand overlap between the two is 6 to 24%, and the ChatGPT app cites far more sources), so every report says "API panel, directional".

## Manual check: Google AI Overviews and AI Mode

There is no API for either, so they stay manual, monthly, the way the 2026-10-20 baseline did it:

1. From a residential IP (George, not hqbox: hqbox gets Google's unusual-traffic page), open a private window on google.com with Spanish, Mexico, logged out.
2. Search each prompt verbatim from the client config.
3. Record whether an AI Overview showed, whether the brand is named in it, whether our domain is linked, and the businesses and organic domains it names. Then open AI Mode for the same prompt and record the same.
4. Save the text per prompt next to the run (`runs/<client>/<stamp>/manual/google-<prompt>.txt`) and add a short table to that run's report under "Manual: Google".

## Cadence

Run weekly, report monthly. The first full Cardon OpenAI run (2026-10-27, 10 prompts x 5 runs on gpt-5.5, with the judge) cost $4.97: about $0.10 per answer, most of it web search content billed as input tokens. Gemini on gemini-3.8-flash adds roughly $0.25 per run once billing is on. Google waives grounding on the first 5,000 requests a month, but the tracker does not model that: every call is charged list price in the ledger and the cap, so the reported cost is an upper estimate, never zero.
