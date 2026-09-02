# Graph Report - graph-wt2  (2026-09-02)

## Corpus Check
- 61 files · ~82,944 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 322 nodes · 380 edges · 33 communities (21 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8886d809`
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
- page.tsx
- middleware.ts
- post-checkout
- post-merge
- pre-commit
- pre-push
- prepare-commit-msg
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- Media credits

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `ThreeLines()` - 10 edges
3. `readPalette()` - 10 edges
4. `clamp01()` - 7 edges
5. `Reveal()` - 7 edges
6. `Agent Instructions` - 7 edges
7. `Project Instructions for AI Agents` - 7 edges
8. `Cardon Digital` - 7 edges
9. `easeInOut()` - 6 edges
10. `makeTrace()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `SectorMap()` --calls--> `readPalette()`  [EXTRACTED]
  components/pages/home/SectorMap.tsx → components/pages/home/canvasKit.ts
- `seriesValAt()` --calls--> `clamp01()`  [EXTRACTED]
  components/pages/enkanto/ThreeLines.tsx → components/pages/home/canvasKit.ts
- `ThreeLines()` --calls--> `clamp01()`  [EXTRACTED]
  components/pages/enkanto/ThreeLines.tsx → components/pages/home/canvasKit.ts
- `ThreeLines()` --calls--> `easeInOut()`  [EXTRACTED]
  components/pages/enkanto/ThreeLines.tsx → components/pages/home/canvasKit.ts
- `ThreeLines()` --calls--> `fitCanvas()`  [EXTRACTED]
  components/pages/enkanto/ThreeLines.tsx → components/pages/home/canvasKit.ts

## Import Cycles
- None detected.

## Communities (33 total, 12 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.12
Nodes (34): ColorKey, Hot, HOTS, Layout, Series, seriesValAt(), ThreeLines(), BLACK (+26 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+19 more)

### Community 2 - "FloorPlan.tsx"
Cohesion: 0.11
Nodes (12): metadata, metadata, SpotlightFrames(), Geo, Palette, READOUTS, Reservation, RGB (+4 more)

### Community 3 - "page.tsx"
Cohesion: 0.11
Nodes (11): metadata, PlayOnceVis(), PlayOnceVisProps, SpotlightFrames(), CENTROIDS, FLAG_ANCHORS, pathD(), Plot (+3 more)

### Community 4 - "package.json"
Cohesion: 0.10
Nodes (19): dependencies, lenis, next, next-view-transitions, react, react-dom, name, private (+11 more)

### Community 5 - "FleetMap.tsx"
Cohesion: 0.13
Nodes (14): metadata, FleetMap(), LogRow, NODES, Pt, Pulse, RGB, ROADS (+6 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.14
Nodes (12): metadata, Cell, Channel, Chip, ChipState, ClinicSchedule(), Geo, Palette (+4 more)

### Community 7 - "PipelineStage.tsx"
Cohesion: 0.14
Nodes (12): metadata, Cand, FrameCard, Geom, Parked, PipelineStage(), Pt, RosterEntry (+4 more)

### Community 8 - "devDependencies"
Cohesion: 0.13
Nodes (15): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom (+7 more)

### Community 9 - "layout.tsx"
Cohesion: 0.18
Nodes (9): archivo, metadata, ContourField(), Footer(), links, industryLinks, linksAfter, linksBefore (+1 more)

### Community 10 - "page.tsx"
Cohesion: 0.18
Nodes (9): metadata, SpotlightFrames(), Geom, Pt, RGB, Source, SourceKind, Trace (+1 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.17
Nodes (11): Agent Context Profiles, Agent Instructions, Beads Issue Tracker, Beads Issue Tracker, Non-Interactive Shell Commands, Quick Reference, Quick Reference, Quick Reference (+3 more)

### Community 12 - "Project Instructions for AI Agents"
Cohesion: 0.20
Nodes (9): Agent Context Profiles, Architecture Overview, Beads Issue Tracker, Build & Test, Conventions & Patterns, Project Instructions for AI Agents, Quick Reference, Rules (+1 more)

### Community 13 - "SitePlanVisual.tsx"
Cohesion: 0.22
Nodes (9): ChipPlace, Conf, DESKTOP_CONF, PORTRAIT_CHIPS, PORTRAIT_CONF, PORTRAIT_DAYS, PORTRAIT_LEADERS, PORTRAIT_PLOTS (+1 more)

### Community 14 - "Beads - AI-Native Issue Tracking"
Cohesion: 0.22
Nodes (8): Beads - AI-Native Issue Tracking, Essential Commands, Get Started with Beads, Learn More, Quick Start, What is Beads?, Why Beads?, Working with Issues

### Community 15 - "page.tsx"
Cohesion: 0.31
Nodes (4): metadata, OpsCompression(), PlayOnceVis(), SpotlightFrames()

### Community 16 - "Cardon Digital"
Cohesion: 0.25
Nodes (7): Cardon Digital, Layout, License, Pre-launch gate, Running locally, Scripts, Stack

### Community 17 - "Beads"
Cohesion: 0.29
Nodes (6): Beads, Core CLI Workflow, First Step, Preferred Route, Rules, What Belongs In Beads

### Community 32 - "Media credits"
Cohesion: 0.50
Nodes (3): enkanto-valle.webp, Media credits, valle-vineyard.webp

## Knowledge Gaps
- **160 isolated node(s):** `metadata`, `metadata`, `metadata`, `metadata`, `metadata` (+155 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Reveal()` connect `FloorPlan.tsx` to `page.tsx`, `page.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `metadata` to the rest of the system?**
  _160 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12010796221322537 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `FloorPlan.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._