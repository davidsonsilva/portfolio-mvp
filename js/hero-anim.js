/* Hero parallax — subtle depth after the jigsaw finishes assembling.
   The assembly is pure CSS; this only nudges the puzzle with the mouse and
   bails out entirely when the user prefers reduced motion. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var hero = document.getElementById('hero');
  if (!hero) return;

  var puzzle = hero.querySelector('.puzzle');
  if (!puzzle) return;

  var tx = 0, ty = 0, cx = 0, cy = 0;
  var active = false;
  var raf = null;

  // enable parallax only after the assembly sequence has settled (~2.9s)
  setTimeout(function () { active = true; }, 2900);

  hero.addEventListener('mousemove', function (e) {
    if (!active) return;
    var r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1..1
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(step);
  });

  hero.addEventListener('mouseleave', function () {
    tx = 0; ty = 0;
    if (!raf) raf = requestAnimationFrame(step);
  });

  function step() {
    raf = null;
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    puzzle.style.transform = 'translate(' + (cx * 12) + 'px,' + (cy * 8) + 'px)';
    if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
      raf = requestAnimationFrame(step);
    }
  }
})();
