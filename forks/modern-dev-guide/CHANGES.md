# CHANGES

Every prose deviation from the source files in `../../guide/` and `../../README.md`,
logged as required by `tasks/specs/modern-dev-guide.md`. Format: page → original text →
new text → reason.

Two changes are global (markup-only, applied identically to all seven chapters) and are
logged once here rather than per page:

- **Title extraction.** The leading `# Title` line was removed from the body of every
  chapter and moved into frontmatter (`title:`), which `Chapter.astro` renders as the
  page's `<h1>`. No wording changed, only where it lives.
- **Cross-reference links.** Every internal relative link (`harness-and-model.md`,
  `writing-a-vision.md`, `codebase-docs.md`, `writing-an-issue.md`, `workflow.md`,
  `review-loop.md`, `START-HERE.md`) was rewritten to the fork's own route
  (`/guide/harness-and-model`, etc.), per the spec's cross-reference-seam allowance. Link
  text unchanged.

---

## start-here.md (from START-HERE.md)

START-HERE is the one page where callouts must *not* remove sentences from the reading
flow, so all three callouts below are **wraps in place**: the sentence stays exactly
where it was, just styled as a callout. No stitch was needed for any of them.

- Original: `Don't stress about using the bleeding edge as long as you're using
  something.` (§1, own paragraph)
  New: wrapped in `:::recommendation ... :::` in place.
  Reason: proposal §2 Recommendation callout, START-HERE §1.

- Original: `**Critical:** anything you give the agent it will take at face value as
  truth, so docs are first-class artifacts, not afterthoughts.` (§2.2)
  New: wrapped in `:::ownit ... :::` in place.
  Reason: proposal §2 Own-it callout, START-HERE §2.2.

- Original: `Because a guardrailed agent will often follow instructions to the letter,
  an over-specific rule can be worse than nothing at all.` (§2.4)
  New: wrapped in `:::gotcha ... :::` in place.
  Reason: proposal §2 Gotcha callout, START-HERE §2.4.

