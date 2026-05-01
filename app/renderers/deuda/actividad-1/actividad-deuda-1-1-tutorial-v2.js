// =====================================================
// actividad-deuda-1-1-tutorial-v2.js
// Tutorial v2: una sola slide con 4 pasos guiados
// =====================================================

(function ensureTutorialV2Styles(){
  const ID = 'deuda-11t-v2-style';
  if (document.getElementById(ID)) return;
  const css = document.createElement('style');
  css.id = ID;
  css.textContent = `
    .tpl--actividad-deuda[data-render="1-1t-v2"]{ position:relative; }

    .tut-overlay{
      position:fixed; inset:0;
      background:rgba(15,23,42,.48);
      backdrop-filter:saturate(1.08) blur(2px) brightness(.95);
      -webkit-backdrop-filter:saturate(1.08) blur(2px) brightness(.95);
      z-index:11000;
    }
    .tut-ontop{ position:relative !important; z-index:11010 !important; }

    .tut-glow{
      outline:2px solid #5eead4;
      box-shadow:0 0 0 6px rgba(94,234,212,.2), 0 10px 26px rgba(0,0,0,.2);
      border-radius:14px;
      animation:tutPulse 1.4s ease-in-out infinite;
    }
    .tut-row-glow{
      outline:2px solid #22d3ee;
      box-shadow:0 0 0 6px rgba(34,211,238,.18), 0 8px 20px rgba(0,0,0,.18);
      border-radius:10px;
      animation:tutPulse 1.4s ease-in-out infinite;
    }
    @keyframes tutPulse{
      0%{ box-shadow:0 0 0 6px rgba(94,234,212,.2), 0 10px 26px rgba(0,0,0,.2); }
      50%{ box-shadow:0 0 0 10px rgba(94,234,212,.12), 0 14px 32px rgba(0,0,0,.22); }
      100%{ box-shadow:0 0 0 6px rgba(94,234,212,.2), 0 10px 26px rgba(0,0,0,.2); }
    }

    .tut-center-wrap{
      width:100%;
      display:flex;
      justify-content:center;
      align-items:center;
    }
    .tut-center-text{
      max-width:min(640px, 80vw);
      padding:20px 24px;
      border-radius:18px;
      background:rgba(17,24,39,.88);
      color:#ecfeff;
      text-align:center;
      font-weight:800;
      font-size:clamp(22px, 3.2vw, 36px);
      line-height:1.2;
      box-shadow:0 18px 40px rgba(0,0,0,.28);
      pointer-events:none;
    }

    .coins-badge.tut-coin-pulse{ animation: coinPulse .5s ease-in-out 1; }
    @keyframes coinPulse{ 0%{transform:scale(1)} 40%{transform:scale(1.07)} 100%{transform:scale(1)} }
    .tut-saldo-flyout{
      position:absolute; right:-6px; top:-10px; font-weight:800; font-size:14px;
      background:#111827; color:#ecfeff; padding:6px 8px; border-radius:10px;
      opacity:0; transform:translateY(6px); pointer-events:none;
    }
    .tut-saldo-flyout.show{ opacity:1; transform:translateY(0); transition:opacity .25s ease, transform .25s ease; }

    /* Burbuja delta (saldo e impaciencia) */
    .tpl--actividad-deuda[data-render="1-1t-v2"] .coins-wrap{ position:relative; }
    .tpl--actividad-deuda[data-render="1-1t-v2"] .impatience-wrap{ position:relative; }
    .tpl--actividad-deuda[data-render="1-1t-v2"] .coins-wrap .coins-float{
      position:absolute;
      top:-6px;
      left:50%;
      transform: translate(-50%, 0) scale(.96);
      padding:10px 16px;
      border-radius:999px;
      background: var(--coins-float-bg, linear-gradient(135deg, #22c55e, #16a1b4));
      color:#fff;
      font-weight:900;
      font-size:16px;
      letter-spacing:.2px;
      box-shadow:0 12px 22px rgba(0,0,0,.2);
      z-index:11020;
      opacity:0;
      pointer-events:none;
    }
    .tpl--actividad-deuda[data-render="1-1t-v2"] .coins-wrap .coins-float.coins-float--neg{
      --coins-float-bg: linear-gradient(135deg, #ef4444, #f97316);
    }
    .tpl--actividad-deuda[data-render="1-1t-v2"] .coins-wrap .coins-float.is-on{
      animation: deudaCoinsFloat 1.45s ease-out forwards;
    }
    .tpl--actividad-deuda[data-render="1-1t-v2"] .impatience-float{
      position:absolute;
      top:-8px;
      right:-6px;
      width:48px;
      height:48px;
      border-radius:999px;
      background: var(--imp-float-bg, #22c55e);
      color:#fff;
      font-weight:900;
      font-size:14px;
      letter-spacing:.2px;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:0 12px 22px rgba(0,0,0,.2);
      opacity:0;
      pointer-events:none;
      transform: translate(0, 0) scale(.96);
    }
    .tpl--actividad-deuda[data-render="1-1t-v2"] .impatience-float.is-on{
      animation: deudaImpFloat 1.45s ease-out forwards;
    }
    @keyframes deudaCoinsFloat{
      0%   { transform: translate(-50%, 0) scale(.96); opacity: 0; }
      20%  { transform: translate(-50%, -8px) scale(1.04); opacity: 1; }
      100% { transform: translate(-50%, -40px) scale(1.08); opacity: 0; }
    }
    @keyframes deudaImpFloat{
      0%   { transform: translate(0, 0) scale(.96); opacity: 0; }
      20%  { transform: translate(0, -8px) scale(1.04); opacity: 1; }
      100% { transform: translate(0, -40px) scale(1.08); opacity: 0; }
    }

    .tutorial-modal{ z-index:12000 !important; }
    .tutorial-modal .modal{ z-index:12010 !important; }
    .tutorial-modal .btn-primary,
    .tutorial-modal .btn-secondary{
      border-radius:10px;
      padding:10px 14px;
    }
  `;
  document.head.appendChild(css);
})();

