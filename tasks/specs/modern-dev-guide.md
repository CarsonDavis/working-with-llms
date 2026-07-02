# Implementation spec: Modern Dev Guide fork

Builds [the modern-dev-guide proposal](../proposals/modern-dev-guide.md) at
`forks/modern-dev-guide/`. The proposal is **required reading and authoritative on design
intent**; this spec is authoritative on implementation details and hard requirements.
Where they conflict, this spec wins.

## Hard requirements

- Touch **nothing** outside `forks/modern-dev-guide/`. Never edit `guide/`, `README.md`,
  `mkdocs.yml`, or anything else at repo root. Do not commit; the orchestrator commits.
- Prose is copied **verbatim** from the source files except edits this spec and proposal
  §2 explicitly allow. Log **every** prose deviation (including the one-clause stitches
  around moved callout sentences) in `forks/modern-dev-guide/CHANGES.md` as:
  page → original text → new text → reason.
- No external network requests from the built site; fonts self-hosted. The site must
  read perfectly with JavaScript disabled (rail becomes static links, terms become links
  to /glossary, code blocks selectable, theme follows OS).
- Keyboard-accessible everything; all motion gated behind `prefers-reduced-motion`;
  both themes AA for body text.

## Stack

- **Astro latest** (no Starlight, no UI framework integrations). npm deps: `astro`,
  `remark-directive`, plus fonts: `@fontsource-variable/inter`,
  `@fontsource-variable/jetbrains-mono` (copy latin variable woff2 into `public/fonts/`,
  `@font-face` + preload in the base layout).
- Content collection `guide` with schema: `title`, `dek`, `part` (enum: Foundation /
  Context / Execution / Improvement — Start Here sits above the parts, `part: null`),
  `order`, `reviewed` (date). Set every `reviewed:` to **2026-07-02**.
- `src/content/glossary.yaml`: the 10 terms from proposal §2 with 1–2 sentence
  definitions distilled from the guide's own wording (no new claims).
- Client JS: exactly four tiny inline/shared scripts — scrollspy (~30 lines), copy
  button (~15), theme toggle (~5, before first paint), glossary-popover enhancer
  (~20 lines, see below). Nothing else.

## Diagrams (D2 → committed SVG)

- Try the official **`@terrastruct/d2` npm package** (WASM) as a devDependency with a
  small `scripts/build-diagrams.mjs`; if it proves unusable, fall back to installing the
  d2 CLI **user-locally** via `curl -fsSL https://d2lang.com/install.sh | sh -s --`
  (no sudo, no brew). Either way the generated SVGs are **committed** under
  `src/assets/diagrams/` so `npm install && npm run dev` never needs the toolchain.
- Three sources in `diagrams/`, content per proposal §2 (labels use the guide's own
  words): `context-stack.d2` (vision → codebase docs → issue → CLAUDE.md feeding the
  agent's context window), `workflow.d2` (the six steps: reads vision → reads docs →
  reads task → spec → implementation agent → review agent → "your turn": smoke-test /
  read / understand / iterate), `review-pipeline.d2` (diff fans out to the six narrow
  agents, converging to human review). Keep them simple boxes-and-arrows; no decoration.
- Post-process the SVGs: strip fixed width/height (keep viewBox), swap fills/strokes to
  `currentColor` / `var(--…)` tokens so they follow the theme; wrap in a `<figure>` with
  a text alternative. Placements per proposal §2 (context-stack after START-HERE §2
  intro; workflow under "goes something like this", small variant in The Workflow at
  "The core loop is small"; pipeline after "so it's a pipeline of narrow agents").

## Markdown treatments (remark-directive)

- **Callouts:** `:::recommendation` / `:::gotcha` / `:::ownit` containers → styled
  asides with markers (▸ / ⚠ / no icon, heavy neutral border) and a small type label
  (RECOMMENDATION / GOTCHA / OWN IT in letterspaced caps). Apply exactly the sentences
  in proposal §2 — **move** them (one-clause stitch allowed, logged). Max 2–3 per page.
- **Glossary terms:** explicit inline directive `:term[harness]` (optionally
  `:term[specs]{key=spec}` for inflections) → renders
  `<a class="term" href="/glossary#harness">harness</a>` with dotted accent underline,
  plus a hidden `[data-def]` payload. First occurrence per page only.
- **Popover behavior:** the ~20-line enhancer intercepts click on `.term` when
  `HTMLElement.prototype.showPopover` exists, opens a top-layer popover anchored to the
  term (CSS anchor positioning where supported, centered-above fallback), Esc/click-out
  dismiss, focus returned to the term. Without JS or Popover support the term is just a
  link to `/glossary#term`. Never hover-triggered.

