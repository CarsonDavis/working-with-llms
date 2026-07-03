---
title: The Review Loop
num: 7
dek: With a good harness, review happens in two places.
layout: chapter.njk
---
## Two places review happens

<span class="newthought">With a good harness</span>, review happens in two places:

- Inside the agent framework, before anything reaches a PR. The harness's own review agent checks the implementation against the spec and catches problems early, in the same session that wrote the code.
- As a custom review on the project, run on the diff before human review. This is something you can improve over time.

## Custom review pipelines

When you build a custom review process, it probably shouldn't be a single agent, because no single context window usefully holds the vision, the docs, the issue, the diff, and the tests all at once.

Cram it all into one agent and every check gets worse. So it's a pipeline of narrow agents, and you run the ones a given project actually needs:

<table class="table-designed table-roster">
<thead><tr><th>Agent</th><th>What it checks</th></tr></thead>
<tbody>
<tr><td>Project alignment</td><td>reads the vision and the docs, flags code that's technically fine but pulls against the project's direction or ignores a known interaction.</td></tr>
<tr><td>Security and architecture</td><td>enforces the security and architecture rules that should hold across your projects, like deployments using OIDC instead of long-lived keys, or S3 buckets never being open to the internet.</td></tr>
<tr><td>Craftsmanship</td><td>the ordinary good-reviewer pass. Is it maintainable and well-architected? Did it add unrequested bloat? Is the quality there?</td></tr>
<tr><td>Test quality</td><td>reads the issue to learn what behavior was actually intended, then checks whether the tests genuinely exercise it or quietly miss cases. Integration tests you understand are worth far more here than a thousand LLM-written unit tests.</td></tr>
<tr><td>Documentation freshness</td><td>confirms the change carried its docs with it, so the docs don't drift.</td></tr>
<tr><td>Open-ended</td><td>a free pass to catch whatever the dedicated agents missed.</td></tr>
</tbody>
</table>

<figure class="pull"><blockquote>Integration tests you understand are worth far more here than a thousand LLM-written unit tests.</blockquote></figure>

Not every agent fits every repo. Start with the ones a given project needs and add as you go.

## Seed it from your PR history

You don't have to start designing custom review agents from a blank page.

We have a tool that spawns agents to read through every review comment ever left on a repo across its whole history, verifies each one against the actual code (a comment existing doesn't mean it mattered, and a comment being made doesn't mean it was acted on), and synthesizes a report of candidate review guidelines.[^learn-from-pr-reviews]

Treat its results only as a starting point. You are responsible for what goes into the agent, so read it carefully, delete what's wrong, add what you want, and grow it into a custom review.md skill you distribute to the team. It improves with the repo and applies to agent-written and human-written code alike.

[^learn-from-pr-reviews]: ⚙ `learn-from-pr-reviews` &mdash; lives in the claude repo; mines a repo's entire review-comment history into a report of candidate review guidelines.
