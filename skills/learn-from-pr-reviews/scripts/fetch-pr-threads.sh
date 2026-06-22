#!/usr/bin/env bash
#
# Phase 2 — Dump every comment thread for ONE pull request, enriched with the
# code context needed to judge it.
#
# Usage:  fetch-pr-threads.sh <owner/repo> <local-clone-path> <pr-number>
# Output: review-mining/<owner-repo>/02-threads/PR-<n>.json
#         (an array of self-contained thread records)
#
# Pure data collection. No LLM. Three comment sources, each tagged by `source`:
#   - inline           : line-anchored review comments, grouped into threads
#   - review-summary   : PR-level review bodies (approve / request-changes)
#   - issue-comment    : conversation-tab comments
#
# NO CAPS: every source is fetched with `gh ... --paginate`, so PRs with any
# number of comments/threads are fully covered. Inline comment data comes from
# the REST comments endpoint (flat + trivially paginated + carries
# `original_commit_id`/`original_line`, which resolve outdated comments better
# than GraphQL). Threads are reconstructed by grouping on `in_reply_to_id`
# (verified to match GitHub's authoritative GraphQL threading). GraphQL is used
# only for per-thread resolution status (`isResolved`/`isOutdated`), also paginated.
#
# Inline comments are enriched from the LOCAL clone (no API, no LLM):
#   - code_window        : the file at the reviewer's commit, +/-50 lines (numbered)
#   - post_comment_delta : `git diff <comment-commit> <pr-head> -- <path>`
#                          (the hard evidence for "was it acted on?")
# Degrades gracefully (code_context:"partial", keeps the stored diff_hunk) when a
# commit is unresolvable, the path is missing/renamed, or the blob is binary/empty.
# Non-inline comments -> code_context:"none".

set -euo pipefail

REPO="${1:?usage: fetch-pr-threads.sh <owner/repo> <local-clone-path> <pr-number>}"
LOCAL="${2:?missing <local-clone-path>}"
PR="${3:?missing <pr-number>}"

OWNER="${REPO%%/*}"
NAME="${REPO##*/}"
WINDOW="${WINDOW:-50}"          # +/- lines around the commented line
MAX_DELTA_LINES="${MAX_DELTA_LINES:-400}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SLUG="${REPO//\//-}"
OUTDIR="$ROOT/review-mining/$SLUG"
THREADDIR="$OUTDIR/02-threads"
mkdir -p "$THREADDIR"

# --- Resolve which local remote points at this repo --------------------------
# Don't assume "origin": match the remote whose URL contains <owner/repo>.
REMOTE="$(git -C "$LOCAL" remote -v 2>/dev/null | awk -v repo="$REPO" 'index($2, repo){print $1; exit}')"
[[ -z "$REMOTE" ]] && REMOTE="origin"

# --- One-time: make all PR head commits resolvable in the local clone --------
# Even closed/unmerged PR commits become reachable via refs/remotes/pr/*.
MARKER="$OUTDIR/.pr-refs-fetched"
if [[ ! -f "$MARKER" ]]; then
  echo "Phase 2: fetching PR refs from '$REMOTE' into $LOCAL (one time) ..." >&2
  git -C "$LOCAL" fetch "$REMOTE" "+refs/pull/*/head:refs/remotes/pr/*" --quiet 2>/dev/null \
    && touch "$MARKER" \
    || echo "  WARN: could not fetch PR refs from '$REMOTE'; some commits may be unresolvable" >&2
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# --- Fetch raw sources (all paginated -> no caps) ----------------------------
gh api "repos/$REPO/pulls/$PR/comments"  --paginate > "$TMP/inline.json"
gh api "repos/$REPO/pulls/$PR/reviews"   --paginate > "$TMP/reviews.json"
gh api "repos/$REPO/issues/$PR/comments" --paginate > "$TMP/issuecomments.json"
gh api "repos/$REPO/pulls/$PR/commits"   --paginate > "$TMP/commits.json"

# Per-thread resolution status (GraphQL, paginated). Map: root databaseId -> {resolved,outdated}.
gh api graphql --paginate \
  -F owner="$OWNER" -F repo="$NAME" -F number="$PR" \
  -f query='
    query($owner:String!,$repo:String!,$number:Int!,$endCursor:String){
      repository(owner:$owner,name:$repo){
        pullRequest(number:$number){
          reviewThreads(first:100, after:$endCursor){
            pageInfo{ hasNextPage endCursor }
            nodes{ isResolved isOutdated comments(first:1){ nodes{ databaseId } } }
          }
        }
      }
    }' > "$TMP/resthreads.json"

jq -s '
  [.[].data.repository.pullRequest.reviewThreads.nodes[]]
  | map(select((.comments.nodes|length) > 0)
        | { key:(.comments.nodes[0].databaseId|tostring),
            value:{ resolved:.isResolved, outdated:.isOutdated } })
  | from_entries' "$TMP/resthreads.json" > "$TMP/resmap.json"

# PR head sha = last commit in the PR.
PR_HEAD="$(jq -r '.[-1].sha // ""' "$TMP/commits.json")"

# Commit summaries (sha, ISO date, first line of message) for the "acted on?" timeline.
jq -c '[.[] | {sha:.sha, date:.commit.author.date,
               msg:(.commit.message|split("\n")[0])}]' "$TMP/commits.json" > "$TMP/commit_list.json"

