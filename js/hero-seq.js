/* Hero frame-sequence player.
   - Loads ONE sprite sheet (8x5 grid, 40 cells) instead of 40 separate files
     — 1 HTTP request / ~1.25MB instead of 40 requests / ~5.5MB.
   - On load, auto-plays 1 -> 40 (assemble), then fades the copy in.
   - The hero is tall + inner stage is sticky: scrolling scrubs frames 40 -> 1
     (dis-assemble) and back, with the copy fading out as it comes apart.
   Falls back to a single static frame under prefers-reduced-motion. */
(function () {
  var FRAMES = 40, COLS = 8, ROWS = 5;
  var SPRITE_SRC = 'assets/hero-seq-sprite.webp';
  var FOCUS_X = 0.62, FOCUS_Y = 0.5;   // keep the crystal (right side) framed
  var INTRO_MS = 2500;

  var hero = document.getElementById('hero');
  var canvas = document.getElementById('heroCanvas');
  var copy = document.getElementById('heroCopy');
  if (!hero || !canvas) return;

  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var sprite = new Image();
  var cellW = 0, cellH = 0, current = -1;

  function sizeCanvas() {
    // cells are 960px wide — cap the backing store near that so we never
    // upscale the source much past 1:1 (upscaling is what blurs the render)
    var dpr = Math.min(window.devicePixelRatio || 1, cellW / Math.max(1, canvas.clientWidth));
    dpr = Math.max(1, Math.min(dpr, 2));
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    draw(current < 0 ? 0 : current, true);
  }

  // cover-draw a sprite cell into the canvas, biased to the focus point
  function draw(idx, force) {
    idx = Math.max(0, Math.min(FRAMES - 1, idx | 0));
    if (idx === current && !force) return;
    if (!sprite.complete || !sprite.naturalWidth) return;
    current = idx;
    var col = idx % COLS, row = Math.floor(idx / COLS);
    var sx = col * cellW, sy = row * cellH;
    var cw = canvas.width, ch = canvas.height;
    var scale = Math.max(cw / cellW, ch / cellH);
    var dw = cellW * scale, dh = cellH * scale;
    var dx = (cw - dw) * FOCUS_X;
    var dy = (ch - dh) * FOCUS_Y;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(sprite, sx, sy, cellW, cellH, dx, dy, dw, dh);
  }

  function setCopy(o) { if (copy) copy.style.opacity = Math.max(0, Math.min(1, o)).toFixed(3); }

  // ---- scroll scrub: progress 0 (top, assembled) -> 1 (bottom, dispersed) ----
  var introDone = false, ticking = false;
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(applyScroll); }
  }
  function applyScroll() {
    ticking = false;
    if (!introDone) return;
    var vh = window.innerHeight;
    var scrollable = hero.offsetHeight - vh;
    var p = scrollable > 0 ? Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / scrollable)) : 0;
    draw(Math.round((1 - p) * (FRAMES - 1)));   // 40 -> 1 as you scroll down
    setCopy(1 - p / 0.5);                        // copy gone by half-way
  }

  // ---- intro auto-play ----
  function playIntro() {
    var start = null;
    function tick(t) {
      if (start === null) start = t;
      // if the user scrolls before the intro finishes, hand over to scroll
      if (window.scrollY > 8) { introDone = true; applyScroll(); return; }
      var k = Math.min(1, (t - start) / INTRO_MS);
      draw(Math.round(k * (FRAMES - 1)));
      if (k > 0.78) setCopy((k - 0.78) / 0.22);
      if (k < 1) { requestAnimationFrame(tick); }
      else { introDone = true; setCopy(1); }
    }
    requestAnimationFrame(tick);
  }

  // ---- load sprite, then start ----
  function boot() {
    cellW = sprite.naturalWidth / COLS;
    cellH = sprite.naturalHeight / ROWS;
    sizeCanvas();
    if (reduce) { draw(FRAMES - 1, true); setCopy(1); return; }
    draw(0, true);
    playIntro();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var booted = false;
  sprite.decoding = 'async';
  sprite.onload = function () { if (!booted) { booted = true; boot(); } };
  sprite.src = SPRITE_SRC;
  // safety: if the sprite stalls, boot anyway after a moment (draw() will
  // just no-op until it's actually ready)
  setTimeout(function () { if (!booted && sprite.naturalWidth) { booted = true; boot(); } }, 2500);

  window.addEventListener('resize', sizeCanvas);
})();
