# Tutorial — Detailed Notes

> Working notes for the codebase overview/tutorial (the §2 core document in [`overview.md`](overview.md)). §2 already covers what it is, the four kinds of knowledge it captures, descriptive-vs-prescriptive, the two altitudes, scaling to repo size, and enforcement in brief — this file doesn't repeat that. It holds the detail §2 points to: worked examples, authoring rules, the generation pipeline, and the enforcement spec. It's also the seed for an eventual tutorial-generation agent.

## Worked examples

One per the four kinds of knowledge §2 names — the cases that make the abstract categories concrete:

- **Convention.** A repo prefixes internal handlers with `_` and expects new ones under `handlers/`. An agent that adds a public-looking handler elsewhere writes "correct" code that violates the repo's own rules.
- **Design pattern.** Models are first-class objects meant to be inherited, with a `BaseEntity` that provides soft-delete and audit fields. An agent that writes a plain class for a new table demos fine but silently bypasses soft-delete everywhere it's relied on.
- **Interaction.** Writes to a record go through module A, while a separate indexer in module B keeps search current — and nothing in A imports B. An agent editing only A ships a change that works locally and quietly leaves search stale. The tutorial records that A and B are coupled, so whoever touches A knows to touch B.
- **Common mistake.** Cheap version: changed the code but not its tests, or the behavior but not the docs — obvious *once you know the pieces exist*, so the tutorial's only job is to make the agent aware they do. Deep version: a deployment built one way locally and another in production, where the CI/CD must use the production build and respect AWS limits — a task framed as "just do the CI/CD thing" misses the whole local-vs-prod distinction unless the tutorial spells it out.

The throughline: a senior brings this whole-repo knowledge to a review; the tutorial hands the same knowledge to an agent (and a new human) without making it read all the code.

## Authoring rules

- **No line numbers** — they rot; files and functions are the finest granularity to reference.
- **Name real symbols** — files and functions, not prose-only, so an implementing agent can act on it.
- **Living, not write-once** — regenerated/updated as the code changes (enforced below).

## Generation pipeline

For a large/legacy repo, generate rather than hand-write. A working implementation already exists at [`CarsonDavis/codebase-tutorial`](https://github.com/CarsonDavis/codebase-tutorial) — a Next.js app run via a `/build-tutorial` command pointed at a repo path, producing an interactive tutorial (executive summary, drill-in section pages, cross-references, glossary, quiz). We could fork and adapt it rather than building from scratch.

Its pipeline is five stages, persisted to disk between stages so a run is debuggable and resumable:

1. **Survey** (serial) — identify the major components and lay down the structural spine (`survey.yaml`).
2. **Write** (parallel) — one subagent per section produces its markdown page.
3. **Synthesize** (serial) — stitch the pages into one coherent tutorial (`tutorial.yaml`).
4. **Augment** (optional) — cross-cutting reference pages like a glossary.
5. **Quiz** (optional) — a multiple-choice assessment so a reader can self-check.

Small repos skip this — a single hand-checkable pass is enough.

## Enforcement, in detail

- **`CLAUDE.md` (proactive)** — read the tutorial before beginning work and update relevant sections in the same PR as the code.
- **`review.md` (checklist)** — "does this change alter behavior the tutorial describes, and is the tutorial updated?" is a standing review item (this is review.md's documentation-freshness agent).
