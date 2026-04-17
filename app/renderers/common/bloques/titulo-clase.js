(() => {
  'use strict';

  const tr = (text) => {
    try {
      if (window.I18N && typeof window.I18N.tr === 'function') return window.I18N.tr(text);
    } catch (_) {}
    return text;
  };

  SlideRendererRegistry.register('titulo-clase', function(s, root, ctx){
    const { makeHint, CONT_LABEL } = ctx;
    const bindAdvance = (window.RendererUtils && window.RendererUtils.bindAdvance) || function(node, onAdvance){
      if (!node || typeof onAdvance !== 'function') return;
      let advanced = false;
      node.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (advanced) return;
        advanced = true;
        onAdvance();
      }, { once: true });
      node.addEventListener('keydown', (ev) => {
        if (ev.code === 'Space' || ev.code === 'Enter'){
          ev.preventDefault();
          ev.stopPropagation();
          if (advanced) return;
          advanced = true;
          onAdvance();
        }
      });
    };

    root.classList.add('tpl--titulo-clase');

    const box = document.createElement('div');
    box.className = 'titulo-clase center-box';
    box.setAttribute('role','button');
    box.setAttribute('tabindex','0');

    const mode = String(s.modo ?? s.variant ?? s.mode ?? '').toLowerCase();
    const hasText = !!String(s.titulo ?? s.title ?? s.text ?? '').trim();
    const hasImg  = !!(s.imgTitulo || s.img || s.imagen || s.image);
    const useImage = (mode === 'imagen' || mode === 'image') ? true : (!hasText && hasImg);

    const hint = makeHint(CONT_LABEL);
    let lockText = '';

    if (useImage){
      const src = (typeof s.imgTitulo === 'string' && s.imgTitulo) ? s.imgTitulo
              : (typeof s.img === 'string' && s.img) ? s.img
              : (typeof s.imagen === 'string' && s.imagen) ? s.imagen
              : (typeof s.image  === 'string' && s.image) ? s.image
              : (s.imgTitulo?.src || s.img?.src || s.imagen?.src || s.image?.src || '');
      const alt = s.alt || s.imgTitulo?.alt || s.img?.alt || s.imagen?.alt || s.image?.alt || 'Título visual';
      const img = document.createElement('img');
      img.className = 'titulo-clase__img';
      img.src = src; img.alt = alt;
      box.appendChild(img);
    } else {
      const text = tr(String(s.titulo ?? s.title ?? s.text ?? '').trim());
      lockText = text;

      const h1 = document.createElement('h1');
      h1.className = 'titulo-clase__text';

      const frag = document.createDocumentFragment();
      let idx = 0;
      const lines = text.split('\n');

      lines.forEach((line, lineIndex) => {
        const tokens = line.match(/\S+|\s+/g) || [];

        tokens.forEach((token) => {
          if (/^\s+$/.test(token)) {
            frag.appendChild(document.createTextNode(' '));
            return;
          }

          const word = document.createElement('span');
          word.className = 'titulo-clase__word';

          [...token].forEach((ch) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.style.setProperty('--i', String(idx++));
            span.textContent = ch;
            word.appendChild(span);
          });

          frag.appendChild(word);
        });

        if (lineIndex < lines.length - 1) {
          frag.appendChild(document.createElement('br'));
        }
      });

      h1.appendChild(frag);
      box.appendChild(h1);
    }

    root.appendChild(box);
    root.appendChild(hint.el);

    return {
      lockText,
      bindTyping(){},
      hint,
      noLock: true,
      suppressRootClick: true,   // ← clave para evitar doble avance del handler global
      bindControls(onAdvance){
        bindAdvance(root, onAdvance);
      }

    };
  });

})();
