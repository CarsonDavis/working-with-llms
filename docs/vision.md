# Vision — LLM Conventions

> This is the grounding document for the work in this repository. It exists to keep every downstream decision — which documents we adopt, what goes in them, how we roll them out — anchored to *why* we are doing this. When in doubt about a design choice, come back here. If the answer isn't here and it should be, update this file.
>
> Keep it short. A vision document is one to two pages. If it grows past that, the detail belongs in a downstream doc (requirements, architecture, conventions), not here.

## Why this exists

A group of us got together to work out how to use LLMs more effectively at our jobs. The conclusion of that conversation was not "use a better model" or "use a better tool." It was that the leverage is in **shared, written artifacts and repeatable processes** that live in every repo we work on — the things that let an agent (and a new teammate) act with the context a senior engineer carries in their head.

The core problem we are solving: **a single, isolated coding session does not know the larger project, team, and business context, so it makes mistakes a knowledgeable human never would.** Today that context is locked inside a few people's heads. When those people review code, they review it against a vision they hold privately — it is rarely written down. The fix is to externalize that context into artifacts the coding agent can read, and to build the surrounding processes that keep those artifacts honest over time.

A second, equally real problem surfaced repeatedly: as code gets cheap to produce, the old bottlenecks (ownership, understanding, asking the right questions, reading what you ship) didn't disappear — they got *bigger and more frequent*, because people can now ship fast without understanding. Our conventions have to address the human side, not just the tooling side.

## What we are building

A small, opinionated set of **core documents and processes** — plus templates, example skills, agents, and hooks — that a team can drop into any repository to make LLM-assisted work safe, fast, reviewable, and shareable. Concretely, this repo will produce:

- A short, ranked list of **core documents** every project should have (starting with a vision document, an overview/tutorial, a review harness, and well-formed issues).
- For each: what problem it solves, what goes in it, how to write one, and how a team uses it.
- The **process** that ties them together — including the cyclic "improve the harness every time it fails you" loop that is the heart of how this stays effective.
- A **rollout plan** we can actually pilot on our own projects next sprint.

## Who it's for

Everyone doing development-adjacent work — not just the dev team. Anyone who uses these tools to contribute to what we ship goes through this process. The documents are written primarily **for the agent**, but the human who owns each artifact must read and stand behind it.

## Guiding principles

1. **Solve the problem, not the filename.** The goal is to embed larger context where the coding agent will see it. A `vision.md` is one good way to do that; `CLAUDE.md`, agent instructions, or an overview can serve the same purpose. We will recommend specific documents because concreteness helps, but the *ethos* is "make the missing context available," not "every repo must contain a file named vision.md."

2. **Know what you personally read.** The agent reads everything; humans read the few artifacts that decide how the agent behaves — the vision, the issue, the review findings, anything you'll sign your name to. You trust the LLM with the code, not with your requirements.

3. **Build the harness cyclically.** LLMs are not perfect and won't be. Every cycle, when the LLM fails us — missed a requirement, shipped the wrong thing, missed something in review — that lesson gets written back into the artifact that should have prevented it (the vision skill, the issue skill, the review agent, a hook). The harness gets better every week; the human is required in the loop less over time.

4. **Standardize the artifacts, not the tools.** In this proposal, we do not mandate one model, one harness, or one set of hooks — people can use Claude, Gemini, Codex, superpowers, whatever. What we hold in common are the documents and the review process. (Open tension: some harnesses *are* shared team expertise — e.g. a standard deployment setup — and may be worth standardizing. We'll resolve that case by case.)

5. **Humans stay in the loop; the docs that drive the LLM get read.** The artifacts that steer the agent — the vision, the tutorial, the issues, the review findings — are human-owned and carefully read by whoever owns them; the agent's understanding is only as good as theirs. Code is reviewed against the review harness and validated by integration tests over unit tests; the reviewer of record confirms alignment to the vision — not every teammate reviews everything, but someone who holds the vision does. 

6. **Remove the shame.** AI-generated docs and skills are shared openly, read, and improved together. Not understanding the code is a context gap to fix, not a thing to hide.

## What success looks like

- On a real project, an agent picks up a task and *doesn't* make the context-blind mistakes it makes today, because the vision/overview/conventions told it what a senior engineer would have known.
- A reviewer can trust that the person who shipped a change understood it and aligned it to the project's direction — and the review effort that caught problems is captured so it doesn't have to be repeated.
- New teammates come up to speed on a codebase without having to write it themselves.
- We can show management a deliberate, documented process — turning "people are vibe coding with no guardrails" into "here is how we work, and here is what to invest in."

## Scope and non-goals

- **In scope:** the core documents, the processes around them, templates/examples, and a rollout plan. Pilot on our own projects first.
- **Not yet:** a mandated, fully-built "download-and-go" repository, a forced toolchain, or org-wide rollout. Stay small. Prove it on a couple of projects for a sprint, gather feedback, then expand. We start with "this is our end goal, this is what we start with, this is the rollout map" — not "we perfected it, now use it."

## How we roll it out

1. Exhaustively list the candidate documents, processes, and problems (see [`pruned-extractions.md`](source-documents/pruned-extractions.md)).
2. Draft the core set and what goes in each (see [`overview.md`](../standard-artifacts/overview.md)).
3. Pick 2–3 components to start with and pilot them on our *own* projects next sprint (~mid-June), with the teammates we already work with.
4. Live with it, find where the harness failed, write the lesson down, improve it.
5. Once it holds together, make the case to management for tooling/investment.

## Source material

- [`source-documents/pruned-extractions.md`](source-documents/pruned-extractions.md) — the actionable, numbered inventory of proposed documents, processes, and LLM issues.
- [`overview.md`](../standard-artifacts/overview.md) — the first-draft proposal for the core document set.
