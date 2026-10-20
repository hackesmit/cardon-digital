# Graph Report - cardon-digital  (2026-10-20)

## Corpus Check
- 259 files · ~803,237 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 47 file(s) not represented in the graph (top: .css 27, .out 9, .log 6)

## Summary
- 2164 nodes · 5717 edges · 93 communities (79 shown, 14 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 87 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9cffc820`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- demos.test.ts
- compilerOptions
- [locale]/page.tsx
- pricing.ts
- i18n/config.ts
- pages/demos/HospitalidadDemo.tsx
- fieldKit.ts
- Reveal
- package.json
- Media.test.tsx
- ContactDoors.tsx
- HawkDelivery.tsx
- Agent Instructions
- Project Instructions for AI Agents
- Beads - AI-Native Issue Tracking
- Cardon Digital
- Beads
- Cardon Digital: copy and page doctrine
- ContactForm.test.tsx
- ReachMap
- measurement-proof.mjs
- route.ts
- copy-check.mjs
- next.config.mjs
- postcss.config.mjs
- SiteRise
- demos/page.tsx
- Media.tsx
- quote
- onscreen.test.ts
- DemoClock
- CellarDemo.tsx
- showcase.test.ts
- contract.test.tsx
- ads-claim.test.ts
- .eslintrc.json
- Media: the shot list
- Media credits
- Media clearances
- sceneMedia.test.ts
- palette-check.mjs
- visuals-check.mjs
- ref_node_fs
- canvasKit.ts
- LocaleProvider
- mail.ts
- pages/demos/ProduccionDemo.tsx
- pricing.test.ts
- readExpression
- enkanto/page.tsx
- HalftoneSunset.test.tsx
- rich.tsx
- react
- ContactForm.tsx
- localePath
- checks.tsx
- ClientOrbit.tsx
- world.tsx
- routes.test.ts
- useDemoStage
- demos/page.test.tsx
- ModuleScreen.tsx
- PackageBuilder.tsx
- priced
- probe.mjs
- HeroAssembly
- DigitalArc
- monte-xanic/page.tsx
- pages/demos/stage/useDemoStage.ts
- observeOnscreen
- check-ads-outcome-claim.sh
- FooterScene.tsx
- enkanto-case.test.ts
- estilos/fonts.ts
- World
- precios.ts
- pageMetadata
- Locale
- clamp01
- bumpOffBareMultiple
- SceneMedia.tsx
- ReachMap.test.tsx
- Demo previews
- featureHours
- vitest
- next

## God Nodes (most connected - your core abstractions)
1. `react` - 86 edges
2. `useDict()` - 66 edges
3. `Locale` - 61 edges
4. `localePath()` - 57 edges
5. `./cellar.css` - 56 edges
6. `DemoFigure()` - 48 edges
7. `Reveal()` - 43 edges
8. `isLocale()` - 42 edges
9. `rich()` - 42 edges
10. `next` - 42 edges

## Surprising Connections (you probably didn't know these)
- `3. What is checked, and how` --references--> `onClick()`  [INFERRED]
  docs/demos.md → components/consent/ConversionListeners.tsx
- `2. What you do not write, and what each piece is for` --references--> `shouldAnimate()`  [INFERRED]
  docs/demos.md → components/pages/demos/motion.ts
- `2. What you do not write, and what each piece is for` --references--> `observeOnscreen()`  [INFERRED]
  docs/demos.md → components/pages/demos/motion.ts
- `3. What is checked, and how` --references--> `observeOnscreen()`  [INFERRED]
  docs/demos.md → components/pages/demos/motion.ts
- `4. What is still yours to get right` --references--> `DemoPalette`  [INFERRED]
  docs/demos.md → components/pages/demos/palette.ts

## Import Cycles
- None detected.

## Communities (93 total, 14 thin omitted)

### Community 0 - "demos.test.ts"
Cohesion: 0.11
Nodes (26): FakeObserver, here, HUES, CAPTION_KEYS, CaptionKey, clockLabel(), CYCLE, FADE (+18 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 2 - "[locale]/page.tsx"
Cohesion: 0.17
Nodes (14): CASE_ROUTES, CLIENTS, generateMetadata(), Home(), localeOf(), Mark(), Params, PROOF_PHOTOS (+6 more)

### Community 3 - "pricing.ts"
Cohesion: 0.06
Nodes (34): AddOn, addOns, AdsScopeId, adsServiceHours, BundleItem, BySize, CatalogueFeature, collectionShareOfAdmin (+26 more)

### Community 4 - "i18n/config.ts"
Cohesion: 0.09
Nodes (29): ComingSoonPage(), generateMetadata(), localeOf(), Params, COVER, EstilosPage(), generateMetadata(), Key (+21 more)

### Community 5 - "pages/demos/HospitalidadDemo.tsx"
Cohesion: 0.11
Nodes (41): bands, board, CAPACITY, CAPTION_KEYS, CaptionKey, captionKeyFor(), Channel, clampN() (+33 more)

### Community 6 - "fieldKit.ts"
Cohesion: 0.06
Nodes (16): Field, FieldColors, FieldKind, FieldState, grad3, makeCorrientes(), makeRejilla(), MAKERS (+8 more)

### Community 7 - "Reveal"
Cohesion: 0.13
Nodes (34): AnunciosPage(), generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params, PreciosPage() (+26 more)

### Community 8 - "package.json"
Cohesion: 0.05
Nodes (41): dependencies, lenis, next, next-view-transitions, react, react-dom, devDependencies, autoprefixer (+33 more)

### Community 9 - "Media.test.tsx"
Cohesion: 0.08
Nodes (18): mediaSlots, posterFile(), posterFor(), compileGuards, computedSlot, filesUnder(), FLAGS, INTENTS (+10 more)

### Community 10 - "ContactDoors.tsx"
Cohesion: 0.09
Nodes (38): ContactDoors(), ContactForm(), onSubmit(), ContactMail(), isEmptySelection(), Attribution, clean(), EMPTY_ATTRIBUTION (+30 more)

### Community 11 - "HawkDelivery.tsx"
Cohesion: 0.07
Nodes (50): bez(), bezD(), BOTTOM_FOLD, carried(), CARRY_S, CATCH_S, catchPoint(), clamp() (+42 more)

### Community 12 - "Agent Instructions"
Cohesion: 0.17
Nodes (11): Agent Context Profiles, Agent Instructions, Beads Issue Tracker, Beads Issue Tracker, Non-Interactive Shell Commands, Quick Reference, Quick Reference, Quick Reference (+3 more)

### Community 13 - "Project Instructions for AI Agents"
Cohesion: 0.20
Nodes (9): Agent Context Profiles, Architecture Overview, Beads Issue Tracker, Build & Test, Conventions & Patterns, Project Instructions for AI Agents, Quick Reference, Rules (+1 more)

### Community 14 - "Beads - AI-Native Issue Tracking"
Cohesion: 0.22
Nodes (8): Beads - AI-Native Issue Tracking, Essential Commands, Get Started with Beads, Learn More, Quick Start, What is Beads?, Why Beads?, Working with Issues

### Community 15 - "Cardon Digital"
Cohesion: 0.20
Nodes (9): Cardon Digital, Environment flags, Layout, License, Pre-launch gate, Running locally, Scripts, Stack (+1 more)

### Community 16 - "Beads"
Cohesion: 0.29
Nodes (6): Beads, Core CLI Workflow, First Step, Preferred Route, Rules, What Belongs In Beads

### Community 17 - "Cardon Digital: copy and page doctrine"
Cohesion: 0.08
Nodes (24): 10. The checks protect a good-faith author (binding), 11. Spanish is written, never translated (binding), 1. What the two books actually teach, 2. What is wrong with the site today (measured, not asserted), 3. The rules, 4. Home page architecture, 5. Demos and motion, 6. Media (+16 more)

### Community 21 - "ContactForm.test.tsx"
Cohesion: 0.06
Nodes (58): ConsentBanner(), accept(), decline(), ConsentGate(), ConversionListeners(), onClick(), onSubmit(), countedOnSubmit() (+50 more)

### Community 22 - "ReachMap"
Cohesion: 0.19
Nodes (25): easeInOut(), strokeTraceUpTo(), ReachMap(), contourSet(), counts(), dotProgress(), draw(), drawBudget() (+17 more)

### Community 27 - "route.ts"
Cohesion: 0.11
Nodes (25): dynamic, fail(), JSON_HEADERS, POST(), runtime, BoundedBody, readBoundedText(), deliver() (+17 more)

### Community 28 - "copy-check.mjs"
Cohesion: 0.08
Nodes (35): cssSource, decodeEntities(), FRAMES, here, KEYS, pageSource, serve(), visibleText() (+27 more)

### Community 31 - "SiteRise"
Cohesion: 0.20
Nodes (24): rgba(), rr(), SiteRise(), deviceStroke(), draw(), drawBubble(), drawChips(), drawField() (+16 more)

### Community 32 - "demos/page.tsx"
Cohesion: 0.11
Nodes (20): DemoPage(), dynamic, generateMetadata(), localeOf(), Params, clearedPage(), { redirect }, DemosPage() (+12 more)

### Community 33 - "Media.tsx"
Cohesion: 0.08
Nodes (29): assertMediaText(), assertVideoLabels(), exportWidth(), FrameImage(), IntentUpdate, isVideoProps(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+21 more)

### Community 34 - "quote"
Cohesion: 0.24
Nodes (12): addOnAvailable(), addOnOf(), addOnSize(), bundleHours(), featureOf(), floorFor(), hours3(), largestSize() (+4 more)

### Community 35 - "onscreen.test.ts"
Cohesion: 0.12
Nodes (24): attr(), classPrefix(), literal(), LIVE_ROLES, OPERABLE, SourceRuleContext, escapesIn(), NOT_JUDGED (+16 more)

### Community 37 - "CellarDemo.tsx"
Cohesion: 0.13
Nodes (7): bands, captionKeyFor(), clampN(), COV, cycleFrame, restauranteScene(), CellarDemo()

### Community 38 - "showcase.test.ts"
Cohesion: 0.07
Nodes (49): showcaseEnabled(), ACID, ACID_RANGE, ACID_TICKS, BRIX, BRIX_RANGE, BRIX_TICKS, DAY_TICKS (+41 more)

### Community 39 - "contract.test.tsx"
Cohesion: 0.12
Nodes (4): failing(), askedAtImport, components, Keyed()

### Community 40 - "ads-claim.test.ts"
Cohesion: 0.06
Nodes (46): amountsIn(), blocksOf(), budgetProblem(), decode(), DENIED_BEFORE, dictionaries(), dictionaryFiles, EARNINGS_PROMISE (+38 more)

### Community 42 - "Media: the shot list"
Cohesion: 0.25
Nodes (7): Export and drop in, How a slot works, Media: the shot list, Ratios, and the size to shoot to, Shooting notes, The slots, What is NOT on this list: public/media/estilos

### Community 43 - "Media credits"
Cohesion: 0.09
Nodes (22): about/cellar.webp, Cardon Digital photography, shot at Monte Xanic (2026-09-29), Client marks (2026-10-07), clients/brighterhire-mark.png, clients/dharma-mark.png, clients/enkanto-mark.png, clients/monte-xanic-mark.png, clients/rlogistics-mark.png (+14 more)

### Community 44 - "Media clearances"
Cohesion: 0.25
Nodes (7): Client marks for the home orbit, 2026-10-06, Entries, Media clearances, Monte Xanic cellar and lab frames, 2026-09-29 and 2026-09-30, Style sample material, 2026-10-16, The entry, Two clearances, both required

### Community 45 - "sceneMedia.test.ts"
Cohesion: 0.13
Nodes (20): allLayers(), AWAITING_MEDIA, layerFiles(), SCENE_ARM_MARGIN, SCENE_KEYS, SCENE_MEDIA, SceneKey, sceneLayers() (+12 more)

### Community 46 - "palette-check.mjs"
Cohesion: 0.08
Nodes (28): ACCEPTED, cardW, contrast(), cssFiles(), ctaInk, darkBlock, darkPrimaryTextW, dE() (+20 more)

### Community 47 - "visuals-check.mjs"
Cohesion: 0.06
Nodes (68): args, fail(), ffmpeg(), frames, loop, out, quality, still (+60 more)

### Community 48 - "ref_node_fs"
Cohesion: 0.06
Nodes (22): demoFiles(), MACHINERY, css, GHOST_BOXES, GHOSTS, withoutCssComments(), broken(), sourceRules (+14 more)

### Community 49 - "canvasKit.ts"
Cohesion: 0.12
Nodes (30): dedupe(), drawFlow(), fitCanvas(), hexToRgb(), Palette, pointAtLen(), Pt, readPalette() (+22 more)

### Community 50 - "LocaleProvider"
Cohesion: 0.29
Nodes (4): render(), strings(), render(), LocaleProvider()

### Community 51 - "mail.ts"
Cohesion: 0.17
Nodes (20): bodyFor(), buildEmail(), deliveryConfigured(), DeliveryResult, Email, envAddress(), esc(), htmlFor() (+12 more)

### Community 52 - "pages/demos/ProduccionDemo.tsx"
Cohesion: 0.07
Nodes (60): ./cellar.css, AXIS_L, AXIS_R, bands, BRIX_HI, BRIX_LO, brixAt(), C (+52 more)

### Community 53 - "pricing.test.ts"
Cohesion: 0.06
Nodes (31): absorbedProviderCash(), AddOnId, adsContactRules, adsMinimumBudget(), annualPrepayRate, combinations, legacyWineryBundles, legacyWinerySetupFloor() (+23 more)

### Community 54 - "readExpression"
Cohesion: 0.47
Nodes (12): decodeEscapes(), regexCanStart(), scanInitializer(), readArray(), readExpression(), readKey(), readObject(), readRegex() (+4 more)

### Community 55 - "enkanto/page.tsx"
Cohesion: 0.13
Nodes (11): CHANGE_VISUALS, generateMetadata(), localeOf(), Params, showPending, VisDict, SpotlightFrames(), en (+3 more)

### Community 56 - "HalftoneSunset.test.tsx"
Cohesion: 0.20
Nodes (22): BASE_TONE, builderLevel(), clamp(), dotBump(), dotLayer(), dotRadius(), dotReach(), dotValue() (+14 more)

### Community 57 - "rich.tsx"
Cohesion: 0.11
Nodes (17): AboutPage(), generateMetadata(), localeOf(), Params, about, AboutDict, en, es (+9 more)

### Community 58 - "react"
Cohesion: 0.09
Nodes (63): Lone(), OnTap(), Remounts(), Swaps(), HospitalidadDemo(), ProduccionDemo(), RestauranteDemo(), DemoFigure() (+55 more)

### Community 59 - "ContactForm.tsx"
Cohesion: 0.23
Nodes (9): EMPTY, Status, Values, BuilderSelection, ContactAttribution, ContactField, HONEYPOT_FIELD, LIMITS (+1 more)

### Community 60 - "localePath"
Cohesion: 0.11
Nodes (24): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), captures(), declaredSpans(), pageSource (+16 more)

### Community 61 - "checks.tsx"
Cohesion: 0.14
Nodes (13): BOX, checks, Demo, describeEl(), flat(), GHOST, HINT_TEXTS, hintCarriers() (+5 more)

### Community 62 - "ClientOrbit.tsx"
Cohesion: 0.11
Nodes (22): CLIENT_MARKS, CLIENT_ORDER, ClientId, MONOGRAMS, S, CASE_IDS, CASE_ROUTES, ClientOrbit() (+14 more)

### Community 63 - "world.tsx"
Cohesion: 0.12
Nodes (15): load(), ambient(), ambientSlot, ask(), declare(), Entry, FakeIO, FakeMQL (+7 more)

### Community 64 - "routes.test.ts"
Cohesion: 0.16
Nodes (11): DYNAMIC_HREFS, existingRoutes, Link, links, ROOT, ROUTE_ROOT, sourceFiles, walk() (+3 more)

### Community 65 - "useDemoStage"
Cohesion: 0.18
Nodes (8): LiveText, useDemoStage(), 1. What you write, 2. What you do not write, and what each piece is for, 3. What is checked, and how, 4. What is still yours to get right, Before you call a demo done, The module demos: how one is built

### Community 66 - "demos/page.test.tsx"
Cohesion: 0.10
Nodes (21): MEDIA, render(), ROOT, css(), DemoCard, DemoCardKey, demoCardKeys, demosIndex (+13 more)

### Community 67 - "ModuleScreen.tsx"
Cohesion: 0.19
Nodes (12): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), Spark(), STAYS (+4 more)

### Community 68 - "PackageBuilder.tsx"
Cohesion: 0.12
Nodes (29): PackageBuilder(), SummaryLine(), StandaloneBuilder(), ADS_IDS, cleanModules(), decodeSelection(), EMPTY_SELECTION, encodeSelection() (+21 more)

### Community 69 - "priced"
Cohesion: 0.22
Nodes (14): adsBase(), adsScopeOf(), buildOnly(), ceilTo(), growerBundleHours(), growerSetupS(), pesos2(), priced() (+6 more)

### Community 70 - "probe.mjs"
Cohesion: 0.11
Nodes (7): cap(), errors, t0, run(), say(), PHONE, WIDE

### Community 71 - "HeroAssembly"
Cohesion: 0.13
Nodes (24): drawCactusSeal(), makeTrace(), textFace(), HeroAssembly(), chipCols(), draw(), drawBody(), drawDoc() (+16 more)

### Community 72 - "DigitalArc"
Cohesion: 0.26
Nodes (14): line(), arrival(), DigitalArc(), control(), draw(), drawLabels(), drawMagnifier(), drawScene() (+6 more)

### Community 73 - "monte-xanic/page.tsx"
Cohesion: 0.08
Nodes (30): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, BerryToBottle(), BerryToBottleDesktop(), BerryToBottleMobile(), CaseFact (+22 more)

### Community 74 - "pages/demos/stage/useDemoStage.ts"
Cohesion: 0.15
Nodes (14): BRIGHT_MIX, DemoHue, DemoPalette, FALLBACK, readDemoPalette(), ClockSpec, createClock(), isPhonePlan() (+6 more)

### Community 75 - "observeOnscreen"
Cohesion: 0.23
Nodes (8): DemoMotionState, observeOnscreen(), ONSCREEN_THRESHOLD, shouldAnimate(), PHONE_MAX, HospitalidadDemo(), ProduccionDemo(), StringDemo()

### Community 77 - "FooterScene.tsx"
Cohesion: 0.27
Nodes (11): SCENE_ART_D, SCENE_ART_TRANSFORM, SCENE_ART_VIEWBOX, SCENE_LEFT_D, SCENE_LEFT_TRANSFORM, SCENE_LEFT_VIEWBOX, SCENE_LINE_D, SCENE_LINE_TRANSFORM (+3 more)

### Community 78 - "enkanto-case.test.ts"
Cohesion: 0.14
Nodes (13): accessibleText(), basisMarkup(), blocks(), decodeEntities(), Env, html(), pageCode, pageSource (+5 more)

### Community 79 - "estilos/fonts.ts"
Cohesion: 0.20
Nodes (8): hotelDisplay, sceneFontVariables, spaDisplay, spaText, techDisplay, techMono, vinDisplay, vinText

### Community 80 - "World"
Cohesion: 0.19
Nodes (3): withWorld(), lastFrame(), World

### Community 81 - "precios.ts"
Cohesion: 0.29
Nodes (13): ComboVis(), MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence() (+5 more)

### Community 82 - "pageMetadata"
Cohesion: 0.10
Nodes (22): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params (+14 more)

### Community 83 - "Locale"
Cohesion: 0.19
Nodes (16): BRIDGE_NODES, bridgeLabels(), BridgeMap(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS (+8 more)

### Community 84 - "clamp01"
Cohesion: 0.18
Nodes (10): clamp01(), FlowCompress(), apply(), frame(), start(), render(), en, es (+2 more)

### Community 85 - "bumpOffBareMultiple"
Cohesion: 0.25
Nodes (11): addOnLine(), addOnMonthly(), adsReferenceMonthly(), annualPrepay, bumpOffBareMultiple(), round100(), runCost(), runCostBreakdown() (+3 more)

### Community 86 - "SceneMedia.tsx"
Cohesion: 0.21
Nodes (13): armState(), SceneLayer, SceneVideo(), stillPath(), videoSources(), MEDIA_VISIBLE, pressVideo(), videoAction() (+5 more)

### Community 87 - "ReachMap.test.tsx"
Cohesion: 0.25
Nodes (5): render(), anuncios, AnunciosDict, en, es

### Community 88 - "Demo previews"
Cohesion: 0.50
Nodes (3): Demo previews, Making them again, What they must keep saying

### Community 91 - "vitest"
Cohesion: 0.15
Nodes (12): strings(), dir, EN, ES, files, Rule, RULES, en (+4 more)

### Community 95 - "next"
Cohesion: 0.12
Nodes (16): dynamicParams, generateMetadata(), LocaleLayout(), metadata, RootNotFound(), routes, sitemap(), NotFoundBody() (+8 more)

## Knowledge Gaps
- **601 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `PageModule` (+596 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 815 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `demos.test.ts`, `[locale]/page.tsx`, `i18n/config.ts`, `pages/demos/HospitalidadDemo.tsx`, `Reveal`, `package.json`, `Media.test.tsx`, `ContactDoors.tsx`, `HawkDelivery.tsx`, `ContactForm.test.tsx`, `copy-check.mjs`, `demos/page.tsx`, `Media.tsx`, `CellarDemo.tsx`, `showcase.test.ts`, `contract.test.tsx`, `ads-claim.test.ts`, `sceneMedia.test.ts`, `canvasKit.ts`, `LocaleProvider`, `pages/demos/ProduccionDemo.tsx`, `enkanto/page.tsx`, `HalftoneSunset.test.tsx`, `rich.tsx`, `ContactForm.tsx`, `localePath`, `checks.tsx`, `ClientOrbit.tsx`, `world.tsx`, `demos/page.test.tsx`, `ModuleScreen.tsx`, `PackageBuilder.tsx`, `HeroAssembly`, `monte-xanic/page.tsx`, `pages/demos/stage/useDemoStage.ts`, `observeOnscreen`, `FooterScene.tsx`, `enkanto-case.test.ts`, `estilos/fonts.ts`, `precios.ts`, `Locale`, `clamp01`, `SceneMedia.tsx`, `ReachMap.test.tsx`, `vitest`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _601 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `demos.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11363636363636363 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `vitest` to `demos.test.ts`, `pages/demos/HospitalidadDemo.tsx`, `fieldKit.ts`, `package.json`, `Media.test.tsx`, `HawkDelivery.tsx`, `ContactForm.test.tsx`, `copy-check.mjs`, `demos/page.tsx`, `onscreen.test.ts`, `showcase.test.ts`, `contract.test.tsx`, `ads-claim.test.ts`, `sceneMedia.test.ts`, `ref_node_fs`, `LocaleProvider`, `mail.ts`, `pages/demos/ProduccionDemo.tsx`, `pricing.test.ts`, `HalftoneSunset.test.tsx`, `localePath`, `checks.tsx`, `routes.test.ts`, `demos/page.test.tsx`, `PackageBuilder.tsx`, `monte-xanic/page.tsx`, `pages/demos/stage/useDemoStage.ts`, `enkanto-case.test.ts`, `precios.ts`, `Locale`, `clamp01`, `ReachMap.test.tsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `Locale` connect `Locale` to `[locale]/page.tsx`, `pricing.ts`, `i18n/config.ts`, `Reveal`, `Media.test.tsx`, `ContactForm.test.tsx`, `copy-check.mjs`, `demos/page.tsx`, `Media.tsx`, `showcase.test.ts`, `ads-claim.test.ts`, `sceneMedia.test.ts`, `LocaleProvider`, `enkanto/page.tsx`, `rich.tsx`, `react`, `ContactForm.tsx`, `localePath`, `demos/page.test.tsx`, `ModuleScreen.tsx`, `PackageBuilder.tsx`, `monte-xanic/page.tsx`, `enkanto-case.test.ts`, `precios.ts`, `pageMetadata`, `clamp01`, `ReachMap.test.tsx`, `next`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `pricing.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.057057057057057055 - nodes in this community are weakly interconnected._