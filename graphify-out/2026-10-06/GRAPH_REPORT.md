# Graph Report - cardon-digital  (2026-10-06)

## Corpus Check
- 230 files · ~462,851 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1630 nodes · 3810 edges · 95 communities (80 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6fe21b3b`
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
- VineyardMap.tsx
- LocaleProvider
- fonts.ts
- Page
- fieldKit.test.ts
- useLocale
- .frame
- DemoClock
- enkanto.ts
- budgetProblem
- LocaleProvider.tsx
- shell
- FlowCompress.test.ts
- winery-page.test.ts
- CapturedClockDemo.tsx
- OpenedAtDemo.tsx
- FeatureDetectDemo.tsx
- TapRestartDemo.tsx

## God Nodes (most connected - your core abstractions)
1. `useDict()` - 66 edges
2. `Locale` - 57 edges
3. `localePath()` - 50 edges
4. `rich()` - 41 edges
5. `isLocale()` - 40 edges
6. `DemoScene` - 31 edges
7. `pageMetadata()` - 31 edges
8. `demos` - 28 edges
9. `produccionScene()` - 24 edges
10. `DemoFigure()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `served()` --indirect_call--> `LocaleProvider()`  [INFERRED]
  app/[locale]/ads-claim.test.ts → lib/i18n/LocaleProvider.tsx
- `shell()` --indirect_call--> `LocaleProvider()`  [INFERRED]
  app/[locale]/ads-claim.test.ts → lib/i18n/LocaleProvider.tsx
- `offers()` --indirect_call--> `page()`  [INFERRED]
  app/[locale]/ads-claim.test.ts → components/consent/ConversionListeners.test.tsx
- `OwnClock()` --calls--> `observeOnscreen()`  [EXTRACTED]
  lib/testing/loopholes/demos/CaptionClockDemo.tsx → components/pages/demos/motion.ts
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts

## Import Cycles
- None detected.

## Communities (95 total, 15 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.13
Nodes (23): FakeObserver, here, bands, CAPTION_KEYS, CaptionKey, captionKeyFor(), clampN(), clockLabel() (+15 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "site.ts"
Cohesion: 0.20
Nodes (7): CONTRAST_ALLOWLIST, main(), CONTRAST_FIXTURES, HONEST_SPANISH, LIMITS, ROOT, run()

### Community 3 - "page.tsx"
Cohesion: 0.06
Nodes (35): AddOn, addOns, AdsScopeId, BundleItem, BySize, CatalogueFeature, groupLocale, growerBundleS (+27 more)

### Community 4 - "config.ts"
Cohesion: 0.13
Nodes (14): DYNAMIC_HREFS, existingRoutes, Link, links, ROOT, ROUTE_ROOT, sourceFiles, localeFromCountry() (+6 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.15
Nodes (31): bands, board, CAPTION_KEYS, CaptionKey, captionKeyFor(), Channel, clampN(), cycleFrame (+23 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.07
Nodes (12): Field, FieldColors, FieldKind, FieldState, grad3, makeField(), MAKERS, perm (+4 more)

### Community 7 - "page.tsx"
Cohesion: 0.19
Nodes (11): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), { redirect }, allModules, DemoDict (+3 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (43): autoprefixer, eslint, eslint-config-next, jsdom, lenis, next, next-view-transitions, dependencies (+35 more)

### Community 9 - "pageMetadata"
Cohesion: 0.06
Nodes (52): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+44 more)

### Community 10 - "page.tsx"
Cohesion: 0.06
Nodes (43): ContactDoors(), ContactForm(), EMPTY, Status, GtagCall, Page, Values, ContactMail() (+35 more)

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
Nodes (24): 10. The checks protect a good-faith author (binding), 11. Spanish is written, never translated (binding), 1. What the two books actually teach, 2. What is wrong with the site today (measured, not asserted), 3. The rules, 4. Home page architecture, 5. Demos and motion, 6. Media (+16 more)

### Community 21 - "middleware.ts"
Cohesion: 0.08
Nodes (41): ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), calls, MeasurementScripts() (+33 more)

### Community 27 - "checks.tsx"
Cohesion: 0.12
Nodes (15): BOX, checks, Demo, describeEl(), failing(), flat(), GHOST, HINT_TEXTS (+7 more)

### Community 28 - "page.tsx"
Cohesion: 0.15
Nodes (10): accessibleText(), blocks(), decodeEntities(), Env, html(), pageCode, pageSource, renderedText() (+2 more)

### Community 32 - "page.tsx"
Cohesion: 0.27
Nodes (8): AboutPage(), generateMetadata(), localeOf(), Params, about, AboutDict, en, es

### Community 33 - "page.tsx"
Cohesion: 0.29
Nodes (6): 1. What you write, 2. What you do not write, and what each piece is for, 3. What is checked, and how, 4. What is still yours to get right, Before you call a demo done, The module demos: how one is built

### Community 34 - "VineField.tsx"
Cohesion: 0.08
Nodes (24): absorbedProviderCash(), AddOnId, adsMinimumBudget(), combinations, legacyWineryBundles, legacyWinerySetupFloor(), modules, ModuleSelection (+16 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.13
Nodes (13): demoFiles(), MACHINERY, broken(), classPrefix(), literal(), LIVE_ROLES, OPERABLE, SourceRuleContext (+5 more)

### Community 36 - "useDemoStage.ts"
Cohesion: 0.12
Nodes (14): BRIGHT_MIX, DemoHue, DemoPalette, FALLBACK, readDemoPalette(), ClockSpec, createClock(), DemoClock (+6 more)

### Community 37 - "case-page.test.ts"
Cohesion: 0.42
Nodes (8): fitCanvas(), hexToRgb(), line(), mix(), readPalette(), resolveColor(), Field(), FieldPalette

### Community 38 - "page.tsx"
Cohesion: 0.14
Nodes (26): showcaseEnabled(), ACID, ACID_RANGE, ACID_TICKS, BRIX, BRIX_RANGE, BRIX_TICKS, DAY_TICKS (+18 more)

### Community 39 - "canvasKit.ts"
Cohesion: 0.22
Nodes (10): drawFlow(), pointAtLen(), strokeTraceUpTo(), Trace, Chip, EMPTY, Box, Chip (+2 more)

### Community 40 - "ModuleFloors.tsx"
Cohesion: 0.07
Nodes (22): DENIED_BEFORE, dictionaryFiles, FLAT, flatPolicy, here, I18N_MACHINERY, i18nDir, MINIMUM_BUDGET (+14 more)

### Community 42 - "localePath"
Cohesion: 0.25
Nodes (7): Export and drop in, How a slot works, Media: the shot list, Ratios, and the size to shoot to, Shooting notes, The slots, Video

### Community 43 - "Media credits"
Cohesion: 0.18
Nodes (10): about/cellar.webp, Cardon Digital photography, shot at Monte Xanic (2026-09-29), enkanto/cabana.webp, Icons, Media credits, Our own material, Placeholder stock, precios/handover.webp (+2 more)

### Community 44 - "Media clearances"
Cohesion: 0.33
Nodes (5): Entries, Media clearances, Monte Xanic cellar and lab frames, 2026-09-29 and 2026-09-30, The entry, Two clearances, both required

### Community 46 - "useDict"
Cohesion: 0.08
Nodes (28): decodeEscapes(), ACCEPTED, cardW, contrast(), ctaInk, darkBlock, darkPrimaryTextW, dE() (+20 more)

### Community 47 - "page.tsx"
Cohesion: 0.10
Nodes (51): arrivalsOutside(), canvasCount(), changedSince(), classify(), compareVisual(), defaultBranch(), facultyMoved(), filesAt() (+43 more)

### Community 48 - "precios.ts"
Cohesion: 0.24
Nodes (15): MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence(), mixRules() (+7 more)

### Community 49 - "localePath"
Cohesion: 0.25
Nodes (7): Geom, Pt, RGB, Source, SourceKind, Trace, VineField()

### Community 50 - "bumpOffBareMultiple"
Cohesion: 0.25
Nodes (9): bundleHours(), featureHours(), featureOf(), floorFor(), growerBundleHours(), hours3(), runCostHours(), sharedBuildHours() (+1 more)

### Community 51 - "page.tsx"
Cohesion: 0.06
Nodes (38): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+30 more)

### Community 52 - "page.tsx"
Cohesion: 0.12
Nodes (35): bands, brixAt(), CAPTION_KEYS, CaptionKey, captionKeyFor(), CENTRES, chart(), ChartGeom (+27 more)

### Community 53 - "SpotlightFrames.test.ts"
Cohesion: 0.28
Nodes (6): SpotlightFrames(), spotlightVars(), CASE_CSS, GLOBALS, PAGE, ROOT

### Community 54 - "Nav.tsx"
Cohesion: 0.19
Nodes (17): page(), ADVISORY_SHAPES, checkSource(), countClusters(), countEmphasis(), countWords(), describe(), excerpt() (+9 more)

### Community 55 - "page.tsx"
Cohesion: 0.18
Nodes (17): Params, Combinations(), Reveal(), RevealProps, Locale, CombinaItem, en, es (+9 more)

### Community 56 - "page.tsx"
Cohesion: 0.11
Nodes (27): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, generateMetadata(), LocaleLayout(), generateMetadata() (+19 more)

### Community 57 - "bumpOffBareMultiple"
Cohesion: 0.14
Nodes (28): baseOf(), WebPackages(), addOnAvailable(), addOnMonthly(), addOnOf(), addOnSize(), adsScopeOf(), annualPrepay (+20 more)

### Community 58 - "DemoScene"
Cohesion: 0.12
Nodes (20): demos, DemosDict, en, es, cellarScene(), KeyTapDemo(), cellarScene(), KeyThemeDemo() (+12 more)

### Community 59 - "observeOnscreen"
Cohesion: 0.18
Nodes (12): COVER, EstilosPage(), generateMetadata(), Key, KEYS, localeOf(), PALETTE, Params (+4 more)

### Community 60 - "priced"
Cohesion: 0.21
Nodes (8): generateMetadata(), localeOf(), Params, SitiosPage(), en, es, sitios, SitiosDict

### Community 61 - "BridgeMap.tsx"
Cohesion: 0.14
Nodes (13): load(), ambient(), ambientSlot, ask(), declare(), Entry, FakeIO, FakeMQL (+5 more)

### Community 62 - "palette.ts"
Cohesion: 0.17
Nodes (13): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, Nav(), comingSoon (+5 more)

### Community 63 - "World"
Cohesion: 0.16
Nodes (4): withWorld(), INERT, lastFrame(), World

### Community 64 - "page.tsx"
Cohesion: 0.20
Nodes (16): escapesIn(), NOT_JUDGED, ObserverSite, observerSites(), read(), READS_ISINTERSECTING, root, sitesIn() (+8 more)

### Community 65 - "ModuleFloors.tsx"
Cohesion: 0.18
Nodes (11): makeTrace(), Doc, HeroAssembly(), Pose, Pulse, Row, en, es (+3 more)

### Community 66 - "BridgeMap.tsx"
Cohesion: 0.11
Nodes (19): generateMetadata(), localeOf(), Params, SoftwarePage(), CHANGE_VISUALS, EnkantoCaseStudy(), generateMetadata(), localeOf() (+11 more)

### Community 67 - "Page"
Cohesion: 0.14
Nodes (16): BOX, DAYS, oneDecimal(), px(), py(), SERIES, VIEW, VintageCompare() (+8 more)

### Community 68 - "metadata.ts"
Cohesion: 0.10
Nodes (25): AnunciosPage(), generateMetadata(), localeOf(), Params, CASE_ROUTES, CLIENTS, generateMetadata(), Home() (+17 more)

### Community 69 - "winery-page.test.ts"
Cohesion: 0.40
Nodes (5): observeOnscreen(), shouldAnimate(), HospitalidadDemo(), ProduccionDemo(), StringDemo()

### Community 71 - "OpenedAtDemo.tsx"
Cohesion: 0.18
Nodes (9): cssSource, decodeEntities(), FRAMES, here, KEYS, pageSource, visibleText(), BLOCKING_SHAPES (+1 more)

### Community 72 - "PickStuckDemo.tsx"
Cohesion: 0.18
Nodes (9): DemoFigure(), DemoFigureProps, HIDDEN_WITHOUT_SCRIPT, HotspotProps, DemoScene, LiveText, useDemoStage(), cellarScene() (+1 more)

### Community 73 - "ResizeMemoryDemo.tsx"
Cohesion: 0.15
Nodes (10): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+2 more)

### Community 75 - "FlowCompress.test.ts"
Cohesion: 0.17
Nodes (12): Hotspot(), PickBox(), PickBoxProps, CaptionClockDemo(), captionScene(), OwnClock(), cellarScene(), DomReadDemo() (+4 more)

### Community 77 - "VineyardMap.tsx"
Cohesion: 0.14
Nodes (14): BerryToBottleDesktop(), BerryToBottleMobile(), CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS, RGB (+6 more)

### Community 78 - "LocaleProvider"
Cohesion: 0.19
Nodes (8): serve(), basisMarkup(), serve(), render(), render(), LocaleProvider(), react, react

### Community 79 - "fonts.ts"
Cohesion: 0.20
Nodes (8): hotelDisplay, sceneFontVariables, spaDisplay, spaText, techDisplay, techMono, vinDisplay, vinText

### Community 80 - "Page"
Cohesion: 0.22
Nodes (11): RestauranteDemo(), restauranteScene(), clamp01(), easeInOut(), Pt, rr(), Box, DigitalArc() (+3 more)

### Community 81 - "fieldKit.test.ts"
Cohesion: 0.25
Nodes (8): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, CaseFact, CaseFacts(), PlayOnceVis(), PlayOnceVisProps

### Community 82 - "useLocale"
Cohesion: 0.10
Nodes (23): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), metadata, routes, sitemap() (+15 more)