(function ensureDeudaHelpersLite(){
  const H = window.DeudaHelpers || (window.DeudaHelpers = {});
  if (!H.STATUS) H.STATUS = { ACTIVO: 'Activo', IMPAGADO: 'Impagado' };
  if (!H.el){
    H.el = (tag, props = {}, ...children) => {
      const node = document.createElement(tag);
      for (const [k,v] of Object.entries(props || {})) {
        if (k === 'className') node.className = v;
        else if (k === 'dataset') Object.assign(node.dataset, v);
        else if (k in node) node[k] = v;
        else node.setAttribute(k, v);
      }
      for (const ch of children.flat()) {
        if (ch == null) continue;
        node.appendChild(ch.nodeType ? ch : document.createTextNode(String(ch)));
      }
      return node;
    };
  }
  if (!H.txt) H.txt = (s) => document.createTextNode(String(s ?? ''));
  if (!H.setImpatienceBar){
    H.setImpatienceBar = ({ fillEl, capEl, valuePct, capPct }) => {
      const v = Math.min(100, Math.max(0, Number(valuePct||0)));
      const cap = Math.min(100, Math.max(0, Number(capPct||70)));
      fillEl.style.width = v + '%';
      capEl.style.left = cap + '%';
      if (v >= cap) fillEl.classList.add('danger'); else fillEl.classList.remove('danger');
    };
  }
  if (!H.makeSaldoWidget){
    H.makeSaldoWidget = ({ icon = '../assets/icons/coin_ranking.webp' } = {}) => {
      const el = H.el;
      const coins = el('div',{className:'coins-badge'},
        el('span',{className:'coins-badge__num'}, '0'),
        el('img',{className:'coins-badge__icon', alt:'Monedas', src: icon})
      );
      const wrap = el('div',{className:'coins-wrap'}, coins);
      const valueEl = coins.querySelector('.coins-badge__num');
      return { node: wrap, set: (v)=>{ valueEl.textContent = String(Number(v||0)); } };
    };
  }
})();

