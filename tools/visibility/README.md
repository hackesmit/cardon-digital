# AI visibility tracker (API panel)

Measures how often AI answer engines name a business when asked the questions its customers ask, so the AEO work has a number that moves. Built for Cardon first (bead hq-i4b5.20) and meant for clients later. It is a Node script with no dependencies; it is not part of the Next app, nothing under `app/` imports it, and the site neither builds nor serves it.

```bash
npm run visibility -- --client cardon --dry-run      # plan and worst-case cost, no calls
npm run visibility -- --client cardon --max-usd 15   # full run: every prompt x every engine x 5 runs
npm run visibility -- --client cardon --runs 1 --prompts P0,P9 --engines openai
xvfb-run -a npm run visibility -- --client cardon --engines gemini-web --runs 1   # the Gemini app, through a browser
npm run visibility -- --resume <run dir>             # finish a run the cap or an error stopped
npm run visibility -- --analyse <run dir>            # rebuild report and summary from stored answers
npm run visibility:test                              # unit tests (also part of npm test)
```

A generation that is not a usable answer (OpenAI status other than `completed`, no output message, a Gemini prompt blocked or with no candidates or a non-STOP finish, or empty text) is charged to the ledger but recorded as an error, kept out of the metrics, and retried by `--resume`.

Exit codes: 0 complete, 1 config or key error, 3 partial (the cap stopped it, or calls failed); the partial report is still written.

## Where things live

This repository is public, so client configs and outputs never go in it. The tracker home defaults to `~/hq/bunkers/cardon-digital/research/2026-10/aeo/tracker` (override with `--home` or `$VISIBILITY_HOME`):

