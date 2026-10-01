# Graph Report - cardon-digital  (2026-09-28)

## Corpus Check
- 221 files · ~358,481 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1520 nodes · 3632 edges · 77 communities (63 shown, 14 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `838ed583`
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
- case-page.test.ts
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
- DemoScene
- observeOnscreen
- priced
- BridgeMap.tsx
- palette.ts
- World
- page.tsx
- ModuleFloors.tsx
- BridgeMap.tsx
- Page
- metadata.ts
- winery-page.test.ts
- ghosts.ts
- OpenedAtDemo.tsx
- PickStuckDemo.tsx
- ResizeMemoryDemo.tsx
- collapse.mjs
- FlowCompress.test.ts
- check-ads-outcome-claim.sh

## God Nodes (most connected - your core abstractions)
1. `useDict()` - 66 edges
2. `Locale` - 56 edges
3. `localePath()` - 48 edges
4. `rich()` - 39 edges
5. `isLocale()` - 38 edges
6. `DemoScene` - 31 edges
7. `pageMetadata()` - 29 edges
8. `demos` - 28 edges
9. `produccionScene()` - 24 edges
10. `DemoFigure()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `served()` --indirect_call--> `LocaleProvider()`  [INFERRED]
  app/[locale]/ads-claim.test.ts → lib/i18n/LocaleProvider.tsx
- `shell()` --indirect_call--> `LocaleProvider()`  [INFERRED]
  app/[locale]/ads-claim.test.ts → lib/i18n/LocaleProvider.tsx
- `run()` --indirect_call--> `page()`  [INFERRED]
  scripts/copy-check.mjs → components/consent/ConversionListeners.test.tsx
- `OwnClock()` --calls--> `observeOnscreen()`  [EXTRACTED]
  lib/testing/loopholes/demos/CaptionClockDemo.tsx → components/pages/demos/motion.ts
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts

## Import Cycles
- None detected.

## Communities (77 total, 14 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.12
Nodes (27): FakeObserver, here, bands, CAPTION_KEYS, CaptionKey, captionKeyFor(), clampN(), clockLabel() (+19 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "site.ts"
Cohesion: 0.06
Nodes (43): cssSource, decodeEntities(), FRAMES, here, KEYS, pageSource, visibleText(), CENTROIDS (+35 more)

### Community 3 - "page.tsx"
Cohesion: 0.06
Nodes (37): AddOn, addOns, addOnSize(), AdsScopeId, BundleItem, BySize, CatalogueFeature, groupLocale (+29 more)

### Community 4 - "config.ts"
Cohesion: 0.12
Nodes (17): DYNAMIC_HREFS, existingRoutes, Link, links, ROOT, ROUTE_ROOT, sourceFiles, routes (+9 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.15
Nodes (31): bands, board, CAPTION_KEYS, CaptionKey, captionKeyFor(), Channel, clampN(), cycleFrame (+23 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.16
Nodes (17): AnunciosPage(), generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params, PreciosPage() (+9 more)

### Community 7 - "page.tsx"
Cohesion: 0.12
Nodes (19): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), metadata, PricingBundles(), SpotlightFrames() (+11 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (43): autoprefixer, eslint, eslint-config-next, jsdom, lenis, next, next-view-transitions, dependencies (+35 more)

### Community 9 - "pageMetadata"
Cohesion: 0.06
Nodes (52): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+44 more)

### Community 10 - "page.tsx"
Cohesion: 0.07
Nodes (50): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+42 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.11
Nodes (7): askedAtImport, components, Early(), Film(), Opened(), Still(), env()

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
Cohesion: 0.08
Nodes (23): 10. The checks protect a good-faith author (binding), 1. What the two books actually teach, 2. What is wrong with the site today (measured, not asserted), 3. The rules, 4. Home page architecture, 5. Demos and motion, 6. Media, 7. Definition of done for any copy bead (+15 more)

### Community 21 - "middleware.ts"
Cohesion: 0.10
Nodes (37): ConsentBanner(), ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), calls (+29 more)

### Community 27 - "checks.tsx"
Cohesion: 0.11
Nodes (16): BOX, checks, Demo, describeEl(), failing(), flat(), GHOST, HINT_TEXTS (+8 more)

### Community 28 - "page.tsx"
Cohesion: 0.11
Nodes (14): accessibleText(), blocks(), decodeEntities(), Env, html(), pageCode, pageSource, renderedText() (+6 more)

### Community 32 - "page.tsx"
Cohesion: 0.14
Nodes (16): AboutPage(), generateMetadata(), localeOf(), Params, about, AboutDict, en, es (+8 more)

### Community 33 - "page.tsx"
Cohesion: 0.29
Nodes (6): 1. What you write, 2. What you do not write, and what each piece is for, 3. What is checked, and how, 4. What is still yours to get right, Before you call a demo done, The module demos: how one is built

### Community 34 - "VineField.tsx"
Cohesion: 0.08
Nodes (25): absorbedProviderCash(), AddOnId, adsMinimumBudget(), combinations, legacyWineryBundles, legacyWinerySetupFloor(), mixDiscountByRank, modules (+17 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.09
Nodes (29): demoFiles(), MACHINERY, broken(), classPrefix(), literal(), LIVE_ROLES, OPERABLE, SourceRuleContext (+21 more)

### Community 36 - "useDemoStage.ts"
Cohesion: 0.12
Nodes (14): DemoPalette, GEOMETRY, PAL, SpecViolation, strictCtx(), ClockSpec, createClock(), DemoClock (+6 more)

### Community 37 - "case-page.test.ts"
Cohesion: 0.35
Nodes (10): BRIGHT_MIX, FALLBACK, readDemoPalette(), BLACK, hexToRgb(), mix(), readPalette(), RGB (+2 more)

### Community 38 - "page.tsx"
Cohesion: 0.08
Nodes (41): showcaseEnabled(), ACID, ACID_RANGE, ACID_TICKS, BRIX, BRIX_RANGE, BRIX_TICKS, DAY_TICKS (+33 more)

### Community 39 - "canvasKit.ts"
Cohesion: 0.11
Nodes (23): dedupe(), makeTrace(), Palette, Pt, strokeTraceUpTo(), Trace, Box, Dot (+15 more)

### Community 40 - "ModuleFloors.tsx"
Cohesion: 0.07
Nodes (32): amountsIn(), budgetProblem(), DENIED_BEFORE, dictionaryFiles, figure(), FLAT, flatPolicy, here (+24 more)

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
Cohesion: 0.16
Nodes (19): BerryToBottleDesktop(), BerryToBottleMobile(), clamp01(), drawFlow(), easeInOut(), fitCanvas(), pointAtLen(), DigitalArc() (+11 more)

### Community 47 - "page.tsx"
Cohesion: 0.10
Nodes (51): arrivalsOutside(), canvasCount(), changedSince(), classify(), compareVisual(), defaultBranch(), facultyMoved(), filesAt() (+43 more)

### Community 48 - "precios.ts"
Cohesion: 0.25
Nodes (14): MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence(), mixRules() (+6 more)

### Community 49 - "localePath"
Cohesion: 0.14
Nodes (14): AssistantDemo(), BARS, CITED_ROW, Geom, Pt, RGB, Source, SourceKind (+6 more)

### Community 50 - "bumpOffBareMultiple"
Cohesion: 0.22
Nodes (10): bundleHours(), featureHours(), featureOf(), featureSetup(), floorFor(), growerBundleHours(), hours3(), runCostHours() (+2 more)

### Community 51 - "page.tsx"
Cohesion: 0.06
Nodes (38): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+30 more)

### Community 52 - "page.tsx"
Cohesion: 0.14
Nodes (31): bands, brixAt(), CAPTION_KEYS, CaptionKey, captionKeyFor(), CENTRES, chart(), ChartGeom (+23 more)

### Community 53 - "SpotlightFrames.test.ts"
Cohesion: 0.28
Nodes (6): SpotlightFrames(), spotlightVars(), CASE_CSS, GLOBALS, PAGE, ROOT

### Community 54 - "Nav.tsx"
Cohesion: 0.25
Nodes (8): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, CaseFact, CaseFacts(), PlayOnceVis(), PlayOnceVisProps

### Community 55 - "page.tsx"
Cohesion: 0.09
Nodes (26): BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS, Combinations() (+18 more)

### Community 56 - "page.tsx"
Cohesion: 0.18
Nodes (18): generateMetadata(), LocaleLayout(), generateMetadata(), localeOf(), Params, PrivacyPage(), generateMetadata(), localeOf() (+10 more)

### Community 57 - "bumpOffBareMultiple"
Cohesion: 0.19
Nodes (23): addOnAvailable(), addOnMonthly(), addOnOf(), adsScopeOf(), annualPrepay, buildOnly(), bumpOffBareMultiple(), ceilTo() (+15 more)

### Community 58 - "DemoScene"
Cohesion: 0.08
Nodes (42): DemoFigure(), DemoFigureProps, HIDDEN_WITHOUT_SCRIPT, Hotspot(), HotspotProps, PickBox(), PickBoxProps, demos (+34 more)

### Community 59 - "observeOnscreen"
Cohesion: 0.33
Nodes (6): DemoMotionState, observeOnscreen(), shouldAnimate(), HospitalidadDemo(), ProduccionDemo(), StringDemo()

### Community 60 - "priced"
Cohesion: 0.67
Nodes (3): CapturedClockDemo(), cellarScene(), now

### Community 61 - "BridgeMap.tsx"
Cohesion: 0.14
Nodes (13): load(), ambient(), ambientSlot, ask(), declare(), Entry, FakeIO, FakeMQL (+5 more)

### Community 62 - "palette.ts"
Cohesion: 0.21
Nodes (10): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, comingSoon, ComingSoonDict (+2 more)

### Community 63 - "World"
Cohesion: 0.16
Nodes (4): withWorld(), INERT, lastFrame(), World

### Community 64 - "page.tsx"
Cohesion: 0.23
Nodes (8): CASE_ROUTES, generateMetadata(), Home(), localeOf(), Params, SERVICE_ROUTES, PlayOnceVis(), SpotlightFrames()

### Community 65 - "ModuleFloors.tsx"
Cohesion: 0.15
Nodes (10): serve(), basisMarkup(), serve(), render(), render(), render(), locales, LocaleProvider() (+2 more)

### Community 66 - "BridgeMap.tsx"
Cohesion: 0.18
Nodes (8): CHANGE_VISUALS, EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, showPending, VisDict, SpotlightFrames()

### Community 68 - "metadata.ts"
Cohesion: 0.13
Nodes (24): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), { redirect }, AdsFee(), FloorChart() (+16 more)

### Community 69 - "winery-page.test.ts"
Cohesion: 0.48
Nodes (6): captures(), declaredSpans(), pageSource, servedCapBodies(), servedSpans(), strings()

### Community 71 - "OpenedAtDemo.tsx"
Cohesion: 0.67
Nodes (3): cellarScene(), openedAt, OpenedAtDemo()

### Community 72 - "PickStuckDemo.tsx"
Cohesion: 0.27
Nodes (8): generateMetadata(), localeOf(), Params, SitiosPage(), en, es, sitios, SitiosDict

### Community 73 - "ResizeMemoryDemo.tsx"
Cohesion: 0.28
Nodes (9): blocksOf(), decode(), dictionaries(), judged(), offers(), served(), shell(), strings() (+1 more)

### Community 75 - "FlowCompress.test.ts"
Cohesion: 0.33
Nodes (4): en, es, software, SoftwareDict

## Knowledge Gaps
- **443 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `PageModule` (+438 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `page.tsx` to `site.ts`, `page.tsx`, `ClinicSchedule.tsx`, `page.tsx`, `pageMetadata`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `ModuleFloors.tsx`, `precios.ts`, `page.tsx`, `Nav.tsx`, `page.tsx`, `palette.ts`, `page.tsx`, `ModuleFloors.tsx`, `BridgeMap.tsx`, `Page`, `metadata.ts`, `winery-page.test.ts`, `PickStuckDemo.tsx`, `FlowCompress.test.ts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `react` connect `ModuleFloors.tsx` to `devDependencies`, `ResizeMemoryDemo.tsx`, `page.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `dependencies` connect `devDependencies` to `ModuleFloors.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _443 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11587301587301588 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._