SlideRendererRegistry.register('actividad-deuda-1-1-tutorial-v2', function (s, root) {
  const H = window.DeudaHelpers || {};
  const el = H.el || ((tag, props = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [k,v] of Object.entries(props || {})) {
      if (k === 'className') node.className = v;
      else if (k === 'dataset') Object.assign(node.dataset, v);
      else if (k in node) node[k] = v;
      else node.setAttribute(k, v);
    }
    for (const ch of children.flat()) {
      if (ch == null) continue;
      node.appendChild(ch.nodeType ? ch : document.createTextNode(String(ch)));
    }
    return node;
  });
  const txt = H.txt || ((s) => document.createTextNode(String(s ?? '')));
  const setImp = H.setImpatienceBar || function({ fillEl, capEl, valuePct, capPct }) {
    const v = Math.min(100, Math.max(0, Number(valuePct||0)));
    const cap = Math.min(100, Math.max(0, Number(capPct||70)));
    fillEl.style.width = v + '%';
    capEl.style.left = cap + '%';
    if (v >= cap) fillEl.classList.add('danger'); else fillEl.classList.remove('danger');
  };

  root.classList.add('tpl--actividad-deuda');
  root.setAttribute('data-render','1-1t-v2');

  const event = s?.event || {};
  const cfg = {
    saldoStart: Number(event.saldoStart ?? 3),
    payCost: Number(event.payCost ?? 2),
    loanCost: Number(event.loanCost ?? 5),
    loanWeeks: Number(event.loanWeeks ?? 2),
    activityWeeks: Number(event.activityWeeks ?? event.weeks ?? 8),
    impatienceStart: Number(event.impatienceStart ?? 0),
    deltaOnPay: Number(event.deltaOnPay ?? -35),
    deltaOnReject: Number(event.deltaOnReject ?? +75),
    capPct: Math.max(0, Math.min(100, Number(event.capPct ?? 60)))
  };
  const holdMs = Number(s?.tutorial?.holdMs ?? 2000);

  const st = {
    saldo: cfg.saldoStart,
    loans: [],
    nextLoanId: 1,
    impatience: cfg.impatienceStart
  };

  const header = el('div',{className:'deuda-header'},
    el('div',{className:'evento-banner'}, txt(s?.text || 'Tutorial de deuda'))
  );
  root.appendChild(header);

  const body = el('div',{className:'deuda-body'});

  // Impaciencia
  const impFill = el('div',{className:'impatience-fill'});
  const impBar  = el('div',{className:'impatience-bar'}, impFill);
  const impCap  = el('div',{className:'impatience-cap'});
  impBar.appendChild(impCap);
  const impWrap = el('div',{className:'impatience-wrap'},
    el('div',{className:'impatience-label'}, txt('Impaciencia')),
    impBar
  );

  // Saldo
  const saldoW = H.makeSaldoWidget ? H.makeSaldoWidget({ icon:'../assets/icons/coin_ranking.webp' }) : null;
  const saldoNode = saldoW ? saldoW.node : el('div',{className:'coins-wrap'}, el('div',{className:'coins-badge'}, txt('0')));
  const saldoBadge = saldoNode.querySelector?.('.coins-badge') || saldoNode;
  if (saldoBadge) saldoBadge.style.position = 'relative';
  if (saldoW?.set) saldoW.set(st.saldo);

  let saldoFlyout = null;
  if (saldoBadge){
    saldoFlyout = document.createElement('div');
    saldoFlyout.className = 'tut-saldo-flyout';
    saldoBadge.appendChild(saldoFlyout);
  }
  const fmtDelta = (n)=>{ const sign = n>0?'+':(n<0?'-':'±'); return `${sign}${Math.abs(n)}`; };
  const saldoFeedback = (text, delta) => {
    if (!saldoBadge || !saldoFlyout) return;
    saldoFlyout.textContent = text;
    saldoFlyout.classList.add('show');
    saldoBadge.classList.add('tut-coin-pulse');
    if (Number.isFinite(delta)) showSaldoBubble(delta);
    setTimeout(()=>{ saldoFlyout.classList.remove('show'); saldoBadge.classList.remove('tut-coin-pulse'); }, 600);
  };

  function showSaldoBubble(delta){
    if (!saldoBadge || !Number.isFinite(delta) || delta === 0) return;
    const bubble = document.createElement('div');
    bubble.className = 'coins-float';
    if (delta < 0) bubble.classList.add('coins-float--neg');
    bubble.textContent = fmtDelta(delta);
    saldoBadge.appendChild(bubble);
    requestAnimationFrame(()=> bubble.classList.add('is-on'));
    setTimeout(()=> bubble.remove(), 1400);
  }

  function showImpBubble(delta){
    if (!impWrap || !Number.isFinite(delta) || delta === 0) return;
    const bubble = document.createElement('div');
    bubble.className = 'impatience-float';
    bubble.textContent = fmtDelta(delta);
    bubble.style.setProperty('--imp-float-bg', delta > 0 ? '#ef4444' : '#22c55e');
    impWrap.appendChild(bubble);
    requestAnimationFrame(()=> bubble.classList.add('is-on'));
    setTimeout(()=> bubble.remove(), 1400);
  }

  // Botones
  const btnPagar    = el('button',{className:'btn-option btn-pay', dataset:{action:'pagar'}}, txt('Pagar'));
  const btnPedir    = el('button',{className:'btn-option btn-loan', type:'button', dataset:{action:'prestamo'}}, txt('Pedir préstamo'));
  const btnRechazar = el('button',{className:'btn-option btn-decline', dataset:{action:'rechazar'}}, txt('Rechazar'));

  const left = el('div',{className:'deuda-col left'}, impWrap, saldoNode, btnPagar, btnPedir, btnRechazar);

  // Centro: texto grande
  const centerText = el('div',{className:'tut-center-text tut-ontop'}, txt(''));
  const center = el('div',{className:'deuda-col center'},
    el('div',{className:'tut-center-wrap'}, centerText)
  );

  // Tabla
  const tbody = el('tbody');
  const table = el('table',{className:'tabla-prestamos table-loans'},
    el('thead',{}, el('tr',{},
      el('th',{}, txt('ID')),
      el('th',{}, txt('Cantidad')),
      el('th',{}, txt('Semanas')),
      el('th',{}, txt('Estado'))
    )),
    tbody
  );
  const right = el('div',{className:'deuda-col right'}, table);

  body.appendChild(left);
  body.appendChild(center);
  body.appendChild(right);
  root.appendChild(body);

  // Tabla
  const STATUS = H.STATUS || { ACTIVO:'Activo', IMPAGADO:'Impagado' };
  function formatEUR(n){ return `€${Number(n||0)}`; }
  function fillLoansTable(){
    tbody.innerHTML = '';
    if (!st.loans.length){
      tbody.appendChild(el('tr',{}, el('td',{colSpan:4}, txt('Sin préstamos'))));
      return;
    }
    for (const l of st.loans){
      const tr = el('tr',{dataset:{id:String(l.id)}},
        el('td',{}, txt(l.id)),
        el('td',{}, txt(formatEUR(l.amount))),
        el('td',{}, txt(`${l.weeksLeft} sem.`)),
        el('td',{}, txt(l.status))
      );
      if (l.status === STATUS.ACTIVO || l.status === STATUS.IMPAGADO) tr.classList.add('row-clickable');
      tbody.appendChild(tr);
    }
  }
  fillLoansTable();

  // Impaciencia inicial
  setImp({ fillEl: impFill, capEl: impCap, valuePct: st.impatience, capPct: cfg.capPct });

  // Overlay focus
  const overlay = document.createElement('div');
  overlay.className = 'tut-overlay';
  document.body.appendChild(overlay);

  let focusedEl = null;
  let highlightedRow = null;
  function clearFocus(){
    if (!focusedEl) return;
    focusedEl.classList.remove('tut-ontop','tut-glow','tut-row-glow');
    focusedEl = null;
    clearRowHighlight();
  }
  function clearRowHighlight(){
    if (!highlightedRow) return;
    highlightedRow.classList.remove('tut-row-glow');
    highlightedRow = null;
  }
  function setFocus(el, kind='button'){
    clearFocus();
    if (!el) return;
    focusedEl = el;
    el.classList.add('tut-ontop');
    if (kind === 'row') el.classList.add('tut-row-glow');
    else if (kind === 'modal') el.classList.add('tut-glow');
    else el.classList.add('tut-glow');
  }
  function setRowHighlight(row){
    clearRowHighlight();
    if (!row) return;
    highlightedRow = row;
    row.classList.add('tut-row-glow');
  }
  function elevateForAnim({ imp=false, saldo=false } = {}){
    const lifted = [];
    if (imp && impWrap) { impWrap.classList.add('tut-ontop'); lifted.push(impWrap); }
    if (saldo && saldoBadge) { saldoBadge.classList.add('tut-ontop'); lifted.push(saldoBadge); }
    return () => {
      lifted.forEach(el => el.classList.remove('tut-ontop'));
    };
  }

  function advanceSlideOnce(){
    let advanced = false;
    try { if (window.SlideActions && typeof window.SlideActions.next === 'function') { window.SlideActions.next(); advanced = true; } } catch(e){}
    try { if (!advanced && typeof window.gotoNextSlide === 'function') { window.gotoNextSlide(); advanced = true; } } catch(e){}
    try { if (!advanced && window.GoTo && typeof window.GoTo.next === 'function') { window.GoTo.next(); advanced = true; } } catch(e){}
    try { if (!advanced && window.Player && typeof window.Player.next === 'function') { window.Player.next(); advanced = true; } } catch(e){}
    try { if (!advanced && window.App && typeof window.App.nextSlide === 'function') { window.App.nextSlide(); advanced = true; } } catch(e){}
    try { if (!advanced && window.API && window.API.slides && typeof window.API.slides.next === 'function') { window.API.slides.next(); advanced = true; } } catch(e){}
    try { if (!advanced) { const btn = document.querySelector('[data-nav="next"], .btn-next, button.next, a.next'); if (btn) { btn.click(); advanced = true; } } } catch(e){}
    try { if (!advanced && window.parent) { window.parent.postMessage({ type:'slide-next' }, '*'); advanced = true; } } catch(e){}
    return advanced;
  }
  function advanceSlideAggressive(){
    let advanced = false;
    const tryOnce = () => {
      if (advanced) return;
      try { advanced = !!advanceSlideOnce(); } catch(e){}
    };
    [0, 100, 250].forEach((delay)=> setTimeout(tryOnce, delay));
  }

  function animateImpatienceTo(nextPct, { duration = 700, from } = {}) {
    const prev = Number.isFinite(from) ? Number(from) : Number(st.impatience || 0);
    const to   = Math.min(100, Math.max(0, Number(nextPct || 0)));
    const diff = Math.abs(to - prev);
    const ms   = Number.isFinite(duration) ? Number(duration) : Math.max(250, Math.min(900, diff * 12));
    return new Promise((resolve) => {
      const start = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - start) / ms);
        const cur = prev + (to - prev) * k;
        setImp({ fillEl: impFill, capEl: impCap, valuePct: cur, capPct: cfg.capPct });
        if (k < 1) requestAnimationFrame(step);
        else {
          setImp({ fillEl: impFill, capEl: impCap, valuePct: to, capPct: cfg.capPct });
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  }

  function waitForImpatienceClickAndAnimate({ prevImp, nextImp }){
    // Ahora se dispara en el mismo click del botón (sin segundo click).
    showImpBubble(nextImp - prevImp);
    return animateImpatienceTo(nextImp, { from: prevImp });
  }
  const waitMs = (ms) => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms|0)));

  function updateSaldo(delta, { showFlyout = true } = {}){
    st.saldo = Number(st.saldo || 0) + Number(delta || 0);
    saldoW?.set && saldoW.set(st.saldo);
    const sign = delta >= 0 ? '+' : '-';
    if (showFlyout) {
      saldoFeedback(`${sign}€${Math.abs(Number(delta||0))}`, Number(delta||0));
    } else {
      showSaldoBubble(Number(delta||0));
    }
  }

  // Modales
  function openInfoModal({ title='Aviso', message='', onClose } = {}){
    const ov = document.createElement('div'); ov.className='modal-overlay tutorial-modal';
    const md = document.createElement('div'); md.className='modal';
    md.innerHTML = `<h3 class="modal-title">${title}</h3><div class="modal-subtitle">${message}</div><div class="modal-actions"><button class="btn-primary" id="ok">Aceptar</button></div>`;
    ov.appendChild(md); document.body.appendChild(ov);
    setFocus(md, 'modal');
    const close = () => { ov.remove(); applyStep(stepIndex); onClose && onClose(); };
    md.querySelector('#ok').onclick = close;
    ov.addEventListener('click',(e)=>{ if(e.target===ov){ e.preventDefault(); e.stopPropagation(); } }, {passive:false});
  }

  function openConfirmModal({ title='Confirmar', message='', onYes, onNo } = {}){
    const ov = document.createElement('div'); ov.className='modal-overlay tutorial-modal';
    const md = document.createElement('div'); md.className='modal';
    md.innerHTML = `<h3 class="modal-title">${title}</h3><div class="modal-subtitle">${message}</div><div class="modal-actions"><button class="btn-secondary" id="no">Cancelar</button><button class="btn-primary" id="yes">Aceptar</button></div>`;
    ov.appendChild(md); document.body.appendChild(ov);
    setFocus(md, 'modal');
    let closed = false;
    const close = (restore = true) => {
      if (closed) return;
      closed = true;
      ov.remove();
      if (restore) applyStep(stepIndex);
    };
    md.querySelector('#no').onclick = () => { onNo && onNo(); close(); };
    md.querySelector('#yes').onclick = () => { onYes && onYes(); close(false); };
    ov.addEventListener('click',(e)=>{ if(e.target===ov){ e.preventDefault(); e.stopPropagation(); } }, {passive:false});
  }

  function openLoanModal({ min, max, minWeeks=1, maxWeeks=cfg.activityWeeks, defaultWeeks=cfg.loanWeeks, onConfirm, onCancel }){
    const ov = document.createElement('div'); ov.className='modal-overlay tutorial-modal';
    const md = document.createElement('div'); md.className='modal';
    md.innerHTML = `
      <h3 class="modal-title">Selecciona el préstamo</h3>
      <p class="modal-subtitle">Importe entre ${min}€ y ${max}€ · Semanas entre ${minWeeks} y ${maxWeeks}</p>
      <div class="modal-input-row"><span>Importe (€)</span><input id="loanAmountInput" type="number" step="1" min="${min}" max="${max}" value="${min}"></div>
      <div class="modal-input-row"><span>Semanas para devolver</span><input id="loanWeeksInput" type="number" step="1" min="${minWeeks}" max="${maxWeeks}" value="${defaultWeeks}"></div>
      <div class="modal-preview" id="loanPreview"></div>
      <p id="loanError" class="modal-error" style="display:none;"></p>
      <div class="modal-actions"><button id="loanCancelBtn" class="btn-secondary">Cancelar</button><button id="loanAcceptBtn" class="btn-primary">Aceptar</button></div>
    `;
    ov.appendChild(md); document.body.appendChild(ov);
    setFocus(md, 'modal');

    const amountEl = md.querySelector('#loanAmountInput');
    const weeksEl  = md.querySelector('#loanWeeksInput');
    const errEl    = md.querySelector('#loanError');
    const preview  = md.querySelector('#loanPreview');

    function updatePreview(){
      const amount = Number((amountEl.value||'').trim());
      if (Number.isFinite(amount)){
        const saldoAfter = (st.saldo||0) + amount;
        preview.textContent = `Saldo tras pedir: €${saldoAfter}`;
      } else preview.textContent = '';
    }
    updatePreview();
    amountEl.addEventListener('input', updatePreview);

    const close = (restore = true) => {
      ov.remove();
      if (restore) applyStep(stepIndex);
    };

    md.querySelector('#loanCancelBtn').onclick = () => { onCancel && onCancel(); close(); };
    md.querySelector('#loanAcceptBtn').onclick = () => {
      const amount = Number((amountEl.value||'').trim());
      const weeks  = Number((weeksEl.value||'').trim());
      if (!Number.isInteger(amount) || amount < min || amount > max){ errEl.textContent = `El importe debe estar entre ${min}€ y ${max}€.`; errEl.style.display='block'; return; }
      if (!Number.isInteger(weeks) || weeks < minWeeks || weeks > maxWeeks){ errEl.textContent = `Las semanas deben estar entre ${minWeeks} y ${maxWeeks}.`; errEl.style.display='block'; return; }
      onConfirm && onConfirm(amount, weeks);
      close(false);
    };

    ov.addEventListener('click',(e)=>{ if(e.target===ov){ e.preventDefault(); e.stopPropagation(); } }, {passive:false});
    setTimeout(()=> amountEl && amountEl.focus(), 0);
  }

  // Steps
  const defaultSteps = [
    { key:'rechazar', text:'Intenta rechazar el plan' },
    { key:'pagar', text:'Intenta pagar para hacer el plan' },
    { key:'pedir', text:'Intenta pedir un préstamo' },
    { key:'devolver', text:'Intenta devolver un préstamo' }
  ];
  const steps = Array.isArray(s?.tutorial?.steps) && s.tutorial.steps.length ? s.tutorial.steps : defaultSteps;
  let stepIndex = 0;
  let busy = false;
  let modalOpen = false;

  function currentStepKey(){
    const step = steps[stepIndex] || defaultSteps[stepIndex] || defaultSteps[0];
    return String(step.key || '').toLowerCase();
  }
  function currentStepText(){
    const step = steps[stepIndex] || defaultSteps[stepIndex] || defaultSteps[0];
    return String(step.text || defaultSteps[stepIndex]?.text || '');
  }
  function getFirstClickableRow(){
    return tbody.querySelector('tr.row-clickable');
  }
  function applyStep(idx){
    stepIndex = Math.max(0, Math.min(idx, steps.length - 1));
    const key = currentStepKey();
    centerText.textContent = currentStepText();
    if (key !== 'devolver') clearRowHighlight();
    if (key === 'rechazar') setFocus(btnRechazar, 'button');
    else if (key === 'pagar') setFocus(btnPagar, 'button');
    else if (key === 'pedir') setFocus(btnPedir, 'button');
    else if (key === 'devolver') {
      const row = getFirstClickableRow();
      setFocus(table, 'button');
      setRowHighlight(row);
    }
  }
  function nextStep(){
    if (stepIndex >= steps.length - 1) {
      try { overlay.remove(); } catch(_){}
      clearFocus();
      advanceSlideAggressive();
      return;
    }
    applyStep(stepIndex + 1);
  }

  // Handlers
  btnRechazar.addEventListener('click', async () => {
    if (busy || currentStepKey() !== 'rechazar') return;
    busy = true;
    const release = elevateForAnim({ imp: true, saldo: false });
    const prevImp = Number(st.impatience || 0);
    const nextImp = Math.min(100, Math.max(0, prevImp + cfg.deltaOnReject));
    centerText.textContent = 'Si rechazas, la impaciencia subirá';
    await waitForImpatienceClickAndAnimate({ prevImp, nextImp });
    st.impatience = nextImp;
    await waitMs(holdMs);
    release();
    busy = false;
    nextStep();
  });

  btnPagar.addEventListener('click', async () => {
    if (busy || currentStepKey() !== 'pagar') return;
    if ((st.saldo || 0) < cfg.payCost) {
      openInfoModal({ title:'No puedes pagar', message:'Necesitas saldo suficiente para pagar.' });
      return;
    }
    busy = true;
    const release = elevateForAnim({ imp: true, saldo: true });
    updateSaldo(-cfg.payCost, { showFlyout: false });
    const prevImp = Number(st.impatience || 0);
    const nextImp = Math.min(100, Math.max(0, prevImp + cfg.deltaOnPay));
    centerText.textContent = 'Si pagas, la impaciencia bajará';
    await waitForImpatienceClickAndAnimate({ prevImp, nextImp });
    st.impatience = nextImp;
    await waitMs(holdMs);
    release();
    busy = false;
    nextStep();
  });

  btnPedir.addEventListener('click', () => {
    if (busy || modalOpen || currentStepKey() !== 'pedir') return;
    modalOpen = true;
    const min = Math.max(1, cfg.loanCost - (st.saldo || 0));
    const max = Math.max(min, cfg.loanCost);
    openLoanModal({
      min, max,
      minWeeks: 1,
      maxWeeks: Math.min(cfg.activityWeeks, 3),
      defaultWeeks: Math.min(Math.max(1, cfg.loanWeeks), Math.min(cfg.activityWeeks, 3)),
      onConfirm: (amount, weeksSel) => {
        busy = true;
        const release = elevateForAnim({ imp: false, saldo: true });
        const id = st.nextLoanId++;
        st.loans.push({ id, amount, weeksLeft: weeksSel, status: STATUS.ACTIVO });
        updateSaldo(amount, { showFlyout: false });
        fillLoansTable();
        modalOpen = false;
        setTimeout(() => {
          release();
          busy = false;
          nextStep();
        }, holdMs);
      },
      onCancel: () => { modalOpen = false; }
    });
  });

  tbody.addEventListener('click', (ev) => {
    if (busy || modalOpen || currentStepKey() !== 'devolver') return;
    const tr = ev.target.closest && ev.target.closest('tr');
    if (!tr || !tr.dataset || !tr.dataset.id) return;
    const id = Number(tr.dataset.id);
    const loan = st.loans.find(x => Number(x.id) === id);
    if (!loan) return;

    modalOpen = true;
    openConfirmModal({
      title: 'Devolver préstamo',
      message: `Vas a devolver el préstamo ID ${loan.id}. Importe: €${loan.amount}`,
      onYes: () => {
        if ((st.saldo || 0) < Number(loan.amount || 0)) {
          modalOpen = false;
          openInfoModal({ title:'Saldo insuficiente', message:'No tienes saldo suficiente para devolver este préstamo.' });
          return;
        }
        updateSaldo(-Number(loan.amount || 0));
        st.loans = st.loans.filter(x => Number(x.id) !== id);
        fillLoansTable();
        modalOpen = false;
        nextStep();
      },
      onNo: () => { modalOpen = false; }
    });
  }, { capture: true });

  applyStep(0);
  return { suppressRootClick: true, noLock: true };
});
