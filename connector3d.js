/* M23 Circular Connector — Realistic 3D Exploded View
   Three.js + GSAP procedural geometry with PBR materials.
   Adapted for in-page container. Hover/touch to explode. */

(function(){
  const CONTAINER_ID = 'connector-3d';

  function init(){
    const container = document.getElementById(CONTAINER_ID);
    if(!container) return;

    const W = container.clientWidth || 600, H = container.clientHeight || 500;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.cursor = 'crosshair';

    // --- Scene ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e0e0c, 0.02);

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(35, W/H, 0.1, 100);
    camera.position.set(16, 6, 16);

    // --- Lights ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(10, 15, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x88bbff, 1.5);
    fillLight.position.set(-10, -5, 10);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xf5c518, 3.5);
    rimLight.position.set(0, 10, -15);
    scene.add(rimLight);

    // --- Materials PBR ---
    const matSilver = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0, metalness: 0.9, roughness: 0.25
    });
    const matBlackPlastic = new THREE.MeshStandardMaterial({
      color: 0x181818, metalness: 0.1, roughness: 0.8
    });
    const matRubber = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a, metalness: 0.0, roughness: 1.0
    });
    const matGold = new THREE.MeshStandardMaterial({
      color: 0xffd700, metalness: 1.0, roughness: 0.1
    });
    const matRedSeal = new THREE.MeshStandardMaterial({
      color: 0xaa2222, roughness: 0.9
    });

    // --- Main M23 group ---
    const m23 = new THREE.Group();
    m23.rotation.z = Math.PI * 0.15;
    m23.rotation.x = Math.PI * 0.1;
    scene.add(m23);

    const parts = [];

    function createPart(id, name, nameEN, assemY, explY){
      const group = new THREE.Group();
      group.position.y = assemY;
      m23.add(group);
      const data = { group, name, nameEN, assemY, explY, id, htmlLabel:null };
      parts.push(data);
      return group;
    }

    // 1. Cavo (H07RN-F)
    const pCavo = createPart('cavo', 'Cavo H07RN-F', 'Cable H07RN-F', -6, -8);
    const cavoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 12, 32), matRubber);
    cavoMesh.castShadow = true; cavoMesh.receiveShadow = true;
    pCavo.add(cavoMesh);

    // 2. Dado pressacavo
    const pGland = createPart('pressacavo', 'Dado Pressacavo', 'Cable Gland Nut', -1.8, -4);
    const glandMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.4, 1.5, 32), matBlackPlastic);
    glandMesh.castShadow = true; glandMesh.receiveShadow = true;
    pGland.add(glandMesh);
    const sealMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.2, 32), matRedSeal);
    sealMesh.position.y = -0.7;
    pGland.add(sealMesh);

    // 3. Corpo (Housing)
    const pHousing = createPart('guscio', 'Corpo Connettore', 'Connector Housing', 0, -1.5);
    const housingMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.7, 2.5, 32), matSilver);
    housingMesh.castShadow = true; housingMesh.receiveShadow = true;
    pHousing.add(housingMesh);
    const ringGeom = new THREE.CylinderGeometry(0.92, 0.92, 0.2, 32);
    const ring1 = new THREE.Mesh(ringGeom, matSilver); ring1.position.y = 0.8;
    const ring2 = new THREE.Mesh(ringGeom, matSilver); ring2.position.y = 1.0;
    pHousing.add(ring1, ring2);

    // 4. Inserto porta contatti
    const pInsert = createPart('inserto', 'Inserto Dielettrico', 'Dielectric Insert', 1.4, 2);
    const insertMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.4, 32), matBlackPlastic);
    insertMesh.castShadow = true; insertMesh.receiveShadow = true;
    pInsert.add(insertMesh);
    for(let i = 0; i < 8; i++){
      const angle = (i / 8) * Math.PI * 2;
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 16), matGold);
      pin.position.set(Math.cos(angle) * 0.55, 0.35, Math.sin(angle) * 0.55);
      pin.castShadow = true;
      pInsert.add(pin);
    }
    const centerPin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 16), matGold);
    centerPin.position.set(0, 0.35, 0);
    pInsert.add(centerPin);

    // 5. Ghiera di serraggio (zigrinata)
    const pNut = createPart('ghiera', 'Ghiera di Serraggio', 'Locking Nut', 1.3, 4.5);
    const nutMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 1.4, 32), matSilver);
    nutMesh.castShadow = true; nutMesh.receiveShadow = true;
    pNut.add(nutMesh);
    for(let i = 0; i < 50; i++){
      const angle = (i / 50) * Math.PI * 2;
      const ridge = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8), matSilver);
      ridge.position.set(Math.cos(angle) * 1.14, 0, Math.sin(angle) * 1.14);
      pNut.add(ridge);
    }

    // --- HTML Labels ---
    const labelsWrap = document.createElement('div');
    labelsWrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:3';
    container.appendChild(labelsWrap);

    const lang = localStorage.getItem('ne-lang') || 'it';

    parts.forEach(p => {
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute;
        font-family:'JetBrains Mono',monospace;
        font-size:10px;
        letter-spacing:0.2em;
        text-transform:uppercase;
        color:#0e0e0c;
        background:#f5c518;
        padding:5px 10px;
        opacity:0;
        transform:translate(0,-50%);
        transition:opacity 0.4s ease;
        white-space:nowrap;
        box-shadow:4px 4px 0 rgba(255,255,255,0.05);
        pointer-events:none;
      `;
      el.textContent = lang === 'en' ? p.nameEN : p.name;
      labelsWrap.appendChild(el);
      p.htmlLabel = el;
    });

    // --- Instruction badge ---
    const badge = document.createElement('div');
    badge.style.cssText = `
      position:absolute;bottom:14px;right:14px;
      font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;
      color:rgba(255,255,255,0.5);
      border:1px solid rgba(255,255,255,0.15);padding:8px 16px;border-radius:99px;
      background:rgba(14,14,12,0.6);backdrop-filter:blur(8px);z-index:4;
      transition:border-color 0.4s,color 0.4s;
    `;
    badge.textContent = lang === 'en' ? '▤ HOVER TO EXPLORE' : '▤ PASSA IL MOUSE SOPRA';
    container.appendChild(badge);

    // --- Interaction ---
    let isHovered = false;
    let mouse = { x: 0, y: 0 };
    const rect = () => container.getBoundingClientRect();

    container.addEventListener('mousemove', (e) => {
      const r = rect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;

      const trigger = Math.abs(mouse.x) < (isHovered ? 0.7 : 0.4) &&
                      Math.abs(mouse.y) < (isHovered ? 0.9 : 0.5);
      triggerExplosion(trigger);
    });

    container.addEventListener('mouseleave', () => { triggerExplosion(false); });

    container.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerExplosion(!isHovered);
    }, { passive: false });

    function triggerExplosion(state){
      if(isHovered === state) return;
      isHovered = state;

      parts.forEach((p, idx) => {
        gsap.to(p.group.position, {
          y: state ? p.explY : p.assemY,
          duration: 1.2,
          ease: "power3.out",
          delay: state ? idx * 0.05 : (parts.length - idx) * 0.05
        });
        p.htmlLabel.style.opacity = state ? '1' : '0';
      });

      if(state){
        badge.style.borderColor = '#f5c518';
        badge.style.color = '#f5c518';
        badge.textContent = lang === 'en' ? '✦ COMPONENT EXPLORATION' : '✦ ESPLORAZIONE COMPONENTI';
      } else {
        badge.style.borderColor = 'rgba(255,255,255,0.15)';
        badge.style.color = 'rgba(255,255,255,0.5)';
        badge.textContent = lang === 'en' ? '▤ HOVER TO EXPLORE' : '▤ PASSA IL MOUSE SOPRA';
      }
    }

    // --- Render loop ---
    const clock = new THREE.Clock();

    function animate(){
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      m23.position.y = Math.sin(t * 1.5) * 0.2;
      m23.rotation.y = t * 0.2;

      camera.position.x += (Math.sin(mouse.x) * 3 + 16 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 3 + 6 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Labels 2D tracking
      if(isHovered){
        const cW = container.clientWidth, cH = container.clientHeight;
        parts.forEach(p => {
          const vec = new THREE.Vector3();
          p.group.getWorldPosition(vec);
          vec.x += 1.8;
          vec.project(camera);
          const x = (vec.x * 0.5 + 0.5) * cW + 20;
          const y = (vec.y * -0.5 + 0.5) * cH;
          p.htmlLabel.style.left = x + 'px';
          p.htmlLabel.style.top = y + 'px';
        });
      }

      renderer.render(scene, camera);
    }
    animate();

    // --- Resize ---
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth, h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);
  }

  // Load deps then init
  function loadScript(src){ return new Promise(r => { const s = document.createElement('script'); s.src = src; s.onload = r; document.head.appendChild(s); }); }

  async function boot(){
    if(typeof THREE === 'undefined') await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
    if(typeof gsap === 'undefined') await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
    init();
  }

  // Lazy load: only boot when container is near viewport
  const container = document.getElementById('connector-3d');
  if(container){
    const obs = new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting){ obs.disconnect(); boot(); }
    },{rootMargin:'200px'});
    obs.observe(container);
  }
})();
