(() => {
  'use strict';

  const STYLE_ID = 'mini-ordenar-frase-style';

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const css = document.createElement('style');
    css.id = STYLE_ID;
    css.textContent = `
      .tpl--miniact-ordenar-frase{
        position:relative;
        padding:28px 20px 90px;
        display:flex;
        flex-direction:column;
        gap:16px;
        font-family:inherit;
        align-items:center;
        justify-content:center;
        min-height:70vh;
      }
      .mini-shell{
        width:min(820px, 94vw);
        background:linear-gradient(180deg,#f8fafc 0%, #ffffff 100%);
        border:1px solid #e5e7eb;
        border-radius:22px;
        padding:24px 24px 22px;
        box-shadow:0 26px 60px rgba(15,23,42,.12);
      }
      .mini-head{
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:16px;
      }
      .mini-title{
        margin:0;
        font-size:26px;
        font-weight:800;
        color:#0f172a;
      }
      .mini-progress{
        font-size:12px;
        font-weight:700;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#475569;
      }
      .mini-instructions{
        font-size:14px;
        color:#334155;
      }
      .mini-panel{
        background:#ffffff;
        border:1px solid #e5e7eb;
        border-radius:18px;
        padding:16px;
        box-shadow:0 12px 28px rgba(15,23,42,.08);
      }
      .mini-zone{
        min-height:88px;
        border:2px dashed #d7dbe3;
        border-radius:16px;
        padding:12px;
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        background:#f9fafb;
      }
      .mini-zone.answer{
        background:#f3f4f6;
      }
      .mini-zone.is-wrong{
        border-color:#ef4444;
        animation: mini-shake .35s ease;
      }
      .mini-zone.is-correct{
        border-color:#22c55e;
      }
      @keyframes mini-shake{
        0%{ transform:translateX(0); }
        25%{ transform:translateX(-6px); }
        50%{ transform:translateX(6px); }
        75%{ transform:translateX(-4px); }
        100%{ transform:translateX(0); }
      }
      .mini-token{
        appearance:none;
        border:1px solid #e5e7eb;
        background:#ffffff;
        color:#0f172a;
        border-radius:999px;
        padding:8px 12px;
        font-size:14px;
        font-weight:700;
        cursor:pointer;
        transition:transform .08s ease, box-shadow .12s ease, background .12s ease, border-color .12s ease;
      }
      .mini-token:hover{ box-shadow:0 10px 24px rgba(15,23,42,.12); border-color:#d1d5db; }
      .mini-token:active{ transform:translateY(1px); }
      .mini-token.is-inanswer{
        box-shadow:0 8px 20px rgba(15,23,42,.12);
        border-color:rgba(15,23,42,.45);
      }
      .mini-token.is-correct{
        background:#22c55e !important;
        color:#ffffff !important;
        border-color:#16a34a !important;
      }
      .mini-token.is-wrong{
        background:#ef4444 !important;
        color:#ffffff !important;
        border-color:#dc2626 !important;
      }
      .mini-actions{
        display:flex;
        gap:10px;
        align-items:center;
      }
      .mini-btn{
        appearance:none;
        border:none;
        border-radius:10px;
        padding:10px 14px;
        font-weight:700;
        cursor:pointer;
      }
      .mini-btn.primary{
        background:#111827;
        color:#ffffff;
        box-shadow:0 12px 26px rgba(17,24,39,.25);
      }
      .mini-btn.secondary{
        background:#e2e8f0;
        color:#0f172a;
      }
      .mini-feedback{
        min-height:20px;
        font-size:14px;
        font-weight:700;
      }
      .mini-feedback.ok{ color:#16a34a; }
      .mini-feedback.err{ color:#dc2626; }
      .mini-skip{
        position:fixed;
        top:24px;
        right:24px;
        z-index:6;
        appearance:none;
        border:1px solid #0b1220;
        border-radius:999px;
        padding:16px 26px;
        font-weight:800;
        font-size:16px;
        letter-spacing:.02em;
        background:linear-gradient(135deg,#0b1220 0%, #0f1f3a 45%, #1e3a8a 100%);
        color:#ffffff;
        box-shadow:0 16px 36px rgba(2,6,23,.4), 0 0 0 8px rgba(30,58,138,.12);
        cursor:pointer;
        display:none;
        animation: mini-skip-pulse 1.4s ease-in-out infinite;
      }
      .mini-skip:hover{
        transform:translateY(-1px);
        box-shadow:0 20px 44px rgba(2,6,23,.45), 0 0 0 10px rgba(30,58,138,.16);
      }
      .mini-skip:active{ transform:translateY(0); }
      @keyframes mini-skip-pulse{
        0%,100%{ transform:scale(1); }
        50%{ transform:scale(1.03); }
      }

      .mini-intro{
        position:fixed;
        inset:0;
        background:rgba(15,23,42,.45);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:5;
        padding:24px;
      }
      .mini-intro-card{
        width:min(520px, 92vw);
        background:#ffffff;
        border-radius:20px;
        padding:20px 22px;
        box-shadow:0 24px 60px rgba(0,0,0,.28);
      }
      .mini-intro-title{
        margin:0 0 6px 0;
        font-size:20px;
        font-weight:800;
        color:#0f172a;
      }
      .mini-intro-text{
        margin:0 0 16px 0;
        font-size:14px;
        color:#334155;
      }
      .mini-confetti{
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:3;
      }
      @media (max-width: 820px){
        .mini-head{ flex-direction:column; align-items:flex-start; }
      }
    `;
    document.head.appendChild(css);
  }

  function normalizePhrases(input) {
    const list = Array.isArray(input) ? input : (input != null ? [input] : []);
    return list.map(p => String(p || '').trim()).filter(Boolean);
  }

  function shuffleTokens(tokens) {
    const arr = tokens.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function shuffleAvoidSame(tokens) {
    let out = shuffleTokens(tokens);
    let same = out.every((t, i) => t.id === tokens[i].id);
    let tries = 0;
    while (same && tries < 6) {
      out = shuffleTokens(tokens);
      same = out.every((t, i) => t.id === tokens[i].id);
      tries++;
    }
    return out;
  }

  function launchConfetti(root) {
    const cv = document.createElement('canvas');
    cv.className = 'mini-confetti';
    root.appendChild(cv);
    const ctx = cv.getContext('2d');
    let w = 0, h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    function resize(){
      const rect = root.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width * dpr));
      h = Math.max(1, Math.floor(rect.height * dpr));
      cv.width = w;
      cv.height = h;
      cv.style.width = rect.width + 'px';
      cv.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const colors = ['#22c55e', '#16a1b4', '#f59e0b', '#ef4444', '#3b82f6'];
    const pieces = [];
    const count = 90;
    const cx = (w / dpr) * 0.5;
    const cy = (h / dpr) * 0.35;
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3 + Math.random() * 4.5;
      pieces.push({
        x: cx,
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 2,
        w: 5 + Math.random() * 5,
        h: 3 + Math.random() * 3,
        rot: Math.random() * Math.PI,
        vr: (Math.random() * 0.2 - 0.1),
        life: 70 + Math.random() * 40,
        color: colors[(Math.random() * colors.length) | 0]
      });
    }
    const grav = 0.16;
    const drag = 0.985;

    function tick(){
      ctx.clearRect(0, 0, w, h);
      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        p.vx *= drag;
        p.vy = p.vy * drag + grav;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 80));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        if (p.life <= 0 || p.y > (h / dpr) + 50) pieces.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      if (pieces.length) {
        requestAnimationFrame(tick);
      } else {
        cv.remove();
      }
    }
    requestAnimationFrame(tick);
  }

  function friendlyPalette() {
    return [
      '#FFE8A3', // amarillo suave
      '#FFD6C0', // melocoton
      '#E6F4C2', // verde menta
      '#CFE8FF', // azul cielo
      '#EBD7FF', // lavanda
      '#FFC9DE', // rosa suave
      '#D7F5F0', // turquesa claro
      '#FFF1CC', // crema
      '#DDE7FF', // periwinkle
      '#FAD7D7'  // salmón claro
    ];
  }

  function applyTokenColor(btn, color) {
    if (!color) return;
    btn.style.background = color;
    btn.style.borderColor = 'rgba(15,23,42,.18)';
    btn.style.color = '#0f172a';
  }

  SlideRendererRegistry.register('miniactividad-ordenar-frase', function(s, root){
    ensureStyles();
    root.classList.add('tpl--miniact-ordenar-frase');

    const phrases = normalizePhrases(s?.phrases ?? s?.frases ?? s?.frase);
    if (!phrases.length) {
      root.innerHTML = '<div class="empty-state__text">No hay frases para ordenar.</div>';
      return { suppressRootClick: true, noLock: true };
    }

    const titleText = String(s?.title || s?.titulo || 'Miniactividad');
    const introTitle = String(s?.introTitle || s?.intro?.title || 'Antes de empezar');
    const introText = String(s?.introText || s?.intro?.text || 'Ordena la frase haciendo clic en las palabras en el orden correcto.');
    const introButtonText = String(s?.introButtonText || s?.intro?.buttonText || 'Empezar');
    const autoAdvanceMs = Math.max(400, Number(s?.autoAdvanceMs ?? 1400));

    const head = document.createElement('div');
    head.className = 'mini-head';
    const title = document.createElement('h2');
    title.className = 'mini-title';
    title.textContent = titleText;
    const progress = document.createElement('div');
    progress.className = 'mini-progress';
    head.appendChild(title);
    head.appendChild(progress);

    const instructions = document.createElement('div');
    instructions.className = 'mini-instructions';
    instructions.textContent = 'Pulsa las palabras para construir la frase. Pulsa una palabra ya colocada para devolverla.';

    const answerPanel = document.createElement('div');
    answerPanel.className = 'mini-panel';
    const answerTitle = document.createElement('div');
    answerTitle.style.fontWeight = '700';
    answerTitle.style.marginBottom = '8px';
    answerTitle.textContent = 'Tu frase';
    const answerZone = document.createElement('div');
    answerZone.className = 'mini-zone answer';
    answerPanel.appendChild(answerTitle);
    answerPanel.appendChild(answerZone);

    const bankPanel = document.createElement('div');
    bankPanel.className = 'mini-panel';
    const bankTitle = document.createElement('div');
    bankTitle.style.fontWeight = '700';
    bankTitle.style.marginBottom = '8px';
    bankTitle.textContent = 'Palabras';
    const bankZone = document.createElement('div');
    bankZone.className = 'mini-zone bank';
    bankPanel.appendChild(bankTitle);
    bankPanel.appendChild(bankZone);

    const actions = document.createElement('div');
    actions.className = 'mini-actions';
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'mini-btn secondary';
    resetBtn.textContent = 'Reiniciar';
    const feedback = document.createElement('div');
    feedback.className = 'mini-feedback';
    actions.appendChild(resetBtn);
    actions.appendChild(feedback);

    const shell = document.createElement('div');
    shell.className = 'mini-shell';
    shell.appendChild(head);
    shell.appendChild(instructions);
    shell.appendChild(answerPanel);
    shell.appendChild(bankPanel);
    shell.appendChild(actions);
    root.appendChild(shell);

    let idx = 0;
    let locked = false;
    let advanceTimer = null;
    let advanced = false;
    let currentTokens = [];
    let wrongAttempts = 0;

    const skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.className = 'mini-skip';
    skipBtn.textContent = 'Saltar frase';
    skipBtn.addEventListener('click', () => {
      if (locked) return;
      wrongAttempts = 0;
      hideSkip();
      if (idx < phrases.length - 1) {
        idx += 1;
        renderPhrase();
      } else {
        goNextSlide();
      }
    });
    root.appendChild(skipBtn);

    function showSkip() {
      skipBtn.style.display = 'inline-flex';
    }
    function hideSkip() {
      skipBtn.style.display = 'none';
    }

    function goNextSlide() {
      if (advanced) return;
      advanced = true;
      if (window.SlideActions && typeof SlideActions.next === 'function') {
        SlideActions.next();
      }
    }

    function setFeedback(type, text) {
      feedback.className = 'mini-feedback' + (type ? ` ${type}` : '');
      feedback.textContent = text || '';
    }

    function getAnswerIds() {
      return Array.from(answerZone.querySelectorAll('.mini-token')).map(btn => Number(btn.dataset.id));
    }

    function clearPlacementMarks() {
      const btns = answerZone.querySelectorAll('.mini-token');
      btns.forEach(btn => {
        btn.classList.remove('is-correct');
        btn.classList.remove('is-wrong');
      });
    }

    function markPlacement(ids) {
      const btns = Array.from(answerZone.querySelectorAll('.mini-token'));
      btns.forEach((btn, i) => {
        const id = Number(btn.dataset.id);
        if (id === i) {
          btn.classList.add('is-correct');
          btn.classList.remove('is-wrong');
        } else {
          btn.classList.add('is-wrong');
          btn.classList.remove('is-correct');
        }
      });
    }

    function checkComplete() {
      const ids = getAnswerIds();
      if (ids.length !== currentTokens.length) {
        answerZone.classList.remove('is-wrong');
        clearPlacementMarks();
        if (feedback.classList.contains('err')) setFeedback('', '');
        return;
      }
      const correct = ids.every((id, i) => id === i);
      if (correct) {
        markPlacement(ids);
        answerZone.classList.remove('is-wrong');
        answerZone.classList.add('is-correct');
        setFeedback('ok', 'Correcto. Muy bien.');
        locked = true;
        wrongAttempts = 0;
        hideSkip();
        launchConfetti(root);
        if (advanceTimer) clearTimeout(advanceTimer);
        advanceTimer = setTimeout(() => {
          if (!root.isConnected) return;
          if (idx < phrases.length - 1) {
            idx += 1;
            renderPhrase();
          } else {
            goNextSlide();
          }
        }, autoAdvanceMs);
      } else {
        markPlacement(ids);
        answerZone.classList.remove('is-correct');
        answerZone.classList.add('is-wrong');
        setFeedback('err', 'Orden incorrecto. Intentalo de nuevo.');
        setTimeout(() => answerZone.classList.remove('is-wrong'), 400);
        wrongAttempts += 1;
        if (wrongAttempts >= 3) showSkip();
      }
    }

    function makeTokenBtn(token, inAnswer) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mini-token' + (inAnswer ? ' is-inanswer' : '');
      btn.textContent = token.text;
      btn.dataset.id = String(token.id);
      applyTokenColor(btn, token.color);
      return btn;
    }

    function renderPhrase({ preserveAttempts = false } = {}) {
      if (!root.isConnected) return;
      locked = false;
      answerZone.classList.remove('is-correct');
      answerZone.classList.remove('is-wrong');
      setFeedback('', '');
      answerZone.innerHTML = '';
      bankZone.innerHTML = '';
      if (!preserveAttempts) {
        wrongAttempts = 0;
        hideSkip();
      } else if (wrongAttempts >= 3) {
        showSkip();
      }

      const phrase = phrases[idx];
      const parts = phrase.split(/\s+/).filter(Boolean);
      const palette = shuffleTokens(friendlyPalette());
      currentTokens = parts.map((text, i) => ({
        id: i,
        text,
        color: palette[i % palette.length]
      }));
      const shuffled = shuffleAvoidSame(currentTokens);

      function makeBankBtn(token) {
        const btn = makeTokenBtn(token, false);
        btn.addEventListener('click', () => {
          if (locked) return;
          const inAnswerBtn = makeAnswerBtn(token);
          answerZone.appendChild(inAnswerBtn);
          btn.remove();
          checkComplete();
        });
        return btn;
      }

      function makeAnswerBtn(token) {
        const btn = makeTokenBtn(token, true);
        btn.addEventListener('click', () => {
          if (locked) return;
          const backBtn = makeBankBtn(token);
          bankZone.appendChild(backBtn);
          btn.remove();
          checkComplete();
        });
        return btn;
      }

      shuffled.forEach(token => {
        bankZone.appendChild(makeBankBtn(token));
      });

      progress.textContent = `Frase ${idx + 1} de ${phrases.length}`;
    }

    resetBtn.addEventListener('click', () => {
      if (locked) return;
      renderPhrase({ preserveAttempts: true });
    });

    // Intro modal
    const intro = document.createElement('div');
    intro.className = 'mini-intro';
    const introCard = document.createElement('div');
    introCard.className = 'mini-intro-card';
    const introH = document.createElement('h3');
    introH.className = 'mini-intro-title';
    introH.textContent = introTitle;
    const introP = document.createElement('p');
    introP.className = 'mini-intro-text';
    introP.textContent = introText;
    const introBtn = document.createElement('button');
    introBtn.type = 'button';
    introBtn.className = 'mini-btn primary';
    introBtn.textContent = introButtonText;
    introBtn.addEventListener('click', () => {
      intro.remove();
      renderPhrase();
    });
    introCard.appendChild(introH);
    introCard.appendChild(introP);
    introCard.appendChild(introBtn);
    intro.appendChild(introCard);
    root.appendChild(intro);

    return { suppressRootClick: true, noLock: true };
  });
})();
