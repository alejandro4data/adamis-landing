(() => {
  'use strict';

  const tr = (text) => {
    try {
      if (window.I18N && typeof window.I18N.tr === 'function') return window.I18N.tr(text);
    } catch (_) {}
    return text;
  };

  SlideRendererRegistry.register('titulo-actividad', function(s, root, ctx){
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

    root.classList.add('tpl--titulo-actividad');
    const box = document.createElement('div');
    box.className = 'titulo-actividad center-box';
    box.setAttribute('role','button');
    box.setAttribute('tabindex','0');

    const h1 = document.createElement('h1');
    h1.className = 'titulo-actividad__title';
    h1.textContent = tr('Actividad Interactiva');

    const h2 = document.createElement('h2');
    h2.className = 'titulo-actividad__name';
    const nombre = s.actividad || s.nombre || s.name || '';
    h2.textContent = tr(String(nombre));

    box.appendChild(h1);
    box.appendChild(h2);

    const hint = makeHint(CONT_LABEL);

    root.appendChild(box);
    root.appendChild(hint.el);

    return {
      lockText: `${h1.textContent} ${h2.textContent}`.trim(),
      bindTyping(){},
      hint,
      noLock: true,
      suppressRootClick: true,   // ← clave para que app.js no añada el click del root
      bindControls(onAdvance){
        bindAdvance(root, onAdvance);
      }

    };
  });

})();
