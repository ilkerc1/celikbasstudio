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
  // the glass takes its colour from --band-text, set in home.css
  const glass = (getComputedStyle(canvas).color.match(/[\d.]+/g) || []).slice(0, 3).join(',') || '255,255,255';
  const WHITE = '255,255,255';
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
    w = box.width; h = box.height;
    // sharp on dense screens, but never more than about four million pixels to paint each frame
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1, Math.sqrt(4e6 / Math.max(1, w * h))));
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // the glow is soft, so its layer holds one pixel per CSS pixel however dense the screen is, and fewer on huge ones
    const coarse = Math.min(1, Math.sqrt(9e5 / Math.max(1, w * h)));
    layer.width = Math.max(1, Math.round(w * coarse)); layer.height = Math.max(1, Math.round(h * coarse));
    paint.setTransform(layer.width / w, 0, 0, layer.height / h, 0, 0);
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
    const line = (...points) => { ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); };
    const shape = (...points) => { line(...points); ctx.closePath(); };
    const ramp = (from, to, colour, stops) => {
      const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
      stops.forEach(([at, alpha]) => gradient.addColorStop(at, `rgba(${colour},${alpha})`));
      return gradient;
    };
    const along = (p, q) => { const d = Math.hypot(q.x - p.x, q.y - p.y) || 1; return { x: (q.x - p.x) / d, y: (q.y - p.y) / d }; };
    const bounce = (d, n) => { const k = 2 * (d.x * n.x + d.y * n.y); return { x: d.x - k * n.x, y: d.y - k * n.y }; };

    // The glass, under the light: a cut block with a bevel all round, lit from the left.
    const middle = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 }, foot = { x: cx, y: C.y };
    const inset = v => ({ x: v.x + (middle.x - v.x) * 0.17, y: v.y + (middle.y - v.y) * 0.17 });
    const Ai = inset(A), Bi = inset(B), Ci = inset(C);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = ramp(A, foot, glass, [[0, 0.13], [1, 0.05]]); shape(A, B, C); ctx.fill();
    ctx.fillStyle = ramp(A, B, glass, [[0, 0.17], [1, 0.05]]); shape(A, B, Bi, Ai); ctx.fill();
    ctx.fillStyle = ramp(A, C, glass, [[0, 0.09], [1, 0.02]]); shape(A, C, Ci, Ai); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.14)'; shape(B, C, Ci, Bi); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';

    // incoming white beam: a bright core in a soft glow; it only becomes visible to the right of the hero text
    const source = { x: -10, y: p1.y + (p1.x + 10) * Math.tan(angle) };
    const head = { x: source.x + (p1.x - source.x) * beamOn, y: source.y + (p1.y - source.y) * beamOn };
    const fadeIn = narrow ? 0.02 : Math.min(0.9, Math.max(0.5, (textRight + 28 - source.x) / (p1.x - source.x)));
    ctx.strokeStyle = ramp(source, p1, WHITE, [[0, 0], [fadeIn, 0], [narrow ? 0.3 : Math.min(0.98, fadeIn + 0.2), 0.9], [1, 1]]);
    ctx.lineCap = 'round';
    for (const [wide, strength] of [[24, 0.035], [12, 0.07], [5.5, 0.2], [2, 1]]) {
      ctx.globalAlpha = strength; ctx.lineWidth = wide; line(source, head); ctx.stroke();
    }
    // a little of it glances off the near face
    const left = along(A, B), leftOut = { x: -left.y, y: left.x };
    const glance = bounce(along(source, p1), leftOut);
    const away = { x: p1.x + glance.x * size * 0.45, y: p1.y + glance.y * size * 0.45 };
    ctx.strokeStyle = ramp(p1, away, WHITE, [[0, 0.2], [1, 0]]);
    for (const [wide, strength] of [[6, 0.12], [1.3, 1]]) { ctx.globalAlpha = strength * raysOn; ctx.lineWidth = wide; line(p1, away); ctx.stroke(); }

    // The light leaves the far face over a short stretch of glass and fans out as one continuous glow:
    // white-hot where it leaves the glass, coloured as it spreads, soft at the red and violet edges, with a
    // wider, fainter halo around it. It is painted on its own layer and added to the picture.
    const faceLength = Math.hypot(C.x - A.x, C.y - A.y);
    const face = { x: (C.x - A.x) / faceLength, y: (C.y - A.y) / faceLength };
    const exit = size * 0.05;
    const reach = narrow ? w * 0.95 : w * 0.72;
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
      return `rgba(${shade((f - 0.1) / 0.8)},${(Math.min(1, 0.95 * core + 0.16 * halo) * flicker).toFixed(3)})`;
    };
    const wall = Math.atan2(face.y, face.x) - 0.05;                         // light cannot leave along or behind the face
    const sweep = (context, a, b, radius) => { context.beginPath(); context.moveTo(tip.x, tip.y); context.arc(tip.x, tip.y, radius, a, b); context.closePath(); };

    // only the box the fan can reach is masked and copied; the box is whole layer pixels
    const qx = layer.width / w, qy = layer.height / h;
    const bx = Math.max(0, Math.floor((tip.x - 4) * qx)), bw = layer.width - bx;
    const by = Math.max(0, Math.floor((Math.min(tip.y, tip.y + Math.sin(from) * reach) - 4) * qy));
    const bh = Math.min(layer.height, Math.ceil((Math.max(tip.y, tip.y + Math.sin(from + across) * reach) + 4) * qy)) - by;
    const box = [bx / qx, by / qy, bw / qx, bh / qy];
    paint.globalCompositeOperation = 'source-over'; paint.globalAlpha = 1;
    paint.clearRect(0, 0, w, h);
    if (paint.createConicGradient) {
      const cone = paint.createConicGradient(from, tip.x, tip.y);
      for (let k = 0; k <= 48; k++) cone.addColorStop(k / 48 * across / (Math.PI * 2), light(k / 48 * 1.6 - 0.3));
      paint.fillStyle = cone; sweep(paint, from, Math.min(from + across, wall), reach); paint.fill();
    } else {
      // older browsers: the same fan as slices a few pixels wide at the far end (thinner ones leave hairlines)
      const slices = Math.max(12, Math.min(240, Math.round(across * reach / 6)));
      paint.globalCompositeOperation = 'lighter';
      for (let k = 0; k < slices; k++) {
        const a = from + across * k / slices;
        if (a >= wall) break;
        paint.fillStyle = light((k + 0.5) / slices * 1.6 - 0.3);
        sweep(paint, a, Math.min(from + across * (k + 1) / slices, wall), reach); paint.fill();
      }
    }
    // it fades with distance
    const fade = paint.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, reach);
    fade.addColorStop(0, 'rgba(0,0,0,1)'); fade.addColorStop(0.07, 'rgba(0,0,0,.95)'); fade.addColorStop(0.5, 'rgba(0,0,0,.45)'); fade.addColorStop(1, 'rgba(0,0,0,0)');
    paint.globalCompositeOperation = 'destination-in'; paint.fillStyle = fade; paint.fillRect(...box);
    // white-hot at the glass
    const heat = paint.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, reach * 0.12);
    heat.addColorStop(0, 'rgba(255,255,255,.85)'); heat.addColorStop(1, 'rgba(255,255,255,0)');
    paint.globalCompositeOperation = 'lighter'; paint.fillStyle = heat; sweep(paint, first, first + width, reach * 0.12); paint.fill();
    // none of it shows inside the glass
    paint.globalCompositeOperation = 'destination-out'; paint.fillStyle = '#000';
    paint.beginPath(); paint.moveTo(A.x, A.y); paint.lineTo(B.x, B.y); paint.lineTo(C.x, C.y); paint.closePath(); paint.fill();
    ctx.globalAlpha = raysOn;
    if (bw > 0 && bh > 0) ctx.drawImage(layer, bx, by, bw, bh, ...box);

    // inside the glass the white beam widens toward the far face and starts to split: red above, violet below
    const lip = k => ({ x: p2.x + face.x * k * exit, y: p2.y + face.y * k * exit }), top = lip(-0.5), bottom = lip(0.5);
    ctx.globalAlpha = raysOn;
    ctx.fillStyle = ramp(p1, p2, WHITE, [[0, 0.75], [1, 0.4]]); shape(p1, top, bottom); ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = ramp(p1, top, spectrum[0], [[0, 0], [1, 0.75]]); line(p1, top); ctx.stroke();
    ctx.strokeStyle = ramp(p1, bottom, spectrum[5], [[0, 0], [1, 0.75]]); line(p1, bottom); ctx.stroke();
    // and a little of it bounces off the far face down to the base
    const rebound = bounce(along(p1, p2), { x: face.y, y: -face.x });
    const land = rebound.y > 0.2 ? p2.x + rebound.x * (C.y - p2.y) / rebound.y : NaN;
    if (land - exit * 1.3 > B.x && land + exit * 1.3 < C.x) {
      ctx.fillStyle = ramp(p2, { x: land, y: C.y }, WHITE, [[0, 0.2], [1, 0.03]]);
      shape(top, bottom, { x: land + exit * 1.3, y: C.y }, { x: land - exit * 1.3, y: C.y }); ctx.fill();
    }

    // a bloom where the light enters and where it leaves
    for (const [spot, radius, on] of [[p1, size * 0.07, beamOn], [p2, size * 0.14, raysOn]]) {
      const bloom = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, radius);
      bloom.addColorStop(0, 'rgba(255,255,255,.55)'); bloom.addColorStop(0.25, 'rgba(255,255,255,.16)'); bloom.addColorStop(0.6, 'rgba(255,255,255,.035)'); bloom.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = on; ctx.fillStyle = bloom;
      ctx.beginPath(); ctx.arc(spot.x, spot.y, radius, 0, Math.PI * 2); ctx.fill();
    }

    // The glass, over the light: the inner edge of the bevel, a shine along the lit face, the outline.
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.lineJoin = 'round';
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${glass},.2)`; shape(Ai, Bi, Ci); ctx.stroke();
    ctx.strokeStyle = `rgba(${glass},.3)`;
    for (const [outer, inner] of [[A, Ai], [B, Bi], [C, Ci]]) { line(outer, inner); ctx.stroke(); }
    const bevel = 0.17 * Math.abs((middle.x - A.x) * leftOut.x + (middle.y - A.y) * leftOut.y);
    const on = (t, depth) => ({ x: A.x + (B.x - A.x) * t - leftOut.x * depth, y: A.y + (B.y - A.y) * t - leftOut.y * depth });
    ctx.fillStyle = ramp(on(0.14, 0), on(0.7, 0), glass, [[0, 0], [0.3, 0.42], [1, 0]]);
    shape(on(0.14, bevel * 0.28), on(0.7, bevel * 0.28), on(0.7, bevel * 0.6), on(0.14, bevel * 0.6)); ctx.fill();
    ctx.lineWidth = 1.6; ctx.strokeStyle = ramp(A, foot, glass, [[0, 1], [1, 0.62]]); shape(A, B, C); ctx.stroke();
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
