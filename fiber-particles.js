/* Fiber optic hero animation — light pulses traveling through optical fibers.
   Multiple colored fiber strands with bright signal pulses, bokeh glow effects.
   Canvas 2D, lazy init with IntersectionObserver. */

(function(){
  const canvas = document.getElementById('fiber-hero-canvas');
  if(!canvas) return;

  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.page-head') || canvas.parentElement;

  let W, H, dpr;
  let running = false;

  function resize(){
    dpr = Math.min(window.devicePixelRatio, 2);
    const rect = hero.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if(fibers.length) generateFibers();
  }

  // Fiber colors — realistic fiber optic glow colors
  const COLORS = [
    { r:245, g:197, b:24 },   // gold (brand)
    { r:66,  g:165, b:245 },  // blue (singlemode)
    { r:0,   g:200, b:180 },  // cyan/aqua (OM3)
    { r:255, g:140, b:50 },   // orange (OM4)
    { r:200, g:80,  b:200 },  // magenta/violet (OM5)
    { r:100, g:220, b:100 },  // green (signal)
  ];

  // ---- FIBERS ----
  const fibers = [];
  function generateFibers(){
    fibers.length = 0;
    const count = W < 700 ? 8 : 16;
    for(let i = 0; i < count; i++){
      const y0 = (i / count) * H * 0.7 + H * 0.15 + (Math.random() - 0.5) * 40;
      const color = COLORS[i % COLORS.length];
      const points = [];
      const segs = 6 + Math.floor(Math.random() * 4);
      for(let s = 0; s <= segs; s++){
        const t = s / segs;
        points.push({
          x: t * (W + 200) - 100,
          y: y0 + Math.sin(t * Math.PI * (1.5 + Math.random())) * (30 + Math.random() * 50)
        });
      }
      fibers.push({
        points,
        color,
        width: 0.8 + Math.random() * 1.2,
        opacity: 0.06 + Math.random() * 0.1,
        pulses: []
      });
      // Generate pulses for this fiber
      const pulseCount = 2 + Math.floor(Math.random() * 3);
      for(let p = 0; p < pulseCount; p++){
        fibers[fibers.length-1].pulses.push({
          t: Math.random(),
          speed: 0.15 + Math.random() * 0.4,
          size: 3 + Math.random() * 6,
          brightness: 0.5 + Math.random() * 0.5
        });
      }
    }
  }

  // ---- BOKEH (floating light circles) ----
  const bokeh = [];
  function generateBokeh(){
    bokeh.length = 0;
    const count = W < 700 ? 12 : 25;
    for(let i = 0; i < count; i++){
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      bokeh.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: 10 + Math.random() * 40,
        opacity: 0.03 + Math.random() * 0.06,
        color,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.5 + Math.random() * 1.5
      });
    }
  }

  // Interpolate point on fiber path
  function getPointOnFiber(fiber, t){
    const pts = fiber.points;
    const total = pts.length - 1;
    const idx = Math.min(Math.floor(t * total), total - 1);
    const lt = (t * total) - idx;
    const a = pts[idx], b = pts[idx + 1];
    if(!a || !b) return { x: 0, y: 0 };
    return {
      x: a.x + (b.x - a.x) * lt,
      y: a.y + (b.y - a.y) * lt
    };
  }

  // ---- DRAW ----
  function drawFiber(fiber){
    const pts = fiber.points;
    const c = fiber.color;
    // Draw the fiber strand
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for(let i = 1; i < pts.length; i++){
      const prev = pts[i-1];
      const curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      const cpy = (prev.y + curr.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
    }
    ctx.lineTo(pts[pts.length-1].x, pts[pts.length-1].y);
    ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${fiber.opacity})`;
    ctx.lineWidth = fiber.width;
    ctx.stroke();

    // Glow around the fiber
    ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${fiber.opacity * 0.3})`;
    ctx.lineWidth = fiber.width * 4;
    ctx.stroke();
  }

  function drawPulse(fiber, pulse, t){
    const c = fiber.color;
    const pos = getPointOnFiber(fiber, pulse.t);
    const flicker = Math.sin(t * 8 + pulse.t * 20) * 0.2 + 0.8;
    const alpha = pulse.brightness * flicker;
    const size = pulse.size * (0.8 + flicker * 0.4);

    // Outer glow
    const g = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 5);
    g.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${alpha * 0.4})`);
    g.addColorStop(0.3, `rgba(${c.r},${c.g},${c.b},${alpha * 0.15})`);
    g.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size * 5, 0, Math.PI * 2);
    ctx.fill();

    // Bright core
    const g2 = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size);
    g2.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);
    g2.addColorStop(0.4, `rgba(${c.r},${c.g},${c.b},${alpha})`);
    g2.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBokehCircle(b, t){
    const pulse = Math.sin(t * b.pulseSpeed + b.pulse) * 0.5 + 0.5;
    const alpha = b.opacity * (0.5 + pulse * 0.5);
    const c = b.color;

    const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.size);
    g.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${alpha * 0.5})`);
    g.addColorStop(0.5, `rgba(${c.r},${c.g},${c.b},${alpha * 0.15})`);
    g.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---- MAIN LOOP ----
  function animate(now){
    if(!running) return;
    requestAnimationFrame(animate);
    const t = now * 0.001;

    ctx.clearRect(0, 0, W, H);

    // Draw bokeh background
    bokeh.forEach(b => {
      b.x += b.speedX;
      b.y += b.speedY;
      if(b.x < -b.size) b.x = W + b.size;
      if(b.x > W + b.size) b.x = -b.size;
      if(b.y < -b.size) b.y = H + b.size;
      if(b.y > H + b.size) b.y = -b.size;
      drawBokehCircle(b, t);
    });

    // Draw fibers and pulses
    fibers.forEach(fiber => {
      drawFiber(fiber);
      fiber.pulses.forEach(pulse => {
        pulse.t += pulse.speed * 0.004;
        if(pulse.t > 1.1) pulse.t = -0.1;
        if(pulse.t >= 0 && pulse.t <= 1){
          drawPulse(fiber, pulse, t);
        }
      });
    });
  }

  // ---- LAZY INIT ----
  const obs = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting && !running){
      running = true;
      resize();
      generateFibers();
      generateBokeh();
      requestAnimationFrame(animate);
      obs.disconnect();
    }
  }, { threshold: 0.1 });
  obs.observe(hero);

  window.addEventListener('resize', () => { if(running){ resize(); generateBokeh(); } });
})();
