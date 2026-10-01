# Graph Report - cardon-digital  (2026-10-01)

## Corpus Check
- 222 files · ~447,633 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1534 nodes · 3653 edges · 82 communities (67 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cae2b8e4`
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
- budgetProblem
- contact.ts
- ContactForm.test.tsx
- probe.mjs
- ghosts.ts

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
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `runCostBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts

## Import Cycles
- None detected.

## Communities (82 total, 15 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.13
Nodes (25): FakeObserver, here, bands, CAPTION_KEYS, CaptionKey, captionKeyFor(), clampN(), clockLabel() (+17 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "site.ts"
Cohesion: 0.22
Nodes (13): ADVISORY_SHAPES, checkSource(), countClusters(), countEmphasis(), countWords(), excerpt(), extractLocaleStrings(), findAssignment() (+5 more)

### Community 3 - "page.tsx"
Cohesion: 0.06
Nodes (38): AddOn, addOns, addOnSize(), AdsScopeId, BundleItem, BySize, CatalogueFeature, groupLocale (+30 more)

### Community 4 - "config.ts"
Cohesion: 0.10
Nodes (24): { redirect }, generateMetadata(), LocaleLayout(), DYNAMIC_HREFS, existingRoutes, Link, links, ROOT (+16 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.15
Nodes (31): bands, board, CAPTION_KEYS, CaptionKey, captionKeyFor(), Channel, clampN(), cycleFrame (+23 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.12
Nodes (33): AnunciosPage(), generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params, PreciosPage() (+25 more)

### Community 7 - "page.tsx"
Cohesion: 0.09
Nodes (24): ComingSoonPage(), generateMetadata(), localeOf(), Params, metadata, ContourField(), Footer(), Mark() (+16 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (43): autoprefixer, eslint, eslint-config-next, jsdom, lenis, next, next-view-transitions, dependencies (+35 more)

### Community 9 - "pageMetadata"
Cohesion: 0.06
Nodes (51): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+43 more)

### Community 10 - "page.tsx"
Cohesion: 0.25
Nodes (14): ContactDoors(), shortLeadId(), CLICK_DOORS, ClickDoors, Doors, readClickDoors(), readDoors(), bookingHref() (+6 more)

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
Cohesion: 0.14
Nodes (12): BOX, checks, Demo, describeEl(), failing(), flat(), GHOST, HINT_TEXTS (+4 more)

### Community 28 - "page.tsx"
Cohesion: 0.15
Nodes (10): accessibleText(), blocks(), decodeEntities(), Env, html(), pageCode, pageSource, renderedText() (+2 more)

### Community 32 - "page.tsx"
Cohesion: 0.24
Nodes (9): AboutPage(), generateMetadata(), localeOf(), Params, about, AboutDict, en, es (+1 more)

### Community 33 - "page.tsx"
Cohesion: 0.29
Nodes (6): 1. What you write, 2. What you do not write, and what each piece is for, 3. What is checked, and how, 4. What is still yours to get right, Before you call a demo done, The module demos: how one is built

### Community 34 - "VineField.tsx"
Cohesion: 0.07
Nodes (33): absorbedProviderCash(), AddOnId, adsMinimumBudget(), combinations, featureHours(), featureOf(), featureSetup(), growerBundleHours() (+25 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.09
Nodes (29): demoFiles(), MACHINERY, broken(), classPrefix(), literal(), LIVE_ROLES, OPERABLE, SourceRuleContext (+21 more)

### Community 36 - "useDemoStage.ts"
Cohesion: 0.16
Nodes (8): DemoHue, ClockSpec, createClock(), DemoClock, DemoScene, LiveText, StageRefs, useDemoStage()

### Community 37 - "case-page.test.ts"
Cohesion: 0.21
Nodes (12): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), PricingBundles(), SpotlightFrames(), localePath() (+4 more)

### Community 38 - "page.tsx"
Cohesion: 0.08
Nodes (41): showcaseEnabled(), ACID, ACID_RANGE, ACID_TICKS, BRIX, BRIX_RANGE, BRIX_TICKS, DAY_TICKS (+33 more)

### Community 39 - "canvasKit.ts"
Cohesion: 0.06
Nodes (64): CASE_ROUTES, CLIENTS, generateMetadata(), Home(), localeOf(), Params, PROOF_PHOTOS, SERVICE_PHOTOS (+56 more)

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
Cohesion: 0.13
Nodes (14): BerryToBottleDesktop(), BerryToBottleMobile(), CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS, RGB (+6 more)

### Community 47 - "page.tsx"
Cohesion: 0.10
Nodes (51): arrivalsOutside(), canvasCount(), changedSince(), classify(), compareVisual(), defaultBranch(), facultyMoved(), filesAt() (+43 more)

### Community 48 - "precios.ts"
Cohesion: 0.17
Nodes (21): AdsFee(), FloorChart(), MixExample(), baseOf(), WebPackages(), bridgesSentence(), comboName(), comboPricingClause() (+13 more)

### Community 49 - "localePath"
Cohesion: 0.25
Nodes (7): Geom, Pt, RGB, Source, SourceKind, Trace, VineField()

### Community 50 - "bumpOffBareMultiple"
Cohesion: 0.18
Nodes (12): EMPTY, Status, Values, attributionField(), ContactAttribution, ContactField, ContactSubmission, isHeaderSafe() (+4 more)

### Community 51 - "page.tsx"
Cohesion: 0.10
Nodes (28): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+20 more)

### Community 52 - "page.tsx"
Cohesion: 0.11
Nodes (37): bands, brixAt(), CAPTION_KEYS, CaptionKey, captionKeyFor(), CENTRES, chart(), ChartGeom (+29 more)

### Community 53 - "SpotlightFrames.test.ts"
Cohesion: 0.28
Nodes (6): SpotlightFrames(), spotlightVars(), CASE_CSS, GLOBALS, PAGE, ROOT

### Community 54 - "Nav.tsx"
Cohesion: 0.25
Nodes (8): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, CaseFact, CaseFacts(), PlayOnceVis(), PlayOnceVisProps

### Community 55 - "page.tsx"
Cohesion: 0.08
Nodes (23): BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS, ChannelId (+15 more)

### Community 56 - "page.tsx"
Cohesion: 0.13
Nodes (18): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params (+10 more)

### Community 57 - "bumpOffBareMultiple"
Cohesion: 0.17
Nodes (25): addOnAvailable(), addOnMonthly(), addOnOf(), adsScopeOf(), annualPrepay, buildOnly(), bumpOffBareMultiple(), bundleHours() (+17 more)

### Community 58 - "DemoScene"
Cohesion: 0.10
Nodes (40): DemoFigure(), HIDDEN_WITHOUT_SCRIPT, Hotspot(), AssistantDemo(), BARS, CITED_ROW, demos, DemosDict (+32 more)

### Community 59 - "observeOnscreen"
Cohesion: 0.24
Nodes (9): DemoMotionState, observeOnscreen(), shouldAnimate(), CaptionClockDemo(), captionScene(), OwnClock(), HospitalidadDemo(), ProduccionDemo() (+1 more)

### Community 60 - "priced"
Cohesion: 0.16
Nodes (10): DemoFigureProps, HotspotProps, PickBox(), PickBoxProps, CapturedClockDemo(), cellarScene(), now, cellarScene() (+2 more)

### Community 61 - "BridgeMap.tsx"
Cohesion: 0.14
Nodes (13): load(), ambient(), ambientSlot, ask(), declare(), Entry, FakeIO, FakeMQL (+5 more)

### Community 62 - "palette.ts"
Cohesion: 0.16
Nodes (10): CONTRAST_ALLOWLIST, describe(), main(), run(), CONTRAST_FIXTURES, HONEST_SPANISH, LIMITS, ROOT (+2 more)

### Community 63 - "World"
Cohesion: 0.16
Nodes (4): withWorld(), INERT, lastFrame(), World

### Community 64 - "page.tsx"
Cohesion: 0.18
Nodes (9): cssSource, decodeEntities(), FRAMES, here, KEYS, pageSource, visibleText(), BLOCKING_SHAPES (+1 more)

### Community 65 - "ModuleFloors.tsx"
Cohesion: 0.19
Nodes (8): serve(), basisMarkup(), serve(), render(), render(), LocaleProvider(), react, react

### Community 66 - "BridgeMap.tsx"
Cohesion: 0.14
Nodes (11): CHANGE_VISUALS, generateMetadata(), localeOf(), Params, showPending, VisDict, SpotlightFrames(), en (+3 more)

### Community 68 - "metadata.ts"
Cohesion: 0.21
Nodes (10): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), allModules, DemoDict, demoPage (+2 more)

### Community 69 - "winery-page.test.ts"
Cohesion: 0.48
Nodes (6): captures(), declaredSpans(), pageSource, servedCapBodies(), servedSpans(), strings()

### Community 71 - "OpenedAtDemo.tsx"
Cohesion: 0.30
Nodes (10): ContactForm(), ContactMail(), Attribution, clean(), EMPTY_ATTRIBUTION, readAttribution(), readCookie(), readStored() (+2 more)

### Community 72 - "PickStuckDemo.tsx"
Cohesion: 0.27
Nodes (8): generateMetadata(), localeOf(), Params, SitiosPage(), en, es, sitios, SitiosDict

### Community 73 - "ResizeMemoryDemo.tsx"
Cohesion: 0.28
Nodes (9): blocksOf(), decode(), dictionaries(), judged(), offers(), served(), shell(), strings() (+1 more)

### Community 75 - "FlowCompress.test.ts"
Cohesion: 0.29
Nodes (5): render(), en, es, software, SoftwareDict

### Community 77 - "budgetProblem"
Cohesion: 0.27
Nodes (10): amountsIn(), budgetProblem(), figure(), judge(), offerIn(), scope(), sentencesOf(), shareOfSpendClaims() (+2 more)

### Community 78 - "contact.ts"
Cohesion: 0.20
Nodes (9): DoorVariant, ContactDict, en, enDescription, enIntro, es, esDescription, esIntro (+1 more)

### Community 79 - "ContactForm.test.tsx"
Cohesion: 0.25
Nodes (6): GtagCall, contact, en, es, privacy, PrivacyDict

### Community 81 - "ghosts.ts"
Cohesion: 0.29
Nodes (5): css, GHOST_BOXES, GHOSTS, withoutCssComments(), TitlePaint()

## Knowledge Gaps
- **451 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `PageModule` (+446 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `ClinicSchedule.tsx` to `page.tsx`, `config.ts`, `page.tsx`, `pageMetadata`, `page.tsx`, `page.tsx`, `case-page.test.ts`, `page.tsx`, `canvasKit.ts`, `ModuleFloors.tsx`, `precios.ts`, `bumpOffBareMultiple`, `Nav.tsx`, `page.tsx`, `page.tsx`, `DemoScene`, `page.tsx`, `ModuleFloors.tsx`, `BridgeMap.tsx`, `Page`, `metadata.ts`, `winery-page.test.ts`, `PickStuckDemo.tsx`, `FlowCompress.test.ts`, `ContactForm.test.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `line()` connect `canvasKit.ts` to `canvasKit.ts`, `ModuleScreen.tsx`, `page.tsx`, `ClinicSchedule.tsx`, `page.tsx`, `page.tsx`, `bumpOffBareMultiple`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `react` connect `ModuleFloors.tsx` to `devDependencies`, `ResizeMemoryDemo.tsx`, `FlowCompress.test.ts`, `page.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _451 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13012477718360071 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05609756097560976 - nodes in this community are weakly interconnected._