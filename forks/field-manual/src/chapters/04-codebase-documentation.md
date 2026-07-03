---
title: Codebase Documentation
num: 4
dek: Document the things that aren't obvious from a quick read, the things a senior dev carries in their head.
layout: chapter.njk
---
## What to capture

<span class="newthought">Document the things</span> that aren't obvious from a quick read, the things a senior dev carries in their head:

- **Conventions:** the repo's own rules, not the ones inherited from a framework.
- **Design patterns:** "models inherit from BaseEntity, which provides soft-delete and audit fields," and the like.
- **Interactions:** the non-obvious couplings that must be respected, like "writes go through module A, but a separate indexer in module B keeps search current, and nothing in A imports B."
- **Common mistakes:** the gotchas that reliably catch people who don't know the whole picture.
- **Architecture:** the actual structure and _intended_ shape of the repo.
- **Design decisions:** key decisions you've made as a team and why.

## The options, smallest to largest

Scale the format to the repo:

<table class="table-designed">
<thead><tr><th>Your repo</th><th>What you probably need</th></tr></thead>
<tbody>
<tr><td>Small and well-structured</td><td>A top-level README</td></tr>
<tr><td>Bigger, but modular and clean</td><td>Hierarchical per-module READMEs and maybe an <code>architecture.md</code>, so the agent can read as deep as a task requires</td></tr>
<tr><td>Large, legacy, or gnarly</td><td>Exhaustive docs or even a full generated tutorial system</td></tr>
</tbody>
</table>

<details>
<summary>More: a full tutorial-generation prototype</summary>

If that last option interests you, we have a working prototype at [codebase-tutorial](https://github.com/CarsonDavis/codebase-tutorial). Point it at a repo and a multi-agent pipeline surveys the code, writes up each component in parallel, and synthesizes the pages into one coherent tutorial. You get two things: plain markdown an agent can load as context, and a reusable web frontend for humans, with drill-in pages and optional glossary popovers and quizzes. Reach for it only when simpler docs can't hold the picture or when you are onboarding a new team member.

</details>

## Why not just have the agent read the literal code?

LLMs are great at reading code, what's the point of docs?

- **Too many tokens.** A real codebase doesn't fit usefully in a context window, and re-deriving the whole picture from raw code every task is expensive.
- **Big context does not equal good decisions.** Five thousand tokens of code might reduce to a sentence fact, and the agent acts on the sentence far more reliably than on the code.
- **It only opens the files it thinks it needs.** Anything in a file it never reads is invisible to it.[^ci-cd]
- **Code states intent implicitly.** The "why it's done this way" isn't in the code; the agent has to infer it, and often will miss your real reason.

## Authoring rules

However you generate the docs, write them so an agent can act on them and so they don't rot:

- **No line numbers.** They go stale the moment the code moves. Files and functions are the finest granularity worth referencing.
- **Name real symbols.** Reference actual files and functions, not prose-only descriptions, so an implementing agent can easily act on what you wrote.
- **Remember the why.** When it matters, remember to include *why* you architected it like that. Agents that know why will make better decisions.
- **Keep them living.** Regenerate and update them as the code changes. CLAUDE.md can tell the agent to update the relevant docs in the same PR as the code, and your review can check that it did.

## You own the docs

Documenting used to take weeks. Today an agentic swarm can do it in an hour. So it's no longer hard to actually make the docs. But you _have_ to read them and own them. Anything you give the agent, it will take at face value as truth.

<figure class="pull"><blockquote>Anything you give the agent, it will take at face value as truth.</blockquote></figure>

So your docs are first-class artifacts, as load-bearing as the code. Read them, understand them, and stand behind them. If your documents are too long to review...make them shorter. If your team is generating documentation nobody reviews, you're feeding garbage in and you'll get garbage out.

[^ci-cd]: That's how you get a perfectly good CI/CD that ignores the build step nobody pointed it at.
