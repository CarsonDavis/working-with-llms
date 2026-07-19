# Implementation Plan: The Working With LLMs Install & Enforcement System

**Status:** Draft for review · 2026-07-19
**Builds on:** `tasks/research/portable-workflow/` (synthesis + candidate architectures)
**Chosen architecture:** Candidate B (native plugin marketplace + per-repo adoption)

---

## 1. What we're building and why

The guide teaches a workflow for coding with agents (vision → codebase docs → carefully
scoped issues → spec/implement/review loop). Today that workflow is delivered as prose plus
some skills a human installs by hand and must *remember* to follow. This project turns it
into a system that (a) installs on a user's machine with one command and (b) can *enforce*
the process, not just document it.

This is the "working-with-llms auto-installer" named as a sibling deliverable in the
`llm-workshop` vision: the LLM hub at `llms.codebycarson.com` hosts and links the installable
bundle, and the workshop's resource links point at it.

### The two layers (the core design idea)

- **Capability** — the skills and agents — is installed **once per machine** by each developer.
- **Process enforcement** is **adopted explicitly per repo** by a human decision.

This split is deliberate: it mirrors the guide's own philosophy (humans own the process; the
system makes the right thing the default) and it fixes the failure mode the research
documented — globally-firing enforcement nags users in dotfiles/throwaway repos until they
disable the whole thing.

---

## 2. Verified ground truth (checked 2026-07-17 → 07-19)

1. The three workflow skills (`writing-a-vision`, `writing-github-issues`,
   `learn-from-pr-reviews`) are now pushed to the public `CarsonDavis/claude` repo — the
   guide's old 404 links are fixable. `CarsonDavis/claude` is **not** yet a plugin
   marketplace (no `.claude-plugin/marketplace.json`).
2. The `claude plugin` shell CLI exists: `marketplace add <source>`, `install <plugin>`,
   with flags `--scope user|project|local` and `--sparse <paths...>`. Verified via
   `claude plugin --help`.
3. Plugin skills are namespaced `plugin-name:skill-name`, so they cannot collide with a
   user's personal skills; versioning/updates/uninstall come free with the plugin system.
4. `CarsonDavis/working-with-llms` is **public** (required for open, unauthenticated
   install) and its tracked size is ~1.7 MB (the 297 MB local is untracked
   `node_modules`/build output that never clones).
5. The site is moving off the madebycarson blog to `llms.codebycarson.com/working-with-llms/`,
   served from the code-by-carson CDK/CloudFront stack (per the workshop's
   `research/publishing-plan.md`). The `/working-with-llms/` path is retained.
6. Every readiness check maps to an existing guide page and (mostly) an existing skill, so
   the review agent diagnoses and routes — it never invents advice.

---

## 3. Decisions (locked)

- **D1 — Packaging: native plugin, hosted in this repo.** `CarsonDavis/working-with-llms`
  becomes a marketplace carrying one plugin. Only the three workflow skills move here from
  `CarsonDavis/claude`; `deep-research`, `docs-lookup`, and the personal utilities
  (`compress-video`, `get-page`, `page-capture`, `doc-scraper`) stay put. Rejected: the
  brain-dump's copy-and-rename install (the plugin system's namespacing solves conflicts
  for free) and Candidate C's agent-executed file-copy install (the CVE-shaped pattern).
  Note: `deep-research` and `docs-lookup` are **agents** (not skills) and `doc-scraper` is
  the skill they rely on — all three stay in `CarsonDavis/claude`.
- **D2 — Enforcement scope: per-repo opt-in.** Heavy mode fires only in repos carrying a
  committed marker. Maintainers adopt a repo once; the whole team inherits it on clone.
  Truly un-skippable gates are delegated to GitHub branch protection, not the harness.
- **D3 — Names (working):** plugin `working-with-llms`; marketplace `wwl`; agent
  `project-review`; adoption command `/adopt-workflow`; marker `.claude/wwl.json`; setup
  page at `/working-with-llms/setup/`. Changeable now, costly later.

---

## 4. Components

### Component A — the `project-review` agent (readiness, split by cadence)

A subagent (`agents/project-review.md`, shipped in the plugin) so review work never pollutes
the calling session. Readiness is **not** one checklist re-run per task — the checks live on
three different clocks:

| Check | Belongs to | Cadence & cost |
|---|---|---|
| Capable model; plugin + skills resolve; no shadowing personal skill | Machine/developer | Per session, cheap, cached in session/local — never committed |
| `vision.md` exists & non-trivial; docs exist; `CLAUDE.md` exists & points to the vision | Repo — structural presence | Every session, grep-level, **no LLM call** — effectively free |
| Is the vision substantive? Are docs adequate to repo gnarliness? | Repo — quality judgment | **Once at adoption** (and on-demand); LLM call; pass logged; doc **edits do not re-trigger it** |
| Does *this* task have a well-scoped issue? | Incoming task | Per task, **never cached** |

