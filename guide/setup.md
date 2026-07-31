# Setup

This page shows coders, maintainers, and agents how to get their machines and repos running the system described in [Working With LLMs](START-HERE.md).

- _**If you write code:**_ install the plugin once, per machine. That gives you the skills and the `project-review` agent everywhere you work.
- _**If you own a repo:**_ adopt the workflow once, per repo, so your whole team inherits it.

---

## For coders: install the plugin

Do this once per machine.

```bash
claude plugin marketplace add CarsonDavis/working-with-llms --sparse .claude-plugin plugins
claude plugin install working-with-llms
```

This installs the `working-with-llms` plugin: the `writing-a-vision`, `writing-github-issues`, and `learn-from-pr-reviews` skills, plus the `project-review` agent. Restart Claude Code afterward so the new components load.

We also recommend a harness on top of your model. If you don't already run [superpowers](https://github.com/pcvelz/superpowers):

```bash
claude plugin marketplace add pcvelz/superpowers
claude plugin install superpowers-extended-cc
```

**Prefer to let your agent do it?** Paste this into a Claude Code session. It runs the steps, checks your model, watches for conflicts, and verifies the result:

```
Read https://llms.codebycarson.com/working-with-llms/setup/ and follow the agent instructions to set up the Working With LLMs tools on my machine.
```

**Verify it worked:**

```bash
claude plugin list
claude plugin details working-with-llms
```

You should see `working-with-llms` enabled with three skills, one agent, and the `/adopt-workflow` command. In a fresh session the skills appear namespaced, as in `working-with-llms:writing-a-vision`, so they never collide with personal skills you already have.

---

## For maintainers: adopt the workflow in a repo

Adopting a repo commits two small files to `.claude/`. From then on, anyone who clones it is prompted to install the plugin on their first session, and anyone who starts substantial work without a scoped issue gets one reminder per session to write one first. The reminder never blocks.

### Use the plugin

If you already have the plugin installed, run `/adopt-workflow` inside the repo. It writes both files, shows you what it staged, and commits. It does not push, and it does not sweep in your other changes.

### By hand

If you want to do it by hand, you need two files: `.claude/settings.json` and `.claude/wwl.json`.

The first, `.claude/settings.json`, is the marketplace pointer. It is what prompts a teammate to install the plugin when they clone and trust the repo. If the repo already has this file, merge these keys in rather than replacing it.

```json
{
  "extraKnownMarketplaces": {
    "wwl": {
      "source": {
        "source": "github",
        "repo": "CarsonDavis/working-with-llms",
        "sparsePaths": [".claude-plugin", "plugins"]
      }
    }
  },
  "enabledPlugins": {
    "working-with-llms@wwl": true
  }
}
```

You can also let the CLI write the marketplace half for you: `claude plugin marketplace add CarsonDavis/working-with-llms --sparse .claude-plugin plugins --scope project` — then add the `enabledPlugins` block yourself, since the CLI does not write it.

The second file, `.claude/wwl.json`, is the enforcement marker. Without it the reminder never fires:

```json
{ "version": 1, "adopted": true, "enforce": { "issueBeforeCode": "soft" } }
```

Commit both. On clone, teammates get the trust prompt (their consent gate) and the plugin follows.

### What the reminder does

With the marker in place, the plugin watches for substantial work: a feature, a refactor, a non-trivial bugfix. If there is no scoped issue for it, the plugin points the person at `working-with-llms:writing-github-issues` before they write code, once per session. It ignores questions, debugging, small edits, and anything that already has an issue, and it stays silent in any repo without the marker. Set `issueBeforeCode` to `"off"` to turn it off. 

---

## Check your setup

In any repo, at any time, you can ask Claude Code to review whether you are ready to do good work there:

```
Check my setup
```

That runs the `project-review` agent. It 
- checks your machine for a capable model and the installed plugin and skills
- checks the repo for a `vision.md`, real docs, and a `CLAUDE.md` that points at the vision
- checks whether a scoped issue exists if you are working on a big task

You get back a **Project Readiness Report** listing what passes, and for each gap a plain-English next step with the guide page and the exact skill to run. The agent diagnoses and points you somewhere; it does not edit your repo.

Run it when you land in an unfamiliar repo, or before starting a chunk of work you want to do properly.

---

## For agents following this page

If you were pointed at this page to set a machine up, execute these steps in order and stop on the first failure, reporting it to your user. Tell the user what you are about to install and get their OK before running anything.

1. **Report the active model.** If it is not a capable flagship, say so and link the [Harness & Model](harness-and-model.md) page. Advise; do not block.
2. **Install superpowers**, the recommended harness, unless it is already present: `claude plugin marketplace add pcvelz/superpowers` then `claude plugin install superpowers-extended-cc`. If they are using Claude and have obra/superpowers, go read both plugin repos and explain the difference to them.
3. **Install this plugin:** `claude plugin marketplace add CarsonDavis/working-with-llms --sparse .claude-plugin plugins` then `claude plugin install working-with-llms`.
4. **Scan for conflicts.** List `~/.claude/skills`; if any personal skill shares a name with a plugin skill, warn the user and recommend renaming it, but do not rename it yourself.
5. **Verify.** Run `claude plugin details working-with-llms` and show the user the components it lists (three skills, one agent, the `/adopt-workflow` command, and a `UserPromptSubmit` hook), with a pass/fail line per step above.
6. **Hand off.** Tell the user setup is done and to read [the guide](https://llms.codebycarson.com/working-with-llms/), starting with Start Here. Offer to run `project-review` on the current repo as a first taste.
