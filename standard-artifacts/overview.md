# Overview

> **Status: draft for review.** This proposes which documents become "core" (every project gets them), and for each: what it solves, what goes in it, how to write one, and how a team uses it. It draws from [`pruned-extractions.md`](../docs/source-documents/pruned-extractions.md) (the actionable core).

## Overview

This proposal has three parts: the **documents** every project leans on, the **processes** that operate them, and the **rollout** plan.

**The core is whatever externalizes the context that an isolated coding session is missing, plus the loop that keeps it honest.** The documents split into two kinds:

**Context artifacts** carry the knowledge seniors and stakeholders hold in their heads: the **vision** aligns you with *stakeholder goals* (the *why*), and the **overview/tutorial** aligns you with *repository patterns* (how the code actually works).

**Workflow artifacts** shape and check the work itself: the **issue** scopes the work and the **review** judges it.

---

## Documents

*The four core documents every project gets, plus more variable supporting docs.*

### 1. Vision

#### Problem it solves
Context-blindness at the goal level. An isolated session doesn't know why the project exists, its big-picture goals/constraints, or how it fits the wider org — so it makes decisions a senior would veto: building the wrong thing, over- or under-engineering the solution, choosing an architecture that ignores cost/scale/compliance constraints, gold-plating features nobody asked for, etc. Today that lives only in someone's head.

#### What goes in
Why we're doing this; big-picture goals and constraints; how it fits into the larger org/product; the few decisions everything downstream is grounded on. **Not** a detailed spec — just a couple pages. Unless they are central to stakeholder requirements, the minutiae of implementation details belong in requirements/architecture/planning documents.

#### How to write one
Word-vomit: the owner speaks ~10-15 min into a recorder about everything that matters; the LLM organizes it into vision.md and potentially other docs; **the owner reads it by hand** and edits. You can also point the agent at other repos and broader information if needed. We may need to make a dedicated skill that can elicit information from stakeholders if the word vomit is not sufficient.

#### How to use it
It is a tracked repo artifact. The project owner (the person who holds the vision) is the hard owner and the one who must approve it; the agent reads it on every task; human contributors read it before contributing. When a stakeholder decision changes, the vision changes, and downstream docs follow. When the LLM ships something deeply misaligned, the fix often goes *here*.

### 2. Codebase overview / tutorial

#### Problem it solves
Context blindness at the implementation level. Where vision aligns the agent with stakeholder goals, overviews align the agent with *repository patterns*. This prevents the code that may seem correct in isolation but is wrong when judged by the bigger picture. Adding duplicate features, failing to align with conventions, misunderstanding design principles, breaking downstream consumers, etc.

This knowledge historically lived in a sparse, drifting `docs/` folder or it had to be inferred directly from the code. However, today it is trivial to generate and maintain this documentation with LLMs.

#### What goes in
- _Conventions_ — the repo's own rules (naming, structure), not the ones inherited from a framework
- _Key design patterns_ — e.g. "plugins are first-class objects which should always have a teardown method," domain contracts, how deployment flows, etc
- _Interactions_ — any non-obvious couplings between parts of the codebase that must be respected
- _Common mistakes_ — the gotchas that reliably trip up someone who hasn't worked here.
- _Architecture_ - the actual architecture and structure of the repository

#### How to write one
Scale the effort to the repo
- **Small repo →** a single-pass, hand-checkable `overview.md` + traditional docs.
- **Large / legacy repo →** a multi-agent pipeline that generates comprehensive docs.

#### How to use it
It's the source of truth humans and agents both derive their understanding from, so **a human owns and carefully reads it** — wrong docs poison everything built on them. Keeping them true is enforced, not hoped for: `CLAUDE.md` has the agent update the relevant section in the same PR, and review agents double check that changes are paired with documentation updates.

#### Why can't agents just read the code?
LLMs are amazing at reading code...the trouble is that reading *all* of it is both too expensive and often a worse way to reason than reading a careful summary:

