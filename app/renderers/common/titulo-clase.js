(() => {
  'use strict';

  SlideRendererRegistry.register('titulo-clase', function(s, root, ctx){
    const { makeHint, CONT_LABEL } = ctx;

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
      const text = String(s.titulo ?? s.title ?? s.text ?? '').trim();
      lockText = text;

      const h1 = document.createElement('h1');
      h1.className = 'titulo-clase__text';

      const frag = document.createDocumentFragment();
      [...text].forEach((ch, idx) => {
        if (ch === '\n') { frag.appendChild(document.createElement('br')); return; }
        const span = document.createElement('span');
        span.className = 'char';
        span.style.setProperty('--i', String(idx));
        if (ch === ' ') {
          span.classList.add('space');
          span.textContent = '\u00A0';
        } else {
          span.textContent = ch;
        }
        frag.appendChild(span);
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
        let advanced = false;

        // CLICK EN CUALQUIER PARTE DE LA SLIDE (root)
        root.addEventListener('click', (ev) => {
          ev.stopPropagation();            // no dejes que burbujee
          if (advanced) return;            // guard anti-múltiples clics
          advanced = true;
          onAdvance();
        }, { once: true });                 // además, que solo se atienda el primer click

        // TECLAS ACCESIBLES (espacio/enter) a nivel de slide
        root.addEventListener('keydown', (ev) => {
          if (ev.code === 'Space' || ev.code === 'Enter'){
            ev.preventDefault();
            ev.stopPropagation();
            if (advanced) return;
            advanced = true;
            onAdvance();
          }
        });
      }

    };
  });

})();