- `clients/<client>.json`: brand, aliases, competitors, prompts, engines, judge, key sources.
- `runs/<client>/<stamp>/raw/<engine>/<prompt>-r<n>.json`: each answer's raw response body plus the judge's verdict. `<stamp>` is the UTC start time to the second plus a random suffix (`2026-10-30T123456Z-1a2b3c4d`); a new run always creates a fresh directory and fails rather than reuse one, and only `--resume` writes into an existing run.
- `runs/<client>/<stamp>/summary.json`: every number, machine-readable; the next run's report diffs against the newest earlier one.
- `runs/<client>/<stamp>/report.md`: the report, labelled "API panel, directional".
- `spend/<day>.json`: the daily cost cap's ledger (UTC day, all runs and clients).
- `browser/gemini-web/<account>/`: the Chrome profile the `gemini-web` engine signs in with, one per configured account, named by a readable prefix plus 12 hex digits of the SHA-256 of the email (`daniel-cardondigital-com-<hash>`), so two emails never share one. It holds Google session cookies: hq's `.gitignore` keeps `bunkers/**/tracker/browser/` out of git, and the engine keeps `browser/`, `browser/gemini-web/` and the profile at mode 700 (it repairs looser modes and refuses a symlink or another user's directory). A profile left directly in `browser/gemini-web/`, or under the old unhashed name, moves into the account's directory on the next run.

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
  "engines": { "openai": { "model": "gpt-6-sol", "concurrency": 4 }, "gemini": { "model": "gemini-3.8-flash", "concurrency": 2 } },
  "judge": { "model": "gpt-6-luna" },
  "keys": { "OPENAI_API_KEY": { "vault": "...", "item": "...", "field": "Secret" } },
  "domainClasses": { "directory": ["extra-directory.mx"], "ugc": [] },
  "baseline": "optional prose shown in the report"
}
```

- `intent` is one of `branded`, `category`, `comparison`. Non-branded visibility leaves out `branded`.
- Matching folds case and accents and treats spaces and hyphens alike. `aliases` and `domains` are definite; `ambiguous` hits go to the judge. Keep prompt and brand ids stable across runs, or the diffs mean nothing.
- Every model must have a price and `limits` in `pricing.json` (list prices, with the date they were read).
- Prices are effective-dated: each model has a `rates` list, and a call is charged the rate in force (by UTC date) when it is reserved. The cap reserves at that rate, and every stored answer and judge verdict keeps the rate it was charged, so a later price change (gemini-3.8-flash doubles on 2027-01-01) never reprices a stored run.
- A model marked `retired` keeps its rates so stored runs still analyse and resume, but no new call may use it: a new run config naming it fails at validation, and `--resume` refuses to call it. When a provider answers that a model id does not exist, that engine stops and the report names the cause; the other engines carry on.

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

Detection is a string match, so the counts can be recomputed from the stored text. If the judge call fails, the paid-for answer is stored with its error but not counted (it would otherwise read as a non-mention): `summary.json` gives `judgePending`, the report says how many await a verdict, the run is partial, and `--resume` re-runs only the judge for those answers, with no second engine call. The judge (one cheap structured-output call per answer that names anyone tracked) only rules on unclear hits and gives sentiment; it never adds or removes a definite hit. Ideas for the matcher came from limelit-co/open (Apache-2.0: list rank of the enclosing item) and TheCraigHewitt/namedrop (MIT: `notFollowedBy`); no code was copied.

## Engines

- **openai**: Responses API, `web_search` tool, approximate user location from the prompt's country, region and city. The model should match what ChatGPT users get: since 2026-11-03 that is `gpt-6-sol` (the paid-tier ChatGPT model; free and Go users get a Luna model), with `gpt-6-luna` as the judge. Check the model ids against the provider lists (`GET /v1/models`, `GET /v1beta/models`) before switching.
- **gemini**: `generateContent` with Google Search grounding. A free AI Studio key refuses grounding (every grounded call returns a quota error), so the project needs billing on before Gemini can run. The API has no location setting, so only the city in the prompt localises it. Cited urls are Google redirects; the tool follows each with one HEAD request (https on vertexaisearch.cloud.google.com only, no credentials or custom port, 5 s timeout; any other url is kept as-is with no request) to record the real domain.
- **gemini-web**: the Gemini consumer app (gemini.google.com) driven with Playwright (`playwright-core`, the repo's devDependency, and the system Chrome at `/usr/bin/google-chrome`), so Gemini runs with no API billing (Daniel, 2026-11-03). Config: `"gemini-web": { "model": "gemini-app", "account": { "vault": "Personal", "item": "admin.google.com" } }`; `model` is only a label, and `account` names the Proton Pass login used when the profile is signed out (a Cardon identity, never an agency one). `account.email` is optional (the item's `email` field is read otherwise). Optional: `timeoutMs` (default 180000 per answer), `authTimeoutMs` (20000 per sign-in step), `pollMs` (2000), `headless`, `chrome`.
  - Before any prompt is sent the engine reads the signed-in account from the app's "Google Account: Name (email)" link and stops if it is not the configured account. It signs in only when the page shows no account: email, entered only on `https://accounts.google.com`, then the password, read from Proton Pass and filled only on Google's ordinary `/challenge/pwd` route of that same origin and held in the redaction set until the browser closes; any other `/challenge/` page (2-step, device prompt) stops the engine, and so does any other site during sign-in (an external identity provider is not configured). A failed credential step reports a fixed message, never Playwright's error (its call log repeats the filled value), and the engine refuses to start when `DEBUG` has any value or `PWDEBUG` is set, since Playwright's debug output would log the password.
  - Captcha and usage-limit checks read only trusted signals: the url, a visible captcha frame, the app's own short status banners outside the conversation, and Google accounts pages. Words like "reCAPTCHA" or "límite de uso" in a prompt or an answer never stop it, and neither does an answer that is only a limit sentence (a prompt can ask for one).
  - The prompt goes into the box as one text fill and is sent once, so a multiline prompt is not sent at its first newline.
  - It runs one prompt at a time in a fresh chat and stores the answer's HTML (`{ html, url, mode, complete, elapsedMs }`); `parseGeminiWeb` turns `<message-content>` into the same markdown shape the API engines return, and reads cited urls from the source chips' `jslog` metadata (base64 JSON), so old pages re-parse offline.
  - Browser-driven means no tokens and no key: no price in `pricing.json`, no cost row in the report (its judge calls still count), and the record carries `browser: true` and `rate: null`.
  - Headless Chrome never reached a prompt box in testing (2026-11-03), so it runs a real window: use `xvfb-run -a` on a box with no display. A captcha, a usage limit, a sign-in challenge or a missing display stops the engine with the reason in the summary (exit 3; `--resume` carries on). A reply that never finishes, an empty one or Gemini's canned "Soy un modelo de lenguaje, así que no tengo esa capacidad" is an error `--resume` retries.
  - The Cardon login is a Google Workspace account, so these are Workspace Gemini answers (mode Flash, signed in, no history), not a consumer free-tier account's. The first sign-in walked through Workspace's terms and welcome dialogs; the engine clicks through them if they reappear.
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
