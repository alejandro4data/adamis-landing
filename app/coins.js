(function () {
  'use strict';

  function updateBadge(node, value) {
    if (!node) return;
    var num = node.querySelector('.coins-badge__num');
    if (num) {
      num.textContent = String(value);
    } else {
      node.textContent = String(value);
    }
  }

  function updateAll() {
    if (!window.UserState || typeof window.UserState.getCoins !== 'function') return;
    var user = window.UserState.getCurrentUser();
    var coins = window.UserState.getCoins(user);
    var nodes = document.querySelectorAll('[data-coins-badge]');
    nodes.forEach(function (node) {
      updateBadge(node, coins);
    });
  }

  window.CoinsUI = {
    updateAll: updateAll
  };

  window.addEventListener('DOMContentLoaded', updateAll);
  window.addEventListener('storage', function (ev) {
    if (ev && ev.key === 'userCoins') updateAll();
  });
})();
