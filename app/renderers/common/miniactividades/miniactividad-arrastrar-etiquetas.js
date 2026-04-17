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

  const STYLE_ID = 'mini-arrastrar-etiquetas-style';
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
      .tpl--miniact-arrastrar-etiquetas{
        position:relative;
        padding:28px 20px 90px;
        display:flex;
        flex-direction:column;
        gap:16px;
        align-items:center;
        justify-content:center;
        min-height:70vh;
      }
      .matchdrop-shell{
        width:min(1320px, calc(100vw - 24px));
        max-width:100%;
        box-sizing:border-box;
        background:
          radial-gradient(circle at top, rgba(59,130,246,.14), transparent 34%),
          linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        border:1px solid #e5e7eb;
        border-radius:26px;
        padding:24px 24px 22px;
        box-shadow:0 26px 60px rgba(15,23,42,.12);
      }
      .matchdrop-head{
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:16px;
        margin-bottom:10px;
      }
      .matchdrop-title{
        margin:0;
        font-size:28px;
        font-weight:900;
        color:#0f172a;
      }
      .matchdrop-progress{
        font-size:12px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#475569;
      }
      .matchdrop-instructions{
        margin:0 0 18px 0;
        font-size:14px;
        color:#334155;
      }
      .matchdrop-board{
        display:grid;
        grid-template-columns:minmax(0, 1fr) minmax(240px, 300px);
        gap:26px;
        align-items:start;
      }
      .matchdrop-column{
        display:flex;
        flex-direction:column;
        gap:14px;
      }
      .matchdrop-column--targets{
        min-width:0;
      }
      .matchdrop-column--labels{
        min-width:0;
      }
      .matchdrop-targets-grid{
        display:grid;
        grid-template-columns:repeat(2, minmax(0, 1fr));
        gap:16px;
      }
      .matchdrop-column-title{
        font-size:12px;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#64748b;
      }
      .matchdrop-target{
        border:2px solid #dbe3ee;
        border-radius:24px;
        background:#ffffff;
        padding:14px;
        box-shadow:0 16px 34px rgba(15,23,42,.08);
        transition:border-color .22s ease, box-shadow .22s ease, transform .22s ease, background-color .22s ease;
      }
      .matchdrop-target.is-hover{
        border-color:#2563eb;
        box-shadow:0 18px 38px rgba(37,99,235,.16);
        transform:translateY(-1px);
      }
      .matchdrop-target.is-correct{
        border-color:#16a34a;
        background:#f0fdf4;
      }
      .matchdrop-target.is-wrong{
        border-color:#dc2626;
        background:#fef2f2;
      }
      .matchdrop-dropzone{
        border-radius:18px;
        overflow:hidden;
        border:2px dashed #cbd5e1;
        background:#eef2f7;
        transition:border-color .22s ease, background-color .22s ease;
      }
      .matchdrop-target.is-hover .matchdrop-dropzone{
        border-color:#2563eb;
        background:#eff6ff;
      }
      .matchdrop-target.is-correct .matchdrop-dropzone{
        border-color:#16a34a;
        background:#dcfce7;
      }
      .matchdrop-target.is-wrong .matchdrop-dropzone{
        border-color:#dc2626;
        background:#fee2e2;
      }
      .matchdrop-image{
        width:100%;
        aspect-ratio:1.6;
        background:#e2e8f0;
        background-size:cover;
        background-position:center;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#475569;
        font-size:12px;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
      }
      .matchdrop-image.has-image{
        background-color:#f8fafc;
      }
      .matchdrop-meta{
        padding:12px 12px 0;
      }
      .matchdrop-caption{
        font-size:14px;
        font-weight:800;
        line-height:1.35;
        color:#0f172a;
      }
      .matchdrop-slot{
        margin-top:12px;
        min-height:56px;
        border:2px dashed #cbd5e1;
        border-radius:16px;
        background:#ffffff;
        padding:10px 12px;
        display:flex;
        align-items:center;
        justify-content:center;
        text-align:center;
        color:#64748b;
        font-size:13px;
        font-weight:800;
        transition:border-color .22s ease, color .22s ease, background-color .22s ease;
      }
      .matchdrop-target.is-hover .matchdrop-slot{
        border-color:#2563eb;
        color:#1d4ed8;
        background:#ffffff;
      }
      .matchdrop-target.is-correct .matchdrop-slot{
        border-color:#16a34a;
        color:#166534;
        background:#ffffff;
      }
      .matchdrop-target.is-wrong .matchdrop-slot{
        border-color:#dc2626;
        color:#991b1b;
        background:#ffffff;
      }
      .matchdrop-slot-pill{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-height:34px;
        border-radius:999px;
        padding:8px 14px;
        border:2px solid currentColor;
        background:#ffffff;
        font-size:13px;
        font-weight:900;
        line-height:1.25;
      }
      .matchdrop-bank{
        display:flex;
        flex-direction:column;
        gap:12px;
        position:sticky;
        top:12px;
        width:100%;
      }
      .matchdrop-label{
        appearance:none;
        width:100%;
        border:2px solid #0f172a;
        border-radius:16px;
        background:#ffffff;
        color:#0f172a;
        padding:14px 16px;
        text-align:left;
        font-size:15px;
        font-weight:800;
        line-height:1.3;
        cursor:grab;
        box-shadow:0 12px 28px rgba(15,23,42,.08);
        transition:transform .2s ease, box-shadow .2s ease, opacity .2s ease;
        touch-action:none;
        user-select:none;
        -webkit-user-select:none;
      }
      .matchdrop-label:hover{
        transform:translateY(-1px);
        box-shadow:0 16px 32px rgba(15,23,42,.11);
      }
      .matchdrop-label.is-dragging{
        opacity:.24;
      }
      .matchdrop-label.is-placed{
        display:none;
      }
      .matchdrop-label-hint{
        margin-top:4px;
        font-size:11px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#64748b;
      }
      .matchdrop-empty-bank{
        border:2px dashed #cbd5e1;
        border-radius:18px;
        background:#f8fafc;
        padding:20px 16px;
        color:#64748b;
        font-size:14px;
        font-weight:800;
        text-align:center;
      }
      .matchdrop-actions{
        display:flex;
        gap:12px;
        align-items:center;
        margin-top:18px;
      }
      .matchdrop-btn{
        appearance:none;
        border:none;
        border-radius:12px;
        padding:11px 15px;
        font-weight:800;
        cursor:pointer;
      }
      .matchdrop-btn.secondary{
        background:#e2e8f0;
        color:#0f172a;
      }
      .matchdrop-btn.primary{
        background:#111827;
        color:#ffffff;
        box-shadow:0 12px 26px rgba(17,24,39,.25);
      }
      .matchdrop-feedback{
        min-height:20px;
        font-size:14px;
        font-weight:800;
      }
      .matchdrop-feedback.ok{ color:#16a34a; }
      .matchdrop-feedback.err{ color:#dc2626; }
      .matchdrop-feedback.info{ color:#2563eb; }
      .matchdrop-ghost{
        position:fixed;
        left:0;
        top:0;
        z-index:9999;
        width:min(280px, calc(100vw - 24px));
        pointer-events:none;
        border:2px solid #0f172a;
        border-radius:16px;
        background:#ffffff;
        color:#0f172a;
        padding:14px 16px;
        font-size:15px;
        font-weight:800;
        line-height:1.3;
        box-shadow:0 24px 50px rgba(15,23,42,.22);
      }
      .matchdrop-modal,
      .matchdrop-intro{
        position:fixed;
        inset:0;
        background:rgba(15,23,42,.45);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:6;
        padding:24px;
      }
      .matchdrop-modal-card,
      .matchdrop-intro-card{
        width:min(520px, 92vw);
        background:#ffffff;
        border-radius:20px;
        padding:20px 22px;
        box-shadow:0 24px 60px rgba(0,0,0,.28);
        border:2px solid #e5e7eb;
      }
      .matchdrop-modal-card.is-correct{
        border-color:#16a34a;
      }
      .matchdrop-modal-card.is-wrong{
        border-color:#dc2626;
      }
      .matchdrop-modal-title,
      .matchdrop-intro-title{
        margin:0 0 8px 0;
        font-size:20px;
        font-weight:900;
        color:#0f172a;
      }
      .matchdrop-modal-text,
      .matchdrop-intro-text{
        margin:0 0 16px 0;
        font-size:14px;
        line-height:1.45;
        color:#334155;
      }
      .matchdrop-confetti{
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:3;
      }
      @media (max-width: 980px){
        .matchdrop-board{
          grid-template-columns:minmax(0, 1fr) minmax(220px, 260px);
        }
        .matchdrop-targets-grid{
          grid-template-columns:1fr;
        }
      }
      @media (max-width: 760px){
        .matchdrop-board{
          grid-template-columns:1fr;
        }
        .matchdrop-bank{
          position:static;
        }
      }
    `;
    document.head.appendChild(css);
  }

  function normalizeItems(input) {
    const list = Array.isArray(input) ? input : [];
    return list.map((raw, idx) => {
      const text = String(raw?.text ?? raw?.label ?? raw?.etiqueta ?? '').trim();
      if (!text) return null;
      return {
        id: String(raw?.id ?? raw?.key ?? idx),
        text,
        caption: String(raw?.caption ?? raw?.title ?? raw?.name ?? '').trim(),
        image: String(raw?.image ?? raw?.img ?? raw?.imagen ?? '').trim(),
        alt: String(raw?.alt ?? raw?.caption ?? text).trim(),
        feedbackCorrect: String(
          raw?.feedbackCorrect ??
          raw?.explanationCorrect ??
          raw?.correctExplanation ??
          raw?.porqueSi ??
          'Correcto.'
        ).trim(),
        feedbackIncorrect: String(
          raw?.feedbackIncorrect ??
          raw?.explanationIncorrect ??
          raw?.incorrectExplanation ??
          raw?.porqueNo ??
          'Incorrecto.'
        ).trim(),
        feedbackIncorrectByLabel: raw?.feedbackIncorrectByLabel && typeof raw.feedbackIncorrectByLabel === 'object'
          ? raw.feedbackIncorrectByLabel
          : null
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

  function launchConfetti(root) {
    const cv = document.createElement('canvas');
    cv.className = 'matchdrop-confetti';
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

    const colors = ['#3b82f6', '#16a34a', '#f59e0b', '#ef4444', '#0f172a'];
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

  SlideRendererRegistry.register('miniactividad-arrastrar-etiquetas', function (s, root) {
    ensureStyles();
    root.classList.add('tpl--miniact-arrastrar-etiquetas');

    const isEn = lang() === 'en';
    const sourceItems = isEn
      ? (s?.items_en ?? s?.elementos_en ?? s?.matches_en ?? s?.items ?? s?.elementos ?? s?.matches)
      : (s?.items ?? s?.elementos ?? s?.matches);
    const items = normalizeItems(sourceItems);

    if (!items.length) {
      root.innerHTML = `<div class="empty-state__text">${tr('No hay imagenes para relacionar.')}</div>`;
      return { suppressRootClick: true, noLock: true };
    }

    const titleText = tr(String(s?.title || s?.titulo || 'Miniactividad'));
    const introTitle = tr(String(s?.introTitle || s?.intro?.title || 'Antes de empezar'));
    const introText = tr(String(s?.introText || s?.intro?.text || 'Relaciona cada etiqueta con su imagen correspondiente.'));
    const introButtonText = tr(String(s?.introButtonText || s?.intro?.buttonText || 'Empezar'));
    const autoAdvanceMs = Math.max(500, Number(s?.autoAdvanceMs ?? 1600));
    const shuffleLabels = s?.shuffleLabels !== false;

    const byId = new Map(items.map((item) => [item.id, item]));
    const targetRefs = new Map();
    const labelRefs = new Map();
    const placedTargets = new Map();

    let completed = false;
    let advanceTimer = null;
    let modalState = null;
    let activeDrag = null;
    let htmlDragLabelId = null;
    let hintInterval = null;
    const hintReadyAt = Date.now() + HINT_DELAY_MS;

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

    const shell = document.createElement('div');
    shell.className = 'matchdrop-shell';

    const head = document.createElement('div');
    head.className = 'matchdrop-head';
    const title = document.createElement('h2');
    title.className = 'matchdrop-title';
    title.textContent = titleText;
    const progress = document.createElement('div');
    progress.className = 'matchdrop-progress';
    head.appendChild(title);
    head.appendChild(progress);

    const instructions = document.createElement('p');
    instructions.className = 'matchdrop-instructions';
    instructions.textContent = tr('Arrastra cada etiqueta hasta la imagen correcta.');

    const board = document.createElement('div');
    board.className = 'matchdrop-board';

    const targetsColumn = document.createElement('div');
    targetsColumn.className = 'matchdrop-column matchdrop-column--targets';
    const targetsTitle = document.createElement('div');
    targetsTitle.className = 'matchdrop-column-title';
    targetsTitle.textContent = tr('Imagenes');
    const targetsGrid = document.createElement('div');
    targetsGrid.className = 'matchdrop-targets-grid';
    targetsColumn.appendChild(targetsTitle);
    targetsColumn.appendChild(targetsGrid);

    const labelsColumn = document.createElement('div');
    labelsColumn.className = 'matchdrop-column matchdrop-column--labels';
    const labelsTitle = document.createElement('div');
    labelsTitle.className = 'matchdrop-column-title';
    labelsTitle.textContent = tr('Etiquetas');
    const labelBank = document.createElement('div');
    labelBank.className = 'matchdrop-bank';
    const labelHint = document.createElement('div');
    labelHint.className = 'matchdrop-label-hint';
    labelHint.textContent = tr('Arrastra para seleccionar');
    labelsColumn.appendChild(labelsTitle);
    labelsColumn.appendChild(labelBank);
    labelsColumn.appendChild(labelHint);

    board.appendChild(targetsColumn);
    board.appendChild(labelsColumn);

    const actions = document.createElement('div');
    actions.className = 'matchdrop-actions';
    const hintBtn = document.createElement('button');
    hintBtn.type = 'button';
    hintBtn.className = 'matchdrop-btn secondary';
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'matchdrop-btn secondary';
    resetBtn.textContent = tr('Reiniciar actividad');
    const feedback = document.createElement('div');
    feedback.className = 'matchdrop-feedback';
    actions.appendChild(hintBtn);
    actions.appendChild(resetBtn);
    actions.appendChild(feedback);

    shell.appendChild(head);
    shell.appendChild(instructions);
    shell.appendChild(board);
    shell.appendChild(actions);
    root.appendChild(shell);

    function setFeedback(type, text) {
      feedback.className = 'matchdrop-feedback' + (type ? ` ${type}` : '');
      feedback.textContent = text || '';
    }

    function updateProgress() {
      progress.textContent = `${tr('Imagenes')} ${placedTargets.size} / ${items.length}`;
    }

    function goNextSlide() {
      if (completed) return;
      completed = true;
      if (window.SlideActions && typeof window.SlideActions.next === 'function') {
        window.SlideActions.next();
      }
    }

    function clearHover() {
      targetRefs.forEach((refs) => refs.card.classList.remove('is-hover'));
    }

    function renderTargetState(targetId, labelText, state) {
      const refs = targetRefs.get(targetId);
      if (!refs) return;
      refs.card.classList.remove('is-correct', 'is-wrong');
      if (state === 'correct') refs.card.classList.add('is-correct');
      if (state === 'wrong') refs.card.classList.add('is-wrong');
      refs.slot.innerHTML = '';
      if (labelText) {
        const pill = document.createElement('div');
        pill.className = 'matchdrop-slot-pill';
        pill.textContent = labelText;
        refs.slot.appendChild(pill);
      } else {
        refs.slot.textContent = tr('Suelta aqui');
      }
    }

    function clearModal() {
      if (!modalState) return;
      const state = modalState;
      modalState = null;
      state.wrap.remove();
      if (typeof state.onClose === 'function') state.onClose();
    }

    function openModal(isCorrect, text, onClose) {
      clearModal();
      const wrap = document.createElement('div');
      wrap.className = 'matchdrop-modal';
      const card = document.createElement('div');
      card.className = 'matchdrop-modal-card ' + (isCorrect ? 'is-correct' : 'is-wrong');
      const h = document.createElement('h3');
      h.className = 'matchdrop-modal-title';
      h.textContent = tr(isCorrect ? 'Bien hecho' : 'Revisa este intento');
      const p = document.createElement('p');
      p.className = 'matchdrop-modal-text';
      p.textContent = text;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'matchdrop-btn primary';
      btn.textContent = tr('Cerrar');
      btn.addEventListener('click', clearModal);
      wrap.addEventListener('click', (ev) => {
        if (ev.target === wrap) clearModal();
      });
      card.appendChild(h);
      card.appendChild(p);
      card.appendChild(btn);
      wrap.appendChild(card);
      root.appendChild(wrap);
      modalState = { wrap, onClose };
    }

    function maybeComplete() {
      updateProgress();
      if (placedTargets.size !== items.length) return;
      setFeedback('ok', tr('Has completado correctamente todas las relaciones.'));
      launchConfetti(root);
      if (advanceTimer) clearTimeout(advanceTimer);
      advanceTimer = setTimeout(() => {
        if (!root.isConnected) return;
        goNextSlide();
      }, autoAdvanceMs);
    }

    function applyHintPlacement() {
      const targetItem = items.find((item) => !placedTargets.has(item.id));
      if (!targetItem) return;
      const btn = labelRefs.get(targetItem.id);
      placedTargets.set(targetItem.id, targetItem.id);
      if (btn) {
        btn.classList.add('is-placed');
        btn.disabled = true;
      }
      renderTargetState(targetItem.id, targetItem.text, 'correct');
      updateBankEmptyState();
      setFeedback('info', targetItem.feedbackCorrect);
      maybeComplete();
    }

    function updateBankEmptyState() {
      const hasVisible = Array.from(labelRefs.values()).some((btn) => !btn.classList.contains('is-placed'));
      let empty = labelsColumn.querySelector('.matchdrop-empty-bank');
      if (hasVisible) {
        if (empty) empty.remove();
        return;
      }
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'matchdrop-empty-bank';
        empty.textContent = tr('Has completado correctamente todas las relaciones.');
        labelsColumn.appendChild(empty);
      }
    }

    function findDropTargetAt(x, y) {
      const node = document.elementFromPoint(x, y);
      const zone = node && node.closest ? node.closest('.matchdrop-dropzone[data-target-id]') : null;
      if (!zone) return null;
      const targetId = zone.dataset.targetId;
      if (!targetId || placedTargets.has(targetId)) return null;
      return targetId;
    }

    function clearDrag() {
      clearHover();
      if (!activeDrag) return;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      activeDrag.sourceBtn.classList.remove('is-dragging');
      activeDrag.ghost.remove();
      activeDrag = null;
    }

    function clearHtmlDrag() {
      clearHover();
      if (!htmlDragLabelId) return;
      const btn = labelRefs.get(htmlDragLabelId);
      if (btn) btn.classList.remove('is-dragging');
      htmlDragLabelId = null;
    }

    function onPointerMove(ev) {
      if (!activeDrag) return;
      activeDrag.ghost.style.transform = `translate(${Math.round(ev.clientX + 12)}px, ${Math.round(ev.clientY + 12)}px)`;
      const targetId = findDropTargetAt(ev.clientX, ev.clientY);
      if (targetId === activeDrag.hoverId) return;
      clearHover();
      activeDrag.hoverId = targetId;
      if (targetId && targetRefs.has(targetId)) {
        targetRefs.get(targetId).card.classList.add('is-hover');
      }
    }

    function resolveIncorrectFeedback(targetItem, labelId) {
      const custom = targetItem.feedbackIncorrectByLabel;
      if (custom && typeof custom[labelId] === 'string' && custom[labelId].trim()) {
        return custom[labelId].trim();
      }
      return targetItem.feedbackIncorrect;
    }

    function handleDrop(labelId, targetId) {
      const targetItem = byId.get(targetId);
      const labelItem = byId.get(labelId);
      if (!targetItem || !labelItem || placedTargets.has(targetId)) return;

      const isCorrect = labelId === targetId;
      if (isCorrect) {
        const btn = labelRefs.get(labelId);
        placedTargets.set(targetId, labelId);
        if (btn) {
          btn.classList.add('is-placed');
          btn.disabled = true;
        }
        renderTargetState(targetId, labelItem.text, 'correct');
        setFeedback('', '');
        updateBankEmptyState();
        openModal(true, targetItem.feedbackCorrect, maybeComplete);
        return;
      }

      renderTargetState(targetId, labelItem.text, 'wrong');
      setFeedback('err', tr('Aun hay relaciones incorrectas. Intentalo de nuevo.'));
      openModal(false, resolveIncorrectFeedback(targetItem, labelId), () => {
        renderTargetState(targetId, '', '');
      });
    }

    function onPointerUp() {
      if (!activeDrag) return;
      const drag = activeDrag;
      const targetId = drag.hoverId;
      clearDrag();
      if (targetId) handleDrop(drag.labelId, targetId);
    }

    function onPointerCancel() {
      clearDrag();
    }

    function startDrag(labelId, btn, ev) {
      clearDrag();
      const ghost = document.createElement('div');
      ghost.className = 'matchdrop-ghost';
      ghost.textContent = btn.textContent || '';
      document.body.appendChild(ghost);
      btn.classList.add('is-dragging');
      activeDrag = {
        labelId,
        sourceBtn: btn,
        ghost,
        hoverId: null
      };
      ghost.style.transform = `translate(${Math.round(ev.clientX + 12)}px, ${Math.round(ev.clientY + 12)}px)`;
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerCancel);
    }

    function createTarget(item) {
      const card = document.createElement('div');
      card.className = 'matchdrop-target';

      const dropzone = document.createElement('div');
      dropzone.className = 'matchdrop-dropzone';
      dropzone.dataset.targetId = item.id;
      dropzone.addEventListener('dragover', (ev) => {
        if (completed || modalState || placedTargets.has(item.id)) return;
        ev.preventDefault();
        card.classList.add('is-hover');
      });
      dropzone.addEventListener('dragenter', (ev) => {
        if (completed || modalState || placedTargets.has(item.id)) return;
        ev.preventDefault();
        card.classList.add('is-hover');
      });
      dropzone.addEventListener('dragleave', (ev) => {
        if (!dropzone.contains(ev.relatedTarget)) {
          card.classList.remove('is-hover');
        }
      });
      dropzone.addEventListener('drop', (ev) => {
        if (completed || modalState || placedTargets.has(item.id)) return;
        ev.preventDefault();
        const droppedId = htmlDragLabelId || String(ev.dataTransfer?.getData('text/plain') || '').trim();
        clearHtmlDrag();
        if (droppedId) handleDrop(droppedId, item.id);
      });

      const image = document.createElement('div');
      image.className = 'matchdrop-image';
      if (item.image) {
        image.classList.add('has-image');
        image.style.backgroundImage = `url("${item.image.replace(/"/g, '&quot;')}")`;
      } else {
        image.textContent = 'Imagen';
      }

      const meta = document.createElement('div');
      meta.className = 'matchdrop-meta';
      const slot = document.createElement('div');
      slot.className = 'matchdrop-slot';
      slot.textContent = tr('Suelta aqui');

      if (item.caption) {
        const caption = document.createElement('div');
        caption.className = 'matchdrop-caption';
        caption.textContent = item.caption;
        meta.appendChild(caption);
      }
      meta.appendChild(slot);
      dropzone.appendChild(image);
      dropzone.appendChild(meta);
      card.appendChild(dropzone);

      targetRefs.set(item.id, { card, dropzone, slot });
      targetsGrid.appendChild(card);
    }

    function buildLabels() {
      labelBank.innerHTML = '';
      labelRefs.clear();
      const ordered = shuffleLabels ? shuffled(items) : items.slice();
      ordered.forEach((item) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'matchdrop-label';
        btn.dataset.labelId = item.id;
        btn.draggable = true;
        btn.setAttribute('aria-label', `${item.text}. ${tr('Arrastra para seleccionar')}`);
        btn.textContent = item.text;
        btn.addEventListener('pointerdown', (ev) => {
          if (completed || modalState || btn.classList.contains('is-placed')) return;
          ev.preventDefault();
          startDrag(item.id, btn, ev);
        });
        btn.addEventListener('dragstart', (ev) => {
          if (completed || modalState || btn.classList.contains('is-placed')) {
            ev.preventDefault();
            return;
          }
          htmlDragLabelId = item.id;
          btn.classList.add('is-dragging');
          if (ev.dataTransfer) {
            ev.dataTransfer.effectAllowed = 'move';
            ev.dataTransfer.setData('text/plain', item.id);
          }
        });
        btn.addEventListener('dragend', () => {
          clearHtmlDrag();
        });
        labelRefs.set(item.id, btn);
        labelBank.appendChild(btn);
      });
    }

    function resetBoard() {
      if (advanceTimer) clearTimeout(advanceTimer);
      completed = false;
      setFeedback('', '');
      clearDrag();
      clearHtmlDrag();
      clearModal();
      placedTargets.clear();
      targetRefs.forEach((refs, targetId) => {
        refs.card.classList.remove('is-correct', 'is-wrong', 'is-hover');
        renderTargetState(targetId, '', '');
      });
      buildLabels();
      updateBankEmptyState();
      updateProgress();
    }

    items.forEach(createTarget);
    buildLabels();
    updateBankEmptyState();
    updateProgress();
    updateHintButton();
    hintInterval = setInterval(updateHintButton, 1000);

    hintBtn.addEventListener('click', () => {
      if (hintBtn.disabled || completed || modalState) return;
      applyHintPlacement();
    });

    resetBtn.addEventListener('click', resetBoard);

    const intro = document.createElement('div');
    intro.className = 'matchdrop-intro';
    const introCard = document.createElement('div');
    introCard.className = 'matchdrop-intro-card';
    const introH = document.createElement('h3');
    introH.className = 'matchdrop-intro-title';
    introH.textContent = introTitle;
    const introP = document.createElement('p');
    introP.className = 'matchdrop-intro-text';
    introP.textContent = introText;
    const introBtn = document.createElement('button');
    introBtn.type = 'button';
    introBtn.className = 'matchdrop-btn primary';
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
