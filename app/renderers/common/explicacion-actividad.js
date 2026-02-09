(() => {
  'use strict';

  SlideRendererRegistry.register('explicacion-actividad', function(s, root, ctx){
    const { makeHint, makeRewardBox, CONT_LABEL } = ctx;

    root.classList.add('tpl--explicacion-actividad');

    const cont = document.createElement('div');
    cont.className = 'activity-expl';
    cont.setAttribute('role','button');
    cont.setAttribute('tabindex','0');

    const titleText = (s.title ?? s.heading ?? 'Normas de la Actividad');
    if (titleText){
      const title = document.createElement('h2');
      title.className = 'activity-expl__title';
      title.textContent = String(titleText);
      cont.appendChild(title);
    }

    const ul = document.createElement('ul');
    ul.className = 'activity-expl__list';

    const src = Array.isArray(s.guiones) ? s.guiones
             : Array.isArray(s.bullets) ? s.bullets
             : Array.isArray(s.puntos)  ? s.puntos
             : [];
    const cleaned = src.map(x => String(x ?? '').trim()).filter(Boolean).slice(0, 5);
    const lockJoin = cleaned.join(' ');

    cleaned.forEach(t => {
      const li = document.createElement('li');
      li.className = 'activity-expl__item';
      li.textContent = t;
      ul.appendChild(li);
    });

    cont.appendChild(ul);

    // Recompensa opcional
    let rewardPlain = '';
    if (s.recompensa || s.reward || s.premio){
      const rw = makeRewardBox(s.recompensa || s.reward || s.premio);
      cont.appendChild(rw.el);
      rewardPlain = rw.plain;
    }

    const hint = makeHint(CONT_LABEL);
    root.appendChild(cont);
    root.appendChild(hint.el);

    return {
      lockText: `${lockJoin} ${rewardPlain}`.trim(),
      bindTyping(){},
      hint,
      noLock: !!s.noLock,
      suppressRootClick: true,   // ← clave para que app.js no ponga el click del root
      bindControls(onAdvance){
        let advanced = false;

        // CLICK EN CUALQUIER PARTE DE LA SLIDE (root)
        root.addEventListener('click', (ev) => {
          // Evita que llegue a posibles manejadores globales
          ev.stopPropagation();
          if (advanced) return;
          advanced = true;
          onAdvance();
        }, { once: true });

        // TECLAS ACCESIBLES en la slide (espacio/enter) sin burbuja
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
