/* =====================================================
   app.js — Motor de slides con arquitectura de “renderers” pluggable
   - Registro global de plantillas: SlideRendererRegistry
   - Carga dinámica: si falta un renderer, lo autoload desde /renderers/<tipo>.js
   - Mantiene compatibilidad con Slide(), SlideTituloClase(), etc. de slides.js
   - Bloqueo de lectura por WPS, typewriter, progreso y navegación
   ===================================================== */
   
/* -------- Botón global de Logout (todas las páginas menos login) -------- */
/* ===== Botón global de Logout + Modal de confirmación ===== */
(() => {
  const PAGE = document.documentElement.getAttribute('data-page') || '';
  if (PAGE === 'login' || PAGE === 'splash') return;

  window.addEventListener('DOMContentLoaded', () => {
    // 1) Botón fijo arriba-derecha
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'logout-integrated btn';       // tus estilos base; puedes añadir otra clase si quieres
    btn.setAttribute('aria-label', 'Cerrar sesión');
    btn.textContent = 'Salir';
    document.body.appendChild(btn);

    // 2) Modal (inyección única)
    const modal = document.createElement('div');
    modal.className = 'logout-modal';
    modal.innerHTML = `
      <div class="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title" aria-describedby="logout-desc">
        <div class="logout-head">
          <h2 id="logout-title" class="logout-title">¿Cerrar sesión?</h2>
          <button class="logout-close" aria-label="Cerrar">✕</button>
        </div>
        <div id="logout-desc" class="logout-body">
          Vas a salir de tu sesión. Podrás volver a entrar cuando quieras.
        </div>
        <div class="logout-actions">
          <button class="btn btn-cancel" data-action="cancel">Cancelar</button>
          <button class="btn btn-primary" data-action="confirm">Cerrar sesión</button>
          <!-- Si prefieres dorado, cambia btn-primary por btn-coin -->
        </div>
      </div>`;
    document.body.appendChild(modal);

    // Utilidades de apertura/cierre con trampa de foco
    const dialog = modal.querySelector('.logout-dialog');
    const closeBtn = modal.querySelector('.logout-close');
    const cancelBtn = modal.querySelector('[data-action="cancel"]');
    const confirmBtn = modal.querySelector('[data-action="confirm"]');
    const focusablesSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    let lastFocused = null;

    function openModal() {
      lastFocused = document.activeElement;
      modal.classList.add('is-open');
      // foco al primer botón
      (confirmBtn || dialog).focus();
      document.addEventListener('keydown', onKeydown);
      modal.addEventListener('click', onBackdrop);
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.removeEventListener('keydown', onKeydown);
      modal.removeEventListener('click', onBackdrop);
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    function onBackdrop(e) {
      if (e.target === modal) closeModal(); // clic fuera
    }

    function onKeydown(e) {
      if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
      if (e.key === 'Tab') {
        const focusables = dialog.querySelectorAll(focusablesSelector);
        if (!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    // Listeners
    btn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    confirmBtn.addEventListener('click', () => {
      try { localStorage.removeItem('currentUser'); } catch (e) {}
      
      window.location.href = '../../splash.html'; 
    });
  });
})();



/* -------- Registro global de renderers (siempre disponible) -------- */
(() => {
  'use strict';
  const REG = Object.create(null);

  window.SlideRendererRegistry = {
    register(tipo, factory){
      const key = String(tipo || '').toLowerCase().trim();
      if (!key || typeof factory !== 'function') return;
      REG[key] = factory;
    },
    get(tipo){
      const key = String(tipo || '').toLowerCase().trim();
      return REG[key] || null;
    },
    has(tipo){
      const key = String(tipo || '').toLowerCase().trim();
      return !!REG[key];
    }
  };
})();

/* -------- Carga dinámica de /renderers/<tipo>.js -------- */
const __SLIDE_RENDERER_LOADS__ = Object.create(null);
function ensureRendererLoaded(tipo){
  const key = String(tipo || '').toLowerCase().trim();
  if (window.SlideRendererRegistry.get(key)) return Promise.resolve(true);
  if (__SLIDE_RENDERER_LOADS__[key]) return __SLIDE_RENDERER_LOADS__[key];

  // Nota: pages/clase.html está una carpeta por debajo, así que subimos con ..
  const url = `../renderers/${key}.js`;
  __SLIDE_RENDERER_LOADS__[key] = new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = url;
    s.async = true;
    s.onload  = () => resolve(!!window.SlideRendererRegistry.get(key));
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
  return __SLIDE_RENDERER_LOADS__[key];
}

/* -------- Motor sólo en la página "clase" -------- */
(() => {
  'use strict';
  const PAGE = document.documentElement.getAttribute('data-page') || '';
  if (PAGE !== 'clase') return;

  // ----- refs -----
  const slideRoot   = document.getElementById('slide-root');
  const btnNext     = document.getElementById('btn-next') || null;
  const btnPrev     = document.getElementById('btn-prev') || null;
  const progressBar = document.querySelector('#clase .progress__bar') || null;
  if (!slideRoot) return;

  // ----- config global -----
    const CFG = {
      lockEnabled: true, // valor por defecto
      lockWPS: (typeof window.SLIDE_READ_WPS === 'number' && window.SLIDE_READ_WPS > 0)
        ? window.SLIDE_READ_WPS : 3.5
    };

    // --- Desactiva el bloqueo si estamos en una actividad interactiva de deuda ---
    const DEUDA_ACTIVITY_TYPES = [
      'actividad-deuda-1-1',
      'actividad-deuda-1-2',
      'actividad-deuda-1-3',
      'actividad-deuda-1-4',
      'actividad-deuda-1s',
      'actividad-deuda-1-1-tutorial',
      'actividad-deuda-1-1-fin-tutorial'
    ];

    // Hook temporal hasta que se renderice la primera slide
    const _origRenderCurrent = renderCurrent;
    renderCurrent = function() {
      const slides = window.slides || [];
      const current = slides[i] || {};
      const tipo = (current.tipo || '').toLowerCase();

      // Si es una actividad de deuda -> desactiva bloqueo
      if (window.CURRENT_CLASS === 'deuda' && DEUDA_ACTIVITY_TYPES.includes(tipo)) {
        CFG.lockEnabled = false;
      } else {
        CFG.lockEnabled = true;
      }

      // Llama al render original
      return _origRenderCurrent.apply(this, arguments);
    };



  // ----- state -----
  let i = 0;
  let typingInProgress = false;
  let activeTypers = [];
  let unlockAt = 0;
  let lockTicker = null;

  const IS_TOUCH   = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const CONT_LABEL = IS_TOUCH ? 'Toca para continuar' : 'Haz clic para continuar';

  // ----- utils -----
  const clear = (n) => { while (n.firstChild) n.removeChild(n.firstChild); };
  const pct = (v) => (typeof v === 'number' ? (v <= 1 ? (v*100)+'%' : v+'px') : String(v ?? '80%'));
  const setVar = (el, name, val) => { if (val != null) el.style.setProperty(name, val); };
  const imagePosFromTextPos = (pos) => {
    switch((pos || 'right').toLowerCase()){
      case 'left':   return 'right';
      case 'right':  return 'left';
      case 'top':    return 'bottom';
      case 'bottom': return 'top';
      default:       return 'right';
    }
  };

  function wordCount(str){
    if (!str) return 0;
    const m = String(str).trim().match(/\p{L}[\p{L}\p{M}\p{Nd}'’\-]*/gu);
    return m ? m.length : 0;
  }
  const readMsFromText = (text, wps) =>
    Math.max(0, Math.round((wordCount(text) / (wps || 2.9)) * 1000));

  // ----- typewriter -----
  function typeIn(el, fullText, speed, onDone){
    let idx = 0; let done = false;
    el.textContent = '';
    typingInProgress = true;

    const timer = setInterval(() => {
      if (idx >= fullText.length){
        clearInterval(timer);
        done = true;
        typingInProgress = activeTypers.some(t => !t._done);
        if (typeof onDone === 'function') onDone();
        return;
      }
      el.textContent += fullText.charAt(idx++);
    }, Math.max(4, speed|0));

    return {
      _finish(){
        if (done) return;
        clearInterval(timer);
        el.textContent = fullText;
        done = true;
        if (typeof onDone === 'function') onDone();
      },
      get _done(){ return done; }
    };
  }
  function registerTyper(t){
    if (!t) return;
    activeTypers.push(t);
    typingInProgress = activeTypers.some(x => !x._done);
  }
  function stopOrFinishTyping(finishInstant = true){
    if (!activeTypers.length) return false;
    activeTypers.forEach(t => { if (finishInstant) t._finish(); });
    activeTypers = [];
    typingInProgress = false;
    return true;
  }

  // ----- hint helpers -----
  function makeHint(label = CONT_LABEL){
    const contHint = document.createElement('div');
    contHint.className = 'cont-hint';
    contHint.innerHTML = `<span class="label">${label}</span><i></i><i></i><i></i>`;
    const labelEl = contHint.querySelector('.label');
    const api = {
      el: contHint,
      setLabel(t){ if (labelEl) labelEl.textContent = t; },
      show(){ contHint.classList.add('is-visible'); },
      hide(){ contHint.classList.remove('is-visible'); }
    };
    return api;
  }

  // ----- reward helpers -----
  function coinifyTextToNodes(text){
    const frag = document.createDocumentFragment();
    const s = String(text || '');
    const re = /(\d+)/g;
    let last = 0, m;
    while ((m = re.exec(s)) !== null){
      if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
      frag.appendChild(document.createTextNode(m[1]));
      const img = document.createElement('img');
      img.className = 'reward__coin';
      img.alt = 'moneda';
      img.src = '../assets/icons/coin_ranking.png';
      frag.appendChild(img);
      last = m.index + m[0].length;
    }
    if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    return frag;
  }
  function makeRewardBox(text){
    const box = document.createElement('div');
    box.className = 'reward';
    const title = document.createElement('div');
    title.className = 'reward__title';
    title.textContent = 'Recompensa';
    const p = document.createElement('p');
    p.className = 'reward__text';
    p.appendChild( coinifyTextToNodes(text) );
    box.appendChild(title);
    box.appendChild(p);
    return { el: box, plain: String(text || '') };
  }

  const updateProgress = () => {
    if (!progressBar || !Array.isArray(window.slides) || !window.slides.length) return;
    const p = (i / Math.max(1, window.slides.length - 1)) * 100;
    progressBar.style.width = Math.max(0, Math.min(100, p)) + '%';
  };
  const updateNav = () => {
    const has = Array.isArray(window.slides) && window.slides.length > 0;
    if (btnNext) btnNext.disabled = !has || i >= window.slides.length - 1;
    //if (btnPrev) btnPrev.disabled = !has || i <= 0;
  };

  // ----- contexto que reciben los renderers -----
  function getCtx(){
    return {
      CONT_LABEL,
      setVar, pct, imagePosFromTextPos,
      makeHint, makeRewardBox,
      typeIn, registerTyper
    };
  }

  // ----- render master -----
  function renderCurrent(){
    // limpiar
    const olds = slideRoot.querySelectorAll('.slide');
    if (olds.length){
      olds.forEach(n => { n.classList.add('is-exiting'); n.style.pointerEvents = 'none'; n.remove(); });
    }
    stopOrFinishTyping(true);
    unlockAt = 0;
    if (lockTicker){ clearInterval(lockTicker); lockTicker = null; }

    const slides = window.slides || [];
    if (!slides.length){
      const empty = document.createElement('div');
      empty.className = 'slide empty-state';
      empty.innerHTML = '<div class="empty-state__text">Sin diapositivas aún</div>';
      slideRoot.appendChild(empty);
      updateNav(); updateProgress();
      return;
    }

    const s0 = slides[i] || {};
    const s = Object.assign({}, s0);
    const rawTipo = (s.tipo || '').toLowerCase().trim();
    let tipo = rawTipo;
    if (!tipo || tipo === 'explicacion') tipo = 'explicacion-bocadillo';

    const root = document.createElement('article');
    root.className = 'slide';
    slideRoot.appendChild(root);

    // Asegurar que el renderer existe (autoload si falta)
    let factory = window.SlideRendererRegistry.get(tipo);
    if (!factory){
      root.classList.add('loading');
      root.innerHTML = '<div class="empty-state__text">Cargando plantilla…</div>';
      ensureRendererLoaded(tipo).then((ok) => {
        if (!ok && tipo !== 'explicacion-bocadillo'){
          // Fallback a explicacion-bocadillo si no existe el tipo solicitado
          ensureRendererLoaded('explicacion-bocadillo').then(() => renderCurrent());
        } else {
          renderCurrent();
        }
      });
      return;
    }

    // Render real
    let view = null;
    try {
      view = factory(s, root, getCtx());
    } catch(_e){
      // fallback robusto
      if (tipo !== 'explicacion-bocadillo'){
        ensureRendererLoaded('explicacion-bocadillo').then(() => { i=Math.max(0,i); renderCurrent(); });
        return;
      } else {
        root.innerHTML = '<div class="empty-state__text">No se pudo renderizar esta diapositiva.</div>';
      }
    }

    // ---- bloqueo de lectura ----
    const lockMs = (CFG.lockEnabled && !(view && view.noLock))
      ? readMsFromText(view.lockText || '', CFG.lockWPS)
      : 0;

    function setLockAndStartCountdown(ms){
      if (!view || !view.hint) return;
      if (!ms || ms <= 0){
        unlockAt = 0;
        if (lockTicker){ clearInterval(lockTicker); lockTicker = null; }
        view.hint.setLabel(CONT_LABEL);
        view.hint.show();
        return;
      }
      unlockAt = performance.now() + ms;
      if (lockTicker){ clearInterval(lockTicker); }
      lockTicker = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((unlockAt - performance.now()) / 1000));
        if (remaining > 0){
          view.hint.setLabel(`${remaining} s…`);
        } else {
          view.hint.setLabel(CONT_LABEL);
          unlockAt = 0; 
          clearInterval(lockTicker);
          lockTicker = null;
        }
      }, 200);
      view.hint.show();
    }
    setLockAndStartCountdown(lockMs);

    // ---- typewriter si aplica ----
    if (view && typeof view.bindTyping === 'function') view.bindTyping();

    // ---- interacción global (click/teclas) ----
    function tryAdvance(){
      if (typingInProgress){
        stopOrFinishTyping(true);
        return;
      }
      const now = performance.now();
      if (unlockAt > 0 && now < unlockAt){
        return;
      }
      if (view && view.hint) view.hint.hide();
      goNext();
    }

    if (view && typeof view.bindControls === 'function') {
      view.bindControls(tryAdvance);
    }

    if (!(view && view.suppressRootClick) || tipo === 'explicacion-actividad'){
      root.addEventListener('click', tryAdvance);
    }

    updateNav();
    updateProgress();
  }

  // ----- navegación -----
  function goNext(){
    const slides = window.slides || [];
    if (!slides.length) return;
    if (typingInProgress){ stopOrFinishTyping(true); return; }
    if (i < slides.length - 1){ i++; renderCurrent(); }
  }
  function goPrev(){
    const slides = window.slides || [];
    if (!slides.length) return;
    if (i > 0){ i--; renderCurrent(); }
  }
  function setIndex(n){
    const slides = window.slides || [];
    if (!slides.length) return;
    const idx = Math.max(0, Math.min(slides.length - 1, n|0));
    if (idx !== i){ i = idx; renderCurrent(); }
  }

  if (btnNext) btnNext.addEventListener('click', (e) => { e.preventDefault(); goNext(); });
  //if (btnPrev) btnPrev.addEventListener('click', (e) => { e.preventDefault(); goPrev(); });

  // Listener de EXCEPCIÓN: Ctrl+Alt+Flechas -> navegación forzada
  window.addEventListener('keydown', (ev) => {
    if (!(ev.ctrlKey && ev.altKey)) return;

    if (ev.key === 'ArrowRight') {
      // Avanzar SIEMPRE (aunque haya bloqueo/tipeo)
      ev.preventDefault();
      stopOrFinishTyping(true);
      unlockAt = 0;
      if (lockTicker){ clearInterval(lockTicker); lockTicker = null; }
      goNext();
    } else if (ev.key === 'ArrowLeft') {
      // Retroceder SIEMPRE (aunque haya bloqueo/tipeo)
      ev.preventDefault();
      stopOrFinishTyping(true);
      unlockAt = 0;
      if (lockTicker){ clearInterval(lockTicker); lockTicker = null; }
      goPrev();
    }
  });


  // inicial
  renderCurrent();

  window.__slidesAPI__ = {
    next: goNext,
    prev: goPrev,
    goto: setIndex,
    reload(){ i = 0; renderCurrent(); }
  };
})();

/* ===== Envío de encuestas al backend (guardar en archivo) ===== */
(() => {
  // 4) IMPORTANTE: URL del endpoint en IONOS (PHP)
  const API_URL = '/api/save.php';

  function getCurrentUser(){
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return null;
      const u = JSON.parse(raw);
      return {
        id: u?.id || u?.uid || null,
        name: u?.name || u?.username || null,
        email: u?.email || null,
        raw: u
      };
    } catch(_e){
      return null;
    }
  }

  async function postEncuesta(payload){
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('[encuesta] No se pudo enviar al backend. ¿ save.php existe y tiene permisos?', e);
    }
  }

  // Escucha cuando se envía una encuesta
  window.addEventListener('encuesta:submit', (ev) => {
    const d = ev.detail || {};
    const clase = (window.CURRENT_CLASS || '').toLowerCase() || 'desconocida';

    // d = { id, mode, question, value, ts, meta }
    const payload = {
      clase,
      id: d.id,
      mode: d.mode,
      question: d.question,
      value: d.value,
      ts: d.ts,
      meta: d.meta || null,
      user: getCurrentUser()
    };
    postEncuesta(payload);
  });
})();


/* ===== Envío de CUADROS DE REFLEXIÓN al backend ===== */
(() => {
  const API_URL_REFLEX = '/api/save_reflexion.php';

  function getCurrentUser(){
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return null;
      const u = JSON.parse(raw);
      return { id: u?.id || u?.uid || null, name: u?.name || u?.username || null, email: u?.email || null, raw: u };
    } catch { return null; }
  }

  async function postReflexion(payload){
    try{
      await fetch(API_URL_REFLEX, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
    } catch(e){
      console.warn('[reflexion] No se pudo enviar al backend:', e);
    }
  }

  window.addEventListener('reflexion:submit', (ev) => {
    const d = ev.detail || {};
    const clase = (window.CURRENT_CLASS || '').toLowerCase() || 'desconocida';

    const payload = {
      clase,
      id: d.id || 'reflexion',
      question: d.question || '',
      answer: d.answer ?? d.value ?? '',
      value: d.value ?? d.answer ?? '',
      ts: d.ts || Date.now(),
      meta: d.meta || null,
      result: d.result || null,
      user: getCurrentUser()
    };
    postReflexion(payload);
  });
})();
