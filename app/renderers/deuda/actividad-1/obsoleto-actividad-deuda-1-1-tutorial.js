// =====================================================
// actividad-deuda-1-1-tutorial.js — Variante guiada del 1-1 (tutorial)
// (Contraste reducido + limpieza de modo "Fin")
// =====================================================

(function ensureTutorialStyles(){ 
  const ID = 'deuda-11t-style'; if (document.getElementById(ID)) return;
  const css = document.createElement('style'); css.id = ID;
  css.textContent = `
    .tpl--actividad-deuda[data-render="1-1t"]{ position:relative; }

    .tut-glow{
      position:relative; z-index:11015 !important;
      outline:2px solid #5eead4;
      box-shadow:0 0 0 4px rgba(94,234,212,.18), 0 6px 22px rgba(0,0,0,.14);
      border-radius:14px; animation:tutPulse 1.4s ease-in-out infinite;
    }
    .tut-glow-soft{
      position:relative; z-index:11015 !important;
      outline:1.5px solid #22d3ee;
      box-shadow:0 0 0 8px rgba(34,211,238,.12);
      border-radius:12px; animation:tutPulseSoft 1.6s ease-in-out infinite;
    }
    @keyframes tutPulse{
      0%{   box-shadow:0 0 0 4px rgba(94,234,212,.18), 0 6px 22px rgba(0,0,0,.14); }
      50%{  box-shadow:0 0 0 8px rgba(94,234,212,.14), 0 8px 28px rgba(0,0,0,.18); }
      100%{ box-shadow:0 0 0 4px rgba(94,234,212,.18), 0 6px 22px rgba(0,0,0,.14); }
    }
    @keyframes tutPulseSoft{
      0%{   box-shadow:0 0 0 8px rgba(34,211,238,.10); }
      50%{  box-shadow:0 0 0 12px rgba(34,211,238,.16); }
      100%{ box-shadow:0 0 0 8px rgba(34,211,238,.10); }
    }

    /* Overlay con menos contraste y blur ligero para no oscurecer la UI */
    .tut-overlay{
      position:fixed; inset:0;
      background:rgba(15,23,42,.22);
      backdrop-filter:saturate(1.05) blur(1.5px) brightness(1.05);
      -webkit-backdrop-filter:saturate(1.05) blur(1.5px) brightness(1.05);
      z-index:11010;
    }
    .tut-hole{
      position:fixed; border-radius:16px; pointer-events:none;
      outline:9999px solid rgba(15,23,42,.22);
      z-index:11012;
    }

    /* TIP / CALLOUT con flecha, más ligero y translúcido */
    .tut-tip{
      position:fixed; z-index:11020;
      background:rgba(17,24,39,.92); /* #111827 con opacidad */
      color:#ecfeff;
      font-weight:700; font-size:14px; line-height:1.35; padding:10px 12px;
      border-radius:10px; box-shadow:0 10px 28px rgba(0,0,0,.22);
      max-width:min(360px,90vw);
      display:inline-flex; align-items:center; gap:10px;
    }
    .tut-tip__arrow{
      width:0; height:0; flex:0 0 auto;
      border-top:8px solid transparent; border-bottom:8px solid transparent;
    }
    .tut-tip--right .tut-tip__arrow{ border-right:0; border-left:10px solid rgba(17,24,39,.92); }
    .tut-tip--left  .tut-tip__arrow{ border-left:0;  border-right:10px solid rgba(17,24,39,.92); }
    .tut-tip--up    .tut-tip__arrow{ border-left:8px solid transparent; border-right:8px solid transparent; border-bottom:10px solid rgba(17,24,39,.92); }
    .tut-tip--down  .tut-tip__arrow{ border-left:8px solid transparent; border-right:8px solid transparent; border-top:10px solid rgba(17,24,39,.92); }

    /* Tip secundaria */
    .tut-tip--secondary{
      position:fixed; z-index:11020;
      background:rgba(11,18,32,.9); color:#e6fbff;
      font-weight:700; font-size:13px; line-height:1.3; padding:8px 10px;
      border-radius:8px; box-shadow:0 8px 22px rgba(0,0,0,.2);
      max-width:min(340px,90vw);
      display:inline-flex; align-items:center; gap:8px;
    }
    .tut-tip--secondary .tut-tip__arrow{
      border-top:7px solid transparent; border-bottom:7px solid transparent;
    }
    .tut-tip--secondary.tut-tip--right .tut-tip__arrow{ border-left:9px solid rgba(11,18,32,.9); }
    .tut-tip--secondary.tut-tip--left  .tut-tip__arrow{ border-right:9px solid rgba(11,18,32,.9); }
    .tut-tip--secondary.tut-tip--up    .tut-tip__arrow{ border-left:7px solid transparent; border-right:7px solid transparent; border-bottom:9px solid rgba(11,18,32,.9); }
    .tut-tip--secondary.tut-tip--down  .tut-tip__arrow{ border-left:7px solid transparent; border-right:7px solid transparent; border-top:9px solid rgba(11,18,32,.9); }

    .coins-badge.coin-pulse { animation: coinPulse .5s ease-in-out 1; }
    @keyframes coinPulse { 0%{transform:scale(1)} 40%{transform:scale(1.08)} 100%{transform:scale(1)} }
    .saldo-flyout{
      position:absolute; right:-6px; top:-10px; font-weight:800; font-size:14px;
      background:#111827; color:#ecfeff; padding:6px 8px; border-radius:10px;
      opacity:0; transform:translateY(6px); pointer-events:none;
    }
    .saldo-flyout.show{ opacity:1; transform:translateY(0); transition:opacity .25s ease, transform .25s ease; }

    /* Burbuja delta (saldo e impaciencia) */
    .tpl--actividad-deuda[data-render="1-1t"] .coins-wrap{ position:relative; }
    .tpl--actividad-deuda[data-render="1-1t"] .impatience-wrap{ position:relative; }
    .tpl--actividad-deuda[data-render="1-1t"] .coins-wrap .coins-float{
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
      opacity:0;
      pointer-events:none;
    }
    .tpl--actividad-deuda[data-render="1-1t"] .coins-wrap .coins-float.coins-float--neg{
      --coins-float-bg: linear-gradient(135deg, #ef4444, #f97316);
    }
    .tpl--actividad-deuda[data-render="1-1t"] .coins-wrap .coins-float.is-on{
      animation: deudaCoinsFloat 1.45s ease-out forwards;
    }
    @keyframes deudaCoinsFloat{
      0%   { transform: translate(-50%, 0) scale(.96); opacity: 0; }
      20%  { transform: translate(-50%, -8px) scale(1.04); opacity: 1; }
      100% { transform: translate(-50%, -40px) scale(1.08); opacity: 0; }
    }
    .tpl--actividad-deuda[data-render="1-1t"] .impatience-float{
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
    .tpl--actividad-deuda[data-render="1-1t"] .impatience-float.is-on{
      animation: deudaImpFloat 1.45s ease-out forwards;
    }
    @keyframes deudaImpFloat{
      0%   { transform: translate(0, 0) scale(.96); opacity: 0; }
      20%  { transform: translate(0, -8px) scale(1.04); opacity: 1; }
      100% { transform: translate(0, -40px) scale(1.08); opacity: 0; }
    }

    /* Modales por encima del overlay del tutorial */
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:12000}
    .modal{width:min(480px,92vw);background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.25);padding:20px 22px;font-family:inherit; z-index:12010}
    .modal-title{margin:0 0 4px;font-size:18px;font-weight:700}
    .modal-subtitle{margin:0 0 16px;font-size:14px;color:#555}
    .modal-input-row{display:grid;grid-template-columns:1fr 160px;align-items:center;gap:12px;margin-bottom:8px}
    .modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:14px}
    .btn-primary,.btn-secondary{padding:10px 14px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;cursor:pointer}
    .btn-primary{background:#0ea5e9;color:white;border-color:#0284c7}
    .modal-error{margin:8px 0 0;color:#b91c1c;font-weight:700;font-size:13px}

    .table-flash{
      position:relative;
      outline:2px solid #22d3ee;
      box-shadow:0 0 0 8px rgba(34,211,238,.14), 0 10px 26px rgba(0,0,0,.18);
      border-radius:12px;
      animation: tableFlash 0.6s ease-out 1;
    }
    @keyframes tableFlash {
      0%   { outline-width:0px; box-shadow:0 0 0 0 rgba(34,211,238,0.0); }
      25%  { outline-width:2px; box-shadow:0 0 0 10px rgba(34,211,238,.16); }
      100% { outline-width:2px; box-shadow:0 0 0 0 rgba(34,211,238,0.0); }
    }

    .tut-arrow { position: fixed; z-index: 11020; width: 26px; height: 26px; border-right: 4px solid #22d3ee; border-bottom: 4px solid #22d3ee; transform: rotate(45deg); filter: drop-shadow(0 6px 14px rgba(0,0,0,.18)); }

    tr.tut-row-pulse { position: relative; outline: 2px solid rgba(34,211,238,.75); animation: tutRowPulse 1.2s ease-in-out infinite; border-radius: 8px; }
    @keyframes tutRowPulse { 0%{ box-shadow:0 0 0 0 rgba(34,211,238,.18);} 50%{ box-shadow:0 0 0 8px rgba(34,211,238,.10);} 100%{ box-shadow:0 0 0 0 rgba(34,211,238,.18);} }

    /* Oculta la imagen pero conserva su espacio en el layout */
    .tpl--actividad-deuda[data-render="1-1t"] .deuda-col.center .fx-image{
        visibility: hidden;
        pointer-events: none;
    }

    /* Solo la nube (evento-banner) por encima del overlay */
    .tpl--actividad-deuda[data-render="1-1t"] .deuda-header{ position:relative; z-index:auto; }
    .tpl--actividad-deuda[data-render="1-1t"] .deuda-header .evento-banner,
    .tpl--actividad-deuda[data-render="1-1t"] .deuda-header .tut-header-ontop{
      position:relative;
      z-index:11005 !important;
      box-shadow:none !important;
      outline:none !important;
    }

    /* Elevar elementos sobre overlay */
    .tut-ontop { position: relative !important; z-index: 11018 !important; }

    /* Highlight suave del texto del header */
    .tpl--actividad-deuda[data-render="1-1t"] .deuda-header .evento-banner.tut-header-txtglow{
      position: relative;
      z-index: 11020 !important;       /* por encima del overlay */
      /* brillo de texto legible sin excesivo contraste */
      text-shadow:
        0 1px 0 rgba(255,255,255,.35),
        0 0 10px rgba(34,211,238,.35),
        0 0 18px rgba(34,211,238,.28);
      /* leve halo externo para separar del fondo */
      filter:
        drop-shadow(0 0 2px rgba(255,255,255,.25))
        drop-shadow(0 4px 18px rgba(34,211,238,.20));
    }

  `;
  document.head.appendChild(css);
})();

