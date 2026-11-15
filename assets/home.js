// Home page only: a beam of white light enters a glass prism and leaves as a spectrum.
// The visitor steers it: moving the pointer (or touching) up and down the hero changes the angle the
// beam comes in at, and the spectrum swings and widens to match. Left alone, the beam sways by itself.
// Stops when the hero is off screen or the tab is hidden. Under reduced motion nothing moves by itself:
// the picture changes only while the visitor moves the pointer, and stays where they leave it.
(() => {
  const canvas = document.querySelector('.hero-canvas');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;
  const stage = canvas.parentElement;
  const zone = canvas.closest('.hero') || stage;             // steering works over the whole hero band
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const glassColor = getComputedStyle(canvas).color;        // --band-text, set in home.css
  const stacked = matchMedia('(max-width: 1000px)');          // the same breakpoint home.css uses
  // White light and its spectrum are the picture itself, not theme colours.
  const colors = ['255,107,94', '255,162,76', '255,217,90', '123,224,138', '95,216,255', '111,140,255', '181,140,255'];
  const REST = 0.17;      // the beam's resting angle, in radians above horizontal
  const SWING = 0.42;     // how far the pointer can tilt it either way
  let w = 0, h = 0, raf = 0, onScreen = true;
  let angle = REST;       // the angle being drawn, eased toward its target
  let steer = null;       // -1 (pointer at the top) to 1 (bottom) while the visitor is steering
  let holdUntil = 0;      // steering lasts until this time
  let textRight = 0;      // right edge of the hero text, so the beam can stay clear of it
  const start = performance.now();
  const clamp = v => Math.max(0, Math.min(1, v));

  function resize() {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = box.width; h = box.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    measure();
    if (still) draw(60000);
  }

  function measure() {
    const left = canvas.getBoundingClientRect().left;
    let right = 0;
    stage.querySelectorAll('h1 span, .hero-description, .hero-actions a').forEach(el => {
      const range = document.createRange(); range.selectNodeContents(el);
      for (const box of range.getClientRects()) right = Math.max(right, box.right);
    });
    textRight = right - left;
  }

  function target(t) {
    if (still) return steer === null ? REST : steer * SWING;
    if (steer !== null && performance.now() < holdUntil) return steer * SWING;
    return REST + Math.sin(t * 0.0007) * 0.13;
  }

  function draw(t) {
    if (!w || !h) return;
    const goal = target(t);
    angle = still ? goal : angle + (goal - angle) * 0.09;
    const tilt = angle - REST;

    const narrow = stacked.matches;
    const size = narrow ? Math.min(w * 0.44, 190) : Math.min(h * 0.58, w * 0.25);
    const cx = narrow ? w * 0.46 : w * 0.67;
    const cy = narrow ? h - size * 0.66 : h * 0.52;
    const half = size * 0.56, tall = size;
    const A = { x: cx, y: cy - tall / 2 }, B = { x: cx - half, y: cy + tall / 2 }, C = { x: cx + half, y: cy + tall / 2 };
    const u = 0.5 + tilt * 0.12;
    const p1 = { x: A.x + (B.x - A.x) * u, y: A.y + (B.y - A.y) * u };
    const p2 = { x: A.x + (C.x - A.x) * (u + 0.07), y: A.y + (C.y - A.y) * (u + 0.07) };
    const beamOn = still ? 1 : clamp((t - 250) / 1300);
    const raysOn = still ? 1 : clamp((t - 1300) / 1100);

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    // incoming white beam: it only becomes visible to the right of the hero text
    const x0 = -10, y0 = p1.y + (p1.x - x0) * Math.tan(angle);
    const ex = x0 + (p1.x - x0) * beamOn, ey = y0 + (p1.y - y0) * beamOn;
    const g = ctx.createLinearGradient(x0, y0, p1.x, p1.y);
    const fadeIn = narrow ? 0.02 : Math.min(0.9, Math.max(0.5, (textRight + 28 - x0) / (p1.x - x0)));
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(fadeIn, 'rgba(255,255,255,0)'); g.addColorStop(narrow ? 0.3 : Math.min(0.98, fadeIn + 0.2), 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.strokeStyle = g; ctx.lineCap = 'round';
    for (const [lw, a] of [[18, 0.06], [7, 0.16], [2.2, 1]]) { ctx.globalAlpha = a; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(ex, ey); ctx.stroke(); }
    ctx.globalAlpha = 0.45 * raysOn; ctx.lineWidth = 1.5; ctx.strokeStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();

    // the spectrum: a beam from below leaves almost level, a beam from above is thrown down and spreads wider
    const reach = narrow ? w * 0.9 : w * 0.62;
    const spread = 0.058 + Math.abs(tilt) * 0.05 + (still ? 0 : Math.sin(t * 0.0006) * 0.008);
    colors.forEach((c, i) => {
      const a = -0.03 - tilt * 0.6 + i * spread, d = spread * 0.62;
      const far = k => ({ x: p2.x + Math.cos(a + k) * reach, y: p2.y + Math.sin(a + k) * reach });
      const f1 = far(-d), f2 = far(d), mid = far(0);
      const fill = ctx.createLinearGradient(p2.x, p2.y, mid.x, mid.y);
      fill.addColorStop(0, `rgba(${c},.95)`); fill.addColorStop(0.5, `rgba(${c},.42)`); fill.addColorStop(1, `rgba(${c},0)`);
      ctx.globalAlpha = raysOn * (0.62 + (still ? 0 : 0.2 * Math.sin(t * 0.0013 + i * 0.9)));
      ctx.fillStyle = fill;
      ctx.beginPath(); ctx.moveTo(p2.x, p2.y); ctx.lineTo(f1.x, f1.y); ctx.lineTo(f2.x, f2.y); ctx.closePath(); ctx.fill();
    });

    // the glass
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.closePath();
    ctx.fillStyle = glassColor; ctx.globalAlpha = 0.1; ctx.fill();
    ctx.lineJoin = 'round'; ctx.lineWidth = 1.6; ctx.strokeStyle = glassColor; ctx.globalAlpha = 0.9; ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Steering. Touch scrolling is left alone: a touch steers for three seconds after its last movement,
  // a mouse steers until shortly after it leaves the hero.
  function steerTo(event) {
    const box = canvas.getBoundingClientRect();
    if (!box.height) return;
    steer = clamp((event.clientY - box.top) / box.height) * 2 - 1;
    holdUntil = performance.now() + (event.pointerType === 'mouse' ? 3600000 : 3000);
    if (still) draw(60000);
  }
  function release(event) { if (event.pointerType === 'mouse') holdUntil = performance.now() + 700; }
  zone.addEventListener('pointermove', steerTo);
  zone.addEventListener('pointerdown', steerTo);
  zone.addEventListener('pointerleave', release);

  // The text changes width when the fonts arrive and when the language is switched.
  const remeasure = () => { measure(); if (still) draw(60000); };
  new MutationObserver(remeasure).observe(stage, { childList: true, characterData: true, subtree: true });
  if (document.fonts) document.fonts.ready.then(remeasure);

  function frame(now) { draw(now - start); raf = requestAnimationFrame(frame); }
  function run() { cancelAnimationFrame(raf); if (!still && onScreen && !document.hidden) raf = requestAnimationFrame(frame); }

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries => { onScreen = entries[0].isIntersecting; run(); }).observe(canvas);
  document.addEventListener('visibilitychange', run);
  stacked.addEventListener('change', resize);
  resize(); run();
})();
