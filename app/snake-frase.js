// snake-frase.js — estética y cinemática al completar frase
// - Lógica de movimiento intacta + microcola de 2 para combos
// - Letras como monedas doradas
// - Rejilla/fondo moderno
// - Cinemática centrada con "Continuar" que pausa/reanuda el juego
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const tr = (text) => {
    try {
      if (window.I18N && typeof window.I18N.tr === 'function') return window.I18N.tr(text);
    } catch (_) {}
    return text;
  };
  const currentLang = () => {
    try {
      if (window.I18N && typeof window.I18N.getLang === 'function') return window.I18N.getLang();
    } catch (_) {}
    try {
      const stored = String(localStorage.getItem('adamis_lang') || '').toLowerCase();
      if (stored.startsWith('en')) return 'en';
    } catch (_) {}
    try {
      const htmlLang = String(document.documentElement.lang || '').toLowerCase();
      if (htmlLang.startsWith('en')) return 'en';
    } catch (_) {}
    return 'es';
  };

  // ---------- DOM ----------
  const canvas = $('#snake-canvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  const pill = $('#phrase-pill');
  const scoreEl = $('#coin-score');
  const btnRestart = $('#btn-restart');
  const modal = $('#snake-result');
  const modalTitle = $('#snake-result-title');
  const modalText  = $('#snake-result-text');
  const modalRestart = $('#snake-restart');

  // Cinemática (overlay)
  const cin    = document.getElementById('cinematic');
  const cinTxt = document.getElementById('cin-phrase');
  const cinBtn = document.getElementById('cin-continue');
  let isCinematic = false;

  // ---------- Config ----------
  const GRID = 12;
  const CSS_MAX = 440;
  const STEP_MS = 190;
  const STEP_MIN = 150;
  const COIN_ACCEL = 3;
  const EAT_ACCEL = 2;

  // Retina / escala
  let DPR = Math.max(1, window.devicePixelRatio || 1);
  let CELL = 32;

  // Grid lógico
  const COLS = GRID, ROWS = GRID, CAP = COLS*ROWS;

  // Offscreen para rejilla
  const gridCanvas = document.createElement('canvas');
  const gctx = gridCanvas.getContext('2d', { alpha: false });

  // ---------- Estado juego ----------
  const buf = new Uint16Array(CAP);  // ring buffer de celdas
  const occ = new Uint8Array(CAP);   // ocupación O(1)
  let head=0, length=4;

  // dirección actual + microcola de giros (máx 2, permite combos)
  let dx = 1, dy = 0;
  const dirQueue = [];
  const MAX_PENDING = 2;

  // Interpolación
  let lastTs=0, acc=0, stepMs=STEP_MS;

  // Para la cabeza: interpola de celda previa -> celda actual
  let prevHeadIdx = 0;

  // Partida
  let running=true, dead=false;

  // Objetivo
  let target = { idx:-1, char:'', coin:false };

  // Frases
  let phrases=[], phrase='', pIndex=0, inCoins=false;

  // Puntos
  let coins=0;

  // Assets
  const coinImg = new Image(); coinImg.src = '../assets/icons/coin_ranking.png';

  // Estética anim
  let shimmer = 0;
  let eyeDirX = 1, eyeDirY = 0; // dirección suavizada de la cabeza (para ojos)

  // ---------- Helpers ----------
  const xyToIdx=(x,y)=> y*COLS + x;
  const idxX=i=> i%COLS;
  const idxY=i=> (i/COLS)|0;
  const clamp=(v,a,b)=> Math.max(a, Math.min(b, v));
  const lerp=(a,b,t)=> a + (b-a)*t;

  function centerIdx(i){ return { x: idxX(i)*CELL + CELL/2, y: idxY(i)*CELL + CELL/2 }; }

  // ---------- Frases ----------
  function loadPhrases(){
    const lang = currentLang() === 'en' ? 'en' : 'es';
    const fromByLang = window.FRASES_BY_LANG && Array.isArray(window.FRASES_BY_LANG[lang])
      ? window.FRASES_BY_LANG[lang]
      : null;
    const source = fromByLang || (Array.isArray(window.FRASES) ? window.FRASES : []);
    if (source.length){
      phrases = source
        .map(s => String((s && (s.texto ?? s.frase)) || s).toUpperCase())
        .filter(Boolean);
    } else {
      phrases = lang === 'en'
        ? ['SAVE FIRST SPEND LATER', 'AVOID EXPENSIVE DEBT', 'EVERY COIN COUNTS']
        : ['AHORRA PRIMERO GASTA DESPUES', 'EVITA LAS DEUDAS CARAS', 'CADA MONEDA CUENTA'];
    }
  }
  function pickPhrase(){
    phrase = phrases[(Math.random()*phrases.length)|0] || (currentLang() === 'en' ? 'SAVE FIRST' : 'AHORRA PRIMERO');
    pIndex=0; inCoins=false; while (pIndex<phrase.length && phrase[pIndex]===' ') pIndex++;
    renderPill();
  }
  function renderPill(){
    if (!pill) return;
    pill.innerHTML = '';
    for (let i=0;i<phrase.length;i++){
      const ch = phrase[i];
      const el = document.createElement('span');
      if (ch === ' '){
        el.className='ph-space'; el.textContent=' ';
      } else if (i < pIndex){
        el.className='ph-ch ph-ch--on';  el.textContent=ch;      // letras ya comidas
      } else if (i === pIndex){
        el.className='ph-ch ph-ch--off'; el.textContent=ch;      // siguiente letra objetivo
      } else {
        el.className='ph-ch ph-ch--off'; el.textContent='•';     // pendientes como •
      }
      pill.appendChild(el);
    }
  }

  // ---------- Cinemática ----------
  function showCinematic(){
    isCinematic = true;
    acc = 0;                           // evita salto al reanudar
    target.idx = -1;                   // no dibujar objetivo durante overlay
    cinTxt && (cinTxt.textContent = phrase);
    if (cin){
      cin.classList.remove('is-hidden');
      cin.setAttribute('aria-hidden','false');
      setTimeout(()=> cinBtn?.focus(), 0);
    }
  }
  function hideCinematic(){
    if (cin){
      cin.classList.add('is-hidden');
      cin.setAttribute('aria-hidden','true');
    }
    isCinematic = false;
    // Al cerrar la cinemática: pasamos a modo monedas y generamos el primer target
    inCoins = true;
    spawnTarget();
  }
  cinBtn?.addEventListener('click', hideCinematic);

  // ---------- Canvas / DPI ----------
  function resizeCanvas(){
    DPR = Math.max(1, window.devicePixelRatio || 1);
    const wrap = document.querySelector('.snake-wrap');
    const headerEl = document.querySelector('.snake-header');
    const helpEl = document.querySelector('.snake-help');
    const pillEl = document.querySelector('.phrase-pill');
    const ctaEl = document.querySelector('.snake-cta');

    const wrapStyle = wrap ? getComputedStyle(wrap) : null;
    const padY = wrapStyle
      ? (parseFloat(wrapStyle.paddingTop) || 0) + (parseFloat(wrapStyle.paddingBottom) || 0)
      : 0;

    const headerH = headerEl ? headerEl.offsetHeight : 0;
    const helpH = helpEl ? helpEl.offsetHeight : 0;
    const pillH = pillEl ? pillEl.offsetHeight : 0;
    const ctaH = ctaEl ? ctaEl.offsetHeight : 0;
    const cardGap = 24; // margen/gap interno estimado

    const availW = Math.max(200, window.innerWidth  - 32);
    const availH = Math.max(200, window.innerHeight - headerH - helpH - padY - pillH - ctaH - cardGap);
    const cssSide = Math.floor(Math.min(CSS_MAX, availW, availH));
    canvas.style.width = cssSide+'px';
    canvas.style.height= cssSide+'px';
    canvas.width  = Math.floor(cssSide*DPR);
    canvas.height = Math.floor(cssSide*DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    ctx.imageSmoothingEnabled = true;
    CELL = Math.floor(cssSide / GRID);

    gridCanvas.width  = cssSide;           // offscreen para performance
    gridCanvas.height = cssSide;
    gctx.setTransform(1,0,0,1,0,0);
    drawGrid(gctx, cssSide);               // rejilla moderna
  }

  function drawGrid(g, size){
    // fondo suave
    const bg = g.createLinearGradient(0,0,size,size);
    bg.addColorStop(0,'rgba(255,255,255,0.96)');
    bg.addColorStop(1,'rgba(255,255,255,0.98)');
    g.fillStyle = bg; g.fillRect(0,0,size,size);

    // cuadrícula muy tenue
    g.save();
    g.globalAlpha=.10; g.strokeStyle='rgba(16,24,40,0.22)'; g.lineWidth=1;
    const s = CELL;
    for (let x=0;x<=COLS;x++){ const px = Math.floor(x*s)+.5; g.beginPath(); g.moveTo(px,0); g.lineTo(px,size); g.stroke(); }
    for (let y=0;y<=ROWS;y++){ const py = Math.floor(y*s)+.5; g.beginPath(); g.moveTo(0,py); g.lineTo(size,py); g.stroke(); }
    g.restore();

    // viñeta sutil
    const v = g.createRadialGradient(size/2,size/2, size*0.15, size/2,size/2, size*0.7);
    v.addColorStop(0,'rgba(0,0,0,0)');
    v.addColorStop(1,'rgba(0,0,0,0.06)');
    g.fillStyle = v; g.fillRect(0,0,size,size);
  }

  // ---------- Init serpiente ----------
  function placeSnake(){
    occ.fill(0); dirQueue.length = 0;
    length=4; dx=1; dy=0;

    const cx=(COLS/2)|0, cy=(ROWS/2)|0;
    head=0;
    for (let i=0;i<length;i++){
      const idx=xyToIdx(cx-(length-1-i), cy);
      buf[i]=idx; occ[idx]=1; head=i;
    }
    prevHeadIdx = buf[head];
  }
  function randomFreeIdx(){
    for (let t=0;t<CAP;t++){ const idx=(Math.random()*CAP)|0; if (!occ[idx] && idx!==buf[head]) return idx; }
    for (let i=0;i<CAP;i++){ if (!occ[i] && i!==buf[head]) return i; }
    return 0;
  }
  function spawnTarget(){
    if (!inCoins){
      // Cuando hay letras aún: coloca la siguiente letra
      while (pIndex<phrase.length && phrase[pIndex]===' ') pIndex++;
      if (pIndex >= phrase.length){
        // Si por cualquier motivo entramos aquí (no debería), muestra cinemática
        showCinematic();
        return;
      }
      target.idx = randomFreeIdx();
      target.char = phrase[pIndex];
      target.coin = false;
      renderPill();
    } else {
      // Modo monedas
      target.idx = randomFreeIdx();
      target.char = '';
      target.coin = true;
    }
  }

  // ---------- Cola de direcciones ----------
  const isOpposite = (ax,ay,bx,by) => ax===-bx && ay===-by;
  function predictedBase(){
    return dirQueue.length ? dirQueue[dirQueue.length - 1] : { x: dx, y: dy };
  }
  function enqueueDir(nx, ny){
    const base = predictedBase();
    // No repetir ni girar 180º respecto a lo ya previsto
    if ((base.x === nx && base.y === ny) || isOpposite(base.x, base.y, nx, ny)) return;

    if (dirQueue.length === 0){
      dirQueue.push({ x:nx, y:ny });              // próximo tick
    } else if (dirQueue.length === 1){
      dirQueue.push({ x:nx, y:ny });              // tick siguiente
    } else {
      // Si ya hay 2: ignora si ya está planificado; si no, reemplaza el segundo
      const a = dirQueue[0], b = dirQueue[1];
      if ((a.x === nx && a.y === ny) || (b.x === nx && b.y === ny)) return;
      dirQueue[1] = { x:nx, y:ny };
    }
  }

  // ---------- Step lógico ----------
  function step(){
    if (isCinematic) return;  // pausa total mientras está el overlay

    if (dirQueue.length){
      const d = dirQueue.shift();
      dx = d.x; dy = d.y;
    }
    const h=buf[head], nx=idxX(h)+dx, ny=idxY(h)+dy;
    if (nx<0||nx>=COLS||ny<0||ny>=ROWS) return gameOver();
    const nIdx=xyToIdx(nx,ny);
    if (occ[nIdx]) return gameOver();

    prevHeadIdx = buf[head];

    head=(head+1)%CAP; buf[head]=nIdx; occ[nIdx]=1;

    if (nIdx===target.idx){
      let completed = false;

      if (target.coin){
        coins++; scoreEl && (scoreEl.textContent=String(coins));
        stepMs=Math.max(STEP_MIN, stepMs-COIN_ACCEL);
      } else {
        // letra correcta
        pIndex++;
        while (pIndex<phrase.length && phrase[pIndex]===' ') pIndex++;
        completed = (pIndex >= phrase.length);
        renderPill();
      }

      // la serpiente crece siempre que come
      length++;
      stepMs = Math.max(STEP_MIN, stepMs - EAT_ACCEL);

      if (completed){
        // Mostrar cinemática y NO generar nuevo target aún
        showCinematic();
        return; // queda pausado hasta pulsar "Continuar"
      }

      spawnTarget();
    } else {
      // avanza la cola
      const tailPos=(head-length+CAP)%CAP; occ[ buf[tailPos] ] = 0;
    }
  }

  // ---------- Dibujo ----------
  function draw(){
    ctx.drawImage(gridCanvas, 0,0, gridCanvas.width, gridCanvas.height);

    // Objetivo (letra o moneda con pequeña anim de brillo)
    if (target.idx>=0){
      const cx=idxX(target.idx)*CELL + CELL/2, cy=idxY(target.idx)*CELL + CELL/2;
      if (target.coin){
        const s=CELL*.9;
        ctx.save();
        ctx.translate(cx,cy);
        ctx.rotate(shimmer*0.9);
        if (coinImg.complete) ctx.drawImage(coinImg, -s/2, -s/2, s, s);
        else { ctx.fillStyle='#f6c453'; ctx.beginPath(); ctx.arc(0,0,s*.45,0,Math.PI*2); ctx.fill(); }
        // destello
        const sp = ctx.createRadialGradient(-s*0.15, -s*0.18, 0, 0,0, s*0.55);
        sp.addColorStop(0,'rgba(255,255,255,.9)'); sp.addColorStop(1,'rgba(255,215,120,.02)');
        ctx.fillStyle=sp; ctx.beginPath(); ctx.arc(0,0,s*0.55,0,Math.PI*2); ctx.fill();
        ctx.restore();
      } else {
        drawLetter(cx,cy,target.char);
      }
    }

    const t = (dead || isCinematic) ? 1 : clamp(acc/stepMs, 0, .999);
    drawSnakeCurved(t);
  }

  // Moneda dorada con letra grabada
  function drawLetter(cx, cy, ch){
    const r = Math.floor(CELL * 0.42);

    // Sombra bajo la moneda
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.32, r * 0.85, r * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Base dorada (degradado radial)
    const g = ctx.createRadialGradient(
      cx - r * 0.35, cy - r * 0.35, r * 0.10,
      cx, cy, r
    );
    g.addColorStop(0.00, '#fff6cc');
    g.addColorStop(0.35, '#f0c85a');
    g.addColorStop(0.70, '#d89b22');
    g.addColorStop(1.00, '#8c5e00');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Aros
    ctx.lineWidth = Math.max(1, Math.floor(CELL * 0.06));
    ctx.strokeStyle = 'rgba(59,43,0,0.65)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(1, Math.floor(CELL * 0.04));
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.stroke();

    // Highlight
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.28, cy - r * 0.28, r * 0.75, r * 0.48, -0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    // Letra grabada
    const fontSize = Math.floor(CELL * 0.58);
    ctx.font = `${fontSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sombra interior sutil
    ctx.save();
    ctx.fillStyle = '#3b2b00';
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = Math.max(1, CELL * 0.06);
    ctx.shadowOffsetY = Math.max(1, CELL * 0.04);
    ctx.fillText(ch, cx, cy);
    ctx.restore();

    // Bisél superior
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#fff6cc';
    ctx.fillText(ch, cx, cy - Math.max(1, CELL * 0.02));
    ctx.restore();
  }

  // --- Construye puntos (cola -> cabeza) con interpolaciones correctas ---
  function collectPoints(t){
    const pts=[];
    const tailPos=(head-(length-1)+CAP)%CAP;
    const nextTailPos=(tailPos+1)%CAP;
    const tail=centerIdx(buf[tailPos]), tailNext=centerIdx(buf[nextTailPos]);
    pts.push({ x: lerp(tail.x, tailNext.x, t), y: lerp(tail.y, tailNext.y, t) });

    let pos=nextTailPos;
    while (pos!==head){ pts.push(centerIdx(buf[pos])); pos=(pos+1)%CAP; }

    const hPrev = centerIdx(prevHeadIdx);
    const hNow  = centerIdx(buf[head]);
    const tt = t;
    pts.push({ x: lerp(hPrev.x, hNow.x, tt), y: lerp(hPrev.y, hNow.y, tt) });

    return pts;
  }

  // --- Catmull–Rom Spline (suaviza la polilínea) ---
  function sampleCatmullRom(pts, samplesPerSeg=10){
    const n = pts.length;
    if (n<=2) return pts.slice();
    const P = [pts[0], ...pts, pts[n-1]];
    const out = [];
    for (let i=0; i<n-1; i++){
      const p0=P[i], p1=P[i+1], p2=P[i+2], p3=P[i+3];
      for (let s=0; s<samplesPerSeg; s++){
        const u = s / samplesPerSeg, u2=u*u, u3=u2*u;
        const x = 0.5*((2*p1.x)+(-p0.x+p2.x)*u+(2*p0.x-5*p1.x+4*p2.x-p3.x)*u2+(-p0.x+3*p1.x-3*p2.x+p3.x)*u3);
        const y = 0.5*((2*p1.y)+(-p0.y+p2.y)*u+(2*p0.y-5*p1.y+4*p2.y-p3.y)*u2+(-p0.y+3*p1.y-3*p2.y+p3.y)*u3);
        out.push({x,y});
      }
    }
    out.push(pts[n-1]);
    return out;
  }

  // Re-muestrea una polilínea a pasos ~iguales (distancia 'step')
  function resampleEqual(pts, step){
    if (pts.length < 2) return pts.slice();
    const out = [pts[0]];
    let acc = 0;
    for (let i = 1; i < pts.length; i++){
      let ax = pts[i-1].x, ay = pts[i-1].y;
      const bx = pts[i].x,  by = pts[i].y;
      let segx = bx - ax, segy = by - ay;
      let segL = Math.hypot(segx, segy);
      if (segL < 1e-6) continue;
      segx /= segL; segy /= segL;

      while (acc + segL >= step){
        ax += segx * (step - acc);
        ay += segy * (step - acc);
        out.push({ x: ax, y: ay });
        segL -= (step - acc);
        acc = 0;
      }
      acc += segL;
    }
    if (out[out.length-1] !== pts[pts.length-1]) out.push(pts[pts.length-1]);
    return out;
  }

  // Serpiente degradada + ojos
  function drawSnakeCurved(t){
    const basePts = collectPoints(t);
    const curve   = sampleCatmullRom(basePts, 10);
    const step    = CELL * 0.28;
    const pts     = resampleEqual(curve, step);
    if (pts.length < 2) return;

    const tail = pts[0];
    const headP = pts[pts.length - 1];

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Cuerpo: trazo único con degradado dorado
    const bodyW = CELL * 0.74;
    const grad = ctx.createLinearGradient(tail.x, tail.y, headP.x, headP.y);
    grad.addColorStop(0.00, '#FFECA8');
    grad.addColorStop(0.55, '#F7C948');
    grad.addColorStop(1.00, '#D4A017');
    ctx.strokeStyle = grad;
    ctx.lineWidth = bodyW;

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();

    // Ojos sencillos direccionados
    const n = pts.length;
    const back = Math.min(10, n - 1);
    const pBack = pts[n - 1 - back];
    let tx = headP.x - pBack.x, ty = headP.y - pBack.y;
    const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;

    // Suavizado
    if (typeof eyeDirX !== 'undefined') {
      const ALPHA = 0.35;
      eyeDirX = eyeDirX + (tx - eyeDirX) * ALPHA;
      eyeDirY = eyeDirY + (ty - eyeDirY) * ALPHA;
      tx = eyeDirX; ty = eyeDirY;
    }

    const nx = -ty, ny = tx;
    const eyeSep = CELL * 0.18;
    const eyeFwd = CELL * 0.14;
    const ex1 = headP.x + nx * eyeSep + tx * eyeFwd;
    const ey1 = headP.y + ny * eyeSep + ty * eyeFwd;
    const ex2 = headP.x - nx * eyeSep + tx * eyeFwd;
    const ey2 = headP.y - ny * eyeSep + ty * eyeFwd;

    ctx.fillStyle = '#111';
    const r = CELL * 0.08;
    ctx.beginPath(); ctx.arc(ex1, ey1, r, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ex2, ey2, r, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }

  // ---------- Game Over / Restart ----------
  function gameOver(){ running=false; dead=true; openLoseModal(); }
  function openLoseModal(){
    if (!modal) return;
    modal.classList.remove('is-win'); modal.classList.add('is-lose');
    modalTitle && (modalTitle.textContent='Has perdido');
    modalText  && (modalText.textContent='Te chocaste con la pared o contigo mismo. ¿Quieres reiniciar?');
    modal.removeAttribute('hidden');
  }
  function closeLoseModal(){ modal?.setAttribute('hidden',''); }
  function hardRestart(){
    coins=0; scoreEl && (scoreEl.textContent='0');
    eyeDirX = 1; eyeDirY = 0;
    stepMs=STEP_MS; dead=false; running=true;
    loadPhrases();
    pickPhrase(); placeSnake(); spawnTarget();
    acc=0; lastTs=0; dirQueue.length = 0; closeLoseModal();
    isCinematic = false;  // por si acaso
  }

  // ---------- Inputs ----------
  window.addEventListener('keydown', e=>{
    // Evitar scroll con flechas
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();

    // Cinemática abierta: permitir cerrar con Enter/Espacio, bloquear resto
    if (isCinematic){
      if (e.key === 'Enter' || e.key === ' '){
        cinBtn?.click();
      }
      return;
    }

    if (!running) return;

    if (e.key==='ArrowUp'||e.key==='w'||e.key==='W'){ enqueueDir(0,-1); }
    else if (e.key==='ArrowDown'||e.key==='s'||e.key==='S'){ enqueueDir(0,1); }
    else if (e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){ enqueueDir(-1,0); }
    else if (e.key==='ArrowRight'||e.key==='d'||e.key==='D'){ enqueueDir(1,0); }
  });

  // Gestos táctiles
  let t0=null;
  canvas.addEventListener('touchstart', (e)=>{ if(!running) return; const t=e.changedTouches[0]; t0={x:t.clientX,y:t.clientY}; }, {passive:true});
  canvas.addEventListener('touchend', (e)=>{
    if(!running || !t0) return;
    const t=e.changedTouches[0], dxm=t.clientX-t0.x, dym=t.clientY-t0.y;
    if (Math.max(Math.abs(dxm),Math.abs(dym))<12) return;
    if (Math.abs(dxm)>Math.abs(dym)) enqueueDir(dxm<0?-1:1, 0);
    else enqueueDir(0, dym<0?-1:1);
    t0=null;
  }, {passive:true});

  btnRestart?.addEventListener('click', hardRestart);
  modalRestart?.addEventListener('click', hardRestart);

  // ---------- Loop ----------
  function loop(ts){
    if (!lastTs) lastTs=ts;
    const dtRaw = ts - lastTs;
    const dt = Math.min(dtRaw, 50); // evita saltos si la pestaña estuvo en bg
    lastTs = ts;

    // estética animada
    shimmer += dt/1000;

    if (running){
      if (!isCinematic){                 // ⟵ no avances el tiempo lógico si hay cinemática
        acc += dt;
        while (acc >= stepMs){ acc -= stepMs; step(); }
      }
    }

    draw();
    requestAnimationFrame(loop);
  }

  // ---------- Init ----------
  function init(){
    resizeCanvas();
    loadPhrases(); pickPhrase(); placeSnake(); spawnTarget();
    coins=0; scoreEl && (scoreEl.textContent='0');
    running=true; dead=false; isCinematic=false;
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize', resizeCanvas);
  init();
  document.addEventListener('i18n:change', () => {
    hardRestart();
  });
})();
