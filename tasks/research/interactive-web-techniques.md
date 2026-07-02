# Research: Modern Interactive Web Reading Experiences

Phase 1 deliverable for [the interactive site redesign task](../interactive-site-redesign.md).
Compiled July 2026 from three parallel research passes (techniques, libraries/tooling,
exemplary sites), with the orchestrator's synthesis at the end.

**Scope reminder.** The subject is a short guide: 8 pages, ~450 lines of prose-heavy,
opinionated, second-person technical writing. No custom artwork will be produced, so every
visual must be derivable from text (typography, layout, color, scroll, markup-generated
diagrams). Every technique below is judged against *that* profile, not against data
journalism or marketing sites.

**One mental model recurs across all three research passes: respect the reader's
momentum.** Long-form technical prose is read in a forward flow. Good techniques let the
reader dip sideways (a definition, an aside, a diagram) and return without losing their
place. Bad techniques hijack the scroll, hide primary content behind clicks, or animate
for their own sake.

---

## Part 1 — Techniques

### Scrollytelling and scroll-triggered reveals

Content that advances or transforms as the reader scrolls: text "steps" pinned against a
changing visual, elements fading in as they enter the viewport. The canonical form is the
NYT/Pudding data-story where a graphic stays fixed while captions scroll past it.

Scrollytelling genuinely helps when there is *one persistent visual that evolves through
stages* — a map that zooms, a diagram that gains layers. Scroll becomes a pacing device
that breaks complexity into one-idea-at-a-time beats. It is decoration (often actively
harmful) when applied to plain prose: reveal-on-scroll fade-ins delay reading, break
find-in-page, defeat skimming, hurt accessibility, and punish the fast reader who scrolls
ahead. Industry guidance converges on "one key insight per scroll step" — which presumes
you have a visual worth pinning.

**Verdict for this guide: mostly avoid.** The one defensible use is a single showcase
moment — e.g. a workflow diagram that gains stages as the prose walks through it — never
as the default layout, and never gating prose behind scroll position.

- Flourish, "What great scrollytelling looks like": https://flourish.studio/blog/scrollytelling-examples/
- Shorthand, scrollytelling craft: https://shorthand.com/the-craft/scrollytelling-examples/index.html
- Canonical good use (interactive explanation, not prose): https://ciechanow.ski/gears/

### CSS scroll-driven animations (`scroll-timeline` / `view-timeline`)

Native CSS (2023+) that drives animations from scroll position instead of time.
`scroll()` tracks scroll-container progress (perfect for a zero-JS reading-progress bar);
`view()` tracks an element entering/exiting the viewport (reveal-on-scroll without
IntersectionObserver). Runs on the compositor thread — no jank, **0 KB of JS**.

Support (2026): full in Chromium and Safari 26; **Firefox still behind a flag** — so gate
with `@supports (animation-timeline: view())` and treat as progressive enhancement.
Always pair with `prefers-reduced-motion`.

**Verdict: selectively yes** — the modern, idiomatic way to get the *effect* of scroll
reveals without a library. Progress bar and whisper-quiet section reveals only.

- MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- Josh W. Comeau's practical writeup: https://www.joshwcomeau.com/animation/scroll-driven-animations/
- Chrome guide: https://developer.chrome.com/docs/css-ui/scroll-driven-animations

### Progressive disclosure (expandable asides, layered depth)

Show the essential layer by default; let readers expand secondary material on request.
The idiomatic primitive is native `<details>`/`<summary>`: one element, keyboard-
accessible, works without JS, now animatable (`::details-content`, `interpolate-size`).

This is arguably the *single best structural fit* for an opinionated guide: a clean,
confident main line with "if you want the nuance, open this" affordances. NN/g's research
shows deferring advanced material speeds initial comprehension while preserving
discoverability. It becomes harmful when *primary* content hides behind a click, or when
the page becomes a field of collapsed accordions. Rule of thumb: **collapse the optional,
never the essential.**

**Verdict: strongly yes.** Use for long code examples, "why not X" tangents, deeper
caveats, optional background. The default-visible prose must be complete on its own.

