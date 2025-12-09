/* wordle.js — Palabra del día (longitud variable + espacios, sin persistencia)
   Ahora con FLIP letra a letra y bloqueo de entrada durante la animación. */

/* ===================== Ajustes / utilidades ===================== */
const ROWS = 6; // número de intentos
const FLIP_MS = 280;   // duración del giro de UNA letra (ms)
const STAGGER_MS = 200; // escalonado entre letras (ms)

// Normaliza acentos para comparar (Ñ se mantiene como letra distinta)
const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"");

// Estado de la palabra/frase actual
let targetRaw = "";     // visible (con espacios y tildes)
let TARGET = "";        // mayúsculas normalizadas (con espacios)
let TARGET_CLEAN = "";  // TARGET sin espacios (para comparar)
let DEF = "";           // definición
let ready = false;      // hasta construir tablero, no aceptamos teclas
let busy  = false;      // bloquea entrada mientras se anima

// Layout del tablero (por columna): 'letter' o 'space'
let layout = [];
let playableIdx = [];   // índices de columnas donde sí se escribe (no espacios)

// Refs DOM
const board = document.querySelector(".wdl-board");
const toast = document.querySelector(".wdl-toast");
const kb    = document.querySelector(".wdl-kb");
const keys  = new Map();   // letra -> button
let rows = [];             // filas del tablero (se crean dinámicamente)

// Prototipo: sin persistencia
function save(){}

/* ===================== UI helpers ===================== */
function showToast(msg){
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("is-visible");
  setTimeout(() => toast.classList.remove("is-visible"), 1100);
}

function openResultModal({ win, word, def }){
  const modal   = document.getElementById("wdl-result");
  const titleEl = document.getElementById("wdl-result-title");
  const wordEl  = document.getElementById("wdl-result-word");
  const defEl   = document.getElementById("wdl-result-def");
  const badgeEl = document.getElementById("wdl-result-badge");

  if (!modal || !titleEl || !wordEl || !defEl || !badgeEl) return;

  modal.classList.remove("is-win", "is-lose");
  modal.classList.add(win ? "is-win" : "is-lose");

  titleEl.textContent = win ? "¡Bien hecho!" : "Se acabaron los intentos";
  badgeEl.textContent = win ? "¡Correcto!" : "La palabra era";
  wordEl.textContent  = word;
  defEl.textContent   = def;

  modal.removeAttribute("hidden");
  modal.classList.add("is-open");

  const ok = document.getElementById("wdl-result-ok");
  ok?.addEventListener("click", closeResultModal, { once:true });

  const backdrop = modal.querySelector(".wdl-modal__backdrop");
  backdrop?.addEventListener("click", closeResultModal, { once:true });

  const onEsc = (e)=>{ if (e.key === "Escape") { closeResultModal(); window.removeEventListener("keydown", onEsc); } };
  window.addEventListener("keydown", onEsc);
}

function closeResultModal(){
  const modal = document.getElementById("wdl-result");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("hidden", "");
}

/* ===================== Construcción de tablero ===================== */
function buildLayoutFromTarget(raw){
  const arr = [...raw.toUpperCase()];
  layout = arr.map(ch => ch === " " ? "space" : "letter");
  playableIdx = layout.map((t,i) => t === "letter" ? i : -1).filter(i => i >= 0);
}

function createBoard(){
  board.innerHTML = "";
  rows = [];
  for (let r = 0; r < ROWS; r++){
    const row = document.createElement("div");
    row.className = "wdl-row";
    row.style.setProperty("--cols", layout.length);
    for (let i = 0; i < layout.length; i++){
      const tile = document.createElement("div");
      tile.className = "wdl-tile";
      if (layout[i] === "space"){
        tile.classList.add("wdl-tile--space");
        tile.setAttribute("aria-hidden","true");
        tile.textContent = ""; // hueco visual
      }else{
        tile.setAttribute("role","gridcell");
        tile.textContent = "";
      }
      row.appendChild(tile);
    }
    board.appendChild(row);
    rows.push(row);
  }
}

/* ===================== Estado y navegación ===================== */
let state = { r:0, c:-1, grid: [], ended:false, result:null };

