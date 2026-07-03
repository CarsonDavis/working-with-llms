// Moves an accent indicator down the current chapter's h2 list in the rail
// as you scroll. transform-only positioning via CSS custom properties;
// IntersectionObserver, no scroll listeners. Progressive enhancement: the
// rail is a plain linked TOC without this script.
const subnavs = document.querySelectorAll('[data-scrollspy]');

subnavs.forEach((subnav) => {
  const links = [...subnav.querySelectorAll('a')];
  const targets = links
    .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
    .filter(Boolean);
  if (targets.length === 0) return;

  subnav.setAttribute('data-spy-ready', '');

  function activate(link) {
    links.forEach((a) => a.classList.toggle('active', a === link));
    const top = link.offsetTop;
    const height = link.offsetHeight;
    subnav.style.setProperty('--spy-top', `${top}px`);
    subnav.style.setProperty('--spy-height', `${height}px`);
  }

  activate(links[0]);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length === 0) return;
      const topMost = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      const index = targets.indexOf(topMost.target);
      if (index !== -1) activate(links[index]);
    },
    { rootMargin: '-15% 0px -70% 0px' },
  );

  targets.forEach((t) => observer.observe(t));
});
