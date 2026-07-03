# Modern Dev Guide (fork)

A static-site fork of the Working With LLMs guide, built as a designed, editorial Astro
site — sticky chapter rail, callouts, glossary popovers, and pre-rendered diagrams — with
the same content and voice as the source `guide/` directory.

## Run it

```
npm install
npm run dev
```

Then visit `http://localhost:4321`.

`npm run build` produces a static `dist/`; `npm run preview` serves that build. `npm run
diagrams` regenerates the committed SVGs under `src/assets/diagrams/` from `diagrams/*.d2`
— it's optional, since the generated SVGs are already committed and `npm install && npm
run dev` never needs the D2 toolchain to work.