- MDN `<details>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
- Jeremy Keith, "Accessible progressive disclosure revisited": https://adactio.com/journal/10475
- NN/g, Progressive Disclosure: https://www.nngroup.com/videos/progressive-disclosure/

### Sticky / pinned elements

`position: sticky` — pure CSS, no JS. Helps most as **persistent orientation**: a sticky
chapter TOC / "you are here" rail on wide viewports. Pinning a *diagram* beside evolving
prose is the legitimate lightweight cousin of scrollytelling — useful only if there's a
reference visual the prose walks through. Gotchas: sticky is bounded by its parent
(ancestor `overflow` silently breaks it); keep pinned regions small; collapse to a slim
bar on mobile.

**Verdict: yes** for a sticky TOC/progress rail on desktop; pinned diagram only where a
text-derived workflow diagram earns it.

- CSS-Tricks, sticky TOC with active states: https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/

### Reading-progress indicators and TOC / scrollspy

Progress bars give real "remaining effort" feedback on long scrolls; scrollspy TOCs give
orientation and jumping in technical docs. Failure modes: progress bars on short content
are noise; scrollspy with too-short sections flickers. Because this guide is paginated,
the higher-value pattern is a **stable cross-page TOC with the current page marked**,
plus in-page scrollspy for headings. Progress bar is trivial now via CSS
`scroll-timeline`; scrollspy is best done with IntersectionObserver.

**Verdict: TOC yes, progress bar optional** (subtle, 2–3px, accent color, only if pages
run long).

- Maxime Heckel, "Scrollspy demystified": https://blog.maximeheckel.com/posts/scrollspy-demystified/
- UX Collective on scroll progress bars: https://uxdesign.cc/pros-and-cons-of-progress-indicator-as-a-scroll-bar-345f19967cb6

### Margin notes / sidenotes (Tufte-style)

Supplementary content — caveats, definitions, wry asides — set in the margin adjacent to
the referencing text instead of at the page bottom. **A near-perfect match for an
opinionated technical guide**: the main argument stays clean while the "well, actually"
nuance sits one glance away, readable without leaving the flow. Gwern's and Bringhurst's
core point: the value exists only if notes display *by default* on wide screens — require
a click and you've built worse footnotes.

Implementation is a responsive problem more than a code problem: pure CSS on wide
viewports (Tufte CSS uses a checkbox-hack toggle, no JS); on narrow screens notes must
collapse to inline tap-to-expand or footnotes. For sparse notes in a short guide, static
CSS is plenty. The robust authoring path: write standard markdown footnotes and transform
them to sidenotes at build time.

**Verdict: strongly yes — possibly the highest-leverage signature move.** Keep them
sparse and voice-consistent.

- Tufte CSS: https://edwardtufte.github.io/tufte-css/
- Gwern, "Sidenotes In Web Design" (definitive survey): https://gwern.net/sidenote

### Hover/expand callouts, glossary popovers, cross-link previews

For a guide full of jargon (harness, subagents, context, worktrees), **glossary popovers
are a strong aid**: define a term on hover/tap without shipping the reader to a glossary
and back. Wikipedia's page previews demonstrate how heavily readers use the pattern.
Cross-link previews between the guide's own pages are a nice touch for an 8-page work.
Callout boxes (Note/Warning/Tip) are a comprehension win used sparingly for things that
break the linear flow. Hazards: hover-only interactions are invisible on touch and can be
a11y traps; popover content must be supplementary, never load-bearing.

**Verdict: yes for callouts + glossary popovers** (Popover API + anchor positioning does
this natively now); optional for internal page previews.

- Wikimedia, "How we designed page previews": https://diff.wikimedia.org/2018/04/18/how-we-designed-page-previews-for-wikipedia/
- Balsamiq, tooltip vs. popover guidelines: https://balsamiq.com/learn/tooltips-popovers/

### Animated transitions & tasteful motion (View Transitions API)

A **subtle cross-fade between the guide's pages** aids continuity — it signals "same
document, next chapter" rather than a jarring reload. That's a legitimate orientation
benefit *if* it stays a plain fade. Basic same-origin page fade is one CSS at-rule
(`@view-transition { navigation: auto; }`) and degrades to a normal navigation in
unsupported browsers. Cross-document support (the relevant case): Chromium 126+ and
Safari 18.2+; **Firefox not yet** (expected 2026) — graceful no-op. Always pair with
`@media (prefers-reduced-motion: reduce)`.

**Verdict: yes, a restrained page cross-fade. Nothing more elaborate.**

- Matthias Ott, "View Transitions: The Smooth Parts": https://matthiasott.com/notes/view-transitions-the-smooth-parts
- Smashing Magazine deep-dive: https://www.smashingmagazine.com/2023/12/view-transitions-api-ui-animations-part1/

### Typography for long-form reading

Where the largest, most reliable comprehension gains live for a text-only guide — and
invisible when done right. Consensus specifics worth encoding:

- **Measure:** 45–85 characters, ~66 the sweet spot. Enforce with `max-width: 65ch` on
  the reading column. The highest-ROI single rule.
- **Body size:** ~18–20px for comfortable long reading (16px is a floor, not a target).
- **Leading:** ~1.5 baseline; 1.6–1.7 for longer measures.
- **Pairing:** one text face + one accent face. A restrained serif body reads
  editorial/trustworthy; a humanist sans reads modern/direct. Either suits a plainspoken
  technical voice. Pick a strong **monospace** deliberately — code is a first-class
  citizen here.
- **Variable fonts** consolidate weights into one file; self-host as woff2 (a
  self-contained site must not hotlink Google Fonts).

**Verdict: top priority. Typography *is* the redesign's foundation; everything
interactive is an accent on top of it.**

- Butterick, "Line length": https://practicaltypography.com/line-length.html
- Google Fonts Knowledge, measure: https://fonts.google.com/knowledge/using_type/understanding_measure_line_length

### Color systems & dark/light theming

- **Never pure black or pure white for reading.** Near-black surfaces
  (`#0A0A0A`–`#161616`), off-white text; pure `#000`/`#FFF` punishes the eyes after ~20
  minutes. Slightly tinted dark modes read as more comfortable than neutral black.
