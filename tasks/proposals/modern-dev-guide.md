# Proposal: The Modern Dev Guide

Direction B from [the Phase 1 research](../research/interactive-web-techniques.md) — the
Comeau / Stripe / Linear / Rauno lineage. Fork lives at `forks/modern-dev-guide/`; the
existing MkDocs site is untouched.

## 1. Concept

The guide reads like the docs site of a product you'd pay for: near-black or light theme,
one confident accent, Inter and JetBrains Mono, a sticky chapter rail that always shows
where you are, and prose that has been *designed* rather than dumped — recommendations and
gotchas set off in a consistent callout system, jargon defined in place via popovers, the
three latent diagrams in the text pre-rendered to SVG and placed right after the claims
they prove. That register serves this guide specifically because its whole argument is
"treat your artifacts as first-class, deliberate, owned" — a site that visibly practices
that discipline makes the argument before a word is read. Everything is static HTML+CSS
with a few grams of progressive-enhancement JS; the prose reads perfectly with JS off.

## 2. Content restructure

Same eight source documents, same information, same voice. No merges. The reorganization
is grouping and dress, not surgery.

### Page mapping

| Current | New | Notes |
|---|---|---|
| `README.md` / `guide/index.md` | **Home** (card index) | Hero thesis + "Read Start Here in its entirety. Do not skim it." as the CTA; chapter cards below; "The tools" becomes a footer strip linking the claude repo. |
| `START-HERE.md` | **Start Here** (the spine, featured card) | Stays intact end-to-end — it *is* the argument. Gains the context-stack and workflow diagrams, step treatments, callouts. |
| `harness-and-model.md` | **Part I — Foundation · Harness & Model** | Superpowers loop becomes a designed step block. |
| `writing-a-vision.md` | **Part II — Context · The Vision Document** | |
| `codebase-docs.md` | **Part II — Context · Codebase Docs** | Repo-size table becomes a designed table. |
| `writing-an-issue.md` | **Part II — Context · Writing Issues** | |
| `workflow.md` | **Part III — Execution · The Workflow** | |
| `review-loop.md` | **Part IV — Improvement · The Review Loop** | Gains the pipeline diagram. |

The part labels come straight from Start Here's own structure (§1 Foundation, §2
understanding/context, §3 workflow, Continuous improvement) — the rail teaches the mental
model for free. "Mildly rewrite" means: where a sentence is extracted into a callout it is
*moved*, not duplicated, and the surrounding paragraph gets the one-clause stitch that
requires. Nothing else changes.

### Callout candidates (extracted from the actual text)

Three types. **Recommendation** (accent border, ▸ marker), **Gotcha** (amber border, ⚠
marker), and **Own it** (heavy neutral border, no fill) — the third earns its slot because
"you must read and own what the agent wrote" is the guide's refrain, appearing on four of
seven pages; giving it a single recognizable form turns repetition into rhythm. Jargon is
handled by glossary popovers (below), not a callout type.

**Recommendation:**
- "Don't stress about using the bleeding edge as long as you're using something." — START-HERE §1
- "Run your agent on your actual machine, not in a browser tab." — harness-and-model, Practical notes
- "Keep it to a page or two. … Aim for the shortest document that can still settle a 'which way should I build this?' question correctly." — writing-a-vision
- "A good issue should be one reviewable PR." — writing-an-issue, Right-size it
- "Collapse the optional, never the essential" analog for docs: "If your documents are too long to review...make them shorter." — codebase-docs

**Gotcha:**
- "Because a guardrailed agent will often follow instructions to the letter, an over-specific rule can be worse than nothing at all." — START-HERE §2.4
- "Agents follow stale instructions exactly as faithfully as good ones (right off a cliff)…" — writing-an-issue, The two-layer issue
- "**No line numbers.** They go stale the moment the code moves." — codebase-docs, Authoring rules
- "Orchestration skills tend to be mildly specific to one repo… Use someone else's as a starting point, not a drop-in." — workflow
- "The agent passing its own tests does not mean the code is good. You have to look." — workflow, You still own the result

**Own it:**
- "**Critical:** anything you give the agent it will take at face value as truth, so docs are first-class artifacts, not afterthoughts." — START-HERE §2.2 / codebase-docs
- "If you don't own the spec it's about to implement, you don't own anything." — writing-an-issue, The payoff (and its twin in START-HERE §2.3)
- "Then read the draft by hand and edit it. *Do not skip this.*" — writing-a-vision, How to write one
- "Treat its results only as a starting point. You are responsible for what goes into the agent…" — review-loop, Seed it from your PR history

Budget: at most 2–3 callouts per page. Everything else stays prose.

### Glossary popover terms (recurring jargon, with first appearance)

