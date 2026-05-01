(function () {
  'use strict';

  var KEY_USER = 'currentUser';
  var KEY_COINS = 'userCoins';
  var KEY_PURCHASES = 'tiendaPurchases';
  var KEY_STOCK = 'tiendaStock';
  var DEFAULT_COINS = 0;

  var memory = {
    coins: {},
    purchases: {},
    stock: {}
  };

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore write errors (private mode, quota, etc.)
    }
  }

  function safeNumber(value, fallback) {
    var num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function getCurrentUser() {
    try {
      var raw = localStorage.getItem(KEY_USER);
      if (raw && String(raw).trim()) return String(raw).trim();
    } catch (e) {}
    try {
      var sessionStudent = sessionStorage.getItem('student_uuid');
      if (sessionStudent && String(sessionStudent).trim()) return String(sessionStudent).trim();
    } catch (e) {}
    try {
      var storedStudent = localStorage.getItem('adamis_student_uuid');
      if (storedStudent && String(storedStudent).trim()) return String(storedStudent).trim();
    } catch (e) {}
    return 'invitado';
  }

  function getCoins(user) {
    var userId = user || getCurrentUser();
    var all = readJSON(KEY_COINS, memory.coins);
    if (!all || typeof all !== 'object') all = {};
    if (Object.prototype.hasOwnProperty.call(all, userId)) {
      return safeNumber(all[userId], DEFAULT_COINS);
    }
    return DEFAULT_COINS;
  }

  function setCoins(user, value) {
    var userId = user || getCurrentUser();
    var all = readJSON(KEY_COINS, memory.coins);
    if (!all || typeof all !== 'object') all = {};
    all[userId] = Math.max(0, safeNumber(value, DEFAULT_COINS));
    memory.coins = all;
    writeJSON(KEY_COINS, all);
    return all[userId];
  }

  function addCoins(user, delta) {
    var userId = user || getCurrentUser();
    var current = getCoins(userId);
    return setCoins(userId, current + safeNumber(delta, 0));
  }

  function getPurchaseMap(user) {
    var all = readJSON(KEY_PURCHASES, memory.purchases);
    if (!all || typeof all !== 'object') all = {};
    var userId = user || getCurrentUser();
    if (!all[userId] || typeof all[userId] !== 'object') all[userId] = {};
    return { all: all, map: all[userId], user: userId };
  }

  function getPurchaseCount(user, itemId) {
    var data = getPurchaseMap(user);
    if (!itemId) return 0;
    return safeNumber(data.map[itemId], 0);
  }

  function setPurchaseCount(user, itemId, count) {
    if (!itemId) return 0;
    var data = getPurchaseMap(user);
    data.map[itemId] = Math.max(0, safeNumber(count, 0));
    memory.purchases = data.all;
    writeJSON(KEY_PURCHASES, data.all);
    return data.map[itemId];
  }

  function getStock(itemId) {
    var all = readJSON(KEY_STOCK, memory.stock);
    if (!all || typeof all !== 'object') all = {};
    if (!itemId) return null;
    if (!Object.prototype.hasOwnProperty.call(all, itemId)) return null;
    return safeNumber(all[itemId], null);
  }

  function setStock(itemId, value) {
    if (!itemId) return null;
    var all = readJSON(KEY_STOCK, memory.stock);
    if (!all || typeof all !== 'object') all = {};
    all[itemId] = Math.max(0, safeNumber(value, 0));
    memory.stock = all;
    writeJSON(KEY_STOCK, all);
    return all[itemId];
  }

  window.UserState = {
    getCurrentUser: getCurrentUser,
    getCoins: getCoins,
    setCoins: setCoins,
    addCoins: addCoins,
    getPurchaseCount: getPurchaseCount,
    setPurchaseCount: setPurchaseCount,
    getStock: getStock,
    setStock: setStock
  };
})();