### Community 83 - ".frame"
Cohesion: 0.31
Nodes (7): BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS

### Community 84 - "DemoClock"
Cohesion: 0.23
Nodes (10): DemoMotionState, FlowCompress(), ReachMap(), SiteRise(), AssistantDemo(), BARS, CITED_ROW, useDict() (+2 more)

### Community 85 - "enkanto.ts"
Cohesion: 0.40
Nodes (4): en, enkanto, EnkantoDict, es

### Community 86 - "budgetProblem"
Cohesion: 0.27
Nodes (10): amountsIn(), budgetProblem(), figure(), judge(), offerIn(), scope(), sentencesOf(), shareOfSpendClaims() (+2 more)

### Community 87 - "LocaleProvider.tsx"
Cohesion: 0.24
Nodes (7): ConsentBanner(), dedupe(), Palette, Core, SectorMap(), LocaleContext, useLocale()

### Community 88 - "shell"
Cohesion: 0.32
Nodes (8): blocksOf(), decode(), dictionaries(), judged(), offers(), served(), shell(), strings()

### Community 89 - "FlowCompress.test.ts"
Cohesion: 0.29
Nodes (5): render(), en, es, software, SoftwareDict

### Community 90 - "winery-page.test.ts"
Cohesion: 0.48
Nodes (6): captures(), declaredSpans(), pageSource, servedCapBodies(), servedSpans(), strings()

