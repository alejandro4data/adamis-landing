(() => {
  'use strict';

  // Render para slide con un único botón grande centrado
  SlideRendererRegistry.register('boton-unico', function (s, root /*, ctx */) {
    root.classList.add('tpl--boton-unico');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn single-btn';
    btn.textContent = String(s.label || s.texto || s.text || 'Continuar');
    root.appendChild(btn);

    function bindControls(onAdvance) {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const action = String(s.action || s.behavior || '').toLowerCase();
        if (action === 'menu' || action === 'menu-principal' || action === 'home') {
          window.location.href = './menu.html';
          return;
        }
        if (typeof onAdvance === 'function') onAdvance();
      });
    }

    // Evita avanzar al hacer click en fondo
    root.addEventListener('click', (ev) => ev.stopPropagation());

    return {
      lockText: String(s.label || s.text || ''),
      bindTyping(){},
      suppressRootClick: true,
      bindControls
    };
  });
})();