- **Semantic tokens** (surface/text/border/accent, luminance stepping ~5–8% per layer) so
  both themes stay consistent; the CSS `light-dark()` function simplifies definitions.
- **Accents need per-theme variants** — a blue that pops on white washes out on dark.
- **One accent color** (links, active TOC item, progress bar, callout borders) plus a
  neutral ramp is plenty for a reading site. Color encodes meaning, not decoration.
- Honest caveat: many readers comprehend long-form text better on light backgrounds — so
  offer both, respect `prefers-color-scheme`, provide a toggle.

**Verdict: yes.** Tight neutral ramp + single accent, both themes, tinted-dark not pure
black.

- Smashing Magazine, "Inclusive Dark Mode" (2025): https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/

### Text-derivable visuals (the only visuals available here)

In order of fit for this guide:

- **Pull quotes.** Extract a punchy, load-bearing sentence and set it large. The guide
  *has* strong declarative lines; pull quotes give the eye rest, pace a long page, and
  reinforce the thesis. Pure CSS, zero weight. Rule: quote the guide's own text, at most
  ~one per page.
- **Numbered step visualizations.** Turn described procedures (the 6-step workflow, the
  "then it's your turn" checklist) into styled ordered sequences — numbered markers,
  connectors, generous spacing. Pure CSS (counters, grid). Strong fit for a how-to guide.
- **Tables as design elements.** The guide already thinks in comparison tables
  (failure→artifact, repo-size→docs-level). Style them as first-class design objects:
  clear header band, generous row padding, horizontal scroll in their own container on
  mobile.
- **Diagrams from markup** (Mermaid/D2). The workflow and review-pipeline prose have 1–3
  genuine flow diagrams latent in them. Render to styled inline SVG **at build time** —
  never ship the runtime (see Part 2). Risk: diagramming what one sentence already says.
- **ASCII / typographic-terminal motifs.** Monospace trees and box-arrows fit a coding
  guide's voice and are essentially free. Use as texture, not for complex flows.

### Deliberate rejections (all three research passes converge here)

- Narrative scrollytelling and reveal-on-scroll gating of prose — wrong tool for
  argument-driven text; fights the direct voice; hurts skimming, find-in-page, a11y.
- Scroll hijacking / momentum smoothing (Lenis et al.) — reading-comfort and a11y risk.
- Any motion not gated behind `prefers-reduced-motion`.
- Anything that hides primary content behind a click or hover.
- The prose must read perfectly with JS disabled and every disclosure closed.

---

## Part 2 — Libraries & Tooling

### Scroll & animation

