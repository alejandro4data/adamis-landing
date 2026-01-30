// crucigrama.js - Crucigrama del dia (pool de palabras + seleccion aleatoria)
(() => {
  'use strict';

  const gridEl = document.getElementById('crx-grid');
  if (!gridEl) return;

  const acrossEl = document.getElementById('crx-across');
  const downEl = document.getElementById('crx-down');
  const btnCheck = document.getElementById('crx-check');
  const btnReset = document.getElementById('crx-reset');
  const toastEl = document.getElementById('crx-toast');
  const modal = document.getElementById('crx-result');
  const modalOk = document.getElementById('crx-result-ok');

  const GRID_SIZE = 11;
  const WORD_COUNT = 8;
  const MIN_WORDS = 6;
  const MAX_ATTEMPTS = 60;

  const WORD_POOL = [
    { word: 'AHORRO', clue: 'Guardar una parte del dinero para el futuro.' },
    { word: 'GASTO', clue: 'Dinero que sale al comprar o pagar algo.' },
    { word: 'PAGA', clue: 'Dinero que recibes cada semana o mes.' },
    { word: 'META', clue: 'Objetivo que quieres conseguir.' },
    { word: 'DEUDA', clue: 'Dinero que debes devolver.' },
    { word: 'BANCO', clue: 'Lugar donde puedes guardar o pedir dinero.' },
    { word: 'PLAN', clue: 'Organizacion de pasos para lograr algo.' },
    { word: 'PRECIO', clue: 'Cantidad de dinero que cuesta algo.' },
    { word: 'INTERES', clue: 'Dinero extra por prestar o pedir dinero.' },
    { word: 'BUDGET', clue: 'Palabra en ingles para presupuesto.' },
    { word: 'AHORRAR', clue: 'Apartar dinero en lugar de gastarlo.' },
    { word: 'MONEDA', clue: 'Dinero en metal.' },
    { word: 'RIESGO', clue: 'Posibilidad de perder dinero.' },
    { word: 'INGRESO', clue: 'Dinero que entra.' },
    { word: 'CUENTA', clue: 'Lugar en el banco para tu dinero.' },
    { word: 'VALOR', clue: 'Importancia o precio de algo.' },
    { word: 'BILLETE', clue: 'Dinero en papel.' }, // *
    { word: 'TARJETA', clue: 'Plástico usado para pagar sin efectivo.' }, // *
    { word: 'HUCHA', clue: 'Recipiente para guardar tus monedas.' }, // *
    { word: 'SALDO', clue: 'Dinero que te queda disponible.' }, // *
    { word: 'OFERTA', clue: 'Producto que se vende más barato.' }, // *
    { word: 'PAGAR', clue: 'Dar dinero a cambio de algo.' }, // *
    { word: 'PRESTAMO', clue: 'Dinero que te dejan temporalmente.' }, // *
    { word: 'CAMBIO', clue: 'Dinero que te devuelven si pagas de más.' }, // *
    { word: 'RECIBO', clue: 'Papel que demuestra que has pagado.' }, // *
    { word: 'CAJERO', clue: 'Máquina para sacar dinero del banco.' }, // *
    { word: 'GANANCIA', clue: 'Dinero extra que consigues.' }, // *
    { word: 'SUELDO', clue: 'Dinero que ganas por trabajar.' }, // *
    { word: 'VENTA', clue: 'Acción de dar algo a cambio de dinero.' }, // *
    { word: 'TOTAL', clue: 'Suma final de todo el dinero.' }, // *
    { word: 'CAJA', clue: 'Lugar donde se guarda el dinero en tiendas.' } // *
  ];

  function showToast(msg){
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    setTimeout(() => toastEl.classList.remove('is-visible'), 1200);
  }

  function shuffle(arr){
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--){
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function normalize(word){
    return String(word || '').toUpperCase().replace(/[^A-ZÑ]/g, '');
  }

  function createBoard(size){
    return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
  }

  function inBounds(size, r, c){ return r >= 0 && c >= 0 && r < size && c < size; }

  function hasLetter(board, r, c){
    if (!inBounds(board.length, r, c)) return false;
    return !!board[r][c];
  }

  function canPlace(board, word, r, c, dir){
    const size = board.length;
    const dr = dir === 'down' ? 1 : 0;
    const dc = dir === 'across' ? 1 : 0;

    const endR = r + dr * (word.length - 1);
    const endC = c + dc * (word.length - 1);
    if (!inBounds(size, r, c) || !inBounds(size, endR, endC)) return false;

    // borde antes y despues
    const beforeR = r - dr;
    const beforeC = c - dc;
    const afterR = endR + dr;
    const afterC = endC + dc;
    if (inBounds(size, beforeR, beforeC) && hasLetter(board, beforeR, beforeC)) return false;
    if (inBounds(size, afterR, afterC) && hasLetter(board, afterR, afterC)) return false;

    for (let i = 0; i < word.length; i++){
      const rr = r + dr * i;
      const cc = c + dc * i;
      const cell = board[rr][cc];
      if (cell && cell.letter !== word[i]) return false;

      // evitar palabras pegadas lateralmente
      if (!cell){
        if (dir === 'across'){
          if (hasLetter(board, rr - 1, cc) || hasLetter(board, rr + 1, cc)) return false;
        } else {
          if (hasLetter(board, rr, cc - 1) || hasLetter(board, rr, cc + 1)) return false;
        }
      } else {
        // no permitir solape paralelo
        if (dir === 'across' && cell.across) return false;
        if (dir === 'down' && cell.down) return false;
      }
    }
    return true;
  }

  function placeWord(board, entry, r, c, dir, placements){
    const dr = dir === 'down' ? 1 : 0;
    const dc = dir === 'across' ? 1 : 0;
    const cells = [];
    for (let i = 0; i < entry.word.length; i++){
      const rr = r + dr * i;
      const cc = c + dc * i;
      if (!board[rr][cc]){
        board[rr][cc] = { letter: entry.word[i], across: false, down: false, number: 0 };
      }
      board[rr][cc][dir] = true;
      cells.push([rr, cc]);
    }
    placements.push({ word: entry.word, clue: entry.clue, r, c, dir, cells, number: 0, cellIndex: new Map() });
  }

  function generateCrossword(){
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++){
      const board = createBoard(GRID_SIZE);
      const placements = [];
      const entries = shuffle(WORD_POOL)
        .map(x => ({ word: normalize(x.word), clue: x.clue }))
        .filter(x => x.word.length >= 3 && x.word.length <= GRID_SIZE);
      const picks = entries.slice(0, WORD_COUNT);
      if (!picks.length) continue;

      const sorted = picks.slice().sort((a,b) => b.word.length - a.word.length);
      const first = sorted.shift();
      const startR = (GRID_SIZE / 2) | 0;
      const startC = ((GRID_SIZE - first.word.length) / 2) | 0;
      if (!canPlace(board, first.word, startR, startC, 'across')) continue;
      placeWord(board, first, startR, startC, 'across', placements);

      for (const entry of sorted){
        let placed = false;
        const letters = entry.word.split('');
        const candidates = [];
        for (let i = 0; i < letters.length; i++){
          const ch = letters[i];
          for (let r = 0; r < GRID_SIZE; r++){
            for (let c = 0; c < GRID_SIZE; c++){
              const cell = board[r][c];
              if (!cell || cell.letter !== ch) continue;
              // intentamos cruzar en perpendicular
              candidates.push({ r, c, i, dir: cell.across ? 'down' : 'across' });
              candidates.push({ r, c, i, dir: cell.down ? 'across' : 'down' });
            }
          }
        }
        for (const cand of shuffle(candidates)){
          const r0 = cand.dir === 'down' ? cand.r - cand.i : cand.r;
          const c0 = cand.dir === 'across' ? cand.c - cand.i : cand.c;
          if (canPlace(board, entry.word, r0, c0, cand.dir)){
            placeWord(board, entry, r0, c0, cand.dir, placements);
            placed = true;
            break;
          }
        }
      }

      if (placements.length >= MIN_WORDS){
        // Numeracion
        let num = 1;
        for (const w of placements){
          const cell = board[w.r][w.c];
          if (cell.number === 0) cell.number = num++;
          w.number = cell.number;
        }
        placements.forEach((w, idx) => {
          w.index = idx;
          w.cells.forEach((cell, pos) => {
            const k = cell[0] + ',' + cell[1];
            w.cellIndex.set(k, pos);
            const obj = board[cell[0]][cell[1]];
            if (w.dir === 'across') obj.acrossWord = idx;
            if (w.dir === 'down') obj.downWord = idx;
          });
        });
        return { board, placements };
      }
    }
    return null;
  }

  let board = null;
  let placements = [];
  let activeWordIdx = null;
  let activeDir = 'across';
  const cellInputs = new Map();

  function buildGrid(){
    gridEl.innerHTML = '';
    cellInputs.clear();
    gridEl.style.setProperty('--size', String(GRID_SIZE));
    gridEl.style.setProperty('--gap', '6px');

    for (let r = 0; r < GRID_SIZE; r++){
      for (let c = 0; c < GRID_SIZE; c++){
        const cell = board[r][c];
        const cellEl = document.createElement('div');
        cellEl.className = 'crx-cell';
        cellEl.dataset.r = String(r);
        cellEl.dataset.c = String(c);
        if (!cell){
          cellEl.classList.add('crx-cell--block');
          gridEl.appendChild(cellEl);
          continue;
        }
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.autocomplete = 'off';
        input.autocapitalize = 'characters';
        input.spellcheck = false;
        input.inputMode = 'text';
        input.dataset.r = String(r);
        input.dataset.c = String(c);
        input.setAttribute('aria-label', `Fila ${r + 1}, Columna ${c + 1}`);
        input.dataset.letter = cell.letter;
        cellEl.appendChild(input);
        if (cell.number){
          const num = document.createElement('span');
          num.className = 'crx-num';
          num.textContent = String(cell.number);
          cellEl.appendChild(num);
        }
        cellEl.addEventListener('click', () => {
          input.focus();
          setActiveFromCell(r, c);
        });
        input.addEventListener('focus', () => setActiveFromCell(r, c));
        input.addEventListener('input', (e) => handleInput(e, r, c));
        input.addEventListener('keydown', (e) => handleKeydown(e, r, c));

        cellInputs.set(`${r},${c}`, input);
        gridEl.appendChild(cellEl);
      }
    }
    resizeGrid();
  }

  function buildClues(){
    acrossEl.innerHTML = '';
    downEl.innerHTML = '';
    const across = placements.filter(w => w.dir === 'across').sort((a,b)=>a.number-b.number);
    const down = placements.filter(w => w.dir === 'down').sort((a,b)=>a.number-b.number);

    function makeItem(w){
      const li = document.createElement('li');
      li.className = 'crx-clue';
      li.dataset.word = String(w.index);
      li.innerHTML = `<span class="crx-clue-num">${w.number}</span> ${w.clue}`;
      li.addEventListener('click', () => setActiveWord(w.index, true));
      return li;
    }
    across.forEach(w => acrossEl.appendChild(makeItem(w)));
    down.forEach(w => downEl.appendChild(makeItem(w)));
  }

  function setActiveWord(idx, focusFirst){
    activeWordIdx = idx;
    const w = placements[idx];
    if (!w) return;
    activeDir = w.dir;

    document.querySelectorAll('.crx-cell.is-highlight').forEach(el => el.classList.remove('is-highlight'));
    document.querySelectorAll('.crx-cell.is-active').forEach(el => el.classList.remove('is-active'));
    document.querySelectorAll('.crx-clue.is-active').forEach(el => el.classList.remove('is-active'));

    w.cells.forEach(([r,c]) => {
      const el = gridEl.querySelector(`.crx-cell[data-r="${r}"][data-c="${c}"]`);
      if (el) el.classList.add('is-highlight');
    });

    const clueEl = document.querySelector(`.crx-clue[data-word="${idx}"]`);
    if (clueEl) clueEl.classList.add('is-active');

    if (focusFirst){
      const [r,c] = w.cells[0];
      const input = cellInputs.get(`${r},${c}`);
      if (input) input.focus();
    }
  }

  function setActiveFromCell(r, c){
    const cell = board[r][c];
    if (!cell) return;
    let idx = (activeDir === 'across') ? cell.acrossWord : cell.downWord;
    if (idx == null) idx = cell.acrossWord ?? cell.downWord;
    if (idx == null) return;
    setActiveWord(idx, false);
    const cellEl = gridEl.querySelector(`.crx-cell[data-r="${r}"][data-c="${c}"]`);
    if (cellEl) cellEl.classList.add('is-active');
  }

  function moveInWord(r, c, delta){
    const w = placements[activeWordIdx];
    if (!w) return;
    const key = `${r},${c}`;
    const pos = w.cellIndex.get(key);
    if (pos == null) return;
    const next = w.cells[pos + delta];
    if (!next) return;
    const input = cellInputs.get(`${next[0]},${next[1]}`);
    input && input.focus();
  }

  function handleInput(e, r, c){
    const input = e.target;
    let v = (input.value || '').toUpperCase();
    v = v.slice(-1);
    if (!/^[A-ZÑ]$/.test(v)) v = '';
    input.value = v;
    if (v) moveInWord(r, c, 1);
  }

  function handleKeydown(e, r, c){
    const key = e.key;
    if (key === 'Backspace'){
      const input = e.target;
      if (input.value){
        input.value = '';
      } else {
        moveInWord(r, c, -1);
      }
      e.preventDefault();
      return;
    }
    if (key === 'ArrowRight'){ activeDir = 'across'; moveInWord(r, c, 1); e.preventDefault(); }
    if (key === 'ArrowLeft'){ activeDir = 'across'; moveInWord(r, c, -1); e.preventDefault(); }
    if (key === 'ArrowDown'){ activeDir = 'down'; moveInWord(r, c, 1); e.preventDefault(); }
    if (key === 'ArrowUp'){ activeDir = 'down'; moveInWord(r, c, -1); e.preventDefault(); }
  }

  function resizeGrid(){
    const wrap = document.querySelector('.crx-wrap');
    const body = document.querySelector('.crx-body');
    if (!wrap || !body) return;
    const gap = 6;
    const bodyRect = body.getBoundingClientRect();
    const gridRect = gridEl.getBoundingClientRect();
    const availW = Math.max(200, gridRect.width);
    const availH = Math.max(200, bodyRect.height);
    const maxCellW = (availW - gap * (GRID_SIZE - 1)) / GRID_SIZE;
    const maxCellH = (availH - gap * (GRID_SIZE - 1)) / GRID_SIZE;
    const cell = Math.floor(Math.max(22, Math.min(maxCellW, maxCellH, 56)));
    gridEl.style.setProperty('--cell', `${cell}px`);
  }

  function checkComplete(){
    let filled = true;
    let correct = true;
    for (let r = 0; r < GRID_SIZE; r++){
      for (let c = 0; c < GRID_SIZE; c++){
        const cell = board[r][c];
        if (!cell) continue;
        const input = cellInputs.get(`${r},${c}`);
        const val = input ? (input.value || '').toUpperCase() : '';
        if (!val){
          filled = false;
          input && input.classList.remove('is-correct','is-wrong');
          continue;
        }
        if (val === cell.letter){
          input && input.classList.add('is-correct');
          input && input.classList.remove('is-wrong');
        } else {
          correct = false;
          input && input.classList.add('is-wrong');
          input && input.classList.remove('is-correct');
        }
      }
    }
    if (filled && correct){
      openModal();
    } else if (filled && !correct){
      showToast('Hay letras incorrectas');
    } else if (!filled && !correct){
      showToast('Revisa las letras marcadas');
    } else {
      showToast('Sigue completando');
    }
  }

  function openModal(){
    if (!modal) return;
    modal.removeAttribute('hidden');
    modal.classList.add('is-open');
    modalOk && modalOk.focus();
  }
  function closeModal(){
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('hidden', '');
  }

  function resetGame(){
    const generated = generateCrossword();
    if (!generated){
      showToast('No se pudo crear un crucigrama');
      return;
    }
    board = generated.board;
    placements = generated.placements;
    buildGrid();
    buildClues();
    if (placements[0]) setActiveWord(placements[0].index, true);
  }

  btnCheck && btnCheck.addEventListener('click', checkComplete);
  btnReset && btnReset.addEventListener('click', () => { closeModal(); resetGame(); });
  modalOk && modalOk.addEventListener('click', closeModal);

  window.addEventListener('resize', resizeGrid);
  resetGame();
})();
