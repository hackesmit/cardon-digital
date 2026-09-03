# Graph Report - cardon-digital  (2026-09-03)

## Corpus Check
- 100 files · ~109,949 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 523 nodes · 1028 edges · 30 communities (21 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d00caa6e`
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
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts

## God Nodes (most connected - your core abstractions)
1. `isLocale()` - 32 edges
2. `useDict()` - 28 edges
3. `pageMetadata()` - 25 edges
4. `rich()` - 23 edges
5. `Locale` - 22 edges
6. `localePath()` - 22 edges
7. `site` - 17 edges
8. `compilerOptions` - 15 edges
9. `ThreeLines()` - 12 edges
10. `trackConversion()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `FloorPlan()` --calls--> `useDict()`  [EXTRACTED]
  components/pages/restaurants/FloorPlan.tsx → lib/i18n/LocaleProvider.tsx
- `AboutPage()` --calls--> `rich()`  [EXTRACTED]
  app/[locale]/about/page.tsx → lib/i18n/rich.tsx
- `localeOf()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/coming-soon/page.tsx → lib/i18n/config.ts
- `localeOf()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/industries/clinics/page.tsx → lib/i18n/config.ts

## Import Cycles
- None detected.

## Communities (30 total, 9 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.10
Nodes (39): buildHots(), ColorKey, Hot, Layout, Series, SeriesKey, seriesValAt(), ThreeLines() (+31 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "FloorPlan.tsx"
Cohesion: 0.11
Nodes (19): generateMetadata(), localeOf(), Params, RestaurantsPage(), FloorPlan(), Geo, Palette, READOUTS (+11 more)

### Community 3 - "page.tsx"
Cohesion: 0.06
Nodes (38): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, BerryToBottleDesktop(), BerryToBottleMobile(), CaseFact, CaseFacts() (+30 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (28): EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, SpotlightFrames(), about, AboutDict, en (+20 more)

### Community 5 - "FleetMap.tsx"
Cohesion: 0.07
Nodes (32): capGlyphs, ConstructionPage(), generateMetadata(), localeOf(), Params, FleetMap(), LogRow, NODES (+24 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.11
Nodes (19): ClinicsPage(), generateMetadata(), localeOf(), Params, Cell, Channel, Chip, ChipState (+11 more)

### Community 7 - "PipelineStage.tsx"
Cohesion: 0.11
Nodes (20): capGlyphs, generateMetadata(), HiringPage(), localeOf(), Params, Cand, FrameCard, Geom (+12 more)

### Community 8 - "devDependencies"
Cohesion: 0.06
Nodes (34): autoprefixer, lenis, next, next-view-transitions, dependencies, lenis, next, next-view-transitions (+26 more)

### Community 9 - "layout.tsx"
Cohesion: 0.07
Nodes (49): AboutPage(), generateMetadata(), localeOf(), Params, capGlyphs, generateMetadata(), localeOf(), Params (+41 more)

### Community 10 - "page.tsx"
Cohesion: 0.27
Nodes (8): ComingSoonPage(), generateMetadata(), localeOf(), Params, comingSoon, ComingSoonDict, en, es

### Community 11 - "Agent Instructions"
Cohesion: 0.17
Nodes (16): generateMetadata(), Home(), localeOf(), Params, PlayOnceVis(), SpotlightFrames(), PricingBundles(), currencyByLocale (+8 more)

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
Cohesion: 0.12
Nodes (34): ConsentBanner(), ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), MeasurementScripts() (+26 more)

## Knowledge Gaps
- **219 isolated node(s):** `Params`, `Params`, `Params`, `Params`, `capGlyphs` (+214 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useDict()` connect `page.tsx` to `canvasKit.ts`, `FloorPlan.tsx`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `layout.tsx`, `middleware.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `layout.tsx` to `FloorPlan.tsx`, `page.tsx`, `package.json`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `page.tsx`, `Agent Instructions`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `pageMetadata()` connect `layout.tsx` to `FloorPlan.tsx`, `page.tsx`, `package.json`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `Agent Instructions`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `Params`, `Params`, `Params` to the rest of the system?**
  _219 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10048309178743961 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `FloorPlan.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10869565217391304 - nodes in this community are weakly interconnected._