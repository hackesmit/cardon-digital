# Graph Report - cardon-digital  (2026-09-24)

## Corpus Check
- 193 files · ~247,701 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1341 nodes · 3052 edges · 66 communities (55 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `991d2942`
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
- SpotlightFrames.test.ts
- Nav.tsx
- page.tsx
- page.tsx
- bumpOffBareMultiple
- observeOnscreen
- priced
- BridgeMap.tsx
- palette.ts
- World
- page.tsx
- page.tsx
- metadata.ts
- ghosts.ts

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
- `served()` --indirect_call--> `LocaleProvider()`  [INFERRED]
  app/[locale]/ads-claim.test.ts → lib/i18n/LocaleProvider.tsx
- `OwnClock()` --calls--> `observeOnscreen()`  [EXTRACTED]
  lib/testing/loopholes/demos/CaptionClockDemo.tsx → components/pages/demos/motion.ts
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `runCostBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts

## Import Cycles
- None detected.

## Communities (66 total, 11 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.10
Nodes (29): FakeObserver, here, bands, CAPTION_KEYS, CaptionKey, clampN(), clockLabel(), COV (+21 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "site.ts"
Cohesion: 0.06
Nodes (43): cssSource, decodeEntities(), FRAMES, here, KEYS, pageSource, visibleText(), CENTROIDS (+35 more)

### Community 3 - "page.tsx"
Cohesion: 0.08
Nodes (25): AddOn, BundleItem, BySize, CatalogueFeature, CurrencyCode, formatAmount(), groupLocale, growerBundleS (+17 more)

### Community 4 - "config.ts"
Cohesion: 0.13
Nodes (15): DYNAMIC_HREFS, existingRoutes, Link, links, ROOT, ROUTE_ROOT, sourceFiles, localeFromCountry() (+7 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.15
Nodes (31): bands, board, CAPTION_KEYS, CaptionKey, captionKeyFor(), Channel, clampN(), cycleFrame (+23 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.17
Nodes (14): BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS, Combinations() (+6 more)

### Community 7 - "page.tsx"
Cohesion: 0.11
Nodes (22): shell(), captures(), declaredSpans(), pageSource, serve(), servedCapBodies(), servedSpans(), strings() (+14 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (43): autoprefixer, eslint, eslint-config-next, jsdom, lenis, next, next-view-transitions, dependencies (+35 more)

### Community 9 - "pageMetadata"
Cohesion: 0.06
Nodes (51): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+43 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (43): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+35 more)

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
Cohesion: 0.11
Nodes (36): ConsentBanner(), ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), MeasurementScripts() (+28 more)

### Community 27 - "checks.tsx"
Cohesion: 0.14
Nodes (12): BOX, checks, Demo, describeEl(), failing(), flat(), GHOST, HINT_TEXTS (+4 more)

### Community 28 - "page.tsx"
Cohesion: 0.07
Nodes (26): accessibleText(), basisMarkup(), blocks(), decodeEntities(), Env, html(), pageCode, pageSource (+18 more)

### Community 32 - "page.tsx"
Cohesion: 0.11
Nodes (18): AboutPage(), generateMetadata(), localeOf(), Params, about, AboutDict, en, es (+10 more)

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
Nodes (11): captionKeyFor(), cycleFrame, ClockSpec, createClock(), DemoClock, isPhonePlan(), LiveText, StageRefs (+3 more)

### Community 37 - "case-page.test.ts"
Cohesion: 0.22
Nodes (8): BRIGHT_MIX, DemoHue, DemoPalette, FALLBACK, StageEnv, BLACK, RGB, WHITE

### Community 38 - "page.tsx"
Cohesion: 0.06
Nodes (51): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+43 more)

### Community 39 - "canvasKit.ts"
Cohesion: 0.14
Nodes (24): readDemoPalette(), dedupe(), drawFlow(), hexToRgb(), makeTrace(), mix(), Palette, pointAtLen() (+16 more)

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
Cohesion: 0.06
Nodes (59): BerryToBottleDesktop(), BerryToBottleMobile(), DemoFigure(), DemoFigureProps, HIDDEN_WITHOUT_SCRIPT, Hotspot(), HotspotProps, PickBox() (+51 more)

### Community 47 - "page.tsx"
Cohesion: 0.10
Nodes (51): arrivalsOutside(), canvasCount(), changedSince(), classify(), compareVisual(), defaultBranch(), facultyMoved(), filesAt() (+43 more)

### Community 48 - "precios.ts"
Cohesion: 0.29
Nodes (14): MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence(), mixRules() (+6 more)

### Community 49 - "localePath"
Cohesion: 0.20
Nodes (11): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), PricingBundles(), SpotlightFrames(), en (+3 more)

### Community 50 - "bumpOffBareMultiple"
Cohesion: 0.29
Nodes (7): featureHours(), featureOf(), featureSetup(), hours3(), runCostHours(), sharedBuildHours(), sharedServiceBaseHours()

### Community 51 - "page.tsx"
Cohesion: 0.09
Nodes (33): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+25 more)

### Community 53 - "SpotlightFrames.test.ts"
Cohesion: 0.28
Nodes (6): SpotlightFrames(), spotlightVars(), CASE_CSS, GLOBALS, PAGE, ROOT

### Community 54 - "Nav.tsx"
Cohesion: 0.36
Nodes (6): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, PlayOnceVis(), PlayOnceVisProps

### Community 55 - "page.tsx"
Cohesion: 0.21
Nodes (10): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, comingSoon, ComingSoonDict (+2 more)

### Community 56 - "page.tsx"
Cohesion: 0.17
Nodes (20): generateMetadata(), localeOf(), Params, PreciosPage(), ModuleBlock(), FloorChart(), bundleLines(), ModuleFloors() (+12 more)

### Community 57 - "bumpOffBareMultiple"
Cohesion: 0.36
Nodes (8): annualPrepay, bumpOffBareMultiple(), round100(), runCost(), runCostBreakdown(), serviceLineMonthly(), sharedServiceBase(), sharedServiceBaseBreakdown()

### Community 59 - "observeOnscreen"
Cohesion: 0.26
Nodes (8): DemoMotionState, observeOnscreen(), shouldAnimate(), clearsThreshold(), OnscreenEntry, HospitalidadDemo(), ProduccionDemo(), StringDemo()

### Community 60 - "priced"
Cohesion: 0.29
Nodes (8): growerBundleHours(), growerSetupS(), priced(), round500(), roundHalfDown(), sumPriced(), usdFromMxn(), WorkedExample

### Community 61 - "BridgeMap.tsx"
Cohesion: 0.14
Nodes (13): load(), ambient(), ambientSlot, ask(), declare(), Entry, FakeIO, FakeMQL (+5 more)

### Community 62 - "palette.ts"
Cohesion: 0.29
Nodes (11): addOnAvailable(), addOnMonthly(), addOnOf(), addOnSize(), buildOnly(), bundleHours(), ceilTo(), floorFor() (+3 more)

### Community 63 - "World"
Cohesion: 0.17
Nodes (4): withWorld(), INERT, lastFrame(), World

### Community 64 - "page.tsx"
Cohesion: 0.23
Nodes (9): CASE_ROUTES, generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames() (+1 more)

### Community 67 - "page.tsx"
Cohesion: 0.27
Nodes (8): generateMetadata(), localeOf(), Params, TermsPage(), en, es, terms, TermsDict

### Community 68 - "metadata.ts"
Cohesion: 0.15
Nodes (24): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), { redirect }, generateMetadata(), LocaleLayout() (+16 more)

### Community 70 - "ghosts.ts"
Cohesion: 0.40
Nodes (4): css, GHOST_BOXES, GHOSTS, withoutCssComments()

## Knowledge Gaps
- **401 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `PageModule` (+396 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `page.tsx` to `page.tsx`, `page.tsx`, `site.ts`, `page.tsx`, `metadata.ts`, `page.tsx`, `ClinicSchedule.tsx`, `page.tsx`, `ModuleFloors.tsx`, `page.tsx`, `page.tsx`, `pageMetadata`, `precios.ts`, `localePath`, `page.tsx`, `Nav.tsx`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `react` connect `page.tsx` to `ModuleFloors.tsx`, `devDependencies`, `page.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `dependencies` connect `devDependencies` to `page.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _401 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1021021021021021 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._