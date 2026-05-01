(function () {
  'use strict';

  var PAGE = document.documentElement.getAttribute('data-page') || '';
  if (PAGE !== 'ranking') return;

  var list = document.querySelector('.ranking-list');
  if (!list) return;

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function getCurrentUser() {
    if (window.UserState && typeof window.UserState.getCurrentUser === 'function') {
      return window.UserState.getCurrentUser();
    }
    try { return localStorage.getItem('adamis_student_uuid') || 'invitado'; } catch (_) {}
    return 'invitado';
  }

  function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
  }

  function displayName(userId, currentUser) {
    var id = String(userId || 'invitado');
    if (id === currentUser) return 'Tu progreso';
    if (id === 'invitado') return 'Invitado';
    if (isUuid(id)) return 'Alumno ' + id.slice(0, 4).toUpperCase();
    return id;
  }

  function getEntries() {
    var currentUser = getCurrentUser();
    var coinsByUser = readJSON('userCoins', {});
    if (!coinsByUser || typeof coinsByUser !== 'object' || Array.isArray(coinsByUser)) {
      coinsByUser = {};
    }
    if (!Object.prototype.hasOwnProperty.call(coinsByUser, currentUser)) {
      coinsByUser[currentUser] = window.UserState && typeof window.UserState.getCoins === 'function'
        ? window.UserState.getCoins(currentUser)
        : 0;
    }

    return Object.keys(coinsByUser).map(function (userId) {
      var coins = Number(coinsByUser[userId]);
      return {
        userId: userId,
        name: displayName(userId, currentUser),
        coins: Number.isFinite(coins) ? coins : 0,
        isCurrent: userId === currentUser
      };
    }).sort(function (a, b) {
      return b.coins - a.coins || a.name.localeCompare(b.name);
    });
  }

  function makeScore(coins) {
    var score = document.createElement('div');
    score.className = 'score score--numeric';

    var icon = document.createElement('img');
    icon.src = '../assets/icons/coin_ranking.webp';
    icon.alt = '';
    icon.className = 'coin';

    var value = document.createElement('span');
    value.textContent = String(coins);

    score.appendChild(icon);
    score.appendChild(value);
    return score;
  }

  function renderItem(entry, place) {
    var item = document.createElement('li');
    item.className = 'ranking-item';
    if (entry.isCurrent) item.classList.add('is-current-user');

    var badge = document.createElement('div');
    badge.className = 'place-badge';
    badge.textContent = String(place);

    var name = document.createElement('div');
    name.className = 'name';
    name.textContent = entry.name;

    item.appendChild(badge);
    item.appendChild(name);
    item.appendChild(makeScore(entry.coins));
    return item;
  }

  function render() {
    var entries = getEntries();
    var current = entries.find(function (entry) { return entry.isCurrent; });
    var visible = entries.slice(0, 5);
    var currentIndex = current ? entries.indexOf(current) : -1;

    if (current && currentIndex >= 5) visible.push(current);

    list.innerHTML = '';
    visible.forEach(function (entry) {
      list.appendChild(renderItem(entry, entries.indexOf(entry) + 1));
    });
  }

  window.addEventListener('storage', function (ev) {
    if (ev && ev.key === 'userCoins') render();
  });
  window.addEventListener('adamis:reward-claimed', render);
  window.addEventListener('DOMContentLoaded', render);
  render();
})();
