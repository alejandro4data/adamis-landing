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
  const tr = (value, vars) => {
    if (!window.I18N) return String(value || '');
    const mapped = window.I18N.tr(String(value || ''));
    if (!vars) return mapped;
    return mapped.replace(/\{(\w+)\}/g, (_m, k) =>
      Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : `{${k}}`
    );
  };

  window.addEventListener('DOMContentLoaded', () => {
    // 1) Botón fijo arriba-derecha (rueda de ajustes)
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'logout-integrated btn settings-gear-btn';
    btn.setAttribute('aria-label', tr('Ajustes'));
    btn.title = tr('Ajustes');
    btn.textContent = '';
    btn.style.backgroundImage = "url('../assets/icons/engranaje.png')";
    btn.style.backgroundRepeat = 'no-repeat';
    btn.style.backgroundPosition = 'center';
    btn.style.backgroundSize = '35px 35px';
    btn.style.minWidth = '64px';
    btn.style.minHeight = '64px';
    document.body.appendChild(btn);

    const menu = document.createElement('div');
    menu.className = 'logout-modal';
    menu.style.background = 'transparent';
    menu.style.alignItems = 'flex-start';
    menu.style.justifyContent = 'flex-end';
    menu.style.padding = '68px 16px 0 0';
    menu.innerHTML = `
      <div class="logout-dialog" style="max-width:260px;width:min(260px,92vw);padding:10px;">
        <div class="logout-actions" style="display:flex;flex-direction:column;gap:8px;">
          <button class="btn btn-cancel" data-action="lang">${tr('Idioma')}: ${(window.I18N?.getLang?.() || 'es').toUpperCase()}</button>
          <button class="btn btn-primary" data-action="logout">${tr('Salir')}</button>
        </div>
      </div>`;
    document.body.appendChild(menu);

    // 2) Modal (inyección única)
    const modal = document.createElement('div');
    modal.className = 'logout-modal';
    modal.innerHTML = `
      <div class="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title" aria-describedby="logout-desc">
        <div class="logout-head">
          <h2 id="logout-title" class="logout-title">${tr('¿Cerrar sesión?')}</h2>
          <button class="logout-close" aria-label="${tr('Cerrar')}">✕</button>
        </div>
        <div id="logout-desc" class="logout-body">
          ${tr('Vas a salir de tu sesión. Podrás volver a entrar cuando quieras.')}
        </div>
        <div class="logout-actions">
          <button class="btn btn-cancel" data-action="cancel">${tr('Cancelar')}</button>
          <button class="btn btn-primary" data-action="confirm">${tr('Cerrar sesión')}</button>
          <!-- Si prefieres dorado, cambia btn-primary por btn-coin -->
        </div>
      </div>`;
    document.body.appendChild(modal);

    // Utilidades de apertura/cierre con trampa de foco
    const dialog = modal.querySelector('.logout-dialog');
    const closeBtn = modal.querySelector('.logout-close');
    const cancelBtn = modal.querySelector('[data-action="cancel"]');
    const confirmBtn = modal.querySelector('[data-action="confirm"]');
    const langBtn = menu.querySelector('[data-action="lang"]');
    const logoutBtn = menu.querySelector('[data-action="logout"]');
    const focusablesSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    let lastFocused = null;

    function openModal() {
      menu.classList.remove('is-open');
      lastFocused = document.activeElement;
      modal.classList.add('is-open');
      // foco al primer botón
      (confirmBtn || dialog).focus();
      document.addEventListener('keydown', onKeydown);
      modal.addEventListener('click', onBackdrop);
    }

    function openMenu() {
      menu.classList.add('is-open');
      langBtn?.focus();
      document.addEventListener('keydown', onMenuKeydown);
      menu.addEventListener('click', onMenuBackdrop);
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      document.removeEventListener('keydown', onMenuKeydown);
      menu.removeEventListener('click', onMenuBackdrop);
    }

    function onMenuBackdrop(e) {
      if (e.target === menu) closeMenu();
    }

    function onMenuKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
      }
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
    btn.addEventListener('click', () => {
      if (menu.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
    logoutBtn?.addEventListener('click', openModal);
    langBtn?.addEventListener('click', () => {
      if (!window.I18N || typeof window.I18N.toggleLang !== 'function') return;
      window.I18N.toggleLang();
      window.location.reload();
    });
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    confirmBtn.addEventListener('click', () => {
      // 1) Limpiar datos de sesión (lo importante en aula)
      try { sessionStorage.clear(); } catch (_e) {}

      // 2) Limpiar restos legacy (por si en algún PC quedaron respuestas antiguas en localStorage)
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && k.startsWith('poll:')) localStorage.removeItem(k);
        }
        localStorage.removeItem('currentUser');
      } catch (_e) {}

      // 3) Volver al splash
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
const __RENDERER_BASE_SCRIPTS__ = [
  '../renderers/common/base/renderer-utils.js'
];
let __RENDERER_BASE_PROMISE__ = null;
const __COMMON_BLOCK_RENDERERS__ = new Set([
  'cuadro-reflexion',
  'dinamica-actividad',
  'explicacion-actividad',
  'explicacion-bocadillo',
  'moraleja',
  'sabias-que',
  'termino-intro',
  'titulo-actividad',
  'titulo-clase'
]);
const __COMMON_ROOT_RENDERERS__ = new Set([
  'encuesta',
  'encuesta-multiple',
  'encuesta-texto',
  'encuesta-escala'
]);

function loadSequential(urls, idx = 0) {
  if (!Array.isArray(urls) || idx >= urls.length) return Promise.resolve(false);
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = urls[idx];
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  }).then((ok) => ok ? true : loadSequential(urls, idx + 1));
}

function ensureRendererLoaded(tipo){
  const key = String(tipo || '').toLowerCase().trim();
  if (window.SlideRendererRegistry.get(key)) return Promise.resolve(true);
  if (__SLIDE_RENDERER_LOADS__[key]) return __SLIDE_RENDERER_LOADS__[key];

  // Cargar base común una sola vez (helpers compartidos)
  if (!__RENDERER_BASE_PROMISE__) {
    __RENDERER_BASE_PROMISE__ = loadSequential(__RENDERER_BASE_SCRIPTS__);
  }

  // Rutas candidatas según convención de carpetas
  const candidateUrls = (() => {
    const urls = [];
    if (key.startsWith('actividad-deuda-')) {
      urls.push(`../renderers/deuda/actividad-1/${key}.js`);
    } else if (key.startsWith('actividad-ahorro-')) {
      urls.push(`../renderers/ahorro/actividad-1/${key}.js`);
    }

    // Comunes reorganizados por tipo
    if (key.startsWith('miniactividad-')) {
      urls.push(`../renderers/common/miniactividades/${key}.js`);
    } else if (__COMMON_BLOCK_RENDERERS__.has(key)) {
      urls.push(`../renderers/common/bloques/${key}.js`);
    }

    // Comunes en raiz (p.ej. encuesta)
    if (__COMMON_ROOT_RENDERERS__.has(key)) {
      urls.push(`../renderers/common/${key}.js`);
    }

    // Legacy raíz (compatibilidad)
    urls.push(`../renderers/${key}.js`);
    return urls;
  })();

  __SLIDE_RENDERER_LOADS__[key] = __RENDERER_BASE_PROMISE__.then(() =>
    loadSequential(candidateUrls).then((ok) => ok && !!window.SlideRendererRegistry.get(key))
  );
  return __SLIDE_RENDERER_LOADS__[key];
}

/* -------- Motor sólo en la página "clase" -------- */
(() => {
  'use strict';
  const PAGE = document.documentElement.getAttribute('data-page') || '';
  if (PAGE !== 'clase') return;
  const tr = (value) => (window.I18N ? window.I18N.tr(String(value || '')) : String(value || ''));
  const tCommon = (key, fallback) => {
    if (!window.I18N || typeof window.I18N.t !== 'function') return fallback;
    return window.I18N.t(key);
  };

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
      'actividad-deuda-1-1-tutorial-v2'
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
  const CONT_LABEL = IS_TOUCH
    ? tCommon('common.touchContinue', 'Toca para continuar')
    : tCommon('common.clickContinue', 'Haz clic para continuar');
  const CLASS_LEVEL_BY_ID = { ahorro: 10, deuda: 11, emprendimiento: 13 };
  const classIdFromUrl = () => {
    try { return new URLSearchParams(window.location.search).get('clase') || ''; }
    catch (_) { return ''; }
  };
  const getActiveClassId = () => String(window.CURRENT_CLASS || classIdFromUrl()).toLowerCase();
  const markClassCompletedIfNeeded = (idx, total) => {
    if (total <= 0 || idx !== total - 1) return;
    const level = CLASS_LEVEL_BY_ID[getActiveClassId()];
    if (!level) return;
    try { localStorage.setItem(`class_completed_${level}`, 'true'); } catch (_) {}
  };

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
    title.textContent = tr('Recompensa');
    const p = document.createElement('p');
    p.className = 'reward__text';
    const translated = tr(String(text || ''));
    p.appendChild( coinifyTextToNodes(translated) );
    box.appendChild(title);
    box.appendChild(p);
    return { el: box, plain: translated };
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

    // Si todavía no han cargado/generado slides, muestra "Cargando..." y reintenta
    if (!slides.length) {
      const loading = document.createElement('div');
      loading.className = 'slide empty-state';
      loading.innerHTML = `<div class="empty-state__text">${tCommon('common.loading', 'Cargando...')}</div>`;
      slideRoot.appendChild(loading);
      updateNav(); updateProgress();

      // Reintento corto para esperar a que slides.js termine
      setTimeout(() => {
        // Solo re-render si seguimos en página clase y el root sigue ahí
        if (document.documentElement.getAttribute('data-page') === 'clase' && slideRoot.isConnected) {
          renderCurrent();
        }
      }, 120);

      return;
    }



    markClassCompletedIfNeeded(i, slides.length);

    const s0 = slides[i] || {};
    let s = Object.assign({}, s0);
    if (window.I18N && typeof window.I18N.translateSlideValue === 'function') {
      s = window.I18N.translateSlideValue(s0, null);
    }
    const rawTipo = (s.tipo || '').toLowerCase().trim();
    let tipo = rawTipo;
    // 🔓 Desbloquea encuesta general al ENTRAR en cualquier slide de tipo "encuesta"
    try {
      if (tipo === 'encuesta') {
        sessionStorage.setItem('general_survey_unlocked', 'true');
      }
    } catch (_e) {}

    if (!tipo || tipo === 'explicacion') tipo = 'explicacion-bocadillo';

    const root = document.createElement('article');
    root.className = 'slide';
    slideRoot.appendChild(root);

    // Asegurar que el renderer existe (autoload si falta)
    let factory = window.SlideRendererRegistry.get(tipo);
    if (!factory){
      root.classList.add('loading');
      root.innerHTML = `<div class="empty-state__text">${tCommon('common.loadingTemplate', 'Cargando plantilla...')}</div>`;
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
        root.innerHTML = `<div class="empty-state__text">${tCommon('common.renderError', 'No se pudo renderizar esta diapositiva.')}</div>`;
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

  // Compatibilidad con renderers legacy (deuda) que usan SlideActions.next()
  window.SlideActions = window.__slidesAPI__;
})();

