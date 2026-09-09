# Graph Report - cardon-digital  (2026-09-08)

## Corpus Check
- 122 files · ~138,720 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 723 nodes · 1515 edges · 45 communities (36 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9a433c36`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- canvasKit.ts
- compilerOptions
- FloorPlan.tsx
- page.tsx
- package.json
- FleetMap.tsx
- ClinicSchedule.tsx
- PipelineStage.tsx
- devDependencies
- layout.tsx
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
- useDict
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- VineyardMap.tsx
- winery.ts
- VineField.tsx
- SitePlanVisual.tsx
- page.tsx
- page.tsx
- bundleHours
- Locale
- page.tsx
- page.tsx
- page.tsx
- page.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `isLocale()` - 40 edges
2. `rich()` - 35 edges
3. `pageMetadata()` - 31 edges
4. `Locale` - 29 edges
5. `useDict()` - 28 edges
6. `localePath()` - 28 edges
7. `site` - 19 edges
8. `quote` - 15 edges
9. `compilerOptions` - 15 edges
10. `Reveal()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `runCostBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts
- `sharedServiceBaseBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts
- `FloorPlan()` --calls--> `useDict()`  [EXTRACTED]
  components/pages/restaurants/FloorPlan.tsx → lib/i18n/LocaleProvider.tsx
- `localeOf()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/about/page.tsx → lib/i18n/config.ts

## Import Cycles
- None detected.

## Communities (45 total, 9 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.06
Nodes (62): generateMetadata(), Home(), localeOf(), Params, BerryToBottleDesktop(), BerryToBottleMobile(), CENTROIDS, FLAG_ANCHORS (+54 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "FloorPlan.tsx"
Cohesion: 0.15
Nodes (12): FloorPlan(), Geo, Palette, READOUTS, Reservation, RGB, Table, TableKind (+4 more)

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (28): AddOn, AddOnId, addOns, BundleItem, BySize, CatalogueFeature, CurrencyCode, formatAmount() (+20 more)

### Community 4 - "package.json"
Cohesion: 0.18
Nodes (17): generateMetadata(), localeOf(), Params, PreciosPage(), MixExample(), bundleLines(), ModuleFloors(), Reveal() (+9 more)

### Community 5 - "FleetMap.tsx"
Cohesion: 0.07
Nodes (31): capGlyphs, ConstructionPage(), generateMetadata(), localeOf(), Params, FleetMap(), LogRow, NODES (+23 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.14
Nodes (13): Cell, Channel, Chip, ChipState, ClinicSchedule(), Geo, Palette, RGB (+5 more)

### Community 7 - "PipelineStage.tsx"
Cohesion: 0.13
Nodes (14): Cand, FrameCard, Geom, Parked, PipelineStage(), Pt, RosterEntry, Sample (+6 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (37): autoprefixer, lenis, next, next-view-transitions, dependencies, lenis, next, next-view-transitions (+29 more)

### Community 9 - "layout.tsx"
Cohesion: 0.26
Nodes (11): generateMetadata(), routes, sitemap(), Footer(), NotFoundBody(), Locale, localePath(), locales (+3 more)

### Community 10 - "page.tsx"
Cohesion: 0.07
Nodes (54): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ConsentBanner(), ContactDoors(), ContactForm() (+46 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.36
Nodes (6): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), SpotlightFrames()

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
Cohesion: 0.25
Nodes (7): Cardon Digital, Layout, License, Pre-launch gate, Running locally, Scripts, Stack

### Community 16 - "Cardon Digital"
Cohesion: 0.29
Nodes (6): Beads, Core CLI Workflow, First Step, Preferred Route, Rules, What Belongs In Beads

### Community 17 - "Beads"
Cohesion: 0.50
Nodes (3): enkanto-valle.webp, Media credits, valle-vineyard.webp

### Community 21 - "middleware.ts"
Cohesion: 0.08
Nodes (41): metadata, ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), MeasurementScripts() (+33 more)

### Community 27 - "validate.ts"
Cohesion: 0.12
Nodes (25): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+17 more)

### Community 28 - "useDict"
Cohesion: 0.06
Nodes (33): ComingSoonPage(), generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params, PrivacyPage() (+25 more)

### Community 32 - "VineyardMap.tsx"
Cohesion: 0.27
Nodes (8): generateMetadata(), localeOf(), Params, TermsPage(), en, es, terms, TermsDict

### Community 33 - "winery.ts"
Cohesion: 0.13
Nodes (15): AssistantDemo(), BARS, CITED_ROW, PricingBundles(), Geom, Pt, RGB, Source (+7 more)

### Community 34 - "VineField.tsx"
Cohesion: 0.09
Nodes (22): absorbedProviderCash(), combinations, legacyWineryBundles, legacyWinerySetupFloor(), moduleFloors, ModuleId, moduleIds, scopeFactor (+14 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.21
Nodes (13): addOnAvailable(), addOnMonthly(), addOnOf(), annualPrepay, bumpOffBareMultiple(), round100(), roundHalfDown(), runCost() (+5 more)

### Community 36 - "page.tsx"
Cohesion: 0.29
Nodes (7): EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, CaseFact, CaseFacts(), SpotlightFrames()

### Community 37 - "page.tsx"
Cohesion: 0.29
Nodes (7): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, PlayOnceVis(), PlayOnceVisProps, SpotlightFrames()

### Community 38 - "bundleHours"
Cohesion: 0.20
Nodes (17): buildOnly(), bundleHours(), ceilTo(), featureHours(), featureOf(), featureSetup(), floorFor(), growerBundleHours() (+9 more)

### Community 39 - "Locale"
Cohesion: 0.36
Nodes (6): generateMetadata(), localeOf(), ModulosPage(), Params, BridgeMap(), label

### Community 40 - "page.tsx"
Cohesion: 0.53
Nodes (5): AboutPage(), generateMetadata(), localeOf(), Params, pageMetadata()

### Community 41 - "page.tsx"
Cohesion: 0.36
Nodes (6): ClinicsPage(), generateMetadata(), localeOf(), Params, SpotlightFrames(), SpotlightFramesProps

### Community 42 - "page.tsx"
Cohesion: 0.48
Nodes (6): LocaleLayout(), isLocale(), localeFromCountry(), localeFromPath(), config, middleware()

### Community 43 - "page.tsx"
Cohesion: 0.36
Nodes (6): capGlyphs, generateMetadata(), HiringPage(), localeOf(), Params, SpotlightFrames()

### Community 44 - "page.tsx"
Cohesion: 0.24
Nodes (8): generateMetadata(), localeOf(), Params, RestaurantsPage(), SpotlightFrames(), en, es, SiteDict

## Knowledge Gaps
- **285 isolated node(s):** `Params`, `Params`, `Params`, `DOORS`, `Params` (+280 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `layout.tsx` to `canvasKit.ts`, `VineyardMap.tsx`, `winery.ts`, `page.tsx`, `package.json`, `FleetMap.tsx`, `page.tsx`, `Locale`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `Agent Instructions`, `page.tsx`, `middleware.ts`, `useDict`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `page.tsx` to `canvasKit.ts`, `VineyardMap.tsx`, `package.json`, `FleetMap.tsx`, `page.tsx`, `Locale`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `Agent Instructions`, `layout.tsx`, `page.tsx`, `useDict`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `useDict()` connect `canvasKit.ts` to `winery.ts`, `FloorPlan.tsx`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `page.tsx`, `middleware.ts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `Params`, `Params`, `Params` to the rest of the system?**
  _285 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05527805527805528 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._