function initState(){
  state.r = 0;
  state.c = playableIdx[0] ?? -1; // primera casilla escribible
  state.ended = false;
  state.result = null;

  state.grid = Array.from({length: ROWS}, () =>
    Array.from({length: layout.length}, (_,i) => layout[i] === "space" ? " " : "")
  );
}

function nextPlayable(i){
  for (const idx of playableIdx){ if (idx > i) return idx; }
  return -1;
}
function prevPlayable(i){
  let prev = -1;
  for (const idx of playableIdx){ if (idx >= i) break; prev = idx; }
  return prev;
}

/* ===================== Carga de palabras ===================== */
async function loadWordList(){
  // 1) SIN servidor: array global en data/palabras.js
  if (Array.isArray(window.PALABRAS) && window.PALABRAS.length){
    const entries = [];
    for (const item of window.PALABRAS){
      const word = String(item[0] || "").trim().toUpperCase();
      const def  = String(item[1] || "").trim();
      const clean = norm(word).replace(/\s+/g,"");
      if (word && def && clean.length >= 2){ // longitudes variables
        entries.push({ word, def });
      }
    }
    if (!entries.length){ showToast("Diccionario vacío"); return; }

    const pick = entries[Math.floor(Math.random() * entries.length)];
    targetRaw     = pick.word;                     // p.ej. "FLUJO DE CAJA"
    TARGET        = norm(targetRaw.toUpperCase()); // puede incluir espacios
    TARGET_CLEAN  = TARGET.replace(/\s+/g,"");     // sin espacios
    DEF           = pick.def;

    buildLayoutFromTarget(targetRaw);
    createBoard();
    initState();
    ready = true;
    showToast("¡Listo!");
    return;
  }

  // 2) CON servidor (opcional): fallback TXT
  try{
    const candidates = ["../data/palabras.txt","/data/palabras.txt","data/palabras.txt"];
    let res=null, ok=false;
    for (const url of candidates){ try{ res = await fetch(url,{cache:"no-store"}); if (res.ok){ ok=true; break; } }catch{} }
    if (!ok) throw new Error("no-ok");
    const txt = await res.text();

    const entries = [];
    for (const rawLine of txt.split(/\r?\n/)){
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const [w, ...rest] = line.split(":");
      const word = (w||"").trim().toUpperCase();
      const def  = (rest.join(":")||"").trim();
      const clean = norm(word).replace(/\s+/g,"");
      if (word && def && clean.length >= 2){
        entries.push({ word, def });
      }
    }
    if (!entries.length){ showToast("Diccionario vacío"); return; }

    const pick = entries[Math.floor(Math.random() * entries.length)];
    targetRaw     = pick.word;
    TARGET        = norm(targetRaw.toUpperCase());
    TARGET_CLEAN  = TARGET.replace(/\s+/g,"");
    DEF           = pick.def;

    buildLayoutFromTarget(targetRaw);
    createBoard();
    initState();
    ready = true;
    showToast("¡Listo!");
  }catch{
    showToast("No se pudo cargar 'palabras'");
  }
}
loadWordList();

/* ===================== Escritura / borrado ===================== */
function setTile(r,c,letter){
  state.grid[r][c] = letter;
  const cell = rows[r].children[c];
  if (layout[c] === "letter"){
    cell.textContent = letter;
  }
}

function backspace(){
  if (state.ended || state.c === -1 || busy) return;

  if (layout[state.c] === "letter" && state.grid[state.r][state.c]){
    setTile(state.r, state.c, "");
  }else{
    const prev = prevPlayable(state.c);
    if (prev !== -1){
      state.c = prev;
      setTile(state.r, state.c, "");
    }
  }
  save();
}

function typeLetter(l){
  if (state.ended || state.c === -1 || busy) return;
  setTile(state.r, state.c, l.toUpperCase());
  const nxt = nextPlayable(state.c);
  if (nxt !== -1) state.c = nxt;
  save();
}

/* ===================== Scoring y revelado con flip ===================== */
function scoreGuess(guessNorm){
  // guessNorm y TARGET_CLEAN tienen la misma longitud (solo letras)
  const target = TARGET_CLEAN;
  const result = Array(guessNorm.length).fill("absent");
  const freq = {};

  for (const ch of target){ freq[ch] = (freq[ch]||0)+1; }

  // Exact matches
  for (let i=0;i<guessNorm.length;i++){
    if (guessNorm[i] === target[i]){
      result[i] = "correct";
      freq[guessNorm[i]]--;
    }
  }
  // Present but misplaced
  for (let i=0;i<guessNorm.length;i++){
    if (result[i] !== "absent") continue;
    const ch = guessNorm[i];
    if (freq[ch] > 0){
      result[i] = "present";
      freq[ch]--;
    }
  }
  return result;
}

