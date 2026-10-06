# Graph Report - cardon-digital  (2026-10-06)

## Corpus Check
- 231 files · ~464,021 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1638 nodes · 3825 edges · 89 communities (72 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `80300b09`
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
- shell
- FlowCompress.test.ts
- winery-page.test.ts

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

## Communities (89 total, 17 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.13
Nodes (23): FakeObserver, here, bands, CAPTION_KEYS, CaptionKey, captionKeyFor(), clampN(), clockLabel() (+15 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "site.ts"
Cohesion: 0.16
Nodes (10): page(), describe(), main(), run(), CONTRAST_FIXTURES, HONEST_SPANISH, LIMITS, ROOT (+2 more)

### Community 3 - "page.tsx"
Cohesion: 0.06
Nodes (31): AddOn, addOns, AdsScopeId, BundleItem, BySize, CatalogueFeature, groupLocale, growerBundleS (+23 more)

### Community 4 - "config.ts"
Cohesion: 0.07
Nodes (30): ComingSoonPage(), generateMetadata(), localeOf(), Params, DYNAMIC_HREFS, existingRoutes, Link, links (+22 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.15
Nodes (31): bands, board, CAPTION_KEYS, CaptionKey, captionKeyFor(), Channel, clampN(), cycleFrame (+23 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.07
Nodes (12): Field, FieldColors, FieldKind, FieldState, grad3, makeField(), MAKERS, perm (+4 more)

### Community 7 - "page.tsx"
Cohesion: 0.20
Nodes (16): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), { redirect }, FloorChart(), bundleLines() (+8 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (43): autoprefixer, eslint, eslint-config-next, jsdom, lenis, next, next-view-transitions, dependencies (+35 more)

### Community 9 - "pageMetadata"
Cohesion: 0.06
Nodes (51): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+43 more)

### Community 10 - "page.tsx"
Cohesion: 0.25
Nodes (16): ContactDoors(), ContactMail(), Attribution, clean(), readAttribution(), readCookie(), readStored(), shortLeadId() (+8 more)

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
Cohesion: 0.10
Nodes (37): ConsentBanner(), ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), calls (+29 more)

### Community 27 - "checks.tsx"
Cohesion: 0.14
Nodes (12): BOX, checks, Demo, describeEl(), failing(), flat(), GHOST, HINT_TEXTS (+4 more)

### Community 28 - "page.tsx"
Cohesion: 0.11
Nodes (14): accessibleText(), blocks(), decodeEntities(), Env, html(), pageCode, pageSource, renderedText() (+6 more)

### Community 32 - "page.tsx"
Cohesion: 0.11
Nodes (19): ContactForm(), EMPTY, Status, GtagCall, Values, attributionField(), ContactAttribution, ContactField (+11 more)

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
Cohesion: 0.13
Nodes (16): DemoMotionState, observeOnscreen(), shouldAnimate(), readDemoPalette(), ClockSpec, createClock(), DemoClock, isPhonePlan() (+8 more)

### Community 37 - "case-page.test.ts"
Cohesion: 0.12
Nodes (17): EMPTY_ATTRIBUTION, CLICK_DOORS, ClickDoors, Doors, DoorVariant, readClickDoors(), readDoors(), whatsappNumber() (+9 more)

### Community 38 - "page.tsx"
Cohesion: 0.08
Nodes (41): showcaseEnabled(), ACID, ACID_RANGE, ACID_TICKS, BRIX, BRIX_RANGE, BRIX_TICKS, DAY_TICKS (+33 more)

### Community 39 - "canvasKit.ts"
Cohesion: 0.09
Nodes (46): BRIGHT_MIX, FALLBACK, BLACK, clamp01(), drawFlow(), easeInOut(), hexToRgb(), line() (+38 more)

### Community 40 - "ModuleFloors.tsx"
Cohesion: 0.07
Nodes (31): amountsIn(), budgetProblem(), DENIED_BEFORE, dictionaryFiles, figure(), FLAT, flatPolicy, here (+23 more)

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
Cohesion: 0.26
Nodes (14): MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence(), mixRules() (+6 more)

### Community 49 - "localePath"
Cohesion: 0.14
Nodes (14): AssistantDemo(), BARS, CITED_ROW, Geom, Pt, RGB, Source, SourceKind (+6 more)

### Community 50 - "bumpOffBareMultiple"
Cohesion: 0.23
Nodes (13): addOnAvailable(), addOnOf(), addOnSize(), buildOnly(), bundleHours(), featureHours(), featureOf(), hours3() (+5 more)

### Community 51 - "page.tsx"
Cohesion: 0.15
Nodes (19): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+11 more)

### Community 52 - "page.tsx"
Cohesion: 0.11
Nodes (37): bands, brixAt(), CAPTION_KEYS, CaptionKey, captionKeyFor(), CENTRES, chart(), ChartGeom (+29 more)

### Community 53 - "SpotlightFrames.test.ts"
Cohesion: 0.28
Nodes (6): SpotlightFrames(), spotlightVars(), CASE_CSS, GLOBALS, PAGE, ROOT

### Community 54 - "Nav.tsx"
Cohesion: 0.22
Nodes (14): ADVISORY_SHAPES, checkSource(), CONTRAST_ALLOWLIST, countClusters(), countEmphasis(), countWords(), excerpt(), extractLocaleStrings() (+6 more)

### Community 55 - "page.tsx"
Cohesion: 0.15
Nodes (14): CASE_ROUTES, CLIENTS, generateMetadata(), Home(), localeOf(), Params, PROOF_PHOTOS, SERVICE_PHOTOS (+6 more)

### Community 56 - "page.tsx"
Cohesion: 0.16
Nodes (19): AboutPage(), generateMetadata(), localeOf(), Params, LocaleLayout(), generateMetadata(), localeOf(), Params (+11 more)

### Community 57 - "bumpOffBareMultiple"
Cohesion: 0.19
Nodes (13): baseOf(), WebPackages(), addOnMonthly(), adsScopeOf(), ceilTo(), floorFor(), pesos2(), priced() (+5 more)

### Community 58 - "DemoScene"
Cohesion: 0.07
Nodes (50): DemoHue, DemoFigure(), DemoFigureProps, HIDDEN_WITHOUT_SCRIPT, Hotspot(), PickBox(), PickBoxProps, DemoScene (+42 more)

### Community 59 - "observeOnscreen"
Cohesion: 0.18
Nodes (12): COVER, EstilosPage(), generateMetadata(), Key, KEYS, localeOf(), PALETTE, Params (+4 more)

### Community 60 - "priced"
Cohesion: 0.07
Nodes (27): generateMetadata(), localeOf(), Params, SitiosPage(), about, AboutDict, en, es (+19 more)

### Community 61 - "BridgeMap.tsx"
Cohesion: 0.14
Nodes (13): load(), ambient(), ambientSlot, ask(), declare(), Entry, FakeIO, FakeMQL (+5 more)

### Community 62 - "palette.ts"
Cohesion: 0.29
Nodes (10): CLIENT_MARKS, CLIENT_ORDER, ClientId, S, CASE_IDS, CASE_ROUTES, ClientOrbit(), isKeyboardFocus() (+2 more)

### Community 63 - "World"
Cohesion: 0.16
Nodes (4): withWorld(), INERT, lastFrame(), World

### Community 64 - "page.tsx"
Cohesion: 0.27
Nodes (9): Bucket, buckets, clientKey(), entries(), firstEntry(), hit(), lastEntry(), RateLimitVerdict (+1 more)

### Community 66 - "BridgeMap.tsx"
Cohesion: 0.11
Nodes (16): CHANGE_VISUALS, EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, showPending, VisDict, generateMetadata() (+8 more)

### Community 67 - "Page"
Cohesion: 0.28
Nodes (7): CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS, RGB, VineyardMap()

### Community 68 - "metadata.ts"
Cohesion: 0.13
Nodes (20): AnunciosPage(), generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params, PreciosPage() (+12 more)

### Community 69 - "winery-page.test.ts"
Cohesion: 0.31
Nodes (9): annualPrepay, bumpOffBareMultiple(), featureSetup(), round100(), runCost(), runCostBreakdown(), serviceLineMonthly(), sharedServiceBase() (+1 more)

### Community 71 - "OpenedAtDemo.tsx"
Cohesion: 0.18
Nodes (9): cssSource, decodeEntities(), FRAMES, here, KEYS, pageSource, visibleText(), BLOCKING_SHAPES (+1 more)

### Community 73 - "ResizeMemoryDemo.tsx"
Cohesion: 0.15
Nodes (10): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+2 more)

