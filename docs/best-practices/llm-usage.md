# Best Practices for Using LLMs

## Problem

We recognise that AI coding assistants are now a regular part of many developers' workflows and can improve productivity. Thoughtful use of these tools can be beneficial, but AI-generated PRs can sometimes lead to undesirable additional maintainer burden.

Human-generated mistakes tend to be easier to spot and reason about, and we expect code review to be a collaborative learning experience that benefits both submitter and reviewer. When a PR appears to have been generated without much engagement from the submitter, reviewers with access to AI tools could more efficiently generate the code directly, and since the submitter is not likely to learn from the review process, their time is more productively spent outside of the project.



## Best Practices

These practices apply to any large language model and any AI assistant. We deliberately do not mandate a particular model or tool; what we hold in common are the habits below, not the vendor behind them.

### Treat the model as a collaborator, not a replacement

Use LLMs as intelligent collaborators rather than complete substitutes for your own skills. When developing a new feature, let the model generate an initial code structure or a first draft, then refine and improve it with your own expertise rather than accepting the first output. The model is most valuable when it accelerates work you could do yourself, not when it does work you cannot evaluate. Consider whether leaning on it on a given task may prevent you from developing skills you need. Never deliver a PR in a programming language you do not understand or cannot maintain.

### Use the model to widen your options

When you are stuck on a design or creative problem, ask the model to propose several different angles, perspectives, or candidate architectures rather than a single answer. Comparing alternatives surfaces trade-offs you might not have considered and helps you architect a better solution than committing to the first idea. For larger features, it is often worth having the model interview you first, let it ask about implementation details, edge cases, and trade-offs; and then capture the result as a written specification you can review and execute against.

### Be explicit and specific in your prompts

The more precise your instructions, the fewer corrections you will need. Instead of "Help me with a Python function that processes a URL input and return a domain name" ask for "a Python function that accepts a URL and returns the domain name using a regular expression, with appropriate error handling for malformed URLs." Reference the specific files involved, point to existing patterns in the codebase the model should follow, name what is out of scope, and state what a correct result looks like. Vague prompts are useful only when you are deliberately exploring and can afford to course-correct.

### Explore and plan before generating code

Letting a model jump straight to writing code often produces a confident solution to the wrong problem. Have it first read the relevant code and explain how the current system works, then produce a plan for the change, and only then implement against that plan. Separating research and planning from implementation is most valuable when the approach is uncertain, the change touches multiple files, or you are unfamiliar with the code being modified.

### Understand and own every change

Only submit a PR if you are able to debug and own the changes yourself. Review all generated code until you understand every detail; you are accountable for it as if you had written it by hand. When joining a new project, feed the codebase to the model and ask for an overview of the architecture and key components, then read and understand that overview before making any changes. You trust the model with the code; you do not trust it with your requirements or your understanding.

### Always verify; never assume it works

LLMs produce fluent, plausible output that can mask factual errors and missing edge cases (eloquence is not correctness). Always test AI-generated code rather than assuming it works, and prefer giving the model a concrete way to check its own work: a test suite, a build, a linter, or output compared against a known-good result. The harder a claim is to verify by inspection, the more important it is to verify it by execution. If you cannot verify a change, do not ship it.

### Manage context deliberately

Model performance degrades as the working context fills with irrelevant conversation, files, and command output, and the model may start to "forget" earlier instructions. Keep sessions focused on one task, reset context between unrelated tasks, and use a fresh context for review so the reviewer is not biased toward the code that just produced. Persistent project context. Build commands, code style, testing conventions, and architectural decisions, is better written into a short, shared instructions file the model reads automatically than re-explained every session.

### Protect confidential and licensed material

Do not share sensitive, confidential, or proprietary information with external model services; assume anything sent may be retained. Be alert to the model reproducing copyrighted material, and disclose and follow licensing guidance for any such content in a submission. Avoid incorporating model-generated text or code that you cannot attribute or verify.

### Capture repeatable work as reusable skills

Tasks you repeat, and the standards you want applied every time, are worth writing down once as a reusable, model-agnostic skill or harness rather than re-prompting from scratch. A skill is just a named, written-down procedure (a prompt plus the criteria for a good result) that any assistant can load and follow, so the same review or workflow runs the same way regardless of who triggers it or which model is behind it. Keeping these as shared artifacts also means the team improves them over time: when the harness misses something, you write the lesson back into it instead of re-learning it. A few examples worth standardizing:

- **A code-review harness.** A skill that reviews a diff for bugs, security issues, and consistency with existing patterns, ideally run in a fresh context so the reviewer is not biased toward the code that just produced. It returns specific, line-referenced findings rather than style opinions.
- **A planning / brainstorming workflow.** A skill that, before any code is written, explores intent and requirements, proposes alternative approaches, and produces a written plan or specification you can review and execute against — separating "what and why" from "how."
- **A security review.** A skill focused specifically on injection, authentication and authorization flaws, secret handling, and unsafe data flows, run as a dedicated pass before merging changes that touch sensitive surfaces.

These are illustrative, not mandatory. The principle is to standardize the *artifacts and the process* — the documents, skills, and review steps; rather than the tool or model that runs them.

A skill's *content* is model-independent: it is plain instruction that any capable assistant can follow, which is what makes it portable and worth sharing. Two caveats follow from that. First, *how* a skill is discovered and loaded; a folder convention, a slash command, a system prompt, is a feature of the harness you run, not of the skill itself; the same instructions can be carried into a different tool by whatever mechanism that tool provides. Second, *how well* a skill executes depends on the model's capability: a weaker model may follow a long, multi-step skill less faithfully or lack the tool use it assumes. So write skills as portable, model-agnostic procedures, but validate each one against the model and harness the team actually uses.

### Match conventions and disclose AI use

Align AI-assisted contributions with the conventions already in use like code style, commit and PR titles, and description format. Be transparent about which portions were AI-generated and summarize them for reviewers, and add comments explaining the verification steps you took for any part you are less certain about. Watch for the common failure modes of generated PRs: overly verbose comments, unnecessary or redundant tests, and fixes that address symptoms rather than root causes.

### Keep changes reviewable and respect maintainers

Break large contributions into smaller, focused PRs that a reviewer can actually reason about. Never use AI agents to automatically tag, ping, or otherwise pressure maintainers. Remember that the goal of review is a collaborative learning exchange — keep your own engagement high enough that both you and the reviewer benefit from it.

## References

This document was inspired by the following resources:

- [Apache Arrow — AI-generated code policy](https://arrow.apache.org/docs/dev/developers/overview.html#ai-generated-code): project guidance on owning, disclosing, and scoping AI-assisted contributions.
- ["Ten simple rules for using large language models in science, responsibly"](https://pmc.ncbi.nlm.nih.gov/articles/PMC10829980/): safeguards and productive applications, including verification of claims, confidentiality, and the "halo effect" of fluent output.
- [Best practices for working with an AI coding agent](https://code.claude.com/docs/en/best-practices): explore-then-plan-then-code, specific prompting, giving the model a way to verify its work, managing context, reusable skills, and adversarial review.
- [Open Source AI Contribution Policies (melissawm)](https://github.com/melissawm/open-source-ai-contribution-policies): a collection of how open-source projects approach AI-generated contributions.

## Appendix: Example setup (Claude Code)

This appendix is **one concrete illustration**, not a requirement. It maps the model-agnostic practices above onto the skills and harnesses one developer happens to use with a particular tool (Claude Code). Another tool or model would implement the same ideas through its own mechanisms. The practices are what matter, not the names below.

### Skills (named procedures the assistant loads on demand)

| Practice in this document | Skill used | What it does |
| --- | --- | --- |
| Capture repeatable work — code-review harness | `code-review` / `requesting-code-review` | Reviews the diff for bugs, security, and quality in a fresh context and returns specific, line-referenced findings. |
| Capture repeatable work — security review | `security-review` | A dedicated pass for injection, authentication/authorization flaws, secret handling, and unsafe data flows before merging sensitive changes. |
| Explore and plan before generating code | `brainstorming` + `writing-plans` | Explores intent and requirements before any code is written, then produces a written plan or spec to execute against. |
| Always verify; never assume it works | `verify` | Runs the app or feature and observes actual behavior rather than asserting success. |
| (Quality cleanup) | `simplify` | Reviews changed code for reuse and simplification — quality only, not bug-hunting. |
| Understand and own every change | `init` | Generates an overview/instructions file describing the codebase's architecture and conventions. |

### Harnesses (runtime mechanisms — tool-specific)

- **A shared instructions file** (e.g. `CLAUDE.md`): persistent project context: build commands, code style, conventions loaded automatically each session.
- **Plan mode**: separates exploration and planning from implementation.
- **Subagents**: run research or review in a fresh, isolated context so it does not pollute the main session and the reviewer is not biased toward code it just wrote.
- **Hooks**: deterministic checks that run every time (for example, linting after each edit).
- **Workflows**: multi-step orchestration of several agents for fan-out-and-verify patterns.

Remember the distinction from the skills section: the *content* of these skills is portable across tools and models, but the *loading mechanisms* listed under harnesses are specific to this tool, and *execution quality* depends on the model running them.