| Term | First appears | One-line definition source |
|---|---|---|
| harness | START-HERE responsibilities list | START-HERE §1 / harness-and-model |
| flagship model | START-HERE §1 | harness-and-model, The model |
| context window | START-HERE intro ("provide context…") | codebase-docs, "Too many tokens" |
| spec | START-HERE §3 step 4 | harness-and-model, "Spec first" |
| skill | START-HERE §2.3 ("an agentic skill reads the dump") | workflow, "Write a skill that constrains it" |
| subagent | START-HERE §2.2 ("trivial to spawn subagents") | new one-liner distilled from existing usage |
| worktree | harness-and-model ("isolated git worktree") | workflow, Parallel agents |
| commit-pinned | START-HERE §2.3 | writing-an-issue, The two-layer issue |
| CLAUDE.md | START-HERE §2.4 | START-HERE §2.4 |
| orchestration | workflow | workflow, "Let the harness drive it" |

Definitions are one to two sentences distilled from the guide's own wording — no new
claims. Only the first occurrence per page is marked (dotted accent underline), so pages
don't turn into link soup. All definitions also live on a plain `/glossary` page, which is
the no-JS/no-popover fallback target.

### Diagrams (3, generated from markup, pre-rendered to SVG at build)

Each anchors one part of the guide, placed assertion-then-proof — immediately after the
prose that states the claim:

1. **The context stack** — from START-HERE §2's ladder ("embed much of the understanding
   ahead of time within the appropriate level of the project"): vision.md → codebase docs
   → issue → CLAUDE.md, all feeding the agent's context window. Placed after the §2 intro
   paragraph. This is the Diátaxis-style "one anchoring diagram" for the whole guide.
2. **The development workflow** — from START-HERE §3's six numbered steps: reads
   (vision → docs → task) → spec → implementation agent → review agent → "your turn"
   (smoke-test / read / understand / iterate). The list states the sequence; the diagram
   adds what the list can't — which artifacts flow between which agents. Placed directly
   under "goes something like this." A small variant reappears in The Workflow at "The
   core loop is small."
3. **The review pipeline** — from review-loop.md's list of narrow agents: the diff
   fanning out to alignment / security / craftsmanship / test-quality / doc-freshness /
   open-ended, converging to human review. Placed after "so it's a pipeline of narrow
   agents." It proves the claim that "no single context window usefully holds" it all.

### Numbered-step treatments (CSS counters + connectors, no images)

- The three responsibilities — START-HERE intro (capable model / quality harness / context)
- "Then it's your turn" checklist — START-HERE §3 (smoke-test / read / understand / iterate)
- The superpowers loop — harness-and-model (spec → implement → review → verify)

### Designed tables

- Failure → artifact table — START-HERE, Continuous improvement (this is the guide's
  feedback loop; header band in accent, generous row padding)
- Repo → docs-level table — codebase-docs, "The options, smallest to largest"
- Both get `overflow-x: auto` wrappers on mobile.

## 3. Page & navigation structure

**Home.** Typographic hero (title, the two-line thesis from the README, no imagery), then
a full-width featured Start Here card carrying the "Do not skim it" line and its reading
time, then a patterns.dev-style grid of six chapter cards grouped under the four part
labels. Each card: part label (small caps, text-2), title, one-line dek lifted from the
page's own opening, reading-time badge. Footer strip: "The tools" paragraph with the
claude-repo link.

**Chapter rail** (left, sticky, desktop ≥1100px). All seven chapters under their part
labels, current page marked in accent; beneath the current page, its h2s indented — the
rail doubles as the in-page TOC. Scrollspy (IntersectionObserver, ~30 lines inline JS)
moves an accent indicator down the h2 list as you read; the indicator slides via
`transform` only. Without JS: same rail, plain anchor links, no active state — fully
usable. On mobile the rail collapses to a slim top bar: part · chapter title · a
`<details>`-based chapter menu.

**Orientation furniture.** Each chapter header carries: part label, "Chapter n of 7", and
two metadata badges — reading time (computed from word count at build) and "current as
of {date}" (frontmatter `reviewed:` date; a fast-moving subject deserves gwern-style
expectation-setting). Footer of every chapter: prev/next cards with titles, so the guide
reads as one continuous book.

## 4. Interactive techniques, placed

