# Graph Report - cardon-digital  (2026-09-15)

## Corpus Check
- 138 files · ~159,171 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 889 nodes · 1924 edges · 48 communities (38 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7f427a1a`
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
- validate.ts
- page.tsx
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- page.tsx
- page.tsx
- VineField.tsx
- SitePlanVisual.tsx
- localePath
- page.tsx
- page.tsx
- BridgeMap.tsx
- ModuleFloors.tsx
- .eslintrc.json
- localePath
- Media credits
- Media clearances
- BridgeMap.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `Locale` - 39 edges
2. `localePath()` - 35 edges
3. `rich()` - 35 edges
4. `isLocale()` - 34 edges
5. `pageMetadata()` - 25 edges
6. `quote` - 20 edges
7. `RestauranteDemo()` - 18 edges
8. `useDict()` - 18 edges
9. `site` - 18 edges
10. `Reveal()` - 15 edges

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

## Communities (48 total, 10 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.07
Nodes (62): FakeObserver, here, bands, captionKeyFor(), clampN(), clockLabel(), COV, cycleFrame (+54 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "site.ts"
Cohesion: 0.29
Nodes (9): AboutPage(), generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params, PreciosPage() (+1 more)

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (28): AddOn, addOns, BundleItem, BySize, CatalogueFeature, CurrencyCode, groupLocale, growerBundleS (+20 more)

### Community 4 - "config.ts"
Cohesion: 0.21
Nodes (17): generateMetadata(), LocaleLayout(), routes, sitemap(), Nav(), isLocale(), localeFromCountry(), localeFromPath() (+9 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.22
Nodes (9): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, CaseFact, CaseFacts(), PlayOnceVis(), PlayOnceVisProps (+1 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.16
Nodes (24): generateMetadata(), localeOf(), ModulosPage(), Params, Combinations(), ModuleBlock(), bundleLines(), ModuleFloors() (+16 more)

### Community 7 - "page.tsx"
Cohesion: 0.33
Nodes (7): DemoPage(), generateMetadata(), localeOf(), Params, clearedPage(), { redirect }, moduleIds

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (43): autoprefixer, eslint, eslint-config-next, lenis, next, next-view-transitions, dependencies, lenis (+35 more)

### Community 9 - "pageMetadata"
Cohesion: 0.06
Nodes (52): assertMediaText(), assertVideoLabels(), exportWidth(), IntentUpdate, isVideoProps(), Media(), MEDIA_PENDING_LABEL, MEDIA_RATIOS (+44 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (43): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+35 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.22
Nodes (10): bundleHours(), featureHours(), featureOf(), featureSetup(), floorFor(), hours3(), pesos2(), runCostHours() (+2 more)

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
Cohesion: 0.10
Nodes (19): 1. What the two books actually teach, 2. What is wrong with the site today (measured, not asserted), 3. The rules, 4. Home page architecture, 5. Demos and motion, 6. Media, 7. Definition of done for any copy bead, A note on the counts (+11 more)

### Community 21 - "middleware.ts"
Cohesion: 0.11
Nodes (35): ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), MeasurementScripts(), ADS_ID (+27 more)

### Community 27 - "validate.ts"
Cohesion: 0.05
Nodes (58): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+50 more)

### Community 28 - "page.tsx"
Cohesion: 0.16
Nodes (11): metadata, ContourField(), Footer(), NotFoundBody(), SiteShell(), archivo, htmlLang, en (+3 more)

### Community 32 - "page.tsx"
Cohesion: 0.05
Nodes (34): ComingSoonPage(), generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params, PrivacyPage() (+26 more)

### Community 33 - "page.tsx"
Cohesion: 0.31
Nodes (7): EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, showPending, SpotlightFrames(), allModules

### Community 34 - "VineField.tsx"
Cohesion: 0.09
Nodes (22): absorbedProviderCash(), AddOnId, combinations, legacyWineryBundles, legacyWinerySetupFloor(), modules, ModuleSelection, scopeFactor (+14 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.17
Nodes (22): addOnAvailable(), addOnMonthly(), addOnOf(), addOnSize(), annualPrepay, buildOnly(), bumpOffBareMultiple(), ceilTo() (+14 more)

### Community 36 - "localePath"
Cohesion: 0.14
Nodes (20): FloorChart(), MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence() (+12 more)

### Community 37 - "page.tsx"
Cohesion: 0.08
Nodes (25): ConsentBanner(), BerryToBottleDesktop(), BerryToBottleMobile(), CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS (+17 more)

### Community 38 - "page.tsx"
Cohesion: 0.10
Nodes (23): generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames(), showcaseEnabled() (+15 more)

### Community 39 - "BridgeMap.tsx"
Cohesion: 0.15
Nodes (10): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+2 more)

### Community 40 - "ModuleFloors.tsx"
Cohesion: 0.18
Nodes (12): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), BARS, PricingBundles(), SpotlightFrames() (+4 more)

### Community 42 - "localePath"
Cohesion: 0.25
Nodes (7): Export and drop in, How a slot works, Media: the shot list, Ratios, and the size to shoot to, Shooting notes, The slots, Video

### Community 43 - "Media credits"
Cohesion: 0.33
Nodes (5): enkanto-valle.webp, Media credits, Our own material, Placeholder stock, valle-vineyard.webp

### Community 44 - "Media clearances"
Cohesion: 0.40
Nodes (4): Entries, Media clearances, The entry, Two clearances, both required

### Community 46 - "BridgeMap.tsx"
Cohesion: 0.31
Nodes (7): BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS

### Community 47 - "page.tsx"
Cohesion: 0.27
Nodes (8): generateMetadata(), localeOf(), Params, TermsPage(), en, es, terms, TermsDict

## Knowledge Gaps
- **308 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `Params` (+303 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `ClinicSchedule.tsx` to `page.tsx`, `page.tsx`, `site.ts`, `page.tsx`, `config.ts`, `ModuleScreen.tsx`, `page.tsx`, `page.tsx`, `ModuleFloors.tsx`, `BridgeMap.tsx`, `page.tsx`, `localePath`, `pageMetadata`, `BridgeMap.tsx`, `page.tsx`, `validate.ts`, `page.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _308 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06522522522522523 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07311827956989247 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `pageMetadata` be split into smaller, more focused modules?**
  _Cohesion score 0.05505952380952381 - nodes in this community are weakly interconnected._