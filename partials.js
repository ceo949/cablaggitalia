/* Nuova Elettronica — header/footer injection + interactions + i18n.
   Each page sets data-page on <body>; this script injects shared chrome
   so the 11 pages stay in sync when we change header/footer markup. */

(function(){
  const LOGO = "img/logo-mark.png";

  const NAV_IT = [
    { id:"home",          label:"Home",           href:"index.html",          num:"00" },
    { id:"chi-siamo",     label:"Chi siamo",      href:"chi-siamo.html",      num:"01" },
    { id:"servizi",       label:"Servizi",        href:"servizi.html",        num:"02" },
    { id:"riparazioni",   label:"Riparazioni",    href:"riparazione-cablaggi.html", num:"03" },
    { id:"settori",       label:"Settori",        href:"settori.html",        num:"04" },
    { id:"certificazioni",label:"Certificazioni", href:"certificazioni.html", num:"05" },
    { id:"processo",      label:"Processo",       href:"processo.html",       num:"06" },
    { id:"contatti",      label:"Contatti",       href:"contatti.html",       num:"07" }
  ];
  const NAV_EN = [
    { id:"home",          label:"Home",           href:"index.html",          num:"00" },
    { id:"chi-siamo",     label:"About us",       href:"chi-siamo.html",      num:"01" },
    { id:"servizi",       label:"Services",       href:"servizi.html",        num:"02" },
    { id:"riparazioni",   label:"Repairs",        href:"riparazione-cablaggi.html", num:"03" },
    { id:"settori",       label:"Industries",     href:"settori.html",        num:"04" },
    { id:"certificazioni",label:"Certifications", href:"certificazioni.html", num:"05" },
    { id:"processo",      label:"Process",        href:"processo.html",       num:"06" },
    { id:"contatti",      label:"Contact",        href:"contatti.html",       num:"07" }
  ];

  let lang = localStorage.getItem("ne-lang") || "it";
  const current = document.body.dataset.page || "home";

  function getNav(){ return lang==="en" ? NAV_EN : NAV_IT; }

  /* -------- TOP BAR -------- */
  const topbar = document.createElement("header");
  topbar.className = "topbar";
  topbar.id = "topbar";

  function renderTopbar(){
    const NAV = getNav();
    topbar.innerHTML = `
      <a class="mark" href="index.html" aria-label="Nuova Elettronica S.r.l.">
        <img class="logo" src="${LOGO}" alt="Nuova Elettronica S.r.l."/>
        <span class="wm">Nuova Elettronica<small>S.r.l. · cablaggitalia.com</small></span>
      </a>
      <nav class="nav" aria-label="principale">
        ${NAV.slice(1).map(n=>`<a href="${n.href}" class="${n.id===current?'active':''}"><span class="num">${n.num}</span>${n.label}</a>`).join("")}
      </nav>
      <div class="topbar-right">
        <button class="lang-toggle" aria-label="Switch language" title="Cambia lingua / Switch language">
          <span class="lang-opt ${lang==='it'?'active':''}" data-lang="it"><svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ce2b37"/></svg>IT</span>
          <span class="lang-sep">/</span>
          <span class="lang-opt ${lang==='en'?'active':''}" data-lang="en"><svg class="flag" viewBox="0 0 60 30" aria-hidden="true"><clipPath id="fl"><rect width="60" height="30"/></clipPath><g clip-path="url(#fl)"><rect width="60" height="30" fill="#012169"/><path d="M0 0L60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0L60 30M60 0L0 30" stroke="#C8102E" stroke-width="4" clip-path="url(#fl)"/><path d="M30 0V30M0 15H60" stroke="#fff" stroke-width="10"/><path d="M30 0V30M0 15H60" stroke="#C8102E" stroke-width="6"/></g></svg>EN</span>
        </button>
        <a href="contatti.html" class="cta"><span class="dot"></span>${lang==='en'?'Quote':'Preventivo'} &nbsp;→</a>
      </div>
    `;
  }
  renderTopbar();
  document.body.prepend(topbar);

  /* -------- MOBILE MENU -------- */
  const burger = document.createElement("button");
  burger.className = "burger";
  burger.setAttribute("aria-label","Menu");
  burger.innerHTML = '<span></span><span></span><span></span>';
  topbar.appendChild(burger);

  const mobileNav = document.createElement("div");
  mobileNav.className = "mobile-nav";
  mobileNav.id = "mobile-nav";
  document.body.appendChild(mobileNav);

  function renderMobileNav(){
    const NAV = getNav();
    mobileNav.innerHTML = NAV.map(n=>`<a href="${n.href}" class="${n.id===current?'active':''}">${n.label}</a>`).join("")
      + `<div class="mobile-nav-contact">
          <a href="tel:+393802189876">+39 380 218 9876</a>
          <a href="mailto:info@cablaggitalia.com">info@cablaggitalia.com</a>
        </div>`;
  }
  renderMobileNav();

  burger.addEventListener("click",()=>{
    const open = mobileNav.classList.toggle("open");
    burger.classList.toggle("open",open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  mobileNav.addEventListener("click",(e)=>{
    if(e.target.tagName==="A"){ mobileNav.classList.remove("open"); burger.classList.remove("open"); document.body.style.overflow=""; }
  });

  /* -------- FOOTER -------- */
  const footer = document.createElement("footer");
  function renderFooter(){
    const NAV = getNav();
    const t = lang==="en" ? {
      nav:"Navigation", contacts:"Direct contacts", legal:"Legal",
      since:"Since 1978 · wiring harness production,<br/>repair &amp; restoration",
      copy:"© 1978 — 2026 Nuova Elettronica S.r.l. · VAT and R.E.A. in",
      legLink:"Legal notes",
      spec:[["riparazione-cablaggi.html","Harness repair"],["restauro-impianto-elettrico-auto-epoca.html","Vintage vehicle wiring"],["cablaggi-macchine-automatiche.html","Automatic machine harnesses"],["cablaggi-torino.html","Harnesses in Turin"]]
    } : {
      nav:"Navigazione", contacts:"Contatti diretti", legal:"Legale",
      since:"Dal 1978 · produzione, riparazione<br/>e restauro cablaggi",
      copy:"© 1978 — 2026 Nuova Elettronica S.r.l. · P. IVA 12220630011 · R.E.A. TO-1273965 ·",
      legLink:"Note legali",
      spec:[["riparazione-cablaggi.html","Riparazione cablaggi"],["restauro-impianto-elettrico-auto-epoca.html","Impianti auto e moto d'epoca"],["cablaggi-macchine-automatiche.html","Cablaggi macchine automatiche"],["cablaggi-torino.html","Cablaggi a Torino"]]
    };
    footer.innerHTML = `
      <div class="wrap">
        <div class="col">
          <h4>Nuova Elettronica S.r.l.</h4>
          <p>Viale Caduti della Polveriera, 21<br/>10051 Avigliana (TO) — Italia</p>
          <p style="margin-top:12px">${t.since}</p>
          <p style="margin-top:14px;display:flex;flex-direction:column;gap:6px">${t.spec.map(s=>`<a href="${s[0]}">${s[1]}</a>`).join("")}</p>
        </div>
        <div class="col">
          <h4>${t.nav}</h4>
          ${NAV.map(n=>`<a href="${n.href}">${n.label}</a>`).join("")}
        </div>
        <div class="col">
          <h4>${t.contacts}</h4>
          <a href="tel:+393802189876">+39 380 218 9876</a>
          <a href="mailto:info@cablaggitalia.com">info@cablaggitalia.com</a>
          <a href="https://www.cablaggitalia.com" target="_blank" rel="noopener">cablaggitalia.com</a>
        </div>
        <div class="col">
          <h4>${t.legal}</h4>
          <a href="privacy.html">Privacy policy</a>
          <a href="cookie.html">Cookie policy</a>
          <a href="note-legali.html">${t.legLink}</a>
        </div>
      </div>
      <div class="wm-row">
        <img src="${LOGO}" alt=""/>
        <div class="wm">Nuova <b>Elettronica.</b></div>
      </div>
      <div class="bottom">
        <span>${t.copy} <a href="note-legali.html">${t.legLink}</a></span>
        <span>Avigliana (TO) · REV. 04 / 2026</span>
      </div>
    `;
  }
  renderFooter();
  document.body.appendChild(footer);

  /* -------- LANGUAGE SWITCHER -------- */
  document.addEventListener("click",(e)=>{
    const opt = e.target.closest("[data-lang]");
    if(!opt) return;
    const newLang = opt.dataset.lang;
    if(newLang===lang) return;
    lang = newLang;
    localStorage.setItem("ne-lang",lang);
    document.documentElement.lang = lang;
    renderTopbar();
    document.body.prepend(topbar);
    topbar.appendChild(burger);
    renderMobileNav();
    renderFooter();
    applyTranslations();
    document.querySelectorAll(".lang-toggle").forEach(btn=>{
      btn.querySelectorAll("[data-lang]").forEach(s=>s.classList.toggle("active",s.dataset.lang===lang));
    });
  });

  /* -------- i18n INLINE -------- */
  const originals = new Map();

  function applyTranslations(){
    document.querySelectorAll("[data-en]").forEach(el=>{
      if(!originals.has(el)) originals.set(el, el.innerHTML);
      el.innerHTML = lang==="en" ? el.dataset.en : originals.get(el);
    });
  }
  if(lang==="en") applyTranslations();

  /* -------- INTERACTIONS -------- */
  const tb = document.getElementById("topbar");
  window.addEventListener("scroll",()=>{ tb.classList.toggle("scrolled", window.scrollY>10); },{passive:true});

  const io = new IntersectionObserver((es)=>{
    es.forEach(e=>{
      if(e.isIntersecting){ e.target.style.opacity=1; e.target.style.transform="none"; io.unobserve(e.target); }
    });
  },{threshold:.15});
  document.querySelectorAll("[data-reveal]").forEach(el=>{
    el.style.opacity=0; el.style.transform="translateY(30px)";
    el.style.transition="opacity 1s cubic-bezier(.2,.7,.2,1), transform 1s cubic-bezier(.2,.7,.2,1)";
    io.observe(el);
  });

  const counted = new WeakSet();
  const cIO = new IntersectionObserver((es)=>{
    es.forEach(e=>{
      if(!e.isIntersecting || counted.has(e.target)) return;
      counted.add(e.target);
      const el = e.target;
      const raw = el.textContent.replace(/[^\d]/g,"");
      const target = parseInt(raw,10); if(isNaN(target)) return;
      const suffix = el.textContent.match(/[^\d]*$/)[0];
      const isEm = !!el.querySelector("em");
      const dur=1500, t0=performance.now();
      (function tick(now){
        const p = Math.min(1,(now-t0)/dur);
        const v = Math.floor((1-Math.pow(1-p,3))*target);
        el.innerHTML = (isEm?"<em>":"") + v.toLocaleString("it-IT") + (isEm?"</em>":"") + suffix;
        if(p<1) requestAnimationFrame(tick);
      })(t0);
    });
  },{threshold:.4});
  document.querySelectorAll("[data-count]").forEach(n=>cIO.observe(n));

  /* -------- CONTATTO RAPIDO -------- */
  const WA_NUM = "393802189876";
  const qc = document.createElement("div");
  qc.className = "quick-contact";
  const qcStyle = document.createElement("style");
  qcStyle.textContent = `
    .quick-contact{position:fixed;right:18px;bottom:18px;z-index:60;display:flex;flex-direction:column;gap:10px}
    .quick-contact a{display:flex;align-items:center;gap:10px;justify-content:center;height:52px;min-width:52px;padding:0 16px;border-radius:26px;font-family:var(--mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;box-shadow:0 6px 18px rgba(0,0,0,.18);text-decoration:none}
    .quick-contact a svg{width:22px;height:22px;flex:none}
    .quick-contact .qc-wa{background:#25D366;color:#fff}
    .quick-contact .qc-tel{background:var(--ink);color:var(--paper)}
    .quick-contact .qc-mail{display:none}
    @media(max-width:700px){
      .quick-contact{left:0;right:0;bottom:0;flex-direction:row;gap:0;background:var(--ink);padding:8px;padding-bottom:calc(8px + env(safe-area-inset-bottom))}
      .quick-contact a{flex:1;height:46px;border-radius:0;box-shadow:none;font-size:11px;padding:0 8px}
      .quick-contact .qc-mail{display:flex;background:var(--gold);color:var(--ink)}
      body{padding-bottom:62px}
    }`;
  document.head.appendChild(qcStyle);
  function renderQuick(){
    const en = lang==="en";
    const msg = encodeURIComponent(en ? "Hello, I'm writing from cablaggitalia.com about a wiring harness." : "Buongiorno, vi scrivo dal sito cablaggitalia.com per un cablaggio.");
    qc.innerHTML = `
      <a class="qc-wa" href="https://wa.me/${WA_NUM}?text=${msg}" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg><span>WhatsApp</span></a>
      <a class="qc-tel" href="tel:+393802189876" aria-label="${en?"Call":"Chiama"}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg><span>${en?"Call":"Chiama"}</span></a>
      <a class="qc-mail" href="contatti.html"><span>${en?"Quote":"Preventivo"}</span></a>`;
  }
  renderQuick();
  document.body.appendChild(qc);
  document.addEventListener("click",(e)=>{
    const b = e.target.closest(".lang-toggle"); if(b) setTimeout(renderQuick,0);
  });

  /* -------- STATISTICHE (GoatCounter, senza cookie) -------- */
  const GC_CODE = "cablaggitalia";
  if(location.hostname.endsWith("cablaggitalia.com")){
    const gc = document.createElement("script");
    gc.async = true;
    gc.dataset.goatcounter = `https://${GC_CODE}.goatcounter.com/count`;
    gc.src = "https://gc.zgo.at/count.js";
    document.head.appendChild(gc);
  }
  function gcEvent(name){
    try{ if(window.goatcounter && window.goatcounter.count) window.goatcounter.count({path:name, title:name, event:true}); }catch(err){}
  }
  document.addEventListener("click",(e)=>{
    const a = e.target.closest("a"); if(!a) return;
    const h = a.getAttribute("href")||"";
    if(h.startsWith("tel:")) gcEvent("click-telefono");
    else if(h.includes("wa.me/")) gcEvent("click-whatsapp");
    else if(h.startsWith("mailto:")) gcEvent("click-email");
  });
  document.addEventListener("submit",(e)=>{
    if(e.target.matches("form.fields")) gcEvent("invio-modulo");
  });
})();
