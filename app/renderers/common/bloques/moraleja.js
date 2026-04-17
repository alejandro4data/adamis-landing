(() => {
  'use strict';

  const tr = (text) => {
    try {
      if (window.I18N && typeof window.I18N.tr === 'function') return window.I18N.tr(text);
    } catch (_) {}
    return text;
  };

  SlideRendererRegistry.register('moraleja', function(s, root){
    root.classList.add('tpl--moraleja');

    const stage = document.createElement('div');
    stage.className = 'moraleja-stage';
    root.appendChild(stage);

    const intro = document.createElement('p');
    intro.className = 'moraleja-intro';
    intro.textContent = tr(String(s.introText || 'La moraleja de esta clase es...'));
    stage.appendChild(intro);

    const scroll = document.createElement('article');
    scroll.className = 'moraleja-scroll';
    stage.appendChild(scroll);

    let parchmentImgEl = null;
    if (s.parchmentImg && s.parchmentImg.src) {
      const img = document.createElement('img');
      img.className = 'moraleja-scroll__img';
      img.src = s.parchmentImg.src;
      img.alt = s.parchmentImg.alt || 'Pergamino';
      parchmentImgEl = img;
      scroll.appendChild(img);
    } else {
      scroll.classList.add('is-fallback');
    }

    const text = document.createElement('div');
    text.className = 'moraleja-scroll__text';
    text.textContent = tr(String(s.text || 'Aquí irá la moraleja de la clase.'));
    scroll.appendChild(text);

    const footer = document.createElement('div');
    footer.className = 'moraleja-footer';
    stage.appendChild(footer);

    const finishBtn = document.createElement('button');
    finishBtn.type = 'button';
    finishBtn.className = 'moraleja-btn';
    finishBtn.textContent = tr(String(s.buttonText || 'Fin de la clase'));
    footer.appendChild(finishBtn);

    root.addEventListener('click', (ev) => ev.stopPropagation());
    root.addEventListener('keydown', (ev) => ev.stopPropagation(), true);
    scroll.addEventListener('click', (ev) => ev.stopPropagation());
    stage.addEventListener('click', (ev) => ev.stopPropagation());

    let resizeObserver = null;
    let resizeHandler = null;

    const fitText = () => {
      try {
        text.style.fontSize = '';
        text.style.lineHeight = '';

        const styles = window.getComputedStyle(text);
        const baseFontSize = parseFloat(styles.fontSize) || 22;
        const baseLineHeight = parseFloat(styles.lineHeight);
        const lineRatio = Number.isFinite(baseLineHeight) && baseFontSize > 0
          ? (baseLineHeight / baseFontSize)
          : 1.16;

        const minFontSize = 12;
        let low = minFontSize;
        let high = Math.max(baseFontSize, minFontSize);
        let best = minFontSize;

        while ((high - low) > 0.25) {
          const mid = (low + high) / 2;
          text.style.fontSize = `${mid}px`;
          text.style.lineHeight = `${mid * lineRatio}px`;

          const fits = text.scrollHeight <= text.clientHeight && text.scrollWidth <= text.clientWidth;
          if (fits) {
            best = mid;
            low = mid;
          } else {
            high = mid;
          }
        }

        text.style.fontSize = `${best}px`;
        text.style.lineHeight = `${best * lineRatio}px`;
      } catch (_) {}
    };

    fitText();
    if (parchmentImgEl) {
      parchmentImgEl.addEventListener('load', fitText, { once: true });
    }

    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(() => fitText());
      resizeObserver.observe(scroll);
      resizeObserver.observe(text);
      if (parchmentImgEl) resizeObserver.observe(parchmentImgEl);
    } else {
      resizeHandler = () => fitText();
      window.addEventListener('resize', resizeHandler);
    }

    return {
      lockText: `${String(s.introText || '')} ${String(s.text || '')}`.trim(),
      bindTyping(){},
      noLock: true,
      suppressRootClick: true,
      bindControls(onAdvance){
        finishBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (typeof onAdvance === 'function') onAdvance();
        });
      },
      destroy(){
        try { resizeObserver && resizeObserver.disconnect(); } catch (_) {}
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      }
    };
  });
})();
