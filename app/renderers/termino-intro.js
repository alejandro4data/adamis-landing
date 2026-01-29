(() => {
  'use strict';

  // Render de slide "termino-intro"
  SlideRendererRegistry.register('termino-intro', function (s, root, ctx) {
    const { setVar, typeIn, registerTyper } = ctx;

    // Fondo y layout base
    root.classList.add('tpl--termino-intro');

    // === GRID 60% / 40% ===
    const grid = document.createElement('div');
    grid.className = 'ti-grid';
    root.appendChild(grid);

    // ===================== COLUMNA IZQUIERDA (60%) =====================
    const left = document.createElement('div');
    left.className = 'ti-left';
    grid.appendChild(left);

    // Imagen ~70% del alto
    const fig = document.createElement('figure');
    fig.className = 'ti-image';
    const img = document.createElement('img');
    img.className = 'ti-image__img';
    if (typeof s.img === 'string') {
      img.src = s.img;
      img.alt = s.alt || '';
    } else if (s.img && typeof s.img === 'object') {
      img.src = s.img.src || '';
      img.alt = s.img.alt || s.alt || '';
    }
    fig.appendChild(img);
    left.appendChild(fig);

    // Bocadillo ~30% del alto — reutiliza estética de "explicacion-bocadillo"
    const dialogWrap = document.createElement('div');
    dialogWrap.className = 'ti-dialog';
    const bubble = document.createElement('div');
    bubble.className = 'comic-bubble'; // misma clase/estilo que ya tienes
    bubble.setAttribute('role','button');
    bubble.setAttribute('tabindex','0');

    // Píldora con nombre del narrador (misma estética)
    if (s.narrator) {
      const pill = document.createElement('div');
      pill.className = 'narrator-pill';
      const pillIn = document.createElement('span');
      pillIn.className = 'narrator-pill__in';
      pillIn.textContent = String(s.narrator);
      pill.appendChild(pillIn);
      if (s.narratorColor) {
        setVar(pill, '--hex-border', s.narratorColor);
        setVar(pillIn, '--hex-bg', '#fff');
        setVar(bubble, '--stroke-col', s.narratorColor);
      }
      bubble.appendChild(pill);
    }

    const textNode = document.createElement('div');
    textNode.className = 'slide__text';
    bubble.appendChild(textNode);
    dialogWrap.appendChild(bubble);
    left.appendChild(dialogWrap);

    // Tecleo opcional (igual que en explicacion-bocadillo)
    const wantsTW = (s.typewriter === undefined) ? true : Boolean(s.typewriter);
    const speed = (typeof s.typeSpeed === 'number') ? s.typeSpeed : 22;
    function bindTyping() {
      if (wantsTW && s.text) {
        const t = typeIn(textNode, String(s.text), speed);
        registerTyper(t);
      } else {
        textNode.textContent = String(s.text || '');
      }
    }

    // ===================== COLUMNA DERECHA (40%) =====================
    const right = document.createElement('div');
    right.className = 'ti-right';
    grid.appendChild(right);

    // Tarjeta de cristal + flip
    const card = document.createElement('article');
    card.className = 'term-card tease';
    if (s.goldGradient) setVar(card, '--gold-grad', s.goldGradient);

    const inner = document.createElement('div');
    inner.className = 'term-card__inner';

    // Cara delantera: término + botón "¿Qué significa?"
    const front = document.createElement('div');
    front.className = 'term-card__face term-card__front term-front-clickable';
    front.setAttribute('role','button');
    front.setAttribute('tabindex','0');
    const termEl = document.createElement('h3');
    termEl.className = 'term-word';
    termEl.textContent = 'Término Especial';
    const hint = document.createElement('div');
    hint.className = 'term-hint';
    hint.textContent = 'Pulsa para ver';
    front.append(termEl, hint);

    // Cara trasera: definición + botón "Volver"
    const back = document.createElement('div');
    back.className = 'term-card__face term-card__back';
    const termBadge = document.createElement('div');
    termBadge.className = 'term-badge';
    termBadge.textContent = String(s.term || '');
    back.appendChild(termBadge); // se posiciona por CSS (absolute)
    const def = document.createElement('p');
    def.className = 'term-def';
    def.textContent = String(s.meaning || '');
    const backActions = document.createElement('div');
    backActions.className = 'ti-back-actions';
    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'ti-btn ti-btn--ghost ti-btn--back';
    backBtn.textContent = 'Volver';
    backActions.appendChild(backBtn);
    back.append(def, backActions);

    inner.append(front, back);
    card.appendChild(inner);
    right.appendChild(card);

    // Botón CONTINUAR (ahora va junto a “Volver” en la cara trasera)
    const contBtn = document.createElement('button');
    contBtn.type = 'button';
    contBtn.className = 'ti-btn ti-btn--gold ti-continue';
    contBtn.textContent = 'Continuar';
    contBtn.setAttribute('aria-hidden', 'true');
    backActions.appendChild(contBtn);   // <— cambia grid por backActions


    // ===================== BLOQUEO DE NAVEGACIÓN (solo este slide) =====================
    // Patrón por-slide con cleanup al desmontar (igual que actividad 1-1)
    function attachPerSlideKeyBlocker(rootEl){
      const stop = (ev) => {
        const t = ev.target && ev.target.tagName;
        if (t && ['INPUT','TEXTAREA','SELECT','BUTTON'].includes(t)) return;
        const k = ev.key;
        if (k === 'ArrowRight' || k === 'ArrowLeft' || k === ' ' || k === 'Enter'){
          ev.preventDefault(); ev.stopPropagation();
        }
      };
      window.addEventListener('keydown',  stop, true);
      window.addEventListener('keypress', stop, true);
      window.addEventListener('keyup',    stop, true);

      const cleanup = () => {
        window.removeEventListener('keydown',  stop, true);
        window.removeEventListener('keypress', stop, true);
        window.removeEventListener('keyup',    stop, true);
        obs && obs.disconnect();
      };
      const obs = new MutationObserver(() => { if (!rootEl.isConnected) cleanup(); });
      obs.observe(document.body, { childList: true, subtree: true });
      return cleanup;
    }
    attachPerSlideKeyBlocker(root);
    // Evita que clicks en el slide burbujeen (no se avanza por clic de fondo)
    root.addEventListener('click', (ev) => ev.stopPropagation());
    root.addEventListener('keydown', (ev) => ev.stopPropagation(), true);

    // ===================== WIRING =====================
    function showContinue(v){
        contBtn.style.display = v ? 'inline-flex' : 'none';
        contBtn.setAttribute('aria-hidden', v ? 'false' : 'true');
    }

    function flipToBack(ev){
        if (ev) ev.stopPropagation();
        card.classList.add('is-flipped');
        showContinue(true);
        card.classList.remove('tease');
    }

    function flipToFront(ev){
        if (ev) ev.stopPropagation();
        card.classList.remove('is-flipped');
        showContinue(false);
    }

    const activateKeys = ['Enter',' '];
    front.addEventListener('click', flipToBack);
    front.addEventListener('keydown', (ev) => {
      if (activateKeys.includes(ev.key)){
        ev.preventDefault();
        flipToBack(ev);
      }
    });

    backBtn.addEventListener('click', flipToFront);

    // El engine nos pasa onAdvance: lo disparamos SOLO desde "Continuar"
    function bindControls(onAdvance){
      contBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (typeof onAdvance === 'function') onAdvance();
      });
    }

    // Render texto (con tecleo si procede)
    bindTyping();

    return {
      lockText: `${String(s.text || '')} ${String(s.term || '')}`.trim(),
      bindTyping(){},        // ya tipamos arriba
      suppressRootClick: true,
      bindControls
    };
  });

})();
