// Intercepts clicks on glossary terms and opens a top-layer popover in
// place, anchored to the term (CSS anchor positioning where supported,
// centered-above fallback otherwise). Esc/click-out dismiss and focus
// return are native to popovertarget="auto". Click-triggered only — never
// hover. Without Popover API support the term is just a link to /glossary.
if (HTMLElement.prototype.showPopover) {
  const pop = document.createElement('div');
  pop.className = 'term-popover';
  pop.setAttribute('popover', 'auto');
  document.body.appendChild(pop);
  let activeTerm = null;

  document.addEventListener('click', (event) => {
    const term = event.target.closest('.term');
    if (!term) return;
    event.preventDefault();
    activeTerm = term;
    term.style.anchorName = '--active-term';
    pop.innerHTML = `<span class="term-popover-label">${term.textContent}</span>${term.dataset.def} <a href="${term.getAttribute('href')}">More in the glossary →</a>`;
    if (!CSS.supports('anchor-name: --x')) {
      const r = term.getBoundingClientRect();
      pop.style.cssText = `position:fixed;left:${r.left + r.width / 2}px;top:${r.top}px;transform:translate(-50%, calc(-100% - 8px));`;
    }
    pop.showPopover();
  });

  pop.addEventListener('toggle', (event) => {
    if (event.newState === 'closed' && activeTerm) {
      activeTerm.style.anchorName = '';
      activeTerm.focus();
      activeTerm = null;
    }
  });
}
