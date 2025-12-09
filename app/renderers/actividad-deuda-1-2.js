// =====================================================
// actividad-deuda-1-2.js — Pantalla RECAP (Resumen semanal)
// Layout alineado con 1-1 / 1-3 y con altura común:
//  - Imagen centrada (centro) — misma altura de inicio que izquierda/derecha
//  - Tabla centrada (derecha) — misma altura de inicio
//  - Izquierda: Impaciencia + Saldo — misma altura de inicio
//  - Botón "Continuar" pequeño, verde claro y flotante en esquina inferior derecha
// =====================================================

(function initDeudaHelpersPatch(){
  if (!window.DeudaHelpers) {
    const STATUS  = { ACTIVO: 'Activo', IMPAGADO: 'Impagado' };
    const PENALTY = 5;
    const el = (t,p={},...c)=>{const n=document.createElement(t);for(const[k,v] of Object.entries(p||{})){if(k==='className')n.className=v; else if(k==='dataset')Object.assign(n.dataset,v); else if(k in n)n[k]=v; else n.setAttribute(k,v)}; for(const ch of c.flat()){if(ch==null)continue; n.appendChild(ch.nodeType?ch:document.createTextNode(String(ch)))}; return n};
    const txt = s=>document.createTextNode(String(s??''));
    function ensureState(){
      if(!window.ACT_DEUDA_STATE){ window.ACT_DEUDA_STATE={week:1,saldo:10,loans:[],nextLoanId:1,blocked:false,lastAction:null,incomes:[], impatience:0}; }
      if(!Array.isArray(window.ACT_DEUDA_STATE.incomes)) window.ACT_DEUDA_STATE.incomes=[];
      return window.ACT_DEUDA_STATE;
    }
    const formatEUR = n=>`€${Number(n||0)}`;
    function fillLoansTable(tbody, loans){
      tbody.innerHTML='';
      if(!loans || !loans.length){ tbody.appendChild(el('tr',{},el('td',{colSpan:4},txt('Sin préstamos')))); return; }
      for(const l of loans){
        const tr = el('tr',{dataset:{id:String(l.id),status:l.status}},
          el('td',{},txt(l.id)),
          el('td',{},txt(formatEUR(l.amount))),
          el('td',{},txt(`${l.weeksLeft} sem.`)),
          el('td',{},txt(l.status))
        );
        if(l.status===STATUS.ACTIVO || l.status===STATUS.IMPAGADO) tr.classList.add('row-clickable');
        tbody.appendChild(tr);
      }
    }
    function makeSaldoWidget({ icon = '../assets/icons/coin_ranking.png' }={}){
      const elx=(t,p={},...c)=>{const n=document.createElement(t);for(const[k,v]of Object.entries(p||{})){if(k==='className')n.className=v; else if(k in n)n[k]=v; else n.setAttribute(k,v)}; for(const ch of c.flat()){if(ch==null)continue; n.appendChild(ch.nodeType?ch:document.createTextNode(String(ch)))}; return n};
      const coins=elx('div',{className:'coins-badge'}, elx('span',{className:'coins-badge__num'},'0'), elx('img',{className:'coins-badge__icon',alt:'Monedas',src:icon}));
      const wrap=elx('div',{className:'coins-wrap'}, coins); const valueEl=coins.querySelector('.coins-badge__num'); return { node:wrap, set:(v)=>{ valueEl.textContent=String(Number(v||0)); } };
    }

    // Helper barra (verde/rojo + cap)
    function setImpatienceBar({ fillEl, capEl, valuePct, capPct }){
      const v = Math.min(100, Math.max(0, Number(valuePct||0)));
      const cap = Math.min(100, Math.max(0, Number(capPct||70)));
      fillEl.style.width = v + '%';
      capEl.style.left = cap + '%';
      if (v >= cap) fillEl.classList.add('danger'); else fillEl.classList.remove('danger');
    }

    window.DeudaHelpers = { STATUS, PENALTY, el, txt, ensureState, formatEUR, fillLoansTable, makeSaldoWidget, setImpatienceBar };
  }

  // Reset por sesión & persistencia por sesión
  (function ensureDeudaSessionKey(){
    const SKEY='DEUDA_SESSION_NONCE';
    let isReload=false;
    try { const navs=performance.getEntriesByType && performance.getEntriesByType('navigation'); const nav=navs && navs[0];
      isReload = nav ? nav.type==='reload' : (performance.navigation && performance.navigation.type===performance.navigation.TYPE_RELOAD);
    } catch(_){}
    let nonce=null; try{ nonce=sessionStorage.getItem(SKEY);}catch(_){}
    if(!nonce || isReload){ nonce=Date.now().toString(36)+Math.random().toString(36).slice(2,7); try{ sessionStorage.setItem(SKEY,nonce);}catch(_){} }
    window.__DEUDA_SESSION_NONCE = nonce;
  })();
  (function ensurePersistLayerSession(){
    const desiredKey='ACT_DEUDA_PERSIST_'+(window.__DEUDA_SESSION_NONCE || 'session');
    const load=()=>{ try { return JSON.parse(localStorage.getItem(desiredKey)||'{}'); } catch(e){ return {}; } };
    const save=(patch)=>{ try{ const base=load(); localStorage.setItem(desiredKey, JSON.stringify({...base, ...patch})); }catch(e){} };
    const clear=()=>{ try{ localStorage.removeItem(desiredKey);}catch(e){} };
    if(!window.DeudaPersist || window.DeudaPersist.KEY !== desiredKey){ window.DeudaPersist = { KEY:desiredKey, load, save, clear }; }
  })();

  // Estilos (alineación, centrado y botón flotante)
  (function ensureRecapStyles(){
    const ID='deuda-recap-style'; if(document.getElementById(ID)) return;
    const css=document.createElement('style'); css.id=ID; css.textContent=`
      .tpl--actividad-deuda.fx-screen{
        font-family:inherit; position:relative; padding-bottom:84px;
        /* altura común de inicio para los 3 bloques clave */
        --align-top: 100px;
      }

      .deuda-header{margin-bottom:16px}
      .evento-banner{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:12px 16px;font-weight:800;font-size:18px;box-shadow:0 8px 24px rgba(0,0,0,.06);text-align:center}

      .fx-grid{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:20px;align-items:start}
      .fx-left{display:flex;flex-direction:column;gap:10px;align-items:center}
      .fx-center{display:flex;justify-content:center;align-items:flex-start}
      .fx-right{display:flex;flex-direction:column;align-items:center}

      /* Clase utilitaria para fijar la MISMA altura inicial */
      .align-top{ margin-top: var(--align-top); }

      /* Imagen centrada (sin empujes desiguales) */
      .visual-stage{
        display:flex;align-items:center;justify-content:center;
        height:clamp(300px, 54vh, 640px); width:100%;
        isolation:isolate;
        /* margen controlado por .align-top */
        margin-left: 30px;
      }
      .evento-imagen, .fx-image{max-width:100%;max-height:100%;object-fit:contain;display:block;background:transparent;border:0;box-shadow:none;border-radius:0;mix-blend-mode:multiply;}

      /* Derecha: tabla centrada */
      .tpl--actividad-deuda .fx-right{ width:100%; }
      .tpl--actividad-deuda .fx-right .tabla-wrap{
        position: relative;
        width:100%;
        display:flex;
        justify-content:center;
        align-items:flex-start; /* alinear top */
        /* margen controlado por .align-top */
      }

      /* OVERRIDE explícito para impedir que la tabla se estire a 100% */
      .tpl--actividad-deuda .fx-right .tabla-prestamos{
        width:auto !important;
        max-width:560px;
        margin:0 auto;
        border-collapse:separate;
        border-spacing:0;
        border:1px solid #e0e0e0;
        border-radius:12px;
        overflow:hidden;
      }
      .tpl--actividad-deuda .fx-right th,
      .tpl--actividad-deuda .fx-right td{ padding:10px 12px; border-bottom:1px solid #eee; text-align:left; }
      .tpl--actividad-deuda .fx-right thead th{ background:#fafafa; font-weight:700; }
      .tpl--actividad-deuda .fx-right tr:last-child td{ border-bottom:none; }

      /* 'ⓘ Pulsa para más información' */
      .loan-hint{
        margin-top:10px;
        color:#555; font-size:13px;
        display:flex-start;
      }
      .loan-hint .loan-info-btn{
        width:22px;height:22px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;
        background:#f1f5f9;border:1px solid #e2e8f0;box-shadow:0 1px 2px rgba(2,6,23,.04);color:#0f172a;font-weight:800;font-size:13px;line-height:1;cursor:pointer
      }

      /* Botón "Continuar" pequeño, verde claro, flotante esquina inferior derecha */
      .fx-bottom{
        position:absolute; right:24px; bottom:20px;
        display:flex; justify-content:flex-end; align-items:center;
        width:auto; margin:0; padding:0; background:transparent;
        pointer-events:auto;
      }
      .btn-option{padding:10px 18px;border-radius:12px;border:none;cursor:pointer;font-weight:700;font-size:15px}
      .btn-continue{
        background:#7be495; color:#083b0b;
        box-shadow:0 6px 16px rgba(0,0,0,.15);
        transition: transform .1s ease, filter .2s ease;
      }
      .btn-continue:hover{ transform:scale(1.03); filter:brightness(.95); }

      /* Columna izquierda: ancho controlado */
      :root { --deuda-left-w: 260px; }
      .fx-left .impatience-wrap, .fx-left .coins-wrap, .fx-left .btn-hint, .fx-left .recap-msg{ width:100%; max-width:var(--deuda-left-w); }
      .fx-left .impatience-bar{ width:100%; }
      .recap-msg{ white-space:pre-line; text-align:center; }

      /* Coins */
      .coins-wrap{ display:inline-flex; flex-direction:column; gap:6px; align-items:center; }
      .coins-badge{display:inline-flex;align-items:center;gap:10px;padding:10px 14px;min-width:88px;border-radius:14px;background:linear-gradient(135deg,#ffd776,#f2b93a);box-shadow:0 6px 18px rgba(0,0,0,.08);font-weight:800;font-size:28px;color:#111827}
      .coins-badge__num{line-height:1}
      .coins-badge__icon{width:26px;height:26px;object-fit:contain}

      /* Impaciencia (sin margen-top propio; usa .align-top) */
      .impatience-wrap{display:flex;flex-direction:column;gap:4px}
      .impatience-label{font-size:13px;color:#444;font-weight:600}
      .impatience-bar{position:relative;height:14px;border-radius:8px;overflow:hidden;background:#e0e0e0;box-shadow:inset 0 1px 3px rgba(0,0,0,.2)}
      .impatience-fill{height:100%;background:linear-gradient(90deg,#43a047,#2e7d32);width:0%}
      .impatience-fill.danger{background:linear-gradient(90deg,#e53935,#b71c1c)}
      .impatience-cap{position:absolute;top:0;bottom:0;width:3px;background:#111827;opacity:.4}
      .impatience-cap::after{content:'UMBRAL';position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;color:#11182799;letter-spacing:.4px}
    `; document.head.appendChild(css);
  })();
})();

