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
  function mkBaseLayout(opts){
    const root = document.createElement('div'); root.className = 'slide act-ahorro tipo-13';

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
    meterWrap.innerHTML = `<div class="pill__well"><div class="pill__fill"></div></div>`; 
    left.appendChild(meterWrap);

    const zoneIcon = document.createElement('img'); zoneIcon.className='zone-icon'; zoneIcon.alt='Estado'; zoneIcon.style.display='none'; 
    left.appendChild(zoneIcon);

    const header = document.createElement('header'); header.className = 'act-toptext'; header.textContent = opts.text || '';
    const figure = document.createElement('div'); figure.className = 'act-image';
    if (opts.image){ 
      const imgEl = document.createElement('img'); 
      imgEl.src = typeof opts.image==='string'?opts.image:(opts.image.src||''); 
      imgEl.alt = opts.alt || opts.image?.alt || 'Escena'; 
      figure.appendChild(imgEl); 
    }

    const right = document.createElement('aside'); right.className = 'act-right';
    const footer = document.createElement('footer'); footer.className = 'act-actions';

    root.append(left, header, figure, right, footer);

    return { root, left, coins, meterFill: meterWrap.querySelector('.pill__fill'), zoneIcon, header, figure };
  }


  // ======= 3) actividad-ahorro-1-3 =======
  SlideRendererRegistry.register('actividad-ahorro-1-3', function(s, root){
    const state = getState();
    const goalAmount = (s.goal ?? s.goalAmount ?? s.objetivo ?? window.ACT_AHORRO_STATE?.goalAmount ?? null);
    const goalShow   = (s.showGoal ?? window.ACT_AHORRO_STATE?.showGoal ?? false);

    const ui = mkBaseLayout({ 
      text: s.text, image: s.image, alt: s.alt, coinIcon: state.coinIcon,
      goalAmount, goalShow
    });
    root.appendChild(ui.root);

    // Felicidad no cambia
    ui.coins.querySelector('.coins-badge__num').textContent = String(state.coins);
    setFill(ui.meterFill, state.happiness, state.setpoints);
    { const z = zoneOf(state.happiness, state.setpoints); if (state.zoneIcons[z]){ ui.zoneIcon.src = state.zoneIcons[z]; ui.zoneIcon.style.display=''; } }

    const paga = Number(s.paga || s.allowance || 0);
    const target = state.coins + paga;
    const dur = Number(s.duration || 800);

    function animateNumber(el, from, to, ms){
      const t0 = performance.now();
      function step(t){ const p = Math.max(0, Math.min(1, (t - t0)/ms)); el.textContent = String(Math.round(from + (to - from)*p)); if (p<1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }

    function wire(onAdvance){
      if (paga !== 0){
        animateNumber(ui.coins.querySelector('.coins-badge__num'), state.coins, target, dur);
        setTimeout(()=>{ state.coins = target; }, dur + 10);
        // Burbuja flotante +X cerca del badge
        const wrap = ui.coins.parentElement;
        if (wrap){
          const bubble = document.createElement('div');
          bubble.className = 'coins-float';
          bubble.textContent = `+${paga}`;
          wrap.appendChild(bubble);
          requestAnimationFrame(()=> bubble.classList.add('is-on'));
          setTimeout(() => bubble.remove(), 1200);
        }
      }
      const ms = Number(s.advanceAfter || 0);
      if (ms > 0 && typeof onAdvance === 'function'){
        setTimeout(() => onAdvance(), Math.max(ms, dur));
      }
      ui.root.addEventListener('click', (ev) => { ev.stopPropagation(); if (typeof onAdvance==='function') onAdvance(); }, { once:true });
    }
    return { bindControls: wire, suppressRootClick: true };
  });
})();
