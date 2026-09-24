# Graph Report - cardon-digital  (2026-09-24)

## Corpus Check
- 193 files · ~246,993 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1339 nodes · 3050 edges · 73 communities (62 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8314f34d`
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
- ModuleScreen.tsx
- observeOnscreen
- priced
- BridgeMap.tsx
- palette.ts
- World
- page.tsx
- routes.test.ts
- LocaleProvider
- page.tsx
- metadata.ts
- winery-page.test.ts
- ghosts.ts
- home.ts
- judge

## God Nodes (most connected - your core abstractions)
1. `useDict()` - 56 edges
2. `Locale` - 45 edges
3. `rich()` - 33 edges
4. `isLocale()` - 32 edges
5. `localePath()` - 32 edges
6. `DemoScene` - 30 edges
7. `demos` - 25 edges
8. `DemoFigure()` - 23 edges
9. `pageMetadata()` - 23 edges
10. `SectionSeason()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `names()` --references--> `ModuleId`  [EXTRACTED]
  app/[locale]/ads-claim.test.ts → lib/pricing.ts
- `LocaleLayout()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/layout.tsx → lib/i18n/config.ts
- `OwnClock()` --calls--> `observeOnscreen()`  [EXTRACTED]
  lib/testing/loopholes/demos/CaptionClockDemo.tsx → components/pages/demos/motion.ts
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `runCostBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts

## Import Cycles
- None detected.

## Communities (73 total, 11 thin omitted)

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
Cohesion: 0.07
Nodes (26): AddOn, BundleItem, BySize, CatalogueFeature, CurrencyCode, formatAmount(), groupLocale, growerBundleS (+18 more)

### Community 4 - "config.ts"
Cohesion: 0.29
Nodes (9): isLocale(), localeFromCountry(), localeFromPath(), stripLocale(), RETIRED_ROUTES, retiredPaths, retiredRoute, config (+1 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.15
Nodes (31): bands, board, CAPTION_KEYS, CaptionKey, captionKeyFor(), Channel, clampN(), cycleFrame (+23 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.15
Nodes (21): BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS, Combinations() (+13 more)

### Community 7 - "page.tsx"
Cohesion: 0.17
Nodes (13): metadata, ContourField(), Footer(), Nav(), NotFoundBody(), SiteShell(), archivo, localePath() (+5 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (43): autoprefixer, eslint, eslint-config-next, jsdom, lenis, next, next-view-transitions, dependencies (+35 more)

### Community 9 - "pageMetadata"
Cohesion: 0.06
Nodes (52): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+44 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (42): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+34 more)

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
Cohesion: 0.14
Nodes (12): BOX, checks, Demo, describeEl(), failing(), flat(), GHOST, HINT_TEXTS (+4 more)

### Community 28 - "page.tsx"
Cohesion: 0.13
Nodes (13): CHANGE_VISUALS, EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, showPending, VisDict, SpotlightFrames() (+5 more)

### Community 32 - "page.tsx"
Cohesion: 0.13
Nodes (15): AboutPage(), generateMetadata(), localeOf(), Params, about, AboutDict, en, es (+7 more)

### Community 33 - "page.tsx"
Cohesion: 0.29
Nodes (6): 1. What you write, 2. What you do not write, and what each piece is for, 3. What is checked, and how, 4. What is still yours to get right, Before you call a demo done, The module demos: how one is built

### Community 34 - "VineField.tsx"
Cohesion: 0.09
Nodes (22): absorbedProviderCash(), AddOnId, combinations, legacyWineryBundles, legacyWinerySetupFloor(), mixDiscountByRank, ModuleSelection, scopeFactor (+14 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.09
Nodes (29): demoFiles(), MACHINERY, broken(), classPrefix(), literal(), LIVE_ROLES, OPERABLE, SourceRuleContext (+21 more)

### Community 36 - "useDemoStage.ts"
Cohesion: 0.15
Nodes (9): DemoPalette, ClockSpec, createClock(), DemoClock, isPhonePlan(), LiveText, StageEnv, StageRefs (+1 more)

### Community 37 - "case-page.test.ts"
Cohesion: 0.18
Nodes (13): generateMetadata(), localeOf(), Params, PreciosPage(), generateMetadata(), localeOf(), Params, PrivacyPage() (+5 more)

### Community 38 - "page.tsx"
Cohesion: 0.09
Nodes (41): ACID, ACID_RANGE, ACID_TICKS, BRIX, BRIX_RANGE, BRIX_TICKS, DAY_TICKS, dayAt() (+33 more)

### Community 39 - "canvasKit.ts"
Cohesion: 0.13
Nodes (28): BRIGHT_MIX, FALLBACK, readDemoPalette(), BLACK, dedupe(), drawFlow(), fitCanvas(), hexToRgb() (+20 more)

### Community 40 - "ModuleFloors.tsx"
Cohesion: 0.07
Nodes (25): ADS_ID, allModuleIds, attachesTo, BUILD, buildAtEverySize, dictionaryFiles, excludedIds, here (+17 more)

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
Cohesion: 0.07
Nodes (56): BerryToBottleDesktop(), BerryToBottleMobile(), DemoHue, DemoFigure(), DemoFigureProps, HIDDEN_WITHOUT_SCRIPT, Hotspot(), HotspotProps (+48 more)

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
Cohesion: 0.29
Nodes (8): bundleHours(), featureOf(), floorFor(), hours3(), pesos2(), runCostHours(), sharedBuildHours(), sharedServiceBaseHours()

### Community 51 - "page.tsx"
Cohesion: 0.09
Nodes (33): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+25 more)

### Community 52 - "page.tsx"
Cohesion: 0.15
Nodes (10): accessibleText(), blocks(), decodeEntities(), Env, html(), pageCode, pageSource, renderedText() (+2 more)

### Community 53 - "SpotlightFrames.test.ts"
Cohesion: 0.28
Nodes (6): SpotlightFrames(), spotlightVars(), CASE_CSS, GLOBALS, PAGE, ROOT

### Community 54 - "Nav.tsx"
Cohesion: 0.25
Nodes (8): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, CaseFact, CaseFacts(), PlayOnceVis(), PlayOnceVisProps

### Community 55 - "page.tsx"
Cohesion: 0.21
Nodes (10): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, comingSoon, ComingSoonDict (+2 more)

### Community 56 - "page.tsx"
Cohesion: 0.21
Nodes (15): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), { redirect }, FloorChart(), bundleLines() (+7 more)

### Community 57 - "bumpOffBareMultiple"
Cohesion: 0.32
Nodes (8): annualPrepay, bumpOffBareMultiple(), ceilTo(), runCost(), runCostBreakdown(), serviceLineMonthly(), sharedServiceBase(), sharedServiceBaseBreakdown()

### Community 58 - "ModuleScreen.tsx"
Cohesion: 0.15
Nodes (10): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+2 more)

### Community 59 - "observeOnscreen"
Cohesion: 0.26
Nodes (8): DemoMotionState, observeOnscreen(), shouldAnimate(), clearsThreshold(), OnscreenEntry, HospitalidadDemo(), ProduccionDemo(), StringDemo()

### Community 60 - "priced"
Cohesion: 0.22
Nodes (10): featureHours(), featureSetup(), growerBundleHours(), growerSetupS(), priced(), round100(), roundHalfDown(), sumPriced() (+2 more)

### Community 61 - "BridgeMap.tsx"
Cohesion: 0.14
Nodes (13): load(), ambient(), ambientSlot, ask(), declare(), Entry, FakeIO, FakeMQL (+5 more)

### Community 62 - "palette.ts"
Cohesion: 0.39
Nodes (8): addOnAvailable(), addOnMonthly(), addOnOf(), addOnSize(), buildOnly(), largestSize(), quote, round500()

### Community 63 - "World"
Cohesion: 0.17
Nodes (4): withWorld(), INERT, lastFrame(), World

### Community 64 - "page.tsx"
Cohesion: 0.23
Nodes (9): CASE_ROUTES, generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames() (+1 more)

### Community 65 - "routes.test.ts"
Cohesion: 0.15
Nodes (9): DYNAMIC_HREFS, existingRoutes, Link, links, ROOT, ROUTE_ROOT, sourceFiles, routes (+1 more)

### Community 66 - "LocaleProvider"
Cohesion: 0.22
Nodes (13): blocksOf(), decode(), dictionaries(), offers(), served(), shell(), strings(), serve() (+5 more)

### Community 67 - "page.tsx"
Cohesion: 0.27
Nodes (8): generateMetadata(), localeOf(), Params, TermsPage(), en, es, terms, TermsDict

### Community 68 - "metadata.ts"
Cohesion: 0.39
Nodes (5): generateMetadata(), LocaleLayout(), locales, ogLocale, alternatesFor()

### Community 69 - "winery-page.test.ts"
Cohesion: 0.48
Nodes (6): captures(), declaredSpans(), pageSource, servedCapBodies(), servedSpans(), strings()

### Community 70 - "ghosts.ts"
Cohesion: 0.40
Nodes (4): css, GHOST_BOXES, GHOSTS, withoutCssComments()

### Community 71 - "home.ts"
Cohesion: 0.40
Nodes (4): en, es, home, HomeDict

### Community 72 - "judge"
Cohesion: 0.67
Nodes (3): judge(), judged(), offerIn()

## Knowledge Gaps
- **399 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `PageModule` (+394 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `ClinicSchedule.tsx` to `site.ts`, `page.tsx`, `page.tsx`, `pageMetadata`, `page.tsx`, `page.tsx`, `page.tsx`, `case-page.test.ts`, `page.tsx`, `ModuleFloors.tsx`, `useDict`, `precios.ts`, `localePath`, `page.tsx`, `page.tsx`, `Nav.tsx`, `page.tsx`, `page.tsx`, `ModuleScreen.tsx`, `page.tsx`, `page.tsx`, `metadata.ts`, `winery-page.test.ts`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `react` connect `LocaleProvider` to `devDependencies`, `page.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `dependencies` connect `devDependencies` to `LocaleProvider`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _399 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._