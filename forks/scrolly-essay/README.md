# Scrolly Essay

A scrollytelling Eleventy fork of the *Working With LLMs* guide, modeled directly on the
[ajinkya.ai](https://ajinkya.ai) explainers (see `tasks/research/ajinkya-ai-case-study.md`
in the parent repo). Start Here becomes one continuous scroll-driven essay — full-viewport
scenes with a sticky stage, elements that fade/slide in as you scroll, a pinned diagram
for the context-stack section, and step pipelines for the workflow and responsibilities.
The six child chapters remain flowing deep-dive pages in the same dark editorial theme.

Self-contained — no dependency on the main MkDocs site, no external network requests
(fonts are self-hosted `.woff2` from fontsource packages), no framework, no bundler.

## Run it

```
npm install
npm run dev
```

Then open `http://localhost:8090`.

`npm run build` produces a static site in `_site/`.

## Graceful degradation

The scroll engine (`src/js/engine.js`) only activates by adding an `anim` class to
`<html>`, and only when JS is available *and* `prefers-reduced-motion` is not set
(see the inline script in `src/_layouts/base.njk`). Without that class — JS disabled, or
reduced motion requested — every `[data-reveal]` element is fully visible, scenes have
natural auto height, and the page reads as a normal linear essay top to bottom. The
engine never hijacks scroll; it only reads scroll position via a passive listener.
