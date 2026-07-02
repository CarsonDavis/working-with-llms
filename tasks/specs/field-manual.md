# Implementation spec: Field Manual fork

Builds [the field-manual proposal](../proposals/field-manual.md) at `forks/field-manual/`.
The proposal is **required reading and authoritative on design intent**; this spec is
authoritative on implementation details and hard requirements. Where they conflict, this
spec wins.

## Hard requirements

- Touch **nothing** outside `forks/field-manual/`. Never edit `guide/`, `README.md`,
  `mkdocs.yml`, or anything else at repo root. Do not commit; the orchestrator commits.
- Prose is copied **verbatim** from the source files except the edits this spec and the
  proposal §2 explicitly allow. Log **every** prose deviation (even one-word seams) in
  `forks/field-manual/CHANGES.md` as: chapter → original text → new text → reason.
- No external network requests from the built site: fonts self-hosted, no CDN, no
  analytics. The site must read perfectly with JavaScript disabled.
- All interactive affordances keyboard-accessible; all motion gated behind
  `prefers-reduced-motion`; both themes meet WCAG AA for body text.

## Stack

- **Eleventy v3** (ESM config). npm deps: `@11ty/eleventy`, `markdown-it-footnote`, plus
  font packages: `@fontsource-variable/newsreader` (incl. italic file),
  `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`.