| Technique | Where | Why (comprehension) | Fallback |
|---|---|---|---|
| Glossary popovers (Popover API + CSS anchor positioning) | First jargon occurrence per page | Define in place; reader keeps momentum instead of round-tripping to a glossary | Term is a real `<a>` to `/glossary#term`; unsupported browsers navigate. Click/tap-triggered (never hover-only), so touch and keyboard work identically |
| Scrollspy chapter rail | All chapters, desktop | Persistent "you are here" across a 7-chapter argument | Static linked TOC, no active state |
| Cross-document View Transitions fade | Every internal navigation | Signals "same book, next chapter" instead of a hard reload | One CSS at-rule; graceful no-op in Firefox |
| Copy-ready code blocks | The two install/command blocks (harness-and-model) + any future ones | Commands are for running, not retyping | ~15 lines shared JS adds the button; without JS the text is simply selectable |
| `<details>` disclosure | Chapter menu on mobile; candidate: the MMGIS issue-split example in writing-an-issue as an expandable aside | Collapse the optional, never the essential | Native element, works everywhere, open-by-default where content matters |
| Metadata badges | Chapter headers | Expectation-setting for a subject that changes monthly | Static text, zero dependencies |
| Diagrams as inline SVG | The 3 placements above | Assertion-then-proof rhythm (Ciechanowski arrangement) | It's a build-time SVG with a text alternative; nothing to fall back from |

**Deliberate rejections** (per the research consensus):

- **No scrollytelling, no reveal-on-scroll on prose** — fights skimming, find-in-page,
  and the guide's direct voice. Not even "whisper-quiet" reveals: pages are short and the
  content is argument, not spectacle.
- **No reading-progress bar** — chapters run 2–6 minutes; a progress bar on short content
  is noise.
- **No scroll hijacking / smooth-scroll library** (Lenis et al.) — a11y and
  reading-comfort risk.
- **No client-side search** — seven chapters and a card index; navigation is the search.
- **No hover-only interactions** — popovers are click-triggered.
- **No live playgrounds / no JS framework islands** — nothing here needs state.
- **No Starlight** — docs-portal chrome fights the editorial register.
- The site must read completely with JS disabled and in Firefox.

## 5. Typography, color & motion spec

**Fonts** (free, self-hosted woff2, variable, latin subset — two files total):

- **Inter variable** — body, headings, UI. The product-docs register of this direction
  wants a humanist sans reading "modern/direct," and Inter is its lingua franca
  (Linear/Rauno lineage). The research's serif pairings belong to Direction A.
- **JetBrains Mono variable** — code, the glossary-term underline context, ASCII texture.
  Code is a first-class citizen in a guide about coding agents.

**Scale & measure.** Reading column `max-width: 68ch`. Body fluid
`clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` (~17–19px), line-height 1.65. Utopia-style
`clamp()` type scale (~1.2 ratio) as `--step--1 … --step-4` custom properties; headings
tight (1.15–1.25 leading, `letter-spacing: -0.015em` at display sizes). Code at 0.9em.
Bold "skim layer" preserved: the guide's existing bolded theses render at 600 weight with
`--text-1` so a skimmer gets the argument from the bold alone.

**Semantic tokens** — one system, both themes via `light-dark()`, honoring
`prefers-color-scheme` plus a manual toggle (persisted in `localStorage`, applied before
first paint by a 5-line inline script; without JS you get the OS preference):

```css
:root {
  color-scheme: light dark;
  --surface-0: light-dark(#fcfcfd, #0e0e11);  /* page — never pure white/black */
  --surface-1: light-dark(#f4f4f6, #17171b);  /* cards, code, callout fills */
  --surface-2: light-dark(#ebebef, #1f1f25);  /* hover, active */
  --text-1:    light-dark(#1b1b20, #ececf0);  /* body */
  --text-2:    light-dark(#5c5c66, #9d9da8);  /* deks, badges, captions */
  --border-1:  light-dark(#e4e4e9, #26262d);  /* hairline dividers */
  --accent:    light-dark(oklch(0.52 0.19 262), oklch(0.74 0.14 262)); /* electric blue */
  --accent-soft: /* accent at ~10% alpha, callout fills & selection */
  --warn:      light-dark(oklch(0.65 0.13 75), oklch(0.78 0.12 80));   /* gotcha only */
}
```

One accent — the blue — carries links, active rail item, recommendation callouts, focus
rings, and diagram highlights. `--warn` is not a second accent; it is a functional status
hue reserved exclusively for gotcha callouts (encoding meaning, not decoration). Diagrams
are rendered twice-themed or use `currentColor`/CSS variables in the SVG so they follow
the theme. Hairline `--border-1` dividers and whitespace do the rest — emphasis by
subtraction.

**Motion.** Cross-document `@view-transition { navigation: auto; }`; old/new pages fade
180ms ease; header and chapter rail get `view-transition-name`s so they persist unmoving
across navigations. Hover/focus transitions 120ms on color/background only. Popovers fade
in over 120ms with a 2px rise. `<details>` animates via `interpolate-size:
allow-keywords` where supported. Under `@media (prefers-reduced-motion: reduce)`: view
transitions set to `animation: none` (instant swap), all transition durations zeroed,
popover motion removed. There is no scroll-driven animation anywhere, so nothing else to
gate.

## 6. Stack & build

