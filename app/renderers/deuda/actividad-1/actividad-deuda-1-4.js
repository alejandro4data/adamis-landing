// =====================================================
// actividad-deuda-cierre.js — Pantalla de cierre de la actividad
// Solo texto + imagen. Decide éxito/fracaso según estado final.
// Éxito: impaciencia < capPct y sin préstamos impagados (propios).
// En éxito, muestra animación de fuegos artificiales.
// Personalizable con:
//   event.successText, event.successImage
//   event.failText,    event.failImage
//   event.impatience.capPct (opcional; si no, hereda de st.fx.impatienceCap o usa 70)
// =====================================================

SlideRendererRegistry.register('actividad-deuda-1-4', function (s, root) {
  const H = window.DeudaHelpers;
  const st = H.ensureState();
  root.classList.add('tpl--actividad-deuda');

  // === Resolver capPct (umbral) ===
  const ev = s?.event || {};
  const capFromEvent = Number((ev.impatience && ev.impatience.capPct) ?? undefined);
  const lastCap = (st.fx && Number.isFinite(st.fx.impatienceCap)) ? Number(st.fx.impatienceCap) : undefined;
  const CAP_PCT = Number.isFinite(capFromEvent) ? capFromEvent : (Number.isFinite(lastCap) ? lastCap : 70);


 // Falla si existe cualquier préstamo TOMADO por el alumno (no 'given') que siga pendiente: Activo o Impagado.
const hasPrestamosPendientes = (st.loans || []).some(
l => !l.given && (l.status === H.STATUS.ACTIVO || l.status === H.STATUS.IMPAGADO));  
const underCap = (st.impatience || 0) < CAP_PCT;
const success = underCap && !hasPrestamosPendientes;

  // === Mensajes / imágenes (con defaults) ===
  const successText  = ev.successText || '🎉 ¡Enhorabuena! Has mantenido tu impaciencia bajo control y terminas sin impagos.';
  const successImage = ev.successImage || '../assets/deuda/cierre/success.png';
  const failText     = ev.failText    || '⚠️ Objetivo no cumplido. Revisa tu gestión de impaciencia y evita llegar a impagos.';
  const failImage    = ev.failImage   || '../assets/deuda/cierre/fail.png';

  const titleText = success ? successText : failText;
  const imgSrc    = success ? successImage : failImage;

  // === Layout (texto arriba, imagen grande debajo) ===
  const header = H.el('div', { className: 'deuda-header' },
    H.el('div', { className: 'evento-banner cierre-banner' }, H.txt(titleText))
  );

  const body = H.el('div', { className: 'deuda-body cierre-body' });
  const center = H.el('div', { className: 'deuda-col center' },
    H.el('div', { className: 'visual-stage cierre-stage' },
      H.el('img', { className: 'evento-imagen cierre-imagen', src: imgSrc, alt: success ? 'Éxito' : 'No logrado' })
    )
  );

  body.appendChild(center);
  root.appendChild(header);
  root.appendChild(body);

  // Click normal en cualquier parte de la slide para finalizar
  if (window.SlideActions && typeof SlideActions.next === 'function') {
    let sent = false;

    root.style.cursor = 'pointer';

    root.addEventListener('click', (e) => {
      // Evitar doble envío por clicks múltiples
      if (sent) return;
      sent = true;

      st.lastAction = { type: 'cierre', success, week: st.week };

      const recId = 'd_rec';
      const recVal = success ? 1 : 0;

      try { sessionStorage.setItem(recId, String(recVal)); } catch (_) {}

      window.dispatchEvent(new CustomEvent('encuesta:submit', {
        detail: { id: recId, respuesta: recVal }
      }));

      SlideActions.next();
    }, { once: true });
  }


  // === Fuegos artificiales / confeti en caso de éxito ===
  if (success && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    launchFireworks(root);
  }

  // ===== Estilos mínimos =====
  (function ensureCierreStyles(){
    const ID = 'deuda-cierre-style'; if (document.getElementById(ID)) return;
    const css = document.createElement('style'); css.id = ID;
    css.textContent = `
      .cierre-banner { text-align:center; font-weight:800; }
      .cierre-body   { display:flex; gap:20px; align-items:center; justify-content:center; }
      .cierre-stage  { height:clamp(400px, 85vh, 900px); width:100%; display:flex; align-items:center; justify-content:center; }
      .cierre-imagen { max-width:100%; max-height:100%; object-fit:contain; display:block; }
      .fwx-canvas { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events:none; z-index: 9999; }
    `;
    document.head.appendChild(css);
  })();

  // ------- Impl. simple de fireworks/confeti (autocontenida) -------
  function launchFireworks(container){
    const cv = document.createElement('canvas');
    cv.className = 'fwx-canvas';
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    let w, h, dpr = Math.min(2, window.devicePixelRatio || 1);

    function resize(){
      w = cv.width  = Math.floor(window.innerWidth  * dpr);
      h = cv.height = Math.floor(window.innerHeight * dpr);
      cv.style.width  = '100vw';
      cv.style.height = '100vh';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize(); window.addEventListener('resize', resize);

    // Partículas
    const colors = ['#ff5252','#ffca28','#66bb6a','#42a5f5','#ab47bc','#26c6da'];
    const grav = 0.12, drag = 0.985;
    const sparks = [];
    const confetti = [];

    function burst(x,y,count=60,speed=6){
      for(let i=0;i<count;i++){
        const ang = (Math.PI*2)*Math.random();
        const spd = speed * (0.5 + Math.random()*0.8);
        sparks.push({
          x, y,
          vx: Math.cos(ang)*spd,
          vy: Math.sin(ang)*spd,
          life: 60 + Math.random()*30,
          color: colors[(Math.random()*colors.length)|0],
          size: 2 + Math.random()*2
        });
      }
    }

    function confettiBurst(x,y,count=80){
      for(let i=0;i<count;i++){
        confetti.push({
          x, y,
          vx: (Math.random()*6 - 3),
          vy: -(3 + Math.random()*4),
          w: 6 + Math.random()*6,
          h: 3 + Math.random()*3,
          rot: Math.random()*Math.PI,
          vr: (Math.random()*0.2 - 0.1),
          life: 120 + Math.random()*60,
          color: colors[(Math.random()*colors.length)|0]
        });
      }
    }

    // Lanzar 3 ráfagas espaciadas
    const shots = [
      () => { const x=w/4,   y=h*0.35; burst(x,y,70,7); confettiBurst(x,y,90); },
      () => { const x=w/2,   y=h*0.30; burst(x,y,80,7.5); confettiBurst(x,y,110); },
      () => { const x=w*0.75,y=h*0.33; burst(x,y,70,7); confettiBurst(x,y,90); }
    ];
    let shotIdx = 0;
    const shotTimer = setInterval(()=>{
      if (shotIdx < shots.length) shots[shotIdx++]();
      else clearInterval(shotTimer);
    }, 650);

    let alive = true;
    setTimeout(()=> alive = false, 4200); // duración total ~4.2s

    (function tick(){
      ctx.clearRect(0,0,w,h);

      // Sparks
      for (let i=sparks.length-1;i>=0;i--){
        const p=sparks[i];
        p.vx *= drag; p.vy = p.vy*drag + grav;
        p.x += p.vx; p.y += p.vy; p.life -= 1;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life/60));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
        if (p.life<=0 || p.y>h+40) sparks.splice(i,1);
      }

      // Confetti
      for (let i=confetti.length-1;i>=0;i--){
        const c=confetti[i];
        c.vx *= 0.99; c.vy += grav*0.6;
        c.x += c.vx; c.y += c.vy; c.rot += c.vr; c.life -= 1;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.globalAlpha = Math.max(0, Math.min(1, c.life/120));
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w/2, -c.h/2, c.w, c.h);
        ctx.restore();
        if (c.life<=0 || c.y>h+50) confetti.splice(i,1);
      }

      ctx.globalAlpha = 1;

      if (alive || sparks.length || confetti.length) {
        requestAnimationFrame(tick);
      } else {
        window.removeEventListener('resize', resize);
        cv.remove();
      }
    })();
  }
});

// Fallback opcional para motores que consulten window.Renderers:
window.Renderers = window.Renderers || {};
window.Renderers['actividad-deuda-cierre'] = function(root, slide){
  const get = (window.SlideRendererRegistry && typeof SlideRendererRegistry.get === 'function')
    ? SlideRendererRegistry.get('actividad-deuda-cierre')
    : null;
  if (typeof get === 'function') return get(slide, root);
  console.error('[actividad-deuda-cierre] Renderer no encontrado en SlideRendererRegistry');
};
