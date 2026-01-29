
SlideRendererRegistry.register('actividad-deuda-1-3', function (s, root) {
  const H  = window.DeudaHelpers || {};
  const st = (H.ensureState ? H.ensureState() : (window.ACT_DEUDA_STATE || (window.ACT_DEUDA_STATE = { week:1, saldo:0, loans:[], incomes:[], impatience:0 })));

  // === Patch de estilos locales (no tocamos los de 1-1) ===
  (function ensureFxStyles(){
    const ID='deuda-fx-style-13-align'; if(document.getElementById(ID)) return;
    const css=document.createElement('style'); css.id=ID; css.textContent=`
            .tpl--actividad-deuda.fx-screen{font-family:inherit; position:relative; padding-bottom:84px; 
            /* altura común de inicio para los 3 bloques clave */
            --align-top: 100px;}

      .deuda-header{margin-bottom:16px}
      .evento-banner{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:12px 16px;font-weight:800;font-size:18px;box-shadow:0 8px 24px rgba(0,0,0,.06);text-align:center}

      .fx-grid{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:20px;align-items:start}
      .fx-left{display:flex;flex-direction:column;gap:10px;align-items:center}
      .fx-center{display:flex;justify-content:center;align-items:center}
      .fx-right{display:flex;flex-direction:column;align-items:center}

      /* Imagen centrada y un poco más baja para quedar más centrada visualmente */
      .visual-stage{
        display:flex;align-items:center;justify-content:center;
        height:clamp(300px, 54vh, 640px); width:100%;
        isolation:isolate;
        margin-top: 5px; 
        margin-left: 30px  
      }
      .evento-imagen, .fx-image{max-width:100%;max-height:100%;object-fit:contain;display:block;background:transparent;border:0;box-shadow:none;border-radius:0;mix-blend-mode:multiply;}

      /* === Tabla en la derecha, centrada (replicando 1-3 y venciendo regla global de 1-1) === */
      .tpl--actividad-deuda .fx-right{ width:100%; }
      .tpl--actividad-deuda .fx-right .tabla-wrap{
        position: relative;
        width:100%;
        display:flex;
        justify-content:center;     /* centra el contenido dentro de la columna */
        align-items:center;
        margin-top:200px;
      }
      /* OVERRIDE explícito sobre la regla global ".tpl--actividad-deuda .tabla-prestamos{width:100%}" de 1-1 */
      .tpl--actividad-deuda .fx-right .tabla-prestamos{
        width:auto !important;      /* ← clave para que deje de estirarse a todo el ancho */
        max-width:560px;
        margin:0 auto;              /* ← centra la tabla en el wrap */
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

      /* 'ⓘ Pulsa para más información' centrado bajo la tabla */
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

      /* Saldo e impaciencia (ancho controlado) */
      :root { --deuda-left-w: 260px; }
      .fx-left .impatience-wrap, .fx-left .coins-wrap, .fx-left .btn-hint, .fx-left .recap-msg{ width:100%; max-width:var(--deuda-left-w); }
      .fx-left .impatience-bar{ width:100%; }
      .recap-msg{ white-space:pre-line; text-align:center; }

      /* Coins */
      .coins-wrap{ display:inline-flex; flex-direction:column; gap:6px; align-items:center; }
      .coins-badge{display:inline-flex;align-items:center;gap:10px;padding:10px 14px;min-width:88px;border-radius:14px;background:linear-gradient(135deg,#ffd776,#f2b93a);box-shadow:0 6px 18px rgba(0,0,0,.08);font-weight:800;font-size:28px;color:#111827}
      .coins-badge__num{line-height:1}
      .coins-badge__icon{width:26px;height:26px;object-fit:contain}

      /* Impaciencia */
      .impatience-wrap{display:flex-start;flex-direction:column;gap:4px;margin-top:0px}
      .impatience-label{font-size:13px;color:#444;font-weight:600}
      .impatience-bar{position:relative;height:14px;border-radius:8px;overflow:hidden;background:#e0e0e0;box-shadow:inset 0 1px 3px rgba(0,0,0,.2)}
      .impatience-fill{height:100%;background:linear-gradient(90deg,#43a047,#2e7d32);width:0%}
      .impatience-fill.danger{background:linear-gradient(90deg,#e53935,#b71c1c)}
      .impatience-cap{position:absolute;top:0;bottom:0;width:3px;background:#111827;opacity:.4}
      .impatience-cap::after{content:'UMBRAL';position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;color:#11182799;letter-spacing:.4px}
    
    `; document.head.appendChild(css);
  })();

  // Helper barra (verde/rojo + cap)
  function setImpatienceBar({ fillEl, capEl, valuePct, capPct }){
    const v = Math.min(100, Math.max(0, Number(valuePct||0)));
    const cap = Math.min(100, Math.max(0, Number(capPct||70)));
    fillEl.style.width = v + '%';
    capEl.style.left = cap + '%';
    if (v >= cap) fillEl.classList.add('danger'); else fillEl.classList.remove('danger');
  }

  // Guardas: permite filas, botón continuar y botón info
  const isRow = (t)=>t && t.closest && t.closest('.tabla-prestamos tbody tr.row-clickable');
  const isBtn = (t)=>t && t.closest && t.closest('.btn-continue');
  const isInfo= (t)=>t && t.closest && t.closest('.loan-info-btn');
  const guardCapture=(e)=>{ const t=e.target; if(isRow(t)||isBtn(t)||isInfo(t)) return; e.stopPropagation(); e.preventDefault(); };
  ['click','pointerdown','pointerup','mousedown','mouseup'].forEach(evt=>root.addEventListener(evt, guardCapture, true));
  root.addEventListener('click',(e)=>{ e.stopPropagation(); }, false);

  root.classList.add('tpl--actividad-deuda');

  const fx = st.fx || {};
  const title  = s?.text  || fx.title || 'Aplicando tu decisión…';
  const imgSrc = (st.lastAction?.type==='rechazar' ? (s?.event?.imageRejected || fx.image || s?.image) : (fx.image || s?.image));

  // Ingresos que caen esta semana (no provenientes de prestamo-concedido)
  let ingresoTotal = 0;
  const dueNow = Array.isArray(st.incomes)
    ? st.incomes.filter(x => x.dueWeek === st.week && x.source !== 'prestamo-concedido')
    : [];
  if (dueNow.length) {
    for (const inc of dueNow) ingresoTotal += Number(inc.amount || 0);
    st.saldo += ingresoTotal;
    st.incomes = st.incomes.filter(x => !(x.dueWeek === st.week && x.source !== 'prestamo-concedido'));
  }

  // Saldo animación: from → to
  const saldoFrom = Number(
    (fx.saldoFrom !== undefined && fx.saldoFrom !== null)
      ? fx.saldoFrom
      : (Number.isFinite(window.ACT_DEUDA_LAST_SALDO) ? window.ACT_DEUDA_LAST_SALDO : st.saldo)
  );
  const saldoTo = Number(st.saldo);

  const loansForTable = Array.isArray(fx.loansAfter) ? fx.loansAfter : st.loans;

  // Impaciencia animada + cap
  const impFrom = Number.isFinite(fx.impatienceFrom) ? Number(fx.impatienceFrom) : (st.impatience||0);
  const impTo   = Number.isFinite(fx.impatienceTo)   ? Number(fx.impatienceTo)   : (st.impatience||0);
  const impCap  = Number.isFinite(fx.impatienceCap)  ? Number(fx.impatienceCap)  : 70;

  // ===== Header =====
  const header = (H.el ? H.el('div',{className:'deuda-header'}, H.el('div',{className:'evento-banner'}, H.txt(title)))
                       : (function(){const d=document.createElement('div'); d.className='deuda-header'; const b=document.createElement('div'); b.className='evento-banner'; b.textContent=title; d.appendChild(b); return d;})());
  root.appendChild(header);

  // ===== Body con las mismas columnas que 1-1 =====
  const body = (H.el? H.el('div',{className:'deuda-body'}) : (function(){const d=document.createElement('div'); d.className='deuda-body'; return d;})());

  // --- IZQUIERDA: Impaciencia + Saldo ---
  function makeLocalSaldoWidget(){
    const elx=(t,p={},...c)=>{const n=document.createElement(t);for(const[k,v]of Object.entries(p||{})){if(k==='className')n.className=v; else if(k in n)n[k]=v; else n.setAttribute(k,v)}; for(const ch of c.flat()){if(ch==null)continue; n.appendChild(ch.nodeType?ch:document.createTextNode(String(ch)))}; return n};
    const coins=elx('div',{className:'coins-badge'}, elx('span',{className:'coins-badge__num'},'0'), elx('img',{className:'coins-badge__icon',alt:'Monedas',src:'../assets/icons/coin_ranking.png'}));
    const wrap=elx('div',{className:'coins-wrap'}, coins); const valueEl=coins.querySelector('.coins-badge__num');
    return { node:wrap, set:(v)=>{ valueEl.textContent = String(Number(v||0)); } };
  }
  const saldoW = (H.makeSaldoWidget ? H.makeSaldoWidget({ icon:'../assets/icons/coin_ranking.png' }) : makeLocalSaldoWidget());
  saldoW.set(saldoFrom);

  const impFill = (H.el? H.el('div',{className:'impatience-fill'}) : (function(){const d=document.createElement('div'); d.className='impatience-fill'; return d;})());
  const impBar  = (H.el? H.el('div',{className:'impatience-bar'}, impFill) : (function(){const d=document.createElement('div'); d.className='impatience-bar'; d.appendChild(impFill); return d;})());
  const impCapEl= (H.el? H.el('div',{className:'impatience-cap'}) : (function(){const d=document.createElement('div'); d.className='impatience-cap'; return d;})());
  impBar.appendChild(impCapEl);
  const impWrap = (H.el? H.el('div',{className:'impatience-wrap'}, H.el('div',{className:'impatience-label'}, H.txt('Impaciencia')), impBar)
                      : (function(){const w=document.createElement('div'); w.className='impatience-wrap align-top'; const l=document.createElement('div'); l.className='impatience-label'; l.textContent='Impaciencia'; w.appendChild(l); w.appendChild(impBar); return w;})());

  const msgLines=[]; if (ingresoTotal > 0) msgLines.push(`\n💰 Has recibido un ingreso ${H.formatEUR?H.formatEUR(ingresoTotal):`€${ingresoTotal}`} por la actividad de la semana anterior.\n`);
  const recapMsg = (H.el? H.el('div',{className:'btn-hint'}, H.txt(msgLines.join('\n'))) : (function(){const d=document.createElement('div'); d.className='btn-hint'; d.textContent=msgLines.join('\n'); return d;})());

  const leftCol = (H.el? H.el('div',{className:'deuda-col left'}, impWrap, saldoW.node, recapMsg)
                       : (function(){const d=document.createElement('div'); d.className='deuda-col left'; d.appendChild(impWrap); d.appendChild(saldoW.node); d.appendChild(recapMsg); return d;})());

  // --- CENTRO: Imagen (misma visual-stage de 1-1) ---
  const centerCol = (H.el
    ? H.el('div',{className:'deuda-col center align-top'},
        H.el('div',{className:'visual-stage'},
          H.el('img',{className:'fx-image', src: imgSrc || s?.image, alt: 'Efecto'})
        )
      )
    : (function(){const d=document.createElement('div'); d.className='deuda-col center';
        const stage=document.createElement('div'); stage.className='visual-stage';
        const i=document.createElement('img'); i.className='fx-image'; i.src=(imgSrc || s?.image); i.alt='Efecto';
        stage.appendChild(i); d.appendChild(stage); return d; })()
  );

  // --- DERECHA: Tabla + texto de información EXACTO como 1-1 ---
  const tbody = (H.el? H.el('tbody') : document.createElement('tbody'));
  const table = (H.el? H.el('table',{className:'tabla-prestamos table-loans'},
    H.el('thead',{}, H.el('tr',{}, H.el('th',{},H.txt('ID')), H.el('th',{},H.txt('Cantidad')), H.el('th',{},H.txt('Semanas')), H.el('th',{},H.txt('Estado')))), tbody)
    : (function(){const t=document.createElement('table'); t.className='tabla-prestamos table-loans'; const thead=document.createElement('thead'); const tr=document.createElement('tr'); ['ID','Cantidad','Semanas','Estado'].forEach(h=>{const th=document.createElement('th'); th.textContent=h; tr.appendChild(th)}); thead.appendChild(tr); t.appendChild(thead); t.appendChild(tbody); return t;})());

  // === Botón ℹ️ y loan-hint (copiado de 1-1) ===
  const infoBtn = (H.el
    ? H.el('button',{ className:'loan-info-btn', type:'button', title:'Información sobre la tabla', 'aria-label':'Información sobre la tabla' }, H.txt('i'))
    : (function(){const b=document.createElement('button'); b.className='loan-info-btn'; b.type='button'; b.title='Información sobre la tabla'; b.setAttribute('aria-label','Información sobre la tabla'); b.textContent='i'; return b;})()
  );

  const tablaWrap = (H.el? H.el('div',{className:'tabla-wrap align-top'}, table)
                      : (function(){const d=document.createElement('div'); d.className='tabla-wrap'; d.appendChild(table); return d;})());

  // loan-hint EXACTO (i + "Pulsa para más información ")
  const loanHint = (H.el
    ? H.el('div',{className:'loan-hint'}, infoBtn, H.el('strong',{}, H.txt('Pulsa para más información ')))
    : (function(){const d=document.createElement('div'); d.className='loan-hint'; d.appendChild(infoBtn); const s=document.createElement('strong'); s.textContent='Pulsa para más información '; d.appendChild(s); return d;})()
  );

  const rightCol = (H.el? H.el('div',{className:'deuda-col right'}, tablaWrap, loanHint)
                        : (function(){const d=document.createElement('div'); d.className='deuda-col right'; d.appendChild(tablaWrap); d.appendChild(loanHint); return d;})());

  function openLoansHelp(){
    if (H.openInfoModal) {
      H.openInfoModal({
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

  // --- BOTTOM: Continuar flotante ---
  const bottomBar = (H.el? H.el('div',{className:'fx-bottom'}) : (function(){const d=document.createElement('div'); d.className='fx-bottom'; return d;})());
  const btnSeguir = (H.el? H.el('button',{className:'btn-option btn-continue'}, H.txt('Continuar'))
                         : (function(){const b=document.createElement('button'); b.className='btn-option btn-continue'; b.textContent='Continuar'; return b;})());
  let currentShown = saldoFrom;
  btnSeguir.addEventListener('click', () => {
    window.ACT_DEUDA_LAST_SALDO = currentShown;
    if (typeof impShown === 'number' && Number.isFinite(impShown)) st.impatience = impShown;
    SlideActions.next();
  });
  bottomBar.appendChild(btnSeguir);

  // Montaje final
  body.appendChild(leftCol);
  body.appendChild(centerCol);
  body.appendChild(rightCol);
  root.appendChild(body);
  root.appendChild(bottomBar);

  // ----- Relleno tabla -----
  if (H.fillLoansTable) H.fillLoansTable(tbody, loansForTable);
  else {
    tbody.innerHTML='';
    if(!loansForTable || !loansForTable.length){
      const tr=document.createElement('tr'); const td=document.createElement('td'); td.colSpan=4; td.textContent='Sin préstamos'; tr.appendChild(td); tbody.appendChild(tr);
    } else {
      loansForTable.forEach(l=>{ const tr=document.createElement('tr'); [l.id, `€${l.amount}`, `${l.weeksLeft} sem.`, l.status].forEach(v=>{const td=document.createElement('td'); td.textContent=String(v); tr.appendChild(td)}); tbody.appendChild(tr); });
    }
  }

  // ----- Barra de impaciencia: estado inicial + animación -----
  setImpatienceBar({ fillEl: impFill, capEl: impCapEl, valuePct: impFrom, capPct: impCap });

  const impMinMs=250, impMaxMs=900;
  const impDiff=Math.abs(impTo - impFrom);
  const impDur=Math.max(impMinMs, Math.min(impMaxMs, impDiff*20));
  let impStart=null;
  let impShown = impFrom;
  function stepImp(ts){
    if(impStart===null) impStart=ts;
    const p=Math.min(1,(ts-impStart)/impDur);
    const val=Math.round(impFrom + (impTo - impFrom)*p);
    impShown = val;
    setImpatienceBar({ fillEl: impFill, capEl: impCapEl, valuePct: val, capPct: impCap });
    if(p<1) requestAnimationFrame(stepImp);
    else {
      st.impatience = impTo;
      setImpatienceBar({ fillEl: impFill, capEl: impCapEl, valuePct: impTo, capPct: impCap });
    }
  }
  requestAnimationFrame(stepImp);

  // ----- Animación saldo (from → to) -----
  const msPerEuro=60, minMs=400, maxMs=2500;
  let startTs=null;
  const duration=Math.max(minMs, Math.min(maxMs, Math.abs(saldoTo - saldoFrom) * msPerEuro));
  function easeInOutCubic(x){ return x<0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3)/2; }
  function stepSaldo(ts){ if(startTs===null) startTs=ts; const p=Math.min(1,(ts-startTs)/duration); const v=Math.round(saldoFrom + (saldoTo - saldoFrom)*easeInOutCubic(p)); currentShown=v; saldoW.set(v); if(p<1) requestAnimationFrame(stepSaldo); else { currentShown=saldoTo; saldoW.set(saldoTo); } }
  requestAnimationFrame(stepSaldo);
});
