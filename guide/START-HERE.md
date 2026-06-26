# Working With LLMs: Start Here

## The premise

Modern agentic coding systems are extremely good at following instructions.

When you see them write bad code, it is probably not because the technology is bad, but instead because they didn't have sufficient instructions and context for the task. The question is not "can an LLM write good Python"; it's whether the code does **what you actually wanted**, fits the **whole project**, and respects the **constraints** a senior engineer would have known.

So when working with LLMs you have a few clear responsibilities:

1. **Use a capable model** that writes quality code
2. **Use a quality harness** to ensure initial specs, implementation instruction following, and quality code reviews
3. **Provide context** so code not only "does the task" but aligns with your project's vision, your codebase's architecture, and your software engineering standards

---

## 1. Foundation: a capable model and a real harness

**Model.** The more complex and the less well-constrained your task is, the more benefit you will get from using a flagship model. We have the most experience with **Claude Opus 4.8**; but other flagships from OpenAI, Gemini, etc can drop in as long as you are using a good harness and carefully engineering your context.

**Harness.** A raw model is basically a fancy next-word predictor, not necessarily a good coding partner. A coding harness adds the scaffolding that makes instruction-following reliable, gives you built in planning, adds test verification, code review, guardrails, and much more.

Many on our team have had good experience using the Claude Code harness on top of the model Opus 4.8, and then layering the pcvelz/superpowers harness on top of that. 

Harnesses and models improve and change over time. Exact recommendations go out of date almost as soon as they are written, but at least make sure you are using a coding harness of some kind. → **[harness-and-model.md](harness-and-model.md)**

Once you're on a capable model inside a good harness, your next job is the context.

---

## 2. Understand the work, then make that understanding available to the agent

If *you* don't understand what your project is, what it's for, what you're building, and how it integrates...then you can't tell an LLM those things, and you won't get good results. Since it's not possible to endlessly download everything in your head into a single chat window on demand, the fix is to put that understanding into the repo, at every level the agent needs it, ahead of time.

### 2.1 Vision: why the project exists

A `vison.md` explains what a project is: its goals, who it serves, and how it fits into the wider org. It informs the big decisions: which architecture, how to implement, what to gold-plate versus ship as an MVP, which issues are even worth doing.

Today this lives in managers' and stakeholders' or sr devs' heads, or in a PowerPoint somewhere, or a Google doc, but almost never in the repo where a coding agent can read it and use it to make better decisions. 

The people on your team who are most knowledgeable about the project should sit down and capture it in a _short_ `vision.md`. Short and concise enough that the agent stays flexible, and short and consice enough that **every teammate actually reads and understands it**, but detailed enough to inform architectural and implementation questions in alignment with the project's goals. → **[how to write a vision.md](vision.md)**

### 2.2 Codebase understanding: how the code actually works

An agent will _not_ read every file in your repo, which means it often overlook and misundertand things. You can help an agent out by having concise documentation that it reads before starting work.

If you have a clean, modular, predictable, and convention-following repo, you will need little documentation, because it will behave the way an agent expects. However if you have a legacy or spaghetti repo, it likely has interactions a senior dev might know but a new contributor (human _or_ LLM) would miss. Those gotchas, patterns, and interactions must be written down so the agent doesn't make naive mistakes or choose bad implementations.

Scale your documentation to the need. If your repo is small and well-structured, maybe all you need is a top-level README. If it's big but modular and clean maybe you need hierarchical per-module READMEs and an `architecture.md`. If it is gnarly, legacy, spagheti code, maybe you need an entire tutorial system. Your job is to think clearly about your own codebase and choose the appropriate level of documentation that needs to be generated and inserted into the context window of the agent.

It might also be necessary to modernize your thinking about cost: documenting a repo used to take weeks; now an agent does it in hours. It is trivial to spawn subagents to study the files, consolidate, cross-reference, synthesize and have something better than any human would have written. Docs are cheap to create and are cheap to keep current, all your need is to keep them appropriately short and to make them a core part of the coding workflow.

