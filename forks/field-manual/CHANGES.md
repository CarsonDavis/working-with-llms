# Changes from source prose

Every deviation from the verbatim source text, as required by the spec. Format:
**chapter → original → new → reason**. Purely mechanical "same words, new markup"
conversions (raw HTML lists/tables replacing markdown lists/tables with byte-identical
wording) are grouped at the bottom and not repeated per sentence.

## Interpretation decision (read first)

The proposal says "every 'The skill' / tool link in the guide becomes a ... tool-note
in the margin" as a general pattern, but also gives an explicit, itemized list of which
sentences move to the margin per chapter. I followed the **explicit list** literally
(diff-explainer parenthetical in Ch.1, the two Ch.2 asides, the Ch.3 "point it at
related repos" sentence, the Ch.4 CI/CD sentence, the Ch.5 MMGIS example, the two Ch.6
asides, the Ch.7 learn-from-pr-reviews pointer) and left the other "## The skill"
sections (Ch.2 install block aside, Ch.3, Ch.5) and other bare tool links (Ch.6
diff-explainer paragraph, Ch.6 orchestrating-issues bullet) as ordinary body prose with
ordinary links. Rationale: the itemized list is the concrete, reviewable spec; treating
the "pattern" sentence as license to hunt down and rewrite every other tool mention
risked over-editing prose that proposal §2's chapter-by-chapter table never flagged.
Flagging this so it can be revisited if the intent was broader.

## Cover (index.md, from README.md)

- Original: "Read **[Start Here](guide/START-HERE.md)** in its entirety." → New: primary
  CTA link "Begin — Chapter 1, Start Here →" pointing at `/chapters/01-start-here/`.
  Reason: proposal §3 specifies this exact CTA pattern; wording is new UI chrome, not
  narrative prose, but it does not appear verbatim in the source.
- Reordered: "Do not skim it." (epigraph) now appears *before* "It is short, it is
  concise, and it walks the whole approach end to end..." — in the source the epigraph
  sentence follows the "Read Start Here" sentence and precedes the "It is short..."
  sentence; here the CTA replaces the "Read Start Here" sentence and the epigraph is
  pulled out as a large standalone element per proposal §3, so the "It is short..."
  sentence now reads as lead-in copy to the Contents list rather than inline with the
  epigraph. Reason: proposal's specified cover layout (title → dek → epigraph →
  Contents).
- Frontmatter `title` set to "Working With LLMs" (matches source H1 exactly, no
  deviation).

## Chapter 1 — Start Here

- Original H1 "Working With LLMs: Start Here" → chapter frontmatter `title: Start Here`
  (per spec's content-mapping table) and the H1 markdown line was removed from the body
  since the chapter layout renders `<h1>{{ title }}</h1>`. Reason: spec-mandated title;
  logging the drop of the "Working With LLMs:" prefix for transparency.
- Added `<span class="newthought">Modern agentic coding systems</span>` around the first
  phrase of the opening sentence. Reason: proposal §3 "small-caps first phrase (Tufte's
  newthought)"; wording unchanged, markup only. (Same pattern applied to all 7 chapters;
  not repeated below.)
