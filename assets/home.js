// Home page only: a beam of white light enters a glass prism and leaves as a slowly breathing spectrum.
// Stops when the hero is off screen or the tab is hidden; draws one still frame under reduced motion.
(() => {
  const canvas = document.querySelector('.hero-canvas');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const glassColor = getComputedStyle(canvas).color;        // --band-text, set in home.css
  const stacked = matchMedia('(max-width: 1000px)');          // the same breakpoint home.css uses
  // White light and its spectrum are the picture itself, not theme colours.
  const colors = ['255,107,94', '255,162,76', '255,217,90', '123,224,138', '95,216,255', '111,140,255', '181,140,255'];
  let w = 0, h = 0, raf = 0, onScreen = true;
  const start = performance.now();
  const clamp = v => Math.max(0, Math.min(1, v));

  function resize() {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = box.width; h = box.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (still) draw(60000);
  }

  function draw(t) {
    const narrow = stacked.matches;
    const size = narrow ? Math.min(w * 0.44, 190) : Math.min(h * 0.58, w * 0.25);
    const cx = narrow ? w * 0.46 : w * 0.67;
    const cy = narrow ? h - size * 0.66 : h * 0.52;
    const half = size * 0.56, tall = size;
    const A = { x: cx, y: cy - tall / 2 }, B = { x: cx - half, y: cy + tall / 2 }, C = { x: cx + half, y: cy + tall / 2 };
    const sway = still ? 0 : Math.sin(t * 0.0004) * 0.03;
    const u = 0.5 + (still ? 0 : Math.sin(t * 0.0005) * 0.025);
    const p1 = { x: A.x + (B.x - A.x) * u, y: A.y + (B.y - A.y) * u };
    const p2 = { x: A.x + (C.x - A.x) * (u + 0.07), y: A.y + (C.y - A.y) * (u + 0.07) };
    const beamOn = still ? 1 : clamp((t - 250) / 1300);
    const raysOn = still ? 1 : clamp((t - 1300) / 1100);

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    // incoming white beam
    const x0 = -10, y0 = p1.y + (p1.x - x0) * Math.tan(0.17 + sway);
    const ex = x0 + (p1.x - x0) * beamOn, ey = y0 + (p1.y - y0) * beamOn;
    const g = ctx.createLinearGradient(x0, y0, p1.x, p1.y);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(narrow ? 0.02 : 0.62, 'rgba(255,255,255,0)'); g.addColorStop(narrow ? 0.3 : 0.84, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.strokeStyle = g; ctx.lineCap = 'round';
    for (const [lw, a] of [[18, 0.06], [7, 0.16], [2.2, 1]]) { ctx.globalAlpha = a; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(ex, ey); ctx.stroke(); }
    ctx.globalAlpha = 0.45 * raysOn; ctx.lineWidth = 1.5; ctx.strokeStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();

    // the spectrum fanning out of the far face
    const reach = narrow ? w * 0.9 : w * 0.62;
    const spread = 0.058 + (still ? 0 : Math.sin(t * 0.0006) * 0.01);
    colors.forEach((c, i) => {
      const a = -0.03 + sway * 0.6 + i * spread, d = spread * 0.62;
      const far = k => ({ x: p2.x + Math.cos(a + k) * reach, y: p2.y + Math.sin(a + k) * reach });
      const f1 = far(-d), f2 = far(d), mid = far(0);
      const fill = ctx.createLinearGradient(p2.x, p2.y, mid.x, mid.y);
      fill.addColorStop(0, `rgba(${c},.95)`); fill.addColorStop(0.5, `rgba(${c},.42)`); fill.addColorStop(1, `rgba(${c},0)`);
      ctx.globalAlpha = raysOn * (0.62 + (still ? 0 : 0.2 * Math.sin(t * 0.0013 + i * 0.9)));
      ctx.fillStyle = fill;
      ctx.beginPath(); ctx.moveTo(p2.x, p2.y); ctx.lineTo(f1.x, f1.y); ctx.lineTo(f2.x, f2.y); ctx.closePath(); ctx.fill();
    });

    // the glass
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.closePath();
    ctx.fillStyle = glassColor; ctx.globalAlpha = 0.1; ctx.fill();
    ctx.lineJoin = 'round'; ctx.lineWidth = 1.6; ctx.strokeStyle = glassColor; ctx.globalAlpha = 0.9; ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function frame(now) { draw(now - start); raf = requestAnimationFrame(frame); }
  function run() { cancelAnimationFrame(raf); if (!still && onScreen && !document.hidden) raf = requestAnimationFrame(frame); }

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries => { onScreen = entries[0].isIntersecting; run(); }).observe(canvas);
  document.addEventListener('visibilitychange', run);
  stacked.addEventListener('change', resize);
  resize(); run();
})();
