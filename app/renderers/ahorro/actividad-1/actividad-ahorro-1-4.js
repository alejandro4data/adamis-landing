(() => {
  'use strict';

  // ======= Estado y helpers (copiados de 1-1 para mantener estructura y estilos) =======
  const DEF = {
    coins: 0,
    happiness: 50,
    setpoints: { sp1: 30, sp2: 60, sp3: 100 },
    zoneIcons: { red:'', orange:'', green:'' },
    coinIcon: '../assets/icons/coin_ranking.webp'
  };
  function getState(){
    const s = (window.ACT_AHORRO_STATE ||= {});
    if (typeof s.coins !== 'number') s.coins = DEF.coins;
    if (typeof s.happiness !== 'number') s.happiness = Math.max(0, Math.min(100, DEF.happiness));
    if (!s.setpoints) s.setpoints = {...DEF.setpoints};
    if (!s.zoneIcons) s.zoneIcons = {...DEF.zoneIcons};
    if (!s.coinIcon) s.coinIcon = DEF.coinIcon;
    return s;
  }
  const clamp100 = (x)=> Math.max(0, Math.min(100, x));
  function zoneOf(h, {sp1, sp2}){ return h < sp1 ? 'red' : (h < sp2 ? 'orange' : 'green'); }
  function applyColorsForZone(el, z){
    const map = { red:'var(--pill-red, #ef4444)', orange:'var(--pill-orange, #f59e0b)', green:'var(--pill-green, #22c55e)' };
    const c = map[z] || map.green;
    el.style.setProperty('--pill-color', c);
    el.parentElement?.style?.setProperty('--pill-color', c);
    el.parentElement?.parentElement?.style?.setProperty('--pill-color', c);
  }
  function setFill(pillFillEl, happiness, sps){
    const z = zoneOf(happiness, sps);
    applyColorsForZone(pillFillEl, z);
    pillFillEl.style.height = `${clamp100(happiness)}%`;
  }
  function mkBaseLayout(opts){
    const root = document.createElement('div');
    root.className = 'slide act-ahorro';

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
        <img class="goal-target__icon" src="${opts.coinIcon || '../assets/icons/coin_ranking.webp'}" alt="Monedas" style="width:18px;height:18px;object-fit:contain;transform:translateY(1px);">
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
      imgEl.src = typeof opts.image==='string'? opts.image : (opts.image.src||'');
      imgEl.alt = opts.alt || opts.image?.alt || 'Escena';
      figure.appendChild(imgEl);
    }

    const right = document.createElement('aside'); right.className = 'act-right';
    const footer = document.createElement('footer'); footer.className = 'act-actions';
    root.append(left, header, figure, right, footer);

    return { root, left, coins, meterFill: meterWrap.querySelector('.pill__fill'), zoneIcon, header, figure, right, footer };
  }

  const fmtDelta = (n)=> `${n>0?'+':(n<0?'-':'±')}${Math.abs(n)}`;

  function cardFor(opt, side){
    const card = document.createElement('div');
    card.className = `choice-card choice-${side}`;
    card.classList.add('ui-modern');
    const base = opt.uiColor || opt.color || (side==='left' ? 'var(--btnL, #2a7fff)' : 'var(--btnR, #10b981)');
    card.style.setProperty('--ui-color', base);
    if (opt.textColor) card.style.setProperty('--ui-fg', opt.textColor);
    card.innerHTML = `
      <div class="choice-card__line">
        <span class="cc-label">
          <img class="cc-icon cc-icon--money" src="../assets/icons/coin_ranking.webp" alt="Monedas">
        </span>
        <span class="delta delta-money">${fmtDelta(Number(opt.dCoins||0))}</span>
      </div>
      <div class="choice-card__line">
        <span class="cc-label">
          <img class="cc-icon cc-icon--happy" src="../assets/icons/felicidad.png" alt="Felicidad">
        </span>
        <span class="delta delta-happy">${fmtDelta(Number(opt.dHappy||0))}</span>
      </div>
    `;
    return card;
  }

  function btnFor(opt, side, state){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn btn-option btn-${side}`;
    btn.classList.add('ui-modern');
    const base = opt.uiColor || opt.color || (side==='left' ? 'var(--btnL, #2a7fff)' : 'var(--btnR, #10b981)');

    // Lógica de coste/asequibilidad (misma que 1-1)
    const cost = Math.max(0, -Number(opt.dCoins || 0));
    const affordable = state.coins >= cost;

    if (cost > 0 && !affordable){
      btn.dataset.affordable = 'false';
      btn.style.setProperty('--ui-color', '#9ca3af');
      btn.style.setProperty('--ui-fg', '#ffffff');
      btn.style.opacity = '0.85';
      btn.style.filter = 'grayscale(0.25)';
      btn.style.cursor = 'pointer';
    } else {
      btn.dataset.affordable = 'true';
      btn.style.setProperty('--ui-color', base);
      btn.style.setProperty('--ui-fg', '#fff');
    }

    const iconSrc = opt.icon || opt.iconSrc || (side === 'left' ? '../assets/icons/tick.png' : '../assets/icons/cruz.png');
    const iconAlt = opt.iconAlt || (side === 'left' ? 'Aceptar' : 'Rechazar');
    btn.setAttribute('aria-label', iconAlt);
    btn.innerHTML = `<img class="btn-option__icon" src="${iconSrc}" alt="${iconAlt}">`;
    return btn;
  }

  function showPopup(message){
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.35)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';
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
    box.appendChild(p); box.appendChild(ok);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  // --- TRANSICIÓN: flash de color + (opcional) fuegos artificiales ---
    function flashScreen(color = 'rgba(0,0,0,0.6)', onAdvance, withFireworks = false){
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = color;            // verde/rojo semitransparente
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 450ms ease';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '10000';              // por encima de todo

    document.body.appendChild(overlay);

    // 1) sube opacidad (flash)
    requestAnimationFrame(() => { overlay.style.opacity = '1'; });

    // 2) a los ~120ms, avanza al siguiente slide (debajo del overlay)
    setTimeout(() => {
        if (typeof onAdvance === 'function') onAdvance();

        // 3) si hay fuegos artificiales, lánzalos ya sobre la nueva slide
        if (withFireworks) startFireworks(5000);   // 5s
    }, 120);

    // 4) desvanecer overlay (dejando ver la nueva slide)
    setTimeout(() => { overlay.style.opacity = '0'; }, 200);

    // 5) quitar overlay del DOM al terminar
    setTimeout(() => { overlay.remove(); }, 700);
    }

    function startFireworks(durationMs = 5000){
    const cvs = document.createElement('canvas');
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    Object.assign(cvs.style, {
        position:'fixed', inset:'0', pointerEvents:'none', zIndex:'10001'
    });
    const ctx = cvs.getContext('2d');
    document.body.appendChild(cvs);

    const particles = [];
    const GRAV = 0.08;
    const DRAG = 0.992;
    const COLORS = ['#22c55e', '#10b981', '#f59e0b', '#60a5fa', '#ef4444', '#a78bfa'];

    function spawnBurst(x, y){
        const n = 80 + Math.floor(Math.random()*40);
        for(let i=0;i<n;i++){
        const angle = Math.random()*Math.PI*2;
        const speed = 2 + Math.random()*5;
        particles.push({
            x, y,
            vx: Math.cos(angle)*speed,
            vy: Math.sin(angle)*speed,
            life: 70 + Math.random()*50,
            color: COLORS[(Math.random()*COLORS.length)|0],
            size: 2 + Math.random()*2
        });
        }
    }

    let lastSpawn = 0;
    const tStart = performance.now();
    const T_TOTAL = durationMs;     // p.ej. 5000
    const T_TAIL  = 1200;           // “cola” para que caigan (1.2s)
    const T_SPAWN_END = T_TOTAL - T_TAIL; // hasta aquí se generan bursts
    let spawning = true;

    function loop(t){
        const elapsed = t - tStart;

        // 1) Dejar de spawnear antes del final (para que dé tiempo a caer)
        if (spawning && elapsed >= T_SPAWN_END){
            spawning = false;
        }

        // 2) Spawn mientras esté permitido
        if (spawning && elapsed - lastSpawn > 450){
            spawnBurst(
            80 + Math.random()*(cvs.width - 160),
            80 + Math.random()*(cvs.height*0.6)
            );
            lastSpawn = elapsed;
        }

        // 3) Update + draw
        ctx.clearRect(0,0,cvs.width,cvs.height);

        for (let i=particles.length-1;i>=0;i--){
            const p = particles[i];
            p.vx *= DRAG;
            p.vy = p.vy*DRAG + GRAV;
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 1;

            const alpha = Math.max(0, Math.min(1, p.life/80));
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fill();

            if (p.life<=0) particles.splice(i,1);
        }
        ctx.globalAlpha = 1;

        // 4) Condición de fin: cuando ya no spawneamos y no quedan partículas,
        //    o si se supera un margen de seguridad (T_TOTAL + 1s)
        const noMore = !spawning && particles.length === 0;
        const timeout = elapsed >= (T_TOTAL + 1000);

        if (!noMore && !timeout){
            requestAnimationFrame(loop);
        } else {
            // Desvanecer y quitar
            cvs.style.transition = 'opacity 300ms ease';
            cvs.style.opacity = '0';
            setTimeout(()=> cvs.remove(), 320);
        }
    }

    requestAnimationFrame(loop);

    // resize sencillo
    const onResize = () => { cvs.width = innerWidth; cvs.height = innerHeight; };
    window.addEventListener('resize', onResize, { passive:true });
    setTimeout(()=> window.removeEventListener('resize', onResize), durationMs+1000);
    }


  // ======= Renderer final: actividad-ahorro-1-4 =======
  // API:
  // - price / precio: coste del objeto final
  // - textOk (o text1/okText): texto cabecera si ALCANZA
  // - textKo (o text2/koText): texto cabecera si NO ALCANZA
  // - image/alt
  // - left/right (opciones estilo 1-1: dCoins, dHappy, nextImage, color/icon...)
  SlideRendererRegistry.register('actividad-ahorro-1-4', function(s, root){
    const state = getState();

    const price  = Math.max(0, Number(s.price ?? s.precio ?? 0));
    const canBuy = state.coins >= price;

    const headerText = canBuy
      ? (s.textOk ?? s.text1 ?? s.okText ?? s.text ?? '¡Objetivo conseguido!')
      : (s.textKo ?? s.text2 ?? s.koText ?? s.text ?? 'Aún no llegas…');

    const goalAmount = (s.goal ?? s.goalAmount ?? s.objetivo ?? window.ACT_AHORRO_STATE?.goalAmount ?? null);
    const goalShow   = (s.showGoal ?? window.ACT_AHORRO_STATE?.showGoal ?? false);

    const ui = mkBaseLayout({
      text: headerText, image: s.image, alt: s.alt, coinIcon: state.coinIcon,
      goalAmount, goalShow
    });

    root.appendChild(ui.root);
    ui.root.classList.add('tipo-11'); // mismo “tipo” que 1-1 para calc/estilos idénticos

    // Estado visual (igual que 1-1)
    ui.coins.querySelector('.coins-badge__num').textContent = String(state.coins);
    setFill(ui.meterFill, state.happiness, state.setpoints);
    { const z = zoneOf(state.happiness, state.setpoints); if (state.zoneIcons[z]){ ui.zoneIcon.src = state.zoneIcons[z]; ui.zoneIcon.style.display=''; } }

    // Opciones
    const leftOpt  = s.left  || {};
    const rightOpt = s.right || {};
    // Defaults sensatos:
    if (canBuy && (leftOpt.dCoins == null))  leftOpt.dCoins  = -price; // comprar resta price
    if (!canBuy && (rightOpt.dCoins == null)) rightOpt.dCoins = 0;     // seguir/aceptar sin coste

    // ---- Tarjetas laterales (solo UNA) ----
    if (canBuy) {
      ui.right.appendChild(cardFor(leftOpt, 'left'));
    } else {
      ui.right.appendChild(cardFor(rightOpt, 'right'));
    }

    // ---- Botones (DOS, como 1-1) ----
    let btnActive, activeSide, activeOpt;

    if (canBuy) {
    activeSide = 'left';
    activeOpt  = leftOpt;
    btnActive  = btnFor(leftOpt, 'left', state);
    } else {
    activeSide = 'right';
    activeOpt  = rightOpt;
    btnActive  = btnFor(rightOpt, 'right', state);
    }

    ui.footer.appendChild(btnActive);


    // Evita avanzar por click de fondo (igual que 1-1) → solo botones
    ui.root.addEventListener('click', (ev) => ev.stopPropagation());
    ui.root.addEventListener('keydown', (ev) => ev.stopPropagation(), true);

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
      if (typeof onAdvance==='function') onAdvance();
    }

    function wire(onAdvance){
        btnActive.addEventListener('click', (ev) => {
            ev.stopPropagation();

            // bloqueo por saldo insuficiente
            const cost = Math.max(0, -Number(activeOpt.dCoins || 0));
            if (cost > 0 && state.coins < cost){
            showPopup('¡Oh! Parece que no tienes suficientes monedas');
            return;
            }

            // 1) guarda la elección (para que 1-2 lea state.last/choice)
            select(activeSide, activeOpt, () => {});

            // 1.5) calcular y guardar a_rec (0/1) + emitir como encuesta
            try {
              const sp2 = Number(state.setpoints?.sp2 ?? 60);
              const happyAfter = clamp100(state.happiness + Number(activeOpt.dHappy || 0));

              // aprobado = compra bici (left) + felicidad en zona verde (>= sp2)
              const completedOk = (activeSide === 'left') && (happyAfter >= sp2);
              const a_rec = completedOk ? 1 : 0;

              sessionStorage.setItem('a_rec', String(a_rec));

              // Emitir como si fuera una encuesta normal para que vaya a Sheets como columna a_rec
              window.dispatchEvent(new CustomEvent('encuesta:submit', {
                detail: { id: 'a_rec', respuesta: a_rec }
              }));
            } catch (_e) {}


            // 2) decide color y si hay fuegos
            const isYes = (activeSide === 'left');    // “sí” = left
            const color = isYes
            ? 'rgba(34,197,94,0.75)'   // verde
            : 'rgba(239,68,68,0.75)';  // rojo

            // 3) lanza flash; avanza durante el flash; si es “sí”, muestra fuegos 5s
            flashScreen(color, onAdvance, isYes);
        }, { once:true });
    }



    return { bindControls: wire, suppressRootClick: true };
  });
})();
