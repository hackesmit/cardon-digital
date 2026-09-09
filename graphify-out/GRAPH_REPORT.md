# Graph Report - cardon-digital  (2026-09-09)

## Corpus Check
- 119 files · ~122,179 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 699 nodes · 1569 edges · 35 communities (26 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `04d09a26`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- canvasKit.ts
- compilerOptions
- FloorPlan.tsx
- page.tsx
- ModuleScreen.tsx
- ClinicSchedule.tsx
- ModuleFloors.tsx
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
1. `Locale` - 36 edges
2. `rich()` - 35 edges
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

## Communities (35 total, 9 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.08
Nodes (43): buildHots(), ColorKey, Hot, Layout, Series, SeriesKey, seriesValAt(), ThreeLines() (+35 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "FloorPlan.tsx"
Cohesion: 0.09
Nodes (25): generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames(), showcaseEnabled() (+17 more)

### Community 3 - "page.tsx"
Cohesion: 0.08
Nodes (27): AddOn, addOns, BySize, CatalogueFeature, CurrencyCode, groupLocale, growerBundleS, growerCatalogue (+19 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.15
Nodes (10): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+2 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.10
Nodes (21): generateMetadata(), localeOf(), Params, PrivacyPage(), generateMetadata(), localeOf(), Params, TermsPage() (+13 more)

### Community 7 - "ModuleFloors.tsx"
Cohesion: 0.29
Nodes (10): FloorChart(), bundleLines(), ModuleFloors(), BundleItem, currencyByLocale, formatAmount(), formatPrice(), moduleFloors (+2 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (37): autoprefixer, lenis, next, next-view-transitions, dependencies, lenis, next, next-view-transitions (+29 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (42): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+34 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.20
Nodes (17): addOnSize(), buildOnly(), bundleHours(), ceilTo(), featureOf(), floorFor(), growerBundleHours(), growerSetupS() (+9 more)

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
Nodes (73): AboutPage(), generateMetadata(), localeOf(), Params, capGlyphs, generateMetadata(), localeOf(), Params (+65 more)

### Community 34 - "VineField.tsx"
Cohesion: 0.08
Nodes (24): absorbedProviderCash(), AddOnId, combinations, featureHours(), featureSetup(), legacyWineryBundles, legacyWinerySetupFloor(), modules (+16 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.20
Nodes (14): line(), addOnAvailable(), addOnMonthly(), addOnOf(), annualPrepay, bumpOffBareMultiple(), round100(), roundHalfDown() (+6 more)

### Community 36 - "localePath"
Cohesion: 0.19
Nodes (15): MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence(), mixRules() (+7 more)

### Community 37 - "page.tsx"
Cohesion: 0.08
Nodes (29): BerryToBottleDesktop(), BerryToBottleMobile(), CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS, RGB (+21 more)

### Community 45 - "SiteShell.tsx"
Cohesion: 0.09
Nodes (23): ComingSoonPage(), generateMetadata(), localeOf(), Params, metadata, ContourField(), Mark(), MarkVariant (+15 more)

## Knowledge Gaps
- **239 isolated node(s):** `Params`, `Params`, `Params`, `DOORS`, `Params` (+234 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `page.tsx` to `FloorPlan.tsx`, `page.tsx`, `localePath`, `ModuleScreen.tsx`, `ClinicSchedule.tsx`, `ModuleFloors.tsx`, `page.tsx`, `page.tsx`, `SiteShell.tsx`, `validate.ts`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `page.tsx` to `FloorPlan.tsx`, `ClinicSchedule.tsx`, `page.tsx`, `SiteShell.tsx`, `validate.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `rich()` connect `page.tsx` to `FloorPlan.tsx`, `SitePlanVisual.tsx`, `localePath`, `ModuleFloors.tsx`, `page.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `Params`, `Params`, `Params` to the rest of the system?**
  _239 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08408163265306122 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `FloorPlan.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._