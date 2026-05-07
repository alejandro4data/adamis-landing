// crucigrama.js - Crucigrama del dia (pool de palabras + seleccion aleatoria)
(() => {
  'use strict';

  const tr = (text) => {
    try {
      if (window.I18N && typeof window.I18N.tr === 'function') return window.I18N.tr(text);
    } catch (_) {}
    return text;
  };
  const currentLang = () => {
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
    try {
      const htmlLang = String(document.documentElement.lang || '').toLowerCase();
      if (htmlLang.startsWith('en')) return 'en';
      if (htmlLang.startsWith('fr')) return 'fr';
      if (htmlLang.startsWith('de')) return 'de';
      if (htmlLang.startsWith('it')) return 'it';
      if (htmlLang.startsWith('pt')) return 'pt';
      if (htmlLang.startsWith('ca-es-valencia') || htmlLang.startsWith('ca-valencia') || htmlLang.startsWith('val') || htmlLang.startsWith('va')) return 'va';
      if (htmlLang.startsWith('ca')) return 'ca';
      if (htmlLang.startsWith('gl')) return 'gl';
      if (htmlLang.startsWith('eu') || htmlLang.startsWith('baq') || htmlLang.startsWith('eus')) return 'eu';
    } catch (_) {}
    return 'es';
  };

  const gridEl = document.getElementById('crx-grid');
  if (!gridEl) return;

  const acrossEl = document.getElementById('crx-across');
  const downEl = document.getElementById('crx-down');
  const btnCheck = document.getElementById('crx-check');
  const btnHint = document.getElementById('crx-hint');
  const btnClear = document.getElementById('crx-clear');
  const btnReset = document.getElementById('crx-reset');
  const toastEl = document.getElementById('crx-toast');
  const progressText = document.getElementById('crx-progress-text');
  const progressFill = document.getElementById('crx-progress-fill');
  const activeLabel = document.getElementById('crx-active-label');
  const mistakesEl = document.getElementById('crx-mistakes');
  const modal = document.getElementById('crx-result');
  const modalOk = document.getElementById('crx-result-ok');

  const GRID_SIZE = 11;
  const WORD_COUNT = 8;
  const MIN_WORDS = 6;
  const MAX_ATTEMPTS = 60;

  const WORD_POOL_BY_LANG = { es: [
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
  ], en: [
    { word: 'SAVING', clue: 'Keeping part of your money for the future.' },
    { word: 'EXPENSE', clue: 'Money that goes out when you buy or pay.' },
    { word: 'INCOME', clue: 'Money that comes in.' },
    { word: 'GOAL', clue: 'Target you want to achieve.' },
    { word: 'DEBT', clue: 'Money you must pay back.' },
    { word: 'BANK', clue: 'Place where you store or borrow money.' },
    { word: 'PLAN', clue: 'Set of steps to achieve something.' },
    { word: 'PRICE', clue: 'Amount of money something costs.' },
    { word: 'INTEREST', clue: 'Extra money paid on a loan.' },
    { word: 'BUDGET', clue: 'Plan for how to use your money.' },
    { word: 'COIN', clue: 'Money made of metal.' },
    { word: 'RISK', clue: 'Possibility of losing money.' },
    { word: 'ACCOUNT', clue: 'Bank place where your money is kept.' },
    { word: 'VALUE', clue: 'Worth or price of something.' },
    { word: 'CASH', clue: 'Physical money.' },
    { word: 'CARD', clue: 'Plastic used to pay without cash.' },
    { word: 'BALANCE', clue: 'Money currently available.' },
    { word: 'OFFER', clue: 'Item sold at a lower price.' },
    { word: 'PAY', clue: 'Give money for something.' },
    { word: 'LOAN', clue: 'Money borrowed for a period.' },
    { word: 'CHANGE', clue: 'Money returned after you pay.' },
    { word: 'RECEIPT', clue: 'Proof that a payment happened.' },
    { word: 'PROFIT', clue: 'Money earned after costs.' },
    { word: 'WAGE', clue: 'Money you earn by working.' },
    { word: 'SALE', clue: 'Exchange of goods for money.' },
    { word: 'TOTAL', clue: 'Final sum of all amounts.' },
    { word: 'STORE', clue: 'Place where things are sold.' }
  ], fr: [
    { word: 'EPARGNE', clue: 'Garder une partie de ton argent pour le futur.' },
    { word: 'DEPENSE', clue: 'Argent qui sort quand tu achetes ou paies.' },
    { word: 'REVENU', clue: 'Argent qui entre.' },
    { word: 'OBJECTIF', clue: 'But que tu veux atteindre.' },
    { word: 'DETTE', clue: 'Argent que tu dois rembourser.' },
    { word: 'BANQUE', clue: 'Lieu ou tu peux garder ou emprunter de l argent.' },
    { word: 'PLAN', clue: 'Etapes organisees pour atteindre un but.' },
    { word: 'PRIX', clue: 'Somme d argent que coute quelque chose.' },
    { word: 'INTERET', clue: 'Argent supplementaire lie a un pret.' },
    { word: 'BUDGET', clue: 'Plan pour utiliser ton argent.' },
    { word: 'PIECE', clue: 'Argent en metal.' },
    { word: 'RISQUE', clue: 'Possibilite de perdre de l argent.' },
    { word: 'COMPTE', clue: 'Espace bancaire ou ton argent est garde.' },
    { word: 'VALEUR', clue: 'Importance ou prix de quelque chose.' },
    { word: 'BILLET', clue: 'Argent en papier.' },
    { word: 'CARTE', clue: 'Objet utilise pour payer sans especes.' },
    { word: 'SOLDE', clue: 'Argent encore disponible.' },
    { word: 'OFFRE', clue: 'Produit vendu moins cher.' },
    { word: 'PAYER', clue: 'Donner de l argent contre quelque chose.' },
    { word: 'PRET', clue: 'Argent emprunte pour une periode.' },
    { word: 'MONNAIE', clue: 'Argent rendu apres un paiement.' },
    { word: 'RECU', clue: 'Preuve qu un paiement a eu lieu.' },
    { word: 'PROFIT', clue: 'Argent gagne apres les couts.' },
    { word: 'SALAIRE', clue: 'Argent gagne en travaillant.' },
    { word: 'VENTE', clue: 'Echange de biens contre de l argent.' },
    { word: 'TOTAL', clue: 'Somme finale de tous les montants.' },
    { word: 'MAGASIN', clue: 'Lieu ou des choses sont vendues.' }
  ], de: [
    { word: 'SPAREN', clue: 'Geld fuer die Zukunft behalten.' },
    { word: 'AUSGABE', clue: 'Geld, das beim Kaufen oder Bezahlen weggeht.' },
    { word: 'EINKOMMEN', clue: 'Geld, das hereinkommt.' },
    { word: 'ZIEL', clue: 'Etwas, das du erreichen willst.' },
    { word: 'SCHULD', clue: 'Geld, das du zurueckzahlen musst.' },
    { word: 'BANK', clue: 'Ort, an dem du Geld aufbewahren oder leihen kannst.' },
    { word: 'PLAN', clue: 'Schritte, um ein Ziel zu erreichen.' },
    { word: 'PREIS', clue: 'Wie viel Geld etwas kostet.' },
    { word: 'ZINS', clue: 'Zusatzgeld bei einem Kredit.' },
    { word: 'BUDGET', clue: 'Plan, wie du dein Geld nutzt.' },
    { word: 'MUENZE', clue: 'Geld aus Metall.' },
    { word: 'RISIKO', clue: 'Moeglichkeit, Geld zu verlieren.' },
    { word: 'KONTO', clue: 'Bankplatz, an dem dein Geld liegt.' },
    { word: 'WERT', clue: 'Bedeutung oder Preis von etwas.' },
    { word: 'KARTE', clue: 'Plastik zum Bezahlen ohne Bargeld.' },
    { word: 'GEWINN', clue: 'Geld, das nach den Kosten uebrig bleibt.' }
  ], it: [
    { word: 'RISPARMIO', clue: 'Conservare una parte del denaro per il futuro.' },
    { word: 'SPESA', clue: 'Denaro che esce quando compri o paghi.' },
    { word: 'REDDITO', clue: 'Denaro che entra.' },
    { word: 'OBIETTIVO', clue: 'Traguardo che vuoi raggiungere.' },
    { word: 'DEBITO', clue: 'Denaro che devi restituire.' },
    { word: 'BANCA', clue: 'Luogo dove puoi conservare o chiedere denaro.' },
    { word: 'PIANO', clue: 'Passi organizzati per raggiungere qualcosa.' },
    { word: 'PREZZO', clue: 'Quantita di denaro che costa qualcosa.' },
    { word: 'INTERESSE', clue: 'Denaro extra legato a un prestito.' },
    { word: 'BUDGET', clue: 'Piano per usare il tuo denaro.' },
    { word: 'MONETA', clue: 'Denaro di metallo.' },
    { word: 'RISCHIO', clue: 'Possibilita di perdere denaro.' },
    { word: 'CONTO', clue: 'Spazio in banca dove sta il tuo denaro.' },
    { word: 'VALORE', clue: 'Importanza o prezzo di qualcosa.' },
    { word: 'CARTA', clue: 'Oggetto usato per pagare senza contanti.' },
    { word: 'PROFITTO', clue: 'Denaro guadagnato dopo i costi.' }
  ], pt: [
    { word: 'POUPANCA', clue: 'Guardar parte do dinheiro para o futuro.' },
    { word: 'DESPESA', clue: 'Dinheiro que sai quando compras ou pagas.' },
    { word: 'RECEITA', clue: 'Dinheiro que entra.' },
    { word: 'OBJETIVO', clue: 'Meta que queres atingir.' },
    { word: 'DIVIDA', clue: 'Dinheiro que tens de devolver.' },
    { word: 'BANCO', clue: 'Lugar onde podes guardar ou pedir dinheiro.' },
    { word: 'PLANO', clue: 'Passos organizados para atingir algo.' },
    { word: 'PRECO', clue: 'Quantidade de dinheiro que algo custa.' },
    { word: 'JURO', clue: 'Dinheiro extra associado a um emprestimo.' },
    { word: 'ORCAMENTO', clue: 'Plano para usar o teu dinheiro.' },
    { word: 'MOEDA', clue: 'Dinheiro em metal.' },
    { word: 'RISCO', clue: 'Possibilidade de perder dinheiro.' },
    { word: 'CONTA', clue: 'Espaco no banco onde fica o teu dinheiro.' },
    { word: 'VALOR', clue: 'Importancia ou preco de algo.' },
    { word: 'CARTAO', clue: 'Objeto usado para pagar sem dinheiro fisico.' },
    { word: 'LUCRO', clue: 'Dinheiro ganho depois dos custos.' }
  ], ca: [
    { word: 'ESTALVI', clue: 'Guardar una part dels diners per al futur.' },
    { word: 'DESPESA', clue: 'Diners que surten quan compres o pagues.' },
    { word: 'INGRES', clue: 'Diners que entren.' },
    { word: 'META', clue: 'Objectiu que vols aconseguir.' },
    { word: 'DEUTE', clue: 'Diners que has de tornar.' },
    { word: 'BANC', clue: 'Lloc on pots guardar o demanar diners.' },
    { word: 'PLA', clue: 'Passos organitzats per aconseguir alguna cosa.' },
    { word: 'PREU', clue: 'Quantitat de diners que costa alguna cosa.' },
    { word: 'INTERES', clue: 'Diners extra associats a un prestec.' },
    { word: 'PRESSUPOST', clue: 'Pla per fer servir els teus diners.' },
    { word: 'MONEDA', clue: 'Diners en metall.' },
    { word: 'RISC', clue: 'Possibilitat de perdre diners.' },
    { word: 'COMPTE', clue: 'Espai del banc on tens els diners.' },
    { word: 'VALOR', clue: 'Importancia o preu d alguna cosa.' },
    { word: 'TARGETA', clue: 'Objecte per pagar sense efectiu.' },
    { word: 'BENEFICI', clue: 'Diners guanyats despres dels costos.' }
  ], va: [
    { word: 'ESTALVI', clue: 'Guardar una part dels diners per al futur.' },
    { word: 'DESPESA', clue: 'Diners que ixen quan compres o pagues.' },
    { word: 'INGRES', clue: 'Diners que entren.' },
    { word: 'META', clue: 'Objectiu que vols aconseguir.' },
    { word: 'DEUTE', clue: 'Diners que has de tornar.' },
    { word: 'BANC', clue: 'Lloc on pots guardar o demanar diners.' },
    { word: 'PLA', clue: 'Passos organitzats per aconseguir alguna cosa.' },
    { word: 'PREU', clue: 'Quantitat de diners que costa alguna cosa.' },
    { word: 'INTERES', clue: 'Diners extra associats a un prestec.' },
    { word: 'PRESSUPOST', clue: 'Pla per a usar els teus diners.' },
    { word: 'MONEDA', clue: 'Diners en metall.' },
    { word: 'RISC', clue: 'Possibilitat de perdre diners.' },
    { word: 'COMPTE', clue: 'Espai del banc on tens els diners.' },
    { word: 'VALOR', clue: 'Importancia o preu d alguna cosa.' },
    { word: 'TARGETA', clue: 'Objecte per pagar sense efectiu.' },
    { word: 'BENEFICI', clue: 'Diners guanyats despres dels costos.' }
  ], gl: [
    { word: 'AFORRO', clue: 'Gardar unha parte do diñeiro para o futuro.' },
    { word: 'GASTO', clue: 'Diñeiro que sae cando compras ou pagas.' },
    { word: 'INGRESO', clue: 'Diñeiro que entra.' },
    { word: 'META', clue: 'Obxectivo que queres acadar.' },
    { word: 'DEBEDA', clue: 'Diñeiro que debes devolver.' },
    { word: 'BANCO', clue: 'Lugar onde podes gardar ou pedir diñeiro.' },
    { word: 'PLAN', clue: 'Pasos organizados para conseguir algo.' },
    { word: 'PREZO', clue: 'Cantidade de diñeiro que custa algo.' },
    { word: 'XURO', clue: 'Diñeiro extra asociado a un prestamo.' },
    { word: 'ORZAMENTO', clue: 'Plan para usar o teu diñeiro.' },
    { word: 'MOEDA', clue: 'Diñeiro en metal.' },
    { word: 'RISCO', clue: 'Posibilidade de perder diñeiro.' },
    { word: 'CONTA', clue: 'Espazo do banco onde tes o diñeiro.' },
    { word: 'VALOR', clue: 'Importancia ou prezo de algo.' },
    { word: 'TARXETA', clue: 'Obxecto para pagar sen efectivo.' },
    { word: 'GANANCIA', clue: 'Diñeiro gañado despois dos custos.' }
  ], eu: [
    { word: 'AURREZKI', clue: 'Diruaren zati bat etorkizunerako gordetzea.' },
    { word: 'GASTU', clue: 'Erosten edo ordaintzen duzunean ateratzen den dirua.' },
    { word: 'SARRERA', clue: 'Sartzen den dirua.' },
    { word: 'HELBURU', clue: 'Lortu nahi duzun xedea.' },
    { word: 'ZOR', clue: 'Itzuli behar duzun dirua.' },
    { word: 'BANKU', clue: 'Dirua gordetzeko edo eskatzeko lekua.' },
    { word: 'PLAN', clue: 'Zerbait lortzeko antolatutako urratsak.' },
    { word: 'PREZIO', clue: 'Zerbait kostatzen den diru kopurua.' },
    { word: 'INTERES', clue: 'Mailegu bati lotutako diru gehigarria.' },
    { word: 'AURREKONTU', clue: 'Zure dirua erabiltzeko plana.' },
    { word: 'TXANPON', clue: 'Metalezko dirua.' },
    { word: 'ARRISKU', clue: 'Dirua galtzeko aukera.' },
    { word: 'KONTU', clue: 'Bankuan zure dirua dagoen lekua.' },
    { word: 'BALIO', clue: 'Zerbaiten garrantzia edo prezioa.' },
    { word: 'TXARTEL', clue: 'Diru fisikorik gabe ordaintzeko objektua.' },
    { word: 'IRABAZI', clue: 'Kostuen ondoren lortutako dirua.' }
  ] };
  const getWordPool = () => WORD_POOL_BY_LANG[currentLang()] || WORD_POOL_BY_LANG.es;

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
    const raw = String(word || '')
      .toUpperCase()
      .replace(/\u00d1/g, '__ENYE__')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/__ENYE__/g, '\u00d1');
    return raw.replace(/[^A-Z\u00d1]/g, '');
  }

  function normalizeLetter(value){
    const raw = String(value || '').slice(-1).toUpperCase();
    const letter = raw === '\u00d1'
      ? raw
      : raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return /^[A-Z\u00d1]$/.test(letter) ? letter : '';
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
      const entries = shuffle(getWordPool())
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
  let mistakes = 0;
  let solved = false;
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
        input.autocorrect = 'off';
        input.inputMode = 'text';
        input.enterKeyHint = 'next';
        input.dataset.r = String(r);
        input.dataset.c = String(c);
        input.setAttribute(
          'aria-label',
          currentLang() === 'en'
            ? `Row ${r + 1}, Column ${c + 1}`
            : currentLang() === 'fr'
              ? `Ligne ${r + 1}, colonne ${c + 1}`
              : currentLang() === 'de'
                ? `Zeile ${r + 1}, Spalte ${c + 1}`
                : currentLang() === 'it'
                  ? `Riga ${r + 1}, colonna ${c + 1}`
                  : currentLang() === 'pt'
                    ? `Linha ${r + 1}, coluna ${c + 1}`
              : `Fila ${r + 1}, Columna ${c + 1}`
        );
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
      li.dataset.dir = w.dir;
      li.innerHTML = `<span class="crx-clue-num">${w.number}</span><span class="crx-clue-text">${w.clue}</span>`;
      li.addEventListener('click', () => setActiveWord(w.index, true));
      return li;
    }
    across.forEach(w => acrossEl.appendChild(makeItem(w)));
    down.forEach(w => downEl.appendChild(makeItem(w)));
  }

  function inputFor(r, c){
    return cellInputs.get(`${r},${c}`) || null;
  }

  function focusCell(r, c){
    const input = inputFor(r, c);
    if (input) input.focus();
  }

  function setInputFilled(input){
    if (!input) return;
    input.classList.toggle('is-filled', !!input.value);
  }

  function getProgressStats(){
    let total = 0;
    let filled = 0;
    for (let r = 0; r < GRID_SIZE; r++){
      for (let c = 0; c < GRID_SIZE; c++){
        if (!board[r][c]) continue;
        total++;
        const input = inputFor(r, c);
        if (input && input.value) filled++;
      }
    }
    return { total, filled, empty: Math.max(0, total - filled) };
  }

  function updateWordStates(){
    placements.forEach((w) => {
      let complete = true;
      let correct = true;
      w.cells.forEach(([r, c]) => {
        const input = inputFor(r, c);
        const value = input ? normalizeLetter(input.value) : '';
        if (!value) complete = false;
        if (value !== board[r][c].letter) correct = false;
      });

      const clueEl = document.querySelector(`.crx-clue[data-word="${w.index}"]`);
      if (clueEl) clueEl.classList.toggle('is-complete', complete && correct);
    });
  }

  function countMarkedMistakes(){
    let count = 0;
    cellInputs.forEach((input) => {
      if (input.classList.contains('is-wrong')) count++;
    });
    return count;
  }

  function updateHud(){
    const stats = getProgressStats();
    const pct = stats.total ? Math.round((stats.filled / stats.total) * 100) : 0;
    if (progressText) progressText.textContent = `${stats.filled}/${stats.total}`;
    if (progressFill) progressFill.style.width = `${pct}%`;

    const w = placements[activeWordIdx];
    if (activeLabel) {
      activeLabel.textContent = w
        ? `${w.number} ${w.dir === 'across' ? 'Horizontal' : 'Vertical'}`
        : '-';
    }

    mistakes = countMarkedMistakes();
    if (mistakesEl) mistakesEl.textContent = String(mistakes);
    updateWordStates();
  }

  function markActiveCell(r, c){
    document.querySelectorAll('.crx-cell.is-active').forEach(el => el.classList.remove('is-active'));
    const cellEl = gridEl.querySelector(`.crx-cell[data-r="${r}"][data-c="${c}"]`);
    if (cellEl) cellEl.classList.add('is-active');
  }

  function setDirectionFromCell(r, c, dir){
    const cell = board[r][c];
    if (!cell) return false;
    const idx = dir === 'across' ? cell.acrossWord : cell.downWord;
    if (idx == null) return false;
    activeDir = dir;
    setActiveWord(idx, false);
    markActiveCell(r, c);
    return true;
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
      focusCell(r, c);
    }
    updateHud();
  }

  function setActiveFromCell(r, c){
    const cell = board[r][c];
    if (!cell) return;
    let idx = (activeDir === 'across') ? cell.acrossWord : cell.downWord;
    if (idx == null) idx = cell.acrossWord ?? cell.downWord;
    if (idx == null) return;
    setActiveWord(idx, false);
    markActiveCell(r, c);
  }

  function moveInWord(r, c, delta){
    const w = placements[activeWordIdx];
    if (!w) return;
    const key = `${r},${c}`;
    const pos = w.cellIndex.get(key);
    if (pos == null) return;
    const next = w.cells[pos + delta];
    if (!next) return;
    focusCell(next[0], next[1]);
  }

  function handleInput(e, r, c){
    const input = e.target;
    const v = normalizeLetter(input.value);
    input.value = v;
    input.classList.remove('is-correct', 'is-wrong');
    setInputFilled(input);
    if (v) moveInWord(r, c, 1);
    updateHud();
  }

  function handleKeydown(e, r, c){
    const key = e.key;
    if (key === 'Backspace'){
      const input = e.target;
      if (input.value){
        input.value = '';
        input.classList.remove('is-correct', 'is-wrong', 'is-hint');
        setInputFilled(input);
      } else {
        moveInWord(r, c, -1);
      }
      updateHud();
      e.preventDefault();
      return;
    }
    if (key === 'Enter' || key === ' '){
      const nextDir = activeDir === 'across' ? 'down' : 'across';
      setDirectionFromCell(r, c, nextDir) || setDirectionFromCell(r, c, activeDir);
      e.preventDefault();
      return;
    }
    if (key === 'ArrowRight'){
      if (setDirectionFromCell(r, c, 'across')) moveInWord(r, c, 1);
      e.preventDefault();
    }
    if (key === 'ArrowLeft'){
      if (setDirectionFromCell(r, c, 'across')) moveInWord(r, c, -1);
      e.preventDefault();
    }
    if (key === 'ArrowDown'){
      if (setDirectionFromCell(r, c, 'down')) moveInWord(r, c, 1);
      e.preventDefault();
    }
    if (key === 'ArrowUp'){
      if (setDirectionFromCell(r, c, 'down')) moveInWord(r, c, -1);
      e.preventDefault();
    }
  }

  function resizeGrid(){
    const shell = document.querySelector('.crx-board-shell') || gridEl.parentElement;
    const body = document.querySelector('.crx-body');
    if (!shell || !body) return;
    const gap = 7;
    const shellRect = shell.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    const viewportCandidates = [
      window.innerWidth,
      document.documentElement ? document.documentElement.clientWidth : 0,
      window.visualViewport ? window.visualViewport.width : 0
    ].filter(Boolean);
    const viewportW = Math.max(220, Math.min(...viewportCandidates) - 20);
    const availW = Math.max(220, Math.min(shellRect.width || viewportW, viewportW) - 28);
    const availH = Math.max(220, Math.min(shellRect.height || bodyRect.height, bodyRect.height) - 28);
    const maxCellW = (availW - gap * (GRID_SIZE - 1)) / GRID_SIZE;
    const maxCellH = (availH - gap * (GRID_SIZE - 1)) / GRID_SIZE;
    const cell = Math.floor(Math.max(24, Math.min(maxCellW, maxCellH, 58)));
    gridEl.style.setProperty('--cell', `${cell}px`);
    gridEl.style.setProperty('--gap', `${gap}px`);
  }

  function evaluateBoard(mark){
    let empty = 0;
    let wrong = 0;
    let filled = 0;
    let total = 0;
    for (let r = 0; r < GRID_SIZE; r++){
      for (let c = 0; c < GRID_SIZE; c++){
        const cell = board[r][c];
        if (!cell) continue;
        total++;
        const input = inputFor(r, c);
        const val = input ? normalizeLetter(input.value) : '';
        if (!val){
          empty++;
          if (mark) input && input.classList.remove('is-correct','is-wrong');
          continue;
        }
        filled++;
        if (val === cell.letter){
          if (mark) {
            input && input.classList.add('is-correct');
            input && input.classList.remove('is-wrong');
          }
        } else {
          wrong++;
          if (mark) {
            input && input.classList.add('is-wrong');
            input && input.classList.remove('is-correct');
          }
        }
      }
    }
    return { total, filled, empty, wrong, complete: empty === 0, correct: empty === 0 && wrong === 0 };
  }

  function checkComplete(){
    const stats = evaluateBoard(true);
    updateHud();
    if (stats.correct){
      openModal();
    } else if (stats.wrong){
      showToast(tr(stats.wrong === 1 ? 'Hay 1 letra por revisar' : `Hay ${stats.wrong} letras por revisar`));
    } else if (stats.empty){
      showToast(tr(stats.empty === 1 ? 'Queda 1 casilla' : `Quedan ${stats.empty} casillas`));
    } else {
      showToast(tr('Sigue completando'));
    }
  }

  function openModal(){
    if (!modal) return;
    if (solved) return;
    solved = true;
    if (window.AdamisRewards && typeof window.AdamisRewards.claim === 'function') {
      window.AdamisRewards.claim({
        activityId: 'crucigrama-dia',
        amount: 1,
        frequency: 'daily',
        score: placements.length,
        meta: { words: placements.length }
      });
    }
    modal.removeAttribute('hidden');
    modal.classList.add('is-open');
    modalOk && modalOk.focus();
  }
  function closeModal(){
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('hidden', '');
  }

  function setCellValue(r, c, value, className){
    const input = inputFor(r, c);
    if (!input) return;
    input.value = value;
    input.classList.remove('is-correct', 'is-wrong', 'is-hint');
    if (className) input.classList.add(className);
    setInputFilled(input);
  }

  function clearActiveWord(){
    const w = placements[activeWordIdx];
    const targets = w ? w.cells : Array.from(cellInputs.keys()).map((key) => key.split(',').map(Number));
    targets.forEach(([r, c]) => setCellValue(r, c, '', null));
    if (w && w.cells[0]) focusCell(w.cells[0][0], w.cells[0][1]);
    updateHud();
    showToast(tr(w ? 'Palabra limpiada' : 'Tablero limpiado'));
  }

  function firstUnsolvedCellInWord(w){
    if (!w) return null;
    return w.cells.find(([r, c]) => {
      const input = inputFor(r, c);
      const value = input ? normalizeLetter(input.value) : '';
      return value !== board[r][c].letter;
    }) || null;
  }

  function revealHint(){
    let w = placements[activeWordIdx];
    let target = firstUnsolvedCellInWord(w);

    if (!target){
      w = placements.find((candidate) => firstUnsolvedCellInWord(candidate));
      target = firstUnsolvedCellInWord(w);
      if (w) setActiveWord(w.index, false);
    }

    if (!target){
      checkComplete();
      return;
    }

    const [r, c] = target;
    setCellValue(r, c, board[r][c].letter, 'is-hint');
    markActiveCell(r, c);
    focusCell(r, c);
    updateHud();
    showToast(tr('Pista revelada'));
  }

  function resetGame(){
    const generated = generateCrossword();
    if (!generated){
      showToast(tr('No se pudo crear un crucigrama'));
      return;
    }
    board = generated.board;
    placements = generated.placements;
    activeWordIdx = null;
    activeDir = 'across';
    mistakes = 0;
    solved = false;
    buildGrid();
    buildClues();
    if (placements[0]) setActiveWord(placements[0].index, true);
    updateHud();
  }

  btnCheck && btnCheck.addEventListener('click', checkComplete);
  btnHint && btnHint.addEventListener('click', revealHint);
  btnClear && btnClear.addEventListener('click', clearActiveWord);
  btnReset && btnReset.addEventListener('click', () => { closeModal(); resetGame(); });
  modalOk && modalOk.addEventListener('click', closeModal);

  window.addEventListener('resize', resizeGrid);
  document.addEventListener('i18n:change', () => {
    closeModal();
    resetGame();
  });
  resetGame();
})();
