# Setup

The guide teaches the workflow; this page gets it onto your machine. The tools ship as a
Claude Code plugin, so installing is two commands, and there is nothing to copy by hand.

There are two different jobs here:

- **If you write code:** install the plugin once, per machine. That gives you the skills and
  the `project-review` agent everywhere.
- **If you own a repo:** adopt the workflow once, per repo, so your whole team inherits it.

Pick the section that matches you.

---

## For coders — install the tools

Do this once per machine. The fastest path is your terminal:

```
claude plugin marketplace add CarsonDavis/working-with-llms --sparse .claude-plugin plugins
claude plugin install working-with-llms
```

That installs the `working-with-llms` plugin: the `writing-a-vision`, `writing-github-issues`,
and `learn-from-pr-reviews` skills, plus the `project-review` agent. Restart Claude Code
afterward so the new components load.

We also recommend a harness on top of your model. If you don't already run
[superpowers](https://github.com/pcvelz/superpowers):

```
claude plugin marketplace add pcvelz/superpowers
claude plugin install superpowers-extended-cc
```

**Prefer to let your agent do it?** Paste this into a Claude Code session and it will run the
steps, check your model, watch for conflicts, and verify the result:

```
Read https://llms.codebycarson.com/working-with-llms/setup/ and set up the
Working With LLMs tools on my machine.
```

**Verify it worked:**

```
claude plugin list
claude plugin details working-with-llms
```

You should see `working-with-llms` enabled with three skills and one agent. In a fresh
session the skills appear namespaced — `working-with-llms:writing-a-vision` and so on — so
they never collide with any personal skills you already have.

---

## For maintainers — make a repo enforce the workflow

Do this once per repo, for the repos your team should follow the process in. It is a
deliberate, per-repo decision — the workflow does not switch itself on in your dotfiles or a
throwaway script.

The one-command way is to run **`/adopt-workflow`** inside the repo — it writes and commits the
two files below: the marketplace pointer and the enforcement marker. To do it by hand, commit a
`.claude/settings.json` so anyone who clones and trusts the repo is prompted to install the
plugin on their first session — no per-person setup:

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

If the repo already has a `.claude/settings.json`, merge these keys in rather than replacing
it. You can also let the CLI write the marketplace entry for you:
`claude plugin marketplace add CarsonDavis/working-with-llms --scope project`.

Then commit it. On clone, teammates get the trust prompt (their consent gate) and the plugin
follows.

### Enforcement: issue-before-code

`/adopt-workflow` also writes a `.claude/wwl.json` marker that turns on **soft enforcement** in
this repo:

```json
{ "version": 1, "adopted": true, "enforce": { "issueBeforeCode": "soft" } }
```

With the marker in place, when someone starts substantial work here — a feature, a refactor, a
non-trivial bugfix — and there's no scoped issue for it, the plugin quietly reminds them (once
per session) to draft one with `working-with-llms:writing-github-issues` before writing code.
It **never blocks**, and it stays completely silent in any repo without the marker. Set
`issueBeforeCode` to `"off"` to turn it off (a blocking `"hard"` mode is intentionally not built
yet).

---

## Check your setup

Any time — in any repo — you can ask Claude Code to review whether you're actually ready to
do good work there:

```
Check my setup
```

That runs the `project-review` agent. It looks at your machine (capable model, plugin and
skills installed) and the repo (is there a `vision.md`, real docs, a `CLAUDE.md` that points
at the vision — and, if you describe the task you're about to start, whether a scoped issue
exists for it). It hands back a **Project Readiness Report**: what passes, and for each gap a
plain-English next step with the guide page and the exact skill to run. It only diagnoses and
points — it never edits your repo.

Run it when you land in an unfamiliar repo, or before starting a chunk of work you want to do
properly.

---

## For agents following this page

If you were pointed at this page to set a machine up, execute these steps in order and stop on
the first failure, reporting it to your user. Tell the user what you are about to install and
get their OK before running anything.

1. **Report the active model.** If it is not a capable flagship, say so and link the
   [Harness & Model](harness-and-model.md) page. Advise; do not block.
2. **Install superpowers** (recommended harness), unless already present:
   `claude plugin marketplace add pcvelz/superpowers` then
   `claude plugin install superpowers-extended-cc`.
3. **Install this plugin:**
   `claude plugin marketplace add CarsonDavis/working-with-llms --sparse .claude-plugin plugins`
   then `claude plugin install working-with-llms`.
4. **Scan for conflicts.** List `~/.claude/skills`; if any personal skill shares a name with
   a plugin skill, warn the user and recommend renaming it — do not rename it yourself.
5. **Verify.** Run `claude plugin details working-with-llms` and show the user the three
   skills and one agent, with a pass/fail line per step above.
6. **Hand off.** Tell the user setup is done and to read
   [the guide](https://llms.codebycarson.com/working-with-llms/), starting with Start Here.
   Offer to run `project-review` on the current repo as a first taste.
