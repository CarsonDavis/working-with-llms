// remark plugin: wraps :::steps around an existing list (the three
// responsibilities, the "your turn" checklist, the superpowers loop) so CSS
// can give it the counters+connectors numbered-step treatment. Markup-only —
// the list items and their text are untouched.

function walk(node, visit) {
  visit(node);
  if (node.children) {
    for (const child of node.children) walk(child, visit);
  }
}

export function remarkSteps() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type === 'containerDirective' && node.name === 'steps') {
        const data = node.data || (node.data = {});
        data.hName = 'div';
        data.hProperties = { className: ['steps'] };
      }
    });
  };
}
