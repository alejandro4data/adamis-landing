(function () {
  'use strict';

  var PAGE = document.documentElement.getAttribute('data-page') || '';
  if (PAGE !== 'tienda') return;

  var grid = document.getElementById('tienda-grid');
  var notice = document.getElementById('tienda-notice');
  var sortSelect = document.getElementById('tienda-sort');

  if (!grid) return;

  var state = {
    items: [],
    itemsById: {},
    sort: (sortSelect && sortSelect.value) || 'price-desc'
  };

  var noticeTimer = null;
  var tr = function (text) {
    if (window.I18N && typeof window.I18N.tr === 'function') {
      return window.I18N.tr(String(text || ''));
    }
    return String(text || '');
  };

  function showNotice(message, tone) {
    if (!notice) return;
    notice.textContent = message || '';
    if (tone) notice.setAttribute('data-tone', tone);
    notice.classList.add('is-visible');
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(function () {
      notice.classList.remove('is-visible');
    }, 2800);
  }

  function slugify(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'item';
  }

  function safeNumber(value, fallback) {
    var num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function normalizeLength(value) {
    if (value == null) return '';
    if (typeof value === 'number' && Number.isFinite(value)) return value + 'px';
    if (typeof value === 'string') {
      var trimmed = value.trim();
      if (!trimmed) return '';
      var num = Number(trimmed);
      if (Number.isFinite(num)) return num + 'px';
      return trimmed;
    }
    return '';
  }

  function normalizeItems(data) {
    var list = Array.isArray(data) ? data : (data && data.items) || [];
    return list.map(function (raw, idx) {
      var item = raw || {};
      var name = String(item.nombre || item.name || 'Articulo ' + (idx + 1));
      var id = String(item.id || slugify(name) || ('item-' + (idx + 1)));
      var price = safeNumber(item.precio, 0);
      var desc = String(item.descripcion || item['descripci\u00f3n'] || '');
      var img = String(item.imagen || '');
      var stock = safeNumber(item.stock, 0);
      var max = safeNumber(item.max, Infinity);
      var scale = safeNumber(item.escala || item.scale, 1);
      var size = normalizeLength(item.imgSize || item.tam || item.tamano);
      var imgW = normalizeLength(item.imgW || item.ancho || item.anchoImagen || item.width);
      var imgH = normalizeLength(item.imgH || item.alto || item.altoImagen || item.height);
      if (size && !imgW) imgW = size;
      if (size && !imgH) imgH = size;
      scale = Math.max(0.6, Math.min(1.8, scale));
      return {
        id: id,
        nombre: name,
        precio: price,
        descripcion: desc,
        imagen: img,
        stock: Math.max(0, stock),
        max: max,
        escala: scale,
        imgW: imgW,
        imgH: imgH
      };
    });
  }

  function getUser() {
    return window.UserState && window.UserState.getCurrentUser
      ? window.UserState.getCurrentUser()
      : 'invitado';
  }

  function getCoins() {
    return window.UserState && window.UserState.getCoins
      ? window.UserState.getCoins(getUser())
      : 0;
  }

  function getStock(item) {
    if (!window.UserState || !window.UserState.getStock) return item.stock;
    var override = window.UserState.getStock(item.id);
    return Number.isFinite(override) ? override : item.stock;
  }

  function getPurchased(item) {
    if (!window.UserState || !window.UserState.getPurchaseCount) return 0;
    return window.UserState.getPurchaseCount(getUser(), item.id);
  }

  function getMax(item) {
    return Number.isFinite(item.max) ? item.max : Infinity;
  }

  function getAvailability(item) {
    var coins = getCoins();
    var price = item.precio;
    var stock = getStock(item);
    var purchased = getPurchased(item);
    var max = getMax(item);
    var reason = '';

    if (!Number.isFinite(price) || price < 0) {
      reason = 'Precio invalido';
    } else if (stock <= 0) {
      reason = 'Sin stock disponible';
    } else if (purchased >= max) {
      reason = 'Limite por usuario alcanzado';
    } else if (coins < price) {
      reason = 'Te faltan ' + (price - coins) + ' monedas';
    }

    return {
      coins: coins,
      price: price,
      stock: stock,
      purchased: purchased,
      max: max,
      canBuy: !reason,
      reason: reason
    };
  }

  function sortItems(list, mode) {
    var sorted = list.slice();
    if (mode === 'price-asc') {
      sorted.sort(function (a, b) { return a.precio - b.precio; });
    } else if (mode === 'price-desc') {
      sorted.sort(function (a, b) { return b.precio - a.precio; });
    }
    return sorted;
  }

  function createChip(text, extraClass) {
    var chip = document.createElement('div');
    chip.className = 'tienda-chip' + (extraClass ? ' ' + extraClass : '');
    chip.textContent = text;
    return chip;
  }

  function renderItem(item) {
    var availability = getAvailability(item);
    var card = document.createElement('article');
    card.className = 'tienda-card';
    if (Number.isFinite(item.escala) && item.escala !== 1) {
      card.style.setProperty('--img-scale', String(item.escala));
    }
    if (item.imgW) card.style.setProperty('--img-w', item.imgW);
    if (item.imgH) card.style.setProperty('--img-h', item.imgH);

    var media = document.createElement('div');
    media.className = 'tienda-card__media';
    var img = document.createElement('img');
    img.src = item.imagen || '../assets/icons/coin_ranking.webp';
    img.alt = tr(item.nombre);
    media.appendChild(img);

    var body = document.createElement('div');
    body.className = 'tienda-card__body';
    var title = document.createElement('h3');
    title.className = 'tienda-card__title';
    title.textContent = tr(item.nombre);
    var desc = document.createElement('p');
    desc.className = 'tienda-card__desc';
    desc.textContent = tr(item.descripcion || 'Sin descripcion.');
    body.appendChild(title);
    body.appendChild(desc);

    var meta = document.createElement('div');
    meta.className = 'tienda-card__meta';
    var price = document.createElement('div');
    price.className = 'tienda-chip tienda-chip--price';
    var priceIcon = document.createElement('img');
    priceIcon.src = '../assets/icons/coin_ranking.webp';
    priceIcon.alt = '';
    var priceText = document.createElement('span');
    priceText.textContent = String(item.precio);
    price.appendChild(priceIcon);
    price.appendChild(priceText);

    var stockText = createChip(tr('Stock:') + ' ' + availability.stock);
    var maxText = Number.isFinite(availability.max)
      ? (tr('Comprado:') + ' ' + availability.purchased + '/' + availability.max)
      : tr('Sin limite');
    var limitChip = createChip(maxText, 'tienda-chip--limit');

    meta.appendChild(price);
    meta.appendChild(stockText);
    meta.appendChild(limitChip);
    body.appendChild(meta);

    var actions = document.createElement('div');
    actions.className = 'tienda-card__actions';
    var wrap = document.createElement('div');
    wrap.className = 'tienda-buy-wrap';
    if (availability.reason) {
      wrap.setAttribute('data-tooltip', tr(availability.reason));
    }

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn--primary tienda-buy-btn';
    btn.textContent = tr('Comprar');
    btn.dataset.id = item.id;
    if (!availability.canBuy) btn.disabled = true;

    wrap.appendChild(btn);
    actions.appendChild(wrap);

    card.appendChild(media);
    card.appendChild(body);
    card.appendChild(actions);

    return card;
  }

  function render() {
    grid.innerHTML = '';

    if (!state.items.length) {
      var empty = document.createElement('div');
      empty.className = 'empty-state';
      var text = document.createElement('div');
      text.className = 'empty-state__text';
      text.textContent = tr('No hay articulos disponibles.');
      empty.appendChild(text);
      grid.appendChild(empty);
      return;
    }

    var list = sortItems(state.items, state.sort);
    list.forEach(function (item) {
      grid.appendChild(renderItem(item));
    });
  }

  function attemptPurchase(item) {
    var availability = getAvailability(item);
    if (!availability.canBuy) {
      showNotice(tr(availability.reason || 'No se puede comprar ahora.'), 'warn');
      return;
    }

    var user = getUser();
    var newCoins = availability.coins - availability.price;
    if (window.UserState && window.UserState.setCoins) {
      window.UserState.setCoins(user, newCoins);
    }
    if (window.UserState && window.UserState.setStock) {
      window.UserState.setStock(item.id, availability.stock - 1);
    }
    if (window.UserState && window.UserState.setPurchaseCount) {
      window.UserState.setPurchaseCount(user, item.id, availability.purchased + 1);
    }

    if (window.CoinsUI && window.CoinsUI.updateAll) {
      window.CoinsUI.updateAll();
    }

    if (window.AdamisEvents && typeof window.AdamisEvents.track === 'function') {
      window.AdamisEvents.track('shop_purchase', {
        item_id: item.id,
        item_name: item.nombre,
        price: availability.price,
        balance_after: newCoins,
        stock_after: availability.stock - 1,
        purchased_after: availability.purchased + 1
      });
    }

    var msg = tr('Compra realizada: {name}.').replace('{name}', tr(item.nombre));
    showNotice(msg, 'success');
    render();
  }

  grid.addEventListener('click', function (ev) {
    var target = ev.target;
    if (!target) return;
    var btn = target.closest('.tienda-buy-btn');
    if (!btn) return;
    var id = btn.dataset.id;
    if (!id) return;
    var item = state.itemsById[id];
    if (!item) return;
    attemptPurchase(item);
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      state.sort = sortSelect.value;
      render();
    });
  }

  document.addEventListener('i18n:change', function () {
    render();
  });

  function applyData(data) {
    state.items = normalizeItems(data);
    state.itemsById = {};
    state.items.forEach(function (item) {
      state.itemsById[item.id] = item;
    });
    render();
  }

  var inlineData = window.TIENDA_DATA;
  if (inlineData && (Array.isArray(inlineData) || typeof inlineData === 'object')) {
    applyData(inlineData);
  } else {
    fetch('../data/tienda.json', { cache: 'no-store' })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        applyData(data);
      })
      .catch(function () {
        showNotice(tr('No se pudo cargar la tienda.'), 'error');
        grid.innerHTML = '';
        var empty = document.createElement('div');
        empty.className = 'empty-state';
        var text = document.createElement('div');
        text.className = 'empty-state__text';
        text.textContent = tr('No se pudo cargar el listado de articulos.');
        empty.appendChild(text);
        grid.appendChild(empty);
      });
  }
})();
