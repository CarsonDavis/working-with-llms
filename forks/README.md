# Redesign forks

Three experimental redesigns of the guide, each self-contained and viewable next to the
original. Same content, three different bets. Nothing here touches the live site.

## Run them side by side

Each site gets its own port — run any or all simultaneously, each from its own terminal.

**The original (MkDocs Material)** — port 8000:

```bash
pip install -r requirements.txt   # repo root, first time only
mkdocs serve                      # → http://localhost:8000
```

**Field Manual** — port 8080:

```bash
cd forks/field-manual
npm install                       # first time only
npm run dev                       # → http://localhost:8080
```

**Modern Dev Guide** — port 4321:

```bash
cd forks/modern-dev-guide
npm install                       # first time only
npm run dev                       # → http://localhost:4321
```

**Scrolly Essay** — port 8090:

```bash
cd forks/scrolly-essay
npm install                       # first time only
npm run dev                       # → http://localhost:8090
```

## What each fork does differently

**[field-manual](field-manual/)** — the guide as a beautifully typeset book. Warm paper,
Newsreader serif at a strict 65ch measure, cover + 7 chapters in Start Here's own order,
prev/next page-turns and nothing else — no sidebar, no search, no diagrams. Its
signature move: true margin sidenotes, visible by default on wide screens, carrying the
guide's asides and every tool pointer; one pull quote per chapter from the guide's own
lines. Warm-tinted dark mode. ~15 lines of JavaScript on the whole site (theme toggle).

**[modern-dev-guide](modern-dev-guide/)** — the guide as premium product docs
(Comeau/Stripe/Linear register). Astro, Inter + JetBrains Mono, near-black and light
themes from one token system, one electric-blue accent. Card home page; chapters grouped
under four part labels in a sticky scrollspy rail; a three-type callout system
(Recommendation / Gotcha / Own it); click-to-open glossary popovers on the guide's
jargon; three D2 diagrams (context stack, workflow, review pipeline) pre-rendered to
theme-aware SVG; reading-time and "current as of" badges.

**[scrolly-essay](scrolly-essay/)** — Start Here as a scrollytelling essay, modeled on
the ajinkya.ai explainers. Dark editorial theme, Space Grotesk + IBM Plex Mono, a
reading-progress bar and a running corner caption. The essay pins a context-stack
diagram while §2's subsections scroll past it, animates the six-step workflow as a
sequential pipeline, and reveals the improvement table row by row. The seven child
chapters become six flowing "deep dive" pages linked from the essay. Degrades to a
plain linear essay with JavaScript off or reduced motion.

## Notes

- Each fork carries its own copy of the prose; edits to `guide/` after July 2026 won't
  propagate. Every prose deviation from the source is logged in each fork's
  `CHANGES.md`.
- All three self-host their fonts and make zero external requests.
- `forks/modern-dev-guide/` commits its diagram SVGs; regenerating them
  (`npm run diagrams`) optionally needs the D2 toolchain, but serving never does.
