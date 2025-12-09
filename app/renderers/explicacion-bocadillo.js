(() => {
  'use strict';

  SlideRendererRegistry.register('explicacion-bocadillo', function(s, root, ctx){
    const { setVar, pct, imagePosFromTextPos, makeHint, makeRewardBox, typeIn, registerTyper, CONT_LABEL } = ctx;

    const textPos = (s.textPosition || 'right').toLowerCase();
    const imgPos  = imagePosFromTextPos(textPos);
    root.classList.add('layout--' + imgPos, 'tpl--explicacion-bocadillo');

    let imgFrac = s.imageFraction;
    if (s.textFraction != null && imgFrac == null){
      const tf = typeof s.textFraction === 'number'
        ? s.textFraction
        : parseFloat(String(s.textFraction).replace('%',''))/100;
      const val = (1 - (isNaN(tf) ? 0.2 : tf));
      imgFrac = (val * 100) + '%';
    }
    setVar(root, '--img-frac', pct(imgFrac ?? '80%'));

    if (s.img?.src || s.img){
      const img = document.createElement('img');
      img.className = 'slide__media';
      if (typeof s.img === 'string') img.src = s.img;
      else { img.src = s.img.src || ''; img.alt = s.img.alt || ''; }
      root.appendChild(img);
    }

    const content = document.createElement('div');
    content.className = 'slide__content';

    const wrap = document.createElement('div');
    wrap.className = 'comic-bubble';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', CONT_LABEL);
    if (s.narratorColor){
      setVar(wrap, '--accent',     s.narratorColor);
      setVar(wrap, '--stroke-col', s.narratorColor); // borde del bocadillo
    }

    if (s.narrator){
      const pill = document.createElement('div');
      pill.className = 'narrator-pill';
      const inner = document.createElement('span');
      inner.className = 'narrator-pill__in';
      inner.textContent = String(s.narrator);
      pill.appendChild(inner);
      if (s.narratorColor){
        setVar(pill,  '--hex-border', s.narratorColor); // color del borde de la píldora
        setVar(inner, '--hex-bg',     '#fff'); // color de relleno de la píldora
        setVar(pill, '--hex-stroke', '3px'); // grosor del anillo
      }
      wrap.appendChild(pill);
    }

    const textNode = document.createElement('div');
    textNode.className = 'slide__text';
    wrap.appendChild(textNode);

    const hint = makeHint(CONT_LABEL);
    wrap.appendChild(hint.el);

    content.appendChild(wrap);

    // Recompensa opcional
    let rewardPlain = '';
    if (s.recompensa || s.reward || s.premio){
      const rw = makeRewardBox(s.recompensa || s.reward || s.premio);
      content.appendChild(rw.el);
      rewardPlain = rw.plain;
    }

    root.appendChild(content);

    return {
      lockText: `${String(s.text || '')} ${rewardPlain}`.trim(),
      bindTyping(){
        const typeCfg = (typeof s.typewriter === 'object' && s.typewriter) ? s.typewriter : {};
        const speed = (typeof s.typeSpeed === 'number')
          ? s.typeSpeed
          : (typeof typeCfg.speed === 'number' ? typeCfg.speed : 22);
        const wantsTW = (s.typewriter === undefined) ? true : Boolean(s.typewriter);

        if (wantsTW && s.text){
          const t = typeIn(textNode, String(s.text), speed);
          registerTyper(t);
        } else {
          textNode.textContent = String(s.text || '');
        }
      },
      hint
    };
  });

})();
