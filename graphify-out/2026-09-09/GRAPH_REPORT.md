# Graph Report - cardon-digital  (2026-09-09)

## Corpus Check
- 113 files · ~116,166 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 663 nodes · 1494 edges · 33 communities (24 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bcc2aeda`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- canvasKit.ts
- compilerOptions
- FloorPlan.tsx
- page.tsx
- ClinicSchedule.tsx
- devDependencies
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
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- page.tsx
- VineField.tsx
- SitePlanVisual.tsx
- localePath
- page.tsx
- SiteShell.tsx

## God Nodes (most connected - your core abstractions)
1. `rich()` - 35 edges
2. `Locale` - 32 edges
3. `isLocale()` - 32 edges
4. `localePath()` - 32 edges
5. `pageMetadata()` - 23 edges
6. `quote` - 20 edges
7. `site` - 17 edges
8. `useDict()` - 16 edges
9. `Reveal()` - 15 edges
10. `compilerOptions` - 15 edges

## Surprising Connections (you probably didn't know these)
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `generateMetadata()` --calls--> `pageMetadata()`  [EXTRACTED]
  app/[locale]/about/page.tsx → lib/i18n/metadata.ts
- `AboutPage()` --calls--> `rich()`  [EXTRACTED]
  app/[locale]/about/page.tsx → lib/i18n/rich.tsx
- `localeOf()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/contacto/page.tsx → lib/i18n/config.ts
- `generateMetadata()` --calls--> `pageMetadata()`  [EXTRACTED]
  app/[locale]/contacto/page.tsx → lib/i18n/metadata.ts

## Import Cycles
- None detected.

## Communities (33 total, 9 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.10
Nodes (39): buildHots(), ColorKey, Hot, Layout, Series, SeriesKey, seriesValAt(), ThreeLines() (+31 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "FloorPlan.tsx"
Cohesion: 0.32
Nodes (8): featureSetup(), growerBundleHours(), growerSetupS(), priced(), round100(), round500(), roundHalfDown(), usdFromMxn()

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (28): AddOn, addOns, BundleItem, BySize, CatalogueFeature, CurrencyCode, groupLocale, growerBundleS (+20 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.07
Nodes (26): EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, SpotlightFrames(), about, AboutDict, en (+18 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (37): autoprefixer, lenis, next, next-view-transitions, dependencies, lenis, next, next-view-transitions (+29 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (42): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+34 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.17
Nodes (17): addOnAvailable(), addOnMonthly(), addOnOf(), addOnSize(), buildOnly(), bundleHours(), ceilTo(), featureHours() (+9 more)

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
Cohesion: 0.50
Nodes (3): enkanto-valle.webp, Media credits, valle-vineyard.webp

### Community 21 - "middleware.ts"
Cohesion: 0.11
Nodes (36): ConsentBanner(), ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), MeasurementScripts() (+28 more)

### Community 27 - "validate.ts"
Cohesion: 0.09
Nodes (33): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+25 more)

### Community 33 - "page.tsx"
Cohesion: 0.06
Nodes (62): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), generateMetadata(), localeOf(), ModulosPage() (+54 more)

### Community 34 - "VineField.tsx"
Cohesion: 0.08
Nodes (23): absorbedProviderCash(), AddOnId, combinations, legacyWineryBundles, legacyWinerySetupFloor(), moduleFloors, modules, ModuleSelection (+15 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.36
Nodes (8): line(), annualPrepay, bumpOffBareMultiple(), runCost(), runCostBreakdown(), serviceLineMonthly(), sharedServiceBase(), sharedServiceBaseBreakdown()

### Community 36 - "localePath"
Cohesion: 0.20
Nodes (17): MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence(), mixRules() (+9 more)

### Community 37 - "page.tsx"
Cohesion: 0.07
Nodes (33): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, BerryToBottleDesktop(), BerryToBottleMobile(), CaseFact, CaseFacts() (+25 more)

### Community 45 - "SiteShell.tsx"
Cohesion: 0.07
Nodes (45): AboutPage(), generateMetadata(), localeOf(), Params, ComingSoonPage(), generateMetadata(), localeOf(), Params (+37 more)

## Knowledge Gaps
- **226 isolated node(s):** `Params`, `Params`, `Params`, `DOORS`, `Params` (+221 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `SiteShell.tsx` to `page.tsx`, `page.tsx`, `localePath`, `page.tsx`, `ClinicSchedule.tsx`, `page.tsx`, `validate.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `SiteShell.tsx` to `page.tsx`, `page.tsx`, `ClinicSchedule.tsx`, `page.tsx`, `validate.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `rich()` connect `page.tsx` to `SitePlanVisual.tsx`, `localePath`, `page.tsx`, `ClinicSchedule.tsx`, `page.tsx`, `SiteShell.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `Params`, `Params`, `Params` to the rest of the system?**
  _226 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09797979797979799 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07311827956989247 - nodes in this community are weakly interconnected._