## Pages & chrome

- **Home (`/`):** typographic hero (site title + the README's two-line thesis — "Modern
  agents write good code. The hard part is getting them to build the *right* thing, the
  *right* way, for *your* project."), full-width featured Start Here card carrying
  "Read Start Here in its entirety. **Do not skim it.**" + reading time, then chapter
  cards grouped under the four part labels (card: part label small-caps, title, dek from
  the page's own opening, reading-time badge). Footer strip: the README "The tools"
  paragraph with its links.
- **Chapter pages:** left sticky rail ≥1100px listing Start Here + the four parts with
  their chapters, current page in accent; current page's h2s indented beneath it with a
  sliding accent indicator (scrollspy via IntersectionObserver, `transform` only).
  Mobile: slim top bar (part · title) with a `<details>` chapter menu. Chapter header:
  part label, "Chapter n of 7", reading-time badge, "current as of {reviewed}" badge.
  Footer: prev/next cards.
- **`/glossary`:** plain definition list of the 10 terms, anchor per term.
- Reading time = build-time word count / 215 wpm, rounded, "N min".

## Content mapping

`src/content/guide/`: `start-here.md` (order 1), `harness-and-model.md` (2, Foundation),
`writing-a-vision.md` (3, Context), `codebase-docs.md` (4, Context),
`writing-an-issue.md` (5, Context), `workflow.md` (6, Execution),
`review-loop.md` (7, Improvement). Copy verbatim from `guide/*.md`, then apply only:
callout moves (proposal §2 list), `:term[…]` marks, diagram placements, the
numbered-step treatments (three responsibilities, "your turn" checklist, superpowers
loop) and designed tables (failure→artifact, repo→docs) via markup only, and
cross-reference seams (the `→ **[more on X]**` arrow links become links to the fork's
own routes; keep the arrow style if it reads well). START-HERE stays intact end-to-end
— callouts in it must not remove sentences from the reading flow (prefer **Own it** /
Gotcha treatments that wrap the sentence in place there; log as markup-only).

## Type, color & motion

Implement proposal §5 exactly: Inter body/headings/UI + JetBrains Mono code; 68ch
measure; body `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)`, line-height 1.65; Utopia-ish
`--step--1…--step-4` scale (~1.2 ratio); tight display headings (−0.015em). Token block
verbatim from proposal §5 (`--surface-0/1/2`, `--text-1/2`, `--border-1`, `--accent`
OKLCH electric blue with per-theme variants, `--accent-soft` via `color-mix`, `--warn`
for gotcha only) via `light-dark()` + `color-scheme`; manual toggle sets `data-theme`
before first paint. Motion: cross-document `@view-transition { navigation: auto; }`,
180ms fade, `view-transition-name` on header and rail so they persist; hover/focus
120ms color/background only; popover 120ms fade + 2px rise; `interpolate-size:
allow-keywords` for `<details>`. `prefers-reduced-motion: reduce` → view transitions
none, durations 0.

## Build & serve

- Scripts: `dev` → `astro dev --port 4321`; `build` → `astro build`;
  `preview` → `astro preview --port 4321`; `diagrams` → regenerate SVGs (optional,
  needs the D2 toolchain).
- `forks/modern-dev-guide/README.md`: what the fork is (2 sentences), `npm install`,
  `npm run dev`, URL `http://localhost:4321`, note that `npm run diagrams` is optional.
- `.gitignore`: `node_modules/`, `dist/`, `.astro/`.

## Verification (do all of this before reporting done)

1. `npm install && npm run build` — clean build.
2. Serve and curl `/`, all 7 chapter routes, `/glossary` — 200s and expected content
   (grep for callout markup, `.term` links, inline SVG, reading-time badges).
3. Confirm zero external requests in built output (`<link>`/`<script>`/`@font-face`/
   `src` all local; only `<a href>` may point off-site).
4. Use the **page-capture** skill (if available) to screenshot: home and Start Here at
   1440px (dark and light), Start Here at 390px — confirm rail + scrollspy layout,
   callout styling, diagram theming, mobile top bar. Interact where possible: verify a
   glossary popover opens on click. If page-capture is unavailable, verify the DOM via
   curl and say explicitly that visual checks were not performed.
5. Confirm with JS disabled the pages still read: rail is static links, terms navigate
   to /glossary.
6. Leave the dev server **stopped** when finished.

Report back: what was built, verification results (explicitly), any deviations from
spec with reasons, and everything logged in CHANGES.md.