### Community 77 - "VineyardMap.tsx"
Cohesion: 0.19
Nodes (8): BerryToBottleDesktop(), BerryToBottleMobile(), wrap(), ContourField(), en, es, monteXanic, MonteXanicDict

### Community 78 - "LocaleProvider"
Cohesion: 0.14
Nodes (9): serve(), basisMarkup(), serve(), render(), render(), render(), LocaleProvider(), react (+1 more)

### Community 79 - "fonts.ts"
Cohesion: 0.20
Nodes (8): hotelDisplay, sceneFontVariables, spaDisplay, spaText, techDisplay, techMono, vinDisplay, vinText

### Community 80 - "Page"
Cohesion: 0.29
Nodes (5): css, GHOST_BOXES, GHOSTS, withoutCssComments(), TitlePaint()

### Community 81 - "fieldKit.test.ts"
Cohesion: 0.47
Nodes (5): ContactPage(), DOORS, generateMetadata(), localeOf(), Params

### Community 82 - "useLocale"
Cohesion: 0.14
Nodes (21): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), generateMetadata(), metadata, PricingBundles() (+13 more)

### Community 83 - ".frame"
Cohesion: 0.16
Nodes (16): BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS, Combinations() (+8 more)

### Community 84 - "DemoClock"
Cohesion: 0.40
Nodes (5): growerBundleHours(), growerSetupS(), round500(), roundHalfDown(), usdFromMxn()

