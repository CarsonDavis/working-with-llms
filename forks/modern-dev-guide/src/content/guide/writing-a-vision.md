---
title: "The Vision Document"
dek: "An agent has no idea what your project is doing, who it is for, or what it should accomplish."
part: "Context"
order: 3
reviewed: 2026-07-02
---

## What a good vision prevents

An agent has no idea what your project is doing, who it is for, or what it should accomplish. If you ask it to go do a task blind, it will sometimes do it in a way that defeats the entire purpose of your repo.

The fix is easy. Tell your agent about your project.

What goes in a `vision.md` is unique to each project, but you need to remember what problem you are trying to solve. Agents will write excellent code that absolutely doesn't do what you wanted. Think about the kinds of things that happen:

- Building the wrong thing, because it solved a misunderstood problem and never saw the real goal.
- Mis-sizing the solution, over-engineering something that should be simple or under-building something load-bearing.
- Ignoring a hard constraint (cost, scale, compliance) it had no way of knowing existed.
- Gold-plating features nobody asked for.

None of these are the model writing bad code. The code is probably fine. They're the model writing code that's wrong for your project, because it never had the project's direction in front of it.

## How to write one

You don't have to labor over this. The fastest way is to word-vomit it: the people who actually hold the vision talk for ten or fifteen minutes about everything that matters, into speech-to-text, and let the LLM organize it into a draft. Point it at related repos or existing material if that helps.

:::ownit
Then read the draft by hand and edit it. *Do not skip this.*
:::

Every downstream decision is grounded on your vision, so it has to be right, and you are the owner. The LLM is just helping you write.

:::recommendation
Keep it to a page or two. If your vision is more than two pages, the detail you're adding probably belongs downstream in requirements or architecture, not here. Aim for the shortest document that can still settle a "which way should I build this?" question correctly.
:::

## How to operate it

It's a tracked artifact. The project owner approves it and owns it. The agent reads it on every task. Human contributors read it before they contribute. When a stakeholder decision changes, the vision changes and the downstream docs follow. And when the LLM ships something deeply misaligned, the fix usually belongs here.

## The skill

We have a :term[skill] that helps you write a vision.md. It hands you a set of brain-dump prompts, listens while you talk through the project, and organizes your answers into a draft `vision.md` for you to edit. It is deliberately built so that you still own and write the actual content; the skill only structures what you said. → [writing-a-vision](https://github.com/CarsonDavis/claude/tree/master/skills/writing-a-vision)
