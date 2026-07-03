// remark plugin: turns remark-directive container directives
// (:::recommendation / :::gotcha / :::ownit) into styled <aside> callouts.
// Marker glyph and type label are rendered by CSS from data-callout-type,
// so no synthetic text nodes need to be injected into the tree.

const LABELS = {
  recommendation: 'Recommendation',
  gotcha: 'Gotcha',
  ownit: 'Own it',
};

function walk(node, visit) {
  visit(node);
  if (node.children) {
    for (const child of node.children) walk(child, visit);
  }
}

export function remarkCallouts() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type === 'containerDirective' && LABELS[node.name]) {
        const data = node.data || (node.data = {});
        data.hName = 'aside';
        data.hProperties = {
          className: ['callout', `callout-${node.name}`],
          'data-callout-type': LABELS[node.name],
        };
      }
    });
  };
}