**Astro** (Stack A from the research): zero client JS by default, content collections for
the chapters, remark/rehype pipeline for the custom markdown treatments, first-class MPA
View Transitions. No integrations, no UI framework, no Starlight.

**Dependencies** (all of them): `astro`. Dev-only: `d2` is a system binary, not an npm
dep. Everything else — callouts, popovers, scrollspy, copy buttons — is hand-written CSS
plus three tiny inline scripts (scrollspy ~30 lines, copy-button ~15, theme-toggle ~5).
Reading time is a 5-line word-count at build; no plugin needed. If custom container
syntax for callouts proves annoying in plain remark, add `remark-directive` (one small,
standard plugin) — that is the entire approved escape hatch.

**Diagrams: D2, pre-rendered, SVGs committed.** D2 over Mermaid because (a) it renders
via a native CLI at build time by design — no puppeteer/headless-chrome dependency, which
is what `mermaid-cli` drags in; (b) its output and theming are the most editorial-looking
of the options, matching this direction. The `.d2` sources live in `diagrams/`,
`npm run diagrams` regenerates SVGs (requires `brew install d2`), and the generated SVGs
are **committed**, so `npm install && npm run dev` works on any machine with no extra
toolchain. SVGs are post-processed to swap fills for CSS custom properties so they theme
with the site.

**Fonts self-hosted.** `InterVariable.woff2` and `JetBrainsMono[wght].woff2` in
`public/fonts/`, `@font-face` with `font-display: swap`, preloaded in the base layout.
No third-party requests of any kind.

**Commands & port.**

```
cd forks/modern-dev-guide
npm install
npm run dev        # astro dev --port 4321  → http://localhost:4321
npm run build      # static output to dist/
npm run diagrams   # optional; regenerates SVGs from diagrams/*.d2 (needs d2)
```

Port **4321** (Astro's default; distinct from the other fork and from MkDocs's 8000).

**File structure.**

```
forks/modern-dev-guide/
├── package.json / astro.config.mjs / README.md
├── diagrams/                  # context-stack.d2, workflow.d2, review-pipeline.d2
├── scripts/build-diagrams.sh  # d2 → src/assets/diagrams/*.svg (committed)
├── public/fonts/              # InterVariable.woff2, JetBrainsMono[wght].woff2
└── src/
    ├── content/
    │   ├── guide/             # 7 chapter .md files (frontmatter: title, dek, part,
    │   │                      #   order, reviewed) — content copied from ../../guide/
    │   └── glossary.yaml      # term → definition (+ anchor for /glossary)
    ├── layouts/Base.astro, Chapter.astro
    ├── components/            # ChapterRail, Callout, Steps, GlossaryTerm, Card,
    │   │                      # MetaBadges, PrevNext, CodeBlock, Diagram
    ├── plugins/               # remark: callout containers, glossary term marking
    ├── styles/tokens.css, base.css, prose.css
    └── pages/index.astro, guide/[slug].astro, glossary.astro
```

## 7. Risks & open questions

1. **Content is a copy, not a reference.** The fork snapshots `guide/*.md`; if the live
   guide keeps changing, they drift. Fine for a gate review; if the fork is promoted, we
   need a decision — the fork's copies become canonical, or a sync script. Flagging now.
2. **Callout extraction edits prose.** Moving a sentence into a callout means a one-clause
   stitch in the paragraph it left. I'll keep a per-page diff of every prose change for
   your review — say if you'd rather callouts *duplicate* rather than *move* sentences
   (my recommendation: move; duplication reads like a highlights reel).
3. **Glossary marking: automatic or explicit?** A remark plugin can auto-mark the first
   occurrence of each term per page (zero authoring burden, small risk of a false hit like
   "skill" in a non-jargon sense); or terms are marked explicitly in the markdown (precise,
   slightly dirties the source). I lean explicit — the guide's own ethos is deliberate
   artifacts. Your call.
4. **Accent color.** Electric blue proposed (Linear-adjacent, safe with the near-black
   theme). If you want the fork to feel less like every dev-tool site, a candidate
   alternative is a warm signal color (amber/orange family) — but then gotcha callouts
   need a different hue. Blue unless you object.
5. **"Current as of" honesty.** Proposed source is a frontmatter `reviewed:` date you set
   deliberately, not git mtime (any typo fix would falsely refresh it). Means remembering
   to bump it — consistent with the guide's own "docs are owned artifacts" stance.
6. **Browser reality check.** Firefox gets no cross-page fade and possibly
   unpolished popover anchoring (falls back to centered popover or the glossary-page
   link). Both are progressive enhancement by design — confirming you're comfortable.
7. **D2 binary.** Anyone regenerating diagrams needs `brew install d2`. Committed SVGs
   mean this never blocks build/serve. Acceptable?
8. **No search.** MkDocs Material ships search; this fork deliberately doesn't at 7
   chapters. Confirm you won't miss it.