The honest headline for a mostly-text guide: **you almost certainly do not need a JS
animation library.** CSS scroll-driven animations cover the 90% case with zero bytes.

| Option | Weight | Verdict |
|---|---|---|
| **CSS scroll-driven animations** | 0 KB | **Default.** Full support in Chromium + Safari 26; Firefox behind a flag → progressive enhancement via `@supports`. |
| **Motion** (motion.dev, ex-Framer Motion) | 2.3 KB (mini) – 17 KB | Best JS option if needed: vanilla APIs (`animate`, `scroll`, `inView`), MIT license. |
| **GSAP + ScrollTrigger** | ~75 KB | Fully free since May 2025 (Webflow acquisition) incl. all former Club plugins — but "free" ≠ open source (no-competing-product license). Overkill here. |
| **scrollama** | ~5 KB | Only for true stepped scrollytelling; hand-rollable in ~20 lines of IntersectionObserver anyway. |
| **Lenis** smooth scroll | ~3 KB | **Skip** — hijacks native scroll; a11y/reading-comfort risk on long-form text. |
| **AOS** | ~8 KB | Unmaintained; superseded by CSS `view()`. **Avoid.** |

Links: https://motion.dev/ · https://gsap.com/pricing/ · https://github.com/russellsamora/scrollama · https://lenis.dev/

### Static-site / framework options

| Option | Fit for an 8-page text guide |
|---|---|
| **Astro** | **Recommended.** Zero JS by default, markdown/MDX content collections, opt-in interactive islands, native View Transitions, remark/rehype pipeline (e.g. footnotes→sidenotes at build time). `npm create astro` → `astro dev` on its own port. (Cloudflare acquired Astro Jan 2026; stays MIT.) Skip Starlight — too docs-portal for an editorial design. |
| **Eleventy (11ty)** | Lightest "real" SSG, no client runtime, total markup control. You hand-assemble layout/typography — a feature for bespoke editorial design. `npx @11ty/eleventy --serve`. |
| **Plain Vite + vanilla** | Legitimately reasonable at 8 pages. Full control, trivial serve story; you reimplement the markdown pipeline and nav yourself. |
| **VitePress** | Fast and markdown-centric, but you'd fight its docs-site theme to get an editorial look. |
| **Single-file HTML** | Good as *output*, awkward as authoring format for 8 pages of shared layout. Fine for a one-page long-scroll design. |
| **Next.js** | **Out.** App framework; heavy runtime and complexity for a static reading site. |

Links: https://astro.build/ · https://docs.astro.build/en/guides/content-collections/ · https://www.11ty.dev/

### Typography tooling

