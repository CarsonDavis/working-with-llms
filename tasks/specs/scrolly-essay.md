# Implementation spec: Scrolly Essay fork

Builds the third fork at `forks/scrolly-essay/`: **Start Here as a scrollytelling essay**,
modeled directly on the ajinkya.ai explainers reverse-engineered in
[tasks/research/ajinkya-ai-case-study.md](../research/ajinkya-ai-case-study.md) — that
case study is **required reading and the technical reference** for the scroll engine,
scene/reveal markup vocabulary, animation toolbox, chrome, and visual design vocabulary.
Also read [tasks/research/interactive-web-techniques.md](../research/interactive-web-techniques.md)
(Direction C at the bottom) for the structural idea, and ALL source content (`README.md`
and every file in `guide/`).

Heeding the case study's own caveat ("this style trades information density for pacing…
reserve scrollytelling for one 'start here' essay"): **only the spine essay gets
scenes.** The seven child chapters are flowing deep-dive pages in the same theme.

## Hard requirements

- Touch **nothing** outside `forks/scrolly-essay/`. Do not commit; the orchestrator does.
- **All of the guide's content must be present**: the essay carries the complete text of
  `START-HERE.md` (plus the README hero/tools material); each deep-dive page carries the
  complete text of its `guide/*.md` source. Prose verbatim except edits allowed below;
  log every deviation in `CHANGES.md` (page → original → new → reason).
- No external network requests; fonts self-hosted woff2 (from fontsource packages).
- **Graceful degradation is non-negotiable.** The engine only activates by adding an
  `anim` class on `<html>` via JS, and only when `prefers-reduced-motion` is NOT
  reduced. Without that class (JS off, or reduced motion): every `[data-reveal]` is
  fully visible, scenes have natural auto height (the tall `height: NNNvh` and sticky
  pinning apply ONLY under `html.anim`), and the page reads as a normal linear essay
  top to bottom. Verify this state explicitly.
- Keyboard/touch accessible; no scroll hijacking (native scroll only — the engine only
  *reads* scroll position).

## Structure & routes

- `/` — the scrollytelling essay (all of Start Here, staged below).
- `/deep/harness-and-model/`, `/deep/writing-a-vision/`, `/deep/codebase-docs/`,
  `/deep/writing-an-issue/`, `/deep/workflow/`, `/deep/review-loop/` — flowing deep-dive
  pages (complete chapter text, no scenes). Plus `/deep/start-here-reference/` is NOT
  needed — Start Here lives in the essay itself. That's 6 deep dives, not 7.
