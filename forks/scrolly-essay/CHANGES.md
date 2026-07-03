# Changes from source prose

Every deviation from verbatim source text, as required by the spec. Format:
**page → original → new → reason**. Purely mechanical, same-words-new-markup
conversions (numeral prefixes moved into separate badges, straight quotes/dashes
upgraded to typographic entities, bullet lists becoming styled `<ol>`/`<ul>`/cards)
are grouped at the bottom and not repeated per instance.

## Scope of the completeness requirement (read first)

The spec requires "all of the guide's content" and that the essay "carries the
complete text of START-HERE.md (plus the README hero/tools material)." I scoped the
README contribution to exactly what the spec's own scene choreography names: the H1
+ tagline + thesis paragraph + "This guide will not try to teach you everything…"
paragraph (scene 1, Hero) and the "The tools" paragraph (scene 8, outro colophon).
README's "## How to use it" section ("Read Start Here in its entirety. Do not skim
it. It is short, it is concise…") was **not** carried over: it isn't part of
START-HERE.md, isn't named in the spec's scene list, and is meta-navigation pointing
a reader *at* `guide/START-HERE.md` — meaningless in a fork where the essay itself
*is* Start Here. Flagging this as a scoping decision in case the intent was broader.

Per spec, `guide/index.md` (a generated stub with no independent prose beyond a
build-time-include notice) was not carried over as a page, matching the other forks'
treatment of MkDocs-only artifacts. `/deep/start-here-reference/` was explicitly not
built, per spec.

## The essay (`src/index.njk`)

### Hero (scene 1, `#hero`)

- README's H1 "Working With LLMs" → hero eyebrow (verbatim). README's tagline "An
  actionable guide to doing software development with coding agents." → hero `<h1>`
  (verbatim). START-HERE.md's own H1 ("Working With LLMs: Start Here") does **not**
  appear verbatim anywhere in the essay — the spec's own hero design (eyebrow + title
  + README thesis + "This guide will not…" paragraph) supersedes it. Reason: spec's
  explicit scene-1 content list.
- Thesis paragraph and "This guide will not try to teach you everything…" paragraph:
  verbatim, per spec.

### The question (scene 2, `#the-question`)

