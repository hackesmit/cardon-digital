# Graph Report - cardon-digital  (2026-09-24)

## Corpus Check
- 203 files · ~329,698 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1425 nodes · 3271 edges · 75 communities (60 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ea3a2c5`
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

## God Nodes (most connected - your core abstractions)
1. `useDict()` - 58 edges
2. `Locale` - 47 edges
3. `localePath()` - 34 edges
4. `rich()` - 33 edges
5. `isLocale()` - 32 edges
6. `DemoScene` - 31 edges
7. `demos` - 28 edges
8. `produccionScene()` - 24 edges
9. `DemoFigure()` - 24 edges
10. `pageMetadata()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `names()` --references--> `ModuleId`  [EXTRACTED]
  app/[locale]/ads-claim.test.ts → lib/pricing.ts
- `served()` --indirect_call--> `LocaleProvider()`  [INFERRED]
  app/[locale]/ads-claim.test.ts → lib/i18n/LocaleProvider.tsx
- `shell()` --indirect_call--> `LocaleProvider()`  [INFERRED]
  app/[locale]/ads-claim.test.ts → lib/i18n/LocaleProvider.tsx
- `offers()` --indirect_call--> `page()`  [INFERRED]
  app/[locale]/ads-claim.test.ts → components/consent/ConversionListeners.test.tsx
- `serve()` --indirect_call--> `LocaleProvider()`  [INFERRED]
  app/[locale]/industries/winery/winery-page.test.ts → lib/i18n/LocaleProvider.tsx

## Import Cycles
- None detected.

## Communities (75 total, 15 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.13
Nodes (25): FakeObserver, here, bands, CAPTION_KEYS, CaptionKey, captionKeyFor(), clampN(), clockLabel() (+17 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "site.ts"
Cohesion: 0.06
Nodes (44): cssSource, decodeEntities(), FRAMES, here, KEYS, pageSource, visibleText(), page() (+36 more)

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (32): AddOn, BySize, CatalogueFeature, CurrencyCode, groupLocale, growerBundleHours(), growerBundleS, growerCatalogue (+24 more)

### Community 4 - "config.ts"
Cohesion: 0.11
Nodes (21): DYNAMIC_HREFS, existingRoutes, Link, links, ROOT, ROUTE_ROOT, sourceFiles, routes (+13 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.15
Nodes (31): bands, board, CAPTION_KEYS, CaptionKey, captionKeyFor(), Channel, clampN(), cycleFrame (+23 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.17
Nodes (19): generateMetadata(), localeOf(), Params, PreciosPage(), Combinations(), ModuleBlock(), PricingDetails(), Reveal() (+11 more)

### Community 7 - "page.tsx"
Cohesion: 0.16
Nodes (12): shell(), metadata, ContourField(), Footer(), NotFoundBody(), SiteShell(), archivo, htmlLang (+4 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (43): autoprefixer, eslint, eslint-config-next, jsdom, lenis, next, next-view-transitions, dependencies (+35 more)

### Community 9 - "pageMetadata"
Cohesion: 0.06
Nodes (51): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+43 more)

### Community 10 - "page.tsx"
Cohesion: 0.08
Nodes (45): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+37 more)

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
Nodes (36): ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), calls, MeasurementScripts() (+28 more)

### Community 27 - "checks.tsx"
Cohesion: 0.11
Nodes (16): BOX, checks, Demo, describeEl(), failing(), flat(), GHOST, HINT_TEXTS (+8 more)

### Community 28 - "page.tsx"
Cohesion: 0.06
Nodes (30): serve(), accessibleText(), basisMarkup(), blocks(), decodeEntities(), Env, html(), pageCode (+22 more)

### Community 32 - "page.tsx"
Cohesion: 0.27
Nodes (8): AboutPage(), generateMetadata(), localeOf(), Params, about, AboutDict, en, es

### Community 33 - "page.tsx"
Cohesion: 0.29
Nodes (6): 1. What you write, 2. What you do not write, and what each piece is for, 3. What is checked, and how, 4. What is still yours to get right, Before you call a demo done, The module demos: how one is built

### Community 34 - "VineField.tsx"
Cohesion: 0.08
Nodes (24): absorbedProviderCash(), AddOnId, combinations, featureHours(), featureSetup(), legacyWineryBundles, legacyWinerySetupFloor(), mixDiscountByRank (+16 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.09
Nodes (29): demoFiles(), MACHINERY, broken(), classPrefix(), literal(), LIVE_ROLES, OPERABLE, SourceRuleContext (+21 more)

### Community 36 - "useDemoStage.ts"
Cohesion: 0.17
Nodes (7): ClockSpec, createClock(), DemoClock, isPhonePlan(), LiveText, StageRefs, useDemoStage()

### Community 37 - "case-page.test.ts"
Cohesion: 0.19
Nodes (11): BRIGHT_MIX, DemoHue, DemoPalette, FALLBACK, readDemoPalette(), StageEnv, BLACK, mix() (+3 more)

### Community 38 - "page.tsx"
Cohesion: 0.09
Nodes (40): ACID, ACID_RANGE, ACID_TICKS, BRIX, BRIX_RANGE, BRIX_TICKS, DAY_TICKS, dayAt() (+32 more)

### Community 39 - "canvasKit.ts"
Cohesion: 0.13
Nodes (26): clamp01(), dedupe(), drawFlow(), easeInOut(), fitCanvas(), hexToRgb(), line(), makeTrace() (+18 more)

### Community 40 - "ModuleFloors.tsx"
Cohesion: 0.06
Nodes (34): ADS_ID, allModuleIds, attachesTo, blocksOf(), BUILD, buildAtEverySize, decode(), dictionaries() (+26 more)

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
Cohesion: 0.12
Nodes (19): ConsentBanner(), BerryToBottleDesktop(), BerryToBottleMobile(), MediaPending(), useDict(), cellarScene(), DomReadDemo(), cellarScene() (+11 more)

### Community 47 - "page.tsx"
Cohesion: 0.10
Nodes (51): arrivalsOutside(), canvasCount(), changedSince(), classify(), compareVisual(), defaultBranch(), facultyMoved(), filesAt() (+43 more)

### Community 48 - "precios.ts"
Cohesion: 0.28
Nodes (14): MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence(), mixRules() (+6 more)

### Community 49 - "localePath"
Cohesion: 0.13
Nodes (18): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), PricingBundles(), SpotlightFrames(), Geom (+10 more)

### Community 50 - "bumpOffBareMultiple"
Cohesion: 0.21
Nodes (15): addOnAvailable(), addOnOf(), addOnSize(), buildOnly(), bundleHours(), ceilTo(), featureOf(), floorFor() (+7 more)

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
Cohesion: 0.36
Nodes (6): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, PlayOnceVis(), PlayOnceVisProps

### Community 55 - "page.tsx"
Cohesion: 0.15
Nodes (10): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+2 more)

### Community 56 - "page.tsx"
Cohesion: 0.11
Nodes (22): generateMetadata(), LocaleLayout(), generateMetadata(), localeOf(), Params, PrivacyPage(), generateMetadata(), localeOf() (+14 more)

### Community 57 - "bumpOffBareMultiple"
Cohesion: 0.33
Nodes (9): addOnMonthly(), annualPrepay, bumpOffBareMultiple(), round100(), runCost(), runCostBreakdown(), serviceLineMonthly(), sharedServiceBase() (+1 more)

### Community 58 - "DemoScene"
Cohesion: 0.12
Nodes (18): DemoFigure(), DemoFigureProps, HIDDEN_WITHOUT_SCRIPT, Hotspot(), HotspotProps, PickBox(), PickBoxProps, DemoScene (+10 more)

### Community 59 - "observeOnscreen"
Cohesion: 0.27
Nodes (8): DemoMotionState, observeOnscreen(), shouldAnimate(), clearsThreshold(), OnscreenEntry, HospitalidadDemo(), ProduccionDemo(), StringDemo()

### Community 60 - "priced"
Cohesion: 0.17
Nodes (12): AssistantDemo(), BARS, CITED_ROW, demos, en, es, CaptionClockDemo(), captionScene() (+4 more)

### Community 61 - "BridgeMap.tsx"
Cohesion: 0.14
Nodes (13): load(), ambient(), ambientSlot, ask(), declare(), Entry, FakeIO, FakeMQL (+5 more)

### Community 62 - "palette.ts"
Cohesion: 0.21
Nodes (10): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, comingSoon, ComingSoonDict (+2 more)

### Community 63 - "World"
Cohesion: 0.17
Nodes (4): withWorld(), INERT, lastFrame(), World

### Community 64 - "page.tsx"
Cohesion: 0.23
Nodes (9): CASE_ROUTES, generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames() (+1 more)

### Community 65 - "ModuleFloors.tsx"
Cohesion: 0.29
Nodes (10): FloorChart(), bundleLines(), ModuleFloors(), BundleItem, currencyByLocale, formatAmount(), formatPrice(), moduleFloors (+2 more)

### Community 66 - "BridgeMap.tsx"
Cohesion: 0.31
Nodes (7): BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS

### Community 68 - "metadata.ts"
Cohesion: 0.21
Nodes (13): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), { redirect }, Showcase(), demoHref() (+5 more)

### Community 69 - "winery-page.test.ts"
Cohesion: 0.48
Nodes (6): captures(), declaredSpans(), pageSource, servedCapBodies(), servedSpans(), strings()

### Community 71 - "OpenedAtDemo.tsx"
Cohesion: 0.67
Nodes (3): cellarScene(), openedAt, OpenedAtDemo()

## Knowledge Gaps
- **418 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `PageModule` (+413 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `ClinicSchedule.tsx` to `site.ts`, `page.tsx`, `config.ts`, `page.tsx`, `pageMetadata`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `ModuleFloors.tsx`, `precios.ts`, `localePath`, `page.tsx`, `Nav.tsx`, `page.tsx`, `page.tsx`, `palette.ts`, `page.tsx`, `ModuleFloors.tsx`, `BridgeMap.tsx`, `Page`, `metadata.ts`, `winery-page.test.ts`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `react` connect `page.tsx` to `ModuleFloors.tsx`, `devDependencies`, `page.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `dependencies` connect `devDependencies` to `page.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _418 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1265597147950089 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05576441102756892 - nodes in this community are weakly interconnected._