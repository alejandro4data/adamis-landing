// =====================================================
// actividad-deuda-1-1-fin-tutorial.js
// Cierre de tutorial: botón verde grande y centrado que avanza de slide
// =====================================================

(function ensureStyles(){
  const STYLE_ID = 'actividad-deuda-1-1-tutorial-styles';
  if (document.getElementById(STYLE_ID)) return;
  const st = document.createElement('style');
  st.id = STYLE_ID;
  st.textContent = `
    .ad11t-wrap{
      position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
      z-index:2147483600; pointer-events:none;
    }
    .ad11t-btn{
      all:unset; pointer-events:auto; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      min-width: clamp(220px, 30vw, 360px);
      min-height: clamp(60px, 10vh, 120px);
      padding: 1.25rem 2rem;
      border-radius: 9999px;
      background: radial-gradient(circle at 30% 30%, #34d399, #059669);
      color:#fff; font-size: clamp(1.25rem, 3.2vw, 2rem); font-weight: 900; letter-spacing: .5px;
      box-shadow: 0 10px 30px rgba(0,0,0,.25);
      transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
    }
    .ad11t-btn:hover { transform: scale(1.04); filter: brightness(1.03); box-shadow: 0 14px 40px rgba(0,0,0,.32); }
    .ad11t-btn:active { transform: scale(.98); }
    .ad11t-visually-hidden { position:absolute !important; height:1px; width:1px; overflow:hidden; clip:rect(1px,1px,1px,1px); white-space:nowrap; }
  `;
  document.head.appendChild(st);
})();

