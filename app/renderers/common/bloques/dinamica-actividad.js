(() => {
  'use strict';

  SlideRendererRegistry.register('dinamica-actividad', function(s, root /*, ctx */){
    root.classList.add('tpl--dinamica-actividad');

    const grid = document.createElement('div');
    grid.className = 'dynact-grid';

    // Main image
    const main = document.createElement('div');
    main.className = 'dynact-main';
    const img = document.createElement('img');
    img.className = 'dynact-main__img';
    const imgSrc = (typeof s.img === 'string') ? s.img : (s.img?.src || s.imagen || s.image);
    if (imgSrc) img.src = imgSrc;
    img.alt = (typeof s.img === 'object' && s.img?.alt) ? s.img.alt : (s.alt || 'Escena');
    main.appendChild(img);

    // Side column
    const side = document.createElement('aside');
    side.className = 'dynact-side';

    // descripción
    const descBox = document.createElement('div');
    descBox.className = 'dynact-desc';
    const descP = document.createElement('p');
    const descText = String(s.descripcion ?? s.description ?? '').trim();
    descP.textContent = descText;
    descBox.appendChild(descP);

    // iconos (1-4)
    const iconsBox = document.createElement('div');
    iconsBox.className = 'dynact-icons';
    const ul = document.createElement('ul');
    ul.className = 'dynact-icons__list';

    const rawIcons = Array.isArray(s.iconos) ? s.iconos : (Array.isArray(s.icons) ? s.icons : []);
    const icons = rawIcons.slice(0, 4).map(x => {
      if (!x) return null;
      if (typeof x === 'string') return { src: x, text: '' };
      return { src: x.src || '', text: String(x.text ?? x.label ?? ''), alt: x.alt || '' };
    }).filter(Boolean);

    const iconsJoin = icons.map(k=>k.text).join(' ');

    icons.forEach(k => {
      const li = document.createElement('li');
      li.className = 'dynact-icon';
      const kimg = document.createElement('img');
      kimg.className = 'dynact-icon__img';
      kimg.src = k.src; kimg.alt = k.alt || '';
      const span = document.createElement('span');
      span.className = 'dynact-icon__text';
      span.textContent = k.text;
      li.appendChild(kimg);
      li.appendChild(span);
      ul.appendChild(li);
    });
    iconsBox.appendChild(ul);

    side.appendChild(descBox);
    side.appendChild(iconsBox);

    // Bottom actions (3 botones)
    const actions = document.createElement('div');
    actions.className = 'dynact-actions';

    const bLow = document.createElement('button');
    bLow.type = 'button';
    bLow.className = 'dynact-btn dynact-btn--low';
    bLow.dataset.choice = 'low';
    bLow.textContent = s.btnBajoText || 'Interés Bajo (1–7%)';

    const bMid = document.createElement('button');
    bMid.type = 'button';
    bMid.className = 'dynact-btn dynact-btn--mid';
    bMid.dataset.choice = 'mid';
    bMid.textContent = s.btnMedioText || 'Interés Medio (8–14%)';

    const bHigh = document.createElement('button');
    bHigh.type = 'button';
    bHigh.className = 'dynact-btn dynact-btn--high';
    bHigh.dataset.choice = 'high';
    bHigh.textContent = s.btnAltoText || 'Interés Alto (15–25 %)';

    actions.appendChild(bLow);
    actions.appendChild(bMid);
    actions.appendChild(bHigh);

    // compose
    grid.appendChild(main);
    grid.appendChild(side);
    grid.appendChild(actions);
    root.appendChild(grid);

    function wire(onAdvance){
      const choose = (choice) => {
        try {
          if (typeof s.onSelect === 'function') s.onSelect(choice, s);
          if (typeof s.onChoice === 'function') s.onChoice(choice, s);
        } catch(_e){}
        onAdvance();
      };
      [bLow, bMid, bHigh].forEach(btn => {
        btn.addEventListener('click', (ev) => { ev.stopPropagation(); choose(btn.dataset.choice); });
        btn.addEventListener('keydown', (ev) => {
          if (ev.code === 'Space' || ev.code === 'Enter'){ ev.preventDefault(); ev.stopPropagation(); choose(btn.dataset.choice); }
        });
      });
      grid.addEventListener('click', (ev) => ev.stopPropagation());
      grid.addEventListener('keydown', (ev) => ev.stopPropagation(), true);
    }

    return {
      lockText: `${descText} ${iconsJoin}`.trim(),
      bindTyping(){},
      hint: null,
      noLock: true,
      suppressRootClick: true,
      bindControls: wire
    };
  });

})();
