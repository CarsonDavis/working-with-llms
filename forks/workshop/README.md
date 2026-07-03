# Workshop

The *Working With LLMs* guide restaged as the visual aid for a live 30–60 minute
workshop. Same scrollytelling engine and dark editorial theme as
[`forks/scrolly-essay`](../scrolly-essay) (see
`tasks/research/ajinkya-ai-case-study.md` in the parent repo), scaled up to be read
from the back of a room, plus a presenter layer on top: keyboard navigation between
scenes, a speaker-notes toggle, and a help overlay.

Sixteen scenes across eight acts walk the whole guide — the hook, why good code isn't
enough, your three jobs, where context lives, the four artifacts (vision, codebase
docs, the issue, `CLAUDE.md`), the loop in motion, the review flywheel, and the close.
The screen shows headlines and quotable lines (at most ~40 words per beat); the
presenter speaks the prose, which lives in each scene's speaker notes.

Self-contained — no dependency on the main MkDocs site, no external network requests
(fonts are self-hosted `.woff2` from fontsource packages), no framework, no bundler.

## Run it

```
npm install
npm run dev
```

Then open `http://localhost:8095`.

`npm run build` produces a static site in `_site/`.

## Presenting

- **`→` / `↓` / `Space`** — advance to the next scene. **`←` / `↑`** — back to the
  previous one. **`Home` / `End`** — jump to the first or last scene.
- **`N`** — toggle speaker notes on screen (a muted panel under the on-screen copy,
  labeled `NOTES` with the current act's pacing hint).
- **`?`** — toggle a help overlay listing all the keys. Dismiss with `?`, `Esc`, or a
  click.

A bottom-right hint (`→ next · N notes · ? keys`) shows these on load and fades out
after the first keypress.

## Graceful degradation

The scroll engine (`src/js/engine.js`) only activates by adding an `anim` class to
`<html>`, and only when JS is available *and* `prefers-reduced-motion` is not set (see
the inline script in `src/_layouts/base.njk`). Without that class — JS disabled, or
reduced motion requested — every `[data-reveal]` element is fully visible, scenes have
natural auto height (no viewport-tall empty gaps), speaker notes render inline and
visible under every scene's on-screen copy, and the page reads as one linear handout
document top to bottom. The keyboard-nav and notes-toggle presenter layer still works
whenever JS is on, independent of that class, but has nothing to animate without it.
The engine never hijacks scroll; it only reads scroll position via a passive listener,
plus ordinary `scrollIntoView` calls for keyboard navigation.

See `COVERAGE.md` for the source-section → scene → on-screen/notes coverage map.
