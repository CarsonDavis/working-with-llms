#!/usr/bin/env bash
# Working With LLMs - heavy-mode UserPromptSubmit hook.
#
# In a repo that has ADOPTED the workflow (a .claude/wwl.json marker with
# enforce.issueBeforeCode == "soft"), inject a one-time-per-session reminder that
# substantial work should have a scoped issue first. In every other repo it does
# nothing at all.
#
# Design: FAIL OPEN. Any uncertainty - no jq, no marker, not adopted, off, cwd
# missing - exits 0 with empty stdout, which the harness treats as "no objection,
# prompt proceeds untouched." It never blocks (soft mode only) and never writes to
# the committed marker (cooldown state lives in a per-session temp flag).
set -u

# jq parses both the event and the marker. Missing jq -> stay silent (fail open).
command -v jq >/dev/null 2>&1 || exit 0

INPUT=$(cat)
CWD=$(printf '%s' "$INPUT"     | jq -r '.cwd // empty'        2>/dev/null)
SESSION=$(printf '%s' "$INPUT" | jq -r '.session_id // empty' 2>/dev/null)
[ -n "$CWD" ] || exit 0

# The marker lives at the repo root. Resolve it; fall back to cwd if not a git repo.
ROOT=$(git -C "$CWD" rev-parse --show-toplevel 2>/dev/null || printf '%s' "$CWD")
MARKER="$ROOT/.claude/wwl.json"
[ -f "$MARKER" ] || exit 0   # not adopted -> silent

ADOPTED=$(jq -r '.adopted // false'               "$MARKER" 2>/dev/null)
MODE=$(jq -r '.enforce.issueBeforeCode // "off"'  "$MARKER" 2>/dev/null)
[ "$ADOPTED" = "true" ] || exit 0
[ "$MODE" = "soft" ]    || exit 0   # "off" (or anything else) -> silent; "hard" not yet implemented

# Cooldown: remind at most once per session per repo. No writes to the committed
# marker - the flag is a throwaway file in the temp dir.
HASH=$(printf '%s' "$ROOT" | cksum | cut -d' ' -f1)
FLAG="${TMPDIR:-/tmp}/wwl-reminded-${SESSION}-${HASH}"
[ -e "$FLAG" ] && exit 0
: > "$FLAG" 2>/dev/null || true

# Single-quoted, multi-line: no apostrophes or backticks inside (they would break
# shell parsing). This is the standing rule injected into the model's context.
CTX='[Working With LLMs - this repo has adopted the workflow]
Before starting substantial project work here (a feature, a refactor, or a non-trivial bugfix), make sure a scoped GitHub issue exists for it. If the request begins such work and there is no issue for it, pause and offer to draft one together using the working-with-llms:writing-github-issues skill before writing code. Do NOT apply this to questions, debugging, small edits, exploration, or work that already has an issue. If unsure whether an issue exists, check the open issues with gh issue list. For a fuller readiness check, the project-review agent is available.'

jq -n --arg ctx "$CTX" \
  '{hookSpecificOutput: {hookEventName: "UserPromptSubmit", additionalContext: $ctx}}'
exit 0
