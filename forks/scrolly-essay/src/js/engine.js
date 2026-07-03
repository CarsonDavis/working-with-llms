/*
 * Scroll engine — adapted from the ajinkya.ai case study (tasks/research/
 * ajinkya-ai-case-study.md §3). One rAF-throttled scroll listener computes a
 * 0..1 progress value per scene and maps it onto reveal opacity/transform,
 * plus a couple of bespoke per-scene animations (pipeline step activation).
 *
 * This engine only *reads* scroll position — it never hijacks scroll, never
 * calls scrollTo/preventDefault. Native scrolling only.
 *
 * Graceful degradation: this whole file is a no-op unless <html> already
 * has the "anim" class, which base.njk's inline head script only adds when
 * JS is on AND prefers-reduced-motion is not set. Without that class the
 * page is a plain, fully-visible, auto-height document and this script does
 * nothing to it.
 */
(function () {
  "use strict";
  if (!document.documentElement.classList.contains("anim")) return;

  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };

  var scenes = Array.prototype.slice.call(document.querySelectorAll("[data-scene]"));

  // Generated scene numbering (not hand-maintained).
  scenes.forEach(function (sc, i) {
    sc.dataset.num = String(i + 1).padStart(2, "0");
  });

  var revMap = new Map(
    scenes.map(function (sc) {
      return [sc, Array.prototype.slice.call(sc.querySelectorAll("[data-reveal]"))];
    })
  );

  var bar = document.querySelector("[data-progressbar]");
  var caption = document.querySelector("[data-caption]");

  // ---- Per-scene bespoke animation: step pipeline ----------------------
  // Drives [data-step] (and, where present, matching [data-layer]) elements:
  // N items activated sequentially across the scroll window [A, B] of the
  // scene's own 0..1 progress. Used by the context-stack scene (N=4,
  // layers + steps in lockstep) and the workflow scene (N=6, steps only).
  function pipeline(p, sc) {
    var steps = Array.prototype.slice.call(sc.querySelectorAll("[data-step]"));
    var layers = Array.prototype.slice.call(sc.querySelectorAll("[data-layer]"));
    var N = steps.length || layers.length;
    if (!N) return;
    var A = parseFloat(sc.dataset.pipeA || "0.08");
    var B = parseFloat(sc.dataset.pipeB || "0.96");
    var raw = (p - A) / (((B - A) / N) || 1);
    var active = clamp(Math.floor(raw), 0, N - 1);
    if (p <= A) active = -1; // nothing active yet
    steps.forEach(function (el, i) {
      el.classList.toggle("is-active", i === active);
      el.classList.toggle("is-done", i < active && active >= 0);
      el.classList.toggle("is-pending", i > active);
    });
    layers.forEach(function (el, i) {
      el.classList.toggle("is-active", i === active);
    });
  }

  // ---- Per-scene bespoke animation: sticky-sidebar sync -----------------
  // The context-stack scene pins its diagram via plain CSS `position:
  // sticky` while its four subsections scroll past at their natural
  // (content-determined) height. Layer activation therefore isn't driven
  // by an even fraction-of-scene-progress split (the case study's
  // `pipeline`) — subsection lengths vary a lot (§2.2 is much longer than
  // §2.1) — it's driven by which step's own bounding box is nearest the
  // viewport's vertical center right now, exactly like the "active scene"
  // check above but scoped to the steps within this one scene.
  function stackSync(p, sc) {
    var steps = Array.prototype.slice.call(sc.querySelectorAll("[data-step]"));
    var layers = Array.prototype.slice.call(sc.querySelectorAll("[data-layer]"));
    if (!steps.length) return;
    var vh = window.innerHeight;
    var line = vh * 0.5;
    var activeIdx = -1;
    var bestDist = Infinity;
    steps.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      var mid = r.top + r.height / 2;
      var dist = Math.abs(mid - line);
      if (dist < bestDist) { bestDist = dist; activeIdx = i; }
    });
    // Before the first step has reached the activation line, or after the
    // last one has passed it, don't force a layer active.
    var firstRect = steps[0].getBoundingClientRect();
    var lastRect = steps[steps.length - 1].getBoundingClientRect();
    if (firstRect.top > line) activeIdx = -1;
    if (lastRect.bottom < line) activeIdx = steps.length - 1;

    steps.forEach(function (el, i) {
      el.classList.toggle("is-active", i === activeIdx);
      el.classList.toggle("is-done", i < activeIdx);
    });
    layers.forEach(function (el, i) {
      el.classList.toggle("is-active", i === activeIdx);
    });
  }

  var anims = { pipeline: pipeline, stack: stackSync };

  function tick() {
    var vh = window.innerHeight;
    var docH = (document.documentElement.scrollHeight - vh) || 1;
    if (bar) bar.style.transform = "scaleX(" + clamp(window.scrollY / docH, 0, 1) + ")";

    var active = null;

    for (var s = 0; s < scenes.length; s++) {
      var sc = scenes[s];
      var r = sc.getBoundingClientRect();
      var total = r.height - vh;
      var p = total > 0 ? clamp(-r.top / total, 0, 1) : (r.top < vh * 0.5 ? 1 : 0);
      if (r.top <= vh * 0.45 && r.bottom > vh * 0.55) active = sc;

      var revs = revMap.get(sc);
      for (var i = 0; i < revs.length; i++) {
        var el = revs[i];
        var f = parseFloat(el.getAttribute("data-from") || "0");
        var t = parseFloat(el.getAttribute("data-to") || String(f + 0.14));
        var l = ease(clamp((p - f) / ((t - f) || 1), 0, 1));
        var vis = l;
        var oF = el.getAttribute("data-out-from");
        if (oF !== null) {
          var oT = parseFloat(el.getAttribute("data-out-to") || "1");
          vis = l * (1 - ease(clamp((p - parseFloat(oF)) / ((oT - parseFloat(oF)) || 1), 0, 1)));
        }
        el.style.opacity = vis;
        var dir = el.getAttribute("data-dir") || "u";
        var d = 1 - l;
        var tx = 0, ty = 0;
        if (dir === "u") { ty = d * 22; }
        else if (dir === "d") { ty = -d * 22; }
        else if (dir === "l") { tx = d * 30; }
        else if (dir === "r") { tx = -d * 30; }
        el.style.transform = "translate(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px)";
      }

      var fn = anims[sc.getAttribute("data-anim")];
      if (fn) fn(p, sc);
    }

    if (active && caption) {
      caption.textContent = active.dataset.num + "   " + active.dataset.title;
    }
  }

  var raf = null;
  function requestTick() {
    if (!raf) raf = requestAnimationFrame(function () { raf = null; tick(); });
  }
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", tick, { passive: true });

  // ---- Layout-settling re-ticks -----------------------------------------
  // Web fonts shift heights after first paint; an early tick can latch
  // reveals at opacity 0 with no scroll to fix it. Re-run on load, on
  // fonts.ready, via a ResizeObserver on body, and on a short interval for
  // the first few seconds.
  window.addEventListener("load", tick);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(tick).catch(function () {});
  }
  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(tick);
    ro.observe(document.body);
  }
  var settleStart = Date.now();
  var settleInterval = setInterval(function () {
    tick();
    if (Date.now() - settleStart > 6000) clearInterval(settleInterval);
  }, 150);

  tick();
})();
