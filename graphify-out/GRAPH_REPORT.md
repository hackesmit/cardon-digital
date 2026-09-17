# Graph Report - cardon-digital  (2026-09-17)

## Corpus Check
- 147 files · ~183,246 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 984 nodes · 2167 edges · 64 communities (54 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8bd83ed6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- canvasKit.ts
- compilerOptions
- site.ts
- page.tsx
- config.ts
- ModuleScreen.tsx
- ClinicSchedule.tsx
- page.tsx
- devDependencies
- pageMetadata
- page.tsx
- Agent Instructions
- Project Instructions for AI Agents
- SitePlanVisual.tsx
- Beads - AI-Native Issue Tracking
- page.tsx
- Cardon Digital
- Beads
- page.tsx
- page.tsx
- middleware.ts
- sitemap.ts
- post-checkout
- post-merge
- measurement-proof.mjs
- validate.ts
- page.tsx
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- page.tsx
- page.tsx
- VineField.tsx
- SitePlanVisual.tsx
- localePath
- page.tsx
- page.tsx
- BridgeMap.tsx
- ModuleFloors.tsx
- .eslintrc.json
- localePath
- Media credits
- Media clearances
- BridgeMap.tsx
- page.tsx
- bumpOffBareMultiple
- bundleHours
- bumpOffBareMultiple
- page.tsx
- page.tsx
- SpotlightFrames.test.ts
- demos.test.ts
- page.tsx
- ContactForm.tsx
- contact.ts
- palette.ts
- mail.ts
- priced
- page.tsx
- readDemoPalette
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `Locale` - 43 edges
2. `rich()` - 35 edges
3. `isLocale()` - 34 edges
4. `localePath()` - 33 edges
5. `pageMetadata()` - 25 edges
6. `SectionSeason()` - 21 edges
7. `quote` - 20 edges
8. `RestauranteDemo()` - 19 edges
9. `site` - 19 edges
10. `useDict()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `runCostBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts
- `sharedServiceBaseBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts
- `validateAllowlist()` --indirect_call--> `entries()`  [INFERRED]
  scripts/copy-check.mjs → lib/contact/rateLimit.ts
- `localeOf()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/about/page.tsx → lib/i18n/config.ts

## Import Cycles
- None detected.

## Communities (64 total, 10 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.15
Nodes (20): dedupe(), drawFlow(), fitCanvas(), makeTrace(), Palette, pointAtLen(), Pt, strokeTraceUpTo() (+12 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "site.ts"
Cohesion: 0.19
Nodes (19): bands, CAPTION_KEYS, CaptionKey, captionKeyFor(), clampN(), clockLabel(), COV, cycleFrame (+11 more)

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (29): AddOn, addOns, BundleItem, BySize, CatalogueFeature, CurrencyCode, formatAmount(), groupLocale (+21 more)

### Community 4 - "config.ts"
Cohesion: 0.27
Nodes (12): generateMetadata(), LocaleLayout(), isLocale(), localeFromCountry(), localeFromPath(), locales, ogLocale, stripLocale() (+4 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.25
Nodes (8): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, CaseFact, CaseFacts(), PlayOnceVis(), PlayOnceVisProps

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.17
Nodes (20): generateMetadata(), localeOf(), ModulosPage(), Params, Combinations(), ModuleBlock(), PricingDetails(), Showcase() (+12 more)

### Community 7 - "page.tsx"
Cohesion: 0.18
Nodes (13): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), routes, sitemap(), PricingBundles() (+5 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-next, lenis, next, next-view-transitions, dependencies, lenis (+33 more)

### Community 9 - "pageMetadata"
Cohesion: 0.06
Nodes (51): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+43 more)

### Community 10 - "page.tsx"
Cohesion: 0.18
Nodes (23): ContactDoors(), ContactMail(), Attribution, clean(), EMPTY_ATTRIBUTION, readAttribution(), readCookie(), readStored() (+15 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.06
Nodes (28): generateMetadata(), localeOf(), Params, PrivacyPage(), Env, pageSource, showsPending(), about (+20 more)

### Community 12 - "Project Instructions for AI Agents"
Cohesion: 0.17
Nodes (11): Agent Context Profiles, Agent Instructions, Beads Issue Tracker, Beads Issue Tracker, Non-Interactive Shell Commands, Quick Reference, Quick Reference, Quick Reference (+3 more)

### Community 13 - "SitePlanVisual.tsx"
Cohesion: 0.20
Nodes (9): Agent Context Profiles, Architecture Overview, Beads Issue Tracker, Build & Test, Conventions & Patterns, Project Instructions for AI Agents, Quick Reference, Rules (+1 more)

### Community 14 - "Beads - AI-Native Issue Tracking"
Cohesion: 0.22
Nodes (8): Beads - AI-Native Issue Tracking, Essential Commands, Get Started with Beads, Learn More, Quick Start, What is Beads?, Why Beads?, Working with Issues

### Community 15 - "page.tsx"
Cohesion: 0.20
Nodes (9): Cardon Digital, Environment flags, Layout, License, Pre-launch gate, Running locally, Scripts, Stack (+1 more)

### Community 16 - "Cardon Digital"
Cohesion: 0.29
Nodes (6): Beads, Core CLI Workflow, First Step, Preferred Route, Rules, What Belongs In Beads

### Community 17 - "Beads"
Cohesion: 0.09
Nodes (21): 1. What the two books actually teach, 2. What is wrong with the site today (measured, not asserted), 3. The rules, 4. Home page architecture, 5. Demos and motion, 6. Media, 7. Definition of done for any copy bead, 8. A copy bead never deletes a visual (binding) (+13 more)

### Community 21 - "middleware.ts"
Cohesion: 0.11
Nodes (36): ConsentBanner(), ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), MeasurementScripts() (+28 more)

### Community 27 - "validate.ts"
Cohesion: 0.11
Nodes (25): ADVISORY_SHAPES, BLOCKING_SHAPES, checkSource(), CONTRAST_ALLOWLIST, countClusters(), countEmphasis(), countWords(), describe() (+17 more)

### Community 28 - "page.tsx"
Cohesion: 0.19
Nodes (10): metadata, ContourField(), Nav(), SiteShell(), archivo, otherLocale(), en, es (+2 more)

### Community 32 - "page.tsx"
Cohesion: 0.29
Nodes (9): AboutPage(), generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params, TermsPage() (+1 more)

### Community 33 - "page.tsx"
Cohesion: 0.13
Nodes (14): 10. Maps are contiguous, never floating shapes, 11. The data is a pure module, the component measures and draws, 12. The contract is enforced on every demo, and the spellings are the contract, 1. One hue, and the hue is the demo's own, 2. The three motion gates, and where they live, 3. An observer's threshold is a promise the callback keeps, 4. The device pixel ratio is capped at 2, and it is not fixed for the page, 5. Reduced motion resolves to the payoff frame, and the clock agrees with it (+6 more)

### Community 34 - "VineField.tsx"
Cohesion: 0.08
Nodes (23): absorbedProviderCash(), AddOnId, combinations, legacyWineryBundles, legacyWinerySetupFloor(), mixDiscountByRank, modules, ModuleSelection (+15 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.21
Nodes (15): addOnAvailable(), addOnOf(), addOnSize(), buildOnly(), bundleHours(), ceilTo(), featureOf(), floorFor() (+7 more)

### Community 36 - "localePath"
Cohesion: 0.27
Nodes (14): MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence(), mixRules() (+6 more)

### Community 37 - "page.tsx"
Cohesion: 0.06
Nodes (36): captures(), declaredSpans(), pageSource, serve(), servedCapBodies(), servedSpans(), strings(), BerryToBottleDesktop() (+28 more)

### Community 38 - "page.tsx"
Cohesion: 0.09
Nodes (41): ACID, ACID_RANGE, ACID_TICKS, BRIX, BRIX_RANGE, BRIX_TICKS, DAY_TICKS, dayAt() (+33 more)

### Community 39 - "BridgeMap.tsx"
Cohesion: 0.15
Nodes (10): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+2 more)

### Community 40 - "ModuleFloors.tsx"
Cohesion: 0.21
Nodes (10): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, comingSoon, ComingSoonDict (+2 more)

### Community 42 - "localePath"
Cohesion: 0.25
Nodes (7): Export and drop in, How a slot works, Media: the shot list, Ratios, and the size to shoot to, Shooting notes, The slots, Video

### Community 43 - "Media credits"
Cohesion: 0.33
Nodes (5): enkanto-valle.webp, Media credits, Our own material, Placeholder stock, valle-vineyard.webp

### Community 44 - "Media clearances"
Cohesion: 0.40
Nodes (4): Entries, Media clearances, The entry, Two clearances, both required

### Community 46 - "BridgeMap.tsx"
Cohesion: 0.31
Nodes (7): BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS

### Community 47 - "page.tsx"
Cohesion: 0.33
Nodes (11): defaultBranch(), filesAt(), filesNow(), findRemovals(), git(), main(), RETIRED, ROOT (+3 more)

### Community 48 - "bumpOffBareMultiple"
Cohesion: 0.18
Nodes (17): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), { redirect }, FloorChart(), bundleLines() (+9 more)

### Community 49 - "bundleHours"
Cohesion: 0.18
Nodes (12): DemoMotionState, observeOnscreen(), shouldAnimate(), clearsThreshold(), OnscreenEntry, ObserverSite, observerSites(), read() (+4 more)

### Community 50 - "bumpOffBareMultiple"
Cohesion: 0.33
Nodes (9): addOnMonthly(), annualPrepay, bumpOffBareMultiple(), round100(), runCost(), runCostBreakdown(), serviceLineMonthly(), sharedServiceBase() (+1 more)

### Community 51 - "page.tsx"
Cohesion: 0.17
Nodes (16): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), deliver(), redactLead(), Bucket (+8 more)

