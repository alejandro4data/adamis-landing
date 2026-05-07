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
      if (stored.startsWith('fr')) return 'fr';
      if (stored.startsWith('de')) return 'de';
      if (stored.startsWith('it')) return 'it';
      if (stored.startsWith('pt')) return 'pt';
      if (stored.startsWith('ca-es-valencia') || stored.startsWith('ca-valencia') || stored.startsWith('val') || stored.startsWith('va')) return 'va';
      if (stored.startsWith('ca')) return 'ca';
      if (stored.startsWith('gl')) return 'gl';
      if (stored.startsWith('eu') || stored.startsWith('baq') || stored.startsWith('eus')) return 'eu';
    } catch (_) {}
    return 'es';
  };

  const STYLE_ID = 'mini-seleccionar-frases-style';
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
      .tpl--miniact-seleccionar-frases{
        position:relative;
        padding:28px 20px 90px;
        display:flex;
        flex-direction:column;
        gap:16px;
        align-items:center;
        justify-content:center;
        min-height:70vh;
      }
      .phrasepick-shell{
        width:min(1120px, 96vw);
        background:
          radial-gradient(circle at top, rgba(56,189,248,.14), transparent 34%),
          linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        border:1px solid #e5e7eb;
        border-radius:26px;
        padding:24px 24px 22px;
        box-shadow:0 26px 60px rgba(15,23,42,.12);
      }
      .phrasepick-head{
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:16px;
        margin-bottom:10px;
      }
      .phrasepick-title{
        margin:0;
        font-size:28px;
        font-weight:900;
        color:#0f172a;
      }
      .phrasepick-progress{
        font-size:12px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#475569;
      }
      .phrasepick-instructions{
        margin:0 0 18px 0;
        font-size:14px;
        color:#334155;
      }
      .phrasepick-list{
        display:flex;
        flex-direction:column;
        gap:16px;
      }
      .phrasepick-row{
        display:grid;
        grid-template-columns:minmax(0, 1.15fr) 80px minmax(260px, .85fr);
        align-items:center;
        gap:16px;
      }
      .phrasepick-button{
        appearance:none;
        width:100%;
        border:2px solid #0f172a;
        border-radius:18px;
        background:#ffffff;
        color:#0f172a;
        padding:18px 20px;
        font-size:17px;
        font-weight:800;
        line-height:1.35;
        text-align:left;
        cursor:pointer;
        box-shadow:0 14px 30px rgba(15,23,42,.08);
        transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease, background-color .22s ease, color .22s ease;
      }
      .phrasepick-button:hover{
        transform:translateY(-1px);
        box-shadow:0 18px 34px rgba(15,23,42,.11);
      }
      .phrasepick-button:disabled{
        cursor:default;
      }
      .phrasepick-row.is-selected .phrasepick-button{
        border-color:#2563eb;
        background:#eff6ff;
        color:#1d4ed8;
        box-shadow:0 0 0 5px rgba(37,99,235,.14), 0 18px 34px rgba(15,23,42,.11);
      }
      .phrasepick-row.is-correct .phrasepick-button{
        background:linear-gradient(180deg,#dcfce7 0%, #bbf7d0 100%);
        border-color:#16a34a;
        color:#166534;
      }
      .phrasepick-row.is-wrong .phrasepick-button{
        background:linear-gradient(180deg,#fee2e2 0%, #fecaca 100%);
        border-color:#dc2626;
        color:#991b1b;
      }
      .phrasepick-arrow{
        position:relative;
        height:24px;
        opacity:0;
        transform:translateX(-14px) scaleX(.72);
        transform-origin:left center;
        transition:opacity .26s ease, transform .36s cubic-bezier(.2,.75,.2,1);
      }
      .phrasepick-arrow::before{
        content:'';
        position:absolute;
        left:0;
        right:20px;
        top:50%;
        height:4px;
        margin-top:-2px;
        border-radius:999px;
        background:#0f172a;
      }
      .phrasepick-arrow::after{
        content:'';
        position:absolute;
        right:0;
        top:50%;
        width:18px;
        height:18px;
        margin-top:-9px;
        border-top:4px solid #0f172a;
        border-right:4px solid #0f172a;
        transform:rotate(45deg);
      }
      .phrasepick-explanation{
        min-height:92px;
        border:2px solid #cbd5e1;
        border-radius:18px;
        background:#ffffff;
        padding:14px 16px;
        box-shadow:0 12px 28px rgba(15,23,42,.08);
        opacity:0;
        transform:translateX(-18px) scale(.96);
        transition:opacity .26s ease, transform .36s cubic-bezier(.2,.75,.2,1), border-color .22s ease, background-color .22s ease;
      }
      .phrasepick-row.is-correct .phrasepick-explanation{
        border-color:#16a34a;
        background:#f0fdf4;
      }
      .phrasepick-row.is-wrong .phrasepick-explanation{
        border-color:#dc2626;
        background:#fef2f2;
      }
      .phrasepick-row.is-revealed .phrasepick-arrow,
      .phrasepick-row.is-revealed .phrasepick-explanation{
        opacity:1;
        transform:translateX(0) scale(1);
      }
      .phrasepick-explanation-label{
        margin-bottom:6px;
        font-size:11px;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#64748b;
      }
      .phrasepick-explanation-text{
        font-size:14px;
        line-height:1.45;
        color:#0f172a;
      }
      .phrasepick-actions{
        display:flex;
        gap:12px;
        align-items:center;
        margin-top:18px;
      }
      .phrasepick-btn{
        appearance:none;
        border:none;
        border-radius:12px;
        padding:11px 15px;
        font-weight:800;
        cursor:pointer;
      }
      .phrasepick-btn.secondary{
        background:#e2e8f0;
        color:#0f172a;
      }
      .phrasepick-btn.primary{
        background:#111827;
        color:#ffffff;
        box-shadow:0 12px 26px rgba(17,24,39,.25);
      }
      .phrasepick-btn.continue{
        background:linear-gradient(180deg,#22c55e 0%, #15803d 100%);
        color:#ffffff;
        box-shadow:0 14px 30px rgba(21,128,61,.28);
        transform:translateY(0);
        transition:transform .18s ease, box-shadow .18s ease;
      }
      .phrasepick-btn.continue:hover{
        transform:translateY(-1px);
        box-shadow:0 18px 36px rgba(21,128,61,.34);
      }
      .phrasepick-btn.is-hidden{
        display:none;
      }
      .phrasepick-feedback{
        min-height:20px;
        font-size:14px;
        font-weight:800;
      }
      .phrasepick-feedback.ok{ color:#16a34a; }
      .phrasepick-feedback.err{ color:#dc2626; }
      .phrasepick-feedback.info{ color:#2563eb; }
      .phrasepick-intro{
        position:fixed;
        inset:0;
        background:rgba(15,23,42,.45);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:5;
        padding:24px;
      }
      .phrasepick-intro-card{
        width:min(520px, 92vw);
        background:#ffffff;
        border-radius:20px;
        padding:20px 22px;
        box-shadow:0 24px 60px rgba(0,0,0,.28);
      }
      .phrasepick-intro-title{
        margin:0 0 6px 0;
        font-size:20px;
        font-weight:800;
        color:#0f172a;
      }
      .phrasepick-intro-text{
        margin:0 0 16px 0;
        font-size:14px;
        color:#334155;
      }
      .phrasepick-confetti{
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:3;
      }
      @media (max-width: 860px){
        .phrasepick-row{
          grid-template-columns:1fr;
          gap:10px;
        }
        .phrasepick-arrow{
          width:64px;
          justify-self:center;
        }
        .phrasepick-explanation{
          min-height:auto;
        }
      }
    `;
    document.head.appendChild(css);
  }

  function normalizePhrases(input) {
    const list = Array.isArray(input) ? input : [];
    return list.map((raw, idx) => {
      const text = String(raw?.text ?? raw?.phrase ?? raw?.frase ?? raw?.label ?? '').trim();
      if (!text) return null;
      return {
        id: String(raw?.id ?? raw?.key ?? idx),
        text,
        correct: !!raw?.correct,
        feedbackCorrect: String(
          raw?.feedbackCorrect ??
          raw?.explanationCorrect ??
          raw?.explicacionCorrecta ??
          raw?.porqueSi ??
          'Correcta.'
        ).trim(),
        feedbackIncorrect: String(
          raw?.feedbackIncorrect ??
          raw?.explanationIncorrect ??
          raw?.explicacionIncorrecta ??
          raw?.porqueNo ??
          'Incorrecta.'
        ).trim()
      };
    }).filter(Boolean);
  }

  function launchConfetti(root) {
    const cv = document.createElement('canvas');
    cv.className = 'phrasepick-confetti';
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

    const colors = ['#38bdf8', '#0f172a', '#16a34a', '#ef4444', '#f59e0b'];
    const particles = [];
    for (let i = 0; i < 90; i++) {
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

  SlideRendererRegistry.register('miniactividad-seleccionar-frases', function (s, root) {
    ensureStyles();
    root.classList.add('tpl--miniact-seleccionar-frases');

    const activeLang = lang();
    const sourcePhrases = activeLang === 'en'
      ? (s?.phrases_en ?? s?.frases_en ?? s?.phrases ?? s?.frases)
      : activeLang === 'fr'
        ? (s?.phrases_fr ?? s?.frases_fr ?? s?.phrases ?? s?.frases)
        : activeLang === 'de'
          ? (s?.phrases_de ?? s?.frases_de ?? s?.phrases ?? s?.frases)
          : activeLang === 'it'
            ? (s?.phrases_it ?? s?.frases_it ?? s?.phrases ?? s?.frases)
            : activeLang === 'pt'
              ? (s?.phrases_pt ?? s?.frases_pt ?? s?.phrases ?? s?.frases)
      : (s?.phrases ?? s?.frases);
    const phrases = normalizePhrases(sourcePhrases);

    if (!phrases.length) {
      root.innerHTML = `<div class="empty-state__text">${tr('No hay frases para seleccionar.')}</div>`;
      return { suppressRootClick: true, noLock: true };
    }

    const titleText = tr(String(s?.title || s?.titulo || 'Miniactividad'));
    const introTitle = tr(String(s?.introTitle || s?.intro?.title || 'Antes de empezar'));
    const introText = tr(String(s?.introText || s?.intro?.text || 'Selecciona las frases adecuadas y revisa por que cada una es correcta o incorrecta.'));
    const introButtonText = tr(String(s?.introButtonText || s?.intro?.buttonText || 'Empezar'));
    const checkMode = s?.checkMode === true || s?.requireCheck === true;
    const submitText = tr(String(s?.submitText || s?.checkText || 'Comprobar'));
    const autoAdvanceMs = Math.max(500, Number(s?.autoAdvanceMs ?? 1600));
    const totalCorrect = phrases.filter((item) => item.correct).length;

    const shell = document.createElement('div');
    shell.className = 'phrasepick-shell';

    const head = document.createElement('div');
    head.className = 'phrasepick-head';
    const title = document.createElement('h2');
    title.className = 'phrasepick-title';
    title.textContent = titleText;
    const progress = document.createElement('div');
    progress.className = 'phrasepick-progress';
    head.appendChild(title);
    head.appendChild(progress);

    const instructions = document.createElement('p');
    instructions.className = 'phrasepick-instructions';
    instructions.textContent = checkMode
      ? tr('Selecciona la frase que elegirias. Cuando termines, pulsa Comprobar para ver el feedback.')
      : tr('Pulsa cada frase para descubrir si es una opcion correcta o incorrecta.');

    const list = document.createElement('div');
    list.className = 'phrasepick-list';

    const actions = document.createElement('div');
    actions.className = 'phrasepick-actions';
    const hintBtn = document.createElement('button');
    hintBtn.type = 'button';
    hintBtn.className = 'phrasepick-btn secondary';
    const checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'phrasepick-btn primary';
    checkBtn.textContent = submitText;
    const continueBtn = document.createElement('button');
    continueBtn.type = 'button';
    continueBtn.className = 'phrasepick-btn continue is-hidden';
    continueBtn.textContent = tr('Continuar');
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'phrasepick-btn secondary';
    resetBtn.textContent = tr('Reiniciar frases');
    const feedback = document.createElement('div');
    feedback.className = 'phrasepick-feedback';
    actions.appendChild(hintBtn);
    if (checkMode) actions.appendChild(checkBtn);
    if (checkMode) actions.appendChild(continueBtn);
    actions.appendChild(resetBtn);
    actions.appendChild(feedback);

    shell.appendChild(head);
    shell.appendChild(instructions);
    shell.appendChild(list);
    shell.appendChild(actions);
    root.appendChild(shell);

    let revealedCount = 0;
    let foundCorrect = 0;
    let locked = false;
    let advanced = false;
    let advanceTimer = null;
    let hintInterval = null;
    let hintReadyAt = Date.now() + HINT_DELAY_MS;
    const phraseButtons = [];
    let selectedId = null;
    let checked = false;

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
      feedback.className = 'phrasepick-feedback' + (type ? ` ${type}` : '');
      feedback.textContent = text || '';
    }

    function updateProgress() {
      progress.textContent = checkMode
        ? (selectedId ? tr('Frase seleccionada') : tr('Elige una frase'))
        : `${tr('Frases')} ${revealedCount} / ${phrases.length}`;
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
      if (revealedCount !== phrases.length) return;

      locked = true;
      if (foundCorrect === totalCorrect) {
        setFeedback('ok', tr('Has descubierto todas las frases correctas.'));
      } else {
        setFeedback('ok', tr('Has revisado todas las frases.'));
      }
      launchConfetti(root);
      if (advanceTimer) clearTimeout(advanceTimer);
      advanceTimer = setTimeout(() => {
        if (!root.isConnected) return;
        goNextSlide();
      }, autoAdvanceMs);
    }

    function revealRow(row, btn, item) {
      if (locked || row.classList.contains('is-revealed')) return false;
      row.classList.add('is-revealed', item.correct ? 'is-correct' : 'is-wrong');
      btn.disabled = true;
      revealedCount += 1;
      if (item.correct) foundCorrect += 1;
      checkDone();
      return true;
    }

    function selectPhrase(row, btn, item) {
      if (!checkMode || locked || checked) return;
      selectedId = item.id;
      phraseButtons.forEach((entry) => {
        entry.row.classList.toggle('is-selected', entry.item.id === item.id);
        entry.btn.setAttribute('aria-pressed', entry.item.id === item.id ? 'true' : 'false');
      });
      setFeedback('', '');
      updateProgress();
    }

    function revealAllAfterCheck() {
      if (!checkMode || checked || locked) return;
      const selected = phraseButtons.find((entry) => entry.item.id === selectedId);
      if (!selected) {
        setFeedback('info', tr('Selecciona una frase antes de comprobar.'));
        return;
      }

      checked = true;
      locked = true;
      phraseButtons.forEach((entry) => {
        entry.row.classList.remove('is-selected', 'is-revealed', 'is-correct', 'is-wrong');
        entry.row.classList.add('is-revealed', entry.item.correct ? 'is-correct' : 'is-wrong');
        entry.btn.disabled = true;
        entry.btn.setAttribute('aria-pressed', entry.item.id === selectedId ? 'true' : 'false');
      });
      revealedCount = phrases.length;
      foundCorrect = selected.item.correct ? 1 : 0;
      setFeedback(selected.item.correct ? 'ok' : 'err', selected.item.correct ? selected.item.feedbackCorrect : selected.item.feedbackIncorrect);
      if (selected.item.correct) launchConfetti(root);
      hintBtn.disabled = true;
      checkBtn.disabled = true;
      checkBtn.classList.add('is-hidden');
      continueBtn.classList.remove('is-hidden');
      continueBtn.focus();
      updateProgress();
    }

    function makeRow(item) {
      const row = document.createElement('div');
      row.className = 'phrasepick-row';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'phrasepick-button';
      btn.setAttribute('aria-label', `${item.text}. ${tr(checkMode ? 'Pulsa para seleccionar' : 'Pulsa para revisar')}`);
      if (checkMode) btn.setAttribute('aria-pressed', 'false');
      btn.textContent = item.text;

      const arrow = document.createElement('div');
      arrow.className = 'phrasepick-arrow';
      arrow.setAttribute('aria-hidden', 'true');

      const explanation = document.createElement('div');
      explanation.className = 'phrasepick-explanation';
      const explanationLabel = document.createElement('div');
      explanationLabel.className = 'phrasepick-explanation-label';
      explanationLabel.textContent = tr('Explicacion');
      const explanationText = document.createElement('div');
      explanationText.className = 'phrasepick-explanation-text';
      explanationText.textContent = item.correct ? item.feedbackCorrect : item.feedbackIncorrect;
      explanation.appendChild(explanationLabel);
      explanation.appendChild(explanationText);

      btn.addEventListener('click', () => {
        if (checkMode) selectPhrase(row, btn, item);
        else revealRow(row, btn, item);
      });

      row.appendChild(btn);
      row.appendChild(arrow);
      row.appendChild(explanation);
      phraseButtons.push({ row, btn, item });
      return row;
    }

    phrases.forEach((item) => list.appendChild(makeRow(item)));
    updateProgress();
    startHintCooldown();

    hintBtn.addEventListener('click', () => {
      if (hintBtn.disabled || locked) return;
      let usedHint = false;
      if (checkMode) {
        if (checked) return;
        const correct = phraseButtons.find((entry) => entry.item.correct);
        if (!correct) return;
        selectPhrase(correct.row, correct.btn, correct.item);
        setFeedback('info', tr('Se ha seleccionado una frase adecuada.'));
        usedHint = true;
      } else {
        const preferred = phraseButtons.find((entry) => entry.item.correct && !entry.row.classList.contains('is-revealed'))
          || phraseButtons.find((entry) => !entry.row.classList.contains('is-revealed'));
        if (!preferred) return;
        revealRow(preferred.row, preferred.btn, preferred.item);
        if (!locked) {
          setFeedback('info', preferred.item.correct
            ? preferred.item.feedbackCorrect
            : preferred.item.feedbackIncorrect);
        }
        usedHint = true;
      }
      if (usedHint) startHintCooldown();
    });

    checkBtn.addEventListener('click', () => {
      revealAllAfterCheck();
    });

    continueBtn.addEventListener('click', () => {
      if (!checkMode || !checked) return;
      goNextSlide();
    });

    resetBtn.addEventListener('click', () => {
      if (advanceTimer) clearTimeout(advanceTimer);
      locked = false;
      advanced = false;
      checked = false;
      selectedId = null;
      revealedCount = 0;
      foundCorrect = 0;
      setFeedback('', '');
      list.querySelectorAll('.phrasepick-row').forEach((row) => {
        row.classList.remove('is-revealed', 'is-correct', 'is-wrong', 'is-selected');
      });
      phraseButtons.forEach((entry) => {
        entry.btn.disabled = false;
        if (checkMode) entry.btn.setAttribute('aria-pressed', 'false');
      });
      checkBtn.disabled = false;
      checkBtn.classList.remove('is-hidden');
      continueBtn.classList.add('is-hidden');
      updateProgress();
      startHintCooldown();
    });

    const intro = document.createElement('div');
    intro.className = 'phrasepick-intro';
    const introCard = document.createElement('div');
    introCard.className = 'phrasepick-intro-card';
    const introH = document.createElement('h3');
    introH.className = 'phrasepick-intro-title';
    introH.textContent = introTitle;
    const introP = document.createElement('p');
    introP.className = 'phrasepick-intro-text';
    introP.textContent = introText;
    const introBtn = document.createElement('button');
    introBtn.type = 'button';
    introBtn.className = 'phrasepick-btn primary';
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
