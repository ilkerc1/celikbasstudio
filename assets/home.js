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
  const layer = document.createElement('canvas'), paint = layer.getContext('2d');   // the spectrum is painted here first
  const zone = canvas.closest('.hero') || stage;             // steering works over the whole hero band
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const glassColor = getComputedStyle(canvas).color;        // --band-text, set in home.css
  const stacked = matchMedia('(max-width: 1000px)');          // the same breakpoint home.css uses
  // White light and its spectrum are the picture itself, not theme colours: red to violet.
  const spectrum = [[255, 92, 80], [255, 158, 66], [255, 226, 92], [108, 232, 138], [80, 214, 255], [104, 132, 255], [186, 128, 255]];
  const shade = f => {
    const x = clamp(f) * (spectrum.length - 1), i = Math.min(spectrum.length - 2, Math.floor(x));
    return spectrum[i].map((v, j) => Math.round(v + (spectrum[i + 1][j] - v) * (x - i)));
  };
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
    // the glow is soft, so its layer holds a quarter of the pixels: it costs a fraction to paint and looks the same
    layer.width = Math.round(w * dpr / 2); layer.height = Math.round(h * dpr / 2);
    paint.setTransform(dpr / 2, 0, 0, dpr / 2, 0, 0);
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

    // The light leaves the far face over a short stretch of glass and fans out as one continuous glow:
    // white-hot where it leaves the glass, coloured as it spreads, soft at the red and violet edges, with a
    // wider, fainter halo around it. It is painted on its own layer and added to the picture.
    const faceLength = Math.hypot(C.x - A.x, C.y - A.y);
    const face = { x: (C.x - A.x) / faceLength, y: (C.y - A.y) / faceLength };
    const exit = size * 0.05;
    const reach = narrow ? w * 0.9 : w * 0.62;
    const spread = 0.058 + Math.abs(tilt) * 0.05 + (still ? 0 : Math.sin(t * 0.0006) * 0.008);
    const width = spread * 7.2, first = -0.03 - tilt * 0.6 - spread * 0.6;
    const from = first - width * 0.3, across = width * 1.6;                 // the halo's wider sweep
    const back = exit / width, centre = first + width / 2;                  // the fan's tip sits just inside the glass
    const tip = { x: p2.x - Math.cos(centre) * back, y: p2.y - Math.sin(centre) * back };
    // colour and strength at an angle: f runs 0 (red) to 1 (violet) across the spectrum itself
    const light = f => {
      const side = clamp(Math.min(f, 1 - f) / 0.16), core = side * side * (3 - 2 * side);
      const halo = Math.sin(Math.PI * clamp((f + 0.3) / 1.6));
      const flicker = still ? 1 : 0.88 + 0.12 * Math.sin(t * 0.0013 + f * 6);
      return `rgba(${shade(f)},${(Math.min(1, 0.95 * core + 0.16 * halo) * flicker).toFixed(3)})`;
    };
    const sweep = (context, a, b, radius) => { context.beginPath(); context.moveTo(tip.x, tip.y); context.arc(tip.x, tip.y, radius, a, b); context.closePath(); };

    // only the part of the layer the fan can reach is painted and copied, in whole layer pixels
    const q = layer.width / w;
    const bx = Math.max(0, Math.floor((tip.x - 4) * q)), bw = layer.width - bx;
    const by = Math.max(0, Math.floor((Math.min(tip.y, tip.y + Math.sin(from) * reach) - 4) * q));
    const bh = Math.min(layer.height, Math.ceil((Math.max(tip.y, tip.y + Math.sin(from + across) * reach) + 4) * q)) - by;
    paint.globalCompositeOperation = 'source-over'; paint.globalAlpha = 1;
    paint.clearRect(0, 0, w, h);
    if (paint.createConicGradient) {
      const cone = paint.createConicGradient(from, tip.x, tip.y);
      for (let k = 0; k <= 48; k++) cone.addColorStop(k / 48 * across / (Math.PI * 2), light(k / 48 * 1.6 - 0.3));
      paint.fillStyle = cone; sweep(paint, from, from + across, reach); paint.fill();
    } else {
      // older browsers: the same fan as slices a few pixels wide (thinner ones leave hairlines between them)
      const slices = Math.max(12, Math.min(72, Math.round(across * reach / 6)));
      paint.globalCompositeOperation = 'lighter';
      for (let k = 0; k < slices; k++) {
        paint.fillStyle = light((k + 0.5) / slices * 1.6 - 0.3);
        sweep(paint, from + across * k / slices, from + across * (k + 1) / slices, reach); paint.fill();
      }
    }
    // it fades with distance
    const fade = paint.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, reach);
    fade.addColorStop(0, 'rgba(0,0,0,1)'); fade.addColorStop(0.07, 'rgba(0,0,0,.9)'); fade.addColorStop(0.5, 'rgba(0,0,0,.3)'); fade.addColorStop(1, 'rgba(0,0,0,0)');
    paint.globalCompositeOperation = 'destination-in'; paint.fillStyle = fade; paint.fillRect(bx / q, by / q, bw / q, bh / q);
    // white-hot at the glass
    const heat = paint.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, reach * 0.12);
    heat.addColorStop(0, 'rgba(255,255,255,.85)'); heat.addColorStop(1, 'rgba(255,255,255,0)');
    paint.globalCompositeOperation = 'lighter'; paint.fillStyle = heat; sweep(paint, first, first + width, reach * 0.12); paint.fill();
    // none of it shows inside the glass
    paint.globalCompositeOperation = 'destination-out'; paint.fillStyle = '#000';
    paint.beginPath(); paint.moveTo(A.x, A.y); paint.lineTo(B.x, B.y); paint.lineTo(C.x, C.y); paint.closePath(); paint.fill();
    ctx.globalAlpha = raysOn;
    if (bw > 0 && bh > 0) ctx.drawImage(layer, bx, by, bw, bh, bx / q, by / q, bw / q, bh / q);

    // inside the glass the white beam widens toward the far face
    const lip = k => [p2.x + face.x * k * exit, p2.y + face.y * k * exit], top = lip(-0.5), bottom = lip(0.5);
    const inside = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    inside.addColorStop(0, 'rgba(255,255,255,.75)'); inside.addColorStop(1, 'rgba(255,255,255,.4)');
    ctx.globalAlpha = raysOn; ctx.fillStyle = inside;
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(top[0], top[1]); ctx.lineTo(bottom[0], bottom[1]); ctx.closePath(); ctx.fill();

    // a bloom where the light enters and where it leaves
    for (const [spot, radius, on] of [[p1, size * 0.07, beamOn], [p2, size * 0.13, raysOn]]) {
      const bloom = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, radius);
      bloom.addColorStop(0, 'rgba(255,255,255,.5)'); bloom.addColorStop(0.35, 'rgba(255,255,255,.12)'); bloom.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = on; ctx.fillStyle = bloom;
      ctx.beginPath(); ctx.arc(spot.x, spot.y, radius, 0, Math.PI * 2); ctx.fill();
    }

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