### Community 52 - "page.tsx"
Cohesion: 0.36
Nodes (6): EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, showPending, SpotlightFrames()

### Community 53 - "SpotlightFrames.test.ts"
Cohesion: 0.28
Nodes (6): SpotlightFrames(), spotlightVars(), CASE_CSS, GLOBALS, PAGE, ROOT

### Community 54 - "demos.test.ts"
Cohesion: 0.14
Nodes (15): code(), componentRules, FakeObserver, here, read(), strip(), PEAK_T, PEAK_V (+7 more)

### Community 55 - "page.tsx"
Cohesion: 0.23
Nodes (9): CASE_ROUTES, generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames() (+1 more)

### Community 56 - "ContactForm.tsx"
Cohesion: 0.20
Nodes (11): EMPTY, Status, Values, Email, attributionField(), ContactAttribution, ContactField, isHeaderSafe() (+3 more)

### Community 57 - "contact.ts"
Cohesion: 0.18
Nodes (10): DoorVariant, contact, ContactDict, en, enDescription, enIntro, es, esDescription (+2 more)

### Community 58 - "palette.ts"
Cohesion: 0.24
Nodes (9): BRIGHT_MIX, DemoHue, DemoPalette, FALLBACK, BLACK, clamp01(), easeInOut(), RGB (+1 more)

