---
title: Start Here
num: 1
dek: Modern agentic coding systems are extremely good at following instructions.
layout: chapter.njk
---
<span class="newthought">Modern agentic coding systems</span> are extremely good at following instructions.

When you see them write bad code, it is probably not because the technology is bad, but instead because they didn't have sufficient instructions and context for the task. In 2026, the question is no longer, "can an LLM write good Python?" The question is whether the code does **what you actually wanted**, fits the **whole project**, and respects the **constraints** a senior engineer knows implicitly.

So when working with LLMs you have a few clear responsibilities:

<ol class="responsibilities">
<li><strong>Use a capable model</strong> that writes quality code</li>
<li><strong>Use a quality harness</strong> that writes specs, follows instructions, does code reviews, orchestrates sessions, and provides guardrails</li>
<li><strong>Provide context to the model</strong> so it writes code that not only "does the task" but aligns with your project's vision, your codebase's architecture, and your software engineering standards</li>
</ol>

<hr class="hairline">

## 1. Foundation: a capable model and a real harness

**Model.** The more complex and the less well-constrained your task is, the more benefit you will get from using a flagship model. We have the most experience with **Claude Opus 4.8**; but other flagships from OpenAI, Gemini, etc. can drop in as long as you are using a good harness and carefully engineering your context.

**Harness.** A raw model is basically a fancy next-word predictor, and is not necessarily a good coding partner. A coding harness adds the scaffolding that makes instruction-following reliable, gives you built-in planning, adds test verification, code review, guardrails, and much more.

Many on our team have had good experience using the Claude Code harness on top of the model Opus 4.8, and then layering the pcvelz/superpowers harness on top of that.[^harness-drift]

Don't stress about using the bleeding edge as long as you're using something.

<p class="xref">See Chapter 2, <em><a href="/chapters/02-harness-and-model/">Harness &amp; Model</a></em>.</p>

<hr class="hairline">

## 2. Understand the work, then make that understanding available to the agent

If *you* don't understand what your project is, what it's for, what you're building, and how it integrates with the rest of your services...then you can't tell an LLM those things, and you will not get good results.

Trying to re-tell an LLM every detail it needs within every chat is a losing battle, so what we try to do is embed much of the understanding ahead of time within the appropriate level of the project.

### 2.1 Vision: why the project exists

A `vision.md` explains what a project is: its goals, who it serves, and how it fits into the wider org. It informs the big decisions: which architecture, how to implement, what to gold-plate versus ship as an MVP, which issues are even worth doing.

Today this lives in managers' and stakeholders' or Sr devs' heads, or in a PowerPoint somewhere, or a Google doc, but almost never in the repo where a coding agent can actually read it and use it to make better decisions.

The people on your team who are most knowledgeable about the project should sit down and capture it in a _short_ `vision.md`. Short and concise enough that the agent stays flexible, and short and concise enough that **every teammate actually reads and understands it**, but detailed enough to inform architectural and implementation questions in alignment with the project's goals.

<p class="xref">See Chapter 3, <em><a href="/chapters/03-the-vision-document/">The Vision Document</a></em>.</p>

### 2.2 Codebase understanding: how the code actually works

An agent will _not_ read every file in your repo, which means it will often overlook or misunderstand things. You can help an agent out by having concise documentation that it reads before starting work.

If you already have a clean, modular, predictable, and convention-following repo, you will need little documentation, because it will behave the way an agent expects. However, if you have a convoluted, legacy, or spaghetti repo, it likely has interactions a senior dev might know but a new contributor (human _or_ LLM) would miss. Those gotchas, patterns, and interactions must be written down so the agent doesn't make naive mistakes or choose bad implementations.

Therefore, scale your documentation to the need. If your repo is small and well-structured, maybe all you need is a top-level README. If it's big, but modular and clean, maybe you can make do with hierarchical per-module READMEs and an `architecture.md`. If it is gnarly, legacy, spaghetti code, maybe you need an entire tutorial system. Your job is to think clearly about your own codebase and choose the appropriate level of documentation that needs to be generated and inserted into the context window of the agent.

It might also be necessary to modernize your thinking about cost. Documenting a repo used to take weeks; now an agent can do it in hours. It is trivial to spawn subagents to study the files, consolidate, cross-reference, synthesize and have something better than any human would have written. Docs are cheap to create and are cheap to keep current, all you need is to keep them short enough for humans to read and to make maintaining them a core part of your coding workflow.

**Critical:** anything you give the agent it will take at face value as truth, so docs are first-class artifacts, not afterthoughts. Read them, understand them, and stand behind them. If your team is not reviewing and understanding the documentation then you are wasting your time. Feed garbage in and you will get garbage out. Keep your docs short and informative enough to make this easy for the team but useful for the agent.

<p class="xref">See Chapter 4, <em><a href="/chapters/04-codebase-documentation/">Codebase Documentation</a></em>.</p>

### 2.3 The task: turning what you want into something the agent can execute

Deciding **what** to build and **why** is part of the creative and intellectual work that you should not offload to an agent. With your team, settle that a feature is worth building, that it aligns with the vision and what stakeholders asked for, then talk through how it should work, its requirements, and how it would land in the code.