- Fonts: copy the latin variable woff2 files (and Newsreader's italic) out of
  `node_modules/@fontsource-variable/*/files/` into the build via Eleventy passthrough
  copy; `@font-face` with `font-display: swap`; preload the Newsreader body face. Do NOT
  hotlink Google Fonts.
- One hand-written `manual.css`. No CSS framework, no preprocessor.
- The site's **only** JavaScript: ≤15-line inline theme-toggle persistence script
  (reads `localStorage`, sets `data-theme` on `<html>` before first paint; site defaults
  to `prefers-color-scheme` without it).

## Content mapping

Source → `src/chapters/` (copy, then apply only the allowed edits):

| Source | Target | Frontmatter |
|---|---|---|
| `guide/START-HERE.md` | `01-start-here.md` | `title: Start Here`, `num: 1` |
| `guide/harness-and-model.md` | `02-harness-and-model.md` | `title: Harness & Model`, `num: 2` |
| `guide/writing-a-vision.md` | `03-the-vision-document.md` | `num: 3` |
| `guide/codebase-docs.md` | `04-codebase-documentation.md` | `num: 4` |
| `guide/writing-an-issue.md` | `05-writing-issues.md` | `num: 5` |
| `guide/workflow.md` | `06-the-workflow.md` | `num: 6` |
| `guide/review-loop.md` | `07-the-review-loop.md` | `num: 7` |
| `README.md` | `src/index.md` (cover + contents) | — |

Each chapter frontmatter also carries `dek:` — one line drawn from the chapter's own
opening (may lightly compress, log in CHANGES.md).

**Allowed edits (proposal §2, made concrete):**

1. **Cross-reference seams.** Every `→ **[more on X](file.md)**` arrow link and intra-set
   markdown link becomes either a print-style cross-reference in prose ("See Chapter 2,
   *Harness & Model*", hyperlinked) or a margin pointer. External links (GitHub repos
   etc.) stay ordinary links.
2. **Sidenotes.** The sentences listed in proposal §2 "Margin sidenotes" move from body
   to margin, authored as markdown footnotes (`[^n]`) transformed at build time. Include
   the flagged Ch. 4 candidate ("That's how you get a perfectly good CI/CD…") — decision:
   yes, take it to the margin. Tool links become margin **tool-notes**: ⚙ marker,
   monospace tool name, one-line description drawn from existing prose.
3. **Pull quotes.** Exactly the 8 lines in proposal §2, one per chapter + cover epigraph.
   The pulled line **stays in the prose** (a pull quote is a repetition by convention,
   not a move). Author as inline HTML: `<figure class="pull"><blockquote>…</blockquote></figure>`.
4. **Step blocks / checklist / roster table / designed tables / `<details>`** exactly per
   proposal §2 — same words, new markup. Inline HTML in the markdown is fine where
   markdown can't express it.
5. Chapter 1 gets no `<details>` and keeps every sentence in the flow (sidenotes/margin
   pointers allowed).

## Layout & sidenote mechanics

- Article grid on wide screens (≥1100px):
  `grid-template-columns: 1fr min(65ch, 100%) minmax(14rem, 18rem) 1fr` with a
  `column-gap` of ~3rem; body content in column 2, sidenotes/tool-notes in column 3,
  vertically aligned with their reference (each note is a `<span class="sidenote">`
  inside the paragraph, pulled into the margin — Tufte technique: the transform in
  `eleventy.config.js` rewrites `markdown-it-footnote` output into inline
  `<label>`/`<input class="sidenote-toggle">`/`<span class="sidenote">` markup).
- Below 1100px: single centered column; sidenotes collapse to numbered tap-to-expand via
  the **checkbox hack** (zero JS): the number is a `<label>`, the note reveals inline
  when checked.
- Sidenote typography: 0.85× body, line-height 1.45, secondary ink; tool-notes prefixed
  with ⚙ and the tool name in JetBrains Mono.

## Pages & chrome (proposal §3, made concrete)

- **Cover (`/`):** title, README dek paragraph, epigraph **"Do not skim it."** set large,
  then Contents (num, title, dek per chapter, each linking to the chapter), then the
  README "The tools" paragraph as a colophon note and a "Last revised: {date}" line
  (build date is fine; keep the format `Month YYYY`).
- **Chapter pages:** header strip in Inter letterspaced small caps —
  `WORKING WITH LLMS · CHAPTER 3 OF 7` — then `<h1>`, hairline rule. First phrase of the
  first paragraph in small caps (`newthought` treatment; apply via the chapter layout to
  the first paragraph, or a span added in the markdown — log it, it's markup not prose).
  Footer: hairline rule, prev/next as page-turns plus a Contents link.
- Headings within chapters keep their `id`s/anchors.
- `<title>` per page: `Ch. N — {Title} · Working With LLMs` (cover: `Working With LLMs`).

## Type & color

Implement proposal §5 exactly: Newsreader body/headings (opsz+wght, italic file),
Inter furniture, JetBrains Mono code; 65ch measure; body
`clamp(1.0625rem, 1rem + 0.35vw, 1.25rem)`, line-height 1.6; quiet heading scale;
tokens via `light-dark()` with `color-scheme` — paper palette `#FAF6EE` /
ink `#211D16` / accent `#9C4221`, warm-dark `#16130E` / `#E8E2D5` / accent `#D98E62`
(all values in proposal §5). Accent only for: chapter numerals, step markers, pull-quote
rules, margin-note markers, hover states. Links: ink-colored, hairline underline.
`@view-transition { navigation: auto; }` with a `prefers-reduced-motion` override to none.
Theme toggle in the header sets `data-theme` (which flips `color-scheme` via CSS).

## Build & serve

- `package.json` scripts: `dev` → `eleventy --serve --port=8080`;
  `build` → `eleventy`. Output `_site/`.
- `forks/field-manual/README.md`: what this fork is (2 sentences), `npm install`,
  `npm run dev`, URL `http://localhost:8080`.
- Add `forks/field-manual/.gitignore`: `node_modules/`, `_site/`.

## Verification (do all of this before reporting done)

1. `npm install && npm run build` — clean build.
2. `npm run dev`, then verify every page returns 200 and contains expected content
   (curl cover + all 7 chapters; grep for the pull-quote text, sidenote markup, step
   block, roster table).
3. Confirm zero external requests: grep built HTML/CSS for `http` — only expected
   external links in `<a href>`, nothing in `<link>`/`<script>`/`@font-face`/`src`.
4. Use the **page-capture** skill (if available in your tools) to screenshot: cover and
   Chapter 1 at 1440px (light and dark) and Chapter 1 at 390px — visually confirm
   sidenotes sit in the margin on desktop, collapse to numbered toggles on mobile, and
   the dark theme reads correctly. If page-capture is unavailable, verify the DOM via
   curl and say explicitly that visual checks were not performed.
5. Confirm the site reads with JS disabled (the only script is theme persistence).
6. Leave the dev server **stopped** when finished.

Report back: what was built, verification results (explicitly), any deviations from spec
with reasons, and anything you flagged in CHANGES.md.
