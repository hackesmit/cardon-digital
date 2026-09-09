# Graph Report - cardon-digital  (2026-09-08)

## Corpus Check
- 115 files · ~126,958 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 694 nodes · 1424 edges · 36 communities (27 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `599969f5`
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

## God Nodes (most connected - your core abstractions)
1. `isLocale()` - 36 edges
2. `rich()` - 29 edges
3. `useDict()` - 28 edges
4. `pageMetadata()` - 27 edges
5. `Locale` - 24 edges
6. `localePath()` - 22 edges
7. `site` - 17 edges
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
- `localeOf()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/about/page.tsx → lib/i18n/config.ts

## Import Cycles
- None detected.

## Communities (36 total, 9 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.08
Nodes (44): buildHots(), ColorKey, Hot, Layout, Series, SeriesKey, seriesValAt(), ThreeLines() (+36 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "FloorPlan.tsx"
Cohesion: 0.15
Nodes (12): FloorPlan(), Geo, Palette, READOUTS, Reservation, RGB, Table, TableKind (+4 more)

### Community 3 - "page.tsx"
Cohesion: 0.05
Nodes (77): absorbedProviderCash(), AddOn, addOnAvailable(), AddOnId, addOnMonthly(), addOnOf(), addOns, annualPrepay (+69 more)

### Community 4 - "package.json"
Cohesion: 0.10
Nodes (19): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, comingSoon, ComingSoonDict (+11 more)

### Community 5 - "FleetMap.tsx"
Cohesion: 0.08
Nodes (25): FleetMap(), LogRow, NODES, Pt, Pulse, RGB, ROADS, ROUTES (+17 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.11
Nodes (19): ClinicsPage(), generateMetadata(), localeOf(), Params, Cell, Channel, Chip, ChipState (+11 more)

### Community 7 - "PipelineStage.tsx"
Cohesion: 0.11
Nodes (20): capGlyphs, generateMetadata(), HiringPage(), localeOf(), Params, Cand, FrameCard, Geom (+12 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (37): autoprefixer, lenis, next, next-view-transitions, dependencies, lenis, next, next-view-transitions (+29 more)

### Community 9 - "layout.tsx"
Cohesion: 0.05
Nodes (69): capGlyphs, ConstructionPage(), generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params (+61 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (43): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+35 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.11
Nodes (24): AboutPage(), generateMetadata(), localeOf(), Params, generateMetadata(), Home(), localeOf(), Params (+16 more)

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
Cohesion: 0.13
Nodes (31): ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), MeasurementScripts(), ADS_ID (+23 more)

### Community 27 - "validate.ts"
Cohesion: 0.09
Nodes (33): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+25 more)

### Community 28 - "useDict"
Cohesion: 0.60
Nodes (3): BerryToBottleDesktop(), BerryToBottleMobile(), useDict()

### Community 32 - "VineyardMap.tsx"
Cohesion: 0.18
Nodes (11): CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS, RGB, VineyardMap(), en (+3 more)

### Community 33 - "winery.ts"
Cohesion: 0.28
Nodes (7): AssistantDemo(), BARS, CITED_ROW, en, es, winery, WineryDict

### Community 34 - "VineField.tsx"
Cohesion: 0.25
Nodes (7): Geom, Pt, RGB, Source, SourceKind, Trace, VineField()

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.27
Nodes (7): ConsentBanner(), consent, ConsentDict, en, es, LocaleContext, useLocale()

## Knowledge Gaps
- **275 isolated node(s):** `Params`, `Params`, `Params`, `DOORS`, `Params` (+270 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `layout.tsx` to `SitePlanVisual.tsx`, `package.json`, `page.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `page.tsx`, `Agent Instructions`, `validate.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `layout.tsx` to `package.json`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `page.tsx`, `Agent Instructions`, `validate.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `useDict()` connect `useDict` to `VineyardMap.tsx`, `canvasKit.ts`, `FloorPlan.tsx`, `SitePlanVisual.tsx`, `winery.ts`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `VineField.tsx`, `Agent Instructions`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `Params`, `Params`, `Params` to the rest of the system?**
  _275 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08446455505279035 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05123456790123457 - nodes in this community are weakly interconnected._