- Deep-dive chrome: mono eyebrow (`DEEP DIVE · 02 — HARNESS & MODEL`), title, prose at
  `max-width: 62ch`, prev/next deep-dive links, and a "← Back to the essay" link that
  returns to the essay section it was linked from (use anchors on the essay's scenes).

## Stack

- **Eleventy v3**, port **8090**: `dev` → `eleventy --serve --port=8090`,
  `build` → `eleventy`. Deps: `@11ty/eleventy`, `@fontsource/space-grotesk` (variable),
  `@fontsource/ibm-plex-mono` (400 + 600). The essay page is authored as a
  Nunjucks/HTML template (`index.njk`) since scene markup is HTML-heavy; deep dives are
  markdown with a shared layout.
- One `essay.css`; one `engine.js` (`<script defer>`), adapted from the case study's
  `tick()` engine (§3 of the case study — use its scene-progress math, rAF throttling,
  eased reveal mapping with `data-from`/`data-to`/`data-dir`/`data-out-from`, generated
  scene numbering, and the **layout-settling re-ticks** on `load`, `document.fonts.ready`,
  a `ResizeObserver`, and the first-6-seconds interval). No React, no bundler, no
  dependencies — plain files (case study: "we have a real static host; skip all of this").

## Visual design (case study §"Visual design vocabulary", used as-is)

Dark-only editorial theme: bg `#0a0d14`, ink `#eef2fb`, muted `#8b95ab`, accents
`#5b9cff` (blue), `#36d6c3` (teal), `#ffc65c` (amber). Space Grotesk for display/body
(`clamp(28px, 4.4vw, 52px)/1.05`, letter-spacing −0.025em on headlines; prose
`max-width: 54ch` in scenes, 62ch on deep dives, `text-wrap: pretty`). IBM Plex Mono for
eyebrows (13px, `letter-spacing: 0.3em`, uppercase, accent), captions, numbers, labels.
Cards: 1px `rgba(255,255,255,0.09)` border, 16px radius, subtle top gradient; highlighted
card gets accent-tinted border. Chrome: fixed 3px top progress bar
(blue→teal→amber gradient, `transform: scaleX`), fixed bottom-left mono corner caption
(`NN   Scene title`). Body text in scenes ≥17px and AA against `#0a0d14`.

## The essay: scene choreography

All of START-HERE.md's text appears, in order, distributed across these scenes. Scene
heights are starting values — tune while verifying. Reveal staggers per the case study
(authored `data-from`/`data-to` offsets ~0.1 apart). Every scene has an `id` anchor and
`data-title` for the corner caption.

1. **Hero** (`100vh`, `#hero`): eyebrow `WORKING WITH LLMS`, title, the README thesis
   ("Modern agents write good code. The hard part is getting them to build the *right*
   thing, the *right* way, for *your* project."), a mono hint "Scroll ↓". The README's
   "This guide will not try to teach you everything…" paragraph follows as the first
   reveal beat.
2. **The question** (`~260vh`, `#the-question`): Start Here's opening — "Modern agentic
   coding systems are extremely good at following instructions." large; then the "When
   you see them write bad code…" paragraph; then "In 2026, the question is no longer…"
   with the three emphasized phrases (**what you actually wanted** / **whole project** /
   **constraints**) revealing as three staggered accent lines.
3. **Three responsibilities** (`~280vh`, `#responsibilities`): "So when working with
   LLMs you have a few clear responsibilities:" then the three numbered items as three
   cards staggering up (`data-dir="u"`), numbered `01/02/03` in mono accent.
4. **Foundation** (`~300vh`, `#foundation`): §1's Model and Harness paragraphs as two
   beats; the superpowers mention; then the harness-and-model arrow-link becomes a
   "Go deeper" card (see below). Include the "Harnesses and models improve and change
   over time…" sentence as a muted aside beat.
5. **The context stack** (`~380vh`, `#context`): the §2 sticky-diagram scene — the
   centerpiece. A pinned stack diagram (four labeled layers: `vision.md` /
   `codebase docs` / `the issue` / `CLAUDE.md`, plain bordered divs feeding an "agent
   context window" box) sits on one side while §2's intro and the FULL text of §2.1,
   §2.2, §2.3, §2.4 scroll past as steps on the other side; as each subsection enters,
   its layer activates (accent border + others dim) — use the case study's `pipeline`
   pattern for N=4 across the scene progress. On narrow screens the diagram sits above
   the steps, unpinned. Each subsection's arrow-link becomes a "Go deeper" card at the
   end of its step.
6. **The workflow** (`~360vh`, `#workflow`): §3 — the six numbered steps as a vertical
   pipeline activating sequentially (case-study `pipeline` pattern, N=6), each step's
   full sentence as its label; then "Then it's your turn." and the four checklist items
   staggering in; the workflow arrow-link as a "Go deeper" card.
7. **Continuous improvement** (`~300vh`, `#improvement`): the section prose, then the
   four-row failure→artifact table with rows revealing sequentially (rows from the
   actual table); the review arrow-link as a "Go deeper" card; the closing "Do this and
   your harness will get better every cycle…" line as the scene's last beat, large.
8. **Outro** (auto height, `#go-deeper`, not a scene): "Go deeper" grid of all 6
   deep-dive cards (title + dek), the README "The tools" paragraph as a colophon, and a
   mono footer line.

**"Go deeper" cards:** each `→ **[more on X](file.md)**` arrow-link in Start Here is
replaced by a linked card (mono eyebrow `GO DEEPER`, target title, one-line dek from
the target's opening). Log each replacement in CHANGES.md. No other prose changes.

## Deep-dive pages

Complete verbatim chapter text. Allowed edits (log all): H1 → frontmatter title;
internal cross-links remapped to this fork's routes (links to START-HERE sections point
at the essay's scene anchors); the two MkDocs-only artifacts skipped as in the other
forks (`guide/index.md` stub). No sidenotes/callouts/popovers here — this fork's idea
is the essay; deep dives stay clean, with ordinary markdown rendering (styled lists,
tables, code blocks matching the theme).

## Verification (all required before reporting done)

1. Clean `npm install && npm run build`; serve on 8090; curl `/` and all 6 deep-dive
   routes — 200s; grep the essay HTML for scene ids and `data-reveal` markup, and each
   deep-dive page for a distinctive verbatim sentence from its source.
2. **Content completeness check:** for the essay, verify programmatically that every
   paragraph of START-HERE.md's text appears in the built HTML (normalize whitespace;
   allowed edits excepted). Same for each deep dive vs. its source. State the result
   explicitly.
3. Zero external requests in built output.
4. Playwright/page-capture visual checks at 1440px: hero; mid-scroll of the context
   stack scene showing the pinned diagram with one layer active; mid-scroll of the
   workflow pipeline with ~3 steps active; the improvement table mid-reveal; a deep-dive
   page. Scroll programmatically (`window.scrollTo`) to capture mid-scene states.
   Confirm progress bar and corner caption update. Also capture 390px mobile (diagram
   unpinned above steps).
5. **Degradation check:** with `javaScriptEnabled: false`, capture the essay — all text
   visible, no dead viewport-tall gaps, reads top to bottom. Also emulate
   `prefers-reduced-motion: reduce` with JS on — same expectation.
6. Kill all servers when done.

Report: what was built, explicit verification results (including the completeness
check), deviations with reasons, CHANGES.md summary.