- **Fonts** (all free/OFL, self-host as woff2): **Inter** (UI/sans body,
  https://rsms.me/inter/) · **Newsreader** (screen-tuned long-form serif with optical
  axis) · **Source Serif 4** (robust serif, pairs with code) · **JetBrains Mono**
  (code; https://www.jetbrains.com/lp/mono/) · **Recursive** (one variable file spanning
  Sans↔Mono, Linear↔Casual — a single distinctive family for prose *and* code;
  https://recursive.design/).
- Suggested editorial pairing: **Newsreader or Source Serif 4 body + Inter headings/UI +
  JetBrains Mono code.**
- **Utopia.fyi** — fluid type/space scales as `clamp()`-based custom properties; 0 KB
  runtime, kills breakpoint soup. https://utopia.fyi/type/calculator/
- **Tufte CSS** — adapt rather than adopt (it's a complete look, maintenance-mode). For
  agent-built sites, generate sidenotes from markdown footnotes via rehype:
  https://keith.is/post/tufte-sidenotes-in-astro

### Diagrams from markup

- **Render to SVG at build time regardless of tool** — readers get zero JS and themable
  output.
- **Mermaid**: ubiquitous, themeable, but the client runtime is ~480 KB — never ship it;
  pre-render. https://mermaid.js.org/
- **D2**: best-looking output, first-class themes + sketch mode, renders via CLI at build
  time by nature; needs the D2 binary in the toolchain. Most editorial-looking choice.
  https://d2lang.com/
- **Pikchr**: ultra-light precise SVG, manual placement; niche. https://pikchr.org/
- **Markmap**: markdown→mind-map widget; runtime cost, probably not needed.

### Modern-CSS UI primitives (kill JS where possible)

- **`<details>`/`<summary>`** — zero-JS disclosure; style via `::details-content`, now
  animatable.
- **Popover API + CSS anchor positioning** — Baseline 2026 (~91% traffic); declarative
  top-layer popovers with automatic flip via `@position-try`; replaces Floating UI/Tippy
  for glossary tooltips. Verify fallback on older Safari.
  https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using
- **View Transitions** — same-document is Baseline; cross-document (the MPA case) is
  Chromium + Safari 18.2+, Firefox pending; graceful no-op elsewhere. Astro wires it up.
- **`:has()`, container queries, logical properties** — broadly Baseline; remove most
  remaining reasons to reach for JS.
- **Reduced motion** — gate everything behind `prefers-reduced-motion`. Non-negotiable.

### Sane stacks (from the tooling research)

- **Stack A — "Zero-JS editorial" (recommended default):** Astro + hand-written CSS
  (Utopia scale, Tufte-style sidenotes via rehype footnotes) + CSS scroll-driven
  animations + D2/Mermaid pre-rendered to SVG + `<details>` and Popover API.
- **Stack B — "Absolute minimalist":** Eleventy or Vite+markdown-it + one CSS file
  (Utopia + self-hosted fonts) + CSS scroll animations + pre-rendered diagrams.
- **Stack C — "Designer-motion" (only for elaborate scrollytelling):** Astro + Motion
  (or GSAP) + scrollama for stepped narrative sections; rest as Stack A.

Cross-cutting: self-host fonts; pre-render all diagrams; every animation is progressive
enhancement gated on `@supports` + `prefers-reduced-motion`; the guide must read
perfectly with JS off and in Firefox.

---

## Part 3 — Exemplary Sites

*(URLs verified resolving as of July 2026 unless flagged.)*

### Interactive essays / explorable explanations

- **Bartosz Ciechanowski** — https://ciechanow.ski/gears/ — the gold standard of
  explorable explanations. The transferable pattern isn't the WebGL (off-limits): it's
  the **arrangement** — assertion, then an inline visual proof placed immediately after
  the claim that motivates it — plus a global "pause all animations" courtesy. Substitute
  markup-generated diagrams placed with the same rhythm.
- **Nicky Case, The Evolution of Trust** — https://ncase.me/trust/ — playable game-theory
  explainer. Transfers: the warm second-person voice and one-idea-per-screen pacing.
  Doesn't: the playable sims. A lightweight analog (a toggle, a step-through) captures a
  fraction of "do, don't just read" cheaply.
- **The Pudding** — https://pudding.cool/2018/02/waveforms/ — house style is sticky
  graphic + scrolling steps. Partial transfer: worth it once as a centerpiece if one
  artifact deserves staged reveal; full-bleed section breaks transfer cheaply as
  editorial rhythm.
- **Distill.pub** — https://distill.pub/2018/building-blocks/ — scholarly reading
  standard. Transfers excellently: **margin/sidenotes** and the **wide/narrow column
  rhythm** (figures break out to full width, prose narrows again). Pure CSS.
- **Stacking the Bricks (Amy Hoy)** — https://stackingthebricks.com/ — the closest voice
  match to this guide. The **bold "skim layer"** — bolded one-liners as inline subheads
  so a skimmer gets the thesis from the bold alone — is free and high-value.

### Developer blogs with exceptional reading design

- **Josh W. Comeau** — https://www.joshwcomeau.com/animation/keyframe-animations/ — the
  benchmark for "dev blog as designed product." Highest-ROI imitable moves: the **styled
  callout/aside component system** (info/warning/jargon boxes with distinct color+icon),
  anchor-linked TOC, dark-mode toggle, copy-to-clipboard code blocks, contextual
  jargon-definition asides. Live playgrounds: skip.
- **Emil Kowalski** — https://emilkowal.ski/ui/great-animations — the **principle →
  explanation → inline proof cadence** transfers as a structural template even when the
  "proof" is a diagram or annotated code rather than a slider.
- **Rauno Freiberg** — https://rauno.me/craft — restraint as a philosophy:
  **monochromatic palette + one selective accent, extreme whitespace, subtle hover
  states, emphasis by subtraction.** Transfers wholesale; exactly the register a serious
  technical guide wants.
- **Linear blog** — https://linear.app/blog — premium near-black theme, one cool accent,
  hairline dividers, tight confident type scale. Image-forward cards don't transfer;
  substitute typographic index cards (title + one-line dek + reading time).
- **Stripe blog/press** — https://stripe.com/blog — signature gradient accent, strict
  grid, impeccable vertical rhythm. Transfers as a landing-page identity move.

### Documentation & guide sites that feel editorial

- **Stripe Docs** — https://docs.stripe.com/payments/quickstart — sticky hierarchical
  left nav, callout blockquotes, short paragraphs with strong topic sentences, and an
  **opinionated recommending voice** ("Stripe recommends…"). The synced right-hand code
  panel is overkill at 8 pages.
- **Every Layout** — https://every-layout.dev/ — **meta-design: the site is built with
  the primitives it teaches.** The strongest transferable idea, and free: a guide about
  agent workflows can *be* built the way it recommends (and say so).
- **patterns.dev** — https://www.patterns.dev/ — scannable card index with one-line
  descriptions as the entry point; transfers well as a homepage/TOC treatment.
- **Diátaxis** — https://diataxis.fr/ — dual sidebars (global nav + scrollspy page TOC),
  and **one anchoring diagram carrying the whole mental model** — exactly what a
  markup-generated diagram can do for this guide's workflow.
- **Julia Evans / Wizard Zines** — https://wizardzines.com/comics/ — the boundary case:
  the charm is illustration-dependent. Borrow the **reassuring voice and "try this now"
  prompts**, not the form.
- **The Component Gallery** — https://component.gallery/ — cross-linking of related
  entries; transfers as "related pages" strips. (403 to fetchers; loads in a browser.)

### Text-first editorial design

- **Practical Typography (Butterick)** — https://practicaltypography.com/ — the book
  demonstrates its own advice. The **measure/micro-typography discipline** is the
  cheapest, highest-impact transfer in this entire document.
- **Tufte CSS** — https://edwardtufte.github.io/tufte-css/ — **the marquee reference
  given the constraints**: numbered sidenotes + unnumbered margin notes in a persistent
  margin, collapsing to tap-toggles on mobile, via pure CSS (checkbox hack, zero JS).
  Warm `#fffff8` paper, body-colored underlined links, small-caps `newthought` section
  openers, `fullwidth` breakout figures, deliberately shallow heading hierarchy.
- **gwern.net** — https://gwern.net/dnb-faq — the most complete reading-affordance
  toolkit on the web: **hover link-previews**, sidenotes, collapsible deep-dive sections,
  dropcaps, and an **expectation-setting metadata header** (status, confidence,
  "current as of…"). The full popup infrastructure is heavy — aspirational; the metadata
  header is cheap and fits a fast-moving subject like agents.
- **Works in Progress** — https://worksinprogress.co/ — the closest "designed magazine
  from mostly text" model: serif body at comfortable measure, drop caps, pull quotes,
  styled captions, section dividers, restrained warm palette. Everything transfers.
- **Maggie Appleton** — https://maggieappleton.com/garden/ — **growth-stage/epistemic
  badges** ("Seedling/Evergreen") and backlink clusters; the badge idea suits a guide
  whose subject changes monthly.
- **SBS, The Boat** — https://www.sbs.com.au/theboat/ — included as the boundary of what
  *not* to attempt without an art budget; only the full-bleed act-break idea ports (in
  pure type + color).
- **LessWrong / Substack reading UX** — hover footnotes, reading-time estimates, clean
  serif reader defaults; the reading-time estimate transfers cheaply.

### Patterns that keep showing up (ranked by ROI for this guide)

1. **Sidenotes / margin notes** (Tufte, Distill, gwern) — pure CSS, highest editorial payoff for prose.
2. **Sticky TOC with scrollspy** (Diátaxis, Comeau, Stripe docs) — orientation, nearly free.
3. **Assertion → inline visual proof right after the claim** (Ciechanowski, Kowalski, Every Layout) — via markup-generated diagrams.
4. **Styled callout/aside boxes** (Comeau, Stripe docs) — cheap designed rhythm.
5. **Bold "skim layer"** (Amy Hoy) — skimmer gets the thesis from the bold alone. Free.
6. **Disciplined measure + rhythm + warm off-white paper** (Butterick, Tufte, WiP) — the cheapest way to look serious.
7. **One accent + hairline dividers, emphasis by subtraction** (Rauno, Linear) — plus a dark-mode toggle.
8. **Print furniture: drop caps, pull quotes, full-bleed section dividers** (WiP, Distill).
9. **Opinionated second-person voice as a design element** (Stripe docs, Wizard Zines, Case, Hoy) — lean in, don't neutralize.
10. **Expectation-setting metadata badges** (Appleton, gwern, LessWrong) — "current as of…", reading time.
11. **Cross-linking / see-also between pages** (Component Gallery, patterns.dev).
12. **Hover link-previews** (gwern) and **one scrollytelling centerpiece** (Pudding) — the two highest-effort patterns; reserve for a single showcase moment each, if at all.

---

## Most promising directions for this guide

*Written by the orchestrator after reading all three reports.*

Where all three research passes agree: **typography is the redesign, everything else is
accent.** Measure, rhythm, a tight two-theme token palette, and a deliberate font pairing
deliver most of the perceived transformation at zero runtime cost. The signature
interactive moves that actually fit opinionated prose are sidenotes, progressive
disclosure, glossary popovers, a scrollspy TOC, and text-derived visuals (pull quotes,
step blocks, designed tables, 1–3 pre-rendered diagrams). Narrative scrollytelling is
rejected as a default and permitted only as a single centerpiece. Nearly everything can
ship as static HTML+CSS with progressive enhancement.

Within that consensus there are three genuinely distinct directions worth proposing.
They differ in *structure* and *personality*, not just skin:

### Direction A — "The Field Manual" (print-editorial)

The Tufte / Works in Progress / Butterick lineage. Warm paper background (tinted-dark
mode as the alternate), serif body (Newsreader or Source Serif 4) at a strict ~65ch
measure, **true margin sidenotes shown by default on wide screens** carrying the guide's
asides and caveats, drop caps or small-caps section openers, pull quotes, hairline
rules, designed comparison tables, footer-to-footer chapter flow ("Chapter 3 of 8").
Essentially **zero JS** — the interactivity is the margin, the disclosure elements, and
the reading flow itself. Keeps the current 8-page structure but re-typeset as chapters
of one book. Stack: Eleventy or Vite+vanilla with one carefully written CSS file.
*Personality: a beautifully typeset opinionated manual you'd trust.*

### Direction B — "The Modern Dev Guide" (premium product-docs)

The Comeau / Stripe / Linear / Rauno lineage. Near-black and light themes from one token
system, Inter + JetBrains Mono, one confident accent, a **sticky chapter rail with
scrollspy**, a **designed callout system** (recommendation / gotcha / "jargon defined"),
**glossary popovers** on the guide's recurring terms (Popover API), copy-ready code
blocks, cross-page **view-transition fades**, reading-time and "current as of" metadata
badges, and 2–3 build-time-rendered workflow diagrams placed assertion-then-proof style.
Structure stays multi-page but gains a patterns.dev-style card home page. Stack: Astro,
near-zero client JS. *Personality: the docs site of a product you'd pay for.*

### Direction C — "The Long Read" (one continuous essay)

The Ciechanowski-arrangement / Distill / Pudding-centerpiece lineage, minus the bespoke
graphics. The guide becomes **one continuous scrolling essay** with Start Here as the
spine — because Start Here already *is* the whole argument end to end. The seven child
pages fold in as expandable deep-dive layers at exactly the point where Start Here links
to them today (progressive disclosure as the site's structure, not a garnish). A chapter
progress rail marks position; the **one scrollytelling centerpiece** is the six-step
development workflow, pinned as a diagram that gains stages as the prose walks through
it; wide/narrow column rhythm à la Distill. Stack: Astro or vanilla + CSS scroll-driven
animations + ~20 lines of IntersectionObserver for the centerpiece. *Personality: an
interactive essay that makes "read Start Here in its entirety, do not skim it" literally
true — the deep material is inside the read, not behind a nav.*

**Orchestrator's recommendation:** A and C are the most distinct pair (opposite
structural bets: paginated book vs. single essay), with B the safe middle. If building
two, I'd pick **B and C** — B is the strongest all-around modernization and C is the
boldest genuine rethink — with A's sidenote-and-measure discipline folded into whichever
of them takes a serif/editorial skin. But all three are viable; that's a Gate 2 decision.
