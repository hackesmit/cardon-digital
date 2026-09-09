# Graph Report - cardon-digital  (2026-09-08)

## Corpus Check
- 123 files · ~139,120 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 724 nodes · 1519 edges · 36 communities (27 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e7c06e09`
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
- VineField.tsx
- SitePlanVisual.tsx
- page.tsx
- bundleHours

## God Nodes (most connected - your core abstractions)
1. `isLocale()` - 40 edges
2. `rich()` - 35 edges
3. `pageMetadata()` - 31 edges
4. `Locale` - 29 edges
5. `useDict()` - 28 edges
6. `localePath()` - 28 edges
7. `site` - 19 edges
8. `quote` - 16 edges
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
- `AboutPage()` --calls--> `rich()`  [EXTRACTED]
  app/[locale]/about/page.tsx → lib/i18n/rich.tsx

## Import Cycles
- None detected.

## Communities (36 total, 9 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.06
Nodes (59): BerryToBottleDesktop(), BerryToBottleMobile(), buildHots(), ColorKey, Hot, Layout, Series, SeriesKey (+51 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "FloorPlan.tsx"
Cohesion: 0.15
Nodes (12): FloorPlan(), Geo, Palette, READOUTS, Reservation, RGB, Table, TableKind (+4 more)

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (26): AddOn, AddOnId, addOns, BySize, CatalogueFeature, CurrencyCode, groupLocale, growerBundleS (+18 more)

### Community 4 - "package.json"
Cohesion: 0.24
Nodes (9): bundleLines(), ModuleFloors(), BundleItem, currencyByLocale, formatAmount(), formatPrice(), moduleFloors, ModuleId (+1 more)

### Community 5 - "FleetMap.tsx"
Cohesion: 0.07
Nodes (31): capGlyphs, ConstructionPage(), generateMetadata(), localeOf(), Params, FleetMap(), LogRow, NODES (+23 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.21
Nodes (10): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, comingSoon, ComingSoonDict (+2 more)

### Community 7 - "PipelineStage.tsx"
Cohesion: 0.11
Nodes (20): capGlyphs, generateMetadata(), HiringPage(), localeOf(), Params, Cand, FrameCard, Geom (+12 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (37): autoprefixer, lenis, next, next-view-transitions, dependencies, lenis, next, next-view-transitions (+29 more)

### Community 9 - "layout.tsx"
Cohesion: 0.05
Nodes (72): AboutPage(), generateMetadata(), localeOf(), Params, ClinicsPage(), generateMetadata(), localeOf(), Params (+64 more)

### Community 10 - "page.tsx"
Cohesion: 0.05
Nodes (66): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params (+58 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.29
Nodes (7): featureHours(), featureOf(), growerBundleHours(), hours3(), runCostHours(), sharedBuildHours(), sharedServiceBaseHours()

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
Cohesion: 0.11
Nodes (36): ConsentBanner(), ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), MeasurementScripts() (+28 more)

### Community 27 - "validate.ts"
Cohesion: 0.10
Nodes (31): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+23 more)

### Community 28 - "useDict"
Cohesion: 0.05
Nodes (32): Cell, Channel, Chip, ChipState, ClinicSchedule(), Geo, Palette, RGB (+24 more)

### Community 34 - "VineField.tsx"
Cohesion: 0.11
Nodes (19): absorbedProviderCash(), combinations, legacyWineryBundles, legacyWinerySetupFloor(), scopeFactor, sizes, allSizes, LineCase (+11 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.23
Nodes (12): addOnAvailable(), addOnMonthly(), addOnOf(), annualPrepay, bumpOffBareMultiple(), featureSetup(), round100(), runCost() (+4 more)

### Community 37 - "page.tsx"
Cohesion: 0.10
Nodes (20): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, CaseFact, CaseFacts(), PlayOnceVis(), PlayOnceVisProps (+12 more)

### Community 38 - "bundleHours"
Cohesion: 0.31
Nodes (11): buildOnly(), bundleHours(), ceilTo(), floorFor(), growerSetupS(), pesos2(), priced(), quote (+3 more)

## Knowledge Gaps
- **285 isolated node(s):** `Params`, `Params`, `Params`, `DOORS`, `Params` (+280 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `layout.tsx` to `canvasKit.ts`, `page.tsx`, `package.json`, `page.tsx`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `page.tsx`, `validate.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `layout.tsx` to `page.tsx`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `page.tsx`, `validate.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `useDict()` connect `canvasKit.ts` to `FloorPlan.tsx`, `FleetMap.tsx`, `page.tsx`, `PipelineStage.tsx`, `middleware.ts`, `useDict`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `Params`, `Params`, `Params` to the rest of the system?**
  _285 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05829420970266041 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._