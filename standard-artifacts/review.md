# Review — Detailed Notes

> Working notes for the review harness (the §3 core document in [`overview.md`](overview.md)). §3 already covers what review is, why it's core, and that it grows from human findings over time — this file does not repeat that.

## More is better

A successful review needs more than fits usefully in one context window — org security conventions, the vision, the tutorial, the issue, the diff, the tests. Cram it all into one agent and every check gets worse.

## The agents

Not every agent applies to every repo — start with the ones a given project actually needs. There also might be some agents that I'm missing here that we can add.

**1. Project alignment.** Reads `vision.md` and the tutorial, then asks whether the change fits the project's direction and how the repo actually works — catching code that is technically fine but pulls against the vision or ignores an interaction the explained in the tutorial/overview documents.

**2. Org-convention compliance (security & architecture).** Enforces the wider-org conventions that hold across every project. It knows where those conventions are written and points to them. For example: deployments use OIDC, never long-lived keys; S3 buckets are never exposed to the open internet, etc. Ideally we have some conventions repos that we can both point to and draw clear guidelines from.

**3. Craftsmanship.** The ordinary good-reviewer pass: is it maintainable and well-architected? Did it add unrequested bloat, or is everything present for a clear reason? Is quality good — typed where it should be, no sloppy patterns?

**4. Test quality.** Checks that tests are *good*, not just present: it reads the original GitHub issue to learn what behavior was intended (what a real integration test would cover), then reads the tests actually written and judges whether they genuinely exercise that or quietly miss cases.

**5. Documentation freshness.** Confirms the change carried its docs with it — README, tutorial, `architecture.md`. This is the enforcement half of the tutorial's "keep it honest" loop, generalized to every doc a change can leave stale.

**6. Openended review.** Let the agent review on it's own to catch problems with the code not covered by dedicated agents.
