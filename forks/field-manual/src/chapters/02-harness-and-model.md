---
title: Harness & Model
num: 2
dek: Use a powerful flagship model, and when in doubt reach for the most capable one you have.
layout: chapter.njk
---
## The model

<span class="newthought">For most tasks</span> that aren't tightly bounded, use a powerful flagship model, and when in doubt reach for the most capable one you have. We have the most experience with Claude Opus 4.8, but the latest flagships from OpenAI and Gemini drop in just as well.

Don't chase leaderboards: the "best" model changes every few weeks, and the gap between the top flagships is almost never what makes or breaks a task. For small, mechanical, tightly-scoped work, a cheaper or faster model is often fine; for anything that needs real judgment or planning, use the strongest one available to you and give it access to as much quality context as you can.

## What a harness actually does for you

A raw model is a fancy next-word predictor. Give it a feature to build and it might start strong, drift halfway through, and then hand you something almost-but-not-quite right. A harness fixes that by turning "build me this" into a gated pipeline: each step is pinned to something concrete, and nothing moves forward until it checks out.

Many on our team run a stack of harnesses: Claude Code on top of Opus 4.8, and then [pcvelz/superpowers](https://github.com/pcvelz/superpowers) on top of that.

Here's the loop the superpowers harness runs when you hand it a task:

<ol class="step-block step-block--small">
<li><span class="step-num">1</span><span class="step-text"><strong>Spec first.</strong> It explores your actual code, asks you questions, proposes an approach, and writes a design spec. Nothing gets built until you approve it.</span></li>
<li><span class="step-num">2</span><span class="step-text"><strong>Implement to the spec.</strong> An agent types out the code by following that spec, instead of improvising from your one-line request.</span></li>
<li><span class="step-num">3</span><span class="step-text"><strong>Review by a fresh agent.</strong> A second agent that did not write the code reads the diff against the spec: every requirement met? anything quietly added? anything misunderstood?</span></li>
<li><span class="step-num">4</span><span class="step-text"><strong>Verify.</strong> Tests can be written ahead of the code, and the code isn't done until it passes them.<label for="sn-1" class="sidenote-number">1</label><input type="checkbox" id="sn-1" class="sidenote-toggle"><span class="sidenote">You can run all of this in an isolated git worktree, so several tasks can go at once without stepping on each other.</span><label for="sn-2" class="sidenote-number">2</label><input type="checkbox" id="sn-2" class="sidenote-toggle"><span class="sidenote">You can also delegate portions to different models, for example the spec and the review to your most expensive and capable model while a cheaper, faster one does the typing in the middle.</span></span></li>
</ol>

Superpowers does plenty more in the same spirit (systematic debugging before proposing fixes, structured handling of review feedback, a clean merge-and-cleanup step at the end), so explore all its capabilities.

<details>
<summary>Install superpowers</summary>

```
/plugin marketplace add pcvelz/superpowers
/plugin install superpowers-extended-cc@superpowers-extended-cc-marketplace
```

</details>

## Practical notes

Run your agent on your actual machine, not in a browser tab. You want it in your real environment, with your tools and your repo, able to run and smoke-test what it builds.

Harnesses and models both change fast. Stay reasonably current, but don't agonize over it. The only rule that matters is to use a real harness and a capable model; which exact ones matter far less than the fact that you're using them at all.

<figure class="pull"><blockquote>The only rule that matters is to use a real harness and a capable model.</blockquote></figure>
