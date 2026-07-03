# Implementation spec: Workshop fork

Builds `forks/workshop/` — the guide restaged as the **visual aid for a live 30–60 minute
workshop**. The presenter speaks the prose; the screen shows headlines, quotable lines,
and diagrams. Same scrollytelling style and engine as `forks/scrolly-essay/`
(see [tasks/research/ajinkya-ai-case-study.md](../research/ajinkya-ai-case-study.md));
different editing license and different chrome.

**Editing license (differs from all prior forks):** significant editing is allowed.
On-screen copy is specified below — a mix of the guide's own lines and new connective
copy — and may be tuned for rhythm. Speaker notes must track the guide faithfully
(lightly adapted prose, no invented claims). CHANGES.md is not required; instead ship
`COVERAGE.md` (see below).

## Hard requirements

- Touch nothing outside `forks/workshop/`. Do not commit.
- **Coverage:** every section of the guide must be covered by some scene, on screen or
  in that scene's speaker notes. The coverage map at the bottom of this spec is the
  contract. Ship it as `forks/workshop/COVERAGE.md` (source section → scene → on-screen
  vs notes), updated to match what you actually built.
- No external requests; fonts self-hosted (same fontsource packages as scrolly-essay).
- Degradation: with JS off or `prefers-reduced-motion`, the page is a linear document
  with ALL speaker notes visible — the handout version. Scene heights/pinning/reveals
  only under `html.anim`, exactly like scrolly-essay.
- Native scroll only; the engine reads scroll position, never hijacks it.

## Stack & chrome

- Eleventy v3, port **8095** (`dev` → `--serve --port=8095`). Single page (`index.njk`)
  + `workshop.css` + `engine.js`. Deps: `@11ty/eleventy`, `@fontsource/space-grotesk`,
  `@fontsource/ibm-plex-mono`.
- **Engine:** start from `forks/scrolly-essay/src/js/engine.js` (copy it; same tick
  loop, reveals, pipeline pattern, re-ticks) and add the presenter layer:
  - **Keyboard nav:** `→`/`↓`/`Space` smooth-scroll to the next scene anchor, `←`/`↑`
    to the previous; `Home`/`End` to first/last. Respect reduced-motion (instant jump).
  - **Notes toggle:** `N` toggles `html.notes`; speaker notes (`<aside class="notes">`
    per scene) are `display:none` by default under `html.anim`, visible when
    `html.notes` (and always visible without `html.anim`).
  - **Help overlay:** `?` toggles a small mono overlay listing the keys. Dismiss with
    `?`/`Esc`/click.
- Visual identity: same palette and type as scrolly-essay (bg `#0a0d14`, ink `#eef2fb`,
  muted `#8b95ab`, accents `#5b9cff`/`#36d6c3`/`#ffc65c`; Space Grotesk display,
  IBM Plex Mono eyebrows/labels), but **bigger**: this is read from the back of a room.
  Headline beats `clamp(36px, 5.5vw, 72px)`; supporting lines ≥22px; diagrams and cards
  scaled up; at most ~40 words visible per beat.
- Chrome: top progress bar; bottom-left corner caption (`ACT 04 · THE ISSUE`);
  bottom-right mono hint `→ next · N notes · ? keys` (fades out after first keypress).
  Speaker notes render in a distinct muted panel with a mono `NOTES` label and the
  act's pacing hint (`≈ 5 MIN`).

## The acts (scene-by-scene)

Each scene: `id`, `data-title`, on-screen copy (final unless it fights the layout),
visual, and what its notes must cover. Scene heights per the case-study pattern
(~200–320vh under `html.anim`; auto without). Act numbers appear as full-bleed mono
eyebrows opening each act's first scene.

### ACT 0 — THE HOOK (≈3 min)

**S1 `#hook`** — eyebrow `A WORKSHOP · WORKING WITH LLMS`. Huge: **"Modern agents write
good code."** Beat 2: *"The hard part is getting them to build the right thing, the
right way, for your project."* (italic accents on right/right/your). Beat 3, mono:
`scroll ↓ · press ? for keys`.
Notes: README intro ("This guide will not try to teach you everything…") + what this
workshop is; pacing hint ≈3 min.

**S2 `#the-question`** — "In 2026, the question is no longer *can an LLM write good
Python?*" Then three staggered accent lines: **does it do what you actually wanted** /
**does it fit the whole project** / **does it respect the constraints**. Closing beat:
"When an agent writes bad code, it usually wasn't the model. It was missing
instructions and context."
Notes: START-HERE intro paragraphs, near-verbatim.

