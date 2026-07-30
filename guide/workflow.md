# The Workflow

## By the time you code, the thinking should be done

If you have a good issue, the hard decisions should already be made. The project's goals, what this task is for, how it fits the bigger picture, the rough shape of the implementation: all of that was settled with your team when you wrote the GitHub issue. When you sit down to actually run the agent, you should not be rediscovering what the issue is trying to accomplish.

So if you find yourself deeply uncertain about what to build once coding starts, that probably means the planning wasn't finished. Either go back to the issue phase and spend more time on it with your team, or, if the work is genuinely exploratory and the uncertainty is the whole point, handle it as an exploratory task (see the bottom of this page).

Before you start, it's worth a quick gut-check that the repo is actually set up for good work — a vision, real docs, a `CLAUDE.md`, an issue for the task. Ask Claude Code to **"check my setup"** and the `project-review` agent will tell you what's missing. → **[Setup](setup.md)**


## What should happen, and who makes it happen

The core loop is small: the agent writes a spec from your issue and the current code, an implementer builds to that spec, and a fresh agent reviews the result against it. [Start Here](START-HERE.md) walks the full sequence; the point here is that there is more than one way to make that loop happen.

- **Prompt it yourself, step by step.** Fine for small tasks, but you're holding the structure in your head.
- **Let the harness drive it.** A plugin like superpowers runs the whole spec, implement, and review loop for you.
- **Write a skill that constrains it.** When you want the loop to run the same way every time, wrap it in a skill of your own. Our MMGIS [orchestrating-issues](https://github.com/NASA-IMPACT/MMGIS/tree/development/.claude/skills/orchestrating-issues) skill is one example you can build from: it takes an issue all the way to a draft PR, hands the spec, implementation, and review off to the harness, and stops for you at the few gates that actually need a human.

One fair warning on that last option: orchestration skills tend to be mildly specific to one repo, because they encode how *you* deploy, *your* conventions, and *your* gotchas. Use someone else's as a starting point, not a drop-in.

## Parallel agents

If your repo is gnarly, it's often worth spending a little time up front refactoring it so you can run several instances side by side on your own machine. That is what unlocks working several issues in parallel without them colliding. Our MMGIS [mmgis-deployment](https://github.com/NASA-IMPACT/MMGIS/tree/development/.claude/skills/mmgis-deployment) skill is one example of how this was done: each instance gets its own port, database, and config, so many of them coexist cleanly on one machine between different git worktrees.

This is especially useful for keeping issues (and therefore PRs) small. If your orchestration agent can work on several interconnected issues in parallel, it becomes much easier to develop, bugfix, review, and smoketest interdependent features without needing to shove them into a single giant PR.

## You still own the result

Agents are great, and they will write the spec, write the code, and run their own review. But none of that is your seal of approval. When it hands you a finished product, it is still your job to run it locally, confirm it actually does what it should, and read the code yourself. The agent passing its own tests does not mean the code is good. You have to look.

## Learning code you didn't write

As agents get more capable, they will write code in areas you are not deeply familiar with. That does not excuse you from understanding it. Be willing to Google things, read the real documentation, and ask the agent to explain how its own code works.

One tool we've found effective is the [diff-explainer](https://github.com/CarsonDavis/diff-explainer). It is not a review agent. It walks you through what a diff does, what it affects, and how it fits into the rest of the codebase, side by side with the actual code, so you can get to a genuine understanding and then make your own call.

## Exploratory tasks

Sometimes you genuinely don't know how a task should be done, and finding out is the task. The workflow still applies, you just specify a different thing up front. Instead of the implementation, you specify the parameters: how you'll judge the result, what you want to explore, and the pathways worth trying. With that clear, it's easy to spawn several agents in parallel down different paths, gather their reports, and compare them against your baseline.

It's helpful to think of your coding harness as a team of dedicated researchers and consider what you would want actual humans to be researching, writing down, and verifying. Don't just say, "research this topic". Propose what sources it should use, have it create cited research documents, cross reference two agents against each other, have them build a results dashboard for you to review the work, etc.