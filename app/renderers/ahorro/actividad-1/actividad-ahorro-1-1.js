(() => {
  'use strict';

  // ======= Estado y helpers compartidos =======
  const DEF = {
    coins: 0,
    happiness: 50, // 0..100
    setpoints: { sp1: 30, sp2: 60, sp3: 100 }, // <sp1 rojo, [sp1..sp2) naranja, [sp2..sp3] verde
    zoneIcons: { red:'', orange:'', green:'' },
    coinIcon: '../assets/icons/coin_ranking.png'
  };
  function getState(){
    const s = (window.ACT_AHORRO_STATE ||= {});
    if (typeof s.coins !== 'number') s.coins = DEF.coins;
    if (typeof s.happiness !== 'number') s.happiness = DEF.happiness;
    if (!s.setpoints) s.setpoints = {...DEF.setpoints};
    if (!s.zoneIcons) s.zoneIcons = {...DEF.zoneIcons};
    if (!s.coinIcon) s.coinIcon = DEF.coinIcon;
    return s;
  }
  const clamp01 = (x)=> Math.max(0, Math.min(1, x));
  const clamp100 = (x)=> Math.max(0, Math.min(100, x));
  function zoneOf(h, {sp1, sp2}){ return h < sp1 ? 'red' : (h < sp2 ? 'orange' : 'green'); }
  function fmtDelta(n){ const sign = n>0?'+':(n<0?'-':'±'); return `${sign}${Math.abs(n)}`; }
  function applyColorsForZone(el, z){
    const map = { red:'var(--pill-red, #ef4444)', orange:'var(--pill-orange, #f59e0b)', green:'var(--pill-green, #22c55e)' };
    const c = map[z] || map.green;
    el.style.setProperty('--pill-color', c);
    el.parentElement?.style?.setProperty('--pill-color', c); // el padre de .pill__fill ahora es .pill__well
    el.parentElement?.parentElement?.style?.setProperty('--pill-color', c); // y su padre es .pill
  }
  function setFill(pillFillEl, happiness, sps){
    const z = zoneOf(happiness, sps);
    applyColorsForZone(pillFillEl, z);
    pillFillEl.style.height = `${clamp100(happiness)}%`;
  }

    // --- Escalado responsivo de escenario ---
  // --- Escalado responsivo de escenario (corrige corte de footer) ---
function installFitToScreen(stageEl, targetEl, opts = {}){
  const padding  = Number.isFinite(opts.padding)  ? opts.padding  : 16;
  const maxScale = Number.isFinite(opts.maxScale) ? opts.maxScale : 1;
  const minScale = Number.isFinite(opts.minScale) ? opts.minScale : 0.5;
  const bleed    = Number.isFinite(opts.bleed)    ? opts.bleed    : 8; // holgura anti-corte

  targetEl.classList.add('fit-target');

  // Mide el tamaño "real" del contenido, incluyendo hijos absolutos/sombras
  function measureNaturalSize(){
    const prevT = targetEl.style.transform;
    const prevTop = targetEl.style.top;
    const prevLeft = targetEl.style.left;

    // quita transform y centra anclando en 0,0 para medir
    targetEl.style.transform = 'none';
    targetEl.style.top = '0';
    targetEl.style.left = '0';

    const rootRect = targetEl.getBoundingClientRect();
    let minX = 0, minY = 0, maxX = targetEl.offsetWidth, maxY = targetEl.offsetHeight;

    // une los rects de todos los descendientes
    const all = targetEl.querySelectorAll('*');
    for (let i = 0; i < all.length; i++){
      const r = all[i].getBoundingClientRect();
      // coordenadas relativas al target
      const x1 = r.left - rootRect.left;
      const y1 = r.top  - rootRect.top;
      const x2 = r.right - rootRect.left;
      const y2 = r.bottom - rootRect.top;
      if (x1 < minX) minX = x1;
      if (y1 < minY) minY = y1;
      if (x2 > maxX) maxX = x2;
      if (y2 > maxY) maxY = y2;
    }

    const natW = (maxX - minX) + bleed * 2;
    const natH = (maxY - minY) + bleed * 2;

    // restaura
    targetEl.style.transform = prevT;
    targetEl.style.top = prevTop;
    targetEl.style.left = prevLeft;

    return { w: Math.ceil(natW), h: Math.ceil(natH) };
  }

  function applyScale(){
    const W = stageEl.clientWidth  - padding * 2;
    const H = stageEl.clientHeight - padding * 2;
    if (W <= 0 || H <= 0) return;

    const { w: natW, h: natH } = measureNaturalSize();
    if (!natW || !natH) return;

    let scale = Math.min(W / natW, H / natH);
    scale = Math.max(minScale, Math.min(maxScale, scale));
    // redondeo leve para evitar medias líneas que “corten” al rasterizar
    scale = Math.round(scale * 1000) / 1000;

    targetEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  // condiciones base
  targetEl.style.position = targetEl.style.position || 'absolute';
  targetEl.style.top = '50%';
  targetEl.style.left = '50%';
  targetEl.style.transformOrigin = 'top left';

  const ro = new ResizeObserver(applyScale);
  ro.observe(stageEl);
  ro.observe(targetEl);
  queueMicrotask(applyScale);

  return () => ro.disconnect();
}

  function mkBaseLayout(opts){
    const root = document.createElement('div');
    root.className = 'slide act-ahorro';
    const left = document.createElement('aside'); left.className = 'act-left';
    const coins = document.createElement('div'); coins.className = 'coins-badge';
    coins.innerHTML = `<span class="coins-badge__num">0</span><img class="coins-badge__icon" alt="Monedas" src="${opts.coinIcon}">`;
    // Wrapper para apilar MONEDAS + OBJETIVO juntos
    const coinsWrap = document.createElement('div');
    coinsWrap.className = 'coins-wrap';
    coinsWrap.appendChild(coins);

    // Objetivo (opcional) DENTRO del wrapper
    if (opts.goalShow && typeof opts.goalAmount === 'number'){
      const goalRow = document.createElement('div');
      goalRow.className = 'goal-target';
      // estilo mínimo inline para que se vea bien sin tocar CSS
      goalRow.style.cssText = 'display:inline-flex;align-items:center;gap:.5rem;opacity:.6;margin-top:6px;font-weight:600;font-size:.95rem;';
      goalRow.innerHTML = `
        <span>Objetivo: ${Number(opts.goalAmount)}</span>
        <img class="goal-target__icon" src="${opts.coinIcon || '../assets/icons/coin_ranking.png'}" alt="Monedas" style="width:18px;height:18px;object-fit:contain;transform:translateY(1px);">
      `;
      coinsWrap.appendChild(goalRow);
    }

    left.appendChild(coinsWrap);

    const meterWrap = document.createElement('div'); meterWrap.className = 'pill';
    meterWrap.innerHTML = `<div class="pill__well"><div class="pill__fill"></div></div>`; left.appendChild(meterWrap);
    const zoneIcon = document.createElement('img'); zoneIcon.className='zone-icon'; zoneIcon.alt='Estado'; zoneIcon.style.display='none'; left.appendChild(zoneIcon);
    const header = document.createElement('header'); header.className = 'act-toptext'; header.textContent = opts.text || '';
    const figure = document.createElement('div'); figure.className = 'act-image';
    if (opts.image){ const imgEl = document.createElement('img'); imgEl.src = typeof opts.image==='string'?opts.image:(opts.image.src||''); imgEl.alt = opts.alt || opts.image?.alt || 'Escena'; figure.appendChild(imgEl); }
    const right = document.createElement('aside'); right.className = 'act-right';
    const footer = document.createElement('footer'); footer.className = 'act-actions';
    root.append(left, header, figure, right, footer);
    return { root, left, coins, meterFill: meterWrap.querySelector('.pill__fill'), zoneIcon, header, figure, right, footer };
  }

  // ======= 1) actividad-ahorro-1-1 =======
  SlideRendererRegistry.register('actividad-ahorro-1-1', function(s, root){
    const state = getState();
    if (typeof s.coins === 'number') state.coins = s.coins;
    if (typeof s.happiness === 'number') state.happiness = clamp100(s.happiness);
    if (s.setpoints) state.setpoints = {...state.setpoints, ...s.setpoints};
    if (s.zoneIcons) state.zoneIcons = {...state.zoneIcons, ...s.zoneIcons};
    if (s.coinIcon) state.coinIcon = s.coinIcon;

    const goalAmount = (s.goal ?? s.goalAmount ?? s.objetivo ?? window.ACT_AHORRO_STATE?.goalAmount ?? null);
    const goalShow   = (s.showGoal ?? window.ACT_AHORRO_STATE?.showGoal ?? false);

    const ui = mkBaseLayout({
      text: s.text, image: s.image, alt: s.alt, coinIcon: state.coinIcon,
      goalAmount, goalShow
    });

    // Bloquea flechas, espacio y enter SOLO mientras el slide está en DOM
    function attachPerSlideKeyBlocker(root){
      const stop = (ev) => {
        // no bloqueamos si el foco está en un input/textarea/select/button
        const t = ev.target && ev.target.tagName;
        if (t && ['INPUT','TEXTAREA','SELECT','BUTTON'].includes(t)) return;
        const k = ev.key;
        if (k === 'ArrowRight' || k === 'ArrowLeft' || k === ' ' || k === 'Enter'){
          ev.preventDefault();
          ev.stopPropagation();
        }
      };

      // alta en captura para ir antes que listeners globales
      window.addEventListener('keydown',  stop, true);
      window.addEventListener('keypress', stop, true);
      window.addEventListener('keyup',    stop, true);

      // baja automática al desmontar el slide
      const cleanup = () => {
        window.removeEventListener('keydown',  stop, true);
        window.removeEventListener('keypress', stop, true);
        window.removeEventListener('keyup',    stop, true);
        obs && obs.disconnect();
      };

      const obs = new MutationObserver(() => {
        if (!root.isConnected) cleanup();
      });
      // Observa el árbol por encima del root (body/document)
      obs.observe(document.body, { childList: true, subtree: true });

      // por si necesitas llamarlo a mano en el futuro:
      return cleanup;
    }

    // Contenedor de “escenario” que se ajusta a pantalla
    const stage = document.createElement('div');
    stage.className = 'fit-stage';
    stage.appendChild(ui.root);

    // marca el target (el propio ui.root) y activa el escalado
    const teardownFit = installFitToScreen(stage, ui.root, {
      padding: 16,   // margen interno para que no pegue a bordes (puedes poner 0)
      maxScale: 1,   // no crecer por encima del tamaño natural
      minScale: 0.6  // en pantallas muy pequeñas, como mínimo 60% del tamaño
    });

    // montar en el root del slide system
    root.appendChild(stage);

    // Si al desmontar el slide quieres liberar el observer, puedes escuchar tu propio ciclo
    // (en tu código ya usas MutationObserver en otro helper, podrías anclarte a eso si quieres).

    attachPerSlideKeyBlocker(ui.root);
    ui.root.classList.add('tipo-11');
    // Evita que clicks en la escena burbujeen hacia fuera
    ui.root.addEventListener('click', (ev) => ev.stopPropagation());
    ui.root.addEventListener('keydown', (ev) => ev.stopPropagation(), true);

    // Estado actual
    ui.coins.querySelector('.coins-badge__num').textContent = String(state.coins);
    setFill(ui.meterFill, state.happiness, state.setpoints);
    { const z = zoneOf(state.happiness, state.setpoints); if (state.zoneIcons[z]){ ui.zoneIcon.src = state.zoneIcons[z]; ui.zoneIcon.style.display=''; } }

    // Tarjetas derecha
    const leftOpt  = s.left  || s.opcionIzquierda || { dCoins: 0, dHappy: 0 };
    const rightOpt = s.right || s.opcionDerecha   || { dCoins: 0, dHappy: 0 };
    function cardFor(opt, side){
      const card = document.createElement('div');
      card.className = `choice-card choice-${side}`;
      card.classList.add('ui-modern'); // ← estilo moderno compartido
      {
        const base = opt.uiColor || opt.color || (side==='left' ? 'var(--btnL, #2a7fff)' : 'var(--btnR, #10b981)');
        card.style.setProperty('--ui-color', base);             // color base elegido desde el push
        if (opt.textColor) card.style.setProperty('--ui-fg', opt.textColor); // (opcional) color de texto
      }
      card.innerHTML = `
        <div class="choice-card__line">
          <span class="cc-label">
            <img class="cc-icon cc-icon--money"
                src="../assets/icons/coin_ranking.png"
                alt="Monedas">
          </span>
          <span class="delta delta-money">${fmtDelta(Number(opt.dCoins||0))}</span>
        </div>
        <div class="choice-card__line">
          <span class="cc-label">
            <img class="cc-icon cc-icon--happy"
                src="../assets/icons/felicidad.png"
                alt="Felicidad">
          </span>
          <span class="delta delta-happy">${fmtDelta(Number(opt.dHappy||0))}</span>
        </div>
      `;

      return card;
    }
    ui.right.append(cardFor(leftOpt,'left'), cardFor(rightOpt,'right'));

    // Botones
    function btnFor(opt, side){
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn btn-option btn-${side}`;
      btn.classList.add('ui-modern'); // ← estilo moderno compartido
      {
        const base = opt.uiColor || opt.color || (side==='left' ? 'var(--btnL, #2a7fff)' : 'var(--btnR, #10b981)');
        // Coste y asequibilidad
        const cost = Math.max(0, -Number(opt.dCoins || 0)); // si dCoins es -8, cost = 8
        const affordable = state.coins >= cost;

        // Si NO llega el dinero → gris y marcado como no asequible
        if (cost > 0 && !affordable){
          btn.dataset.affordable = 'false';
          btn.style.setProperty('--ui-color', '#9ca3af'); // gris (puedes ajustar)
          btn.style.setProperty('--ui-fg', '#ffffff');
          btn.style.opacity = '0.85';
          btn.style.filter = 'grayscale(0.25)';
          btn.style.cursor = 'pointer'; // seguimos permitiendo click para mostrar pop-up
        } else {
          btn.dataset.affordable = 'true';
          btn.style.setProperty('--ui-color', base);  // color base elegido desde el push
          btn.style.setProperty('--ui-fg', '#fff');   // texto/icono blancos por defecto en botón
        }
      }

      // --- icono configurable por slide ---
      // Soporta opt.icon (ó opt.iconSrc). Si no viene, usa el default por lado.
      const iconSrc = opt.icon || opt.iconSrc || (side === 'left'
        ? '../assets/icons/tick.png'
        : '../assets/icons/cruz.png');

      const iconAlt = opt.iconAlt || (side === 'left' ? 'Aceptar' : 'Rechazar');

      btn.setAttribute('aria-label', iconAlt);
      btn.innerHTML = `<img class="btn-option__icon" src="${iconSrc}" alt="${iconAlt}">`;
      
      return btn;
    }
    function infoFor(opt){
      const wrap = document.createElement('div');
      wrap.className = 'act-action-info';
      wrap.innerHTML = `
        <div class="act-action-info__line">
          <img class="act-action-info__icon" src="../assets/icons/coin_ranking.png" alt="Monedas">
          <span class="act-action-info__delta">${fmtDelta(Number(opt.dCoins||0))}</span>
        </div>
        <div class="act-action-info__line">
          <img class="act-action-info__icon" src="../assets/icons/felicidad.png" alt="Felicidad">
          <span class="act-action-info__delta">${fmtDelta(Number(opt.dHappy||0))}</span>
        </div>
      `;
      return wrap;
    }

    const btnL = btnFor(leftOpt,'left');
    const btnR = btnFor(rightOpt,'right');
    const wrapL = document.createElement('div');
    wrapL.className = 'act-action';
    wrapL.append(infoFor(leftOpt), btnL);
    const wrapR = document.createElement('div');
    wrapR.className = 'act-action';
    wrapR.append(infoFor(rightOpt), btnR);
    ui.footer.append(wrapL, wrapR);

    function select(side, opt, onAdvance){
      const rawNext = opt.nextImage || opt.image12 || opt.afterImage || opt.nextImg || null;
      state.choice = {
        side,
        dCoins: Number(opt.dCoins || 0),
        dHappy: Number(opt.dHappy || 0),
        nextImage: rawNext ? String(rawNext).replace(/(^['"]|['"]$)/g,'') : null
      };
      state.last = {
        coinsBefore: state.coins,
        happyBefore: state.happiness,
        coinsAfter:  state.coins + state.choice.dCoins,
        happyAfter:  clamp100(state.happiness + state.choice.dHappy)
      };
      [btnL, btnR].forEach(b=>b.classList.remove('is-selected'));
      (side==='left'?btnL:btnR).classList.add('is-selected');
      if (s.autoAdvance !== false && typeof onAdvance==='function') onAdvance();
    }

    function wire(onAdvance){
      btnL.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (btnL.dataset.affordable === 'false'){
          showPopup('¡Oh! Parece que no tienes suficientes monedas');
          return;
        }
        select('left', leftOpt, onAdvance);
      });

      btnR.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (btnR.dataset.affordable === 'false'){
          showPopup('¡Oh! Parece que no tienes suficientes monedas');
          return;
        }
        select('right', rightOpt, onAdvance);
      });
    }


    function showPopup(message){
      // capa de fondo
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(0,0,0,0.35)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = '9999';

      // caja
      const box = document.createElement('div');
      box.style.minWidth = '280px';
      box.style.maxWidth = '90vw';
      box.style.borderRadius = '16px';
      box.style.padding = '20px';
      box.style.background = '#ffffff';
      box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.12)';
      box.style.textAlign = 'center';
      box.style.fontSize = '18px';
      box.style.lineHeight = '1.35';

      const p = document.createElement('p');
      p.textContent = message || '¡Oh! Parece que no tienes suficientes monedas';

      const ok = document.createElement('button');
      ok.type = 'button';
      ok.textContent = 'Entendido';
      ok.style.marginTop = '14px';
      ok.style.padding = '10px 16px';
      ok.style.borderRadius = '10px';
      ok.style.border = '0';
      ok.style.background = '#111827';
      ok.style.color = '#fff';
      ok.style.cursor = 'pointer';

      ok.addEventListener('click', () => overlay.remove());
      overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });

      box.appendChild(p);
      box.appendChild(ok);
      overlay.appendChild(box);
      document.body.appendChild(overlay);
    }


    return { bindControls: wire, suppressRootClick: true };
  });
})();
