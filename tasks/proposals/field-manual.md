# Proposal: "The Field Manual" fork

Direction A from [the Phase 1 research](../research/interactive-web-techniques.md) — the Tufte / Butterick / Works in Progress lineage. Built at `forks/field-manual/`, self-contained, existing site untouched.

## 1. Concept

The guide becomes a short, beautifully typeset book: warm paper, a serif at a strict measure, chapters instead of doc pages, and a live margin that carries the asides while the main argument runs clean down the page. Nothing moves, nothing loads, nothing hides — the reader's only job is to read, which is exactly what the guide asks of them ("Read Start Here in its entirety. Do not skim it."). The form makes the content's own claim: this is a considered, owned artifact, not generated filler — a manual you'd trust because someone clearly stood behind every line.

## 2. Content restructure

### Chapters

The current 8 pages map to a cover plus 7 chapters, in the order Start Here already walks them:

| Now | Becomes | Changes |
|---|---|---|
| `README.md` / `guide/index.md` | **Cover + Contents** | README prose becomes the cover dek; "The tools" section becomes a colophon-style note at the foot of the contents page. |
| `guide/START-HERE.md` | **Ch. 1 — Start Here** | Intact, end to end. The `→ more on…` arrow links become print-style cross-references ("See Chapter 2, *Harness & Model*") set as margin pointers. No disclosures in this chapter — it must be readable in its entirety by design. |
| `guide/harness-and-model.md` | **Ch. 2 — Harness & Model** | Install commands move into a `<details>`. |
| `guide/writing-a-vision.md` | **Ch. 3 — The Vision Document** | As is. |
| `guide/codebase-docs.md` | **Ch. 4 — Codebase Documentation** | codebase-tutorial paragraph becomes a disclosure. |
| `guide/writing-an-issue.md` | **Ch. 5 — Writing Issues** | MMGIS split example moves to the margin. |
| `guide/workflow.md` | **Ch. 6 — The Workflow** | Two asides move to the margin. |
| `guide/review-loop.md` | **Ch. 7 — The Review Loop** | Six-agent pipeline list restyled as a roster table (same words, designed form). |

No merging. Rewrites are seam-level only: chapter cross-references, and openings that currently assume arrival from a hyperlink. The author's voice is untouched.

### Margin sidenotes (the signature move — shown by default on wide screens)

Existing sentences that are already asides, moved beside the text they qualify. Kept sparse: 2–4 per chapter.