- Sidenote: "Harnesses and models improve and change over time, and exact
  recommendations go out of date within months of being written." — removed from the
  body paragraph and moved into `[^harness-drift]`, with the footnote reference attached
  to the end of the preceding sentence ("...layering the pcvelz/superpowers harness on
  top of that."). Reason: proposal §2 explicit margin sidenote for Ch.1 §1.
- Sidenote: "This guide doesn't yet cover hooks, but they are another tool you can use
  alongside your CLAUDE.md to ensure desired behavior." — removed from the body and
  moved into `[^hooks]`, reference attached to the prior sentence ("...don't try to fix
  organizational problems inside a coding session."). Reason: proposal §2 explicit
  margin sidenote for Ch.1 §2.4.
- Parenthetical "(a **diff-explainer** tool helps here)" — removed from the checklist
  item and replaced with a tool-note: "⚙ `diff-explainer` — walks you through what a
  diff does, what it affects, and how it fits into the rest of the codebase, so you can
  get to a genuine understanding. See Chapter 6, *The Workflow*." Reason: proposal §2
  explicit margin tool-note for Ch.1 §3; description text is compressed/adapted from the
  fuller diff-explainer paragraph in workflow.md ("It walks you through what a diff
  does, what it affects, and how it fits into the rest of the codebase, side by side
  with the actual code, so you can get to a genuine understanding and then make your own
  call.") since the original Start Here parenthetical had no description of its own.
- Cross-reference seams (arrow-links / bold intra-set markdown links → prose
  cross-references, all hyperlinked):
  - "→ **[more on harnesses and models](harness-and-model.md)**" → "See Chapter 2,
    *Harness & Model*."
  - "→ **[how to write a vision](writing-a-vision.md)**" → "See Chapter 3, *The Vision
    Document*."
  - "→ **[how to document your codebase](codebase-docs.md)**" → "See Chapter 4,
    *Codebase Documentation*."
  - "→ **[how to write issues](writing-an-issue.md)**" → "See Chapter 5, *Writing
    Issues*."
  - "**[tips for orchestrating a workflow](workflow.md)**" → "See Chapter 6, *The
    Workflow*."
  - "→ **[more on review](review-loop.md)**" → "See Chapter 7, *The Review Loop*."
  - Reason: spec's allowed edit #1.
- Pull quote: "If you don't take ownership of the spec the agent is about to implement,
  then you don't own anything." repeated as a `<figure class="pull">` immediately after
  its paragraph (sentence also stays in the running prose, per spec: a pull quote is a
  repetition by convention).
- No `<details>` used in this chapter and no sentence left the reading flow except the
  three items above, per spec's Ch.1 rule.

## Chapter 2 — Harness & Model

- Frontmatter `title: Harness & Model` per spec's mapping table (source H1 reads
  "Harness and Model" — "and" → "&"). Body H1 line removed (layout renders the title).
- Sidenote: "You can run all of this in an isolated git worktree, so several tasks can
  go at once without stepping on each other." — removed from the body as a standalone
  sentence and moved into a hand-authored sidenote span attached to the end of step 4 of
  the four-step block ("...isn't done until it passes them."). Reason: proposal §2
  explicit margin sidenote, "set beside the four-step loop." *(Authored as raw HTML
  directly in the step-block `<li>` rather than a markdown `[^footnote]` — markdown-it
  does not run inline/footnote parsing inside raw HTML blocks, so footnote syntax placed
  inside the hand-written `<ol class="step-block">` markup silently fails to resolve.
  Verified this the hard way during the build and fixed it; noting it here since the
  visible sidenote number is hand-assigned (1, 2) rather than plugin-generated, though
  the rendered markup is otherwise byte-identical to the auto-generated form.)*
- Sidenote: "You can also delegate portions to different models, for example the spec
  and the review to your most expensive and capable model while a cheaper, faster one
  does the typing in the middle." — same treatment, same location, footnote 2. Same
  reason and same hand-authoring note as above.
- Install commands ("/plugin marketplace add pcvelz/superpowers" / "/plugin install
  superpowers-extended-cc@superpowers-extended-cc-marketplace") wrapped in
  `<details><summary>Install superpowers</summary>...</details>`. Reason: proposal §2
  explicit disclosure for Ch.2. The summary label "Install superpowers" is new UI text
  (the source just says "Install it with:" before the code block); label wording is
  drawn from the proposal's own description of this disclosure.
- Pull quote: "The only rule that matters is to use a real harness and a capable model."
  repeated as a pull-quote figure after its paragraph; sentence stays in prose.

## Chapter 3 — The Vision Document

- Frontmatter `title: The Vision Document` — verbatim, matches source H1.
- Sidenote: "Point it at related repos or existing material if that helps." — removed
  from the body and moved into `[^related-repos]`, reference attached to the end of the
  preceding clause ("...let the LLM organize it into a draft."). Reason: proposal §2
  explicit margin sidenote.
- Pull quote: "None of these are the model writing bad code. The code is probably fine."
  repeated as a pull-quote figure; sentence stays in prose.
- "## The skill" section (writing-a-vision skill pointer) left untouched, including its
  own "→ [writing-a-vision](https://...)" external link — see Interpretation decision
  above.

## Chapter 4 — Codebase Documentation

- Frontmatter `title: Codebase Documentation` — verbatim, matches source H1.
- codebase-tutorial paragraph ("If that last option interests you, we have a working
  prototype at codebase-tutorial...") wrapped in `<details><summary>More: a full
  tutorial-generation prototype</summary>...</details>`. Reason: proposal §2 explicit
  disclosure for Ch.4. Summary label is new UI text invented for this build (not present
  in source prose).
- Sidenote: "That's how you get a perfectly good CI/CD that ignores the build step
  nobody pointed it at." — removed from the "It only opens the files it thinks it
  needs" bullet and moved into `[^ci-cd]`. Reason: spec explicitly resolves the proposal's
  flagged Ch.4 candidate as "yes, take it to the margin."
- Pull quote: "Anything you give the agent, it will take at face value as truth."
  repeated as a pull-quote figure (using the Ch.4 instance of this sentence, which
  differs slightly in punctuation from the near-duplicate sentence in Start Here §2.2 —
  "Critical: anything you give the agent it will take at face value as truth" — the
  Ch.4 instance is the one proposal §2 designates for the pull quote).

## Chapter 5 — Writing Issues

- Frontmatter `title: Writing Issues` — verbatim, matches source H1.
- Pull quote: "A good issue should be one reviewable PR." repeated as a pull-quote
  figure; sentence stays in prose.
- Margin example-note: the three-sentence MMGIS example ("For a real example, look at
  how one piece of MMGIS test work got split into #148 and #149. The first moves the
  unit tests into a DOM-capable environment, pure mechanics that change nothing about
  what any test asserts. The second fixes the stale tests that migration revealed.") —
  removed from the body and moved into `[^mmgis-split]`, reference attached to the end
  of "...huge PRs either don't get reviewed or get reviewed badly." The closing
  generalization sentence ("Doing work in small, well-defined chunks makes everything
  about development easier.") stays in the body flow. Reason: proposal §2 explicit
  margin example-note, "the full three-sentence example."
- "## The skill" section (writing-github-issues skill pointer) left untouched — see
  Interpretation decision above.

## Chapter 6 — The Workflow

- Frontmatter `title: The Workflow` — verbatim, matches source H1.
- Intra-set link rewrite: "...a fresh agent reviews the result against it.
  [Start Here](START-HERE.md) walks the full sequence; the point here is..." → "...a
  fresh agent reviews the result against it. See Chapter 1, *Start Here*, for the full
  sequence; the point here is..." Reason: spec's allowed edit #1 (intra-set markdown
  link → cross-reference). This touches the author's own sentence structure (not just an
  appended line), flagged per spec's "seam rewrites... you should read those seams at
  review" guidance.
- Margin sidenote: "One fair warning on that last option: orchestration skills tend to
  be mildly specific to one repo, because they encode how *you* deploy, *your*
  conventions, and *your* gotchas. Use someone else's as a starting point, not a
  drop-in." — removed from the body as a standalone paragraph and moved into
  `[^orchestration-warning]`, reference attached to the end of the orchestrating-issues
  bullet. Reason: proposal §2 explicit Ch.6 aside #1.
- Margin tool-note: original sentence "Our MMGIS mmgis-deployment skill is one example
  of how this was done: each instance gets its own port, database, and config, so many
  of them coexist cleanly on one machine between different git worktrees." was split —
  the body keeps "Our MMGIS mmgis-deployment skill is one example of how this was
  done." (dropping the inline hyperlink on "mmgis-deployment," which moves to the
  tool-note) and the elaboration becomes `[^mmgis-deployment]`: "⚙ `mmgis-deployment` —
  each instance gets its own port, database, and config, so many of them coexist cleanly
  on one machine between different git worktrees." Reason: proposal §2 explicit Ch.6
  aside #2/tool-note.
- Pull quote: "The agent passing its own tests does not mean the code is good. You have
  to look." repeated as a pull-quote figure; sentence stays in prose.
- diff-explainer paragraph and the orchestrating-issues bullet's own link left as
  ordinary body prose/links — see Interpretation decision above.

## Chapter 7 — The Review Loop

- Frontmatter `title: The Review Loop` — verbatim, matches source H1.
- The six-agent bullet list (Project alignment / Security and architecture /
  Craftsmanship / Test quality / Documentation freshness / Open-ended) restyled as a
  two-column roster table, each row split mechanically at the original bullet's colon
  (label → description). Same words, new markup. Reason: proposal §2 explicit roster
  table.
- Pull quote: "Integration tests you understand are worth far more here than a thousand
  LLM-written unit tests." repeated as a pull-quote figure placed after the roster
  table; sentence stays in the Test quality row.
- Margin tool-note: the closing sentence "It lives in the claude repo as the
  [`learn-from-pr-reviews`](https://...) skill." was removed from the body and folded
  into `[^learn-from-pr-reviews]`: "⚙ `learn-from-pr-reviews` — lives in the claude
  repo; mines a repo's entire review-comment history into a report of candidate review
  guidelines." (compressed from the preceding paragraph's fuller description, since the
  original closing sentence itself was short). Reason: proposal §2 explicit Ch.7
  margin tool-note.

## Chapter deks (frontmatter `dek:`, spec allows light compression, logged here)

- Ch.1: verbatim opening sentence, no compression.
- Ch.2: "For most tasks that aren't tightly bounded, use a powerful flagship model, and
  when in doubt reach for the most capable one you have." compressed to "Use a powerful
  flagship model, and when in doubt reach for the most capable one you have." (dropped
  the "For most tasks..." clause for length).
- Ch.3: verbatim opening sentence, no compression.
- Ch.4: verbatim opening sentence, no compression.
- Ch.5: "The bad way to write an issue is to open a chat window, type one sentence, and
  let the bot interrogate you back and forth forever while you carry all the cognitive
  load, until it finally builds something that is only sort of what you wanted." (with
  trailing "...Don't do that.") compressed to "The bad way to write an issue is to let a
  chatbot interrogate you back and forth until it builds something only sort of what you
  wanted."
- Ch.6: verbatim opening sentence, no compression.
- Ch.7: verbatim opening sentence, no compression.

## Markup-only conversions (identical wording, new HTML — spec's allowed edit #4)

- Ch.1: the three responsibilities → `<ol class="responsibilities">`.
- Ch.1: the six-step development workflow → `<ol class="step-block">`.
- Ch.1: the four-item "Then it's your turn" list → `<ul class="checklist">`.
- Ch.1: the continuous-improvement table → `<table class="table-designed">`.
- Ch.2: the four-step superpowers loop → `<ol class="step-block step-block--small">`.
- Ch.4: the repo-size table → `<table class="table-designed">`.
- Ch.7: the six-agent bullet list → `<table class="table-designed table-roster">` (see
  Ch.7 entry above — this one also involved splitting sentences at a colon, so it's
  listed there too).

## Other build notes (not prose deviations)

- Heading `id` anchors are generated by a small hand-written slugifier in
  `eleventy.config.js` (lowercase, strip punctuation, hyphenate) rather than reproduced
  from the old MkDocs/Python-Markdown slugger. IDs are new to this site's URLs, not
  ported from the mkdocs build, since chapter URLs themselves changed.
- `README.md`'s "The tools" section and MkDocs-only content (`guide/index.md`, which is
  itself a generated stub with a build-time include comment) were not carried over as
  separate pages — `guide/index.md` had no independent prose beyond the generation
  notice, so nothing was dropped.
