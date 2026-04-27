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

  const STYLE_ID = 'mini-ordenar-secuencia-style';
  const HINT_DELAY_MS = 30000;

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
      .tpl--miniact-ordenar-secuencia{
        position:relative;
        padding:28px 20px 90px;
        display:flex;
        flex-direction:column;
        gap:16px;
        align-items:center;
        justify-content:center;
        min-height:70vh;
      }
      .seq-shell{
        width:min(1120px, calc(100vw - 24px));
        max-width:100%;
        box-sizing:border-box;
        background:
          radial-gradient(circle at top, rgba(20,184,166,.14), transparent 34%),
          linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        border:1px solid #e5e7eb;
        border-radius:26px;
        padding:24px 24px 22px;
        box-shadow:0 26px 60px rgba(15,23,42,.12);
      }
      .seq-head{
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:16px;
        margin-bottom:10px;
      }
      .seq-title{
        margin:0;
        font-size:28px;
        font-weight:900;
        color:#0f172a;
      }
      .seq-progress{
        font-size:12px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#475569;
      }
      .seq-instructions{
        margin:0 0 18px 0;
        font-size:14px;
        color:#334155;
      }
      .seq-list{
        display:flex;
        flex-direction:column;
        gap:14px;
      }
      .seq-row{
        display:grid;
        grid-template-columns:74px minmax(0, 1fr);
        gap:14px;
        align-items:center;
      }
      .seq-index{
        width:58px;
        height:58px;
        border-radius:999px;
        border:4px solid #0f172a;
        background:#ffffff;
        color:#0f172a;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:22px;
        font-weight:900;
        box-shadow:0 10px 24px rgba(15,23,42,.08);
      }
      .seq-card{
        appearance:none;
        width:100%;
        border:3px solid #0f172a;
        border-radius:18px;
        background:#ffffff;
        color:#0f172a;
        padding:18px 20px;
        text-align:left;
        font-size:18px;
        font-weight:800;
        line-height:1.35;
        cursor:grab;
        box-shadow:0 14px 30px rgba(15,23,42,.08);
        transition:border-color .22s ease, box-shadow .22s ease, transform .22s ease, background-color .22s ease, color .22s ease, opacity .22s ease;
      }
      .seq-card:hover{
        transform:translateY(-1px);
        box-shadow:0 18px 36px rgba(15,23,42,.11);
      }
      .seq-card.is-selected{
        border-color:#2563eb;
        box-shadow:0 0 0 4px rgba(37,99,235,.14), 0 18px 36px rgba(37,99,235,.16);
      }
      .seq-card.is-dragging{
        opacity:.35;
      }
      .seq-row.is-correct .seq-card{
        border-color:#16a34a;
        color:#166534;
        background:#f0fdf4;
      }
      .seq-row.is-wrong .seq-card{
        border-color:#dc2626;
        color:#991b1b;
        background:#fef2f2;
      }
      .seq-row.is-drop-target .seq-card{
        border-color:#2563eb;
        background:#eff6ff;
        color:#1d4ed8;
      }
      .seq-actions{
        display:flex;
        gap:12px;
        align-items:center;
        margin-top:18px;
        flex-wrap:wrap;
      }
      .seq-btn{
        appearance:none;
        border:none;
        border-radius:12px;
        padding:11px 15px;
        font-weight:800;
        cursor:pointer;
      }
      .seq-btn.secondary{
        background:#e2e8f0;
        color:#0f172a;
      }
      .seq-btn.primary{
        background:#111827;
        color:#ffffff;
        box-shadow:0 12px 26px rgba(17,24,39,.25);
      }
      .seq-feedback{
        min-height:20px;
        font-size:14px;
        font-weight:800;
      }
      .seq-feedback.ok{ color:#16a34a; }
      .seq-feedback.err{ color:#dc2626; }
      .seq-feedback.info{ color:#2563eb; }
      .seq-intro{
        position:fixed;
        inset:0;
        background:rgba(15,23,42,.45);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:5;
        padding:24px;
      }
      .seq-intro-card{
        width:min(520px, 92vw);
        background:#ffffff;
        border-radius:20px;
        padding:20px 22px;
        box-shadow:0 24px 60px rgba(0,0,0,.28);
      }
      .seq-intro-title{
        margin:0 0 6px 0;
        font-size:20px;
        font-weight:800;
        color:#0f172a;
      }
      .seq-intro-text{
        margin:0 0 16px 0;
        font-size:14px;
        color:#334155;
      }
      .seq-confetti{
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:3;
      }
      @media (max-width: 760px){
        .seq-shell{
          padding:18px 16px 18px;
        }
        .seq-head{
          flex-direction:column;
          align-items:flex-start;
        }
        .seq-row{
          grid-template-columns:56px minmax(0, 1fr);
          gap:10px;
        }
        .seq-index{
          width:48px;
          height:48px;
          border-width:3px;
          font-size:18px;
        }
        .seq-card{
          padding:14px 16px;
          font-size:16px;
        }
      }
    `;
    document.head.appendChild(css);
  }

  function normalizeSteps(input) {
    const list = Array.isArray(input) ? input : [];
    return list.map((raw, idx) => {
      const text = typeof raw === 'string'
        ? raw.trim()
        : String(raw?.text ?? raw?.label ?? raw?.frase ?? raw?.phrase ?? '').trim();
      if (!text) return null;
      return {
        id: String(raw?.id ?? raw?.key ?? idx),
        text
      };
    }).filter(Boolean);
  }

  function shuffled(list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function shuffleAllWrong(list) {
    if (list.length < 2) return list.slice();
    let out = shuffled(list);
    let tries = 0;
    while (out.some((item, idx) => item.id === list[idx].id) && tries < 24) {
      out = shuffled(list);
      tries += 1;
    }
    if (out.some((item, idx) => item.id === list[idx].id)) {
      const rotated = list.slice(1).concat(list[0]);
      if (rotated.every((item, idx) => item.id !== list[idx].id)) return rotated;
    }
    return out;
  }

  function swapItems(list, fromIndex, toIndex) {
    if (fromIndex === toIndex) return list.slice();
    const out = list.slice();
    const tmp = out[fromIndex];
    out[fromIndex] = out[toIndex];
    out[toIndex] = tmp;
    return out;
  }

  function launchConfetti(root) {
    const cv = document.createElement('canvas');
    cv.className = 'seq-confetti';
    root.appendChild(cv);
    const ctx = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;

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

    const colors = ['#14b8a6', '#16a34a', '#f59e0b', '#2563eb', '#0f172a'];
    const particles = [];
    for (let i = 0; i < 90; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 4.5;
      particles.push({
        x: (w / dpr) * 0.5,
        y: (h / dpr) * 0.24,
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
      for (let i = particles.length - 1; i >= 0; i -= 1) {
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

  SlideRendererRegistry.register('miniactividad-ordenar-secuencia', function (s, root) {
    ensureStyles();
    root.classList.add('tpl--miniact-ordenar-secuencia');

    const isEn = lang() === 'en';
    const sourceSteps = isEn
      ? (s?.steps_en ?? s?.pasos_en ?? s?.items_en ?? s?.frases_en ?? s?.steps ?? s?.pasos ?? s?.items ?? s?.frases)
      : (s?.steps ?? s?.pasos ?? s?.items ?? s?.frases);
    const correctSteps = normalizeSteps(sourceSteps);

    if (!correctSteps.length) {
      root.innerHTML = `<div class="empty-state__text">${tr('No hay pasos para ordenar.')}</div>`;
      return { suppressRootClick: true, noLock: true };
    }

    const titleText = tr(String(s?.title || s?.titulo || 'Miniactividad'));
    const introTitle = tr(String(s?.introTitle || s?.intro?.title || 'Antes de empezar'));
    const introText = tr(String(s?.introText || s?.intro?.text || 'Ordena las frases en el orden correcto.'));
    const introButtonText = tr(String(s?.introButtonText || s?.intro?.buttonText || 'Empezar'));
    const autoAdvanceMs = Math.max(500, Number(s?.autoAdvanceMs ?? 1600));

    const shell = document.createElement('div');
    shell.className = 'seq-shell';

    const head = document.createElement('div');
    head.className = 'seq-head';
    const title = document.createElement('h2');
    title.className = 'seq-title';
    title.textContent = titleText;
    const progress = document.createElement('div');
    progress.className = 'seq-progress';
    head.appendChild(title);
    head.appendChild(progress);

    const instructions = document.createElement('p');
    instructions.className = 'seq-instructions';
    instructions.textContent = tr('Arrastra las frases para reordenarlas o pulsa dos filas para intercambiarlas.');

    const list = document.createElement('div');
    list.className = 'seq-list';

    const actions = document.createElement('div');
    actions.className = 'seq-actions';
    const hintBtn = document.createElement('button');
    hintBtn.type = 'button';
    hintBtn.className = 'seq-btn secondary';
    hintBtn.textContent = tr('Pista');
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'seq-btn secondary';
    resetBtn.textContent = tr('Reiniciar secuencia');
    const feedback = document.createElement('div');
    feedback.className = 'seq-feedback';
    actions.appendChild(hintBtn);
    actions.appendChild(resetBtn);
    actions.appendChild(feedback);

    shell.appendChild(head);
    shell.appendChild(instructions);
    shell.appendChild(list);
    shell.appendChild(actions);
    root.appendChild(shell);

    let currentSteps = shuffleAllWrong(correctSteps);
    let selectedIndex = -1;
    let dragIndex = -1;
    let dropIndex = -1;
    let advanceTimer = null;
    let advanced = false;
    let hintInterval = null;
    let hintReadyAt = Date.now() + HINT_DELAY_MS;

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

    function startHintCooldown() {
      hintReadyAt = Date.now() + HINT_DELAY_MS;
      if (!hintInterval) hintInterval = setInterval(updateHintButton, 1000);
      updateHintButton();
    }

    function setFeedback(type, text) {
      feedback.className = 'seq-feedback' + (type ? ` ${type}` : '');
      feedback.textContent = text || '';
    }

    function correctCount() {
      let count = 0;
      for (let i = 0; i < currentSteps.length; i += 1) {
        if (currentSteps[i].id === correctSteps[i].id) count += 1;
      }
      return count;
    }

    function updateProgress() {
      progress.textContent = `${tr('Secuencia')} ${correctCount()} / ${correctSteps.length}`;
    }

    function goNextSlide() {
      if (advanced) return;
      advanced = true;
      if (window.SlideActions && typeof window.SlideActions.next === 'function') {
        window.SlideActions.next();
      }
    }

    function isComplete() {
      return currentSteps.every((item, idx) => item.id === correctSteps[idx].id);
    }

    function checkDone() {
      updateProgress();
      if (!isComplete()) {
        setFeedback('err', tr('Todavia hay pasos fuera de orden.'));
        return;
      }
      setFeedback('ok', tr('Secuencia completada correctamente.'));
      launchConfetti(root);
      if (advanceTimer) clearTimeout(advanceTimer);
      advanceTimer = setTimeout(() => {
        if (!root.isConnected) return;
        goNextSlide();
      }, autoAdvanceMs);
    }

    function swapIndices(a, b) {
      if (a < 0 || b < 0 || a === b) return;
      const out = currentSteps.slice();
      const tmp = out[a];
      out[a] = out[b];
      out[b] = tmp;
      currentSteps = out;
      selectedIndex = -1;
      render();
      checkDone();
    }

    function applyHint() {
      const wrongIndex = currentSteps.findIndex((item, idx) => item.id !== correctSteps[idx].id);
      if (wrongIndex < 0) {
        setFeedback('ok', tr('Secuencia completada correctamente.'));
        return false;
      }
      const neededId = correctSteps[wrongIndex].id;
      const fromIndex = currentSteps.findIndex((item) => item.id === neededId);
      currentSteps = swapItems(currentSteps, fromIndex, wrongIndex);
      selectedIndex = -1;
      render();
      setFeedback('info', tr('Paso fijado por pista.'));
      checkDone();
      return true;
    }

    function render() {
      list.innerHTML = '';
      currentSteps.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'seq-row ' + (item.id === correctSteps[idx].id ? 'is-correct' : 'is-wrong');
        if (idx === dropIndex) row.classList.add('is-drop-target');

        const index = document.createElement('div');
        index.className = 'seq-index';
        index.textContent = String(idx + 1);

        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'seq-card';
        card.textContent = item.text;
        card.draggable = true;
        if (idx === selectedIndex) card.classList.add('is-selected');

        card.addEventListener('click', () => {
          if (selectedIndex < 0) {
            selectedIndex = idx;
            setFeedback('info', tr('Selecciona otra fila para intercambiarla.'));
            render();
            return;
          }
          if (selectedIndex === idx) {
            selectedIndex = -1;
            setFeedback('', '');
            render();
            return;
          }
          swapIndices(selectedIndex, idx);
        });

        card.addEventListener('dragstart', (ev) => {
          dragIndex = idx;
          dropIndex = idx;
          card.classList.add('is-dragging');
          if (ev.dataTransfer) {
            ev.dataTransfer.effectAllowed = 'move';
            ev.dataTransfer.setData('text/plain', String(idx));
          }
        });

        card.addEventListener('dragend', () => {
          dragIndex = -1;
          dropIndex = -1;
          render();
        });

        row.addEventListener('dragover', (ev) => {
          if (dragIndex < 0) return;
          ev.preventDefault();
          dropIndex = idx;
          row.classList.add('is-drop-target');
        });

        row.addEventListener('drop', (ev) => {
          if (dragIndex < 0) return;
          ev.preventDefault();
          const from = dragIndex;
          dragIndex = -1;
          dropIndex = -1;
          currentSteps = swapItems(currentSteps, from, idx);
          selectedIndex = -1;
          render();
          checkDone();
        });

        row.appendChild(index);
        row.appendChild(card);
        list.appendChild(row);
      });
      updateProgress();
    }

    startHintCooldown();

    hintBtn.addEventListener('click', () => {
      if (hintBtn.disabled) return;
      if (applyHint()) startHintCooldown();
    });
    resetBtn.addEventListener('click', () => {
      if (advanceTimer) clearTimeout(advanceTimer);
      advanced = false;
      selectedIndex = -1;
      dragIndex = -1;
      dropIndex = -1;
      currentSteps = shuffleAllWrong(correctSteps);
      setFeedback('', '');
      render();
      startHintCooldown();
      checkDone();
    });

    render();
    checkDone();

    const intro = document.createElement('div');
    intro.className = 'seq-intro';
    const introCard = document.createElement('div');
    introCard.className = 'seq-intro-card';
    const introH = document.createElement('h3');
    introH.className = 'seq-intro-title';
    introH.textContent = introTitle;
    const introP = document.createElement('p');
    introP.className = 'seq-intro-text';
    introP.textContent = introText;
    const introBtn = document.createElement('button');
    introBtn.type = 'button';
    introBtn.className = 'seq-btn primary';
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
