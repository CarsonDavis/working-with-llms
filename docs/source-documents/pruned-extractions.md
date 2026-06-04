# Pruned Extractions — Actionable Core

The concise, actionable core distilled from the team working session. Three lists:

- **A. Documents / artifacts** — things that get written and live in a repo (or on your machine).
- **B. Processes** — how we work with the LLM.
- **C. LLM issues** — the problems worth designing around.

This is the *pruned* set: individual-preference workflows, unactionable grievances, redundancies, and ideas judged wrong or not useful have been cut, and several intrinsic-limitation claims reframed as the prompting/process problems they usually are.

---

## A. Documents / artifacts

1. **Vision document** (`vision.md`) — why we're doing this, big-picture goals and constraints, how it fits into the wider org. The genuinely new LLM-era artifact; keeps agents from making context-blind mistakes. Owned and read by the project owner; ~1–2 pages.

2. **Requirements / use-cases / user-stories** — normal software-engineering docs that flow out of the vision via requirements gathering. Kept as *drafts* (don't waterfall everything; some emerge during the work).

3. **Plan artifacts** — written plans produced while planning with the LLM (e.g. superpowers plans). Persist across sessions; tracked in the repo for personal projects, GitHub issues for collaborative ones.

4. **GitHub issues** — well-formed, detailed, LLM-ready issues that capture business-logic requirements. A real artifact a human reads and signs off on.

5. **Review document / review agent** (`review.md` or a skill/agent) — encodes "how the code should look," built up over time from human review findings. One of the two documents with the strongest conviction behind it.

6. **Overview / codebase tutorial** — explains the project so an agent (and a new human) has the whole-codebase picture; prevents "great CI/CD that forgot the build script" mistakes. ~20k tokens; human-verified once, updated as part of PR review. Can be a full tutorial pipeline or something simpler.

7. **`architecture.md`** — project-specific architectural intent (the intended split between components, etc.).

8. **Conventions — two levels:**
   - **Group/org-wide conventions** (how we do IaC, AWS, deployments) — pick something reasonable, point at a canonical reference implementation.
   - **Project-specific conventions** — override group conventions where needed (e.g. group says CDK, this project uses Terraform).

9. **Changelog** (`changelog.md`) and **Roadmap** (`roadmap.md`) — for long-horizon (multi-week) projects; interconnected (roadmap seeded from vision; stakeholder additions flow into roadmap; ties back to changelog).

10. **`CLAUDE.md` / agent instructions** — where machine-specific behavior and "use the skill, don't claim you can't fetch the page" rules live; one valid place to embed project context.

11. **Machine-wide (global) skills** — deep-research, documentation-research (fetch the real official docs, not a blog post), download/playwright (actually retrieve a page), screenshot (for testing/verification).

12. **Diff-explainer pipeline (agent + reusable front end)** — *not* a code review; a code *explainer*. Plug in a PR/branch; get a brief of intent, a GitHub-like file explorer, and per-file what / why / impact alongside the real code.

13. **Tutorial-generation pipeline (6 agents)** — survey → spread (sub-agent per component) → synthesize → fact-check claims against code → glossary/links → quiz. Produces code-heavy and plain-English ("executive summary") variants.

14. **Quiz artifact** — educational distractors (wrong answers teach why they're wrong); lets a human check their own understanding of the codebase.

15. **Hooks** — pre-commit checks; a "left hook" before risky actions (e.g. before a `tofu`/Terraform apply: "are you on prod? did you run X?"). Largely solved by existing harnesses; debated whether to own them.

16. **`word-vomit.md`** — the transient brain-dump artifact that becomes the vision / requirements; can also carry conventions as pointers to canonical repos.

17. **Brainstorming / issue-creation skill** — helps the person who understands the work produce a good issue; the place to enforce "break this issue down if it's too big."

18. **Testing suite / `testing.md`** — integration-focused; a candidate, not certain to be core.

19. **Curated skills set from a community repo** — download the high-ranked skills you need (skills.sh), with a caution about bloat.

---

## B. Processes

1. **Word vomit → vision document.** Speak 15–20 minutes about everything that matters; have the LLM organize it; **read the result by hand**. Decisions downstream are grounded on it, so it must be correct.

2. **Requirements gathering.** Use a brainstorming skill to flesh out what the vision missed; translate into draft user stories / hard requirements / technical specs.

3. **Plan with the LLM, keep the plan as a tracked artifact.** Personal projects: track plans in the repo (not GitHub issues). Collaborative: use issues.

4. **Point to canonical reference implementations for conventions.** "Deploy this the way we deploy in `<repo>`." Lets the agent follow the current good pattern and improve on it.

5. **Small Greenfield → one-shot, then issue-based fixes.** Let it build everything, look at it on the real internet, find individual misalignments, fix via issues; document persistent misalignments back into the vision.

6. **New feature → build documentation/tutorials *first*.** Turn code-knowledge into English before coding; rewrite the tutorial through the lens of the specific task; then hand the task to the implementer. (5,000 tokens of code → a paragraph of English.)

7. **Integration tests over unit tests.** Only rely on tests you personally understand and can reason about; LLM unit tests are near-useless for *validating* LLM work.

8. **Bug fix with a feedback loop.** Give the LLM the metric for "fixed" (screenshots, curls) so it can iterate autonomously. Alternative: state the hypothesized cause and have the LLM argue for/against it.

9. **Optimization via a measurement harness.** Never let the LLM guess. For cost: scrape real AWS cost tables → build a Python cost suite → feed real deployment data. For speed: build a benchmark suite, run design variants in separate git worktrees, measure. Iterate on the metric.

10. **The cyclic harness-improvement loop ("Fridays").** Set aside regular time to look at where LLMs failed last cycle (wrong feature, missed review item, thin issue) and feed that lesson back into the relevant artifact (vision skill, issue skill, review agent, hook). The harness improves every cycle.

11. **Review with the knowledgeable person, capture findings forever.** The SME/team-lead and the author review the LLM's code together; what they find is written into the review agent/document and reused. Counterintuitively, review *with* the SME rather than pre-polishing alone.

12. **Separate conversations for separate concerns.** Implement in one conversation; start a *fresh* conversation as an adversarial "junior dev" security reviewer; feed its findings back to the implementer (which holds full context) to triage which are real.

13. **Tutorial sign-off + maintenance.** A human (the SME) reads the generated tutorial once, confirms it's roughly correct; thereafter each PR updates the tutorial text files, and that update is part of review.

14. **Multiple documentation altitudes.** A code-heavy tutorial (real function names, for people who'll touch that code) *and* a plain-English executive summary; the agent reads all of it, a human reads the page relevant to their section.

15. **Curate skills from a high-ranked community repo**, downloading only what you need (mind the bloat).

16. **Superpowers TDD workflow.** Spec → review → implementation plan → review → failing tests → code until pass → self-review → fresh-context review agent.

17. **Small issues → small PRs.** You control PR size at issue scope; keep PRs small enough that a human can actually stay in the loop.

18. **Specify end goals and conditions, not adjectives.** Don't say "make it good/secure/ optimized"; say "modern dark-mode-first website," "optimize for speed using a lookup table," with conditions you understand.

19. **Remove shame; share openly.** Sit down together with the agent when someone doesn't understand the code; share AI-generated docs and skills across the team so no one re-engineers the same solution.

---

## C. LLM issues

### C1. Intrinsic model limitations

1. **Context-blindness.** A single isolated session doesn't know the larger project/team/ business context, so it makes mistakes a knowledgeable human wouldn't. *(The core thesis.)*

2. **Big context ≠ good decisions.** An agent can read all the code, but can't make good decisions off a huge context window — you often must compress code-knowledge into English (tutorials) first.

3. **Unit tests are near-useless for validating LLM work.** LLMs write code that passes unit tests but fails *integration* tests; you get 1,000 great unit tests and no real validation.

4. **Poor reuse.** With bad prompting, the LLM might re-create the same function in many places; it has no "laziness" pressure to reuse existing components.

5. **"Works / looks done" ≠ maintainable, portable, production-ready.** A single-HTML one-shot can look finished but not support the real process; a flashy demo can be missing 60% of the hard parts.

6. **Defaults to brute force.** With bad prompting, the LLM might not use caching, lookup tables, pointers, or queues unless explicitly told *which* optimization to apply.

7. **Dangerous at security patching.** Trained on old data: "fixes" a CVE by pulling in another vulnerable/old library; grounded to libraries it knows; unaware of today's vulnerabilities or OS-level issues; OS migrations break. Must be human-handled.

8. **Adjectives don't always work.** "Make it good/secure/optimized" sometimes fails; concrete end goals and conditions are better.

9. **It's advanced search, not a thinker.** Returns the most-probable solution, not necessarily the right one; can't solve every problem; "thinking is a human thing."

10. **Non-maintainable code by default.** Left alone it produces a lot of non-maintainable code; it's a process problem to counter it.

### C2. Human / team behavior amplified by LLMs

11. **Juniors stop learning the project.** Understanding used to come from *writing* the code; now the LLM writes it, so people don't gain understanding, lose the ability to verify, and "de-wire" the skill.

12. **Lack of ownership / not asking questions / not reading artifacts.** People delegate to the LLM, pass the output through without understanding, and don't take responsibility for the result. Not a new problem (seen since ~2018) but bigger and more frequent now.

13. **Over-confidence.** People defend an answer *more* strongly because the LLM produced it; wasteful "prove I'm right" arguments.

14. **Shame.** People who don't understand the code parrot the LLM and won't admit the gap; fixable by sitting down together with the agent.

15. **Not throwing code away.** Code is cheap and ideal for disposable experiments, but people don't experiment-and-discard, so they miss perspectives.

16. **Negative instructions outperform positive.** "Don't do X" is followed; "do X" invites liberties. A workflow quirk to design around.

### C3. Organizational / external

17. **Flashy demos taken at face value.** Vibe-coded demos (including by outside students) look complete to stakeholders; creates pressure to "go faster"; the guardrails (CI/CD, OIDC, reviews) are invisible to the people funding the work.

18. **Tooling/skill repos bloat.** Community skill repos can carry hundreds of skills; downloading everything over-bloats the harness.

19. **Data / privacy.** Using a vendor model sends everything to the vendor's servers — a real concern for sensitive projects; argues for AWS-hosted/provisioned models.

20. **Skill atrophy / dependence.** Offloading thinking to AI erodes algorithmic reasoning over time; "either you do it, or you delegate it for the rest of your life."

---

## Cross-cutting themes

- **The unifying fix is written context + human ownership of it.** Almost every issue in C is answered by some artifact in A plus some process in B — *if* a human owns and reads that artifact.
- **Standardize artifacts, debate standardizing tools.** Strong agreement on common documents; genuine disagreement on mandating models/harnesses/hooks.
- **The loop is the point.** Static conventions decay; the harness-improvement cycle is what makes this durable.