**Why:** the expensive judgment (LLM rating doc adequacy) runs when a repo is *adopted*, not
when it's *used*. Ordinary doc churn costs nothing — which respects the guide's "keep docs
current" ethos instead of taxing it. Only a required artifact vanishing (caught free by the
structural layer) or an explicit human audit re-opens the quality review.

**Two entry points, one agent:**
- **Full readiness review** (adopt time / "check my setup") → produces a **health-report
  artifact**: pass/fail per check, and per gap a plain-English action step linking the guide
  page and naming the skill to invoke. Fallback with no Artifact tool: write
  `project-readiness.md` in the repo.
- **Task gate** (heavy mode) → the `UserPromptSubmit` hook (a shell command) reads the marker
  and runs the cheap structural greps itself, then *injects a standing rule* into the prompt.
  The **model** — not the hook, which cannot spawn agents — decides from that rule whether the
  prompt begins substantive work and, if so, dispatches `project-review` for the one live
  question: does this chunk of work have a scoped issue, and if not, route into
  `writing-github-issues`. No repo re-audit here. (See §5 for the exact mechanism.)

### Component B — the site Setup page

New page `guide/setup.md`, three role sections + the agent-facing runbook it points at:

- **For coders — install the tools** (once per machine). Terminal:
  ```
  claude plugin marketplace add CarsonDavis/working-with-llms --sparse .claude-plugin plugins
  claude plugin install working-with-llms
  ```
  (`--sparse` on `marketplace add` limits the checkout to just the plugin dirs, so `forks/`
  — 88% of tracked size — never clones.)
  Plus a paste-to-agent alternative pointing at the runbook (model check → install →
  conflict scan → verify). The runbook is written for the *worst* agent that will read it:
  numbered steps, one action each, an explicit verify line after every step, no branching.
- **For maintainers — make a repo enforce the workflow** (once per repo). `/adopt-workflow`
  writes and commits two files:
  - `.claude/settings.json` — the on-trust install requires **both** `extraKnownMarketplaces`
    (an object map keyed by marketplace name, `wwl`) **and** `enabledPlugins` (an array);
    `enabledPlugins` alone won't prompt the install. The command **merges** into any existing
    `settings.json` (repos often already have one) — never overwrites. Written via
    `--scope project`.
  - `.claude/wwl.json` — the marker.

  It recommends GitHub branch protection for hard gates.
- **Check your setup** — runs the full `project-review` and hands back the report.

### Component C — plugin packaging

```
working-with-llms/
├─ .claude-plugin/marketplace.json      ← new: the catalog (marketplace name: wwl)
├─ plugins/working-with-llms/           ← new: the plugin
│  ├─ .claude-plugin/plugin.json        ← MUST carry an explicit `version` (see §7)
│  ├─ skills/{writing-a-vision, writing-github-issues, learn-from-pr-reviews}/
│  ├─ agents/project-review.md          (Phase 2)
│  ├─ commands/adopt-workflow.md        (Phase 4 — the maintainer slash command)
│  └─ hooks/hooks.json                  (Phase 4)
├─ guide/  hooks/  forks/  tasks/  README.md  mkdocs.yml  …   ← unchanged
```

The plugin is self-contained under `.claude-plugin/` + `plugins/`. The repo's existing root
`hooks/` is a **mkdocs** Python hook — unrelated to Claude Code plugin hooks; nesting the
plugin's hooks under `plugins/working-with-llms/hooks/` keeps them distinct. mkdocs only
builds `docs_dir: guide/`, so plugin dirs are ignored by the site build. `--sparse` on
`claude plugin marketplace add` (not `install`) lets a user limit the checkout to the plugin
dirs, so `forks/` weight — 88% of tracked size — never travels with an install when that flag
is used (the coder command in Component B uses it).

---

## 5. The two modes

| | Lightweight (build first) | Heavy (opt-in, per repo) |
|---|---|---|
| Install | Plugin install → verify → hand off to the guide | Same, plus `/adopt-workflow` commits marker + settings pointer |
| Review runs | Only on request ("check my setup") | Auto, per task, when a prompt starts substantive work |
| Mechanism | Setup page + agent shipped in plugin | Dormant `UserPromptSubmit` hook + marker, fails open |
| Hot-path cost | n/a | Marker read + grep; subagent only for the issue question |
| Philosophy | Trust the user read the guide | Assume they skimmed; the system holds the gate |

Heavy mode's trigger: a dormant `UserPromptSubmit` hook injects a standing rule — "if this
prompt begins substantive work and review hasn't run recently, dispatch project-review;
skip questions/debugging/lookups." Classification stays with the model; the reminder arrives
deterministically; the marker prevents nagging; no marker / no heavy flag → silence.

*Deliberate deviation from the research:* Candidate B prescribed a **SessionStart** injection.
We use `UserPromptSubmit` instead because SessionStart fires before any prompt exists and so
can't judge "does *this* prompt begin substantive work." This is an intentional improvement,
noted so a future reader doesn't read it as a mistake.

---

## 6. Build order

