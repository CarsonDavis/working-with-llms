# Writing Issues

## Avoid the interrogation anti-pattern

The bad way to write an issue is to open a chat window, type one sentence, and let the bot interrogate you back and forth forever while you carry all the cognitive load, until it finally builds something that's sort of what you wanted...Don't do that.

Bring a rough idea to your team, hash it out with the people who know the app until you share an understanding, then turn on your microphone and capture that shared understanding in one pass. Let more than one person talk; if the first misses something, the next fills it in.

Hand that brain dump to the issue-writing skill. It reads it, pushes back where it has real questions or thinks the task should be split, researches your actual repository to check the issue is viable and surface gotchas, and drafts a clean issue.

## The two-layer issue

The skill we use writes the issue in two layers

- A clean, code-free top layer the human owns: the motivation, what the task is, and how you'll know it's done. Written to survive refactors, with no file paths or function names that rot, so a reviewer who has never opened the repo can understand the work and judge whether it's the right thing.
- A collapsed, commit-pinned implementation sketch the agent owns: the rough plan from reading the code, plus any genuine gotchas, stamped with the commit it was written against.

The pinning matters because of timing. You might plan an issue at the start of the week and implement it days later, and the code moves in between. Agents follow stale instructions exactly as faithfully as good ones, right off a cliff, so you don't want an over-specified plan full of exact line numbers and code that will be wrong by the time someone picks it up.

Everyone on the team, regardless of coding knowledge, should be able to understand and approve the top sections of the issue. The implementation plan should be sanity checked by whoever is deepest in the codebase.

## Why motivation

There is some content that should always go in a document intended for LLMs that we rarely put in documents intended for humans. One of those is the motivation section.

Motivation is something implicit that all the human devs know, and which silently drives the details of our implementation plans. If you don't tell the LLM why you are doing something and how it fits into the bigger picture, then don't be surprised when it comes up with a stupid way of implementing the task.

The skill we use knows to ask for motivation and include it in the draft issue. Read it and edit it so it is exactly what you want.

## Right-size it

A good issue should be one reviewable PR. An LLM will casually write ten thousand lines of code if you ask it to...so don't. If the work sprawls across several independent pieces, the skill should say so and propose a breakdown, and you should take that seriously. A huge issue becomes a huge PR, and huge PRs either don't get reviewed or get reviewed badly.

For a real example, look at how one piece of MMGIS test work got split into [#148](https://github.com/NASA-IMPACT/MMGIS/issues/148) and [#149](https://github.com/NASA-IMPACT/MMGIS/issues/149). The first moves the unit tests into a DOM-capable environment, pure mechanics that change nothing about what any test asserts. The second fixes the stale tests that migration revealed. Doing work in small, well-defined chunks makes everything about development easier.

## The payoff

Writing good issues and fully understanding them takes time. This will take longer than you are used to.

The trade is a little more time up front for much less time overall. Fifteen, maybe twenty minutes on an issue buys you a task so well-scoped and well-understood that you can finish several of them in a day, with no foreseeable surprises left at the end. But it only works if you actually read what the agent drafted. If you don't own the spec it's about to implement, you don't own anything.

## The skill

We have a skill that does all of this: it takes your brain dump, asks about anything missing, researches the repo to check the work is viable, proposes a split if it's too big, and writes the two-layer draft for you to edit and file. → [writing-github-issues skill](https://github.com/NASA-IMPACT/llm-tools/tree/main/skills/writing-github-issues)