- Source is one paragraph ("When you see them write bad code…for the task. In 2026,
  the question is no longer…implicitly.") straddling two sentences; spec calls for
  two reveal beats. Split into two `<p>` elements at the sentence boundary — markup
  only, no words changed, no words dropped.
- Interpretation: spec says the three emphasized phrases ("what you actually
  wanted" / "whole project" / "constraints") "reveal as three staggered accent
  lines." I read this as staggering **in place**, inside the one flowing sentence
  (each phrase is its own `data-reveal` span with a later offset than its
  surrounding text), rather than repeating the phrases as three separate standalone
  lines outside the sentence. This keeps the sentence intact and avoids duplicating
  prose; flagging in case "lines" was meant literally as separate list items.

### Foundation (scene 4, `#foundation`)

- Heading "## 1. Foundation: a capable model and a real harness" → scene heading
  "Foundation: a capable model and a real harness" (numeral prefix dropped; the
  scene's own generated/hand-authored number badge "04" carries the ordinal
  instead). Body paragraphs verbatim.
- Arrow-link "→ **[more on harnesses and models](harness-and-model.md)**" → a
  linked "Go deeper" card (title "Harness & Model", dek "Use a powerful flagship
  model, and when in doubt reach for the most capable one you have." — the source's
  own opening sentence of `harness-and-model.md`, verbatim). Reason: spec's explicit
  "Go deeper card" requirement.

### The context stack (scene 5, `#context`)

- Heading "## 2. Understand the work, then make that understanding available to the
  agent" does **not** appear verbatim — the scene is titled "The Context Stack" per
  the spec's own explicit name for this scene. The heading's substance (you must
  understand your project before an agent can) is carried by the two intro
  paragraphs, which are verbatim.
- Subsection headings §2.1–§2.4 ("2.1 Vision: why the project exists", etc.): the
  "2.1" numeral is pulled out into its own small mono label (`context-step-num`)
  next to the heading rather than left inline in the `<h3>` text — mechanical,
  matches how scene 4's "1." was handled.
- Three arrow-links → "Go deeper" cards: `writing-a-vision.md` ("The Vision
  Document", dek = its own opening sentence verbatim), `codebase-docs.md`
  ("Codebase Documentation", dek = its own opening sentence verbatim),
  `writing-an-issue.md` ("Writing Issues", dek compressed from its long opening
  sentence — see "Go deeper deks" below). §2.4 (Ironclad rules: CLAUDE.md) has no
  arrow-link in the source, so no card was added there — matches source exactly.
- All body prose (both intro paragraphs and the full text of §2.1–§2.4, including
  the CLAUDE.md bullet list and its two closing paragraphs) is verbatim.

### The workflow (scene 6, `#workflow`)

- Heading "## 3. The development workflow" does not appear verbatim — the scene is
  titled "The Workflow" per the spec's own name. The intro sentence ("Once your team
  has a clear vision…") is verbatim and carries the section's actual content.
- The six numbered steps, "Then it's your turn.", and the four checklist items
  (including the parenthetical "(a diff-explainer tool helps here)") are verbatim,
  restyled as a pipeline list and a checklist (mechanical).
- Bold link "**[tips for orchestrating a workflow](workflow.md)**" → "Go deeper"
  card (title "The Workflow", dek written fresh rather than lifted verbatim, since
  the source phrase itself was the link text, not a standalone descriptive
  sentence: "Tips for orchestrating a workflow: who drives the loop, running agents
  in parallel, and learning code you didn't write." — summarizes workflow.md's three
  named subsections). Logging this dek as the one that isn't a straight quote from
  the target's opening line.

### Continuous improvement (scene 7, `#improvement`)

- Heading "## Continuous improvement" → scene title "Continuous Improvement"
  (sentence case → title case; trivial, grouped with mechanical changes below).
- **Reorder:** source order is table → "Do this and your harness will get better
  every cycle…" → "We have some dedicated tools to help with this…" (+ arrow-link).
  The built order is table → "We have some dedicated tools…" (+ Go-deeper card) →
  "Do this and your harness…" This is a content **reorder**, not a wording change —
  done because the spec explicitly directs "the closing 'Do this and your
  harness…' line as the scene's last beat, large," which only works if the tools
  paragraph moves earlier. All three pieces of text are present, verbatim, just
  resequenced.
- Table rows and the "We have some dedicated tools…" arrow-link → "Go deeper" card
  (`review-loop.md`, dek = its own opening sentence verbatim): as elsewhere.

### Outro (`#go-deeper`, not a scene)

- New chrome text not drawn from source: "Six deep dives, one per stop along the
  way" (grid heading), footer line "Working With LLMs · a scrollytelling fork ·
  built with Eleventy". Both are new UI/colophon text, not narrative prose.
- README's "## The tools" paragraph: verbatim, under a "The tools" eyebrow.

### Go-deeper deks (one-line dek per card, spec: "one-line dek from the target's
opening")

- Harness & Model: "Use a powerful flagship model, and when in doubt reach for the
  most capable one you have." — verbatim opening sentence.
- The Vision Document: "An agent has no idea what your project is doing, who it is
  for, or what it should accomplish." — verbatim opening sentence.
- Codebase Documentation: "Document the things that aren't obvious from a quick
  read, the things a senior dev carries in their head." — verbatim opening sentence
  (colon dropped).
- Writing Issues: "The bad way to write an issue is to let a chatbot interrogate you
  back and forth until it builds something only sort of what you wanted." —
  compressed from the source's long opening sentence ("The bad way to write an issue
  is to open a chat window, type one sentence, and let the bot interrogate you back
  and forth forever while you carry all the cognitive load, until it finally builds
  something that is only sort of what you wanted...Don't do that."), same
  compression the field-manual fork made for the same sentence.
- The Workflow (context-scene instance and outro-grid instance): "If you have a good
  issue, the hard decisions should already be made." — verbatim opening sentence.
  (The scene-4-adjacent card inside `#workflow` itself uses a different, longer dek —
  see above.)
- The Review Loop: "With a good harness, review happens in two places." — verbatim
  opening sentence.

## Deep-dive pages (`src/deep/*.md`)

All six carry the complete verbatim body text of their source file (confirmed by the
programmatic completeness check below). Allowed edits only:

- H1 → frontmatter `title`, in every file. `harness-and-model.md`'s source H1
  "Harness and Model" → title "Harness & Model" ("and" → "&"), matching the spec's
  own eyebrow example text ("DEEP DIVE · 02 — HARNESS & MODEL"). The other five
  titles are verbatim matches of their source H1.
- `workflow.md`: the one internal cross-link, "[Start Here](START-HERE.md) walks the
  full sequence" → "[The essay](/#workflow) walks the full sequence" — remapped from
  the old multi-page site's `START-HERE.md` to this fork's essay anchor, per spec's
  explicit allowed edit. No other guide file has an internal cross-link to remap.
- Numbering: deep dives are numbered 02–07 in their eyebrows (`DEEP DIVE · 0N —
  TITLE`), not 01–06. The essay itself occupies the implicit "01" slot in this
  scheme (it is Start Here), matching the spec's own worked example ("02 — HARNESS &
  MODEL" for the harness-and-model page, which is the first deep dive linked from
  the essay).
- `backAnchor` frontmatter (used by "← Back to the essay"): `harness-and-model` →
  `#foundation`; `writing-a-vision`, `codebase-docs`, `writing-an-issue` → `#context`
  (all three are linked from within the context-stack scene); `workflow` →
  `#workflow`; `review-loop` → `#improvement`. These are new routing data, not prose.

## Mechanical, same-words conversions (not repeated per instance above)

- Straight quotes/apostrophes, `--`/em dashes, and `...` in the essay's hand-authored
  HTML upgraded to typographic entities (`&rsquo;`, `&ldquo;`/`&rdquo;`, `&mdash;`,
  `&hellip;`) for the display type. The deep-dive markdown files were left as plain
  ASCII (rendered as-is by markdown-it) since they use ordinary prose typesetting.
- Bulleted/numbered lists in the source rendered as styled `<ol class="card-stack">`,
  `<ol class="pipeline">`, `<ul class="checklist">`, `<div data-layer>` groups, or a
  `<table class="table-designed">` (continuous-improvement table) instead of bare
  markdown lists/tables — same words, new markup, to carry the scene choreography
  (staggered reveals, pipeline activation) the spec calls for.
- Section numeral prefixes ("1.", "2.1", "2.2", etc.) in headings are pulled out of
  the heading text into adjacent small mono badges rather than left inline — applied
  identically in scenes 4 and 5.

## Build notes (not prose deviations)

- Font family names in `essay.css` (`Space Grotesk`, `IBM Plex Mono`) are
  self-declared `@font-face` rules pointing at the two self-hosted `.woff2` files
  copied from `@fontsource-variable/space-grotesk` and `@fontsource/ibm-plex-mono`
  (latin subset only — the guide's content is English-only, so no other subsets were
  copied). This is a lighter version of the fontsource packages' own generated CSS
  (which ships per-script `unicode-range` splits across dozens of `@font-face`
  blocks we don't need).
- The context-stack scene (`#context`) does not use the tall-section-plus-pinned-
  100vh-stage pattern the other six scenes use, because it carries the full text of
  four subsections (one, §2.2, several paragraphs long) rather than a few short
  beats. Pinning is done with plain CSS `position: sticky` on the diagram column
  inside a two-column grid (a standard "sticky sidebar" layout) while the prose
  column scrolls at its natural, content-determined height; layer activation is
  driven by which step's bounding box is nearest the viewport's vertical center
  (`stackSync()` in `engine.js`), not by an even fraction-of-scene-progress split —
  the case study's `pipeline()` helper assumes short, uniform-length pinned content,
  which doesn't hold once one subsection is several times longer than the others.
  The workflow scene (six short one-sentence steps) and all other scenes use the
  case study's `pipeline()`/tall-pinned-scene pattern unmodified.
