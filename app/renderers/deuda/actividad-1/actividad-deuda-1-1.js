// =====================================================
// actividad-deuda-1-1.js — Pantalla DECISIÓN (completo, con modales)
// Mejoras integradas:
//  - Impaciencia configurable por slide: event.impatience { deltaOnPay, deltaOnReject, capPct }
//  - Barra con umbral visible (cap) y color verde/rojo según cruce
//  - Se guardan en st.fx: impatienceFrom/To + impatienceCap para animar en 1-3
//  - (NUEVO) Botón ℹ️ de ayuda en la tabla de préstamos + ayuda al tocar la tabla
// =====================================================

(function initDeudaHelpers(){
  if (window.DeudaHelpers) return;

  const STATUS  = { ACTIVO: 'Activo', IMPAGADO: 'Impagado' };
  const PENALTY = 5;

  const el = (tag, props = {}, ...children) => {
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
  const txt = s => document.createTextNode(String(s ?? ''));

  // ===== Estilos base de UI =====
  (function ensureUXStyles(){
    const ID = 'deuda-ux-style'; if (document.getElementById(ID)) return;
    const css = document.createElement('style'); css.id = ID;
    css.textContent = `
      .btn-option[disabled]{opacity:.55;cursor:not-allowed}
      .btn-hint{font-size:12px;color:#666;margin-top:6px;min-height:16px}
      .weeks-badge{padding:4px 8px;border-radius:999px;font-size:12px;font-weight:700}
      .weeks-badge.safe{background:#e3f2fd;color:#0d47a1}
      .weeks-badge.warn{background:#fff8e1;color:#e65100}
      .weeks-badge.due{background:#ffebee;color:#b71c1c}
      .table-loans td.badge-cell{display:flex;align-items:center;gap:8px}
      .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9990}
      .modal{width:min(480px,92vw);background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.25);padding:20px 22px;font-family:inherit}
      .modal-title{margin:0 0 4px;font-size:18px;font-weight:700}
      .modal-subtitle{margin:0 0 16px;font-size:14px;color:#555}
      .modal-content{font-size:14px;color:#222;white-space:pre-wrap}
      .modal-input-row{display:grid;grid-template-columns:1fr 160px;align-items:center;gap:12px;margin-bottom:8px}
      .modal-input-row input[type="number"]{width:160px;padding:8px 10px;border:1px solid #cfd8dc;border-radius:10px;font-size:16px;text-align:right}
      .modal-error{color:#c62828;font-size:13px;margin:6px 0 0}
      .modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}
      .btn-primary,.btn-secondary{padding:10px 14px;border-radius:10px;border:none;cursor:pointer;font-weight:600}
      .btn-primary{background:#16a1b4;color:#fff}.btn-secondary{background:#eceff1;color:#333}
      .btn-primary:hover{filter:brightness(.95)}.btn-secondary:hover{filter:brightness(.97)}
      .modal-preview{font-size:12px;color:#333;margin-top:6px}
      .tpl--actividad-deuda .evento-banner{background:#fff!important;border:1px solid #e5e7eb;border-radius:14px;padding:12px 16px;font-weight:800;font-size:18px;box-shadow:0 8px 24px rgba(0,0,0,.06);text-align:center}
      .tpl--actividad-deuda .deuda-col.center{display:flex;justify-content:center;align-items:center}
      /* Imagen centrada y sin bordes */
      .visual-stage{display:flex;align-items:center;justify-content:center;height:clamp(300px, 54vh, 640px); width:100%;}
      .evento-imagen, .fx-image{max-width:100%;max-height:100%;object-fit:contain;display:block;background:transparent;border:0;box-shadow:none;border-radius:0;}
      .tpl--actividad-deuda .tabla-prestamos{width:100%;border-collapse:separate;border-spacing:0;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden}
      .tpl--actividad-deuda .tabla-prestamos th,.tpl--actividad-deuda .tabla-prestamos td{padding:10px 12px;border-bottom:1px solid #eee;text-align:left}
      .tpl--actividad-deuda .tabla-prestamos thead th{background:#fafafa;font-weight:700}
      .tpl--actividad-deuda .tabla-prestamos tr:last-child td{border-bottom:none}
      :root { --deuda-left-w: 260px; }
      .tpl--actividad-deuda .deuda-col.left{ width: var(--deuda-left-w); }
      .tpl--actividad-deuda .deuda-col.left .impatience-wrap,
      .tpl--actividad-deuda .deuda-col.left .coins-wrap,
      .tpl--actividad-deuda .deuda-col.left .btn-option,
      .tpl--actividad-deuda .deuda-col.left .btn-hint{ width: 100%; max-width: var(--deuda-left-w); }
      .tpl--actividad-deuda .impatience-bar{ width: 100%; }

      /* === Barra de impaciencia (verde base, rojo al superar umbral) === */
      .impatience-bar{
        position:relative;height:14px;border-radius:8px;overflow:hidden;
        background:#e0e0e0;box-shadow:inset 0 1px 3px rgba(0,0,0,.2);
      }
      .impatience-fill{
        height:100%;
        background:linear-gradient(90deg,#43a047,#2e7d32); /* verde */
        width:0%;
        transition:background-color .15s linear;
      }
      .impatience-fill.danger{
        background:linear-gradient(90deg,#e53935,#b71c1c); /* rojo */
      }
      .impatience-cap{
        position:absolute;top:0;bottom:0;width:3px;
        background:#111827; opacity:.4;
      }
      .impatience-cap::after{
        content:'UMBRAL'; position:absolute; top:-18px; left:50%;
        transform:translateX(-50%); font-size:10px; font-weight:700;
        color:#11182799; letter-spacing:.4px;
      }

      /* Badge monedas */
      .coins-wrap{ display:inline-flex; flex-direction:column; gap:6px; }
      .coins-badge{ display:inline-flex; align-items:center; gap:10px; padding:10px 14px; min-width:88px;
        border-radius:14px; background:linear-gradient(135deg,#ffd776,#f2b93a); box-shadow:0 6px 18px rgba(0,0,0,.08);
        font-weight:800; font-size:28px; color:#111827; }
      .coins-badge__num{ line-height:1; }
      .coins-badge__icon{ width:26px; height:26px; object-fit:contain; }

      /* === NUEVO: botón de ayuda en la tabla === */
      .tabla-wrap{ position: relative; }
      .loan-info-btn{
        position: absolute; top: 6px; right: 6px;
        width: 26px; height: 26px; border-radius: 999px;
        display: inline-flex; align-items: center; justify-content: center;
        font-weight: 900; line-height: 1;
        background: #fff; color: #0f172a;
        border: 1px solid #cbd5e1; box-shadow: 0 6px 12px rgba(0,0,0,.06);
        cursor: pointer;
      }
      .loan-info-btn:hover{ filter: brightness(1.03); }
      .loan-info-btn:focus-visible{ outline: 3px solid rgba(59,130,246,.35); outline-offset: 2px; }

          
      .tpl--actividad-deuda[data-render="1-1"] .btn-option{
        border: none;
        border-radius: 50px;            /* look 1-1 */
        font-size: 1.2rem;
        font-weight: 600;
        padding: 14px 32px;
        width: 100%;
        margin-top: 10px;
        cursor: pointer;
        transition: all 0.15s ease-in-out;
        box-shadow: 0 4px 0 rgba(0,0,0,0.2);
        background: var(--btn-bg, #e5e7eb);
        color: var(--btn-fg, #111);
      }
      .tpl--actividad-deuda[data-render="1-1"] .btn-option:hover{
        filter: brightness(.98);
        box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      }
      .tpl--actividad-deuda[data-render="1-1"] .btn-option:active{
        transform: translateY(1px);
      }

    `;
    document.head.appendChild(css);
  })();

  // ===== Reset de persistencia por sesión =====
  (function ensureDeudaSessionKey(){
    const SKEY = 'DEUDA_SESSION_NONCE';
    let isReload = false;
    try {
      const navs = performance.getEntriesByType && performance.getEntriesByType('navigation');
      const nav  = navs && navs[0];
      isReload = nav ? nav.type === 'reload'
                     : (performance.navigation && performance.navigation.type === performance.navigation.TYPE_RELOAD);
    } catch(_) {}
    let nonce = null;
    try { nonce = sessionStorage.getItem(SKEY); } catch(_) {}
    if (!nonce || isReload) {
      nonce = Date.now().toString(36) + Math.random().toString(36).slice(2,7);
      try { sessionStorage.setItem(SKEY, nonce); } catch(_) {}
    }
    window.__DEUDA_SESSION_NONCE = nonce;
  })();

  (function ensurePersistLayerSession(){
    const desiredKey = 'ACT_DEUDA_PERSIST_' + (window.__DEUDA_SESSION_NONCE || 'session');
    const load = () => { try { return JSON.parse(localStorage.getItem(desiredKey)||'{}'); } catch(e){ return {}; } };
    const save = (patch) => { try { const base = load(); localStorage.setItem(desiredKey, JSON.stringify({ ...base, ...patch })); } catch(e){} };
    const clear= () => { try { localStorage.removeItem(desiredKey); } catch(e){} };
    if (!window.DeudaPersist || window.DeudaPersist.KEY !== desiredKey) {
      window.DeudaPersist = { KEY: desiredKey, load, save, clear };
    }
  })();

  // ===== Helpers comunes =====
  function makeSaldoWidget({ icon = '../assets/icons/coin_ranking.png' }={}){
    const elx=(t,p={},...c)=>{const n=document.createElement(t);for(const[k,v]of Object.entries(p||{})){if(k==='className')n.className=v; else if(k in n)n[k]=v; else n.setAttribute(k,v)}; for(const ch of c.flat()){ if(ch==null)continue; n.appendChild(ch.nodeType?ch:document.createTextNode(String(ch)))} return n };
    const coins=elx('div',{className:'coins-badge'}, elx('span',{className:'coins-badge__num'},'0'), elx('img',{className:'coins-badge__icon',alt:'Monedas',src:icon}));
    const wrap=elx('div',{className:'coins-wrap'}, coins); const valueEl = coins.querySelector('.coins-badge__num');
    return { node:wrap, set:(v)=>{ valueEl.textContent=String(Number(v||0)); } };
  }
  function openInfoModal({ title='Aviso', message='', onClose }={}){
    const overlay=document.createElement('div'); overlay.className='modal-overlay';
    const modal=document.createElement('div'); modal.className='modal';
    modal.innerHTML=`<h3 class="modal-title">${title}</h3><div class="modal-content">${message}</div><div class="modal-actions"><button id="infoOkBtn" class="btn-primary">Aceptar</button></div>`;
    overlay.appendChild(modal); document.body.appendChild(overlay);
    const close=()=>{ overlay.remove(); onClose&&onClose(); };
    modal.querySelector('#infoOkBtn').onclick=close;
    overlay.addEventListener('click',(ev)=>{ if(ev.target===overlay) close(); });
  }
  function openConfirmModal({ title='Confirmar', message='', onYes, onNo }={}){
    const overlay=document.createElement('div'); overlay.className='modal-overlay';
    const modal=document.createElement('div'); modal.className='modal';
    modal.innerHTML=`<h3 class="modal-title">${title}</h3><div class="modal-content">${message}</div><div class="modal-actions"><button id="confirmNoBtn" class="btn-secondary">Cancelar</button><button id="confirmYesBtn" class="btn-primary">Aceptar</button></div>`;
    overlay.appendChild(modal); document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    modal.querySelector('#confirmNoBtn').onclick=()=>{ onNo&&onNo(); close(); };
    modal.querySelector('#confirmYesBtn').onclick=()=>{ onYes&&onYes(); close(); };
    overlay.addEventListener('click',(ev)=>{ if(ev.target===overlay){ onNo&&onNo(); close(); }});
  }

  // Helper de barra (verde/rojo + cap)
  function setImpatienceBar({ fillEl, capEl, valuePct, capPct }){
    const v = Math.min(100, Math.max(0, Number(valuePct||0)));
    const cap = Math.min(100, Math.max(0, Number(capPct||70)));
    fillEl.style.width = v + '%';
    capEl.style.left = cap + '%';
    if (v >= cap) fillEl.classList.add('danger'); else fillEl.classList.remove('danger');
  }

  window.DeudaHelpers = { STATUS, PENALTY, el, txt, makeSaldoWidget, openInfoModal, openConfirmModal, setImpatienceBar,
    ensureState(){
      if (!window.ACT_DEUDA_STATE) {
        window.ACT_DEUDA_STATE = { week:1, saldo:10, loans:[], nextLoanId:1, blocked:false, lastAction:null, incomes:[], impatience:0 };
      }
      const st = window.ACT_DEUDA_STATE;
      if (!Array.isArray(st.incomes)) st.incomes = [];
      if (typeof st.impatience !== 'number') st.impatience = 0;
      st.blocked = st.loans.some(x => x.status === STATUS.IMPAGADO);
      return st;
    },
    formatEUR:(n)=>`€${Number(n||0)}`
  };
})();

(function initLoansTablePatch(){
  const H = window.DeudaHelpers; if (!H) return;

  function fillLoansTable(tbody, loans){
    const el=H.el, txt=H.txt, STATUS=H.STATUS; tbody.innerHTML='';
    if (!loans.length) { tbody.appendChild(el('tr',{}, el('td',{colSpan:4}, txt('Sin préstamos')))); return; }
    for (const l of loans) {
      const weeksClass = l.status===STATUS.IMPAGADO ? 'due' : (l.weeksLeft<=1 ? 'due' : (l.weeksLeft===2 ? 'warn' : 'safe'));
      const tr = el('tr',{dataset:{id:String(l.id),status:l.status}},
        el('td',{},txt(l.id)),
        el('td',{},txt(H.formatEUR(l.amount))),
        el('td',{className:'badge-cell'}, el('span',{className:`weeks-badge ${weeksClass}`}, txt(`${l.weeksLeft} sem.`))),
        el('td',{},txt(l.status))
      );
      if (l.status===STATUS.ACTIVO || l.status===STATUS.IMPAGADO) tr.classList.add('row-clickable');
      tbody.appendChild(tr);
    }
  }
  function attachRepayHandler({ tbody, state, onAfterChange }){
    const { openConfirmModal, openInfoModal, STATUS } = H;
    tbody.addEventListener('click',(ev)=>{
      const tr=ev.target.closest('tr'); if(!tr || !tr.dataset) return;
      const st=tr.dataset.status; if (st!==STATUS.ACTIVO && st!==STATUS.IMPAGADO) return;
      ev.stopImmediatePropagation?.(); ev.stopPropagation(); ev.preventDefault();
      const id=Number(tr.dataset.id); const loan=state.loans.find(x=>x.id===id); if(!loan) return;
      openConfirmModal({
        title:'Devolver préstamo',
        message:`¿Deseas devolver este préstamo?\n\nID: ${loan.id}\nEstado: ${loan.status}\nImporte a devolver: ${H.formatEUR(loan.amount)}`,
        onYes:()=>{
          if (state.saldo < loan.amount) { openInfoModal({title:'Saldo insuficiente', message:'No tienes saldo suficiente para devolver este préstamo.'}); return; }
          state.saldo -= loan.amount;
          state.loans = state.loans.filter(x=>x.id!==id);
          state.blocked = state.loans.some(x=>x.status===H.STATUS.IMPAGADO);
          typeof onAfterChange==='function' && onAfterChange();
        },
        onNo:()=>{}
      });
    });
  }
  window.DeudaHelpers.fillLoansTable = fillLoansTable;
  window.DeudaHelpers.attachRepayHandler = attachRepayHandler;
})();

SlideRendererRegistry.register('actividad-deuda-1-1', function (s, root) {
  const H  = window.DeudaHelpers;
  const st = H.ensureState();

  root.classList.add('tpl--actividad-deuda');
  root.setAttribute('data-render', '1-1');

  const cost           = Number(s?.event?.cost || 0);
  const loanWeeksHint  = Number(s?.event?.loanWeeks || 2);
  const activityWeeks  = Number(s?.event?.activityWeeks || s?.event?.weeks || 8);
  const incomeNextWeek = Number(s?.event?.incomeNextWeek || 0);
  const incomeSource   = s?.event?.incomeSource || 'Actividad';
  const MAX_LOAN_WEEKS = 3;

  // Impaciencia por slide
  const impCfg = (s?.event?.impatience) || {};
  const DELTA_PAY    = Number(impCfg.deltaOnPay    ?? -15);
  const DELTA_REJECT = Number(impCfg.deltaOnReject ?? +15);
  const CAP_PCT      = Math.max(0, Math.min(100, Number(impCfg.capPct ?? 70)));
  const clamp = (v,min,max)=>Math.min(max,Math.max(min,v));

  // Click-guard
  const guardCapture = (e) => {
    const t=e.target;
    if (t && t.closest && (t.closest('.tabla-prestamos tbody tr.row-clickable') || t.closest('.loan-info-btn'))) return; // ← permite botón info
    const btn = t && t.closest && t.closest('.btn-option');
    if (btn) {
      const action = btn.dataset?.action;
      if (action === 'pagar') {
        if (st.saldo < cost) {
          e.stopPropagation(); e.preventDefault();
          H.openInfoModal({ title:'No puedes pagar', message:'Necesitas saldo suficiente para pagar esta actividad.' });
        }
        return;
      }
      if (action === 'rechazar') return;
      if (action === 'prestamo') {
        e.stopImmediatePropagation?.(); e.stopPropagation(); e.preventDefault();
        handlePrestamo(); return;
      }
      return;
    }
    e.stopPropagation(); e.preventDefault();
  };
  ['click','pointerdown','pointerup','mousedown','mouseup'].forEach(evt => root.addEventListener(evt, guardCapture, true));
  root.addEventListener('click', (e) => { e.stopPropagation(); }, false);

  // Header
  const header = H.el('div',{className:'deuda-header'},
    H.el('div',{className:'evento-banner'}, H.txt(s.text || `Semana ${st.week}: decide`))
  );
  root.appendChild(header);

  // Body
  const body = H.el('div',{className:'deuda-body'});

  // Izquierda: Impaciencia + saldo + botones
  const impatienceFill = H.el('div',{className:'impatience-fill'});
  const impatienceBar  = H.el('div',{className:'impatience-bar'}, impatienceFill);
  const impCap         = H.el('div',{className:'impatience-cap'});
  impatienceBar.appendChild(impCap);
  const impatienceWrap = H.el('div',{className:'impatience-wrap'},
    H.el('div',{className:'impatience-label'}, H.txt('Impaciencia')),
    impatienceBar
  );

  const saldoW = H.makeSaldoWidget({ icon:'../assets/icons/coin_ranking.png' }); 
  saldoW.set(st.saldo);

  const btnPagar    = H.el('button',{className:'btn-option btn-pay',    dataset:{action:'pagar'}},     H.txt('Pagar'));
  const btnPrestamo = H.el('button',{className:'btn-option btn-loan',   dataset:{action:'prestamo'}},  H.txt('Pedir préstamo'));
  const btnRechazar = H.el('button',{className:'btn-option btn-decline',dataset:{action:'rechazar'}},  H.txt('Rechazar'));

  const hintPagar    = H.el('div',{className:'btn-hint'});
  const hintPrestamo = H.el('div',{className:'btn-hint'});

  const leftCol = H.el('div',{className:'deuda-col left'},
    impatienceWrap,
    saldoW.node,
    btnPagar, hintPagar,
    btnPrestamo, hintPrestamo,
    btnRechazar
  );

  // Centro: imagen
  const img = H.el('img',{className:'evento-imagen', src:s.image || 'assets/deuda/default.png', alt:s.alt || 'Situación'});
  const centerCol = H.el('div',{className:'deuda-col center'},
    H.el('div',{className:'visual-stage'}, img)
  );

  // Derecha: tabla + (NUEVO) botón info
  const tbody = H.el('tbody');
  const table = H.el('table',{className:'tabla-prestamos table-loans'},
    H.el('thead',{}, H.el('tr',{},
      H.el('th',{},H.txt('ID')),
      H.el('th',{},H.txt('Cantidad')),
      H.el('th',{},H.txt('Semanas')),
      H.el('th',{},H.txt('Estado'))
    )),
    tbody
  );

  // --- NUEVO: botón ℹ️ y contenedor ---
  const infoBtn = H.el('button', {
    className: 'loan-info-btn',
    type: 'button',
    title: 'Información sobre la tabla',
    'aria-label': 'Información sobre la tabla'
  }, H.txt('i'));

  const tablaWrap = H.el('div', { className: 'tabla-wrap' }, table);
  // Añadimos el botón ℹ️ dentro del mismo contenedor de texto
  const loanHint = H.el('div',{className:'loan-hint'}, infoBtn,
   H.el('strong', {}, H.txt('Pulsa para más información ')));

  const rightCol = H.el('div',{className:'deuda-col right'}, tablaWrap, loanHint);

  body.appendChild(leftCol); body.appendChild(centerCol); body.appendChild(rightCol); root.appendChild(body);

  // ---- Estado inicial de la barra (usa setImpatienceBar) ----
  H.setImpatienceBar({ fillEl: impatienceFill, capEl: impCap, valuePct: st.impatience || 0, capPct: CAP_PCT });

  // Modal de préstamo
  function openLoanModal({ min, max, minWeeks=1, maxWeeks=activityWeeks, defaultWeeks=Math.min(Math.max(1, loanWeeksHint||2), activityWeeks), onConfirm, onCancel }){
    const overlay=document.createElement('div'); overlay.className='modal-overlay';
    const modal=document.createElement('div'); modal.className='modal';
    modal.innerHTML = `
      <h3 class="modal-title">Selecciona el préstamo</h3>
      <p class="modal-subtitle">Importe entre ${min}€ y ${max}€ · Semanas entre ${minWeeks} y ${maxWeeks}</p>
      <div class="modal-input-row"><span>Importe (€)</span><input id="loanAmountInput" type="number" step="1" min="${min}" max="${max}" value="${min}"></div>
      <div class="modal-input-row"><span>Semanas para devolver</span><input id="loanWeeksInput" type="number" step="1" min="${minWeeks}" max="${maxWeeks}" value="${defaultWeeks}"></div>
      <div class="modal-preview" id="loanPreview"></div>
      <p id="loanError" class="modal-error" style="display:none;"></p>
      <div class="modal-actions"><button id="loanCancelBtn" class="btn-secondary">Cancelar</button><button id="loanAcceptBtn" class="btn-primary">Aceptar</button></div>
    `;
    overlay.appendChild(modal); document.body.appendChild(overlay);
    const amountEl=modal.querySelector('#loanAmountInput'); const weeksEl=modal.querySelector('#loanWeeksInput');
    const errEl=modal.querySelector('#loanError'); const preview=modal.querySelector('#loanPreview');
    const close=()=>overlay.remove();
    function updatePreview(){ const amount=Number((amountEl.value||'').trim()); if(Number.isFinite(amount)){ const saldoAfterLoan=st.saldo + amount; preview.textContent = `Saldo tras pedir: €${saldoAfterLoan} · ¿Podrás pagar ahora? ${saldoAfterLoan >= cost ? 'Sí':'No'}`; } else preview.textContent=''; }
    updatePreview(); amountEl.addEventListener('input', updatePreview);
    modal.querySelector('#loanCancelBtn').onclick=()=>{ onCancel&&onCancel(); close(); };
    modal.querySelector('#loanAcceptBtn').onclick=()=>{
      const amount=Number((amountEl.value||'').trim()); const weeks=Number((weeksEl.value||'').trim());
      if (!Number.isFinite(amount) || !Number.isInteger(amount)) { errEl.textContent='Introduce una cantidad entera (sin decimales).'; errEl.style.display='block'; return; }
      if (amount < min || amount > max) { errEl.textContent=`El importe debe estar entre ${min}€ y ${max}€.`; errEl.style.display='block'; return; }
      if (!Number.isFinite(weeks) || !Number.isInteger(weeks)) { errEl.textContent='Las semanas deben ser un número entero.'; errEl.style.display='block'; return; }
      if (weeks < minWeeks || weeks > maxWeeks) { errEl.textContent=`Las semanas deben estar entre ${minWeeks} y ${maxWeeks}.`; errEl.style.display='block'; return; }
      onConfirm&&onConfirm(amount, weeks); close();
    };
    setTimeout(()=>amountEl && amountEl.focus(),0);
    overlay.addEventListener('click',(ev)=>{ if(ev.target===overlay) close(); });
  }

  // Refresco UI
  H.fillLoansTable(tbody, st.loans);
  const refreshSaldo = ()=>{ saldoW.set(st.saldo); };
  const refreshLoans = ()=>{ H.fillLoansTable(tbody, st.loans); };
  function refreshButtonsAndHints(){
    if (st.saldo < cost) { btnPagar.setAttribute('disabled','true'); hintPagar.textContent = `Te faltan ${H.formatEUR(cost - st.saldo)} para poder pagar.`; }
    else { btnPagar.removeAttribute('disabled'); hintPagar.textContent = ''; }
    if (st.blocked) { btnPrestamo.setAttribute('disabled','true'); hintPrestamo.textContent = 'Devuelve primero los préstamos impagados.'; }
    else if (st.saldo >= cost) { btnPrestamo.setAttribute('disabled','true'); hintPrestamo.textContent = 'Paga directamente con tu saldo.'; }
    else { btnPrestamo.removeAttribute('disabled'); hintPrestamo.textContent = ''; }
  }
  function refreshImpatience(){
    H.setImpatienceBar({ fillEl: impatienceFill, capEl: impCap, valuePct: st.impatience || 0, capPct: CAP_PCT });
  }
  function refreshUI(){ st.blocked = st.loans.some(x=>x.status===H.STATUS.IMPAGADO); refreshSaldo(); refreshLoans(); refreshButtonsAndHints(); refreshImpatience(); }

  // Devolver préstamo (no avanza)
  H.attachRepayHandler({ tbody, state: st, onAfterChange(){ refreshUI(); } });

  // ====== NUEVO: ayuda de la tabla ======
  function openLoansHelp(){
    H.openInfoModal({
      title: '¿Cómo usar la tabla de préstamos?',
      message:
        '• Si un préstamo está Activo o Impagado, toca su fila para devolverlo.\n' +
        '• Al devolver, se descuenta del saldo la cantidad pendiente.\n' +
        '• Si no tienes saldo suficiente, se te avisará.\n' +
        '• Los préstamos que tú concediste aparecen marcados y no se devuelven desde aquí.\n' +
        '• El color de “Semanas” indica urgencia (verde → rojo).'
    });
  }
  infoBtn.addEventListener('click', (ev)=>{ ev.stopPropagation(); openLoansHelp(); });
  table.addEventListener('click', (ev)=>{
    if (!ev.target.closest('tbody tr.row-clickable')) {
      openLoansHelp();
    }
  });
  // ====== FIN ayuda tabla ======

  // Botón préstamo
  function handlePrestamo(){
    if (st.blocked) { H.openInfoModal({title:'Préstamo bloqueado', message:'No puedes pedir préstamos hasta saldar impagos.'}); return; }
    if (st.saldo >= cost) { H.openInfoModal({title:'No necesario', message:'Ya tienes saldo suficiente para pagar esta actividad.'}); return; }
    const min=Math.max(0, cost - st.saldo), max=cost;
    openLoanModal({
      min,
      max,
      minWeeks:1,
      maxWeeks: Math.min(activityWeeks, MAX_LOAN_WEEKS),
      defaultWeeks: Math.min(Math.max(1,(s?.event?.loanWeeks||2)), Math.min(activityWeeks,MAX_LOAN_WEEKS)),
      onConfirm:(loanAmount, weeksSel)=>{
        st.loans.push({ id:st.nextLoanId++, amount:loanAmount, weeksLeft:weeksSel, status:H.STATUS.ACTIVO });
        st.saldo += loanAmount;
        st.lastAction={type:'prestamo-only', loanAmount, loanWeeks:weeksSel, week:st.week};
        refreshUI();
      }
    });
  }

  // Acciones principales
  btnPagar.addEventListener('click', ()=>{
    if (st.saldo < cost) { H.openInfoModal({title:'No puedes pagar', message:'Necesitas saldo suficiente para pagar esta actividad.'}); return; }

    const prevImp = st.impatience || 0;
    const nextImp = clamp(prevImp + DELTA_PAY, 0, 100);

    const saldoBefore=st.saldo; st.saldo -= cost;

    if (incomeNextWeek > 0) {
      st.incomes.push({ amount:incomeNextWeek, dueWeek:st.week, source:incomeSource });
    }

    st.fx = {
      saldoFrom: window.ACT_DEUDA_LAST_SALDO ?? saldoBefore,
      saldoTo: st.saldo,
      loansAfter: st.loans.map(x=>({...x})),
      title: s?.text || 'Aplicando tu decisión…',
      image: s?.event?.imageAccepted || s?.image,
      impatienceFrom: prevImp,
      impatienceTo: nextImp,
      impatienceCap: CAP_PCT
    };
    st.impatience = nextImp;
    st.lastAction = { type:'pagar', cost, week:st.week, incomeNextWeek };
    window.ACT_DEUDA_LAST_SALDO = st.fx.saldoTo;

    // feedback inmediato en 1-1
    H.setImpatienceBar({ fillEl: impatienceFill, capEl: impCap, valuePct: nextImp, capPct: CAP_PCT });

    SlideActions.next();
  });

  btnRechazar.addEventListener('click', ()=>{
    const prevImp = st.impatience || 0;
    const nextImp = clamp(prevImp + DELTA_REJECT, 0, 100);

    st.fx = {
      saldoFrom: st.saldo,
      saldoTo: st.saldo,
      loansAfter: st.loans.map(x=>({...x})),
      title: s?.text || 'Has decidido no realizar la actividad.',
      image: s?.event?.imageRejected || s?.image,
      impatienceFrom: prevImp,
      impatienceTo: nextImp,
      impatienceCap: CAP_PCT
    };
    st.impatience = nextImp;
    st.lastAction = { type:'rechazar', week:st.week };

    window.ACT_DEUDA_LAST_SALDO = st.fx.saldoTo;

    // feedback inmediato en 1-1
    H.setImpatienceBar({ fillEl: impatienceFill, capEl: impCap, valuePct: nextImp, capPct: CAP_PCT });

    SlideActions.next();
  });

  refreshUI();
});
