# Graph Report - cardon-digital  (2026-09-23)

## Corpus Check
- 150 files · ~206,096 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1093 nodes · 2388 edges · 55 communities (45 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c07ba345`
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
- page.tsx
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- page.tsx
- page.tsx
- VineField.tsx
- SitePlanVisual.tsx
- page.tsx
- page.tsx
- ModuleFloors.tsx
- .eslintrc.json
- localePath
- Media credits
- Media clearances
- page.tsx
- localePath
- bumpOffBareMultiple
- page.tsx
- page.tsx
- SpotlightFrames.test.ts
- Nav.tsx
- page.tsx
- page.tsx
- bumpOffBareMultiple
- priced
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `Locale` - 44 edges
2. `rich()` - 33 edges
3. `isLocale()` - 32 edges
4. `localePath()` - 32 edges
5. `pageMetadata()` - 23 edges
6. `SectionSeason()` - 21 edges
7. `quote` - 20 edges
8. `RestauranteDemo()` - 19 edges
9. `useDict()` - 18 edges
10. `site` - 18 edges

## Surprising Connections (you probably didn't know these)
- `names()` --references--> `ModuleId`  [EXTRACTED]
  app/[locale]/ads-claim.test.ts → lib/pricing.ts
- `served()` --indirect_call--> `LocaleProvider()`  [INFERRED]
  app/[locale]/ads-claim.test.ts → lib/i18n/LocaleProvider.tsx
- `LocaleLayout()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/layout.tsx → lib/i18n/config.ts
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `runCostBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts

## Import Cycles
- None detected.

## Communities (55 total, 10 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.05
Nodes (78): code(), componentRules, FakeObserver, here, read(), strip(), bands, CAPTION_KEYS (+70 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "site.ts"
Cohesion: 0.12
Nodes (24): ADVISORY_SHAPES, checkSource(), CONTRAST_ALLOWLIST, countClusters(), countEmphasis(), countWords(), describe(), excerpt() (+16 more)

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (27): AddOn, BundleItem, BySize, CatalogueFeature, CurrencyCode, formatAmount(), groupLocale, growerBundleS (+19 more)

### Community 4 - "config.ts"
Cohesion: 0.13
Nodes (12): DYNAMIC_HREFS, existingRoutes, Link, links, ROOT, ROUTE_ROOT, sourceFiles, routes (+4 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.36
Nodes (6): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, PlayOnceVis(), PlayOnceVisProps

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.06
Nodes (58): EnkantoCaseStudy(), BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS (+50 more)

### Community 7 - "page.tsx"
Cohesion: 0.18
Nodes (10): metadata, ContourField(), NotFoundBody(), SiteShell(), archivo, htmlLang, en, es (+2 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-next, lenis, next, next-view-transitions, dependencies, lenis (+33 more)

### Community 9 - "pageMetadata"
Cohesion: 0.06
Nodes (51): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+43 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (41): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+33 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.10
Nodes (17): about, AboutDict, en, es, DemoDict, demoPage, en, es (+9 more)

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
Cohesion: 0.13
Nodes (31): ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), MeasurementScripts(), ADS_ID (+23 more)

### Community 28 - "page.tsx"
Cohesion: 0.26
Nodes (11): shell(), captures(), declaredSpans(), pageSource, serve(), servedCapBodies(), servedSpans(), strings() (+3 more)

### Community 32 - "page.tsx"
Cohesion: 0.15
Nodes (19): AboutPage(), generateMetadata(), localeOf(), Params, generateMetadata(), LocaleLayout(), generateMetadata(), localeOf() (+11 more)

### Community 33 - "page.tsx"
Cohesion: 0.13
Nodes (14): 10. Maps are contiguous, never floating shapes, 11. The data is a pure module, the component measures and draws, 12. The contract is enforced on every demo, and the spellings are the contract, 1. One hue, and the hue is the demo's own, 2. The three motion gates, and where they live, 3. An observer's threshold is a promise the callback keeps, 4. The device pixel ratio is capped at 2, and it is not fixed for the page, 5. Reduced motion resolves to the payoff frame, and the clock agrees with it (+6 more)

### Community 34 - "VineField.tsx"
Cohesion: 0.09
Nodes (21): absorbedProviderCash(), AddOnId, combinations, legacyWineryBundles, legacyWinerySetupFloor(), ModuleSelection, scopeFactor, sizes (+13 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.33
Nodes (6): featureHours(), featureOf(), hours3(), runCostHours(), sharedBuildHours(), sharedServiceBaseHours()

### Community 37 - "page.tsx"
Cohesion: 0.07
Nodes (32): ConsentBanner(), BerryToBottleDesktop(), BerryToBottleMobile(), CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS (+24 more)

### Community 38 - "page.tsx"
Cohesion: 0.07
Nodes (49): CASE_ROUTES, generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames() (+41 more)

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

### Community 47 - "page.tsx"
Cohesion: 0.10
Nodes (51): arrivalsOutside(), canvasCount(), changedSince(), classify(), compareVisual(), defaultBranch(), facultyMoved(), filesAt() (+43 more)

### Community 49 - "localePath"
Cohesion: 0.20
Nodes (11): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), PricingBundles(), SpotlightFrames(), en (+3 more)

### Community 50 - "bumpOffBareMultiple"
Cohesion: 0.29
Nodes (11): addOnAvailable(), addOnMonthly(), addOnOf(), addOnSize(), buildOnly(), bundleHours(), ceilTo(), floorFor() (+3 more)

### Community 51 - "page.tsx"
Cohesion: 0.09
Nodes (33): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+25 more)

### Community 52 - "page.tsx"
Cohesion: 0.06
Nodes (26): accessibleText(), basisMarkup(), blocks(), decodeEntities(), Env, html(), pageCode, pageSource (+18 more)

### Community 53 - "SpotlightFrames.test.ts"
Cohesion: 0.28
Nodes (6): SpotlightFrames(), spotlightVars(), CASE_CSS, GLOBALS, PAGE, ROOT

### Community 54 - "Nav.tsx"
Cohesion: 0.31
Nodes (10): Mark(), MarkVariant, Nav(), isLocale(), localeFromCountry(), localeFromPath(), otherLocale(), stripLocale() (+2 more)

### Community 55 - "page.tsx"
Cohesion: 0.27
Nodes (8): ComingSoonPage(), generateMetadata(), localeOf(), Params, comingSoon, ComingSoonDict, en, es

### Community 56 - "page.tsx"
Cohesion: 0.29
Nodes (8): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), { redirect }, Footer(), localePath()

### Community 57 - "bumpOffBareMultiple"
Cohesion: 0.38
Nodes (7): annualPrepay, bumpOffBareMultiple(), runCost(), runCostBreakdown(), serviceLineMonthly(), sharedServiceBase(), sharedServiceBaseBreakdown()

### Community 60 - "priced"
Cohesion: 0.32
Nodes (8): featureSetup(), growerBundleHours(), growerSetupS(), priced(), round100(), round500(), roundHalfDown(), usdFromMxn()

### Community 63 - "page.tsx"
Cohesion: 0.60
Nodes (4): generateMetadata(), localeOf(), Params, PreciosPage()

## Knowledge Gaps
- **368 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `PageModule` (+363 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `page.tsx` to `page.tsx`, `ModuleScreen.tsx`, `page.tsx`, `ClinicSchedule.tsx`, `ModuleFloors.tsx`, `pageMetadata`, `page.tsx`, `page.tsx`, `page.tsx`, `localePath`, `page.tsx`, `page.tsx`, `Nav.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `react` connect `page.tsx` to `ModuleFloors.tsx`, `devDependencies`, `page.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `dependencies` connect `devDependencies` to `page.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _368 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05016722408026756 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11827956989247312 - nodes in this community are weakly interconnected._