SlideRendererRegistry.register('actividad-deuda-1-2', function (s, root) {
  const H  = window.DeudaHelpers;
  const st = H.ensureState();

  const isRow = (t)=>t && t.closest && t.closest('.tabla-prestamos tbody tr.row-clickable');
  const isBtn = (t)=>t && t.closest && t.closest('.btn-continue');
  const isInfo= (t)=>t && t.closest && t.closest('.loan-info-btn');
  const guardCapture=(e)=>{ const t=e.target; if(isRow(t)||isBtn(t)||isInfo(t)) return; e.stopPropagation(); e.preventDefault(); };
  ['click','pointerdown','pointerup','mousedown','mouseup'].forEach(evt=>root.addEventListener(evt, guardCapture, true));
  root.addEventListener('click',(e)=>{ e.stopPropagation(); }, false);

  root.classList.add('tpl--actividad-deuda','fx-screen');


  const header = H.el('div',{className:'deuda-header'}, H.el('div',{className:'evento-banner'}, H.txt(s.text || `Resumen de la semana ${st.week}`)));
  root.appendChild(header);

  // Origen animación saldo
  const prevSaldo = Number.isFinite(window.ACT_DEUDA_LAST_SALDO)
    ? Number(window.ACT_DEUDA_LAST_SALDO)
    : (st.fx && Number.isFinite(st.fx.saldoTo) ? Number(st.fx.saldoTo) : Number(st.saldo));

  // === COBRO de ingresos diferidos de PRÉSTAMO CONCEDIDO (solo aquí en 1-2) ===
  let ingresoPrestamos = 0;
  const duePrestamoNow = Array.isArray(st.incomes)
    ? st.incomes.filter(x => x.dueWeek === st.week && x.source === 'prestamo-concedido')
    : [];
  if (duePrestamoNow.length) {
    for (const inc of duePrestamoNow) {
      ingresoPrestamos += Number(inc.amount || 0);
      if (inc.loanId != null) {
        st.loans = (st.loans || []).filter(l => !(l.given && l.id === inc.loanId));
      }
    }
    st.saldo += ingresoPrestamos;
    st.incomes = st.incomes.filter(x => !(x.dueWeek === st.week && x.source === 'prestamo-concedido'));
  }
  // Paga semanal
  const paga = Number(s?.paga ?? 10);
  st.saldo += paga;

  // Tick de préstamos
  let nuevosImpagos = 0;
  for (const l of st.loans) {
    if (l.status === H.STATUS.ACTIVO) {
      l.weeksLeft = Math.max(0, (l.weeksLeft || 0) - 1);
      if (!l.given && l.weeksLeft === 0) {
        l.status = H.STATUS.IMPAGADO;
        l.amount = (l.amount || 0) + 5;
        nuevosImpagos++;
      }
    }
  }
  st.blocked = st.loans.some(l => !l.given && l.status === H.STATUS.IMPAGADO);
  st.week += 1;

  // Layout
  const body = H.el('div',{className:'fx-grid'});

  // Izquierda: Impaciencia + Saldo + frases (centrado)
  function makeSaldo(){
    const e=(t,p={},...c)=>{const n=document.createElement(t);for(const[k,v]of Object.entries(p)){if(k==='className')n.className=v;else if(k in n)n[k]=v;else n.setAttribute(k,v)};c.flat().forEach(x=>n.appendChild(x.nodeType?x:document.createTextNode(String(x))));return n};
    const coins=e('div',{className:'coins-badge'}, e('span',{className:'coins-badge__num'},'0'), e('img',{className:'coins-badge__icon',src:'../assets/icons/coin_ranking.png',alt:'🪙'}));
    const wrap=e('div',{className:'coins-wrap'}, coins); const num=coins.querySelector('.coins-badge__num'); return { node:wrap, set:(v)=>num.textContent=String(Number(v||0)) };
  }
  const saldoW = (H.makeSaldoWidget ? H.makeSaldoWidget({icon:'../assets/icons/coin_ranking.png'}) : makeSaldo());
  saldoW.set(prevSaldo);

  const impFill = H.el('div',{className:'impatience-fill'});
  const impBar  = H.el('div',{className:'impatience-bar'}, impFill);
  const impCap  = H.el('div',{className:'impatience-cap'});
  impBar.appendChild(impCap);
  const impWrap = H.el('div',{className:'impatience-wrap align-top'}, H.el('div',{className:'impatience-label'}, H.txt('Impaciencia')), impBar);

  const capPct = Number.isFinite(st.fx?.impatienceCap) ? Number(st.fx.impatienceCap) : 70;
  H.setImpatienceBar({ fillEl: impFill, capEl: impCap, valuePct: st.impatience || 0, capPct: capPct });

  const msgLines=[];
  msgLines.push(`\nHas cobrado tu paga semanal: ${H.formatEUR(paga)}.\n`);
  if (nuevosImpagos) msgLines.push(`\n${nuevosImpagos} préstamo(s) ha(n) vencido. +${H.PENALTY}€ de penalización. No puedes pedir nuevos préstamos.\n`);
  else if (st.blocked) msgLines.push('\nAún hay impagos. No puedes pedir nuevos préstamos.\n');
  else msgLines.push('\nTodo en orden. Puedes pedir préstamos si lo necesitas.\n');
  if (ingresoPrestamos > 0) {
    msgLines.push(`\nHas recibido ${H.formatEUR(ingresoPrestamos)} de la devolución de un préstamo concedido.\n`);
  }
  const recapMsg = H.el('div', { className: 'recap-msg' }, H.txt(msgLines.join('\n')));

  const left  = H.el('div',{className:'fx-left'}, impWrap, saldoW.node, recapMsg);

  // Centro: imagen centrada a la MISMA altura (align-top)
  const center= H.el('div',{className:'fx-center'},
    H.el('div',{className:'visual-stage align-top'},
      H.el('img',{className:'evento-imagen', src:s.image, alt:s.alt || 'Resumen'})
    )
  );

  // Derecha: tabla centrada + aviso
  const tbody=H.el('tbody');
  const table=H.el('table',{className:'tabla-prestamos table-loans'},
    H.el('thead',{}, H.el('tr',{}, H.el('th',{},H.txt('ID')), H.el('th',{},H.txt('Cantidad')), H.el('th',{},H.txt('Semanas')), H.el('th',{},H.txt('Estado')))), tbody
  );

  const tablaWrap = H.el('div',{className:'tabla-wrap align-top'}, table);

  // Aviso EXACTO
  const infoBtn = H.el('button',{
      className:'loan-info-btn', type:'button',
      title:'Información sobre la tabla', 'aria-label':'Información sobre la tabla'
    }, H.txt('i')
  );
  const loanHint = H.el('div',{className:'loan-hint'},
    infoBtn,
    H.el('strong',{}, H.txt('Pulsa para más información '))
  );

  const right=H.el('div',{className:'fx-right'}, tablaWrap, loanHint);

  // Acciones info
  function openLoansHelp(){
    if (window.DeudaHelpers && window.DeudaHelpers.openInfoModal) {
      window.DeudaHelpers.openInfoModal({
        title: '¿Cómo usar la tabla de préstamos?',
        message:
          '• Si un préstamo está Activo o Impagado, toca su fila para devolverlo.\n' +
          '• Al devolver, se descuenta del saldo la cantidad pendiente.\n' +
          '• Si no tienes saldo suficiente, se te avisará.\n' +
          '• Los préstamos que tú concediste aparecen marcados y no se devuelven desde aquí.\n' +
          '• El color de “Semanas” indica urgencia (verde → rojo).'
      });
    } else {
      alert('En la tabla puedes tocar filas Activo/Impagado para devolver el préstamo.');
    }
  }
  infoBtn.addEventListener('click', (ev)=>{ ev.stopPropagation(); openLoansHelp(); });
  table.addEventListener('click', (ev)=>{ if (!ev.target.closest('tbody tr.row-clickable')) openLoansHelp(); });

  // Botón Continuar (pequeño, verde claro, esquina inferior derecha)
  const bottomBar=H.el('div',{className:'fx-bottom'});
  const btnSeguir=H.el('button',{className:'btn-option btn-continue'}, H.txt('Continuar'));
  let shownSaldo = prevSaldo;
  btnSeguir.addEventListener('click', ()=>{ window.ACT_DEUDA_LAST_SALDO = shownSaldo; SlideActions.next(); });
  bottomBar.appendChild(btnSeguir);

  body.appendChild(left); body.appendChild(center); body.appendChild(right); body.appendChild(bottomBar); root.appendChild(body);

  // Tabla
  const refreshLoans = ()=>{ (H.fillLoansTable ? H.fillLoansTable(tbody, st.loans) : (function(){ tbody.innerHTML=''; if(!st.loans.length){ const tr=document.createElement('tr'); const td=document.createElement('td'); td.colSpan=4; td.textContent='Sin préstamos'; tr.appendChild(td); tbody.appendChild(tr); return; } st.loans.forEach(l=>{ const tr=document.createElement('tr'); [l.id, `€${l.amount}`, `${l.weeksLeft} sem.`, l.status].forEach(v=>{ const td=document.createElement('td'); td.textContent=String(v); tr.appendChild(td); }); if(l.status==='Activo'||l.status==='Impagado') tr.classList.add('row-clickable'); tbody.appendChild(tr); }); })()); };
  refreshLoans();
  if (window.DeudaHelpers.attachRepayHandler) {
    window.DeudaHelpers.attachRepayHandler({
      tbody, state: st,
      onAfterChange(){ saldoAnimFrom=shownSaldo; saldoAnimTo=st.saldo; startTs=null; requestAnimationFrame(stepSaldo); refreshLoans(); }
    });
  }

  // Animación saldo
  const msPerEuro=60, minMs=400, maxMs=2500;
  let saldoAnimFrom=prevSaldo, saldoAnimTo=st.saldo, startTs=null;
  function easeInOutCubic(x){ return x<0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3)/2; }
  const duration=Math.max(minMs, Math.min(maxMs, Math.abs(saldoAnimTo - saldoAnimFrom) * msPerEuro));
  function stepSaldo(ts){ if(startTs===null) startTs=ts; const p=Math.min(1,(ts-startTs)/duration); const v=Math.round(saldoAnimFrom + (saldoAnimTo - saldoAnimFrom)*easeInOutCubic(p)); shownSaldo=v; saldoW.set(v); if(p<1){ requestAnimationFrame(stepSaldo);} else { shownSaldo=saldoAnimTo; saldoW.set(saldoAnimTo); window.ACT_DEUDA_LAST_SALDO = saldoAnimTo; } }
  requestAnimationFrame(stepSaldo);
});