There is no need to write pages of instructions by hand: brainstorm in a group for a few minutes, turn on your mic, and word-vomit the task: why you want it, what it does, the requirements, the rough implementation. An agentic skill reads the dump, pushes back where it has questions or thinks the task should be split, **researches your repo** to check the task is viable, and then drafts a GitHub issue with motivation, summary, requirements, and a rough **commit-pinned implementation plan**.

Remember, you can use agents to help you write, but you **must** read what the agent wrote. If you don't take ownership of the spec the agent is about to implement, then you don't own anything.

<figure class="pull"><blockquote>If you don't take ownership of the spec the agent is about to implement, then you don't own anything.</blockquote></figure>

In our experience, writing issues with this much deliberate detail takes longer than you're used to, but this time is more than made up for with the speed of implementation and the ease of reviewing the resulting higher quality code.

<p class="xref">See Chapter 5, <em><a href="/chapters/05-writing-issues/">Writing Issues</a></em>.</p>

### 2.4 Ironclad rules: `CLAUDE.md`

A good harness will carefully follow a CLAUDE.md, so you should use it deliberately. Because a guardrailed agent will often follow instructions to the letter, an over-specific rule can be worse than nothing at all. Don't be draconian: "if there are more than five files, put them in a folder" is a bad rule. Here are some examples of good rules:

- **Directional principles:** "prefer modular features over one-off scripts"
- **Clear don'ts:** "never commit until after I've reviewed the changes"
- **Clear do's:** "always read `vision.md` before starting a task" or "always update the documentation before making a commit"

And remember, some problems aren't `CLAUDE.md` problems at all. You _could_ certainly write "Don't push to main" in your CLAUDE.md. Or you could go on GitHub and make main reachable only through a reviewed PR. You're still a software engineer; don't try to fix organizational problems inside a coding session.[^hooks]

<hr class="hairline">

## 3. The development workflow

Once your team has a clear vision, sufficient documentation, and a well-formed issue, the actual coding workflow goes something like this:

<ol class="step-block">
<li><span class="step-num">1</span><span class="step-text">The agent reads the <strong>vision.md</strong>.</span></li>
<li><span class="step-num">2</span><span class="step-text">Then it reads the <strong>repo docs</strong> the team crafted.</span></li>
<li><span class="step-num">3</span><span class="step-text">Then it reads the <strong>task</strong> the team carefully wrote.</span></li>
<li><span class="step-num">4</span><span class="step-text">The harness writes a detailed <strong>specification</strong> from its own fresh exploration of the code.</span></li>
<li><span class="step-num">5</span><span class="step-text">An <strong>implementation agent</strong> builds to that spec.</span></li>
<li><span class="step-num">6</span><span class="step-text">A <strong>review agent</strong> checks the implementation against the spec, looks for other problems, and reports back when the code is ready to show you.</span></li>
</ol>

Then it's your turn.

<ul class="checklist">
<li><strong>Smoke-test</strong> that the features work. Check that you like them.</li>
<li><strong>Read the code</strong> and confirm it's written the way you wanted.</li>
<li><strong>Understand the code.</strong> Understanding the code isn't optional. When you don't fully understand what the code is doing, it's still your job to learn it.<label for="sn-3" class="sidenote-number">3</label><input type="checkbox" id="sn-3" class="sidenote-toggle"><span class="sidenote tool-note">⚙ <code>diff-explainer</code> &mdash; walks you through what a diff does, what it affects, and how it fits into the rest of the codebase, so you can get to a genuine understanding. See Chapter 6, <em>The Workflow</em>.</span></li>
<li><strong>Iterate and deliver.</strong> Iterate until you're happy, then hand it to the team for final review.</li>
</ul>

<p class="xref">See Chapter 6, <em><a href="/chapters/06-the-workflow/">The Workflow</a></em>.</p>

<hr class="hairline">

## Continuous improvement

None of these documents are write-once and forget, and your agentic coding system will never be perfect. On a regular cadence, you need to look at where the LLM failed you and write the lessons back into the artifact that should have caught it. For example:

<table class="table-designed">
<thead><tr><th>The LLM failed by&hellip;</th><th>Improve&hellip;</th></tr></thead>
<tbody>
<tr><td>Making misaligned implementation decisions</td><td>the <strong>vision</strong></td></tr>
<tr><td>Making a context-blind mistake in the code</td><td>the <strong>codebase docs</strong></td></tr>
<tr><td>Shipping code your reviewer wouldn't accept</td><td>the <strong>review</strong></td></tr>
<tr><td>Producing an oversized, sprawling PR</td><td>the <strong>issue</strong></td></tr>
</tbody>
</table>

Do this and your harness will get better every cycle, and your agent will ship better and more aligned code.

We have some dedicated tools to help with this, like a skill that mines **every review comment ever left on a repo**, synthesizes them, and produces a report of candidate review guidelines.

<p class="xref">See Chapter 7, <em><a href="/chapters/07-the-review-loop/">The Review Loop</a></em>.</p>

[^harness-drift]: Harnesses and models improve and change over time, and exact recommendations go out of date within months of being written.
[^hooks]: This guide doesn't yet cover hooks, but they are another tool you can use alongside your CLAUDE.md to ensure desired behavior.
