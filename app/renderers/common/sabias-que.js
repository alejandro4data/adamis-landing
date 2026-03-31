(() => {
  'use strict';

  const tr = (text) => {
    try {
      if (window.I18N && typeof window.I18N.tr === 'function') return window.I18N.tr(text);
    } catch (_) {}
    return text;
  };

  SlideRendererRegistry.register('sabias-que', function(s, root){
    root.classList.add('tpl--sabias-que');

    const stage = document.createElement('div');
    stage.className = 'sabias-stage';
    root.appendChild(stage);

    const left = document.createElement('section');
    left.className = 'sabias-media';
    stage.appendChild(left);

    if (s.img && s.img.src) {
      const img = document.createElement('img');
      img.className = 'sabias-media__img';
      img.src = s.img.src;
      img.alt = s.img.alt || '';
      left.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'sabias-media__placeholder';

      const placeholderLabel = document.createElement('span');
      placeholderLabel.className = 'sabias-media__placeholder-label';
      placeholderLabel.textContent = tr(String(s.placeholder || 'Espacio reservado para imagen'));

      placeholder.appendChild(placeholderLabel);
      left.appendChild(placeholder);
    }

    const right = document.createElement('section');
    right.className = 'sabias-panel';
    stage.appendChild(right);

    const aura = document.createElement('div');
    aura.className = 'sabias-panel__aura';
    right.appendChild(aura);

    const card = document.createElement('article');
    card.className = 'sabias-card is-teasing';
    right.appendChild(card);

    const inner = document.createElement('div');
    inner.className = 'sabias-card__inner';
    card.appendChild(inner);

    const front = document.createElement('button');
    front.type = 'button';
    front.className = 'sabias-card__face sabias-card__front';
    front.setAttribute('aria-label', tr('Mostrar curiosidad'));


    const frontTitle = document.createElement('h2');
    frontTitle.className = 'sabias-card__title';
    frontTitle.textContent = tr(String(s.title || '¿Sabías que...?'));

    const frontHint = document.createElement('div');
    frontHint.className = 'sabias-card__hint';
    frontHint.textContent = tr(String(s.flipHint || 'Pulsa para descubrirlo'));

    front.append(frontTitle, frontHint);

    const back = document.createElement('div');
    back.className = 'sabias-card__face sabias-card__back';

    const backTitle = document.createElement('div');
    backTitle.className = 'sabias-card__back-title';
    backTitle.textContent = tr(String(s.backText || 'Dato curioso'));

    const backBody = document.createElement('div');
    backBody.className = 'sabias-card__body';

    const fact = document.createElement('p');
    fact.className = 'sabias-card__fact';
    fact.textContent = tr(String(s.fact || 'Aquí irá el texto del “Sabías que...?” de esta clase.'));
    backBody.appendChild(fact);

    const actions = document.createElement('div');
    actions.className = 'sabias-card__actions';

    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'sabias-btn sabias-btn--ghost';
    backBtn.textContent = tr('Volver');

    const continueBtn = document.createElement('button');
    continueBtn.type = 'button';
    continueBtn.className = 'sabias-btn sabias-btn--primary';
    continueBtn.textContent = tr(String(s.continueText || 'Continuar'));
    if (s.showContinueButton === false) continueBtn.hidden = true;

    actions.append(backBtn, continueBtn);
    back.append(backTitle, backBody, actions);

    inner.append(front, back);

    root.addEventListener('click', (ev) => ev.stopPropagation());
    root.addEventListener('keydown', (ev) => ev.stopPropagation(), true);

    let resizeObserver = null;
    let resizeHandler = null;

    const syncCardHeight = () => {
      try {
        card.style.minHeight = '';
        card.style.height = 'auto';

        const panelStyles = window.getComputedStyle(right);
        const panelPadTop = parseFloat(panelStyles.paddingTop) || 0;
        const panelPadBottom = parseFloat(panelStyles.paddingBottom) || 0;
        const availableHeight = Math.max(240, right.clientHeight - panelPadTop - panelPadBottom);

        const backStyles = window.getComputedStyle(back);
        const padTop = parseFloat(backStyles.paddingTop) || 0;
        const padBottom = parseFloat(backStyles.paddingBottom) || 0;
        const gap = parseFloat(backStyles.rowGap || backStyles.gap) || 0;
        const bodyPadTop = parseFloat(window.getComputedStyle(backBody).paddingTop) || 0;
        const bodyPadBottom = parseFloat(window.getComputedStyle(backBody).paddingBottom) || 0;

        const naturalHeight =
          backTitle.scrollHeight +
          fact.scrollHeight +
          actions.scrollHeight +
          padTop + padBottom +
          bodyPadTop + bodyPadBottom +
          (gap * 2);

        const targetHeight = Math.min(Math.max(260, naturalHeight + 10), availableHeight);
        card.style.height = `${targetHeight}px`;
      } catch (_) {}
    };

    const flipToBack = (ev) => {
      if (ev) ev.stopPropagation();
      card.classList.add('is-flipped');
      card.classList.remove('is-teasing');
      syncCardHeight();
    };

    const flipToFront = (ev) => {
      if (ev) ev.stopPropagation();
      card.classList.remove('is-flipped');
      syncCardHeight();
    };

    front.addEventListener('click', flipToBack);
    backBtn.addEventListener('click', flipToFront);

    function bindControls(onAdvance){
      continueBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (typeof onAdvance === 'function') onAdvance();
      });
    }

    syncCardHeight();

    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(() => syncCardHeight());
      resizeObserver.observe(right);
      resizeObserver.observe(back);
      resizeObserver.observe(fact);
    } else {
      resizeHandler = () => syncCardHeight();
      window.addEventListener('resize', resizeHandler);
    }

    return {
      lockText: `${String(s.title || '')} ${String(s.fact || '')}`.trim(),
      bindTyping(){},
      noLock: true,
      suppressRootClick: true,
      bindControls,
      destroy(){
        try { resizeObserver && resizeObserver.disconnect(); } catch (_) {}
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      }
    };
  });
})();
