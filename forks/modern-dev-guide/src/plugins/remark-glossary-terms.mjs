// remark plugin: turns the explicit :term[label]{key=id} directive into
// <a class="term" href="/glossary#id" data-def="...">label</a>. The
// definition text is inlined as a data attribute at build time so the
// popover enhancer never needs a network round-trip.
//
// Only the first marked occurrence of a given term per page is rendered
// as a term link (matches the "first occurrence per page only" rule); any
// repeat is a build-time authoring mistake and is downgraded to plain text
// rather than failing the build.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const glossaryPath = fileURLToPath(new URL('../content/glossary.yaml', import.meta.url));
// glossary.yaml is authored as JSON (a valid YAML subset) so it can be
// parsed here with zero extra dependencies.
const glossaryData = JSON.parse(readFileSync(glossaryPath, 'utf-8'));
const glossaryById = new Map(glossaryData.map((item) => [item.id, item]));

function labelText(node) {
  return (node.children || [])
    .map((child) => (child.type === 'text' ? child.value : ''))
    .join('');
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function remarkGlossaryTerms() {
  return (tree, file) => {
    const seen = new Set();

    function walk(node, parent, index) {
      if (node.type === 'textDirective' && node.name === 'term') {
        const label = labelText(node);
        const key = (node.attributes && node.attributes.key) || slugify(label);
        const entry = glossaryById.get(key);

        if (!entry) {
          throw new Error(
            `:term[${label}] in ${file.path || 'a guide page'} references unknown glossary key "${key}". ` +
              'Add it to src/content/glossary.yaml or fix the key attribute.',
          );
        }

        if (seen.has(key)) {
          // Downgrade repeats to plain text instead of failing the build.
          parent.children[index] = { type: 'text', value: label };
          return;
        }
        seen.add(key);

        const data = node.data || (node.data = {});
        data.hName = 'a';
        data.hProperties = {
          className: ['term'],
          href: `/glossary#${key}`,
          'data-def': entry.definition,
        };
        return;
      }

      if (node.children) {
        // Copy the array since a repeat downgrade replaces an entry in place.
        const children = node.children.slice();
        children.forEach((child, i) => walk(child, node, i));
      }
    }

    walk(tree, null, -1);
  };
}
