# Graph Report - cardon-digital  (2026-09-02)

## Corpus Check
- 84 files · ~100,730 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 455 nodes · 838 edges · 29 communities (21 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0d7fbd5b`
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
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts

## God Nodes (most connected - your core abstractions)
1. `isLocale()` - 30 edges
2. `useDict()` - 24 edges
3. `pageMetadata()` - 23 edges
4. `Locale` - 20 edges
5. `localePath()` - 20 edges
6. `rich()` - 19 edges
7. `site` - 16 edges
8. `compilerOptions` - 15 edges
9. `ThreeLines()` - 12 edges
10. `readPalette()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `FloorPlan()` --calls--> `useDict()`  [EXTRACTED]
  components/pages/restaurants/FloorPlan.tsx → lib/i18n/LocaleProvider.tsx
- `localeOf()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/coming-soon/page.tsx → lib/i18n/config.ts
- `localeOf()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/industries/clinics/page.tsx → lib/i18n/config.ts
- `generateMetadata()` --calls--> `pageMetadata()`  [EXTRACTED]
  app/[locale]/industries/clinics/page.tsx → lib/i18n/metadata.ts

## Import Cycles
- None detected.

## Communities (29 total, 8 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.08
Nodes (44): Params, buildHots(), ColorKey, Hot, Layout, Series, SeriesKey, seriesValAt() (+36 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "FloorPlan.tsx"
Cohesion: 0.09
Nodes (26): generateMetadata(), localeOf(), Params, RestaurantsPage(), EnkantoCaseStudy(), generateMetadata(), localeOf(), Params (+18 more)

### Community 3 - "page.tsx"
Cohesion: 0.11
Nodes (21): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, BerryToBottleDesktop(), BerryToBottleMobile(), PlayOnceVis(), PlayOnceVisProps (+13 more)

### Community 4 - "package.json"
Cohesion: 0.09
Nodes (21): ComingSoonPage(), generateMetadata(), localeOf(), Params, comingSoon, ComingSoonDict, en, es (+13 more)

### Community 5 - "FleetMap.tsx"
Cohesion: 0.07
Nodes (31): capGlyphs, ConstructionPage(), generateMetadata(), localeOf(), Params, FleetMap(), LogRow, NODES (+23 more)

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
Cohesion: 0.12
Nodes (25): generateMetadata(), metadata, routes, sitemap(), ContourField(), Footer(), Nav(), NotFoundBody() (+17 more)

### Community 10 - "page.tsx"
Cohesion: 0.13
Nodes (17): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), SpotlightFrames(), Geom, Pt (+9 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.19
Nodes (12): Home(), currencyByLocale, CurrencyCode, formatAmount(), formatMoney(), groupLocale, pricing, pricingFor() (+4 more)

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
Cohesion: 0.16
Nodes (18): LocaleLayout(), generateMetadata(), localeOf(), generateMetadata(), localeOf(), Params, PrivacyPage(), generateMetadata() (+10 more)

## Knowledge Gaps
- **206 isolated node(s):** `Params`, `Params`, `Params`, `capGlyphs`, `Params` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useDict()` connect `page.tsx` to `canvasKit.ts`, `FloorPlan.tsx`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `layout.tsx`, `page.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `middleware.ts` to `canvasKit.ts`, `FloorPlan.tsx`, `page.tsx`, `package.json`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `layout.tsx`, `page.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `pageMetadata()` connect `middleware.ts` to `canvasKit.ts`, `FloorPlan.tsx`, `page.tsx`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `layout.tsx`, `page.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `Params`, `Params`, `Params` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08455625436757512 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `FloorPlan.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08712121212121213 - nodes in this community are weakly interconnected._