- **Not applied:** proposal §2 notes an Own-it "twin" at START-HERE §2.3 ("If you don't
  take ownership of the spec the agent is about to implement, then you don't own
  anything."). Left as plain prose, unchanged, to stay within the spec's 2–3
  callouts/page budget (START-HERE already has three). The canonical instance of this
  idea is the Own-it callout on writing-an-issue.md.

- Structural: the opening three-item list ("Use a capable model" / "Use a quality
  harness" / "Provide context to the model") and the §3 "then it's your turn" checklist
  were each wrapped in a `:::steps` container. Text unchanged; this is the numbered-step
  treatment named in the spec's content-mapping section.

- Structural: `::diagram{name=context-stack}` inserted after the §2 intro paragraph
  ("...embed much of the understanding ahead of time within the appropriate level of the
  project."), and `::diagram{name=workflow}` inserted directly under "the actual coding
  workflow goes something like this:", before the numbered list. No text removed.

- Glossary term marks added (see "Glossary term marks" section below for the full
  per-page list and rationale): `harness`, `specs`→`spec`, `flagship model`,
  `context window`, `subagents`→`subagent`, `skill`, `commit-pinned`, `CLAUDE.md` —
  one each on this page.

## harness-and-model.md

- Original: `Run your agent on your actual machine, not in a browser tab. You want it in
  your real environment, with your tools and your repo, able to run and smoke-test what
  it builds.` (Practical notes)
  New: first sentence moved into `:::recommendation ... :::`; second sentence kept as
  the paragraph that follows it (it was already a complete, standalone sentence, so no
  stitch was needed).
  Reason: proposal §2 Recommendation callout, harness-and-model/Practical notes.

- Structural: the superpowers loop (Spec first / Implement to the spec / Review by a
  fresh agent / Verify) wrapped in `:::steps`. Text unchanged.

- Glossary term marks: `flagship model`, `harness`, `spec`, `worktree` — see the
  "Glossary term marks" section below for exact placements.

## writing-a-vision.md

- Original: `Then read the draft by hand and edit it. *Do not skip this.* Every
  downstream decision is grounded on your vision, so it has to be right, and you are the
  owner. The LLM is just helping you write.`
  New: first two sentences moved into `:::ownit ... :::`; remaining two sentences kept
  as the following paragraph. Already standalone, no stitch needed.
  Reason: proposal §2 Own-it callout, writing-a-vision/How to write one.

- Original: `Keep it to a page or two. If your vision is more than two pages, the detail
  you're adding probably belongs downstream in requirements or architecture, not here.
  Aim for the shortest document that can still settle a "which way should I build this?"
  question correctly.`
  New: entire paragraph moved into `:::recommendation ... :::`.
  Reason: proposal §2 Recommendation callout. The proposal's own quotation of this
  callout uses an ellipsis ("Keep it to a page or two. … Aim for the shortest
  document..."); read that as the proposal doc abbreviating its own quotation for space,
  not an instruction to drop the middle sentence, so the full paragraph was moved intact
  rather than inventing a shortened version.

- Glossary term mark: `skill` — see the "Glossary term marks" section below for exact
  placement.

## codebase-docs.md

- Original (Authoring rules list item): `**No line numbers.** They go stale the moment
  the code moves. Files and functions are the finest granularity worth referencing.`
  New: entire bullet moved into `:::gotcha ... :::`, removed from the list (which now
  has 3 items instead of 4).
  Reason: proposal §2 Gotcha callout. The proposal quotes only the first two sentences;
  moving the whole bullet keeps its content together instead of splitting it mid-bullet,
  which would have left an orphaned third sentence needing an invented new lead-in.
  Logged as a deviation from the proposal's exact quoted span.

- Original: `...But you _have_ to read them and own them. Anything you give the agent,
  it will take at face value as truth.\n\nSo your docs are first-class artifacts, as
  load-bearing as the code. Read them, understand them, and stand behind them.`
  New: `Anything you give the agent, it will take at face value as truth.` moved into
  `:::ownit ... :::`; both surrounding paragraphs otherwise unchanged and read
  standalone. No stitch needed.
  Reason: proposal §2 Own-it callout (paired with the separate START-HERE §2.2 instance
  of the same candidate, per the proposal's dual-source listing).

- Original: `Read them, understand them, and stand behind them. If your documents are
  too long to review...make them shorter. If your team is generating documentation
  nobody reviews, you're feeding garbage in and you'll get garbage out.`
  New: `If your documents are too long to review...make them shorter.` moved into
  `:::recommendation ... :::`; surrounding sentences kept, read standalone. No stitch
  needed.
  Reason: proposal §2 Recommendation callout, codebase-docs/You own the docs.

- Glossary term marks: `context window`, `CLAUDE.md` — see the "Glossary term marks"
  section below for exact placements.

## writing-an-issue.md

- Original: `The pinning matters because of timing. You might plan an issue at the start
  of the week and implement it days later, and the code moves in between. Agents follow
  stale instructions exactly as faithfully as good ones (right off a cliff) so you don't
  want an over-specified plan full of exact line numbers and code that will be wrong by
  the time someone picks it up.`
  New: `Agents follow stale instructions exactly as faithfully as good ones (right off a
  cliff).` moved into `:::gotcha ... :::` (added a closing period). The remainder was
  restitched from `...(right off a cliff) so you don't want an over-specified plan...` to
  `That's why you don't want an over-specified plan...` (capitalized; "so" → "That's
  why").
  Reason: proposal §2 Gotcha callout, writing-an-issue/The two-layer issue. One-clause
  stitch needed because the removed clause was joined to the remainder by a lowercase
  conjunction with no subject of its own.

- Original: `A good issue should be one reviewable PR. An LLM will casually write ten
  thousand lines of code if you ask it to...so don't.`
  New: first sentence moved into `:::recommendation ... :::`; remainder starts fresh at
  "An LLM will casually write...". No stitch needed.
  Reason: proposal §2 Recommendation callout, writing-an-issue/Right-size it.

- Original: `But this beautiful process only works if you actually read what the agent
  drafted. If you don't own the spec it's about to implement, you don't own anything.`
  New: second sentence moved into `:::ownit ... :::`; first sentence kept, unchanged. No
  stitch needed.
  Reason: proposal §2 Own-it callout, writing-an-issue/The payoff.

- Glossary term marks: `skill`, `commit-pinned` — see the "Glossary term marks" section
  below for exact placements.

## workflow.md

- Original: `One fair warning on that last option: orchestration skills tend to be
  mildly specific to one repo, because they encode how *you* deploy, *your*
  conventions, and *your* gotchas. Use someone else's as a starting point, not a
  drop-in.`
  New: lead-in clause `One fair warning on that last option:` kept as its own line of
  prose; everything after the colon moved into `:::gotcha ... :::`. No stitch needed —
  the colon already reads as a natural introduction to what follows.
  Reason: proposal §2 Gotcha callout, workflow/What should happen.

- Original: `...it is still your job to run it locally, confirm it actually does what
  it should, and read the code yourself. The agent passing its own tests does not mean
  the code is good. You have to look.`
  New: last two sentences moved into `:::gotcha ... :::`; remainder ends cleanly at
  "...and read the code yourself." No stitch needed.
  Reason: proposal §2 Gotcha callout, workflow/You still own the result.

- Structural: `::diagram{name=workflow variant=small}` inserted after the full "The core
  loop is small..." paragraph (What should happen, and who makes it happen).

- Glossary term marks: `spec`, `harness`, `skill`, `worktrees`→`worktree`,
  `orchestration` — see the "Glossary term marks" section below for exact placements.

## review-loop.md

- Original: `Treat its results only as a starting point. You are responsible for what
  goes into the agent, so read it carefully, delete what's wrong, add what you want, and
  grow it into a custom review.md skill you distribute to the team. It improves with the
  repo and applies to agent-written and human-written code alike.`
  New: first two sentences moved into `:::ownit ... :::`; last sentence kept as a
  trailing paragraph.
  Reason: proposal §2 Own-it callout, review-loop/Seed it from your PR history. No
  stitch needed for the remainder's grammar, though note "It" now refers back to the
  review.md skill named at the end of the immediately preceding callout rather than in
  plain prose.

- Structural: `::diagram{name=review-pipeline}` inserted after "So it's a pipeline of
  narrow agents, and you run the ones a given project actually needs:", before the list
  of six review agents.

- Glossary term marks: `harness`, `spec`, `context window`, `skill` — see the "Glossary
  term marks" section below for exact placements.

---

## Glossary term marks

Scope (per orchestrator direction): mark the **first occurrence of each glossary term on
every page where the term appears verbatim**, max one mark per term per page. Inflections
are allowed via the `key=` form where they read naturally (`subagents`→`subagent`,
`specs`→`spec`, `worktrees`→`worktree`). Marks go in plain body prose only — never inside
a callout, heading, code block, or link text; where a page's first occurrence sits in one
of those, the next plain-prose occurrence is used instead. All marks sit on existing
verbatim words; no text was added or changed.

Per-page marks:

- **start-here.md** (8): `harness` ("Use a quality harness", responsibilities list);
  `specs`→`spec` (same list item, "writes specs"); `flagship model` (§1 "using a
  flagship model"); `context window` (§2.2 "inserted into the context window of the
  agent"); `subagents`→`subagent` (§2.2 "trivial to spawn subagents"); `skill` (§2.3 "An
  agentic skill reads the dump"); `commit-pinned` (§2.3 "commit-pinned implementation
  plan"); `CLAUDE.md` (§2.4 body "carefully follow a CLAUDE.md" — the §2.4 heading's
  occurrence is a heading/code span, so the first body occurrence is used).
- **harness-and-model.md** (4): `flagship model` ("use a powerful flagship model");
  `harness` ("A harness fixes that" — earlier occurrences are in headings only); `spec`
  ("writes a design spec", superpowers loop step 1); `worktree` ("an isolated git
  worktree").
- **writing-a-vision.md** (1): `skill` ("We have a skill that helps you write a
  vision.md" — the section heading's occurrence is skipped as a heading). No other
  glossary term appears verbatim on this page.
- **codebase-docs.md** (2): `context window` ("doesn't fit usefully in a context
  window"); `CLAUDE.md` ("CLAUDE.md can tell the agent", Authoring rules).
- **writing-an-issue.md** (2): `skill` ("the issue-writing skill"); `commit-pinned`
  ("A collapsed, commit-pinned implementation sketch"). `spec` appears on this page only
  inside the Own-it callout ("If you don't own the spec...") — prohibited context, and
  there is no other verbatim occurrence, so it is not marked here.
- **workflow.md** (5): `spec` ("the agent writes a spec from your issue"); `harness`
  ("Let the harness drive it"); `skill` ("Write a skill that constrains it");
  `worktrees`→`worktree` ("between different git worktrees"); `orchestration` ("If your
  orchestration agent", Parallel agents — the page's earlier occurrence sits inside the
  Gotcha callout, and the one before that is link text, so the first plain-prose
  occurrence is used).
- **review-loop.md** (4): `harness` ("With a good harness, review happens in two
  places"); `spec` ("checks the implementation against the spec"); `context window`
  ("no single context window usefully holds"); `skill` ("as the learn-from-pr-reviews
  skill" — the word "skill" itself is outside the link text).

Not marked, with reasons: `orchestrates` in START-HERE's responsibilities list was left
unmarked — it is a verb inflection of the noun term `orchestration` (a bigger stretch
than the plural/abbreviation inflections above) and the same list item already carries
two term marks. `flagships` (plural, START-HERE §1 and harness-and-model) is a repeat of
an already-marked term on those pages. `subagent` appears verbatim only on start-here.
