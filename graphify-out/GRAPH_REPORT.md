# Graph Report - cardon-digital  (2026-09-23)

## Corpus Check
- 174 files · ~220,734 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1217 nodes · 2668 edges · 63 communities (53 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29db5729`
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
- checks.tsx
- page.tsx
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- page.tsx
- page.tsx
- VineField.tsx
- SitePlanVisual.tsx
- useDemoStage.ts
- page.tsx
- page.tsx
- canvasKit.ts
- ModuleFloors.tsx
- .eslintrc.json
- localePath
- Media credits
- Media clearances
- useDict
- page.tsx
- precios.ts
- localePath
- bumpOffBareMultiple
- page.tsx
- page.tsx
- SpotlightFrames.test.ts
- Nav.tsx
- page.tsx
- page.tsx
- bumpOffBareMultiple
- ModuleScreen.tsx
- observeOnscreen
- priced
- BridgeMap.tsx
- palette.ts

## God Nodes (most connected - your core abstractions)
1. `Locale` - 44 edges
2. `rich()` - 33 edges
3. `isLocale()` - 32 edges
4. `localePath()` - 32 edges
5. `useDict()` - 26 edges
6. `pageMetadata()` - 23 edges
7. `SectionSeason()` - 21 edges
8. `quote` - 20 edges
9. `site` - 18 edges
10. `useDemoStage()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `names()` --references--> `ModuleId`  [EXTRACTED]
  app/[locale]/ads-claim.test.ts → lib/pricing.ts
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `runCostBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts
- `sharedServiceBaseBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts
- `validateAllowlist()` --indirect_call--> `entries()`  [INFERRED]
  scripts/copy-check.mjs → lib/contact/rateLimit.ts

## Import Cycles
- None detected.

## Communities (63 total, 10 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.13
Nodes (30): FakeObserver, here, bands, CAPTION_KEYS, CaptionKey, captionKeyFor(), clampN(), clockLabel() (+22 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "site.ts"
Cohesion: 0.06
Nodes (39): accessibleText(), blocks(), decodeEntities(), Env, html(), pageCode, pageSource, renderedText() (+31 more)

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (26): AddOn, BundleItem, BySize, CatalogueFeature, CurrencyCode, formatAmount(), groupLocale, growerBundleS (+18 more)

### Community 4 - "config.ts"
Cohesion: 0.13
Nodes (14): DYNAMIC_HREFS, existingRoutes, Link, links, ROOT, ROUTE_ROOT, sourceFiles, localeFromCountry() (+6 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.25
Nodes (8): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, CaseFact, CaseFacts(), PlayOnceVis(), PlayOnceVisProps

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.13
Nodes (29): generateMetadata(), localeOf(), Params, PreciosPage(), Combinations(), ModuleBlock(), FloorChart(), bundleLines() (+21 more)

### Community 7 - "page.tsx"
Cohesion: 0.12
Nodes (23): { redirect }, generateMetadata(), metadata, routes, sitemap(), PricingBundles(), ContourField(), Footer() (+15 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (43): autoprefixer, eslint, eslint-config-next, jsdom, lenis, next, next-view-transitions, dependencies (+35 more)

### Community 9 - "pageMetadata"
Cohesion: 0.05
Nodes (53): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+45 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (43): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+35 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.27
Nodes (8): AboutPage(), generateMetadata(), localeOf(), Params, about, AboutDict, en, es

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

### Community 27 - "checks.tsx"
Cohesion: 0.06
Nodes (23): BOX, checks, Demo, describeEl(), failing(), GHOST, HINTS, judgeWrites() (+15 more)

### Community 28 - "page.tsx"
Cohesion: 0.11
Nodes (20): captures(), declaredSpans(), pageSource, servedCapBodies(), servedSpans(), strings(), AssistantDemo(), BARS (+12 more)

### Community 32 - "page.tsx"
Cohesion: 0.13
Nodes (19): LocaleLayout(), generateMetadata(), localeOf(), Params, PrivacyPage(), generateMetadata(), localeOf(), Params (+11 more)

### Community 33 - "page.tsx"
Cohesion: 0.29
Nodes (6): 1. What you write, 2. What you do not write, and what each piece is for, 3. What is checked, and how, 4. What is still yours to get right, Before you call a demo done, The module demos: how one is built

### Community 34 - "VineField.tsx"
Cohesion: 0.09
Nodes (22): absorbedProviderCash(), AddOnId, combinations, legacyWineryBundles, legacyWinerySetupFloor(), mixDiscountByRank, ModuleSelection, scopeFactor (+14 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.09
Nodes (27): broken(), classPrefix(), literal(), LIVE_ROLES, OPERABLE, SourceRuleContext, sourceRules, components (+19 more)

### Community 36 - "useDemoStage.ts"
Cohesion: 0.11
Nodes (14): ClockSpec, createClock(), DemoClock, DemoFigure(), DemoFigureProps, HIDDEN_WITHOUT_SCRIPT, HotspotProps, PickBox() (+6 more)

### Community 37 - "page.tsx"
Cohesion: 0.18
Nodes (11): CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS, RGB, VineyardMap(), en (+3 more)

### Community 38 - "page.tsx"
Cohesion: 0.09
Nodes (40): ACID, ACID_RANGE, ACID_TICKS, BRIX, BRIX_RANGE, BRIX_TICKS, DAY_TICKS, dayAt() (+32 more)

### Community 39 - "canvasKit.ts"
Cohesion: 0.15
Nodes (22): dedupe(), drawFlow(), fitCanvas(), hexToRgb(), makeTrace(), Palette, pointAtLen(), Pt (+14 more)

### Community 40 - "ModuleFloors.tsx"
Cohesion: 0.06
Nodes (40): ADS_ID, allModuleIds, attachesTo, blocksOf(), BUILD, buildAtEverySize, decode(), dictionaries() (+32 more)

### Community 42 - "localePath"
Cohesion: 0.25
Nodes (7): Export and drop in, How a slot works, Media: the shot list, Ratios, and the size to shoot to, Shooting notes, The slots, Video

### Community 43 - "Media credits"
Cohesion: 0.33
Nodes (5): enkanto-valle.webp, Media credits, Our own material, Placeholder stock, valle-vineyard.webp

### Community 44 - "Media clearances"
Cohesion: 0.40
Nodes (4): Entries, Media clearances, The entry, Two clearances, both required

### Community 46 - "useDict"
Cohesion: 0.14
Nodes (15): BerryToBottleDesktop(), BerryToBottleMobile(), Hotspot(), MediaPending(), demos, DemosDict, en, es (+7 more)

### Community 47 - "page.tsx"
Cohesion: 0.10
Nodes (52): line(), arrivalsOutside(), canvasCount(), changedSince(), classify(), compareVisual(), defaultBranch(), facultyMoved() (+44 more)

### Community 48 - "precios.ts"
Cohesion: 0.29
Nodes (13): MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence(), mixRules() (+5 more)

### Community 49 - "localePath"
Cohesion: 0.36
Nodes (6): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), SpotlightFrames()

### Community 50 - "bumpOffBareMultiple"
Cohesion: 0.21
Nodes (15): addOnAvailable(), addOnOf(), addOnSize(), buildOnly(), bundleHours(), ceilTo(), featureOf(), floorFor() (+7 more)

### Community 51 - "page.tsx"
Cohesion: 0.09
Nodes (33): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+25 more)

### Community 52 - "page.tsx"
Cohesion: 0.16
Nodes (9): CHANGE_VISUALS, EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, showPending, VisDict, SpotlightFrames() (+1 more)

### Community 53 - "SpotlightFrames.test.ts"
Cohesion: 0.28
Nodes (6): SpotlightFrames(), spotlightVars(), CASE_CSS, GLOBALS, PAGE, ROOT

### Community 54 - "Nav.tsx"
Cohesion: 0.23
Nodes (9): CASE_ROUTES, generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames() (+1 more)

### Community 55 - "page.tsx"
Cohesion: 0.19
Nodes (11): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, comingSoon, ComingSoonDict (+3 more)

### Community 56 - "page.tsx"
Cohesion: 0.23
Nodes (10): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), demoHref(), DemoDict, demoPage (+2 more)

### Community 57 - "bumpOffBareMultiple"
Cohesion: 0.33
Nodes (9): addOnMonthly(), annualPrepay, bumpOffBareMultiple(), round100(), runCost(), runCostBreakdown(), serviceLineMonthly(), sharedServiceBase() (+1 more)

### Community 58 - "ModuleScreen.tsx"
Cohesion: 0.15
Nodes (10): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+2 more)

### Community 59 - "observeOnscreen"
Cohesion: 0.33
Nodes (6): DemoMotionState, observeOnscreen(), shouldAnimate(), HospitalidadDemo(), ProduccionDemo(), StringDemo()

### Community 60 - "priced"
Cohesion: 0.22
Nodes (10): featureHours(), featureSetup(), growerBundleHours(), growerSetupS(), priced(), round500(), roundHalfDown(), sumPriced() (+2 more)

### Community 61 - "BridgeMap.tsx"
Cohesion: 0.31
Nodes (7): BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS

### Community 62 - "palette.ts"
Cohesion: 0.22
Nodes (8): BRIGHT_MIX, DemoHue, DemoPalette, FALLBACK, StageEnv, BLACK, RGB, WHITE

## Knowledge Gaps
- **382 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `PageModule` (+377 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `ClinicSchedule.tsx` to `site.ts`, `page.tsx`, `ModuleScreen.tsx`, `page.tsx`, `pageMetadata`, `page.tsx`, `Agent Instructions`, `page.tsx`, `page.tsx`, `page.tsx`, `ModuleFloors.tsx`, `precios.ts`, `localePath`, `page.tsx`, `page.tsx`, `Nav.tsx`, `page.tsx`, `page.tsx`, `ModuleScreen.tsx`, `BridgeMap.tsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `line()` connect `page.tsx` to `canvasKit.ts`, `page.tsx`, `ClinicSchedule.tsx`, `canvasKit.ts`, `bumpOffBareMultiple`, `palette.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `rich()` connect `ClinicSchedule.tsx` to `ModuleScreen.tsx`, `page.tsx`, `Agent Instructions`, `page.tsx`, `precios.ts`, `localePath`, `page.tsx`, `Nav.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _382 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12612612612612611 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05779220779220779 - nodes in this community are weakly interconnected._