**Critical:** anything you give the agent it will take at face value as truth, so docs are first-class artifacts, not afterthoughts. Read them, understand them, and stand behind them. If your team is not reviewing and understanding the documentation, then you are feeding garbage in and will get garbage out. Keep your docs short and informative enough to make this easy for the team but useful for the agent. → **[codebase-docs.md](codebase-docs.md)**

### 2.3 The task: turning what you want into something the agent can execute

Deciding **what** to build and **why** is one thing you must not offload. With your team, settle that a feature is worth building, that it aligns with the vision and what stakeholders asked for, then talk through how it should work, its requirements, and how it would land in the code.

There is no need to write pages by hand: brainstorm in a group for a few minutes, turn on the mic, and word-vomit the task: why, what it does, the requirements, the rough implementation. A agentic skill reads the dump, pushes back where it has questions or thinks the task should be split, **researches your repo** to check the task is viable, and then drafts a Github issue with motivation, summary, requirements, and a rough **commit-pinned implementation plan**.

You can use agents to help you write, but you **must** read what the agent wrote. If you don't take ownership of the spec the agent is about to implement, then you don't own anything. In our experience, it takes longer than you're used to be deliberate about writing issues with quality detail, but this time is more than made up for with the speed of implementation and the ease of reviewing the resulting higher quality code. → **[how to write issues](writing-an-issue.md)**

### 2.4 Ironclad rules: `CLAUDE.md`

A good harness will carefully follow a CLAUDE.md, so you should use it deliberately. Because a gaurdrailed agent will follow instructions to the letter, an over-specific rule can be worse than nothing at all. Don't be draconian: "if there are more than five files, put them in a folder" is a bad rule. Here are some examples of good rules:

- **Directional principles**: "prefer modular features over one-off scripts"
- **Clear don'ts**: "never commit until after I've reviewed the changes" 
- **Clear do's**: "always read `vision.md` before starting a task" or "always update the documentation before making a commit"

And remember, some problems aren't `CLAUDE.md` problems at all. You _could_ certainly write "Don't push to main" in your CLAUDE.md. Or you could go on Github and make main reachable only through a reviewed PR. You're still a software engineer; don't try to fix organizational problems inside a coding session.

---

## 3. The workflow

Once your team has a clear vision, sufficient documentation, and a well-formed issue, the actual coding workflow goes something like this:

1. The agent reads the **`vision.md`**.
2. Then it reads the **repo docs** the team chose.
3. Then it reads the **task** the team carefully wrote.
4. The harness writes a detailed **specification** from its own fresh exploration of the code.
5. An **implementer agent** builds to that spec.
6. A **review agent** checks the implementation against the spec, looks for other problems, and reports back when the code is ready to show you.

Then it's your turn, and the engineer's responsibilities haven't gone anywhere. 
- **Smoke-test** that the features work. Check that you like them.
- **Read the code** and confirm it's written the way you wanted, because the agent writing it doesn't make understanding it optional. When you don't fully understand what the code is doing, it's still your job to learn it (a **diff-explainer** tool helps here). Iterate until you're happy, then hand it to the team for final review. → **[workflow.md](workflow.md)**


---

## The loop that keeps this honest

None of these documents are write-once and forget, and your agentic coding system will never be perfect. On a regular cadence, look at where the LLM failed you last cycle and write the lesson back into the artifact that should have caught it.

| The LLM failed by... | Improve... |
|---|---|
| Making misaligned implementation decisions | the **vision** |
| Making a context-blind mistake in the code | the **codebase docs** |
| Shipping code your reviewer wouldn't accept | the **review** |
| Producing an oversized, sprawling PR | the **issue** |

Do this and your harness will get better every cycle, and your agent will ship better and more aligned code.

We have some dedicated tools to help with this, like a skill that mines **every review comment ever left on a repo**, synthesizes them, and produces a report of candidate review guidelines. Be proactive about improving the process. → **[review-loop.md](review-loop.md)**
