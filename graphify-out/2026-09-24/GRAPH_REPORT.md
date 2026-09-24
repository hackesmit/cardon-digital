# Graph Report - cardon-digital  (2026-09-24)

## Corpus Check
- 177 files · ~228,709 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1252 nodes · 2783 edges · 61 communities (51 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `99e3de06`
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
- BridgeMap.tsx
- palette.ts

## God Nodes (most connected - your core abstractions)
1. `Locale` - 44 edges
2. `rich()` - 33 edges
3. `isLocale()` - 32 edges
4. `localePath()` - 32 edges
5. `useDict()` - 28 edges
6. `pageMetadata()` - 23 edges
7. `SectionSeason()` - 21 edges
8. `quote` - 20 edges
9. `hospitalidadScene()` - 18 edges
10. `site` - 18 edges

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

## Communities (61 total, 10 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.14
Nodes (25): FakeObserver, here, bands, CAPTION_KEYS, CaptionKey, captionKeyFor(), clampN(), clockLabel() (+17 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "site.ts"
Cohesion: 0.11
Nodes (25): ADVISORY_SHAPES, BLOCKING_SHAPES, checkSource(), CONTRAST_ALLOWLIST, countClusters(), countEmphasis(), countWords(), describe() (+17 more)

### Community 3 - "page.tsx"
Cohesion: 0.08
Nodes (30): AddOn, BySize, CatalogueFeature, CurrencyCode, featureHours(), featureSetup(), groupLocale, growerBundleS (+22 more)

### Community 4 - "config.ts"
Cohesion: 0.11
Nodes (25): generateMetadata(), LocaleLayout(), DYNAMIC_HREFS, existingRoutes, Link, links, ROOT, ROUTE_ROOT (+17 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.14
Nodes (32): bands, board, CAPTION_KEYS, CaptionKey, captionKeyFor(), Channel, clampN(), cycleFrame (+24 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.11
Nodes (25): AboutPage(), generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params, PreciosPage() (+17 more)

### Community 7 - "page.tsx"
Cohesion: 0.16
Nodes (11): metadata, ContourField(), Footer(), NotFoundBody(), SiteShell(), archivo, htmlLang, en (+3 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (43): autoprefixer, eslint, eslint-config-next, jsdom, lenis, next, next-view-transitions, dependencies (+35 more)

### Community 9 - "pageMetadata"
Cohesion: 0.06
Nodes (51): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+43 more)

### Community 10 - "page.tsx"
Cohesion: 0.06
Nodes (54): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+46 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.24
Nodes (12): names(), FloorChart(), bundleLines(), ModuleFloors(), precios, BundleItem, currencyByLocale, formatAmount() (+4 more)

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
Cohesion: 0.25
Nodes (7): Geom, Pt, RGB, Source, SourceKind, Trace, VineField()

### Community 32 - "page.tsx"
Cohesion: 0.13
Nodes (17): generateMetadata(), localeOf(), Params, PrivacyPage(), generateMetadata(), localeOf(), Params, TermsPage() (+9 more)

### Community 33 - "page.tsx"
Cohesion: 0.29
Nodes (6): 1. What you write, 2. What you do not write, and what each piece is for, 3. What is checked, and how, 4. What is still yours to get right, Before you call a demo done, The module demos: how one is built

### Community 34 - "VineField.tsx"
Cohesion: 0.09
Nodes (21): absorbedProviderCash(), AddOnId, combinations, legacyWineryBundles, legacyWinerySetupFloor(), ModuleSelection, scopeFactor, sizes (+13 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.09
Nodes (27): broken(), classPrefix(), literal(), LIVE_ROLES, OPERABLE, SourceRuleContext, sourceRules, components (+19 more)

### Community 36 - "useDemoStage.ts"
Cohesion: 0.14
Nodes (10): ClockSpec, createClock(), DemoClock, isPhonePlan(), DemoScene, LiveText, StageRefs, useDemoStage() (+2 more)

### Community 38 - "page.tsx"
Cohesion: 0.09
Nodes (40): ACID, ACID_RANGE, ACID_TICKS, BRIX, BRIX_RANGE, BRIX_TICKS, DAY_TICKS, dayAt() (+32 more)

### Community 39 - "canvasKit.ts"
Cohesion: 0.14
Nodes (24): readDemoPalette(), dedupe(), drawFlow(), hexToRgb(), makeTrace(), mix(), Palette, pointAtLen() (+16 more)

### Community 40 - "ModuleFloors.tsx"
Cohesion: 0.06
Nodes (44): ADS_ID, allModuleIds, attachesTo, blocksOf(), BUILD, buildAtEverySize, decode(), dictionaries() (+36 more)

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
Cohesion: 0.09
Nodes (24): BerryToBottleDesktop(), BerryToBottleMobile(), DemoFigure(), DemoFigureProps, HIDDEN_WITHOUT_SCRIPT, Hotspot(), HotspotProps, PickBox() (+16 more)

### Community 47 - "page.tsx"
Cohesion: 0.10
Nodes (52): line(), arrivalsOutside(), canvasCount(), changedSince(), classify(), compareVisual(), defaultBranch(), facultyMoved() (+44 more)

### Community 48 - "precios.ts"
Cohesion: 0.25
Nodes (15): MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence(), mixRules() (+7 more)

### Community 49 - "localePath"
Cohesion: 0.18
Nodes (12): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), PricingBundles(), SpotlightFrames(), Dict (+4 more)

### Community 50 - "bumpOffBareMultiple"
Cohesion: 0.18
Nodes (17): addOnAvailable(), addOnOf(), addOnSize(), buildOnly(), bundleHours(), featureOf(), floorFor(), growerBundleHours() (+9 more)

### Community 51 - "page.tsx"
Cohesion: 0.09
Nodes (33): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+25 more)

### Community 52 - "page.tsx"
Cohesion: 0.07
Nodes (26): accessibleText(), basisMarkup(), blocks(), decodeEntities(), Env, html(), pageCode, pageSource (+18 more)

### Community 53 - "SpotlightFrames.test.ts"
Cohesion: 0.28
Nodes (6): SpotlightFrames(), spotlightVars(), CASE_CSS, GLOBALS, PAGE, ROOT

### Community 54 - "Nav.tsx"
Cohesion: 0.23
Nodes (9): CASE_ROUTES, generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames() (+1 more)

### Community 55 - "page.tsx"
Cohesion: 0.21
Nodes (10): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, comingSoon, ComingSoonDict (+2 more)

### Community 56 - "page.tsx"
Cohesion: 0.22
Nodes (13): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), { redirect }, Showcase(), demoHref() (+5 more)

### Community 57 - "bumpOffBareMultiple"
Cohesion: 0.29
Nodes (10): addOnMonthly(), annualPrepay, bumpOffBareMultiple(), ceilTo(), round100(), runCost(), runCostBreakdown(), serviceLineMonthly() (+2 more)

### Community 58 - "ModuleScreen.tsx"
Cohesion: 0.15
Nodes (10): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+2 more)

### Community 59 - "observeOnscreen"
Cohesion: 0.26
Nodes (8): DemoMotionState, observeOnscreen(), shouldAnimate(), clearsThreshold(), OnscreenEntry, HospitalidadDemo(), ProduccionDemo(), StringDemo()

### Community 61 - "BridgeMap.tsx"
Cohesion: 0.17
Nodes (15): BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS, Combinations() (+7 more)

### Community 62 - "palette.ts"
Cohesion: 0.22
Nodes (8): BRIGHT_MIX, DemoHue, DemoPalette, FALLBACK, StageEnv, BLACK, RGB, WHITE

## Knowledge Gaps
- **389 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `PageModule` (+384 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `BridgeMap.tsx` to `page.tsx`, `page.tsx`, `config.ts`, `ClinicSchedule.tsx`, `page.tsx`, `ModuleFloors.tsx`, `page.tsx`, `page.tsx`, `Agent Instructions`, `pageMetadata`, `precios.ts`, `localePath`, `page.tsx`, `page.tsx`, `Nav.tsx`, `page.tsx`, `page.tsx`, `ModuleScreen.tsx`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `line()` connect `page.tsx` to `canvasKit.ts`, `ModuleScreen.tsx`, `page.tsx`, `canvasKit.ts`, `ClinicSchedule.tsx`, `bumpOffBareMultiple`, `palette.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `rich()` connect `ClinicSchedule.tsx` to `page.tsx`, `Agent Instructions`, `page.tsx`, `precios.ts`, `localePath`, `page.tsx`, `Nav.tsx`, `page.tsx`, `BridgeMap.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _389 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14193548387096774 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11290322580645161 - nodes in this community are weakly interconnected._