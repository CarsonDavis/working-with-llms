---
description: Adopt the Working With LLMs workflow in this repository — commit the plugin pointer and the enforcement marker so the whole team inherits it on clone.
---

You are running the `/adopt-workflow` command. Your job is to make the **current repository**
adopt the Working With LLMs workflow: install-on-clone for teammates, plus soft
issue-before-code enforcement. This is a deliberate, per-repo decision the user is making now.

Do this carefully and show your work. Do not adopt a repo the user did not intend to.

## Steps

1. **Confirm it's a git repo.** Run `git rev-parse --show-toplevel`. If it fails, tell the user
   this command only works inside a git repository and stop. Use that path as the repo root for
   everything below.

2. **Confirm intent.** Briefly tell the user what adoption will do (the two files below + a
   branch-protection recommendation) and that it will be committed. If they object, stop.

3. **Write `.claude/settings.json` (MERGE, do not overwrite).** If the file already exists, read
   it and merge these keys in, preserving everything else. If it doesn't exist, create it with
   just these keys. The goal: a teammate who clones and trusts the repo is prompted to install
   the plugin on their first session.

   Keys to ensure are present:
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
   Prefer a real merge (e.g. with `jq -s '.[0] * .[1]'` or by reading, editing, and rewriting the
   JSON) over blindly replacing the file. Keep it valid JSON.

4. **Write `.claude/wwl.json` (the enforcement marker).** This is what the heavy-mode hook reads.
   Create it exactly as:
   ```json
   {
     "version": 1,
     "adopted": true,
     "enforce": {
       "issueBeforeCode": "soft"
     }
   }
   ```
   `"soft"` means: when someone starts substantial work here without an issue, the hook injects a
   reminder to draft one first (it never blocks). `"off"` disables it. (A blocking `"hard"` mode
   is intentionally not implemented yet.)

5. **Recommend branch protection (do NOT configure it silently).** Tell the user that the gates
   which must be truly un-skippable — no merge to the default branch without a reviewed PR —
   belong in GitHub branch protection, not the harness. Offer the command but let them run it:
   ```
   gh api -X PUT repos/{owner}/{repo}/branches/{branch}/protection ...
   ```
   Point them at their repo's Settings → Branches if they prefer the UI.

6. **Commit both files.** Stage only `.claude/settings.json` and `.claude/wwl.json`, show the user
   `git diff --cached --name-only`, and commit with a message like
   `Adopt the Working With LLMs workflow`. Do not push unless the user asks. Do not sweep in other
   changes.

7. **Report.** Confirm what was committed, that teammates will now be prompted to install the
   plugin on clone, and that soft issue-before-code enforcement is active (visible next session,
   once per session). Remind them branch protection is the un-skippable backstop and is theirs to
   set.