function mountActividadDeudaTutorial(state = {}, root = document.body){
  // 0) APAGA cualquier overlay de foco del tutorial (si quedó alguno)
  (function clearTutorFocus(){
    try{
      // Quita listeners “reflow” guardados en el propio overlay y elimina el overlay
      document.querySelectorAll('.tut-overlay').forEach(ov => {
        try{
          if (ov.__reflow){
            window.removeEventListener('resize', ov.__reflow);
            window.removeEventListener('scroll', ov.__reflow, true);
          }
        }catch(_){}
        ov.remove();
      });

      // Elimina agujeros y tips del foco
      document.querySelectorAll('.tut-hole, .tut-tip, .tut-tip--secondary').forEach(el => el.remove());

      // Limpia clases de resaltado que elevan elementos por encima del overlay
      document.querySelectorAll('.tut-glow, .tut-glow-soft, .tut-ontop')
        .forEach(el => el.classList.remove('tut-glow','tut-glow-soft','tut-ontop'));

      // Si quedó la flecha del tutorial, quítala y sus listeners
      if (window.__TUT_ARROW){
        try{
          window.removeEventListener('resize', window.__TUT_ARROW.__reflow);
          window.removeEventListener('scroll', window.__TUT_ARROW.__reflow, true);
        }catch(_){}
        try{ window.__TUT_ARROW.remove(); }catch(_){}
        window.__TUT_ARROW = null;
      }
    }catch(_){}
  })();

  // Contenedor principal (solo para centrar el botón)
  const wrap = document.createElement('div');
  wrap.className = 'ad11t-wrap';

  // ÚNICO elemento visible: el botón grande y verde
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ad11t-btn';
  btn.setAttribute('aria-label','Continuar');
  btn.textContent = 'Continuar a Actividad';

  // --------- NUEVO: catálogo unificado de "posibles" next() ----------
  // Priorizamos lo que pueda venir del state que entrega el registry.
  function tryCall(fn, ctx) { try { return fn && fn.call(ctx); } catch(_){} }

  function advanceNow(){
    // 1) API que pueda llegar inyectada por el orquestador en "state"
    if (tryCall(state?.next, state)) return;
    if (tryCall(state?.onNext, state)) return;
    if (tryCall(state?.goNext, state)) return;
    if (state?.controller && tryCall(state.controller.next, state.controller)) return;
    if (state?.slides && tryCall(state.slides.next, state.slides)) return;

    // 2) API globales habituales de players/orquestadores
    if (tryCall(window.SlideActions?.next, window.SlideActions)) return;
    if (tryCall(window.SlideActions?.confirmAndNext, window.SlideActions)) return;
    if (tryCall(window.gotoNextSlide, window)) return;
    if (tryCall(window.GoTo?.next, window.GoTo)) return;
    if (tryCall(window.Player?.next, window.Player)) return;
    if (tryCall(window.App?.nextSlide, window.App)) return;
    if (tryCall(window.API?.slides?.next, window.API?.slides)) return;

    // 3) Controles declarativos en el DOM / data-attrs
    const domTargets = [
      '[data-action="next"]',
      '[data-action="next-slide"]',
      '[data-nav="next"]',
      '.btn-next',
      'button.next',
      'a.next',
      '[rel="next"]'
    ];
    for (const sel of domTargets) {
      const el = document.querySelector(sel);
      if (el) { try { el.click(); return; } catch(_){} }
    }

    // 4) Eventos para que un orquestador los capture
    try { document.dispatchEvent(new CustomEvent('slides:next')); } catch(_){}
    try { window.dispatchEvent(new Event('slides:next')); } catch(_){}
    try { document.dispatchEvent(new CustomEvent('actividad:nextSlide')); } catch(_){}
    try { window.parent?.postMessage?.({ type:'slide-next' }, '*'); } catch(_){}
  }

let used = false;
function goNext(ev){
  if (used) return;
  used = true;

  // ⚠️ Importante: no detener propagación ni default del click,
  // así el handler global de "avanzar" recibe el evento del botón.
  // (Solo prevenimos el scroll si la tecla fue Space, pero no paramos burbujeo)

  // Retiramos el botón antes de avanzar para no interferir con el siguiente slide
  try { wrap.remove(); } catch(_){}

  // --- RESET de estado al finalizar el tutorial ---
  try {
    const st = (window.DeudaHelpers?.ensureState
      ? window.DeudaHelpers.ensureState()
      : (window.ACT_DEUDA_STATE ||= {}));

    st.saldo = 0;
    st.impatience = 0;

    // (Opcional) si usas animaciones que leen este cache, limpia también:
    // window.ACT_DEUDA_LAST_SALDO = 0;
  } catch (_) {}
// --- fin RESET ---


  // Disparamos la lógica de avance "directa"
  advanceNow();

  // Cinturón y tirantes: generamos un click sintético al fondo
  // por si el orquestador espera un click en document/body.
  setTimeout(() => {
    try {
      const target = document.body || document.documentElement || document;
      // Lanzamos pointerup y click por compatibilidad
      target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    } catch(_) {}
  }, 0);

  // Reintentos escalonados (por si el orquestador se engancha tarde)
  setTimeout(advanceNow, 40);
  setTimeout(advanceNow, 120);
  setTimeout(advanceNow, 240);
}


  btn.addEventListener('click', goNext);
  // Accesibilidad: Enter o Space también activan el botón
btn.addEventListener('keydown', (ev)=>{
  const k = ev.key?.toLowerCase();
  if (k === ' ') ev.preventDefault(); // evita scroll, pero no paramos la propagación
  if (k === 'enter' || k === ' ') goNext(ev);
});


  wrap.appendChild(btn);
  (root || document.body).appendChild(wrap);

  // Foco inicial en el botón
  try { btn.focus({ preventScroll:true }); } catch(_){}

  // API mínima por si el orquestador quiere desmontar
  return {
    goNext,
    destroy(){ try { wrap.remove(); } catch(_){} }
  };
}

// Registro del renderer con fallback a montaje directo
(function ensureRegister(name, fn){
  const start = Date.now();
  (function tick(){
    if (window.SlideRendererRegistry?.register) {
      // IMPORTANTE: ahora pasamos state y root al mount
      window.SlideRendererRegistry.register(name, function(state, root){
        return fn(state, root);
      });
    } else if (Date.now() - start < 1000) {
      setTimeout(tick, 40);
    } else {
      // Si no hay registry, montamos directamente
      try { fn({}, document.body); } catch(_){}
    }
  })();
})('actividad-deuda-1-1-fin-tutorial', function(state, root){
  return mountActividadDeudaTutorial(state, root);
});
