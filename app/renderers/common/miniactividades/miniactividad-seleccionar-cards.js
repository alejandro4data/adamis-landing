(() => {
  'use strict';

  const tr = (text) => {
    try {
      if (window.I18N && typeof window.I18N.tr === 'function') return window.I18N.tr(text);
    } catch (_) {}
    return text;
  };

  const lang = () => {
    try {
      if (window.I18N && typeof window.I18N.getLang === 'function') return window.I18N.getLang();
    } catch (_) {}
    try {
      const stored = String(localStorage.getItem('adamis_lang') || '').toLowerCase();
      if (stored.startsWith('en')) return 'en';
    } catch (_) {}
    return 'es';
  };

  const STYLE_ID = 'mini-seleccionar-cards-style';
  const HINT_DELAY_MS = 60000;

  function formatHintTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const css = document.createElement('style');
    css.id = STYLE_ID;
    css.textContent = `
      .tpl--miniact-seleccionar-cards{
        position:relative;
        padding:28px 20px 90px;
        display:flex;
        flex-direction:column;
        gap:16px;
        align-items:center;
        justify-content:center;
        min-height:70vh;
      }
      .pick-shell{
        width:min(1100px, 96vw);
        background:
          radial-gradient(circle at top, rgba(251,191,36,.18), transparent 34%),
          linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        border:1px solid #e5e7eb;
        border-radius:26px;
        padding:24px 24px 22px;
        box-shadow:0 26px 60px rgba(15,23,42,.12);
      }
      .pick-head{
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:16px;
        margin-bottom:10px;
      }
      .pick-title{
        margin:0;
        font-size:28px;
        font-weight:900;
        color:#0f172a;
      }
      .pick-progress{
        font-size:12px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#475569;
      }
      .pick-instructions{
        margin:0 0 18px 0;
        font-size:14px;
        color:#334155;
      }
      .pick-grid{
        display:grid;
        grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));
        gap:22px;
      }
      .pick-card-wrap{
        display:flex;
        flex-direction:column;
        gap:10px;
        align-items:center;
      }
      .pick-card{
        width:100%;
        aspect-ratio: 0.8;
        min-height:250px;
        border:none;
        background:transparent;
        padding:0;
        perspective:1200px;
        cursor:pointer;
      }
      .pick-card[disabled]{
        cursor:default;
      }
      .pick-card__inner{
        position:relative;
        width:100%;
        height:100%;
        transform-style:preserve-3d;
        transition:transform .55s cubic-bezier(.2,.75,.2,1);
      }
      .pick-card.is-revealed .pick-card__inner{
        transform:rotateY(180deg);
      }
      .pick-face{
        position:absolute;
        inset:0;
        backface-visibility:hidden;
        border-radius:22px;
        border:1px solid #e5e7eb;
        overflow:hidden;
        box-shadow:0 16px 36px rgba(15,23,42,.10);
      }
      .pick-face--front{
        background:linear-gradient(180deg,#ffffff 0%, #f8fafc 100%);
        display:flex;
        flex-direction:column;
      }
      .pick-face--back{
        transform:rotateY(180deg);
        color:#ffffff;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        padding:18px 16px;
      }
      .pick-face--back.is-correct{
        background:linear-gradient(180deg,#22c55e 0%, #15803d 100%);
      }
      .pick-face--back.is-wrong{
        background:linear-gradient(180deg,#ef4444 0%, #b91c1c 100%);
      }
      .pick-media{
        flex:1 1 auto;
        min-height:170px;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#e2e8f0;
        border-bottom:1px solid #e5e7eb;
        background-size:cover;
        background-position:center;
        color:#475569;
        font-size:12px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
      }
      .pick-media.has-image{
        background-color:#ffffff;
      }
      .pick-concept{
        width:100%;
        text-align:center;
        font-size:18px;
        font-weight:900;
        color:#0f172a;
        line-height:1.2;
        word-break:break-word;
      }
      .pick-front-caption{
        padding:14px 12px 16px;
        display:flex;
        flex-direction:column;
        gap:8px;
        align-items:center;
      }
      .pick-front-hint{
        font-size:11px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#64748b;
      }
      .pick-back-badge{
        display:inline-flex;
        align-self:flex-start;
        border-radius:999px;
        padding:8px 12px;
        font-size:11px;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
        background:rgba(255,255,255,.18);
        border:1px solid rgba(255,255,255,.26);
      }
      .pick-back-body{
        display:flex;
        flex-direction:column;
        gap:10px;
      }
      .pick-back-title{
        font-size:18px;
        font-weight:900;
        line-height:1.2;
      }
      .pick-back-text{
        font-size:14px;
        line-height:1.45;
      }
      .pick-actions{
        display:flex;
        gap:12px;
        align-items:center;
        margin-top:18px;
      }
      .pick-btn{
        appearance:none;
        border:none;
        border-radius:12px;
        padding:11px 15px;
        font-weight:800;
        cursor:pointer;
      }
      .pick-btn.secondary{
        background:#e2e8f0;
        color:#0f172a;
      }
      .pick-feedback{
        min-height:20px;
        font-size:14px;
        font-weight:800;
      }
      .pick-feedback.ok{ color:#16a34a; }
      .pick-feedback.err{ color:#dc2626; }
      .pick-feedback.info{ color:#2563eb; }
      .pick-intro{
        position:fixed;
        inset:0;
        background:rgba(15,23,42,.45);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:5;
        padding:24px;
      }
      .pick-intro-card{
        width:min(520px, 92vw);
        background:#ffffff;
        border-radius:20px;
        padding:20px 22px;
        box-shadow:0 24px 60px rgba(0,0,0,.28);
      }
      .pick-intro-title{
        margin:0 0 6px 0;
        font-size:20px;
        font-weight:800;
        color:#0f172a;
      }
      .pick-intro-text{
        margin:0 0 16px 0;
        font-size:14px;
        color:#334155;
      }
      .pick-btn.primary{
        background:#111827;
        color:#ffffff;
        box-shadow:0 12px 26px rgba(17,24,39,.25);
      }
      .pick-confetti{
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:3;
      }
    `;
    document.head.appendChild(css);
  }

  function normalizeCards(input) {
    const list = Array.isArray(input) ? input : [];
    return list.map((raw, idx) => {
      const text = String(raw?.text ?? raw?.label ?? raw?.concepto ?? raw?.title ?? '').trim();
      if (!text) return null;
      return {
        id: String(raw?.id ?? raw?.key ?? idx),
        text,
        image: String(raw?.image ?? raw?.img ?? raw?.imagen ?? '').trim(),
        alt: String(raw?.alt ?? text).trim(),
        correct: !!raw?.correct,
        feedbackCorrect: String(raw?.feedbackCorrect ?? raw?.explanationCorrect ?? raw?.porqueSi ?? 'Correcta.').trim(),
        feedbackIncorrect: String(raw?.feedbackIncorrect ?? raw?.explanationIncorrect ?? raw?.porqueNo ?? 'Incorrecta.').trim()
      };
    }).filter(Boolean);
  }

  function launchConfetti(root) {
    const cv = document.createElement('canvas');
    cv.className = 'pick-confetti';
    root.appendChild(cv);
    const ctx = cv.getContext('2d');
    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    function resize() {
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

    const colors = ['#f59e0b', '#0f172a', '#2563eb', '#16a34a', '#ef4444'];
    const particles = [];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 4.5;
      particles.push({
        x: (w / dpr) * 0.5,
        y: (h / dpr) * 0.28,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 4 + Math.random() * 5,
        rot: Math.random() * Math.PI,
        vr: Math.random() * 0.2 - 0.1,
        life: 65 + Math.random() * 35,
        color: colors[(Math.random() * colors.length) | 0]
      });
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.16;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 70));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        ctx.restore();
        if (p.life <= 0 || p.y > (h / dpr) + 50) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      if (particles.length) requestAnimationFrame(tick);
      else cv.remove();
    }

    requestAnimationFrame(tick);
  }

  SlideRendererRegistry.register('miniactividad-seleccionar-cards', function (s, root) {
    ensureStyles();
    root.classList.add('tpl--miniact-seleccionar-cards');

    const isEn = lang() === 'en';
    const sourceCards = isEn
      ? (s?.cards_en ?? s?.tarjetas_en ?? s?.cards ?? s?.tarjetas)
      : (s?.cards ?? s?.tarjetas);
    const cards = normalizeCards(sourceCards);

    if (!cards.length) {
      root.innerHTML = `<div class="empty-state__text">${tr('No hay tarjetas para seleccionar.')}</div>`;
      return { suppressRootClick: true, noLock: true };
    }

    const titleText = tr(String(s?.title || s?.titulo || 'Miniactividad'));
    const introTitle = tr(String(s?.introTitle || s?.intro?.title || 'Antes de empezar'));
    const introText = tr(String(s?.introText || s?.intro?.text || 'Selecciona las opciones adecuadas y revisa por que cada una es correcta o incorrecta.'));
    const introButtonText = tr(String(s?.introButtonText || s?.intro?.buttonText || 'Empezar'));
    const autoAdvanceMs = Math.max(500, Number(s?.autoAdvanceMs ?? 1600));
    const totalCorrect = cards.filter((card) => card.correct).length;

    const head = document.createElement('div');
    head.className = 'pick-head';
    const title = document.createElement('h2');
    title.className = 'pick-title';
    title.textContent = titleText;
    const progress = document.createElement('div');
    progress.className = 'pick-progress';
    head.appendChild(title);
    head.appendChild(progress);

    const instructions = document.createElement('p');
    instructions.className = 'pick-instructions';
    instructions.textContent = tr('Pulsa cada tarjeta para descubrir si es una opcion correcta o incorrecta.');

    const grid = document.createElement('div');
    grid.className = 'pick-grid';

    const actions = document.createElement('div');
    actions.className = 'pick-actions';
    const hintBtn = document.createElement('button');
    hintBtn.type = 'button';
    hintBtn.className = 'pick-btn secondary';
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'pick-btn secondary';
    resetBtn.textContent = tr('Reiniciar tarjetas');
    const feedback = document.createElement('div');
    feedback.className = 'pick-feedback';
    actions.appendChild(hintBtn);
    actions.appendChild(resetBtn);
    actions.appendChild(feedback);

    const shell = document.createElement('div');
    shell.className = 'pick-shell';
    shell.appendChild(head);
    shell.appendChild(instructions);
    shell.appendChild(grid);
    shell.appendChild(actions);
    root.appendChild(shell);

    let revealedCount = 0;
    let foundCorrect = 0;
    let locked = false;
    let advanced = false;
    let advanceTimer = null;
    let hintInterval = null;
    const hintReadyAt = Date.now() + HINT_DELAY_MS;
    const cardButtons = [];

    function updateHintButton() {
      const remaining = hintReadyAt - Date.now();
      if (remaining <= 0) {
        hintBtn.disabled = false;
        hintBtn.textContent = tr('Pista');
        if (hintInterval) {
          clearInterval(hintInterval);
          hintInterval = null;
        }
        return;
      }
      hintBtn.disabled = true;
      hintBtn.textContent = `${tr('Pista')} (${formatHintTime(remaining)})`;
    }

    function setFeedback(type, text) {
      feedback.className = 'pick-feedback' + (type ? ` ${type}` : '');
      feedback.textContent = text || '';
    }

    function updateProgress() {
      progress.textContent = `${tr('Tarjetas')} ${revealedCount} / ${cards.length}`;
    }

    function goNextSlide() {
      if (advanced) return;
      advanced = true;
      if (window.SlideActions && typeof window.SlideActions.next === 'function') {
        window.SlideActions.next();
      }
    }

    function checkDone() {
      updateProgress();
      if (revealedCount !== cards.length) return;

      locked = true;
      if (foundCorrect === totalCorrect) {
        setFeedback('ok', tr('Has descubierto todas las opciones correctas.'));
      } else {
        setFeedback('ok', tr('Has revisado todas las tarjetas.'));
      }
      launchConfetti(root);
      if (advanceTimer) clearTimeout(advanceTimer);
      advanceTimer = setTimeout(() => {
        if (!root.isConnected) return;
        goNextSlide();
      }, autoAdvanceMs);
    }

    function revealCard(btn, card) {
      if (locked || !btn || btn.classList.contains('is-revealed')) return false;
      btn.classList.add('is-revealed');
      btn.disabled = true;
      revealedCount += 1;
      if (card.correct) foundCorrect += 1;
      checkDone();
      return true;
    }

    function makeCard(card) {
      const wrap = document.createElement('div');
      wrap.className = 'pick-card-wrap';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pick-card';
      btn.setAttribute('aria-label', `${card.text}. ${tr('Pulsa para girar')}`);

      const inner = document.createElement('div');
      inner.className = 'pick-card__inner';

      const front = document.createElement('div');
      front.className = 'pick-face pick-face--front';
      const media = document.createElement('div');
      media.className = 'pick-media';
      if (card.image) {
        media.classList.add('has-image');
        media.style.backgroundImage = `url("${card.image.replace(/"/g, '&quot;')}")`;
      } else {
        media.textContent = tr('Imagen');
      }
      const frontCaption = document.createElement('div');
      frontCaption.className = 'pick-front-caption';
      const frontHint = document.createElement('div');
      frontHint.className = 'pick-front-hint';
      frontHint.textContent = tr('Concepto');
      const frontText = document.createElement('div');
      frontText.className = 'pick-concept';
      frontText.textContent = card.text;
      frontCaption.appendChild(frontHint);
      frontCaption.appendChild(frontText);
      front.appendChild(media);
      front.appendChild(frontCaption);

      const back = document.createElement('div');
      back.className = 'pick-face pick-face--back ' + (card.correct ? 'is-correct' : 'is-wrong');
      const badge = document.createElement('div');
      badge.className = 'pick-back-badge';
      badge.textContent = tr(card.correct ? 'Correcta' : 'Incorrecta');
      const body = document.createElement('div');
      body.className = 'pick-back-body';
      const backTitle = document.createElement('div');
      backTitle.className = 'pick-back-title';
      backTitle.textContent = card.text;
      const backText = document.createElement('div');
      backText.className = 'pick-back-text';
      backText.textContent = card.correct ? card.feedbackCorrect : card.feedbackIncorrect;
      body.appendChild(backTitle);
      body.appendChild(backText);
      back.appendChild(badge);
      back.appendChild(body);

      inner.appendChild(front);
      inner.appendChild(back);
      btn.appendChild(inner);
      wrap.appendChild(btn);

      btn.addEventListener('click', () => {
        revealCard(btn, card);
      });

      cardButtons.push({ btn, card });
      return wrap;
    }

    cards.forEach((card) => grid.appendChild(makeCard(card)));
    updateProgress();
    updateHintButton();
    hintInterval = setInterval(updateHintButton, 1000);

    hintBtn.addEventListener('click', () => {
      if (hintBtn.disabled || locked) return;
      const preferred = cardButtons.find((entry) => entry.card.correct && !entry.btn.classList.contains('is-revealed'))
        || cardButtons.find((entry) => !entry.btn.classList.contains('is-revealed'));
      if (!preferred) return;
      revealCard(preferred.btn, preferred.card);
      if (!locked) {
        setFeedback('info', preferred.card.correct
          ? preferred.card.feedbackCorrect
          : preferred.card.feedbackIncorrect);
      }
    });

    resetBtn.addEventListener('click', () => {
      if (advanceTimer) clearTimeout(advanceTimer);
      locked = false;
      advanced = false;
      revealedCount = 0;
      foundCorrect = 0;
      setFeedback('', '');
      cardButtons.forEach((entry) => {
        entry.btn.classList.remove('is-revealed');
        entry.btn.disabled = false;
      });
      updateProgress();
    });

    const intro = document.createElement('div');
    intro.className = 'pick-intro';
    const introCard = document.createElement('div');
    introCard.className = 'pick-intro-card';
    const introH = document.createElement('h3');
    introH.className = 'pick-intro-title';
    introH.textContent = introTitle;
    const introP = document.createElement('p');
    introP.className = 'pick-intro-text';
    introP.textContent = introText;
    const introBtn = document.createElement('button');
    introBtn.type = 'button';
    introBtn.className = 'pick-btn primary';
    introBtn.textContent = introButtonText;
    introBtn.addEventListener('click', () => {
      intro.remove();
    });
    introCard.appendChild(introH);
    introCard.appendChild(introP);
    introCard.appendChild(introBtn);
    intro.appendChild(introCard);
    root.appendChild(intro);

    return { suppressRootClick: true, noLock: true };
  });
})();
