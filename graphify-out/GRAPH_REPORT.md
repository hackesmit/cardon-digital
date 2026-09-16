# Graph Report - cardon-digital  (2026-09-15)

## Corpus Check
- 141 files · ~164,304 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 915 nodes · 2013 edges · 50 communities (40 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1a3e53bf`
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

## God Nodes (most connected - your core abstractions)
1. `Locale` - 41 edges
2. `rich()` - 35 edges
3. `isLocale()` - 34 edges
4. `localePath()` - 33 edges
5. `pageMetadata()` - 25 edges
6. `quote` - 20 edges
7. `site` - 19 edges
8. `RestauranteDemo()` - 18 edges
9. `useDict()` - 18 edges
10. `Reveal()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `runCostBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts
- `sharedServiceBaseBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts
- `Footer()` --calls--> `localePath()`  [EXTRACTED]
  components/site/Footer.tsx → lib/i18n/config.ts
- `NotFoundBody()` --calls--> `localePath()`  [EXTRACTED]
  components/site/NotFoundBody.tsx → lib/i18n/config.ts

## Import Cycles
- None detected.

## Communities (50 total, 10 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.07
Nodes (62): FakeObserver, here, bands, captionKeyFor(), clampN(), clockLabel(), COV, cycleFrame (+54 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "site.ts"
Cohesion: 0.29
Nodes (9): AboutPage(), generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params, PreciosPage() (+1 more)

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (28): AddOn, addOns, BundleItem, BySize, CatalogueFeature, CurrencyCode, groupLocale, growerBundleS (+20 more)

### Community 4 - "config.ts"
Cohesion: 0.17
Nodes (21): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), generateMetadata(), LocaleLayout(), routes (+13 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.29
Nodes (7): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, PlayOnceVis(), PlayOnceVisProps, SpotlightFrames()

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.17
Nodes (19): generateMetadata(), localeOf(), ModulosPage(), Params, Combinations(), ModuleBlock(), PricingDetails(), Showcase() (+11 more)

### Community 7 - "page.tsx"
Cohesion: 0.20
Nodes (13): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), { redirect }, allModules, demoHref() (+5 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-next, lenis, next, next-view-transitions, dependencies, lenis (+33 more)

### Community 9 - "pageMetadata"
Cohesion: 0.06
Nodes (51): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+43 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (42): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+34 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.11
Nodes (25): ADVISORY_SHAPES, BLOCKING_SHAPES, checkSource(), CONTRAST_ALLOWLIST, countClusters(), countEmphasis(), countWords(), describe() (+17 more)

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
Cohesion: 0.09
Nodes (33): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+25 more)

### Community 28 - "page.tsx"
Cohesion: 0.14
Nodes (14): metadata, ContourField(), Footer(), Mark(), MarkVariant, Nav(), NotFoundBody(), SiteShell() (+6 more)

### Community 32 - "page.tsx"
Cohesion: 0.06
Nodes (32): generateMetadata(), localeOf(), Params, PrivacyPage(), generateMetadata(), localeOf(), Params, TermsPage() (+24 more)

### Community 33 - "page.tsx"
Cohesion: 0.25
Nodes (8): EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, showPending, CaseFact, CaseFacts(), SpotlightFrames()

### Community 34 - "VineField.tsx"
Cohesion: 0.09
Nodes (22): absorbedProviderCash(), AddOnId, combinations, legacyWineryBundles, legacyWinerySetupFloor(), modules, ModuleSelection, scopeFactor (+14 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.17
Nodes (22): addOnAvailable(), addOnMonthly(), addOnOf(), addOnSize(), annualPrepay, buildOnly(), bumpOffBareMultiple(), ceilTo() (+14 more)

### Community 36 - "localePath"
Cohesion: 0.23
Nodes (16): MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence(), mixRules() (+8 more)

### Community 37 - "page.tsx"
Cohesion: 0.06
Nodes (41): captures(), declaredSpans(), pageSource, serve(), servedCapBodies(), servedSpans(), strings(), BerryToBottleDesktop() (+33 more)

### Community 38 - "page.tsx"
Cohesion: 0.09
Nodes (25): CASE_ROUTES, generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames() (+17 more)

### Community 39 - "BridgeMap.tsx"
Cohesion: 0.15
Nodes (10): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+2 more)

### Community 40 - "ModuleFloors.tsx"
Cohesion: 0.27
Nodes (8): ComingSoonPage(), generateMetadata(), localeOf(), Params, comingSoon, ComingSoonDict, en, es

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
Cohesion: 0.40
Nodes (5): FloorChart(), bundleLines(), ModuleFloors(), formatAmount(), formatPrice()

### Community 49 - "bundleHours"
Cohesion: 0.22
Nodes (10): bundleHours(), featureHours(), featureOf(), featureSetup(), floorFor(), hours3(), pesos2(), runCostHours() (+2 more)

## Knowledge Gaps
- **311 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `Params` (+306 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `page.tsx` to `page.tsx`, `page.tsx`, `site.ts`, `page.tsx`, `config.ts`, `page.tsx`, `ClinicSchedule.tsx`, `page.tsx`, `ModuleFloors.tsx`, `ModuleScreen.tsx`, `page.tsx`, `BridgeMap.tsx`, `localePath`, `pageMetadata`, `BridgeMap.tsx`, `validate.ts`, `page.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `serve()` connect `page.tsx` to `config.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `react` connect `page.tsx` to `devDependencies`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _311 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06522522522522523 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07311827956989247 - nodes in this community are weakly interconnected._