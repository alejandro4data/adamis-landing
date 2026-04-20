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

  const STYLE_ID = 'mini-unir-conceptos-style';
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
      .tpl--miniact-unir-conceptos{
        position:relative;
        padding:28px 20px 90px;
        display:flex;
        flex-direction:column;
        gap:16px;
        align-items:center;
        justify-content:center;
        min-height:70vh;
      }
      .match-shell{
        width:min(1120px, 96vw);
        background:
          radial-gradient(circle at top, rgba(251,191,36,.18), transparent 34%),
          linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        border:1px solid #e5e7eb;
        border-radius:26px;
        padding:24px 24px 22px;
        box-shadow:0 26px 60px rgba(15,23,42,.12);
      }
      .match-head{
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:16px;
        margin-bottom:10px;
      }
      .match-title{
        margin:0;
        font-size:28px;
        font-weight:900;
        color:#0f172a;
      }
      .match-progress{
        font-size:12px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#475569;
      }
      .match-instructions{
        margin:0 0 18px 0;
        font-size:14px;
        color:#334155;
      }
      .match-stage{
        position:relative;
        display:grid;
        grid-template-columns:minmax(240px, 1fr) minmax(160px, 260px) minmax(240px, 1fr);
        gap:22px;
        min-height:440px;
        align-items:stretch;
      }
      .match-column{
        position:relative;
        z-index:2;
        display:flex;
        flex-direction:column;
        gap:14px;
      }
      .match-column--left{ align-items:stretch; }
      .match-column--right{ align-items:stretch; }
      .match-column__title{
        margin:0 0 2px 0;
        font-size:13px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#64748b;
      }
      .match-lane{
        position:relative;
        min-height:100%;
        z-index:0;
      }
      .match-svg{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        pointer-events:none;
        overflow:visible;
        z-index:1;
      }
      .match-path{
        fill:none;
        stroke:#94a3b8;
        stroke-width:4;
        stroke-linecap:round;
        filter:drop-shadow(0 6px 14px rgba(15,23,42,.18));
        transition:stroke .16s ease, opacity .16s ease;
      }
      .match-path.is-preview{
        stroke:#2563eb;
        stroke-width:5;
        opacity:.92;
      }
      .match-path.is-correct{ stroke:#16a34a; }
      .match-path.is-wrong{ stroke:#dc2626; }
      .match-card{
        position:relative;
        min-height:96px;
        display:grid;
        grid-template-columns:90px minmax(0, 1fr) 24px;
        gap:14px;
        align-items:center;
        padding:12px;
        border-radius:20px;
        border:1px solid #e2e8f0;
        background:linear-gradient(180deg,#ffffff 0%, #f8fafc 100%);
        box-shadow:0 14px 32px rgba(15,23,42,.08);
        cursor:pointer;
        transition:transform .12s ease, box-shadow .12s ease, border-color .12s ease;
      }
      .match-card--left{
        cursor:grab;
        touch-action:none;
      }
      .match-card--left:active{
        cursor:grabbing;
      }
      .match-card:hover{
        transform:translateY(-1px);
        box-shadow:0 18px 36px rgba(15,23,42,.12);
        border-color:#cbd5e1;
      }
      .match-card--right{
        grid-template-columns:24px minmax(0, 1fr) 90px;
      }
      .match-card.is-selected{
        border-color:#2563eb;
        box-shadow:0 0 0 4px rgba(37,99,235,.12), 0 18px 36px rgba(15,23,42,.14);
      }
      .match-card.is-linked{
        border-color:#94a3b8;
      }
      .match-card.is-drag-source{
        border-color:#2563eb;
        box-shadow:0 0 0 4px rgba(37,99,235,.12), 0 18px 36px rgba(15,23,42,.14);
      }
      .match-card.is-drop-target{
        border-color:#2563eb;
        box-shadow:0 0 0 4px rgba(37,99,235,.1), 0 18px 36px rgba(15,23,42,.14);
        transform:translateY(-1px);
      }
      .match-card.is-correct{
        border-color:#16a34a;
        background:linear-gradient(180deg,#f0fdf4 0%, #ffffff 100%);
      }
      .match-card.is-wrong{
        border-color:#dc2626;
        background:linear-gradient(180deg,#fef2f2 0%, #ffffff 100%);
      }
      .match-media{
        width:90px;
        height:90px;
        border-radius:18px;
        border:1px dashed #cbd5e1;
        background:#e2e8f0;
        background-size:cover;
        background-position:center;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#475569;
        font-size:12px;
        font-weight:800;
        text-transform:uppercase;
        letter-spacing:.06em;
        overflow:hidden;
      }
      .match-media.has-image{
        border-style:solid;
        border-color:#dbeafe;
        background-color:#ffffff;
      }
      .match-copy{
        min-width:0;
        display:flex;
        flex-direction:column;
        gap:6px;
      }
      .match-copy__eyebrow{
        font-size:11px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#64748b;
      }
      .match-copy__text{
        font-size:17px;
        font-weight:800;
        color:#0f172a;
        line-height:1.2;
        word-break:break-word;
      }
      .match-dot{
        width:18px;
        height:18px;
        border-radius:999px;
        border:3px solid #0f172a;
        background:#ffffff;
        box-shadow:0 0 0 4px rgba(15,23,42,.08);
        justify-self:center;
      }
      .match-card.is-selected .match-dot{
        border-color:#2563eb;
        box-shadow:0 0 0 6px rgba(37,99,235,.14);
      }
      .match-card.is-drag-source .match-dot,
      .match-card.is-drop-target .match-dot{
        border-color:#2563eb;
        box-shadow:0 0 0 6px rgba(37,99,235,.14);
      }
      .match-card.is-correct .match-dot{
        border-color:#16a34a;
        background:#dcfce7;
      }
      .match-card.is-wrong .match-dot{
        border-color:#dc2626;
        background:#fee2e2;
      }
      .match-actions{
        display:flex;
        gap:12px;
        align-items:center;
        margin-top:18px;
      }
      .match-btn{
        appearance:none;
        border:none;
        border-radius:12px;
        padding:11px 15px;
        font-weight:800;
        cursor:pointer;
      }
      .match-btn.secondary{
        background:#e2e8f0;
        color:#0f172a;
      }
      .match-feedback{
        min-height:20px;
        font-size:14px;
        font-weight:800;
      }
      .match-feedback.ok{ color:#16a34a; }
      .match-feedback.err{ color:#dc2626; }
      .match-feedback.info{ color:#2563eb; }
      .match-intro{
        position:fixed;
        inset:0;
        background:rgba(15,23,42,.45);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:5;
        padding:24px;
      }
      .match-intro-card{
        width:min(520px, 92vw);
        background:#ffffff;
        border-radius:20px;
        padding:20px 22px;
        box-shadow:0 24px 60px rgba(0,0,0,.28);
      }
      .match-intro-title{
        margin:0 0 6px 0;
        font-size:20px;
        font-weight:800;
        color:#0f172a;
      }
      .match-intro-text{
        margin:0 0 16px 0;
        font-size:14px;
        color:#334155;
      }
      .match-btn.primary{
        background:#111827;
        color:#ffffff;
        box-shadow:0 12px 26px rgba(17,24,39,.25);
      }
      .match-confetti{
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:3;
      }
      @media (max-width: 980px){
        .match-stage{
          grid-template-columns:minmax(220px, 1fr) 120px minmax(220px, 1fr);
          gap:14px;
        }
        .match-card{
          grid-template-columns:74px minmax(0, 1fr) 20px;
        }
        .match-card--right{
          grid-template-columns:20px minmax(0, 1fr) 74px;
        }
        .match-media{
          width:74px;
          height:74px;
        }
        .match-copy__text{
          font-size:15px;
        }
      }
      @media (max-width: 760px){
        .match-head{
          flex-direction:column;
          align-items:flex-start;
        }
        .match-stage{
          grid-template-columns:1fr;
          gap:18px;
        }
        .match-lane{
          min-height:120px;
        }
      }
    `;
    document.head.appendChild(css);
  }

  function normalizeSide(side, fallbackText) {
    if (side == null) return { text: String(fallbackText || '').trim(), image: '', alt: '' };
    if (typeof side === 'string') return { text: side.trim(), image: '', alt: '' };
    return {
      text: String(side.text ?? side.label ?? side.nombre ?? fallbackText ?? '').trim(),
      image: String(side.image ?? side.img ?? side.imagen ?? '').trim(),
      alt: String(side.alt ?? side.text ?? side.label ?? fallbackText ?? '').trim()
    };
  }

  function normalizePairs(input) {
    const list = Array.isArray(input) ? input : [];
    return list.map((raw, idx) => {
      const pairId = String(raw?.id ?? raw?.key ?? idx);
      const left = normalizeSide(raw?.left, raw?.leftText ?? raw?.textLeft ?? raw?.conceptoLeft);
      const right = normalizeSide(raw?.right, raw?.rightText ?? raw?.textRight ?? raw?.conceptoRight);
      const hasLeft = !!(left.text || left.image);
      const hasRight = !!(right.text || right.image);
      if (!hasLeft || !hasRight) return null;
      return {
        pairId,
        left,
        right
      };
    }).filter(Boolean);
  }

  function shuffle(items) {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function launchConfetti(root) {
    const cv = document.createElement('canvas');
    cv.className = 'match-confetti';
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
        y: (h / dpr) * 0.32,
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

  SlideRendererRegistry.register('miniactividad-unir-conceptos', function (s, root) {
    ensureStyles();
    root.classList.add('tpl--miniact-unir-conceptos');

    const isEn = lang() === 'en';
    const sourcePairs = isEn
      ? (s?.pairs_en ?? s?.parejas_en ?? s?.pairs ?? s?.parejas)
      : (s?.pairs ?? s?.parejas);
    const pairs = normalizePairs(sourcePairs);

    if (!pairs.length) {
      root.innerHTML = `<div class="empty-state__text">${tr('No hay parejas para conectar.')}</div>`;
      return { suppressRootClick: true, noLock: true };
    }

    const titleText = tr(String(s?.title || s?.titulo || 'Miniactividad'));
    const introTitle = tr(String(s?.introTitle || s?.intro?.title || 'Antes de empezar'));
    const introText = tr(String(s?.introText || s?.intro?.text || 'Une cada concepto con su pareja correcta.'));
    const introButtonText = tr(String(s?.introButtonText || s?.intro?.buttonText || 'Empezar'));
    const autoAdvanceMs = Math.max(500, Number(s?.autoAdvanceMs ?? 1600));
    const shuffleRight = s?.shuffleRight !== false;

    const leftItems = pairs.map((pair, idx) => ({
      pairId: pair.pairId,
      side: 'left',
      domId: `left-${idx}-${pair.pairId}`,
      content: pair.left
    }));
    const rightSeed = pairs.map((pair, idx) => ({
      pairId: pair.pairId,
      side: 'right',
      domId: `right-${idx}-${pair.pairId}`,
      content: pair.right
    }));
    const rightItems = shuffleRight ? shuffle(rightSeed) : rightSeed;

    const head = document.createElement('div');
    head.className = 'match-head';
    const title = document.createElement('h2');
    title.className = 'match-title';
    title.textContent = titleText;
    const progress = document.createElement('div');
    progress.className = 'match-progress';
    head.appendChild(title);
    head.appendChild(progress);

    const instructions = document.createElement('p');
    instructions.className = 'match-instructions';
    instructions.textContent = tr('Arrastra desde un elemento de la izquierda hasta su pareja correcta de la derecha.');

    const stage = document.createElement('div');
    stage.className = 'match-stage';

    const leftCol = document.createElement('div');
    leftCol.className = 'match-column match-column--left';
    const leftTitle = document.createElement('div');
    leftTitle.className = 'match-column__title';
    leftTitle.textContent = tr('Concepto');
    leftCol.appendChild(leftTitle);

    const lane = document.createElement('div');
    lane.className = 'match-lane';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'match-svg');

    const rightCol = document.createElement('div');
    rightCol.className = 'match-column match-column--right';
    const rightTitle = document.createElement('div');
    rightTitle.className = 'match-column__title';
    rightTitle.textContent = tr('Concepto');
    rightCol.appendChild(rightTitle);

    stage.appendChild(leftCol);
    stage.appendChild(lane);
    stage.appendChild(rightCol);
    stage.appendChild(svg);

    const actions = document.createElement('div');
    actions.className = 'match-actions';
    const hintBtn = document.createElement('button');
    hintBtn.type = 'button';
    hintBtn.className = 'match-btn secondary';
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'match-btn secondary';
    resetBtn.textContent = tr('Reiniciar uniones');
    const feedback = document.createElement('div');
    feedback.className = 'match-feedback';
    actions.appendChild(hintBtn);
    actions.appendChild(resetBtn);
    actions.appendChild(feedback);

    const shell = document.createElement('div');
    shell.className = 'match-shell';
    shell.appendChild(head);
    shell.appendChild(instructions);
    shell.appendChild(stage);
    shell.appendChild(actions);
    root.appendChild(shell);

    const itemNodes = new Map();
    const nodeItems = new Map();
    const connections = new Map();
    let locked = false;
    let advanced = false;
    let advanceTimer = null;
    let hintInterval = null;
    const hintReadyAt = Date.now() + HINT_DELAY_MS;
    let activeDrag = null;

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
      feedback.className = 'match-feedback' + (type ? ` ${type}` : '');
      feedback.textContent = text || '';
    }

    function getConnectionCount() {
      return connections.size;
    }

    function updateProgress() {
      progress.textContent = tr(`Conexiones`) + ` ${getConnectionCount()} / ${pairs.length}`;
    }

    function removeConnectionByRight(rightPairId) {
      for (const [leftPairId, value] of connections.entries()) {
        if (value === rightPairId) {
          connections.delete(leftPairId);
          break;
        }
      }
    }

    function cardState(item) {
      const linkedRight = connections.get(item.pairId);
      const linkedLeft = Array.from(connections.values()).includes(item.pairId);
      const isLinked = item.side === 'left' ? linkedRight != null : linkedLeft;
      const full = connections.size === pairs.length;
      const correct = item.side === 'left'
        ? linkedRight === item.pairId
        : Array.from(connections.entries()).some(([leftPairId, rightPairId]) => leftPairId === item.pairId && rightPairId === item.pairId);
      return { isLinked, full, correct };
    }

    function renderCardClasses() {
      itemNodes.forEach((btn, key) => {
        const item = key;
        const state = cardState(item);
        btn.classList.toggle('is-linked', state.isLinked && !state.full);
        btn.classList.toggle('is-correct', state.full && state.correct);
        btn.classList.toggle('is-wrong', state.full && state.isLinked && !state.correct);
        btn.classList.toggle('is-drag-source', !!activeDrag && activeDrag.source.pairId === item.pairId && item.side === 'left');
        btn.classList.toggle('is-drop-target', !!activeDrag?.target && activeDrag.target.pairId === item.pairId && item.side === 'right');
      });
    }

    function getDotCenter(btn) {
      const dot = btn?.querySelector('.match-dot');
      if (!dot) return null;
      const rect = dot.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }

    function buildPath(x1, y1, x2, y2) {
      const mid = Math.max(72, Math.abs(x2 - x1) * 0.38);
      return `M ${x1} ${y1} C ${x1 + mid} ${y1}, ${x2 - mid} ${y2}, ${x2} ${y2}`;
    }

    function drawConnections() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const stageRect = stage.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${Math.max(1, stageRect.width)} ${Math.max(1, stageRect.height)}`);

      const full = connections.size === pairs.length;
      for (const [leftPairId, rightPairId] of connections.entries()) {
        const leftItem = leftItems.find((item) => item.pairId === leftPairId);
        const rightItem = rightItems.find((item) => item.pairId === rightPairId);
        const leftBtn = itemNodes.get(leftItem);
        const rightBtn = itemNodes.get(rightItem);
        if (!leftBtn || !rightBtn) continue;

        const leftDot = leftBtn.querySelector('.match-dot');
        const rightDot = rightBtn.querySelector('.match-dot');
        if (!leftDot || !rightDot) continue;

        const l = leftDot.getBoundingClientRect();
        const r = rightDot.getBoundingClientRect();
        const x1 = l.left + l.width / 2 - stageRect.left;
        const y1 = l.top + l.height / 2 - stageRect.top;
        const x2 = r.left + r.width / 2 - stageRect.left;
        const y2 = r.top + r.height / 2 - stageRect.top;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'match-path');
        path.setAttribute('d', buildPath(x1, y1, x2, y2));
        if (full) {
          path.classList.add(leftPairId === rightPairId ? 'is-correct' : 'is-wrong');
        }
        svg.appendChild(path);
      }

      if (activeDrag) {
        const sourceBtn = itemNodes.get(activeDrag.source);
        const sourceCenter = getDotCenter(sourceBtn);
        if (sourceCenter) {
          const targetCenter = activeDrag.target
            ? getDotCenter(itemNodes.get(activeDrag.target))
            : { x: activeDrag.clientX, y: activeDrag.clientY };
          if (targetCenter) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', 'match-path is-preview');
            path.setAttribute(
              'd',
              buildPath(
                sourceCenter.x - stageRect.left,
                sourceCenter.y - stageRect.top,
                targetCenter.x - stageRect.left,
                targetCenter.y - stageRect.top
              )
            );
            svg.appendChild(path);
          }
        }
      }
    }

    function syncVisuals() {
      updateProgress();
      renderCardClasses();
      drawConnections();
    }

    function goNextSlide() {
      if (advanced) return;
      advanced = true;
      if (window.SlideActions && typeof window.SlideActions.next === 'function') {
        window.SlideActions.next();
      }
    }

    function checkSolved() {
      if (connections.size !== pairs.length) {
        if (feedback.classList.contains('err')) setFeedback('', '');
        syncVisuals();
        return;
      }

      const correct = leftItems.every((item) => connections.get(item.pairId) === item.pairId);
      syncVisuals();

      if (correct) {
        locked = true;
        setFeedback('ok', tr('Has unido correctamente todos los conceptos.'));
        launchConfetti(root);
        if (advanceTimer) clearTimeout(advanceTimer);
        advanceTimer = setTimeout(() => {
          if (!root.isConnected) return;
          goNextSlide();
        }, autoAdvanceMs);
      } else {
        setFeedback('err', tr('Hay uniones incorrectas. Revisa las conexiones.'));
      }
    }

    function connect(a, b) {
      const left = a.side === 'left' ? a : b;
      const right = a.side === 'right' ? a : b;
      connections.delete(left.pairId);
      removeConnectionByRight(right.pairId);
      connections.set(left.pairId, right.pairId);
      checkSolved();
    }

    function applyHint() {
      const targetLeft = leftItems.find((item) => connections.get(item.pairId) !== item.pairId);
      if (!targetLeft) return;
      connections.delete(targetLeft.pairId);
      removeConnectionByRight(targetLeft.pairId);
      connections.set(targetLeft.pairId, targetLeft.pairId);
      setFeedback('info', tr('Se ha conectado correctamente una pareja.'));
      checkSolved();
    }

    function getHoveredRightItem(clientX, clientY) {
      const hovered = document.elementFromPoint(clientX, clientY);
      const card = hovered?.closest?.('.match-card--right');
      return card ? nodeItems.get(card) || null : null;
    }

    function updateDrag(clientX, clientY) {
      if (!activeDrag) return;
      activeDrag.clientX = clientX;
      activeDrag.clientY = clientY;
      activeDrag.target = getHoveredRightItem(clientX, clientY);
      syncVisuals();
    }

    function finishDrag(shouldCommit) {
      if (!activeDrag) return;
      const source = activeDrag.source;
      const target = shouldCommit ? activeDrag.target : null;
      activeDrag = null;
      syncVisuals();
      if (shouldCommit && source && target) {
        connect(source, target);
      }
    }

    function onPointerMove(ev) {
      updateDrag(ev.clientX, ev.clientY);
    }

    function onPointerUp(ev) {
      updateDrag(ev.clientX, ev.clientY);
      finishDrag(true);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
    }

    function onPointerCancel(ev) {
      if (typeof ev?.clientX === 'number' && typeof ev?.clientY === 'number') {
        updateDrag(ev.clientX, ev.clientY);
      }
      finishDrag(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
    }

    function startDrag(item, ev) {
      if (locked || item.side !== 'left') return;
      ev.preventDefault();
      setFeedback('', '');
      activeDrag = {
        source: item,
        clientX: ev.clientX,
        clientY: ev.clientY,
        target: null
      };
      syncVisuals();
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerCancel);
    }

    function makeMedia(content) {
      const media = document.createElement('div');
      media.className = 'match-media';
      if (content.image) {
        media.classList.add('has-image');
        media.style.backgroundImage = `url("${content.image.replace(/"/g, '&quot;')}")`;
        media.setAttribute('aria-label', content.alt || content.text || tr('Imagen'));
      } else {
        media.textContent = tr('Imagen');
      }
      return media;
    }

    function makeCard(item) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'match-card ' + (item.side === 'right' ? 'match-card--right' : 'match-card--left');

      const media = makeMedia(item.content);
      const copy = document.createElement('div');
      copy.className = 'match-copy';
      const eyebrow = document.createElement('div');
      eyebrow.className = 'match-copy__eyebrow';
      eyebrow.textContent = tr(item.side === 'left' ? 'Concepto' : 'Concepto');
      const text = document.createElement('div');
      text.className = 'match-copy__text';
      text.textContent = item.content.text || tr('Concepto');
      copy.appendChild(eyebrow);
      copy.appendChild(text);

      const dot = document.createElement('div');
      dot.className = 'match-dot';

      if (item.side === 'left') {
        btn.appendChild(media);
        btn.appendChild(copy);
        btn.appendChild(dot);
      } else {
        btn.appendChild(dot);
        btn.appendChild(copy);
        btn.appendChild(media);
      }

      if (item.side === 'left') {
        btn.addEventListener('pointerdown', (ev) => startDrag(item, ev));
      }

      itemNodes.set(item, btn);
      nodeItems.set(btn, item);
      return btn;
    }

    leftItems.forEach((item) => leftCol.appendChild(makeCard(item)));
    rightItems.forEach((item) => rightCol.appendChild(makeCard(item)));
    updateHintButton();
    hintInterval = setInterval(updateHintButton, 1000);

    hintBtn.addEventListener('click', () => {
      if (hintBtn.disabled || locked) return;
      applyHint();
    });

    resetBtn.addEventListener('click', () => {
      if (locked) return;
      connections.clear();
      activeDrag = null;
      setFeedback('', '');
      syncVisuals();
    });

    const redraw = () => {
      if (!root.isConnected) return;
      drawConnections();
    };
    window.addEventListener('resize', redraw);
    if (typeof ResizeObserver === 'function') {
      const ro = new ResizeObserver(redraw);
      ro.observe(stage);
    }

    syncVisuals();

    const intro = document.createElement('div');
    intro.className = 'match-intro';
    const introCard = document.createElement('div');
    introCard.className = 'match-intro-card';
    const introH = document.createElement('h3');
    introH.className = 'match-intro-title';
    introH.textContent = introTitle;
    const introP = document.createElement('p');
    introP.className = 'match-intro-text';
    introP.textContent = introText;
    const introBtn = document.createElement('button');
    introBtn.type = 'button';
    introBtn.className = 'match-btn primary';
    introBtn.textContent = introButtonText;
    introBtn.addEventListener('click', () => {
      intro.remove();
      drawConnections();
    });
    introCard.appendChild(introH);
    introCard.appendChild(introP);
    introCard.appendChild(introBtn);
    intro.appendChild(introCard);
    root.appendChild(intro);

    return { suppressRootClick: true, noLock: true };
  });
})();
