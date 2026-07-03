/*
 * Scroll engine — copied and extended from forks/scrolly-essay/src/js/engine.js
 * (itself adapted from the ajinkya.ai case study, tasks/research/
 * ajinkya-ai-case-study.md §3). One rAF-throttled scroll listener computes a
 * 0..1 progress value per scene and maps it onto reveal opacity/transform,
 * plus a bespoke per-scene "pipeline" animation for step/layer activation.
 *
 * Added for the workshop fork: a presenter layer — keyboard nav between
 * scene anchors, an "N" notes toggle, and a "?" help overlay. That layer
 * runs whenever JS runs at all, independent of the "anim" gate below, so a
 * presenter on a reduced-motion machine still gets arrow-key navigation and
 * the notes toggle; only the scroll-progress-driven reveal/pipeline engine
 * is gated on prefers-reduced-motion.
 *
 * This engine only *reads* scroll position — it never hijacks scroll, never
 * calls scrollTo/preventDefault on the scroll event itself. Keyboard nav
 * uses native `scrollIntoView`, so it is still "the engine reads scroll
 * position" plus ordinary browser navigation, not scroll hijacking.
 *
 * Graceful degradation: the scroll-progress engine is a no-op unless <html>
 * already has the "anim" class, which base.njk's inline head script only
 * adds when JS is on AND prefers-reduced-motion is not set. Without that
 * class the page is a plain, fully-visible, auto-height document.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var scenes = Array.prototype.slice.call(document.querySelectorAll("[data-scene]"));

  /* ===================== Presenter layer (always active) ================
   * Keyboard nav, notes toggle, help overlay. Independent of the "anim"
   * gate — these are ordinary DOM/keyboard affordances, not scroll-progress
   * animation, so they work the same with or without prefers-reduced-motion.
   */
  (function presenterLayer() {
    var hint = document.querySelector("[data-hint]");
    var help = document.querySelector("[data-help]");
    var notesOn = false;

    // Land a little way *into* the target scene's own pinned scroll runway,
    // not exactly on its top boundary. The reveal engine computes each
    // scene's progress as p = -rect.top / (height - viewport), which is
    // exactly 0 right at the scene's top edge — so a naive scrollIntoView
    // lands every keyboard jump on a scene whose headline hasn't faded in
    // yet (opacity 0 under html.anim). A small (~18%) runway offset means
    // the destination scene's opening beat is already visible on arrival,
    // while later beats in that scene still reveal as the presenter
    // continues scrolling normally.
    function scrollToScene(sc) {
      if (!sc) return;
      var r = sc.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = r.height - vh;
      var runway = total > 0 ? total * 0.18 : 0;
      var targetTop = window.scrollY + r.top + runway;
      window.scrollTo({ top: targetTop, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }

    function currentSceneIndex() {
      // The last scene whose top has scrolled at or above 40% of the
      // viewport height — i.e. "the scene we're currently reading."
      var vh = window.innerHeight;
      var best = 0;
      for (var i = 0; i < scenes.length; i++) {
        var r = scenes[i].getBoundingClientRect();
        if (r.top <= vh * 0.4) best = i;
      }
      return best;
    }

    function goNext() {
      var i = currentSceneIndex();
      scrollToScene(scenes[Math.min(i + 1, scenes.length - 1)]);
    }

    function goPrev() {
      var i = currentSceneIndex();
      scrollToScene(scenes[Math.max(i - 1, 0)]);
    }

    function dismissHint() {
      if (hint) hint.classList.add("is-hidden");
    }

    function toggleHelp(force) {
      if (!help) return;
      var show = typeof force === "boolean" ? force : !help.classList.contains("is-open");
      help.classList.toggle("is-open", show);
      help.setAttribute("aria-hidden", show ? "false" : "true");
    }

    function toggleNotes() {
      notesOn = !notesOn;
      // NB: this toggles "notes-on", not "notes" — the aside elements
      // carrying speaker-note text are themselves class="notes", and a
      // same-named class on <html> would also match the plain `.notes`
      // selector via `document.documentElement.matches('.notes')`,
      // collapsing the whole page (display:none on <html> itself).
      document.documentElement.classList.toggle("notes-on", notesOn);
    }

    window.addEventListener("keydown", function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || (document.activeElement && document.activeElement.isContentEditable)) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
          e.preventDefault();
          dismissHint();
          goNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          dismissHint();
          goPrev();
          break;
        case "Home":
          e.preventDefault();
          dismissHint();
          scrollToScene(scenes[0]);
          break;
        case "End":
          e.preventDefault();
          dismissHint();
          scrollToScene(scenes[scenes.length - 1]);
          break;
        case "n":
        case "N":
          dismissHint();
          toggleNotes();
          break;
        case "?":
          dismissHint();
          toggleHelp();
          break;
        case "Escape":
          toggleHelp(false);
          break;
        default:
          break;
      }
    });

    if (help) {
      help.addEventListener("click", function () { toggleHelp(false); });
      var card = help.querySelector("[data-help-card]");
      if (card) card.addEventListener("click", function (e) { e.stopPropagation(); });
    }
  })();

  /* ===================== Scroll-driven scene engine ======================
   * No-op unless <html> has "anim". See file header.
   */
  if (!document.documentElement.classList.contains("anim")) return;

  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };

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

  // ---- Per-scene bespoke animation: step/layer pipeline ------------------
  // Drives [data-step] and/or [data-layer] elements: N items activated
  // sequentially across the scroll window [A, B] of the scene's own 0..1
  // progress. Used by: harness (4-step), context-stack (4 layers),
  // workflow (6-step), parallel (3 lanes).
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
      el.classList.toggle("is-done", i < active && active >= 0);
    });
  }

  var anims = { pipeline: pipeline };

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
      caption.textContent = "ACT " + active.dataset.act + "  ·  " + active.dataset.title;
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
