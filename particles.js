/* Hero particles — electric current flowing through circuit paths.
   Light theme version: gold + dark particles on white background.
   Lazy-initialized when hero section is visible. */

(function(){
  const canvas = document.getElementById('hero-particles');
  if(!canvas) return;

  const ctx = canvas.getContext('2d');
  const glowEl = document.querySelector('.hero-glow');
  const hero = canvas.closest('.hero') || canvas.parentElement;

  let W, H, dpr;
  let mouse = { x: -9999, y: -9999 };
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
    if(paths.length) generatePaths();
  }

  // Mouse / touch
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    if(glowEl){
      glowEl.style.left = e.clientX + 'px';
      glowEl.style.top = e.clientY + 'px';
    }
  });
  hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  hero.addEventListener('touchmove', e => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  }, { passive: true });

  // ---- CIRCUIT PATHS ----
  const paths = [];
  function generatePaths(){
    paths.length = 0;
    const count = W < 700 ? 6 : 12;
    for(let i = 0; i < count; i++){
      const segments = [];
      let x = -50;
      let y = Math.random() * H;
      const dir = Math.random() > 0.3 ? 1 : -1;
      if(dir < 0) x = W + 50;
      segments.push({ x, y });
      const steps = 4 + Math.floor(Math.random() * 4);
      for(let s = 0; s < steps; s++){
        x += dir * (80 + Math.random() * 200);
        if(Math.random() > 0.5) y += (Math.random() - 0.5) * 200;
        y = Math.max(40, Math.min(H - 40, y));
        segments.push({ x, y });
      }
      paths.push({
        segments,
        opacity: 0.04 + Math.random() * 0.08,
        width: 0.5 + Math.random() * 0.5,
        isGold: Math.random() > 0.7
      });
    }
    generateNodes();
  }

  // ---- PARTICLES ----
  const PCOUNT = () => W < 700 ? 50 : 120;
  let particles = [];

  function createParticle(){
    const pi = Math.floor(Math.random() * paths.length);
    const path = paths[pi];
    const si = Math.floor(Math.random() * (path.segments.length - 1));
    const t = Math.random();
    const a = path.segments[si], b = path.segments[si + 1];
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      pi, si, t,
      speed: 0.3 + Math.random() * 1.2,
      size: 1 + Math.random() * 2.5,
      opacity: 0.3 + Math.random() * 0.7,
      isGold: path.isGold || Math.random() > 0.6,
      pulse: Math.random() * Math.PI * 2,
      pulseSpd: 1 + Math.random() * 3,
      trail: [],
      trailMax: 4 + Math.floor(Math.random() * 8)
    };
  }

  function initParticles(){
    particles = [];
    const n = PCOUNT();
    for(let i = 0; i < n; i++) particles.push(createParticle());
  }

  // ---- SPARKS ----
  const sparks = [];
  let lastMouse = { x: -9999, y: -9999 };
  let sparkTimer = 0;

  function emitSparks(x, y, count){
    for(let i = 0; i < count; i++){
      const a = Math.random() * Math.PI * 2;
      const s = 1 + Math.random() * 4;
      sparks.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, life: 1, decay: 0.02 + Math.random()*0.03, size: 0.5 + Math.random()*2 });
    }
  }

  // ---- NODES ----
  const nodes = [];
  function generateNodes(){
    nodes.length = 0;
    paths.forEach(path => {
      path.segments.forEach((seg, i) => {
        if(i > 0 && i < path.segments.length - 1 && Math.random() > 0.5){
          nodes.push({ x: seg.x, y: seg.y, baseSize: 2 + Math.random()*3, pulse: Math.random()*Math.PI*2, isGold: path.isGold });
        }
      });
    });
  }

  // ---- DRAW ----
  function drawPath(p){
    ctx.beginPath();
    ctx.moveTo(p.segments[0].x, p.segments[0].y);
    for(let i = 1; i < p.segments.length; i++) ctx.lineTo(p.segments[i].x, p.segments[i].y);
    ctx.strokeStyle = p.isGold ? `rgba(201,153,2,${p.opacity*2.5})` : `rgba(14,14,12,${p.opacity*1.5})`;
    ctx.lineWidth = p.width;
    ctx.stroke();
  }

  function drawNode(n, t){
    const pulse = Math.sin(t*2 + n.pulse)*0.5 + 0.5;
    const size = n.baseSize + pulse*2;
    const alpha = 0.2 + pulse*0.4;
    const c = n.isGold ? '201,153,2' : '107,101,90';
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, size*3);
    g.addColorStop(0, `rgba(${c},${alpha*0.6})`);
    g.addColorStop(1, `rgba(${c},0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(n.x, n.y, size*3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = `rgba(${c},${alpha})`;
    ctx.beginPath(); ctx.arc(n.x, n.y, size*0.6, 0, Math.PI*2); ctx.fill();
  }

  function moveParticle(p){
    const path = paths[p.pi]; if(!path) return;
    p.t += p.speed * 0.008;
    if(p.t >= 1){ p.t = 0; p.si++; if(p.si >= path.segments.length - 1){ Object.assign(p, createParticle()); p.trail=[]; return; } }
    const a = path.segments[p.si], b = path.segments[p.si+1]; if(!a||!b) return;
    p.x = a.x + (b.x - a.x)*p.t;
    p.y = a.y + (b.y - a.y)*p.t;
    p.trail.unshift({x:p.x,y:p.y});
    if(p.trail.length > p.trailMax) p.trail.pop();
    const dx = mouse.x - p.x, dy = mouse.y - p.y, dist = Math.sqrt(dx*dx+dy*dy);
    if(dist < 150){ const f=(150-dist)/150; p.x-=dx*f*0.02; p.y-=dy*f*0.02; p.opacity=Math.min(1,p.opacity+f*0.3); }
  }

  function drawParticle(p, t){
    const pulse = Math.sin(t*p.pulseSpd + p.pulse)*0.3 + 0.7;
    const alpha = p.opacity * pulse;
    const c = p.isGold ? '201,153,2' : '14,14,12';
    if(p.trail.length > 1){
      ctx.beginPath(); ctx.moveTo(p.trail[0].x, p.trail[0].y);
      for(let i=1;i<p.trail.length;i++) ctx.lineTo(p.trail[i].x, p.trail[i].y);
      ctx.strokeStyle = `rgba(${c},${alpha*0.15})`; ctx.lineWidth = p.size*0.5; ctx.stroke();
    }
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size*4);
    g.addColorStop(0, `rgba(${c},${alpha*0.5})`); g.addColorStop(1, `rgba(${c},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.size*4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = `rgba(${c},${alpha})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
  }

  // ---- MAIN LOOP ----
  function animate(now){
    if(!running) return;
    requestAnimationFrame(animate);
    const t = now * 0.001;
    ctx.clearRect(0, 0, W, H);
    paths.forEach(drawPath);
    nodes.forEach(n => drawNode(n, t));
    particles.forEach(p => { moveParticle(p); drawParticle(p, t); });
    sparkTimer++;
    const md = Math.sqrt((mouse.x-lastMouse.x)**2 + (mouse.y-lastMouse.y)**2);
    if(md > 5 && sparkTimer % 3 === 0) emitSparks(mouse.x, mouse.y, 1);
    lastMouse.x = mouse.x; lastMouse.y = mouse.y;
    for(let i=sparks.length-1;i>=0;i--){
      const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.vx*=0.97; s.vy*=0.97; s.life-=s.decay;
      if(s.life<=0){ sparks.splice(i,1); } else {
        ctx.fillStyle=`rgba(201,153,2,${s.life})`; ctx.beginPath(); ctx.arc(s.x,s.y,s.size*s.life,0,Math.PI*2); ctx.fill();
      }
    }
  }

  // ---- LAZY INIT ----
  const obs = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting && !running){
      running = true;
      resize();
      generatePaths();
      initParticles();
      requestAnimationFrame(animate);
      obs.disconnect();
    }
  }, { threshold: 0.1 });
  obs.observe(hero);

  window.addEventListener('resize', () => { if(running) resize(); });
})();