### ACT I — GOOD CODE ISN'T ENOUGH (≈5 min)

**S3 `#failures`** — four cards stagger in (from writing-a-vision): **Built the wrong
thing** (solved a misunderstood problem) / **Mis-sized it** (over-engineered the simple,
under-built the load-bearing) / **Ignored a hard constraint** (cost, scale, compliance)
/ **Gold-plated** (features nobody asked for). Closing beat, large: **"None of these
are the model writing bad code. The code is probably fine."**
Notes: writing-a-vision "What a good vision prevents", full.

### ACT II — YOUR THREE JOBS (≈5 min)

**S4 `#three-jobs`** — three numbered cards: **01 A capable model** ("flagship, when in
doubt the most capable you have") / **02 A real harness** / **03 Context** ("your
vision, your architecture, your standards"). 
Notes: START-HERE responsibilities + §1 Model paragraph + harness-and-model "The model"
(incl. "don't chase leaderboards").

**S5 `#harness`** — "A raw model is a fancy next-word predictor." Then a 4-step
pipeline animation (case-study pattern, N=4): **Spec first → Implement to the spec →
Fresh-agent review → Verify**. Beat: "Nothing moves forward until it checks out."
Notes: harness-and-model "What a harness actually does", the superpowers stack +
install commands, worktrees + model-delegation asides, "Practical notes" (run on your
actual machine; don't agonize about staying current).

### ACT III — WHERE CONTEXT LIVES (≈3 min)

**S6 `#context-stack`** — the anchoring visual, reused from scrolly-essay but
presenter-scaled: pinned stack of four layers (`vision.md` / `codebase docs` /
`the issue` / `CLAUDE.md`) feeding **the agent's context window**; layers light
sequentially as short beats pass: "Re-telling the agent everything, every chat, is a
losing battle." → "So embed the understanding in the project itself — at the right
level." Each layer's beat is one line naming what it answers: why / how it works /
what to do / the rules.
Notes: START-HERE §2 intro, near-verbatim.

### ACT IV — THE FOUR ARTIFACTS (≈20 min; each scene opens with a mono act-break eyebrow)

**S7 `#vision`** — headline **"Vision — why the project exists."** Beats: a 3-step
mini-pipeline **word-vomit for 10–15 minutes → the LLM organizes the draft → you edit
it** with the third step flagged **"Do not skip this."**; then rule chips (mono, small):
`a page or two, max` · `the agent reads it every task` · `misaligned output? fix it
here`.
Notes: writing-a-vision "How to write one" / "How to operate it" / the skill pointer;
START-HERE §2.1.

**S8 `#docs`** — headline **"Codebase docs — how the code actually works."** Visual 1:
the scale table as three revealing rows: `small & clean → a README` / `big but modular →
per-module READMEs + architecture.md` / `gnarly legacy → a full tutorial system`.
Visual 2: four compact chips for "why not just read the code": `too many tokens` ·
`big context ≠ good decisions` · `it only opens files it thinks it needs` · `the why
isn't in the code`. Closing beat, large: **"Anything you give the agent, it takes at
face value as truth."**
Notes: codebase-docs full (what to capture, options incl. codebase-tutorial, authoring
rules, you-own-the-docs) + START-HERE §2.2.

**S9 `#issue`** — headline **"The issue — what to build, exactly."** Beat 1: "Don't
let the bot interrogate you." (anti-pattern). Beat 2: the flow: **team hash-out → mic
on, brain-dump → the skill researches the repo and drafts**. Visual: the two-layer
issue as a document diagram — top block "the human's layer: motivation, the task, done
criteria — no file paths" over a collapsed block "the agent's layer: commit-pinned
implementation sketch". Beat 3: **"A good issue should be one reviewable PR."** Beat 4:
"Tell it *why*, or don't be surprised by *how*." (motivation).
Notes: writing-an-issue full (anti-pattern, two layers, pinning/staleness, motivation,
right-sizing + MMGIS example, payoff, the skill) + START-HERE §2.3.

**S10 `#claude-md`** — headline **"CLAUDE.md — the ironclad rules."** Visual: two
columns; left (accent check) three good rules: `"prefer modular features over one-off
scripts"` / `"never commit until I've reviewed the changes"` / `"always read vision.md
before starting"`; right (dimmed ✕): `"if there are more than five files, put them in
a folder"` labeled *over-specific — worse than nothing*. Closing beat: "Some problems
aren't CLAUDE.md problems. Protect main on GitHub instead."
Notes: START-HERE §2.4 full, incl. the hooks aside.

### ACT V — THE LOOP IN MOTION (≈10 min)

**S11 `#workflow`** — the six-step pipeline animation (N=6): **reads the vision →
reads the docs → reads the task → writes the spec → implementation agent builds →
review agent checks**. Beat: "By the time you code, the thinking should be done."
Notes: START-HERE §3 steps + workflow.md "By the time you code" and "What should
happen, and who makes it happen" (three ways to drive the loop, orchestration-skill
warning).

**S12 `#your-turn`** — headline **"Then it's your turn."** Four checklist items
stagger: **smoke-test it → read the code → understand the code → iterate, then
deliver**. Closing beat, large: **"The agent passing its own tests does not mean the
code is good. You have to look."**
Notes: workflow.md "You still own the result" + "Learning code you didn't write"
(diff-explainer) + START-HERE "your turn" list.

**S13 `#parallel`** — headline **"Run several at once."** Visual: three vertical lanes
(worktree cards: `own port · own db · own config`) lighting sequentially, each lane
running a mini spec→build→review strip. Beat: "Small issues, in parallel — instead of
one giant PR." 
Notes: workflow.md "Parallel agents" (mmgis-deployment) + "Exploratory tasks" (specify
the parameters, spawn agents down different paths, compare against your baseline).

### ACT VI — THE FLYWHEEL (≈7 min)

**S14 `#review`** — beat 1: "Review happens twice before a human ever sees it."
(in-session + custom pipeline on the diff). Beat 2: "No single context window holds
the vision, the docs, the issue, the diff, and the tests." Visual: six roster cards
stagger in: `project alignment` / `security & architecture` / `craftsmanship` /
`test quality` / `doc freshness` / `open-ended`. Beat 3: "Seed it from your PR history
— then own what goes in."
Notes: review-loop.md full (two places, pipeline rationale, all six agents' one-liners,
learn-from-pr-reviews caveats).

**S15 `#improvement`** — headline **"Every failure tells you which artifact to fix."**
The four-row mapping reveals row by row: `misaligned decisions → the vision` /
`context-blind mistake → the codebase docs` / `code your reviewer wouldn't accept →
the review` / `oversized, sprawling PR → the issue`. Closing beat: **"Do this and your
harness gets better every cycle."**
Notes: START-HERE "Continuous improvement" full.

### ACT VII — THE CLOSE (≈2 min)

**S16 `#close`** — huge: **"If you don't own the spec the agent is about to implement,
you don't own anything."** Beat 2: "You can delegate the typing. You can't delegate
the owning." Final card (auto-height outro): links to the full guide
(https://madebycarson.com/working-with-llms/) and the tools
(https://github.com/CarsonDavis/claude), mono sign-off.
Notes: the ownership refrain's sources (START-HERE §2.3, writing-an-issue payoff,
codebase-docs you-own-the-docs); pointer to the guide as the take-home text.

## Coverage map (ship as COVERAGE.md, updated to as-built)

| Source | Scene(s) |
|---|---|
| README (intro, how-to-use, tools) | S1 notes, S16 |
| START-HERE intro + responsibilities | S2, S4 |
| START-HERE §1 / harness-and-model (all) | S4, S5 |
| START-HERE §2 intro | S6 |
| §2.1 / writing-a-vision (all) | S3, S7 |
| §2.2 / codebase-docs (all) | S8 |
| §2.3 / writing-an-issue (all) | S9 |
| §2.4 CLAUDE.md | S10 |
| START-HERE §3 / workflow.md (all) | S11, S12, S13 |
| Continuous improvement / review-loop.md (all) | S14, S15 |
| Ownership refrain | S12, S16 |

## Verification (all required)

1. Clean build; serve on 8095; `/` returns 200; all 16 scene ids present.
2. **Coverage check:** walk COVERAGE.md against the built page — for each source
   section confirm its scene's notes actually contain that material (grep for
   distinctive phrases). Report any gaps honestly.
3. Keyboard nav: Playwright — press `→` three times from top, confirm scroll lands at
   S2, S3, S4 anchors; `←` returns; `N` toggles notes visibility; `?` opens the help
   overlay. Screenshot notes-on state.
4. Visual checks at 1440px: hook; context stack mid-scene (a layer lit); the CLAUDE.md
   good/bad columns; workflow pipeline mid-scene; the improvement table mid-reveal;
   the close. Confirm progress bar + corner caption. One 390px mobile capture.
5. Degradation: JS off → linear page, all notes visible, no dead gaps (screenshot).
6. Zero external requests. Kill servers when done.

Report: what was built, verification results (explicit), the as-built COVERAGE.md
summary, and any copy you tuned away from this spec's wording.
