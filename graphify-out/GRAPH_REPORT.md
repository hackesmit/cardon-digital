# Graph Report - cardon-digital  (2026-09-09)

## Corpus Check
- 123 files · ~123,523 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 709 nodes · 1573 edges · 35 communities (25 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4c5e6e92`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- canvasKit.ts
- compilerOptions
- page.tsx
- ModuleScreen.tsx
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
- page.tsx
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- page.tsx
- VineField.tsx
- SitePlanVisual.tsx
- localePath
- page.tsx
- BridgeMap.tsx
- .eslintrc.json

## God Nodes (most connected - your core abstractions)
1. `Locale` - 37 edges
2. `rich()` - 35 edges
3. `isLocale()` - 34 edges
4. `localePath()` - 32 edges
5. `pageMetadata()` - 23 edges
6. `quote` - 20 edges
7. `site` - 17 edges
8. `Reveal()` - 15 edges
9. `compilerOptions` - 15 edges
10. `useDict()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `localeOf()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/coming-soon/page.tsx → lib/i18n/config.ts
- `localeOf()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/contacto/page.tsx → lib/i18n/config.ts
- `generateMetadata()` --calls--> `pageMetadata()`  [EXTRACTED]
  app/[locale]/contacto/page.tsx → lib/i18n/metadata.ts
- `ContactPage()` --calls--> `rich()`  [EXTRACTED]
  app/[locale]/contacto/page.tsx → lib/i18n/rich.tsx

## Import Cycles
- None detected.

## Communities (35 total, 10 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.11
Nodes (30): BLACK, clamp01(), dedupe(), drawFlow(), easeInOut(), fitCanvas(), hexToRgb(), makeTrace() (+22 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (28): AddOn, addOns, BundleItem, BySize, CatalogueFeature, CurrencyCode, groupLocale, growerBundleS (+20 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.07
Nodes (26): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+18 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.07
Nodes (28): generateMetadata(), localeOf(), Params, PrivacyPage(), generateMetadata(), localeOf(), Params, TermsPage() (+20 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-next, lenis, next, next-view-transitions, dependencies, lenis (+33 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (43): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+35 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.16
Nodes (19): addOnAvailable(), addOnMonthly(), addOnOf(), addOnSize(), buildOnly(), bundleHours(), ceilTo(), featureOf() (+11 more)

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

### Community 28 - "page.tsx"
Cohesion: 0.09
Nodes (23): ComingSoonPage(), generateMetadata(), localeOf(), Params, metadata, ContourField(), Mark(), MarkVariant (+15 more)

### Community 33 - "page.tsx"
Cohesion: 0.05
Nodes (85): AboutPage(), generateMetadata(), localeOf(), Params, DemoPage(), localeOf(), Params, { redirect } (+77 more)

### Community 34 - "VineField.tsx"
Cohesion: 0.08
Nodes (23): absorbedProviderCash(), AddOnId, combinations, legacyWineryBundles, legacyWinerySetupFloor(), moduleFloors, modules, ModuleSelection (+15 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.21
Nodes (14): line(), annualPrepay, bumpOffBareMultiple(), featureHours(), featureSetup(), priced(), round100(), roundHalfDown() (+6 more)

### Community 36 - "localePath"
Cohesion: 0.16
Nodes (18): FloorChart(), MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence() (+10 more)

### Community 37 - "page.tsx"
Cohesion: 0.08
Nodes (28): BerryToBottleDesktop(), BerryToBottleMobile(), CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS, RGB (+20 more)

### Community 39 - "BridgeMap.tsx"
Cohesion: 0.31
Nodes (7): BRIDGE_NODES, bridgeLabels(), bridgeMask(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS

## Knowledge Gaps
- **242 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `Params` (+237 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `page.tsx` to `page.tsx`, `localePath`, `ModuleScreen.tsx`, `ClinicSchedule.tsx`, `BridgeMap.tsx`, `page.tsx`, `validate.ts`, `page.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `page.tsx` to `page.tsx`, `validate.ts`, `page.tsx`, `ClinicSchedule.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `rich()` connect `page.tsx` to `page.tsx`, `SitePlanVisual.tsx`, `localePath`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _242 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11092436974789915 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07311827956989247 - nodes in this community are weakly interconnected._