- **Too many tokens.** A real codebase doesn't fit usefully in a context window, and re-deriving the whole picture from raw code on every task is expensive.
- **Big context ≠ good decisions.** Even with the code in front of it, an agent reasons worse when the signal is buried in thousands of tokens. 5,000 tokens of code might reduce to a one-paragraph fact — and the agent acts on the paragraph far more reliably than on the code.
- **It only opens the files it thinks it needs.** Non-obvious couplings or standards may live in files it never reads — so it writes a perfectly good CI/CD that ignores the build step it never opened.
- **Code states intent implicitly.** Conventions, design rationale, and "why it's done this way" aren't written in the code as such; the agent has to infer them and often won't.

Overviews/tutorials solve these issues by deliberately specifying context, designs, conventions, interactions, and gotchas in a consumable document that informs the coding agent.

### 3. Review

#### Problem it solves
Captures project-specific knowledge from a senior dev. Is a guardrail against non-maintainable code, "works ≠ done", failure to adhere to conventions and design patterns, obvious security issues, etc. This is an artifact that grows over time with human input.

#### What goes in
The recurring things the SME/team-lead cares about: reuse over duplication, maintainability bar, security expectations, "don't reinvent existing components," project-specific gotchas, code quality, etc. Starts small and grows from real review findings.

#### How to write one
You can only write it by *doing* reviews. The SME and the author review LLM code together and write down what they find; those findings can become part of the review agent's checklist. (We may be able to generate first drafts of these by scraping old review comments.)

#### How to use it
Run as a skill/agent on a diff before human review. Every cycle, what the LLM missed in review gets added here.

#### The agents
Review isn't one agent — no single context window holds the org conventions, vision, tutorial, issue, diff, and tests at once, so it's a pipeline of narrow ones (full detail in `review.md`):

- **Org-convention compliance** — wider-org security/architecture rules (OIDC, no public S3, …).
- **Project alignment** — reads `vision.md` + the overview; flags code that pulls against the project's direction.
- **Craftsmanship** — maintainability, sound architecture, no unrequested bloat, good typing.
- **Test quality** — reads the issue for intended behavior, then judges whether the tests actually cover it.
- **Documentation freshness** — confirms the change updated its docs (README, overview, `architecture.md`, etc).
- **Open-ended** — a free pass to catch what the dedicated agents miss.

### 4. Issue

#### Problem it solves
Thin three-word issues produce misaligned, oversized PRs. A good issue carries the **business-logic** requirements the agent can't infer, controls PR size (small issue → small PR), and is an artifact a human reads and signs off on.

#### What goes in
What and why; the business-logic requirements; acceptance criteria; scope boundaries; "break this down if it's too big." Universal/convention requirements can be referenced, not re-stated.

#### How to write one
Brainstorming/issue-creation skill: the person who understands the work talks it through and the skill produces the issue. The human **reads the issue** and is happy with it before handing off. This is *not* the place to trust the LLM blind — trust it with the code, not the requirements.

#### How to use it
Whoever holds the business context authors it (with the LLM or a teammate). Small, scoped issues → small PRs a human can actually review. When an issue turns out too thin, that lesson feeds the issue-creation skill (the loop).

### Supporting documents

- **Requirements / use-cases / user-stories / architectures / changelogs** — normal SWE artifacts that flow from the vision via requirements gathering.
- **Conventions — two levels.** *Group/org-wide* (how we do IaC/AWS/deployments — pick one reasonable way, point at a canonical reference repo) and *project-specific* (overrides the group convention where needed). Also prescriptive and review-enforced. Group conventions are shared expertise; project conventions win on conflict.

---

## Processes

### The harness-improvement loop

The thing that makes all of the documents above durable. On a regular cadence, look at where the LLM failed last cycle and write the lesson back into the artifact that should have prevented it:

| The LLM failed by… | Improve… |
|--------------------|----------|
| Building something misaligned with the project | Vision |
| Making a context-blind mistake | Overview/Tutorial |
| Shipping code the SME wouldn't accept | Review agent |
| Massive PRs | Issue-creation skill |

If humans stay proactive, the harness will get better every cycle.

---

## Rollout

1. **By ~Tuesday:** this picture of documents + processes (done in draft here).
2. **Next sprint (~mid-June):** pilot with the core documents on our *own* projects, with the teammates we already work with. 
3. **Live with it,** find where the harness failed, write it down, improve it.
4. **Then** make the case to management for our harnesses and recommendations
