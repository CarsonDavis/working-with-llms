// remark plugin: turns the leaf directive ::diagram{name=context-stack} into
// an inline <figure><svg>…</svg><figcaption>…</figcaption></figure>, reading
// the committed, theme-token'd SVG straight off disk at build time. Inlining
// (rather than <img src>) is required so the SVG's currentColor/var(--…)
// fills actually inherit the page's live theme.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const diagramsDir = fileURLToPath(new URL('../assets/diagrams/', import.meta.url));

const ALT_TEXT = {
  'context-stack':
    'Diagram: vision.md, codebase docs, and the issue all feed into CLAUDE.md, which together feed the agent’s context window.',
  workflow:
    'Diagram: the agent reads the vision, then the repo docs, then the task; the harness writes a spec; an implementation agent builds to it; a review agent checks it; then it is your turn to smoke-test, read, understand, and iterate.',
  'review-pipeline':
    'Diagram: a diff fans out to six narrow review agents — alignment, security, craftsmanship, test quality, doc freshness, and open-ended — which converge on human review.',
};

function walk(node, visit) {
  visit(node);
  if (node.children) {
    for (const child of node.children) walk(child, visit);
  }
}

export function remarkDiagrams() {
  return (tree, file) => {
    walk(tree, (node) => {
      if (node.type !== 'leafDirective' || node.name !== 'diagram') return;

      const attrs = node.attributes || {};
      const name = attrs.name;
      const variant = attrs.variant;
      const svgPath = `${diagramsDir}${name}.svg`;

      if (!name || !existsSync(svgPath)) {
        throw new Error(
          `::diagram{name=${name}} in ${file.path || 'a guide page'} has no matching SVG at src/assets/diagrams/${name}.svg. ` +
            'Run "npm run diagrams" or check the name.',
        );
      }

      const svg = readFileSync(svgPath, 'utf-8').trim();
      const alt = ALT_TEXT[name] || `Diagram: ${name}.`;
      const figureClass = variant ? `diagram diagram-${variant}` : 'diagram';

      node.type = 'html';
      node.value = `<figure class="${figureClass}" data-diagram="${name}">${svg}<figcaption class="visually-hidden">${alt}</figcaption></figure>`;
      delete node.children;
      delete node.attributes;
      delete node.name;
    });
  };
}
