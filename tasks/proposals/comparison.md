# Proposals compared: Field Manual vs. Modern Dev Guide

Orchestrator's one-pager for Gate 2. Full proposals: [field-manual.md](field-manual.md)
and [modern-dev-guide.md](modern-dev-guide.md).

## The bet each fork makes

**Field Manual** bets that the guide gains the most authority by looking like a *book*:
warm paper, serif, chapters, a live margin, and almost nothing else. Its interactivity is
spatial (sidenotes beside the argument) rather than behavioral. It deliberately refuses
nav chrome — no sidebar, no scrollspy, no search, no diagrams — on the grounds that
40–60-line chapters don't need them. If it's wrong, it's wrong by austerity.

**Modern Dev Guide** bets the guide gains the most authority by looking like the *docs of
a product you'd pay for*: dark/light tokens, one accent, a sticky part-labeled chapter
rail, a designed callout system, glossary popovers, and three build-time D2 diagrams
placed assertion-then-proof. Its "the rail teaches Start Here's mental model" and the
**Own it** callout type (the guide's four-page refrain given a recognizable form) are the
two sharpest ideas in either proposal. If it's wrong, it's wrong by familiarity — it
risks feeling like every polished dev-tool site.

## Head to head

| | Field Manual | Modern Dev Guide |
|---|---|---|
| Register | Typeset book / field manual | Premium product docs |
| Type | Newsreader serif + Inter + JetBrains Mono | Inter + JetBrains Mono |
| Color | Warm paper `#FAF6EE`, brick accent; warm-tinted dark | Near-black `#0e0e11` / off-white tokens, electric-blue accent (OKLCH) |
| Structure | Cover + 7 chapters, book order, prev/next page-turns only | Card home + 7 chapters grouped in 4 parts from Start Here's own outline |
| Signature move | True margin sidenotes, visible by default; tool links as margin "tool-notes" | Callout system (Recommendation / Gotcha / **Own it**) + glossary popovers |
| Diagrams | None — typographic step blocks instead | 3 D2→SVG: context stack, workflow, review pipeline |
| Navigation | Contents page + chapter strip; no sidebar/scrollspy | Sticky scrollspy rail doubling as in-page TOC; reading-time + "current as of" badges |
| Stack | Eleventy, 2 npm deps, ~15 lines JS (theme toggle) | Astro, 1–2 npm deps + d2 binary (SVGs committed), ~50 lines JS in 3 inline scripts |
| Port | 8080 | 4321 |
| Shared | Same 8 sources, no merges, voice untouched, `<details>` for optional depth, view-transition fade, `light-dark()` tokens, self-hosted fonts, reads perfectly with JS off, rejects scrollytelling/progress bars/search |

The pair is well-differentiated: they disagree about typeface philosophy, navigation
philosophy, color temperature, diagrams-vs-typography, and margin-vs-callout — while
agreeing (correctly, per the research) on measure, tokens, progressive enhancement, and
the rejections. Side by side in a browser they will read as two genuinely different
answers, not two skins.

## Orchestrator's notes after review

- Both proposals quote real lines from the guide for their pull quotes/callouts — spot-
  checked against the source; accurate.
- Both copy content into the fork (drift risk if `guide/` changes during the experiment).
  Acceptable for the comparison; needs a real decision only if a fork is promoted.
- Field Manual's rejection of diagrams is defensible *and* useful: it makes the
  comparison a clean test of "does the guide need diagrams at all?"
- Modern Dev Guide's callout extraction *moves* sentences (with a one-clause stitch) —
  the riskiest prose surgery in either proposal. It promises a per-page diff of every
  change; the voice check at Phase 3 should read those diffs first.

## Open calls, with recommended defaults

Say "defaults fine" or override any of these:

1. **Field Manual serif:** Newsreader (warmer) vs Source Serif 4 (sturdier). → *Default: Newsreader.*
2. **Field Manual dark theme:** warm-tinted vs neutral dark. → *Default: warm-tinted (keeps the paper identity).*
3. **Modern Dev Guide accent:** electric blue vs a warmer signal color. → *Default: blue.*
4. **Callouts move vs duplicate sentences.** → *Default: move (duplication reads like a highlights reel).*
5. **Glossary marking: explicit in markdown vs auto-detected.** → *Default: explicit (matches the guide's deliberate-artifacts ethos).*
6. **D2 as a system binary** (SVGs committed, so serve/build never needs it). → *Default: accept.*
7. **Neither fork ships search** (MkDocs original doesn't either — its search is disabled). → *Default: accept.*
