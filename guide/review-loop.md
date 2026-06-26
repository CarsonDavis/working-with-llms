# The Review Loop

## Two places review happens

With a good harness, review happens in two places:

- Inside the agent framework, before anything reaches a PR. The harness's own review agent checks the implementation against the spec and catches problems early, in the same session that wrote the code.
- As a custom review on the project, run on the diff before human review. This is the part you grow over time.

## Custom review pipelines

When you build a custom review process, it probably shouldn't be a single agent, because no single context window usefully holds the vision, the docs, the issue, the diff, and the tests all at once.

Cram it all into one agent and every check gets worse. So it's a pipeline of narrow agents, and you run the ones a given project actually needs:

- **Project alignment:** reads the vision and the docs, flags code that's technically fine but pulls against the project's direction or ignores a known interaction.
- **Security and architecture:** enforces the security and architecture rules that should hold across your projects, like deployments using OIDC instead of long-lived keys, or S3 buckets never being open to the internet.
- **Craftsmanship:** the ordinary good-reviewer pass. Is it maintainable and well-architected? Did it add unrequested bloat? Is the quality there?
- **Test quality:** reads the issue to learn what behavior was actually intended, then checks whether the tests genuinely exercise it or quietly miss cases. Integration tests you understand are worth far more here than a thousand LLM-written unit tests.
- **Documentation freshness:** confirms the change carried its docs with it, so the docs don't drift.
- **Open-ended:** a free pass to catch whatever the dedicated agents missed.

Not every agent fits every repo. Start with the ones a given project needs and add as you go.

## Seed it from your PR history

You don't have to start designing custom review agents from a blank page.

We have a tool that spawns agents to read through every review comment ever left on a repo across its whole history, verifies each one against the actual code (a comment existing doesn't mean it mattered, and a comment being made doesn't mean it was acted on), and synthesizes a report of candidate review guidelines. It lives in the llm-tools repo as the [`learn-from-pr-reviews`](https://github.com/NASA-IMPACT/llm-tools/tree/main/skills/learn-from-pr-reviews) skill.

That report is a starting point, not an answer. You are responsible for what goes into the agent, so read it carefully, delete what's wrong, add what you want, and grow it into a custom review.md skill you distribute to the team. It improves with the repo and applies to agent-written and human-written code alike.

Review is the arm of the broader improvement loop (see [Start Here](START-HERE.md)) with the most tooling behind it: every cycle, what your reviewers catch gets written back in here so it isn't missed again.
