# CLAUDE.md — working-with-llms

This repo is two things: the **source of the Working With LLMs guide** (`guide/`, built with
mkdocs) and the **installable plugin** that ships the guide's tooling (`plugins/working-with-llms/`,
exposed through the `wwl` marketplace in `.claude-plugin/marketplace.json`).

## Deploying the site

The guide's published home is the hub at **https://llms.codebycarson.com/working-with-llms/**,
which is built and served by the **separate `CarsonDavis/code-by-carson` repo** (its
`deploy-llms.yml` checks out this repo's `main` and builds the guide from source, then syncs to
S3 + CloudFront). This repo's own GitHub Pages deploy only publishes redirect stubs — it does
**not** publish the guide itself.

So a change to the guide is a two-step publish:

1. Commit and push the change to `main` here.
2. Trigger the hub rebuild (the two repos are not auto-linked, so a push here does **not**
   publish on its own):

   ```
   gh workflow run deploy-llms.yml --repo CarsonDavis/code-by-carson --ref master
   ```

   Then watch it and confirm the change is live:

   ```
   gh run watch --repo CarsonDavis/code-by-carson
   curl -s -o /dev/null -w "%{http_code}\n" https://llms.codebycarson.com/working-with-llms/
   ```

This needs no stored token — the maintainer's already-authenticated `gh` (scope `repo`) can
dispatch the hub workflow directly. A GitHub App/PAT-based auto-trigger was considered and
rejected because creating that credential is GitHub-UI-only; deploying via this CLI command is
the chosen mechanism.

## Deploying the plugin

Skills and agents ship from `plugins/working-with-llms/`. After editing them:

1. Bump `version` in `plugins/working-with-llms/.claude-plugin/plugin.json` (an omitted/unchanged
   version turns every commit into a silent release).
2. Commit and push to `main`.
3. On any machine that has it installed, pull the update:

   ```
   claude plugin marketplace update wwl
   claude plugin update working-with-llms@wwl
   ```

   (Restart Claude Code afterward so new components load.)

## Notes

- The larger effort (install/onboarding system) is tracked in
  `tasks/portable-workflow-implementation-plan.md`.
- Untracked brain-dump files in the repo root (`asdf.md`, `inst.md`, `arst.md`) are scratch, not
  guide content.