### Community 88 - "shell"
Cohesion: 0.32
Nodes (8): blocksOf(), decode(), dictionaries(), judged(), offers(), served(), shell(), strings()

### Community 89 - "FlowCompress.test.ts"
Cohesion: 0.33
Nodes (4): en, es, software, SoftwareDict

### Community 90 - "winery-page.test.ts"
Cohesion: 0.48
Nodes (6): captures(), declaredSpans(), pageSource, servedCapBodies(), servedSpans(), strings()

## Knowledge Gaps
- **491 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `PageModule` (+486 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `useLocale` to `page.tsx`, `config.ts`, `page.tsx`, `pageMetadata`, `page.tsx`, `page.tsx`, `page.tsx`, `ModuleFloors.tsx`, `precios.ts`, `page.tsx`, `page.tsx`, `DemoScene`, `observeOnscreen`, `priced`, `ModuleFloors.tsx`, `BridgeMap.tsx`, `metadata.ts`, `OpenedAtDemo.tsx`, `ResizeMemoryDemo.tsx`, `LocaleProvider`, `fieldKit.test.ts`, `.frame`, `FlowCompress.test.ts`, `winery-page.test.ts`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `react` connect `LocaleProvider` to `shell`, `devDependencies`, `page.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `line()` connect `canvasKit.ts` to `canvasKit.ts`, `ModuleScreen.tsx`, `page.tsx`, `winery-page.test.ts`, `page.tsx`, `.frame`, `page.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _491 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1310344827586207 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.062388591800356503 - nodes in this community are weakly interconnected._