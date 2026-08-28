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

  const SPEAKER_THEMES = Object.freeze({
    adamis: Object.freeze({
      key: 'adamis',
      accent: '#d7a51e',
      border: '#9a6500',
      surface: '#fffaf0',
      pill: '#ffedaa',
      ink: '#4d3400',
      glow1: 'rgb(255 214 79 / 28%)',
      glow2: 'rgb(215 165 30 / 20%)',
      focus: 'rgb(215 165 30 / 32%)'
    }),
    chispa: Object.freeze({
      key: 'chispa',
      accent: '#f26a21',
      border: '#b93c08',
      surface: '#fff8f2',
      pill: '#ffd9bf',
      ink: '#6d2507',
      glow1: 'rgb(255 148 82 / 26%)',
      glow2: 'rgb(242 106 33 / 18%)',
      focus: 'rgb(242 106 33 / 30%)'
    }),
    brote: Object.freeze({
      key: 'brote',
      accent: '#49a942',
      border: '#287a31',
      surface: '#f7fcf4',
      pill: '#d7f1ce',
      ink: '#174b22',
      glow1: 'rgb(111 196 92 / 24%)',
      glow2: 'rgb(73 169 66 / 18%)',
      focus: 'rgb(73 169 66 / 30%)'
    })
  });

  function normalizeSpeakerKey(value) {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  function getSpeakerTheme(slide) {
    const key = normalizeSpeakerKey(
      slide && (slide.speakerKey ?? slide.personajeKey ?? slide.speaker)
    );
    return SPEAKER_THEMES[key] || null;
  }

  window.RendererUtils = window.RendererUtils || {};
  window.RendererUtils.bindAdvance = window.RendererUtils.bindAdvance || bindAdvance;
  window.RendererUtils.getSpeakerTheme = window.RendererUtils.getSpeakerTheme || getSpeakerTheme;
})();