### Community 59 - "mail.ts"
Cohesion: 0.36
Nodes (9): bodyFor(), buildEmail(), deliveryConfigured(), DeliveryResult, envAddress(), RedactedLead, subjectFor(), ContactSubmission (+1 more)

### Community 60 - "priced"
Cohesion: 0.29
Nodes (8): featureHours(), featureSetup(), growerBundleHours(), growerSetupS(), priced(), round500(), roundHalfDown(), usdFromMxn()

### Community 61 - "page.tsx"
Cohesion: 0.38
Nodes (6): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactForm()

### Community 62 - "readDemoPalette"
Cohesion: 0.47
Nodes (6): readDemoPalette(), hexToRgb(), mix(), readPalette(), rgba(), SectorMap()

### Community 63 - "page.tsx"
Cohesion: 0.60
Nodes (4): generateMetadata(), localeOf(), Params, PreciosPage()

## Knowledge Gaps
- **338 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `Params` (+333 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `ClinicSchedule.tsx` to `page.tsx`, `config.ts`, `ModuleScreen.tsx`, `page.tsx`, `pageMetadata`, `Agent Instructions`, `page.tsx`, `page.tsx`, `localePath`, `page.tsx`, `page.tsx`, `BridgeMap.tsx`, `ModuleFloors.tsx`, `BridgeMap.tsx`, `bumpOffBareMultiple`, `page.tsx`, `page.tsx`, `ContactForm.tsx`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `serve()` connect `page.tsx` to `page.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `react` connect `page.tsx` to `devDependencies`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _338 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07056451612903226 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._