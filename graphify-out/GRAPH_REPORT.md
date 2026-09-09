# Graph Report - cardon-digital  (2026-09-08)

## Corpus Check
- 118 files · ~134,644 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 709 nodes · 1462 edges · 48 communities (39 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ce845348`
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
- site.ts
- pageMetadata
- ceilTo

## God Nodes (most connected - your core abstractions)
1. `isLocale()` - 38 edges
2. `rich()` - 31 edges
3. `pageMetadata()` - 29 edges
4. `useDict()` - 28 edges
5. `Locale` - 26 edges
6. `localePath()` - 24 edges
7. `site` - 18 edges
8. `quote` - 15 edges
9. `compilerOptions` - 15 edges
10. `useLocale()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `runCostBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts
- `sharedServiceBaseBreakdown()` --indirect_call--> `line()`  [INFERRED]
  lib/pricing.ts → components/pages/home/canvasKit.ts
- `FloorPlan()` --calls--> `useDict()`  [EXTRACTED]
  components/pages/restaurants/FloorPlan.tsx → lib/i18n/LocaleProvider.tsx
- `NotFoundBody()` --calls--> `localePath()`  [EXTRACTED]
  components/site/NotFoundBody.tsx → lib/i18n/config.ts

## Import Cycles
- None detected.

## Communities (48 total, 9 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.07
Nodes (52): generateMetadata(), Home(), localeOf(), Params, BerryToBottleDesktop(), BerryToBottleMobile(), buildHots(), ColorKey (+44 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "FloorPlan.tsx"
Cohesion: 0.15
Nodes (12): FloorPlan(), Geo, Palette, READOUTS, Reservation, RGB, Table, TableKind (+4 more)

### Community 3 - "page.tsx"
Cohesion: 0.06
Nodes (30): AddOn, AddOnId, addOns, BundleItem, BySize, CatalogueFeature, currencyByLocale, CurrencyCode (+22 more)

### Community 4 - "package.json"
Cohesion: 0.17
Nodes (13): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, Nav(), comingSoon (+5 more)

### Community 5 - "FleetMap.tsx"
Cohesion: 0.08
Nodes (25): FleetMap(), LogRow, NODES, Pt, Pulse, RGB, ROADS, ROUTES (+17 more)

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
Cohesion: 0.22
Nodes (14): generateMetadata(), LocaleLayout(), routes, sitemap(), Footer(), isLocale(), localeFromCountry(), localeFromPath() (+6 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (42): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+34 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.23
Nodes (10): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), PricingBundles(), SpotlightFrames(), inline() (+2 more)

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
Nodes (42): metadata, ConsentBanner(), ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm() (+34 more)

### Community 27 - "validate.ts"
Cohesion: 0.09
Nodes (33): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+25 more)

### Community 28 - "useDict"
Cohesion: 0.07
Nodes (27): generateMetadata(), localeOf(), Params, TermsPage(), about, AboutDict, en, es (+19 more)

### Community 32 - "VineyardMap.tsx"
Cohesion: 0.18
Nodes (11): CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS, RGB, VineyardMap(), en (+3 more)

### Community 33 - "winery.ts"
Cohesion: 0.14
Nodes (14): AssistantDemo(), BARS, CITED_ROW, Geom, Pt, RGB, Source, SourceKind (+6 more)

### Community 34 - "VineField.tsx"
Cohesion: 0.10
Nodes (21): absorbedProviderCash(), combinations, legacyWineryBundles, legacyWinerySetupFloor(), moduleFloors, ModuleId, moduleIds, scopeFactor (+13 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.25
Nodes (14): addOnAvailable(), addOnMonthly(), addOnOf(), annualPrepay, bumpOffBareMultiple(), featureSetup(), priced(), quote (+6 more)

### Community 36 - "page.tsx"
Cohesion: 0.29
Nodes (7): EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, CaseFact, CaseFacts(), SpotlightFrames()

### Community 37 - "page.tsx"
Cohesion: 0.29
Nodes (7): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, PlayOnceVis(), PlayOnceVisProps, SpotlightFrames()

### Community 38 - "bundleHours"
Cohesion: 0.22
Nodes (10): buildOnly(), bundleHours(), featureHours(), featureOf(), floorFor(), hours3(), pesos2(), runCostHours() (+2 more)

### Community 39 - "Locale"
Cohesion: 0.33
Nodes (7): generateMetadata(), localeOf(), ModulosPage(), Params, BridgeMap(), label, Locale

### Community 40 - "page.tsx"
Cohesion: 0.36
Nodes (6): AboutPage(), generateMetadata(), localeOf(), Params, Reveal(), RevealProps

### Community 41 - "page.tsx"
Cohesion: 0.36
Nodes (6): ClinicsPage(), generateMetadata(), localeOf(), Params, SpotlightFrames(), SpotlightFramesProps

### Community 42 - "page.tsx"
Cohesion: 0.36
Nodes (6): capGlyphs, ConstructionPage(), generateMetadata(), localeOf(), Params, SpotlightFrames()

### Community 43 - "page.tsx"
Cohesion: 0.36
Nodes (6): capGlyphs, generateMetadata(), HiringPage(), localeOf(), Params, SpotlightFrames()

### Community 44 - "page.tsx"
Cohesion: 0.43
Nodes (5): generateMetadata(), localeOf(), Params, RestaurantsPage(), SpotlightFrames()

### Community 45 - "site.ts"
Cohesion: 0.33
Nodes (5): NotFoundBody(), en, es, site, SiteDict

### Community 46 - "pageMetadata"
Cohesion: 0.53
Nodes (5): generateMetadata(), localeOf(), Params, PrivacyPage(), pageMetadata()

### Community 47 - "ceilTo"
Cohesion: 0.33
Nodes (6): ceilTo(), growerBundleHours(), growerSetupS(), runCostBreakdown(), serviceLineMonthly(), sharedServiceBaseBreakdown()

## Knowledge Gaps
- **282 isolated node(s):** `Params`, `Params`, `Params`, `DOORS`, `Params` (+277 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `Locale` to `canvasKit.ts`, `page.tsx`, `package.json`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `Agent Instructions`, `layout.tsx`, `pageMetadata`, `site.ts`, `middleware.ts`, `validate.ts`, `useDict`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `layout.tsx` to `canvasKit.ts`, `package.json`, `page.tsx`, `page.tsx`, `Locale`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `Agent Instructions`, `pageMetadata`, `validate.ts`, `useDict`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `useDict()` connect `canvasKit.ts` to `VineyardMap.tsx`, `winery.ts`, `FloorPlan.tsx`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `middleware.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `Params`, `Params`, `Params` to the rest of the system?**
  _282 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07067307692307692 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06439393939393939 - nodes in this community are weakly interconnected._