### Community 91 - "CapturedClockDemo.tsx"
Cohesion: 0.67
Nodes (3): CapturedClockDemo(), cellarScene(), now

### Community 92 - "OpenedAtDemo.tsx"
Cohesion: 0.67
Nodes (3): cellarScene(), openedAt, OpenedAtDemo()

## Knowledge Gaps
- **490 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `PageModule` (+485 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `page.tsx` to `page.tsx`, `page.tsx`, `pageMetadata`, `page.tsx`, `middleware.ts`, `page.tsx`, `page.tsx`, `page.tsx`, `ModuleFloors.tsx`, `precios.ts`, `page.tsx`, `page.tsx`, `observeOnscreen`, `priced`, `palette.ts`, `BridgeMap.tsx`, `Page`, `metadata.ts`, `OpenedAtDemo.tsx`, `ResizeMemoryDemo.tsx`, `LocaleProvider`, `fieldKit.test.ts`, `useLocale`, `.frame`, `LocaleProvider.tsx`, `FlowCompress.test.ts`, `winery-page.test.ts`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `line()` connect `case-page.test.ts` to `canvasKit.ts`, `ModuleFloors.tsx`, `BridgeMap.tsx`, `useDemoStage.ts`, `ModuleScreen.tsx`, `page.tsx`, `page.tsx`, `Page`, `page.tsx`, `bumpOffBareMultiple`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `react` connect `LocaleProvider` to `shell`, `FlowCompress.test.ts`, `page.tsx`, `devDependencies`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _490 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1310483870967742 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.059743954480796585 - nodes in this community are weakly interconnected._