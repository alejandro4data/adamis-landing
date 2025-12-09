(() => {
  'use strict';

  SlideRendererRegistry.register('titulo-actividad', function(s, root, ctx){
    const { makeHint, CONT_LABEL } = ctx;

    root.classList.add('tpl--titulo-actividad');
    const box = document.createElement('div');
    box.className = 'titulo-actividad center-box';
    box.setAttribute('role','button');
    box.setAttribute('tabindex','0');

    const h1 = document.createElement('h1');
    h1.className = 'titulo-actividad__title';
    h1.textContent = 'Actividad Interactiva';

    const h2 = document.createElement('h2');
    h2.className = 'titulo-actividad__name';
    const nombre = s.actividad || s.nombre || s.name || '';
    h2.textContent = String(nombre);

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
        let advanced = false;

        // CLICK EN CUALQUIER PARTE DE LA SLIDE (root)
        root.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (advanced) return;
          advanced = true;
          onAdvance();
        }, { once: true });

        // TECLAS ACCESIBLES (espacio/enter) en la slide
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