- Ch. 1 (START-HERE §1): *"Harnesses and models improve and change over time, and exact recommendations go out of date within months of being written."*
- Ch. 1 (§2.4): *"This guide doesn't yet cover hooks, but they are another tool you can use alongside your CLAUDE.md to ensure desired behavior."*
- Ch. 1 (§3): the parenthetical *"(a diff-explainer tool helps here)"* becomes a margin tool-note linking to Ch. 6.
- Ch. 2 (harness-and-model): *"You can run all of this in an isolated git worktree, so several tasks can go at once without stepping on each other."* and *"You can also delegate portions to different models, for example the spec and the review to your most expensive and capable model while a cheaper, faster one does the typing in the middle."* — both set beside the four-step loop.
- Ch. 3 (writing-a-vision): *"Point it at related repos or existing material if that helps."*
- Ch. 4 (codebase-docs): candidate — *"That's how you get a perfectly good CI/CD that ignores the build step nobody pointed it at."* as a margin illustration beside its bullet (author's call; it also reads fine inline).
- Ch. 5 (writing-an-issue): *"For a real example, look at how one piece of MMGIS test work got split into #148 and #149…"* (the full three-sentence example) as a margin example-note.
- Ch. 6 (workflow): *"One fair warning on that last option: orchestration skills tend to be mildly specific to one repo… Use someone else's as a starting point, not a drop-in."* and the mmgis-deployment sentence (*"…each instance gets its own port, database, and config…"*) as a margin tool-note.
- Ch. 7 (review-loop): the learn-from-pr-reviews skill pointer as a margin tool-note.

Pattern: every "The skill" / tool link in the guide becomes a consistently styled **tool-note** in the margin (small ⚙ marker, monospace name, one-line description drawn from the existing prose), so the tooling layer reads as marginalia on the argument rather than interruptions of it.

### Pull quotes (one per chapter, exact lines from the text)

- Cover: **"Do not skim it."** — set large under the dek, as the book's epigraph.
- Ch. 1: *"If you don't take ownership of the spec the agent is about to implement, then you don't own anything."*
- Ch. 2: *"The only rule that matters is to use a real harness and a capable model."*
- Ch. 3: *"None of these are the model writing bad code. The code is probably fine."*
- Ch. 4: *"Anything you give the agent, it will take at face value as truth."*
- Ch. 5: *"A good issue should be one reviewable PR."*
- Ch. 6: *"The agent passing its own tests does not mean the code is good. You have to look."*
- Ch. 7: *"Integration tests you understand are worth far more here than a thousand LLM-written unit tests."*

### Numbered-step treatments (CSS counters + grid, no images)

- Ch. 1 §3: the **six-step development workflow** — the manual's centerpiece step block: large accent numerals, hairline connectors, one step per row. Followed by the *"Then it's your turn"* four-item checklist in a matching checklist style.
- Ch. 1 opener: the three responsibilities (capable model / quality harness / provide context) as a designed list.
- Ch. 2: the four-step superpowers loop (Spec → Implement → Review → Verify) in the same component, smaller.

### Designed tables

- Ch. 1: the continuous-improvement table (*"The LLM failed by… / Improve…"*) — header band, generous padding, accent left-rule; this is the guide's thesis in table form and gets treated like it.
- Ch. 4: the repo-size → docs-level table (*"Your repo / What you probably need"*).
- Ch. 7: the six review agents (Project alignment, Security and architecture, Craftsmanship, Test quality, Documentation freshness, Open-ended) restyled from a bullet list into a two-column roster — same sentences, designed form.

### Details-disclosure (collapse the optional, never the essential)

- Ch. 2: the `/plugin marketplace add …` install commands ("Install superpowers").
- Ch. 4: the codebase-tutorial prototype paragraph ("If simpler docs can't hold the picture").
- Nothing in Ch. 1, on principle.

## 3. Page & navigation structure

- **Cover page** (`/`): title, the README's dek paragraph, the epigraph, then a printed-book **Contents**: chapter number, title, one-line dek per chapter (deks drawn from each chapter's own opening line). Primary action is "Begin — Chapter 1, Start Here →". Foot of page: the tools/colophon note plus a "Last revised: {build date from git}" line — cheap expectation-setting for a fast-moving subject.
- **Chapter pages**: a slim header strip — small-caps "WORKING WITH LLMS · CHAPTER 3 OF 7" — then title, hairline rule, and the body opening with a small-caps first phrase (Tufte's `newthought`). Footer: hairline rule, then prev/next set as facing page-turns ("← Ch. 2 Harness & Model  ·  Contents  ·  Ch. 4 Codebase Documentation →").
- **No sidebar, no scrollspy, no search.** Chapters are 40–60 lines of prose; find-in-page and the Contents page cover orientation. The reader always knows where they are from the chapter strip, and always knows what's next from the footer.
- The existing bold-phrase "skim layer" in the prose is preserved and slightly strengthened by the type system (bold weight tuned so a skimmer gets the thesis from the bold alone).

## 4. Techniques, placed — and rejections

| Technique | Where | Why it serves comprehension |
|---|---|---|
| True margin sidenotes, visible by default ≥ ~1100px | All chapters except cover | Asides readable at a glance without leaving the flow; the main argument stays clean. Collapse to numbered tap-to-expand notes (checkbox hack, zero JS) below the breakpoint. |
| `<details>` disclosures | Ch. 2, Ch. 4 | Optional depth deferred; default text complete on its own. |
| Pull quotes | One per chapter | Eye rest, pacing, and thesis reinforcement using the guide's own strongest lines. |
| Step blocks & checklist | Ch. 1, Ch. 2 | The procedures *are* the content; giving them visual sequence makes the workflow memorable. |
| Designed tables | Ch. 1, 4, 7 | The guide thinks in comparisons; the form should honor that. |
| Small-caps chapter openers + hairline rules | Every chapter | Print rhythm; signals "new movement" without decoration. |
| Cross-document view-transition fade | Between all pages | One CSS at-rule, zero JS; signals "same book, next page" instead of a reload. Gated on `prefers-reduced-motion`; no-op in Firefox. |
| Light/dark theme toggle | Header | ~15 lines of inline JS (the site's **only** script) for persistence; degrades to `prefers-color-scheme` with JS off. |

**Rejected, deliberately:** scrollytelling and reveal-on-scroll (fights argument-driven prose, skimming, find-in-page); scroll hijacking; progress bars and scrollspy (chapters too short — orientation noise); glossary popovers (margin notes carry the definitions; no popover machinery); drop caps (one opener ritual is enough, and small caps fit a manual better than a magazine flourish); pre-rendered SVG diagrams (the six-step workflow is better served by the typographic step block than by re-drawing what the sentences already say — and it keeps the toolchain pure npm); copy-to-clipboard buttons and search (not enough code or pages to earn them). Everything reads perfectly with JS disabled and every disclosure closed.

## 5. Typography & color spec

**Faces** (all free/OFL, self-hosted variable woff2):

- Body & headings: **Newsreader** (variable: `opsz`, `wght`; separate italic file). Screen-tuned long-form serif with an optical axis — headings get the display cut for free.
- Furniture (chapter strips, nav, table headers, captions, margin-note labels): **Inter** (variable), letterspaced small sizes.
- Code: **JetBrains Mono** (variable).

**Scale & rhythm:**

- Measure: `max-width: 65ch` on the reading column; margin column ~18rem beside it on wide screens (single centered column below ~1100px).
- Body: fluid `clamp(1.0625rem, …, 1.25rem)` (17→20px); line-height 1.6.
- Sidenotes/captions: 0.85× body, line-height 1.45, secondary ink.
- Headings: quiet scale — h1 ≈ 2.1rem/600, h2 ≈ 1.35rem/600, deliberately shallow hierarchy (Tufte); vertical rhythm from a single spacing scale.

**Paper (light, default):** background `#FAF6EE`; raised surfaces (tables, code, details) `#F3EDE0`; ink `#211D16`; secondary ink `#5C554A`; hairlines `#D8D0C0`; accent `#9C4221` (brick/oxide). Links are ink-colored with a hairline underline (Tufte); the accent is reserved for meaning: chapter numerals, step markers, active/prev-next hover, pull-quote rules, margin-note markers.

**Tinted dark:** background `#16130E` (warm near-black, never pure); surfaces `#201C15`; text `#E8E2D5`; secondary `#A39A88`; hairlines `#3A3428`; accent `#D98E62` (per-theme variant so it doesn't wash out). Defined as semantic tokens via `light-dark()`; both themes AA-checked.

## 6. Stack & build

**Eleventy** over Vite+vanilla: at 7 chapters + cover, what's needed is a markdown pipeline, shared layouts, and a chapter collection with prev/next and "N of 7" numbering — Eleventy gives all three out of the box with zero client runtime, and its markdown-it pipeline is where the footnote→sidenote transform lives. Vite would mean hand-rolling exactly those parts for no gain.

- **Dependencies:** `@11ty/eleventy`, `markdown-it-footnote`. That's it. Sidenotes are authored as standard markdown footnotes and transformed to margin-note markup by a small transform in `eleventy.config.js`; mobile collapse is the CSS checkbox pattern, no JS.
- **Fonts:** vendored latin-subset woff2 in `src/fonts/`, `@font-face` with `font-display: swap`, body face preloaded. No external requests of any kind.
- **Diagrams:** none (rejected above), so no binary toolchain.
- **CSS:** one hand-written `manual.css` (tokens, type scale, sidenote layout, components). No framework, no preprocessor.
- **Commands:** `npm install`, then `npm run dev` → `eleventy --serve --port=8080` at `http://localhost:8080` (MkDocs keeps 8000); `npm run build` → static `_site/`.

```
forks/field-manual/
├── package.json
├── eleventy.config.js        # collections, footnote→sidenote transform, build date
└── src/
    ├── _layouts/  base.njk, chapter.njk
    ├── _includes/ chapter-nav.njk, theme-toggle.njk
    ├── index.md              # cover + contents
    ├── chapters/ 01-start-here.md … 07-review-loop.md
    ├── css/manual.css
    └── fonts/ *.woff2
```

Content is copied into the fork (it diverges by design: cross-reference seams, footnote-authored sidenotes).

## 7. Risks & open questions

1. **Content drift.** The fork carries its own copy of the prose; edits to `guide/` won't propagate. Fine for an experiment — needs a decision if this fork wins.
2. **Chapter count.** I propose "Chapter N of 7" (cover isn't a chapter) versus the brief's "of 8". Alternative: break §2.4 (CLAUDE.md) out of Start Here into its own short chapter — but that would puncture "read Start Here in its entirety," so I recommend against.
3. **Sidenote density.** The guide is lean; over-harvesting asides thins the main text. I've capped at 2–4 per chapter — the flagged Ch. 4 candidate is yours to call.
4. **Seam rewrites.** The arrow-link → cross-reference rewording in Ch. 1 touches your sentences; you should read those seams at review.
5. **Face choice.** Newsreader vs. Source Serif 4 is taste (Newsreader is warmer/more editorial; Source Serif is sturdier and pairs more neutrally with code). Swappable in an hour — flag a preference if you have one.
6. **Warm-tinted dark theme** keeps the paper identity at night but is unusual; say the word if you'd rather a neutral dark.
7. **The one script.** The 15-line theme-toggle persistence is the only JS. If you want a literally zero-JS site, we drop persistence and rely on `prefers-color-scheme` alone.
