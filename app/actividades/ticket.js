// ticket.js - Actividad "Error en el ticket"
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
    } catch (_) {}
    try {
      const htmlLang = String(document.documentElement.lang || '').toLowerCase();
      if (htmlLang.startsWith('en')) return 'en';
    } catch (_) {}
    return 'es';
  };

  const purchaseGrid = document.getElementById('ticket-purchase-grid');
  if (!purchaseGrid) return;

  const receiptBody = document.getElementById('ticket-receipt-body');
  const totalEl = document.getElementById('ticket-total-value');
  const paidEl = document.getElementById('ticket-paid-value');
  const changeEl = document.getElementById('ticket-change-value');
  const noErrorsBtn = document.getElementById('ticket-no-errors');
  const toastEl = document.getElementById('ticket-toast');
  const modalEl = document.getElementById('ticket-result');
  const starsWrap = document.getElementById('ticket-stars');
  const resultText = document.getElementById('ticket-result-text');
  const resultOk = document.getElementById('ticket-result-ok');

  const ASSETS_DIR = '../assets/assets_ticket/';
  const ALLOWED_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.avif'];
  const CAN_FETCH_LISTING = window.location.protocol === 'http:' || window.location.protocol === 'https:';
  const PRODUCT_NAME_MAP = {
    'botella de agua': { en: 'Water bottle' },
    'gafas de sol': { en: 'Sunglasses' },
    'gorra': { en: 'Cap' },
    'libro': { en: 'Book' },
    'lapiz': { en: 'Pencil' },
    'osito': { en: 'Teddy bear' },
    'pan': { en: 'Bread' },
    'patata': { en: 'Potato' },
    'tomate': { en: 'Tomato' }
  };

  const isAllowedExt = (name) => {
    const lower = String(name || '').toLowerCase();
    return ALLOWED_EXTS.some(ext => lower.endsWith(ext));
  };

  function sanitizeAssetName(name) {
    if (!name) return null;
    let clean = String(name).trim();
    if (!clean) return null;
    clean = clean.split('?')[0].split('#')[0];
    clean = clean.replace(/\\/g, '/');
    const parts = clean.split('/');
    let file = parts[parts.length - 1];
    try {
      file = decodeURIComponent(file);
    } catch (_) {}
    return file;
  }

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = String(msg || '');
    toastEl.classList.add('is-visible');
    setTimeout(() => toastEl.classList.remove('is-visible'), 1400);
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function sample(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function sampleUnique(arr, count) {
    if (count <= 0) return [];
    return shuffle(arr).slice(0, Math.min(count, arr.length));
  }

  async function loadImageList() {
    if (!CAN_FETCH_LISTING) {
      throw new Error('listing blocked on file protocol');
    }
    const res = await fetch(ASSETS_DIR, { cache: 'no-store' });
    if (!res.ok) throw new Error('assets not found');
    const text = await res.text();
    const trimmed = text.trim();
    let files = [];

    if (trimmed.startsWith('[')) {
      try {
        const arr = JSON.parse(trimmed);
        if (Array.isArray(arr)) {
          files = arr
            .map(sanitizeAssetName)
            .filter(name => name && isAllowedExt(name));
        }
      } catch (_) {
        files = [];
      }
    }

    if (!files.length) {
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const links = Array.from(doc.querySelectorAll('a[href]'));
      files = links
        .map(link => sanitizeAssetName(link.getAttribute('href')))
        .filter(name => name && isAllowedExt(name));
    }

    if (!files.length) {
      const re = /href="([^"]+\.(?:png|jpe?g|webp|avif))"/gi;
      let m;
      while ((m = re.exec(text)) !== null) {
        const name = sanitizeAssetName(m[1]);
        if (name && isAllowedExt(name)) files.push(name);
      }
    }

    const uniq = Array.from(new Set(files));
    return uniq;
  }

  function displayNameFromFile(fileName) {
    const base = String(fileName || '').replace(/\.[^/.]+$/, '');
    const raw = base.replace(/_/g, ' ').trim();
    const key = raw.toLowerCase();
    if (currentLang() === 'en' && PRODUCT_NAME_MAP[key] && PRODUCT_NAME_MAP[key].en) {
      return PRODUCT_NAME_MAP[key].en;
    }
    return raw;
  }

  function buildPurchase(files) {
    const purchaseCount = randInt(2, 9);
    const picks = [];
    for (let i = 0; i < purchaseCount; i++) {
      picks.push(sample(files));
    }

    const map = new Map();
    picks.forEach((file) => {
      if (!map.has(file)) {
        map.set(file, { file, name: displayNameFromFile(file), qty: 0 });
      }
      map.get(file).qty += 1;
    });

    const items = Array.from(map.values());
    items.forEach((item, idx) => {
      item.id = `item-${idx}`;
      item.unitPrice = randInt(1, 9);
    });

    return items;
  }

  function makeLineFromItem(item) {
    return {
      id: item.id,
      name: item.name,
      unitPrice: item.unitPrice,
      units: item.qty,
      lineTotal: item.unitPrice * item.qty,
      correct: {
        name: item.name,
        unitPrice: item.unitPrice,
        units: item.qty
      },
      isExtra: false
    };
  }

  function tweakValue(base, minValue) {
    const deltas = shuffle([-3, -2, -1, 1, 2, 3]);
    for (const d of deltas) {
      const next = base + d;
      if (next >= minValue) return next;
    }
    return base + 1;
  }

  function applyErrors(files, items) {
    let lines = items.map(makeLineFromItem);
    const errors = {
      linePrice: null,
      lineQty: null,
      lineTotal: null,
      lineName: null,
      ticketTotal: false,
      change: false
    };

    const availableExtras = files.filter(f => !items.some(it => it.file === f));
    const possible = [
      'change',
      'ticketTotal',
      'linePrice',
      'lineQty',
      'lineTotal',
      'lineName'
    ].filter((t) => (t !== 'lineName' || availableExtras.length > 0));

    const errorCount = randInt(0, Math.min(3, possible.length));
    let selected = sampleUnique(possible, errorCount);
    if (selected.includes('linePrice') || selected.includes('lineTotal') || selected.includes('lineName')) {
      selected = selected.filter((t) => t !== 'ticketTotal');
    }

    if (selected.includes('lineName')) {
      const extraFile = sample(availableExtras);
      const extraLine = {
        id: `extra-${extraFile}`,
        name: displayNameFromFile(extraFile),
        unitPrice: randInt(1, 9),
        units: randInt(1, 3),
        lineTotal: 0,
        correct: null,
        isExtra: true
      };
      extraLine.lineTotal = extraLine.unitPrice * extraLine.units;
      lines.push(extraLine);
      errors.lineName = lines.length - 1;
    }

    const purchaseLineIndexes = lines
      .map((line, idx) => ({ line, idx }))
      .filter(entry => !entry.line.isExtra)
      .map(entry => entry.idx);

    const pickLineIndex = () => purchaseLineIndexes.length
      ? sample(purchaseLineIndexes)
      : null;

    if (selected.includes('linePrice')) {
      errors.linePrice = pickLineIndex();
      if (errors.linePrice != null) {
        const line = lines[errors.linePrice];
        let next = line.unitPrice;
        while (next === line.unitPrice) {
          next = randInt(1, 9);
        }
        line.unitPrice = next;
        if (!selected.includes('lineTotal') || errors.lineTotal !== errors.linePrice) {
          line.lineTotal = line.unitPrice * line.units;
        }
      }
    }

    if (selected.includes('lineQty')) {
      errors.lineQty = pickLineIndex();
      if (errors.lineQty != null) {
        const line = lines[errors.lineQty];
        let next = line.units;
        const maxQty = Math.max(4, line.units + 2);
        while (next === line.units) {
          next = randInt(1, maxQty);
        }
        line.units = next;
        if (!selected.includes('lineTotal') || errors.lineTotal !== errors.lineQty) {
          line.lineTotal = line.unitPrice * line.units;
        }
      }
    }

    if (selected.includes('lineTotal')) {
      errors.lineTotal = pickLineIndex();
      if (errors.lineTotal != null) {
        const line = lines[errors.lineTotal];
        line.lineTotal = tweakValue(line.unitPrice * line.units, 1);
      }
    }

    const sumLines = () => lines.reduce((acc, line) => acc + line.lineTotal, 0);
    let ticketTotal = sumLines();
    if (selected.includes('ticketTotal')) {
      ticketTotal = tweakValue(ticketTotal, 1);
      errors.ticketTotal = true;
    }

    const paid = ticketTotal + randInt(2, 10);
    let change = paid - ticketTotal;
    if (selected.includes('change')) {
      change = tweakValue(change, 0);
      errors.change = true;
    }

    return {
      lines,
      ticketTotal,
      paid,
      change,
      errors
    };
  }

  function renderPurchase(items) {
    purchaseGrid.innerHTML = '';
    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'purchase-item';

      const head = document.createElement('div');
      head.className = 'purchase-head';

      const name = document.createElement('span');
      name.className = 'purchase-name';
      name.textContent = item.name;

      const price = document.createElement('span');
      price.className = 'purchase-price';
      price.textContent = `${item.unitPrice}\u20AC`;

      head.appendChild(name);
      head.appendChild(price);

      const stack = document.createElement('div');
      stack.className = 'purchase-stack';

      const imgMain = document.createElement('img');
      imgMain.className = 'purchase-img purchase-img--front';
      imgMain.alt = item.name;
      imgMain.src = ASSETS_DIR + encodeURIComponent(item.file);
      stack.appendChild(imgMain);

      if (item.qty > 1) {
        stack.classList.add('is-dup');
        const imgBack = document.createElement('img');
        imgBack.className = 'purchase-img purchase-img--back';
        imgBack.alt = item.name;
        imgBack.src = ASSETS_DIR + encodeURIComponent(item.file);
        stack.insertBefore(imgBack, imgMain);

        const count = document.createElement('span');
        count.className = 'purchase-count';
        count.textContent = `x${item.qty}`;
        stack.appendChild(count);
      }

      card.appendChild(head);
      card.appendChild(stack);
      purchaseGrid.appendChild(card);
    });
  }

  function makeFieldButton(text, key, handler) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ticket-field';
    btn.dataset.key = key;
    btn.textContent = text;
    btn.addEventListener('click', handler);
    return btn;
  }

  function renderReceipt(entries, handler, fieldButtons) {
    receiptBody.innerHTML = '';
    entries.forEach((entry) => {
      const line = entry.line;
      const idx = entry.idx;
      const row = document.createElement('div');
      row.className = 'receipt-row';
      row.dataset.line = String(idx);

      const name = makeFieldButton(line.name, `line:${idx}:name`, handler);
      const price = makeFieldButton(`${line.unitPrice}\u20AC`, `line:${idx}:price`, handler);
      const units = makeFieldButton(`x${line.units}`, `line:${idx}:units`, handler);
      const total = makeFieldButton(`${line.lineTotal}\u20AC`, `line:${idx}:total`, handler);

      if (fieldButtons) {
        fieldButtons.set(name.dataset.key, name);
        fieldButtons.set(price.dataset.key, price);
        fieldButtons.set(units.dataset.key, units);
        fieldButtons.set(total.dataset.key, total);
      }

      row.appendChild(name);
      row.appendChild(price);
      row.appendChild(units);
      row.appendChild(total);
      receiptBody.appendChild(row);
    });
  }

  function buildErrorMap(state) {
    const map = new Map();
    if (state.errors.lineName != null) {
      const baseKey = `line:${state.errors.lineName}`;
      map.set(`${baseKey}:name`, true);
      map.set(`${baseKey}:price`, true);
      map.set(`${baseKey}:units`, true);
      map.set(`${baseKey}:total`, true);
    }
    if (state.errors.linePrice != null) {
      map.set(`line:${state.errors.linePrice}:price`, true);
      map.set(`line:${state.errors.linePrice}:total`, true);
    }
    if (state.errors.lineQty != null) {
      map.set(`line:${state.errors.lineQty}:units`, true);
    }
    if (state.errors.lineTotal != null) {
      map.set(`line:${state.errors.lineTotal}:total`, true);
    }
    if (state.errors.ticketTotal) {
      map.set('ticket-total', true);
    }
    if (state.errors.change) {
      map.set('change', true);
    }
    return map;
  }

  function lockButton(btn) {
    btn.dataset.locked = '1';
    btn.disabled = true;
  }

  function openModal(score, mistakes) {
    if (!modalEl) return;
    const stars = Array.from(starsWrap.querySelectorAll('.ticket-star'));
    stars.forEach((star, idx) => {
      star.classList.toggle('is-on', idx < score);
    });
    starsWrap.classList.remove('is-animate');
    void starsWrap.offsetWidth;
    starsWrap.classList.add('is-animate');

    if (resultText) {
      const msg = mistakes === 0
        ? tr('Perfecto. No tuviste fallos.')
        : tr(`Has terminado con ${mistakes} fallo${mistakes === 1 ? '' : 's'}.`);
      resultText.textContent = msg;
    }

    modalEl.removeAttribute('hidden');
    modalEl.classList.add('is-open');
    resultOk && resultOk.focus();
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    modalEl.setAttribute('hidden', '');
  }

  async function init() {
    let files = [];
    try {
      const manifest = Array.isArray(window.TICKET_ASSET_LIST)
        ? window.TICKET_ASSET_LIST.map(sanitizeAssetName).filter(name => name && isAllowedExt(name))
        : [];
      if (manifest.length) {
        files = manifest;
      } else {
        files = await loadImageList();
      }
    } catch (_) {
      files = [];
    }

    if (!files.length) {
      const hint = CAN_FETCH_LISTING
        ? tr('Agrega PNG, JPG, JPEG, WEBP o AVIF para iniciar la actividad.')
        : tr('Abre la pagina con un servidor local o actualiza manifest.js con tus imagenes.');
      purchaseGrid.innerHTML = `<div class="ticket-empty">${tr('No hay imagenes en assets_ticket.')}</div>`;
      receiptBody.innerHTML = `<div class="ticket-empty">${hint}</div>`;
      totalEl.textContent = '--';
      paidEl.textContent = '--';
      changeEl.textContent = '--';
      if (noErrorsBtn) noErrorsBtn.disabled = true;
      return;
    }

    const purchaseItems = buildPurchase(files);
    const state = applyErrors(files, purchaseItems);
    const errorMap = buildErrorMap(state);
    const totalErrors = errorMap.size;
    const fieldButtons = new Map();
    const foundKeys = new Set();
    let foundErrors = 0;
    let mistakes = 0;
    let finished = false;

    function markCorrect(key) {
      if (!errorMap.has(key) || foundKeys.has(key)) return false;
      foundKeys.add(key);
      foundErrors += 1;
      const btn = fieldButtons.get(key);
      if (btn && btn.dataset.locked !== '1') {
        btn.classList.add('is-correct');
        lockButton(btn);
      }
      return true;
    }

    function markWrong(btn) {
      if (!btn || btn.dataset.locked === '1') return;
      btn.classList.add('is-wrong');
      lockButton(btn);
      mistakes += 1;
    }

    function handleFieldClick(e) {
      if (finished) return;
      const btn = e.currentTarget;
      if (!btn || btn.dataset.locked === '1') return;
      const key = btn.dataset.key;
      if (errorMap.has(key)) {
        markCorrect(key);
        const match = key.match(/^line:(\d+):price$/);
        if (match) {
          const totalKey = `line:${match[1]}:total`;
          markCorrect(totalKey);
        }
        const extraMatch = key.match(/^line:(\d+):name$/);
        if (extraMatch && state.errors.lineName === Number(extraMatch[1])) {
          const base = `line:${extraMatch[1]}`;
          markCorrect(`${base}:price`);
          markCorrect(`${base}:units`);
          markCorrect(`${base}:total`);
        }
      } else {
        markWrong(btn);
      }
      if (totalErrors > 0 && foundErrors >= totalErrors) {
        finish();
      }
    }

    function finish() {
      if (finished) return;
      finished = true;
      const score = mistakes === 0 ? 3 : mistakes === 1 ? 2 : mistakes === 2 ? 1 : 0;
      document.querySelectorAll('.ticket-field').forEach((btn) => lockButton(btn));
      if (noErrorsBtn) noErrorsBtn.disabled = true;
      openModal(score, mistakes);
    }

    renderPurchase(purchaseItems);
    const lineEntries = shuffle(state.lines.map((line, idx) => ({ line, idx })));
    renderReceipt(lineEntries, handleFieldClick, fieldButtons);

    if (totalEl) totalEl.textContent = `${state.ticketTotal}\u20AC`;
    if (paidEl) paidEl.textContent = `${state.paid}\u20AC`;
    if (changeEl) changeEl.textContent = `${state.change}\u20AC`;

    if (totalEl) fieldButtons.set('ticket-total', totalEl);
    if (changeEl) fieldButtons.set('change', changeEl);

    totalEl && totalEl.addEventListener('click', handleFieldClick);
    changeEl && changeEl.addEventListener('click', handleFieldClick);

    if (noErrorsBtn) {
      noErrorsBtn.addEventListener('click', () => {
        if (finished) return;
        if (totalErrors > 0) {
          noErrorsBtn.classList.add('is-wrong');
          mistakes += 1;
          showToast(tr('Si hay errores'));
          lockButton(noErrorsBtn);
          return;
        }
        noErrorsBtn.classList.add('is-correct');
        lockButton(noErrorsBtn);
        finish();
      });
    }

    resultOk && resultOk.addEventListener('click', () => {
      closeModal();
      window.location.reload();
    });
  }

  init();
})();
