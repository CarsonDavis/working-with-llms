#!/usr/bin/env node
// Renders diagrams/*.d2 to committed, theme-following SVGs under
// src/assets/diagrams/. Tries the @terrastruct/d2 npm package (WASM) first.
//
// Fallback if this proves unusable: install the D2 CLI user-locally and
// render by hand (see the fork README):
//   curl -fsSL https://d2lang.com/install.sh | sh -s --
//   d2 --pad 24 diagrams/<name>.d2 /tmp/<name>.svg
// then re-run this script's postprocess() on the raw output, or hand-edit
// the fill/stroke colors to the token names below.
//
// Output is committed to the repo, so `npm install && npm run dev` never
// needs this script to have run.

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { D2 } from '@terrastruct/d2';

const root = fileURLToPath(new URL('..', import.meta.url));
const diagramsDir = path.join(root, 'diagrams');
const outDir = path.join(root, 'src/assets/diagrams');

// D2's default theme (theme 0) assigns each shape/connection a class from a
// small fixed neutral (N1..N7, darkest to lightest) and primary (B1..B6,
// AA/AB accents) palette, e.g. `class="fill-B6 stroke-B1"`. Rather than
// reverse-engineer every hex value, we map each *class name* straight to a
// design token and append an override stylesheet (scoped to this render's
// unique `.d2-XXXXXXXXXX` instance prefix, `!important` so it always wins
// over D2's own inline hex fills) — so the diagram is drawn in exactly two
// inks (text + a faint fill) that both follow the page's light/dark theme.
const FILL_MAP = {
  N1: 'var(--text-1)',
  N2: 'var(--text-2)',
  N3: 'var(--surface-2)',
  N4: 'var(--surface-2)',
  N5: 'var(--surface-2)',
  N6: 'var(--surface-2)',
  N7: 'transparent',
  B1: 'var(--text-1)',
  B2: 'var(--text-1)',
  B3: 'var(--surface-2)',
  B4: 'var(--surface-2)',
  B5: 'var(--surface-2)',
  B6: 'var(--surface-2)',
  AA2: 'var(--accent)',
  AA4: 'var(--surface-2)',
  AA5: 'var(--surface-2)',
  AB2: 'var(--accent)',
  AB4: 'var(--surface-2)',
  AB5: 'var(--surface-2)',
};

const STROKE_MAP = {
  N1: 'var(--text-1)',
  N2: 'var(--text-2)',
  N3: 'var(--border-1)',
  N4: 'var(--border-1)',
  N5: 'var(--border-1)',
  N6: 'var(--border-1)',
  N7: 'var(--border-1)',
  B1: 'var(--text-1)',
  B2: 'var(--text-1)',
  B3: 'var(--border-1)',
  B4: 'var(--border-1)',
  B5: 'var(--border-1)',
  B6: 'var(--border-1)',
  AA2: 'var(--accent)',
  AB2: 'var(--accent)',
};

function postprocess(svg) {
  let out = svg;

  // Strip fixed pixel dimensions but keep viewBox so the SVG scales with
  // its container.
  out = out.replace(/(<svg\b[^>]*?)\swidth="[^"]*"/g, '$1');
  out = out.replace(/(<svg\b[^>]*?)\sheight="[^"]*"/g, '$1');

  // Drop D2's embedded custom @font-face (base64 font data) — text follows
  // the site's own Inter/JetBrains Mono via the override stylesheet below.
  out = out.replace(/@font-face\s*\{[^}]*\}/g, '');

  // Find this render's unique instance prefix, e.g. "d2-3671284423".
  const prefixMatch = out.match(/class="(d2-[a-zA-Z0-9]+)\s+d2-svg"/);
  if (!prefixMatch) {
    throw new Error('Could not find the d2-* instance class prefix in rendered SVG.');
  }
  const prefix = prefixMatch[1];

  // Collect every semantic class actually used in this diagram.
  const usedClasses = new Set();
  for (const m of out.matchAll(/class="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/)) usedClasses.add(c);
  }

  let overrides = '';
  for (const cls of usedClasses) {
    const m = cls.match(/^(fill|stroke|background-color|color)-(.+)$/);
    if (!m) continue;
    const [, prop, suffix] = m;
    const table = prop === 'stroke' ? STROKE_MAP : FILL_MAP;
    const value = table[suffix];
    if (!value) continue;
    overrides += `.${prefix} .${cls}{${prop}:${value} !important;}\n`;
  }
  overrides += `.${prefix} .text-bold,.${prefix} text{font-family:var(--font-body) !important;}\n`;

  out = out.replace('</svg>', `<style>${overrides}</style></svg>`);

  return out;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(diagramsDir)).filter((f) => f.endsWith('.d2'));

  if (files.length === 0) {
    console.log('No .d2 sources found in diagrams/.');
    return;
  }

  const d2 = new D2();

  for (const file of files) {
    const name = path.basename(file, '.d2');
    const src = await readFile(path.join(diagramsDir, file), 'utf-8');

    console.log(`Rendering ${file}...`);
    const compiled = await d2.compile(src, { layout: 'dagre', pad: 24 });
    const svg = await d2.render(compiled.diagram, {
      ...compiled.renderOptions,
      noXMLTag: true,
    });

    const themed = postprocess(svg);
    const outPath = path.join(outDir, `${name}.svg`);
    await writeFile(outPath, themed, 'utf-8');
    console.log(`  -> src/assets/diagrams/${name}.svg (${themed.length} bytes)`);
  }

  console.log('Done. Review the diffs — SVGs are committed to the repo.');
}

main().catch((err) => {
  console.error('Diagram build failed:', err);
  console.error('\nFallback: install the D2 CLI user-locally and render by hand:');
  console.error('  curl -fsSL https://d2lang.com/install.sh | sh -s --');
  console.error('  d2 --pad 24 diagrams/<name>.d2 src/assets/diagrams/<name>.svg');
  process.exit(1);
});