# --- Build base thread records (no code enrichment yet) ----------------------
# 1) inline threads: group REST comments by (in_reply_to_id // id); root = earliest.
jq -c --slurpfile rm "$TMP/resmap.json" --argjson pr "$PR" '
  ($rm[0] // {}) as $res
  | group_by(.in_reply_to_id // .id)
  | .[]
  | (sort_by(.created_at)) as $g
  | ($g[0]) as $root
  | {
      pr: $pr,
      thread_id: ("inline-" + ($root.id|tostring)),
      source: "inline",
      resolved: ($res[($root.id|tostring)].resolved),
      outdated: ($res[($root.id|tostring)].outdated),
      path: $root.path,
      line: ($root.original_line // $root.line),
      commit: ($root.original_commit_id // $root.commit_id),
      diff_hunk: $root.diff_hunk,
      url: $root.html_url,
      comments: [ $g[] | {author:(.user.login // "ghost"), body, createdAt:.created_at} ]
    }' "$TMP/inline.json" > "$TMP/base.jsonl"

# 2) review summaries (skip empty-body approvals -> pure noise)
jq -c --argjson pr "$PR" '
  .[] | select((.body // "") | gsub("\\s";"") | length > 0) | {
    pr: $pr,
    thread_id: ("review-" + (.id|tostring)),
    source: "review-summary",
    state: .state,
    url: .html_url,
    comments: [{author:(.user.login // "ghost"), body:.body, createdAt:.submitted_at}]
  }' "$TMP/reviews.json" >> "$TMP/base.jsonl"

# 3) issue-conversation comments
jq -c --argjson pr "$PR" '
  .[] | {
    pr: $pr,
    thread_id: ("issue-" + (.id|tostring)),
    source: "issue-comment",
    url: .html_url,
    comments: [{author:(.user.login // "ghost"), body:.body, createdAt:.created_at}]
  }' "$TMP/issuecomments.json" >> "$TMP/base.jsonl"

# --- Enrich inline records with local code context ---------------------------
enrich_one() {
  local rec="$1"
  local source path line commit first_date
  source="$(jq -r '.source' <<<"$rec")"

  if [[ "$source" != "inline" ]]; then
    jq -c '. + {code_context:"none"}' <<<"$rec"
    return
  fi

  path="$(jq -r '.path // ""' <<<"$rec")"
  line="$(jq -r '.line // 0' <<<"$rec")"
  commit="$(jq -r '.commit // ""' <<<"$rec")"
  first_date="$(jq -r '.comments[0].createdAt // ""' <<<"$rec")"

  # commits landed strictly after the comment (the change window)
  local commits_after
  commits_after="$(jq -c --arg d "$first_date" \
    '[.[] | select(.date > $d) | (.sha[0:8] + "  " + .msg)]' "$TMP/commit_list.json")"

  # Resolve the blob the reviewer saw -> temp file (avoids any pipe/SIGPIPE).
  : > "$TMP/blob"
  if [[ -n "$commit" && -n "$path" ]]; then
    git -C "$LOCAL" show "${commit}:${path}" > "$TMP/blob" 2>/dev/null || : > "$TMP/blob"
  fi

  # Missing / empty / binary blob -> partial (keep the stored diff_hunk for context).
  if [[ ! -s "$TMP/blob" ]] || ! grep -Iq . "$TMP/blob" 2>/dev/null; then
    jq -c --argjson ca "$commits_after" \
      '. + {code_context:"partial", code_window:null, post_comment_delta:null,
            pr_commits_after:$ca}' <<<"$rec"
    return
  fi

  # code window at comment-time (numbered, +/- WINDOW lines), read from the file (no pipe)
  local window
  window="$(awk -v L="$line" -v N="$WINDOW" 'NR>=L-N && NR<=L+N {printf "%6d  %s\n", NR, $0}' "$TMP/blob")"

  # post-comment delta for this file (capped). The trailing `|| true` is REQUIRED:
  # when the diff exceeds MAX_DELTA_LINES, `head` closes the pipe early and git
  # diff gets SIGPIPE (exit 141); under `set -e -o pipefail` that would otherwise
  # abort the whole run. The cap is intentional, so swallow the truncation signal.
  local delta=""
  if [[ -n "$PR_HEAD" ]] && git -C "$LOCAL" cat-file -e "${PR_HEAD}^{commit}" 2>/dev/null; then
    delta="$(git -C "$LOCAL" diff --find-renames "$commit" "$PR_HEAD" -- "$path" 2>/dev/null \
      | head -n "$MAX_DELTA_LINES" || true)"
  fi

  jq -c --arg w "$window" --arg d "$delta" --argjson ca "$commits_after" \
    '. + {code_context:"full", code_window:$w, post_comment_delta:$d, pr_commits_after:$ca}' <<<"$rec"
}

: > "$TMP/enriched.jsonl"
while IFS= read -r rec; do
  [[ -z "$rec" ]] && continue
  enrich_one "$rec" >> "$TMP/enriched.jsonl"
done < "$TMP/base.jsonl"

jq -s '.' "$TMP/enriched.jsonl" > "$THREADDIR/PR-$PR.json"

N_INLINE="$(jq '[.[]|select(.source=="inline")]|length' "$THREADDIR/PR-$PR.json")"
N_TOTAL="$(jq 'length' "$THREADDIR/PR-$PR.json")"
echo "PR #$PR: $N_TOTAL thread records ($N_INLINE inline) -> $THREADDIR/PR-$PR.json" >&2
