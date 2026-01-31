(() => {
  'use strict';

  // ======= Estado y helpers compartidos (mismos que en 1-1) =======
  const DEF = {
    coins: 0, happiness: 50,
    setpoints: { sp1: 30, sp2: 60, sp3: 100 },
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
  function mkBaseLayout(opts = {}){
    const includeFooter = Boolean(opts.includeFooter);
    const root = document.createElement('div'); root.className = 'slide act-ahorro tipo-12';
    const left = document.createElement('aside'); left.className = 'act-left';
    const coins = document.createElement('div'); coins.className = 'coins-badge';
    coins.innerHTML = `<span class="coins-badge__num">0</span><img class="coins-badge__icon" alt="Monedas" src="${opts.coinIcon}">`;
    // Wrapper para MONEDAS + OBJETIVO
    const coinsWrap = document.createElement('div');
    coinsWrap.className = 'coins-wrap';
    coinsWrap.appendChild(coins);

    if (opts.goalShow && typeof opts.goalAmount === 'number'){
      const goalRow = document.createElement('div');
      goalRow.className = 'goal-target';
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
    const right = document.createElement('aside'); right.className = 'act-right'; // vacío aquí
    const footer = includeFooter ? document.createElement('footer') : null;
    if (footer) footer.className = 'act-actions cta-actions';
    root.append(left, header, figure, right);
    if (footer) root.appendChild(footer);
    return { root, left, coins, meterFill: meterWrap.querySelector('.pill__fill'), zoneIcon, header, figure, footer };
  }

  // Estilos para el botón final (solo se inyectan una vez)
  function ensureContinueStyles(){
    const ID = 'act-ahorro-continue-style';
    if (document.getElementById(ID)) return;
    const css = document.createElement('style');
    css.id = ID;
    css.textContent = `
      .act-ahorro.cta-has-continue{ position:relative; }
      .act-ahorro .cta-continue{
        width:min(460px,92%);
        margin:18px auto 6px;
        padding:18px 26px;
        border-radius:16px;
        border:none;
        background:linear-gradient(135deg,#1fe4a8,#12b0ff);
        color:#06202e;
        font-weight:800;
        font-size:20px;
        letter-spacing:.1px;
        box-shadow:0 10px 30px rgba(0,0,0,.16);
        cursor:pointer;
        transition:transform .12s ease, box-shadow .12s ease, filter .15s ease;
        animation: cta-pulse 1.6s ease-in-out infinite;
      }
      .act-ahorro .cta-continue:hover{ transform:translateY(-2px) scale(1.01); box-shadow:0 14px 36px rgba(0,0,0,.18); filter:brightness(.98); }
      .act-ahorro .cta-continue:active{ transform:translateY(0); box-shadow:0 8px 22px rgba(0,0,0,.18); }
      .act-ahorro .cta-actions{
        position:absolute;
        left:clamp(18px, 3vw, 36px);
        bottom:clamp(18px, 3vw, 36px);
        display:flex;
        justify-content:flex-start;
        align-items:flex-end;
        padding:0;
        box-sizing:border-box;
      }
      @keyframes cta-pulse{
        0%,100%{ transform:scale(1); }
        50%{ transform:scale(1.05); }
      }
    `;
    document.head.appendChild(css);
  }

  // ======= 2) actividad-ahorro-1-2 =======
  SlideRendererRegistry.register('actividad-ahorro-1-2', function(s, root){
    const state = getState();
    const chosenFromChoice = window.ACT_AHORRO_STATE?.choice?.nextImage || '';
    const sanitizedChoice = chosenFromChoice ? String(chosenFromChoice).replace(/(^['"]|['"]$)/g,'') : '';
    const chosenImg = sanitizedChoice || s.image || '';
    const goalAmount = (s.goal ?? s.goalAmount ?? s.objetivo ?? window.ACT_AHORRO_STATE?.goalAmount ?? null);
    const goalShow   = (s.showGoal ?? window.ACT_AHORRO_STATE?.showGoal ?? false);

    ensureContinueStyles();
    const wantsCTA = Boolean(s.showContinueButton);

    const ui = mkBaseLayout({
      text: s.text, image: chosenImg, alt: s.alt, coinIcon: state.coinIcon,
      goalAmount, goalShow,
      includeFooter: wantsCTA
    });
    root.appendChild(ui.root);

    const continueBtn = wantsCTA ? document.createElement('button') : null;
    if (continueBtn){
      continueBtn.type = 'button';
      continueBtn.className = 'btn-continue cta-continue';
      continueBtn.textContent = s.continueText || 'Continuar';
    }
    if (wantsCTA){
      ui.root.classList.add('cta-has-continue');
    }

    const beforeCoins = state.last?.coinsBefore ?? state.coins;
    const beforeHappy = state.last?.happyBefore ?? state.happiness;
    const afterCoins  = state.last?.coinsAfter  ?? state.coins;
    const afterHappy  = state.last?.happyAfter  ?? state.happiness;

    ui.coins.querySelector('.coins-badge__num').textContent = String(beforeCoins);
    setFill(ui.meterFill, beforeHappy, state.setpoints);
    { const z = zoneOf(beforeHappy, state.setpoints); if (state.zoneIcons[z]){ ui.zoneIcon.src = state.zoneIcons[z]; ui.zoneIcon.style.display=''; } }

    const dur = Number(s.duration || 900);
    function animateNumber(el, from, to, ms){
      const t0 = performance.now();
      function step(t){ const p = Math.max(0, Math.min(1, (t - t0)/ms)); el.textContent = String(Math.round(from + (to - from)*p)); if (p<1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    function animateFill(fromH, toH, ms){
      const t0 = performance.now();
      let lastZone = zoneOf(fromH, state.setpoints);
      applyColorsForZone(ui.meterFill, lastZone);
      function step(t){
        const p = Math.max(0, Math.min(1, (t - t0)/ms));
        const h = fromH + (toH - fromH)*p;
        const z = zoneOf(h, state.setpoints);
        if (z!==lastZone){ lastZone=z; applyColorsForZone(ui.meterFill, z); if (state.zoneIcons[z]){ ui.zoneIcon.src = state.zoneIcons[z]; ui.zoneIcon.style.display=''; } }
        ui.meterFill.style.height = `${clamp100(h)}%`;
        if (p<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function wire(onAdvance){
      animateNumber(ui.coins.querySelector('.coins-badge__num'), beforeCoins, afterCoins, dur);
      animateFill(beforeHappy, afterHappy, dur);
      const deltaCoins = Math.round(afterCoins - beforeCoins);
      if (deltaCoins < 0){
        const wrap = ui.coins.parentElement;
        if (wrap){
          const bubble = document.createElement('div');
          bubble.className = 'coins-float coins-float--neg';
          bubble.textContent = fmtDelta(deltaCoins);
          wrap.appendChild(bubble);
          requestAnimationFrame(() => bubble.classList.add('is-on'));
          setTimeout(() => bubble.remove(), 1400);
        }
      }
      const deltaHappy = Math.round(afterHappy - beforeHappy);
      if (deltaHappy !== 0){
        const bubble = document.createElement('div');
        bubble.className = 'happy-float';
        bubble.textContent = fmtDelta(deltaHappy);
        bubble.style.setProperty('--happy-float-bg', deltaHappy > 0
          ? 'var(--pill-green, #22c55e)'
          : 'var(--pill-red, #ef4444)');
        ui.left.appendChild(bubble);
        requestAnimationFrame(() => bubble.classList.add('is-on'));
        setTimeout(() => bubble.remove(), 1400);
      }
      setTimeout(() => {
        state.coins = afterCoins;
        state.happiness = afterHappy;
        const ms = Number(s.advanceAfter || 0);
        if (ms > 0 && typeof onAdvance === 'function') setTimeout(() => onAdvance(), ms);
      }, dur + 20);
      ui.root.addEventListener('click', (ev) => { ev.stopPropagation(); if (typeof onAdvance==='function') onAdvance(); }, { once:true });
      if (continueBtn && ui.footer){
        ui.footer.appendChild(continueBtn);
        continueBtn.addEventListener('click', (ev)=>{ ev.stopPropagation(); if (typeof onAdvance==='function') onAdvance(); }, { once:true });
      }
    }
    return { bindControls: wire, suppressRootClick: true };
  });
})();
