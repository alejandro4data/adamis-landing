// =====================================================
// actividad-deuda-1s.js — Variante 1-1: Dar Préstamo / No dar Préstamo
// - Misma UI/estado que 1-1, solo cambian las acciones.
// - "Dar Préstamo": descuenta saldo ahora, crea préstamo {given:true} y programa ingreso diferido.
// - "No dar Préstamo": no cambia estado económico, pasa a 1-3.
// =====================================================

(function initDeudaHelpers(){
  if (window.DeudaHelpers) return;

  const STATUS  = { ACTIVO: 'Activo', IMPAGADO: 'Impagado' };
  const PENALTY = 12;

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
      .loan-given{background:linear-gradient(90deg,#f7faff,#ffffff)}
      .loan-given .status-pill{background:#e3f2fd;color:#0d47a1;border:1px solid #bbdefb}
      .status-pill{display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:700}
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
  function makeSaldoWidget({ icon = '../assets/icons/coin_ranking.webp' }={}){
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
      if (!st.rules || typeof st.rules !== 'object') st.rules = {};
      if (!Array.isArray(st.rules.allowedLoanPurposes)) st.rules.allowedLoanPurposes = ['negocio','medicina'];
      if (typeof st.rules.maxOtherExpenses !== 'number') st.rules.maxOtherExpenses = 2;
      if (typeof st.rules.otherExpensesPaid !== 'number') st.rules.otherExpensesPaid = 0;
      if (typeof st.rules.loanPurposeViolation !== 'boolean') st.rules.loanPurposeViolation = false;
      if (typeof st.rules.impatienceBreached !== 'boolean') st.rules.impatienceBreached = false;
      if (typeof st.rules.impatienceCap !== 'number') st.rules.impatienceCap = 50;
      st.blocked = st.loans.some(x => !x.given && x.status === STATUS.IMPAGADO);
      return st;
    },
    formatEUR:(n)=>`€${Number(n||0)}`
  };
})();

(function initLoansTablePatch(){
  const H = window.DeudaHelpers; if (!H) return;

  // Render tabla de préstamos con marca visual para given:true
  function fillLoansTable(tbody, loans){
    const el=H.el, txt=H.txt, STATUS=H.STATUS; tbody.innerHTML='';
    if (!loans.length) { tbody.appendChild(el('tr',{}, el('td',{colSpan:4}, txt('Sin préstamos')))); return; }
    for (const l of loans) {
      const weeksClass = l.status===STATUS.IMPAGADO ? 'due' : (l.weeksLeft<=1 ? 'due' : (l.weeksLeft===2 ? 'warn' : 'safe'));
      const tr = el('tr',{
        dataset:{id:String(l.id),status:l.status}
      },
        el('td',{},txt(l.id)),
        el('td',{},txt(H.formatEUR(l.amount))),
        el('td',{className:'badge-cell'}, el('span',{className:`weeks-badge ${weeksClass}`}, txt(`${l.weeksLeft} sem.`))),
        el('td',{}, (l.given
          ? el('span',{className:'status-pill'}, txt('Concedido por ti'))
          : txt(l.status)))
      );
      if (l.given) tr.classList.add('loan-given');
      // solo permitir click en préstamos propios (no concedidos) que sean Activo/Impagado
      if (!l.given && (l.status===STATUS.ACTIVO || l.status===STATUS.IMPAGADO)) tr.classList.add('row-clickable');
      tbody.appendChild(tr);
    }
  }

  function attachRepayHandler({ tbody, state, onAfterChange }){
    const { openConfirmModal, openInfoModal, STATUS } = H;
    tbody.addEventListener('click',(ev)=>{
      const tr=ev.target.closest('tr'); if(!tr || !tr.dataset) return;
      const id=Number(tr.dataset.id); const loan=state.loans.find(x=>x.id===id); if (!loan) return;
      if (loan.given) return; // No se devuelve desde aquí lo concedido
      const st=tr.dataset.status; if (st!==STATUS.ACTIVO && st!==STATUS.IMPAGADO) return;
      ev.stopImmediatePropagation?.(); ev.stopPropagation(); ev.preventDefault();
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

// =====================================================
// RENDERER VARIANTE: actividad-deuda-1-1s (Dar / No dar)
// =====================================================
(function registerRenderer(){
  function doRegister(){
    if (!window.SlideRendererRegistry || !window.DeudaHelpers) return setTimeout(doRegister, 0);

    const H = window.DeudaHelpers;

    function renderer(s, root){
      const st = H.ensureState();
      root.classList.add('tpl--actividad-deuda');

      // ---- Config declarativa del slide (con defaults) ----
      const ev = s?.event || {};
      const CAP_PCT            = Math.max(0, Math.min(100, Number(ev?.impatience?.capPct ?? 70)));
      const GIVE_AMOUNT        = Math.max(1, Number(ev?.giveLoanAmount ?? 10));
      const GIVE_WEEKS         = Math.max(1, Number(ev?.giveLoanWeeks  ?? 2));
      const GIVE_INTEREST_PCT  = Math.max(0, Number(ev?.giveLoanInterestPct ?? 0)); // 0..1
      const payoff             = Math.round(GIVE_AMOUNT * (1 + GIVE_INTEREST_PCT) * 100) / 100;

      // ---- Click-guard global (coincide con 1-1) ----
      const isRow = (t)=>t && t.closest && t.closest('.tabla-prestamos tbody tr.row-clickable');
      const isBtn = (t)=>t && t.closest && t.closest('.btn-option');
      const guardCapture=(e)=>{ const t=e.target; if(isRow(t)||isBtn(t)) return; e.stopPropagation(); e.preventDefault(); };
      ['click','pointerdown','pointerup','mousedown','mouseup'].forEach(evt => root.addEventListener(evt, guardCapture, true));
      root.addEventListener('click', (e) => { e.stopPropagation(); }, false);

      // ---- Header ----
      const header = H.el('div',{className:'deuda-header'},
        H.el('div',{className:'evento-banner'}, H.txt(s?.text || `Semana ${st.week}: ¿Darías un préstamo?`))
      );
      root.appendChild(header);

      // ---- Body 3 columnas ----
      const body = H.el('div',{className:'deuda-body'});

      // Izquierda: Impaciencia + Saldo + Botones (solo 2)
      const impFill = H.el('div',{className:'impatience-fill'});
      const impBar  = H.el('div',{className:'impatience-bar'}, impFill);
      const impCap  = H.el('div',{className:'impatience-cap'});
      impBar.appendChild(impCap);
      const impWrap = H.el('div',{className:'impatience-wrap'},
        H.el('div',{className:'impatience-label'}, H.txt('Impaciencia')),
        impBar
      );
      H.setImpatienceBar({ fillEl: impFill, capEl: impCap, valuePct: st.impatience || 0, capPct: CAP_PCT });

      const saldoW = H.makeSaldoWidget({ icon:'../assets/icons/coin_ranking.webp' });
      saldoW.set(st.saldo);

      const btnDar    = H.el('button',{className:'btn-option btn-pay',    dataset:{action:'dar'}},   H.txt('Dar Préstamo'));
      const btnNoDar  = H.el('button',{className:'btn-option btn-decline',dataset:{action:'nodar'}}, H.txt('No dar Préstamo'));
      const hintDar   = H.el('div',{className:'btn-hint'});

      const leftCol = H.el('div',{className:'deuda-col left'},
        impWrap,
        saldoW.node,
        btnDar, hintDar,
        btnNoDar
      );

      // Centro: imagen
      const img = H.el('img',{className:'evento-imagen', src:s?.image || 'assets/deuda/default.png', alt:s?.alt || 'Situación'});
      const centerCol = H.el('div',{className:'deuda-col center'},
        H.el('div',{className:'visual-stage'}, img)
      );

      // Derecha: tabla
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
      const loanHint = H.el('div',{className:'loan-hint'}, H.txt('💡 Préstamos CONCEDIDOS por ti aparecen marcados y no se devuelven desde aquí.'));
      const rightCol = H.el('div',{className:'deuda-col right'}, table, loanHint);

      body.appendChild(leftCol); body.appendChild(centerCol); body.appendChild(rightCol); root.appendChild(body);

      // ---- Pintar tabla + barra ----
      const refreshSaldo = ()=>{ saldoW.set(st.saldo); };
      const refreshLoans = ()=>{ H.fillLoansTable(tbody, st.loans); };
      const refreshImp   = ()=>{ H.setImpatienceBar({ fillEl: impFill, capEl: impCap, valuePct: st.impatience || 0, capPct: CAP_PCT }); };
      const refreshUI    = ()=>{ st.blocked = st.loans.some(x=>x.status===H.STATUS.IMPAGADO && !x.given); refreshSaldo(); refreshLoans(); refreshImp(); };

      refreshUI();

      // Hints / estado botones
      function refreshBtnStates(){
        if ((st.saldo || 0) < GIVE_AMOUNT) {
          btnDar.setAttribute('disabled','true');
          hintDar.textContent = `Te faltan ${H.formatEUR(GIVE_AMOUNT - (st.saldo||0))} para poder prestar ${H.formatEUR(GIVE_AMOUNT)}.`;
        } else {
          btnDar.removeAttribute('disabled'); hintDar.textContent = '';
        }
      }
      refreshBtnStates();

      // Evitar devolución de préstamos concedidos (si tu handler existe)
      if (window.DeudaHelpers.attachRepayHandler) {
        window.DeudaHelpers.attachRepayHandler({
          tbody, state: st,
          onBeforeOpen(loan){ if (loan?.given) return false; return true; },
          onAfterChange(){ refreshUI(); },
        });
      }

      // ---- Acciones ----

      // No dar préstamo → snapshot neutro y a 1-3
      btnNoDar.addEventListener('click', ()=>{
        st.fx = {
          saldoFrom: st.saldo,
          saldoTo: st.saldo,
          loansAfter: (st.loans||[]).map(x=>({...x})),
          title: s?.text || 'Has decidido NO dar el préstamo.',
          image: (s?.event && s.event.imageRejected) ? s.event.imageRejected : s?.image,
          impatienceFrom: st.impatience || 0,
          impatienceTo: st.impatience || 0,
          impatienceCap: CAP_PCT
        };
        st.lastAction = { type:'no-dar-prestamo', week:st.week };
        window.ACT_DEUDA_LAST_SALDO = st.fx.saldoTo;
        SlideActions.next();
      });

      // Dar préstamo → descuenta saldo, crea {given:true}, programa income y a 1-3
      btnDar.addEventListener('click', ()=>{
        if ((st.saldo || 0) < GIVE_AMOUNT) {
          H.openInfoModal({ title:'Saldo insuficiente', message:`Necesitas ${H.formatEUR(GIVE_AMOUNT)} para poder prestar.` });
          return;
        }

        const id = st.nextLoanId++;
        const saldoFrom = st.saldo;
        const saldoTo   = (st.saldo || 0) - GIVE_AMOUNT;

        // Programar ingreso diferido (capital + interés opcional)
        const dueWeek = (st.week || 1) + GIVE_WEEKS;

        // Registrar préstamo concedido (no es deuda propia)
        st.loans = (st.loans || []).concat([{
          id,
          amount: GIVE_AMOUNT,
          weeksLeft: GIVE_WEEKS,
          status: H.STATUS.ACTIVO,
          given: true,
          role: 'giver',
          dueWeek,
          payoff
        }]);
        st.saldo = saldoTo;

        st.incomes = (st.incomes || []).concat([{ amount: payoff, dueWeek, source:'prestamo-concedido', loanId: id }]);

        // FX para 1-3 (no cambiamos impaciencia en esta decisión)
        st.fx = {
          saldoFrom,
          saldoTo,
          loansAfter: (st.loans || []).map(x=>({...x})),
          title: s?.text || 'Has dado un préstamo.',
          image: (s?.event && s.event.imageAccepted) ? s.event.imageAccepted : s?.image,
          impatienceFrom: st.impatience || 0,
          impatienceTo: st.impatience || 0,
          impatienceCap: CAP_PCT
        };

        st.lastAction = { type:'dar-prestamo', week:st.week, amount: GIVE_AMOUNT, weeks: GIVE_WEEKS };
        window.ACT_DEUDA_LAST_SALDO = st.fx.saldoTo;

        refreshUI();
        SlideActions.next();
      });
    }

    // Registro con nombre esperado y alias por compat
    SlideRendererRegistry.register('actividad-deuda-1-1s', renderer);
    // Alias opcional (por si en algún sitio se invoca 'actividad-deuda-1s')
    SlideRendererRegistry.register?.('actividad-deuda-1s', renderer);

    // Fallback para motores que consultan window.Renderers
    window.Renderers = window.Renderers || {};
    window.Renderers['actividad-deuda-1-1s'] = (root, slide) => renderer(slide, root);
    window.Renderers['actividad-deuda-1s']    = (root, slide) => renderer(slide, root);
  }

  doRegister();
})();