SlideRendererRegistry.register('actividad-deuda-1-1-tutorial', function (s, root) {
  const H  = window.DeudaHelpers || {};
  const st = (H.ensureState ? H.ensureState() : (window.ACT_DEUDA_STATE || (window.ACT_DEUDA_STATE = { week:1, saldo:10, loans:[], nextLoanId:1, blocked:false, lastAction:null, incomes:[], impatience:0 })));

  root.classList.add('tpl--actividad-deuda');
  root.setAttribute('data-render','1-1t');

  // === Config general
  const cost           = Number(s?.event?.cost || 0);
  const loanWeeksHint  = Number(s?.event?.loanWeeks || 2);
  const activityWeeks  = Number(s?.event?.activityWeeks || s?.event?.weeks || 8);
  const MAX_LOAN_WEEKS = 3;

  // === Impaciencia (misma interfaz que 1-1)
  const impCfg = (s?.event?.impatience) || {};
  const DELTA_PAY    = Number(impCfg.deltaOnPay    ?? -35);
  const DELTA_REJECT = Number(impCfg.deltaOnReject ?? +75);
  const CAP_PCT      = Math.max(0, Math.min(100, Number(impCfg.capPct ?? st.fx?.impatienceCap ?? 100)));
  const clamp = (v,min,max)=>Math.min(max,Math.max(min,v));

  // Header
  const header = H.el
    ? H.el('div',{className:'deuda-header'}, H.el('div',{className:'evento-banner'}, H.txt(s?.text || `Semana ${st.week}: Tutorial`)))
    : (()=>{ const d=document.createElement('div'); d.className='deuda-header';
        const b=document.createElement('div'); b.className='evento-banner'; b.textContent=s?.text || `Semana ${st.week}: Tutorial`;
        d.appendChild(b); return d; })();
  const banner = header.querySelector('.evento-banner');
  if (banner) banner.classList.add('tut-header-ontop'); banner.classList.add('tut-header-txtglow');

  root.appendChild(header);

  // Body
  const body = H.el ? H.el('div',{className:'deuda-body'}) : (()=>{const d=document.createElement('div'); d.className='deuda-body'; return d;})();
  const impFill=(H.el?H.el('div',{className:'impatience-fill'}):(()=>{const n=document.createElement('div');n.className='impatience-fill';return n;})());
  const impBar =(H.el?H.el('div',{className:'impatience-bar'},impFill):(()=>{const n=document.createElement('div');n.className='impatience-bar';n.appendChild(impFill);return n;})());
  const impCap =(H.el?H.el('div',{className:'impatience-cap'}):(()=>{const n=document.createElement('div');n.className='impatience-cap';return n;})());
  impBar.appendChild(impCap);
  const setImp = H.setImpatienceBar || function({fillEl,capEl,valuePct,capPct}){ const v=Math.min(100,Math.max(0,Number(valuePct||0))); const cap=Math.min(100,Math.max(0,Number(capPct||70))); fillEl.style.width=v+'%'; capEl.style.left=cap+'%'; if(v>=cap) fillEl.classList.add('danger'); else fillEl.classList.remove('danger'); };
  setImp({ fillEl:impFill, capEl:impCap, valuePct:st.impatience||0, capPct:CAP_PCT });

  // Saldo (badge)
  const saldoW = H.makeSaldoWidget
    ? H.makeSaldoWidget({ icon:'../assets/icons/coin_ranking.webp' })
    : (function(){ const wrap=document.createElement('div'); wrap.className='coins-wrap';
        const badge=document.createElement('div'); badge.className='coins-badge';
        const num=document.createElement('span'); num.className='coins-badge__num'; num.textContent='0';
        const ic=document.createElement('img'); ic.className='coins-badge__icon'; ic.src='../assets/icons/coin_ranking.webp'; ic.alt='Monedas';
        badge.appendChild(num); badge.appendChild(ic); wrap.appendChild(badge);
        return { node:wrap, set:(v)=>{ num.textContent=String(Number(v||0)); }, badge };
      })();
  saldoW.set(st.saldo);
  const saldoBadge = saldoW.node.querySelector?.('.coins-badge') || saldoW.badge || saldoW.node;

  // Feedback rápido de saldo
  let flyout;
  if (saldoBadge) { flyout=document.createElement('div'); flyout.className='saldo-flyout'; saldoBadge.style.position='relative'; saldoBadge.appendChild(flyout); }
  const fmtDelta = (n)=>{ const sign = n>0?'+':(n<0?'-':'±'); return `${sign}${Math.abs(n)}`; };
  const saldoFeedback = (text, delta)=>{
    if(!saldoBadge||!flyout) return;
    flyout.textContent=text;
    flyout.classList.add('show');
    saldoBadge.classList.add('coin-pulse');
    if (Number.isFinite(delta)) showSaldoBubble(delta);
    setTimeout(()=>{ flyout.classList.remove('show'); saldoBadge.classList.remove('coin-pulse'); }, 600);
  };

  function showSaldoBubble(delta){
    if (!saldoW?.node || !Number.isFinite(delta) || delta === 0) return;
    const bubble = document.createElement('div');
    bubble.className = 'coins-float';
    if (delta < 0) bubble.classList.add('coins-float--neg');
    bubble.textContent = fmtDelta(delta);
    saldoW.node.appendChild(bubble);
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

  // Controles
  const btnPagar    = H.el ? H.el('button',{className:'btn-option btn-pay'   , dataset:{action:'pagar'}},     H.txt('Pagar'))          : (()=>{const x=document.createElement('button'); x.className='btn-option btn-pay';     x.dataset.action='pagar';    x.textContent='Pagar'; return x;})();
  const btnPedir    = H.el ? H.el('button',{type:'button', className:'btn-option btn-loan'  , dataset:{action:'pedir-tutorial'}}, H.txt('Pedir préstamo')) : (()=>{const x=document.createElement('button'); x.type='button'; x.className='btn-option btn-loan';    x.dataset.action='pedir';    x.textContent='Pedir préstamo'; return x;})();
  const btnRechazar = H.el ? H.el('button',{className:'btn-option btn-decline', dataset:{action:'rechazar'}},  H.txt('Rechazar'))       : (()=>{const x=document.createElement('button'); x.className='btn-option btn-decline'; x.dataset.action='rechazar'; x.textContent='Rechazar'; return x;})();

  const impWrap = H.el
    ? H.el('div',{className:'impatience-wrap'}, H.el('div',{className:'impatience-label'}, H.txt('Impaciencia')), impBar)
    : (()=>{ const w=document.createElement('div'); w.className='impatience-wrap';
        const l=document.createElement('div'); l.className='impatience-label'; l.textContent='Impaciencia';
        w.appendChild(l); w.appendChild(impBar); return w; })();

  const left = H.el
    ? H.el('div',{className:'deuda-col left'}, impWrap, saldoW.node, btnPagar, btnPedir, btnRechazar)
    : (()=>{ const d=document.createElement('div'); d.className='deuda-col left';
        d.appendChild(impWrap); d.appendChild(saldoW.node); d.appendChild(btnPagar); d.appendChild(btnPedir); d.appendChild(btnRechazar); return d; })();

  const center = H.el
    ? H.el('div',{className:'deuda-col center'}, H.el('div',{className:'visual-stage'}, H.el('img',{className:'fx-image', src: s?.image || './assets/deuda/default.png', alt: s?.alt || 'Situación'})))
    : (()=>{ const d=document.createElement('div'); d.className='deuda-col center'; const vs=document.createElement('div'); vs.className='visual-stage'; const img=document.createElement('img'); img.className='fx-image'; img.src=s?.image||'./assets/deuda/default.png'; img.alt=s?.alt||'Situación'; vs.appendChild(img); d.appendChild(vs); return d; })();

  // Tabla préstamos
  const tbody = H.el ? H.el('tbody') : document.createElement('tbody');
  const table = H.el
    ? H.el('table',{className:'tabla-prestamos table-loans'}, H.el('thead',{}, H.el('tr',{}, H.el('th',{},H.txt('ID')), H.el('th',{},H.txt('Cantidad')), H.el('th',{},H.txt('Semanas')), H.el('th',{},H.txt('Estado')))), tbody)
    : (()=>{ const t=document.createElement('table'); t.className='tabla-prestamos table-loans';
        const thead=document.createElement('thead'); const tr=document.createElement('tr');
        ['ID','Cantidad','Semanas','Estado'].forEach(h=>{ const th=document.createElement('th'); th.textContent=h; tr.appendChild(th); });
        thead.appendChild(tr); t.appendChild(thead); t.appendChild(tbody); return t; })();
  const right = H.el ? H.el('div',{className:'deuda-col right'}, table) : (()=>{ const d=document.createElement('div'); d.className='deuda-col right'; d.appendChild(table); return d; })();

  body.appendChild(left); body.appendChild(center); body.appendChild(right); root.appendChild(body);

  // Relleno tabla
  const fillLoans = H.fillLoansTable || function(tbody, loans){
    tbody.innerHTML='';
    if(!loans || !loans.length){
      const tr=document.createElement('tr'); const td=document.createElement('td');
      td.colSpan=4; td.textContent='Sin préstamos'; tr.appendChild(td); tbody.appendChild(tr); return;
    }
    for(const l of loans){
      const tr=document.createElement('tr');
      tr.classList.add('row-clickable');   // devoluciones clicando fila
      tr.dataset.id = String(l.id);
      [l.id, `€${Number(l.amount||0)}`, `${l.weeksLeft} sem.`, l.status].forEach(v=>{
        const td=document.createElement('td'); td.textContent=String(v); tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
  };
  fillLoans(tbody, st.loans || []);

  // ===== Tutorial UI =====
  const tut = Object.assign({ step:'', text:'', block:true, autoNext:false, nextStep:null, tablaText:'Se registró el nuevo préstamo' }, s?.tutorial || {});
  let overlayTut=null, hole=null, tip=null, currentTarget=null;

  // Segundo hole y tip
  let hole2=null, tip2same=null;

  // Tip secundaria normal
  let secondaryTarget=null, tip2=null;

  // --- Saldo e Impaciencia siempre visibles sobre overlay ---
  let saldoHole=null, impHole=null;
  function rectToInset(r, pad=6){
    return `${Math.max(0,r.top-pad)}px ${Math.max(0,window.innerWidth-r.right-pad)}px ${Math.max(0,window.innerHeight-r.bottom-pad)}px ${Math.max(0,r.left-pad)}px`;
  }
  function ensureSaldoElevated(){
    try{
      if (!saldoBadge) return;
      saldoBadge.classList.add('tut-ontop','tut-glow-soft');
      if (!saldoHole){ saldoHole=document.createElement('div'); saldoHole.className='tut-hole'; document.body.appendChild(saldoHole); }
      const r = saldoBadge.getBoundingClientRect();
      saldoHole.style.inset = rectToInset(r, 6);
    }catch(e){}
  }
  function ensureImpatienceElevated(){
    try{
      const wrap = impBar.closest?.('.impatience-wrap') || impBar;
      wrap.classList.add('tut-ontop','tut-glow-soft');
      if (!impHole){ impHole=document.createElement('div'); impHole.className='tut-hole'; document.body.appendChild(impHole); }
      const r = wrap.getBoundingClientRect();
      impHole.style.inset = rectToInset(r, 6);
    }catch(e){}
  }
  function clearElevated(){
    try{
      saldoBadge && saldoBadge.classList.remove('tut-ontop','tut-glow-soft');
      impBar && (impBar.closest?.('.impatience-wrap') || impBar).classList.remove('tut-ontop','tut-glow-soft');
      saldoHole && saldoHole.remove(); saldoHole=null;
      impHole && impHole.remove(); impHole=null;
    }catch(e){}
  }

function placeTipAround(el, tipEl, pref='right') {
  if (!el || !tipEl) return;
  const rc = el.getBoundingClientRect();
  const pad = 10;
  const tw = tipEl.offsetWidth || 280;
  const th = tipEl.offsetHeight || 48;

  let x=0, y=0, dir=pref;

  // 🔸 Si el elemento es la tabla de préstamos, forzamos a colocar el tip encima
  if (el.classList.contains('tabla-prestamos') || el.classList.contains('table-loans')) {
    dir = 'up';
  } else {
    const canRight = (rc.right + pad + tw) <= window.innerWidth;
    const canLeft  = (rc.left  - pad - tw) >= 0;
    const canDown  = (rc.bottom + pad + th) <= window.innerHeight;
    const canUp    = (rc.top    - pad - th) >= 0;

    if (pref==='right' && !canRight) dir = canLeft ? 'left' : (canDown ? 'down' : (canUp ? 'up' : 'right'));
    else if (pref==='left' && !canLeft) dir = canRight ? 'right' : (canDown ? 'down' : (canUp ? 'up' : 'left'));
    else if (pref==='down' && !canDown) dir = canUp ? 'up' : (canRight ? 'right' : (canLeft ? 'left' : 'down'));
    else if (pref==='up' && !canUp) dir = canDown ? 'down' : (canRight ? 'right' : (canLeft ? 'left' : 'up'));
  }

  tipEl.classList.remove('tut-tip--right','tut-tip--left','tut-tip--up','tut-tip--down');
  tipEl.classList.add(`tut-tip--${dir}`);

  if (dir==='right'){ 
    x = rc.right + pad; 
    y = rc.top + Math.max(0, (rc.height - th)/2); 
  }
  else if (dir==='left'){ 
    x = rc.left - pad - tw; 
    y = rc.top + Math.max(0, (rc.height - th)/2); 
  }
  else if (dir==='down'){ 
    x = Math.max(12, rc.left + (rc.width - tw)/2); 
    y = rc.bottom + pad; 
  }
  else { /* up */
    x = Math.max(12, rc.left + (rc.width - tw)/2); 
    y = rc.top - pad - th; 
  }

  // clamp dentro de la ventana
  x = Math.max(12, Math.min(x, window.innerWidth - tw - 12));
  y = Math.max(12, Math.min(y, window.innerHeight - th - 12));

  tipEl.style.left = `${x}px`;
  tipEl.style.top  = `${y}px`;
}


  // Helpers de creación de tip con flecha
  function buildTipEl(text, secondary=false){
    const tipEl = document.createElement('div');
    tipEl.className = secondary ? 'tut-tip--secondary tut-tip tut-tip--right' : 'tut-tip tut-tip--right';
    const arrow = document.createElement('div'); arrow.className = 'tut-tip__arrow';
    const label = document.createElement('div'); label.textContent = String(text || '');
    tipEl.appendChild(label); // texto
    tipEl.appendChild(arrow); // flecha
    document.body.appendChild(tipEl);
    return tipEl;
  }

  function makeOverlay(){
    if(overlayTut) return;
    overlayTut=document.createElement('div'); overlayTut.className='tut-overlay'; document.body.appendChild(overlayTut);
    // Elevar SIEMPRE saldo e impaciencia
    ensureSaldoElevated();
    ensureImpatienceElevated();
    const onReflow = ()=>{ try{
      if (saldoHole && saldoBadge)    saldoHole.style.inset = rectToInset(saldoBadge.getBoundingClientRect(), 6);
      if (impHole) { const wrap=impBar.closest?.('.impatience-wrap')||impBar; impHole.style.inset = rectToInset(wrap.getBoundingClientRect(), 6); }
    }catch{} };
    window.addEventListener('resize', onReflow);
    window.addEventListener('scroll', onReflow, true);
    overlayTut.__reflow = onReflow;
  }

  function makeHole(el){
    const r=el.getBoundingClientRect();
    if(!hole){ hole=document.createElement('div'); hole.className='tut-hole'; document.body.appendChild(hole); }
    hole.style.inset=rectToInset(r, 6);
  }
  function makeHole2(el){
    const r=el.getBoundingClientRect();
    if(!hole2){ hole2=document.createElement('div'); hole2.className='tut-hole'; document.body.appendChild(hole2); }
    hole2.style.inset=rectToInset(r, 6);
  }

  function makeTip(text, el, secondary=false, pref='right'){
    const tipEl = secondary ? (tip2 || (tip2=document.createElement('div'))) : (tip || (tip=document.createElement('div')));
    if (!tipEl || tipEl.__rebuilt!==true){
      const built = buildTipEl(text, secondary);
      if (secondary){ tip2 && tip2.remove(); tip2=built; }
      else { tip && tip.remove(); tip=built; }
    } else {
      tipEl.textContent = String(text||'');
    }
    const node = secondary ? tip2 : tip;
    placeTipAround(el, node, pref);
  }

  function makeTip2Same(text, el){
    if(!tip2same){ tip2same = buildTipEl(text, false); }
    else { tip2same.firstChild.textContent = String(text||''); }
    placeTipAround(el, tip2same, 'right');
  }

  // Permite solo un conjunto de elementos (bloqueo global con overlay)
  function enableBlockOnly(allowedEls){
    const allow = (ev)=>{
      if (allowedEls.some(el => el && (el===ev.target || (el.contains && el.contains(ev.target))))) return;
      ev.stopPropagation(); ev.preventDefault();
    };
    overlayTut && overlayTut.addEventListener('pointerdown', allow, {passive:false});
    overlayTut && overlayTut.addEventListener('click', allow, {passive:false});
  }

  function disableAllTutUI(){
    currentTarget && currentTarget.classList.remove('tut-glow'); currentTarget=null;
    secondaryTarget && secondaryTarget.classList.remove('tut-glow','tut-glow-soft'); secondaryTarget=null;
    tip && tip.remove(); tip=null;
    tip2 && tip2.remove(); tip2=null;
    tip2same && tip2same.remove(); tip2same=null;
    hole && hole.remove(); hole=null;
    hole2 && hole2.remove(); hole2=null;
    overlayTut && (function(ov){ window.removeEventListener('resize', ov.__reflow); window.removeEventListener('scroll', ov.__reflow, true); ov.remove(); })(overlayTut); overlayTut=null;
    clearElevated();
    hideArrow();
    window.removeEventListener('resize', onReflowPrimary);
    window.removeEventListener('scroll', onReflowPrimary, true);
    window.removeEventListener('resize', onReflowSecondary);
    window.removeEventListener('scroll', onReflowSecondary, true);
  }

  function onReflowPrimary(){
    if(currentTarget){
      if (tip) placeTipAround(currentTarget, tip, 'right');
      if(hole) makeHole(currentTarget);
    }
    if(secondaryTarget){
      if (tip2) placeTipAround(secondaryTarget, tip2, 'right');
      if(hole2) makeHole2(secondaryTarget);
      if(tip2same) placeTipAround(secondaryTarget, tip2same, 'right');
    }
    if (overlayTut){
      ensureSaldoElevated();
      ensureImpatienceElevated();
    }
  }
  function onReflowSecondary(){
    if(secondaryTarget && tip2){ placeTipAround(secondaryTarget, tip2, 'right'); }
  }

  function highlight(el, text, {block=false}={}){
    if(!el) return;
    if (currentTarget) { currentTarget.classList.remove('tut-glow'); }
    tip && tip.remove(); tip=null;
    hole && hole.remove(); hole=null;
    overlayTut && overlayTut.remove(); overlayTut=null;

    currentTarget=el; el.classList.add('tut-glow');
    if(block){
      makeOverlay(); makeHole(el);
      const allow=(ev)=>{ if(el.contains(ev.target)) return; ev.stopPropagation(); ev.preventDefault(); };
      overlayTut && overlayTut.addEventListener('pointerdown', allow, {passive:false});
      overlayTut && overlayTut.addEventListener('click', allow, {passive:false});
    }
    makeTip(text, el, false, 'right');
    window.addEventListener('resize', onReflowPrimary);
    window.addEventListener('scroll', onReflowPrimary, true);
  }

  function softHighlight(el, text){
    if(!el) return;
    if (secondaryTarget && secondaryTarget!==el){
      secondaryTarget.classList.remove('tut-glow','tut-glow-soft');
    }
    secondaryTarget = el;
    el.classList.add('tut-glow-soft');
    if (!tip2){ /* build in makeTip */ }
    makeTip(text, el, true, 'right');
    window.addEventListener('resize', onReflowSecondary);
    window.addEventListener('scroll', onReflowSecondary, true);
  }

  // Gate de doble decisión: dos holes + dos tips a la derecha
  function startDecisionGate(){
    disableAllTutUI();
    makeOverlay();

    btnPagar.classList.add('tut-glow');
    btnRechazar.classList.add('tut-glow');

    currentTarget   = btnPagar;
    secondaryTarget = btnRechazar;

    makeHole(btnPagar);
    makeHole2(btnRechazar);

    makeTip('Pulsa “Pagar”', btnPagar, false, 'right');
    makeTip2Same('Pulsa “Rechazar”', btnRechazar);

    enableBlockOnly([btnPagar, btnRechazar]);

    window.addEventListener('resize', onReflowPrimary);
    window.addEventListener('scroll', onReflowPrimary, true);
  }

  // === Guardia de modal: bloquea todo salvo el modal ===
  let __modalGuardActive = false;
  let __modalGuardTarget = null;
  function beginModalGuard(modalEl, tipText){
    if (!modalEl) return;
    __modalGuardActive = true;
    __modalGuardTarget = modalEl;
    makeOverlay(); makeHole(modalEl);
    const allow=(ev)=>{ if(modalEl.contains(ev.target)) return; ev.stopPropagation(); ev.preventDefault(); };
    overlayTut && overlayTut.addEventListener('pointerdown', allow, {passive:false});
    overlayTut && overlayTut.addEventListener('click', allow, {passive:false});
    if (tipText) makeTip(tipText, modalEl, false, 'right');

    const onReflow = ()=>{ try{ makeHole(modalEl); if (tip) placeTipAround(modalEl, tip, 'right'); }catch(e){} };
    window.addEventListener('resize', onReflow);
    window.addEventListener('scroll', onReflow, true);
    modalEl.__modalGuardReflow = onReflow;

    const mo = new MutationObserver(()=>{ if (!document.body.contains(modalEl)) { endModalGuard(); mo.disconnect(); }});
    mo.observe(document.body, { childList:true, subtree:true });
    modalEl.__modalGuardMO = mo;
  }
  function endModalGuard(){
    if (!__modalGuardActive) return;
    try{
      if (__modalGuardTarget?.__modalGuardMO) { __modalGuardTarget.__modalGuardMO.disconnect(); __modalGuardTarget.__modalGuardMO = null; }
      if (__modalGuardTarget?.__modalGuardReflow){
        window.removeEventListener('resize', __modalGuardTarget.__modalGuardReflow);
        window.removeEventListener('scroll', __modalGuardTarget.__modalGuardReflow, true);
      }
    }catch(e){}
    __modalGuardActive = false;
    __modalGuardTarget = null;
    disableAllTutUI();
  }

  // Flecha para filas de tabla
  function showArrowTo(el) { hideArrow(); if (!el) return; const r = el.getBoundingClientRect(); const arrow = document.createElement('div'); arrow.className = 'tut-arrow'; arrow.style.left = Math.max(12, r.left - 18) + 'px'; arrow.style.top  = Math.max(12, r.top  - 18) + 'px'; document.body.appendChild(arrow); window.__TUT_ARROW = arrow;
    const onReflow = () => { const rr = el.getBoundingClientRect(); arrow.style.left = Math.max(12, rr.left - 18) + 'px'; arrow.style.top  = Math.max(12, rr.top  - 18) + 'px'; };
    window.addEventListener('resize', onReflow); window.addEventListener('scroll', onReflow, true); arrow.__reflow = onReflow; }
  function hideArrow() { const a = window.__TUT_ARROW; if (!a) return; window.removeEventListener('resize', a.__reflow); window.removeEventListener('scroll', a.__reflow, true); a.remove(); window.__TUT_ARROW = null; }

  // Avance de slide
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

  function flashTable(el){
    if(!el) return;
    try{
      const rc = el.getBoundingClientRect();
      const inView = rc.top >= 0 && rc.bottom <= (window.innerHeight || document.documentElement.clientHeight);
      if(!inView){ el.scrollIntoView({behavior:'smooth', block:'center'}); }
    }catch{}
    el.classList.add('table-flash');
    setTimeout(()=> el.classList.remove('table-flash'), 800);
  }

  // === Animación y foco de impaciencia por encima del overlay ===
  function focusImpatience(tipText){
    const wrap = impBar.closest?.('.impatience-wrap') || impBar;
    wrap.classList.add('tut-ontop');
    makeOverlay(); makeHole(impBar);
    makeTip(tipText || 'Mira cómo cambia la impaciencia', impBar, false, 'right');
    enableBlockOnly([wrap]);
    window.addEventListener('resize', ()=>{ makeHole(impBar); tip && placeTipAround(impBar, tip, 'right'); });
    window.addEventListener('scroll', ()=>{ makeHole(impBar); tip && placeTipAround(impBar, tip, 'right'); }, true);
    impBar.classList.add('tut-glow');
    return ()=>{ // cleanup
      wrap.classList.remove('tut-ontop');
      impBar.classList.remove('tut-glow');
      disableAllTutUI();
    };
  }

  // Mantener 3s para lectura (ajustable con holdMs)
  function animateImpatienceTo(nextPct, { duration = 700, tipText, holdMs = 3000, requireClick = false } = {}) {
    const prev = Number(st.impatience || 0);
    const to   = clamp(Number(nextPct || 0), 0, 100);
    const cleanup = focusImpatience(tipText);
    return new Promise((resolve) => {
      const startAnim = () => {
        const start = performance.now();
        const step = (t) => {
          const k = Math.min(1, (t - start) / duration);
          const cur = prev + (to - prev) * k;
          setImp({ fillEl: impFill, capEl: impCap, valuePct: cur, capPct: CAP_PCT });
          if (k < 1) requestAnimationFrame(step);
          else {
            setImp({ fillEl: impFill, capEl: impCap, valuePct: to, capPct: CAP_PCT });
            setTimeout(() => { cleanup(); resolve(); }, Math.max(0, holdMs));
          }
        };
        requestAnimationFrame(step);
      };
      if (!requireClick) {
        startAnim();
        return;
      }
      const target = impWrap || impBar;
      const onClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        target.removeEventListener('click', onClick, true);
        startAnim();
      };
      target.addEventListener('click', onClick, { capture:true, once:true });
    });
  }

  // === ACCIONES ===
  btnPagar.addEventListener('click', async ()=>{
    if ((st.saldo||0) < cost) {
      (H.openInfoModal || (({title='Aviso',message=''})=>{
        const ov=document.createElement('div'); ov.className='modal-overlay';
        const md=document.createElement('div'); md.className='modal';
        md.innerHTML=`<h3 class="modal-title">${title}</h3><div class="modal-subtitle">${message}</div><div class="modal-actions"><button class="btn-primary" id="ok">Aceptar</button></div>`;
        ov.appendChild(md); document.body.appendChild(ov);
        beginModalGuard(md, 'Lee el mensaje');
        md.querySelector('#ok').onclick=()=>{ ov.remove(); endModalGuard(); };
        ov.addEventListener('click',(e)=>{ if(e.target===ov){ e.preventDefault(); e.stopPropagation(); } }, {passive:false});
      }))({ title:'No puedes pagar', message:'Necesitas saldo suficiente para pagar esta actividad.' });
      return;
    }
    // saldo
    st.saldo = (st.saldo||0) - cost;
    saldoW.set(st.saldo);
    saldoFeedback(`-€${cost}`, -Number(cost||0));
    st.lastAction = { type:'pagar', cost, week:st.week };

    // impaciencia
    const prevImp = Number(st.impatience || 0);
    const nextImp = clamp(prevImp + DELTA_PAY, 0, 100);
    const deltaImp = nextImp - prevImp;
    st.impatience = nextImp;
    showImpBubble(deltaImp);

    await animateImpatienceTo(nextImp, { tipText: 'Pulsa la barra para ver cómo baja', requireClick: true });
    disableAllTutUI();   
    // flujo normal: avanzar
    try { advanceSlideAggressive(); } catch {}
  });

  // ==== PEDIR PRÉSTAMO ====
  btnPedir.addEventListener('click', (ev)=>{ 
    try{ ev.preventDefault(); ev.stopPropagation(); }catch{} 
    try { disableAllTutUI && disableAllTutUI(); } catch {}
    const min = Math.max(1, cost - (st.saldo||0));
    const max = Math.max(min, cost);

    const onConfirmPedir = (loanAmount, weeksSel)=>{
      try { endModalGuard(); } catch {}
      const id = (st.nextLoanId = (st.nextLoanId||1) + 1);
      st.loans = (st.loans||[]).concat([{ id, amount:loanAmount, weeksLeft:weeksSel, status:(H.STATUS?.ACTIVO||'Activo'), given:false }]);
      st.saldo = (st.saldo||0) + loanAmount;
      saldoW.set(st.saldo);
      fillLoans(tbody, st.loans);
      saldoFeedback(`+€${loanAmount}`, Number(loanAmount||0));

      setTimeout(()=>{
        tut.step = 'pagar';
        highlight(btnPagar, 'Pulsa "Pagar"', { block: true });
        try { flashTable(table); } catch {}
        softHighlight(table, tut.tablaText || 'Mira cómo aparece el nuevo préstamo en la tabla');
      }, 0);
    };

    openLoanModal({
      min, max,
      minWeeks: 1,
      maxWeeks: Math.min(activityWeeks, MAX_LOAN_WEEKS),
      defaultWeeks: Math.min(Math.max(1, loanWeeksHint||2), Math.min(activityWeeks, MAX_LOAN_WEEKS)),
      onConfirm:onConfirmPedir,
      onCancel:()=>{ endModalGuard(); }
    });
  });

  // === DEVOLVER PRÉSTAMO (clic en fila) — se mantiene en la misma slide ===
  tbody.addEventListener('click', (ev)=>{
    try{ ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation(); }catch{}
    const tr = ev.target.closest && ev.target.closest('tr');
    if (!tr || !tr.dataset || !tr.dataset.id) return;
    const id = Number(tr.dataset.id);
    const loan = (st.loans || []).find(x => Number(x.id)===id);
    if (!loan) return;

    const overlay=document.createElement('div'); overlay.className='modal-overlay';
    const modal=document.createElement('div'); modal.className='modal';
    modal.innerHTML = `
      <h3 class="modal-title">Devolver préstamo</h3>
      <div class="modal-subtitle">Vas a devolver el préstamo ID ${loan.id}. Importe: €${loan.amount}</div>
      <div class="modal-actions">
        <button id="repNo" class="btn-secondary">Cancelar</button>
        <button id="repYes" class="btn-primary">Aceptar</button>
      </div>`;
    overlay.appendChild(modal); document.body.appendChild(overlay);

    beginModalGuard(modal, 'Confirma la devolución');

    const close=()=>{ overlay.remove(); endModalGuard(); };

    modal.querySelector('#repNo').onclick=close;

    modal.querySelector('#repYes').onclick=()=>{
      if ((st.saldo||0) < Number(loan.amount||0)) {
        close();
        (H.openInfoModal || (({title='Saldo insuficiente',message=''})=>{
          const ov=document.createElement('div'); ov.className='modal-overlay';
          const md=document.createElement('div'); md.className='modal';
          md.innerHTML=`<h3 class="modal-title">${title}</h3><div class="modal-subtitle">${message||'No tienes saldo suficiente para devolver este préstamo.'}</div><div class="modal-actions"><button class="btn-primary" id="ok">Aceptar</button></div>`;
          ov.appendChild(md); document.body.appendChild(ov);
          beginModalGuard(md, 'Lee el mensaje');
          md.querySelector('#ok').onclick=()=>{ ov.remove(); endModalGuard(); };
          ov.addEventListener('click',(e)=>{ if(e.target===ov){ e.preventDefault(); e.stopPropagation(); } }, {passive:false});
        }))({ title:'Saldo insuficiente', message:'No tienes saldo suficiente para devolver este préstamo.' });
        return;
      }

      // Actualizamos estado
      st.saldo = (st.saldo||0) - Number(loan.amount||0);
      saldoW.set(st.saldo);
      saldoFeedback(`-€${loan.amount}`, -Number(loan.amount||0));
      st.loans = (st.loans||[]).filter(x => Number(x.id)!==id);
      fillLoans(tbody, st.loans);

      // Cerrar modal y mostrar gate Pagar/Rechazar
      close();
      try { disableAllTutUI(); } catch {}
      startDecisionGate();
    };

    overlay.addEventListener('click',(e)=>{ if(e.target===overlay){ e.preventDefault(); e.stopPropagation(); } }, {passive:false});
  }, { capture: true });

  // === RECHAZAR (tutorial)
  btnRechazar.addEventListener('click', async ()=>{
    st.lastAction = { type:'rechazar', week:st.week };
    const prevImp = Number(st.impatience || 0);
    const nextImp = clamp(prevImp + DELTA_REJECT, 0, 100);
    const deltaImp = nextImp - prevImp;
    st.impatience = nextImp;
    showImpBubble(deltaImp);
    await animateImpatienceTo(nextImp, { tipText: 'Pulsa la barra para ver cómo sube', requireClick: true });
    disableAllTutUI();   
    // flujo normal: avanzar
    try { advanceSlideAggressive(); } catch {}
  });

  // ==== Helpers de modal para "Pedir" ====
  function openLoanModalFallback({ min, max, minWeeks=1, maxWeeks=activityWeeks, defaultWeeks=Math.min(Math.max(1, loanWeeksHint||2), activityWeeks), onConfirm, onCancel }){
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

    beginModalGuard(modal);

    const amountEl=modal.querySelector('#loanAmountInput'); const weeksEl=modal.querySelector('#loanWeeksInput');
    const errEl=modal.querySelector('#loanError'); const preview=modal.querySelector('#loanPreview');
    const close=()=>{ overlay.remove(); endModalGuard(); };

    function updatePreview(){
      const amount=Number((amountEl.value||'').trim());
      if(Number.isFinite(amount)){
        const saldoAfter=(st.saldo||0)+amount; preview.textContent=`Saldo tras pedir: €${saldoAfter}`;
      } else preview.textContent='';
    }
    updatePreview(); amountEl.addEventListener('input', updatePreview);

    modal.querySelector('#loanCancelBtn').onclick=()=>{ onCancel&&onCancel(); close(); };

    modal.querySelector('#loanAcceptBtn').onclick=()=>{
      const amount=Number((amountEl.value||'').trim()); const weeks=Number((weeksEl.value||'').trim());
      if (!Number.isInteger(amount) || amount < min || amount > max){ errEl.textContent=`El importe debe estar entre ${min}€ y ${max}€.`; errEl.style.display='block'; return; }
      if (!Number.isInteger(weeks) || weeks < minWeeks || weeks > maxWeeks){ errEl.textContent=`Las semanas deben estar entre ${minWeeks} y ${maxWeeks}.`; errEl.style.display='block'; return; }
      onConfirm&&onConfirm(amount, weeks); close();
    };

    overlay.addEventListener('click',(ev)=>{ if(ev.target===overlay){ ev.preventDefault(); ev.stopPropagation(); } }, {passive:false});
    setTimeout(()=>amountEl && amountEl.focus(),0);
  }
  function openLoanModal(opts){
    if (H.openLoanModal) {
      const before = Array.from(document.querySelectorAll('.modal')).length;
      const ret = H.openLoanModal(opts);
      setTimeout(()=>{
        let modal = null;
        const overlays = Array.from(document.querySelectorAll('.modal-overlay'));
        if (overlays.length) modal = overlays[overlays.length-1]?.querySelector('.modal');
        if (!modal) {
          const all = Array.from(document.querySelectorAll('.modal'));
          modal = all.length > before ? all[all.length-1] : all[all.length-1] || null;
        }
        if (modal) {
          beginModalGuard(modal, 'Elige importe y semanas');
          const ov = modal.closest('.modal-overlay');
          if (ov) ov.addEventListener('click',(e)=>{ if(e.target===ov){ e.preventDefault(); e.stopPropagation(); } }, {passive:false});
          const observer = new MutationObserver(()=>{ if (!document.body.contains(modal)) { endModalGuard(); observer.disconnect(); }});
          observer.observe(document.body, { childList:true, subtree:true });
        }
      }, 0);
      return ret;
    }
    return openLoanModalFallback(opts);
  }

  // Inicio tutorial
  const getFirstClickableLoanRow = () => tbody.querySelector('tr.row-clickable');
  function startTutorial(){
    const step = String(tut.step||'').toLowerCase();
    if (step==='pagar')        highlight(btnPagar,    tut.text || 'Pulsa “Pagar”',             { block: tut.block });
    else if (step==='pedir')   highlight(btnPedir,    tut.text || 'Pulsa “Pedir préstamo”',    { block: tut.block });
    else if (step==='tabla')   highlight(table,       tut.text || 'Mira la tabla',             { block: false });
    else if (step==='rechazar')highlight(btnRechazar, tut.text || 'Pulsa “Rechazar”',          { block: tut.block });
    else if (step==='devolver'){
      try { flashTable(table); } catch {}
      highlight(table, tut.text || 'Pulsa en la fila del préstamo para devolverlo', { block:true });
      setTimeout(()=>{
        const row = getFirstClickableLoanRow();
        if (row){ row.classList.add('tut-row-pulse'); showArrowTo(row); }
      }, 30);
    }
  }
  requestAnimationFrame(()=>requestAnimationFrame(startTutorial));
});
