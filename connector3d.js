/* M23 Circular Connector — Realistic 3D Exploded View
   Three.js procedural geometry with PBR materials.
   Hover/touch to explode, release to assemble. */

(function(){
  const CONTAINER_ID = 'connector-3d';

  function init(){
    const container = document.getElementById(CONTAINER_ID);
    if(!container) return;

    const W = container.clientWidth, H = container.clientHeight || 500;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- Scene ---
    const scene = new THREE.Scene();

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(35, W/H, 0.1, 100);
    camera.position.set(4.5, 2.5, 6);
    camera.lookAt(0, 0, 0);

    // --- Lights ---
    const amb = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(amb);
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(5, 8, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xc8d8f0, 0.6);
    fill.position.set(-4, 2, -3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xf5c518, 0.3);
    rim.position.set(-2, -1, 5);
    scene.add(rim);

    // --- Materials ---
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x888888, metalness: 0.85, roughness: 0.28
    });
    const nylonMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a, metalness: 0.05, roughness: 0.65
    });
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xf5c518, metalness: 0.9, roughness: 0.15
    });
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0x2e5f8a, metalness: 0.02, roughness: 0.8
    });
    const crimpMat = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0, metalness: 0.8, roughness: 0.3
    });
    const sheathMat = new THREE.MeshStandardMaterial({
      color: 0x222222, metalness: 0.0, roughness: 0.85
    });
    const redMat = new THREE.MeshStandardMaterial({ color:0xc9302c, roughness:0.7 });
    const greenMat = new THREE.MeshStandardMaterial({ color:0x2e7d32, roughness:0.7 });
    const blueMat = new THREE.MeshStandardMaterial({ color:0x1565c0, roughness:0.7 });
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xd4875a, metalness: 0.85, roughness: 0.25
    });

    // --- Groups for animation ---
    const shellGroup = new THREE.Group();
    const insertGroup = new THREE.Group();
    const pinsGroup = new THREE.Group();
    const sealGroup = new THREE.Group();
    const crimpGroup = new THREE.Group();
    const cableGroup = new THREE.Group();

    // Connector axis along Z

    // === OUTER SHELL (metal cylinder with knurling) ===
    const shellOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.15, 2.0, 48),
      shellMat
    );
    shellOuter.rotation.x = Math.PI/2;
    shellGroup.add(shellOuter);

    // Shell inner bore
    const shellInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 2.05, 48),
      new THREE.MeshStandardMaterial({ color:0x333333, metalness:0.3, roughness:0.5 })
    );
    shellInner.rotation.x = Math.PI/2;
    shellGroup.add(shellInner);

    // Knurling rings
    for(let i=-0.7; i<=0.7; i+=0.12){
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.16, 0.02, 8, 48),
        shellMat
      );
      ring.position.z = i;
      shellGroup.add(ring);
    }

    // Coupling nut (wider ring at front)
    const nut = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 1.3, 0.35, 6),
      shellMat
    );
    nut.rotation.x = Math.PI/2;
    nut.position.z = -1.1;
    shellGroup.add(nut);

    // Flange at back
    const flange = new THREE.Mesh(
      new THREE.CylinderGeometry(1.25, 1.15, 0.15, 48),
      shellMat
    );
    flange.rotation.x = Math.PI/2;
    flange.position.z = 1.0;
    shellGroup.add(flange);

    scene.add(shellGroup);

    // === INNER INSERT (nylon body with pin cavities) ===
    const insertBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 1.6, 48),
      nylonMat
    );
    insertBody.rotation.x = Math.PI/2;
    insertGroup.add(insertBody);

    // Keyway
    const keyway = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.35, 1.65),
      new THREE.MeshStandardMaterial({ color:0xf5c518, metalness:0.3, roughness:0.4 })
    );
    keyway.position.set(0.82, 0, 0);
    insertGroup.add(keyway);

    // Pin cavities (visible as dark holes on front face)
    const cavityGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16);
    const cavityMat = new THREE.MeshStandardMaterial({ color:0x080808, roughness:0.9 });
    const pinPositions = [
      [0, 0.45], [0.39, 0.22], [0.39, -0.22],
      [0, -0.45], [-0.39, -0.22], [-0.39, 0.22],
      [0, 0]
    ];
    pinPositions.forEach(([x,y])=>{
      const cav = new THREE.Mesh(cavityGeo, cavityMat);
      cav.rotation.x = Math.PI/2;
      cav.position.set(x, y, -0.7);
      insertGroup.add(cav);
    });

    scene.add(insertGroup);

    // === CONTACT PINS (gold-plated) ===
    pinPositions.forEach(([x,y], i)=>{
      // Pin shaft
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 1.8, 12),
        pinMat
      );
      shaft.rotation.x = Math.PI/2;
      shaft.position.set(x, y, 0);

      // Pin tip (pointed)
      const tip = new THREE.Mesh(
        new THREE.ConeGeometry(0.06, 0.2, 12),
        pinMat
      );
      tip.rotation.x = -Math.PI/2;
      tip.position.set(x, y, -1.0);

      // Pin shoulder
      const shoulder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.06, 0.15, 12),
        pinMat
      );
      shoulder.rotation.x = Math.PI/2;
      shoulder.position.set(x, y, 0.3);

      pinsGroup.add(shaft, tip, shoulder);
    });
    scene.add(pinsGroup);

    // === SEAL (silicone, blue) ===
    const sealBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.88, 0.92, 0.5, 48),
      sealMat
    );
    sealBody.rotation.x = Math.PI/2;
    sealGroup.add(sealBody);

    // Lip seal ridges
    for(let dz=-0.18; dz<=0.18; dz+=0.12){
      const lip = new THREE.Mesh(
        new THREE.TorusGeometry(0.9, 0.025, 8, 48),
        sealMat
      );
      lip.position.z = dz;
      sealGroup.add(lip);
    }

    // Wire pass-through holes
    pinPositions.forEach(([x,y])=>{
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 0.55, 12),
        new THREE.MeshStandardMaterial({ color:0x142d44, roughness:0.9 })
      );
      hole.rotation.x = Math.PI/2;
      hole.position.set(x, y, 0);
      sealGroup.add(hole);
    });

    sealGroup.position.z = 1.2;
    scene.add(sealGroup);

    // === CRIMP BARRELS ===
    pinPositions.forEach(([x,y])=>{
      const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.08, 0.5, 12),
        crimpMat
      );
      barrel.rotation.x = Math.PI/2;
      barrel.position.set(x, y, 0);

      // Crimp deformation (slightly squeezed ring)
      const crimp = new THREE.Mesh(
        new THREE.TorusGeometry(0.09, 0.015, 6, 12),
        crimpMat
      );
      crimp.position.set(x, y, 0.1);
      crimpGroup.add(barrel, crimp);
    });
    crimpGroup.position.z = 1.8;
    scene.add(crimpGroup);

    // === CABLE ===
    // Outer sheath
    const sheath = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 3.0, 24),
      sheathMat
    );
    sheath.rotation.x = Math.PI/2;
    sheath.position.z = 1.5;
    cableGroup.add(sheath);

    // Individual wires (visible at cut end)
    const wireMats = [redMat, greenMat, blueMat, redMat, greenMat, blueMat, copperMat];
    pinPositions.forEach(([x,y], i)=>{
      const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.8, 8),
        wireMats[i % wireMats.length]
      );
      wire.rotation.x = Math.PI/2;
      wire.position.set(x*0.55, y*0.55, -0.1);
      cableGroup.add(wire);
    });

    // Strain relief boot
    const boot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.38, 0.6, 24),
      new THREE.MeshStandardMaterial({ color:0x1a1a1a, roughness:0.85 })
    );
    boot.rotation.x = Math.PI/2;
    boot.position.z = -0.15;
    cableGroup.add(boot);

    cableGroup.position.z = 2.6;
    scene.add(cableGroup);

    // --- Center everything ---
    const allGroup = new THREE.Group();
    allGroup.add(shellGroup, insertGroup, pinsGroup, sealGroup, crimpGroup, cableGroup);
    allGroup.rotation.y = -0.4;
    allGroup.rotation.x = 0.15;
    scene.add(allGroup);

    // --- Exploded positions (along Z axis) ---
    const assembled = {
      shell: { z:0 },
      insert: { z:0 },
      pins: { z:0 },
      seal: { z:1.2 },
      crimp: { z:1.8 },
      cable: { z:2.6 }
    };
    const exploded = {
      shell: { z:-2.5 },
      insert: { z:-0.8 },
      pins: { z:0.6 },
      seal: { z:2.4 },
      crimp: { z:3.8 },
      cable: { z:5.5 }
    };

    let targetExplode = 0; // 0 = assembled, 1 = exploded
    let currentExplode = 0;

    function lerp(a, b, t){ return a + (b-a)*t; }

    function updatePositions(){
      const t = currentExplode;
      shellGroup.position.z = lerp(assembled.shell.z, exploded.shell.z, t);
      insertGroup.position.z = lerp(assembled.insert.z, exploded.insert.z, t);
      pinsGroup.position.z = lerp(assembled.pins.z, exploded.pins.z, t);
      sealGroup.position.z = lerp(assembled.seal.z, exploded.seal.z, t);
      crimpGroup.position.z = lerp(assembled.crimp.z, exploded.crimp.z, t);
      cableGroup.position.z = lerp(assembled.cable.z, exploded.cable.z, t);
    }

    // --- Interaction ---
    let isHovering = false;
    const el = renderer.domElement;

    el.addEventListener('mouseenter', ()=>{ targetExplode=1; isHovering=true; });
    el.addEventListener('mouseleave', ()=>{ targetExplode=0; isHovering=false; });
    el.addEventListener('touchstart', (e)=>{
      e.preventDefault();
      targetExplode = targetExplode===0 ? 1 : 0;
    }, {passive:false});

    // --- Slow auto-rotate ---
    let autoAngle = -0.4;

    // --- Render loop ---
    function animate(){
      requestAnimationFrame(animate);

      // Smooth interpolation
      currentExplode += (targetExplode - currentExplode) * 0.06;
      if(Math.abs(currentExplode - targetExplode) < 0.001) currentExplode = targetExplode;
      updatePositions();

      // Auto-rotate
      if(!isHovering){
        autoAngle += 0.003;
      }
      allGroup.rotation.y = autoAngle;

      renderer.render(scene, camera);
    }
    animate();

    // --- Resize ---
    const ro = new ResizeObserver(()=>{
      const w = container.clientWidth, h = container.clientHeight || 500;
      camera.aspect = w/h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);
  }

  // Load Three.js then init
  if(typeof THREE !== 'undefined'){
    init();
  } else {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r169/three.min.js';
    s.onload = init;
    document.head.appendChild(s);
  }
})();