function animateRevealRow(r, guessLetters, states, done){
  // r = índice de fila; guessLetters = solo letras (sin espacios)
  // states.length === playableIdx.length
  if (!rows[r]) { done?.(); return; }

  // Marca teclado como ocupado
  kb?.classList.add("is-busy");
  busy = true;

  // Recorremos SOLO las casillas "playables" (letras), escalonando la animación
  playableIdx.forEach((tileIdx, i) => {
    const cell = rows[r].children[tileIdx];
    const letter = guessLetters[i];
    const st = states[i];
    const startAt = i * STAGGER_MS;

    // 1) inicia el giro
    setTimeout(() => {
      cell.classList.add("wdl-flip");
      // 2) a mitad de giro (cuando no “se ve”), aplicamos estado y actualizamos teclado
      setTimeout(() => {
        cell.dataset.state = st;
        updateKey(letter, st);
      }, FLIP_MS * 0.5);

      // 3) al terminar el giro, limpiamos la clase
      setTimeout(() => {
        cell.classList.remove("wdl-flip");
      }, FLIP_MS);
    }, startAt);
  });

  // Al acabar TODAS las letras:
  const total = (playableIdx.length - 1) * STAGGER_MS + FLIP_MS;
  setTimeout(() => {
    kb?.classList.remove("is-busy");
    busy = false;
    done?.();
  }, total + 10);
}

/* ===================== Enviar intento ===================== */
function submit(){
  if (state.ended || busy) return;

  const rowArr = state.grid[state.r];

  // ¿están todas las letras (no espacios) rellenas?
  for (const idx of playableIdx){
    if (!rowArr[idx]){ showToast("Palabra incompleta"); return; }
  }

  // Intento SIN espacios para comparar
  const guessLetters = playableIdx.map(i => rowArr[i]).join("").toUpperCase();
  const guessNorm = norm(guessLetters);

  const states = scoreGuess(guessNorm);

  animateRevealRow(state.r, guessLetters, states, () => {
    const win = states.every(s => s === "correct");
    if (win){
      endGame(true);
      return;
    }
    state.r++;
    state.c = playableIdx[0] ?? -1;
    save();

    if (state.r >= ROWS){
      endGame(false);
    }
  });
}

function endGame(win){
  state.ended = true;
  state.result = win ? "win" : "lose";
  save();

  setTimeout(() => {
    openResultModal({ win, word: targetRaw, def: DEF });
  }, 100);
}

/* ===================== Teclado ===================== */
function updateKey(letter, st){
  const btn = keys.get(String(letter || "").toUpperCase());
  if (!btn) return;
  const prev = btn.dataset.state || "";
  const rank = { "":0, "absent":1, "present":2, "correct":3 }; // prioridad
  if (rank[st] > rank[prev]) btn.dataset.state = st;
}

// Teclado en pantalla
if (kb){
  kb.querySelectorAll(".wdl-key").forEach(b=>{
    const keyLabel = (b.dataset.k || b.textContent || "").trim().toUpperCase();
    if (keyLabel) keys.set(keyLabel, b);
    b.addEventListener("click", ()=>{
      handleKey(keyLabel);
    });
  });
}

// Teclado físico
window.addEventListener("keydown", (e)=>{
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  let k = e.key.length === 1 ? e.key.toUpperCase() : e.key.toUpperCase();
  if (k === "ENTER") k = "ENTER";
  else if (k === "BACKSPACE") k = "BACKSPACE";
  else if (/^[A-ZÑ]$/.test(k)) { /* ok */ }
  else return;

  e.preventDefault();
  handleKey(k);
});

function handleKey(k){
  if (!ready){ showToast("Cargando…"); return; }
  if (state.ended || busy) return;
  if (k === "ENTER"){ submit(); return; }
  if (k === "BACKSPACE"){ backspace(); return; }
  if (!/^[A-ZÑ]$/.test(k)) return;
  typeLetter(k);
}
