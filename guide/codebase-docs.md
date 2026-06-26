# Codebase Documentation

## What to capture

Document the things that aren't obvious from a quick read, the things a senior dev carries in their head:

- **Conventions:** the repo's own rules (naming, where things go), not the ones inherited from a framework.
- **Design patterns:** "models inherit from BaseEntity, which provides soft-delete and audit fields," and the like.
- **Interactions:** the non-obvious couplings that must be respected, like "writes go through module A, but a separate indexer in module B keeps search current, and nothing in A imports B."
- **Common mistakes:** the gotchas that reliably catch people who don't know the whole picture.
- **Architecture:** the actual structure and _intended_ shape of the repo.
- **Design Decisions:** key decisions you've made as a team and why

## The options, smallest to largest

Scale the format to the repo:

| Your repo | What you probably need |
|---|---|
| Small and well-structured | A top-level README |
| Bigger, but modular and clean | Hierarchical per-module READMEs and maybe an `architecture.md`, so the agent can read as deep as a task requires |
| Large, legacy, or gnarly | Exhaustive docs or even a full generated tutorial system |

If that last option interests you, we have a working prototype at [codebase-tutorial](https://github.com/CarsonDavis/codebase-tutorial). Point it at a repo and a multi-agent pipeline surveys the code, writes up each component in parallel, and synthesizes the pages into one coherent tutorial. You get two things: plain markdown an agent can load as context, and a reusable web frontend for humans, with drill-in pages and optional glossary popovers and quizzes. Reach for it only when simpler docs can't hold the picture or when you want it for human benefit.

## Why not just have the agent read the literal code?

LLMs are great at reading code, so it's fair to ask why bother. Four reasons:

- _**Too many tokens.**_ A real codebase doesn't fit usefully in a context window, and re-deriving the whole picture from raw code every task is expensive.
- _**Big context does not equal good decisions.**_ Five thousand tokens of code might reduce to a one-paragraph fact, and the agent acts on the paragraph far more reliably than on the code.
- _**It only opens the files it thinks it needs.**_ Anything in a file it never reads is invisible to it. That's how you get a perfectly good CI/CD that ignores the build step nobody pointed it at.
- _**Code states intent implicitly.**_ The "why it's done this way" isn't in the code; the agent has to infer it, and often will miss your real reason.

## Authoring rules

However you generate the docs, write them so an agent can act on them and so they don't rot:

- _**No line numbers.**_ They go stale the moment the code moves. Files and functions are the finest granularity worth referencing.
- _**Name real symbols.**_ Reference actual files and functions, not prose-only descriptions, so an implementing agent can act on what you wrote.
- _**Keep them living.**_ Regenerate and update them as the code changes. CLAUDE.md can tell the agent to update the relevant docs in the same PR as the code, and your review can check that it did.

## You own the docs

Documenting used to take weeks; an agentic swarm can do it in an hour. So it's no longer hard to actually make the docs. But you _have_ to read them and own them. Anything you give the agent, it will take at face value as truth.

So your docs are first-class artifacts, as load-bearing as the code. Read them, understand them, and stand behind them. If your documents are too long to review...make them shorter. If your team is generating documentation nobody reviews, you're feeding garbage in and you'll get garbage out.