**Phase 1 — Marketplace-ify the repo.** Copy the three skills from `CarsonDavis/claude` into
`plugins/working-with-llms/skills/`. Add `marketplace.json` + `plugin.json` (with an explicit
`version`). Rewire the guide's skill links in-repo (`writing-a-vision.md:32`,
`writing-an-issue.md:46`, `review-loop.md:29`, `README.md:21`) and fix the README line
claiming the tools live in the claude repo. No hooks yet.

*Migrate Carson's own machine — non-destructive order.* The point is to put the author on the
exact user path; the local-copy deletion is for **cleanliness** (avoid two divergent copies
and a doubled skill-listing budget), **not** to prevent shadowing — per §2.3 the plugin's
`working-with-llms:writing-a-vision` and a local `writing-a-vision` are different namespaced
names and coexist fine. So order it verify-before-destroy:
1. Install the plugin; **confirm all three skills resolve** (`claude plugin list` + a live
   invocation). Plugin install/update is a fragile surface (per the research) — do not delete
   anything until this passes.
2. Only then delete the local copies from `~/.claude/skills/`.
3. Remove the three skills from `CarsonDavis/claude` **last, and only after** the rewired
   in-repo guide links are deployed — removing them earlier 404s the old links for anyone
   mid-guide. (They stay in git history, so rollback is `git revert` / re-add if anything
   breaks.)

(Workflow change: skill edits now happen in this repo and reach the machine via
`claude plugin update`, not in-place edits to `~/.claude/skills`.)
*Done when:* a clean machine installs via the two commands and every skill resolves; no guide
link points at the old repo; Carson's machine runs the plugin versions with no duplicates.

**Phase 2 — the `project-review` agent.** Agent definition + health-report artifact template
+ markdown fallback, shipped in the plugin. The full-review entry point only (task gate is
Phase 4). Test against a deliberately broken repo (no vision, no CLAUDE.md) and a healthy one.
*Done when:* both test repos produce accurate reports and each gap routes to the right
guide page/skill.

**Phase 3 — the Setup page.** Write `guide/setup.md` (three sections + runbook), add to nav,
add the review-agent pitch to Start Here/workflow pages, update mkdocs `site_url` to the hub.
Ships the coder install + a documented **manual** version of repo adoption (the
`/adopt-workflow` command itself is Phase 4). Coordinate deploy with the hub move to the
code-by-carson CDK stack. *Done when:* a fresh session given only the coder one-liner
completes install + verify with no improvisation, and the guide resolves at its hub URL.

**Phase 4 — Heavy mode + maintainer adoption.** Dormant `UserPromptSubmit` hook, the marker
(`adopted`, enforcement dials, `qualityReviewPassed` + when, per-task cooldown — no content
hashes), the task-gate path, and `/adopt-workflow` (writes+commits marker + settings pointer,
recommends branch protection). Dogfood in one real repo. *Done when:* it fires on real work,
stays silent on exploratory chatter and in non-adopted repos, never fires twice inside its
cooldown, and a fresh clone of an adopted repo prompts to install + enforces with no
per-person setup.

> **Phases 1–3 are the complete lightweight system — shippable and useful on their own.**
> Phase 4 is separable and can wait for real-world feedback.

---

## 7. Risks & honest caveats

- **Artifact-producing review is Claude-Code-only** (Artifact tool + subagents). The markdown
  fallback covers other harnesses at ~90% of the value.
- **Not fully silent / not truly "forced."** The marketplace trust prompt is an intentional
  consent gate; hooks run client-side and a determined dev can decline/disable/delete. The
  system strong-defaults the right thing; branch protection makes the wrong thing impossible.
- **Hook brittleness is the research's loudest warning, and heavy mode rests entirely on one
  hook.** report.md leads its risk list with hooks being the buggiest surface: silent failure
  in subdirectories, regressions across CC versions, false-error output that can end a turn
  early. "Fails open" is necessary but not sufficient — Phase 4 must **test the hook
  explicitly** (adopted repo, non-adopted repo, subdirectory, exploratory prompt), never
  assume it fired, and fail loud in its own logs when its own preconditions break.
- **Doc adequacy is a judgment call.** The review presents it as an assessment with reasoning,
  not a binary fail.
- **Phase 3 depends on the hub move** landing (publishing shifts to the CDK stack). Phases 1–2
  do not touch the site and are unblocked.
- **Update story** inherits the plugin system's known weakness (no team-wide forced refresh);
  mitigate with explicit semver in `plugin.json` and an update-check note on the Setup page.
  `version` is optional to Claude Code but **required for us**: omit it and every commit
  becomes a silent release (exactly the failure the research warns about), so bump it
  deliberately per meaningful change.

---

## 8. Out of scope (deliberately deferred)

- The deeper enforcement gates (spec-approved-before-implement, fresh-review-before-done) —
  Phase 4's issue gate is the flagship; the rest layer on later.
- Cross-harness portability (Codex/Gemini). Skills stay portable SKILL.md; enforcement is
  Claude-only for v1, stated plainly.
- Moving `deep-research`/`docs-lookup` into the plugin (revisit if the guide comes to depend
  on them).
