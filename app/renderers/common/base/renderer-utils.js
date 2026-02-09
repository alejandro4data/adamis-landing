(() => {
  'use strict';

  // Utilidad básica para avanzar la slide por clic o teclas (Espacio/Enter).
  // Se asegura de disparar sólo una vez para evitar dobles avances.
  function bindAdvance(root, onAdvance) {
    if (!root || typeof onAdvance !== 'function') return;
    let advanced = false;

    root.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (advanced) return;
      advanced = true;
      onAdvance();
    }, { once: true });

    root.addEventListener('keydown', (ev) => {
      if (ev.code === 'Space' || ev.code === 'Enter') {
        ev.preventDefault();
        ev.stopPropagation();
        if (advanced) return;
        advanced = true;
        onAdvance();
      }
    });
  }

  window.RendererUtils = window.RendererUtils || {};
  window.RendererUtils.bindAdvance = window.RendererUtils.bindAdvance || bindAdvance;
})();

